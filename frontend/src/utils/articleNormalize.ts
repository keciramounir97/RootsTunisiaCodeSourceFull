export type ArticleVisibility = "public" | "community" | "private";

export interface ArticleComment {
  id: number | string;
  userId: string;
  userName: string;
  text: string;
  likes?: number;
  createdAt: string;
}

export interface NormalizedArticle {
  id: number | string;
  title: string;
  category: string;
  content: string;
  userId: string;
  userName: string;
  images: string[];
  videos: string[];
  comments: ArticleComment[];
  createdAt: string;
  likes: number;
  isLiked: boolean;
  visibility: ArticleVisibility;
}

export const ARTICLE_CATEGORIES = [
  { id: "civil-registry", labelKey: "articles_cat_civil", fallback: "Civil registry" },
  { id: "gedcom-standards", labelKey: "articles_cat_gedcom", fallback: "GEDCOM & Informatics" },
  { id: "ottoman-sijillat", labelKey: "articles_cat_sijillat", fallback: "Ottoman sijillat" },
  { id: "habous", labelKey: "articles_cat_habous", fallback: "Habous & waqf" },
  { id: "kairouan", labelKey: "articles_cat_kairouan", fallback: "Kairouan & nasab" },
  { id: "governorates", labelKey: "articles_cat_governorates", fallback: "Governorates" },
  { id: "oral-history", labelKey: "articles_cat_oral", fallback: "Oral history" },
  { id: "photographs", labelKey: "articles_cat_photos", fallback: "Photographs" },
] as const;

export function parseMediaList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof value === "object") {
    const item = value as Record<string, unknown>;
    const url = item.url || item.src || item.path || item.image_path;
    return url ? [String(url).trim()] : [];
  }
  const raw = String(value || "").trim();
  if (!raw) return [];
  try {
    return parseMediaList(JSON.parse(raw));
  } catch {
    return raw
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export function parseComments(value: unknown): ArticleComment[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as ArticleComment[];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function resolveMediaUrl(url: string, apiRoot: string, fallback: string) {
  const clean = String(url || "").trim();
  if (!clean) return fallback;
  if (/^(https?:)?\/\//i.test(clean) || clean.startsWith("data:") || clean.startsWith("blob:")) {
    return clean;
  }
  if (clean.startsWith("/uploads/")) return `${apiRoot}${clean}`;
  return clean;
}

export function extractArticleList(data: unknown): any[] {
  const payload = data as any;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.articles)) return payload.articles;
  if (Array.isArray(payload)) return payload;
  return [];
}

export function normalizeArticle(
  item: any,
  apiRoot: string,
  fallbackName = "Member",
  fallbackImage = "",
): NormalizedArticle {
  const author = item?.author && typeof item.author === "object" ? item.author : null;
  const userName =
    item?.userName ||
    item?.user_name ||
    item?.author_name ||
    author?.full_name ||
    author?.fullName ||
    (typeof item?.author === "string" ? item.author : "") ||
    fallbackName;
  const images = parseMediaList(item?.images).map((url) =>
    resolveMediaUrl(url, apiRoot, fallbackImage),
  );
  const videos = parseMediaList(item?.videos).map((url) =>
    resolveMediaUrl(url, apiRoot, fallbackImage),
  );

  return {
    id: item?.id || Date.now(),
    title: item?.title || "",
    category: item?.category || "",
    content: item?.content || item?.body || "",
    userId: String(item?.userId || item?.user_id || item?.author_id || "user"),
    userName,
    images,
    videos,
    comments: parseComments(item?.comments),
    createdAt: item?.createdAt || item?.created_at || new Date().toISOString(),
    likes: Number(item?.likes || 0),
    isLiked: Boolean(item?.isLiked),
    visibility: item?.visibility || (item?.is_public === false ? "private" : "public"),
  };
}

export function formatTimeAgo(
  dateString: string,
  t: (key: string, fallback?: string) => string,
) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (Number.isNaN(date.getTime())) return "";
  if (minutes < 60) return `${Math.max(1, minutes)}${t("minutes_ago_suffix", "m ago")}`;
  if (hours < 24) return `${hours}${t("hours_ago_suffix", "h ago")}`;
  if (days < 7) return `${days}${t("days_ago_suffix", "d ago")}`;
  return date.toLocaleDateString();
}

