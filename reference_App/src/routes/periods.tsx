import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import eljem from "../assets/eljem.jpg";

export const Route = createFileRoute("/periods")({
  head: () => ({
    meta: [
      { title: "Tunisian Historical Periods — Records by Era" },
      {
        name: "description",
        content:
          "From Punic Carthage and Roman Africa to Hafsid Tunis, the Ottoman beylik, the French Protectorate and independent Tunisia — which records exist in each period.",
      },
      { property: "og:title", content: "Tunisian Historical Periods — Roots Tunisia" },
      {
        property: "og:description",
        content: "A period-by-period guide to the documents Tunisian genealogists can expect to find.",
      },
    ],
  }),
  component: Periods,
});

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

function Periods() {
  return (
    <>
      <PageHero
        eyebrow="Tunisian Timeline"
        title="Which Records Belong to Which Period?"
        subtitle="Three thousand years of Tunisian history, read through the documents each era produced — and what a genealogist can realistically expect to find."
        image={eljem}
      >
        <Link to="/sources" className="btn-base btn-gold">
          Browse sources
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Nine Periods"
          title="From Carthage to contemporary Tunisia"
        />
        <ol className="mt-12 space-y-5">
          {periods.map((p, i) => (
            <li key={p.era} className="surface-card grid gap-4 p-7 md:grid-cols-[auto_1fr]">
              <div className="md:w-40">
                <p className="font-display text-4xl text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">
                  {p.years}
                </p>
              </div>
              <div>
                <h2 className="font-display text-2xl text-foreground">{p.era}</h2>
                <p className="mt-2 text-sm font-semibold text-foreground">{p.records}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
