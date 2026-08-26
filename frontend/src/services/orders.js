// total = sum of (item.price × item.quantity) across every item on the
// order. Used anywhere an order total needs to be shown, instead of trusting
// a stored total_amount field.
export function orderItemsTotal(order) {
  if (!order || !Array.isArray(order.items)) return 0;
  return order.items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
}
