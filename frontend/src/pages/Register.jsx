import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import ErrorBanner from "../components/ErrorBanner";

// Admin registration requires an already-authenticated admin per the API
// spec, so public sign-up only offers customer / rider.
const ROLES = ["customer", "rider"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "Registration failed. Try a different email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="flex justify-center">
        <Logo iconClassName="h-12 w-12" />
      </div>
      <h1 className="mt-6 text-center font-display text-3xl font-semibold">Create your account</h1>
      <p className="mt-1 text-center text-sm text-ink/60">
        Sign up as a customer to shop, or as a rider to deliver.
      </p>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-4 p-6">
        <div>
          <label className="label">Account type</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold capitalize transition-all duration-150 ${
                  form.role === r
                    ? "border-market-600 bg-market-600 text-cream shadow-sm shadow-market-600/25"
                    : "border-market-200 text-ink/70 hover:border-market-400 hover:bg-market-50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="username">
            Username
          </label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              id="username"
              required
              className="field !pl-9"
              placeholder="Your name"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              id="email"
              type="email"
              required
              className="field !pl-9"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="field !pl-9"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
        </div>

        {error && <ErrorBanner message={error} />}
        {success && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-market-600">
            <CheckCircle2 size={16} /> Account created! Redirecting to login…
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          <UserPlus size={16} />
          {submitting ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-market-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
