import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { adminApi } from "../../services/api";
import ErrorBanner from "../../components/ErrorBanner";
import Spinner from "../../components/Spinner";

const roleStyle = {
  admin: "bg-mango-100 text-mango-600",
  rider: "bg-indigo-100 text-indigo-700",
  customer: "bg-market-100 text-market-700",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    adminApi
      .getUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(query.toLowerCase()) ||
      u.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-market-100 text-market-600">
            <Users size={20} />
          </span>
          <h1 className="font-display text-3xl font-semibold">All users</h1>
        </div>
        <div className="relative w-full max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            className="field !pl-9"
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} className="mb-4" />}

      {loading ? (
        <Spinner label="Loading users…" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-market-50 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-market-100">
              {filtered.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-market-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          roleStyle[u.role] || "bg-ink/10 text-ink/70"
                        }`}
                      >
                        {u.username?.[0]?.toUpperCase() || "?"}
                      </span>
                      <span className="font-medium">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`pill ${roleStyle[u.role] || "bg-ink/10 text-ink/70"}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-ink/50">
                    No matching users.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
