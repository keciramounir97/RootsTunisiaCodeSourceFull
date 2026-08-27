import { useTranslation } from "../context/TranslationContext";
import { FileText } from "lucide-react";

export default function Cookies() {
  const { t } = useTranslation();
  return (
    <div className="page-container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-[var(--brand-gold)]" />
          <h1 className="text-3xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)]">
            {t("cookie_policy", "Cookie Policy")}
          </h1>
        </div>
        <p className="text-sm opacity-60 mb-8">{t("last_updated", "Last updated")}: June 2026</p>
        <div className="space-y-6">
          <p className="opacity-80">{t("cookies_intro", "We use cookies and similar technologies to enhance your experience on Roots Tunisia.")}</p>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">1. What Are Cookies</h2>
            <p className="opacity-80">Cookies are small text files stored on your device by your web browser. They help us remember your preferences and improve site functionality.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">2. Types We Use</h2>
            <ul className="list-disc pl-6 space-y-2 opacity-80">
              <li><strong>Essential:</strong> Required for authentication and basic site functions</li>
              <li><strong>Preference:</strong> Remember your language and theme settings</li>
              <li><strong>Analytics:</strong> Help us understand how you use our site to improve it</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold font-cinzel text-[var(--brand-teal)] dark:text-[var(--gold-light)] mb-3">3. Managing Cookies</h2>
            <p className="opacity-80">You can control cookies through your browser settings. Disabling cookies may affect certain functionalities.</p>
          </section>
        </div>
      </div>
    </div>
  );
}