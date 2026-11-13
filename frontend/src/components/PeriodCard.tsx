import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { HistoricalEraExtended } from "../data/historicalMapData";
import { useTranslation } from "../context/TranslationContext";

export interface PeriodCardProps {
  era: HistoricalEraExtended & {
    customTags?: string[];
    cardButtonLabel?: string;
    badge?: string;
  };
  index: number;
  stats?: { total: number };
  nextEra?: HistoricalEraExtended | null;
  className?: string;
  showNextConnector?: boolean;
  buttonLabel?: string;
}

const DISCOVER_PERIOD_CTA_BY_LOCALE: Record<string, string> = {
  fr: "DÉCOUVRIR LA PÉRIODE",
  en: "DISCOVER PERIOD",
  ar: "استكشف الحقبة",
  es: "DESCUBRIR EL PERÍODO",
  it: "SCOPRI IL PERIODO",
  mt: "SKOPRI L-PERJODU",
};

const CAPITAL_LABEL_BY_LOCALE: Record<string, string> = {
  fr: "Capitale",
  en: "Capital",
  ar: "العاصمة",
  es: "Capital",
  it: "Capitale",
  mt: "Kapitali",
};

export const PeriodCard: React.FC<PeriodCardProps> = ({
  era,
  className = "",
  buttonLabel,
}) => {
  const { isRtl, locale } = useTranslation();
  const cleanLocale = (locale || "fr").toLowerCase();
  const capitalLabel = CAPITAL_LABEL_BY_LOCALE[cleanLocale] || CAPITAL_LABEL_BY_LOCALE.fr;
  const defaultCta = DISCOVER_PERIOD_CTA_BY_LOCALE[cleanLocale] || DISCOVER_PERIOD_CTA_BY_LOCALE.fr;

  // Build concise tags matching SourceCard tag pills, supporting customTags override
  const defaultTags: string[] = [
    era.displayPeriod,
    `${capitalLabel} : ${era.capital}`,
    era.devletName ? era.devletName.split("(")[0].trim() : era.empire,
    era.notableLeaders?.[0] ? era.notableLeaders[0].name.split("(")[0].trim() : null,
    era.notableFamilies?.[0]
      ? era.notableFamilies[0].name.replace(/^(Dynastie|Maison) des /i, "").trim()
      : era.keySites?.[0]
      ? era.keySites[0].name.split("(")[0].trim()
      : null,
  ].filter(Boolean) as string[];

  const tags =
    Array.isArray(era.customTags) && era.customTags.length > 0
      ? era.customTags
      : defaultTags;

  const ctaText =
    era.cardButtonLabel && (cleanLocale === "fr" || era.cardButtonLabel !== "DÉCOUVRIR LA PÉRIODE")
      ? era.cardButtonLabel
      : buttonLabel || defaultCta;

  const displayTitle = era.title || (locale === "ar" && era.arabicTitle ? era.arabicTitle : era.title);

  return (
    <article
      id={`period-${era.id}`}
      dir={isRtl ? "rtl" : "ltr"}
      className={`surface-card frame-gold group flex h-full flex-col justify-between p-6 sm:p-7 rounded-xl shadow-md bg-[var(--card)]/95 backdrop-blur-sm text-start transition-all hover:border-[var(--gold)] hover:-translate-y-1 ${className}`}
    >
      <div className="space-y-4">
        {/* Title & Arabic Subtitle */}
        <div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors leading-snug">
            {displayTitle}
          </h3>
          {era.arabicTitle && locale !== "ar" && (
            <p dir="rtl" className="text-xs text-[var(--gold)]/90 font-amiri font-bold mt-1">
              {era.arabicTitle}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body line-clamp-3">
          {era.description}
        </p>

        {/* Historical Document Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--background)] text-[var(--foreground)]/80 border border-[var(--border)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Single Action Button (Identical to SourceCard) */}
      <div className="mt-6 pt-4 border-t border-[var(--gold)]/15 flex items-center justify-between gap-3">
        <Link
          to={`/periods/${era.id}`}
          className="btn-base btn-gold text-xs py-2.5 px-4 inline-flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] transition-transform w-full font-bold uppercase tracking-wider cursor-pointer"
        >
          <span>{ctaText}</span>
          <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
        </Link>
      </div>
    </article>
  );
};

export default PeriodCard;
