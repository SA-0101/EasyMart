import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-market-100 text-market-600">
        <Compass size={30} />
      </span>
      <span className="mt-4 font-display text-5xl font-semibold text-market-600">404</span>
      <p className="mt-3 text-ink/70">This page isn't on the shelf.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to Easy Mart
      </Link>
    </div>
  );
}
