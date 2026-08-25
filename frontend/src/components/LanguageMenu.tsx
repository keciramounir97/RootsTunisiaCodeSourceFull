import { useState, useRef, useEffect } from "react";
import { useTranslation, Locale } from "../context/TranslationContext";
import { Globe, ChevronDown } from "lucide-react";

export const languages: { code: string; label: string; short: string; badge: string }[] = [
  { code: "en", label: "English", short: "EN", badge: "EN" },
  { code: "fr", label: "Français", short: "FR", badge: "FR" },
  { code: "ar", label: "العربية", short: "AR", badge: "AR" },
  { code: "es", label: "Español", short: "ES", badge: "ES" },
  { code: "it", label: "Italiano", short: "IT", badge: "IT" },
  { code: "mt", label: "Malti", short: "MT", badge: "MT" },
  { code: "eo", label: "Esperanto", short: "ESR", badge: "ESR" },
];

export default function LanguageMenu({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Select Language"
        title="Change language"
        className="h-[34px] flex items-center gap-1.5 rounded-sm border border-[var(--border)] px-2.5 text-[var(--foreground)] hover:bg-[var(--gold)]/15 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
      >
        <span className="font-mono text-[0.65rem] font-bold text-[var(--gold)]">{current.badge}</span>
        <ChevronDown className={`h-3 w-3 text-[var(--muted-foreground)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 surface-card p-1 shadow-2xl border border-[var(--gold)]/40 z-50 overflow-hidden max-h-80 overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-sm transition-colors ${
                locale === lang.code
                  ? "bg-[var(--gold)]/15 text-[var(--gold)] font-bold"
                  : "text-[var(--foreground)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-[0.65rem] font-bold px-1.5 py-0.5 rounded bg-[var(--secondary)] text-[var(--gold)]">
                  {lang.badge}
                </span>
                <span>{lang.label}</span>
              </span>
              {locale === lang.code && (
                <span className="text-[var(--gold)] text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
