// The backend only ever returns a raw access_token string (never a user
// object), but the token itself is a JWT carrying the user's id/role/username
// in its payload. We decode it purely client-side (no signature check - the
// backend is the source of truth for authorization) just so the UI knows
// which role's screens to show.
export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
