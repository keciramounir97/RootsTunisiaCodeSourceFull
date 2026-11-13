import { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Globe, Mail, MapPin, Phone, Send } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { Logo } from "./site/Logo";
import {
  ICON_MAP,
  getActiveSocialLinks,
  getPlatformLabel,
  loadFooterConfig,
  mergeFooterConfigWithSiteContent,
  normalizeFooterConfig,
  type FooterConfig,
} from "../utils/footerConfig";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "./cms/SiteCustomBlocks";

interface FooterProps {
  data?: {
    enabled: boolean;
    fineprint?: string;
    brandTagline?: string;
  };
}

const explore = [
  { to: "/gallery/trees", labelKey: "nav_trees" },
  { to: "/gallery/images", labelKey: "nav_photos" },
  { to: "/library", labelKey: "nav_library" },
  { to: "/audio", labelKey: "nav_audios" },
  { to: "/gallery/articles", labelKey: "nav_articles" },
];

const research = [
  { to: "/helpcenter#about", labelKey: "nav_about" },
  { to: "/periods", labelKey: "nav_periods" },
  { to: "/sources", labelKey: "nav_sources_and_archives" },
  { to: "/subscriptions", labelKey: "nav_subscriptions" },
  { to: "/helpcenter", labelKey: "nav_help_center" },
];

const fallbackFooter = {
  enabled: true,
  fineprint: undefined as string | undefined,
  brandTagline: undefined as string | undefined,
};

const FOOTER_DEFAULT_LOCATIONS: Record<string, string> = {
  fr: "Tunis, Tunisie",
  en: "Tunis, Tunisia",
  ar: "تونس، الجمهورية التونسية",
  es: "Túnez, Túnez",
  it: "Tunisi, Tunisia",
  mt: "Tuneż, Tuneżija",
};

const FOOTER_CITY_TUNIS: Record<string, string> = {
  fr: "Tunis",
  en: "Tunis",
  ar: "تونس",
  es: "Túnez",
  it: "Tunisi",
  mt: "Tuneż",
};

const FOOTER_COUNTRY_TUNISIA: Record<string, string> = {
  fr: "Tunisie",
  en: "Tunisia",
  ar: "تونس",
  es: "Túnez",
  it: "Tunisia",
  mt: "Tuneżija",
};

const FOOTER_KASBAH_ADDRESS: Record<string, string> = {
  fr: "Rue de la Kasbah, Médina de Tunis, Tunisie",
  en: "Rue de la Kasbah, Medina of Tunis, Tunisia",
  ar: "نهج القصبة، المدينة العتيقة، تونس العاصمة",
  es: "Rue de la Kasbah, Medina de Túnez, Túnez",
  it: "Rue de la Kasbah, Medina di Tunisi, Tunisia",
  mt: "Rue de la Kasbah, Medina ta' Tuneż, it-Tuneżija",
};

function isLocaleSafeSingleString(value: string | undefined, cleanLocale: string, isRtl: boolean): value is string {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  return cleanLocale === "fr" || (isRtl && /[\u0600-\u06FF]/.test(trimmed));
}

function localizeFooterLocation(rawLocation: string, cleanLocale: string): string {
  const trimmed = rawLocation.trim();
  if (!trimmed) return "";
  if (cleanLocale === "ar" && /[\u0600-\u06FF]/.test(trimmed)) return trimmed;
  if (/^tunis\s*,\s*(?:tunisie|tunisia)$/i.test(trimmed)) {
    return FOOTER_DEFAULT_LOCATIONS[cleanLocale] || trimmed;
  }
  if (/^tunis$/i.test(trimmed)) {
    return FOOTER_CITY_TUNIS[cleanLocale] || trimmed;
  }
  if (/^(?:tunisie|tunisia|r[ée]publique\s+tunisienne|republic\s+of\s+tunisia)$/i.test(trimmed)) {
    return FOOTER_COUNTRY_TUNISIA[cleanLocale] || trimmed;
  }
  if (/rue\s+de\s+la\s+kasbah.*m[ée]din[ae].*tunis/i.test(trimmed)) {
    return FOOTER_KASBAH_ADDRESS[cleanLocale] || trimmed;
  }
  const trailingCountryMatch = trimmed.match(/^(.*?)(?:,\s*)(tunisie|tunisia)$/i);
  if (trailingCountryMatch) {
    const prefix = trailingCountryMatch[1].trim();
    const localizedPrefix = /^tunis$/i.test(prefix)
      ? FOOTER_CITY_TUNIS[cleanLocale] || prefix
      : prefix;
    const localizedCountry = FOOTER_COUNTRY_TUNISIA[cleanLocale] || trailingCountryMatch[2];
    const sep = cleanLocale === "ar" ? "، " : ", ";
    return `${localizedPrefix}${sep}${localizedCountry}`;
  }
  return trimmed;
}

