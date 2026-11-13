import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";
import { splitLocaleFromPath } from "../../seo/localeRouting";

const SEGMENT_KEY_MAP: Record<string, string> = {
  admin: "admin",
  usage: "usage_quotas",
  trees: "trees",
  individuals: "individuals",
  "sources-archives": "my_sources",
  sources_archives: "my_sources",
  periods: "periods_sources_management",
  tasks: "tasks",
  notes: "notes",
  gallery: "gallery",
  audios: "audios",
  documents: "documents",
  books: "books",
  articles: "articles",
  "social-comments": "social_comments_moderation",
  social_comments: "social_comments_moderation",
  "user-upgrade": "user_upgrade",
  user_upgrade: "user_upgrade",
  support: "contact_support",
  "user-settings": "user_settings",
  user_settings: "user_settings",
  suggestions: "suggestions",
  "download-requests": "download_requests",
  download_requests: "download_requests",
  users: "users",
  "admins-roles": "admins_roles",
  admins_roles: "admins_roles",
  "contact-messages": "contact_messages",
  contact_messages: "contact_messages",
  newsletter: "newsletter",
  services: "services_management",
  "services-bookings": "services_bookings",
  services_bookings: "services_bookings",
  subscriptions: "subscriptions",
  "subscription-payments": "subscription_payments",
  subscription_payments: "subscription_payments",
  "flagged-payments": "flagged_payments",
  flagged_payments: "flagged_payments",
  "payment-settings": "payment_settings",
  payment_settings: "payment_settings",
  currencies: "currencies_exchange",
  settings: "settings",
  activity: "activity",
  backups: "backups",
  "footer-settings": "footer_settings",
  footer_settings: "footer_settings",
  "legal-content": "legal_content",
  legal_content: "legal_content",
  "site-image-placeholders": "site_image_placeholders",
  site_image_placeholders: "site_image_placeholders",
  "sources-archives-content": "sources_archives_content",
  sources_archives_content: "sources_archives_content",
  "periods-content": "periods_content",
  periods_content: "periods_content",
  "contact-content": "contact_direct_content",
  contact_content: "contact_direct_content",
  "about-content": "about_mission_content",
  about_content: "about_mission_content",
  "faq-content": "faq_content",
  faq_content: "faq_content",
};

const LABELS: Record<string, string> = {
  admin: "Administration",
  usage: "Quotas d'Utilisation",
  users: "Utilisateurs",
  books: "Livres & Manuscrits",
  trees: "Arbres Généalogiques",
  individuals: "Individus & Ancêtres",
  gallery: "Galerie",
  settings: "Paramètres",
  activity: "Journal d'Activité",
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const { t, isRtl: contextIsRtl, dir } = useTranslation();
  const isRtl = Boolean(contextIsRtl || dir === "rtl");

  const { path: cleanPath } = splitLocaleFromPath(pathname);
  const parts = cleanPath.split("/").filter(Boolean);

  const segments = parts.map((p, i) => {
    const norm = p.replace(/-/g, "_").toLowerCase();
    const mappedKey = SEGMENT_KEY_MAP[p] || SEGMENT_KEY_MAP[norm] || norm;
    const fallbackLabel = LABELS[p] || LABELS[norm] || p.replace(/-/g, " ");
    const translated = t(mappedKey, t(norm, t(p, fallbackLabel)));
    return {
      raw: p,
      label: translated,
      to: "/" + parts.slice(0, i + 1).join("/"),
    };
  });

  const baseText = "!text-white";
  const accent = "!text-white/90 hover:!text-white";
  const muted = "!text-white/70";

  return (
    <nav
      dir={isRtl ? "rtl" : "ltr"}
      aria-label={t("breadcrumb", "Fil d'Ariane")}
      className={`text-sm mb-4 ${baseText} drop-shadow-sm text-start`}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home */}
        <li>
          <Link
            to="/"
            className={`inline-flex items-center gap-2 ${accent} font-medium hover:underline transition-colors`}
          >
            <Home className="w-4 h-4 text-white shrink-0" />
            <span className="text-white">{t("home", "Accueil")}</span>
          </Link>
        </li>

        {/* Segments */}
        {segments.map((s, i) => (
          <li key={s.to} className="flex items-center gap-2">
            <ChevronRight className={`w-4 h-4 shrink-0 ${muted} ${isRtl ? "rotate-180" : ""} rtl:rotate-180`} />

            {i === segments.length - 1 ? (
              <span className="font-bold text-white">
                {String(s.label)}
              </span>
            ) : (
              <Link
                to={s.to}
                className={`${accent} hover:underline capitalize text-white/90`}
              >
                {String(s.label)}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

