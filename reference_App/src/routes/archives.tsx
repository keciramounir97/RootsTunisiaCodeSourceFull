import { createFileRoute } from "@tanstack/react-router";
import { Archive, MapPin } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import carthage from "../assets/slider-carthage.jpg";

export const Route = createFileRoute("/archives")({
  head: () => ({
    meta: [
      { title: "Tunisian Archives Directory — Where the Records Are Held" },
      {
        name: "description",
        content:
          "A directory of Tunisian archives: Archives Nationales de Tunisie, Bibliothèque Nationale, charaïque court depositories, habous fonds, municipal and regional collections.",
      },
      { property: "og:title", content: "Tunisian Archives Directory — Roots Tunisia" },
      {
        property: "og:description",
        content: "Institutions, cities and collections that hold Tunisian genealogical records.",
      },
    ],
  }),
  component: Archives,
});

const institutions = [
  {
    name: "Archives Nationales de Tunisie",
    city: "Tunis · Boulevard 9 Avril",
    holdings: "Beylical series, fiscal registers, Protectorate administration, charaïque sijillat.",
  },
  {
    name: "Bibliothèque Nationale de Tunisie",
    city: "Tunis · Souk El Attarine",
    holdings: "Arabic manuscripts, nasab texts, printed genealogies, periodicals.",
  },
  {
    name: "Jamaiyat el Habous Fonds",
    city: "Tunis",
    holdings: "Pious endowment deeds, beneficiary lines, property inventories.",
  },
  {
    name: "Tribunal Charaïque de Kairouan",
    city: "Kairouan",
    holdings: "Inheritance rulings, marriage contracts, guardianship files.",
  },
  {
    name: "Archives Municipales de Sfax",
    city: "Sfax",
    holdings: "État civil, market and port records, notarial acts, olive land titles.",
  },
  {
    name: "Regional Archives of Sousse & the Sahel",
    city: "Sousse · Monastir · Mahdia",
    holdings: "Civil registers, maritime records, emigration files.",
  },
  {
    name: "Djerba Community Registers",
    city: "Houmt Souk · Hara Sghira",
    holdings: "Ketubot, community rolls, synagogue and cemetery records.",
  },
  {
    name: "Testour Andalusian Collections",
    city: "Testour · Medjerda valley",
    holdings: "Morisco family papers, settlement records, mosque documents.",
  },
  {
    name: "Archives Nationales d'Outre-Mer (ANOM)",
    city: "Aix-en-Provence, France",
    holdings: "Protectorate correspondence, cadastre, European and Tunisian civil series.",
  },
  {
    name: "Institut National du Patrimoine",
    city: "Tunis · Carthage",
    holdings: "Epigraphy, excavation records, site and monument documentation.",
  },
];

function Archives() {
  return (
    <>
      <PageHero
        eyebrow="Archives"
        title="Where Tunisian Records Are Held"
        subtitle="A working directory of the institutions, cities and private collections that preserve Tunisia's genealogical record."
        image={carthage}
      />
      <Section>
        <SectionHeading
          eyebrow="Directory"
          title="Ten institutions to start with"
          intro="Each entry lists the city and the series most useful to family researchers, from beylical decrees to synagogue rolls."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {institutions.map((i) => (
            <article key={i.name} className="surface-card p-7">
              <Archive className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-display text-xl text-foreground">{i.name}</h2>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                <MapPin className="h-3.5 w-3.5" /> {i.city}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{i.holdings}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
