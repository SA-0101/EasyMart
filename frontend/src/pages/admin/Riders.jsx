import { useEffect, useState } from "react";
import { Bike } from "lucide-react";
import { adminApi } from "../../services/api";
import ErrorBanner from "../../components/ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { ListSkeleton } from "../../components/Skeletons";

export default function AdminRiders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getRiders()
      .then((data) => setRiders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-indigo-600">
          <Bike size={20} />
        </span>
        <div>
          <h1 className="font-sans text-3xl font-semibold">Riders</h1>
          <p className="text-sm text-ink/60">
            Riders can be assigned to orders from the Orders page.
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mt-4" />}

      {loading ? (
        <div className="mt-6">
          <ListSkeleton count={2} />
        </div>
      ) : riders.length === 0 ? (
        <EmptyState
          icon={Bike}
          title="No riders yet"
          message="Once riders register, they'll show up here."
          className="mt-6"
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {riders.map((r) => (
            <div
              key={r.id}
              className="card card-hover flex items-center gap-4 p-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-100 font-sans text-lg font-semibold text-indigo-700">
                {r.username?.[0]?.toUpperCase() || "R"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{r.username}</p>
                <p className="truncate text-xs text-ink/60">{r.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
