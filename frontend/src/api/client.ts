
import axios, { InternalAxiosRequestConfig } from "axios";

/**
 * ===============================
 * API ROOT RESOLUTION (PRO SAFE)
 * ===============================
 *
 * - In production (Vite build): use SAME DOMAIN
 * - In dev: use localhost backend
 *
 * DO NOT rely on cPanel env for Vite (build-time only)
 */
const API_ROOT: string = (() => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // ONLY use localhost/LAN backend if browser is on localhost/127.0.0.1 or LAN IP
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    if (/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) {
      return `http://${hostname}:5000`;
    }
  }

  // All hosted / production environments hit the production backend
  return import.meta.env.VITE_API_URL || "https://server.rootstunisia.com";
})();

const NORMALIZED_API_ROOT = API_ROOT.replace(/\/+$/, "");

/**
 * ===============================
 * AXIOS INSTANCE
 * ===============================
 */
export const api = axios.create({
  baseURL: `${NORMALIZED_API_ROOT}/api`,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false, // JWT is via Authorization header (NOT cookies)
});

const dispatchAuthEvent = (name: string, detail: any) => {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } catch {
    // ignore
  }
};

const getRequestPath = (value: any): string => {
  const raw = String(value || "");
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      return new URL(raw).pathname || raw;
    } catch {
      return raw;
    }
  }
  return raw;
};

/**
 * ===============================
 * REQUEST INTERCEPTOR
 * - Attach JWT safely
 * ===============================
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    const url = String(config?.url || "");
    const path = getRequestPath(url);
    const isProtected =
      path.includes("/my/") ||
      path.includes("/admin/") ||
      path.includes("/auth/me") ||
      path.includes("/auth/logout");

    if (!token && isProtected) {
      dispatchAuthEvent("auth:missing", { url, path });
      const err: any = new Error("AUTH_MISSING");
      err.code = "AUTH_MISSING";
      err.isAuthError = true;
      throw err;
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Prevent caching
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * ===============================
 * RESPONSE INTERCEPTOR
 * - Handle auth expiration cleanly
 * - Unwrap standard API envelope
 * ===============================
 */
api.interceptors.response.use(
  (response) => {
    // Unwrap API Envelope { statusCode, data, meta } -> data
    if (response.data && response.data.data && response.data.statusCode && Object.keys(response.data).length <= 5) {
      // It's likely our envelope. Check typical keys.
      const backendEnvelope = response.data;
      response.data = backendEnvelope.data;
      (response as any).meta = backendEnvelope.meta;
    }
    return response;
  },
  async (error: any) => {
    const status = error?.response?.status;
    const code = error?.code;
    const message = error?.message || '';

    // Connection refused - server not running
    if (code === 'ECONNREFUSED' || code === 'ERR_CONNECTION_REFUSED' || message.includes('ERR_CONNECTION_REFUSED')) {
      console.error('❌ Backend server is not running!');
      if (typeof window !== 'undefined') {
        const errorMsg = 'Backend server is not running. Please start it with: cd backend && npm start';
        dispatchAuthEvent('api:connection_error', { message: errorMsg, code });

        error.isConnectionError = true;
        error.userMessage = 'Cannot connect to server. Please make sure the backend is running on port 5000.';
      }
    }

    // Network errors
    if (code === 'ERR_NETWORK' || code === 'ETIMEDOUT' || code === 'ECONNABORTED') {
      console.error('❌ Network error:', message);
      error.isNetworkError = true;
      error.userMessage = 'Network error. Please check your connection and ensure the server is running.';
    }

    // Token invalid / expired — try refresh token
    if (status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken && !error.config?._retry) {
        try {
          const { data } = await axios.post(
            `${NORMALIZED_API_ROOT}/api/auth/refresh`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );
          // Recursively unwrap here? No, axios call returns response.data
          // Recent change means data might be enveloped.
          // BUT this axios call bypasses our interceptor ?? No, it uses 'axios.post' not 'api.post' so it uses default axios?
          // Wait, 'axios.post' creates a NEW instance/call. It does NOT use 'api' instance.
          // So 'data' is the raw body. 
          // If backend now returns envelope, 'data' = { statusCode, data: { token... } }

          let newToken = data?.token;
          let newRefreshToken = data?.refreshToken;

          if (!newToken && data?.data?.token) {
            newToken = data.data.token;
            newRefreshToken = data.data.refreshToken;
          }

          if (newToken) {
            localStorage.setItem("token", newToken);
            if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
            error.config.headers = error.config.headers || {};
            error.config.headers.Authorization = `Bearer ${newToken}`;
            error.config._retry = true;
            return api.request(error.config);
          }
        } catch (e) {
          // Refresh failed
        }
      }
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      dispatchAuthEvent("auth:expired", { status });
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
