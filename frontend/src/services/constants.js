// Single source of truth for the flat delivery charge used at checkout and
// wherever a cart/order total needs to be broken down into subtotal +
// delivery + total. Change this in one place if the backend ever computes
// it differently.
export const DELIVERY_CHARGES = 200;
