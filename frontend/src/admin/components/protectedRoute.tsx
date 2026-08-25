import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

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

  // ✅ WAIT until auth is fully resolved
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Checking authentication...
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

  const normalizedRole = Number(user.role);
  if (roles.length > 0 && !roles.includes(normalizedRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  if (privileges.length > 0 && normalizedRole !== 3) {
    if (privileges.includes("dashboard")) {
      return children;
    }
    const granted = Array.isArray(user.permissions) ? user.permissions : [];
    if (normalizedRole === 1 && granted.length === 0) {
      return children;
    }
    const hasPrivilege = privileges.some((p) => granted.includes(p));
    if (!hasPrivilege) {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
}
