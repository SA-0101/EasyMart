import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import ErrorBanner from "../components/ErrorBanner";

const ROLES = ["customer", "rider", "admin"];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname;
  const infoMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form);
      const fallback =
        user.role === "admin"
          ? "/admin/products"
          : user.role === "rider"
            ? "/rider/orders"
            : "/customer/products";
      navigate(from || fallback, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="flex justify-center">
        <Logo iconClassName="h-12 w-12" />
      </div>
      <h1 className="mt-6 text-center font-sans text-3xl font-semibold">
        Welcome back
      </h1>
      <p className="mt-1 text-center text-sm text-ink/60">
        Log in to continue to Easy Mart.
      </p>

      {infoMessage && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-mango-100 px-4 py-3 text-sm font-medium text-mango-600">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card mt-8 flex flex-col gap-4 p-6"
      >
        <div>
          <label className="label">I am a</label>
          <div className="grid grid-cols-3 gap-2">
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
          <label className="label" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              id="email"
              type="email"
              required
              className="field !pl-9"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              id="password"
              type="password"
              required
              className="field !pl-9"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-2"
        >
          <LogIn size={16} />
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        New to Easy Mart?{" "}
        <Link
          to="/register"
          className="font-semibold text-market-600 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
