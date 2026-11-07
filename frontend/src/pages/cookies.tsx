import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";
import { api } from "../api/client";

type LegalSection = { heading: string; body: string };
type LegalDocument = { title: string; intro: string; sections: LegalSection[] };

function unwrapLegalDocument(payload: any): LegalDocument | null {
  const doc = payload?.data ?? payload;
  if (!doc || !Array.isArray(doc.sections) || doc.sections.length === 0) return null;
  return {
    title: String(doc.title || ""),
    intro: String(doc.intro || ""),
    sections: doc.sections.map((section: any) => ({
      heading: String(section?.heading || ""),
      body: String(section?.body || ""),
    })),
  };
}

export default function Cookies() {
  const { t, locale } = useTranslation();
  const i18nFallback = useMemo<LegalDocument>(
    () => ({
      title: t("cookie_policy", "Cookie Policy"),
      intro: t(
        "cookies_intro",
        "Roots Tunisia uses minimal, privacy-first cookies and local storage tokens exclusively to manage user authentication sessions and remember your language and theme preferences.",
      ),
      sections: [
        {
          heading: t("cookies_s1_title", "1. Essential Cookies"),
          body: t(
            "cookies_s1_body",
            "Authentication tokens (JWT) and session cookies enable secure access to your private family trees, notes, and admin dashboards.",
          ),
        },
        {
          heading: t("cookies_s2_title", "2. Preference Storage"),
          body: t(
            "cookies_s2_body",
            "Local storage remembers your chosen language (English, French, Arabic, Spanish, Italian, Maltese, Esperanto) and dark/parchment theme mode.",
          ),
        },
      ],
    }),
    [t],
  );
  const [doc, setDoc] = useState<LegalDocument>(i18nFallback);

  useEffect(() => {
    setDoc(i18nFallback);
    let cancelled = false;
    api
      .get("/legal/cookies", { params: { locale } })
      .then(({ data }) => {
        const cms = unwrapLegalDocument(data);
        if (!cancelled && cms) setDoc(cms);
      })
      .catch(() => {
        // Keep i18n fallback when CMS is empty or unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, [locale, i18nFallback]);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen py-16">
      <SEO
        title={`${doc.title || t("cookie_policy", "Cookie Policy")} — Roots Tunisia`}
        description={t(
          "cookies_seo_desc",
          "Cookie policy and session storage practices on Roots Tunisia.",
        )}
      />
      <div className="max-w-4xl mx-auto px-5">
        <div className="surface-card p-8 sm:p-12">
          <p className="eyebrow">{t("cookies_eyebrow", "Cookies & Preferences")}</p>
          <h1 className="display-lg mt-2 text-[var(--foreground)]">
            {doc.title || t("cookie_policy", "Cookie Policy")}
          </h1>
          <div className="gold-rule mt-4 w-20" />
          <p className="text-xs text-[var(--muted-foreground)] mt-4">
            {t("legal_updated", "Last updated: March 2026 · Tunis, Tunisia")}
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--foreground)]/90">
            {doc.intro ? <p>{doc.intro}</p> : null}

            {doc.sections.map((section, index) => (
              <section key={index}>
                <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                  {section.heading}
                </h2>
                <p className="text-[var(--muted-foreground)] whitespace-pre-line">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
