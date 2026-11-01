import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen py-16">
      <SEO
        title={`${t("privacy_policy", "Privacy Policy")} — Roots Tunisia`}
        description={t(
          "privacy_seo_desc",
          "Privacy policy and data protection guidelines for Roots Tunisia researchers and families.",
        )}
      />
      <div className="max-w-4xl mx-auto px-5">
        <div className="surface-card p-8 sm:p-12">
          <p className="eyebrow">{t("privacy_eyebrow", "Privacy & Protection")}</p>
          <h1 className="display-lg mt-2 text-[var(--foreground)]">
            {t("privacy_policy", "Privacy Policy")}
          </h1>
          <div className="gold-rule mt-4 w-20" />
          <p className="text-xs text-[var(--muted-foreground)] mt-4">
            {t("legal_updated", "Last updated: March 2026 · Tunis, Tunisia")}
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--foreground)]/90">
            <p>
              {t(
                "privacy_intro",
                "Roots Tunisia respects the sensitivity of family heritage and genealogical records. We are committed to protecting the privacy of living individuals and securing archival data.",
              )}
            </p>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                {t("privacy_s1_title", "1. Protection of Living Individuals")}
              </h2>
              <p className="text-[var(--muted-foreground)]">
                {t(
                  "privacy_s1_body",
                  "Details concerning living persons (born less than 100 years ago without death records) are automatically privatized by default and hidden from public searches unless explicitly shared by the tree owner.",
                )}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                {t("privacy_s2_title", "2. Information We Collect")}
              </h2>
              <p className="text-[var(--muted-foreground)]">
                {t(
                  "privacy_s2_body",
                  "We collect account details (name, email, governorate/region), user-uploaded GEDCOM files, oral history recordings, and research inquiries submitted to our team.",
                )}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                {t("privacy_s3_title", "3. Data Hosting & Security")}
              </h2>
              <p className="text-[var(--muted-foreground)]">
                {t(
                  "privacy_s3_body",
                  "All genealogical databases and document stores are encrypted in transit and at rest, adhering to Tunisian data protection regulations and modern cybersecurity standards.",
                )}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
