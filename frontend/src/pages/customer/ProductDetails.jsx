import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productsApi, cartApi } from "../../services/api";
import { imageUrl, formatPrice } from "../../services/format";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getDetails(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", {
        state: { message: "Please login first to add products to your cart." },
      });
      return;
    }
    setAdding(true);
    setAdded(false);
    try {
      await cartApi.add({
        product_id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        quantity,
      });
      setAdded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-4xl px-4 py-10 text-ink/60 sm:px-6">Loading product…</p>;
  }

  if (error && !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-4">
          Go back
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/customer/products" className="text-sm font-semibold text-market-600 hover:underline">
        ← Back to shop
      </Link>

      <div className="card mt-4 grid gap-8 p-6 md:grid-cols-2">
        <img
          src={imageUrl(product.image)}
          alt={product.name}
          className="h-72 w-full rounded-xl object-cover"
        />
        <div className="flex flex-col">
          <h1 className="font-display text-2xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-ink/70">{product.description}</p>
          <p className="mt-4 text-2xl font-semibold text-market-600">
            {formatPrice(product.price)}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <label className="label mb-0" htmlFor="qty">
              Qty
            </label>
            <div className="flex items-center rounded-full border border-market-200">
              <button
                type="button"
                className="px-3 py-1.5 text-lg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                className="px-3 py-1.5 text-lg"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
          {added && (
            <p className="mt-3 text-sm font-medium text-market-600">Added to your cart.</p>
          )}

          <button onClick={handleAddToCart} disabled={adding} className="btn-primary mt-6 w-fit">
            {adding ? "Adding…" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
