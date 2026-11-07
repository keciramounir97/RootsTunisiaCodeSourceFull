import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Archive,
  FileText,
  MapPin,
  Search,
  Landmark,
  BookOpen,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Compass,
  CheckCircle2,
  X,
  FileCheck,
  Clock,
  ExternalLink,
  Phone,
  Copy,
  Check,
  HelpCircle,
  Download,
} from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import kairouan from "../assets/slider-kairouan.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { useSiteContent } from "../hooks/useSiteContent";

type SourceItem = {
  id: string;
  titleKey: string;
  periodKey: string;
  holdsKey: string;
  provesKey: string;
  category: string;
  classificationCode: string;
  searchRequirements: string;
  officialUrl: string;
  internalLink: string;
  guideKey?: string;
};

type ArchiveItem = {
  id: string;
  nameKey: string;
  cityKey: string;
  holdingsKey: string;
  address: string;
  accessRules: string;
  officialUrl: string;
  catalogUrl: string;
  mapsUrl: string;
  phone: string;
  hours: string;
};

const sources: SourceItem[] = [
  {
    id: "etat_civil",
    titleKey: "src_etat_civil_title",
    periodKey: "src_etat_civil_period",
    holdsKey: "src_etat_civil_holds",
    provesKey: "src_etat_civil_proves",
    category: "modern",
    classificationCode: "Série EC (État Civil Municipal & Archives Nationales)",
    searchRequirements: "Full ancestral name, estimated birth/marriage year, native municipality / caïdat",
    officialUrl: "http://www.archives.nat.tn",
    internalLink: "/gallery/trees",
  },
  {
    id: "charaique",
    titleKey: "src_charaA_que_title",
    periodKey: "src_charaA_que_period",
    holdsKey: "src_charaA_que_holds",
    provesKey: "src_charaA_que_proves",
    category: "judicial",
    classificationCode: "Série Charaïque (Tribunaux de Tunis, Kairouan, Sfax)",
    searchRequirements: "Deceased ancestor's name, heirs' names, qadi court jurisdiction, approximate decease decade",
    officialUrl: "http://www.archives.nat.tn",
    internalLink: "/library",
  },
  {
    id: "habous",
    titleKey: "src_habous_title",
    periodKey: "src_habous_period",
    holdsKey: "src_habous_holds",
    provesKey: "src_habous_proves",
    category: "endowments",
    classificationCode: "Fonds Jamaiyat el Habous (Archives Nationales de Tunisie)",
    searchRequirements: "Original founder (waqif) name, family title deed location (fondouk, olive grove, medina house)",
    officialUrl: "http://www.archives.nat.tn",
    internalLink: "/gallery/documents",
  },
  {
    id: "beylical",
    titleKey: "src_beylical_title",
    periodKey: "src_beylical_period",
    holdsKey: "src_beylical_holds",
    provesKey: "src_beylical_proves",
    category: "decrees",
    classificationCode: "Série Beylicale (Diwan al-Insha & Beylical Decrees)",
    searchRequirements: "Ancestor's honorific title or administrative caïd / agha post, reign of ruling Bey",
    officialUrl: "http://www.archives.nat.tn",
    internalLink: "/periods",
  },
  {
    id: "majba",
    titleKey: "src_majba_title",
    periodKey: "src_majba_period",
    holdsKey: "src_majba_holds",
    provesKey: "src_majba_proves",
    category: "fiscal",
    classificationCode: "Série Fiscale (Cahiers de la Majba 1856-1881)",
    searchRequirements: "Name of the head of household, tribe name, douar, and regional caïdat",
    officialUrl: "http://www.archives.nat.tn",
    internalLink: "/periods",
  },
  {
    id: "cadastre",
    titleKey: "src_cadastre_title",
    periodKey: "src_cadastre_period",
    holdsKey: "src_cadastre_holds",
    provesKey: "src_cadastre_proves",
    category: "property",
    classificationCode: "Office de la Topographie et du Cadastre (OTC) Titres Fonciers",
    searchRequirements: "Cadastral plot number, local toponym (Hanafi, Maliki borders), co-heir names",
    officialUrl: "https://www.otc.nat.tn",
    internalLink: "/research",
  },
  {
    id: "schools",
    titleKey: "src_schools_title",
    periodKey: "src_schools_period",
    holdsKey: "src_schools_holds",
    provesKey: "src_schools_proves",
    category: "education",
    classificationCode: "Registres d'Inscription (Sadiki, Zitouna, Alaoui)",
    searchRequirements: "Student ancestor name, father's profession, approximate graduation year",
    officialUrl: "https://www.uz.rnu.tn",
    internalLink: "/library",
  },
  {
    id: "military",
    titleKey: "src_military_title",
    periodKey: "src_military_period",
    holdsKey: "src_military_holds",
    provesKey: "src_military_proves",
    category: "conscription",
    classificationCode: "Registres Matricules Militaires (ANT & SHD)",
    searchRequirements: "Conscription class year (age 20), native caïdat, soldier name",
    officialUrl: "https://www.memoiredeshommes.sga.defense.gouv.fr",
    internalLink: "/gallery/articles",
  },
  {
    id: "community",
    titleKey: "src_community_title",
    periodKey: "src_community_period",
    holdsKey: "src_community_holds",
    provesKey: "src_community_proves",
    category: "diaspora",
    classificationCode: "Fonds Communautaires & Consulaires (Djerba, Testour, Marseille, ANOM)",
    searchRequirements: "Family patronymic, community registry place, consular registration dossier",
    officialUrl: "http://anom.archivesnationales.culture.gouv.fr/caomec2/",
    internalLink: "/gallery/trees",
  },
];

