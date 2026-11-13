import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Landmark,
  Clock,
  Sparkles,
  FileCheck,
  RefreshCw,
  Scroll,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";
import {
  DEFAULT_SERVICES_CATALOG,
  SERVICES_UI_BY_LOCALE,
  localizeServiceItem,
} from "../utils/servicesCatalogI18n";
import { buildConfiguredWhatsAppUrl } from "../utils/whatsAppContact";
import medinaDoor from "../assets/16_Medina_Ornate_Door_Blue_Grille.jpg";
import kairouanMosque from "../assets/14_Kairouan_Mosque_Arched_Doorways_Dome.jpg";
import manuscript from "../assets/manuscript.jpg";
import familyArchive from "../assets/family-archive.jpg";
import fortressPalms from "../assets/17_Fortress_Aerial_Courtyard_Palms.jpg";
import carthageRuins from "../assets/01_Carthage_Ancient_Ruins_Landscape.jpg";

const SERVICES_HERO_SLIDES = [
  { image: manuscript, captionKey: "pill1" as const },
  { image: familyArchive, captionKey: "pill2" as const },
  { image: medinaDoor, captionKey: "pill3" as const },
  { image: kairouanMosque, captionKey: "pill4" as const },
  { image: fortressPalms, captionKey: "methodEyebrow" as const },
  { image: carthageRuins, captionKey: "freeConsultationBadge" as const },
];

export interface CustomService {
  id: number;
  slug: string;
  title: string;
  category: string;
  price_eur: number | string;
  price_usd: number | string;
  price_tnd: number | string;
  billing_unit: string;
  description: string;
  full_offer?: string;
  deliverables?: string[] | string;
  whatsapp_prefill?: string;
  contact_phone?: string;
  order_index?: number;
  is_active?: boolean | number;
  booking_count?: number;
}

