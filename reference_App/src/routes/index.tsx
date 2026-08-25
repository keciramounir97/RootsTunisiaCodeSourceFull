import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Archive,
  BookOpen,
  Camera,
  FileText,
  GitBranch,
  Mic,
  Landmark,
  Map as MapIcon,
  ScrollText,
  Users,
} from "lucide-react";
import carthage from "../assets/slider-carthage.jpg";
import kairouan from "../assets/slider-kairouan.jpg";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import familyArchive from "../assets/family-archive.jpg";
import manuscript from "../assets/manuscript.jpg";
import medina from "../assets/medina-tunis.jpg";
import eljem from "../assets/eljem.jpg";
import djerba from "../assets/djerba.jpg";
import { Section, SectionHeading, InfoCard } from "../components/site/Primitives";
import { TreeCard, featuredTrees } from "../components/site/TreeCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roots Tunisia — Tunisian Sources, Archives & Family Timelines" },
      {
        name: "description",
        content:
          "Discover your Tunisian heritage: civil registers, beylical and Ottoman sijillat, habous deeds, Protectorate archives, family photographs and oral memory in one platform.",
      },
      { property: "og:title", content: "Roots Tunisia — Tunisian Sources, Archives & Family Timelines" },
      {
        property: "og:description",
        content:
          "Discover your Tunisian heritage: civil registers, beylical and Ottoman sijillat, habous deeds, Protectorate archives, family photographs and oral memory in one platform.",
      },
    ],
  }),
  component: Home,
});

const slides = [
  { image: carthage, label: "Carthage" },
  { image: kairouan, label: "Kairouan" },
  { image: sidiBouSaid, label: "Sidi Bou Saïd" },
];

const stats = [
  { value: "3,000+", label: "Years of History" },
  { value: "24", label: "Governorates" },
  { value: "1M+", label: "Records Indexed" },
  { value: "480+", label: "Archives & Fonds" },
];

const tools = [
  {
    icon: GitBranch,
    title: "Family Trees",
    body: "Build multi-generational trees, import GEDCOM files, and attach Tunisian records, places, dates and source notes.",
    to: "/genealogy-gallery",
  },
  {
    icon: Camera,
    title: "Photo Gallery",
    body: "Preserve family portraits, studio photographs from Tunis and Sfax, documents and maps with provenance.",
    to: "/gallery",
  },
  {
    icon: BookOpen,
    title: "Library & Documents",
    body: "Organize digitized books, manuscripts, civil extracts, nasab texts, beylical decrees and research notes.",
    to: "/library",
  },
  {
    icon: Mic,
    title: "Oral Histories",
    body: "Record elders, malouf songs, dialect memories, tribal poetry and migration stories from the diaspora.",
    to: "/audio",
  },
  {
    icon: FileText,
    title: "Articles & Stories",
    body: "Publish family narratives, archive guides and local Tunisian history for the Roots Tunisia community.",
    to: "/articles",
  },
  {
    icon: Landmark,
    title: "Sources & Periods",
    body: "Navigate the Archives Nationales de Tunisie, charaïque courts, habous, état civil, and the periods that shaped them.",
    to: "/sources",
  },
];

const timeline = [
  { era: "Punic Carthage", detail: "Stelae, votive inscriptions, Punic onomastics", years: "814–146 BC" },
  { era: "Roman Africa", detail: "Epigraphy, colonial land registers, El Jem", years: "146 BC–439 AD" },
  { era: "Vandal & Byzantine", detail: "Church records, Latin inscriptions", years: "439–698" },
  { era: "Aghlabid & Fatimid", detail: "Kairouan scholarship, nasab chains, waqf", years: "800–1048" },
  { era: "Hafsid", detail: "Tunis chancery, qadi rulings, family endowments", years: "1229–1574" },
  { era: "Ottoman & Beylical", detail: "Sijillat, beylical decrees, majba tax rolls", years: "1574–1881" },
  { era: "French Protectorate", detail: "État civil, cadastre, ANOM, school registers", years: "1881–1956" },
  { era: "Independence", detail: "Civil registry, ID papers, migration files", years: "1956–1987" },
  { era: "Contemporary", detail: "Digital archives, restoration, collaboration", years: "1987–Present" },
];

const librarySources = [
  "Manuscripts & Family Papers",
  "État Civil Tunisien (1886–)",
  "Nasab & Lineage Texts",
  "Ottoman & Beylical Registers",
  "Habous Property Deeds",
  "Maps, Cadastre & Gazetteers",
];

const archives = [
  "Archives Nationales de Tunisie (Tunis)",
  "Registres Charaïques (Tunis, Kairouan, Sfax)",
  "Jamaiyat el Habous — Pious Endowments",
  "Archives du Protectorat & ANOM",
  "Beylical Decrees & Majba Tax Rolls",
  "Djerba & Testour Community Registers",
  "Bibliothèque Nationale de Tunisie",
];

