import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api } from "../../api/client";

export interface User {
  id: number;
  name?: string;
  fullName?: string;
  full_name?: string;
  email: string;
  role: number;
  roleName?: string;
  role_name?: string;
  permissions?: string[];
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (fullName: string, param2?: string, param3?: string, param4?: string) => Promise<any>;
  register: (fullName: string, param2?: string, param3?: string, param4?: string) => Promise<any>;
  login: (email: string, password: string) => Promise<User | null>;
  requestReset: (email: string) => Promise<any>;
  verifyReset: (email: string, code: string, newPassword: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeEmail = (value: string | undefined | null) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const normalizeUser = (raw: any): User | null => {
    if (!raw) return null;
    const roleId = raw.roleId ?? raw.role_id ?? raw.role;
    let roleNum = 0;
    if (typeof roleId === "number" && !isNaN(roleId) && roleId > 0) {
      roleNum = roleId;
    } else {
      const s = String(roleId || raw.roleName || raw.role_name || "").toLowerCase().trim();
      if (s.includes("super")) roleNum = 3;
      else if (s.includes("admin")) roleNum = 1;
      else if (s.includes("user") || s.includes("member") || s.includes("client")) roleNum = 2;
      else roleNum = Number(roleId) || 1;
    }

    const privilegesRaw =
      raw.permissions ?? raw.privileges ?? raw.adminPrivileges ?? raw.admin_privileges;
    let permissions: string[] = [];
    if (Array.isArray(privilegesRaw)) {
      permissions = privilegesRaw.map((v) => String(v));
    } else if (typeof privilegesRaw === "string" && privilegesRaw.trim()) {
      try {
        const parsed = JSON.parse(privilegesRaw);
        permissions = Array.isArray(parsed) ? parsed.map((v) => String(v)) : [];
      } catch {
        permissions = privilegesRaw.split(",").map((v) => v.trim()).filter(Boolean);
      }
    }
    return {
      ...raw,
      role: roleNum,
      permissions,
    };
  };

  const refreshMe = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const res = await api.get("/auth/me");
      const data = res.data?.data || res.data;
      const u = normalizeUser(data);
      setUser(u);
      return u;
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      return null;
    }
  }, []);

  /* LOAD SESSION */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await api.get("/auth/me");
        const data = res.data?.data || res.data;
        setUser(normalizeUser(data));
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* LISTEN TO LOGOUT ACROSS TABS */
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  }, []);

  const encodeAuthFormBody = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") {
        sp.set(k, String(v));
      }
    }
    return sp.toString();
  };

  /* SIGNUP & REGISTER */
  const signup = async (...args: any[]) => {
    let fullName = "";
    let email = "";
    let password = "";
    let phone: string | undefined;

    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
      const obj = args[0];
      fullName = obj.fullName || obj.full_name || obj.name || "";
      email = obj.email || "";
      password = obj.password || "";
      phone = obj.phone || obj.phoneNumber || obj.phone_number;
    } else {
      const strArgs = args.map((a) => (a != null ? String(a) : ""));
      const emailIdx = strArgs.findIndex((a) => a.includes("@"));
      if (emailIdx !== -1) {
        email = strArgs[emailIdx];
        if (emailIdx > 0) {
          fullName = strArgs[0];
        }
        const pwdCand = strArgs.find((a, idx) => idx !== emailIdx && a !== fullName && a.length > 0 && !/^\d+$/.test(a));
        password = pwdCand || (emailIdx + 1 < strArgs.length ? strArgs[emailIdx + 1] : "");
      } else {
        fullName = strArgs[0] || "";
        email = strArgs[1] || "";
        password = strArgs[2] || "";
      }
    }

    const res = await api.post(
      "/auth/signup",
      encodeAuthFormBody({
        fullName: String(fullName || "").trim(),
        phone: phone ? String(phone).trim() : undefined,
        email: normalizeEmail(email),
        password: String(password || ""),
      }),
    );

    const data = res.data?.data || res.data;
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      const u = normalizeUser(data.user);
      if (u) setUser(u);
    }
    return data;
  };

  /* LOGIN */
  const login = async (email: string, password: string) => {
    const res = await api.post(
      "/auth/login",
      encodeAuthFormBody({
        email: normalizeEmail(email),
        password,
      }),
    );

    const data = res.data?.data || res.data;
    localStorage.setItem("token", data.token);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    const u = normalizeUser(data.user);
    setUser(u);
    return u;
  };

  /* PASSWORD RESET */
  const requestReset = (email: string) =>
    api.post("/auth/request-reset", { email: normalizeEmail(email) });

  const verifyReset = (email: string, code: string, newPassword: string) =>
    api.post("/auth/verify-reset", {
      email: normalizeEmail(email),
      code,
      newPassword,
    });

  /* LOGOUT */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  const isAdmin = user?.role === 1 || user?.role === 3;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signup,
        register: signup,
        login,
        requestReset,
        verifyReset,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const FALLBACK_AUTH: AuthContextType = {
  user: null,
  loading: false,
  isAdmin: false,
  signup: async () => ({}),
  register: async () => ({}),
  login: async () => {
    throw new Error("AuthProvider missing");
  },
  requestReset: async () => ({}),
  verifyReset: async () => ({}),
  logout: async () => {},
  refreshMe: async () => null,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return FALLBACK_AUTH;
  }
  return ctx;
};
