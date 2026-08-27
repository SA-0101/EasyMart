import { useEffect, useState } from "react";
import {
  Package,
  ImagePlus,
  PlusCircle,
  Save,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import { productsApi, adminApi } from "../../services/api";
import { imageUrl, formatPrice } from "../../services/format";
import ErrorBanner from "../../components/ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { ProductGridSkeleton } from "../../components/Skeletons";

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
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      image: null,
    });
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
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-market-100 text-market-600">
          <Package size={20} />
        </span>
        <h1 className="font-sans text-3xl font-semibold">Manage products</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card mt-6 grid gap-4 p-6 md:grid-cols-2"
      >
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
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="p-image">
            Product image {editingId && "(leave empty to keep current image)"}
          </label>
          <div className="relative">
            <ImagePlus
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              id="p-image"
              type="file"
              accept="image/*"
              className="field !pl-9 file:mr-3 file:rounded-full file:border-0 file:bg-market-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-market-700"
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))
              }
            />
          </div>
        </div>

        {error && <ErrorBanner message={error} className="md:col-span-2" />}

        <div className="flex gap-3 md:col-span-2">
          <button type="submit" disabled={submitting} className="btn-primary">
            {editingId ? <Save size={16} /> : <PlusCircle size={16} />}
            {submitting
              ? "Saving…"
              : editingId
                ? "Update product"
                : "Add product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              <X size={16} /> Cancel edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="mt-8">
          <ProductGridSkeleton />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          message="Add your first product using the form above."
          className="mt-8"
        />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="card card-hover flex flex-col overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-market-50">
                <img
                  src={imageUrl(p.image)}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-market-700 shadow-sm">
                  {formatPrice(p.price)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="line-clamp-1 font-semibold">{p.name}</p>
                <p className="mt-1 line-clamp-2 flex-1 text-xs text-ink/60">
                  {p.description}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="btn-secondary flex-1 !px-2 !py-1.5 text-xs"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="btn-danger flex-1 !px-2 !py-1.5 text-xs"
                  >
                    <Trash2 size={13} /> {deletingId === p.id ? "…" : "Delete"}
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
