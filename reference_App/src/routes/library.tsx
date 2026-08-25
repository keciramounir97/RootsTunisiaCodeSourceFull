import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import manuscript from "../assets/manuscript.jpg";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Tunisian Genealogy Library — Manuscripts, Registers & Guides" },
      {
        name: "description",
        content:
          "A curated Tunisian research library: manuscripts, état civil extracts, charaïque registers, habous deeds, nasab texts, maps and archive guides.",
      },
      { property: "og:title", content: "Tunisian Genealogy Library — Roots Tunisia" },
      {
        property: "og:description",
        content: "Digitized Tunisian books, registers, deeds and maps organized for family research.",
      },
    ],
  }),
  component: Library,
});

const collections = [
  {
    title: "Manuscripts & Family Papers",
    body: "Private family collections, nasab rolls, correspondence and marriage contracts held in Tunisian households.",
    count: "1,240 items",
  },
  {
    title: "État Civil Tunisien",
    body: "Civil status registers from 1886 onward: births, marriages, deaths, and municipal indexes by governorate.",
    count: "480,000 entries",
  },
  {
    title: "Charaïque Court Registers",
    body: "Sijillat of the qadi courts of Tunis, Kairouan, Sfax and Sousse: inheritance, guardianship, property.",
    count: "3,100 volumes",
  },
  {
    title: "Habous Deeds",
    body: "Pious endowment records naming founders, beneficiaries and descendants across generations.",
    count: "12,700 deeds",
  },
  {
    title: "Beylical Decrees & Majba Rolls",
    body: "Husainid decrees, appointments, and the majba poll-tax registers listing heads of households.",
    count: "890 registers",
  },
  {
    title: "Maps, Cadastre & Gazetteers",
    body: "Protectorate cadastral plans, tribal territory maps and place-name gazetteers for locating ancestors.",
    count: "2,050 sheets",
  },
  {
    title: "Community Registers of Djerba & Testour",
    body: "Jewish-Tunisian ketubot and Andalusian-Morisco family records from Testour and the Medjerda valley.",
    count: "640 records",
  },
  {
    title: "Nasab & Lineage Texts",
    body: "Printed and manuscript genealogies of sharifian, marabout and tribal lineages of Tunisia.",
    count: "410 titles",
  },
  {
    title: "Schools, Army & Emigration Files",
    body: "Sadiki College and Zitouna registers, military conscription lists, and emigration papers to France and Italy.",
    count: "1,860 files",
  },
];

function Library() {
  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Tunisian Genealogy Library"
        subtitle="Digitized books, manuscripts, civil extracts, court registers, deeds and maps — organized so every claim in your tree can carry a citation."
        image={manuscript}
      >
        <Link to="/subscriptions" className="btn-base btn-gold">
          Get full access
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Collections"
          title="Nine core collections for Tunisian research"
          intro="Each collection is indexed by governorate, period and record type, with guidance on what the document can and cannot prove."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <article key={c.title} className="surface-card p-7">
              <BookOpen className="h-5 w-5 text-gold" />
              <h3 className="mt-4 font-display text-xl text-foreground">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              <p className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">
                {c.count}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
