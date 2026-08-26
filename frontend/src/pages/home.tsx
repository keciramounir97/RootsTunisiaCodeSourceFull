import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Camera,
  FileText,
  GitBranch,
  Mic,
  Landmark,
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
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";

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
    to: "/gallery/trees",
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
    to: "/gallery/audios",
  },
  {
    icon: FileText,
    title: "Articles & Stories",
    body: "Publish family narratives, archive guides and local Tunisian history for the Roots Tunisia community.",
    to: "/gallery/articles",
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

export default function Home() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-[var(--foreground)] min-h-screen">
      <SEO
        title="Roots Tunisia — Tunisian Sources, Archives & Family Timelines"
        description="Discover your Tunisian heritage: civil registers, beylical and Ottoman sijillat, habous deeds, Protectorate archives, family photographs and oral memory in one platform."
        keywords={["Roots Tunisia", "Tunisian genealogy", "Tunisia family tree", "Archives Nationales de Tunisie", "Carthage history"]}
      />

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
            <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">{t("site_badge", "Roots Tunisia · جذور تونس")}</p>
            <h1 className="display-xl mt-4 max-w-4xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
              {t("hero_title", "Discover Your Tunisian Heritage")}
            </h1>
            <div className="gold-rule mt-5 w-32 mx-auto shadow-lg" />
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-100/95 drop-shadow-md font-medium sm:text-base">
              {t("hero_subtitle", "Tunisian civil records, beylical and Ottoman registers, habous deeds, Protectorate archives, family photographs, oral memory and historical periods — in one research-ready heritage platform.")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/sources" className="btn-base btn-gold">
                {t("start_exploring", "Start Exploring")}
              </Link>
              <Link to="/gallery/trees" className="btn-base btn-outline-light !text-white hover:!text-white">
                {t("browse_family_trees", "Browse Family Trees")}
              </Link>
            </div>
            <div className="mt-8 flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.label}
                  aria-label={`Show ${s.label}`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-10 bg-[var(--gold)]" : "w-4 bg-[var(--parchment)]/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mx-auto mt-10 max-w-7xl px-5">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[var(--gold)]/40 bg-[var(--gold)]/30 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--card)]/90 backdrop-blur-sm px-6 py-8 text-center">
              <p className="font-display text-3xl font-semibold text-[var(--primary)] sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                {t(s.label.toLowerCase().replace(/[^a-z0-9]+/g, "_"), s.label)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Preserve banner - Historic Tunisian El Jem Landmark Background */}
      <Section>
        <div className="frame-gold relative overflow-hidden rounded-md shadow-xl">
          <img
            src={eljem}
            alt="Roman Colosseum of El Jem, Tunisia"
            loading="lazy"
            width={1600}
            height={800}
            className="h-[320px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="eyebrow text-[var(--gold)]">{t("site_title", "Roots Tunisia")}</p>
            <h2 className="display-lg mt-3 text-white font-semibold">{t("preserve_lineage_title", "Preserve Your Family Lineage")}</h2>
            <p className="mt-4 max-w-2xl text-sm text-white/95 leading-relaxed font-normal">
              {t("preserve_lineage_desc", "Connect with your roots, explore historical records, and build a lasting digital legacy for future generations.")}
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
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
              A family branch can begin with a modern CIN extract, move into a marriage contract
              from a Tunis qadi register, connect to a village in the Sahel or the Djérid, and
              finally sit inside the historical period that produced that record.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <InfoCard
                title="Primary Evidence"
                body="Civil status, sijillat, waqf deeds and ANOM dossiers cited directly on person cards."
              />
              <InfoCard
                title="Territorial Depth"
                body="Governorate-level context from Carthage to Djerba, with historical place names."
              />
              <InfoCard
                title="Period Context"
                body="Nine eras from Punic antiquity to the contemporary republic to anchor your narrative."
              />
            </div>
          </div>
          <div className="frame-gold overflow-hidden rounded-md shadow-lg">
            <img
              src={familyArchive}
              alt="Archival portrait and handwritten family records from Tunisia"
              width={1200}
              height={900}
              className="h-[480px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </Section>

      {/* Tools */}
      <Section>
        <SectionHeading
          eyebrow="Research & Preservation Tools"
          title="Everything you need to document a Tunisian family"
          intro="Explore our suite of tools designed to preserve names, oral testimonies, photographs, and historical citations."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <article
                key={tool.title}
                className="surface-card group flex flex-col p-6 transition-transform hover:-translate-y-1 bg-[var(--card)]/90 backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[var(--foreground)]">{tool.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {tool.body}
                </p>
                <div className="mt-6 pt-4 border-t border-[var(--gold)]/20">
                  <Link
                    to={tool.to}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline"
                  >
                    Open tool →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Timeline */}
      <Section className="bg-[var(--secondary)]/40">
        <SectionHeading
          eyebrow="Tunisian Timeline"
          title="Records Spanning Three Millennia of History"
          intro="Different eras produced different types of documents. Understanding which records belong to which period is essential for accurate genealogical research."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {timeline.map((item) => (
            <div
              key={item.era}
              className="surface-card flex flex-col justify-between p-5 transition-transform hover:-translate-y-0.5 bg-[var(--card)]/90 backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">{item.era}</h3>
                  <span className="rounded-sm bg-[var(--gold)]/15 px-2 py-0.5 text-[0.65rem] font-bold text-[var(--gold)]">
                    {item.years}
                  </span>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/periods" className="btn-base btn-gold">
            Explore All 9 Periods in Detail
          </Link>
        </div>
      </Section>

      {/* Sources & Archives */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              center={false}
              eyebrow="Primary Sources"
              title="Digitized and Catalogued Records"
              intro="Access original documents and indexed records from municipal archives, religious foundations, and state repositories across Tunisia."
            />
            <ul className="mt-6 space-y-3">
              {librarySources.map((s) => (
                <li key={s} className="flex items-center gap-3 text-sm text-[var(--foreground)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/library" className="btn-base btn-red">
                Browse Library
              </Link>
            </div>
          </div>
          <div>
            <SectionHeading
              center={false}
              eyebrow="Archival Repositories"
              title="Official Archives in Tunisia & Abroad"
              intro="Key institutional collections holding genealogical and administrative records for Tunisian families."
            />
            <ul className="mt-6 space-y-3">
              {archives.map((a) => (
                <li key={a} className="flex items-center gap-3 text-sm text-[var(--foreground)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/archives" className="btn-base btn-outline-ink">
                View Archive Guide
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Interactive Map Section */}
      <Section className="bg-[var(--secondary)]/30">
        <TunisiaGovernoratesMap />
      </Section>

      {/* Featured Trees */}
      <Section>
        <SectionHeading
          eyebrow="Genealogical Trees"
          title="Featured Tunisian Family Trees"
          intro="Explore public family lineages documented with archival references, historical documents, and GEDCOM verification."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTrees.map((tree) => (
            <TreeCard key={tree.id} tree={tree} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/gallery/trees" className="btn-base btn-gold">
            Browse All Family Trees
          </Link>
        </div>
      </Section>

      {/* Photo Gallery Grid */}
      <Section className="bg-[var(--secondary)]/40">
        <SectionHeading
          eyebrow="Visual Heritage"
          title="Tunisia in Photographs & Manuscripts"
          intro="Historical photographs, architecture, landscapes, and handwritten documents preserving the visual memory of Tunisia."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((item, i) => (
            <div key={i} className="frame-gold group relative overflow-hidden rounded-md">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                width={600}
                height={600}
                className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[var(--ink)]/85 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-xs text-white font-medium">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/gallery" className="btn-base btn-red">
            Open Full Photo Gallery
          </Link>
        </div>
      </Section>

      {/* Call to action */}
      <Section>
        <div className="surface-card relative overflow-hidden rounded-lg p-10 text-center border-2 border-[var(--gold)]/50 sm:p-16 bg-[var(--card)]/90 backdrop-blur-sm">
          <div className="zellige absolute inset-0 opacity-25 pointer-events-none" />
          <p className="eyebrow relative z-10">Start Your Journey</p>
          <h2 className="display-lg relative z-10 mt-3 text-[var(--foreground)]">
            Preserve Your Tunisian Family History Today
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Create an account, begin building your family tree, and connect with Tunisian archives, historical records, and living family memory.
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="btn-base btn-red px-8 py-3.5">
              Create Free Account
            </Link>
            <Link to="/subscriptions" className="btn-base btn-outline-ink px-8 py-3.5">
              View Plans & Tiers
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
