import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, PackageSearch, Check } from "lucide-react";
import { productsApi } from "../../services/api";
import { addToCartMerged } from "../../services/cart";
import { imageUrl, formatPrice } from "../../services/format";
import { useAuth } from "../../context/AuthContext";
import ErrorBanner from "../../components/ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { ProductGridSkeleton } from "../../components/Skeletons";

export default function ProductList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

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
    if (!user) {
      navigate("/login", {
        state: { message: "Please login first to add products to your cart." },
      });
      return;
    }
    setAddingId(p.id);
    try {
      await addToCartMerged(p, 1);
      setAddedId(p.id);
      setTimeout(() => setAddedId(null), 1500);
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
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              className="field !pl-9"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary shrink-0">
            Search
          </button>
        </form>
      </div>

      {error && <ErrorBanner message={error} className="mb-4" />}

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          message="Try a different search term, or browse the full catalog."
        />
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="card card-hover group flex flex-col overflow-hidden"
            >
              <Link
                to={`/customer/products/${p.id}`}
                className="block overflow-hidden"
              >
                <img
                  src={imageUrl(p.image)}
                  alt={p.name}
                  className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-40"
                />
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <Link
                  to={`/customer/products/${p.id}`}
                  className="font-semibold text-ink transition-colors hover:text-market-700"
                >
                  {p.name}
                </Link>
                <p className="mt-1 line-clamp-2 flex-1 text-xs text-ink/60">
                  {p.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-market-600">
                    {formatPrice(p.price)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={addingId === p.id}
                    className={`!px-3 !py-1.5 text-xs ${addedId === p.id ? "btn-primary" : "btn-mango"}`}
                  >
                    {addedId === p.id ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : addingId === p.id ? (
                      "Adding…"
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Add
                      </>
                    )}
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
