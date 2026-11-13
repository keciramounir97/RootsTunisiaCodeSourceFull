import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHero, Section } from "../components/site/Primitives";
import eljem from "../assets/eljem.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { PeriodCard } from "../components/PeriodCard";
import { usePeriodsCmsConfig } from "../utils/periodsCmsConfig";
import {
  Compass,
  BookOpen,
  History,
  Search,
  X,
  Landmark,
  Crown,
  Scroll,
  Shield,
  FolderArchive,
} from "lucide-react";

interface PeriodStats {
  total: number;
  documents: number;
  trees: number;
  books: number;
  gallery: number;
  audios: number;
}

const CATEGORY_ICONS: Record<string, any> = {
  Landmark,
  Crown,
  Scroll,
  Shield,
  History,
  FolderArchive,
};

const UI_LABELS_BY_LOCALE: Record<
  string,
  {
    allEras: string;
    searchPlaceholder: string;
    noPeriodsTitle: string;
    noPeriodsDesc: string;
    resetFilters: string;
  }
> = {
  fr: {
    allEras: "Toutes les époques",
    searchPlaceholder: "Filtrer par époque, capitale, dynastie...",
    noPeriodsTitle: "Aucune période trouvée",
    noPeriodsDesc: "Aucune période historique ne correspond à votre recherche ou filtre actuel.",
    resetFilters: "Réinitialiser les filtres",
  },
  en: {
    allEras: "All Historical Eras",
    searchPlaceholder: "Filter by era, capital, dynasty...",
    noPeriodsTitle: "No historical period found",
    noPeriodsDesc: "No historical era matches your current search or category filter.",
    resetFilters: "Reset filters",
  },
  ar: {
    allEras: "جميع الحقب التاريخية",
    searchPlaceholder: "تصفية حسب الحقبة أو العاصمة أو السلالة...",
    noPeriodsTitle: "لم يتم العثور على أي حقبة",
    noPeriodsDesc: "لا توجد حقبة تاريخية تطابق معايير البحث أو التصفية الحالية.",
    resetFilters: "إعادة ضبط الفلاتر",
  },
  es: {
    allEras: "Todas las épocas",
    searchPlaceholder: "Filtrar por época, capital, dinastía...",
    noPeriodsTitle: "Ningún período encontrado",
    noPeriodsDesc: "Ninguna época histórica coincide con su búsqueda o filtro actual.",
    resetFilters: "Restablecer filtros",
  },
  it: {
    allEras: "Tutte le epoche",
    searchPlaceholder: "Filtra per epoca, capitale, dinastia...",
    noPeriodsTitle: "Nessuna epoca trovata",
    noPeriodsDesc: "Nessuna epoca storica corrisponde alla ricerca o al filtro selezionato.",
    resetFilters: "Reimposta filtri",
  },
  mt: {
    allEras: "L-epoki kollha",
    searchPlaceholder: "Iffiltra skont l-epoka, kapitali, dinastija...",
    noPeriodsTitle: "L-ebda perjodu ma nstab",
    noPeriodsDesc: "L-ebda epoka storika ma taqbel mat-tfittxija jew mal-filtru attwali.",
    resetFilters: "Irrisettja l-filtri",
  },
};

