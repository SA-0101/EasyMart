import { cartApi } from "./api";

// Groups raw cart rows (as returned by GET /api/cart/products) by
// product_id, combining quantities so duplicate rows for the same product
// collapse into a single line everywhere the cart is displayed.
export function groupCartItems(items) {
  const map = new Map();
  for (const item of items) {
    const key = item.product_id ?? item.id;
    const existing = map.get(key);
    if (existing) {
      existing.quantity += Number(item.quantity);
      existing.ids.push(item.id);
    } else {
      map.set(key, {
        key,
        name: item.name,
        description: item.description,
        image: item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
        ids: [item.id],
      });
    }
  }
  return Array.from(map.values());
}

// itemTotal = price × quantity, grandTotal = sum of every item's itemTotal.
export function cartGrandTotal(groupedItems) {
  return groupedItems.reduce((sum, g) => sum + g.price * g.quantity, 0);
}

// The backend only exposes "add a row" / "delete a row" / "clear cart" —
// there's no dedicated "set quantity" endpoint, and every add call creates
// a new row rather than incrementing an existing one. To make the same
// product actually behave as a single line (not just look like one), we
// simulate an update by deleting whatever row(s) already exist for that
// product and re-adding a single row with the combined quantity. This is
// self-healing: even if duplicate rows already exist from before, the next
// add or quantity change on that product collapses them into one.
export async function addToCartMerged(product, quantityToAdd = 1) {
  // Reading the cart first is only meant to find existing rows to merge —
  // it must never block the add itself. Some backends respond with an
  // error (rather than an empty array) when the cart is empty, so any
  // failure here is treated as "no existing rows" instead of aborting.
  let cart = [];
  try {
    const data = await cartApi.view();
    cart = Array.isArray(data) ? data : [];
  } catch {
    cart = [];
  }

  const existing = cart.filter(
    (item) => Number(item.product_id) === Number(product.id),
  );
  const existingQty = existing.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  if (existing.length) {
    try {
      await Promise.all(existing.map((item) => cartApi.remove(item.id)));
    } catch {
      // If cleanup of old rows fails, still proceed to add the new one
      // rather than blocking the whole action — worst case a duplicate
      // row remains, which the display-side grouping already handles.
    }
  }

  await cartApi.add({
    product_id: Number(product.id),
    name: product.name,
    description: product.description,
    image: product.image,
    price: Number(product.price),
    quantity: existingQty + quantityToAdd,
  });
}

// Sets a cart group to an exact quantity (used by the +/- steppers on the
// Cart page). Same delete-then-recreate approach; a quantity of 0 or less
// just removes the product from the cart.
export async function setCartGroupQuantity(group, quantity) {
  await Promise.all(group.ids.map((id) => cartApi.remove(id)));
  if (quantity > 0) {
    await cartApi.add({
      product_id: Number(group.key),
      name: group.name,
      description: group.description,
      image: group.image,
      price: Number(group.price),
      quantity,
    });
  }
}