const institutions: ArchiveItem[] = [
  {
    id: "ant",
    nameKey: "inst_ant_name",
    cityKey: "inst_ant_city",
    holdingsKey: "inst_ant_holdings",
    address: "Boulevard 9 Avril 1938, 1006 Tunis, Tunisia",
    accessRules: "National ID (CIN) or Passport required. Reader card issued on-site. Digital and microfilm reading rooms available.",
    officialUrl: "http://www.archives.nat.tn",
    catalogUrl: "http://www.archives.nat.tn/inventaires",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Archives+Nationales+de+Tunisie+Boulevard+9+Avril+Tunis",
    phone: "+216 71 568 200",
    hours: "Mon–Fri: 08:30 – 16:30 | Sat: 08:30 – 12:30",
  },
  {
    id: "bnt",
    nameKey: "inst_bnt_name",
    cityKey: "inst_bnt_city",
    holdingsKey: "inst_bnt_holdings",
    address: "Boulevard 9 Avril 1938, 1006 Tunis, Tunisia",
    accessRules: "Open to researchers and university students. Consultation of manuscript collections via reader registration.",
    officialUrl: "http://www.bnt.nat.tn",
    catalogUrl: "http://opac.bnt.nat.tn",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bibliotheque+Nationale+de+Tunisie+Boulevard+9+Avril",
    phone: "+216 71 571 888",
    hours: "Mon–Sat: 08:00 – 17:00",
  },
  {
    id: "habous",
    nameKey: "inst_habous_name",
    cityKey: "inst_habous_city",
    holdingsKey: "inst_habous_holdings",
    address: "Dar El Bey & National Archives Annex, Medina of Tunis",
    accessRules: "Archival requests handled through the ANT reference desk with property identification codes.",
    officialUrl: "http://www.archives.nat.tn",
    catalogUrl: "http://www.archives.nat.tn/fonds-habous",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dar+El+Bey+La+Kasbah+Tunis",
    phone: "+216 71 560 000",
    hours: "Mon–Fri: 08:30 – 14:00",
  },
  {
    id: "kairouan",
    nameKey: "inst_kairouan_name",
    cityKey: "inst_kairouan_city",
    holdingsKey: "inst_kairouan_holdings",
    address: "Rue de la Grande Mosquée, Kairouan Medina",
    accessRules: "Regional court series consultation upon formal genealogical or historical research application.",
    officialUrl: "http://www.inp2020.tn",
    catalogUrl: "http://www.inp2020.tn/manuscrits-kairouan",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Grande+Mosquee+de+Kairouan",
    phone: "+216 77 230 400",
    hours: "Mon–Fri: 08:30 – 15:00",
  },
  {
    id: "sfax",
    nameKey: "inst_sfax_name",
    cityKey: "inst_sfax_city",
    holdingsKey: "inst_sfax_holdings",
    address: "Avenue Habib Bourguiba, Sfax Municipality",
    accessRules: "Municipal civil registration archives open to direct descendants and accredited researchers.",
    officialUrl: "https://www.commune-sfax.gov.tn",
    catalogUrl: "https://www.commune-sfax.gov.tn/archives",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Commune+de+Sfax+Avenue+Habib+Bourguiba",
    phone: "+216 74 229 000",
    hours: "Mon–Fri: 08:00 – 14:30",
  },
  {
    id: "sousse",
    nameKey: "inst_sousse_name",
    cityKey: "inst_sousse_city",
    holdingsKey: "inst_sousse_holdings",
    address: "Boulevard Tahar Sfar, Sousse",
    accessRules: "Civil registry and maritime trade archives accessible with proof of direct lineage.",
    officialUrl: "https://www.commune-sousse.gov.tn",
    catalogUrl: "https://www.commune-sousse.gov.tn/patrimoine",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Municipalite+de+Sousse+Boulevard+Tahar+Sfar",
    phone: "+216 73 227 100",
    hours: "Mon–Fri: 08:30 – 14:30",
  },
  {
    id: "djerba",
    nameKey: "inst_djerba_name",
    cityKey: "inst_djerba_city",
    holdingsKey: "inst_djerba_holdings",
    address: "Houmt Souk & Hara Sghira, Djerba Island",
    accessRules: "Community archives preserved in local repositories and digital catalog copies.",
    officialUrl: "http://www.inp2020.tn",
    catalogUrl: "http://www.inp2020.tn/djerba-patrimoine",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Houmt+Souk+Djerba",
    phone: "+216 75 650 100",
    hours: "Mon–Thu: 09:00 – 14:00",
  },
  {
    id: "testour",
    nameKey: "inst_testour_name",
    cityKey: "inst_testour_city",
    holdingsKey: "inst_testour_holdings",
    address: "Medina of Testour, Medjerda Valley, Beja Governorate",
    accessRules: "Andalusian family records catalogued in the municipal patrimony library.",
    officialUrl: "http://www.inp2020.tn",
    catalogUrl: "http://www.inp2020.tn/andalous-testour",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Grande+Mosquee+de+Testour",
    phone: "+216 78 570 050",
    hours: "Tue–Sat: 09:00 – 15:00",
  },
  {
    id: "anom",
    nameKey: "inst_anom_name",
    cityKey: "inst_anom_city",
    holdingsKey: "inst_anom_holdings",
    address: "29 Chemin du Moulin de Testas, 13090 Aix-en-Provence, France",
    accessRules: "Free online digitized catalog for civil status; in-person reading room for administrative series.",
    officialUrl: "http://anom.archivesnationales.culture.gouv.fr",
    catalogUrl: "http://anom.archivesnationales.culture.gouv.fr/caomec2/",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Archives+Nationales+d+Outre-Mer+Aix-en-Provence",
    phone: "+33 4 42 93 38 50",
    hours: "Mon–Fri: 09:00 – 17:00 (CET)",
  },
  {
    id: "inp",
    nameKey: "inst_inp_name",
    cityKey: "inst_inp_city",
    holdingsKey: "inst_inp_holdings",
    address: "Place du Château, Dar Hussein, Tunis Medina",
    accessRules: "Scientific research access for epigraphic, archaeological, and architectural historical holdings.",
    officialUrl: "http://www.inp2020.tn",
    catalogUrl: "http://www.inp2020.tn/bibliotheque",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dar+Hussein+Place+du+Chateau+Tunis",
    phone: "+216 71 561 622",
    hours: "Mon–Fri: 08:30 – 14:30",
  },
];

