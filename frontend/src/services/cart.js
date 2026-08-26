// Groups raw cart rows (as returned by GET /api/cart/products) by
// product_id, combining quantities so duplicate adds of the same product
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
