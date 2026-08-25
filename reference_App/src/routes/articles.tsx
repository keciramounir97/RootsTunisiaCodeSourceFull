import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import medina from "../assets/medina-tunis.jpg";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Articles & Research Notes on Tunisian Genealogy" },
      {
        name: "description",
        content:
          "Guides to Tunisian archives, reading Ottoman and Arabic hands, surname origins, habous research and Protectorate-era civil registration.",
      },
      { property: "og:title", content: "Articles & Stories — Roots Tunisia" },
      {
        property: "og:description",
        content: "Archive guides, family narratives and local Tunisian history from our researchers.",
      },
    ],
  }),
  component: Articles,
});

const articles = [
  {
    tag: "Archive Guide",
    title: "How to read a Tunisian état civil extract (1886–1956)",
    body: "Column by column: the double dating, the witness names, the mention of the caïdat, and what the margins hide.",
    date: "12 March 2026",
  },
  {
    tag: "Surnames",
    title: "Where Tunisian surnames come from: trade, tribe, town and Andalusia",
    body: "Chechaoui, Sfaxi, Zarrouk, Trabelsi, Chaouch — how occupation, origin and Ottoman office became family names.",
    date: "28 February 2026",
  },
  {
    tag: "Paleography",
    title: "Reading the qadi's hand: Maghrebi script for genealogists",
    body: "A practical primer on ligatures, abbreviations and legal formulae in 18th–19th century charaïque registers.",
    date: "9 February 2026",
  },
  {
    tag: "Habous",
    title: "Using habous deeds to prove three generations at once",
    body: "Endowment documents name founders and their descendants — the single richest Tunisian genealogical source.",
    date: "21 January 2026",
  },
  {
    tag: "Migration",
    title: "From the Sahel to Tunis: internal migration after 1900",
    body: "Tracking families who left Moknine, Ksibet and Jemmal for the capital, using rent rolls and school registers.",
    date: "4 January 2026",
  },
  {
    tag: "Family Story",
    title: "The Ben Ayed papers: a merchant family rebuilds its archive",
    body: "How one Tunis family digitized four hundred documents and reconnected with relatives in Sousse and Lyon.",
    date: "16 December 2025",
  },
];

function Articles() {
  return (
    <>
      <PageHero
        eyebrow="Articles & Stories"
        title="Research Writing on Tunisian Lineage"
        subtitle="Archive explanations, paleography primers, surname studies and family essays published for the Roots Tunisia community."
        image={medina}
      />
      <Section>
        <SectionHeading
          eyebrow="Latest"
          title="Guides, findings and family narratives"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <article key={a.title} className="surface-card flex flex-col p-7">
              <p className="eyebrow">{a.tag}</p>
              <h2 className="mt-3 font-display text-xl leading-snug text-foreground">{a.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              <p className="mt-6 text-xs text-muted-foreground">{a.date}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
