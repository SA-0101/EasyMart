import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartApi } from "../../services/api";
import { imageUrl, formatPrice } from "../../services/format";
import { groupCartItems, cartGrandTotal } from "../../services/cart";

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

  const handleRemove = async (group) => {
    setBusyKey(group.key);
    try {
      // Remove every underlying cart row for this product so the combined
      // card fully disappears.
      await Promise.all(group.ids.map((id) => cartApi.remove(id)));
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
  // grandTotal = sum of every item's itemTotal. Nothing here is hard-coded.
  const grandTotal = cartGrandTotal(groupedItems);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Your cart</h1>
        {groupedItems.length > 0 && (
          <button onClick={handleClear} className="text-sm font-semibold text-red-600 hover:underline">
            Clear cart
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}

      {loading ? (
        <p className="text-ink/60">Loading cart…</p>
      ) : groupedItems.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-ink/60">Your cart is empty.</p>
          <Link to="/customer/products" className="btn-primary mt-4 inline-flex">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="card divide-y divide-market-100">
            {groupedItems.map((group) => {
              const itemTotal = group.price * group.quantity;
              return (
                <div key={group.key} className="flex items-center gap-4 p-4">
                  <img
                    src={imageUrl(group.image)}
                    alt={group.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{group.name}</p>
                    <p className="text-xs text-ink/60">
                      {formatPrice(group.price)} × {group.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-market-600">{formatPrice(itemTotal)}</p>
                  <button
                    onClick={() => handleRemove(group)}
                    disabled={busyKey === group.key}
                    className="btn-danger !px-3 !py-1.5 text-xs"
                  >
                    {busyKey === group.key ? "…" : "Remove"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="card flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-ink/60">Grand total</p>
              <p className="text-xl font-semibold">{formatPrice(grandTotal)}</p>
            </div>
            <button onClick={() => navigate("/customer/checkout")} className="btn-primary">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
