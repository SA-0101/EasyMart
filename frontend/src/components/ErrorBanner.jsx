import { AlertCircle } from "lucide-react";

export default function ErrorBanner({ message, className = "" }) {
  if (!message) return null;
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ${className}`}
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
