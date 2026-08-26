import { useEffect, useState } from "react";
import { ordersApi } from "../../services/api";
import { formatPrice } from "../../services/format";
import { orderItemsTotal } from "../../services/orders";
import StatusPill from "../../components/StatusPill";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    ordersApi
      .getMine()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    setBusyId(id);
    try {
      await ordersApi.cancel(id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">My orders</h1>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-ink/60">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-ink/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {orders.map((order) => {
            const total = orderItemsTotal(order);
            return (
              <div key={order.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      Order #{order.id} — {order.name}
                    </p>
                    <p className="text-xs text-ink/60">{order.contact}</p>
                    <p className="text-xs text-ink/60">{order.address}</p>
                    <p className="mt-1 text-xs font-medium text-ink/70">
                      Payment: {order.payment_method}
                    </p>
                  </div>
                  <StatusPill status={order.status} />
                </div>

                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="mt-4 divide-y divide-market-100 border-t border-market-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-market-100 pt-3">
                  <div>
                    <p className="text-xs text-ink/60">Total</p>
                    <p className="font-semibold text-market-600">{formatPrice(total)}</p>
                  </div>
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={busyId === order.id}
                      className="btn-danger !px-4 !py-1.5 text-xs"
                    >
                      {busyId === order.id ? "Cancelling…" : "Cancel order"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
