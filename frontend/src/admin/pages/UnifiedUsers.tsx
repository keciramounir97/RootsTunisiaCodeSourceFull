import { Suspense, lazy, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Shield, Users as UsersIcon } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { useTranslation } from "../../context/TranslationContext";
import UsersPage from "./Users";

const AdminsRoles = lazy(() => import("./AdminsRoles"));

export default function UnifiedUsers() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const roleId = Number(user?.role ?? (user as any)?.role_id ?? (user as any)?.roleId ?? 0);
  const isSuperAdmin = roleId === 3;

  const [activeTab, setActiveTab] = useState<"users" | "admins">(
    searchParams.get("tab") === "admins" && isSuperAdmin ? "admins" : "users"
  );

  useEffect(() => {
    const param = searchParams.get("tab");
    if (param === "admins" && isSuperAdmin) {
      setActiveTab("admins");
    } else if (param === "users") {
      setActiveTab("users");
    }
  }, [searchParams, isSuperAdmin]);

  const switchTab = (tab: "users" | "admins") => {
    setActiveTab(tab);
    setSearchParams(tab === "admins" ? { tab: "admins" } : {}, { replace: true });
  };

  if (!isSuperAdmin) {
    return <UsersPage />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-3">
        <button
          type="button"
          onClick={() => switchTab("users")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm"
              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]/60"
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          <span>{t("users", "Utilisateurs")}</span>
        </button>

        <button
          type="button"
          onClick={() => switchTab("admins")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === "admins"
              ? "bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm"
              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]/60"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>{t("admins_roles", "Administrateurs & Rôles")}</span>
        </button>
      </div>

      {activeTab === "admins" ? (
        <Suspense fallback={<div className="p-8 text-center opacity-70">{t("loading", "Chargement...")}</div>}>
          <AdminsRoles />
        </Suspense>
      ) : (
        <UsersPage />
      )}
    </div>
  );
}
