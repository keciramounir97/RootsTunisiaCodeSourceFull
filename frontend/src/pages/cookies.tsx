import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";

export default function Cookies() {
  const { t } = useTranslation();
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen py-16">
      <SEO
        title="Cookie Policy — Roots Tunisia"
        description="Cookie policy and session storage practices on Roots Tunisia."
      />
      <div className="max-w-4xl mx-auto px-5">
        <div className="surface-card p-8 sm:p-12">
          <p className="eyebrow">Cookies & Preferences</p>
          <h1 className="display-lg mt-2 text-[var(--foreground)]">
            Cookie Policy
          </h1>
          <div className="gold-rule mt-4 w-20" />
          <p className="text-xs text-[var(--muted-foreground)] mt-4">
            Last updated: March 2026 · Tunis, Tunisia
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--foreground)]/90">
            <p>
              Roots Tunisia uses minimal, privacy-first cookies and local storage tokens exclusively to manage user authentication sessions and remember your language and theme preferences.
            </p>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                1. Essential Cookies
              </h2>
              <p className="text-[var(--muted-foreground)]">
                Authentication tokens (JWT) and session cookies enable secure access to your private family trees, notes, and admin dashboards.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                2. Preference Storage
              </h2>
              <p className="text-[var(--muted-foreground)]">
                Local storage remembers your chosen language (English, French, Arabic, Spanish) and dark/parchment theme mode.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}