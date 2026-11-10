import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTranslation } from "../../context/TranslationContext";
import { useAuth } from "./AuthContext";
import { Logo } from "../../components/site/Logo";
import {
  LayoutDashboard,
  Layout,
  Network,
  Image,
  BookOpen,
  Settings,
  Activity,
  Users,
  UserRound,
  LogOut,
  PanelLeftClose,
  Music,
  FileText,
  MessageSquare,
  Mail,
  Shield,
  Crown,
  ListChecks,
  StickyNote,
  Newspaper,
  Scale,
  Wallet,
  ArchiveRestore,
  Archive,
  Globe,
  Gauge,
  Coins,
  Flag,
  MapPinned,
  Home,
  Info,
  Clock,
} from "lucide-react";

interface SidebarLink {
  to: string;
  end?: boolean;
  labelKey: string;
  Icon: any;
  permissionKey?: string;
  roles?: number[];
}

interface SidebarCategory {
  id: string;
  titleKey: string;
  links: SidebarLink[];
}

const CATEGORIES: SidebarCategory[] = [
  {
    id: "overview",
    titleKey: "admin_cat_overview",
    links: [
      { to: "/admin", end: true, labelKey: "dashboard", Icon: LayoutDashboard },
      { to: "/admin/usage", labelKey: "usage_quotas", Icon: Gauge },
      { to: "/admin/activity", labelKey: "activity", Icon: Activity },
      { to: "/admin/backups", labelKey: "backups", Icon: ArchiveRestore, roles: [3] },
    ],
  },
  {
    id: "genealogy",
    titleKey: "admin_cat_genealogy",
    links: [
      { to: "/admin/trees", labelKey: "trees", Icon: Network },
      { to: "/admin/individuals", labelKey: "individuals", Icon: UserRound, permissionKey: "trees" },
      { to: "/admin/sources-archives", labelKey: "my_sources", Icon: Archive },
      { to: "/admin/tasks", labelKey: "tasks", Icon: ListChecks },
      { to: "/admin/notes", labelKey: "notes", Icon: StickyNote },
    ],
  },
  {
    id: "media",
    titleKey: "admin_cat_media",
    links: [
      { to: "/admin/gallery", labelKey: "gallery", Icon: Image },
      { to: "/admin/audios", labelKey: "audios", Icon: Music },
      { to: "/admin/documents", labelKey: "documents", Icon: FileText },
      { to: "/admin/books", labelKey: "books", Icon: BookOpen },
      { to: "/admin/articles", labelKey: "articles", Icon: Newspaper },
    ],
  },
  {
    id: "content",
    titleKey: "admin_cat_content",
    links: [
      { to: "/admin/home-content", labelKey: "home_public_content", Icon: Home, roles: [3] },
      { to: "/admin/about-content", labelKey: "about_public_content", Icon: Info, roles: [3] },
      { to: "/admin/gallery-content", labelKey: "gallery_public_content", Icon: Image, roles: [3] },
      { to: "/admin/library-content", labelKey: "library_public_content", Icon: BookOpen, roles: [3] },
      { to: "/admin/audio-content", labelKey: "audio_public_content", Icon: Music, roles: [3] },
      { to: "/admin/documents-content", labelKey: "documents_public_content", Icon: FileText, roles: [3] },
      { to: "/admin/periods-content", labelKey: "periods_public_content", Icon: Clock, roles: [3] },
      { to: "/admin/contact-content", labelKey: "contact_public_content", Icon: Mail, roles: [3] },
      { to: "/admin/archives-content", labelKey: "archives_public_content", Icon: Archive, roles: [3] },
      { to: "/admin/sources-content", labelKey: "sources_public_content", Icon: FileText, roles: [3] },
      { to: "/admin/site-image-placeholders", labelKey: "site_image_placeholders", Icon: MapPinned, roles: [3] },
      { to: "/admin/legal-content", labelKey: "legal_content", Icon: Scale, roles: [3] },
      { to: "/admin/footer-settings", labelKey: "footer_settings", Icon: Globe },
    ],
  },
  {
    id: "users",
    titleKey: "admin_cat_users",
    links: [
      { to: "/admin/users", labelKey: "users", Icon: Users },
      { to: "/admin/admins-roles", labelKey: "admins_roles", Icon: Shield, roles: [3] },
      { to: "/admin/contact-messages", labelKey: "contact_messages", Icon: MessageSquare },
      { to: "/admin/newsletter", labelKey: "newsletter", Icon: Mail },
    ],
  },
  {
    id: "finance",
    titleKey: "admin_cat_finance",
    links: [
      { to: "/admin/subscriptions", labelKey: "subscriptions", Icon: Crown, roles: [3] },
      { to: "/admin/subscription-payments", labelKey: "subscription_payments", Icon: Wallet, roles: [3] },
      { to: "/admin/flagged-payments", labelKey: "flagged_payments", Icon: Flag, roles: [3] },
      { to: "/admin/payment-settings", labelKey: "payment_settings", Icon: Wallet, roles: [3] },
      { to: "/admin/currencies", labelKey: "currencies_exchange", Icon: Coins, roles: [3] },
      { to: "/admin/settings", labelKey: "settings", Icon: Settings, roles: [3] },
    ],
  },
];