export default function Periods() {
  const { locale, isRtl } = useTranslation();
  const { config } = usePeriodsCmsConfig();
  const ui = UI_LABELS_BY_LOCALE[(locale || "fr").toLowerCase()] || UI_LABELS_BY_LOCALE.fr;
  const [statsMap, setStatsMap] = useState<Record<string, PeriodStats>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/periods/stats")
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data || res.data || {};
        setStatsMap(data);
      })
      .catch(() => {
        setStatsMap({
          ottomane: { total: 2, documents: 1, trees: 0, books: 0, gallery: 1, audios: 0 },
          husseinite: { total: 2, documents: 1, trees: 1, books: 0, gallery: 0, audios: 0 },
          hafside: { total: 1, documents: 0, trees: 0, books: 1, gallery: 0, audios: 0 },
          protectorat: { total: 1, documents: 1, trees: 0, books: 0, gallery: 0, audios: 0 },
          republique: { total: 1, documents: 1, trees: 0, books: 0, gallery: 0, audios: 0 },
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const publishedPeriods = useMemo(() => {
    return config.periods.filter((p) => p.isPublished !== false);
  }, [config.periods]);

  const filteredPeriods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return publishedPeriods.filter((era) => {
      const matchCat = activeCategory === "all" || era.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const text = `${era.title} ${era.arabicTitle} ${era.displayPeriod} ${era.capital} ${era.empire} ${era.devletName} ${era.description}`.toLowerCase();
      return text.includes(q);
    });
  }, [publishedPeriods, activeCategory, searchQuery]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen pb-20">
      <SEO
        title={`${config.hero.title} | Roots Tunisia`}
        description={config.hero.subtitle}
        keywords={[
          "Périodes historiques Tunisie",
          "Histoire de la Tunisie",
          "Carthage punique",
          "Empire romain Tunisie",
          "Régence ottomane de Tunis 1600",
          "Sultanat hafside",
          "Beylicat husseinite",
        ]}
      />

      {/* Page Hero */}
      <PageHero
        eyebrow={config.hero.eyebrow}
        title={config.hero.title}
        subtitle={config.hero.subtitle}
        image={config.hero.image || eljem}
      >
        <Link
          to={config.hero.ctaPrimaryLink || "/interactive-map"}
          className="btn-base btn-gold w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg"
        >
          <Compass className="w-4 h-4" />
          <span>{config.hero.ctaPrimaryLabel}</span>
        </Link>
        <Link
          to={config.hero.ctaSecondaryLink || "/sources"}
          className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-[var(--gold)]" />
          <span>{config.hero.ctaSecondaryLabel}</span>
        </Link>
      </PageHero>

      {/* Summary KPI Ribbon & Category Filter Strip */}
      <section className="w-full px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)] space-y-5">
          <div className="surface-card frame-gold p-4 sm:p-5 rounded-2xl bg-[var(--card)]/95 shadow-lg border border-[var(--gold)]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <p className="font-cinzel text-sm sm:text-base font-bold text-[var(--foreground)]">
                  {config.kpi.title}
                </p>
                <p className="text-[0.72rem] text-[var(--muted-foreground)]">
                  {config.kpi.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--gold)]">
              <span className="hidden sm:inline">{config.kpi.rightText}</span>
              <span className="px-2.5 py-1 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[0.68rem] font-mono font-bold">
                {config.kpi.badge}
              </span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-[var(--gold)] text-[#1f160f] shadow-md"
                    : "surface-card border border-[var(--gold)]/30 text-[var(--foreground)]/80 hover:border-[var(--gold)]"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>
                  {ui.allEras} ({publishedPeriods.length})
                </span>
              </button>

              {config.categories.map((cat) => {
                const IconComp = CATEGORY_ICONS[cat.icon] || Landmark;
                const count = publishedPeriods.filter((p) => p.category === cat.key).length;
                const isSelected = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-serif font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-[var(--gold)] text-[#1f160f] font-bold shadow-md"
                        : "surface-card border border-[var(--gold)]/30 text-[var(--foreground)]/80 hover:border-[var(--gold)]"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>
                      {cat.label} ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={ui.searchPlaceholder}
                className="w-full rounded-xl border border-[var(--gold)]/30 bg-[var(--card)] ps-9 pe-8 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <Section>
        <div className="w-full max-w-[var(--content-max)] mx-auto">
          {filteredPeriods.length === 0 ? (
            <div className="surface-card frame-gold p-10 text-center rounded-2xl max-w-lg mx-auto my-6 space-y-3 border border-[var(--gold)]/30">
              <p className="font-cinzel text-lg font-bold text-[var(--foreground)]">
                {ui.noPeriodsTitle}
              </p>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                {ui.noPeriodsDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="btn-base btn-gold text-xs py-2 px-5 font-bold cursor-pointer mt-2"
              >
                {ui.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch relative">
              {filteredPeriods.map((era, index) => {
                const isLast = index === filteredPeriods.length - 1;
                const nextEra = !isLast ? filteredPeriods[index + 1] : null;
                const stats = statsMap[era.id] || { total: 0 };

                return (
                  <PeriodCard
                    key={era.id}
                    era={era}
                    index={index}
                    stats={stats}
                    nextEra={nextEra}
                    buttonLabel={config.kpi.cardButtonLabel}
                    className="h-full"
                  />
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
