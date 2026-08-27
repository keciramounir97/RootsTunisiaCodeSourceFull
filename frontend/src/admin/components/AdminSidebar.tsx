import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useThemeStore } from "../../store/theme";
import { useTranslation } from "../../context/TranslationContext";
import LanguageMenu from "../../components/LanguageMenu";
import { useAuth } from "./AuthContext";
import { Logo } from "../../components/site/Logo";
import {
  LayoutDashboard,
  Network,
  Image,
  BookOpen,
  Settings,
  Activity,
  Users,
  UserRound,
  X,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  Music,
  FileText,
  MessageSquare,
  Mail,
  UserCheck,
  Shield,
  Crown,
  ListChecks,
  StickyNote,
  Newspaper,
  Download,
  Scale,
  Wallet,
  ArchiveRestore,
  ArrowUpCircle,
  Globe,
} from "lucide-react";

// Navigation Config
const links = [
  { to: "/admin", end: true, labelKey: "dashboard", Icon: LayoutDashboard },
  { to: "/admin/trees", labelKey: "trees", Icon: Network },
  { to: "/admin/individuals", labelKey: "individuals", Icon: UserRound, permissionKey: "trees" },
  { to: "/admin/gallery", labelKey: "gallery", Icon: Image },
  { to: "/admin/audios", labelKey: "audios", Icon: Music },
  { to: "/admin/documents", labelKey: "documents", Icon: FileText },
  { to: "/admin/books", labelKey: "books", Icon: BookOpen },
  { to: "/admin/users", labelKey: "users", Icon: Users },
  { to: "/admin/contact-messages", labelKey: "contact_messages", Icon: MessageSquare },
  { to: "/admin/newsletter", labelKey: "newsletter", Icon: Mail },
  { to: "/admin/download-requests", labelKey: "download_requests", Icon: Download },
  { to: "/admin/approvals", labelKey: "approvals", Icon: UserCheck },
  { to: "/admin/admins", labelKey: "admins", Icon: Shield },
  { to: "/admin/subscriptions", labelKey: "subscriptions", Icon: Crown },
  { to: "/admin/subscription-payments", labelKey: "subscription_payments", Icon: Crown },
  { to: "/admin/user-upgrade", labelKey: "user_upgrade", Icon: ArrowUpCircle },
  { to: "/admin/payment-settings", labelKey: "payment_settings", Icon: Wallet },
  { to: "/admin/tasks", labelKey: "tasks", Icon: ListChecks },
  { to: "/admin/notes", labelKey: "notes", Icon: StickyNote },
  { to: "/admin/activity", labelKey: "activity", Icon: Activity },
  { to: "/admin/legal-content", labelKey: "legal_content", Icon: Scale },
  { to: "/admin/backups", labelKey: "backups", Icon: ArchiveRestore },
  { to: "/admin/settings", labelKey: "settings", Icon: Settings },
  { to: "/admin/footer-settings", labelKey: "footer_settings", Icon: Globe },
];

const labelFallbacks: Record<string, string> = {
  individuals: "Individuals",
};

export default function AdminSidebar({
  open,
  onClose,
  onToggle,
}: {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}) {
  const { theme } = useThemeStore();
  const { logout, user } = useAuth();
  const { t } = useTranslation();

  const granted = Array.isArray(user?.permissions) ? user.permissions : [];
  const normalizedRole = Number(user?.role);
  const isSuperAdmin = normalizedRole === 3;

  const visibleLinks = links.filter((link) => {
    if (isSuperAdmin) return true;
    if ((normalizedRole === 1 || normalizedRole === 3) && granted.length === 0) {
      return link.to !== "/admin/admins" && link.to !== "/admin/approvals";
    }
    if (link.to === "/admin/approvals" || link.to === "/admin/admins") return false;
    if (link.to === "/admin") return granted.includes("dashboard");
    const key = link.permissionKey || link.to.replace("/admin/", "");
    return granted.includes(key);
  });

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 border-r border-[var(--gold)]/30 bg-[var(--card)]/98 backdrop-blur shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo Top */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[var(--gold)]/25">
          <Logo />
          <button
            onClick={onToggle}
            title={t("close_sidebar", "Close Sidebar")}
            className="rounded p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10 transition-colors"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="px-5 py-4 border-b border-[var(--gold)]/15 bg-[var(--secondary)]/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white uppercase">
              {user?.name ? user.name.charAt(0) : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--foreground)] truncate">{user?.name || "Admin"}</p>
              <p className="text-[0.65rem] text-[var(--gold)] uppercase tracking-[0.14em] font-semibold">
                {isSuperAdmin ? t("super_admin", "Super Admin") : t("researcher", "Researcher")}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)] mb-2">
            {t("navigation", "Navigation")}
          </p>
          {visibleLinks.map(({ to, end, labelKey, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[var(--gold)]/15 text-[var(--gold)] border-r-2 border-[var(--gold)] font-bold"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--gold)]/10 hover:text-[var(--foreground)]"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t(labelKey, labelFallbacks[labelKey] || labelKey)}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom Utility Bar */}
        <div className="p-3 border-t border-[var(--gold)]/20 bg-[var(--secondary)]/40 flex items-center justify-between gap-2">
          <ThemeToggle />
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t("nav_signout", "Sign Out")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
