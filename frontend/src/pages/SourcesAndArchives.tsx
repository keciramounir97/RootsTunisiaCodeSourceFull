import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Search,
  Landmark,
  X,
  FolderArchive,
  Building2,
  Ship,
  Shield,
  Crown,
  Scroll,
  Moon,
  Globe,
} from "lucide-react";
import { PageHero, Section } from "../components/site/Primitives";
import kairouan from "../assets/slider-kairouan.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";

export interface ExternalArchiveItem {
  id: string;
  name: string;
  category: "all" | "tunisia" | "france" | "italy" | "malta" | "uk" | "jewish" | "ottoman" | "maghreb";
  categoryLabel: string;
  badge: string;
  description: string;
  link: string;
  tags: string[];
}

export const ARCHIVES_DIRECTORY: ExternalArchiveItem[] = [
  // --- 1. TUNISIE (Archives Nationales, Dépôts & Communes) ---
  {
    id: "ant-tunisie",
    name: "Archives Nationales de Tunisie (ANT)",
    category: "tunisia",
    categoryLabel: "Tunisie",
    badge: "Archives d'État • Tunis",
    description:
      "Dépôt central de l'histoire tunisienne. Conserve les registres fiscaux de la Majba (recensements nominatifs 1860–1869), les décrets et ordonnances beylicales husseinites, les jugements des tribunaux séculiers de l'Ouzara et les fonds d'actes notariés ('udul).",
    link: "http://www.archives.nat.tn",
    tags: ["Majba 1860-1869", "Décrets Beylicaux", "Notariats 'Udul", "Tribunaux Ouzara"],
  },
  {
    id: "bnt-tunisie",
    name: "Bibliothèque Nationale de Tunisie (BNT)",
    category: "tunisia",
    categoryLabel: "Tunisie",
    badge: "Patrimoine Écrit & Manuscrits • Tunis",
    description:
      "Conservation du patrimoine imprimé et manuscrit. Abrite les journaux historiques de la Régence, les annuaires administratifs Didot-Bottin, les dictionnaires biographiques des lettrés et des grandes familles (Tarājim), et les archives de l'Université Zitouna.",
    link: "https://www.bnt.nat.tn",
    tags: ["Manuscrits Arabes", "Tarājim (Biographies)", "Presse Historique", "Zitouna"],
  },
  {
    id: "commune-tunis",
    name: "Archives Municipales de la Ville de Tunis (État Civil)",
    category: "tunisia",
    categoryLabel: "Tunisie",
    badge: "État Civil Municipal • Capitale",
    description:
      "Registres des actes de naissances, mariages et décès de la commune de Tunis depuis l'instauration de l'état civil moderne (1886). Permet également la recherche des concessions et permis d'inhumation des cimetières de la capitale.",
    link: "https://www.commune-tunis.gov.tn",
    tags: ["État Civil (1886-1956)", "Naissances", "Mariages", "Cimetières Municipaux"],
  },
  {
    id: "habous-tunisie",
    name: "Archives des Habous & Waqf de Tunisie",
    category: "tunisia",
    categoryLabel: "Tunisie",
    badge: "Fondations Pieuses • Tunis",
    description:
      "Fonds de la Jamâïyat el-Habous. Les actes de constitution de waqf familial (habous ahlī) mentionnent l'arbre généalogique exhaustif des fondateurs, ascendants et de l'ensemble des bénéficiaires et descendants sur plusieurs siècles.",
    link: "http://www.affaires-religieuses.tn",
    tags: ["Habous Familial", "Waqf Ahlī", "Généalogies Authentiques", "Successions"],
  },

  // --- 2. FRANCE (Protectorat, État Civil Consulaire, Militaires) ---
  {
    id: "cadn-nantes",
    name: "Centre des Archives Diplomatiques de Nantes (CADN)",
    category: "france",
    categoryLabel: "France",
    badge: "Archives Diplomatiques & Consulaires • Nantes",
    description:
      "Le fonds fondamental du Protectorat (1881–1956). Conserve la totalité de l'état civil consulaire des Européens de Tunisie, les décrets de naturalisation beylicale et française (1924–1927), les listes électorales, et les déclarations de tutelle et successions.",
    link: "https://www.diplomatie.gouv.fr/fr/archives-diplomatiques/",
    tags: ["État Civil Consulaire", "Naturalisations 1924-1927", "Successions", "Listes Électorales"],
  },
  {
    id: "anom-aix",
    name: "Archives Nationales d'Outre-Mer (ANOM)",
    category: "france",
    categoryLabel: "France",
    badge: "Fonds Coloniaux & Protectorat • Aix-en-Provence",
    description:
      "Registres matricules militaires des engagés et appelés en Tunisie, dossiers de carrière des fonctionnaires du Protectorat, concessions agricoles, correspondances ministérielles et rapports de sûreté publique en Afrique du Nord.",
    link: "http://www.archivesnationales.culture.gouv.fr/anom/fr/",
    tags: ["Registres Matricules", "Personnel Protectorat", "Colonisation", "Afrique du Nord"],
  },
  {
    id: "anf-pierrefitte",
    name: "Archives Nationales de France (Pierrefitte-sur-Seine)",
    category: "france",
    categoryLabel: "France",
    badge: "Archives Centrales • Pierrefitte / Paris",
    description:
      "Conservation des dossiers individuels de demandes de naturalisation présidentielle française déposées par les résidents de Tunisie (Français, Italiens, Maltais, Israélites et Tunisiens musulmans) avec arbres généalogiques et enquêtes préfectorales.",
    link: "https://www.archives-nationales.culture.gouv.fr",
    tags: ["Décrets de Naturalisation", "Ministère de la Justice", "Dossiers Individuels"],
  },
  {
    id: "shd-vincennes",
    name: "Service Historique de la Défense (SHD)",
    category: "france",
    categoryLabel: "France",
    badge: "Archives Militaires • Château de Vincennes & Caen",
    description:
      "Dossiers individuels de carrière, états de service, citations et pensions d'invalidité des soldats tunisiens ayant servi dans l'armée française (notamment le 4e Régiment de Tirailleurs Tunisiens et le 1er Régiment de Spahis) lors des deux guerres mondiales.",
    link: "https://www.defense.gouv.fr/memoire/service-historique-defense-shd",
    tags: ["4e Tirailleurs Tunisiens", "1er Spahis", "Guerre 1914-1918", "Guerre 1939-1945"],
  },
  {
    id: "gallica-bnf",
    name: "Gallica — Bibliothèque Nationale de France (BnF)",
    category: "france",
    categoryLabel: "France",
    badge: "Bibliothèque Numérique • BnF Paris",
    description:
      "Accès intégral numérisé au Journal Officiel Tunisien (1883–1956), aux annuaires Didot-Bottin d'Afrique du Nord et à la presse historique d'époque (La Dépêche Tunisienne, Le Petit Tunisien), indispensables pour retrouver adresses, professions et avis nécrologiques.",
    link: "https://gallica.bnf.fr",
    tags: ["Journal Officiel Tunisien", "Annuaires Commerciaux", "Presse Quotidienne"],
  },
  {
    id: "memoire-des-hommes",
    name: "Mémoire des Hommes (Ministère des Armées)",
    category: "france",
    categoryLabel: "France",
    badge: "Base Nominative des Combattants",
    description:
      "Base de données officielle permettant la recherche nominative des tirailleurs, spahis et personnels militaires originaires de Tunisie déclarés « Morts pour la France » durant la Première Guerre mondiale, la Seconde Guerre mondiale et la Guerre d'Indochine.",
    link: "https://www.memoiredeshommes.sga.defense.gouv.fr",
    tags: ["Morts pour la France", "Tirailleurs Tunisiens", "Sépultures Militaires"],
  },

  // --- 3. ITALIE & SICILE (Communauté Italienne de Tunisie) ---
  {
    id: "antenati-italie",
    name: "Portale Antenati (Archives d'État d'Italie)",
    category: "italy",
    categoryLabel: "Italie & Sicile",
    badge: "Portail National d'État Civil • Ministère de la Culture",
    description:
      "Portail officiel de la généalogie italienne donnant accès gratuitement à des millions d'actes d'état civil numérisés (Palerme, Trapani, Messine, Pantelleria) d'où sont issues les familles italiennes et siciliennes établies à Tunis, La Goulette, Bizerte et Sousse.",
    link: "https://antenati.cultura.gov.it",
    tags: ["État Civil Italien", "Sicile", "Pantelleria", "Familles de La Goulette"],
  },
  {
    id: "asdmae-rome",
    name: "Archivio Storico Diplomatico (MAECI - Rome)",
    category: "italy",
    categoryLabel: "Italie & Sicile",
    badge: "Affaires Étrangères • Rome",
    description:
      "Archives du Ministère des Affaires Étrangères italien. Conserve les registres d'immatriculation consulaire, les demandes de passeports et les actes d'état civil des sujets italiens établis dans la Régence (Consulat Général de Tunis, La Goulette, Sfax, Monastir).",
    link: "https://www.esteri.it/it/ministero/archivio-storico/",
    tags: ["Consulat Italien Tunis", "La Goulette", "Immatriculations Consulaires", "Passeports"],
  },
  {
    id: "archivio-palermo",
    name: "Archivio di Stato di Palermo (Sicile)",
    category: "italy",
    categoryLabel: "Italie & Sicile",
    badge: "Archives Provinciales • Palerme, Sicile",
    description:
      "Registres d'embarquement portuaires vers La Goulette et Tunis, délivrance de passeports pour l'Afrique du Nord, et listes de conscription militaire (Liste di leva) des familles siciliennes ayant émigré en Tunisie entre 1860 et 1940.",
    link: "https://archiviodistatopalermo.it",
    tags: ["Émigration Sicilienne", "Listes d'embarquement", "Conscription Leva", "Palerme"],
  },
  {
    id: "archivio-trapani",
    name: "Archivio di Stato di Trapani (Sicile)",
    category: "italy",
    categoryLabel: "Italie & Sicile",
    badge: "Archives Maritimes & Notariales • Trapani",
    description:
      "Fonds d'archives des pêcheurs de corail, marins et négociants de Trapani et de l'île de Pantelleria qui ont fondé les communautés italiennes historiques de La Goulette, Tabarka et de la péninsule du Cap Bon.",
    link: "https://archiviodistatotrapani.cultura.gov.it",
    tags: ["Trapani", "Pantelleria", "Pêcheurs de Corail", "Tabarka"],
  },

  // --- 4. MALTE (Communauté Maltaise de Tunisie) ---
  {
    id: "national-archives-malta",
    name: "National Archives of Malta (Arkivji Nazzjonali ta' Malta)",
    category: "malta",
    categoryLabel: "Malte",
    badge: "Archives Nationales • Rabat & Mdina",
    description:
      "Registres officiels de demandes de passeports pour Tunis, dépositions judiciaires et certificats de sujets britanniques délivrés aux citoyens maltais vivant à Tunis, Sousse, Mahdia et Djerba de 1840 à 1940.",
    link: "https://nationalarchives.gov.mt",
    tags: ["Passeports pour Tunis (1840-1940)", "Sujets Britanniques", "Émigration Maltaise"],
  },
  {
    id: "malta-family-history",
    name: "Malta Family History & Parish Registers Archive",
    category: "malta",
    categoryLabel: "Malte",
    badge: "Registres Paroissiaux • Malte & Tunisie",
    description:
      "Collection Adami et registres paroissiaux numérisés : actes de baptême, mariage et sépulture des familles maltaises enregistrés dans les paroisses catholiques de Malte et de Tunisie (Sainte-Croix de Tunis, Saint-Félix de Sousse).",
    link: "https://maltafamilyhistory.com",
    tags: ["Actes Paroissiaux", "Baptêmes & Mariages", "Sainte-Croix de Tunis"],
  },

  // --- 5. ROYAUME-UNI & COMMONWEALTH ---
  {
    id: "tna-kew-uk",
    name: "The National Archives (TNA - Kew, Royaume-Uni)",
    category: "uk",
    categoryLabel: "Grande-Bretagne",
    badge: "Archives Gouvernementales • Kew, Londres",
    description:
      "Séries diplomatiques du Foreign Office (FO 102, FO 335, FO 84) relatives au Consulat Général de Sa Majesté à Tunis, incluant l'enregistrement des sujets britanniques, des marchands maltais et des résidents protégés sous juridiction beylicale.",
    link: "https://www.nationalarchives.gov.uk",
    tags: ["Foreign Office FO 102 / FO 335", "Consulat Général Tunis", "Protégés Britanniques"],
  },
  {
    id: "cwgc-tunisie",
    name: "Commonwealth War Graves Commission (CWGC)",
    category: "uk",
    categoryLabel: "Grande-Bretagne",
    badge: "Sépultures Militaires Alliées",
    description:
      "Registres commémoratifs et localisation des sépultures des soldats britanniques, canadiens, australiens, néo-zélandais et alliés tombés lors de la Campagne de Tunisie (1942–1943) et inhumés dans les cimetières militaires de Medjez-el-Bab et Enfidaville.",
    link: "https://www.cwgc.org",
    tags: ["Campagne de Tunisie 1943", "Medjez-el-Bab", "Enfidaville", "Cimetières Militaires"],
  },

  // --- 6. ARCHIVES JUIVES & ISRAÉLITES DE TUNISIE ---
  {
    id: "cgj-paris",
    name: "Cercle de Généalogie Juive (CGJ - Paris)",
    category: "jewish",
    categoryLabel: "Fonds Juifs & Israélites",
    badge: "Généalogie Juive Nord-Africaine • Paris",
    description:
      "Association de référence pour la généalogie juive de Tunisie. Dépouillements complets des registres d'état civil israélite, relevés des sépultures des cimetières du Borgel et de Bab El Khadra à Tunis, et contrats de mariage rabbiniques (kétouboth).",
    link: "https://www.genealoj.org",
    tags: ["État Civil Israélite", "Cimetière du Borgel", "Kétouboth", "Granas & Twansa"],
  },
  {
    id: "cahjp-jerusalem",
    name: "Central Archives for the History of the Jewish People (CAHJP)",
    category: "jewish",
    categoryLabel: "Fonds Juifs & Israélites",
    badge: "Archives Historiques Communautaires • Jérusalem",
    description:
      "Plus vaste centre d'archives historiques du judaïsme tunisien. Conserve les registres des tribunaux rabbiniques de Tunis, les registres de Mohel (circoncisions de 1845 à 1950), et les documents d'archives des communautés Granas (Livournais) et Twansa.",
    link: "https://cahjp.nli.org.il",
    tags: ["Tribunal Rabbinique Tunis", "Livres de Mohel (1845-1950)", "Granas (Livournais)", "Twansa"],
  },
  {
    id: "aiu-paris",
    name: "Alliance Israélite Universelle (AIU - Paris)",
    category: "jewish",
    categoryLabel: "Fonds Juifs & Israélites",
    badge: "Archives Scolaires & Communautaires • Paris",
    description:
      "Registres d'inscription scolaire nominatifs des écoles de l'AIU fondées à Tunis (dès 1878), Sousse, Sfax, Nabeul, Bizerte et Djerba, incluant filiations complètes, professions des parents et dates de naissance des élèves.",
    link: "https://www.aiu.org/fr/bibliotheque",
    tags: ["Écoles AIU Tunis", "Registres Scolaires", "Djerba", "Sousse", "Sfax"],
  },
  {
    id: "shjt-paris",
    name: "Société d'Histoire des Juifs de Tunisie (SHJT)",
    category: "jewish",
    categoryLabel: "Fonds Juifs & Israélites",
    badge: "Société Savante & Recherche • Paris",
    description:
      "Études monographiques, dépouillements généalogiques et fonds documentaires sur l'histoire des patronymes juifs tunisiens (origines ibériques, toscanes ou autochtones) et leurs trajectoires migratoires en Méditerranée.",
    link: "https://shjt.fr",
    tags: ["Patronymes Juifs Tunisiens", "Histoire Communautaire", "Monographies Familiales"],
  },

  // --- 7. ARCHIVES OTTOMANES & ISLAMIQUES ---
  {
    id: "osmanli-arsivi-istanbul",
    name: "Devlet Arşivleri — Osmanlı Arşivi (Archives d'État Ottomanes)",
    category: "ottoman",
    categoryLabel: "Fonds Ottomans & Islamiques",
    badge: "Archives Impériales Ottomanes • Istanbul",
    description:
      "Fonds impérial ottoman (Mühimme Defterleri). Conserve les firmans sultaniques concernant la Régence de Tunis (Pachalik puis Beylicat husseinite), les nominations des Pachas et Deys, et les correspondances de chancellerie entre Istanbul et le Bardo.",
    link: "https://www.devletarsivleri.gov.tr",
    tags: ["Firmans Impériaux", "Pachalik de Tunis", "Divan-ı Hümayun", "Dynastie Husseinite"],
  },
  {
    id: "ircica-istanbul",
    name: "IRCICA — Research Centre for Islamic History and Art",
    category: "ottoman",
    categoryLabel: "Fonds Ottomans & Islamiques",
    badge: "Documentation Islamique • Istanbul",
    description:
      "Institution de l'OCI conservant d'importantes collections photographiques d'époque beylicale sur Tunis, des répertoires de manuscrits islamiques, de chartes waqf et d'études sur l'art, les corporations et les notariats arabo-musulmans.",
    link: "https://www.ircica.org",
    tags: ["Photothèque Beylicale", "Manuscrits Islamiques", "Corporations & Notariats"],
  },
  {
    id: "zitouna-manuscrits",
    name: "Fonds des Manuscrits de la Mosquée Zitouna (Département BNT)",
    category: "ottoman",
    categoryLabel: "Fonds Ottomans & Islamiques",
    badge: "Grande Mosquée Zitouna • Tunis",
    description:
      "Registres d'enseignants et d'étudiants de l'Université Zitouna, diplômes et licences d'enseignement religieux (ijāzāt), biographies de lettrés (tarājim), chorfas et cadis malékites et hanafites de Tunisie, conservés au Département des Manuscrits de la BNT.",
    link: "https://www.bnt.nat.tn",
    tags: ["Diplômes Ijaza", "Cadis Hanafites & Malékites", "Chorfas", "Lettrés Zitouniens"],
  },

  // --- 8. ALGÉRIE & MAGHREB (Liens Transfrontaliers) ---
  {
    id: "cna-alger",
    name: "Centre National des Archives d'Algérie (CNA)",
    category: "maghreb",
    categoryLabel: "Algérie & Maghreb",
    badge: "Archives Nationales • Alger",
    description:
      "Fonds documentaires sur les régions frontalières tuniso-algériennes (Khmir, Mogod, Medjerda, Nemencha), traités frontaliers et déplacements séculaires de populations et tribus nomades entre la Tunisie et l'Algérie.",
    link: "https://www.archives-nationales.dz",
    tags: ["Tribus Frontalières", "Khmir & Nemencha", "Constantinois", "Frontière Tuniso-Algérienne"],
  },
  {
    id: "archives-maroc-rabat",
    name: "Archives du Maroc (Rabat)",
    category: "maghreb",
    categoryLabel: "Algérie & Maghreb",
    badge: "Archives Nationales • Rabat",
    description:
      "Documents d'archives relatifs aux familles andalouses ayant transité par Fès et Tétouan avant de s'établir à Testour, Soliman et Tunis, ainsi que les registres des grandes confréries soufies communes (Tidjaniya, Shadhiliya).",
    link: "https://www.archivesdumaroc.ma",
    tags: ["Familles Andalouses", "Testour & Soliman", "Confréries Soufies", "Chérifiens"],
  },
  {
    id: "anom-irel-maghreb",
    name: "ANOM — Base IREL des Registres d'Afrique du Nord (Algérie / Tunisie)",
    category: "maghreb",
    categoryLabel: "Algérie & Maghreb",
    badge: "Base Nominative IREL • En Ligne",
    description:
      "Recherche nominative en ligne dans les registres d'état civil et paroissiaux des localités limitrophes (Bône/Annaba, Constantine, Souk Ahras, Tébessa) où résidaient de nombreuses familles d'origine ou d'alliance tunisienne.",
    link: "http://anom.archivesnationales.culture.gouv.fr/caomec2/",
    tags: ["Base IREL", "Constantine", "Bône / Annaba", "Frontière & Échanges"],
  },
];