export default function SourcesAndArchives() {
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"all" | "sources" | "archives">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<SourceItem | null>(null);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Call slip generator form state
  const [slipAncestor, setSlipAncestor] = useState<string>("");
  const [slipRegion, setSlipRegion] = useState<string>("");
  const [slipPeriod, setSlipPeriod] = useState<string>("");
  const [slipInstitution, setSlipInstitution] = useState<string>("ant");
  const [copiedSlip, setCopiedSlip] = useState<boolean>(false);

  useEffect(() => {
    if (location.pathname.includes("/archives") || location.hash === "#archives") {
      setActiveTab("archives");
    } else if (location.pathname.includes("/sources") || location.hash === "#sources") {
      setActiveTab("sources");
    }
  }, [location.pathname, location.hash]);

  const query = searchQuery.trim().toLowerCase();

  const filteredSources = useMemo(() => {
    if (!query) return sources;
    return sources.filter((s) => {
      const title = t(s.titleKey).toLowerCase();
      const period = t(s.periodKey).toLowerCase();
      const holds = t(s.holdsKey).toLowerCase();
      const proves = t(s.provesKey).toLowerCase();
      return (
        title.includes(query) ||
        period.includes(query) ||
        holds.includes(query) ||
        proves.includes(query)
      );
    });
  }, [query, t]);

  const filteredInstitutions = useMemo(() => {
    if (!query) return institutions;
    return institutions.filter((i) => {
      const name = t(i.nameKey).toLowerCase();
      const city = t(i.cityKey).toLowerCase();
      const holdings = t(i.holdingsKey).toLowerCase();
      return name.includes(query) || city.includes(query) || holdings.includes(query);
    });
  }, [query, t]);

  const showSources = activeTab === "all" || activeTab === "sources";
  const showArchives = activeTab === "all" || activeTab === "archives";

  const handleCopySlip = () => {
    const targetInst = institutions.find((i) => i.id === slipInstitution) || institutions[0];
    const text = `================================================
ROOTS TUNISIA — ARCHIVAL CALL SLIP / BULLETIN DE COMMANDE
================================================
Target Repository: ${t(targetInst.nameKey)} (${t(targetInst.cityKey)})
Address: ${targetInst.address}
Official Catalog: ${targetInst.catalogUrl}

RESEARCHER REQUEST DETAILS:
- Ancestor Full Name: ${slipAncestor || "[Ancestor Name]"}
- Region / Municipality / Caïdat: ${slipRegion || "[Region / Town]"}
- Estimated Living Period: ${slipPeriod || "[Estimated Year / Decade]"}

ARCHIVAL CHECKLIST:
[ ] Reader Admission Card verified
[ ] Serie classification consulted in inventory
[ ] Maximum 3 registers requested per morning session
================================================`;

    navigator.clipboard.writeText(text);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 3000);
  };

  const protocolSteps = [
    {
      step: "01",
      title: t("protocol_step_1_title"),
      desc: t("protocol_step_1_desc"),
      icon: Compass,
    },
    {
      step: "02",
      title: t("protocol_step_2_title"),
      desc: t("protocol_step_2_desc"),
      icon: FileCheck,
    },
    {
      step: "03",
      title: t("protocol_step_3_title"),
      desc: t("protocol_step_3_desc"),
      icon: CheckCircle2,
    },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_sources_title")}
        description={t("seo_sources_desc")}
        keywords={[
          "Tunisian sources",
          "Archives Nationales de Tunisie",
          "Genealogy archives Tunis",
          "Civil registry Tunisia",
          "Sijillat charaique",
        ]}
      />

      {/* Archival Consultation Guide & Call Slip Generator Modal */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-xl bg-[var(--card)] shadow-2xl text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 end-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-full hover:bg-[var(--gold)]/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[var(--gold)]/25 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                  {t("consultation_guide_btn")}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {t("reader_admission")}
                </h3>
              </div>
            </div>

            {/* 4 Protocol Steps */}
            <div className="mt-5 space-y-4">
              <div className="p-4 rounded-md bg-[var(--background)]/80 border border-[var(--gold)]/20">
                <h4 className="font-bold text-[var(--gold)] text-xs sm:text-sm mb-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{t("guide_step1_title")}</span>
                </h4>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {t("guide_step1_desc")}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/80 border border-[var(--gold)]/20">
                <h4 className="font-bold text-[var(--gold)] text-xs sm:text-sm mb-1 flex items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>{t("guide_step2_title")}</span>
                </h4>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {t("guide_step2_desc")}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/80 border border-[var(--gold)]/20">
                <h4 className="font-bold text-[var(--gold)] text-xs sm:text-sm mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{t("guide_step3_title")}</span>
                </h4>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {t("guide_step3_desc")}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/80 border border-[var(--gold)]/20">
                <h4 className="font-bold text-[var(--gold)] text-xs sm:text-sm mb-1 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>{t("guide_step4_title")}</span>
                </h4>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {t("guide_step4_desc")}
                </p>
              </div>
            </div>

            {/* Call Slip Generator */}
            <div className="mt-6 pt-5 border-t border-[var(--gold)]/30">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="h-5 w-5 text-[var(--gold)]" />
                <h4 className="font-display text-base font-bold text-[var(--foreground)]">
                  {t("generate_request_slip")}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("slip_ancestor_name")}
                  </label>
                  <input
                    type="text"
                    value={slipAncestor}
                    onChange={(e) => setSlipAncestor(e.target.value)}
                    placeholder="e.g. Si Taher Ben Mohamed..."
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("slip_governorate")}
                  </label>
                  <input
                    type="text"
                    value={slipRegion}
                    onChange={(e) => setSlipRegion(e.target.value)}
                    placeholder="e.g. Sfax / Mahdia / Tunis Medina..."
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("slip_estimated_period")}
                  </label>
                  <input
                    type="text"
                    value={slipPeriod}
                    onChange={(e) => setSlipPeriod(e.target.value)}
                    placeholder="e.g. 1870–1910..."
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-[var(--muted-foreground)] mb-1">
                    {t("repository_label")}
                  </label>
                  <select
                    value={slipInstitution}
                    onChange={(e) => setSlipInstitution(e.target.value)}
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  >
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {t(inst.nameKey)} ({t(inst.cityKey)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopySlip}
                  className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-2 cursor-pointer"
                >
                  {copiedSlip ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedSlip ? t("slip_copied_toast") : t("slip_copy_btn")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="btn-base btn-outline text-xs py-2 px-4"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Source Modal */}
      {selectedSource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedSource(null)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-2xl p-6 sm:p-8 rounded-xl bg-[var(--card)] shadow-2xl text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setSelectedSource(null)}
              className="absolute top-4 end-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-full hover:bg-[var(--gold)]/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[var(--gold)]/25 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                  {t("source_dossier_title")}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {t(selectedSource.titleKey)}
                </h3>
                <span dir="ltr" className="text-xs font-bold text-[var(--gold)]">
                  {t(selectedSource.periodKey)}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("genealogical_proof_label")}
                </p>
                <p className="leading-relaxed text-[var(--foreground)]">
                  {t(selectedSource.provesKey)}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("primary_fonds_code")}
                </p>
                <p className="leading-relaxed text-[var(--foreground)] font-mono text-xs">
                  {selectedSource.classificationCode}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("required_search_fields")}
                </p>
                <p className="leading-relaxed text-[var(--muted-foreground)]">
                  {selectedSource.searchRequirements}
                </p>
              </div>
            </div>

            {/* Direct Portal & Cross-Link Actions */}
            <div className="mt-6 pt-4 border-t border-[var(--gold)]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <a
                  href={selectedSource.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-gold w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{t("official_portal_link")}</span>
                </a>
                <Link
                  to={selectedSource.internalLink}
                  onClick={() => setSelectedSource(null)}
                  className="btn-base btn-outline w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>{t("source_internal_link")}</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSource(null)}
                className="btn-base btn-outline w-full sm:w-auto text-xs"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Archive Modal */}
      {selectedArchive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedArchive(null)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-2xl p-6 sm:p-8 rounded-xl bg-[var(--card)] shadow-2xl text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setSelectedArchive(null)}
              className="absolute top-4 end-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-full hover:bg-[var(--gold)]/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[var(--gold)]/25 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                <Archive className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                  {t("archive_dossier_title")}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {t(selectedArchive.nameKey)}
                </h3>
                <p className="text-xs text-[var(--gold)] font-semibold flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{t(selectedArchive.cityKey)}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("visiting_address_label")}
                </p>
                <p className="leading-relaxed text-[var(--foreground)]">
                  {selectedArchive.address}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("opening_hours")}
                </p>
                <p className="leading-relaxed text-[var(--foreground)] font-semibold flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[var(--gold)] shrink-0" />
                  <span>{selectedArchive.hours}</span>
                </p>
                {selectedArchive.phone && (
                  <p className="mt-1 text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
                    <span>{selectedArchive.phone}</span>
                  </p>
                )}
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("repository_label")}
                </p>
                <p className="leading-relaxed text-[var(--foreground)]">
                  {t(selectedArchive.holdingsKey)}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.68rem] mb-1">
                  {t("access_protocol_label")}
                </p>
                <p className="leading-relaxed text-[var(--muted-foreground)]">
                  {selectedArchive.accessRules}
                </p>
              </div>
            </div>

            {/* Direct Official Repository Links */}
            <div className="mt-6 pt-4 border-t border-[var(--gold)]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <a
                  href={selectedArchive.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-gold w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{t("official_portal_link")}</span>
                </a>
                <a
                  href={selectedArchive.catalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-outline w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>{t("digital_catalog_link")}</span>
                </a>
                <a
                  href={selectedArchive.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-outline w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
                >
                  <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>{t("view_on_google_maps")}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArchive(null)}
                className="btn-base btn-outline w-full sm:w-auto text-xs"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      <PageHero
        eyebrow={getText("research", "hero", "eyebrow") ?? t("sources_and_archives_nav")}
        title={getText("research", "hero", "title") ?? t("tunisian_sources_repositories")}
        subtitle={
          getText("research", "hero", "subtitle") ?? t("tunisian_sources_repositories_desc")
        }
        image={getImage("research", "hero", "image") ?? kairouan}
      >
        <Link to="/periods" className="btn-base btn-gold w-full sm:w-auto min-w-[180px]">
          {t("see_the_timeline")}
        </Link>
        <button
          type="button"
          onClick={() => setShowGuideModal(true)}
          className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[180px] flex items-center justify-center gap-2"
        >
          <Compass className="h-4 w-4 text-[var(--gold)]" />
          <span>{t("consultation_guide_btn")}</span>
        </button>
      </PageHero>

      {/* Interactive Filter & Live Search Bar */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto max-w-[var(--content-max)]">
          <div className="surface-card p-4 sm:p-6 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* View Switcher */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                {t("tab_all")}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sources")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "sources"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{t("tab_sources")} (9)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("archives")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "archives"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                <Archive className="h-3.5 w-3.5" />
                <span>{t("tab_archives")} (10)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGuideModal(true)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>{t("generate_request_slip")}</span>
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_records_placeholder")}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] ps-9 pe-4 py-2 text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sources Section */}
      {showSources && (
        <Section id="sources">
          <SectionHeading
            center={true}
            eyebrow={t("evidence_eyebrow")}
            title={t("know_what_document_proves")}
            intro={t("know_what_document_proves_intro")}
          />

          {filteredSources.length === 0 ? (
            <div className="mt-8 text-center p-8 rounded-lg border border-[var(--gold)]/30 bg-[var(--card)] text-sm text-[var(--muted-foreground)]">
              {t("no_records_found")}
            </div>
          ) : (
            <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {filteredSources.map((s) => (
                <article
                  key={s.id}
                  className="surface-card frame-gold group flex h-full flex-col justify-between p-6 sm:p-7 rounded-lg shadow-md bg-[var(--card)]/95 backdrop-blur-sm text-start transition-all hover:border-[var(--gold)] hover:-translate-y-1"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--gold)]/20 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                          {t(s.titleKey)}
                        </h3>
                      </div>
                      <span
                        dir="ltr"
                        className="rounded-sm bg-[var(--gold)]/15 border border-[var(--gold)]/35 px-2 py-0.5 text-[0.68rem] font-bold text-[var(--gold)] shrink-0"
                      >
                        {t(s.periodKey)}
                      </span>
                    </div>

                    {/* Repository */}
                    <div className="mt-4">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                        {t("repository_label")}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)] font-medium">
                        {t(s.holdsKey)}
                      </p>
                    </div>

                    {/* Proof */}
                    <div className="mt-4 pt-3 border-t border-[var(--gold)]/15">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                        {t("genealogical_proof_label")}
                      </p>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--foreground)]">
                        {t(s.provesKey)}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-6 pt-3 border-t border-[var(--gold)]/15 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedSource(s)}
                        className="font-bold text-[var(--gold)] uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{t("inspect_source_dossier")}</span>
                        <ArrowRight className={`h-3 w-3 ${isRtl ? "rotate-180" : ""}`} />
                      </button>
                      <Link
                        to={s.internalLink}
                        className="text-[var(--muted-foreground)] hover:text-[var(--gold)] text-[0.68rem] flex items-center gap-1"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>Roots Tunisia</span>
                      </Link>
                    </div>
                    <div className="pt-2 border-t border-[var(--border)]/40 flex items-center justify-between">
                      <a
                        href={s.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.68rem] font-semibold text-[var(--gold)] hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>{t("official_portal_link")}</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Archives Directory Section */}
      {showArchives && (
        <Section id="archives" className="bg-[var(--secondary)]/35">
          <SectionHeading
            center={true}
            eyebrow={t("directory")}
            title={t("ten_institutions_title")}
            intro={t("ten_institutions_intro")}
          />

          {filteredInstitutions.length === 0 ? (
            <div className="mt-8 text-center p-8 rounded-lg border border-[var(--gold)]/30 bg-[var(--card)] text-sm text-[var(--muted-foreground)]">
              {t("no_records_found")}
            </div>
          ) : (
            <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 items-stretch">
              {filteredInstitutions.map((i) => (
                <article
                  key={i.id}
                  className="surface-card group flex h-full flex-col justify-between p-6 sm:p-8 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md text-start transition-all hover:border-[var(--gold)] hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45 shrink-0">
                          <Archive className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                            {t(i.nameKey)}
                          </h3>
                          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--gold)]">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span>{t(i.cityKey)}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[0.68rem] font-bold text-[var(--muted-foreground)] bg-[var(--background)] px-2 py-1 rounded border border-[var(--border)]">
                        {i.hours.split("|")[0]}
                      </span>
                    </div>

                    <div className="mt-5 p-4 rounded-md bg-[var(--background)]/60 border border-[var(--gold)]/20">
                      <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                        {t("repository_label")}
                      </p>
                      <p className="text-xs sm:text-sm leading-relaxed text-[var(--foreground)]">
                        {t(i.holdingsKey)}
                      </p>
                    </div>

                    <p className="mt-3 text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[var(--gold)] shrink-0" />
                      <span className="truncate">{i.address}</span>
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[var(--gold)]/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedArchive(i)}
                        className="font-bold text-[var(--gold)] uppercase tracking-wider hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{t("inspect_archive_dossier")}</span>
                        <ArrowRight className={`h-3 w-3 ${isRtl ? "rotate-180" : ""}`} />
                      </button>
                      <a
                        href={i.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--muted-foreground)] hover:text-[var(--gold)] text-[0.68rem] flex items-center gap-1"
                      >
                        <MapPin className="h-3 w-3" />
                        <span>{t("view_on_google_maps")}</span>
                      </a>
                    </div>
                    <div className="pt-2 border-t border-[var(--border)]/40 flex items-center justify-between">
                      <a
                        href={i.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.68rem] font-semibold text-[var(--gold)] hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>{t("official_portal_link")}</span>
                      </a>
                      <a
                        href={i.catalogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.68rem] text-[var(--muted-foreground)] hover:text-[var(--foreground)] inline-flex items-center gap-1"
                      >
                        <BookOpen className="h-3 w-3 text-[var(--gold)]" />
                        <span>{t("digital_catalog_link")}</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* 3-Step Research Protocol Section */}
      <Section>
        <SectionHeading
          center={true}
          eyebrow={t("archival_protocol_eyebrow")}
          title={t("archival_protocol_title")}
          intro={t("archival_protocol_intro")}
        />
        <div className="mt-10 sm:mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {protocolSteps.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.step}
                className="surface-card frame-gold p-6 sm:p-8 rounded-lg shadow-md bg-[var(--card)]/90 text-start flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[var(--gold)]">
                      {p.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/30">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[var(--foreground)] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-[var(--gold)]/20">
                  <span className="text-[0.68rem] font-bold text-[var(--gold)] uppercase tracking-wider">
                    {t("site_title")} Protocol
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
