import { useEffect, useState } from "react";
import {
  Bike,
  Phone,
  MapPin,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { riderApi } from "../../services/api";
import { formatPrice } from "../../services/format";
import StatusPill from "../../components/StatusPill";
import ErrorBanner from "../../components/ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { ListSkeleton } from "../../components/Skeletons";

// Allowed rider statuses, in the order a delivery actually progresses.
const RIDER_STATUSES = ["packed", "shipped", "out for delivery", "delivered"];

function nextStatus(current) {
  const idx = RIDER_STATUSES.indexOf(current);
  if (idx === -1 || idx === RIDER_STATUSES.length - 1) return null;
  return RIDER_STATUSES[idx + 1];
}

export default function RiderOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    riderApi
      .getAssignedOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdvance = async (order) => {
    const next = nextStatus(order.status);
    if (!next) return;
    setBusyId(order.id);
    try {
      await riderApi.updateStatus(order.id, next);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-indigo-600">
          <Bike size={20} />
        </span>
        <div>
          <h1 className="font-sans text-3xl font-semibold">My deliveries</h1>
          <p className="text-sm text-ink/60">
            Orders assigned to you, in progress order.
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mt-4" />}

      {loading ? (
        <div className="mt-6">
          <ListSkeleton />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Bike}
          title="No deliveries yet"
          message="Orders assigned to you by the admin will show up here."
          className="mt-6"
        />
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {orders.map((order) => {
            const next = nextStatus(order.status);
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
                  </div>
                  <StatusPill status={order.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-market-100 pt-3">
                  <div className="flex items-center gap-1.5 text-sm text-ink/70">
                    <span className="font-semibold text-market-600">
                      {formatPrice(order.total_amount)}
                    </span>
                    <span className="flex items-center gap-1 text-ink/50">
                      <Wallet size={13} /> {order.payment_method}
                    </span>
                  </div>
                  {order.status === "cancel" || order.status === "cancelled" ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                      <XCircle size={14} /> Cancelled — no further action
                    </span>
                  ) : order.status === "delivered" ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-market-600">
                      <CheckCircle2 size={14} /> Delivered
                    </span>
                  ) : next ? (
                    <button
                      onClick={() => handleAdvance(order)}
                      disabled={busyId === order.id}
                      className="btn-primary !px-4 !py-1.5 text-xs capitalize"
                    >
                      {busyId === order.id ? "Updating…" : `Mark as ${next}`}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-ink/50">
                      <Clock3 size={13} /> Waiting for admin to prepare order
                    </span>
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
