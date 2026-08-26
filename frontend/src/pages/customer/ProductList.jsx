import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi, cartApi } from "../../services/api";
import { imageUrl, formatPrice } from "../../services/format";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState("");

  const loadAll = () => {
    setLoading(true);
    productsApi
      .getAll()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!query.trim()) {
        const data = await productsApi.getAll();
        setProducts(data);
      } else {
        const data = await productsApi.filter(query.trim());
        setProducts(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (p) => {
    setAddingId(p.id);
    try {
      await cartApi.add({
        product_id: p.id,
        name: p.name,
        description: p.description,
        image: p.image,
        price: p.price,
        quantity: 1,
      });
      setToast(`${p.name} added to cart`);
      setTimeout(() => setToast(""), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl font-semibold">Shop the mart</h1>
        <form onSubmit={handleSearch} className="flex w-full max-w-sm gap-2">
          <input
            className="field"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0">
            Search
          </button>
        </form>
      </div>

      {toast && (
        <div className="mb-4 rounded-xl bg-market-100 px-4 py-2 text-sm font-medium text-market-700">
          {toast}
        </div>
      )}
      {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}

      {loading ? (
        <p className="text-ink/60">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-ink/60">No products found. Try a different search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="card flex flex-col overflow-hidden">
              <Link to={`/customer/products/${p.id}`}>
                <img
                  src={imageUrl(p.image)}
                  alt={p.name}
                  className="h-36 w-full object-cover sm:h-40"
                />
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <Link to={`/customer/products/${p.id}`} className="font-semibold hover:underline">
                  {p.name}
                </Link>
                <p className="mt-1 line-clamp-2 flex-1 text-xs text-ink/60">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-market-600">{formatPrice(p.price)}</span>
                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={addingId === p.id}
                    className="btn-mango !px-3 !py-1.5 text-xs"
                  >
                    {addingId === p.id ? "Adding…" : "Add"}
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