export const SCIENTIFIC_GEDCOM_ARTICLES: NormalizedArticle[] = [
  {
    id: "art-gedcom-architecture-7",
    title: "L'Architecture du Standard GEDCOM : De la Spécification v4.0 au GEDCOM 7.0 et Graphes de Filiation",
    category: "gedcom-standards",
    userName: "Dr. Karim Mansour (Laboratoire d'Informatique Généalogique & CNRS)",
    userId: "researcher_1",
    images: ["/assets/slider-carthage.jpg"],
    videos: [],
    comments: [
      {
        id: 101,
        userId: "peer_reviewer",
        userName: "Prof. H. Al-Masri",
        text: "Remarquable analyse des graphes acycliques orientés (DAG) appliqués aux cycles de consanguinité et au standard GEDCOM 7.0.",
        createdAt: "2026-03-12",
      },
    ],
    createdAt: "2026-03-10T10:00:00.000Z",
    likes: 42,
    isLiked: false,
    visibility: "public",
    content: `Le standard GEDCOM (GEnealogical Data COMmunication) constitue l'épine dorsale de l'informatique généalogique mondiale depuis son officialisation en 1984 par l'Église de Jésus-Christ des Saints des Derniers Jours. Fondé initialement sur une grammaire hiérarchique par ligne simple associant un niveau d'indentation numérique (0 à 99), une balise normalisée (Tag à 4 lettres majuscules) et une valeur littérale ou un pointeur de renvoi inter-enregistrements (Xref ID sous la forme @I1@ ou @F1@), le format a traversé plus de quatre décennies d'évolutions technologiques majeures.

1. De GEDCOM 4.0 à la Spécification 5.5.1
Les premières versions GEDCOM 4.0 et 5.3 visaient l'échange de données nominatives sur disquettes magnétiques et mémoires restreintes. La version 5.5 (1996) puis son addendum 5.5.1 (1999) ont introduit des structures formelles pour la gestion des événements vitaux (BIRT, DEAT, MARR), des résidences (RESI) et de la traçabilité des sources probatoires (SOUR, REPO, CITN). Cependant, le confinement au jeu de caractères ANSEL (ANSI Sub-set for Extended Latin) et à l'ASCII 7 bits a posé d'immenses verrous méthodologiques pour les langues à écriture non latine (notamment l'arabe, l'hébreu et le cyrillique) ainsi que pour la transcription phonétique fine des toponymes et patronymes nord-africains.

2. La Révolution GEDCOM 7.0 (FHISO 2021)
Publiée en 2021 sous l'égide du Family History Information Standards Organisation (FHISO), la version GEDCOM 7.0 représente la refonte la plus substantielle du standard depuis vingt ans :
• Encodage universel UTF-8 obligatoire : Suppression intégrale d'ANSEL, d'UNICODE UCS-2 obsolète et des mécanismes ambigus de translittération.
• Conteneurs ZipGED (.gdz) : Capacité d'encapsuler dans une archive ZIP standard l'arbre généalogique textuel accompagné de son répertoire média (actes scannés, photographies, enregistrements sonores) et d'un manifeste cryptographique garantissant l'intégrité des documents.
• Espaces de noms URI pour les extensions : Fin de l'anarchie des balises personnalisées commençant par un trait de soulignement (_CUSTOM). GEDCOM 7.0 introduit un schéma d'extensions basé sur des URI canoniques, assurant une interopérabilité sans faille entre logiciels de recherche indépendants.

3. Modélisation Mathématique en Graphe de Filiation
D'un point de vue informatique, un arbre GEDCOM n'est pas une simple arborescence mais un graphe acyclique orienté (DAG). Chaque enregistrement INDI forme un nœud relié par des arêtes relationnelles aux nœuds de familles FAM (FAMC pour la famille d'origine, FAMS pour la famille procréative). Cette architecture autorise la modélisation mathématique rigoureuse de l'implexe (pedigree collapse), des unions consanguines au sein des fractions tribales et de la transmission séquentielle des patrimoines notariés.`,
  },
  {
    id: "art-familysearch-gedcomx",
    title: "FamilySearch et les Standards Ouverts : La Transition de GEDCOM vers le Modèle GedcomX",
    category: "gedcom-standards",
    userName: "Pr. Elena Rinaldi & FamilySearch Heritage Research Alliance",
    userId: "researcher_2",
    images: ["/assets/14_Kairouan_Mosque_Arched_Doorways_Dome.jpg"],
    videos: [],
    comments: [
      {
        id: 102,
        userId: "archivist",
        userName: "Dr. Leila Trabelsi",
        text: "La distinction épistémologique entre conclusions généalogiques et faits probatoires de source est cruciale pour le traitement des archives méditerranéennes.",
        createdAt: "2026-03-14",
      },
    ],
    createdAt: "2026-03-08T14:30:00.000Z",
    likes: 38,
    isLiked: false,
    visibility: "public",
    content: `FamilySearch, la plus vaste institution de conservation et d'indexation généalogique mondiale issue de la Genealogical Society of Utah (fondée en 1894), conserve plus de 4 milliards d'images de documents historiques originaux. Face aux défis posés par le traitement massif de données distribuées à l'échelle du cloud, FamilySearch a conçu la spécification GedcomX, ouvrant une nouvelle frontière pour la recherche en sciences humaines numériques.

1. Limites du GEDCOM Traditionnel Face aux Systèmes Distribués
Si le fichier GEDCOM 5.5.1 demeure le format de transfert le plus répandu entre logiciels locaux, sa nature de fichier monolithique séquentiel le rend inadapté aux architectures Web modernes :
• Impossibilité de requêter un individu ou une branche isolée sans charger et parser l'intégralité du fichier plat.
• Absence d'identification universelle permanente (Persistent Universal Identifiers / UUIDs).
• Difficulté à sérialiser nativement des structures JSON pour les navigateurs et clients mobiles modernes.

2. Le Modèle GedcomX : REST, JSON et Hyperliens HATEOAS
GedcomX redéfinit la généalogie informatique à travers les principes du Web sémantique :
• Représentation duale JSON et XML conforme aux schémas stricts et typés.
• Architecture RESTful avec navigation par hyperliens (HATEOAS), permettant aux plateformes collaboratives de synchroniser des modifications atomiques en temps réel.
• Ontologie probatoire formelle : GedcomX sépare rigoureusement la "Source Description" (le manuscrit physique, sa cote d'archives, son image haute résolution), le "Fact" (événement attesté textuellement tel que le mariage consigné dans un sijill) et le "Conclusion Person" (l'individu modélisé par l'historien).

3. Impact pour la Numérisation des Fonds Arabo-Méditerranéens
L'intégration des standards GedcomX et GEDCOM 7.0 dans les plateformes de recherche patrimoniale telles que Roots permet d'interconnecter directement les registres de daftarkhana ottomans et les minutiers notariaux avec les graphes de filiation interactifs, garantissant une pérennité des données sur plusieurs décennies sans dépendance logicielle propriétaire.`,
  },
  {
    id: "art-gedcom-versions-comparison",
    title: "Analyse Comparative des Spécifications GEDCOM 5.5, 5.5.1 et 7.0 : Encodages UTF-8, Paquets ZipGED (.gdz) et Extensibilité",
    category: "gedcom-standards",
    userName: "Ing. Samy Ben Amor (Société Généalogique & Archives Numériques)",
    userId: "researcher_3",
    images: ["/assets/04_El_Jem_Amphitheater_Panorama.jpg"],
    videos: [],
    comments: [
      {
        id: 103,
        userId: "dev_user",
        userName: "Marc V.",
        text: "Le conteneur ZipGED (.gdz) résout enfin la perte historique des pièces jointes scannées lors des transferts d'arbres.",
        createdAt: "2026-03-15",
      },
    ],
    createdAt: "2026-03-05T09:15:00.000Z",
    likes: 51,
    isLiked: false,
    visibility: "public",
    content: `L'histoire de l'informatique généalogique est jalonnée de versions de normes dont les subtilités déterminent la fidélité de restitution des arbres de famille. Une compréhension rigoureuse des divergences entre GEDCOM 5.5, GEDCOM 5.5.1 et GEDCOM 7.0 est indispensable pour tout développeur ou archiviste professionnel.

Tableau Synthétique des Évolutions :
• GEDCOM 5.5 (1996) : Encodages ANSEL, ASCII, UNICODE UCS-2 (obsolète). Fichiers multimédias liés uniquement par chemins absolus locaux (ex: C:\\Photos\\acte.jpg), causant la rupture systématique des liens lors du changement d'ordinateur.
• GEDCOM 5.5.1 (1999 Draft) : Introduction officieuse de UTF-8 (sans validation stricte), support des adresses e-mail, pages web et métadonnées géographiques (MAP, LATI, LONG). Bien que resté au statut de brouillon pendant plus de vingt ans, 5.5.1 est devenu le standard de fait de 90% des logiciels du marché.
• GEDCOM 7.0 (2021 Officiel) : UTF-8 strict sans BOM obligatoire. Suppression de toutes les balises redondantes. Remplacement de l'encapsulation multimédia par le format ZipGED (.gdz).

Le Conteneur ZipGED (.gdz) :
Un fichier .gdz est une archive ZIP contenant à la racine un fichier nommé gedcom.ged encodé en UTF-8 et un sous-dossier contenant tous les médias (photos, actes JPEG/PNG, transcriptions PDF, enregistrements audio). Chaque référence média dans le fichier GEDCOM utilise un chemin relatif portable garanti, rendant l'échange de généalogies complètes avec leurs preuves documentaires instantané et universellement reproductible.`,
  },
  {
    id: "art-nasab-sijillat-gedcom-modeling",
    title: "Modélisation des Lignées Arabo-Maghrébines et Sijillat dans les Structures GEDCOM 7.0",
    category: "gedcom-standards",
    userName: "Dr. Youssef Al-Qadi & Équipe de Recherche Roots",
    userId: "researcher_4",
    images: ["/assets/16_Medina_Ornate_Door_Blue_Grille.jpg"],
    videos: [],
    comments: [
      {
        id: 104,
        userId: "historian",
        userName: "Nadia Belkhodja",
        text: "Crucial pour intégrer les chaînes patronymiques nasab et les fondations de habous familiaux dans les schémas informatiques modernes.",
        createdAt: "2026-03-18",
      },
    ],
    createdAt: "2026-03-01T11:45:00.000Z",
    likes: 64,
    isLiked: false,
    visibility: "public",
    content: `La modélisation informatique des généalogies du monde arabo-méditerranéen et du Maghreb se heurte traditionnellement à des conventions onomastiques occidentales rigides (prénom unique + nom de famille patronymique immuable). Les sources archivistiques traditionnelles — registres de mahkama sharia, actes de habous/waqf et chaînes de transmission notariales (adoul) — reposent en effet sur le système du Nasab.

1. Structure de l'Onomastique Traditionnelle et Tags GEDCOM :
• Ism (prénom individuel) : consigné sous le tag GIVN.
• Kunya (technonyme du type Abu/Umm) : balisé via les sous-champs NICK ou extensions de titre.
• Nasab (chaîne patrilinéaire ascendante 'Ibn / Bent') : dans GEDCOM 7.0, le champ standard NAME permet l'adjonction de l'attribut TYPE patronymic, garantissant la conservation intégrale de la chaîne d'ascendance sans altération de l'indexation.
• Nisba (origine géographique ou affiliation confrérique/tribale) : documentée via des événements d'affiliation (RESI, DSCR) et tags d'extension validés par schéma.

2. Intégration des Actes de Habous et Sijillat comme Sources Probatoires :
Les actes de waqf familial (Habous Ahli) constituent les actes de l'état civil avant la lettre : ils recensent avec une précision chirurgicale l'ensemble des descendants mâles et femelles pour l'usufruit des revenus agricoles ou immobiliers. Dans GEDCOM 7.0, chaque acte notarié est formalisé comme un objet SOUR de niveau 0 avec sa cote physique de Daftarkhana, son extrait textuel dans TEXT, et son scan rattaché dans OBJE. Cette méthodologie garantit une traçabilité scientifique irréprochable conforme aux exigences contemporaines des sciences historiques.`,
  },
];
