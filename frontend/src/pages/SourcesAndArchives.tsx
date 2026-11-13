import { useState, useMemo, useEffect } from "react";
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
  Archive,
  SearchX,
  RotateCcw,
  Compass,
  AlertCircle,
} from "lucide-react";
import { PageHero, Section } from "../components/site/Primitives";
import kairouan from "../assets/slider-kairouan.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";
import { api } from "../api/client";
import { SourceCard } from "../components/SourceCard";
import {
  DEFAULT_SOURCES_HERO_BY_LOCALE,
  loadSourcesMultiLocaleStore,
  resolveLocalizedLocation,
  resolveLocalizedSourceCard,
} from "../utils/sourcesCmsConfig";

export interface ExternalArchiveItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  badge: string;
  description: string;
  link: string;
  tags: string[];
  translations?: Record<string, { title?: string; description?: string }>;
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
    link: "https://archives-nationales-outre-mer.culture.gouv.fr/",
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
    link: "https://www.servicehistorique.sga.defense.gouv.fr/",
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
    link: "https://asd.esteri.it/",
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
    link: "https://saassipa.cultura.gov.it/",
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
    name: "Geneanum — Archives & Généalogie Maltaise (Collection Adami)",
    category: "malta",
    categoryLabel: "Malte",
    badge: "Registres Paroissiaux • Malte & Tunisie",
    description:
      "Collection Adami et registres paroissiaux numérisés : actes de baptême, mariage et sépulture des familles maltaises enregistrés dans les paroisses catholiques de Malte et de Tunisie (Sainte-Croix de Tunis, Saint-Félix de Sousse).",
    link: "https://geneanum.com",
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
    link: "https://www.aiu.org/",
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
    link: "https://archives-nationales-outre-mer.culture.gouv.fr/web/guest/etat-civil",
    tags: ["Base IREL", "Constantine", "Bône / Annaba", "Frontière & Échanges"],
  },
];

const LOCATION_ICONS: Record<string, any> = {
  Landmark,
  Building2,
  Ship,
  Shield,
  Crown,
  Scroll,
  Moon,
  Globe,
  Archive,
  FolderArchive,
};

