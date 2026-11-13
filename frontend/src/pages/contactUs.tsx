import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Globe,
  ExternalLink,
  Sparkles,
  MapPin,
  Landmark,
  BookOpen,
  ScrollText,
  Search,
  Building,
  Lock,
  Scale,
  FolderArchive,
  Eye,
  Network,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Briefcase,
  LifeBuoy,
  Check,
  FileSearch,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";
import { PageHero } from "../components/site/Primitives";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import SEO from "../components/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ICON_MAP as FOOTER_SOCIAL_ICON_MAP,
  PLATFORM_CARD_STYLES,
  getActiveSocialLinks,
  getPlatformLabel,
  loadFooterConfig,
  mergeFooterConfigWithSiteContent,
  normalizeFooterConfig,
  type FooterConfig,
} from "../utils/footerConfig";
import { useHelpCenterCmsConfig } from "../utils/helpCenterCmsConfig";

type ContactTab = "contact" | "about" | "faq" | "legal";

type ContactFormData = {
  name: string;
  email: string;
  topic?: string;
  message: string;
  consent: boolean;
};

const ICON_MAP: Record<string, LucideIcon> = {
  Building,
  Scale,
  ScrollText,
  FolderArchive,
  MapPin,
  FileSearch,
  CheckCircle2,
  Lock,
  Compass,
  Network,
  Eye,
  Landmark,
  HelpCircle,
  CreditCard,
  Briefcase,
  ShieldCheck,
  LifeBuoy,
  BookOpen,
  Sparkles,
  Mail,
  Phone,
  Clock,
  MessageCircle,
};

function resolveIcon(name?: string, fallback: LucideIcon = Landmark): LucideIcon {
  if (!name) return fallback;
  return ICON_MAP[name] || fallback;
}

