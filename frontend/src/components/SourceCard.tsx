import React from "react";
import { ExternalLink } from "lucide-react";
import type { ExternalArchiveItem } from "../pages/SourcesAndArchives";
import { useTranslation } from "../context/TranslationContext";

export interface SourceCardProps {
  archive: ExternalArchiveItem;
  className?: string;
}

const VISIT_ARCHIVE_CTA_BY_LOCALE: Record<string, string> = {
  fr: "VISITER L'ARCHIVE",
  en: "VISIT ARCHIVE",
  ar: "زيارة الأرشيف",
  es: "VISITAR EL ARCHIVO",
  it: "VISITA L'ARCHIVIO",
  mt: "ŻUR L-ARKIVJU",
};

export const SourceCard: React.FC<SourceCardProps> = ({
  archive,
  className = "",
}) => {
  const { isRtl, locale } = useTranslation();
  const cleanLocale = (locale || "fr").toLowerCase();
  const ctaLabel = VISIT_ARCHIVE_CTA_BY_LOCALE[cleanLocale] || VISIT_ARCHIVE_CTA_BY_LOCALE.fr;

  return (
    <article
      id={`source-${archive.id}`}
      dir={isRtl ? "rtl" : "ltr"}
      className={`surface-card frame-gold group flex h-full flex-col justify-between p-6 sm:p-7 rounded-xl shadow-md bg-[var(--card)]/95 backdrop-blur-sm text-start transition-all hover:border-[var(--gold)] hover:-translate-y-1 ${className}`}
    >
      <div className="space-y-4">
        {/* Title */}
        <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors leading-snug">
          {archive.name}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
          {archive.description}
        </p>

        {/* Document Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {archive.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--background)] text-[var(--foreground)]/80 border border-[var(--border)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* External Action Button */}
      <div className="mt-6 pt-4 border-t border-[var(--gold)]/15 flex items-center justify-between gap-3">
        <a
          href={archive.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-base btn-gold text-xs py-2.5 px-4 inline-flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] transition-transform w-full font-bold uppercase tracking-wider cursor-pointer"
        >
          <span>{ctaLabel}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
};

export default SourceCard;
