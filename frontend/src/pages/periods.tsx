import { Link } from "react-router-dom";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import eljem from "../assets/eljem.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { ArrowRight, BookOpen, FileText, Landmark } from "lucide-react";

const periods = [
  {
    era: "Punic Carthage",
    years: "814–146 BC",
    records: "Votive stelae from the Tophet, Punic onomastics, Neo-Punic inscriptions",
    note: "No continuous lineage evidence, but name elements and place attachments survive in later toponyms.",
  },
  {
    era: "Roman Africa Proconsularis",
    years: "146 BC–439 AD",
    records: "Funerary epigraphy, municipal alba, land registers, El Jem and Dougga inscriptions",
    note: "Latin inscriptions document family groups, freedmen and civic office across Tunisian cities.",
  },
  {
    era: "Vandal & Byzantine",
    years: "439–698",
    records: "Church councils, episcopal lists, Latin and Christian funerary texts",
    note: "Ecclesiastical sources dominate; onomastic shifts mark community change.",
  },
  {
    era: "Aghlabid & Fatimid Ifriqiya",
    years: "800–1048",
    records: "Kairouan scholarly biographies (tabaqat), nasab chains, early waqf",
    note: "Chains of transmission among Kairouan jurists provide some of Tunisia's oldest documented lineages.",
  },
  {
    era: "Zirid, Almohad & Hafsid",
    years: "1048–1574",
    records: "Hafsid chancery documents, qadi rulings, family endowments, ijazat",
    note: "Tunis becomes an administrative capital; scholarly and mercantile families appear in continuous records.",
  },
  {
    era: "Ottoman Regency & Beylical Tunisia",
    years: "1574–1881",
    records: "Charaïque sijillat, habous deeds, beylical decrees, majba tax rolls, Mamluk household lists",
    note: "The richest pre-modern layer: inheritance cases name three to four generations at once.",
  },
  {
    era: "French Protectorate",
    years: "1881–1956",
    records: "État civil, cadastre, caïdat files, school and military registers, ANOM series",
    note: "Systematic civil registration begins in 1886 for Europeans and expands to Tunisians; surnames become fixed.",
  },
  {
    era: "Independence & Bourguiba era",
    years: "1956–1987",
    records: "Civil registry, CIN records, nationality files, emigration and labour contracts",
    note: "Personal Status Code reshapes marriage and inheritance documentation.",
  },
  {
    era: "Contemporary Tunisia",
    years: "1987–Present",
    records: "Digitized archives, municipal databases, family testimony, restored photographs",
    note: "Collaborative research and diaspora contributions rebuild branches separated by migration.",
  },
];

export default function Periods() {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Tunisian Historical Periods — Records by Era"
        description="From Punic Carthage and Roman Africa to Hafsid Tunis, the Ottoman beylik, the French Protectorate and independent Tunisia — which records exist in each period."
        keywords={["Tunisian periods", "Carthage history", "Ottoman Tunisia", "Archives Nationales de Tunisie"]}
      />

      <PageHero
        eyebrow="Tunisian Timeline"
        title="Which Records Belong to Which Period?"
        subtitle="Three thousand years of Tunisian history, read through the documents each era produced — and what a genealogist can realistically expect to find."
        image={eljem}
      >
        <Link to="/sources" className="btn-base btn-gold">
          Browse sources
        </Link>
        <Link to="/gallery/trees" className="btn-base btn-outline-light">
          Explore Family Trees
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Nine Periods"
          title="From Carthage to contemporary Tunisia"
          intro="Explore each historical era to understand how administrative changes, legal systems, and social transformations shaped the survival of genealogical records."
        />

        <ol className="mt-12 space-y-6">
          {periods.map((p, idx) => (
            <li key={p.era} className="surface-card p-6 md:p-8 transition-transform hover:-translate-y-0.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--gold)]/20 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)]/20 text-xs font-bold text-[var(--gold)]">
                    {idx + 1}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[var(--foreground)]">{p.era}</h3>
                </div>
                <span className="rounded-sm bg-[var(--gold)]/15 px-3 py-1 text-xs font-bold text-[var(--gold)] w-fit">
                  {p.years}
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="eyebrow text-xs">Primary Records & Documents</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground)]">{p.records}</p>
                </div>
                <div>
                  <h4 className="eyebrow text-xs">Genealogical Value & Survival</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">{p.note}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--gold)]/15 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[var(--muted-foreground)]">
                  Fonds available at Archives Nationales & regional repositories
                </span>
                <Link
                  to="/sources"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline"
                >
                  Consult sources for this era <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
