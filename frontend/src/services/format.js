const BASE_URL = "http://localhost:3000";

const PLACEHOLDER = "https://placehold.co/400x400/EEF5EE/2E6E3B?text=Easy+Mart";

// Product `image` values can come back in two shapes:
//   1. A full external URL (http/https) — used as-is, never re-encoded,
//      since it may already contain its own percent-encoded query string.
//   2. A local Multer upload path (e.g. "uploads/1787815293933-file.png")
//      — prepend the backend BASE_URL. These paths can contain characters
//      (spaces, etc.) that aren't valid in a URL as typed, so encodeURI
//      escapes them (e.g. " " -> "%20") while leaving "/" intact; Express's
//      static file server decodes them back to the real filename on disk.
export function imageUrl(path) {
  if (!path) return PLACEHOLDER;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleaned = path.replace(/^\/+/, "");
  return `${BASE_URL}/${encodeURI(cleaned)}`;
}

export function formatPrice(value) {
  const n = Number(value) || 0;
  return `Rs. ${n.toLocaleString("en-PK")}`;
}
