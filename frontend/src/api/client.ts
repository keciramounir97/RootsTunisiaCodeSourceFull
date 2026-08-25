import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * ===============================
 * API ROOT RESOLUTION (PRO SAFE)
 * ===============================
 *
 * - In dev: localhost backend
 * - In production: VITE_API_URL (supports with or without /api suffix)
 */
const API_ROOT: string = (() => {
  // 1. Development mode: intelligently determine backend URL
  if (import.meta.env.DEV) {
    // If accessing via IP (e.g. 192.168.x.x), try to hit backend on same IP
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return `http://${window.location.hostname}:5000`;
    }
    return "http://localhost:5000";
  }

  // 2. Production: explicit URL or default to https://server.rootstunisia.com
  return import.meta.env.VITE_API_URL || "https://server.rootstunisia.com";
})();

const NORMALIZED_API_ROOT = API_ROOT.replace(/\/+$/, "").replace(/\/api$/i, "");

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
  return raw.startsWith("/") ? raw : `/${raw}`;
};

const isAuthRequest = (config?: InternalAxiosRequestConfig): boolean => {
  const path = getRequestPath(config?.url);
  return (
    path.startsWith("/api/auth/login") ||
    path.startsWith("/auth/login") ||
    path.startsWith("/api/auth/signup") ||
    path.startsWith("/auth/signup") ||
    path.startsWith("/api/auth/refresh") ||
    path.startsWith("/auth/refresh")
  );
};

const isPublicGetRequest = (config?: InternalAxiosRequestConfig): boolean => {
  const method = String(config?.method || "get").toLowerCase();
  if (method !== "get") return false;

  const path = getRequestPath(config?.url);
  const publicPrefixes = [
    "/api/site-settings",
    "/site-settings",
    "/api/gallery",
    "/gallery",
    "/api/books",
    "/books",
    "/api/audios",
    "/audios",
    "/api/documents",
    "/documents",
    "/api/articles",
    "/articles",
    "/api/periods",
    "/periods",
    "/api/tier-features",
    "/tier-features",
    "/api/legal-content",
    "/legal-content",
    "/api/settings",
    "/settings",
    "/api/help",
    "/help",
    "/api/health",
    "/health",
  ];

  return publicPrefixes.some((prefix) => path.startsWith(prefix));
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isAuthRequest(originalRequest as InternalAxiosRequestConfig)) {
        return Promise.reject(error);
      }

      if (isPublicGetRequest(originalRequest as InternalAxiosRequestConfig)) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        isRefreshing = false;
        processQueue(new Error("No refresh token available"), null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        dispatchAuthEvent("roots:auth-session-expired", {
          status: 401,
          message: "No refresh token available",
        });
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${NORMALIZED_API_ROOT}/api/auth/refresh`,
          { refreshToken }
        );

        const { access_token, token: newToken } = response.data;
        const finalToken = access_token || newToken;

        if (finalToken) {
          localStorage.setItem("token", finalToken);
          api.defaults.headers.common.Authorization = `Bearer ${finalToken}`;
          processQueue(null, finalToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${finalToken}`;
          }
          return api(originalRequest);
        } else {
          throw new Error("No token returned from refresh endpoint");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        dispatchAuthEvent("roots:auth-session-expired", {
          status: 401,
          message: "Refresh token failed or expired",
        });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.response && error.request) {
      console.warn("❌ Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
