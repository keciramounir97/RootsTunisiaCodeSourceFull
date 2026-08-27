import { useEffect, useMemo, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  Send,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";

import { loadFooterConfig } from "../admin/pages/FooterSettings";

interface FooterProps {
  data?: {
    enabled: boolean;
    fineprint?: string;
    brandTagline?: string;
  };
}

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

  const navLinks = useMemo(
    () => [
      { label: t("home", "Home"), href: "/" },
      { label: t("gallery", "Gallery"), href: "/gallery" },
      { label: t("periods", "Periods"), href: "/periods" },
      { label: t("sources", "Sources"), href: "/sources" },
      { label: t("subscriptions", "Subscriptions"), href: "/subscriptions" },
    ],
    [t]
  );

  const resourceLinks = useMemo(
    () => [
      { label: t("sources", "Sources"), href: "/sources" },
      { label: t("gallery", "Gallery"), href: "/gallery" },
      { label: t("periods", "Periods"), href: "/periods" },
      { label: t("terms_of_service", "Terms"), href: "/terms" },
      { label: t("privacy_policy", "Privacy"), href: "/privacy" },
    ],
    [t]
  );

  const socialLinks = useMemo(
    () => [
      { Icon: Facebook, href: "https://facebook.com" },
      { Icon: Twitter, href: "https://twitter.com" },
      { Icon: Instagram, href: "https://instagram.com" },
      { Icon: Youtube, href: "https://youtube.com" },
    ],
    []
  );

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
    <footer className="heritage-footer text-white">
      <div className="heritage-footer-grid mx-auto pb-4">
        <div className="heritage-footer-column">
          <div className="heritage-logo mb-4">
            <img src="/logo.svg" alt="Roots Tunisia" className="h-10 w-auto object-contain" />
          </div>
          <p className="text-dark-beige/80 mb-6 leading-relaxed">
            {footer.brandTagline ||
              t(
                "footer_desc",
                "La référence pour préserver l'histoire familiale de la Tunisie."
              )}
          </p>
          <div className="heritage-social-links flex gap-4">
            {socialLinks.map(({ Icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent-gold/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Icon size={18} className="text-accent-gold" />
              </a>
            ))}
          </div>
        </div>

        <div className="heritage-footer-column">
          <h3 className="text-lg font-bold mb-4 text-accent-gold">{t("links", "Liens rapides")}</h3>
          <ul className="heritage-footer-links space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-dark-beige/80 hover:text-accent-gold transition-colors inline-block interactive-link"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="heritage-footer-column">
          <h3 className="text-lg font-bold mb-4 text-accent-gold">{t("resources", "Ressources")}</h3>
          <ul className="heritage-footer-links space-y-2">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-dark-beige/80 hover:text-accent-gold transition-colors inline-block interactive-link"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="heritage-footer-column">
          <h3 className="text-lg font-bold mb-4 text-accent-gold">{t("contact", "Contact")}</h3>
          <ul className="heritage-footer-links space-y-3">
            <li className="flex items-center gap-2 text-dark-beige/80">
              <MapPin size={16} className="text-accent-gold" />
              <span>Location opening soon</span>
            </li>
            <li className="flex items-center gap-2 text-dark-beige/80">
              <Mail size={16} className="text-accent-gold" />
              <a href="mailto:contact@rootstunisia.com" className="hover:text-accent-gold transition-colors interactive-link">
                contact@rootstunisia.com
              </a>
            </li>
            <li className="flex items-center gap-2 text-dark-beige/80">
              <Phone size={16} className="text-accent-gold" />
              <a href="tel:+9613626082" className="hover:text-accent-gold transition-colors interactive-link">
                +961 36 26 082
              </a>
            </li>
            <li className="flex items-center gap-2 text-dark-beige/80">
              <MessageCircle size={16} className="text-accent-gold" />
              <span>WhatsApp: +961 36 26 082</span>
            </li>
            <li className="flex items-center gap-2 text-dark-beige/80">
              <Clock size={16} className="text-accent-gold" />
              <span>Lun-Ven: 9h-17h</span>
            </li>
          </ul>
          <form className="mt-6 space-y-4" onSubmit={handleNewsletterSubmit}>
            <p className="text-sm uppercase tracking-[0.3em] text-accent-gold font-semibold">
              {t("newsletter", "Newsletter")}
            </p>
            <p className="text-sm text-dark-beige/80">
              {t(
                "newsletter_prompt",
                "Leave your email and we will reach out to you."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(event) => {
                  setNewsletterEmail(event.target.value);
                  if (newsletterStatus.message) {
                    setNewsletterStatus({ type: "", message: "" });
                  }
                }}
                placeholder={t("email", "Email")}
                className="heritage-input flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                aria-label={t("email", "Email")}
              />
              <button
                type="submit"
                className="interactive-btn px-5 py-2.5 rounded-lg bg-accent-gold text-leather-brown font-semibold hover:bg-accent-gold/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shrink-0"
                disabled={newsletterLoading}
              >
                <Send size={16} />
                {newsletterLoading
                  ? t("subscribing", "Subscribing...")
                  : t("subscribe", "Subscribe")}
              </button>
            </div>
            {newsletterStatus.message ? (
              <p
                className={`text-sm font-medium ${newsletterStatus.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
                  }`}
              >
                {newsletterStatus.message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
      <div className="heritage-footer-meta border-t border-white/10 mt-8 pt-6 text-center text-sm text-[var(--gold-light)]/60">
        {footer.fineprint || "© Roots Tunisia. Tous droits réservés."}
      </div>
    </footer>
  );
}

