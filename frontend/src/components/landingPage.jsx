import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBasket, Loader2, ImageOff, LogOut } from "lucide-react";

export default function SupermartLanding() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  // A logged-in user has an access token saved from login (see LoginPage)
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/products");
        if (!res.ok)
          throw new Error(`Request failed with status ${res.status}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      // No body/headers needed here — the refresh_token is an httpOnly cookie,
      // "credentials: include" is what makes the browser attach it automatically.
      const res = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Logout failed with status ${res.status}`);
      }
    } catch (err) {
      // Even if the server call fails (e.g. network issue), still clear the
      // client-side session so the user isn't stuck "logged in" locally.
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      setLoggingOut(false);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-800 px-4 py-4 sm:px-8 shadow-md">
        <div className="flex items-center gap-2 text-white">
          <ShoppingBasket size={24} />
          <span className="text-xl font-bold tracking-wide">ElevenMart</span>
        </div>

        <div className="flex w-full sm:w-auto gap-3">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border-none bg-red-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {loggingOut ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 sm:flex-none rounded-md border-[1.5px] border-white bg-transparent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex-1 sm:flex-none rounded-md border-none bg-amber-400 px-5 py-2 text-sm font-bold text-stone-900 transition-colors hover:bg-amber-500"
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main content - product cards */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-1 text-xl font-bold text-stone-900 sm:text-2xl">
          Today's Groceries
        </h1>
        <p className="mb-6 text-sm text-stone-500">
          Fresh picks, fetched live from your store.
        </p>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-stone-500">
            <Loader2 size={20} className="animate-spin" />
            Loading products...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-700">
            Couldn't load products: {error}. Make sure your backend is running
            at <code className="font-mono">localhost:3000</code>.
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="py-16 text-center text-sm text-stone-500">
            No products found.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id || product._id || idx}
                product={product}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 px-4 py-5 text-center text-xs text-stone-400 sm:px-8">
        © {new Date().getFullYear()} ElevenMART. All rights reserved.
      </footer>
    </div>
  );
}

function ProductCard({ product }) {
  const { name, description, image, price } = product;
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-28 w-full items-center justify-center overflow-hidden bg-stone-100 sm:h-36">
        {image && !imgFailed ? (
          <img
            src={image}
            alt={name}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageOff size={26} className="text-stone-300" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="mb-1 text-sm font-bold text-stone-900 sm:text-[15px]">
          {name || "Unnamed product"}
        </h3>
        <p className="mb-3 flex-1 overflow-hidden text-xs text-stone-500 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
          {description || "No description available."}
        </p>
        <span className="text-sm font-bold text-emerald-700 sm:text-[15px]">
          {price !== undefined ? `$${Number(price).toFixed(2)}` : "N/A"}
        </span>
      </div>
    </div>
  );
}
