import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";

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
      <h1 className="font-display text-3xl font-semibold">Riders</h1>
      <p className="mt-1 text-sm text-ink/60">
        Riders can be assigned to orders from the Orders page.
      </p>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-ink/60">Loading riders…</p>
      ) : riders.length === 0 ? (
        <p className="mt-6 text-ink/60">No riders have registered yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {riders.map((r) => (
            <div key={r.id} className="card flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-100 font-display text-lg font-semibold text-indigo-700">
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
