import { Loader2 } from "lucide-react";

export default function Spinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-10 text-ink/50 ${className}`}>
      <Loader2 size={18} className="animate-spin text-market-500" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