export default function SourcesAndArchives() {
  const { t, locale, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dbCards, setDbCards] = useState<ExternalArchiveItem[]>([]);
  const [dbLocations, setDbLocations] = useState<Array<{ key: string; label: string; icon?: string }>>([]);
  const [sourcesStore, setSourcesStore] = useState(() => loadSourcesMultiLocaleStore());

  useEffect(() => {
    const onStoreUpdate = () => setSourcesStore(loadSourcesMultiLocaleStore());
    window.addEventListener("roots_sources_cms_updated", onStoreUpdate);
    return () => window.removeEventListener("roots_sources_cms_updated", onStoreUpdate);
  }, []);

  useEffect(() => {
    let active = true;
    const fetchPublicCards = async () => {
      try {
        const [cardsRes, locsRes] = await Promise.allSettled([
          api.get("/public-cards"),
          api.get("/public-cards/locations"),
        ]);
        if (!active) return;
        if (locsRes.status === "fulfilled" && Array.isArray(locsRes.value.data?.data || locsRes.value.data)) {
          const locs = locsRes.value.data?.data || locsRes.value.data;
          if (locs.length > 0) {
            setDbLocations(locs);
          }
        }
        if (cardsRes.status === "fulfilled" && Array.isArray(cardsRes.value.data?.data || cardsRes.value.data)) {
          const raw = cardsRes.value.data?.data || cardsRes.value.data;
          if (raw.length > 0) {
            const mapped: ExternalArchiveItem[] = raw.map((c: any) => ({
              id: String(c.id),
              name: c.title,
              category: c.category || "tunisia",
              categoryLabel: c.category || "Tunisie",
              badge: c.badge || "Portail d'Archives",
              description: c.description || "",
              link: c.link,
              tags: Array.isArray(c.tags)
                ? c.tags
                : (typeof c.tags === "string" ? c.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : []),
              translations: c.translations || {},
            }));
            setDbCards(mapped);
          }
        }
      } catch {
        // Fallback to static ARCHIVES_DIRECTORY
      }
    };
    fetchPublicCards();
    return () => {
      active = false;
    };
  }, []);

  const cleanLocale = (locale || "fr").toLowerCase();
  const localeHeroOverride = sourcesStore.heroByLocale?.[cleanLocale];
  const localeHeroDefault = DEFAULT_SOURCES_HERO_BY_LOCALE[cleanLocale] || DEFAULT_SOURCES_HERO_BY_LOCALE.fr;

  const SOURCES_UI_BY_LOCALE: Record<
    string,
    {
      seoTitle: string;
      seoDesc: string;
      exploreTreesCta: string;
      allFunds: string;
      searchPlaceholder: string;
      clearSearch: string;
      resultsLabel: string;
      archiveSingular: string;
      archivePlural: string;
      noResultsBadge: string;
      noResultsTitle: string;
      noResultsForQuery: (q: string) => string;
      noResultsInCategory: string;
      noResultsHint: string;
      resetFilters: string;
      openMapCta: string;
    }
  > = {
    fr: {
      seoTitle: "Sources et Archives de Tunisie — Répertoire Officiel",
      seoDesc:
        "Consultez les dépôts et portails d'archives officiels pour la généalogie tunisienne : Archives Nationales de Tunisie, CADN Nantes, ANOM, Italie, Malte, Grande-Bretagne, fonds ottomans et juifs.",
      exploreTreesCta: "Consulter les Arbres Familles",
      allFunds: "Tous les fonds",
      searchPlaceholder:
        "Rechercher par nom d'archive, pays ou mot-clé (ex: cadis, naturalisation, sicile, tirailleurs, habous)...",
      clearSearch: "Effacer",
      resultsLabel: "Résultats :",
      archiveSingular: "archive",
      archivePlural: "archives",
      noResultsBadge: "Recherche Infructueuse",
      noResultsTitle: "Aucune archive trouvée",
      noResultsForQuery: (q) => `Aucun fonds documentaire ne correspond au terme « ${q} » dans cette catégorie.`,
      noResultsInCategory: "Aucune pièce d'archive n'est répertoriée dans cette sélection.",
      noResultsHint: "Vous pouvez réinitialiser vos filtres ou élargir vos termes de recherche.",
      resetFilters: "Réinitialiser les filtres",
      openMapCta: "Consulter la Carte Interactive",
    },
    en: {
      seoTitle: "Tunisian Sources & Archives — Official Directory",
      seoDesc:
        "Browse official archival repositories and portals for Tunisian genealogy: National Archives of Tunisia, CADN Nantes, ANOM, Italy, Malta, UK, Ottoman and Jewish collections.",
      exploreTreesCta: "Explore Family Trees",
      allFunds: "All Holdings",
      searchPlaceholder:
        "Search by archive name, country or keyword (e.g., qadis, naturalization, Sicily, tirailleurs, habous)...",
      clearSearch: "Clear",
      resultsLabel: "Results:",
      archiveSingular: "archive",
      archivePlural: "archives",
      noResultsBadge: "No Matches Found",
      noResultsTitle: "No archives found",
      noResultsForQuery: (q) => `No archival holdings match the term "${q}" in this category.`,
      noResultsInCategory: "No archival records are listed in this selection.",
      noResultsHint: "You can reset your filters or broaden your search terms.",
      resetFilters: "Reset Filters",
      openMapCta: "Explore Interactive Map",
    },
    ar: {
      seoTitle: "المصادر والأرشيفات التونسية — الدليل الرسمي",
      seoDesc:
        "تصفّح دور الأرشيف والبوابات الوثائقية الرسمية للأنساب التونسية: الأرشيف الوطني التونسي، نانت، إيكس أون بروفانس، إيطاليا، مالطا، بريطانيا، والأرصدة العثمانية واليهودية.",
      exploreTreesCta: "تصفّح شجرات العائلات",
      allFunds: "جميع الأرصدة",
      searchPlaceholder:
        "ابحث باسم الأرشيف أو البلد أو الكلمة المفتاحية (مثل: القضاة، التجنيس، صقلية، الأحباس، الدفاتر)...",
      clearSearch: "مسح",
      resultsLabel: "النتائج :",
      archiveSingular: "أرشيف",
      archivePlural: "أرشيفات",
      noResultsBadge: "بحث دون نتائج",
      noResultsTitle: "لم يتم العثور على أي أرشيف",
      noResultsForQuery: (q) => `لا يوجد أي رصيد وثائقي يطابق عبارة « ${q} » في هذه الفئة.`,
      noResultsInCategory: "لا توجد أي وثيقة أرشيفية مسجلة في هذا التصنيف.",
      noResultsHint: "يمكنك إعادة ضبط الفلاتر أو توسيع كلمات البحث.",
      resetFilters: "إعادة ضبط الفلاتر",
      openMapCta: "تصفّح الخريطة التفاعلية",
    },
    es: {
      seoTitle: "Fuentes y Archivos de Túnez — Directorio Oficial",
      seoDesc:
        "Consulte los depósitos y portales de archivos oficiales para la genealogía tunecina: Archivos Nacionales de Túnez, CADN Nantes, ANOM, Italia, Malta, Reino Unido, fondos otomanos y judíos.",
      exploreTreesCta: "Consultar Árboles Familiares",
      allFunds: "Todos los fondos",
      searchPlaceholder:
        "Buscar por nombre de archivo, país o palabra clave (ej: cadíes, naturalización, Sicilia, tiradores, habices)...",
      clearSearch: "Borrar",
      resultsLabel: "Resultados:",
      archiveSingular: "archivo",
      archivePlural: "archivos",
      noResultsBadge: "Búsqueda sin resultados",
      noResultsTitle: "No se encontraron archivos",
      noResultsForQuery: (q) => `Ningún fondo documental coincide con el término « ${q} » en esta categoría.`,
      noResultsInCategory: "No hay piezas de archivo registradas en esta selección.",
      noResultsHint: "Puede restablecer sus filtros o ampliar sus términos de búsqueda.",
      resetFilters: "Restablecer filtros",
      openMapCta: "Consultar el Mapa Interactivo",
    },
    it: {
      seoTitle: "Fonti e Archivi della Tunisia — Repertorio Ufficiale",
      seoDesc:
        "Consulta i depositi e i portali d'archivio ufficiali per la genealogia tunisina: Archivi Nazionali della Tunisia, CADN Nantes, ANOM, Italia, Malta, Regno Unito, fondi ottomani ed ebraici.",
      exploreTreesCta: "Esplora gli Alberi Genealogici",
      allFunds: "Tutti i fondi",
      searchPlaceholder:
        "Cerca per nome d'archivio, paese o parola chiave (es: cadì, naturalizzazione, Sicilia, tirailleurs, habous)...",
      clearSearch: "Cancella",
      resultsLabel: "Risultati:",
      archiveSingular: "archivio",
      archivePlural: "archivi",
      noResultsBadge: "Ricerca senza risultati",
      noResultsTitle: "Nessun archivio trovato",
      noResultsForQuery: (q) => `Nessun fondo documentario corrisponde al termine « ${q} » in questa categoria.`,
      noResultsInCategory: "Nessun documento d'archivio è elencato in questa selezione.",
      noResultsHint: "Puoi reimpostare i filtri o ampliare i termini di ricerca.",
      resetFilters: "Reimposta filtri",
      openMapCta: "Consulta la Mappa Interattiva",
    },
    mt: {
      seoTitle: "Sorsi u Arkivji tat-Tuneżija — Direttorju Uffiċjali",
      seoDesc:
        "Ikkonsulta d-depożiti u l-portali uffiċjali tal-arkivji għall-ġenealoġija Tuneżina: l-Arkivji Nazzjonali tat-Tuneżija, CADN Nantes, ANOM, l-Italja, Malta, ir-Renju Unit, u fondi Ottomani u Lhud.",
      exploreTreesCta: "Esplora s-Siġar tal-Familja",
      allFunds: "Il-fondi kollha",
      searchPlaceholder:
        "Fittex skont l-isem tal-arkivju, pajjiż jew kelma ewlenija (eż: qadis, naturalizzazzjoni, Sqallija, habous)...",
      clearSearch: "Ħassar",
      resultsLabel: "Riżultati:",
      archiveSingular: "arkivju",
      archivePlural: "arkivji",
      noResultsBadge: "Tfittxija bla riżultat",
      noResultsTitle: "Ma nstab l-ebda arkivju",
      noResultsForQuery: (q) => `L-ebda fond dokumentarju ma jaqbel mat-terminu « ${q} » f'din il-kategorija.`,
      noResultsInCategory: "L-ebda dokument tal-arkivju mhu elenkat f'din l-għażla.",
      noResultsHint: "Tista' tirrisettja l-filtri tiegħek jew twessa' t-termini tat-tfittxija.",
      resetFilters: "Irrisettja l-filtri",
      openMapCta: "Ikkonsulta l-Mappa Interattiva",
    },
  };

  const ui = SOURCES_UI_BY_LOCALE[cleanLocale] || SOURCES_UI_BY_LOCALE.fr;

  const heroEyebrow =
    localeHeroOverride?.eyebrow ||
    (cleanLocale === "fr" ? getText("sources", "hero", "eyebrow") : "") ||
    localeHeroDefault.eyebrow;
  const heroTitle =
    localeHeroOverride?.title ||
    (cleanLocale === "fr" ? getText("sources", "hero", "title") : "") ||
    localeHeroDefault.title;
  const heroSubtitle =
    localeHeroOverride?.subtitle ||
    (cleanLocale === "fr" ? getText("sources", "hero", "subtitle") : "") ||
    localeHeroDefault.subtitle;
  const heroImg =
    localeHeroOverride?.image ||
    getImage("sources", "hero", "image") ||
    getImage("research", "hero", "image") ||
    kairouan;

  const baseLocations = useMemo(() => {
    const rawLocs =
      dbLocations.length > 0
        ? dbLocations
        : [
            { key: "tunisia", label: "Tunisie", icon: "Landmark" },
            { key: "france", label: "France", icon: "Building2" },
            { key: "italy", label: "Italie & Sicile", icon: "Ship" },
            { key: "malta", label: "Malte", icon: "Shield" },
            { key: "uk", label: "Royaume-Uni", icon: "Crown" },
            { key: "jewish", label: "Fonds Juifs", icon: "Scroll" },
            { key: "ottoman", label: "Ottoman & Islamique", icon: "Moon" },
            { key: "maghreb", label: "Algérie & Maghreb", icon: "Globe" },
          ];
    return rawLocs.map((loc) => resolveLocalizedLocation(loc, cleanLocale, sourcesStore));
  }, [dbLocations, cleanLocale, sourcesStore]);

  const locationMap = useMemo(() => {
    return Object.fromEntries(baseLocations.map((l) => [l.key, l.label]));
  }, [baseLocations]);

  const allArchives = useMemo(() => {
    const rawList = dbCards.length > 0 ? dbCards : ARCHIVES_DIRECTORY;
    return rawList.map((item) => {
      const localized = resolveLocalizedSourceCard(item, cleanLocale, sourcesStore);
      return {
        ...localized,
        categoryLabel: locationMap[localized.category] || localized.categoryLabel || localized.category,
      };
    });
  }, [dbCards, locationMap, cleanLocale, sourcesStore]);

  const categories = useMemo(() => {
    return [
      {
        key: "all",
        label: ui.allFunds,
        count: allArchives.length,
        Icon: FolderArchive,
      },
      ...baseLocations.map((loc) => ({
        key: loc.key,
        label: loc.label,
        count: allArchives.filter((a) => a.category === loc.key).length,
        Icon: (loc.icon && LOCATION_ICONS[loc.icon]) || FolderArchive,
      })),
    ];
  }, [baseLocations, allArchives, ui.allFunds]);

  const query = searchQuery.trim().toLowerCase();

  const filteredArchives = useMemo(() => {
    return allArchives.filter((item) => {
      const matchCategory = activeCategory === "all" || item.category === activeCategory;
      if (!matchCategory) return false;

      if (!query) return true;

      const searchableText = `${item.name} ${item.badge} ${item.categoryLabel} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
      return searchableText.includes(query);
    });
  }, [allArchives, activeCategory, query]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={ui.seoTitle}
        description={ui.seoDesc}
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
          {ui.exploreTreesCta}
        </Link>
      </PageHero>

      {/* Fused Directory Search & Category Filter Console */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="surface-card rounded-2xl border border-stone-200 dark:border-[var(--gold)]/35 bg-white dark:bg-[var(--card)]/95 shadow-lg shadow-amber-950/5 dark:shadow-black/30 backdrop-blur-sm overflow-hidden">
            {/* Top Bar: Search Input & Live Results Counter */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 bg-white dark:bg-transparent">
              <div className="relative flex-1">
                <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700 dark:text-[var(--gold)] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={ui.searchPlaceholder}
                  className="w-full rounded-xl border border-stone-300 dark:border-[var(--border)] bg-stone-50/90 dark:bg-[var(--background)] ps-10 pe-9 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-[var(--foreground)] placeholder:text-stone-400 dark:placeholder:text-[var(--muted-foreground)] outline-none transition focus:border-amber-600 dark:focus:border-[var(--gold)] focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-[var(--gold)]/30 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:text-[var(--muted-foreground)] dark:hover:text-[var(--foreground)] cursor-pointer p-1"
                    title={ui.clearSearch}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Results count badge */}
              <div className="shrink-0 flex items-center justify-end sm:justify-start gap-2 text-xs font-mono text-stone-600 dark:text-[var(--muted-foreground)]">
                <span>{ui.resultsLabel}</span>
                <strong className="text-amber-900 dark:text-[var(--gold)] font-bold px-3 py-1.5 rounded-lg bg-amber-500/10 dark:bg-[var(--gold)]/10 border border-amber-600/30 dark:border-[var(--gold)]/30">
                  {filteredArchives.length} {filteredArchives.length > 1 ? ui.archivePlural : ui.archiveSingular}
                </strong>
              </div>
            </div>

            {/* Seamless Inner Divider */}
            <div className="border-t border-stone-200 dark:border-[var(--gold)]/20" />

            {/* Bottom Bar: Fused Category Filter Pills with Vector Icons (Dark and White mode perfected) */}
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-stone-100/90 dark:bg-black/30 border-t border-stone-200/80 dark:border-[var(--gold)]/20 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              {categories.map((cat) => {
                const IconComponent = cat.Icon;
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`group px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer inline-flex items-center gap-2 shrink-0 border ${
                      isActive
                        ? "bg-[#925503] text-white border-[#7d4801] dark:bg-[var(--gold)] dark:text-[#18110b] dark:border-[var(--gold)] shadow-md shadow-amber-900/15 font-bold scale-[1.02]"
                        : "bg-white text-stone-700 border-stone-300/90 hover:border-amber-600/50 hover:bg-amber-50/80 hover:text-amber-900 dark:bg-[var(--card)]/90 dark:text-[var(--foreground)]/80 dark:border-[var(--gold)]/25 dark:hover:border-[var(--gold)] dark:hover:bg-[var(--gold)]/15 dark:hover:text-[var(--gold)] shadow-xs"
                    }`}
                  >
                    <IconComponent
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive
                          ? "text-amber-100 dark:text-[#18110b]"
                          : "text-amber-700 dark:text-[var(--gold)] group-hover:scale-110"
                      }`}
                    />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? "bg-black/25 text-white dark:bg-black/20 dark:text-[#18110b] font-extrabold"
                          : "bg-stone-100 text-stone-600 border border-stone-200 dark:bg-[var(--background)] dark:text-[var(--muted-foreground)] dark:border-[var(--gold)]/25 group-hover:bg-amber-100 group-hover:text-amber-900 dark:group-hover:border-[var(--gold)]/50 dark:group-hover:text-[var(--gold)] font-bold"
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
          <div className="surface-card frame-gold p-10 sm:p-12 text-center rounded-2xl space-y-4 max-w-xl mx-auto my-8 border border-amber-600/30 dark:border-[var(--gold)]/35 bg-white dark:bg-[var(--card)] shadow-lg shadow-amber-900/5 dark:shadow-black/30">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-[var(--gold)]/15 border border-amber-500/25 dark:border-[var(--gold)]/30 flex items-center justify-center text-amber-700 dark:text-[var(--gold)] mx-auto">
              <SearchX className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-[var(--gold)] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 dark:bg-[var(--gold)]/15 border border-amber-500/25 dark:border-[var(--gold)]/30 inline-block mb-2">
                {ui.noResultsBadge}
              </span>
              <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-stone-900 dark:text-[var(--foreground)]">
                {ui.noResultsTitle}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-[var(--muted-foreground)] leading-relaxed max-w-md mx-auto">
              {searchQuery ? ui.noResultsForQuery(searchQuery) : ui.noResultsInCategory}{" "}
              {ui.noResultsHint}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="btn-base btn-gold text-xs py-2.5 px-6 font-bold shadow-md cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{ui.resetFilters}</span>
              </button>
              <Link
                to="/interactive-map"
                className="btn-base btn-outline text-xs py-2.5 px-5 font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{ui.openMapCta}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {filteredArchives.map((archive) => (
              <SourceCard key={archive.id} archive={archive} />
            ))}
          </div>
        )}
      </Section>

      <SiteCustomBlocks pageId="sources" fallbackPageId="research" />
    </div>
  );
}
