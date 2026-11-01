import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isRtlLocale,
  tForLocale,
} from "../utils/translations";

const STORAGE_KEY = "locale";

interface TranslationContextType {
  locale: string;
  dir: "rtl" | "ltr";
  isRtl: boolean;
  locales: readonly string[];
  setLocale: (locale: string) => void;
  t: (key: string, fallback?: string) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

const FALLBACK_VALUE: TranslationContextType = {
  locale: DEFAULT_LOCALE,
  dir: "ltr",
  isRtl: false,
  locales: SUPPORTED_LOCALES,
  setLocale: () => {},
  t: (key: string, fallback?: string) => tForLocale(DEFAULT_LOCALE, key, fallback),
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>(() => {
    try {
      const first = window.location.pathname.split("/").filter(Boolean)[0];
      if (first && (SUPPORTED_LOCALES as readonly string[]).includes(first) && first !== DEFAULT_LOCALE) {
        return first;
      }
      const queryLang = new URLSearchParams(window.location.search).get("lang");
      if (queryLang && (SUPPORTED_LOCALES as readonly string[]).includes(queryLang)) {
        return queryLang;
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved) ? saved : DEFAULT_LOCALE;
    } catch {
      return DEFAULT_LOCALE;
    }
  });

  const setLocale = (next: string) => {
    if ((SUPPORTED_LOCALES as readonly string[]).includes(next)) {
      setLocaleState(next);
    }
  };

  const isRtl = isRtlLocale(locale);
  const dir: "rtl" | "ltr" = isRtl ? "rtl" : "ltr";

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const value = useMemo(
    () => ({
      locale,
      dir,
      isRtl,
      locales: SUPPORTED_LOCALES,
      setLocale,
      t: (key: string, fallback?: string) => tForLocale(locale, key, fallback),
    }),
    [locale, dir, isRtl]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation(): TranslationContextType {
  const ctx = useContext(TranslationContext);
  if (!ctx) return FALLBACK_VALUE;
  return ctx;
}

