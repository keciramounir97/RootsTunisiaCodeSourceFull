import { useTranslation } from "../context/TranslationContext";
import { Shield } from "lucide-react";

export default function Terms() {
  const { t } = useTranslation();
  return (
    <div className="page-container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-[var(--brand-gold)]" />
          <h1 className="text-3xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)]">
            {t("terms_of_service", "Terms of Service")}
          </h1>
        </div>
        <p className="text-sm opacity-60 mb-8">{t("last_updated", "Last updated")}: June 2026</p>
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="opacity-80">{t("terms_intro", "Please read these terms carefully before using Roots Tunisia.")}</p>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">1. Acceptance of Terms</h2>
            <p className="opacity-80">By accessing and using Roots Tunisia, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">2. User Accounts</h2>
            <p className="opacity-80">You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">3. Data & Privacy</h2>
            <p className="opacity-80">We respect your privacy. Please refer to our Privacy Policy for information on how we collect, use, and protect your personal data.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">4. Intellectual Property</h2>
            <p className="opacity-80">All content uploaded by users remains their property. Roots Tunisia claims no ownership over user-generated family trees, documents, or narratives.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">5. Limitation of Liability</h2>
            <p className="opacity-80">Roots Tunisia provides genealogical research tools but cannot guarantee the accuracy of user-submitted data or third-party archive records.</p>
          </section>
        </div>
      </div>
    </div>
  );
}