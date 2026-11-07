import { useMemo, useState } from "react";
import { Shield, Crown, UserCog } from "lucide-react";
import { useLanguage } from "../../i18n";
import { useAuth } from "../components/AuthContext";
import AdminManagement from "./AdminManagement";
import SuperAdmins from "./SuperAdmins";
import RoleDistribution from "./RoleDistribution";

type TabId = "page-admins" | "super-admins" | "role-distribution";

const TABS: { id: TabId; labelKey: string; fallback: string; Icon: typeof Shield }[] = [
  {
    id: "page-admins",
    labelKey: "admins_roles_tab_page_admins",
    fallback: "Page Admins & Access",
    Icon: Shield,
  },
  {
    id: "super-admins",
    labelKey: "admins_roles_tab_super_admins",
    fallback: "Super Administrators",
    Icon: Crown,
  },
  {
    id: "role-distribution",
    labelKey: "admins_roles_tab_role_distribution",
    fallback: "Role Distribution",
    Icon: UserCog,
  },
];

export default function AdminsRoles({
  initialTab = "page-admins",
}: {
  initialTab?: TabId;
}) {
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const isRtl = dir === "rtl";
  const isSuperAdmin = Number(user?.role) === 3;
  const [tab, setTab] = useState<TabId>(initialTab);

  const subtitle = useMemo(
    () =>
      t(
        "admins_roles_subtitle",
        "Manage page admins, super administrators, and role page access in one place.",
      ),
    [t],
  );

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen p-6 bg-[var(--background)] text-[var(--foreground)]" dir={isRtl ? "rtl" : "ltr"}>
        <div className="max-w-3xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <Shield className="w-14 h-14 mx-auto mb-4 opacity-30 text-[var(--gold)]" />
          <h2 className="text-2xl font-bold mb-2">
            {t("legacy.access_denied", "Access Denied")}
          </h2>
          <p className="text-[var(--muted-foreground)]">
            {t("legacy.super_admin_only", "Only Super Admin can access this page.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-6 bg-[var(--background)] text-[var(--foreground)]"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-[var(--gold)]/25">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--gold)]">
              {t("admins_roles_eyebrow", "Access Control")}
            </p>
            <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">
              {t("admins_roles_title", "Admins & Roles")}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">{subtitle}</p>
          </div>
        </header>

        <div
          role="tablist"
          aria-label={t("admins_roles_title", "Admins & Roles")}
          className="flex flex-wrap gap-2 p-1.5 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
        >
          {TABS.map(({ id, labelKey, fallback, Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[var(--gold)]/18 text-[var(--gold)] border border-[var(--gold)]/40"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/8 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t(labelKey, fallback)}</span>
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="admins-roles-panel">
          {tab === "page-admins" ? <AdminManagement embedded /> : null}
          {tab === "super-admins" ? <SuperAdmins embedded /> : null}
          {tab === "role-distribution" ? <RoleDistribution embedded /> : null}
        </div>
      </div>
    </div>
  );
}
