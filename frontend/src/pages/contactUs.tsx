import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Compass,
  HelpCircle,
  MessageCircle,
  Facebook,
  Instagram,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import SEO from "../components/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadFooterConfig, type FooterConfig } from "../utils/footerConfig";

type ContactFormData = {
  name: string;
  email: string;
  topic?: string;
  message: string;
  consent: boolean;
};

export default function ContactUs() {
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();

  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => loadFooterConfig());

  useEffect(() => {
    try {
      const cfg = loadFooterConfig();
      setFooterConfig(cfg);
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "RootsTunisia_footer_settings" && e.newValue) {
        try {
          setFooterConfig(JSON.parse(e.newValue));
        } catch {}
      }
    };
    const handleFooterUpdated = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail) setFooterConfig(detail);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("roots_footer_updated", handleFooterUpdated);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("roots_footer_updated", handleFooterUpdated);
    };
  }, []);

  // Public Content Manager overrides (hardcoded/i18n defaults when unset).
  const heroEyebrow = getText("contact", "hero", "eyebrow") ?? t("contact_eyebrow");
  const heroTitle = getText("contact", "hero", "title") ?? t("contact_hero_title");
  const heroSubtitle = getText("contact", "hero", "subtitle") ?? t("contact_hero_subtitle");
  const heroImage = getImage("contact", "hero", "image") ?? sidiBouSaid;
  const email =
    getText("contact", "details", "email")?.trim() ||
    getText("footer", "config", "email")?.trim() ||
    footerConfig.email ||
    "contact@rootstunisia.com";
  const phone =
    getText("contact", "details", "phone")?.trim() ||
    getText("footer", "config", "phone")?.trim() ||
    footerConfig.phone ||
    "+216 71 000 000";
  const phoneHref = phone.replace(/[^\d+]/g, "") || "+21671000000";
  const hours = getText("contact", "details", "hours") ?? "09:00 – 17:00 (GMT+1)";
  const formTitle = getText("contact", "form", "title") ?? t("how_can_we_help");
  const formIntro = getText("contact", "form", "intro") ?? t("direct_contact_desc");

  // Dynamic social links from admin
  const fbLink =
    footerConfig.socialLinks.find((l) => l.enabled && l.icon === "facebook")?.url ||
    "https://facebook.com";
  const igLink =
    footerConfig.socialLinks.find((l) => l.enabled && l.icon === "instagram")?.url ||
    "https://instagram.com";
  const rawWa = (footerConfig.whatsapp || phone).replace(/[^\d]/g, "") || "21671000000";
  const whatsappUrl = `https://wa.me/${rawWa}?text=${encodeURIComponent("Bonjour Roots Tunisia, je souhaite des renseignements sur vos recherches généalogiques.")}`;

  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("topic_general");
  const [modalStatus, setModalStatus] = useState<{
    open: boolean;
    type: "success" | "error";
    msg: string;
  }>({
    open: false,
    type: "success",
    msg: "",
  });

  const topics = [
    { key: "topic_general", label: t("topic_general") },
    { key: "topic_tree_search", label: t("topic_tree_search") },
    { key: "topic_archive_request", label: t("topic_archive_request") },
    { key: "topic_partnership", label: t("topic_partnership") },
  ];

  const contactSchema = useMemo(() => {
    return z.object({
      name: z.string().min(1, t("error_name_required")),
      email: z.string().email(t("error_email_required")),
      topic: z.string().optional(),
      message: z.string().min(10, t("error_message_length")),
      consent: z.boolean().refine((val) => val === true, {
        message: t("error_consent_required"),
      }),
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "topic_general",
      message: "",
      consent: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      await api.post("/contact", {
        name: data.name,
        email: data.email,
        message: `[Topic: ${data.topic || selectedTopic}] ${data.message}`,
      });
      setModalStatus({
        open: true,
        type: "success",
        msg: t("message_sent_success"),
      });
      reset({
        name: "",
        email: "",
        topic: "topic_general",
        message: "",
        consent: false,
      });
      setSelectedTopic("topic_general");
    } catch {
      setModalStatus({
        open: true,
        type: "error",
        msg: t("message_sent_error"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (key: string) => {
    setSelectedTopic(key);
    setValue("topic", key);
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={`${t("contact_us_title")} | ${t("site_title")}`}
        description={t("contact_hero_subtitle")}
      />

      {/* Confirmation Modal */}
      {modalStatus.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="surface-card frame-gold p-6 sm:p-8 rounded-lg shadow-2xl max-w-md w-full text-center relative bg-[var(--card)]">
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setModalStatus({ ...modalStatus, open: false })}
              className="absolute top-4 end-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-full hover:bg-[var(--gold)]/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45">
              {modalStatus.type === "success" ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-rose-500" />
              )}
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 text-[var(--foreground)]">
              {modalStatus.type === "success"
                ? t("message_sent_title")
                : t("transmission_error")}
            </h3>

            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
              {modalStatus.msg}
            </p>

            <button
              type="button"
              onClick={() => setModalStatus({ ...modalStatus, open: false })}
              className="btn-base btn-gold w-full text-sm font-semibold py-2.5 cursor-pointer"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}

      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImage}
      />

      {/* Symmetric Quick Contact Cards */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {/* Direct Phone Card */}
            <a
              href={`tel:${phoneHref}`}
              className="surface-card group flex h-full flex-col justify-between p-5 sm:p-6 rounded-lg border border-[var(--gold)]/35 hover:border-[var(--gold)] transition-all bg-[var(--card)]/95 shadow-md hover:-translate-y-1 text-start"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {t("nav_contact")}
                  </p>
                  <p dir="ltr" className="font-display text-base font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                    {phone}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--gold)]/20 text-xs font-bold text-[var(--gold)] uppercase tracking-wider flex items-center justify-between">
                <span>{t("direct_contact")}</span>
                <span>{isRtl ? "←" : "→"}</span>
              </div>
            </a>

            {/* WhatsApp Support Card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card group flex h-full flex-col justify-between p-5 sm:p-6 rounded-lg border border-emerald-500/35 hover:border-emerald-500 transition-all bg-[var(--card)]/95 shadow-md hover:-translate-y-1 text-start"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/45 shrink-0">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    WhatsApp Support
                  </p>
                  <p dir="ltr" className="font-display text-base font-bold text-[var(--foreground)] group-hover:text-emerald-500 transition-colors">
                    {footerConfig.whatsapp || phone}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>Chat Direct</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${email}`}
              className="surface-card group flex h-full flex-col justify-between p-5 sm:p-6 rounded-lg border border-[var(--gold)]/35 hover:border-[var(--gold)] transition-all bg-[var(--card)]/95 shadow-md hover:-translate-y-1 text-start"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {t("email")}
                  </p>
                  <p className="font-display text-base font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors truncate">
                    {email}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--gold)]/20 text-xs font-bold text-[var(--gold)] uppercase tracking-wider flex items-center justify-between">
                <span>{t("direct_contact")}</span>
                <span>{isRtl ? "←" : "→"}</span>
              </div>
            </a>

            {/* Working Hours Card */}
            <div className="surface-card group flex h-full flex-col justify-between p-5 sm:p-6 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md text-start">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {t("working_hours")}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--foreground)] leading-tight">
                    {hours}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--gold)]/20 text-xs font-semibold text-[var(--muted-foreground)] flex items-center justify-between">
                <span>{t("response_commitment_title")}</span>
                <span className="text-[var(--gold)] font-bold">24h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Channels & Social Networks (Facebook, Instagram & WhatsApp) */}
      <section className="w-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="surface-card p-6 sm:p-8 rounded-lg border border-[var(--gold)]/40 bg-[var(--card)]/95 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--gold)]/20 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Réseaux Sociaux & Support Direct
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-1">
                  Rejoignez Roots Tunisia sur les plateformes officielles
                </h3>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] max-w-sm">
                Posez vos questions en direct ou suivez nos découvertes et actualités d&apos;archives tunisiennes.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* WhatsApp Card */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-5 rounded-lg border border-emerald-500/35 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all text-start"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/40">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Direct Chat
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-[var(--foreground)] group-hover:text-emerald-500 transition-colors">
                    WhatsApp Support
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Échangez directement avec nos généalogistes pour toute question sur les archives ou recherches.
                  </p>
                  <p dir="ltr" className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                    {footerConfig.whatsapp || phone}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Chatter sur WhatsApp</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </a>

              {/* Facebook Card */}
              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-5 rounded-lg border border-blue-500/35 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500 transition-all text-start"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 ring-1 ring-blue-500/40">
                      <Facebook className="h-6 w-6" />
                    </div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/30">
                      Communauté
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-[var(--foreground)] group-hover:text-blue-500 transition-colors">
                    Facebook Officiel
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Suivez nos publications, récits d&apos;ancêtres et annonces de nouveaux fonds d&apos;archives.
                  </p>
                  <p className="font-mono text-xs text-[var(--muted-foreground)] mt-2 truncate">
                    {fbLink}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-500/20 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Rejoindre sur Facebook</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-5 rounded-lg border border-pink-500/35 bg-pink-500/5 hover:bg-pink-500/10 hover:border-pink-500 transition-all text-start"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20 text-pink-500 ring-1 ring-pink-500/40">
                      <Instagram className="h-6 w-6" />
                    </div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-pink-500 bg-pink-500/15 px-2 py-0.5 rounded-full border border-pink-500/30">
                      Photothèque
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-[var(--foreground)] group-hover:text-pink-500 transition-colors">
                    Instagram Officiel
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Explorez les photographies historiques, cartes postales de la Médina et registres anciens.
                  </p>
                  <p className="font-mono text-xs text-[var(--muted-foreground)] mt-2 truncate">
                    {igLink}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-pink-500/20 flex items-center justify-between text-xs font-bold text-pink-600 dark:text-pink-400">
                  <span>Suivre sur Instagram</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form & Information Section */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Inquiry Form (7 Columns) */}
          <div className="surface-card frame-gold p-6 sm:p-8 lg:p-10 rounded-lg shadow-xl bg-[var(--card)]/95 backdrop-blur-sm text-start lg:col-span-7">
            <SectionHeading
              center={false}
              eyebrow={t("send_a_message")}
              title={formTitle}
              intro={formIntro}
            />

            {/* Interactive Topic Pill Selector */}
            <div className="mt-6">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)] block mb-2.5">
                {t("contact_topic_label")}
              </label>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {topics.map((tp) => {
                  const isActive = selectedTopic === tp.key;
                  return (
                    <button
                      key={tp.key}
                      type="button"
                      onClick={() => handleSelectTopic(tp.key)}
                      className={`px-3 py-2 text-xs rounded-md border transition-all text-center sm:text-start cursor-pointer ${
                        isActive
                          ? "border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--foreground)] font-bold shadow-sm"
                          : "border-[var(--border)] bg-[var(--background)]/60 text-[var(--muted-foreground)] hover:border-[var(--gold)]/50 hover:text-[var(--foreground)]"
                      }`}
                    >
                      {tp.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {t("full_name")} <span className="text-red-500">*</span>
                </span>
                <input
                  {...register("name")}
                  className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30"
                  placeholder={t("placeholder_name")}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </label>

              {/* Email */}
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {t("email")} <span className="text-red-500">*</span>
                </span>
                <input
                  type="email"
                  {...register("email")}
                  className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30"
                  placeholder="contact@rootstunisia.com"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </label>

              {/* Message */}
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {t("message")} <span className="text-red-500">*</span>
                </span>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30"
                  placeholder={t("placeholder_message")}
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
              </label>

              {/* Privacy Consent Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-[var(--muted-foreground)] mt-1">
                <input
                  type="checkbox"
                  {...register("consent")}
                  className="mt-0.5 rounded border-[var(--border)] text-[var(--gold)] focus:ring-[var(--gold)]"
                />
                <span>{t("privacy_consent_label")}</span>
              </label>
              {errors.consent && <p className="text-xs text-red-500">{errors.consent.message}</p>}

              {/* Submit Button */}
              <div className="mt-2 pt-3 border-t border-[var(--gold)]/20">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-base btn-gold w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                  <span>{loading ? t("sending") : t("send_a_message")}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Details & Commitments Column (5 Columns) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Archival Research Helpline Card */}
            <div className="surface-card frame-gold p-6 sm:p-7 rounded-lg shadow-md bg-[var(--card)]/95 text-start">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45 shrink-0">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <p className="eyebrow text-[var(--gold)]">{t("site_title")}</p>
                  <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                    {t("genealogy_research_desk", "Genealogical Research Desk")}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[var(--muted-foreground)]">
                {t("direct_contact_desc")}
              </p>
              <div className="mt-5 p-4 rounded-md bg-[var(--background)]/80 border border-[var(--gold)]/25 space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[var(--gold)] shrink-0" />
                  <a href={`tel:${phoneHref}`} dir="ltr" className="font-semibold text-[var(--foreground)] hover:text-[var(--gold)]">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" dir="ltr" className="font-semibold text-[var(--foreground)] hover:text-emerald-500">
                    WhatsApp: {footerConfig.whatsapp || phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[var(--gold)] shrink-0" />
                  <a href={`mailto:${email}`} className="text-[var(--foreground)] hover:text-[var(--gold)]">
                    {email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--gold)] shrink-0" />
                  <span className="text-[var(--muted-foreground)]">{hours}</span>
                </div>
              </div>
            </div>

            {/* Guaranteed Response Card */}
            <div className="surface-card p-6 sm:p-7 rounded-lg border border-[var(--gold)]/35 shadow-md bg-[var(--card)]/95 text-start">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    {t("response_commitment_title")}
                  </h4>
                  <p className="text-xs text-[var(--gold)] font-semibold">
                    {t("response_commitment_badge")}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[var(--muted-foreground)]">
                {t("response_commitment_desc")}
              </p>
            </div>

            {/* Quick Consultation Links */}
            <div className="surface-card p-6 sm:p-7 rounded-lg border border-[var(--gold)]/35 shadow-md bg-[var(--card)]/95 text-start space-y-3">
              <h4 className="font-display text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[var(--gold)]" />
                <span>{t("need_immediate_help", "Need immediate help?")}</span>
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                {t("explore_guides_prompt", "Explore our archival consultation guide or search across 9 historical periods.")}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link to="/sources" className="btn-base btn-gold text-xs py-2 px-3">
                  {t("sources_and_archives_nav")}
                </Link>
                <Link to="/periods" className="btn-base btn-outline text-xs py-2 px-3">
                  {t("see_the_timeline")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <SiteCustomBlocks pageId="contact" />
    </div>
  );
}
