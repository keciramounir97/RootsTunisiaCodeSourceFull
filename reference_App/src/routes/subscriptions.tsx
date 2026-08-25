import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import medina from "../assets/medina-tunis.jpg";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [
      { title: "Subscriptions — Roots Tunisia Research Plans" },
      {
        name: "description",
        content:
          "Choose a Roots Tunisia plan: free family tree building, Researcher access to Tunisian archives and GEDCOM export, or Institution access for associations and schools.",
      },
      { property: "og:title", content: "Subscriptions — Roots Tunisia" },
      {
        property: "og:description",
        content: "Plans for families, researchers and institutions working on Tunisian genealogy.",
      },
    ],
  }),
  component: Subscriptions,
});

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
    ],
    cta: "Create account",
    highlight: false,
  },
  {
    name: "Researcher",
    price: "39 DT",
    period: "per month",
    tagline: "For serious archive-led research",
    features: [
      "Unlimited trees and people",
      "Full library and archive index access",
      "GEDCOM 5.5.1 import and export",
      "Document codes and citation manager",
      "Oral history storage with transcripts",
    ],
    cta: "Start researching",
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
    ],
    cta: "Talk to us",
    highlight: false,
  },
];

function Subscriptions() {
  return (
    <>
      <PageHero
        eyebrow="Subscriptions"
        title="Plans for Every Tunisian Researcher"
        subtitle="Start free with your family tree, then unlock the full Tunisian archive index, citation tools and GEDCOM export when your research deepens."
        image={medina}
      />
      <Section>
        <SectionHeading eyebrow="Pricing" title="Three plans, no hidden fees" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`surface-card flex flex-col p-8 ${p.highlight ? "border-primary/60 ring-1 ring-primary/40" : ""}`}
            >
              {p.highlight && <p className="eyebrow">Most chosen</p>}
              <h2 className="mt-2 font-display text-2xl text-foreground">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <p className="mt-6 font-display text-4xl text-primary">{p.price}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.period}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to={p.name === "Institution" ? "/contact" : "/signup"}
                className={`btn-base mt-8 ${p.highlight ? "btn-red" : "btn-outline-ink"}`}
              >
                {p.cta}
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeading eyebrow="FAQ" title="Questions researchers ask" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            {
              q: "Do you hold original Tunisian documents?",
              a: "No. Roots Tunisia indexes and cites holdings; originals stay with the ANT, courts, municipalities and families.",
            },
            {
              q: "Can I keep my tree private?",
              a: "Yes. Every tree, photo and recording has its own visibility setting, from private to public.",
            },
            {
              q: "Do you support Arabic and French names?",
              a: "Trees store Arabic, Latin-transliterated and dialect name variants side by side, plus kunyas and nicknames.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes, monthly plans cancel at any time and your data stays exportable as GEDCOM.",
            },
          ].map((f) => (
            <div key={f.q} className="surface-card p-6">
              <h3 className="font-display text-lg text-foreground">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
