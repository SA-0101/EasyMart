// total = sum of (item.price × item.quantity) across every item on the
// order. Used anywhere an order total needs to be shown, instead of trusting
// a stored total_amount field.
import { DELIVERY_CHARGES } from "./constants";

export function orderItemsTotal(order) {
  if (!order || !Array.isArray(order.items)) return 0;
  return order.items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
}

// Full breakdown for an order: subtotal (price × quantity summed),
// delivery charges (from the order if the backend echoed it back,
// otherwise the standard flat charge), and total amount = subtotal +
// delivery charges. Nothing here is hard-coded to a specific order.
export function orderBreakdown(order) {
  const subtotal = orderItemsTotal(order);
  const deliveryCharges =
    order?.delivery_charges !== undefined && order?.delivery_charges !== null
      ? Number(order.delivery_charges)
      : DELIVERY_CHARGES;
  return {
    subtotal,
    deliveryCharges,
    total: subtotal + deliveryCharges,
  };
}
