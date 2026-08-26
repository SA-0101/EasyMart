const BASE_URL = "http://localhost:3000";

// Product images come back as relative paths like "uploads/product.jpg".
export function imageUrl(path) {
  if (!path) return "https://placehold.co/400x400/EEF5EE/2E6E3B?text=Easy+Mart";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
}

export function formatPrice(value) {
  const n = Number(value) || 0;
  return `Rs. ${n.toLocaleString("en-PK")}`;
}
