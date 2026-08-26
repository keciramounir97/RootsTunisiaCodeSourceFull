import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";

export const Route = createFileRoute("/genealogy-gallery")({
  head: () => ({
    meta: [
      { title: "Tunisian Family Trees — Roots Tunisia Genealogy Gallery" },
      {
        name: "description",
        content:
          "Browse public Tunisian family trees from Tunis, Sfax, Kairouan, Djerba and the Djérid, with archive sources, document codes and GEDCOM 5.5.1 support.",
      },
      { property: "og:title", content: "Tunisian Family Trees — Roots Tunisia" },
      {
        property: "og:description",
        content:
          "Public Tunisian lineages with archive-ready metadata, source notes and GEDCOM export.",
      },
    ],
  }),
  component: GenealogyGallery,
});

function GenealogyGallery() {
  return (
    <>
      <PageHero
        eyebrow="Genealogy Gallery"
        title="Tunisian Family Trees"
        subtitle="Public lineages documented with état civil extracts, charaïque registers, habous deeds and family memory."
        image={sidiBouSaid}
      >
        <Link to="/signup" className="btn-base btn-gold">
          Create your tree
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Family Tree Builder"
          title="Explore public Tunisian lineages"
          intro="Every tree carries its archive source and document code so other researchers can verify, extend or challenge the evidence."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTrees.map((t) => (
            <TreeCard key={t.id} tree={t} />
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Build Multi-Generational Trees",
              b: "Connect parents, grandparents, historical ancestors and extended families across Tunisian regions.",
            },
            {
              t: "Attach Historical Documents",
              b: "Upload birth records, marriage contracts, ANT and Protectorate archive scans, manuscripts and more.",
            },
            {
              t: "Trace Migration Paths",
              b: "Follow lineages across Carthage, Kairouan, Tunis, Sfax, Djerba, the Sahel, the Djérid and the diaspora.",
            },
          ].map((c) => (
            <div key={c.t} className="surface-card p-7">
              <h3 className="font-display text-xl text-foreground">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.b}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
