// Original Easy Mart brand mark: a basket-and-sprout icon (public/easy-mart-icon.svg)
// paired with a two-tone "Easy" / "Mart" wordmark set in Baloo 2 for a warm,
// friendly, grocery-forward personality distinct from the body/display type.
export default function Logo({ className = "", iconClassName = "h-9 w-9", showWordmark = true }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/easy-mart-icon.svg" alt="" aria-hidden="true" className={`${iconClassName} shrink-0`} />
      {showWordmark && (
        <span className="flex items-baseline font-logo text-2xl font-bold leading-none tracking-tight">
          <span className="text-market-700">Easy</span>
          <span className="text-mango-500">Mart</span>
        </span>
      )}
    </span>
  );
}
