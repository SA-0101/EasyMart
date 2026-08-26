import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="font-display text-6xl font-semibold text-market-600">404</span>
      <p className="mt-3 text-ink/70">This page isn't on the shelf.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to Easy Mart
      </Link>
    </div>
  );
}
