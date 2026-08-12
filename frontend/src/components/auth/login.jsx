import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // needed if backend sets refresh_token as httpOnly cookie
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      console.log("Login successful:", data);

      localStorage.setItem("accessToken", data.access_token);
      const savedToken = localStorage.getItem("accessToken");
      console.log("Saved access token:", savedToken);

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-emerald-800">
          <ShoppingBasket size={30} />
          <h1 className="text-xl font-bold text-stone-900">Welcome back</h1>
          <p className="text-center text-sm text-stone-500">
            Log in to your SuperMart account
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-md border border-stone-300 px-3 py-2 pr-10 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="rider">Rider</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
