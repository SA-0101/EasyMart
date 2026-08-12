import { useState } from "react";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminRegister() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("accessToken");

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
      const res = await fetch("http://localhost:3000/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // This route should be protected server-side so only an existing
          // admin's token can create another admin account.
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          role: "admin", // fixed — not user-selectable, unlike the customer/staff register page
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create admin");

      setSuccess(true);
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6 flex flex-col items-center gap-2 text-emerald-800">
        <UserPlus size={30} />
        <h1 className="text-xl font-bold text-stone-900">Add Admin</h1>
        <p className="text-center text-sm text-stone-500">
          Create a new admin account for ElevenMART
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          Admin account created successfully.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6"
      >
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
            autoComplete="off"
            value={form.username}
            onChange={handleChange}
            placeholder="admin_username"
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
            autoComplete="off"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
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

        {/* Role is intentionally fixed and not exposed as an input */}
        <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500">
          Role: <span className="font-semibold text-stone-700">Admin</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating admin..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
}
