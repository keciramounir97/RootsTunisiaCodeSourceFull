import en from "../locales/en.json";
import fr from "../locales/fr.json";
import ar from "../locales/ar.json";
import es from "../locales/es.json";
import it from "../locales/it.json";
import mt from "../locales/mt.json";
import eo from "../locales/eo.json";
import { SOURCE_FALLBACK_TRANSLATIONS } from "./sourceFallbackTranslations";
import { AUTO_TRANSLATIONS } from "./generatedTranslations";
import { englishGeneratedTranslations } from "./englishGeneratedTranslations";
import { FEATURE_TRANSLATIONS } from "./featureTranslations";

export const SUPPORTED_LOCALES = ["en", "fr", "ar", "es", "it", "mt", "eo"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "fr";

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
  es: "ES",
  it: "IT",
  mt: "MT",
  eo: "ESR",
};

export const LOCALE_FULL_NAMES: Record<SupportedLocale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  es: "Español",
  it: "Italiano",
  mt: "Malti",
  eo: "Esperanto",
};

export const RTL_LOCALES: SupportedLocale[] = ["ar"];

// Merged dictionaries with precedence:
// Custom JSON locales > FEATURE_TRANSLATIONS > AUTO_TRANSLATIONS > SOURCE_FALLBACK_TRANSLATIONS > Generated EN
const dictionaries: Record<SupportedLocale, Record<string, string>> = {
  en: {
    ...englishGeneratedTranslations,
    ...(SOURCE_FALLBACK_TRANSLATIONS.en || {}),
    ...(AUTO_TRANSLATIONS.en || {}),
    ...(FEATURE_TRANSLATIONS.en || {}),
    ...(en as Record<string, string>),
  },
  fr: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.fr || {}),
    ...(AUTO_TRANSLATIONS.fr || {}),
    ...(FEATURE_TRANSLATIONS.fr || {}),
    ...(fr as Record<string, string>),
  },
  ar: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.ar || {}),
    ...(AUTO_TRANSLATIONS.ar || {}),
    ...(FEATURE_TRANSLATIONS.ar || {}),
    ...(ar as Record<string, string>),
  },
  es: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.es || {}),
    ...(AUTO_TRANSLATIONS.es || {}),
    ...(FEATURE_TRANSLATIONS.es || {}),
    ...(es as Record<string, string>),
  },
  it: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.it || {}),
    ...(AUTO_TRANSLATIONS.it || {}),
    ...(FEATURE_TRANSLATIONS.it || {}),
    ...(it as Record<string, string>),
  },
  mt: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.mt || {}),
    ...(AUTO_TRANSLATIONS.mt || {}),
    ...(FEATURE_TRANSLATIONS.mt || {}),
    ...(mt as Record<string, string>),
  },
  eo: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.eo || {}),
    ...(AUTO_TRANSLATIONS.eo || {}),
    ...(FEATURE_TRANSLATIONS.eo || {}),
    ...(eo as Record<string, string>),
  },
};

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as SupportedLocale);
}

export function localeLabel(locale: string): string {
  const norm = (locale || "en").toLowerCase();
  return LOCALE_LABELS[norm as SupportedLocale] || norm.toUpperCase();
}

export function tForLocale(locale: string, key: string, fallback?: string): string {
  const normalizedLocale = (locale || DEFAULT_LOCALE).toLowerCase() as SupportedLocale;
  const dict = dictionaries[normalizedLocale] || dictionaries.fr;
  
  if (dict && dict[key]) {
    return dict[key];
  }

  const rawFb = SOURCE_FALLBACK_TRANSLATIONS[normalizedLocale];
  if (rawFb && rawFb[key]) {
    return rawFb[key];
  }
  
  // Fallback to French dictionary then English dictionary
  if (dictionaries.fr && dictionaries.fr[key]) {
    return dictionaries.fr[key];
  }

  if (dictionaries.en && dictionaries.en[key]) {
    return dictionaries.en[key];
  }

  if (SOURCE_FALLBACK_TRANSLATIONS.en && SOURCE_FALLBACK_TRANSLATIONS.en[key]) {
    return SOURCE_FALLBACK_TRANSLATIONS.en[key];
  }

  // Fallback to provided human-readable string
  if (fallback !== undefined) {
    return fallback;
  }

  // Last fallback: prettified key
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
