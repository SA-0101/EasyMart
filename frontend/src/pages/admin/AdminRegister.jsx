import { useState } from "react";
import { authApi } from "../../services/api";

export default function AdminRegister() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await authApi.registerAdmin({ ...form, role: "admin" });
      setSuccess(`Admin account "${form.username}" was created successfully.`);
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      setError(err.message || "Could not create admin account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Register a new admin</h1>
      <p className="mt-1 text-sm text-ink/60">
        Only an existing admin can create another admin account.
      </p>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-4 p-6">
        <div>
          <label className="label" htmlFor="a-username">
            Username
          </label>
          <input
            id="a-username"
            required
            className="field"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="a-email">
            Email
          </label>
          <input
            id="a-email"
            type="email"
            required
            className="field"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="a-password">
            Password
          </label>
          <input
            id="a-password"
            type="password"
            required
            minLength={6}
            className="field"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Role</label>
          <div className="rounded-xl border border-market-200 bg-market-50 px-4 py-2.5 text-sm">
            admin
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        {success && <p className="text-sm font-medium text-market-600">{success}</p>}

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? "Creating admin…" : "Create admin account"}
        </button>
      </form>
    </div>
  );
}
