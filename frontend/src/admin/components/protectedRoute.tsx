import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useTranslation } from "../../context/TranslationContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: number[];
  privileges?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  roles = [],
  privileges = [],
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t, isRtl } = useTranslation();

  // ✅ WAIT until auth is fully resolved
  if (loading) {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="min-h-screen flex items-center justify-center text-lg"
      >
        {t("auth_checking", "Checking authentication...")}
      </div>
    );
  }

  // ✅ Redirect ONLY after loading is false
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  const normalizedRole = (() => {
    const r = user.role ?? (user as any).role_id ?? (user as any).roleId;
    if (typeof r === "number" && !isNaN(r) && r > 0) return r;
    const s = String(r || (user as any).roleName || (user as any).role_name || "").toLowerCase().trim();
    if (s.includes("super")) return 3;
    if (s.includes("admin")) return 1;
    if (s.includes("user")) return 2;
    return Number(r) || 1;
  })();

  const granted = Array.isArray(user.permissions) ? user.permissions : [];
  const isAdminOrSuper =
    normalizedRole === 3 ||
    (normalizedRole === 1 && (granted.length === 0 || granted.includes("all") || granted.includes("*")));

  // In admin section, NEVER kick an authenticated user to homepage ("/")
  const fallbackRedirect = location.pathname.startsWith("/admin") ? "/admin" : redirectTo;

  if (roles.length > 0 && !roles.includes(normalizedRole) && !isAdminOrSuper) {
    return <Navigate to={fallbackRedirect} replace />;
  }

  const userAllowedPrivileges = [
    "dashboard", "usage", "trees", "individuals", "gallery", "audios", "documents",
    "sources-archives", "tasks", "notes", "user-upgrade",
    "subscriptions", "support", "user-settings"
  ];

  if (privileges.length > 0 && !isAdminOrSuper) {
    if (normalizedRole === 2) {
      const isAllowedForUser = privileges.some((p) => userAllowedPrivileges.includes(p));
      if (isAllowedForUser) return <>{children}</>;
      return <Navigate to="/admin" replace />;
    }
    if (privileges.includes("dashboard")) {
      return <>{children}</>;
    }
    const hasPrivilege = privileges.some(
      (p) => granted.includes(p) || granted.includes("all") || granted.includes("*")
    );
    if (!hasPrivilege) {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
}
