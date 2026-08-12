import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ImageOff, Pencil, Trash2, PlusCircle } from "lucide-react";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("accessToken");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/products");
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this product? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Delete failed with status ${res.status}`);

      // remove from local state instead of refetching everything
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      alert(err.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
            Products
          </h1>
          <p className="text-sm text-stone-500">
            Manage your store's product catalog.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products/create")}
          className="flex items-center gap-2 rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-stone-500">
          <Loader2 size={20} className="animate-spin" />
          Loading products...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Couldn't load products: {error}. Make sure your backend is running at{" "}
          <code className="font-mono">localhost:3000</code>.
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 py-16 text-center text-sm text-stone-500">
          No products yet.{" "}
          <button
            onClick={() => navigate("/admin/products/create")}
            className="font-semibold text-emerald-700 hover:underline"
          >
            Add your first product
          </button>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          {/* Table view - desktop */}
          <div className="hidden overflow-hidden rounded-lg border border-stone-200 bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((product) => {
                  const id = product.id || product._id;
                  return (
                    <tr key={id}>
                      <td className="px-4 py-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-stone-100">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          ) : (
                            <ImageOff size={16} className="text-stone-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-900">
                        {product.name}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-stone-500">
                        {product.description || "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">
                        {product.price !== undefined
                          ? `$${Number(product.price).toFixed(2)}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/update/${id}`)
                            }
                            className="rounded-md p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-emerald-700"
                            title="Update product"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            disabled={deletingId === id}
                            className="rounded-md p-2 text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="Delete product"
                          >
                            {deletingId === id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Card view - mobile */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {products.map((product) => {
              const id = product.id || product._id;
              return (
                <div
                  key={id}
                  className="flex gap-3 rounded-lg border border-stone-200 bg-white p-3"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-stone-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    ) : (
                      <ImageOff size={18} className="text-stone-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-stone-900">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-stone-500">
                      {product.description || "—"}
                    </p>
                    <p className="mt-1 text-sm font-bold text-emerald-700">
                      {product.price !== undefined
                        ? `$${Number(product.price).toFixed(2)}`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/${id}/edit`)}
                      className="rounded-md p-2 text-stone-500 hover:bg-stone-100 hover:text-emerald-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={deletingId === id}
                      className="rounded-md p-2 text-stone-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      {deletingId === id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
