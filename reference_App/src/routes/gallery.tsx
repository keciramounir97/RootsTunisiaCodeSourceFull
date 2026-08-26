import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import medina from "../assets/medina-tunis.jpg";
import eljem from "../assets/eljem.jpg";
import djerba from "../assets/djerba.jpg";
import carthage from "../assets/slider-carthage.jpg";
import kairouan from "../assets/slider-kairouan.jpg";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import manuscript from "../assets/manuscript.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Tunisian Visual Heritage — Roots Tunisia Photo Gallery" },
      {
        name: "description",
        content:
          "A visual archive of Tunisia: Carthage, Kairouan, the Medina of Tunis, El Jem, Djerba, Sidi Bou Saïd, manuscripts and family portraits.",
      },
      { property: "og:title", content: "Tunisian Visual Heritage — Roots Tunisia" },
      {
        property: "og:description",
        content: "Places, documents and portraits that anchor Tunisian lineages to their land.",
      },
    ],
  }),
  component: Gallery,
});

const items = [
  { image: carthage, title: "Carthage", caption: "Punic and Roman capital, Governorate of Tunis" },
  { image: kairouan, title: "Great Mosque of Kairouan", caption: "Aghlabid scholarship and nasab chains" },
  { image: medina, title: "Medina of Tunis", caption: "Souks, funduqs and beldi family quarters" },
  { image: eljem, title: "Amphitheatre of El Jem", caption: "Roman Thysdrus, Governorate of Mahdia" },
  { image: djerba, title: "Djerba", caption: "Menzel houses, olive groves and island registers" },
  { image: sidiBouSaid, title: "Sidi Bou Saïd", caption: "Blue and white heritage above the Gulf of Tunis" },
  { image: manuscript, title: "Charaïque register", caption: "Qadi court entry with wax seal, 19th century" },
  { image: medina, title: "Medina Ornate Gate", caption: "Studded wooden door with wrought-iron grille, c. 1915" },
];

function Gallery() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Tunisian Visual Heritage"
        subtitle="Photographs, documents and places uploaded by the Roots Tunisia community, each kept with its context and provenance."
        image={sidiBouSaid}
      />
      <Section>
        <SectionHeading
          eyebrow={`Gallery (${items.length})`}
          title="Places, documents and portraits"
          intro="Images are stored with captions, dates, locations and the family or record they belong to."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <figure key={it.title} className="surface-card overflow-hidden">
              <img
                src={it.image}
                alt={it.title}
                loading="lazy"
                width={1200}
                height={800}
                className="h-60 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <figcaption className="p-5">
                <h3 className="font-display text-lg text-foreground">{it.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}
