import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, ShieldCheck, Mail, FileText, CheckCircle2 } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import { useTranslation } from "../context/TranslationContext";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import SEO from "../components/SEO";

export default function RefundPolicy() {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_refund_title", "سياسة الاسترجاع والإلغاء — جذور تونس")}
        description="Learn about refund eligibility, subscription cancellations, statutory withdrawal rights, and digital download terms on Roots Tunisia."
        keywords={["Roots Tunisia refund", "subscription cancellation", "genealogy refund policy"]}
      />

      <PageHero
        eyebrow={t("refund_eyebrow", "Consumer Rights & Billing")}
        title={t("refund_title", "Refund & Cancellation Policy")}
        subtitle={t(
          "refund_subtitle",
          "Clear, fair, and transparent billing terms for our Tunisian and international researchers."
        )}
        image={sidiBouSaid}
      />

      <Section>
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="surface-card p-6 sm:p-8 rounded-lg border border-[var(--gold)]/40 shadow-md flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-[var(--gold)] shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--foreground)]">
                {t("fair_billing_commitment", "Our Fair Billing Commitment")}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">
                {t("fair_billing_desc", "Roots Tunisia is dedicated to transparent, honest pricing. We do not use hidden fees, deceptive cancellation barriers, or unexpected recurring add-ons. You can manage or cancel your subscription at any time.")}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-[var(--muted-foreground)]">
            <article className="surface-card p-6 sm:p-8 rounded-lg border border-[var(--border)]">
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[var(--gold)]" />
                {t("refund_section_1_title", "1. Subscription Cancellation")}
              </h3>
              <p>
                {t("refund_section_1_p1", "You may cancel your recurring monthly or annual plan at any time through your User Settings dashboard or by emailing our team at")}{" "}
                <a href="mailto:devteam@rootstunisia.com" className="text-[var(--gold)] underline">
                  devteam@rootstunisia.com
                </a>.
              </p>
              <p className="mt-3">
                {t("refund_section_1_p2", "Upon cancellation, your subscription access will continue uninterrupted until the end of your current paid billing period. You will not be billed again.")}
              </p>
            </article>

            <article className="surface-card p-6 sm:p-8 rounded-lg border border-[var(--border)]">
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {t("refund_section_2_title", "2. Statutory 14-Day Cooling-Off Period")}
              </h3>
              <p>
                {t("refund_section_2_p1", "In compliance with international and European consumer protection standards, customers in applicable jurisdictions (including the EU and UK) have the right to withdraw from their initial subscription purchase within 14 calendar days of transaction date for a full refund.")}
              </p>
              <p className="mt-3">
                {t("refund_section_2_p2", "If you activated immediate digital delivery and conducted extensive bulk archival downloads during this window, refunds may be adjusted to account for the service utilized prior to withdrawal.")}
              </p>
            </article>

            <article className="surface-card p-6 sm:p-8 rounded-lg border border-[var(--border)]">
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--gold)]" />
                {t("refund_section_3_title", "3. Digital Records & One-Time Document Deliveries")}
              </h3>
              <p>
                {t("refund_section_3_p1", "Due to the immediate access nature of high-resolution digital scans, historical certificates, and GEDCOM tree files, one-time document processing fees are non-refundable once the file has been successfully delivered or downloaded, except in cases where:")}
              </p>
              <ul className="mt-2.5 list-disc pl-5 space-y-1.5">
                <li>{t("refund_exception_1", "The downloaded file is corrupted, illegible, or unreadable due to technical server defects.")}</li>
                <li>{t("refund_exception_2", "The wrong archival record was delivered due to our administrative error.")}</li>
              </ul>
            </article>

            <article className="surface-card p-6 sm:p-8 rounded-lg border border-[var(--border)]">
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--gold)]" />
                {t("refund_section_4_title", "4. How to Request a Refund")}
              </h3>
              <p>
                {t("refund_section_4_p1", "To request a refund, submit an email to")}{" "}
                <a href="mailto:devteam@rootstunisia.com" className="text-[var(--gold)] underline font-medium">
                  devteam@rootstunisia.com
                </a>{" "}
                {t("refund_section_4_with", "with:")}
              </p>
              <ul className="mt-2.5 list-disc pl-5 space-y-1.5">
                <li>{t("refund_req_item_1", "Your account email address.")}</li>
                <li>{t("refund_req_item_2", "Transaction ID or payment reference number.")}</li>
                <li>{t("refund_req_item_3", "A brief description of why you are requesting a refund.")}</li>
              </ul>
              <p className="mt-3">
                {t("refund_section_4_p2", "Refund requests are reviewed within 3 business days. Approved refunds are credited back to your original payment card or bank account within 5 to 10 business days.")}
              </p>
            </article>

            <article className="surface-card p-6 sm:p-8 rounded-lg border border-[var(--border)]">
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)] mb-3">
                {t("refund_section_5_title", "5. Legal Protections & Consumer Guarantees")}
              </h3>
              <p>
                {t("refund_section_5_p1", "Nothing in this Refund Policy excludes, restricts, or modifies any statutory consumer guarantees or rights granted under Tunisian consumer protection laws (Loi n° 98-40 relative aux techniques de vente et à la publicité) or consumer laws in your home jurisdiction.")}
              </p>
            </article>
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--muted-foreground)]">
            <Link to="/terms" className="hover:text-[var(--gold)] flex items-center gap-1.5 font-medium">
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" /> {t("return_to_terms", "Return to Terms of Service")}
            </Link>
            <p>{t("last_updated_date", "Last updated: October 2026")}</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
