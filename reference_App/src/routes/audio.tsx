import { createFileRoute } from "@tanstack/react-router";
import { Play, Mic } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import djerba from "../assets/djerba.jpg";

export const Route = createFileRoute("/audio")({
  head: () => ({
    meta: [
      { title: "Tunisian Oral Histories — Recorded Family Memory" },
      {
        name: "description",
        content:
          "Recorded Tunisian oral history: elders on village names, trades, marriages, migration, malouf, tribal poetry and Amazigh memory of Djerba and Matmata.",
      },
      { property: "og:title", content: "Tunisian Oral Histories — Roots Tunisia" },
      {
        property: "og:description",
        content: "Preserve elders' voices, dialect memory and family stories beside the archives.",
      },
    ],
  }),
  component: Audio,
});

const recordings = [
  {
    title: "Hajja Zohra on the Souk of Nabeul",
    place: "Nabeul · 1998 recording",
    length: "42 min",
    body: "Pottery families, apprenticeships, and the marriage networks that linked Nabeul to Tunis.",
  },
  {
    title: "Si Mohamed Ben Amor, chechia maker",
    place: "Medina of Tunis · 2004",
    length: "37 min",
    body: "The chechia guild, workshop hierarchy, and how a trade name became a family surname.",
  },
  {
    title: "Amazigh memory of Chenini",
    place: "Tataouine · 2011",
    length: "55 min",
    body: "Berber place-names, granary ownership, and the lineage vocabulary used before civil registration.",
  },
  {
    title: "Djerbian migration to Marseille",
    place: "Houmt Souk · 2016",
    length: "29 min",
    body: "Grocery networks, remittances, and the papers families kept on both shores.",
  },
  {
    title: "Malouf and family celebration",
    place: "Testour · 2019",
    length: "48 min",
    body: "Andalusian repertoire, wedding rituals and the songs that carry ancestral names.",
  },
  {
    title: "Fellah memory of the Sahel olive groves",
    place: "Moknine · 2021",
    length: "33 min",
    body: "Land division among heirs, habous plots, and drought years remembered by generation.",
  },
];

function Audio() {
  return (
    <>
      <PageHero
        eyebrow="Oral Histories"
        title="Voices Before They Disappear"
        subtitle="Interviews, songs, recitations and dialect memories recorded across Tunisia and the diaspora, each linked to the family and place it documents."
        image={djerba}
      />
      <Section>
        <SectionHeading
          eyebrow="Audio Memory"
          title="Recorded testimony from across Tunisia"
          intro="Every recording is transcribed, tagged by governorate and period, and attached to the tree branches it supports."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recordings.map((r) => (
            <article key={r.title} className="surface-card p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Play className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-gold">
                    {r.length}
                  </p>
                  <p className="text-xs text-muted-foreground">{r.place}</p>
                </div>
              </div>
              <h3 className="mt-4 font-display text-xl text-foreground">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              <div className="mt-5 h-1 w-full rounded-full bg-secondary">
                <div className="h-1 w-1/3 rounded-full bg-gold" />
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="zellige surface-card px-6 py-12 text-center">
          <Mic className="mx-auto h-7 w-7 text-gold" />
          <h2 className="display-lg mt-4 text-foreground">Record your own elders</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
            Our interview guide includes Tunisian-specific prompts: village and douar names,
            trades, habous plots, kunyas, marriage witnesses and migration routes.
          </p>
        </div>
      </Section>
    </>
  );
}
