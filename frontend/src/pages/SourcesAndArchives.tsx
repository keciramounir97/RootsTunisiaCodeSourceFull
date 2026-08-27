import { useEffect, useMemo, useState } from "react";
import { useThemeStore } from "../store/theme";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Scroll,
  Landmark,
  Building,
  Map,
  BookOpen,
  FileText,
  Archive,
  ShieldCheck,
  Library,
  Mic,
  Globe,
  Lock,
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  Scale,
  ExternalLink,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import RootsPageShell from "../components/RootsPageShell";
import SEO from "../components/SEO";

const SECTION_IDS = [
  "official-archives",
  "international-archives",
  "digital-portals",
  "archive-types",
  "primary-sources",
  "secondary-sources",
  "access-guidelines",
  "reliability",
  "how-to-access",
];

export default function SourcesAndArchives() {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const isDark = theme === "dark";

  const archiveItems = [
    { icon: Scroll, title: t("archives_ottoman_title", "Ottoman Archives"), accent: "#d4af37", description: t("archives_ottoman_desc", "Registers from the Beylik, Qadi courts, and administrative diwans preserve pre-colonial lineage records."), bullets: [t("archives_ottoman_b1", "Qadi court registers (marriage, inheritance, guardianship)"), t("archives_ottoman_b2", "Habous & waqf property ledgers"), t("archives_ottoman_b3", "Beylik taxation and census notes")] },
    { icon: Landmark, title: t("archives_colonial_title", "Colonial Archives (ANOM)"), accent: "#5d4037", description: t("archives_colonial_desc", "Colonial civil status records provide structured birth, marriage, and death documents."), bullets: [t("archives_colonial_b1", "Surnames fixation records (1882 onward)"), t("archives_colonial_b2", "Colonial censuses & conscription rolls"), t("archives_colonial_b3", "Land surveys and settlement maps")] },
    { icon: Building, title: t("archives_apc_title", "Post-Independence APC Records"), accent: "#556b2f", description: t("archives_apc_desc", "Municipal civil status offices hold modern files that bridge families into the present."), bullets: [t("archives_apc_b1", "Birth/marriage/death registers"), t("archives_apc_b2", "Family booklets & ID archives"), t("archives_apc_b3", "Municipal migration documentation")] },
    { icon: Map, title: t("archives_maps_title", "Maps & Territorial Archives"), accent: "#d4af37", description: t("archives_maps_desc", "Historical cartography traces family territories, tribal borders, and migration routes."), bullets: [t("archives_maps_b1", "Senatus-consulte tribal maps (1863)"), t("archives_maps_b2", "Ottoman land surveys"), t("archives_maps_b3", "Colonial cadastral charts")] },
    { icon: BookOpen, title: t("archives_manuscripts_title", "Manuscripts & Nasab Texts"), accent: "#5d4037", description: t("archives_manuscripts_desc", "Genealogical manuscripts, zawiya registries, and tribal chronicles provide narrative context."), bullets: [t("archives_manuscripts_b1", "Tribal nasab manuscripts"), t("archives_manuscripts_b2", "Zawiya registers and lineage notes"), t("archives_manuscripts_b3", "Regional chronicle compilations")] },
    { icon: FileText, title: t("archives_private_title", "Private Collections"), accent: "#556b2f", description: t("archives_private_desc", "Family-held deeds, letters, and oral histories often fill missing branches in public records."), bullets: [t("archives_private_b1", "Property deeds and waqf deeds"), t("archives_private_b2", "Family correspondences"), t("archives_private_b3", "Oral testimonies and photos")] },
  ];

  const primarySources = [
    { icon: Scroll, title: t("sources_manuscripts_title", "Manuscripts & Nasab"), description: t("sources_manuscripts_desc", "Genealogical manuscripts and zawiya registries capture lineage chains and tribal narratives.") },
    { icon: FileText, title: t("sources_civil_title", "Civil Status Records"), description: t("sources_civil_desc", "Birth, marriage, and death certificates anchor relationships with verified dates.") },
    { icon: Mic, title: t("sources_oral_title", "Oral Histories"), description: t("sources_oral_desc", "Recorded testimonies from elders provide context for migrations, alliances, and patronymics.") },
    { icon: Library, title: t("sources_private_title", "Private Family Archives"), description: t("sources_private_desc", "Letters, property deeds, and family notebooks often contain missing branches.") },
  ];

  const secondarySources = [
    { icon: BookOpen, title: t("sources_academic_title", "Academic Studies"), description: t("sources_academic_desc", "Anthropology and history publications contextualize tribal movements and social structures.") },
    { icon: Globe, title: t("sources_digital_title", "Digital Collections"), description: t("sources_digital_desc", "ANOM, Gallica, and regional digitization portals provide searchable scans.") },
  ];

  const accessGuides = [
    { icon: Lock, title: t("access_requirements_title", "Access Requirements"), description: t("access_requirements_desc", "Some archives require appointment letters, national IDs, or family proof. Always confirm before visiting.") },
    { icon: FileSearch, title: t("access_reference_title", "Reference Tracking"), description: t("access_reference_desc", "Record archive box codes, shelf numbers, and page references to validate each citation.") },
    { icon: ShieldCheck, title: t("access_protection_title", "Data Protection"), description: t("access_protection_desc", "Respect privacy laws for modern civil records and avoid publishing sensitive personal data.") },
  ];

  const reliabilityChecks = [
    { icon: CheckCircle2, title: t("reliability_cross_title", "Cross-check sources"), description: t("reliability_cross_desc", "Validate the same lineage across multiple registers and oral testimonies.") },
    { icon: AlertTriangle, title: t("reliability_gaps_title", "Identify gaps"), description: t("reliability_gaps_desc", "Flag missing years, name variations, and inconsistent patronymics.") },
    { icon: Scale, title: t("reliability_balance_title", "Balance narratives"), description: t("reliability_balance_desc", "Combine written documentation with oral histories to avoid biased records.") },
  ];

  const accessSteps = [
    { icon: Archive, title: t("archives_access_step1_title", "Plan your archive visit"), description: t("archives_access_step1_desc", "Confirm opening hours, required IDs, and file request procedures before you travel.") },
    { icon: BookOpen, title: t("archives_access_step2_title", "Use catalog references"), description: t("archives_access_step2_desc", "Record shelf codes, archive boxes, and series numbers to retrieve documents efficiently.") },
    { icon: ShieldCheck, title: t("archives_access_step3_title", "Document provenance"), description: t("archives_access_step3_desc", "Capture archive citations and metadata to validate sources later.") },
  ];

  const officialArchives = [
    { countryKey: "country_algeria", country: t("country_algeria", "Algeria"), nameKey: "official_archive_algeria", name: t("official_archive_algeria", "Centre National des Archives (CNA)"), url: "https://archives-can.dz/", description: t("archive_desc_algeria", "Ottoman and colonial-era holdings, civil status precursors, maps, and photographs. Request access and catalog references for genealogical research.") },
    { countryKey: "country_morocco", country: t("country_morocco", "Morocco"), nameKey: "official_archive_morocco", name: t("official_archive_morocco", "Archives du Maroc"), url: "https://www.archivesdumaroc.ma/", description: t("archive_desc_morocco", "Protectorate and post-independence archives, legal and administrative collections. Consultation room and catalog for researchers.") },
    { countryKey: "country_tunisia", country: t("country_tunisia", "Tunisia"), nameKey: "official_archive_tunisia", name: t("official_archive_tunisia", "Archives Nationales de Tunisie"), url: "https://www.archives.nat.tn/", description: t("archive_desc_tunisia", "Thekra database (180,000+ records), historical and civil documents, books and periodicals. Plan visits and cite references for lineage work.") },
    { countryKey: "country_libya", country: t("country_libya", "Libya"), nameKey: "official_archive_libya", name: t("official_archive_libya", "Libyan Center for Archives and Historical Studies"), url: "https://lcahs.ly/", description: t("archive_desc_libya", "Ottoman, Italian, and modern collections; millions of documents and oral histories. Contact for access and catalog consultation in Tripoli.") },
    { countryKey: "country_mauritania", country: t("country_mauritania", "Mauritania"), nameKey: "official_archive_mauritania", name: t("official_archive_mauritania", "Archives Nationales de Mauritanie"), url: "https://www.culture.gov.mr/", description: t("archive_desc_mauritania", "National archival holdings and cultural ministry resources. Inquire for civil and historical documentation and research procedures.") },
    { countryKey: "country_western_sahara", country: t("country_western_sahara", "Western Sahara"), nameKey: "official_archive_western_sahara", name: t("official_archive_western_sahara", "Sahrawi National Archives"), url: "https://www.sahrawi-emb-au.com/documents/", description: t("archive_desc_western_sahara", "SADR documentation, microfilm collections, and official publications. Sahrawi embassies and Rabouni archives for genealogical and historical research.") },
  ];

  const internationalArchives = [
    { key: "archive_anom", name: t("archive_anom_name", "Archives Nationales d'Outre-Mer (ANOM)"), url: "https://www.archives-nationales-outre-mer.culture.gouv.fr/", description: t("archive_anom_desc", "French colonial archives: Algeria, Tunisia, Morocco, West Africa, and beyond. Civil registers (100+ years), military and convict records, catalogs and digitized documents. Based in Aix-en-Provence; online search available.") },
    { key: "archive_ottoman", name: t("archive_ottoman_name", "Turkish State Archives (Ottoman Archives)"), url: "https://www.devletarsivleri.gov.tr/", description: t("archive_ottoman_desc", "Ottoman imperial holdings including Maghreb provinces: Beylik, Qadi, and administrative records. Millions of documents; catalog at katalog.devletarsivleri.gov.tr. Reading room in Istanbul; researcher card required.") },
    { key: "archive_france", name: t("archive_france_name", "Archives Nationales (France)"), url: "https://www.archives-nationales.culture.gouv.fr/", description: t("archive_france_desc", "National archives in Paris and Pierrefitte: ministerial and territorial fonds, civil status, and colonial-era material. Virtual reading room with millions of digitized images; useful for metropolitan and colonial genealogy.") },
    { key: "archive_spain", name: t("archive_spain_name", "Archivo General de la Administración / PARES (Spain)"), url: "https://pares.mcu.es/", description: t("archive_spain_desc", "Spanish colonial administration: Alta Comisaría en Marruecos, Morocco and Colonies, Western Sahara. Catalogs and digitized documents via PARES; AGA in Alcalá de Henares. Essential for Spanish Morocco and Saharan genealogy.") },
    { key: "archive_italy", name: t("archive_italy_name", "Archivio Centrale dello Stato (Italy)"), url: "https://acs.beniculturali.it/", description: t("archive_italy_desc", "Central state archives: Italian Libya (1911–1943), colonial administration, military and civil records. Research in Rome; useful for Libyan and Tripolitanian genealogy from the Italian period.") },
  ];

  const digitalPortals = [
    {
      name: t("portal_gallica_name", "Gallica - Bibliothèque Nationale de France"),
      url: "https://gallica.bnf.fr/",
      description: t("portal_gallica_desc", "Accès à des milliers d'ouvrages numérisés, cartes historiques, récits de voyage et manuscrits portant sur le Maghreb à l'époque coloniale et précoloniale. Un outil inestimable pour croiser les sources écrites.")
    },
    {
      name: t("portal_uma_name", "Union du Maghreb Arabe (UMA) Digital Resources"),
      url: "https://maghrebarabe.org/",
      description: t("portal_uma_desc", "Portail officiel de l'Union du Maghreb Arabe. Regroupe des études régionales, rapports démographiques et données de coopération historique entre l'Algérie, la Libye, le Maroc, la Mauritanie et la Tunisie.")
    },
    {
      name: t("portal_bl_eap_name", "British Library - Endangered Archives Programme"),
      url: "https://eap.bl.uk/",
      description: t("portal_bl_eap_desc", "Projets de numérisation de manuscrits en danger au Maghreb, notamment les bibliothèques familiales de Chinguetti (Mauritanie), Ghardaïa (Algérie) et les archives de Tripoli (Libye).")
    },
    {
      name: t("portal_suleymaniye_name", "Süleymaniye Manuscript Library (Istanbul)"),
      url: "https://www.yek.gov.tr/",
      description: t("portal_suleymaniye_desc", "Contient une vaste collection de manuscrits ottomans, registres biographiques et généalogies de savants et familles notables des provinces du Maghreb sous l'administration ottomane.")
    }
  ];

  const navLabels: Record<string, string> = useMemo(() => ({
    "official-archives": t("official_archives_title", "Official Archives of North Africa"),
    "international-archives": t("international_archives_title", "International & Colonial Archives"),
    "digital-portals": t("digital_portals_title", "Digital Portals & Manuscripts"),
    "archive-types": t("archive_types", "Archive Types & Repositories"),
    "primary-sources": t("primary_sources", "Primary Sources"),
    "secondary-sources": t("secondary_sources", "Secondary Sources"),
    "access-guidelines": t("access_guidelines", "Access Guidelines"),
    "reliability": t("reliability_checks", "Reliability & Validation"),
    "how-to-access": t("archives_access", "How to Access Archives"),
  }), [t]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id || null);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const cardCls = isDark
    ? "bg-[#092C2B] border-[#2c1810] text-[#f0f7f6]"
    : "bg-white border-[#e5ddd0] text-[#1a3a38]";

  const sectionHeadingColor = "";
  const sectionIntroColor = "";

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4">
          <SEO
            title={t("sources_and_archives", "Sources & Archives")}
            description="Explore Ottoman registers, colonial archives (ANOM), sharia court records, and oral testimonies to trace family origins across the Maghreb and North Africa."
            keywords={["Maghreb archives", "Ottoman defters", "ANOM civil status", "Islamic genealogy sources"]}
          />
          <p className="text-sm uppercase tracking-[0.3em] text-[#d4af37]">
            {t("sources_and_archives", "Sources & Archives")}
          </p>
          <h1 className="text-5xl font-bold">
            {t("sources_archives_title", "Sources & Archives for Maghreb Genealogy")}
          </h1>
          <p className="max-w-3xl mx-auto text-lg opacity-90">
            {t("sources_archives_intro", "Navigate historical archives, explore primary sources, and learn how to access and validate genealogical information across Ottoman registers, colonial archives, and modern civil records.")}
          </p>
        </div>
      }
    >
      {/* Sticky nav */}
      <nav
        className={`sticky top-0 z-30 py-3 px-4 rounded-xl border ${isDark ? "bg-[#1c1110]/95 border-[#2c1810] backdrop-blur" : "bg-white/95 border-[#e5ddd0] backdrop-blur"} shadow-lg`}
      >
        <button
          type="button"
          className="md:hidden flex items-center gap-2 w-full py-2 font-medium"
          onClick={() => setNavOpen((o) => !o)}
          aria-expanded={navOpen}
        >
          <Menu className="w-5 h-5" />
          {t("sources_and_archives", "Sources & Archives")}
        </button>
        <div className={`${navOpen ? "block" : "hidden"} md:block`}>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-6 py-2">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setNavOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-[#d4af37] ${activeSection === id ? "text-[#d4af37]" : isDark ? "text-[#e8dfca]" : "text-[#5d4037]"}`}
                >
                  {navLabels[id] || id}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Official Archives */}
      <section id="official-archives" className="scroll-mt-28">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold border-l-4 border-[#d4af37] pl-4 ${sectionHeadingColor}`}>
            {t("official_archives_title", "Official Archives of North Africa")}
          </h2>
          <p className={`mt-2 text-lg opacity-90 ${sectionIntroColor}`}>
            {t("official_archives_intro", "Visit the official national archives of each Maghreb country for civil status, historical records, and genealogical sources. Links open in a new tab.")}
          </p>
          <p className={`mt-2 text-sm opacity-75 ${sectionIntroColor}`}>
            {t("official_archives_quick_jump", "Jump to a country: ")}
            {officialArchives.map((item, idx) => (
              <span key={item.countryKey}>
                <a href={`#archive-${item.countryKey}`} className="text-[#d4af37] hover:underline font-medium">
                  {item.country}
                </a>
                {idx < officialArchives.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officialArchives.map((item) => (
            <article
              key={item.countryKey}
              id={`archive-${item.countryKey}`}
              className={`${cardCls} rounded-2xl border-2 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#d4af37] hover:shadow-xl`}
              data-aos="fade-up"
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                    <Globe className="w-6 h-6" />
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-50" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-[#d4af37] mb-1">{item.country}</h3>
                <p className="font-semibold opacity-95 mb-3">{item.name}</p>
                <p className="text-sm opacity-85 leading-relaxed flex-1 mb-5">{item.description}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#d4af37] text-[#1c1110] font-bold text-sm hover:bg-[#c4a030] transition-colors"
                >
                  {t("visit_official_site", "Visit official site")}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* International Archives */}
      <section id="international-archives" className={`scroll-mt-28 py-10 rounded-2xl px-6 ${isDark ? "bg-[#1a0f0d]" : "bg-[#f8f5ef]"}`}>
        <div className="mb-8">
          <h2 className={`text-3xl font-bold border-l-4 border-[#5d4037] pl-4 ${sectionHeadingColor}`}>
            {t("international_archives_title", "International & Colonial Archives")}
          </h2>
          <p className={`mt-2 text-lg opacity-90 ${sectionIntroColor}`}>
            {t("international_archives_intro", "Major archives of former colonizers and the Ottoman Empire hold essential records for Maghreb genealogy.")}
          </p>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internationalArchives.map((item) => (
            <article
              key={item.key}
              className={`${cardCls} rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:border-[#5d4037] hover:shadow-xl`}
              data-aos="fade-up"
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#5d4037]/20 text-[#5d4037]">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-50" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-[#5d4037] mb-3">{item.name}</h3>
                <p className="text-sm opacity-85 leading-relaxed flex-1 mb-5">{item.description}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#5d4037] text-white font-bold text-sm hover:bg-[#4a3329] transition-colors"
                >
                  {t("visit_official_site", "Visit official site")}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Digital Portals */}
      <section id="digital-portals" className="scroll-mt-28">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold border-l-4 border-[#d4af37] pl-4 ${sectionHeadingColor}`}>
            {t("digital_portals_title", "Digital Portals & Manuscript Collections")}
          </h2>
          <p className={`mt-2 text-lg opacity-90 ${sectionIntroColor}`}>
            {t("digital_portals_intro", "Explore online digital repositories, historical books, and manuscript archives containing genealogical links for North Africa.")}
          </p>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {digitalPortals.map((item) => (
            <article
              key={item.url}
              className={`${cardCls} rounded-2xl border p-6 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#d4af37] hover:shadow-xl`}
              data-aos="fade-up"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-50" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-[#d4af37] mb-3">{item.name}</h3>
                <p className="text-sm opacity-85 leading-relaxed mb-5">{item.description}</p>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#d4af37] text-[#1c1110] font-bold text-sm hover:bg-[#c4a030] transition-colors mt-auto"
              >
                {t("explore_database", "Explore Portal")}
                <ExternalLink className="w-4 h-4" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Archive Types */}
      <section id="archive-types" className="scroll-mt-28">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold border-l-4 border-[#d4af37] pl-4 ${sectionHeadingColor}`}>
            {t("archive_types", "Archive Types & Repositories")}
          </h2>
          <p className={`mt-2 text-lg opacity-90 ${sectionIntroColor}`}>
            {t("archive_types_desc", "Comprehensive overview of historical and modern archives preserving Maghreb genealogy.")}
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {archiveItems.map((item) => (
            <div
              key={item.title}
              className={`${cardCls} p-6 rounded-2xl border-2 transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-xl`}
              data-aos="fade-up"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full shrink-0" style={{ backgroundColor: `${item.accent}22`, color: item.accent }}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
              </div>
              <p className="opacity-90 mb-4">{item.description}</p>
              <ul className="list-disc pl-6 space-y-1 opacity-90 text-sm">
                {item.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Primary & Secondary in two columns */}
      <div className="grid lg:grid-cols-2 gap-8">
        <section id="primary-sources" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold border-l-4 border-[#d4af37] pl-4 mb-6 ${sectionHeadingColor}`}>
            {t("primary_sources", "Primary Sources")}
          </h2>
          <p className={`text-lg opacity-90 mb-6 ${sectionIntroColor}`}>
            {t("primary_sources_desc", "Direct evidence from original documents and testimonies that form the foundation of genealogical research.")}
          </p>
          <div className="space-y-4">
            {primarySources.map((item) => (
              <div
                key={item.title}
                className={`${cardCls} p-5 rounded-xl border transition-all hover:shadow-lg`}
                data-aos="fade-up"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#d4af37]/20 text-[#d4af37] shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="secondary-sources" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold border-l-4 border-[#5d4037] pl-4 mb-6 ${sectionHeadingColor}`}>
            {t("secondary_sources", "Secondary Sources")}
          </h2>
          <p className={`text-lg opacity-90 mb-6 ${sectionIntroColor}`}>
            {t("secondary_sources_desc", "Academic research and digital collections that provide context and additional verification.")}
          </p>
          <div className="space-y-4">
            {secondarySources.map((item) => (
              <div
                key={item.title}
                className={`${cardCls} p-5 rounded-xl border transition-all hover:shadow-lg`}
                data-aos="fade-up"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5d4037]/20 text-[#5d4037] shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Access Guidelines */}
      <section id="access-guidelines" className={`scroll-mt-28 py-10 rounded-2xl px-6 ${isDark ? "bg-[#1a0f0d]" : "bg-[#f8f5ef]"}`}>
        <h2 className={`text-3xl font-bold border-l-4 border-[#d4af37] pl-4 mb-6 ${sectionHeadingColor}`}>
          {t("access_guidelines", "Access Guidelines")}
        </h2>
        <p className={`text-lg opacity-90 mb-8 ${sectionIntroColor}`}>
          {t("access_guidelines_desc", "Essential information for accessing archives and protecting personal data in genealogical research.")}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {accessGuides.map((item) => (
            <div key={item.title} className={`${cardCls} p-6 rounded-xl border`} data-aos="fade-up">
              <item.icon className="w-10 h-10 text-[#d4af37] mb-4" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm opacity-90">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reliability */}
      <section id="reliability" className="scroll-mt-28">
        <h2 className={`text-3xl font-bold border-l-4 border-[#5d4037] pl-4 mb-6 ${sectionHeadingColor}`}>
          {t("reliability_checks", "Reliability & Validation")}
        </h2>
        <p className={`text-lg opacity-90 mb-8 ${sectionIntroColor}`}>
          {t("reliability_checks_desc", "Best practices for validating genealogical information and ensuring research accuracy.")}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {reliabilityChecks.map((item) => (
            <div key={item.title} className={`${cardCls} p-6 rounded-xl border`} data-aos="fade-up">
              <item.icon className="w-10 h-10 text-[#5d4037] mb-4" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm opacity-90">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Access */}
      <section id="how-to-access" className={`scroll-mt-28 py-10 rounded-2xl px-6 ${isDark ? "bg-[#1a0f0d]" : "bg-[#f8f5ef]"}`}>
        <h2 className={`text-3xl font-bold border-l-4 border-[#d4af37] pl-4 mb-6 ${sectionHeadingColor}`}>
          {t("archives_access", "How to Access Archives")}
        </h2>
        <p className={`text-lg opacity-90 mb-8 ${sectionIntroColor}`}>
          {t("archives_access_desc", "Step-by-step guide to planning your archive visit and documenting sources effectively.")}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {accessSteps.map((step, idx) => (
            <div key={step.title} className={`${cardCls} p-6 rounded-xl border flex flex-col`} data-aos="fade-up">
              <span className="text-2xl font-bold text-[#d4af37]/80 mb-2">0{idx + 1}</span>
              <step.icon className="w-10 h-10 text-[#d4af37] mb-3" />
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm opacity-90 mt-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </RootsPageShell>
  );
}
