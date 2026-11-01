import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";

export default function Terms() {
  const { t } = useTranslation();
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen py-16">
      <SEO
        title={`${t("terms_of_service", "Terms of Service")} — Roots Tunisia`}
        description={t(
          "terms_seo_desc",
          "Terms of Service and conditions of use for the Roots Tunisia genealogical platform.",
        )}
      />
      <div className="max-w-4xl mx-auto px-5">
        <div className="surface-card p-8 sm:p-12">
          <p className="eyebrow">{t("legal_eyebrow", "Legal & Compliance")}</p>
          <h1 className="display-lg mt-2 text-[var(--foreground)]">
            {t("terms_of_service", "Terms of Service")}
          </h1>
          <div className="gold-rule mt-4 w-20" />
          <p className="text-xs text-[var(--muted-foreground)] mt-4">
            {t("legal_updated", "Last updated: March 2026 · Tunis, Tunisia")}
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--foreground)]/90">
            <p>{t("terms_intro", "Please read these Terms of Service carefully before accessing or using the Roots Tunisia platform, archives catalog, or family tree building tools.")}</p>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                {t("terms_s1_title", "1. Acceptance of Terms")}
              </h2>
              <p className="text-[var(--muted-foreground)]">
                {t("terms_s1_body", "By creating an account, browsing records, or uploading family materials to Roots Tunisia, you agree to be bound by these terms, all applicable Tunisian laws, and international data protection standards.")}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                {t("terms_s2_title", "2. User Accounts & Verification")}
              </h2>
              <p className="text-[var(--muted-foreground)]">
                {t("terms_s2_body", "You are responsible for maintaining the confidentiality of your login credentials and for all activity conducted through your account. Family tree records may be set to public or private at your discretion.")}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                {t("terms_s3_title", "3. Historical Documents & Archival Accuracy")}
              </h2>
              <p className="text-[var(--muted-foreground)]">
                {t("terms_s3_body", "Roots Tunisia provides citations and cataloging for civil status registers, charaïque court records, habous deeds, and municipal archives. While we strive for absolute documentary fidelity, researchers are encouraged to verify primary evidence.")}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                {t("terms_s4_title", "4. Intellectual Property & Family Ownership")}
              </h2>
              <p className="text-[var(--muted-foreground)]">
                {t("terms_s4_body", "Users retain full moral and intellectual property over family photographs, oral histories, and private memoirs uploaded to their accounts. Roots Tunisia claims no ownership over user-generated pedigrees.")}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                {t("terms_s5_title", "5. Governing Law & Jurisdiction")}
              </h2>
              <p className="text-[var(--muted-foreground)]">
                {t("terms_s5_body", "These terms are governed by the laws of the Republic of Tunisia. Any disputes shall be submitted to the competent courts of Tunis.")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
