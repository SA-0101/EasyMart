export default function EmptyState({ icon: Icon, title, message, action, className = "" }) {
  return (
    <div className={`card flex flex-col items-center gap-3 p-10 text-center ${className}`}>
      {Icon && (
        <span className="grid h-14 w-14 place-items-center rounded-full bg-market-50 text-market-500">
          <Icon size={26} strokeWidth={1.75} />
        </span>
      )}
      {title && <p className="font-display text-lg font-semibold text-ink">{title}</p>}
      {message && <p className="max-w-sm text-sm text-ink/60">{message}</p>}
      {action}
    </div>
  );
}
