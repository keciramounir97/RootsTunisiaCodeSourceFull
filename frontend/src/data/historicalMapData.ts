/**
 * Historical and Tribal Archival Cartography Data for Roots Tunisia
 * Covers all major epochs from Punic antiquity to the modern Republic,
 * with exact time intervals, devlet extents, Tunisian entity borders,
 * era-specific administrative divisions, and tribal whereabouts squares.
 */

export interface TribalTerritory {
  id: string;
  name: string;
  arabicName: string;
  caidat1881?: string;
  capital: string;
  governorates?: string[];
  homelandDescription: string;
  fractions: string[];
  alliances: string;
  majbaSources?: string;
  archivalCotes: string[];
  center: [number, number];
  zoom: number;
  color: string;
  polygon: [number, number][];
  whereaboutsSquare?: [number, number][];
  eraId?: string;
  historicalRole?: string;
}

export interface HistoricalEraSite {
  name: string;
  arabicName?: string;
  coords: [number, number];
  role: string;
  zoomLevel?: number;
}

export interface EraAdministrativeDivision {
  id: string;
  name: string;
  arabicName: string;
  seat: string;
  coords: [number, number];
  description: string;
  archivalType?: string;
  chefLieu?: string;
  jurisdiction?: string;
  historicalTribes?: string[];
  archivalNotes?: string;
}

export interface HistoricalEraLeader {
  name: string;
  arabicName?: string;
  role: string;
  reignOrDates: string;
  achievements: string;
}

export interface HistoricalEraFamily {
  name: string;
  arabicName?: string;
  role: string;
  origin: string;
  lineageNotes: string;
}

export interface HistoricalEraExtended {
  id: string;
  stepNumber: number;
  year: number;
  displayPeriod: string;
  title: string;
  arabicTitle: string;
  empire: string;
  devletName: string;
  tunisiaEntityName: string;
  capital: string;
  capitalCoords: [number, number];
  overviewCenter: [number, number];
  overviewZoom: number;
  borderPolygon: [number, number][];
  outerEmpirePolygon?: [number, number][];
  fillColor: string;
  borderColor: string;
  description: string;
  treatiesAndBorders: string;
  divisionsTitle: string;
  administrativeDivisions: EraAdministrativeDivision[];
  eraTribes: TribalTerritory[];
  archivalSources: string[];
  keySites: HistoricalEraSite[];
  namingStructure?: string;
  survivalRating?: string;
  keyRepositories?: string;
  notableLeaders?: HistoricalEraLeader[];
  notableFamilies?: HistoricalEraFamily[];
  tunisRole?: string;
  lineagesSummary?: string;
}

/**
 * Calculates a bounding box square / rectangle around any polygon
 */
export function getWhereaboutsSquare(
  polygon: [number, number][],
  paddingLat = 0.08,
  paddingLng = 0.1
): [number, number][] {
  if (!polygon || polygon.length === 0) return [];
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;

  polygon.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  minLat -= paddingLat;
  maxLat += paddingLat;
  minLng -= paddingLng;
  maxLng += paddingLng;

  return [
    [minLat, minLng],
    [maxLat, minLng],
    [maxLat, maxLng],
    [minLat, maxLng],
  ];
}

// =========================================================================
// 1. LES 16 GRANDES TRIBUS & CONFÉDÉRATIONS DE TUNISIE (Époque Beylicale/1881)
// =========================================================================
export const TUNISIAN_TRIBES: TribalTerritory[] = [
  {
    id: "ouerghemma",
    name: "Ouerghemma",
    arabicName: "الورغمة",
    caidat1881: "Caïdat des Ouerghemma (Médenine / Djebel Dahar)",
    capital: "Médenine (Ksar Médenine)",
    governorates: ["medenine", "tataouine"],
    homelandDescription:
      "Vaste confédération guerrière du Sud-Est contrôlant les plaines de la Jeffara, le Djebel Dahar et la frontière tripolitaine.",
    fractions: [
      "Touazine (Ben Gardane)",
      "Ac-Cheddad",
      "Khezour",
      "Ounifa",
      "Ghomrassen",
      "Douiret",
      "Chenini",
    ],
    alliances:
      "Alliance du Sud (Leff Saff el-Ouerghemma) / Gardiens des pistes caravanières sahariennes.",
    majbaSources:
      "Registres fiscaux de la Majba de 1860 (Série ANT Kasbah Dahar) et dénombrement des Ksours.",
    archivalCotes: [
      "ANT Kasbah — Fonds Caïdat d'Ouerghemma (Cotes 142/A à 148/D)",
      "Sijillats Notariés des Adoul de Ben Gardane et Tataouine",
      "Archives Militaires de Médenine (Territoires du Sud 1890–1912)",
    ],
    center: [33.15, 10.45],
    zoom: 8.5,
    color: "#b8860b",
    polygon: [
      [33.85, 10.2],
      [33.7, 11.15],
      [33.15, 11.55],
      [32.6, 11.45],
      [31.85, 10.8],
      [31.6, 10.1],
      [32.25, 9.6],
      [33.1, 9.85],
      [33.6, 10.05],
    ],
    whereaboutsSquare: [
      [31.5, 9.5],
      [33.95, 9.5],
      [33.95, 11.65],
      [31.5, 11.65],
    ],
  },
  {
    id: "jlass",
    name: "Jlass (Zlass)",
    arabicName: "الجلاص / الزلاص",
    caidat1881: "Caïdat des Jlass (Kairouan)",
    capital: "Kairouan / Oueslatia",
    governorates: ["kairouan", "siliana", "sidi_bouzid"],
    homelandDescription:
      "Puissante confédération centrale occupant la vaste plaine de Kairouan et les contreforts du Djebel Oueslat.",
    fractions: [
      "Ouled Iddir",
      "Ouled Khelifa",
      "Ouled Sanad",
      "Beni Zid el-Kairouan",
      "Ouled Mansour",
    ],
    alliances:
      "Traditionnellement alliée au Makhzen beylical lors des expéditions fiscales de la Mahalla.",
    majbaSources:
      "Recensement de la Majba 1860–1869 (Série ANT Kairouan, 18 420 chefs de famille recensés).",
    archivalCotes: [
      "ANT Kasbah — Registres des Sijillats Charaïques de Kairouan (1750–1881)",
      "Fonds des Habous de Sidi Sahbi et de la Grande Mosquée",
      "Actes d'Adoul de la plaine de Sbikha et Haffouz",
    ],
    center: [35.7, 9.85],
    zoom: 8.5,
    color: "#b81428",
    polygon: [
      [36.15, 9.5],
      [36.1, 10.2],
      [35.65, 10.35],
      [35.35, 10.15],
      [35.3, 9.55],
      [35.6, 9.35],
      [36.0, 9.4],
    ],
    whereaboutsSquare: [
      [35.2, 9.25],
      [36.25, 9.25],
      [36.25, 10.45],
      [35.2, 10.45],
    ],
  },
  {
    id: "fraichiche",
    name: "Fraichiche",
    arabicName: "الفراشيش",
    caidat1881: "Caïdat des Fraichiche (Thala & Kasserine)",
    capital: "Feriana / Thala",
    governorates: ["kasserine"],
    homelandDescription:
      "Confédération montagnarde des hautes steppes autour du Djebel Chambi et des plateaux de Feriana et Thelepte.",
    fractions: [
      "Ouled Ouezzen",
      "Ouled Ali Ben Aoun",
      "Ouled Naji",
      "Beni Ghorbal",
      "Ouled Guesmia",
    ],
    alliances:
      "Leff des Fraichiche / Rivale historique des Majer pour le contrôle des pâturages de steppe.",
    majbaSources:
      "Rôles fiscaux de la Majba (1860) du Caïdat des Fraichiche — dépôts de Kasserine et Sbeïtla.",
    archivalCotes: [
      "ANT Kasbah — Dossiers des Caïds de Feriana et Thala (Série Beylicale 220)",
      "Tribunal Charaïque de Sbeïtla — Actes de limites territoriales",
    ],
    center: [35.15, 8.65],
    zoom: 8.5,
    color: "#24766f",
    polygon: [
      [35.6, 8.45],
      [35.5, 9.15],
      [35.05, 9.25],
      [34.65, 8.75],
      [34.8, 8.35],
      [35.35, 8.3],
    ],
    whereaboutsSquare: [
      [34.55, 8.2],
      [35.7, 8.2],
      [35.7, 9.35],
      [34.55, 9.35],
    ],
  },
  {
    id: "majer",
    name: "Majer",
    arabicName: "ماجر",
    caidat1881: "Caïdat des Majer (Hautes Steppes)",
    capital: "Thala / Rohia",
    governorates: ["kasserine", "siliana", "el_kef"],
    homelandDescription:
      "Grande confédération guerrière occupant le corridor frontalier entre Le Kef, Thala et la frontière algérienne.",
    fractions: ["Ouled Messaoud", "Ouled Amor", "Kouache", "Ouled Helal"],
    alliances: "Grande alliance défensive avec les tribus de la Medjerda.",
    majbaSources: "Rôles de la Majba de Thala (1860) — Dépôt central de La Kasbah.",
    archivalCotes: [
      "ANT Kasbah — Série Beylicale Caïdat de Thala (Cotes 88 à 94)",
      "Sijillats des cadis d'El Kef et Haïdra",
    ],
    center: [35.6, 8.75],
    zoom: 8.5,
    color: "#d97706",
    polygon: [
      [35.95, 8.45],
      [35.9, 9.05],
      [35.45, 9.1],
      [35.35, 8.55],
      [35.65, 8.4],
    ],
    whereaboutsSquare: [
      [35.25, 8.3],
      [36.05, 8.3],
      [36.05, 9.15],
      [35.25, 9.15],
    ],
  },
  {
    id: "hamama",
    name: "Hamama",
    arabicName: "الهمامة",
    caidat1881: "Caïdat des Hamama (Sidi Bouzid & Gafsa)",
    capital: "Sidi Bouzid / Gafsa Nord",
    governorates: ["sidi_bouzid", "gafsa"],
    homelandDescription:
      "Vaste confédération des steppes méridionales s'étendant des contreforts de Gafsa jusqu'au bassin de Sidi Bouzid.",
    fractions: [
      "Ouled Aziz",
      "Ouled Radouane",
      "Ouled Moumen",
      "Ouled Souissi",
      "Ouled Slimane",
    ],
    alliances:
      "Leff des Hamama (Saff opposé aux Fraichiche dans les conflits pastoraux).",
    majbaSources: "Recensement de 1860 de la région de Gafsa et Sidi Bouzid (ANT).",
    archivalCotes: [
      "ANT Kasbah — Fonds Caïdat des Hamama (Cotes 105 à 112)",
      "Registres fiscaux de la Mahalla du Sud",
    ],
    center: [34.85, 9.35],
    zoom: 8.5,
    color: "#0284c7",
    polygon: [
      [35.3, 9.1],
      [35.25, 9.8],
      [34.65, 9.75],
      [34.35, 9.15],
      [34.45, 8.85],
      [34.95, 8.95],
    ],
    whereaboutsSquare: [
      [34.25, 8.75],
      [35.4, 8.75],
      [35.4, 9.9],
      [34.25, 9.9],
    ],
  },
  {
    id: "nefzaoua",
    name: "Nefzaoua",
    arabicName: "نفزاوة",
    caidat1881: "Caïdat de Nefzaoua (Kebili)",
    capital: "Kebili / Douz",
    governorates: ["kebili"],
    homelandDescription:
      "Ancienne confédération oasienne et saharienne berbéro-arabe, maîtresse des palmeraies du Chott el-Djerid et du Nefzaoua.",
    fractions: [
      "Marazig (Douz)",
      "Adhara",
      "Gharib",
      "Sabria",
      "Beni Zid el-Djerid",
    ],
    alliances:
      "Confédération saharienne des caravaniers et gardiens des oasis.",
    majbaSources: "Comptabilité de la Majba des Oasis (1860) — Série ANT Kasbah.",
    archivalCotes: [
      "ANT Kasbah — Série Beylicale Oasis du Sud (Cotes 171 à 176)",
      "Archives orales des Marazig de Douz",
    ],
    center: [33.55, 8.95],
    zoom: 8.5,
    color: "#7c3aed",
    polygon: [
      [33.95, 8.65],
      [33.9, 9.45],
      [33.35, 9.5],
      [32.85, 8.95],
      [33.15, 8.45],
      [33.65, 8.5],
    ],
    whereaboutsSquare: [
      [32.75, 8.35],
      [34.05, 8.35],
      [34.05, 9.6],
      [32.75, 9.6],
    ],
  },
  {
    id: "drid",
    name: "Drid",
    arabicName: "دريد",
    caidat1881: "Caïdat des Drid (Plaine de la Medjerda & Béja)",
    capital: "Béja / Testour",
    governorates: ["beja", "jendouba"],
    homelandDescription:
      "Confédération makhzen cavalier installée dans la fertile plaine de la Medjerda pour escorter les convois beylicaux et sécuriser le grenier à blé.",
    fractions: ["Ouled Sidi Abid", "Ouled Arfa", "Ouled Manai", "Drid el-Makhzen"],
    alliances: "Tribu makhzen privilégiée par les Beys de Tunis.",
    majbaSources:
      "Rôles fiscaux spécifiques de la cavalerie des Drid (1860) — ANT Kasbah.",
    archivalCotes: [
      "ANT Kasbah — Fonds Makhzen des Drid (Série Beylicale 44)",
      "Tribunal Charaïque de Béja",
    ],
    center: [36.65, 9.2],
    zoom: 8.5,
    color: "#059669",
    polygon: [
      [36.9, 8.9],
      [36.85, 9.55],
      [36.4, 9.6],
      [36.35, 9.0],
    ],
    whereaboutsSquare: [
      [36.25, 8.8],
      [37.0, 8.8],
      [37.0, 9.7],
      [36.25, 9.7],
    ],
  },
  {
    id: "ouled_ayar",
    name: "Ouled Ayar",
    arabicName: "أولاد عيار",
    caidat1881: "Caïdat des Ouled Ayar (Makthar & Siliana)",
    capital: "Makthar (Mactaris) / Kesra",
    governorates: ["siliana"],
    homelandDescription:
      "Confédération des hauts plateaux de Makthar et du Djebel Kesra, réputée pour ses chevaux et ses guerriers de montagne.",
    fractions: ["Ouled Salem", "Ouled Bou Ali", "Ouled Amor Ben Ali", "Ouled Khelil"],
    alliances: "Alliance des hauts plateaux du Tell central.",
    majbaSources: "Rôles Majba du Caïdat de Makthar (1860) — ANT Kasbah.",
    archivalCotes: [
      "ANT Kasbah — Série Beylicale Makthar (Cote 131)",
      "Registres d'Adoul de Kesra et Siliana",
    ],
    center: [35.85, 9.2],
    zoom: 8.5,
    color: "#c026d3",
    polygon: [
      [36.1, 8.95],
      [36.05, 9.45],
      [35.6, 9.5],
      [35.55, 8.95],
    ],
    whereaboutsSquare: [
      [35.45, 8.85],
      [36.2, 8.85],
      [36.2, 9.6],
      [35.45, 9.6],
    ],
  },
  {
    id: "souassi",
    name: "Souassi",
    arabicName: "السواسي",
    caidat1881: "Caïdat des Souassi (Sahel Sud & Mahdia)",
    capital: "Es-Souassi / Ksour Essef",
    governorates: ["mahdia", "sfax"],
    homelandDescription:
      "Importante confédération agro-pastorale occupant les plaines fertiles de l'arrière-pays du Sahel de Mahdia.",
    fractions: [
      "Ouled Moulahem",
      "Ouled Amor",
      "Ouled Zid",
      "Ouled Belhassen",
      "Chouachna",
    ],
    alliances: "Liée au réseau des villes portuaires du Sahel (Mahdia, Sfax).",
    majbaSources: "Rôles de la Majba de Mahdia et Souassi (1860) — ANT.",
    archivalCotes: [
      "ANT Kasbah — Registres des Souassi (Cote 82)",
      "Tribunal Charaïque de Mahdia",
    ],
    center: [35.25, 10.45],
    zoom: 8.5,
    color: "#ea580c",
    polygon: [
      [35.5, 10.2],
      [35.45, 10.75],
      [35.0, 10.75],
      [34.95, 10.2],
    ],
    whereaboutsSquare: [
      [34.85, 10.1],
      [35.6, 10.1],
      [35.6, 10.85],
      [34.85, 10.85],
    ],
  },
  {
    id: "beni_zid",
    name: "Beni Zid",
    arabicName: "بني زيد",
    caidat1881: "Caïdat des Beni Zid (El Hamma & Gabès)",
    capital: "El Hamma / Metouia",
    governorates: ["gabes"],
    homelandDescription:
      "Tribu guerrière du Sud occupant la plaine thermale d'El Hamma et les collines bordant le golfe de Gabès.",
    fractions: ["Chouarekh", "Zemzem", "Ouled Douis", "Hazem", "Smaala"],
    alliances: "Pacte avec les tribus maritimes de Gabès et de la Jeffara.",
    majbaSources: "Rôles de la Majba d'El Hamma de Gabès (1860) — ANT.",
    archivalCotes: [
      "ANT Kasbah — Série Beylicale Gabès (Cote 118)",
      "Tribunal Charaïque d'El Hamma",
    ],
    center: [33.9, 9.8],
    zoom: 8.5,
    color: "#0d9488",
    polygon: [
      [34.15, 9.45],
      [34.1, 10.15],
      [33.65, 10.15],
      [33.65, 9.5],
    ],
    whereaboutsSquare: [
      [33.55, 9.35],
      [34.25, 9.35],
      [34.25, 10.25],
      [33.55, 10.25],
    ],
  },
  {
    id: "mogod",
    name: "Mogod",
    arabicName: "المقاعد",
    caidat1881: "Caïdat des Mogods (Bizerte Ouest)",
    capital: "Sejnane / Nefza",
    governorates: ["bizerte", "beja"],
    homelandDescription:
      "Tribu montagnarde des forêts de chênes-lièges et du littoral escarpé du Nord-Ouest entre Bizerte et Tabarka.",
    fractions: ["Ouled Mefdah", "Ouled Kassem", "Ouled Bou Baker"],
    alliances: "Gardiens côtiers du littoral septentrional.",
    majbaSources: "Rôles Majba des Mogods (1860) — ANT Kasbah.",
    archivalCotes: [
      "ANT Kasbah — Fonds Caïdat des Mogods (Cote 31)",
      "Archives communales de Sejnane",
    ],
    center: [37.1, 9.25],
    zoom: 8.5,
    color: "#16a34a",
    polygon: [
      [37.25, 8.95],
      [37.25, 9.55],
      [36.95, 9.5],
      [36.95, 8.95],
    ],
    whereaboutsSquare: [
      [36.85, 8.85],
      [37.35, 8.85],
      [37.35, 9.65],
      [36.85, 9.65],
    ],
  },
  {
    id: "khmir",
    name: "Khmir (Kroumirs)",
    arabicName: "خمير (الكرومرية)",
    caidat1881: "Caïdat des Khmirs (Aïn Draham & Tabarka)",
    capital: "Aïn Draham / Fernana",
    governorates: ["jendouba"],
    homelandDescription:
      "Confédération des forêts denses de Kroumirie réputée pour sa résistance face aux expéditions et sa maîtrise du relief montagneux.",
    fractions: ["Ouled Soltane", "Ouled Selim", "Ouled Theljane", "Ouled Khelil"],
    alliances: "Alliance des montagnards de la chaîne de Kroumirie.",
    majbaSources: "Rôles de recensement de Tabarka et Aïn Draham (1860) — ANT.",
    archivalCotes: [
      "ANT Kasbah — Série Beylicale Kroumirie (Cote 19)",
      "Registres de la Résidence Générale de Tabarka",
    ],
    center: [36.75, 8.7],
    zoom: 8.5,
    color: "#15803d",
    polygon: [
      [37.0, 8.5],
      [36.95, 8.9],
      [36.5, 8.9],
      [36.55, 8.45],
    ],
    whereaboutsSquare: [
      [36.4, 8.35],
      [37.1, 8.35],
      [37.1, 9.0],
      [36.4, 9.0],
    ],
  },
  {
    id: "metallit",
    name: "Metallit",
    arabicName: "المثاليث",
    caidat1881: "Caïdat des Metallit (Sfax Nord / El Jem)",
    capital: "Jbeniana / El Jem",
    governorates: ["sfax", "mahdia"],
    homelandDescription:
      "Tribu pastorale et oléicole entre le Sahel et le bassin sfaxien.",
    fractions: ["Ouled Slimane", "Ouled Brahim", "Ouled Moussa"],
    alliances: "Alliée aux négociants sfaxiens et mahdois.",
    majbaSources: "Cadastre oléicole et rôles Majba 1860 — ANT.",
    archivalCotes: ["ANT Kasbah — Fonds Caïdat des Metallit", "Sijillats d'El Jem"],
    center: [35.1, 10.65],
    zoom: 8.5,
    color: "#0369a1",
    polygon: [
      [35.35, 10.45],
      [35.3, 10.85],
      [34.85, 10.8],
      [34.9, 10.45],
    ],
    whereaboutsSquare: [
      [34.75, 10.35],
      [35.45, 10.35],
      [35.45, 10.95],
      [34.75, 10.95],
    ],
  },
  {
    id: "riah_chabbia",
    name: "Riah & Chabbia (Djerid)",
    arabicName: "رياح والشابية",
    caidat1881: "Caïdat du Djerid (Tozeur / Nefta)",
    capital: "Tozeur / Nefta",
    governorates: ["tozeur"],
    homelandDescription:
      "Grandes familles et lignées oasiennes du Djerid, savants zitouniens, chorfa et commerçants transsahariens.",
    fractions: ["Chorfa de Nefta", "Beni Ali", "Ouled Sidi Bouali", "Awlad Chebbi"],
    alliances: "Rayonnement spirituel et intellectuel soufi (zaouïas de Nefta et Tozeur).",
    majbaSources: "Cadastre hydraulique d'Ibn Chabbat et Majba oasienne de 1860.",
    archivalCotes: [
      "ANT Kasbah — Registres des Eaux d'irrigation et Habous du Djerid",
      "Sijillats notariés de Tozeur (fonds des lettrés du Djerid)",
    ],
    center: [33.95, 8.1],
    zoom: 8.5,
    color: "#e11d48",
    polygon: [
      [34.25, 7.75],
      [34.2, 8.45],
      [33.7, 8.4],
      [33.75, 7.7],
    ],
    whereaboutsSquare: [
      [33.6, 7.6],
      [34.35, 7.6],
      [34.35, 8.55],
      [33.6, 8.55],
    ],
  },
  {
    id: "ouled_said",
    name: "Ouled Saïd",
    arabicName: "أولاد سعيد",
    caidat1881: "Caïdat des Ouled Saïd (Enfidha)",
    capital: "Enfidha (Dar El Bey) / Takrouna",
    governorates: ["sousse", "zaghouan"],
    homelandDescription:
      "Tribu du domaine de l'Enfidha, occupant les plaines fertiles bordant le golfe d'Hammamet et le village berbère de Takrouna.",
    fractions: ["Ouled Abdallah", "Ouled Mehdi", "Ouled Slimane", "Takrouna"],
    alliances: "Rattachée au domaine historique beylical de l'Enfidha.",
    majbaSources: "Dossier de l'Affaire de l'Enfidha (1879–1880) et rôles Majba.",
    archivalCotes: [
      "ANT Kasbah — Fonds du Domaine de l'Enfidha (Cotes 55/B)",
      "Archives notariales de Sousse et Zaghouan",
    ],
    center: [36.15, 10.25],
    zoom: 8.5,
    color: "#7c3aed",
    polygon: [
      [36.35, 9.95],
      [36.35, 10.55],
      [35.9, 10.45],
      [35.95, 9.85],
    ],
    whereaboutsSquare: [
      [35.8, 9.75],
      [36.45, 9.75],
      [36.45, 10.65],
      [35.8, 10.65],
    ],
  },
  {
    id: "matmata_djebalia",
    name: "Matmata & Djebalia",
    arabicName: "مطماطة وجبالية",
    caidat1881: "Caïdat des Djebalia (Monts de Matmata)",
    capital: "Matmata / Toujane",
    governorates: ["gabes", "medenine"],
    homelandDescription:
      "Berbères zénètes troglodytiques des crêtes montagneuses du Sud, célèbres pour leurs villages fortifiés.",
    fractions: ["Matmata ancienne", "Toujane", "Tamezret", "Taoujout", "Beni Aïssa"],
    alliances: "Pacte défensif montagnard des Djebalia.",
    majbaSources: "Registres de capitation des villages troglodytes (1860).",
    archivalCotes: [
      "ANT Kasbah — Fonds Caïdat des Djebalia",
      "Archives orales et notariales de Toujane et Tamezret",
    ],
    center: [33.55, 9.95],
    zoom: 8.5,
    color: "#ea580c",
    polygon: [
      [33.75, 9.75],
      [33.7, 10.2],
      [33.3, 10.15],
      [33.35, 9.7],
    ],
    whereaboutsSquare: [
      [33.2, 9.6],
      [33.85, 9.6],
      [33.85, 10.3],
      [33.2, 10.3],
    ],
  },
];

