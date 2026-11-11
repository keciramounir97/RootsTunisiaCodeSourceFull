import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, ShieldCheck, Mail, FileText, CheckCircle2 } from "lucide-react";
import { PageHero, Section } from "../components/site/Primitives";
import { useTranslation } from "../context/TranslationContext";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
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

const SECTION_ICONS = [RefreshCw, CheckCircle2, FileText, Mail, ShieldCheck];

export default function RefundPolicy() {
  const { t, locale } = useTranslation();
  const i18nFallback = useMemo<LegalDocument>(
    () => ({
      title: t("refund_title", "Refund & Cancellation Policy"),
      intro: t(
        "fair_billing_desc",
        "Roots Tunisia is dedicated to transparent, honest pricing. We do not use hidden fees, deceptive cancellation barriers, or unexpected recurring add-ons. You can manage or cancel your subscription at any time.",
      ),
      sections: [
        {
          heading: t("refund_section_1_title", "1. Subscription Cancellation"),
          body: [
            t(
              "refund_section_1_p1",
              "You may cancel your recurring monthly or annual plan at any time through your User Settings dashboard or by emailing our team at",
            ),
            " devteam@rootstunisia.com. ",
            t(
              "refund_section_1_p2",
              "Upon cancellation, your subscription access will continue uninterrupted until the end of your current paid billing period. You will not be billed again.",
            ),
          ].join(""),
        },
        {
          heading: t("refund_section_2_title", "2. Statutory 14-Day Cooling-Off Period"),
          body: [
            t(
              "refund_section_2_p1",
              "In compliance with international and European consumer protection standards, customers in applicable jurisdictions (including the EU and UK) have the right to withdraw from their initial subscription purchase within 14 calendar days of transaction date for a full refund.",
            ),
            "\n\n",
            t(
              "refund_section_2_p2",
              "If you activated immediate digital delivery and conducted extensive bulk archival downloads during this window, refunds may be adjusted to account for the service utilized prior to withdrawal.",
            ),
          ].join(""),
        },
        {
          heading: t("refund_section_3_title", "3. Digital Records & One-Time Document Deliveries"),
          body: [
            t(
              "refund_section_3_p1",
              "Due to the immediate access nature of high-resolution digital scans, historical certificates, and GEDCOM tree files, one-time document processing fees are non-refundable once the file has been successfully delivered or downloaded, except in cases where:",
            ),
            "\n• ",
            t("refund_exception_1", "The downloaded file is corrupted, illegible, or unreadable due to technical server defects."),
            "\n• ",
            t("refund_exception_2", "The wrong archival record was delivered due to our administrative error."),
          ].join(""),
        },
        {
          heading: t("refund_section_4_title", "4. How to Request a Refund"),
          body: [
            t("refund_section_4_p1", "To request a refund, submit an email to"),
            " devteam@rootstunisia.com ",
            t("refund_section_4_with", "with:"),
            "\n• ",
            t("refund_req_item_1", "Your account email address."),
            "\n• ",
            t("refund_req_item_2", "Transaction ID or payment reference number."),
            "\n• ",
            t("refund_req_item_3", "A brief description of why you are requesting a refund."),
            "\n\n",
            t(
              "refund_section_4_p2",
              "Refund requests are reviewed within 3 business days. Approved refunds are credited back to your original payment card or bank account within 5 to 10 business days.",
            ),
          ].join(""),
        },
        {
          heading: t("refund_section_5_title", "5. Legal Protections & Consumer Guarantees"),
          body: t(
            "refund_section_5_p1",
            "Nothing in this Refund Policy excludes, restricts, or modifies any statutory consumer guarantees or rights granted under Tunisian consumer protection laws (Loi n° 98-40 relative aux techniques de vente et à la publicité) or consumer laws in your home jurisdiction.",
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
      .get("/legal/refund", { params: { locale } })
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
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={doc.title || t("seo_refund_title", "سياسة الاسترجاع والإلغاء — جذور تونس")}
        description="Learn about refund eligibility, subscription cancellations, statutory withdrawal rights, and digital download terms on Roots Tunisia."
        keywords={["Roots Tunisia refund", "subscription cancellation", "genealogy refund policy"]}
      />

      <PageHero
        eyebrow={t("refund_eyebrow", "Consumer Rights & Billing")}
        title={doc.title || t("refund_title", "Refund & Cancellation Policy")}
        subtitle={t(
          "refund_subtitle",
          "Clear, fair, and transparent billing terms for our Tunisian and international researchers.",
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
              {doc.intro ? (
                <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed whitespace-pre-line">
                  {doc.intro}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {doc.sections.map((section, index) => {
              const Icon = SECTION_ICONS[index % SECTION_ICONS.length];
              return (
                <article
                  key={index}
                  className="surface-card p-6 sm:p-8 rounded-lg border border-[var(--border)]"
                >
                  <h3 className="font-display text-xl font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-[var(--gold)]" />
                    {section.heading}
                  </h3>
                  <p className="whitespace-pre-line">{section.body}</p>
                </article>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--muted-foreground)]">
            <Link to="/terms" className="hover:text-[var(--gold)] flex items-center gap-1.5 font-medium">
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" /> {t("return_to_terms", "Return to Terms of Service")}
            </Link>
            <p>{t("last_updated_date", "Last updated: October 2026")}</p>
          </div>
          <SiteCustomBlocks pageId="refund" className="mt-8" />
        </div>
      </Section>
    </div>
  );
}
