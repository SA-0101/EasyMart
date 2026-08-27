// Centralized API helper for Easy Mart.
// Every network call in the app goes through `request()` so the base URL,
// auth headers, and token-refresh behavior only live in one place.

const BASE_URL = "http://localhost:3000";

const ACCESS_TOKEN_KEY = "access_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

// Prevents multiple simultaneous refresh calls if several requests
// fail with 401 at the same time.
let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/api/refresh`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("refresh_failed");
        const data = await res.json();
        setAccessToken(data.access_token);
        return data.access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Core request function.
 * @param {string} path - e.g. "/api/products"
 * @param {object} options
 * @param {string} options.method
 * @param {object|FormData} options.body
 * @param {boolean} options.auth - attach Authorization header
 * @param {boolean} options.credentials - send cookies (for refresh/login/logout)
 * @param {boolean} options.isFormData - body is FormData, don't JSON-encode / set content-type
 */
export async function request(
  path,
  {
    method = "GET",
    body,
    auth = false,
    credentials = false,
    isFormData = false,
  } = {},
) {
  const doFetch = async () => {
    const headers = {};
    if (!isFormData && body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (auth) {
      const token = getAccessToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const fetchOptions = {
      method,
      headers,
    };
    if (credentials) fetchOptions.credentials = "include";
    if (body !== undefined) {
      fetchOptions.body = isFormData ? body : JSON.stringify(body);
    }

    return fetch(`${BASE_URL}${path}`, fetchOptions);
  };

  let res = await doFetch();

  // If an authenticated request is rejected as unauthorized, try a silent
  // refresh once, then retry the original request.
  if (res.status === 401 && auth) {
    try {
      await refreshAccessToken();
      res = await doFetch();
    } catch {
      setAccessToken(null);
      throw new ApiError("Session expired. Please log in again.", 401);
    }
  }

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  return data;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// ---------- Auth ----------
export const authApi = {
  register: (payload) =>
    request("/api/register", { method: "POST", body: payload }),
  registerAdmin: (payload) =>
    request("/api/admin/register", {
      method: "POST",
      body: payload,
      auth: true,
    }),
  login: (payload) =>
    request("/api/login", { method: "POST", body: payload, credentials: true }),
  refresh: () => request("/api/refresh", { credentials: true }),
  logout: () => request("/api/logout", { credentials: true }),
};

// ---------- Products (public) ----------
export const productsApi = {
  getAll: () => request("/api/products"),
  getDetails: (id) => request(`/api/products/details/${id}`),
  filter: (name) =>
    request(`/api/products/filter?name=${encodeURIComponent(name)}`),
};

// ---------- Customer: Cart ----------
export const cartApi = {
  view: () => request("/api/cart/products", { auth: true }),
  add: (item) =>
    request("/api/cart/products", { method: "POST", body: item, auth: true }),
  remove: (cartItemId) =>
    request(`/api/cart/products/${cartItemId}`, {
      method: "DELETE",
      auth: true,
    }),
  clear: () => request("/api/cart/products", { method: "DELETE", auth: true }),
};

// ---------- Customer: Orders ----------
export const ordersApi = {
  place: (payload) =>
    request("/api/orders", { method: "POST", body: payload, auth: true }),
  getMine: () => request("/api/orders", { auth: true }),
  cancel: (id) => request(`/api/orders/${id}`, { method: "PATCH", auth: true }),
};

// ---------- Admin ----------
export const adminApi = {
  getUsers: () => request("/api/users", { auth: true }),
  createProduct: (formData) =>
    request("/api/admin/products", {
      method: "POST",
      body: formData,
      auth: true,
      isFormData: true,
    }),
  updateProduct: (id, formData) =>
    request(`/api/admin/products/${id}`, {
      method: "PATCH",
      body: formData,
      auth: true,
      isFormData: true,
    }),
  deleteProduct: (id) =>
    request(`/api/admin/products/${id}`, { method: "DELETE", auth: true }),
  getAllOrders: () => request("/api/admin/orders", { auth: true }),
  getOrder: (id) => request(`/api/admin/orders/${id}`, { auth: true }),
  updateOrderStatus: (id, status) =>
    request("/api/admin/orders/status", {
      method: "PATCH",
      body: { id, status },
      auth: true,
    }),
  getRiders: () => request("/api/admin/riders", { auth: true }),
  assignRider: (order_id, rider_id) =>
    request("/api/admin/riders", {
      method: "PATCH",
      body: { order_id, rider_id },
      auth: true,
    }),
};

// ---------- Rider ----------
export const riderApi = {
  getAssignedOrders: () => request("/api/riders/orders", { auth: true }),
  updateStatus: (id, status) =>
    request("/api/riders/status", {
      method: "PATCH",
      body: { id, status },
      auth: true,
    }),
};