/** Routes guarded by roles={[3]} — hidden from non-super-admins. */
const superAdminOnlyRoutes = [
  "/admin/admins-roles",
  "/admin/admins",
  "/admin/super-admins",
  "/admin/role-distribution",
  "/admin/subscriptions",
  "/admin/subscription-payments",
  "/admin/flagged-payments",
  "/admin/payment-settings",
  "/admin/currencies",
  "/admin/legal-content",
  "/admin/content",
  "/admin/home-content",
  "/admin/about-content",
  "/admin/gallery-content",
  "/admin/library-content",
  "/admin/audio-content",
  "/admin/documents-content",
  "/admin/periods-content",
  "/admin/contact-content",
  "/admin/archives-content",
  "/admin/sources-content",
  "/admin/site-image-placeholders",
  "/admin/settings",
  "/admin/backups",
];

const labelFallbacks: Record<string, string> = {
  dashboard: "Tableau de Bord",
  usage_quotas: "Quotas d'Utilisation",
  usage_and_quotas: "Quotas d'Utilisation",
  trees: "Arbres Généalogiques",
  individuals: "Individus & Ancêtres",
  my_sources: "Mes Sources & Archives",
  tasks: "Mes Tâches",
  admin_tasks: "Mes Tâches",
  notes: "Mes Notes & Références d'Archives",
  admin_notes: "Mes Notes & Références d'Archives",
  gallery: "Galerie",
  diaporama: "Diaporama de la Bannière",
  site_image_placeholders: "Emplacements d'Images (Pages)",
  audios: "Audio & Récits Oraux",
  documents: "Documents Numérisés",
  books: "Livres & Manuscrits",
  articles: "Articles & Chroniques",
  users: "Utilisateurs",
  admins_roles: "Administrateurs & Rôles",
  admins: "Administrateurs & Accès aux Pages",
  super_admins: "Super Administrateurs",
  contact_messages: "Messages de Contact",
  contactMessages: "Messages de Contact",
  newsletter: "Lettre d'Information",
  subscriptions: "Abonnements & Limites",
  subscription_payments: "Paiements d'Abonnement",
  flagged_payments: "Paiements Signalés",
  payment_settings: "Moyens de Paiement",
  currencies_exchange: "Devises & Taux de Change",
  legal_content: "Contenu Juridique",
  public_content_manager: "Gestion du Contenu Public",
  home_public_content: "Accueil Public Content",
  about_public_content: "À Propos Public Content",
  gallery_public_content: "Galerie Public Content",
  library_public_content: "Bibliothèque Public Content",
  audio_public_content: "Audio & Récits Public Content",
  documents_public_content: "Documents Public Content",
  periods_public_content: "Périodes Historiques Public Content",
  contact_public_content: "Contact Public Content",
  archives_public_content: "Archives Public Content",
  sources_public_content: "Sources Public Content",
  settings: "Paramètres",
  role_distribution: "Distribution des Rôles",
  activity: "Journal d'Activité",
  footer_settings: "Paramètres du Pied de Page",
  backups: "Sauvegardes & Snapshots",
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

  const filterLink = (link: SidebarLink) => {
    if (isSuperAdmin) return true;
    if (normalizedRole === 2) {
      return userAllowedRoutes.includes(link.to);
    }
    if (superAdminOnlyRoutes.includes(link.to)) return false;
    if (normalizedRole === 1 && granted.length === 0) return true;
    if (link.to === "/admin") return granted.includes("dashboard");
    const key = (link as { permissionKey?: string }).permissionKey || link.to.replace("/admin/", "");
    if (key === "admins-roles") return granted.includes("admins") || granted.includes("admins-roles");
    return granted.includes(key);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 z-40 flex flex-col w-64 border-[var(--gold)]/30 bg-[var(--card)]/98 backdrop-blur shadow-2xl transition-transform duration-300 ${
          isRtl
            ? `right-0 border-l ${open ? "translate-x-0" : "translate-x-full"}`
            : `left-0 border-r ${open ? "translate-x-0" : "-translate-x-full"}`
        }`}
      >
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

        <div className="px-5 py-4 border-b border-[var(--gold)]/15 bg-[var(--secondary)]/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white uppercase shadow-sm">
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

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 custom-scrollbar">
          {CATEGORIES.map((category) => {
            const visible = category.links.filter(filterLink);
            if (visible.length === 0) return null;

            return (
              <div key={category.id} className="space-y-1">
                <div className="px-3 pt-2 pb-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)] flex items-center justify-between">
                  <span>{t(category.titleKey, category.id)}</span>
                </div>
                {visible.map(({ to, end, labelKey, Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? `bg-[var(--gold)]/15 text-[var(--gold)] ${isRtl ? "border-l-2" : "border-r-2"} border-[var(--gold)] font-bold shadow-sm`
                          : "text-[var(--muted-foreground)] hover:bg-[var(--gold)]/10 hover:text-[var(--foreground)]"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t(labelKey, labelFallbacks[labelKey] || labelKey)}</span>
                  </NavLink>
                ))}
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-[var(--gold)]/20 bg-[var(--secondary)]/40 flex items-center justify-between gap-2">
          <ThemeToggle />
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t("nav_signout", "Sign Out")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
