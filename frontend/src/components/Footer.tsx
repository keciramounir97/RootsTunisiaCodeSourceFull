import { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { Logo } from "./site/Logo";
import { loadFooterConfig } from "../admin/pages/FooterSettings";
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
  { to: "/gallery", labelKey: "nav_photos" },
  { to: "/library", labelKey: "nav_library" },
  { to: "/audio", labelKey: "nav_audios" },
  { to: "/gallery/articles", labelKey: "nav_articles" },
];

const research = [
  { to: "/about", labelKey: "nav_about" },
  { to: "/periods", labelKey: "nav_periods" },
  { to: "/sources", labelKey: "nav_sources" },
  { to: "/archives", labelKey: "nav_archives" },
  { to: "/subscriptions", labelKey: "nav_subscriptions" },
  { to: "/contact", labelKey: "nav_contact" },
];

const fallbackFooter = {
  enabled: true,
  fineprint: undefined as string | undefined,
  brandTagline: undefined as string | undefined,
};

export default function Footer({ data }: FooterProps) {
  const { t, isRtl } = useTranslation();
  const { getText } = useSiteContent();
  const [footer, setFooter] = useState<any>(data || fallbackFooter);
  const [loaded, setLoaded] = useState(Boolean(data));
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState({
    type: "",
    message: "",
  });
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFooter(data);
      setLoaded(true);
    } else {
      const syncFromLocal = () => {
        try {
          const cfg = loadFooterConfig();
          if (cfg) setFooter(cfg);
        } catch {
          setFooter(fallbackFooter);
        }
      };
      syncFromLocal();
      setLoaded(true);
      const onFooterUpdate = (ev: Event) => {
        const custom = (ev as CustomEvent)?.detail;
        if (custom) setFooter(custom);
        else syncFromLocal();
      };
      window.addEventListener("roots_footer_updated", onFooterUpdate);
      window.addEventListener("storage", syncFromLocal);
      return () => {
        window.removeEventListener("roots_footer_updated", onFooterUpdate);
        window.removeEventListener("storage", syncFromLocal);
      };
    }
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
      setNewsletterStatus({
        type: "error",
        message: err.response?.data?.message || t("newsletter_failed"),
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  if (!loaded || footer?.enabled === false) return null;

  const customTagline = footer?.brandTagline && (!isRtl || /[\u0600-\u06FF]/.test(footer.brandTagline)) ? footer.brandTagline : null;
  const customFineprint = footer?.fineprint && (!isRtl || /[\u0600-\u06FF]/.test(footer.fineprint)) ? footer.fineprint : null;

  const resolvedLocation =
    getText("footer", "config", "location") || footer?.location || "Tunis, Tunisie";
  const resolvedEmail =
    getText("footer", "config", "email") || footer?.email || "contact@rootstunisia.com";
  const resolvedPhone =
    getText("footer", "config", "phone") || footer?.phone || "+216 71 000 000";
  const cleanTelHref = resolvedPhone.replace(/[^\d+]/g, "") || "+21671000000";

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
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--gold)] shrink-0" />
              <span>{resolvedLocation}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--gold)] shrink-0" />
              <a href={`mailto:${resolvedEmail}`} className="hover:text-[var(--gold)]" dir="ltr">
                {resolvedEmail}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[var(--gold)] shrink-0" />
              <a href={`tel:${cleanTelHref}`} className="hover:text-[var(--gold)]" dir="ltr">
                {resolvedPhone}
              </a>
            </li>
          </ul>

          <form className="mt-5 space-y-2" onSubmit={handleNewsletterSubmit}>
            <div className="flex gap-1.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t("email")}
                className="w-full px-3 py-1.5 rounded text-xs bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)]"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
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
