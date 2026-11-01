import { useTranslation } from "./context/TranslationContext";

export function useLanguage() {
  const { locale, dir, setLocale, t } = useTranslation();
  return {
    language: locale as LanguageCode,
    setLanguage: setLocale,
    changeLanguage: setLocale,
    t,
    dir,
    availableLanguages: [
      { code: "fr", name: "Français", dir: "ltr" },
      { code: "en", name: "English", dir: "ltr" },
      { code: "ar", name: "العربية", dir: "rtl" },
      { code: "es", name: "Español", dir: "ltr" },
      { code: "it", name: "Italiano", dir: "ltr" },
      { code: "mt", name: "Malti", dir: "ltr" },
    ] as const,
  };
}

export type LanguageCode = "en" | "fr" | "ar" | "es" | "it" | "mt";
export interface LanguageOption {
  code: LanguageCode;
  name: string;
  dir: "ltr" | "rtl";
}
