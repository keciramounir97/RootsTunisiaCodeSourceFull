/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useThemeStore } from "../../store/theme";
import { useTranslation } from "../../context/TranslationContext";
import LanguageMenu from "../../components/LanguageMenu";
import { useAuth } from "./AuthContext";
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
  { to: "/admin/articles", labelKey: "articles", Icon: Newspaper },
  { to: "/admin/users", labelKey: "users", Icon: Users },
  { to: "/admin/contact-messages", labelKey: "contact_messages", Icon: MessageSquare },
  { to: "/admin/newsletter", labelKey: "newsletter", Icon: Mail },
  { to: "/admin/download-requests", labelKey: "download_requests", Icon: Download },
  { to: "/admin/approvals", labelKey: "approvals", Icon: UserCheck },
  { to: "/admin/admins", labelKey: "admins", Icon: Shield },
  { to: "/admin/subscriptions", labelKey: "subscriptions", Icon: Crown },
  { to: "/admin/subscription-payments", labelKey: "subscription_payments", Icon: Crown },
  { to: "/admin/tier-features", labelKey: "tier_features_title", Icon: ListChecks },
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
  const isDark = theme === "dark";

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
      {/* Backdrop - mobile/tablet when sidebar overlays */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          open
            ? "opacity-100 pointer-events-auto bg-black/50 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Sidebar Panel - toggleable on ALL screen sizes */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 z-50 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col shadow-2xl overflow-hidden
        ${isDark ? "bg-[#092C2B] border-r border-[#C39637]/20" : "bg-[#092C2B] border-r border-[#C39637]/20"}`}
        style={{ borderRadius: "0 1.25rem 1.25rem 0" }}
      >
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(195,150,55,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Header */}
        <div className="relative h-20 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Roots Tunisia Logo" className="h-12 w-auto object-contain rounded-xl" />
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[#C39637]/90 uppercase font-medium block">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggle}
              className="admin-icon-btn hidden lg:flex p-2 rounded-lg hover:bg-white/10 text-[#e8dfca]/70 hover:text-white transition-colors"
              aria-label={open ? t("close_sidebar", "Close sidebar") : t("open_sidebar", "Open sidebar")}
              title={open ? t("close_sidebar", "Close sidebar") : t("open_sidebar", "Open sidebar")}
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="admin-icon-btn lg:hidden p-2 rounded-lg hover:bg-white/10 text-[#e8dfca]/70 hover:text-white transition-colors"
              aria-label={t("close_sidebar", "Close sidebar")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1">
          <div className="px-3 mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C39637]/60">
              {t("menu", "Main Menu")}
            </span>
          </div>

          {visibleLinks.map(({ to, end, labelKey, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#C39637] text-[#092C2B] font-semibold shadow-md shadow-[#C39637]/25"
                    : "text-[#e8dfca]/80 hover:bg-white/8 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-[#092C2B]/20" : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-[#092C2B]" : "text-[#C39637]"}`}
                    />
                  </div>
                  <span className="text-sm tracking-wide flex-1">{t(labelKey, labelFallbacks[labelKey] || labelKey)}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-[#092C2B]/60 shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="relative p-4 border-t border-white/10 bg-black/20 shrink-0 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <LanguageMenu
              align="up"
              buttonClassName="w-full justify-center px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-[#e8dfca] hover:bg-white/10 transition-colors text-xs font-medium"
            />
            <ThemeToggle
              className="w-full justify-center px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-[#e8dfca] hover:bg-white/10 transition-colors"
            />
          </div>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="interactive-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:text-red-300
              border border-red-500/20 transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>{t("logout", "Sign Out")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
