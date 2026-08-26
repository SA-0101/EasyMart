import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, ordersApi } from "../../services/api";
import { formatPrice } from "../../services/format";
import { groupCartItems, cartGrandTotal } from "../../services/cart";
import { DELIVERY_CHARGES } from "../../services/constants";

const PAYMENT_METHODS = ["Cash", "JazzCash", "Easypaisa"];

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    payment_method: PAYMENT_METHODS[0],
  });

  useEffect(() => {
    cartApi
      .view()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const groupedItems = groupCartItems(items);
  const subtotal = cartGrandTotal(groupedItems);
  const total = subtotal + (groupedItems.length ? DELIVERY_CHARGES : 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await ordersApi.place({
        ...form,
        total_amount: total,
        delivery_charges: groupedItems.length ? DELIVERY_CHARGES : 0,
      });
      navigate("/customer/orders");
    } catch (err) {
      setError(err.message || "Could not place order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-2xl px-4 py-10 text-ink/60 sm:px-6">Loading checkout…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="card p-10 text-center">
          <p className="text-ink/60">Your cart is empty, so there's nothing to check out.</p>
          <button onClick={() => navigate("/customer/products")} className="btn-primary mt-4">
            Browse products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-ink/60">
        Delivery details for this order. Order items are pulled from your current cart.
      </p>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-4 p-6">
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            required
            className="field"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="contact">
            Contact number
          </label>
          <input
            id="contact"
            required
            className="field"
            placeholder="03XXXXXXXXX"
            value={form.contact}
            onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="address">
            Delivery address
          </label>
          <textarea
            id="address"
            required
            rows={3}
            className="field"
            placeholder="House, street, tehsil, district"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="payment_method">
            Payment method
          </label>
          <select
            id="payment_method"
            required
            className="field"
            value={form.payment_method}
            onChange={(e) => setForm((f) => ({ ...f, payment_method: e.target.value }))}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 rounded-xl bg-market-50 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Delivery charges</span>
            <span>{formatPrice(DELIVERY_CHARGES)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-market-200 pt-1 font-semibold">
            <span>Total Amount</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
