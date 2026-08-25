import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import kairouan from "../assets/slider-kairouan.jpg";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Tunisian Genealogy Sources — Civil, Court, Habous & Colonial" },
      {
        name: "description",
        content:
          "The source families of Tunisian genealogy: état civil, charaïque court sijillat, habous deeds, beylical decrees, cadastre, school, military and community registers.",
      },
      { property: "og:title", content: "Tunisian Genealogy Sources — Roots Tunisia" },
      {
        property: "og:description",
        content: "What each Tunisian source proves, where it is held, and which period it covers.",
      },
    ],
  }),
  component: Sources,
});

const sources = [
  {
    title: "État Civil Tunisien",
    period: "1886 – present",
    holds: "Municipalities · Archives Nationales de Tunisie",
    proves: "Births, marriages, deaths, parents' names, occupations, exact places and dates.",
  },
  {
    title: "Charaïque Court Sijillat",
    period: "16th c. – 1956",
    holds: "ANT · regional court depositories",
    proves: "Inheritance shares, guardianship, marriage contracts, property sales naming heirs.",
  },
  {
    title: "Habous (Waqf) Deeds",
    period: "13th c. – 1957",
    holds: "Jamaiyat el Habous fonds, ANT",
    proves: "Founders and named lines of descendants as endowment beneficiaries.",
  },
  {
    title: "Beylical Decrees & Appointments",
    period: "1705 – 1957",
    holds: "ANT · Série Beylicale",
    proves: "Office holding, honorifics, land grants and household affiliation.",
  },
  {
    title: "Majba & Tax Rolls",
    period: "1856 – 1881",
    holds: "ANT fiscal series",
    proves: "Heads of household per douar and tribe — an effective proto-census.",
  },
  {
    title: "Cadastre & Land Titles",
    period: "1885 – present",
    holds: "OTC · Protectorate cadastral service",
    proves: "Property continuity, co-heirs, neighbouring kin and village geography.",
  },
  {
    title: "School & College Registers",
    period: "1875 – present",
    holds: "Sadiki College, Zitouna, Alaoui, lycées",
    proves: "Birth dates, fathers' occupations, home addresses and sibling groups.",
  },
  {
    title: "Military & Conscription Lists",
    period: "1883 – present",
    holds: "ANT · French army archives",
    proves: "Physical descriptions, residence, literacy and service or emigration.",
  },
  {
    title: "Community & Diaspora Registers",
    period: "18th c. – present",
    holds: "Djerba, Testour, Marseille, Paris, Milan",
    proves: "Ketubot, community rolls, consulate files and emigration paperwork.",
  },
];

function Sources() {
  return (
    <>
      <PageHero
        eyebrow="Sources"
        title="Tunisian Sources & Source Families"
        subtitle="Nine source families that carry Tunisian genealogy, with what each one proves, where it is held, and the period it covers."
        image={kairouan}
      >
        <Link to="/periods" className="btn-base btn-gold">
          See the timeline
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Evidence"
          title="Know what a document can prove before you cite it"
          intro="Roots Tunisia records every claim with its source family, holding institution and document code, so your tree stays verifiable."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((s) => (
            <article key={s.title} className="surface-card p-7">
              <FileText className="h-5 w-5 text-gold" />
              <h2 className="mt-4 font-display text-xl text-foreground">{s.title}</h2>
              <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">
                {s.period}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.proves}</p>
              <p className="mt-4 border-t border-gold/25 pt-3 text-xs text-muted-foreground">
                Held at: {s.holds}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
