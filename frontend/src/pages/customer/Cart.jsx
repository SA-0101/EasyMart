import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartApi } from "../../services/api";
import { imageUrl, formatPrice } from "../../services/format";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
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

  const handleRemove = async (id) => {
    setBusyId(id);
    try {
      await cartApi.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
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

  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Your cart</h1>
        {items.length > 0 && (
          <button onClick={handleClear} className="text-sm font-semibold text-red-600 hover:underline">
            Clear cart
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}

      {loading ? (
        <p className="text-ink/60">Loading cart…</p>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-ink/60">Your cart is empty.</p>
          <Link to="/customer/products" className="btn-primary mt-4 inline-flex">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="card divide-y divide-market-100">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <img
                  src={imageUrl(item.image)}
                  alt={item.name}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.name}</p>
                  <p className="text-xs text-ink/60">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-market-600">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={busyId === item.id}
                  className="btn-danger !px-3 !py-1.5 text-xs"
                >
                  {busyId === item.id ? "…" : "Remove"}
                </button>
              </div>
            ))}
          </div>

          <div className="card flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-ink/60">Subtotal</p>
              <p className="text-xl font-semibold">{formatPrice(subtotal)}</p>
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