export default function ServicesPage() {
  const { locale, isRtl } = useTranslation();
  const cleanLocale = (locale || "fr").toLowerCase();
  const ui = SERVICES_UI_BY_LOCALE[cleanLocale] || SERVICES_UI_BY_LOCALE.fr;
  const [rawServices, setRawServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const whatsappUrl = buildConfiguredWhatsAppUrl(
    ui.defaultWhatsappPrefill(ui.heroTitleMain),
  );

  useEffect(() => {
    if (SERVICES_HERO_SLIDES.length === 0) return;
    const id = setInterval(
      () => setActiveSlide((i) => (i + 1) % SERVICES_HERO_SLIDES.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await api.get("/services");
      const raw = res.data as any;
      const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
      setRawServices(list.length > 0 ? list : DEFAULT_SERVICES_CATALOG);
    } catch (err: any) {
      console.error("Failed to load services:", err);
      setRawServices(DEFAULT_SERVICES_CATALOG);
      setHasError(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    setSelectedCategory("all");
  }, [cleanLocale]);

  const services = useMemo(
    () => rawServices.map((s) => localizeServiceItem(s, cleanLocale)),
    [rawServices, cleanLocale]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["all", ...Array.from(set)];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory =
        selectedCategory === "all" ||
        s.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const titleMatch = s.title?.toLowerCase().includes(q);
      const descMatch = s.description?.toLowerCase().includes(q);
      const categoryMatch = s.category?.toLowerCase().includes(q);

      let deliverableMatch = false;
      if (Array.isArray(s.deliverables)) {
        deliverableMatch = s.deliverables.some((d) => d.toLowerCase().includes(q));
      } else if (typeof s.deliverables === "string") {
        deliverableMatch = s.deliverables.toLowerCase().includes(q);
      }

      return matchesCategory && (titleMatch || descMatch || categoryMatch || deliverableMatch);
    });
  }, [services, selectedCategory, searchQuery]);

  const parseDeliverables = (d: any): string[] => {
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (typeof d === "string") {
      try {
        const parsed = JSON.parse(d);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return d.split("\n").map((line) => line.trim()).filter(Boolean);
      }
    }
    return [];
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-24"
    >
      <SEO
        title={ui.seoTitle}
        description={ui.seoDesc}
        keywords={ui.seoKeywords}
      />

      {/* Hero Diaporama — same visual pattern as homepage, Services page copy only */}
      <section className="w-full px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
        <div className="frame-gold relative mx-auto w-full max-w-[var(--content-max)] overflow-hidden rounded-md min-h-[420px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center">
          {SERVICES_HERO_SLIDES.map((slide, i) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={ui[slide.captionKey]}
              width={1600}
              height={1000}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="hero-scrim absolute inset-0" />

          <button
            type="button"
            aria-label={isRtl ? "Suivant" : "Précédent"}
            onClick={() =>
              setActiveSlide(
                (i) => (i - 1 + SERVICES_HERO_SLIDES.length) % SERVICES_HERO_SLIDES.length,
              )
            }
            className="absolute start-2 sm:start-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/40 bg-black/45 !text-white hover:bg-[#d9a441] hover:!text-[#1f160f] hover:border-[#d9a441] transition-colors cursor-pointer"
          >
            <ChevronLeft className={`h-4 w-4 sm:h-5 sm:w-5 ${isRtl ? "rotate-180" : ""}`} />
          </button>
          <button
            type="button"
            aria-label={isRtl ? "Précédent" : "Suivant"}
            onClick={() =>
              setActiveSlide((i) => (i + 1) % SERVICES_HERO_SLIDES.length)
            }
            className="absolute end-2 sm:end-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/40 bg-black/45 !text-white hover:bg-[#d9a441] hover:!text-[#1f160f] hover:border-[#d9a441] transition-colors cursor-pointer"
          >
            <ChevronRight className={`h-4 w-4 sm:h-5 sm:w-5 ${isRtl ? "rotate-180" : ""}`} />
          </button>

          <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-10 sm:px-16 sm:py-16 text-center">
            <p className="eyebrow !text-[#f5c857] text-shadow-dark !tracking-[0.14em] sm:!tracking-[0.28em] font-bold inline-flex max-w-[95%] flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-center leading-snug">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>{ui.heroEyebrow}</span>
            </p>
            <h1 className="display-xl mt-3 sm:mt-4 max-w-4xl !text-white font-bold hero-title-shadow text-shadow-glow tracking-wide px-1">
              {ui.heroTitleMain}{" "}
              <span className="text-[#f5c857]">{ui.heroTitleGold}</span>
            </h1>
            <div className="gold-rule mt-4 sm:mt-5 w-24 sm:w-32 mx-auto shadow-lg" />
            <p className="mt-4 sm:mt-5 max-w-2xl text-[0.8125rem] sm:text-base leading-relaxed !text-white drop-shadow-md font-medium px-1">
              {ui.heroSubtitle}
            </p>
            <div className="mt-6 sm:mt-8 flex w-full max-w-md sm:max-w-none sm:w-auto flex-col sm:flex-row flex-wrap justify-center gap-2.5 sm:gap-3 px-1">
              <a
                href="#services-catalog"
                className="btn-base btn-gold w-full sm:w-auto min-h-11 sm:min-w-[200px] inline-flex items-center justify-center gap-2 text-xs sm:text-sm px-4"
              >
                <span>{ui.bookFreeConsultationCta}</span>
                <ArrowRight className={`h-4 w-4 shrink-0 ${isRtl ? "rotate-180" : ""}`} />
              </a>
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-h-11 sm:min-w-[200px] inline-flex items-center justify-center gap-2 text-xs sm:text-sm px-4"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>{ui.chatWithAgentWhatsappCta}</span>
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-h-11 sm:min-w-[200px] inline-flex items-center justify-center gap-2 text-xs sm:text-sm px-4"
                >
                  <Scroll className="h-4 w-4 shrink-0" />
                  <span>{ui.formHeadingEmail}</span>
                </Link>
              )}
            </div>
            <div className="mt-5 sm:mt-6 flex w-full flex-col items-center gap-2 px-1">
              <span className="inline-flex max-w-[min(100%,22rem)] items-center justify-center gap-1.5 rounded-full border border-white/30 bg-black/45 px-3 py-1.5 text-[0.68rem] sm:text-xs font-semibold !text-[#f5c857] text-center leading-snug">
                <Landmark className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0">{ui[SERVICES_HERO_SLIDES[activeSlide]?.captionKey || "pill1"]}</span>
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1 mt-1" role="tablist" aria-label="Diaporama services">
                {SERVICES_HERO_SLIDES.map((slide, i) => (
                  <button
                    key={slide.image}
                    type="button"
                    role="tab"
                    aria-selected={i === activeSlide}
                    aria-label={`${ui[slide.captionKey]} — ${i + 1}`}
                    onClick={() => setActiveSlide(i)}
                    className="min-h-11 min-w-11 inline-flex items-center justify-center cursor-pointer"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all ${
                        i === activeSlide ? "w-8 sm:w-10 bg-[#f5c857]" : "w-3.5 sm:w-4 bg-white/60"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees strip under diaporama */}
      <section className="w-full px-3 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)] grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <div className="surface-card p-2.5 sm:p-3 rounded-lg border border-[var(--gold)]/30 flex items-start sm:items-center gap-2 min-h-[3.25rem]">
            <Landmark className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-[0.68rem] sm:text-xs font-medium leading-snug">{ui.pill1}</span>
          </div>
          <div className="surface-card p-2.5 sm:p-3 rounded-lg border border-[var(--gold)]/30 flex items-start sm:items-center gap-2 min-h-[3.25rem]">
            <FileCheck className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-[0.68rem] sm:text-xs font-medium leading-snug">{ui.pill2}</span>
          </div>
          <div className="surface-card p-2.5 sm:p-3 rounded-lg border border-[var(--gold)]/30 flex items-start sm:items-center gap-2 min-h-[3.25rem]">
            <ShieldCheck className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-[0.68rem] sm:text-xs font-medium leading-snug">{ui.pill3}</span>
          </div>
          <div className="surface-card p-2.5 sm:p-3 rounded-lg border border-[var(--gold)]/30 flex items-start sm:items-center gap-2 min-h-[3.25rem]">
            <Clock className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-[0.68rem] sm:text-xs font-medium leading-snug">{ui.pill4}</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div id="services-catalog" className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Search & Filter Controls */}
        <div className="flex w-full min-w-0 flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-8">
          <div className="relative w-full lg:max-w-md lg:shrink-0">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/45" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className="w-full min-h-11 ps-10 pe-4 py-2.5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)] text-sm focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--foreground)]/40"
            />
          </div>

          {categories.length > 2 && (
            <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch]">
              <div className="flex w-max max-w-none items-center gap-2 pe-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`min-h-9 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                      selectedCategory === cat
                        ? "bg-[var(--gold)] text-[var(--card)] shadow-md font-bold"
                        : "surface-card border border-[var(--gold)]/30 text-[var(--foreground)]/80 hover:border-[var(--gold)]"
                    }`}
                  >
                    {cat === "all" ? ui.allCategories : cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[var(--gold)] animate-spin" />
            <p className="text-sm font-medium text-[var(--foreground)]/70">
              {ui.loadingServices}
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && hasError && (
          <div className="surface-card p-6 rounded-lg border border-red-500/30 text-center max-w-md mx-auto my-12">
            <p className="text-sm text-red-500 mb-3">{ui.errorLoading}</p>
            <button
              onClick={fetchServices}
              className="px-4 py-2 rounded-md bg-[var(--gold)] text-[var(--card)] text-xs font-bold hover:opacity-90"
            >
              {ui.retryBtn}
            </button>
          </div>
        )}

        {/* Services Cards Grid */}
        {!loading && !hasError && filteredServices.length === 0 && (
          <div className="py-16 text-center surface-card rounded-lg border border-[var(--gold)]/20 p-8 max-w-lg mx-auto">
            <Briefcase className="w-12 h-12 text-[var(--gold)]/50 mx-auto mb-3" />
            <h3 className="font-cinzel text-lg font-bold">{ui.emptyTitle}</h3>
            <p className="text-xs text-[var(--foreground)]/70 mt-1">
              {ui.emptyDesc}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-md border border-[var(--gold)]/50 text-xs font-semibold hover:bg-[var(--gold)]/10"
            >
              {ui.resetFiltersBtn}
            </button>
          </div>
        )}

        {!loading && !hasError && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {filteredServices.map((service) => {
              const deliverables = parseDeliverables(service.deliverables);
              const waUrl = buildConfiguredWhatsAppUrl(
                service.whatsapp_prefill || ui.defaultWhatsappPrefill(service.title),
                service.contact_phone,
              );

              return (
                <div
                  key={service.id}
                  className="surface-card rounded-xl border border-[var(--gold)]/35 p-6 sm:p-7 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-[var(--gold)] transition-all duration-300 relative group"
                >
                  {/* Service Top Details */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                        {service.category || ui.defaultCategoryBadge}
                      </span>
                      <span className="text-[0.65rem] text-[var(--foreground)]/50 font-mono">
                        {ui.refPrefix}{service.id}
                      </span>
                    </div>

                    <h2 className="text-xl font-cinzel font-bold text-[var(--foreground)] leading-snug group-hover:text-[var(--gold)] transition-colors">
                      {service.title}
                    </h2>

                    {/* Consultation Gratuite & Devis Sur-Mesure - AUCUN PRIX AFFICHÉ */}
                    <div className="mt-4 pb-4 border-b border-[var(--gold)]/20">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)]">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-cinzel font-bold">
                          {ui.freeConsultationBadge}
                        </span>
                      </div>
                      <p className="text-[0.72rem] text-[var(--foreground)]/65 mt-1.5">
                        {ui.freeConsultationSub}
                      </p>
                    </div>

                    {/* Short Description */}
                    <p className="mt-4 text-xs sm:text-sm text-[var(--foreground)]/80 leading-relaxed font-body">
                      {service.description}
                    </p>

                    {/* Deliverables Bullets */}
                    {deliverables.length > 0 && (
                      <div className="mt-5 space-y-2">
                        <p className="text-[0.7rem] uppercase tracking-wider font-bold text-[var(--gold)]">
                          {ui.deliverablesIncludedLabel}
                        </p>
                        <ul className="space-y-1.5 text-xs text-[var(--foreground)]/85">
                          {deliverables.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 leading-relaxed">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions Bottom */}
                  <div className="mt-6 pt-5 border-t border-[var(--gold)]/20 space-y-2.5">
                    <Link
                      to={`/services/${service.slug || service.id}`}
                      className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/85 text-[var(--card)] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 hover:shadow-lg transition-all"
                    >
                      <span>{ui.bookFreeConsultationCta}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                    </Link>

                    {waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{ui.chatWithAgentWhatsappCta}</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Methodology & Commitment Section */}
        <section className="mt-20 surface-card rounded-2xl border border-[var(--gold)]/30 p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--gold)] mb-3">
              <Award className="w-4 h-4" />
              <span>{ui.methodEyebrow}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-[var(--foreground)]">
              {ui.methodTitle}
            </h3>
            <p className="mt-3 text-sm text-[var(--foreground)]/80 leading-relaxed font-body">
              {ui.methodDesc}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--gold)]/20">
              <div>
                <p className="text-lg font-bold font-cinzel text-[var(--gold)]">{ui.pillar1Title}</p>
                <p className="text-xs text-[var(--foreground)]/70 mt-0.5">
                  {ui.pillar1Desc}
                </p>
              </div>
              <div>
                <p className="text-lg font-bold font-cinzel text-[var(--gold)]">{ui.pillar2Title}</p>
                <p className="text-xs text-[var(--foreground)]/70 mt-0.5">
                  {ui.pillar2Desc}
                </p>
              </div>
              <div>
                <p className="text-lg font-bold font-cinzel text-[var(--gold)]">{ui.pillar3Title}</p>
                <p className="text-xs text-[var(--foreground)]/70 mt-0.5">
                  {ui.pillar3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Link CTA */}
        <div className="mt-16 text-center">
          <p className="text-xs text-[var(--foreground)]/70">
            {ui.faqQuestionText}
          </p>
          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] hover:underline mt-1.5"
          >
            <span>{ui.faqLinkCta}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}

