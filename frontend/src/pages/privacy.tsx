import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";
import { api } from "../api/client";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";

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

export default function Privacy() {
  const { t, locale } = useTranslation();
  const i18nFallback = useMemo<LegalDocument>(
    () => ({
      title: t("privacy_policy", "Privacy Policy"),
      intro: t(
        "privacy_intro",
        "Roots Tunisia respects the sensitivity of family heritage and genealogical records. We are committed to protecting the privacy of living individuals and securing archival data.",
      ),
      sections: [
        {
          heading: t("privacy_s1_title", "1. Protection of Living Individuals"),
          body: t(
            "privacy_s1_body",
            "Details concerning living persons (born less than 100 years ago without death records) are automatically privatized by default and hidden from public searches unless explicitly shared by the tree owner.",
          ),
        },
        {
          heading: t("privacy_s2_title", "2. Information We Collect"),
          body: t(
            "privacy_s2_body",
            "We collect account details (name, email, governorate/region), user-uploaded GEDCOM files, oral history recordings, and research inquiries submitted to our team.",
          ),
        },
        {
          heading: t("privacy_s3_title", "3. Data Hosting & Security"),
          body: t(
            "privacy_s3_body",
            "All genealogical databases and document stores are encrypted in transit and at rest, adhering to Tunisian data protection regulations and modern cybersecurity standards.",
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
      .get("/legal/privacy", { params: { locale } })
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
        title={`${doc.title || t("privacy_policy", "Privacy Policy")} — Roots Tunisia`}
        description={t(
          "privacy_seo_desc",
          "Privacy policy and data protection guidelines for Roots Tunisia researchers and families.",
        )}
      />
      <div className="max-w-4xl mx-auto px-5">
        <div className="surface-card p-8 sm:p-12">
          <p className="eyebrow">{t("privacy_eyebrow", "Privacy & Protection")}</p>
          <h1 className="display-lg mt-2 text-[var(--foreground)]">
            {doc.title || t("privacy_policy", "Privacy Policy")}
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
          <SiteCustomBlocks pageId="privacy" className="mt-8" />
        </div>
      </div>
    </div>
  );
}
