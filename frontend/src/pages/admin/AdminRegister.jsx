import { useState } from "react";
import { User, Mail, Lock, ShieldCheck, UserPlus, CheckCircle2 } from "lucide-react";
import { authApi } from "../../services/api";
import ErrorBanner from "../../components/ErrorBanner";

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
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-mango-100 text-mango-600">
          <ShieldCheck size={20} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Register a new admin</h1>
          <p className="text-sm text-ink/60">Only an existing admin can create another admin account.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-4 p-6">
        <div>
          <label className="label" htmlFor="a-username">
            Username
          </label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              id="a-username"
              required
              className="field !pl-9"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="a-email">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              id="a-email"
              type="email"
              required
              className="field !pl-9"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="a-password">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              id="a-password"
              type="password"
              required
              minLength={6}
              className="field !pl-9"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="label">Role</label>
          <div className="flex items-center gap-2 rounded-xl border border-market-200 bg-market-50 px-4 py-2.5 text-sm font-medium text-market-700">
            <ShieldCheck size={15} /> admin
          </div>
        </div>

        {error && <ErrorBanner message={error} />}
        {success && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-market-600">
            <CheckCircle2 size={16} /> {success}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          <UserPlus size={16} />
          {submitting ? "Creating admin…" : "Create admin account"}
        </button>
      </form>
    </div>
  );
}
