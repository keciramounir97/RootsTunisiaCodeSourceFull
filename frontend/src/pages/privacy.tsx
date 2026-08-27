import { useTranslation } from "../context/TranslationContext";
import { Lock } from "lucide-react";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <div className="page-container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-8 h-8 text-[var(--brand-gold)]" />
          <h1 className="text-3xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)]">
            {t("privacy_policy", "Privacy Policy")}
          </h1>
        </div>
        <p className="text-sm opacity-60 mb-8">{t("last_updated", "Last updated")}: June 2026</p>
        <div className="space-y-6">
          <p className="opacity-80">{t("privacy_intro", "We respect your privacy and are committed to protecting your personal data.")}</p>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">1. Data We Collect</h2>
            <p className="opacity-80">We collect information you provide when creating an account, uploading family trees, and using our services. This includes name, email address, and genealogical data.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">2. How We Use Data</h2>
            <p className="opacity-80">Your data is used solely to provide and improve our genealogical services. We do not sell your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">3. Data Security</h2>
            <p className="opacity-80">We implement industry-standard security measures to protect your data against unauthorized access, alteration, or destruction.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">4. Your Rights</h2>
            <p className="opacity-80">You have the right to access, correct, or delete your personal data at any time. Contact us for assistance.</p>
          </section>
        </div>
      </div>
    </div>
  );
}