import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { cartApi } from "../../services/api";
import { imageUrl, formatPrice } from "../../services/format";
import { groupCartItems, cartGrandTotal, setCartGroupQuantity } from "../../services/cart";
import { DELIVERY_CHARGES } from "../../services/constants";
import ErrorBanner from "../../components/ErrorBanner";
import EmptyState from "../../components/EmptyState";
import Spinner from "../../components/Spinner";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    cartApi
      .view()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const groupedItems = groupCartItems(items);

  const handleQuantityChange = async (group, nextQuantity) => {
    setBusyKey(group.key);
    setError("");
    try {
      await setCartGroupQuantity(group, nextQuantity);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyKey(null);
    }
  };

  const handleRemove = async (group) => {
    setBusyKey(group.key);
    setError("");
    try {
      await setCartGroupQuantity(group, 0);
      setItems((prev) => prev.filter((i) => !group.ids.includes(i.id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyKey(null);
    }
  };

  const handleClear = async () => {
    try {
      await cartApi.clear();
      setItems([]);
    } catch (err) {
      setError(err.message);
    }
  };

  // itemTotal = price × quantity, for each combined product card.
  // subtotal = sum of every item's itemTotal.
  // totalAmount = subtotal + delivery charges. Nothing here is hard-coded.
  const subtotal = cartGrandTotal(groupedItems);
  const deliveryCharges = groupedItems.length ? DELIVERY_CHARGES : 0;
  const totalAmount = subtotal + deliveryCharges;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Your cart</h1>
        {groupedItems.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-sm font-semibold text-red-600 transition-colors hover:text-red-700 hover:underline"
          >
            <Trash2 size={15} /> Clear cart
          </button>
        )}
      </div>

      {error && <ErrorBanner message={error} className="mb-4" />}

      {loading ? (
        <Spinner label="Loading cart…" />
      ) : groupedItems.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Add a few essentials to get started."
          action={
            <Link to="/customer/products" className="btn-primary mt-1">
              Browse products
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="card divide-y divide-market-100">
            {groupedItems.map((group) => {
              const itemTotal = group.price * group.quantity;
              const isBusy = busyKey === group.key;
              return (
                <div key={group.key} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <img
                    src={imageUrl(group.image)}
                    alt={group.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{group.name}</p>
                    <p className="text-xs text-ink/60">{formatPrice(group.price)} each</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center rounded-full border border-market-200 bg-white">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleQuantityChange(group, group.quantity - 1)}
                        className="grid h-8 w-8 place-items-center text-ink/60 transition-colors hover:text-market-700 disabled:opacity-40"
                        aria-label={`Decrease quantity of ${group.name}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">
                        {group.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleQuantityChange(group, group.quantity + 1)}
                        className="grid h-8 w-8 place-items-center text-ink/60 transition-colors hover:text-market-700 disabled:opacity-40"
                        aria-label={`Increase quantity of ${group.name}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="w-24 shrink-0 text-right font-semibold text-market-600">
                      {formatPrice(itemTotal)}
                    </p>

                    <button
                      onClick={() => handleRemove(group)}
                      disabled={isBusy}
                      className="btn-icon"
                      aria-label={`Remove ${group.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card flex flex-col gap-3 p-5">
            <div className="flex justify-between text-sm text-ink/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink/70">
              <span>Delivery Charges</span>
              <span>{formatPrice(deliveryCharges)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-market-100 pt-3">
              <div>
                <p className="text-sm text-ink/60">Total Amount</p>
                <p className="text-xl font-semibold">{formatPrice(totalAmount)}</p>
              </div>
              <button onClick={() => navigate("/customer/checkout")} className="btn-primary">
                Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
