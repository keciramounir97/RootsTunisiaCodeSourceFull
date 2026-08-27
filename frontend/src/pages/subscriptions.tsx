import { useState } from "react";
import { Check, ShieldCheck, Zap } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { Link } from "react-router-dom";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import medina from "../assets/medina-tunis.jpg";
import SEO from "../components/SEO";

const plans = [
  {
    name: "Zitouna",
    price: "Free",
    period: "forever",
    tagline: "For families starting their first tree",
    features: [
      "One family tree, up to 150 people",
      "Photo uploads with captions",
      "Read-only access to period guides",
      "Community forum access",
      "Standard support",
    ],
    cta: "Create account",
    to: "/signup",
    highlight: false,
  },
  {
    name: "Researcher",
    price: "39 TND",
    period: "per month",
    tagline: "For serious archive-led research",
    features: [
      "Unlimited trees and people",
      "Full library and archive index access",
      "GEDCOM 5.5.1 import and export",
      "Document codes and citation manager",
      "Oral history storage with transcripts",
      "Priority research assistance",
    ],
    cta: "Start researching",
    to: "/payment?plan=researcher&amount=39",
    highlight: true,
  },
  {
    name: "Institution",
    price: "On request",
    period: "annual",
    tagline: "For associations, schools and archives",
    features: [
      "Multi-seat team accounts",
      "Bulk digitization workspace",
      "Private collections and permissions",
      "Training in Maghrebi paleography",
      "Dedicated Tunisian support line",
      "Custom SLA & data export",
    ],
    cta: "Contact Us",
    to: "/contact",
    highlight: false,
  },
];

export default function Subscriptions() {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Subscriptions — Roots Tunisia Research Plans"
        description="Choose a Roots Tunisia plan: free family tree building, Researcher access to Tunisian archives and GEDCOM export, or Institution access for associations and schools."
        keywords={["Roots Tunisia pricing", "Tunisian genealogy subscription", "GEDCOM export Tunisia"]}
      />

      <PageHero
        eyebrow="Subscriptions"
        title="Plans for Every Tunisian Researcher"
        subtitle="Start free with your family tree, then unlock the full Tunisian archive index, citation tools and GEDCOM export when your research deepens."
        image={medina}
      >
        <Link to="/signup" className="btn-base btn-gold">
          Get started for free
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Pricing"
          title="Three plans, transparent pricing in Tunisian Dinars"
          intro="All plans include secure data hosting, privacy protection according to Tunisian regulations, and community contributions."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`surface-card flex flex-col p-8 transition-transform hover:-translate-y-1 ${
                p.highlight
                  ? "border-2 border-[var(--primary)] shadow-[0_10px_30px_rgba(200,16,46,0.15)] ring-1 ring-[var(--primary)]/40"
                  : ""
              }`}
            >
              {p.highlight && (
                <div className="mb-2">
                  <span className="rounded-full bg-[var(--primary)] px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--primary-foreground)]">
                    Most Popular
                  </span>
                </div>
              )}
              <h2 className="font-display text-2xl text-[var(--foreground)]">{p.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{p.tagline}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <p className="font-display text-4xl font-bold text-[var(--primary)]">{p.price}</p>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {p.period}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3 border-t border-[var(--gold)]/20 pt-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to={p.to}
                  className={`btn-base w-full ${p.highlight ? "btn-red" : "btn-outline-ink"}`}
                >
                  {p.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
