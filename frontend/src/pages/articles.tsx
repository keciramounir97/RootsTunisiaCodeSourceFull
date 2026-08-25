import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import medina from "../assets/medina-tunis.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { ArrowRight, BookOpen } from "lucide-react";

const articles = [
  {
    tag: "Archive Guide",
    title: "How to read a Tunisian état civil extract (1886–1956)",
    body: "Column by column: the double dating, the witness names, the mention of the caïdat, and what the margins hide.",
    date: "12 March 2026",
    readTime: "8 min read",
  },
  {
    tag: "Surnames",
    title: "Where Tunisian surnames come from: trade, tribe, town and Andalusia",
    body: "Chechaoui, Sfaxi, Zarrouk, Trabelsi, Chaouch — how occupation, origin and Ottoman office became family names.",
    date: "28 February 2026",
    readTime: "12 min read",
  },
  {
    tag: "Paleography",
    title: "Reading the qadi's hand: Maghrebi script for genealogists",
    body: "A practical primer on ligatures, abbreviations and legal formulae in 18th–19th century charaïque registers.",
    date: "9 February 2026",
    readTime: "15 min read",
  },
  {
    tag: "Habous",
    title: "Using habous deeds to prove three generations at once",
    body: "Endowment documents name founders and their descendants — the single richest Tunisian genealogical source.",
    date: "21 January 2026",
    readTime: "10 min read",
  },
  {
    tag: "Migration",
    title: "From the Sahel to Tunis: internal migration after 1900",
    body: "Tracking families who left Moknine, Ksibet and Jemmal for the capital, using rent rolls and school registers.",
    date: "4 January 2026",
    readTime: "9 min read",
  },
  {
    tag: "Family Story",
    title: "The Ben Ayed papers: a merchant family rebuilds its archive",
    body: "How one Tunis family digitized four hundred documents and reconnected with relatives in Sousse and Lyon.",
    date: "16 December 2025",
    readTime: "14 min read",
  },
];

export default function Articles() {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Articles & Research Notes on Tunisian Genealogy — Roots Tunisia"
        description="Guides to Tunisian archives, reading Ottoman and Arabic hands, surname origins, habous research and Protectorate-era civil registration."
        keywords={["Tunisian surnames origin", "Tunisian genealogy articles", "How to read charaique register"]}
      />

      <PageHero
        eyebrow="Articles & Stories"
        title="Research Writing on Tunisian Lineage"
        subtitle="Archive explanations, paleography primers, surname studies and family essays published for the Roots Tunisia community."
        image={medina}
      >
        <Link to="/subscriptions" className="btn-base btn-gold">
          Subscribe for Full Library
        </Link>
        <Link to="/contact" className="btn-base btn-outline-light">
          Submit an Article
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Latest"
          title="Guides, findings and family narratives"
          intro="Deep-dive essays and practical field guides written by Tunisian historians, paleographers, and community researchers."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <article
              key={a.title}
              className="surface-card flex flex-col p-7 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow">{a.tag}</p>
                <span className="text-[0.65rem] text-[var(--muted-foreground)] font-semibold">
                  {a.readTime}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl leading-snug text-[var(--foreground)]">{a.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{a.body}</p>
              <div className="mt-6 pt-4 border-t border-[var(--gold)]/20 flex items-center justify-between">
                <p className="text-xs text-[var(--muted-foreground)]">{a.date}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                  Read article <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
