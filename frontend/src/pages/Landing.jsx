import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, ShieldCheck, ShoppingBag, Bike, LayoutDashboard, ArrowRight, PackageSearch } from "lucide-react";
import { productsApi } from "../services/api";
import { imageUrl, formatPrice } from "../services/format";
import { ProductGridSkeleton } from "../components/Skeletons";
import EmptyState from "../components/EmptyState";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-market-700 via-market-600 to-market-500">
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
                <ShoppingBag size={16} /> Start shopping
              </Link>
              <Link
                to="/register"
                className="btn-secondary !border-cream/40 !bg-transparent !text-cream hover:!border-cream hover:!bg-market-700/60"
              >
                Create an account
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-market-100">
              <span className="flex items-center gap-1.5">
                <Truck size={16} className="text-mango-300" /> Same-day delivery
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-mango-300" /> Live order tracking
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-mango-300" /> Cash, JazzCash & Easypaisa
              </span>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 grid grid-cols-2 gap-4 [transform:rotate(2deg)]">
              {products.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`card card-hover overflow-hidden ${i % 2 === 1 ? "translate-y-6" : ""}`}
                >
                  <img src={imageUrl(p.image)} alt={p.name} className="h-28 w-full object-cover" />
                  <div className="p-2">
                    <p className="truncate text-xs font-semibold">{p.name}</p>
                    <p className="text-xs text-market-600">{formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Signature market-awning edge, marking the handoff from the hero
            band into the storefront below. */}
        <div className="awning-edge" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-ink">Popular right now</h2>
          <Link
            to="/customer/products"
            className="flex items-center gap-1 text-sm font-semibold text-market-600 transition-colors hover:text-market-700 hover:underline"
          >
            View all products <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products yet"
            message="Check back once the mart stocks up."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {products.map((p) => (
              <div key={p.id} className="card card-hover group overflow-hidden">
                <div className="overflow-hidden">
                  <img
                    src={imageUrl(p.image)}
                    alt={p.name}
                    className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
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
          <div className="card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-market-100 text-market-600">
              <ShoppingBag size={20} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">For customers</h3>
            <p className="mt-2 text-sm text-ink/70">
              Browse products, build a cart, and place orders with Cash,
              JazzCash, or Easypaisa.
            </p>
          </div>
          <div className="card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-indigo-600">
              <Bike size={20} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">For riders</h3>
            <p className="mt-2 text-sm text-ink/70">
              See only the orders assigned to you and move each one through
              packed → shipped → out for delivery → delivered.
            </p>
          </div>
          <div className="card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-mango-100 text-mango-600">
              <LayoutDashboard size={20} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">For admins</h3>
            <p className="mt-2 text-sm text-ink/70">
              Manage the product catalog, track every order, and assign riders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
