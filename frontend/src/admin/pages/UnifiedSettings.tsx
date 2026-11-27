import { Suspense, lazy, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Settings as SettingsIcon, UserCog } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { useTranslation } from "../../context/TranslationContext";

const PlatformSettings = lazy(() => import("./Settings"));
const UserSettings = lazy(() => import("./UserSettings"));

export default function UnifiedSettings() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const roleId = Number(user?.role ?? (user as any)?.role_id ?? (user as any)?.roleId ?? 2);
  const isAdmin = roleId === 1 || roleId === 3;
  const isSuperAdmin = roleId === 3;

  const initialTab =
    searchParams.get("tab") === "account"
      ? "account"
      : isSuperAdmin
      ? "platform"
      : "account";
  const [activeTab, setActiveTab] = useState<"account" | "platform">(initialTab);

  const switchTab = (tab: "account" | "platform") => {
    setActiveTab(tab);
    setSearchParams(tab === "platform" ? { tab: "platform" } : { tab: "account" }, { replace: true });
  };

  if (!isAdmin) {
    return (
      <Suspense fallback={<div className="p-8 text-center opacity-70">{t("loading", "Chargement...")}</div>}>
        <UserSettings />
      </Suspense>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-3">
        <button
          type="button"
          onClick={() => switchTab("platform")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === "platform"
              ? "bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm"
              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]/60"
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>{t("platform_settings", "Paramètres Plateforme")}</span>
        </button>

        <button
          type="button"
          onClick={() => switchTab("account")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === "account"
              ? "bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm"
              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]/60"
          }`}
        >
          <UserCog className="w-4 h-4" />
          <span>{t("user_settings", "Mon Compte & Sécurité")}</span>
        </button>
      </div>

      <Suspense fallback={<div className="p-8 text-center opacity-70">{t("loading", "Chargement...")}</div>}>
        {activeTab === "platform" ? <PlatformSettings /> : <UserSettings />}
      </Suspense>
    </div>
  );
}
