import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen py-16">
      <SEO
        title="Privacy Policy — Roots Tunisia"
        description="Privacy policy and data protection guidelines for Roots Tunisia researchers and families."
      />
      <div className="max-w-4xl mx-auto px-5">
        <div className="surface-card p-8 sm:p-12">
          <p className="eyebrow">Privacy & Protection</p>
          <h1 className="display-lg mt-2 text-[var(--foreground)]">
            Privacy Policy
          </h1>
          <div className="gold-rule mt-4 w-20" />
          <p className="text-xs text-[var(--muted-foreground)] mt-4">
            Last updated: March 2026 · Tunis, Tunisia
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--foreground)]/90">
            <p>
              Roots Tunisia respects the sensitivity of family heritage and genealogical records. We are committed to protecting the privacy of living individuals and securing archival data.
            </p>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                1. Protection of Living Individuals
              </h2>
              <p className="text-[var(--muted-foreground)]">
                Details concerning living persons (born less than 100 years ago without death records) are automatically privatized by default and hidden from public searches unless explicitly shared by the tree owner.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                2. Information We Collect
              </h2>
              <p className="text-[var(--muted-foreground)]">
                We collect account details (name, email, governorate/region), user-uploaded GEDCOM files, oral history recordings, and research inquiries submitted to our team.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                3. Data Hosting & Security
              </h2>
              <p className="text-[var(--muted-foreground)]">
                All genealogical databases and document stores are encrypted in transit and at rest, adhering to Tunisian data protection regulations and modern cybersecurity standards.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}