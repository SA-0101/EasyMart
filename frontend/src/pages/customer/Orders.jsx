import { useEffect, useState } from "react";
import { ClipboardList, Phone, MapPin, Wallet, X } from "lucide-react";
import { ordersApi } from "../../services/api";
import { formatPrice } from "../../services/format";
import { orderBreakdown } from "../../services/orders";
import StatusPill from "../../components/StatusPill";
import ErrorBanner from "../../components/ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { ListSkeleton } from "../../components/Skeletons";

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
      <h1 className="font-sans text-3xl font-semibold">My orders</h1>

      {error && <ErrorBanner message={error} className="mt-4" />}

      {loading ? (
        <div className="mt-6">
          <ListSkeleton />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          message="Once you place an order, you'll be able to track it here."
          action={undefined}
        />
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {orders.map((order) => {
            const { subtotal, deliveryCharges, total } = orderBreakdown(order);
            return (
              <div key={order.id} className="card card-hover p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      Order #{order.id} — {order.name}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
                      <Phone size={12} /> {order.contact}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/60">
                      <MapPin size={12} /> {order.address}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-ink/70">
                      <Wallet size={12} /> {order.payment_method}
                    </p>
                  </div>
                  <StatusPill status={order.status} />
                </div>

                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="mt-4 divide-y divide-market-100 border-t border-market-100">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between py-2 text-sm"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-market-100 pt-3">
                  <div className="space-y-0.5 text-xs text-ink/60">
                    <p>
                      Subtotal:{" "}
                      <span className="text-ink/80">
                        {formatPrice(subtotal)}
                      </span>
                    </p>
                    <p>
                      Delivery Charges:{" "}
                      <span className="text-ink/80">
                        {formatPrice(deliveryCharges)}
                      </span>
                    </p>
                    <p className="font-semibold text-market-600">
                      Total Amount: {formatPrice(total)}
                    </p>
                  </div>
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={busyId === order.id}
                      className="btn-danger !px-4 !py-1.5 text-xs"
                    >
                      <X size={13} />{" "}
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
