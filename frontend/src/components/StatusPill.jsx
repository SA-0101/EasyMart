const STYLES = {
  pending: "bg-mango-100 text-mango-600",
  confirmed: "bg-amber-100 text-amber-700",
  packed: "bg-sky-100 text-sky-700",
  shipped: "bg-indigo-100 text-indigo-700",
  "out for delivery": "bg-purple-100 text-purple-700",
  delivered: "bg-market-100 text-market-700",
  cancel: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function StatusPill({ status }) {
  const style = STYLES[status] || "bg-ink/10 text-ink/70";
  return <span className={`pill ${style}`}>{status}</span>;
}
