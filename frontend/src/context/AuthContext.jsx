import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi, getAccessToken, setAccessToken } from "../services/api";
import { decodeToken } from "../services/jwt";

const AuthContext = createContext(null);

function userFromToken(token) {
  const claims = decodeToken(token);
  if (!claims) return null;
  return {
    id: claims.id ?? claims.userId ?? claims.sub,
    username: claims.username ?? claims.name,
    email: claims.email,
    role: claims.role,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => userFromToken(getAccessToken()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // On first load: if a token already survived in localStorage, restore the
  // session from it immediately (no network round-trip, no flash of logged
  // -out UI). Only fall back to a silent /api/refresh — using the httpOnly
  // refresh cookie — when there's no local token at all. The user is only
  // signed out if neither of those can restore a session.
  useEffect(() => {
    let cancelled = false;

    const existingToken = getAccessToken();
    if (existingToken) {
      setUser(userFromToken(existingToken));
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await authApi.refresh();
        if (!cancelled) {
          setAccessToken(data.access_token);
          setUser(userFromToken(data.access_token));
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ email, password, role }) => {
    setError("");
    const data = await authApi.login({ email, password, role });
    setAccessToken(data.access_token);
    setUser(userFromToken(data.access_token));
    return userFromToken(data.access_token);
  }, []);

  const register = useCallback(async ({ username, email, password, role }) => {
    setError("");
    return authApi.register({ username, email, password, role });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // even if the network call fails, clear local state
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, setError, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
