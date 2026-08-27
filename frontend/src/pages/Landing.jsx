import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Bike,
  LayoutDashboard,
  ArrowRight,
  PackageSearch,
  Search,
  PackageCheck,
  Home,
} from "lucide-react";
import { productsApi } from "../services/api";
import { imageUrl, formatPrice } from "../services/format";
import { ProductGridSkeleton } from "../components/Skeletons";
import EmptyState from "../components/EmptyState";

const STEPS = [
  {
    icon: Search,
    title: "Browse the mart",
    text: "Search or scroll the catalog — chargers, groceries, everyday essentials.",
  },
  {
    icon: ShoppingBag,
    title: "Add & check out",
    text: "Build your cart and pay with Cash, JazzCash, or Easypaisa.",
  },
  {
    icon: Bike,
    title: "Track your rider",
    text: "Watch it move from packed → shipped → out for delivery.",
  },
  {
    icon: Home,
    title: "Delivered to you",
    text: "Fresh and fast, right to your doorstep.",
  },
];

export default function Landing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await productsApi.getAll();
        setProducts(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-market-700 via-market-600 to-market-500">
        {/* soft decorative glow, purely atmospheric */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mango-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-market-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-24">
          <span className="pill mb-4 w-fit bg-mango-400 text-ink mx-auto">
            Fresh · Fast · Local
          </span>
          <h1 className="font-body text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            Your neighborhood mart, delivered to your door.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-market-100">
            Chargers, groceries, and everyday essentials — order in a few taps
            and track it from packing to your doorstep.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-market-100">
            <span className="flex items-center gap-1.5">
              <Truck size={16} className="text-mango-300" /> Same-day delivery
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} className="text-mango-300" /> Live order tracking
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-mango-300" /> Cash,
              JazzCash & Easypaisa
            </span>
          </div>
        </div>

        {/* Signature market-awning edge, marking the handoff from the hero
            band into the storefront below. */}
        <div className="awning-edge" />
      </section>

      {/* ---------- How it works ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-center !font-sans text-2xl font-semibold text-ink">
          How Easy Mart works
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-ink/60">
          From browsing to your doorstep, in four simple steps.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="card card-hover relative p-6">
              <span className="absolute -top-3 -left-3 grid h-7 w-7 place-items-center rounded-full bg-market-600 text-xs font-bold text-cream">
                {i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-market-100 text-market-600">
                <step.icon size={20} />
              </span>
              <h3 className="mt-4 font-sans text-base font-semibold">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink/60">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Popular products ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-sans font-semibold text-ink">
            Popular right now
          </h2>
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
              <Link
                to={`/customer/products/${p.id}`}
                key={p.id}
                className="card card-hover group overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-market-50">
                  <img
                    src={imageUrl(p.image)}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-sm text-market-600">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Role cards ---------- */}
      <section className="border-t border-market-100 bg-market-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div className="card card-hover p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-market-100 text-market-600">
              <ShoppingBag size={20} />
            </span>
            <h3 className="mt-4 font-sans text-lg font-semibold">
              For customers
            </h3>
            <p className="mt-2 text-sm text-ink/70">
              Browse products, build a cart, and place orders with Cash,
              JazzCash, or Easypaisa.
            </p>
          </div>
          <div className="card card-hover p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-indigo-600">
              <Bike size={20} />
            </span>
            <h3 className="mt-4 font-sans text-lg font-semibold">For riders</h3>
            <p className="mt-2 text-sm text-ink/70">
              See only the orders assigned to you and move each one through
              packed → shipped → out for delivery → delivered.
            </p>
          </div>
          <div className="card card-hover p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-mango-100 text-mango-600">
              <LayoutDashboard size={20} />
            </span>
            <h3 className="mt-4 font-sans text-lg font-semibold">For admins</h3>
            <p className="mt-2 text-sm text-ink/70">
              Manage the product catalog, track every order, and assign riders.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="card relative overflow-hidden bg-gradient-to-r from-market-700 to-market-500 p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-mango-400/20 blur-2xl" />
          <PackageCheck size={32} className="mx-auto text-mango-300" />
          <h2 className="mt-4 font-sans text-2xl font-semibold text-cream sm:text-3xl">
            Ready to shop your neighborhood mart?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-market-100">
            Create a free account and get your first order moving in minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-mango">
              Create an account
            </Link>
            <Link
              to="/customer/products"
              className="btn-secondary !border-cream/40 !bg-transparent !text-cream hover:!border-cream hover:!bg-market-700/60"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
