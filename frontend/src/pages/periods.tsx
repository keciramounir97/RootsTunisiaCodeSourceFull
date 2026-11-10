import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import eljem from "../assets/eljem.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { useSiteContent } from "../hooks/useSiteContent";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Landmark,
  Search,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  X,
  Compass,
  ExternalLink,
  GitBranch,
  Split,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

type PeriodItem = {
  id: string;
  eraKey: string;
  yearsKey: string;
  recordsKey: string;
  noteKey: string;
  category: "ancient" | "medieval" | "premodern" | "modern";
  keyRepositories: string;
  namingStructure: string;
  survivalRating: string;
};

const periods: PeriodItem[] = [
  {
    id: "punic",
    eraKey: "period_punic_era",
    yearsKey: "period_punic_years",
    recordsKey: "period_punic_records",
    noteKey: "period_punic_note",
    category: "ancient",
    keyRepositories: "Institut National du Patrimoine — Carthage Tophet Museum & Byrsa Sanctuary",
    namingStructure: "Punic Filial Patronymic (X son of Y, servant of Tanit / Baal Hammon)",
    survivalRating: "★★☆☆☆ (Epigraphic stelae & funerary onomastics)",
  },
  {
    id: "roman",
    eraKey: "period_roman_era",
    yearsKey: "period_roman_years",
    recordsKey: "period_roman_records",
    noteKey: "period_roman_note",
    category: "ancient",
    keyRepositories: "Institut National du Patrimoine — Bardo & El Jem Collections, Epigraphy Corpus",
    namingStructure: "Roman Tria Nomina (Praenomen, Nomen gentile, Cognomen)",
    survivalRating: "★★★☆☆ (Epigraphic inscriptions, land centuriation, municipal curiae)",
  },
  {
    id: "vandal",
    eraKey: "period_vandal_era",
    yearsKey: "period_vandal_years",
    recordsKey: "period_vandal_records",
    noteKey: "period_vandal_note",
    category: "ancient",
    keyRepositories: "National Heritage Archives — Byzantine Fortress Depositories & Albertini Tablets",
    namingStructure: "Romano-African & Germanic hybrid patronymics, Tablettes Albertini notarials",
    survivalRating: "★★☆☆☆ (Notarial wooden tablets, ecclesiastical council rolls)",
  },
  {
    id: "aghabid",
    eraKey: "period_aghabid_era",
    yearsKey: "period_aghabid_years",
    recordsKey: "period_aghabid_records",
    noteKey: "period_aghabid_note",
    category: "medieval",
    keyRepositories: "Bibliothèque Nationale de Tunisie — Kairouan Great Mosque Library",
    namingStructure: "Classical Arab Nasab (Ism, Kunya, Nasab, Laqab, Nisba of origin)",
    survivalRating: "★★★☆☆ (Parchment sijillat, waqf deeds, Maliki jurist biographies)",
  },
  {
    id: "hafsid",
    eraKey: "period_hafsid_era",
    yearsKey: "period_hafsid_years",
    recordsKey: "period_hafsid_records",
    noteKey: "period_hafsid_note",
    category: "medieval",
    keyRepositories: "Archives Nationales de Tunisie — Zitouna Mosque Archives & Dar El Bey",
    namingStructure: "Almohad & Andalusian lineage titles, scholar nisbas, tribal asabiyya",
    survivalRating: "★★★★☆ (Court records, madrasa endowments, diplomatic treaties)",
  },
  {
    id: "ottoman",
    eraKey: "period_ottoman_era",
    yearsKey: "period_ottoman_years",
    recordsKey: "period_ottoman_records",
    noteKey: "period_ottoman_note",
    category: "premodern",
    keyRepositories: "Archives Nationales de Tunisie (Dar El Bey) — Série Beylicale & Charaïque",
    namingStructure: "Triple patronymic with guild title, Turkish honorific (Bey, Agha, Dey)",
    survivalRating: "★★★★★ (Sijillat charaïques, habous deeds, Diwan registers)",
  },
  {
    id: "protectorate",
    eraKey: "period_protectorate_era",
    yearsKey: "period_protectorate_years",
    recordsKey: "period_protectorate_records",
    noteKey: "period_protectorate_note",
    category: "modern",
    keyRepositories: "Municipal Civil Registries — ANOM Aix-en-Provence & ANT Registres EC",
    namingStructure: "Municipal French & Arabic civil certificates, beginning of fixed surnames",
    survivalRating: "★★★★★ (Complete birth, marriage, death extracts 1886–1956)",
  },
  {
    id: "independence",
    eraKey: "period_independence_era",
    yearsKey: "period_independence_years",
    recordsKey: "period_independence_records",
    noteKey: "period_independence_note",
    category: "modern",
    keyRepositories: "Municipalities of the 24 Governorates — Ministry of Interior Civil Registry",
    namingStructure: "Law of 1957 Mandatory Fixed Family Surname across all 24 governorates",
    survivalRating: "★★★★★ (100% universal civil registration and National ID files)",
  },
  {
    id: "contemporary",
    eraKey: "period_contemporary_era",
    yearsKey: "period_contemporary_years",
    recordsKey: "period_contemporary_records",
    noteKey: "period_contemporary_note",
    category: "modern",
    keyRepositories: "Digitized Municipal Portals — Roots Tunisia Collaborative Index",
    namingStructure: "Contemporary biometric identity and digital civil state records",
    survivalRating: "★★★★★ (Digital cloud archives and linked collaborative pedigrees)",
  },
];

