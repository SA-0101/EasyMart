import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Wallet,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { cartApi, ordersApi } from "../../services/api";
import { formatPrice } from "../../services/format";
import { groupCartItems, cartGrandTotal } from "../../services/cart";
import { DELIVERY_CHARGES } from "../../services/constants";
import ErrorBanner from "../../components/ErrorBanner";
import EmptyState from "../../components/EmptyState";
import Spinner from "../../components/Spinner";

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
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Spinner label="Loading checkout…" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          message="Your cart is empty — add a few products first."
          action={
            <button
              onClick={() => navigate("/customer/products")}
              className="btn-primary mt-1"
            >
              Browse products
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-sans text-3xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-ink/60">
        Delivery details for this order. Order items are pulled from your
        current cart.
      </p>

      <form
        onSubmit={handleSubmit}
        className="card mt-8 flex flex-col gap-4 p-6"
      >
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <div className="relative">
            <User
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              id="name"
              required
              className="field !pl-9"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="contact">
            Contact number
          </label>
          <div className="relative">
            <Phone
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              id="contact"
              required
              className="field !pl-9"
              placeholder="03XXXXXXXXX"
              value={form.contact}
              onChange={(e) =>
                setForm((f) => ({ ...f, contact: e.target.value }))
              }
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="address">
            Delivery address
          </label>
          <div className="relative">
            <MapPin
              size={16}
              className="pointer-events-none absolute left-3.5 top-3.5 text-ink/40"
            />
            <textarea
              id="address"
              required
              rows={3}
              className="field !pl-9"
              placeholder="House, street, tehsil, district"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="payment_method">
            Payment method
          </label>
          <div className="relative">
            <Wallet
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <select
              id="payment_method"
              required
              className="field !pl-9"
              value={form.payment_method}
              onChange={(e) =>
                setForm((f) => ({ ...f, payment_method: e.target.value }))
              }
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-2 rounded-xl border border-market-100 bg-market-50 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Delivery Charges</span>
            <span>{formatPrice(DELIVERY_CHARGES)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-market-200 pt-1 font-semibold text-market-700">
            <span>Total Amount</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-2"
        >
          {submitting ? "Placing order…" : "Place order"}{" "}
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
