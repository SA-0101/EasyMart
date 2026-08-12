import { useState } from "react";
import { ShoppingBasket, Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("Registered successfully:", data);
      setSuccess(true);
      setForm({ username: "", email: "", password: "", role: "customer" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-emerald-800">
          <ShoppingBasket size={30} />
          <h1 className="text-xl font-bold text-stone-900">
            Create an account
          </h1>
          <p className="text-center text-sm text-stone-500">
            Join ElevenMart as a customer or staff member
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Account created successfully! You can now log in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              placeholder="john_doe"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

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
                autoComplete="new-password"
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
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["customer", "staff"].map((r) => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                    form.role === r
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-stone-300 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