export default function ContactUs() {
  const { t, isRtl, locale } = useTranslation();
  const cleanLocale = (locale || "fr").toLowerCase().split("-")[0];
  const { content: siteContent, getText, getImage } = useSiteContent();
  const { config: hcConfig } = useHelpCenterCmsConfig();
  const location = useLocation();

  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => loadFooterConfig());

  // Detect active tab from URL hash or query param
  const getTabFromLocation = (): ContactTab => {
    const hash = (location.hash || "").replace("#", "").toLowerCase();
    const searchParams = new URLSearchParams(location.search);
    const tabParam = (searchParams.get("tab") || "").toLowerCase();
    const key = tabParam || hash;

    if (key.includes("about") || key.includes("a-propos") || key.includes("propos")) return "about";
    if (key.includes("faq")) return "faq";
    if (key.includes("legal") || key.includes("mention") || key.includes("cadre")) return "legal";
    return "contact";
  };

  const [activeTab, setActiveTab] = useState<ContactTab>(getTabFromLocation);

  useEffect(() => {
    setActiveTab(getTabFromLocation());
  }, [location.hash, location.search]);

  const handleTabChange = (tab: ContactTab) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
  };

  useEffect(() => {
    try {
      const cfg = loadFooterConfig();
      setFooterConfig(cfg);
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "RootsTunisia_footer_settings") {
        setFooterConfig(loadFooterConfig());
      }
    };
    const handleFooterUpdated = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail) setFooterConfig(normalizeFooterConfig(detail));
      else setFooterConfig(loadFooterConfig());
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("roots_footer_updated", handleFooterUpdated);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("roots_footer_updated", handleFooterUpdated);
    };
  }, []);

  // Public Content Manager & Help Center CMS overrides
  const heroEyebrow =
    hcConfig.hero.eyebrow ||
    getText("helpcenter", "hero", "eyebrow") ||
    getText("contact", "hero", "eyebrow") ||
    t("helpcenter_eyebrow", "Centre d'Aide & Informations");
  const heroTitle =
    hcConfig.hero.title ||
    getText("helpcenter", "hero", "title") ||
    getText("contact", "hero", "title") ||
    t("helpcenter_hero_title", "Centre d'Aide");
  const heroSubtitle =
    hcConfig.hero.subtitle ||
    getText("helpcenter", "hero", "subtitle") ||
    getText("contact", "hero", "subtitle") ||
    t(
      "helpcenter_hero_subtitle",
      "Découvrez notre démarche archivistique par la preuve, consultez les réponses officielles ou contactez nos chercheurs."
    );
  const heroImage =
    (hcConfig.hero.image && hcConfig.hero.image.trim() ? hcConfig.hero.image.trim() : null) ??
    getImage("contact", "hero", "image") ??
    sidiBouSaid;

  const resolvedFooterConfig = useMemo(
    () => mergeFooterConfigWithSiteContent(footerConfig, siteContent, cleanLocale),
    [footerConfig, siteContent, cleanLocale],
  );
  const activeSocialLinks = useMemo(
    () => getActiveSocialLinks(resolvedFooterConfig),
    [resolvedFooterConfig],
  );

  const email =
    resolvedFooterConfig.email?.trim() ||
    getText("footer", "config", "email")?.trim() ||
    hcConfig.contact.cards.emailValue?.trim() ||
    getText("contact", "details", "email")?.trim() ||
    "contact@rootstunisia.com";
  // Contact Direct cards follow Contact CMS. Empty admin values must stay empty
  // (do not resurrect footer/site-content fallbacks after an intentional clear).
  const phone = String(hcConfig.contact.cards.phoneValue ?? "").trim();
  const phoneHref = phone ? phone.replace(/[^\d+]/g, "") : "";
  const hours =
    hcConfig.contact.cards.hoursValue?.trim() ||
    getText("contact", "details", "hours") ||
    "09:00 – 17:00 (GMT+1)";

  // Social links — unified with Footer Settings
  const whatsappLink = activeSocialLinks.find((link) => link.icon === "whatsapp");
  const waNumber = String(hcConfig.contact.cards.whatsappValue ?? "").trim();
  const waDisplay = waNumber;
  const rawWa = waNumber.replace(/[^\d]/g, "");
  const prefillWa =
    hcConfig.contact.cards.whatsappPrefillMessage ||
    t("whatsapp_prefill_message");
  const whatsappUrl = rawWa
    ? `https://wa.me/${rawWa}?text=${encodeURIComponent(prefillWa)}`
    : whatsappLink?.resolvedHref || "";

  // Form states
  const topics = hcConfig.contact.form.topics;
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0]?.key || "topic_general");
  const [modalStatus, setModalStatus] = useState<{
    open: boolean;
    type: "success" | "error";
    msg: string;
  }>({
    open: false,
    type: "success",
    msg: "",
  });

  const contactSchema = useMemo(() => {
    return z.object({
      name: z.string().min(1, t("error_name_required", "Le nom est obligatoire")),
      email: z.string().email(t("error_email_required", "Email valide obligatoire")),
      topic: z.string().optional(),
      message: z.string().min(10, t("error_message_length", "Votre message doit contenir au moins 10 caractères")),
      consent: z.boolean().refine((val) => val === true, {
        message: t("error_consent_required", "Veuillez accepter la politique de confidentialité"),
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
      topic: topics[0]?.key || "topic_general",
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
        msg:
          hcConfig.contact.form.successModalMessage ||
          t("message_sent_success", "Votre message a été transmis avec succès. Notre équipe vous répondra sous 24h."),
      });
      reset({
        name: "",
        email: "",
        topic: topics[0]?.key || "topic_general",
        message: "",
        consent: false,
      });
      setSelectedTopic(topics[0]?.key || "topic_general");
    } catch {
      setModalStatus({
        open: true,
        type: "error",
        msg:
          hcConfig.contact.form.errorModalMessage ||
          t("message_sent_error", "Erreur lors de l'envoi du message. Vous pouvez nous écrire directement sur WhatsApp."),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (key: string) => {
    setSelectedTopic(key);
    setValue("topic", key);
  };

  // =========================================================================
  // À PROPOS DATA (Dynamic from HelpCenterCmsConfig)
  // =========================================================================
  const corpuses = useMemo(
    () => hcConfig.about.corpuses.filter((c) => c.published !== false),
    [hcConfig.about.corpuses]
  );

  const whyUs = useMemo(
    () => hcConfig.about.whyUs.filter((w) => w.published !== false),
    [hcConfig.about.whyUs]
  );

  const sectionsExploration = useMemo(
    () => hcConfig.about.explorations.filter((e) => e.published !== false),
    [hcConfig.about.explorations]
  );

  // =========================================================================
  // FAQ DATA & STATE (Dynamic from HelpCenterCmsConfig)
  // =========================================================================
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const faqCategories = hcConfig.faq.categories;
  const faqList = useMemo(
    () => hcConfig.faq.questions.filter((q) => q.published !== false),
    [hcConfig.faq.questions]
  );

  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const matchesCategory = selectedFaqCategory === "all" || item.category === selectedFaqCategory;
      const q = faqSearchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchQ = item.q.toLowerCase().includes(q);
      const matchA = item.a.toLowerCase().includes(q);
      const matchBadge = item.badge?.toLowerCase().includes(q);

      return matchesCategory && (matchQ || matchA || matchBadge);
    });
  }, [faqList, selectedFaqCategory, faqSearchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleExpandAll = () => {
    setExpandedFaqId((prev) => (prev === "ALL" ? null : "ALL"));
  };

  // Legal links
  const legalLinks = useMemo(
    () => hcConfig.legal.cards.filter((l) => l.published !== false),
    [hcConfig.legal.cards]
  );

  const seoKeywordsByLocale: Record<string, string[]> = {
    fr: ["Centre d'Aide", "Contact Roots Tunisia", "À Propos", "FAQ", "Archives de Tunisie", "INPDP", "Généalogie Tunisie"],
    en: ["Help Center", "Contact Roots Tunisia", "About & Mission", "FAQ", "Tunisian Archives", "INPDP", "Tunisia Genealogy"],
    ar: ["مركز المساعدة", "اتصل بنا جذور تونس", "عن المنصة", "الأسئلة الشائعة", "الأرشيف التونسي", "حماية المعطيات", "أنساب تونس"],
    es: ["Centro de Ayuda", "Contacto Roots Tunisia", "Acerca de", "Preguntas Frecuentes", "Archivos de Túnez", "INPDP", "Genealogía Túnez"],
    it: ["Centro Assistenza", "Contatti Roots Tunisia", "Chi Siamo", "Domande Frequenti", "Archivi della Tunisia", "INPDP", "Genealogia Tunisia"],
    mt: ["Ċentru ta' Għajnuna", "Kuntatt Roots Tunisia", "Fuqna", "Mistoqsijiet Frekwenti", "Arkivji tat-Tuneżija", "INPDP", "Ġenealoġija Tuneżija"],
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen pb-16">
      <SEO
        title={`${heroTitle} — Roots Tunisia`}
        description={heroSubtitle}
        keywords={seoKeywordsByLocale[cleanLocale] || seoKeywordsByLocale.fr}
      />

      {/* Confirmation Modal */}
      {modalStatus.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="surface-card frame-gold p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative bg-[var(--card)]">
            <button
              type="button"
              aria-label={t("close", "Fermer")}
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
                ? hcConfig.contact.form.successModalTitle || t("message_sent_title", "Message Transmis")
                : hcConfig.contact.form.errorModalTitle || t("transmission_error", "Erreur d'Envoi")}
            </h3>

            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
              {modalStatus.msg}
            </p>

            <button
              type="button"
              onClick={() => setModalStatus({ ...modalStatus, open: false })}
              className="btn-base btn-gold w-full text-sm font-semibold py-2.5 cursor-pointer"
            >
              {t("close", "Fermer")}
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImage}
      />

      {/* ========================================================================= */}
      {/* INNER PAGES NAVIGATION BAR (Tabbed Sub-pages Switcher)                     */}
      {/* ========================================================================= */}
      <section className="w-full px-4 -mt-8 sm:-mt-10 relative z-30 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="surface-card frame-gold p-2 sm:p-2.5 rounded-2xl shadow-xl bg-[var(--card)]/95 backdrop-blur-md flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleTabChange("contact")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "contact"
                  ? "bg-[var(--gold)] text-[#1f160f] shadow-md scale-[1.02]"
                  : "text-[var(--foreground)]/80 hover:bg-[var(--gold)]/15 hover:text-[var(--foreground)]"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{hcConfig.tabLabels.contact || t("tab_contact_direct", "Contact Direct")}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("about")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-[var(--gold)] text-[#1f160f] shadow-md scale-[1.02]"
                  : "text-[var(--foreground)]/80 hover:bg-[var(--gold)]/15 hover:text-[var(--foreground)]"
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>{hcConfig.tabLabels.about || t("tab_about_mission", "À Propos & Mission")}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("faq")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "faq"
                  ? "bg-[var(--gold)] text-[#1f160f] shadow-md scale-[1.02]"
                  : "text-[var(--foreground)]/80 hover:bg-[var(--gold)]/15 hover:text-[var(--foreground)]"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{hcConfig.tabLabels.faq || t("tab_faq", "Foire Aux Questions")}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("legal")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "legal"
                  ? "bg-[var(--gold)] text-[#1f160f] shadow-md scale-[1.02]"
                  : "text-[var(--foreground)]/80 hover:bg-[var(--gold)]/15 hover:text-[var(--foreground)]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{hcConfig.tabLabels.legal || t("tab_legal_framework", "Cadre Légal")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INNER VIEW 1: CONTACT DIRECT                                              */}
      {/* ========================================================================= */}
      {activeTab === "contact" && (
        <section className="w-full px-4 pt-10 sm:px-6 lg:px-8 animate-in fade-in duration-200">
          <div className="mx-auto w-full max-w-[var(--content-max)] space-y-8">
            {/* Direct Cards (4 Columns) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
              {phone ? (
                <a
                  href={`tel:${phoneHref}`}
                  className="surface-card group p-5 rounded-2xl border border-[var(--gold)]/35 hover:border-[var(--gold)] transition-all bg-[var(--card)]/95 shadow-md flex flex-col justify-between text-start"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[0.7rem] uppercase font-bold text-[var(--muted-foreground)]">
                        {hcConfig.contact.cards.phoneLabel}
                      </p>
                      <p dir="ltr" className="font-display text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--gold)]">
                        {phone}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[var(--gold)]/15 text-[0.7rem] font-bold text-[var(--gold)] flex items-center justify-between">
                    <span>{hcConfig.contact.cards.phoneCta}</span>
                    <span>{isRtl ? "←" : "→"}</span>
                  </div>
                </a>
              ) : null}

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card group p-5 rounded-2xl border border-emerald-500/35 hover:border-emerald-500 transition-all bg-[var(--card)]/95 shadow-md flex flex-col justify-between text-start"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 shrink-0">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[0.7rem] uppercase font-bold text-[var(--muted-foreground)]">
                        {hcConfig.contact.cards.whatsappLabel}
                      </p>
                      <p dir="ltr" className="font-display text-sm font-bold text-[var(--foreground)] group-hover:text-emerald-500">
                        {waDisplay || hcConfig.contact.cards.whatsappLabel}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-500/15 text-[0.7rem] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                    <span>{hcConfig.contact.cards.whatsappCta}</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
              ) : null}

              <a
                href={`mailto:${email}`}
                className="surface-card group p-5 rounded-2xl border border-[var(--gold)]/35 hover:border-[var(--gold)] transition-all bg-[var(--card)]/95 shadow-md flex flex-col justify-between text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase font-bold text-[var(--muted-foreground)]">
                      {hcConfig.contact.cards.emailLabel}
                    </p>
                    <p className="font-display text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] truncate max-w-[170px]">
                      {email}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-[var(--gold)]/15 text-[0.7rem] font-bold text-[var(--gold)] flex items-center justify-between">
                  <span>{hcConfig.contact.cards.emailCta}</span>
                  <span>{isRtl ? "←" : "→"}</span>
                </div>
              </a>

              <div className="surface-card p-5 rounded-2xl border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex flex-col justify-between text-start">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase font-bold text-[var(--muted-foreground)]">
                      {hcConfig.contact.cards.hoursLabel}
                    </p>
                    <p className="text-xs font-bold text-[var(--foreground)] leading-tight">
                      {hours}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-[var(--gold)]/15 text-[0.7rem] font-bold text-[var(--gold)] flex items-center justify-between">
                  <span>{hcConfig.contact.cards.hoursCta}</span>
                  <Check className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Form & Support Desk */}
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Main Contact Form */}
              <div className="surface-card frame-gold p-6 sm:p-8 rounded-2xl shadow-xl bg-[var(--card)]/95 text-start lg:col-span-8">
                <div>
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                    {hcConfig.contact.form.eyebrow}
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-1">
                    {hcConfig.contact.form.title}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {hcConfig.contact.form.subtitle}
                  </p>
                </div>

                {/* Topic Pills */}
                <div className="mt-5">
                  <label className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)] block mb-2">
                    {hcConfig.contact.form.topicsLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((tp) => {
                      const isActive = selectedTopic === tp.key;
                      return (
                        <button
                          key={tp.key}
                          type="button"
                          onClick={() => handleSelectTopic(tp.key)}
                          className={`px-3 py-1.5 text-xs rounded-xl border transition-all cursor-pointer ${
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

                <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="grid gap-1.5">
                      <span className="text-xs font-semibold text-[var(--foreground)]/80">
                        {hcConfig.contact.form.nameLabel} <span className="text-red-500">*</span>
                      </span>
                      <input
                        {...register("name")}
                        className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                        placeholder={hcConfig.contact.form.namePlaceholder}
                      />
                      {errors.name && <p className="text-[0.7rem] text-red-500">{errors.name.message}</p>}
                    </label>

                    <label className="grid gap-1.5">
                      <span className="text-xs font-semibold text-[var(--foreground)]/80">
                        {hcConfig.contact.form.emailLabel} <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="email"
                        {...register("email")}
                        className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                        placeholder={hcConfig.contact.form.emailPlaceholder}
                      />
                      {errors.email && <p className="text-[0.7rem] text-red-500">{errors.email.message}</p>}
                    </label>
                  </div>

                  <label className="grid gap-1.5">
                    <span className="text-xs font-semibold text-[var(--foreground)]/80">
                      {hcConfig.contact.form.messageLabel} <span className="text-red-500">*</span>
                    </span>
                    <textarea
                      {...register("message")}
                      rows={5}
                      className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                      placeholder={hcConfig.contact.form.messagePlaceholder}
                    />
                    {errors.message && <p className="text-[0.7rem] text-red-500">{errors.message.message}</p>}
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none text-[0.72rem] text-[var(--muted-foreground)]">
                    <input
                      type="checkbox"
                      {...register("consent")}
                      className="mt-0.5 rounded border-[var(--border)] text-[var(--gold)] focus:ring-[var(--gold)]"
                    />
                    <span>{hcConfig.contact.form.consentText}</span>
                  </label>
                  {errors.consent && <p className="text-[0.7rem] text-red-500">{errors.consent.message}</p>}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-base btn-gold px-6 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Send className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                      <span>
                        {loading
                          ? hcConfig.contact.form.sendingButtonLabel
                          : hcConfig.contact.form.submitButtonLabel}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Side Assistance & Socials */}
              <div className="space-y-4 lg:col-span-4 text-start">
                <div className="surface-card frame-gold p-5 rounded-2xl shadow-md bg-[var(--card)]/95 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                        {hcConfig.contact.sidebar.deskTitle}
                      </h4>
                      <p className="text-[0.68rem] text-[var(--gold)] font-bold">
                        {hcConfig.contact.sidebar.deskSubtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    {hcConfig.contact.sidebar.deskDescription}
                  </p>
                  <Link
                    to={hcConfig.contact.sidebar.deskLinkTo || "/services"}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] hover:underline pt-1"
                  >
                    <span>{hcConfig.contact.sidebar.deskLinkLabel}</span>
                  </Link>
                </div>

                {activeSocialLinks.length > 0 && (
                  <div className="surface-card p-5 rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)]/95 space-y-3">
                    <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                      {hcConfig.contact.sidebar.platformsTitle}
                    </h4>
                    <div className="space-y-2 text-xs">
                      {activeSocialLinks.map((link) => {
                        const SocialIcon = FOOTER_SOCIAL_ICON_MAP[link.icon] || Globe;
                        const cardStyle =
                          PLATFORM_CARD_STYLES[link.icon] ||
                          "bg-[var(--gold)]/5 hover:bg-[var(--gold)]/10 border-[var(--gold)]/20 text-[var(--gold)]";
                        const label = getPlatformLabel(link.icon, cleanLocale, {
                          whatsapp: hcConfig.contact.sidebar.whatsappPlatformLabel,
                          facebook: hcConfig.contact.sidebar.facebookPlatformLabel,
                          instagram: hcConfig.contact.sidebar.instagramPlatformLabel,
                        });
                        return (
                          <a
                            key={link.id}
                            href={link.resolvedHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-between p-2 rounded-xl border font-semibold transition-colors ${cardStyle}`}
                          >
                            <span className="flex items-center gap-2">
                              <SocialIcon className="w-4 h-4 shrink-0" />
                              <span>{label}</span>
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 rtl:-scale-x-100" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* INNER VIEW 2: À PROPOS & MISSION (Preuve Documentaire)                    */}
      {/* ========================================================================= */}
      {activeTab === "about" && (
        <section className="w-full px-4 pt-10 sm:px-6 lg:px-8 animate-in fade-in duration-200">
          <div className="mx-auto w-full max-w-[var(--content-max)] space-y-10">
            {/* Mission Statement */}
            <div className="surface-card frame-gold p-8 sm:p-10 rounded-3xl shadow-xl bg-[var(--card)]/95 text-center relative overflow-hidden">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                {hcConfig.about.mission.eyebrow}
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)] mt-2">
                {hcConfig.about.mission.title}{" "}
                <span className="text-gradient-gold">{hcConfig.about.mission.titleHighlight}</span>
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-[var(--foreground)]/80 max-w-2xl mx-auto leading-relaxed">
                {hcConfig.about.mission.description}
              </p>
            </div>

            {/* Corpuses */}
            <div className="space-y-4">
              <div className="text-start">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                  {hcConfig.about.corpusesHeader.eyebrow}
                </span>
                <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--foreground)] mt-0.5">
                  {hcConfig.about.corpusesHeader.title}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {corpuses.map((corpus) => {
                  const IconComponent = resolveIcon(corpus.icon, Building);
                  return (
                    <div
                      key={corpus.id}
                      className="surface-card frame-gold p-5 rounded-2xl shadow-sm border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all flex flex-col justify-between text-start"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)]">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30">
                            {corpus.meta}
                          </span>
                        </div>
                        <h5 className="font-cinzel text-base font-bold text-[var(--foreground)]">
                          {corpus.title}
                        </h5>
                        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                          {corpus.desc}
                        </p>
                      </div>
                      <div className="pt-2.5 mt-3 border-t border-[var(--gold)]/15 text-[0.7rem] font-medium text-[var(--gold)] flex items-center gap-1.5">
                        <FolderArchive className="w-3.5 h-3.5 shrink-0" />
                        <span>{corpus.depot}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why Us */}
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-[var(--gold)]/35 bg-[var(--gold)]/5 shadow-md space-y-4 text-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                  {hcConfig.about.whyUsHeader.eyebrow}
                </span>
                <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--foreground)] mt-0.5">
                  {hcConfig.about.whyUsHeader.title}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {whyUs.map((col) => {
                  const IconComp = resolveIcon(col.icon, CheckCircle2);
                  return (
                    <div
                      key={col.id}
                      className="p-4 rounded-xl bg-[var(--card)]/90 border border-[var(--gold)]/25 flex flex-col justify-between shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)]">
                          <IconComp className="h-4 w-4" />
                        </div>
                        <h5 className="font-cinzel text-xs font-bold text-[var(--foreground)]">
                          {col.title}
                        </h5>
                        <p className="text-[0.75rem] text-[var(--muted-foreground)] leading-relaxed">
                          {col.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Exploration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-start">
              {sectionsExploration.map((sec) => {
                const IconComp = resolveIcon(sec.icon, Compass);
                return (
                  <Link
                    key={sec.id}
                    to={sec.to}
                    className="surface-card p-4 rounded-2xl border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)]">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <h6 className="font-cinzel text-xs font-bold text-[var(--foreground)] group-hover:text-[var(--gold)]">
                        {sec.title}
                      </h6>
                      <p className="text-[0.72rem] text-[var(--muted-foreground)]">
                        {sec.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[var(--gold)]/15 text-[0.7rem] font-bold text-[var(--gold)] flex items-center justify-between">
                      <span>{sec.ctaLabel || t("explore")}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* INNER VIEW 3: FOIRE AUX QUESTIONS (FAQ)                                   */}
      {/* ========================================================================= */}
      {activeTab === "faq" && (
        <section className="w-full px-4 pt-10 sm:px-6 lg:px-8 animate-in fade-in duration-200">
          <div className="mx-auto w-full max-w-[var(--content-max)] space-y-6">
            {/* Search Header */}
            <div className="surface-card frame-gold p-6 sm:p-8 rounded-3xl shadow-xl bg-[var(--card)]/95 text-center relative overflow-hidden">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                {hcConfig.faq.header.eyebrow}
              </span>
              <h3 className="font-cinzel text-xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
                {hcConfig.faq.header.title}{" "}
                <span className="text-gradient-gold">{hcConfig.faq.header.titleHighlight}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--foreground)]/75 max-w-xl mx-auto leading-relaxed">
                {hcConfig.faq.header.subtitle}
              </p>

              <div className="mt-5 max-w-lg mx-auto relative">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold)]" />
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder={hcConfig.faq.header.searchPlaceholder}
                  className="w-full ps-11 pe-9 py-2.5 rounded-2xl border border-[var(--gold)]/40 bg-[var(--background)]/90 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]"
                />
                {faqSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery("")}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-[var(--foreground)]/50 hover:text-[var(--foreground)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills & Expand All */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {faqCategories.map((cat) => {
                  const IconC = resolveIcon(cat.icon, HelpCircle);
                  const isSelected = selectedFaqCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedFaqCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[var(--gold)] text-[#1f160f] font-bold shadow"
                          : "surface-card border border-[var(--gold)]/30 text-[var(--foreground)]/80 hover:border-[var(--gold)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <IconC className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleExpandAll}
                className="text-xs font-bold text-[var(--gold)] hover:underline self-start sm:self-auto cursor-pointer"
              >
                {expandedFaqId === "ALL"
                  ? hcConfig.faq.header.collapseAllLabel
                  : hcConfig.faq.header.expandAllLabel}
              </button>
            </div>

            {/* Questions Accordion */}
            <div className="space-y-2.5 text-start">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[var(--gold)]/30 rounded-2xl space-y-2">
                  <p className="text-xs text-[var(--foreground)]/70">{hcConfig.faq.header.emptySearchText}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFaqSearchQuery("");
                      setSelectedFaqCategory("all");
                    }}
                    className="px-3 py-1 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-xs font-bold text-[var(--gold)]"
                  >
                    {hcConfig.faq.header.resetFiltersLabel}
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = expandedFaqId === "ALL" || expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`surface-card rounded-2xl border transition-all ${
                        isOpen
                          ? "border-[var(--gold)] shadow-sm bg-[var(--card)]"
                          : "border-[var(--gold)]/25 hover:border-[var(--gold)]/50 bg-[var(--card)]/90"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="space-y-0.5 pe-2">
                          {faq.badge && (
                            <span className="inline-block px-2 py-0.2 rounded-full text-[0.62rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-0.5">
                              {faq.badge}
                            </span>
                          )}
                          <h5 className="text-xs sm:text-sm font-cinzel font-bold text-[var(--foreground)] leading-snug">
                            {faq.q}
                          </h5>
                        </div>
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-[var(--foreground)]/80 leading-relaxed border-t border-[var(--gold)]/15 pt-3 animate-in fade-in duration-150">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Support CTA Card */}
            <div className="surface-card frame-gold p-6 sm:p-8 rounded-3xl shadow-xl bg-[var(--card)]/95 text-center space-y-4">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                {hcConfig.faq.bottomCta.eyebrow}
              </span>
              <h4 className="font-cinzel text-lg sm:text-2xl font-bold text-[var(--foreground)]">
                {hcConfig.faq.bottomCta.title}
              </h4>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl mx-auto">
                {hcConfig.faq.bottomCta.subtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{hcConfig.faq.bottomCta.whatsappLabel}</span>
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleTabChange("contact")}
                  className="btn-base btn-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>{hcConfig.faq.bottomCta.contactLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* INNER VIEW 4: CADRE LÉGAL & MENTIONS                                      */}
      {/* ========================================================================= */}
      {activeTab === "legal" && (
        <section className="w-full px-4 pt-10 sm:px-6 lg:px-8 animate-in fade-in duration-200">
          <div className="mx-auto w-full max-w-[var(--content-max)] space-y-6 text-start">
            <div className="surface-card frame-gold p-6 sm:p-8 rounded-3xl shadow-xl bg-[var(--card)]/95">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                {hcConfig.legal.header.eyebrow}
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-1">
                {hcConfig.legal.header.title}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed max-w-3xl">
                {hcConfig.legal.header.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {legalLinks.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="surface-card group p-5 rounded-2xl border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all flex flex-col justify-between shadow-sm hover:-translate-y-1"
                >
                  <div>
                    <h5 className="font-cinzel text-xs sm:text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[0.72rem] text-[var(--muted-foreground)] mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-[var(--gold)]/15 text-[0.7rem] font-bold text-[var(--gold)] flex items-center justify-between">
                    <span>{item.ctaLabel || t("read_document")}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteCustomBlocks pageId="contact" />
    </div>
  );
}
