import { useEffect, useState } from "react";
import { productsApi, adminApi } from "../../services/api";
import { imageUrl, formatPrice } from "../../services/format";

const EMPTY_FORM = { name: "", description: "", price: "", image: null };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    productsApi
      .getAll()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, image: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      if (form.image) fd.append("image", form.image);

      if (editingId) {
        await adminApi.updateProduct(editingId, fd);
      } else {
        await adminApi.createProduct(fd);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message || "Could not save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await adminApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Manage products</h1>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-4 p-6 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="p-name">
            Name
          </label>
          <input
            id="p-name"
            required
            className="field"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="p-price">
            Price (Rs.)
          </label>
          <input
            id="p-price"
            type="number"
            min="0"
            required
            className="field"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="p-desc">
            Description
          </label>
          <textarea
            id="p-desc"
            rows={2}
            className="field"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="p-image">
            Product image {editingId && "(leave empty to keep current image)"}
          </label>
          <input
            id="p-image"
            type="file"
            accept="image/*"
            className="field"
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
          />
        </div>

        {error && <p className="text-sm font-medium text-red-600 md:col-span-2">{error}</p>}

        <div className="flex gap-3 md:col-span-2">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Saving…" : editingId ? "Update product" : "Add product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="mt-8 text-ink/60">Loading products…</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="card flex flex-col overflow-hidden">
              <img src={imageUrl(p.image)} alt={p.name} className="h-32 w-full object-cover" />
              <div className="flex flex-1 flex-col p-3">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-sm text-market-600">{formatPrice(p.price)}</p>
                <div className="mt-auto flex gap-2 pt-3">
                  <button onClick={() => startEdit(p)} className="btn-secondary flex-1 !px-2 !py-1.5 text-xs">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="btn-danger flex-1 !px-2 !py-1.5 text-xs"
                  >
                    {deletingId === p.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