export default function Footer({ data }: FooterProps) {
  const { t, isRtl, locale } = useTranslation();
  const cleanLocale = (locale || "fr").toLowerCase().split("-")[0];
  const { content: siteContent, getText } = useSiteContent();
  const [footer, setFooter] = useState<any>(() => {
    const cfg = loadFooterConfig();
    return data ? { ...cfg, ...data } : cfg;
  });
  const [loaded, setLoaded] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState({
    type: "",
    message: "",
  });
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    const syncFromLocal = () => {
      try {
        const cfg = loadFooterConfig();
        setFooter(data ? { ...cfg, ...data } : cfg);
      } catch {
        setFooter(data || fallbackFooter);
      }
      setLoaded(true);
    };
    syncFromLocal();

    const onFooterUpdate = (ev: Event) => {
      const custom = (ev as CustomEvent)?.detail;
      if (custom) {
        const normalized = normalizeFooterConfig(custom);
        setFooter(data ? { ...normalized, ...data } : normalized);
      } else {
        syncFromLocal();
      }
    };
    window.addEventListener("roots_footer_updated", onFooterUpdate);
    window.addEventListener("storage", syncFromLocal);
    return () => {
      window.removeEventListener("roots_footer_updated", onFooterUpdate);
      window.removeEventListener("storage", syncFromLocal);
    };
  }, [data]);

  const handleNewsletterSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) {
      setNewsletterStatus({
        type: "error",
        message: t("newsletter_email_required"),
      });
      return;
    }

    try {
      setNewsletterLoading(true);
      setNewsletterStatus({ type: "", message: "" });
      await api.post("/newsletter/subscribe", { email });
      setNewsletterEmail("");
      setNewsletterStatus({
        type: "success",
        message: t("newsletter_success"),
      });
    } catch (err: any) {
      const apiMsg = typeof err?.response?.data?.message === "string" ? err.response.data.message.trim() : "";
      const allowApiMsg =
        apiMsg && (cleanLocale === "fr" || (cleanLocale === "ar" && /[\u0600-\u06FF]/.test(apiMsg)));
      setNewsletterStatus({
        type: "error",
        message: allowApiMsg ? apiMsg : t("newsletter_failed"),
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  if (!loaded || footer?.enabled === false) return null;

  const mergedFooter = mergeFooterConfigWithSiteContent(
    footer as FooterConfig,
    siteContent,
    cleanLocale,
  );

  const siteFooterCfg = (siteContent?.pages as Record<string, any> | undefined)?.footer?.config;
  const localizedTaglineOverride =
    mergedFooter.brandTaglineTranslations?.[cleanLocale] ||
    (footer as any)?.brandTaglineTranslations?.[cleanLocale] ||
    siteFooterCfg?.brandTagline?.translations?.[cleanLocale]?.trim() ||
    undefined;

  const localizedFineprintOverride =
    (footer as any)?.fineprintTranslations?.[cleanLocale] ||
    siteFooterCfg?.copyrightText?.translations?.[cleanLocale]?.trim() ||
    undefined;

  const rawSingleTagline = mergedFooter.brandTagline || footer?.brandTagline || siteFooterCfg?.brandTagline?.value;
  const rawSingleFineprint = footer?.fineprint || siteFooterCfg?.copyrightText?.value;

  const customTagline =
    localizedTaglineOverride ||
    (isLocaleSafeSingleString(rawSingleTagline, cleanLocale, isRtl) ? rawSingleTagline.trim() : null);
  const customFineprint =
    localizedFineprintOverride ||
    (isLocaleSafeSingleString(rawSingleFineprint, cleanLocale, isRtl) ? rawSingleFineprint.trim() : null);

  const activeSocialLinks = getActiveSocialLinks(mergedFooter);

  const siteLocation = getText("footer", "config", "location")?.trim();
  const resolvedLocation = localizeFooterLocation(
    siteLocation || mergedFooter.location || "",
    cleanLocale,
  );
  const resolvedEmail =
    mergedFooter.email?.trim() || getText("footer", "config", "email")?.trim() || "contact@rootstunisia.com";
  const resolvedPhone =
    mergedFooter.phone?.trim() || getText("footer", "config", "phone")?.trim() || "";
  const cleanTelHref = resolvedPhone ? resolvedPhone.replace(/[^\d+]/g, "") : "";

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="mt-20 border-t border-[var(--gold)]/35 bg-[var(--secondary)]/60 text-[var(--foreground)] text-start"
    >
      <SiteCustomBlocks pageId="footer" />
      <div className="mx-auto grid w-full max-w-[var(--content-max)] gap-8 sm:gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:px-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)]">
            {customTagline || t("footer_tagline")}
          </p>
          {activeSocialLinks.length > 0 && (
            <nav
              aria-label={t("social_networks", "Réseaux Sociaux")}
              className="mt-5 flex flex-wrap items-center gap-2.5"
            >
              {activeSocialLinks.map((link) => {
                const IconComp = ICON_MAP[link.icon] || Globe;
                const label = getPlatformLabel(link.icon, cleanLocale);
                return (
                  <a
                    key={link.id}
                    href={link.resolvedHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--card)]/80 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white transition-all shadow-sm"
                  >
                    <IconComp className="h-4 w-4" />
                  </a>
                );
              })}
            </nav>
          )}
        </div>

        <div>
          <h4 className="eyebrow">{t("explore")}</h4>
          <ul className="mt-4 space-y-2.5">
            {explore.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--gold)]"
                >
                  {t(l.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">{t("research")}</h4>
          <ul className="mt-4 space-y-2.5">
            {research.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--gold)]"
                >
                  {t(l.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">{t("contact")}</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted-foreground)]">
            {resolvedLocation ? (
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--gold)] shrink-0" />
                <span>{resolvedLocation}</span>
              </li>
            ) : null}
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--gold)] shrink-0" />
              <a href={`mailto:${resolvedEmail}`} className="hover:text-[var(--gold)]" dir="ltr">
                {resolvedEmail}
              </a>
            </li>
            {resolvedPhone ? (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--gold)] shrink-0" />
                <a href={`tel:${cleanTelHref}`} className="hover:text-[var(--gold)]" dir="ltr">
                  {resolvedPhone}
                </a>
              </li>
            ) : null}
          </ul>

          <form className="mt-5 space-y-2" onSubmit={handleNewsletterSubmit}>
            <div className="flex gap-1.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t("email")}
                aria-label={t("email")}
                className="w-full px-3 py-1.5 rounded text-xs bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)]"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                aria-label={t("subscribe_newsletter")}
                title={t("subscribe_newsletter")}
                className="btn-base btn-gold px-3 py-1.5 text-[0.65rem] shrink-0"
              >
                <Send className={`h-3 w-3 ${isRtl ? "rotate-180" : ""}`} />
              </button>
            </div>
            {newsletterStatus.message && (
              <p className={`text-xs ${newsletterStatus.type === "success" ? "text-green-600" : "text-red-500"}`}>
                {newsletterStatus.message}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="gold-rule" />

      <div className="mx-auto flex w-full max-w-[var(--content-max)] flex-col lg:flex-row items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8 text-xs text-[var(--muted-foreground)]">
        <p>{customFineprint || t("footer_copyright")}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs">
          <Link to="/terms" className="hover:text-[var(--gold)] transition-colors font-medium">
            {t("terms_of_service")}
          </Link>
          <span className="opacity-40">•</span>
          <Link to="/privacy" className="hover:text-[var(--gold)] transition-colors font-medium">
            {t("privacy_policy")}
          </Link>
          <span className="opacity-40">•</span>
          <Link to="/refund" className="hover:text-[var(--gold)] transition-colors font-medium">
            {t("refund_policy")}
          </Link>
          <span className="opacity-40">•</span>
          <Link to="/cookies" className="hover:text-[var(--gold)] transition-colors font-medium">
            {t("cookie_policy")}
          </Link>
          <span className="opacity-40">•</span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("roots:open-cookie-banner"))}
            className="hover:text-[var(--gold)] transition-colors font-medium underline underline-offset-2 bg-transparent border-0 p-0 text-xs cursor-pointer text-[var(--muted-foreground)]"
          >
            {t("cookie_preferences")}
          </button>
        </div>
        <p className="font-display text-sm tracking-wide text-[var(--gold)]">
          {t("site_title")} · {t("footer_rights")}
        </p>
      </div>
    </footer>
  );
}
