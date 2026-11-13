import { useEffect, useState } from "react";
import { api } from "../api/client";

export type LegalSlug = "terms" | "privacy" | "refund" | "cookies";

export type LegalSection = {
  heading: string;
  body: string;
};

export interface LegalDocument {
  title: string;
  intro: string;
  sections: LegalSection[];
}

const SUPPORTED_LEGAL_LOCALES = ["en", "fr", "ar", "es", "it", "mt"] as const;
type SupportedLegalLocale = (typeof SUPPORTED_LEGAL_LOCALES)[number];

const LEGAL_SEO_KEYWORDS: Record<LegalSlug, Record<SupportedLegalLocale, string[]>> = {
  terms: {
    en: ["Roots Tunisia terms", "terms of service", "Tunisian genealogy legal"],
    fr: ["conditions d'utilisation Roots Tunisia", "cadre légal", "généalogie Tunisie"],
    ar: ["شروط الاستخدام جذور تونس", "الإطار القانوني", "الأنساب التونسية"],
    es: ["términos de servicio Roots Tunisia", "marco legal", "genealogía Túnez"],
    it: ["termini di servizio Roots Tunisia", "note legali", "genealogia Tunisia"],
    mt: ["termini tas-servizz Roots Tunisia", "qafas legali", "ġenealoġija Tuneżija"],
  },
  privacy: {
    en: ["Roots Tunisia privacy", "genealogy data protection", "Tunisian privacy policy"],
    fr: ["confidentialité Roots Tunisia", "protection des données", "généalogie Tunisie"],
    ar: ["سياسة الخصوصية جذور تونس", "حماية البيانات الشخصية", "خصوصية الأنساب"],
    es: ["privacidad Roots Tunisia", "protección de datos", "genealogía Túnez"],
    it: ["privacy Roots Tunisia", "protezione dei dati", "genealogia Tunisia"],
    mt: ["privatezza Roots Tunisia", "protezzjoni tad-data", "ġenealoġija Tuneżija"],
  },
  refund: {
    en: ["Roots Tunisia refund", "subscription cancellation", "genealogy refund policy"],
    fr: ["remboursement Roots Tunisia", "résiliation abonnement", "politique de remboursement"],
    ar: ["سياسة الاسترجاع جذور تونس", "إلغاء الاشتراك", "حقوق المستهلك"],
    es: ["reembolso Roots Tunisia", "cancelación suscripción", "política de reembolso"],
    it: ["rimborso Roots Tunisia", "cancellazione abbonamento", "politica di rimborso"],
    mt: ["rifużjoni Roots Tunisia", "kanċellazzjoni abbonament", "politika ta' rifużjoni"],
  },
  cookies: {
    en: ["Roots Tunisia cookies", "cookie preferences", "session storage"],
    fr: ["cookies Roots Tunisia", "préférences cookies", "stockage de session"],
    ar: ["ملفات الارتباط جذور تونس", "تفضيلات الخصوصية", "تخزين الجلسة"],
    es: ["cookies Roots Tunisia", "preferencias de cookies", "almacenamiento de sesión"],
    it: ["cookie Roots Tunisia", "preferenze cookie", "archiviazione sessione"],
    mt: ["cookies Roots Tunisia", "preferenzi tal-cookies", "ħażna tas-sessjoni"],
  },
};

export function cleanLegalLocale(locale?: string): SupportedLegalLocale {
  const base = String(locale || "en")
    .trim()
    .toLowerCase()
    .split("-")[0];
  return (SUPPORTED_LEGAL_LOCALES as readonly string[]).includes(base)
    ? (base as SupportedLegalLocale)
    : "en";
}

/**
 * Unwraps a CMS `/legal/:slug` response and rejects untranslated or mismatched-locale
 * fallback documents so localized UI translations are preserved cleanly.
 */
export function unwrapLegalDocument(
  payload: unknown,
  targetLocale?: string,
): LegalDocument | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const raw =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  if (!raw || typeof raw !== "object") return null;
  if (raw.translated === false) return null;

  if (targetLocale && typeof raw.locale === "string" && raw.locale.trim()) {
    if (cleanLegalLocale(raw.locale) !== cleanLegalLocale(targetLocale)) {
      return null;
    }
  }

  if (typeof raw.title !== "string" || !Array.isArray(raw.sections)) {
    return null;
  }

  const sections = raw.sections
    .map((section) => {
      const s = section as Record<string, unknown> | null | undefined;
      return {
        heading: String(s?.heading || "").trim(),
        body: String(s?.body || "").trim(),
      };
    })
    .filter((section) => Boolean(section.heading || section.body));

  if (sections.length === 0) return null;

  return {
    title: raw.title.trim(),
    intro: String(raw.intro || "").trim(),
    sections,
  };
}

export function formatLegalSeoTitle(baseTitle: string, locale?: string): string {
  const trimmed = String(baseTitle || "").trim();
  const loc = cleanLegalLocale(locale);
  const brand = loc === "ar" ? "جذور تونس" : "Roots Tunisia";
  if (!trimmed) return brand;
  if (trimmed.includes("Roots Tunisia") || trimmed.includes("جذور تونس")) {
    return trimmed;
  }
  return `${trimmed} — ${brand}`;
}

export function getLegalSeoKeywords(slug: LegalSlug, locale?: string): string[] {
  return LEGAL_SEO_KEYWORDS[slug][cleanLegalLocale(locale)];
}

/**
 * Resolves a localized legal document from `/legal/:slug` when translated for
 * the active locale, falling back immediately to the i18n document.
 */
export function useLegalDocument(
  slug: LegalSlug,
  i18nFallback: LegalDocument,
  locale?: string,
): LegalDocument {
  const [doc, setDoc] = useState<LegalDocument>(i18nFallback);

  useEffect(() => {
    setDoc(i18nFallback);
    let cancelled = false;
    const targetLocale = cleanLegalLocale(locale);
    api
      .get(`/legal/${slug}`, { params: { locale: targetLocale } })
      .then(({ data }) => {
        const cms = unwrapLegalDocument(data, targetLocale);
        if (!cancelled && cms) {
          setDoc(cms);
        }
      })
      .catch(() => {
        // Keep localized i18n fallback when CMS is empty or unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, [slug, locale, i18nFallback]);

  return doc;
}

