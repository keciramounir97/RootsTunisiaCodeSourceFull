import { useState } from "react";
import {
  Check,
  ShieldCheck,
  Zap,
  Lock,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Mail,
  FileCheck,
  X,
  Sparkles,
  Layers,
  Users,
  Download,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { Link } from "react-router-dom";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import medina from "../assets/medina-tunis.jpg";
import SEO from "../components/SEO";

type ComparisonCell = string | boolean;

interface ComparisonRow {
  feature: string;
  zitouna: ComparisonCell;
  researcher: ComparisonCell;
  institution: ComparisonCell;
}

export default function Subscriptions() {
  const { t, isRtl } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      id: "zitouna",
      nameKey: "plan_zitouna_name",
      price: "0 TND",
      period: t("free_forever", "Gratuit / Free"),
      taglineKey: "plan_zitouna_tagline",
      features: [
        "feat_zitouna_1",
        "feat_zitouna_2",
        "feat_zitouna_3",
        "feat_zitouna_4",
        "feat_zitouna_5",
      ],
      ctaKey: "plan_zitouna_cta",
      to: "/signup",
      highlight: false,
      badge: null,
    },
    {
      id: "researcher",
      nameKey: "plan_researcher_name",
      price: billingCycle === "monthly" ? "39 TND" : "390 TND",
      period: billingCycle === "monthly" ? t("plan_researcher_period") : t("annual_billing"),
      taglineKey: "plan_researcher_tagline",
      features: [
        "feat_researcher_1",
        "feat_researcher_2",
        "feat_researcher_3",
        "feat_researcher_4",
        "feat_researcher_5",
        "feat_researcher_6",
      ],
      ctaKey: "plan_researcher_cta",
      to: `/payment?plan=researcher&amount=${billingCycle === "monthly" ? "39" : "390"}`,
      highlight: true,
      badge: t("most_popular"),
    },
    {
      id: "institution",
      nameKey: "plan_institution_name",
      price: t("plan_institution_price"),
      period: t("plan_institution_period"),
      taglineKey: "plan_institution_tagline",
      features: [
        "feat_institution_1",
        "feat_institution_2",
        "feat_institution_3",
        "feat_institution_4",
        "feat_institution_5",
        "feat_institution_6",
      ],
      ctaKey: "plan_institution_cta",
      to: "/contact",
      highlight: false,
      badge: t("custom_quote", "Academic & Heritage"),
    },
  ];

  const comparisonRows: ComparisonRow[] = [
    {
      feature: t("comp_max_trees"),
      zitouna: t("comp_val_1_tree"),
      researcher: t("comp_val_unlimited"),
      institution: t("comp_val_unlimited"),
    },
    {
      feature: t("comp_max_members"),
      zitouna: t("comp_val_150_members"),
      researcher: t("comp_val_unlimited"),
      institution: t("comp_val_unlimited"),
    },
    {
      feature: t("comp_archive_access"),
      zitouna: t("comp_val_read_only"),
      researcher: t("comp_val_full_24_gov"),
      institution: t("comp_val_full_24_gov"),
    },
    {
      feature: t("comp_gedcom"),
      zitouna: false,
      researcher: true,
      institution: true,
    },
    {
      feature: t("comp_citations"),
      zitouna: false,
      researcher: true,
      institution: true,
    },
    {
      feature: t("comp_audio"),
      zitouna: false,
      researcher: true,
      institution: true,
    },
    {
      feature: t("comp_team_seats"),
      zitouna: false,
      researcher: "1 User",
      institution: t("comp_val_multi_seat"),
    },
  ];

  const faqs = [
    { q: t("faq_payment_q"), a: t("faq_payment_a") },
    { q: t("faq_cancel_q"), a: t("faq_cancel_a") },
    { q: t("faq_gedcom_q"), a: t("faq_gedcom_a") },
    { q: t("faq_privacy_q"), a: t("faq_privacy_a") },
  ];

  const renderCell = (val: ComparisonCell) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
      ) : (
        <X className="h-4 w-4 text-[var(--muted-foreground)] opacity-35 mx-auto" />
      );
    }
    return <span>{val}</span>;
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_subscriptions_title")}
        description={t("seo_subscriptions_desc")}
        keywords={["Roots Tunisia pricing", "Tunisian genealogy subscription", "GEDCOM export Tunisia"]}
      />

      <PageHero
        eyebrow={t("nav_subscriptions")}
        title={t("subscriptions_hero_title")}
        subtitle={t("subscriptions_hero_subtitle")}
        image={medina}
      >
        <Link to="/signup" className="btn-base btn-gold w-full sm:w-auto min-w-[180px]">
          {t("get_started_for_free")}
        </Link>
        <Link to="/sources" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[180px]">
          {t("browse_sources")}
        </Link>
      </PageHero>

      {/* Main Pricing Section */}
      <Section>
        <SectionHeading
          center={true}
          eyebrow={t("pricing_eyebrow")}
          title={t("three_plans_title")}
          intro={t("three_plans_intro")}
        />

        {/* Interactive Billing Frequency Toggle */}
        <div className="mt-8 flex items-center justify-center">
          <div className="surface-card p-1.5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/90 flex items-center gap-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[var(--gold)] text-[#1f160f] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {t("monthly_billing")}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-[var(--gold)] text-[#1f160f] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <span>{t("annual_billing")}</span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 px-2 py-0.5 text-[0.65rem] font-bold">
                {t("two_months_free")}
              </span>
            </button>
          </div>
        </div>

        {/* 3 Symmetric Plan Cards */}
        <div className="mt-10 sm:mt-12 grid gap-6 lg:grid-cols-3 items-stretch">
          {plans.map((p) => (
            <article
              key={p.id}
              className={`surface-card frame-gold flex h-full flex-col justify-between p-7 sm:p-8 rounded-lg shadow-xl bg-[var(--card)]/95 backdrop-blur-sm text-start transition-all hover:-translate-y-1 ${
                p.highlight
                  ? "border-2 border-[var(--gold)] ring-2 ring-[var(--gold)]/35 shadow-2xl relative"
                  : "border border-[var(--gold)]/30 hover:border-[var(--gold)]"
              }`}
            >
              <div>
                {p.badge && (
                  <div className="mb-3">
                    <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#1f160f]">
                      {p.badge}
                    </span>
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                  {t(p.nameKey)}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)] min-h-[36px]">
                  {t(p.taglineKey)}
                </p>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-[var(--gold)]/20 flex items-baseline gap-2">
                  <p dir="ltr" className="font-display text-4xl font-bold text-[var(--primary)] dark:text-[var(--gold)]">
                    {p.price}
                  </p>
                  <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] font-semibold">
                    / {p.period}
                  </span>
                </div>

                {/* Features List */}
                <div className="mt-6">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)] mb-3">
                    {t("plan_features_included")}
                  </p>
                  <ul className="space-y-3">
                    {p.features.map((featKey) => (
                      <li key={featKey} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--foreground)]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
                        <span className="leading-snug">{t(featKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-[var(--gold)]/20">
                <Link
                  to={p.to}
                  className={`btn-base w-full flex items-center justify-center gap-2 ${
                    p.highlight ? "btn-gold shadow-md" : "btn-outline"
                  }`}
                >
                  <span>{t(p.ctaKey)}</span>
                  <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Feature Comparison Table */}
      <Section className="!pt-0">
        <SectionHeading
          center={true}
          eyebrow={t("pricing_eyebrow")}
          title={t("comparison_matrix_title")}
          intro={t("comparison_matrix_intro")}
        />

        <div className="mt-8 sm:mt-10 overflow-x-auto">
          <div className="surface-card frame-gold rounded-lg shadow-lg overflow-hidden min-w-[640px]">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--gold)]/30 bg-[var(--secondary)]/40">
                  <th className="p-4 sm:p-5 font-bold text-start text-[var(--foreground)]">
                    {t("feature_col_label")}
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-center text-[var(--foreground)]">
                    {t("plan_zitouna_name")}
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-center text-[var(--gold)]">
                    {t("plan_researcher_name")}
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-center text-[var(--foreground)]">
                    {t("plan_institution_name")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gold)]/15">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[var(--gold)]/5 transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-medium text-[var(--foreground)] text-start">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-center text-[var(--muted-foreground)]">
                      {renderCell(row.zitouna)}
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-[var(--gold)]">
                      {renderCell(row.researcher)}
                    </td>
                    <td className="p-4 sm:p-5 text-center text-[var(--foreground)]">
                      {renderCell(row.institution)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Interactive FAQ Accordion Section */}
      <Section className="bg-[var(--secondary)]/35">
        <SectionHeading
          center={true}
          eyebrow={t("faq_eyebrow")}
          title={t("subscriptions_faq_title")}
          intro={t("subscriptions_faq_intro")}
        />

        <div className="mt-8 sm:mt-10 mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="surface-card frame-gold rounded-lg shadow-sm overflow-hidden bg-[var(--card)] text-start transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start font-bold text-sm sm:text-base text-[var(--foreground)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[var(--gold)] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--gold)]/15 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
