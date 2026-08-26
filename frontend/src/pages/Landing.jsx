import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../services/api";
import { imageUrl, formatPrice } from "../services/format";

export default function Landing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .getAll()
      .then((data) => setProducts(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="border-b border-market-100 bg-market-600">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="pill mb-4 w-fit bg-mango-400 text-ink">Fresh · Fast · Local</span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl">
              Your neighborhood mart, delivered to your door.
            </h1>
            <p className="mt-4 max-w-md text-market-100">
              Chargers, groceries, and everyday essentials — order in a few
              taps and track it from packing to your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/customer/products" className="btn-mango">
                Start shopping
              </Link>
              <Link to="/register" className="btn-secondary !border-cream !text-cream hover:!bg-market-700">
                Create an account
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 grid grid-cols-2 gap-4 [transform:rotate(2deg)]">
              {products.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`card overflow-hidden ${i % 2 === 1 ? "translate-y-6" : ""}`}
                >
                  <img
                    src={imageUrl(p.image)}
                    alt={p.name}
                    className="h-28 w-full object-cover"
                  />
                  <div className="p-2">
                    <p className="truncate text-xs font-semibold">{p.name}</p>
                    <p className="text-xs text-market-600">{formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-ink">Popular right now</h2>
          <Link to="/customer/products" className="text-sm font-semibold text-market-600 hover:underline">
            View all products →
          </Link>
        </div>

        {loading ? (
          <p className="text-ink/60">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="text-ink/60">
            No products to show yet — check back once the mart stocks up.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {products.map((p) => (
              <div key={p.id} className="card overflow-hidden">
                <img src={imageUrl(p.image)} alt={p.name} className="h-24 w-full object-cover" />
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-sm text-market-600">{formatPrice(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-market-100 bg-market-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-semibold">For customers</h3>
            <p className="mt-2 text-sm text-ink/70">
              Browse products, build a cart, and place orders with cash on delivery.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">For riders</h3>
            <p className="mt-2 text-sm text-ink/70">
              See only the orders assigned to you and move each one through
              packed → shipped → out for delivery → delivered.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">For admins</h3>
            <p className="mt-2 text-sm text-ink/70">
              Manage the product catalog, track every order, and assign riders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
