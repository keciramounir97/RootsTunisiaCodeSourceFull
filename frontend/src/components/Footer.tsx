import { useEffect, useMemo, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { Logo } from "./site/Logo";
import { loadFooterConfig } from "../admin/pages/FooterSettings";

interface FooterProps {
  data?: {
    enabled: boolean;
    fineprint?: string;
    brandTagline?: string;
  };
}

const explore = [
  { to: "/gallery/trees", label: "Family Trees" },
  { to: "/gallery", label: "Photo Gallery" },
  { to: "/library", label: "Library" },
  { to: "/gallery/audios", label: "Oral Histories" },
];

const research = [
  { to: "/periods", label: "Tunisian Periods" },
  { to: "/sources", label: "Sources" },
  { to: "/archives", label: "Archives" },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/contact", label: "Contact" },
];

const fallbackFooter = {
  enabled: true,
  fineprint: "© Roots Tunisia. All rights reserved.",
  brandTagline: undefined as string | undefined,
};

export default function Footer({ data }: FooterProps) {
  const { t } = useTranslation();
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
      try {
        const cfg = loadFooterConfig();
        if (cfg) setFooter(cfg);
      } catch {
        setFooter(fallbackFooter);
      }
      setLoaded(true);
    }
  }, [data]);

  const handleNewsletterSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) {
      setNewsletterStatus({
        type: "error",
        message: t("newsletter_email_required", "Email is required."),
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
        message: t(
          "newsletter_success",
          "Thanks! We will reach out to you soon."
        ),
      });
    } catch (err: any) {
      setNewsletterStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          t("newsletter_failed", "Failed to subscribe."),
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  if (!loaded || footer?.enabled === false) return null;

  return (
    <footer className="mt-24 border-t border-[var(--gold)]/35 bg-[var(--secondary)]/60 text-[var(--foreground)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)]">
            {footer.brandTagline ||
              "A Tunisian genealogy platform connecting civil registers, beylical and Ottoman registers, habous deeds, Protectorate archives, photographs and family memory — from Carthage to Kairouan, Tunis to Djerba."}
          </p>
        </div>

        <div>
          <h4 className="eyebrow">{t("explore", "Explore")}</h4>
          <ul className="mt-4 space-y-2.5">
            {explore.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--gold)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">{t("research", "Research")}</h4>
          <ul className="mt-4 space-y-2.5">
            {research.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--gold)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">{t("contact", "Contact")}</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted-foreground)]">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-[var(--gold)] shrink-0" />
              <span>Rue de la Kasbah, Medina of Tunis, Tunisia</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--gold)] shrink-0" />
              <a href="mailto:contact@rootstunisia.com" className="hover:text-[var(--gold)]">
                contact@rootstunisia.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[var(--gold)] shrink-0" />
              <a href="tel:+21671000000" className="hover:text-[var(--gold)]">
                +216 71 000 000
              </a>
            </li>
          </ul>

          <form className="mt-5 space-y-2" onSubmit={handleNewsletterSubmit}>
            <div className="flex gap-1.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t("email", "Email")}
                className="w-full px-3 py-1.5 rounded text-xs bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)]"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="btn-base btn-gold px-3 py-1.5 text-[0.65rem] shrink-0"
              >
                <Send className="h-3 w-3" />
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

      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
        <p>{footer.fineprint || `© ${new Date().getFullYear()} Roots Tunisia. All rights reserved.`}</p>
        <p className="font-display text-sm tracking-wide text-[var(--gold)]">
          جذور تونس · Preserving Tunisian lineage
        </p>
      </div>
    </footer>
  );
}