export default function SourcesAndArchives() {
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const heroEyebrow =
    getText("sources", "hero", "eyebrow") ??
    t("sources_and_archives_nav", "RÉPERTOIRE DES INSTITUTIONS & DÉPÔTS");
  const heroTitle =
    getText("sources", "hero", "title") ??
    t("tunisian_sources_repositories", "Sources & Archives pour la Tunisie");
  const heroSubtitle =
    getText("sources", "hero", "subtitle") ??
    t(
      "tunisian_sources_repositories_desc",
      "Portails officiels, bases nominatives et dépôts d'archives nationaux et internationaux indispensables pour retracer une lignée en Tunisie."
    );
  const heroImg =
    getImage("sources", "hero", "image") ??
    getImage("research", "hero", "image") ??
    kairouan;

  const categories = useMemo(() => [
    { key: "all", label: t("tab_all_funds", "Tous les fonds"), count: ARCHIVES_DIRECTORY.length, Icon: FolderArchive },
    { key: "tunisia", label: "Tunisie", count: ARCHIVES_DIRECTORY.filter((a) => a.category === "tunisia").length, Icon: Landmark },
    { key: "france", label: "France", count: ARCHIVES_DIRECTORY.filter((a) => a.category === "france").length, Icon: Building2 },
    { key: "italy", label: "Italie & Sicile", count: ARCHIVES_DIRECTORY.filter((a) => a.category === "italy").length, Icon: Ship },
    { key: "malta", label: "Malte", count: ARCHIVES_DIRECTORY.filter((a) => a.category === "malta").length, Icon: Shield },
    { key: "uk", label: "Royaume-Uni", count: ARCHIVES_DIRECTORY.filter((a) => a.category === "uk").length, Icon: Crown },
    { key: "jewish", label: "Fonds Juifs", count: ARCHIVES_DIRECTORY.filter((a) => a.category === "jewish").length, Icon: Scroll },
    { key: "ottoman", label: "Ottoman & Islamique", count: ARCHIVES_DIRECTORY.filter((a) => a.category === "ottoman").length, Icon: Moon },
    { key: "maghreb", label: "Algérie & Maghreb", count: ARCHIVES_DIRECTORY.filter((a) => a.category === "maghreb").length, Icon: Globe },
  ], [t]);

  const query = searchQuery.trim().toLowerCase();

  const filteredArchives = useMemo(() => {
    return ARCHIVES_DIRECTORY.filter((item) => {
      const matchCategory = activeCategory === "all" || item.category === activeCategory;
      if (!matchCategory) return false;

      if (!query) return true;

      const searchableText = `${item.name} ${item.badge} ${item.categoryLabel} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
      return searchableText.includes(query);
    });
  }, [activeCategory, query]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_sources_title", "Sources et Archives de Tunisie — Répertoire Officiel")}
        description={t(
          "seo_sources_desc",
          "Consultez les dépôts et portails d'archives officiels pour la généalogie tunisienne : Archives Nationales de Tunisie, CADN Nantes, ANOM, Italie, Malte, Grande-Bretagne, fonds ottomans et juifs."
        )}
        keywords={[
          "Archives Nationales de Tunisie",
          "CADN Nantes Tunisie",
          "ANOM Tunisie",
          "Archives généalogiques Tunis",
          "Généalogie italienne Tunisie",
          "Archives maltaises Tunis",
          "Osmanlı Arşivi Tunus",
          "Cercle Généalogie Juive Tunisie",
        ]}
      />

      {/* Hero Header */}
      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImg}
      >
        <Link to="/gallery/trees" className="btn-base btn-gold w-full sm:w-auto min-w-[200px]">
          {t("explore_family_trees", "Consulter les Arbres Familles")}
        </Link>
      </PageHero>

      {/* Fused Directory Search & Category Filter Console */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="surface-card rounded-2xl border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-lg backdrop-blur-sm overflow-hidden">
            {/* Top Bar: Search Input & Live Results Counter */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
              <div className="relative flex-1">
                <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gold)] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t(
                    "search_archives_placeholder",
                    "Rechercher par nom d'archive, pays ou mot-clé (ex: cadis, naturalisation, sicile, tirailleurs, habous)..."
                  )}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] ps-10 pe-9 py-2.5 text-xs sm:text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer p-1"
                    title={t("clear_search", "Effacer")}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Results count badge */}
              <div className="shrink-0 flex items-center justify-end sm:justify-start gap-2 text-xs font-mono text-[var(--muted-foreground)]">
                <span>Résultats :</span>
                <strong className="text-[var(--gold)] font-bold px-3 py-1.5 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/30">
                  {filteredArchives.length} archive{filteredArchives.length > 1 ? "s" : ""}
                </strong>
              </div>
            </div>

            {/* Seamless Inner Divider */}
            <div className="border-t border-[var(--gold)]/20" />

            {/* Bottom Bar: Fused Category Filter Pills with Vector Icons (No Emojis) */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-[var(--gold)]/[0.03] flex items-center gap-2 overflow-x-auto scrollbar-thin">
              {categories.map((cat) => {
                const IconComponent = cat.Icon;
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 border ${
                      isActive
                        ? "bg-[var(--gold)] text-[#1f160f] font-bold border-[var(--gold)] shadow-sm"
                        : "bg-[var(--card)] text-[var(--foreground)]/80 hover:bg-[var(--gold)]/15 border-[var(--border)] hover:border-[var(--gold)]/40"
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#1f160f]" : "text-[var(--gold)]"}`} />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-black/20 text-black font-extrabold"
                          : "bg-[var(--background)] text-[var(--muted-foreground)] border border-[var(--border)]"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Archives Cards Grid */}
      <Section className="!pt-6">
        {filteredArchives.length === 0 ? (
          <div className="surface-card frame-gold p-12 text-center rounded-xl space-y-4 max-w-xl mx-auto my-8">
            <Landmark className="w-12 h-12 text-[var(--gold)] mx-auto opacity-70" />
            <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">
              {t("no_records_found", "Aucune archive trouvée")}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Aucun résultat ne correspond à votre recherche « {searchQuery} ». Essayez avec un autre mot-clé ou réinitialisez les filtres.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="btn-base btn-gold text-xs py-2 px-5"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {filteredArchives.map((archive) => (
              <article
                key={archive.id}
                className="surface-card frame-gold group flex h-full flex-col justify-between p-6 sm:p-7 rounded-xl shadow-md bg-[var(--card)]/95 backdrop-blur-sm text-start transition-all hover:border-[var(--gold)] hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Category & Badge Header */}
                  <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 font-bold">
                      {archive.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                      {archive.categoryLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors leading-snug">
                    {archive.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {archive.description}
                  </p>

                  {/* Document Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {archive.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--background)] text-[var(--foreground)]/80 border border-[var(--border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External Action Button */}
                <div className="mt-6 pt-4 border-t border-[var(--gold)]/15 flex items-center justify-between gap-3">
                  <a
                    href={archive.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] transition-transform w-full font-bold cursor-pointer"
                  >
                    <span>Visiter l'Archive</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <SiteCustomBlocks pageId="sources" fallbackPageId="research" />
    </div>
  );
}
