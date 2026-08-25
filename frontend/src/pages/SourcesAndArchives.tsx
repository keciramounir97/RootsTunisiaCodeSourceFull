import { Link } from "react-router-dom";
import { Archive, FileText, MapPin, Search, Landmark, BookOpen, ShieldCheck } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import kairouan from "../assets/slider-kairouan.jpg";
import carthage from "../assets/slider-carthage.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";

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

export default function SourcesAndArchives() {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Tunisian Genealogy Sources & Archives Directory"
        description="The source families and directory of archives for Tunisian genealogy: état civil, court sijillat, habous deeds, and repositories in Tunis, Sfax, Kairouan and Djerba."
        keywords={["Tunisian sources", "Archives Nationales de Tunisie", "Genealogy archives Tunis", "Civil registry Tunisia"]}
      />

      <PageHero
        eyebrow="Sources & Archives"
        title="Tunisian Sources & Repositories"
        subtitle="Nine source families that carry Tunisian genealogy, with what each one proves, where it is held, and the directory of archives preserving them."
        image={kairouan}
      >
        <Link to="/periods" className="btn-base btn-gold">
          See the timeline
        </Link>
        <Link to="/gallery/trees" className="btn-base btn-outline-light">
          Explore Family Trees
        </Link>
      </PageHero>

      {/* Sources Section */}
      <Section id="sources">
        <SectionHeading
          eyebrow="Evidence"
          title="Know what a document can prove before you cite it"
          intro="Roots Tunisia records every claim with its source family, holding institution and document code, so your tree stays verifiable."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((s) => (
            <article
              key={s.title}
              className="surface-card flex flex-col p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[var(--gold)]/20 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--primary)] shrink-0" />
                  <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">{s.title}</h3>
                </div>
                <span className="rounded-sm bg-[var(--gold)]/15 px-2 py-0.5 text-[0.65rem] font-bold text-[var(--gold)] shrink-0">
                  {s.period}
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
                Repository
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{s.holds}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
                Genealogical Proof
              </p>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-[var(--foreground)]">{s.proves}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Archives Directory Section */}
      <Section id="archives" className="bg-[var(--secondary)]/40">
        <SectionHeading
          eyebrow="Directory"
          title="Ten institutions to start your research"
          intro="Each entry lists the city and the series most useful to family researchers, from beylical decrees to synagogue rolls."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {institutions.map((i) => (
            <article key={i.name} className="surface-card p-7 transition-transform hover:-translate-y-1">
              <Archive className="h-5 w-5 text-[var(--primary)]" />
              <h3 className="mt-4 font-display text-xl text-[var(--foreground)]">{i.name}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
                <MapPin className="h-3.5 w-3.5" /> {i.city}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {i.holdings}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
