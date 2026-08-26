import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import { formatPrice } from "../../services/format";
import { orderBreakdown } from "../../services/orders";
import StatusPill from "../../components/StatusPill";

// Admin may only move an order between these statuses. Once a rider has
// taken it further (shipped / out for delivery / delivered), or it has
// been cancelled, the admin no longer edits it directly here.
const ADMIN_STATUSES = ["pending", "confirmed", "cancel", "packed"];
const RIDER_OWNED_STATUSES = ["shipped", "out for delivery", "delivered"];

// Rider assignment only makes sense once the order has been confirmed —
// not while it's still pending, and not once it's cancelled.
function canAssignRider(status) {
  return status !== "pending" && status !== "cancel";
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getAllOrders(), adminApi.getRiders()])
      .then(([ordersData, ridersData]) => {
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setRiders(Array.isArray(ridersData) ? ridersData : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await adminApi.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleAssignRider = async (orderId, riderId) => {
    if (!riderId) return;
    setBusyId(orderId);
    try {
      await adminApi.assignRider(orderId, Number(riderId));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">All orders</h1>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-ink/60">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-ink/60">No orders yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {orders.map((order) => {
            const { subtotal, deliveryCharges, total } = orderBreakdown(order);
            const isRiderOwned = RIDER_OWNED_STATUSES.includes(order.status);
            const isCancelled = order.status === "cancel" || order.status === "cancelled";
            const adminCanEditStatus = !isRiderOwned && !isCancelled;

            return (
              <div key={order.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      Order #{order.id} — {order.name}
                    </p>
                    <p className="text-xs text-ink/60">{order.contact}</p>
                    <p className="text-xs text-ink/60">{order.address}</p>
                  </div>
                  <StatusPill status={order.status} />
                </div>

                {Array.isArray(order.items) && (
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

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-market-100 pt-3">
                  <div className="space-y-0.5 text-xs text-ink/60">
                    <p>
                      Subtotal: <span className="text-ink/80">{formatPrice(subtotal)}</span>
                    </p>
                    <p>
                      Delivery Charges:{" "}
                      <span className="text-ink/80">{formatPrice(deliveryCharges)}</span>
                    </p>
                    <p className="font-semibold text-market-600">
                      Total Amount: {formatPrice(total)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold uppercase text-ink/50">
                        Status
                      </label>
                      {adminCanEditStatus ? (
                        <select
                          className="field !w-auto !py-1.5 text-sm"
                          value={order.status}
                          disabled={busyId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          {ADMIN_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-ink/50">
                          {isCancelled ? "Cancelled — locked" : "With rider — locked"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold uppercase text-ink/50">
                        Assign rider
                      </label>
                      <select
                        className="field !w-auto !py-1.5 text-sm"
                        defaultValue=""
                        disabled={busyId === order.id || !canAssignRider(order.status)}
                        onChange={(e) => handleAssignRider(order.id, e.target.value)}
                      >
                        <option value="" disabled>
                          {canAssignRider(order.status) ? "Choose rider…" : "Confirm order first"}
                        </option>
                        {riders.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.username}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
