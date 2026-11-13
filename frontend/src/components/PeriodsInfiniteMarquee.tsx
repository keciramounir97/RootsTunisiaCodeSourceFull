import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  History,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Section, SectionHeading } from "./site/Primitives";
import { TUNISIAN_HISTORICAL_ERAS } from "../data/historicalMapData";
import { PeriodCard } from "./PeriodCard";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { usePeriodsCmsConfig } from "../utils/periodsCmsConfig";

interface PeriodStats {
  total: number;
  documents?: number;
  trees?: number;
  books?: number;
  gallery?: number;
  audios?: number;
}

const MARQUEE_CONTROLS_BY_LOCALE: Record<string, { pause: string; resume: string }> = {
  fr: { pause: "Pause", resume: "Reprendre" },
  en: { pause: "Pause", resume: "Resume" },
  ar: { pause: "إيقاف مؤقت", resume: "استئناف" },
  es: { pause: "Pausa", resume: "Reanudar" },
  it: { pause: "Pausa", resume: "Riprendi" },
  mt: { pause: "Pawża", resume: "Kompli" },
};

export const PeriodsInfiniteMarquee: React.FC = () => {
  const { t, locale, isRtl } = useTranslation();
  const { config } = usePeriodsCmsConfig();
  const cleanLoc = (locale || "fr").toLowerCase();
  const ctrl = MARQUEE_CONTROLS_BY_LOCALE[cleanLoc] || MARQUEE_CONTROLS_BY_LOCALE.fr;
  const [isPaused, setIsPaused] = useState(false);
  const [statsMap, setStatsMap] = useState<Record<string, PeriodStats>>({});
  const marqueeContainerRef = useRef<HTMLDivElement>(null);

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
        if (!cancelled) {
          setStatsMap({
            ottomane: { total: 2, documents: 1, trees: 0, books: 0, gallery: 1, audios: 0 },
            husseinite: { total: 2, documents: 1, trees: 1, books: 0, gallery: 0, audios: 0 },
            hafside: { total: 1, documents: 0, trees: 0, books: 1, gallery: 0, audios: 0 },
            protectorat: { total: 1, documents: 1, trees: 0, books: 0, gallery: 0, audios: 0 },
            republique: { total: 1, documents: 1, trees: 0, books: 0, gallery: 0, audios: 0 },
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleManualNudge = (direction: "left" | "right") => {
    if (marqueeContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      marqueeContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const activeEras = config.periods.filter((p) => p.isPublished !== false);
  const erasToDisplay = activeEras.length > 0 ? activeEras : TUNISIAN_HISTORICAL_ERAS;
  const duplicatedEras = [...erasToDisplay, ...erasToDisplay];

  return (
    <Section id="periods-infinite-marquee" className="!pt-6 !pb-10 overflow-hidden relative">
      {/* Header with Title, Eyebrow, CTAs and Controls */}
      <div className="w-full max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[var(--gold)]/20 pb-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/25 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <History className="w-3.5 h-3.5" />
              <span>{t("periods_marquee_badge", "Chronologie")}</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
              {t("periods_marquee_title", "Les 12 Périodes")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
              {t("periods_marquee_desc", "De Carthage à la République moderne : les 12 époques historiques et leurs actes d'archives fondateurs.")}
            </p>
          </div>

          {/* Action CTAs + Play/Pause and Direction Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Play/Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? ctrl.resume : ctrl.pause}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--card)] hover:bg-[var(--gold)]/15 text-[var(--foreground)] border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all cursor-pointer shadow-xs"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                  <span>{ctrl.resume}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{ctrl.pause}</span>
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

            {/* Link to Full Periods Catalog Page */}
            <Link
              to="/periods"
              className="btn-base btn-gold text-xs py-2 px-3.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{t("periods_marquee_view_all", "Consulter les 12 Périodes")}</span>
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

        {/* Scrollable track / infinite translate-x moving from left to right */}
        <div
          ref={marqueeContainerRef}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth py-3"
          tabIndex={0}
          role="region"
          aria-label="Frise chronologique animée des 12 périodes"
        >
          <div
            dir="ltr"
            className={`flex items-stretch gap-6 pl-4 sm:pl-8 pr-4 sm:pr-8 animate-marquee-ltr ${
              isPaused ? "marquee-paused" : ""
            }`}
          >
            {duplicatedEras.map((era, i) => {
              const originalIndex = i % TUNISIAN_HISTORICAL_ERAS.length;
              const nextIndex = (originalIndex + 1) % TUNISIAN_HISTORICAL_ERAS.length;
              const nextEra = TUNISIAN_HISTORICAL_ERAS[nextIndex];
              const stats = statsMap[era.id] || { total: 0 };

              return (
                <div
                  key={`marquee-${era.id}-${i}`}
                  className="w-[320px] sm:w-[370px] shrink-0 flex flex-col"
                >
                  <PeriodCard
                    era={era}
                    index={originalIndex}
                    stats={stats}
                    nextEra={nextEra}
                    className="h-full flex-1"
                    showNextConnector={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default PeriodsInfiniteMarquee;