export default function Periods() {
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedEra, setSelectedEra] = useState<PeriodItem | null>(null);
  const [showComparator, setShowComparator] = useState<boolean>(false);
  const [era1Id, setEra1Id] = useState<string>("ottoman");
  const [era2Id, setEra2Id] = useState<string>("protectorate");

  // Interactive Decade Selector
  const [activeCenturySelector, setActiveCenturySelector] = useState<string | null>(null);

  const filteredPeriods =
    activeCategory === "all"
      ? periods
      : periods.filter((p) => p.category === activeCategory);

  const stats = [
    { title: t("stats_years_documented"), desc: t("stats_years_desc"), icon: Calendar },
    { title: t("stats_eras_canonical"), desc: t("stats_eras_desc"), icon: Layers },
    { title: t("stats_governorates_covered"), desc: t("stats_governorates_desc"), icon: Landmark },
    { title: t("stats_primary_fonds"), desc: t("stats_primary_desc"), icon: CheckCircle2 },
  ];

  const era1 = periods.find((p) => p.id === era1Id) || periods[5];
  const era2 = periods.find((p) => p.id === era2Id) || periods[6];

  const handleTimelineClick = (id: string) => {
    const el = document.getElementById(`period-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCenturySelect = (century: string, targetPeriodId: string) => {
    setActiveCenturySelector(century);
    const targetPeriod = periods.find((p) => p.id === targetPeriodId);
    if (targetPeriod) {
      setSelectedEra(targetPeriod);
      handleTimelineClick(targetPeriodId);
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_periods_title")}
        description={t("seo_periods_desc")}
        keywords={["Tunisian periods", "Carthage history", "Ottoman Tunisia", "Archives Nationales de Tunisie"]}
      />

      {/* Side-by-Side Era Comparator Modal */}
      {showComparator && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowComparator(false)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-xl bg-[var(--card)] shadow-2xl text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setShowComparator(false)}
              className="absolute top-4 end-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-full hover:bg-[var(--gold)]/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[var(--gold)]/25 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                <Split className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                  {t("compare_eras_btn")}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {t("era_comparison_title")}
                </h3>
              </div>
            </div>

            {/* Selectors Bar */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-md bg-[var(--background)]/80 border border-[var(--gold)]/25">
                <label className="block text-[0.7rem] font-bold uppercase text-[var(--gold)] mb-1">
                  {t("era_label_era1")}
                </label>
                <select
                  value={era1Id}
                  onChange={(e) => setEra1Id(e.target.value)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--foreground)] font-bold outline-none focus:border-[var(--gold)]"
                >
                  {periods.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(p.eraKey)} ({t(p.yearsKey)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-md bg-[var(--background)]/80 border border-[var(--gold)]/25">
                <label className="block text-[0.7rem] font-bold uppercase text-[var(--gold)] mb-1">
                  {t("era_label_era2")}
                </label>
                <select
                  value={era2Id}
                  onChange={(e) => setEra2Id(e.target.value)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--foreground)] font-bold outline-none focus:border-[var(--gold)]"
                >
                  {periods.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(p.eraKey)} ({t(p.yearsKey)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Era 1 Column */}
              <div className="p-5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)]/60 space-y-4">
                <div className="border-b border-[var(--gold)]/20 pb-3">
                  <span className="text-[0.68rem] font-bold uppercase text-[var(--gold)]">
                    {t("era_label_era1")}
                  </span>
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    {t(era1.eraKey)}
                  </h4>
                  <span className="text-xs font-mono text-[var(--gold)] font-semibold">
                    {t(era1.yearsKey)}
                  </span>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("primary_records_docs")}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--foreground)]">
                    {t(era1.recordsKey)}
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("naming_structure_label")}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--gold)] font-medium">
                    {era1.namingStructure}
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("preservation_rating_label")}
                  </p>
                  <p className="text-xs text-amber-400 font-semibold font-mono">
                    {era1.survivalRating}
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("repository_label")}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {era1.keyRepositories}
                  </p>
                </div>
              </div>

              {/* Era 2 Column */}
              <div className="p-5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)]/60 space-y-4">
                <div className="border-b border-[var(--gold)]/20 pb-3">
                  <span className="text-[0.68rem] font-bold uppercase text-[var(--gold)]">
                    {t("era_label_era2")}
                  </span>
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    {t(era2.eraKey)}
                  </h4>
                  <span className="text-xs font-mono text-[var(--gold)] font-semibold">
                    {t(era2.yearsKey)}
                  </span>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("primary_records_docs")}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--foreground)]">
                    {t(era2.recordsKey)}
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("naming_structure_label")}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--gold)] font-medium">
                    {era2.namingStructure}
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("preservation_rating_label")}
                  </p>
                  <p className="text-xs text-amber-400 font-semibold font-mono">
                    {era2.survivalRating}
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("repository_label")}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {era2.keyRepositories}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--gold)]/20 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/sources"
                onClick={() => setShowComparator(false)}
                className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <span>{t("browse_sources")}</span>
                <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
              </Link>
              <button
                type="button"
                onClick={() => setShowComparator(false)}
                className="btn-base btn-outline text-xs py-2 px-4"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Era Dossier Modal */}
      {selectedEra && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedEra(null)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-2xl p-6 sm:p-8 rounded-xl bg-[var(--card)] shadow-2xl text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setSelectedEra(null)}
              className="absolute top-4 end-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-full hover:bg-[var(--gold)]/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[var(--gold)]/25 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                  {t("era_dossier_title")}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {t(selectedEra.eraKey)}
                </h3>
                <span dir="ltr" className="text-xs font-bold text-[var(--gold)]">
                  {t(selectedEra.yearsKey)}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("primary_records_docs")}
                </p>
                <p className="leading-relaxed text-[var(--foreground)]">
                  {t(selectedEra.recordsKey)}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("naming_structure_label")}
                </p>
                <p className="leading-relaxed text-[var(--gold)] font-medium">
                  {selectedEra.namingStructure}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("genealogical_value_survival")}
                </p>
                <p className="leading-relaxed text-[var(--muted-foreground)]">
                  {t(selectedEra.noteKey)}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("repository_label")}
                </p>
                <p className="leading-relaxed text-[var(--foreground)]">
                  {selectedEra.keyRepositories}
                </p>
              </div>
            </div>

            {/* Direct Era Cross-Links */}
            <div className="mt-6 pt-4 border-t border-[var(--gold)]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/sources"
                  onClick={() => setSelectedEra(null)}
                  className="btn-base btn-gold w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
                >
                  <span>{t("era_consult_records")}</span>
                  <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
                </Link>
                <Link
                  to="/gallery/trees"
                  onClick={() => setSelectedEra(null)}
                  className="btn-base btn-outline w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
                >
                  <GitBranch className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>{t("explore_family_trees")}</span>
                </Link>
                <a
                  href="http://www.archives.nat.tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-outline w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>{t("official_portal_link")}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEra(null)}
                className="btn-base btn-outline w-full sm:w-auto text-xs"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      <PageHero
        eyebrow={getText("periods", "hero", "eyebrow") ?? t("tunisian_timeline_eyebrow")}
        title={getText("periods", "hero", "title") ?? t("periods_hero_title")}
        subtitle={getText("periods", "hero", "subtitle") ?? t("periods_hero_subtitle")}
        image={getImage("periods", "hero", "image") ?? eljem}
      >
        <Link to="/sources" className="btn-base btn-gold w-full sm:w-auto min-w-[180px]">
          {t("browse_sources")}
        </Link>
        <button
          type="button"
          onClick={() => setShowComparator(true)}
          className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[180px] flex items-center justify-center gap-2"
        >
          <Split className="h-4 w-4 text-[var(--gold)]" />
          <span>{t("compare_eras_btn")}</span>
        </button>
      </PageHero>

      {/* Top Symmetric Stats & Coverage Bar */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 items-stretch">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="surface-card p-4 sm:p-5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex items-center gap-3 text-start"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <p className="font-display text-base sm:text-lg font-bold text-[var(--foreground)]">
                      {s.title}
                    </p>
                    <p className="text-[0.68rem] text-[var(--muted-foreground)] font-medium">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Decade Selector / Where to Start Tool */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="surface-card frame-gold p-5 sm:p-6 rounded-lg bg-[var(--card)]/95 shadow-md text-start">
            <div className="flex items-center gap-2.5 mb-2">
              <Sparkles className="h-5 w-5 text-[var(--gold)]" />
              <h3 className="font-display text-base sm:text-lg font-bold text-[var(--foreground)]">
                {t("find_my_ancestor_era")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
              {t("era_selector_prompt")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handleCenturySelect("20th", "protectorate")}
                className={`p-3 rounded-md border text-start transition-all cursor-pointer ${
                  activeCenturySelector === "20th"
                    ? "border-[var(--gold)] bg-[var(--gold)]/20 shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--gold)]/50"
                }`}
              >
                <span className="text-[0.68rem] font-bold uppercase text-[var(--gold)] block">1881 – Present</span>
                <span className="text-xs font-bold text-[var(--foreground)] block mt-0.5">20th Century & Protectorate</span>
                <span className="text-[0.68rem] text-[var(--muted-foreground)] block mt-1">État Civil, ANOM, Municipal Registries</span>
              </button>

              <button
                type="button"
                onClick={() => handleCenturySelect("19th", "ottoman")}
                className={`p-3 rounded-md border text-start transition-all cursor-pointer ${
                  activeCenturySelector === "19th"
                    ? "border-[var(--gold)] bg-[var(--gold)]/20 shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--gold)]/50"
                }`}
              >
                <span className="text-[0.68rem] font-bold uppercase text-[var(--gold)] block">1705 – 1881</span>
                <span className="text-xs font-bold text-[var(--foreground)] block mt-0.5">Husainid Beylicate</span>
                <span className="text-[0.68rem] text-[var(--muted-foreground)] block mt-1">Majba Censuses, Charaïque Sijillat, Habous</span>
              </button>

              <button
                type="button"
                onClick={() => handleCenturySelect("medieval", "hafsid")}
                className={`p-3 rounded-md border text-start transition-all cursor-pointer ${
                  activeCenturySelector === "medieval"
                    ? "border-[var(--gold)] bg-[var(--gold)]/20 shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--gold)]/50"
                }`}
              >
                <span className="text-[0.68rem] font-bold uppercase text-[var(--gold)] block">800 – 1574</span>
                <span className="text-xs font-bold text-[var(--foreground)] block mt-0.5">Hafsid & Aghlabid Eras</span>
                <span className="text-[0.68rem] text-[var(--muted-foreground)] block mt-1">Zitouna & Kairouan Mosques, Waqf Deeds</span>
              </button>

              <button
                type="button"
                onClick={() => handleCenturySelect("ancient", "roman")}
                className={`p-3 rounded-md border text-start transition-all cursor-pointer ${
                  activeCenturySelector === "ancient"
                    ? "border-[var(--gold)] bg-[var(--gold)]/20 shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--gold)]/50"
                }`}
              >
                <span className="text-[0.68rem] font-bold uppercase text-[var(--gold)] block">814 BC – 698 AD</span>
                <span className="text-xs font-bold text-[var(--foreground)] block mt-0.5">Roman & Punic Antiquity</span>
                <span className="text-[0.68rem] text-[var(--muted-foreground)] block mt-1">INP Bardo & El Jem Epigraphic Stelae</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Horizontal Timeline Ribbon */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="surface-card p-4 sm:p-5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--gold)] flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Interactive Chronological Ribbon</span>
              </span>
              <button
                type="button"
                onClick={() => setShowComparator(true)}
                className="text-xs text-[var(--gold)] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Split className="h-3 w-3" />
                <span>{t("compare_eras_btn")}</span>
              </button>
            </div>

            {/* Timeline Stepper Track */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {periods.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleTimelineClick(p.id)}
                  className="px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--background)]/90 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 text-start shrink-0 transition-all cursor-pointer group"
                >
                  <span className="text-[0.62rem] font-mono font-bold text-[var(--gold)] block">
                    0{idx + 1} • {t(p.yearsKey).split("–")[0]}
                  </span>
                  <span className="text-xs font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] block truncate max-w-[120px]">
                    {t(p.eraKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Category Filter Ribbon */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="surface-card p-4 sm:p-5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                {t("all_nine_eras")}
              </span>
              <span className="text-xs text-[var(--gold)] font-bold">
                {filteredPeriods.length} / {periods.length}
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                  activeCategory === "all"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                {t("filter_all_periods")}
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("ancient")}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                  activeCategory === "ancient"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                {t("tab_ancient")}
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("medieval")}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                  activeCategory === "medieval"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                {t("tab_medieval")}
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("premodern")}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                  activeCategory === "premodern"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                {t("tab_premodern")}
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("modern")}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                  activeCategory === "modern"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                {t("tab_modern")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Historical Eras Cards */}
      <Section>
        <SectionHeading
          center={true}
          eyebrow={t("nine_periods_eyebrow")}
          title={t("nine_periods_title")}
          intro={t("nine_periods_intro")}
        />

        <div className="mt-10 sm:mt-12 space-y-6 sm:space-y-8">
          {filteredPeriods.map((p) => {
            const originalIndex = periods.findIndex((x) => x.id === p.id);
            return (
              <article
                key={p.id}
                id={`period-${p.id}`}
                className="surface-card frame-gold p-6 sm:p-8 lg:p-9 rounded-lg shadow-xl bg-[var(--card)]/95 backdrop-blur-sm text-start transition-all hover:border-[var(--gold)] scroll-mt-28"
              >
                {/* Era Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--gold)]/25 pb-4">
                  <div className="flex items-center gap-3.5">
                    <span
                      dir="ltr"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/15 text-sm font-bold font-mono text-[var(--gold)] ring-1 ring-[var(--gold)]/45 shrink-0"
                    >
                      0{originalIndex + 1}
                    </span>
                    <div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                        {t("nine_periods_eyebrow")}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                        {t(p.eraKey)}
                      </h3>
                    </div>
                  </div>
                  <span
                    dir="ltr"
                    className="rounded-sm bg-[var(--gold)]/15 border border-[var(--gold)]/40 px-3 py-1 text-xs font-bold text-[var(--gold)] w-fit shrink-0 font-mono"
                  >
                    {t(p.yearsKey)}
                  </span>
                </div>

                {/* Symmetric 3-Box Content */}
                <div className="mt-6 grid gap-4 md:grid-cols-3 items-stretch">
                  <div className="p-4 sm:p-5 rounded-md bg-[var(--background)]/60 border border-[var(--gold)]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-[var(--gold)] shrink-0" />
                        <h4 className="eyebrow text-xs !text-[var(--gold)] font-bold">
                          {t("primary_records_docs")}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-[var(--foreground)]">
                        {t(p.recordsKey)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-md bg-[var(--background)]/60 border border-[var(--gold)]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-[var(--gold)] shrink-0" />
                        <h4 className="eyebrow text-xs !text-[var(--gold)] font-bold">
                          {t("genealogical_value_survival")}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {t(p.noteKey)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-md bg-[var(--background)]/60 border border-[var(--gold)]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Landmark className="h-4 w-4 text-[var(--gold)] shrink-0" />
                        <h4 className="eyebrow text-xs !text-[var(--gold)] font-bold">
                          {t("naming_structure_label")}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-[var(--gold)] font-medium">
                        {p.namingStructure}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[var(--gold)]/15">
                      <span className="text-[0.68rem] text-amber-400 font-mono font-semibold">
                        {p.survivalRating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="mt-6 pt-4 border-t border-[var(--gold)]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedEra(p)}
                      className="btn-base btn-gold !py-2 !px-3.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
                    >
                      <Compass className="h-3.5 w-3.5" />
                      <span>{t("inspect_era_dossier")}</span>
                    </button>
                    <Link
                      to="/sources"
                      className="btn-base btn-outline !py-2 !px-3.5 text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    >
                      <span>{t("era_consult_records")}</span>
                      <ArrowRight className={`h-3 w-3 ${isRtl ? "rotate-180" : ""}`} />
                    </Link>
                  </div>

                  <span className="text-[var(--muted-foreground)] text-[0.68rem] flex items-center gap-1">
                    <Landmark className="h-3 w-3 text-[var(--gold)]" />
                    <span>{p.keyRepositories.split("—")[0]}</span>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
