import { useTranslation } from "./context/TranslationContext";

export function useLanguage() {
  const { locale, dir, setLocale, t } = useTranslation();
  return {
    language: locale as "en" | "fr" | "ar" | "es",
    setLanguage: setLocale,
    t,
    dir,
    availableLanguages: [
      { code: "fr", name: "Français", dir: "ltr" },
      { code: "en", name: "English", dir: "ltr" },
      { code: "ar", name: "العربية", dir: "rtl" },
      { code: "es", name: "Español", dir: "ltr" },
    ] as const,
  };
}

export type LanguageCode = "en" | "fr" | "ar" | "es";
export interface LanguageOption {
  code: LanguageCode;
  name: string;
  dir: "ltr" | "rtl";
}