const gallery = [
  { image: medina, alt: "Arched souk alley in the Medina of Tunis" },
  { image: eljem, alt: "Roman amphitheatre of El Jem" },
  { image: djerba, alt: "Whitewashed domed houses of Djerba" },
  { image: manuscript, alt: "Arabic manuscript register with wax seal" },
];

function Home() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Hero slider */}
      <section className="px-3 pt-4 sm:px-5">
        <div className="frame-gold relative mx-auto max-w-7xl overflow-hidden rounded-md">
          {slides.map((s, i) => (
            <img
              key={s.label}
              src={s.image}
              alt={`${s.label}, Tunisia`}
              width={1600}
              height={1000}
              className={`h-[62vh] min-h-[380px] w-full object-cover transition-opacity duration-1000 ${
                i === active ? "opacity-100" : "absolute inset-0 opacity-0"
              }`}
            />
          ))}
          <div className="hero-scrim absolute inset-0" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="eyebrow">Roots Tunisia · جذور تونس</p>
            <h1 className="display-xl mt-4 max-w-4xl text-parchment">
              Discover Your Tunisian Heritage
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-parchment/85 sm:text-base">
              Tunisian civil records, beylical and Ottoman registers, habous deeds, Protectorate
              archives, family photographs, oral memory and historical periods — in one
              research-ready heritage platform.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/sources" className="btn-base btn-gold">
                Start Exploring
              </Link>
              <Link to="/genealogy-gallery" className="btn-base btn-outline-light">
                Browse Family Trees
              </Link>
            </div>
            <div className="mt-8 flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.label}
                  aria-label={`Show ${s.label}`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-10 bg-gold" : "w-4 bg-parchment/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mx-auto mt-10 max-w-7xl px-5">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-gold/40 bg-gold/30 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-6 py-8 text-center">
              <p className="font-display text-3xl font-semibold text-primary sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Preserve banner */}
      <Section>
        <div className="frame-gold relative overflow-hidden rounded-md">
          <img
            src={eljem}
            alt="Roman amphitheatre of El Jem, Tunisia"
            loading="lazy"
            width={1200}
            height={800}
            className="h-[300px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-olive/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="eyebrow">Roots Tunisia</p>
            <h2 className="display-lg mt-3 text-parchment">Preserve Your Family Lineage</h2>
            <p className="mt-4 max-w-2xl text-sm text-parchment/85">
              Connect with your roots, explore historical records, and build a lasting digital
              legacy for future generations.
            </p>
          </div>
        </div>
      </Section>

      {/* Why */}
      <Section className="!py-0">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              center={false}
              eyebrow="Why Roots Tunisia"
              title="Tunisian family history needs sources, places and periods together"
              intro="Roots Tunisia is built for families who want evidence without losing memory. It connects état civil extracts, charaïque court sijillat, habous deeds, Protectorate files, photographs, cadastral maps and oral testimony."
            />
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A family branch can begin with a modern CIN extract, move into a marriage contract
              from a Tunis qadi register, connect to a village in the Sahel or the Djérid, and
              finally sit inside the historical period that produced that record.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <InfoCard
                title="Archive-led research"
                body="Work from état civil, ANT fonds, charaïque sijillat, habous, school and military records."
              />
              <InfoCard
                title="Memory with evidence"
                body="Keep stories, kunyas, photographs and migration memories beside the records that support them."
              />
              <InfoCard
                title="Period-aware genealogy"
                body="Know which records exist for Punic, Roman, Hafsid, Ottoman, Protectorate and modern Tunisia."
              />
            </div>
          </div>
          <div className="frame-gold overflow-hidden rounded-md">
            <img
              src={familyArchive}
              alt="Sepia portrait of a Tunisian family in the early twentieth century"
              loading="lazy"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Method */}
      <Section>
        <SectionHeading
          eyebrow="Research Method"
          title="Build the Tunisian Evidence Chain"
          intro="Three movements that turn family memory into documented lineage."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Start with living records",
              b: "Gather CIN and état civil extracts, livret de famille, identity papers, photographs, oral testimony and exact place names.",
            },
            {
              n: "02",
              t: "Move into archives",
              b: "Search charaïque court registers, habous deeds, Archives Nationales de Tunisie fonds, municipal files and cadastral maps.",
            },
            {
              n: "03",
              t: "Place every record in time",
              b: "Use the Tunisian period timeline to decide what evidence should exist, how names were recorded, and which archive answers next.",
            },
          ].map((s) => (
            <div key={s.n} className="surface-card p-7">
              <p className="font-display text-4xl text-gold">{s.n}</p>
              <h3 className="mt-3 font-display text-xl text-foreground">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tools */}
      <Section className="!pt-0">
        <SectionHeading
          eyebrow="Explore Roots Tunisia"
          title="Research Tools for Tunisian Family History"
          intro="Trees, galleries, books, documents, audio, articles, sources and periods work together as one Tunisian genealogy workspace."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.title}
              to={t.to}
              className="surface-card group p-7 transition-transform hover:-translate-y-1"
            >
              <t.icon className="h-6 w-6 text-gold" />
              <h3 className="mt-4 font-display text-xl text-foreground group-hover:text-primary">
                {t.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured trees */}
      <Section className="!pt-0">
        <SectionHeading
          eyebrow="Featured Trees"
          title="Family Tree Builder"
          intro="Explore public Tunisian family trees with archive-ready metadata, GEDCOM support, source notes and document references. Our builder supports Tunisian naming conventions: Arabic, Amazigh, Ottoman, Jewish-Tunisian and modern civil formats."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTrees.slice(0, 3).map((t) => (
            <TreeCard key={t.id} tree={t} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/genealogy-gallery" className="btn-base btn-outline-ink">
            See more trees
          </Link>
        </div>
      </Section>

      {/* Timeline */}
      <Section className="!pt-0">
        <SectionHeading
          eyebrow="Tunisian Timeline"
          title="Which Tunisian Records Belong to Which Period?"
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-gold/40 bg-gold/30 sm:grid-cols-2 lg:grid-cols-3">
          {timeline.map((t) => (
            <div key={t.era} className="bg-card p-6">
              <p className="font-display text-xl text-foreground">{t.era}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t.detail}</p>
              <p className="mt-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold">
                {t.years}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/periods" className="btn-base btn-gold">
            Explore All Periods
          </Link>
        </div>
      </Section>

      {/* Ancestral stories */}
      <Section className="!pt-0">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="frame-gold order-2 overflow-hidden rounded-md lg:order-1">
            <img
              src={medina}
              alt="Vaulted alley of the Medina of Tunis"
              loading="lazy"
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              center={false}
              eyebrow="Ancestral Stories"
              title="Ancestral Stories"
              intro="Every Tunisian family carries oral histories, saints and ancestors, migrations from the Sahel to Tunis, and struggles through the Protectorate years. Preserve them in structured narrative timelines, recorded interviews and photo restoration."
            />
            <div className="mt-8 grid gap-4">
              <InfoCard
                title="Record Oral Histories"
                body="Interview elders and preserve memories, proverbs, malouf, Amazigh traditions and family sayings."
              />
              <InfoCard
                title="Document Family Traditions"
                body="Tell the story behind your family's crafts, chechia making, weaving, cuisine and celebrations."
              />
              <InfoCard
                title="Reconstruct Lost Branches"
                body="Use beylical registers, Protectorate archives and tribal memory to rebuild broken links."
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Library */}
      <Section className="!pt-0">
        <SectionHeading
          eyebrow="Library"
          title="Tunisian Genealogy Library"
          intro="A curated library for Tunisian family research: manuscripts, civil extracts, charaïque registers, habous deeds, community registers, maps and archive guides."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {librarySources.map((s) => (
            <div key={s} className="surface-card flex items-center gap-3 p-5">
              <ScrollText className="h-5 w-5 shrink-0 text-gold" />
              <p className="text-sm font-semibold text-foreground">{s}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/library" className="btn-base btn-outline-ink">
            Visit the Library
          </Link>
        </div>
      </Section>

      {/* Archives */}
      <Section className="!pt-0">
        <SectionHeading
          eyebrow="Archives and Sources"
          title="Archives and Sources"
          intro="Explore the key historical sources used by Tunisian genealogists: national and regional archives, Ottoman and beylical registers, qadi justice books, habous registries, Protectorate civil archives and census records."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {archives.map((a) => (
            <div key={a} className="surface-card flex items-center gap-3 p-5">
              <Archive className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm font-semibold text-foreground">{a}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/archives" className="btn-base btn-outline-ink">
            See all archives
          </Link>
        </div>
      </Section>

      {/* Visual heritage */}
      <Section className="!pt-0">
        <SectionHeading
          eyebrow="Gallery"
          title="Tunisian Visual Heritage"
          intro="Browse images from the Roots Tunisia gallery: places, documents and portraits that anchor a lineage to a land."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((g) => (
            <div key={g.alt} className="frame-gold overflow-hidden rounded-md">
              <img
                src={g.image}
                alt={g.alt}
                loading="lazy"
                width={1200}
                height={800}
                className="h-56 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/gallery" className="btn-base btn-outline-ink">
            Open the gallery
          </Link>
        </div>
      </Section>

      {/* Community */}
      <Section className="!pt-0">
        <div className="zellige surface-card px-6 py-14 text-center">
          <Users className="mx-auto h-7 w-7 text-gold" />
          <h2 className="display-lg mt-4 text-foreground">Join Our Community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Share research finds on Tunisian records, ask for help with Arabic or Ottoman script,
            and connect with cousins in Tunisia and across the diaspora.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn-base btn-red">
              Join Now
            </Link>
            <Link to="/contact" className="btn-base btn-outline-ink">
              <MapIcon className="h-3.5 w-3.5" /> Contact the team
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
