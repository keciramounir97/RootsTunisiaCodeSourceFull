import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useThemeStore } from "../../store/theme";
import { useTranslation } from "../../context/TranslationContext";
import LanguageMenu from "../../components/LanguageMenu";
import { useAuth } from "./AuthContext";
import { Logo } from "../../components/site/Logo";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Layout,
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
  Archive,
  ArrowUpCircle,
  Globe,
  Gauge,
  Headphones,
  Coins,
  Flag,
} from "lucide-react";

// Navigation Config
const links = [
  // 1. Dashboard
  { to: "/admin", end: true, labelKey: "dashboard", Icon: LayoutDashboard },
  // 2. Usage Quotas
  { to: "/admin/usage", labelKey: "usage_quotas", Icon: Gauge },
  // 3. Arbres Généalogiques
  { to: "/admin/trees", labelKey: "trees", Icon: Network },
  // 4. Individuals
  { to: "/admin/individuals", labelKey: "individuals", Icon: UserRound, permissionKey: "trees" },
  // 5. My Sources & Archives
  { to: "/admin/sources-archives", labelKey: "my_sources", Icon: Archive },
  // 6. My Tasks
  { to: "/admin/tasks", labelKey: "tasks", Icon: ListChecks },
  // 7. My Notes & References d'Archives
  { to: "/admin/notes", labelKey: "notes", Icon: StickyNote },
  // 8. Gallery
  { to: "/admin/gallery", labelKey: "gallery", Icon: Image },
  // 9. Banner Diaporama (dedicated 16:9 homepage banners)
  { to: "/admin/diaporama", labelKey: "diaporama", Icon: SlidersHorizontal },
  // 10. Audio
  { to: "/admin/audios", labelKey: "audios", Icon: Music },
  // 11. Documents
  { to: "/admin/documents", labelKey: "documents", Icon: FileText },
  // 12. Books
  { to: "/admin/books", labelKey: "books", Icon: BookOpen },
  // 13. Articles
  { to: "/admin/articles", labelKey: "articles", Icon: Newspaper },
  // 14. Users
  { to: "/admin/users", labelKey: "users", Icon: Users },
  // 15. Admins (create & assign pages)
  { to: "/admin/admins", labelKey: "admins", Icon: Shield },
  // 16. Super Admins
  { to: "/admin/super-admins", labelKey: "super_admins", Icon: Crown },
  // 17. Contact
  { to: "/admin/contact-messages", labelKey: "contact_messages", Icon: MessageSquare },
  // 18. Newsletter
  { to: "/admin/newsletter", labelKey: "newsletter", Icon: Mail },
  // 19. Download Requests
  { to: "/admin/download-requests", labelKey: "download_requests", Icon: Download },
  // 20. Emails & Modèles
  { to: "/admin/emails", labelKey: "email_templates", Icon: Mail },
  // 21. Subscriptions (Unified real limitations & public copy)
  { to: "/admin/subscriptions", labelKey: "subscriptions", Icon: Crown },
  // 22. Subscription Payments (proof, zoom, ✓/✗, client message)
  { to: "/admin/subscription-payments", labelKey: "subscription_payments", Icon: Wallet },
  // 22b. Flagged Payments
  { to: "/admin/flagged-payments", labelKey: "flagged_payments", Icon: Flag },
  // 23. Payment Methods
  { to: "/admin/payment-settings", labelKey: "payment_settings", Icon: Wallet },
  // 24. Taux de Change
  { to: "/admin/currencies", labelKey: "currencies_exchange", Icon: Coins },
  // 25. Gestion du Contenu Juridique
  { to: "/admin/legal-content", labelKey: "legal_content", Icon: Scale },
  // 26. Page Named Content (choose page & section to edit public content)
  { to: "/admin/content", labelKey: "public_content_manager", Icon: Layout },
  // 27. Settings
  { to: "/admin/settings", labelKey: "settings", Icon: Settings },
];

const labelFallbacks: Record<string, string> = {
  dashboard: "لوحة التحكم (Dashboard)",
  usage_quotas: "استهلاك الحساب والحدود (Usage Quotas)",
  trees: "أشجار العائلة (Arbres Généalogiques)",
  individuals: "الأفراد والأسلاف (Individuals)",
  my_sources: "المصادر والأرشيف (Mes Sources)",
  tasks: "مهام البحث (Mes Tâches)",
  notes: "الملاحظات ومراجع الأرشيف (Notes & Références)",
  gallery: "المعرض التراثي (Galerie)",
  diaporama: "بانر ديابوراما (Bannière Diaporama)",
  audios: "التسجيلات والروايات الشفوية (Récits Oraux & Audio)",
  documents: "الوثائق وسجلات الأرشيف (Documents & Sijillat)",
  books: "الكتب والمخطوطات (Livres & Manuscrits)",
  articles: "المقالات والدراسات (Articles & Chroniques)",
  users: "إدارة المستخدمين (Utilisateurs)",
  admins: "المشرفون وصلاحيات الصفحات (Admins & Rôles)",
  super_admins: "المشرفون العامون (Super Admins)",
  contact_messages: "رسائل اتصل بنا (Messages de Contact)",
  newsletter: "النشرة البريدية (Newsletter)",
  download_requests: "طلبات التحميل (Download Requests)",
  email_templates: "نماذج البريد (Email Models)",
  subscriptions: "باقات الاشتراكات والحدود (Abonnements & Limites)",
  subscription_payments: "إشعارات واعتماد المدفوعات (Paiements & Preuves)",
  flagged_payments: "المدفوعات الموسومة (Flagged Payments)",
  payment_settings: "وسائل وطرق الدفع (Moyens de Paiement)",
  currencies_exchange: "أسعار الصرف والعملات (Taux de Change)",
  legal_content: "إدارة المحتوى القانوني (Contenu Juridique)",
  public_content_manager: "إدارة محتوى الموقع (Page Content)",
  settings: "الإعدادات العامة (Paramètres)",
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
  const { t, dir } = useTranslation();
  const isRtl = dir === "rtl";

  const granted = Array.isArray(user?.permissions) ? user.permissions : [];
  const normalizedRole = Number(user?.role);
  const isSuperAdmin = normalizedRole === 3;

  const userAllowedRoutes = [
    "/admin/usage",
    "/admin/trees",
    "/admin/individuals",
    "/admin/sources-archives",
    "/admin/tasks",
    "/admin/notes",
    "/admin/gallery",
    "/admin/audios",
    "/admin/documents",
    "/admin/user-upgrade",
    "/admin/support",
    "/admin/user-settings",
  ];

  const visibleLinks = links.filter((link) => {
    if (isSuperAdmin) return true;
    if (normalizedRole === 2) {
      return userAllowedRoutes.includes(link.to);
    }
    if (normalizedRole === 1 && granted.length === 0) {
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
        className={`fixed top-0 bottom-0 z-40 flex flex-col w-64 border-[var(--gold)]/30 bg-[var(--card)]/98 backdrop-blur shadow-2xl transition-transform duration-300 ${
          isRtl
            ? `right-0 border-l ${open ? "translate-x-0" : "translate-x-full"}`
            : `left-0 border-r ${open ? "translate-x-0" : "-translate-x-full"}`
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
            <PanelLeftClose className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
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
                    ? `bg-[var(--gold)]/15 text-[var(--gold)] ${isRtl ? "border-l-2" : "border-r-2"} border-[var(--gold)] font-bold`
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
