import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Landmark,
  Clock,
  Sparkles,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";
import {
  DEFAULT_SERVICES_CATALOG,
  SERVICES_UI_BY_LOCALE,
  localizeServiceItem,
} from "../utils/servicesCatalogI18n";

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

      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-[var(--gold)]/20 bg-gradient-to-b from-[var(--card)]/90 via-[var(--background)] to-[var(--background)]">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_50%_20%,var(--gold)_0%,transparent_60%)]" />
        <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ui.heroEyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-[var(--foreground)] tracking-tight leading-tight max-w-4xl mx-auto">
            {ui.heroTitleMain} <span className="text-gradient-gold">{ui.heroTitleGold}</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[var(--foreground)]/75 max-w-2xl mx-auto font-body leading-relaxed">
            {ui.heroSubtitle}
          </p>

          {/* Quick Stats / Guarantees Strip */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="surface-card p-3 rounded-lg border border-[var(--gold)]/30 flex items-center justify-center gap-2">
              <Landmark className="w-4 h-4 text-[var(--gold)] shrink-0" />
              <span className="text-xs font-medium">{ui.pill1}</span>
            </div>
            <div className="surface-card p-3 rounded-lg border border-[var(--gold)]/30 flex items-center justify-center gap-2">
              <FileCheck className="w-4 h-4 text-[var(--gold)] shrink-0" />
              <span className="text-xs font-medium">{ui.pill2}</span>
            </div>
            <div className="surface-card p-3 rounded-lg border border-[var(--gold)]/30 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--gold)] shrink-0" />
              <span className="text-xs font-medium">{ui.pill3}</span>
            </div>
            <div className="surface-card p-3 rounded-lg border border-[var(--gold)]/30 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-[var(--gold)] shrink-0" />
              <span className="text-xs font-medium">{ui.pill4}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/45" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)] text-sm focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--foreground)]/40"
            />
          </div>

          {categories.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[var(--gold)] text-[var(--card)] shadow-md font-bold"
                      : "surface-card border border-[var(--gold)]/30 text-[var(--foreground)]/80 hover:border-[var(--gold)]"
                  }`}
                >
                  {cat === "all" ? ui.allCategories : cat}
                </button>
              ))}
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
              const waUrl = service.whatsapp_prefill
                ? `https://wa.me/21671234567?text=${encodeURIComponent(service.whatsapp_prefill)}`
                : `https://wa.me/21671234567?text=${encodeURIComponent(ui.defaultWhatsappPrefill(service.title))}`;

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

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{ui.chatWithAgentWhatsappCta}</span>
                    </a>
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

