import { Suspense, lazy, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Crown, Sparkles } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { useTranslation } from "../../context/TranslationContext";

const SubscriptionsAdmin = lazy(() => import("./Subscriptions"));
const UserUpgrade = lazy(() => import("./UserUpgrade"));

export default function UnifiedSubscriptions() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const roleId = Number(user?.role ?? (user as any)?.role_id ?? (user as any)?.roleId ?? 2);
  const isSuperAdmin = roleId === 3;

  const initialTab =
    searchParams.get("tab") === "upgrade"
      ? "upgrade"
      : isSuperAdmin
      ? "manage"
      : "upgrade";
  const [activeTab, setActiveTab] = useState<"manage" | "upgrade">(initialTab);

  const switchTab = (tab: "manage" | "upgrade") => {
    setActiveTab(tab);
    setSearchParams(tab === "manage" ? { tab: "manage" } : { tab: "upgrade" }, { replace: true });
  };

  if (!isSuperAdmin) {
    return (
      <Suspense fallback={<div className="p-8 text-center opacity-70">{t("loading", "Chargement...")}</div>}>
        <UserUpgrade />
      </Suspense>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-3">
        <button
          type="button"
          onClick={() => switchTab("manage")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === "manage"
              ? "bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm"
              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]/60"
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>{t("subscriptions", "Abonnements & Limites")}</span>
        </button>

        <button
          type="button"
          onClick={() => switchTab("upgrade")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            activeTab === "upgrade"
              ? "bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm"
              : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]/60"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t("user_upgrade", "Mon Abonnement & Mise à Niveau")}</span>
        </button>
      </div>

      <Suspense fallback={<div className="p-8 text-center opacity-70">{t("loading", "Chargement...")}</div>}>
        {activeTab === "manage" ? <SubscriptionsAdmin /> : <UserUpgrade />}
      </Suspense>
    </div>
  );
}