// =========================================================================
// 2. TIMELINE HISTORIQUE DE TUNISIE (12 PÉRIODES DE -814 À AUJOURD'HUI)
// =========================================================================
export const TUNISIAN_HISTORICAL_ERAS: HistoricalEraExtended[] = [
  {
    id: "punique",
    stepNumber: 1,
    year: -814,
    displayPeriod: "814 av. J.-C. – 146 av. J.-C.",
    title: "Antiquité Punique & Carthage",
    arabicTitle: "العهد البونيقي القرطاجي والمملكة النوميدية",
    empire: "République Métropolitaine de Carthage & Numidie",
    devletName: "République de Carthage (Empire Maritime Phénico-Punique)",
    tunisiaEntityName: "Territoire Métropolitain de Carthage & Fossa Regia",
    capital: "Carthage (قرطاج)",
    capitalCoords: [36.8528, 10.3233],
    overviewCenter: [35.5, 9.8],
    overviewZoom: 7,
    fillColor: "#581c87",
    borderColor: "#7e22ce",
    description:
      "Carthage domine le commerce méditerranéen occidental. Le territoire carthaginois métropolitain est séparé du Royaume Numide de Massinissa par la célèbre Fossa Regia (fossé de Scipion Émilien tracé en 146 av. J.-C.).",
    treatiesAndBorders:
      "La Fossa Regia relie Thabraca (Tabarka) au nord-ouest à Thaenae (Thyna, au sud de Sfax). L'intérieur appartient aux rois numides (Massyles et Massaesyles).",
    divisionsTitle: "Territoires Métropolitains & Cités Puniques",
    administrativeDivisions: [
      { id: "carthage_core", name: "Carthage Métropole", arabicName: "قرطاج الحاضرة", seat: "Carthage Byrsa", coords: [36.8528, 10.3233], description: "Cœur politique, sanctuaires de Tanit et arsenaux navals." },
      { id: "chora_capbon", name: "Chôra du Cap Bon", arabicName: "شبه جزيرة الرأس الطيب", seat: "Kerkouane / Aspis (Kélibia)", coords: [36.9694, 11.0983], description: "Grands domaines agricoles puniques et pêcheries." },
      { id: "medjerda_valley", name: "Vallée de la Bagrada", arabicName: "حوض مجردة", seat: "Utique (Utica)", coords: [37.05, 10.02], description: "Grenier céréalier métropolitain d'Utique à Sicca." },
      { id: "byzacena_punic", name: "Région Côtière d'Hadrumète", arabicName: "سواحل حضرموت", seat: "Hadrumetum (Sousse)", coords: [35.8288, 10.6406], description: "Comptoirs et ports marchands puniques du Sahel." },
      { id: "numidia_massyles", name: "Royaume des Massyles", arabicName: "مملكة الماسيل", seat: "Thugga (Dougga) / Cirta", coords: [36.4225, 9.2192], description: "Territoire des rois numides alliés de Carthage puis de Massinissa." },
    ],
    eraTribes: [
      {
        id: "massyles",
        name: "Numides Massyles",
        arabicName: "النوميد الماسيل",
        capital: "Thugga (Dougga)",
        homelandDescription: "Grand peuple berbère numide de l'intérieur septentrional, fondateurs du royaume numide unifié.",
        fractions: ["Massyles de Thugga", "Numides de Bulla Regia", "Sicca"],
        alliances: "Royaume de Massinissa.",
        archivalCotes: ["Stèles libyques bilingues de Dougga", "Corpus Inscriptionum Semiticarum"],
        center: [36.45, 9.15],
        zoom: 8.5,
        color: "#9333ea",
        polygon: [[36.8, 8.8], [36.75, 9.5], [36.2, 9.45], [36.25, 8.75]],
        whereaboutsSquare: [[36.1, 8.65], [36.9, 8.65], [36.9, 9.6], [36.1, 9.6]],
      },
      {
        id: "cinithii",
        name: "Cinithii & Libyens",
        arabicName: "السينيثيون والليبيون القدامى",
        capital: "Gigthis (Bougrara)",
        homelandDescription: "Peuple libyco-berbère autochtone du golfe de Gabès et de la plaine de la Jeffara.",
        fractions: ["Gigthis", "Zita", "Meninx (Djerba)"],
        alliances: "Comptoirs puniques du Sud.",
        archivalCotes: ["Inscriptions dédicatoires de Gigthis", "Textes de Ptolémée"],
        center: [33.5, 10.3],
        zoom: 8.5,
        color: "#b8860b",
        polygon: [[33.9, 10.0], [33.8, 10.8], [33.2, 10.75], [33.3, 9.95]],
        whereaboutsSquare: [[33.1, 9.85], [34.0, 9.85], [34.0, 10.9], [33.1, 10.9]],
      },
    ],
    outerEmpirePolygon: [
      [38.5, -6.0], [42.0, 3.0], [40.0, 15.0], [36.0, 18.0],
      [31.0, 12.0], [30.0, -5.0], [35.0, -8.0],
    ],
    borderPolygon: [
      [37.05, 8.75], [37.25, 9.9], [36.9, 10.35], [36.85, 11.1],
      [35.85, 10.65], [35.5, 11.05], [34.65, 10.65], [35.3, 9.5],
      [36.42, 9.2], [36.55, 8.75],
    ],
    archivalSources: [
      "Inscriptions néo-puniques et stèles votives du Tophet de Salammbô",
      "Textes de Polybe, Tite-Live et Appien sur le tracé de la Fossa Regia",
      "Mosaïques et épigraphie libyco-berbère de Bulla Regia et Dougga",
    ],
        tunisRole: "Thunès (Tunes / تونس) : Cité libyco-punique satellite érigée sur l'isthme stratégique séparant le lac de Tunis de la lagune Séjoumi. Campement militaire avancé protégeant Byrsa contre les assauts terrestres et carrefour caravanier reliant les comptoirs du Cap Bon à la vallée céréalière de la Bagrada.",
    lineagesSummary: "Registres sémitiques épigraphiques phénico-puniques fondés sur la filiation théophore ('fils d'un tel, dévoué à Tanit ou Melqart'). Épigraphie libyco-berbère des stèles bilingues de Dougga et nécropoles de Carthage.",
    notableLeaders: [
      {
            "name": "Hannibal Barca",
            "arabicName": "حنبعل برقا",
            "role": "Généralissime & Suffète de Carthage",
            "reignOrDates": "247 av. J.-C. – 183 av. J.-C.",
            "achievements": "Génie militaire universel, vainqueur de Cannes et Trasimène, réformateur démocratique de la constitution de Carthage."
      },
      {
            "name": "Hamilcar Barca",
            "arabicName": "حملقار برقا",
            "role": "Stratège & Fondateur de la puissance barcide",
            "reignOrDates": "275 av. J.-C. – 228 av. J.-C.",
            "achievements": "Commandant en chef de la Première Guerre punique, pacificateur de l'Ifriqiya et conquérant de l'Hispanie."
      },
      {
            "name": "Magon le Grand",
            "arabicName": "ماقون الأكبر",
            "role": "Suffète & Fondateur de la dynastie magonide",
            "reignOrDates": "550 av. J.-C. – 530 av. J.-C.",
            "achievements": "Organisateur de l'armée civique et de l'hégémonie maritime de Carthage en Méditerranée occidentale."
      },
      {
            "name": "Massinissa",
            "arabicName": "ماسينيسا",
            "role": "Premier Roi de Numidie Unifiée",
            "reignOrDates": "238 av. J.-C. – 148 av. J.-C.",
            "achievements": "Unificateur des royaumes berbères massyles et maesyles, bâtisseur des cités numides de Dougga et Cirta."
      }
],
    notableFamilies: [
      {
            "name": "Dynastie des Barcides",
            "arabicName": "عائلة برقا",
            "role": "Aristocratie militaire, suffètes et généraux",
            "origin": "Carthage Métropole (Colline de Byrsa)",
            "lineageNotes": "Lignée d'Hamilcar, Hannibal, Hasdrubal et Magon ayant gouverné Carthage et fondé Carthagène."
      },
      {
            "name": "Maison des Magonides",
            "arabicName": "الماقونيون",
            "role": "Sénateurs et chefs de l'oligarchie punique",
            "origin": "Carthage",
            "lineageNotes": "Dirigeants dominants du Conseil des Cent-Quatre du VIe au IVe siècle av. J.-C."
      },
      {
            "name": "Lignée Royale Massyle",
            "arabicName": "السلالة الملكية الماسيلية",
            "role": "Rois numides bordant la Fossa Regia",
            "origin": "Dougga (Thugga) / Cirta",
            "lineageNotes": "Lignée royale de Gala, Massinissa, Micipsa et Jugurtha régnant sur les hautes plaines occidentales."
      }
],
keySites: [
      { name: "Carthage", arabicName: "قرطاج", coords: [36.8528, 10.3233], role: "Capitale impériale métropolitaine punique", zoomLevel: 13 },
      { name: "Dougga (Thugga)", arabicName: "دقة", coords: [36.4225, 9.2192], role: "Grande cité numido-romaine (Mausolée libyco-punique)", zoomLevel: 13 },
      { name: "Bulla Regia", arabicName: "بولا ريجيا", coords: [36.5567, 8.7533], role: "Résidence des rois numides", zoomLevel: 13 },
      { name: "Kerkouane", arabicName: "كركوان", coords: [36.9694, 11.0983], role: "Cité punique côtière intacte du Cap Bon", zoomLevel: 13 },
    ],
  },
  {
    id: "romaine",
    stepNumber: 2,
    year: -146,
    displayPeriod: "146 av. J.-C. – 439 apr. J.-C.",
    title: "Afrique Proconsulaire & Empire Romain",
    arabicTitle: "إفريقيا البروقنصلية والعهد الروماني",
    empire: "Provincia Africa Proconsularis & Byzacena",
    devletName: "Imperium Romanum (Empire Romain — Mare Nostrum)",
    tunisiaEntityName: "Provinces d'Afrique Proconsulaire, Byzacène et Tripolitaine",
    capital: "Hadrumetum / Carthago",
    capitalCoords: [35.8288, 10.6406],
    overviewCenter: [34.8, 9.6],
    overviewZoom: 6.8,
    fillColor: "#991b1b",
    borderColor: "#7f1d1d",
    description:
      "La Tunisie devient le « grenier à blé » de Rome. Réseau de 200 cités municipales (El Jem, Dougga, Bulla Regia, Sbeïtla) reliées par le Limes saharien et l'aqueduc de Zaghouan.",
    treatiesAndBorders:
      "Frontière sud protégée par le Limes Tripolitanus reliant Gafsa/Capsa, Bezereos et Tillibari (Remada).",
    divisionsTitle: "Provinces & Curiae Municipales Romaines",
    administrativeDivisions: [
      { id: "zeugitana", name: "Africa Zeugitana (Nord)", arabicName: "إفريقيا الشمالية زوغيتانا", seat: "Carthago Colonia", coords: [36.8528, 10.3233], description: "Province sénatoriale proconsulaire du Nord tunisien." },
      { id: "byzacena", name: "Provincia Byzacena (Centre)", arabicName: "إقليم بيزاسينا", seat: "Hadrumetum (Sousse)", coords: [35.8288, 10.6406], description: "Province oléicole prospère centrée sur Hadrumète et Thysdrus." },
      { id: "tripolitana", name: "Tripolitania (Sud)", arabicName: "إقليم طرابلس التونسي", seat: "Tacape (Gabès)", coords: [33.8815, 10.0982], description: "Zone militaire du Limes et confins sahariens." },
      { id: "capsa_region", name: "District de Capsa (Gafsa)", arabicName: "قضاء قفصة الروماني", seat: "Capsa", coords: [34.425, 8.7842], description: "Poste avancé du Limes face aux tribus nomades Gétules." },
    ],
    eraTribes: [
      {
        id: "musulamii",
        name: "Musulamii",
        arabicName: "الموسولاميون",
        capital: "Ammaedara (Haïdra)",
        homelandDescription: "Grande confédération berbère rebelle menée par Tacfarinas contre la domination romaine.",
        fractions: ["Guerriers de Thelepte", "Ammaedara", "Sufetula"],
        alliances: "Révolte de Tacfarinas (17–24 apr. J.-C.).",
        archivalCotes: ["Annales de Tacite", "Inscriptions de Haïdra (CIL VIII)"],
        center: [35.5, 8.6],
        zoom: 8.5,
        color: "#dc2626",
        polygon: [[35.8, 8.3], [35.75, 8.9], [35.2, 8.95], [35.25, 8.35]],
        whereaboutsSquare: [[35.1, 8.2], [35.9, 8.2], [35.9, 9.05], [35.1, 9.05]],
      },
      {
        id: "getules",
        name: "Gétules & Garamantes",
        arabicName: "الجيتول والغرامنت",
        capital: "Thiges / Nefta",
        homelandDescription: "Tribus nomades du Sud contrôlant les pistes au-delà du Chott el-Djerid et du Limes.",
        fractions: ["Nomades du Djerid", "Chott el-Fejaj", "Dahar"],
        alliances: "Pactes frontaliers avec les commandants du Limes.",
        archivalCotes: ["CIL VIII — Inscriptions militaires de Bezereos"],
        center: [33.6, 9.0],
        zoom: 8.5,
        color: "#d97706",
        polygon: [[33.9, 8.5], [33.85, 9.5], [33.2, 9.4], [33.25, 8.4]],
        whereaboutsSquare: [[33.05, 8.25], [34.05, 8.25], [34.05, 9.65], [33.05, 9.65]],
      },
    ],
    outerEmpirePolygon: [
      [48.0, -4.0], [52.0, 10.0], [45.0, 25.0], [38.0, 35.0],
      [30.0, 32.0], [29.0, 15.0], [30.0, -8.0],
    ],
    borderPolygon: [
      [37.35, 8.6], [37.35, 10.05], [36.95, 11.15], [35.3, 11.1],
      [33.9, 10.4], [33.0, 10.6], [32.3, 10.2], [33.1, 8.6],
      [34.4, 8.75], [35.2, 8.5], [36.2, 8.4],
    ],
    archivalSources: [
      "Corpus Inscriptionum Latinarum (CIL VIII) — 30 000 inscriptions de Tunisie",
      "Table de Peutinger et Itinéraire d'Antonin",
      "Actes des Conciles de Carthage de Saint Cyprien et Saint Augustin",
    ],
        tunisRole: "Tunes : Municipe romain florissant rattaché au ressort consulaire de Julia Carthago. Carrefour routier impérial majeur où convergeaient les grandes voies d'Afrique vers Sicca Veneria (Le Kef) et Theveste, ainsi que le tracé magistral de l'Aqueduc de Zaghouan.",
    lineagesSummary: "Formule tripartite romaine classique du Tria Nomina (praenomen, nomen, cognomen) gravée sur des dizaines de milliers de cippes funéraires et tables patronales recensées au Corpus Inscriptionum Latinarum (CIL VIII).",
    notableLeaders: [
      {
            "name": "Septime Sévère",
            "arabicName": "سبتيموس سيفيروس",
            "role": "Empereur Romain d'Afrique",
            "reignOrDates": "193 – 211 ap. J.-C.",
            "achievements": "Premier empereur romain d'origine africaine, octroie le statut de municipe ou colonie à de nombreuses cités proconsulaires."
      },
      {
            "name": "Gordien Ier & Gordien II",
            "arabicName": "الغورديانيون",
            "role": "Proconsuls d'Afrique & Empereurs",
            "reignOrDates": "238 ap. J.-C.",
            "achievements": "Proclamés empereurs romains par la jeunesse sénatoriale africaine à Thysdrus (amphithéâtre d'El Djem)."
      },
      {
            "name": "Scipion Émilien",
            "arabicName": "سكيبيو الإيميلي",
            "role": "Consul de la République Romaine",
            "reignOrDates": "146 av. J.-C.",
            "achievements": "Destructeur militaire de Byrsa et ordonnateur du tracé cadastral de la Fossa Regia bornant le territoire romain."
      },
      {
            "name": "Saint Cyprien",
            "arabicName": "القديس كبريانوس",
            "role": "Évêque et Docteur de Carthage",
            "reignOrDates": "200 – 258 ap. J.-C.",
            "achievements": "Père de l'Église d'Afrique, martyr sous Valérien, auteur des épîtres canoniques guidant la chrétienté occidentale."
      }
],
    notableFamilies: [
      {
            "name": "Patriciat Sénatorial Africain",
            "arabicName": "الأسر القنصلية الإفريقية",
            "role": "Propriétaires des grands latifundia",
            "origin": "Carthage, Utique et Dougga",
            "lineageNotes": "Grandes familles équestres et sénatoriales détenant les plaines céréalières de la Medjerda."
      },
      {
            "name": "Gens Caecilia de Thugga",
            "arabicName": "آل سيسيليوس بدقة",
            "role": "Bienfaiteurs et duovirs municipaux",
            "origin": "Thugga (Dougga)",
            "lineageNotes": "Élites romano-numides mécènes ayant financé l'érection du Capitole et du Théâtre de Dougga."
      },
      {
            "name": "Patriciens d'Hadrumète & Thysdrus",
            "arabicName": "أعيان حضرموت وتيسدروس",
            "role": "Exportateurs de l'huile d'olive de Byzacène",
            "origin": "Sousse (Hadrumetum) / El Djem",
            "lineageNotes": "Commanditaires des fastueuses demeures aux mosaïques exposées aujourd'hui au Bardo et à Sousse."
      }
],
keySites: [
      { name: "Hadrumetum (Sousse)", arabicName: "حضرموت / سوسة", coords: [35.8288, 10.6406], role: "Capitale de la province de Byzacène", zoomLevel: 13 },
      { name: "Thysdrus (El Jem)", arabicName: "قصر الجم", coords: [35.3, 10.71], role: "Colisée colossal et capitale oléicole romaine", zoomLevel: 13 },
      { name: "Sufetula (Sbeïtla)", arabicName: "سبيطلة", coords: [35.2333, 9.1167], role: "Temples du Capitole et siège du patrice Grégoire", zoomLevel: 13 },
      { name: "Zaghouan (Ziqua)", arabicName: "زغوان", coords: [36.4028, 10.1433], role: "Temple des Eaux et départ de l'aqueduc de Carthage", zoomLevel: 13 },
    ],
  },
  {
    id: "vandale_byzantine",
    stepNumber: 3,
    year: 439,
    displayPeriod: "439 – 647 / 698",
    title: "Époque Vandale & Restauration Byzantine",
    arabicTitle: "العهد الوندالي والاستعادة البيزنطية لإفريقية",
    empire: "Regnum Vandalorum puis Exarchat d'Afrique (Byzance)",
    devletName: "Empire Byzantin / Exarchatus Africae",
    tunisiaEntityName: "Exarchat de Carthage & Forteresses d'Afrique",
    capital: "Carthage (قرطاج)",
    capitalCoords: [36.8528, 10.3233],
    overviewCenter: [35.5, 9.8],
    overviewZoom: 7,
    fillColor: "#b45309",
    borderColor: "#78350f",
    description:
      "Genséric établit le royaume vandale en 439. En 533, Bélisaire reconquiert Carthage pour l'empereur Justinien. Construction d'un puissant réseau de forteresses byzantines (Haïdra, Kélibia, Tébessa, Sbeïtla).",
    treatiesAndBorders:
      "L'Exarchat de Carthage s'étend des côtes tunisiennes jusqu'à la Tripolitaine et la Sardaigne.",
    divisionsTitle: "Duchés Militaires & Éparchies Byzantines",
    administrativeDivisions: [
      { id: "carthage_exarch", name: "Siège de l'Exarchat", arabicName: "حاضرة قرطاج", seat: "Carthage", coords: [36.8528, 10.3233], description: "Résidence de l'Exarque impérial." },
      { id: "byzacena_byz", name: "Duché Militaire de Byzacène", arabicName: "دوقية بيزاسينا", seat: "Sufetula (Sbeïtla)", coords: [35.2333, 9.1167], description: "Forteresses du patrice Grégoire." },
      { id: "limes_tripoli", name: "Duché de Tripolitaine", arabicName: "دوقية طرابلس", seat: "Tacape / Leptis", coords: [33.8815, 10.0982], description: "Ligne de surveillance sud-est." },
    ],
    eraTribes: [
      {
        id: "maures_byz",
        name: "Maures & Leuathae",
        arabicName: "قبائل المور واللواتة",
        capital: "Djebel Oueslat / Byzacène",
        homelandDescription: "Grandes confédérations berbères rétives à l'autorité byzantine sous Antalas et Cabaon.",
        fractions: ["Leuathae", "Frexes", "Astrices"],
        alliances: "Guerres maures contre Solomon et Jean Troglita.",
        archivalCotes: ["La Johannide de Corippe (VIe siècle)", "Tablettes Albertini"],
        center: [35.6, 9.5],
        zoom: 8.5,
        color: "#6366f1",
        polygon: [[35.9, 9.1], [35.85, 9.9], [35.3, 9.85], [35.35, 9.15]],
        whereaboutsSquare: [[35.2, 9.0], [36.0, 9.0], [36.0, 10.0], [35.2, 10.0]],
      },
    ],
    borderPolygon: [
      [37.25, 8.6], [37.35, 9.9], [36.95, 11.15], [35.4, 11.05],
      [34.5, 10.7], [33.8, 10.4], [33.1, 9.5], [34.5, 8.5],
      [35.5, 8.4], [36.5, 8.3],
    ],
    archivalSources: [
      "Tablettes Albertini (45 actes notariés sur bois découverts près de Tébessa)",
      "La Johannide de Corippe (épopée byzantine sur les guerres maures en Tunisie)",
      "Procope de Césarée — Histoire de la guerre des Vandales",
    ],
        tunisRole: "Tunes : Point d'appui fortifié gardant l'accès méridional à la lagune de Carthage. Poste militaire stratégique contrôlé par les ducs byzantins d'Afrique pour prévenir les raids des chameliers maures de la Dorsale.",
    lineagesSummary: "Chartes patrimoniales de l'Exarchat de Carthage, actes des conciles ecclésiastiques et novelles impériales consignant les privilèges de l'aristocratie romano-byzantine et les traités avec les ducs berbères.",
    notableLeaders: [
      {
            "name": "Genséric",
            "arabicName": "جنسريق",
            "role": "Roi des Vandales et des Alains",
            "reignOrDates": "428 – 477 ap. J.-C.",
            "achievements": "Prend Carthage en 439, fonde le Royaume vandale d'Afrique et domine la Méditerranée occidentale pendant 40 ans."
      },
      {
            "name": "Justinien Ier le Grand",
            "arabicName": "جستنيان الأول",
            "role": "Empereur Byzantin",
            "reignOrDates": "527 – 565 ap. J.-C.",
            "achievements": "Promulgue la Reconquête de l'Afrique en 533 et instaure la Préfecture prétorienne d'Afrique."
      },
      {
            "name": "Bélisaire",
            "arabicName": "بيليزاريوس",
            "role": "Généralissime d'Orient",
            "reignOrDates": "533 – 534 ap. J.-C.",
            "achievements": "Annihile l'armée vandale aux batailles de l'Ad Decimum et Tricaméron, rétablissant Carthage sous l'autorité impériale."
      },
      {
            "name": "Grégoire le Patrice (Djordjir)",
            "arabicName": "جرجير / غريغوريوس",
            "role": "Exarque d'Afrique",
            "reignOrDates": "641 – 647 ap. J.-C.",
            "achievements": "Proclame l'indépendance de l'Afrique vis-à-vis de Byzance et transfère sa capitale à Sufétula (Sbeïtla)."
      }
],
    notableFamilies: [
      {
            "name": "Dynastie Hasdingue",
            "arabicName": "الأسرة الهاسدنكية",
            "role": "Maison royale vandale d'Afrique",
            "origin": "Carthage et Radès",
            "lineageNotes": "Lignée royale germanique arienne (Genséric, Hunéric, Gunthamund, Thrasamund, Hildéric, Gélimer)."
      },
      {
            "name": "Aristocratie Patristique Byzantine",
            "arabicName": "الأعيان البيزنطيون بإفريقية",
            "role": "Tribuns militaires et préfets du prétoire",
            "origin": "Carthage, Kelibia et Sufétula",
            "lineageNotes": "Patriciens grecs et latins administrant les fortifications du limes byzantin."
      },
      {
            "name": "Rois Maures Autonomes",
            "arabicName": "ملوك المور الأمازيغ",
            "role": "Chefs tribaux de l'intérieur",
            "origin": "Dorsale tunisienne et Aurès",
            "lineageNotes": "Dynasties berbères d'Antalas, Cabaon et Iaudas ayant défié puis composé avec les exarques byzantins."
      }
],
keySites: [
      { name: "Carthage (Basiliques chrétiennes)", coords: [36.8528, 10.3233], role: "Capitale de l'Exarchat", zoomLevel: 13 },
      { name: "Sufetula (Sbeïtla)", coords: [35.2333, 9.1167], role: "Bataille décisive de 647 face aux armées musulmanes", zoomLevel: 13 },
      { name: "Kelibia (Fortresse)", coords: [36.85, 11.1], role: "Bastion maritime byzantin", zoomLevel: 13 },
    ],
  },
  {
    id: "omeyyade",
    stepNumber: 4,
    year: 647,
    displayPeriod: "647 – 800",
    title: "Califat Omeyyade & Aube de l'Islam",
    arabicTitle: "الخلافة الأموية وولاية إفريقية (تأسيس القيروان)",
    empire: "Califat Omeyyade de Damas",
    devletName: "Al-Khilafa Al-Umawiyya (Califat Omeyyade)",
    tunisiaEntityName: "Wilayat Ifriqiya (ولاية إفريقية)",
    capital: "Kairouan (القيروان)",
    capitalCoords: [35.6781, 10.0963],
    overviewCenter: [35.5, 10.0],
    overviewZoom: 6.8,
    fillColor: "#15803d",
    borderColor: "#14532d",
    description:
      "Arrivée de l'Islam au Maghreb. Victoire de Sufetula en 647, fondation de Kairouan en 670 par Oqba Ibn Nafi, fondation de la Mosquée Zitouna de Tunis en 698 par Hassan Ibn al-Nouman. Kairouan devient la capitale de tout l'Occident musulman.",
    treatiesAndBorders:
      "La Wilayat Ifriqiya englobe le Maghreb oriental et sert de base de départ pour la conquête de l'Andalousie (Tariq Ibn Ziyad et Moussa Ibn Nouçair en 711).",
    divisionsTitle: "Kouras & Districts de la Wilayat d'Ifriqiya",
    administrativeDivisions: [
      { id: "koura_kairouan", name: "Koura de Kairouan", arabicName: "كورة القيروان", seat: "Kairouan", coords: [35.6781, 10.0963], description: "Centre de gouvernement de la Wilaya d'Ifriqiya." },
      { id: "koura_tunis", name: "Koura de Tunis", arabicName: "كورة تونس والزيتونة", seat: "Tunis", coords: [36.8065, 10.1815], description: "Arsenal maritime et Grande Mosquée Zitouna." },
      { id: "koura_sousse", name: "Koura de Sousse", arabicName: "كورة سوسة", seat: "Sousse", coords: [35.8288, 10.6406], description: "Ribat et port naval de départ pour la Méditerranée." },
      { id: "koura_djerid", name: "Koura du Djerid & Gafsa", arabicName: "كورة قسطيلية وقفصة", seat: "Qastiliya (Tozeur)", coords: [33.9197, 8.1336], description: "Oasis stratégiques d'Ifriqiya méridionale." },
    ],
    eraTribes: [
      {
        id: "berberes_lawata",
        name: "Lawata & Houara",
        arabicName: "قبائل لواتة وهوّارة",
        capital: "Gafsa / Kairouan",
        homelandDescription: "Grandes tribus berbères d'Ifriqiya intégrant les armées de l'Islam et adoptant l'arabisation.",
        fractions: ["Lawata de la plaine", "Houara des oasis", "Zenata"],
        alliances: "Participation aux campagnes d'Oqba et de Moussa Ibn Nouçair.",
        archivalCotes: ["Futuh Ifriqiya d'Al-Waqidi", "Tarikh Ibn Khaldoun"],
        center: [34.8, 9.5],
        zoom: 8.5,
        color: "#059669",
        polygon: [[35.2, 9.1], [35.15, 9.9], [34.4, 9.8], [34.45, 9.1]],
        whereaboutsSquare: [[34.3, 8.95], [35.35, 8.95], [35.35, 10.05], [34.3, 10.05]],
      },
    ],
    outerEmpirePolygon: [
      [42.0, -9.0], [44.0, 15.0], [36.0, 45.0], [30.0, 60.0],
      [22.0, 40.0], [28.0, 20.0], [30.0, -10.0],
    ],
    borderPolygon: [
      [37.2, 8.5], [37.3, 9.9], [36.9, 11.15], [35.5, 11.1],
      [34.7, 10.8], [33.9, 10.4], [32.8, 11.5], [31.8, 10.0],
      [33.5, 8.2], [35.0, 8.2], [36.5, 8.0],
    ],
    archivalSources: [
      "Chroniques de Futuh Ifriqiya et récits d'Ibn Abd al-Hakam",
      "Fondations épigraphiques de la Grande Mosquée de Kairouan (670)",
      "Inscriptions coufiques primitives de la Mosquée Zitouna de Tunis (698)",
    ],
        tunisRole: "Fondation historique de Tunis islamique : En 698, Hassan Ibn al-Nou'man détruit Carthage byzantine et érige Tunis à l'abri des flottes ennemies. Il fait creuser le chenal vers La Goulette, établit le grand arsenal naval (Dar al-Sina'a) et commence l'édification de la Mosquée Zitouna.",
    lineagesSummary: "Registres du Diwan al-Jund de Kairouan consignant nominativement les bannières tribales arabes (Mudarites, Yéménites, Banu Fihr) et les chefs de confédérations berbères islamisées intégrés dans les armées de conquête.",
    notableLeaders: [
      {
            "name": "Hassan Ibn al-Nou'man",
            "arabicName": "حسان بن النعمان الأزدي",
            "role": "Gouverneur & Bâtisseur de Tunis",
            "reignOrDates": "692 – 703 ap. J.-C.",
            "achievements": "Conquiert Carthage, fonde officiellement la ville musulmane de Tunis, creuse son port intérieur et bâtit la Zitouna."
      },
      {
            "name": "Oqba Ibn Nafi al-Fihri",
            "arabicName": "عقبة بن نافع الفهري",
            "role": "Conquérant d'Ifriqiya & Fondateur",
            "reignOrDates": "670 – 683 ap. J.-C.",
            "achievements": "Fonde la cité sainte de Kairouan en 670 et sa Grande Mosquée, point d'ancrage de la civilisation islamique au Maghreb."
      },
      {
            "name": "Moussa Ibn Nouceyr",
            "arabicName": "موسى بن نصير",
            "role": "Gouverneur Général du Maghreb",
            "reignOrDates": "705 – 714 ap. J.-C.",
            "achievements": "Pacifie définitivement l'Ifriqiya, arme la flotte de Tunis et organise la conquête d'Al-Andalus avec Tariq Ibn Ziyad."
      },
      {
            "name": "Dihya (La Kahina)",
            "arabicName": "ديهيا الكاهنة",
            "role": "Reine des Berbères Djeraoua",
            "reignOrDates": "688 – 702 ap. J.-C.",
            "achievements": "Figure emblématique de la souveraineté amazighe, unifie les tribus du Sud et des Aurès face aux armées omeyyades."
      }
],
    notableFamilies: [
      {
            "name": "Maison des Fihrides",
            "arabicName": "الأسرة الفهرية",
            "role": "Gouverneurs et généraux d'Ifriqiya",
            "origin": "Kairouan et Médina de Tunis",
            "lineageNotes": "Descendants directs d'Oqba Ibn Nafi ayant dirigé les expéditions en Ifriqiya et en Espagne musulmane."
      },
      {
            "name": "Noblesse Quraychite d'Ifriqiya",
            "arabicName": "أشراف قريش بإفريقية",
            "role": "Cadis et commandants de garnison",
            "origin": "Kairouan et Tunis",
            "lineageNotes": "Lignées de Banu Makhzum et Banu Zuhra installées dans les camps militaires d'Ifriqiya."
      },
      {
            "name": "Chefferies Awerba & Djeraoua",
            "arabicName": "أمراء أوربة وجراوة",
            "role": "Chefs tribaux autochtones confédérés",
            "origin": "Hautes steppes et Aurès",
            "lineageNotes": "Grandes familles berbères de Kusayla et Dihya ayant ensuite forgé les armées musulmanes du Maghreb."
      }
],
keySites: [
      { name: "Kairouan (Grande Mosquée Okba)", arabicName: "القيروان", coords: [35.6781, 10.0963], role: "Capitale de la conquête islamique du Maghreb", zoomLevel: 13 },
      { name: "Tunis (Mosquée Zitouna)", arabicName: "تونس جامع الزيتونة", coords: [36.7978, 10.1711], role: "Fondation de l'arsenal et de l'université Zitouna", zoomLevel: 13 },
      { name: "Ribat de Sousse", arabicName: "رباط سوسة", coords: [35.8288, 10.6406], role: "Sentinelle côtière contre les raids byzantins", zoomLevel: 13 },
    ],
  },
  {
    id: "aghlabide",
    stepNumber: 5,
    year: 800,
    displayPeriod: "800 – 909",
    title: "Émirat Aghlabide d'Ifriqiya",
    arabicTitle: "الدولة الأغلبية بإفريقية وعاصمتها القيروان",
    empire: "Émirat Souverain des Banu al-Aghlab",
    devletName: "Imarat Al-Aghaliba (Émirat Aghlabide)",
    tunisiaEntityName: "Ifriqiya Aghlabide & Conquête de la Sicile",
    capital: "Kairouan / Raqqada",
    capitalCoords: [35.6781, 10.0963],
    overviewCenter: [35.2, 10.2],
    overviewZoom: 6.8,
    fillColor: "#d97706",
    borderColor: "#92400e",
    description:
      "Ibrahim Ibn al-Aghlab fonde une dynastie souveraine d'Ifriqiya en 800. Âge d'or scientifique et architectural : Bassins des Aghlabides, conquête de la Sicile (827–831), fondation de Raqqada.",
    treatiesAndBorders:
      "L'émirat s'étend de Constantine à Tripoli et contrôle la Sicile, Malte et le détroit de Sicile.",
    divisionsTitle: "Kouras Aghlabides d'Ifriqiya",
    administrativeDivisions: [
      { id: "kairouan_raqqada", name: "Capitale Kairouan & Raqqada", arabicName: "حاضرة القيروان ورقادة", seat: "Raqqada", coords: [35.6014, 10.0617], description: "Siège des palais émiriens et des grands juristes malékites (Sahnoun)." },
      { id: "sahel_ribats", name: "Région des Ribats du Sahel", arabicName: "إقليم الرباطات بالساحل", seat: "Monastir / Sousse", coords: [35.7758, 10.8328], description: "Ribats spirituels et arsenaux maritimes aghlabides." },
      { id: "sfax_ports", name: "Koura de Sfax", arabicName: "كورة صفاقس", seat: "Sfax", coords: [34.7406, 10.7603], description: "Remparts fortifiés et exportations maritimes." },
      { id: "beja_cereales", name: "Koura de Béja", arabicName: "كورة باجة", seat: "Béja", coords: [36.7256, 9.1817], description: "Centre de production céréalière du Tell." },
    ],
    eraTribes: [
      {
        id: "arabes_jund",
        name: "Jund Arabe & Notables Kairouanais",
        arabicName: "الجند العربي وأعيان القيروان",
        capital: "Kairouan",
        homelandDescription: "Familles du Jund arabe d'origine abbasside et juristes malékites fondateurs.",
        fractions: ["Banu Tamim", "Banu Asad", "Notables de la Maqsura"],
        alliances: "Soutien au pouvoir émirien aghlabide.",
        archivalCotes: ["Al-Mudawwana d'Al-Imam Sahnoun (Kairouan)", "Parchemins de la Maqsura"],
        center: [35.68, 10.1],
        zoom: 8.5,
        color: "#16a34a",
        polygon: [[35.95, 9.8], [35.9, 10.35], [35.45, 10.3], [35.48, 9.85]],
        whereaboutsSquare: [[35.35, 9.7], [36.05, 9.7], [36.05, 10.45], [35.35, 10.45]],
      },
    ],
    outerEmpirePolygon: [
      [38.5, 7.0], [39.0, 16.0], [36.5, 16.5], [32.0, 14.0],
      [31.0, 7.5], [36.0, 6.0],
    ],
    borderPolygon: [
      [37.2, 8.5], [37.3, 9.9], [36.9, 10.4], [36.9, 11.15],
      [35.5, 11.1], [34.7, 10.8], [33.9, 10.4], [32.8, 11.5],
      [31.8, 10.0], [33.5, 8.2], [35.0, 8.2], [36.5, 8.0],
    ],
    archivalSources: [
      "Manuscrit du Coran bleu de Kairouan et parchemins de la Maqsura",
      "Chroniques d'Ibn al-Athir et d'Al-Nuwayri",
      "Al-Mudawwana de l'Imam Sahnoun (code du fiqh malékite d'Ifriqiya)",
    ],
        tunisRole: "Tunis s'impose comme le pôle naval et universitaire majeur de l'Ifriqiya. En 864, sous l'émir Ziyadat Allah Ier et l'architecte Fath, la Mosquée Zitouna est entièrement reconstruite dans son architecture magistrale actuelle. Les chantiers navals de La Goulette arment la flotte qui conquiert la Sicile.",
    lineagesSummary: "Chaînes de transmission juridique (Isnad) des maîtres malékites de Kairouan et de Tunis, actes de fondation des Habous fonciers et testaments notariés enregistrés sous l'autorité du Grand Cadi Sahnoun.",
    notableLeaders: [
      {
            "name": "Ibrahim Ier Ibn al-Aghlab",
            "arabicName": "إبراهيم بن الأغلب التميمي",
            "role": "Émir Fondateur de la Dynastie",
            "reignOrDates": "800 – 812 ap. J.-C.",
            "achievements": "Fonde l'Émirat souverain d'Ifriqiya reconnu par le calife abbasside Haroun al-Rachid et bâtit la cité d'al-Abbasiyya."
      },
      {
            "name": "Ziyadat Allah Ier",
            "arabicName": "زيادة الله الأول",
            "role": "Émir d'Ifriqiya & Conquérant",
            "reignOrDates": "817 – 838 ap. J.-C.",
            "achievements": "Reconstruit avec splendeur la Mosquée de Kairouan et la Zitouna de Tunis, et ordonne la conquête de la Sicile (827)."
      },
      {
            "name": "Imam Sahnoun Ibn Saïd",
            "arabicName": "الإمام سحنون بن سعيد التنوخي",
            "role": "Grand Cadi de Kairouan & Juriste Suprême",
            "reignOrDates": "848 – 854 ap. J.-C.",
            "achievements": "Auteur de la célèbre Mudawwana, texte doctrinal cardinal fondateur de l'école malékite dans tout le Maghreb et Al-Andalus."
      },
      {
            "name": "Asad Ibn al-Furat",
            "arabicName": "أسد بن الفرات",
            "role": "Savant, Magistrat & Chef d'Armée",
            "reignOrDates": "759 – 828 ap. J.-C.",
            "achievements": "Disciple de Malik et d'Abou Hanifa, commande victorieusement le débarquement militaire en Sicile à Mazara del Vallo."
      }
],
    notableFamilies: [
      {
            "name": "Dynastie des Banu al-Aghlab",
            "arabicName": "بنو الأغلب التميميون",
            "role": "Émirs souverains d'Ifriqiya",
            "origin": "Kairouan / Raqqada",
            "lineageNotes": "Lignée princière originaire de Khorassan ayant régné pendant plus d'un siècle sur la Tunisie et la Sicile."
      },
      {
            "name": "Maison des Tanukhis (Famille de Sahnoun)",
            "arabicName": "آل سحنون التنوخيون",
            "role": "Jurisconsultes et oulémas de l'Ifriqiya",
            "origin": "Kairouan et Tunis",
            "lineageNotes": "Lignée d'imams et cadis ayant fixé la jurisprudence malékite et dirigé l'enseignement à la Zitouna."
      },
      {
            "name": "Banu Qadim de Tunis",
            "arabicName": "بنو قادم بتونس",
            "role": "Armateurs et gouverneurs de la ville de Tunis",
            "origin": "Médina de Tunis",
            "lineageNotes": "Grandes familles patriciennes tunisoises administrant le port, l'arsenal et le négoce maritime avec l'Italie."
      }
],
keySites: [
      { name: "Kairouan (Bassins des Aghlabides)", coords: [35.6781, 10.0963], role: "Capitale politique et phare intellectuel", zoomLevel: 13 },
      { name: "Raqqada", coords: [35.6014, 10.0617], role: "Cité palatiale des souverains aghlabides", zoomLevel: 13 },
      { name: "Ribat de Monastir", coords: [35.7758, 10.8328], role: "Forteresse côtière spirituelle et militaire", zoomLevel: 13 },
    ],
  },
  {
    id: "fatimide",
    stepNumber: 6,
    year: 909,
    displayPeriod: "909 – 1159",
    title: "Califat Fatimide & Dynastie Ziride",
    arabicTitle: "الخلافة الفاطمية بالمهدية والدولة الزيرية بصبرة المنصورية",
    empire: "Califat Fatimide d'Ifriqiya puis Émirat Ziride",
    devletName: "Al-Khilafa Al-Fatimiyya (Califat Fatimide)",
    tunisiaEntityName: "Ifriqiya Fatimide puis Émirat Ziride",
    capital: "Mahdia (المهدية) / Al-Mansouria",
    capitalCoords: [35.5047, 11.0622],
    overviewCenter: [35.5, 10.5],
    overviewZoom: 7,
    fillColor: "#0f766e",
    borderColor: "#134e4a",
    description:
      "Proclamation du Califat Fatimide en 909 par Ubayd Allah al-Mahdi. Fondation de la capitale fortifiée de Mahdia en 916 (Skifa Kahla). Après le départ des Fatimides pour Le Caire en 969, la Tunisie est gouvernée par les Zirides (Sabra Al-Mansouria). Vers 1051, la migration hilalienne transforme le peuplement.",
    treatiesAndBorders:
      "Contrôle de tout le Maghreb oriental avant la conquête de l'Égypte, de la Syrie et du Hedjaz.",
    divisionsTitle: "Amilates Fatimides & Principautés Zirides",
    administrativeDivisions: [
      { id: "mahdia_core", name: "Capitale Impériale de Mahdia", arabicName: "حاضرة المهدية المعمورة", seat: "Mahdia", coords: [35.5047, 11.0622], description: "Presqu'île fortifiée de la Skifa Kahla et port califal." },
      { id: "sabra_mansouria", name: "Sabra Al-Mansouria", arabicName: "صبرة المنصورية", seat: "Kairouan Sud", coords: [35.66, 10.12], description: "Cité princière ziride aux portes de Kairouan." },
      { id: "sfax_zirid", name: "Principauté de Sfax", arabicName: "إمارة صفاقس", seat: "Sfax", coords: [34.7406, 10.7603], description: "Remparts majestueux et flotte marchande." },
      { id: "gabes_oasis", name: "Amilate de Gabès", arabicName: "عمالة قابس", seat: "Gabès", coords: [33.8815, 10.0982], description: "Carrefour maritime et caravanier." },
    ],
    eraTribes: [
      {
        id: "sanhadja_zirid",
        name: "Sanhadja & Zirides",
        arabicName: "صنهاجة وبنو زيري",
        capital: "Sabra Al-Mansouria",
        homelandDescription: "Grande dynastie berbère sanhadjienne régnant sur l'Ifriqiya avec faste et bravoure.",
        fractions: ["Banu Ziri", "Banu Hammad", "Talkata"],
        alliances: "Dynastie régnante ziride.",
        archivalCotes: ["Ibn Hayyan — Al-Muqtabis", "Ibn Khaldoun — Histoire des Berbères"],
        center: [35.65, 10.15],
        zoom: 8.5,
        color: "#0284c7",
        polygon: [[35.85, 9.9], [35.8, 10.45], [35.4, 10.4], [35.45, 9.9]],
        whereaboutsSquare: [[35.3, 9.8], [35.95, 9.8], [35.95, 10.55], [35.3, 10.55]],
      },
      {
        id: "banu_hilal",
        name: "Banu Hilal & Banu Sulaym",
        arabicName: "بنو هلال وبنو سليم",
        capital: "Plaine de Kairouan / Sbeïtla",
        homelandDescription: "Grandes confédérations arabes nomades installées en Ifriqiya dès 1051, recomposant le tissu tribal.",
        fractions: ["Athbaj", "Riyāh", "Zoghba", "Banu Ali"],
        alliances: "Épopée hilalienne (Taghribat Bani Hilal).",
        archivalCotes: ["Sirat Bani Hilal manuscrite", "Récits d'Ibn al-Athir"],
        center: [35.3, 9.6],
        zoom: 8.5,
        color: "#ea580c",
        polygon: [[35.7, 9.2], [35.65, 10.1], [34.9, 10.05], [34.95, 9.25]],
        whereaboutsSquare: [[34.8, 9.1], [35.8, 9.1], [35.8, 10.2], [34.8, 10.2]],
      },
    ],
    outerEmpirePolygon: [
      [36.0, 5.0], [38.0, 15.0], [34.0, 36.0], [24.0, 40.0],
      [22.0, 30.0], [28.0, 10.0],
    ],
    borderPolygon: [
      [37.25, 8.8], [37.3, 9.9], [36.9, 11.15], [35.5, 11.05],
      [34.7, 10.8], [33.5, 10.8], [33.0, 9.8], [34.2, 8.4],
      [35.8, 8.5], [36.8, 8.5],
    ],
    archivalSources: [
      "Inscriptions coufiques monumentales de la Skifa Kahla de Mahdia (916)",
      "Écrits d'Ibn Hammad et Ibn Hayyan sur les Zirides de Sabra Al-Mansouria",
      "Fonds des décrets fatimides sur les pêcheries de Mahdia et Kerkennah",
    ],
        tunisRole: "Émancipation et royauté des Banu Khourassan : Face au déclin de Kairouan dévastée par les Hilaliens en 1057, Tunis devient une principauté souveraine et indépendante sous la dynastie des Banu Khourassan (1059–1159). La ville s'entoure de remparts puissants et érige le Palais du Dar El-Khourassani.",
    lineagesSummary: "Registres de chancellerie fatimide conservés dans les dépôts de Mahdia et la Genizah du Caire, actes notariés des cadis de Tunis et chroniques des alliances tribales Sanhadja, Ketama et Banu Hilal.",
    notableLeaders: [
      {
            "name": "Ubayd Allah al-Mahdi",
            "arabicName": "عبيد الله المهدي",
            "role": "Premier Calife Fatimide",
            "reignOrDates": "909 – 934 ap. J.-C.",
            "achievements": "Fonde le Califat fatimide en Ifriqiya et bâtit la cité maritime imprenable de Mahdia en 916."
      },
      {
            "name": "Al-Mu'izz li-Din Allah",
            "arabicName": "المعز لدين الله الفاطمي",
            "role": "Calife Conquérant de l'Égypte",
            "reignOrDates": "953 – 975 ap. J.-C.",
            "achievements": "Conquiert l'Égypte en 969, fonde Le Caire et la Mosquée Al-Azhar, confiant le gouvernement de l'Ifriqiya aux Zirides."
      },
      {
            "name": "Bologhine Ibn Ziri",
            "arabicName": "بلكين بن زيري الصنهاجي",
            "role": "Émir Souverain d'Ifriqiya",
            "reignOrDates": "972 – 984 ap. J.-C.",
            "achievements": "Fondateur de la prestigieuse dynastie ziride régnant sur le Maghreb central et l'Ifriqiya depuis Mansouria."
      },
      {
            "name": "Al-Mu'izz Ibn Badis",
            "arabicName": "المعز بن باديس الزيري",
            "role": "Émir Ziride Restaurateur du Sunnisme",
            "reignOrDates": "1016 – 1062 ap. J.-C.",
            "achievements": "Rompt spectaculairement avec le califat chiite fatimide en 1048 pour proclamer l'allégeance au calife sunnite abbasside."
      }
],
    notableFamilies: [
      {
            "name": "Dynastie des Zirides Sanhadja",
            "arabicName": "بنو زيري الصنهاجيون",
            "role": "Princes régnant à Mansouria et Mahdia",
            "origin": "Achir / Mahdia",
            "lineageNotes": "Lignée royale berbère sanhadja ayant gouverné l'Ifriqiya pendant près de deux siècles."
      },
      {
            "name": "Dynastie des Banu Khourassan",
            "arabicName": "بنو خراسان ملوك تونس",
            "role": "Princes indépendants de la ville de Tunis",
            "origin": "Médina de Tunis (Dar El-Khourassani)",
            "lineageNotes": "Souverains éclairés de Tunis (1059–1159) ayant protégé la cité et développé les comptoirs marchands."
      },
      {
            "name": "Chefferies Hilaliennes (Riyah & Zoghba)",
            "arabicName": "أمراء بني هلال (رياح وزغبة)",
            "role": "Confédérations guerrières bédouines",
            "origin": "Plaines de Kairouan et steppes",
            "lineageNotes": "Lignées arabes bédouines ayant transformé l'arabisation linguistique et le peuplement des plaines tunisiennes."
      }
],
keySites: [
      { name: "Mahdia", arabicName: "المهدية", coords: [35.5047, 11.0622], role: "Première capitale califale fatimide (916)", zoomLevel: 13 },
      { name: "Al-Mansouria (Sabra)", coords: [35.66, 10.12], role: "Capitale princière ziride", zoomLevel: 13 },
      { name: "Sfax", coords: [34.7406, 10.7603], role: "Remparts zirides et grand port marchand", zoomLevel: 13 },
    ],
  },
  {
    id: "almohade",
    stepNumber: 7,
    year: 1159,
    displayPeriod: "1159 – 1228",
    title: "Période Almohade du Grand Maghreb",
    arabicTitle: "العهد الموحدي وتوحيد بلاد المغرب والأندلس",
    empire: "Califat Almohade (Al-Muwahhidun)",
    devletName: "Al-Dawla Al-Muwahhidiyya (Empire Almohade)",
    tunisiaEntityName: "Province d'Ifriqiya sous Gouvernorat Almohade",
    capital: "Tunis / Marrakech",
    capitalCoords: [36.8065, 10.1815],
    overviewCenter: [35.5, 9.8],
    overviewZoom: 7,
    fillColor: "#4d7c0f",
    borderColor: "#365314",
    description:
      "Abd al-Mumin unifie tout le Maghreb et Al-Andalus. Tunis est libérée de l'occupation normande en 1159 et devient la capitale administrative de l'Ifriqiya sous l'autorité des gouverneurs Almohades, ancêtres des Hafsides.",
    treatiesAndBorders:
      "Empire colossal s'étendant de Séville et Marrakech jusqu'à Tripoli.",
    divisionsTitle: "Gouvernorats des Cheikhs Almohades",
    administrativeDivisions: [
      { id: "tunis_almohad", name: "Gouvernorat de Tunis", arabicName: "عمالة تونس", seat: "Tunis", coords: [36.8065, 10.1815], description: "Résidence du gouverneur almohade Abou Mohamed Abd al-Wahid." },
      { id: "mahdia_liberee", name: "Mahdia Reconquise", arabicName: "المهدية المحررة", seat: "Mahdia", coords: [35.5047, 11.0622], description: "Fin de l'occupation normande en 1159." },
      { id: "kairouan_almohad", name: "Kairouan", arabicName: "القيروان", seat: "Kairouan", coords: [35.6781, 10.0963], description: "Réorganisation des Habous." },
    ],
    eraTribes: [
      {
        id: "masmouda_hintata",
        name: "Hintata & Masmouda",
        arabicName: "هنتاتة ومصمودة",
        capital: "La Kasbah de Tunis",
        homelandDescription: "Aristocratie militaire et doctrinale almohade dont est issue la lignée des émirs hafsides.",
        fractions: ["Banu Hafs", "Hintata", "Tinmel"],
        alliances: "Cheikhs fondateurs de la dynastie hafside.",
        archivalCotes: ["Kitab al-Ansab d'Ibn al-Qattan", "Documents almohades de la Zitouna"],
        center: [36.79, 10.16],
        zoom: 8.5,
        color: "#84cc16",
        polygon: [[36.95, 9.9], [36.9, 10.4], [36.6, 10.35], [36.65, 9.95]],
        whereaboutsSquare: [[36.5, 9.8], [37.05, 9.8], [37.05, 10.5], [36.5, 10.5]],
      },
    ],
    borderPolygon: [
      [37.2, 8.5], [37.3, 9.9], [36.9, 11.15], [35.5, 11.1],
      [34.7, 10.8], [33.5, 10.8], [33.0, 9.8], [34.5, 8.2],
      [36.5, 8.2],
    ],
    archivalSources: [
      "Traités d'Ibn Tumart et chartes almohades de Tunis",
      "Écrits d'Ibn al-Abbar sur l'Ifriqiya almohade",
    ],
        tunisRole: "Tunis devient officiellement la capitale d'Ifriqiya sous le gouverneur Cheikh Abd al-Wahid Ibn Abi Hafs. La Kasbah de Tunis est fondée pour abriter le commandement militaire et l'administration almohade, reléguant définitivement Mahdia et Kairouan au second plan.",
    lineagesSummary: "Registres de chancellerie impériale almohade de Tinmel et Séville, rôles des commandements militaires des Hintata et Masmouda, et chartes diplomatiques octroyées aux consuls de Pise et Gênes à Tunis.",
    notableLeaders: [
      {
            "name": "Abd al-Mu'min Ibn Ali",
            "arabicName": "عبد المؤمن بن علي الكومي",
            "role": "Premier Calife Almohade du Grand Maghreb",
            "reignOrDates": "1130 – 1163",
            "achievements": "Unifie l'ensemble de l'Afrique du Nord et Al-Andalus sous un seul empire, et libère Tunis et Mahdia de l'occupation normande en 1159."
      },
      {
            "name": "Abu Yusuf Yaqub al-Mansur",
            "arabicName": "أبو يوسف يعقوب المنصور",
            "role": "Calife Almohade Bâtisseur",
            "reignOrDates": "1184 – 1199",
            "achievements": "Vainqueur de la bataille d'Alarcos, protecteur du philosophe Ibn Ruchd (Averroès) et rénovateur des fortifications d'Ifriqiya."
      },
      {
            "name": "Cheikh Abd al-Wahid Ibn Abi Hafs",
            "arabicName": "الشيخ عبد الواحد بن أبي حفص",
            "role": "Gouverneur Almohade d'Ifriqiya",
            "reignOrDates": "1207 – 1221",
            "achievements": "Nommé par le calife al-Nasir pour pacifier l'Ifriqiya, il s'installe à Tunis et pose les fondations dynastiques des Hafsides."
      },
      {
            "name": "Yahya Ibn Ghaniya",
            "arabicName": "يحيى بن غانية الميورقي",
            "role": "Prince Almoravide Insurgé",
            "reignOrDates": "1184 – 1237",
            "achievements": "Chef de la résistance almoravide défiant le pouvoir almohade pendant un demi-siècle dans le Sud tunisien et le Djerid."
      }
],
    notableFamilies: [
      {
            "name": "Maison des Banu Hafs (Hintata)",
            "arabicName": "آل أبي حفص (هنتاتة)",
            "role": "Gouverneurs d'Ifriqiya et futurs Sultans",
            "origin": "Tinmel / Kasbah de Tunis",
            "lineageNotes": "Descendants de Cheikh Abou Hafs Omar, élite religieuse et militaire masmouda appelée à régner sur Tunis."
      },
      {
            "name": "Dynastie des Mouminides Almohades",
            "arabicName": "الأسرة المؤمنية",
            "role": "Califes universels de Marrakech et Séville",
            "origin": "Marrakech",
            "lineageNotes": "Lignée califale issue d'Abd al-Mu'min ayant instauré le recensement cadastral de tout le Maghreb."
      },
      {
            "name": "Banu Ghaniya Almoravides",
            "arabicName": "بنو غانية",
            "role": "Seigneurs nomades insoumis du Sud",
            "origin": "Baléares / Djerid et Gafsa",
            "lineageNotes": "Dernière branche princière almoravide maintenant la résistance nomade dans les oasis tunisiennes."
      }
],
keySites: [
      { name: "La Kasbah de Tunis", coords: [36.7992, 10.1661], role: "Résidence des gouverneurs almohades", zoomLevel: 13 },
      { name: "Mahdia", coords: [35.5047, 11.0622], role: "Libération navale de 1159", zoomLevel: 13 },
    ],
  },
  {
    id: "hafside",
    stepNumber: 8,
    year: 1228,
    displayPeriod: "1228 – 1574",
    title: "Sultanat Hafside de Tunis & Réfugiés Andalous",
    arabicTitle: "الدولة الحفصية بتونس والأندلسيون والمقدمة الخلدونية",
    empire: "Royaume Hafside de Tunis (Al-Dawla Al-Hafsiyya)",
    devletName: "Al-Dawla Al-Hafsiyya (Sultanat Hafside Souverain)",
    tunisiaEntityName: "Sultanat Hafside de Tunis & Ifriqiya",
    capital: "Tunis (تونس)",
    capitalCoords: [36.8065, 10.1815],
    overviewCenter: [35.5, 9.8],
    overviewZoom: 7,
    fillColor: "#ca8a04",
    borderColor: "#854d0e",
    description:
      "Abou Zakariya Yahya proclame l'indépendance hafside en 1228. Tunis devient la capitale rayonnante du Maghreb oriental. Accueil massif des réfugiés andalous, fondation de madrasas, naissance à Tunis d'Ibn Khaldoun (1332).",
    treatiesAndBorders:
      "Le sultanat s'étend de Constantine et Bougie à l'ouest jusqu'à Tripoli. Traités commerciaux signés avec Venise, Gênes, Pise, Florence et la France.",
    divisionsTitle: "Outans & Provinces Hafsides",
    administrativeDivisions: [
      { id: "outan_tunis", name: "Outan de Tunis & Sahel", arabicName: "أوطان تونس والساحل", seat: "Tunis (Dar El Sultan)", coords: [36.8065, 10.1815], description: "Cœur économique, madrasas et corporation des artisans andalous." },
      { id: "outan_kef", name: "Outan du Kef & Medjerda", arabicName: "وطن الكاف ومجردة", seat: "Le Kef (Al-Kaf)", coords: [36.1742, 8.7049], description: "Bastion défensif face aux émirs de l'Ouest." },
      { id: "outan_djerid", name: "Outan du Djerid", arabicName: "وطن الجريد", seat: "Tozeur", coords: [33.9197, 8.1336], description: "Zaouïas savantes et cadastre hydraulique d'Ibn Chabbat." },
      { id: "outan_gabes_djerba", name: "Outan de Gabès & Djerba", arabicName: "وطن قابس وجربة", seat: "Gabès", coords: [33.8815, 10.0982], description: "Défense contre les corsaires aragonais et espagnols." },
    ],
    eraTribes: [
      {
        id: "riah_hafside",
        name: "Confédération des Riah & Chabbia",
        arabicName: "قبائل رياح والشابية بالجريد",
        capital: "Tozeur / Kairouan",
        homelandDescription: "Grands chefs bédouins et spirituels soufis du Djerid et de la steppe centrale sous les Hafsides.",
        fractions: ["Awlad Chebbi", "Riah", "Banu Ali"],
        alliances: "Relations complexes entre alliance makhzen et autonomie oasienne.",
        archivalCotes: ["Ibn Khaldoun — Kitab al-Ibar", "Sijillats zitouniens"],
        center: [34.5, 8.8],
        zoom: 8.5,
        color: "#ea580c",
        polygon: [[34.9, 8.3], [34.85, 9.3], [34.1, 9.25], [34.15, 8.35]],
        whereaboutsSquare: [[34.0, 8.2], [35.0, 8.2], [35.0, 9.45], [34.0, 9.45]],
      },
      {
        id: "andalous_testour",
        name: "Morisques & Andalous de Tunis",
        arabicName: "الأندلسيون الموريسكيون بتستور والوطن القبلي",
        capital: "Testour / Zaghouan / Soliman",
        homelandDescription: "Savants, architectes et agriculteurs andalous accueillis par les sultans hafsides, créateurs d'oasis et de mosquées d'art.",
        fractions: ["Andalous de Testour", "Soliman", "Zaghouan", "Bardo"],
        alliances: "Privilèges royaux hafsides et habous.",
        archivalCotes: ["Actes notariés morisques de Testour", "Bibliothèque Nationale de Tunis"],
        center: [36.6, 9.8],
        zoom: 8.5,
        color: "#c2410c",
        polygon: [[36.8, 9.4], [36.75, 10.3], [36.35, 10.25], [36.4, 9.45]],
        whereaboutsSquare: [[36.25, 9.3], [36.9, 9.3], [36.9, 10.45], [36.25, 10.45]],
      },
    ],
    outerEmpirePolygon: [
      [38.0, 4.0], [39.0, 13.0], [36.0, 14.5], [32.0, 13.0],
      [31.0, 6.0], [36.0, 3.5],
    ],
    borderPolygon: [
      [37.2, 8.3], [37.3, 9.9], [36.85, 10.35], [36.9, 11.15],
      [35.5, 11.05], [34.7, 10.8], [33.9, 10.4], [32.8, 11.8],
      [32.0, 10.0], [33.6, 8.0], [35.5, 8.0], [36.8, 8.1],
    ],
    archivalSources: [
      "Manuscrits de la Bibliothèque Nationale de Tunisie (Fonds Zitouna)",
      "Traités diplomatiques hafsides conservés aux archives de Barcelone et Florence",
      "Actes notariés des Morisques andalous de Testour et Soliman",
      "La Muqaddima et l'Histoire des Berbères d'Ibn Khaldoun (né à Tunis en 1332)",
    ],
        tunisRole: "Âge d'or incontesté de Tunis : La ville devient la capitale souveraine suprême d'Ifriqiya. Édification monumentale de la Kasbah, création des premières Médersas (Ech-Chammaïyya, El-Mountaciriya), développement des remparts (Bab Souika, Bab El Jazira) et accueil de dizaines de milliers de savants andalous.",
    lineagesSummary: "Registres officiels des Adoul de la Kasbah, Sijills notariés du tribunal malékite de Tunis, chartes de fondation des Habous de la Zitouna et traités consulaires bilingues avec Venise, Gênes, la France et la Catalogne.",
    notableLeaders: [
      {
            "name": "Abu Zakariya Yahya Ier",
            "arabicName": "أبو زكريا يحيى الأول",
            "role": "Fondateur du Sultanat Hafside Indépendant",
            "reignOrDates": "1228 – 1249",
            "achievements": "Proclame la souveraineté complète de la Tunisie, fait de Tunis la capitale officielle, édifie la Médersa Ech-Chammaïyya."
      },
      {
            "name": "Al-Mustansir Billah",
            "arabicName": "المستنصر بالله الحفصي",
            "role": "Sultan & Calife Universel de Tunis",
            "reignOrDates": "1249 – 1277",
            "achievements": "Reconnu Calife de l'Islam par les chérifs de La Mecque en 1259, repousse victorieusement la Croisade de Saint Louis à Carthage (1270)."
      },
      {
            "name": "Abu Faris Abd al-Aziz",
            "arabicName": "أبو فارس عبد العزيز المتوكل",
            "role": "Sultan Hafside Réformateur",
            "reignOrDates": "1394 – 1434",
            "achievements": "Rétablit l'unité territoriale de Tripoli à Constantine, fonde des hôpitaux, des bibliothèques et dote la Zitouna de manuscrits précieux."
      },
      {
            "name": "Ibn Khaldoun",
            "arabicName": "عبد الرحمن بن خلدون",
            "role": "Père de l'Histoire Moderne & de la Sociologie",
            "reignOrDates": "1332 – 1406",
            "achievements": "Né à Tunis dans la Médina (rue Tourbet el-Bey), enseigne à la Zitouna et rédige la Muqaddima et le Livre des Exemples (Kitab al-Ibar)."
      }
],
    notableFamilies: [
      {
            "name": "Dynastie des Sultans Hafsides",
            "arabicName": "السلاطين الحفصيون",
            "role": "Maison régnante sur l'Ifriqiya",
            "origin": "Palais de la Kasbah de Tunis",
            "lineageNotes": "Lignée souveraine ayant dirigé la Tunisie pendant 346 ans, garantissant prospérité et traités internationaux."
      },
      {
            "name": "Maison d'Ibn Khaldoun (Banu Khaldun)",
            "arabicName": "عائلة ابن خلدون الحضرمية",
            "role": "Patriciens, magistrats et ministres",
            "origin": "Séville / Tourbet El Bey, Tunis",
            "lineageNotes": "Illustre famille andalouse d'ascendance yéménite حضرمي ayant donné de grands ministres et magistrats à Tunis."
      },
      {
            "name": "Patriciat Andalou Réfugié",
            "arabicName": "أعيان الأندلسيين المهجرين",
            "role": "Érudits, poètes, artisans et vizirs",
            "origin": "Cordoue, Valence, Séville et Grenade",
            "lineageNotes": "Grandes familles (Ibn al-Abbar, Al-Qalchani, Ibn Hazm) ayant transformé les arts, l'agriculture et les lettres tunisiennes."
      },
      {
            "name": "Maison d'Ibn Arafa & Oulémas de la Zitouna",
            "arabicName": "آل ابن عرفة وشيوخ الزيتونة",
            "role": "Muftis suprêmes et maîtres de jurisprudence",
            "origin": "Médina de Tunis",
            "lineageNotes": "Lignée du grand imam Ibn Arafa (1316–1401) ayant codifié le droit notarié tunisien pour des siècles."
      }
],
keySites: [
      { name: "Tunis (La Kasbah)", coords: [36.7992, 10.1661], role: "Capitale royale hafside et siège de la Zitouna", zoomLevel: 13 },
      { name: "Testour", coords: [36.55, 9.45], role: "Cité andalouse de la Medjerda", zoomLevel: 13 },
      { name: "Le Bardo", coords: [36.8092, 10.1344], role: "Résidence des jardins et pavillons de plaisance hafsides", zoomLevel: 13 },
    ],
  },
  {
    id: "ottomane",
    stepNumber: 9,
    year: 1600,
    displayPeriod: "1574 – 1705 (Notamment vers 1600)",
    title: "Régence Ottomane de Tunis & Dynastie Mouradite",
    arabicTitle: "إيالة تونس العثمانية والدولة المرادية (حوالي 1600)",
    empire: "Empire Ottoman & Eyalet de Tunis (Régence de Tunis)",
    devletName: "Devlet-i Aliyye-i Osmaniyye (Empire Ottoman)",
    tunisiaEntityName: "Eyalet de Tunis / Régence Ottomane de Tunis",
    capital: "Tunis (تونس)",
    capitalCoords: [36.8065, 10.1815],
    overviewCenter: [34.0, 14.0],
    overviewZoom: 5.2,
    fillColor: "#991b1b",
    borderColor: "#7f1d1d",
    description:
      "En 1574, Sinan Pacha et Uluç Ali expulsent les Espagnols. Tunis devient un Eyalet ottoman autonome gouverné par des Pachas, des Deys (conseil de la milice des Janissaires) puis par les Beys héréditaires Mouradites (dès 1613).",
    treatiesAndBorders:
      "Vers 1600, les frontières de l'Eyalet de Tunis se stabilisent à l'ouest face à Alger et au sud-est face à Tripoli. Capitulations maritimes conclues avec la France (Henri IV) et l'Angleterre.",
    divisionsTitle: "Caïdats Makhzen & Forteresses de Garnison de l'Eyalet",
    administrativeDivisions: [
      { id: "dar_el_bey", name: "Gouvernorat de Tunis & La Kasbah", arabicName: "دار الباي وقصبة تونس", seat: "Tunis", coords: [36.8065, 10.1815], description: "Siège du Dey, de la milice des Janissaires et des Mouradites." },
      { id: "goulette_arsenal", name: "La Goulette (Halk El Oued)", arabicName: "حلق الوادي والكرّاكة", seat: "La Goulette", coords: [36.8189, 10.305], description: "Forteresse de La Karraka et base de la course ottomane." },
      { id: "garnison_kef", name: "Garnison Frontalière du Kef", arabicName: "حامية الكاف الحدودية", seat: "Le Kef", coords: [36.1742, 8.7049], description: "Forteresse clé face à la Régence d'Alger." },
      { id: "caidat_beja_1600", name: "Caïdat de Béja & Medjerda", arabicName: "قيادة باجة وحوض مجردة", seat: "Béja", coords: [36.7256, 9.1817], description: "Contrôle céréalier et cavalerie des Spahis." },
      { id: "caidat_jlass_1600", name: "Caïdat des Jlass & Kairouan", arabicName: "قيادة الجلاص والقيروان", seat: "Kairouan", coords: [35.6781, 10.0963], description: "Sécurisation de la grande plaine centrale." },
      { id: "caidat_sfax_sahel", name: "Caïdat de Sfax et du Sahel", arabicName: "قيادة صفاقس والساحل", seat: "Sfax", coords: [34.7406, 10.7603], description: "Commerce maritime d'huile d'olive de l'Empire." },
      { id: "caidat_djerid_1600", name: "Caïdat du Djerid", arabicName: "قيادة الجريد وقسطيلية", seat: "Tozeur", coords: [33.9197, 8.1336], description: "Oasis et caravanes transsahariennes." },
      { id: "caidat_ouerghemma_1600", name: "Confédération des Ouerghemma", arabicName: "حلف الورغمة بالجنوب", seat: "Médenine", coords: [33.15, 10.45], description: "Défense de la frontière face à Tripoli." },
    ],
    eraTribes: TUNISIAN_TRIBES.slice(0, 10),
    outerEmpirePolygon: [
      [37.0, -2.0], [42.0, 15.0], [42.0, 30.0], [36.0, 36.0],
      [30.0, 32.0], [30.0, 18.0], [28.0, 8.0], [33.0, -1.0],
    ],
    borderPolygon: [
      [37.35, 8.55], [37.35, 9.9], [36.85, 10.35], [36.9, 11.15],
      [35.8, 10.65], [35.5, 11.05], [34.7, 10.8], [33.9, 10.4],
      [33.15, 11.55], [31.9, 10.5], [33.2, 8.5], [34.4, 8.6],
      [35.4, 8.4], [36.15, 8.35], [36.9, 8.4],
    ],
    archivalSources: [
      "Defters fiscaux et militaires ottomans (Archives Nationales de Tunisie — Kasbah)",
      "Sijillats du Grand Tribunal Charaïque hanéfite et malékite de Tunis",
      "Registres consulaires de la chancellerie française à Tunis (CADN Nantes, Série A)",
      "Archives ottomanes de Başbakanlık à Istanbul (Fonds Trablusgarp ve Tunus)",
    ],
        tunisRole: "Tunis devient le siège d'un État méditerranéen souverain autonome (Iyala de Tunis). Édification des premiers minarets octogonaux ottomans (Youssef Dey, Hammouda Pacha), développement fulgurant de l'artisanat des chéchias (Souk el-Chaouachine) et fortification massive de La Goulette.",
    lineagesSummary: "Defters de la milice des Janissaires (Ojak de Tunis), Sijills des tribunaux hanéfites et malékites, registres de fondation des mosquées et traités de course maritime conservés aux Archives Nationales de Tunisie (ANT).",
    notableLeaders: [
      {
            "name": "Sinan Pacha & Uluj Ali (Kilij Ali)",
            "arabicName": "سنان باشا وقلج علي",
            "role": "Grands Amiraux Ottomans",
            "reignOrDates": "1574",
            "achievements": "Chassent définitivement les garnisons espagnoles de La Goulette et de Tunis, scellant le statut de régence ottomane autonome."
      },
      {
            "name": "Mourad Bey Ier",
            "arabicName": "مراد باي الأول",
            "role": "Fondateur de la Dynastie Héréditaire Mouradite",
            "reignOrDates": "1613 – 1631",
            "achievements": "Premier bey héréditaire de Tunis, réorganise la perception fiscale intérieure par la tournée semestrielle de la Mahalla."
      },
      {
            "name": "Hammouda Pacha Bey Mouradite",
            "arabicName": "حمودة باشا المرادي",
            "role": "Bey Souverain Bâtisseur",
            "reignOrDates": "1631 – 1666",
            "achievements": "Bâtit la Mosquée Hammouda Pacha au minaret octogonal, fonde le souk des chéchias et dote Tunis de superbes fondouks marchands."
      },
      {
            "name": "Youssef Dey & Othman Dey",
            "arabicName": "يوسف داي وعثمان داي",
            "role": "Deys Souverains de l'Ojak de Tunis",
            "reignOrDates": "1598 – 1637",
            "achievements": "Édifient la première mosquée hanéfite de Tunis et organisent l'accueil chaleureux des 80 000 morisques expulsés d'Espagne (1609)."
      }
],
    notableFamilies: [
      {
            "name": "Dynastie Beylicale des Mouradites",
            "arabicName": "المراديون",
            "role": "Beys héréditaires de Tunis",
            "origin": "Médina de Tunis (Dar El-Bey)",
            "lineageNotes": "Lignée princière fondée par Mourad Bey ayant régné sur la Tunisie jusqu'en 1702."
      },
      {
            "name": "Notabilités Morisques d'Espagne",
            "arabicName": "الأندلسيون الموريسكيون (1609)",
            "role": "Fondateurs de cités agricoles et ingénieurs",
            "origin": "Testour, Soliman, Zaghouan, Tebourba",
            "lineageNotes": "Familles Al-Andalusi, Ben Mustapha, Morisco ayant révolutionné l'hydraulique agricole et l'horlogerie."
      },
      {
            "name": "Raïs de la Mer & Amirauté de La Goulette",
            "arabicName": "رياس البحر بقلق الوادي",
            "role": "Commandants corsaires et amiraux",
            "origin": "La Goulette / Tunis",
            "lineageNotes": "Lignées de capitaines maritimes (Darghouth, Al-Mami, Pichinino) assurant la puissance navale de la Régence."
      },
      {
            "name": "Aristocratie Kouloughlie & Turque",
            "arabicName": "أعيان الكراغلة والأتراك",
            "role": "Officiers du Diwan et magistrats hanéfites",
            "origin": "Kasbah de Tunis",
            "lineageNotes": "Familles métisses turco-tunisiennes exerçant les hauts commandements militaires de l'Ojak."
      }
],
keySites: [
      { name: "Tunis (Capitale de l'Eyalet)", arabicName: "تونس العاصمة", coords: [36.8065, 10.1815], role: "Dar El Bey, Kasbah et Mosquée Youssef Dey (1616)", zoomLevel: 13 },
      { name: "La Goulette (Halk El Oued)", arabicName: "حلق الوادي", coords: [36.8189, 10.305], role: "Forteresse côtière maritime (La Karraka) et arsenal des corsaires", zoomLevel: 13 },
      { name: "Le Kef (Al-Kaf)", arabicName: "الكاف", coords: [36.1742, 8.7049], role: "Forteresse clé de garnison face à la Régence d'Alger", zoomLevel: 13 },
      { name: "Bizerte", arabicName: "بنزرت", coords: [37.2744, 9.8739], role: "Garnison de Janissaires et port des raïs", zoomLevel: 13 },
      { name: "Kairouan", arabicName: "القيروان", coords: [35.6781, 10.0963], role: "Capitale religieuse intérieure et bastion des oulémas", zoomLevel: 13 },
      { name: "Sfax", arabicName: "صفاقس", coords: [34.7406, 10.7603], role: "Grand pôle maritime et exportateur de l'Empire", zoomLevel: 13 },
    ],
  },
  {
    id: "husseinite",
    stepNumber: 10,
    year: 1705,
    displayPeriod: "1705 – 1881",
    title: "Beylicat Husseinite & Les 60 Caïdats",
    arabicTitle: "المملكة التونسية الحسينية ونظام الـ60 قيادة (1705–1881)",
    empire: "Royaume Beylical de Tunis (Al-Mamlaka Al-Tunisiyya)",
    devletName: "Al-Mamlaka Al-Tunisiyya (Royaume Beylical de Tunis)",
    tunisiaEntityName: "Territoire National des 60 Caïdats & Rôles de la Majba",
    capital: "Tunis / Le Bardo (قصر باردو)",
    capitalCoords: [36.8092, 10.1344],
    overviewCenter: [34.8, 9.8],
    overviewZoom: 6.8,
    fillColor: "#9f1239",
    borderColor: "#4c0519",
    description:
      "Fondation de la dynastie des Husseinites en 1705 par Hussein Ben Ali. Souveraineté étatique moderne remarquable : 60 caïdats, Pacte Fondamental de 1857, Constitution de 1861 (première du monde arabe) et recensements fiscaux de la Majba (1860).",
    treatiesAndBorders:
      "Délimitation des frontières avec l'Algérie en 1840 et 1860. Levée semestrielle de la taxe par la Mahalla du Nord et la Mahalla du Sud.",
    divisionsTitle: "Les 60 Caïdats Territoriaux & Régions de la Majba",
    administrativeDivisions: [
      { id: "caidat_tunis_bardo", name: "Caïdat de Tunis & Le Bardo", arabicName: "قيادة تونس وقصر باردو", seat: "Le Bardo", coords: [36.8092, 10.1344], description: "Palais beylicaux, Grand Vizirat et ministères." },
      { id: "caidat_jlass", name: "Caïdat des Jlass", arabicName: "قيادة الجلاص", seat: "Kairouan", coords: [35.6781, 10.0963], description: "Recensement de 18 420 chefs de famille dans la Majba de 1860." },
      { id: "caidat_ouerghemma", name: "Caïdat des Ouerghemma", arabicName: "قيادة الورغمة", seat: "Médenine", coords: [33.15, 10.45], description: "Confédération guerrière du Dahar et de la Jeffara." },
      { id: "caidat_fraichiche", name: "Caïdat des Fraichiche", arabicName: "قيادة الفراشيش", seat: "Feriana / Thala", coords: [35.15, 8.65], description: "Hautes steppes occidentales." },
      { id: "caidat_djerid", name: "Caïdat du Djerid", arabicName: "قيادة الجريد", seat: "Tozeur", coords: [33.9197, 8.1336], description: "Palmeraies et tribunaux charaïques des oasis." },
      { id: "caidat_beja", name: "Caïdat de Béja", arabicName: "قيادة باجة", seat: "Béja", coords: [36.7256, 9.1817], description: "Plaine de la Medjerda et tribus makhzen des Drid." },
      { id: "caidat_sousse", name: "Caïdat de Sousse", arabicName: "قيادة سوسة", seat: "Sousse", coords: [35.8288, 10.6406], description: "Grand pôle portuaire et oléicole du Sahel." },
      { id: "caidat_sfax", name: "Caïdat de Sfax", arabicName: "قيادة صفاقس", seat: "Sfax", coords: [34.7406, 10.7603], description: "Commerce maritime et tribunaux de commerce." },
    ],
    eraTribes: TUNISIAN_TRIBES, // All 16 confederations
    borderPolygon: [
      [37.25, 8.55], [37.35, 9.9], [36.85, 10.35], [36.9, 11.15],
      [35.5, 11.05], [34.7, 10.8], [33.9, 10.4], [33.15, 11.55],
      [31.75, 10.3], [33.1, 8.4], [34.4, 8.5], [35.4, 8.3],
      [36.2, 8.35], [36.9, 8.4],
    ],
    archivalSources: [
      "Registres complets de la Majba de 1860 (ANT Kasbah — Séries 1 à 60)",
      "Archives du Grand Vizirat de Mustapha Khaznadar et Kheireddine Pacha",
      "Sijillats notariés des 60 caïdats tunisiens conservés à La Kasbah",
      "Texte original de la Constitution tunisienne de 1861",
    ],
        tunisRole: "Cœur absolu du gouvernement de l'État beylical moderne : Palais du Bardo, Dar El-Bey à la Kasbah, Palais Ksar Saïd, Collège Sadiki (1875), Imprimerie d'État de La Goulette (journal ar-Ra'id at-Tunisi). Tunis concentre l'ensemble des consulats généraux européens, le Grand Conseil de la Constitution et le Tribunal du Charaâ.",
    lineagesSummary: "Registres nominatifs de la Majba de 1860 (Série Kasbah ANT) recensant l'intégralité des chefs de foyers imposables par caïdat et fraction, Sijillats des Adoul de Tunis, actes notariés d'affranchissement d'esclaves (1846) et décrets constitutionnels de 1861.",
    notableLeaders: [
      {
            "name": "Hussein Ben Ali",
            "arabicName": "حسين بن علي الوجاقلي",
            "role": "Fondateur de la Dynastie Royale Husseinite",
            "reignOrDates": "1705 – 1735",
            "achievements": "Rétablit la paix intérieure et la souveraineté tunisienne, fonde la Médersa Ennakhla et le mausolée de Tourbet El Bey."
      },
      {
            "name": "Hammouda Pacha le Grand",
            "arabicName": "حمودة باشا الحسيني",
            "role": "Bey Souverain de Tunisie",
            "reignOrDates": "1782 – 1814",
            "achievements": "Apogée militaire et économique de la Régence, refoule les prétentions d'Alger, modernise l'armée et le Palais du Bardo."
      },
      {
            "name": "Ahmed Bey Ier",
            "arabicName": "أحمد باي الأول",
            "role": "Souverain Réformateur & Modernisateur",
            "reignOrDates": "1837 – 1855",
            "achievements": "Abolit l'esclavage en Tunisie dès 1846, fonde l'École Militaire du Bardo en 1840 et crée la première armée tunisienne moderne."
      },
      {
            "name": "Kheireddine Pacha",
            "arabicName": "خير الدين باشا التونسي",
            "role": "Grand Vizir Réformateur",
            "reignOrDates": "1873 – 1877",
            "achievements": "Auteur du manifeste constitutionnel arabo-musulman, fonde le Collège Sadiki en 1875 et réorganise les Habous et les Archives."
      },
      {
            "name": "Sadok Bey",
            "arabicName": "محمد الصادق باي",
            "role": "Promulgateur de la Constitution",
            "reignOrDates": "1859 – 1882",
            "achievements": "Promulgue le Pacte Fondamental (Ahd El-Aman, 1857) et la première Constitution du monde arabo-musulman en 1861."
      }
],
    notableFamilies: [
      {
            "name": "Famille Royale Husseinite",
            "arabicName": "الأسرة الحسينية المالكة",
            "role": "Beys et souverains régnant sur la Tunisie",
            "origin": "Le Bardo / Dar El-Bey, Tunis",
            "lineageNotes": "Dynastie princière souveraine de 1705 à 1957 ayant donné naissance à l'État moderne tunisien."
      },
      {
            "name": "Grande Aristocratie du Makhzen",
            "arabicName": "أسر المخزن والوزراء",
            "role": "Grands vizirs, ministres et caïds",
            "origin": "Tunis, Sousse et Sfax",
            "lineageNotes": "Grandes familles d'État : Ben Ayed, Djellouli, Lasram, Bouattour, Ben Zied, Caïd Essebsi, Sebaï, Belkodja."
      },
      {
            "name": "Lignées d'Oulémas & Cheikhs al-Islam",
            "arabicName": "بيوتات العلم والإفتاء (بيرم، النيفر، بوخريص)",
            "role": "Cheikhs de la Zitouna et Grands Muftis",
            "origin": "Médina de Tunis",
            "lineageNotes": "Grandes dynasties savantes (Bayram, Ennaifer, Boukhris, Belkadhi, Baraket) détenant les chaires théologiques."
      },
      {
            "name": "Haute Bourgeoisie Marchande & Grana",
            "arabicName": "أعيان التجارة والقَرَانَة والتوانسة",
            "role": "Banquiers du Bey, industriels de la chéchia et exportateurs",
            "origin": "Tunis, Sfax, Djerba",
            "lineageNotes": "Familles Nataf, Borgel, Lumbroso, Valensi, Chemla, Zaouche, Baccouche animant les finances et le négoce méditerranéen."
      }
],
keySites: [
      { name: "Palais du Bardo", arabicName: "قصر باردو", coords: [36.8092, 10.1344], role: "Résidence officielle des Beys et promulgation de la Constitution de 1861", zoomLevel: 13 },
      { name: "La Kasbah de Tunis", arabicName: "قصبة تونس", coords: [36.7992, 10.1661], role: "Siège du Premier Ministère et du Trésor beylical (Bayt al-Mal)", zoomLevel: 13 },
      { name: "La Mohammedia", arabicName: "المحمدية", coords: [36.6747, 10.1586], role: "Palais grandiose d'Ahmed Bey Ier", zoomLevel: 13 },
    ],
  },
  {
    id: "protectorat",
    stepNumber: 11,
    year: 1881,
    displayPeriod: "1881 – 1956",
    title: "Protectorat Français & Frontières Fixées",
    arabicTitle: "فترة الحماية الفرنسية وتثبيت الحدود (1881–1956)",
    empire: "Régence de Tunis (Sous Protectorat Français)",
    devletName: "Régence de Tunis (Protectorat Français)",
    tunisiaEntityName: "Contrôles Civils & Territoires Militaires du Sud",
    capital: "Tunis (تونس)",
    capitalCoords: [36.8, 10.18],
    overviewCenter: [34.5, 9.8],
    overviewZoom: 6.8,
    fillColor: "#1e3a8a",
    borderColor: "#172554",
    description:
      "Traité du Bardo (1881) et Convention de La Marsa (1883). Délimitation internationale définitive avec la Libye ottomane (Convention de Tripoli de 1910). Instauration de l'état civil municipal en 1886.",
    treatiesAndBorders:
      "Convention de Tripoli (19 mai 1910) traçant la frontière tuniso-libyenne de Ras Jedir à Ghadamès. Division du Sud en Territoires Militaires (Médenine, Tataouine, Remada).",
    divisionsTitle: "Contrôles Civils & Territoires Militaires",
    administrativeDivisions: [
      { id: "cc_tunis", name: "Contrôle Civil de Tunis & Banlieue", arabicName: "المراقبة المدنية بتونس", seat: "Tunis", coords: [36.8, 10.18], description: "Résidence Générale et services centraux de l'état civil." },
      { id: "cc_bizerte", name: "Contrôle Civil de Bizerte", arabicName: "المراقبة المدنية ببنزرت", seat: "Bizerte", coords: [37.2744, 9.8739], description: "Base navale stratégique de Sidi Abdallah." },
      { id: "cc_sousse", name: "Contrôle Civil de Sousse", arabicName: "المراقبة المدنية بسوسة", seat: "Sousse", coords: [35.8288, 10.6406], description: "Sahel et région de Monastir." },
      { id: "cc_sfax", name: "Contrôle Civil de Sfax", arabicName: "المراقبة المدنية بصفاقس", seat: "Sfax", coords: [34.7406, 10.7603], description: "Port phosphorier et oléicole." },
      { id: "cc_kef", name: "Contrôle Civil du Kef", arabicName: "المراقبة المدنية بالكاف", seat: "Le Kef", coords: [36.1742, 8.7049], description: "Hauts plateaux et mines." },
      { id: "territoires_sud", name: "Territoires Militaires du Sud", arabicName: "الجهات العسكرية للجنوب", seat: "Médenine / Remada", coords: [32.3167, 10.4], description: "Administration militaire saharienne." },
    ],
    eraTribes: TUNISIAN_TRIBES,
    borderPolygon: [
      [36.95, 8.65], [37.35, 9.9], [36.85, 10.35], [36.9, 11.15],
      [35.5, 11.05], [34.7, 10.8], [33.9, 10.4], [33.15, 11.55],
      [31.85, 10.55], [30.25, 9.55], [31.6, 9.2], [33.1, 8.1],
      [34.4, 8.4], [35.4, 8.3], [36.2, 8.35], [36.9, 8.4],
    ],
    archivalSources: [
      "Registres d'état civil municipal et des naissances (1886–1956)",
      "Centre des Archives Diplomatiques de Nantes (CADN — Fonds Résidence Générale)",
      "Archives Nationales d'Outre-Mer (ANOM Aix-en-Provence)",
      "Index nominatif des décrets de naturalisation (1924–1927)",
    ],
        tunisRole: "Métropole duale : Émergence spectaculaire de la ville européenne en damier (Avenue Jules-Ferry, aujourd'hui Avenue Habib Bourguiba) côtoyant harmonieusement la Médina historique. Siège de la Résidence Générale, de l'Hôtel de Ville de Tunis, du Grand Tribunal de Tunis et des grands lycées (Carnot, Alaoui).",
    lineagesSummary: "Registres d'État Civil républicains et consulaires (Naissances, Mariages, Décès) instaurés en 1886, décrets de naturalisation (1924–1927), registres des matricules militaires et dossiers du Contrôle Civil aux Archives Nationales de Tunisie.",
    notableLeaders: [
      {
            "name": "Moncef Bey (Le Bey du Peuple)",
            "arabicName": "محمد المنصف باي",
            "role": "Bey Patriote & Martyr National",
            "reignOrDates": "1942 – 1943",
            "achievements": "Symbole suprême de dignité nationale et d'indépendance, refuse les ordres de Vichy, destitué et exilé par les autorités coloniales."
      },
      {
            "name": "Habib Bourguiba",
            "arabicName": "الحبيب بورقيبة",
            "role": "Leader Suprême de la Libération Nationale",
            "reignOrDates": "1903 – 2000",
            "achievements": "Fonde le Néo-Destour à Ksar Hellal en 1934, dirige le combat pour l'indépendance et obtient l'autonomie interne puis la pleine souveraineté (1956)."
      },
      {
            "name": "Farhat Hached",
            "arabicName": "فرحات حشاد",
            "role": "Fondateur de l'UGTT & Martyr de la Nation",
            "reignOrDates": "1914 – 1952",
            "achievements": "Fonde la centrale syndicale autonome UGTT en 1946, fédère les travailleurs pour l'émancipation sociale et nationale, assassiné par la Main Rouge."
      },
      {
            "name": "Abdelaziz Thâalbi",
            "arabicName": "عبد العزيز الثعالبي",
            "role": "Penseur & Fondateur du Destour",
            "reignOrDates": "1874 – 1944",
            "achievements": "Auteur de 'La Tunisie Martyre' (1920), pionnier du réveil politique et intellectuel moderne du peuple tunisien."
      },
      {
            "name": "Lamine Bey",
            "arabicName": "محمد الأمين باي",
            "role": "Dernier Bey Souverain de Tunis",
            "reignOrDates": "1943 – 1957",
            "achievements": "Signe le protocole d'indépendance de la Tunisie le 20 mars 1956 avant l'abolition pacifique du régime beylical en 1957."
      }
],
    notableFamilies: [
      {
            "name": "Familles du Mouvement National & Destourien",
            "arabicName": "بيوتات الحركة الوطنية والتصدي الاستعماري",
            "role": "Militants, ministres de l'autonomie et signataires",
            "origin": "Tunis, Sahel, Sfax et Kairouan",
            "lineageNotes": "Familles Bourguiba, Materi, Chenik, Mzali, Guellaty, Farhat, Hached, Ben Ammar, Baccouche, Slim."
      },
      {
            "name": "Dynasties Patriciennes de la Médina",
            "arabicName": "العائلات البلدية بتونس",
            "role": "Magistrats, universitaires et lettrés",
            "origin": "Tunis (Médina et banlieues nord)",
            "lineageNotes": "Familles Sfar, Mohsen, Ennaifer, Ben Achour, Chahed, Ben Romdhane, Zaouche, Baccouche."
      },
      {
            "name": "Familles Européennes de Tunisie",
            "arabicName": "الجاليات الأوروبية بتونس (إيطاليون، مالطيون، فرنسيون)",
            "role": "Médecins, cheminots, architectes et agriculteurs",
            "origin": "Tunis, La Goulette, Bizerte, Sfax",
            "lineageNotes": "Registres paroissiaux et consulaires de Sainte-Croix de Tunis, de Notre-Dame de La Goulette et des archives de Nantes."
      }
],
keySites: [
      { name: "Tunis (Résidence Générale)", coords: [36.8, 10.18], role: "Avenue de la Marine et institutions administratives", zoomLevel: 13 },
      { name: "Bizerte (Base navale)", coords: [37.2744, 9.8739], role: "Port militaire stratégique", zoomLevel: 13 },
      { name: "Remada & Tataouine", coords: [32.3167, 10.4], role: "Postes de commandement des Territoires Militaires du Sud", zoomLevel: 13 },
    ],
  },
  {
    id: "republique",
    stepNumber: 12,
    year: 1956,
    displayPeriod: "1956 – Aujourd'hui",
    title: "République Tunisienne Moderne & 24 Gouvernorats",
    arabicTitle: "الجمهورية التونسية الحديثة والـ24 ولاية (1956–اليوم)",
    empire: "République Tunisienne (Al-Jumhuriyya Al-Tunisiyya)",
    devletName: "Al-Jumhuriyya Al-Tunisiyya (République Tunisienne)",
    tunisiaEntityName: "Territoire National des 24 Gouvernorats & Communes",
    capital: "Tunis (تونس)",
    capitalCoords: [36.8065, 10.1815],
    overviewCenter: [34.0, 9.6],
    overviewZoom: 6.5,
    fillColor: "#dc2626",
    borderColor: "#991b1b",
    description:
      "Indépendance le 20 mars 1956, proclamation de la République le 25 juillet 1957. Évacuation de Bizerte le 15 octobre 1963. Organisation territoriale contemporaine en 24 gouvernorats, 264 délégations et 350 communes.",
    treatiesAndBorders:
      "Souveraineté nationale intégrale. Numérisation de l'état civil et centralisation aux Archives Nationales de Tunisie.",
    divisionsTitle: "Les 24 Gouvernorats de la République",
    administrativeDivisions: [
      { id: "grand_tunis", name: "Grand Tunis (Tunis, Ariana, Ben Arous, Manouba)", arabicName: "تونس الكبرى", seat: "Tunis", coords: [36.8065, 10.1815], description: "Capitale politique, économique et universitaire." },
      { id: "nord_est", name: "Nord-Est (Nabeul, Bizerte, Zaghouan)", arabicName: "الشمال الشرقي", seat: "Nabeul / Bizerte", coords: [36.4561, 10.7376], description: "Cap Bon maritime et pôle industriel de Bizerte." },
      { id: "nord_ouest", name: "Nord-Ouest (Béja, Jendouba, Le Kef, Siliana)", arabicName: "الشمال الغربي", seat: "Béja / Le Kef", coords: [36.7256, 9.1817], description: "Grenier à blé et forêts de chênes-lièges." },
      { id: "centre_est", name: "Centre-Est (Sousse, Monastir, Mahdia, Sfax)", arabicName: "الوسط الشرقي (الساحل وصفاقس)", seat: "Sousse / Sfax", coords: [35.8288, 10.6406], description: "Bassin économique, textile et oléicole." },
      { id: "centre_ouest", name: "Centre-Ouest (Kairouan, Kasserine, Sidi Bouzid)", arabicName: "الوسط الغربي", seat: "Kairouan", coords: [35.6781, 10.0963], description: "Steppes historiques et berceau agricole." },
      { id: "sud_est", name: "Sud-Est (Gabès, Médenine, Tataouine)", arabicName: "الجنوب الشرقي", seat: "Gabès / Médenine", coords: [33.8815, 10.0982], description: "Jeffara, île de Djerba et pays des Ksours." },
      { id: "sud_ouest", name: "Sud-Ouest (Gafsa, Tozeur, Kebili)", arabicName: "الجنوب الغربي (الجريد ونفزاوة)", seat: "Gafsa / Tozeur", coords: [34.425, 8.7842], description: "Bassin minier et oasis du Djerid." },
    ],
    eraTribes: TUNISIAN_TRIBES,
    borderPolygon: [
      [36.95, 8.65], [37.35, 9.9], [36.85, 10.35], [36.9, 11.15],
      [35.5, 11.05], [34.7, 10.8], [33.9, 10.4], [33.15, 11.55],
      [31.85, 10.55], [30.25, 9.55], [31.6, 9.2], [33.1, 8.1],
      [34.4, 8.4], [35.4, 8.3], [36.2, 8.35], [36.9, 8.4],
    ],
    archivalSources: [
      "Archives Nationales de Tunisie (Fonds République, Présidence et Ministères)",
      "Journal Officiel de la République Tunisienne (JORT depuis 1956)",
      "Registres civils contemporains des 350 municipalités de Tunisie",
    ],
        tunisRole: "Capitale souveraine, politique, économique et culturelle de la République. Siège de la Présidence au Palais de Carthage, du Parlement au Bardo, du Premier Ministère à la Kasbah (Place du Gouvernement), et du grand édifice moderne des Archives Nationales de Tunisie sur le boulevard du 9-Avril.",
    lineagesSummary: "Registres d'État Civil unifiés des 264 municipalités tunisiennes, numérotation de la Carte d'Identité Nationale (CIN), Livre Foncier Informatisé de la Conservation de la Propriété Foncière (CPF) et dossiers matricules des fonctionnaires de l'État.",
    notableLeaders: [
      {
            "name": "Habib Bourguiba",
            "arabicName": "الحبيب بورقيبة",
            "role": "Premier Président de la République Tunisienne",
            "reignOrDates": "1957 – 1987",
            "achievements": "Père de l'État moderne républicain, promulgue le Code du Statut Personnel (1956) libérant la femme tunisienne, généralise l'école et la santé publiques gratuites."
      },
      {
            "name": "Bahi Ladgham",
            "arabicName": "الباهI الأدغم",
            "role": "Premier Ministre & Architecte de l'Administration",
            "reignOrDates": "1957 – 1970",
            "achievements": "Secrétaire général de la Présidence, organise les ministères régaliens de la jeune République et les plans de développement économique."
      },
      {
            "name": "Tahar Haddad",
            "arabicName": "الطاهر الحداد",
            "role": "Penseur Précurseur & Réformateur Social",
            "reignOrDates": "1899 – 1935",
            "achievements": "Diplômé de la Zitouna, auteur inspirateur de 'Notre Femme dans la Charia et la Société', guide intellectuel du Code du Statut Personnel."
      },
      {
            "name": "Beji Caid Essebsi",
            "arabicName": "الباجي قائد السبسي",
            "role": "Homme d'État & Président de la République",
            "reignOrDates": "2014 – 2019",
            "achievements": "Ministre historique de Bourguiba, Premier Ministre de la transition démocratique en 2011 et premier président élu au suffrage universel direct en 2014."
      }
],
    notableFamilies: [
      {
            "name": "Grandes Familles Universitaires & Républicaines",
            "arabicName": "العائلات الجامعية والنقابية الوطنية",
            "role": "Professeurs, diplomates, magistrats et médecins",
            "origin": "L'ensemble des 24 gouvernorats unifiés",
            "lineageNotes": "Lignées ayant forgé l'armature administrative, hospitalière et universitaire de la Tunisie indépendante."
      },
      {
            "name": "Cadres Fondateurs de l'Administration Tunisienne",
            "arabicName": "بناة الدولة التونسية الحديثة",
            "role": "Ingénieurs, planificateurs et officiers",
            "origin": "Grand Tunis, Sahel, Sud et Nord-Ouest",
            "lineageNotes": "Dossiers d'archives conservés à la Kasbah et aux Archives Nationales de Tunisie (fonds de la Présidence et des Ministères)."
      }
],
keySites: [
      { name: "Palais de Carthage", coords: [36.8528, 10.3233], role: "Présidence de la République Tunisienne", zoomLevel: 13 },
      { name: "La Kasbah (Palais du Gouvernement)", coords: [36.7992, 10.1661], role: "Chef du Gouvernement et Archives Nationales de Tunisie", zoomLevel: 13 },
      { name: "Le Bardo (Assemblée des Représentants)", coords: [36.8092, 10.1344], role: "Siège du pouvoir législatif", zoomLevel: 13 },
      { name: "Bizerte (Monument de l'Évacuation)", coords: [37.2744, 9.8739], role: "Symbole de la libération intégrale (15 octobre 1963)", zoomLevel: 13 },
    ],
  },
];
