/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "../../api/client";

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: number; // roleId mapped to role
  roleName?: string;
  status: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (fullName: string, param2?: string, param3?: string, param4?: string) => Promise<any>;
  register: (fullName: string, param2?: string, param3?: string, param4?: string) => Promise<any>;
  login: (email: string, password: string) => Promise<User>;
  requestReset: (email: string) => Promise<any>;
  verifyReset: (email: string, code: string, newPassword: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
    return {
      ...raw,
      role: typeof roleId === "number" ? roleId : Number(roleId) || 0,
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
      const data = res.data.data || res.data;
      const user = normalizeUser(data);
      setUser(user);
      return user;
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

    refreshMe().finally(() => setLoading(false));
  }, [refreshMe]);

  useEffect(() => {
    const onAuthExpired = () => {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    };

    const onAuthMissing = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("auth:expired", onAuthExpired);
    // @ts-ignore - custom event
    window.addEventListener("auth:missing", onAuthMissing);
    return () => {
      window.removeEventListener("auth:expired", onAuthExpired);
      // @ts-ignore
      window.removeEventListener("auth:missing", onAuthMissing);
    };
  }, []);

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
        // Password is the non-email string parameter
        const pwdCand = strArgs.find((a, idx) => idx !== emailIdx && a !== fullName && a.length > 0 && !/^\d+$/.test(a));
        password = pwdCand || (emailIdx + 1 < strArgs.length ? strArgs[emailIdx + 1] : "");
      } else {
        fullName = strArgs[0] || "";
        email = strArgs[1] || "";
        password = strArgs[2] || "";
      }
    }

    const res = await api.post("/auth/signup", {
      fullName: String(fullName || "").trim(),
      phone: phone ? String(phone).trim() : undefined,
      email: normalizeEmail(email),
      password: String(password || ""),
    });

    const data = res.data.data || res.data;
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      const user = normalizeUser(data.user);
      if (user) setUser(user);
    }
    return data;
  };

  /* LOGIN */
  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", {
      email: normalizeEmail(email),
      password,
    });
    // Backend returns wrapped response: { data: { token, user, ... } }
    const data = res.data.data || res.data;
    localStorage.setItem("token", data.token);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    const user = normalizeUser(data.user);
    if (!user) {
      throw new Error("Invalid user data received from login");
    }
    setUser(user);
    return user;
  };

  /* PASSWORD RESET */
  const requestReset = (email: string) =>
    api.post("/auth/reset", { email: normalizeEmail(email) });

  const verifyReset = (email: string, code: string, newPassword: string) =>
    api.post("/auth/reset/verify", {
      email: normalizeEmail(email),
      code: String(code || "").trim(),
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

  const isAdmin = !!(user && (user.role === 1 || user.role === 3));

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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
