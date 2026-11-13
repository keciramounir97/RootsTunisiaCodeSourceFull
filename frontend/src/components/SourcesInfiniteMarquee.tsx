import React, { useState, useRef, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderArchive,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Section } from "./site/Primitives";
import { ARCHIVES_DIRECTORY } from "../pages/SourcesAndArchives";
import { SourceCard } from "./SourceCard";
import { useTranslation } from "../context/TranslationContext";
import {
  loadSourcesMultiLocaleStore,
  resolveLocalizedLocation,
  resolveLocalizedSourceCard,
} from "../utils/sourcesCmsConfig";

const SOURCES_MARQUEE_UI_BY_LOCALE: Record<
  string,
  { badge: string; title: string; desc: string; pause: string; resume: string; viewAll: string }
> = {
  fr: {
    badge: "Sources & Registres",
    title: "Sources & Archives Historiques",
    desc: "Archives nationales, registres d'état civil, fonds consulaires, rôles fiscaux et sijillats pour vos recherches généalogiques.",
    pause: "Pause",
    resume: "Reprendre",
    viewAll: "Consulter les Sources & Archives",
  },
  en: {
    badge: "Sources & Registers",
    title: "Historical Sources & Archives",
    desc: "National archives, civil status registers, consular holdings, fiscal rolls and notarial sijillats for your genealogical research.",
    pause: "Pause",
    resume: "Resume",
    viewAll: "Explore All Sources & Archives",
  },
  ar: {
    badge: "المصادر والسجلات",
    title: "المصادر والأرشيفات التاريخية",
    desc: "الأرشيف الوطني وسجلات الحالة المدنية والأرصدة القنصلية والدفاتر الجبائية والحجج العدلية لأبحاثكم في الأنساب.",
    pause: "إيقاف مؤقت",
    resume: "استئناف",
    viewAll: "تصفّح جميع المصادر والأرشيفات",
  },
  es: {
    badge: "Fuentes y Registros",
    title: "Fuentes y Archivos Históricos",
    desc: "Archivos nacionales, registros civiles, fondos consulares, padrones fiscales y sijillats notariales para sus investigaciones genealógicas.",
    pause: "Pausa",
    resume: "Reanudar",
    viewAll: "Consultar Fuentes y Archivos",
  },
  it: {
    badge: "Fonti e Registri",
    title: "Fonti e Archivi Storici",
    desc: "Archivi nazionali, registri di stato civile, fondi consolari, ruoli fiscali e sijill notarili per le tue ricerche genealogiche.",
    pause: "Pausa",
    resume: "Riprendi",
    viewAll: "Consulta Fonti e Archivi",
  },
  mt: {
    badge: "Sorsi u Reġistri",
    title: "Sorsi u Arkivji Storiċi",
    desc: "Arkivji nazzjonali, reġistri tal-istat ċivili, fondi konsulari, reġistri fiskali u sijillats nutarili għar-riċerka ġenealoġika tiegħek.",
    pause: "Pawża",
    resume: "Kompli",
    viewAll: "Esplora s-Sorsi u l-Arkivji",
  },
};

export const SourcesInfiniteMarquee: React.FC = () => {
  const { t, locale, isRtl } = useTranslation();
  const cleanLoc = (locale || "fr").toLowerCase();
  const ui = SOURCES_MARQUEE_UI_BY_LOCALE[cleanLoc] || SOURCES_MARQUEE_UI_BY_LOCALE.fr;
  const [isPaused, setIsPaused] = useState(false);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const [sourcesStore, setSourcesStore] = useState(() => loadSourcesMultiLocaleStore());

  useEffect(() => {
    const onStoreUpdate = () => setSourcesStore(loadSourcesMultiLocaleStore());
    window.addEventListener("roots_sources_cms_updated", onStoreUpdate);
    return () => window.removeEventListener("roots_sources_cms_updated", onStoreUpdate);
  }, []);

  const handleManualNudge = (direction: "left" | "right") => {
    if (marqueeContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      marqueeContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const localizedArchives = useMemo(() => {
    const cleanLocale = (locale || "fr").toLowerCase();
    return ARCHIVES_DIRECTORY.map((item) => {
      const localized = resolveLocalizedSourceCard(item, cleanLocale, sourcesStore);
      const locInfo = resolveLocalizedLocation(
        { key: localized.category, label: localized.categoryLabel },
        cleanLocale,
        sourcesStore
      );
      return {
        ...localized,
        categoryLabel: locInfo.label || localized.categoryLabel,
      };
    });
  }, [locale, sourcesStore]);

  // Two identical sets of the archive items for seamless infinite translateX loop
  const duplicatedArchives = [...localizedArchives, ...localizedArchives];

  return (
    <Section id="sources-infinite-marquee" className="!pt-6 !pb-10 overflow-hidden relative">
      {/* Header with Title, Eyebrow, CTAs and Controls */}
      <div className="w-full max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[var(--gold)]/20 pb-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/25 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <FolderArchive className="w-3.5 h-3.5" />
              <span>{t("sources_marquee_badge", ui.badge)}</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
              {t("sources_marquee_title", ui.title)}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
              {t("sources_marquee_desc", ui.desc)}
            </p>
          </div>

          {/* Action CTAs + Play/Pause and Direction Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Play/Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? ui.resume : ui.pause}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--card)] hover:bg-[var(--gold)]/15 text-[var(--foreground)] border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all cursor-pointer shadow-xs"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                  <span>{ui.resume}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{ui.pause}</span>
                </>
              )}
            </button>

            {/* Manual Nudge Buttons */}
            <div className="hidden sm:inline-flex items-center rounded-xl bg-[var(--card)] border border-[var(--gold)]/30 p-0.5">
              <button
                type="button"
                onClick={() => handleManualNudge("left")}
                aria-label="Défiler vers la gauche"
                className="p-1.5 rounded-lg hover:bg-[var(--gold)]/20 text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-[var(--gold)]" />
              </button>
              <button
                type="button"
                onClick={() => handleManualNudge("right")}
                aria-label="Défiler vers la droite"
                className="p-1.5 rounded-lg hover:bg-[var(--gold)]/20 text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-[var(--gold)]" />
              </button>
            </div>

            {/* Link to Full Sources Catalog Page */}
            <Link
              to="/sources"
              className="btn-base btn-gold text-xs py-2 px-3.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{t("sources_marquee_view_all", ui.viewAll)}</span>
              <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Carousel Container with Left-to-Right Moving Track */}
      <div className="relative w-full overflow-hidden group">
        {/* Left & Right Soft Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

        {/* Scrollable track / infinite translate-x */}
        <div
          ref={marqueeContainerRef}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth py-3"
          tabIndex={0}
          role="region"
          aria-label="Inventaire continu des 28 fonds d'archives"
        >
          <div
            dir="ltr"
            className={`flex items-stretch gap-6 pl-4 sm:pl-8 pr-4 sm:pr-8 animate-marquee-ltr ${
              isPaused ? "marquee-paused" : ""
            }`}
          >
            {duplicatedArchives.map((archive, i) => (
              <div
                key={`source-marquee-${archive.id}-${i}`}
                className="w-[320px] sm:w-[370px] shrink-0 flex flex-col"
              >
                <SourceCard archive={archive} className="h-full flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default SourcesInfiniteMarquee;


