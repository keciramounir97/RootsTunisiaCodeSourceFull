import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, Mic, Volume2 } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import djerba from "../assets/djerba.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";

const recordings = [
  {
    id: 1,
    title: "Hajja Zohra on the Souk of Nabeul",
    place: "Nabeul · 1998 recording",
    length: "42 min",
    body: "Pottery families, apprenticeships, and the marriage networks that linked Nabeul to Tunis.",
  },
  {
    id: 2,
    title: "Si Mohamed Ben Amor, chechia maker",
    place: "Medina of Tunis · 2004",
    length: "37 min",
    body: "The chechia guild, workshop hierarchy, and how a trade name became a family surname.",
  },
  {
    id: 3,
    title: "Amazigh memory of Chenini",
    place: "Tataouine · 2011",
    length: "55 min",
    body: "Berber place-names, granary ownership, and the lineage vocabulary used before civil registration.",
  },
  {
    id: 4,
    title: "Djerbian migration to Marseille",
    place: "Houmt Souk · 2016",
    length: "29 min",
    body: "Grocery networks, remittances, and the papers families kept on both shores.",
  },
  {
    id: 5,
    title: "Malouf and family celebration",
    place: "Testour · 2019",
    length: "48 min",
    body: "Andalusian repertoire, wedding rituals and the songs that carry ancestral names.",
  },
  {
    id: 6,
    title: "Fellah memory of the Sahel olive groves",
    place: "Moknine · 2021",
    length: "33 min",
    body: "Land division among heirs, habous plots, and drought years remembered by generation.",
  },
];

export default function Audio() {
  const { t } = useTranslation();
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Tunisian Oral Histories — Recorded Family Memory"
        description="Recorded Tunisian oral history: elders on village names, trades, marriages, migration, malouf, tribal poetry and Amazigh memory of Djerba and Matmata."
        keywords={["Tunisian oral history", "Tunisia elders voice", "Malouf Testour heritage"]}
      />

      <PageHero
        eyebrow="Oral Histories"
        title="Voices Before They Disappear"
        subtitle="Interviews, songs, recitations and dialect memories recorded across Tunisia and the diaspora, each linked to the family and place it documents."
        image={djerba}
      >
        <Link to="/subscriptions" className="btn-base btn-gold">
          Access Audio Archives
        </Link>
        <Link to="/contact" className="btn-base btn-outline-light">
          Submit a Recording
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Audio Memory"
          title="Recorded testimony from across Tunisia"
          intro="Every recording is transcribed, tagged by governorate and period, and attached to the tree branches it supports."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recordings.map((r) => {
            const isPlaying = playingId === r.id;
            return (
              <article
                key={r.id}
                className="surface-card flex flex-col p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePlay(r.id)}
                    aria-label={isPlaying ? "Pause audio" : "Play audio"}
                    className={`grid h-10 w-10 place-items-center rounded-full transition-all ${
                      isPlaying
                        ? "bg-[var(--gold)] text-[var(--accent-foreground)] scale-105"
                        : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:scale-105"
                    }`}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </button>
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                      {r.length} {isPlaying && "· Playing"}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">{r.place}</p>
                  </div>
                </div>

                <h3 className="mt-4 font-display text-xl leading-snug text-[var(--foreground)]">{r.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{r.body}</p>

                <div className="mt-5 h-1.5 w-full rounded-full bg-[var(--secondary)] overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-[var(--gold)] transition-all duration-500 ${
                      isPlaying ? "w-2/3 animate-pulse" : "w-1/4"
                    }`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
