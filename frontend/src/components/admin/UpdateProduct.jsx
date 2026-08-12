import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // pulled automatically from the route "/admin/products/update/:id"

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
  });
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  // Guard: if this page is opened without an :id in the URL, don't attempt any fetch at all
  useEffect(() => {
    if (!id) {
      setError(
        "No product selected to update. Go back and pick a product from the list.",
      );
      setFetching(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setFetching(true);
        const res = await fetch(`http://localhost:3000/products/${id}`);
        if (!res.ok)
          throw new Error(`Request failed with status ${res.status}`);
        const data = await res.json();
        setForm({
          name: data.name || "",
          description: data.description || "",
          image: data.image || "",
          price: data.price ?? "",
        });
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!id) {
      setError("No product selected to update.");
      return;
    }

    // Build a partial payload — only include fields the user actually filled in.
    // This matches a real PATCH: untouched fields are left alone on the backend,
    // instead of forcing name/price to always be required on the frontend.
    const payload = {};
    if (form.name.trim() !== "") payload.name = form.name;
    if (form.description.trim() !== "") payload.description = form.description;
    if (form.image.trim() !== "") payload.image = form.image;
    if (form.price !== "" && form.price !== null)
      payload.price = Number(form.price);

    if (Object.keys(payload).length === 0) {
      setError("Change at least one field before saving.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");

      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <button
        onClick={() => navigate("/admin/products")}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-700"
      >
        <ArrowLeft size={16} />
        Back to products
      </button>

      <h1 className="mb-1 text-xl font-bold text-stone-900 sm:text-2xl">
        Update Product
      </h1>
      <p className="mb-6 text-sm text-stone-500">
        Edit only the fields you want to change — the rest stay as they are.
      </p>

      {fetching && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-stone-500">
          <Loader2 size={20} className="animate-spin" />
          Loading product...
        </div>
      )}

      {!fetching && !id && (
        <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertTriangle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {!fetching && id && (
        <>
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="w-full resize-none rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Image URL
              </label>
              <input
                id="image"
                name="image"
                type="text"
                value={form.image}
                onChange={handleChange}
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
