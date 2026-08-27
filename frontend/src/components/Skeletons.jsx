// Lightweight animated placeholders used while data is loading, so pages
// show the shape of the content instead of a bare "Loading…" line.

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-36 w-full animate-pulse bg-market-100 sm:h-40" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-market-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-market-100" />
        <div className="mt-2 h-7 w-full animate-pulse rounded-full bg-market-100" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListCardSkeleton() {
  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex justify-between">
        <div className="h-4 w-40 animate-pulse rounded bg-market-100" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-market-100" />
      </div>
      <div className="h-3 w-2/3 animate-pulse rounded bg-market-100" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-market-100" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ListCardSkeleton key={i} />
      ))}
    </div>
  );
}
