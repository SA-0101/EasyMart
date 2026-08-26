# Easy Mart — Frontend

React + Vite + Tailwind frontend for the Easy Mart Express/Multer backend
described in `Easy_Mart_Frontend_API_Specification.md`.

## Setup

```bash
npm install
npm run dev
```

The app expects the backend to be running at `http://localhost:3000`
(see `src/services/api.js` — change `BASE_URL` there if it differs).

## What's inside

- **`src/services/api.js`** — the single place every fetch call goes through:
  base URL, `Authorization: Bearer` header, `credentials: "include"` for the
  refresh-token cookie, and a one-time silent refresh + retry when a
  request comes back `401`.
- **`src/services/jwt.js`** — the login/refresh endpoints only return an
  `access_token` string, no user object. Since the token is a JWT, we decode
  its payload client-side (no signature check — the backend is still the
  real authority) just to read `role`/`username` for UI routing.
- **`src/context/AuthContext.jsx`** — holds the current user, tries a silent
  refresh on load (so a returning visitor with a valid refresh cookie skips
  the login screen), and exposes `login`/`register`/`logout`.
- **`src/components/ProtectedRoute.jsx`** — gates a route behind
  "logged in" and, optionally, a specific role. This is UI-only routing;
  the backend still enforces real authorization.
- **Pages** are grouped by area: `pages/customer`, `pages/admin`,
  `pages/rider`, matching the three roles in the spec.

## Routes

| Path | Access | Notes |
|---|---|---|
| `/` | public | landing page, product teaser |
| `/login`, `/register` | public | register only offers customer/rider (admin creation requires an existing admin per the spec) |
| `/customer/products`, `/customer/products/:id` | public | browsing is public; adding to cart requires login |
| `/customer/cart`, `/customer/checkout`, `/customer/orders` | customer | |
| `/admin/products`, `/admin/orders`, `/admin/users`, `/admin/riders` | admin | |
| `/rider/orders` | rider | shows only orders assigned to the logged-in rider, with a "mark as next status" action |

## Change log (frontend change request)

- **Add to cart requires login.** `ProductList` / `ProductDetails` check
  `useAuth()` before calling the cart API; if there's no user, they redirect
  to `/login` with a message shown on the login screen instead of calling
  the API.
- **Duplicate cart products are combined in the UI.** `src/services/cart.js`
  groups raw cart rows by `product_id` and sums quantities, so the same
  product only ever renders one card, with `itemTotal = price × quantity`
  and a `grandTotal` computed from the grouped items. Removing a combined
  card deletes every underlying row for that product.
- **Order totals are always computed, never stored/hard-coded.**
  `src/services/orders.js` exports `orderItemsTotal(order)`, which sums
  `item.price × item.quantity` across an order's items. Both the customer's
  "My Orders" and the admin "All orders" pages use this instead of trusting
  a `total_amount` field.
- **Customer "My Orders"** now shows customer name, order ID, contact,
  address, payment method, status, itemized items, and the computed total.
- **Admin "All orders"** now shows the computed total at the bottom of each
  card (previously missing).
- **Checkout payment method** is a required `<select>` limited to `Cash`,
  `JazzCash`, `Easypaisa` — no more free-text/COD default.
- **Order status workflow is now role-restricted in the UI:**
  - Admin's status dropdown only offers `pending`, `confirmed`, `cancel`,
    `packed`. Once a rider has moved the order to `shipped` /
    `out for delivery` / `delivered`, or it's `cancel`led, the admin's
    dropdown is replaced with a locked label so it can't be edited from
    there.
  - Rider's "mark as next status" button still only steps through
    `packed → shipped → out for delivery → delivered` in order; a
    cancelled order shows "Cancelled — no further action" instead of an
    action button, so it can't continue through delivery.
  - **Rider assignment** on the admin orders page is disabled until an
    order is out of `pending` (i.e. confirmed or later) and re-disabled
    once `cancel`led, matching "delivery processing only starts after
    confirmation."

## Notes / assumptions made

- **Delivery charge** is hard-coded to `200` at checkout (matching the
  sample payload in the spec) since the spec doesn't say where this number
  comes from. Change `DELIVERY_CHARGES` in `src/pages/customer/Checkout.jsx`
  if your backend computes it differently.
- **Product images**: the API returns relative paths like
  `uploads/product.jpg`; `src/services/format.js` prefixes these with the
  backend base URL to render `<img>` tags.
- Creating/updating products uses `FormData` (no manual `Content-Type`,
  per the spec, since the backend uses Multer).
