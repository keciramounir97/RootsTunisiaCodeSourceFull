import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import { Search, GitBranch, Archive, ArrowLeft, Layers, Compass, MapPin, ExternalLink, Maximize2, Crown, Lock, Sparkles, Landmark, Building2, Users, ChevronDown, ChevronUp, PanelRightClose, PanelRightOpen, Eye, Filter, Check, RotateCcw } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { getLocalizedGovEnrichment } from "../data/govArchivalEnrichmentLocales";

// Custom gold and red marker icons
export const goldIcon = L.divIcon({
  className: "",
  html: `<div style="background:linear-gradient(135deg,#e3b555,#b8860b);width:20px;height:20px;border-radius:50%;border:3px solid #fdfbf7;box-shadow:0 3px 12px rgba(217,164,65,0.75);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.2s;"><div style="width:6px;height:6px;background:#fdfbf7;border-radius:50%;"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export const selectedIcon = L.divIcon({
  className: "",
  html: `<div style="background:linear-gradient(135deg,#e11d48,#9f1239);width:26px;height:26px;border-radius:50%;border:3px solid #fdfbf7;box-shadow:0 0 18px rgba(200,16,46,0.95);display:flex;align-items:center;justify-content:center;cursor:pointer;"><div style="width:8px;height:8px;background:#fdfbf7;border-radius:50%;"></div></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

export type RegionId =
  | "all_tunisia"
  | "greater_tunis"
  | "north"
  | "north_east"
  | "north_west"
  | "sahel"
  | "central_west"
  | "south_west"
  | "south_east";

export interface Governorate {
  id: string;
  coords: [number, number];
  region: RegionId;
  population: string;
  notableFamilies: string[];
}

export interface RegionInfo {
  id: RegionId;
  labelKey: string;
  governorates: string[];
  notableLineages: string[];
  subTitle?: string;
  description?: string;
}

export const REGIONS: RegionId[] = [
  "all_tunisia",
  "greater_tunis",
  "north",
  "north_east",
  "north_west",
  "sahel",
  "central_west",
  "south_west",
  "south_east",
];

export const REGION_LABEL_KEYS: Record<RegionId, string> = {
  all_tunisia: "region_all",
  greater_tunis: "region_greater_tunis",
  north: "region_north",
  north_east: "region_north_east",
  north_west: "region_north_west",
  sahel: "region_sahel",
  central_west: "region_central_west",
  south_west: "region_south_west",
  south_east: "region_south_east",
};

export const regionDossiers: Record<RegionId, RegionInfo> = {
  all_tunisia: {
    id: "all_tunisia",
    labelKey: "region_all",
    governorates: [
      "tunis", "ariana", "ben_arous", "manouba", "nabeul", "zaghouan", "bizerte",
      "beja", "jendouba", "le_kef", "siliana", "sousse", "monastir", "mahdia",
      "sfax", "kairouan", "kasserine", "sidi_bouzid", "gafsa", "tozeur", "kebili",
      "gabes", "medenine", "tataouine",
    ],
    notableLineages: [
      "ben_achour", "fourati", "chabbi", "lasram", "zarrouk",
      "sellami", "bourguiba", "caid_essebsi", "khmiri", "marzougui",
    ],
  },
  greater_tunis: {
    id: "greater_tunis",
    labelKey: "region_greater_tunis",
    governorates: ["tunis", "ariana", "ben_arous", "manouba"],
    notableLineages: [
      "ben_achour", "caid_essebsi", "lasram", "zarrouk", "djaziri",
      "baccouche", "mami", "chennoufi", "ennaifer", "bouhajeb",
    ],
  },
  north: {
    id: "north",
    labelKey: "region_north",
    governorates: ["bizerte"],
    notableLineages: ["guiga", "boukhris", "allani", "ben_cheikh", "baccari", "ben_rejeb"],
  },
  north_east: {
    id: "north_east",
    labelKey: "region_north_east",
    governorates: ["nabeul", "zaghouan"],
    notableLineages: ["haddad", "kharraz", "gharbi", "chaouch", "boudhina", "mani", "triki", "khouja"],
  },
  north_west: {
    id: "north_west",
    labelKey: "region_north_west",
    governorates: ["beja", "jendouba", "le_kef", "siliana"],
    notableLineages: ["dridi", "amdouni", "khmiri", "ayari", "mazigh", "chebbi", "boughanmi", "souissi", "maktari"],
  },
  sahel: {
    id: "sahel",
    labelKey: "region_sahel",
    governorates: ["sousse", "monastir", "mahdia", "sfax"],
    notableLineages: ["fourati", "sellami", "abid", "fendri", "bourguiba", "mzali", "boujnah", "jenayah", "hamza", "farhat", "sfar"],
  },
  central_west: {
    id: "central_west",
    labelKey: "region_central_west",
    governorates: ["kairouan", "kasserine", "sidi_bouzid"],
    notableLineages: ["alouini", "mourali", "attia", "bouraoui", "chammakhi", "bouazizi", "nasri", "gharbi", "majri", "kadri"],
  },
  south_west: {
    id: "south_west",
    labelKey: "region_south_west",
    governorates: ["gafsa", "tozeur", "kebili"],
    notableLineages: ["chabbi", "ibn_chabbat", "ben_othman", "gafsi", "marzougui", "douzi", "dabbabi", "yacoubi", "bousmaha"],
  },
  south_east: {
    id: "south_east",
    labelKey: "region_south_east",
    governorates: ["gabes", "medenine", "tataouine"],
    notableLineages: ["trabelsi", "djerbi", "ouderni", "ksouri", "bannani", "boulbaba", "zammouri", "chenini", "douiri", "jlassi"],
  },
};

export const governorates: Governorate[] = [
  { id: "tunis", coords: [36.8065, 10.1815], region: "greater_tunis", population: "1,075,000", notableFamilies: ["ben_achour", "caid_essebsi", "djaziri", "lasram", "zarrouk", "ben_ayed"] },
  { id: "ariana", coords: [36.8625, 10.1956], region: "greater_tunis", population: "576,000", notableFamilies: ["baccouche", "mami", "ennaifer", "bouhajeb"] },
  { id: "ben_arous", coords: [36.7533, 10.2281], region: "greater_tunis", population: "631,000", notableFamilies: ["belkhodja", "klibi", "chennoufi", "snoussi"] },
  { id: "manouba", coords: [36.8100, 10.0972], region: "greater_tunis", population: "379,000", notableFamilies: ["kassar", "farhat", "ben_mustapha", "tlili"] },
  { id: "nabeul", coords: [36.4561, 10.7376], region: "north_east", population: "787,000", notableFamilies: ["haddad", "kharraz", "gharbi", "chaouch", "boudhina"] },
  { id: "zaghouan", coords: [36.4029, 10.1429], region: "north_east", population: "176,000", notableFamilies: ["mani", "triki", "ben_rejeb", "khouja"] },
  { id: "bizerte", coords: [37.2744, 9.8739], region: "north", population: "568,000", notableFamilies: ["guiga", "boukhris", "allani", "ben_cheikh", "baccari"] },
  { id: "beja", coords: [36.7256, 9.1817], region: "north_west", population: "303,000", notableFamilies: ["dridi", "amdouni", "trabelsi", "riahi", "jouini"] },
  { id: "jendouba", coords: [36.5011, 8.7803], region: "north_west", population: "401,000", notableFamilies: ["khmiri", "ayari", "boughanmi", "souissi", "gharbi"] },
  { id: "le_kef", coords: [36.1822, 8.7149], region: "north_west", population: "243,000", notableFamilies: ["mazigh", "chabbi", "chebbi", "mansouri", "bouassida"] },
  { id: "siliana", coords: [36.0847, 9.3708], region: "north_west", population: "223,000", notableFamilies: ["ayari", "siliani", "hammami", "maktari", "jouini"] },
  { id: "sousse", coords: [35.8256, 10.6369], region: "sahel", population: "675,000", notableFamilies: ["boujnah", "baccouche", "melliti", "chouikha", "jenayah", "letaief"] },
  { id: "monastir", coords: [35.7779, 10.8261], region: "sahel", population: "548,000", notableFamilies: ["bourguiba", "essid", "mzali", "kallal", "sayah", "ghedira"] },
  { id: "mahdia", coords: [35.5047, 11.0622], region: "sahel", population: "410,000", notableFamilies: ["hamza", "farhat", "ben_romdhane", "sfar", "kacem"] },
  { id: "sfax", coords: [34.7406, 10.7603], region: "sahel", population: "1,030,000", notableFamilies: ["fourati", "abid", "sellami", "fendri", "kammoun", "hachicha", "ellouze"] },
  { id: "kairouan", coords: [35.6781, 10.0963], region: "central_west", population: "570,000", notableFamilies: ["alouini", "mourali", "attia", "bouraoui", "chammakhi", "bardi"] },
  { id: "kasserine", coords: [35.1676, 8.8365], region: "central_west", population: "439,000", notableFamilies: ["gharbi", "nasri", "hafsi", "boulaabi", "majri"] },
  { id: "sidi_bouzid", coords: [35.0382, 9.4849], region: "central_west", population: "430,000", notableFamilies: ["bouazizi", "hamdouni", "kadri", "zitouni", "amri"] },
  { id: "gafsa", coords: [34.4250, 8.7842], region: "south_west", population: "337,000", notableFamilies: ["gafsi", "dabbabi", "znaidi", "mbarki", "khadhraoui"] },
  { id: "tozeur", coords: [33.9197, 8.1336], region: "south_west", population: "107,000", notableFamilies: ["chabbi", "ibn_chabbat", "ben_othman", "gueblaoui", "bousmaha"] },
  { id: "kebili", coords: [33.7050, 8.9650], region: "south_west", population: "157,000", notableFamilies: ["marzougui", "douzi", "yacoubi", "ben_amor", "ghouma"] },
  { id: "gabes", coords: [33.8815, 10.0982], region: "south_east", population: "374,000", notableFamilies: ["boulbaba", "zammouri", "chennoufi", "arbi", "marzouk"] },
  { id: "medenine", coords: [33.3549, 10.5055], region: "south_east", population: "479,000", notableFamilies: ["trabelsi", "ksouri", "bannani", "gharbi", "djerbi", "haddad"] },
  { id: "tataouine", coords: [32.9297, 10.4518], region: "south_east", population: "149,000", notableFamilies: ["ouderni", "dabbabi", "chenini", "douiri", "jlassi"] },
];

// Free, Open-Source Tile Layers (Zero API Keys Required)
export const OPEN_SOURCE_TILE_LAYERS = {
  osm: {
    id: "osm",
    labelKey: "map_layer_osm",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  },
  humanitarian: {
    id: "humanitarian",
    labelKey: "map_layer_hot",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  },
  topo: {
    id: "topo",
    labelKey: "map_layer_topo",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> · <a href="https://opentopomap.org" target="_blank" rel="noopener noreferrer">OpenTopoMap</a>',
  },
} as const;

export type TileLayerKey = keyof typeof OPEN_SOURCE_TILE_LAYERS;

export function MapCenterController({ coords, zoom }: { coords: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    const [lat, lng] = coords || [NaN, NaN];
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(zoom)) return;
    try {
      map.invalidateSize(false);
      const size = map.getSize();
      if (!size.x || !size.y) return;
      map.flyTo([lat, lng], zoom, { duration: 1.1 });
    } catch {
      // Leaflet throws Invalid LatLng when the container is still zero-sized.
    }
  }, [coords, zoom, map]);
  return null;
}

function MapZoomLocalizer({
  zoomInTitle,
  zoomOutTitle,
}: {
  zoomInTitle: string;
  zoomOutTitle: string;
}) {
  const map = useMap();
  useEffect(() => {
    const container =
      typeof (map as unknown as { getContainer?: () => HTMLElement })?.getContainer === "function"
        ? map.getContainer()
        : null;
    if (!container) return;
    const zoomIn = container.querySelector<HTMLElement>(".leaflet-control-zoom-in");
    const zoomOut = container.querySelector<HTMLElement>(".leaflet-control-zoom-out");
    if (zoomIn) {
      zoomIn.setAttribute("title", zoomInTitle);
      zoomIn.setAttribute("aria-label", zoomInTitle);
    }
    if (zoomOut) {
      zoomOut.setAttribute("title", zoomOutTitle);
      zoomOut.setAttribute("aria-label", zoomOutTitle);
    }
  }, [map, zoomInTitle, zoomOutTitle]);
  return null;
}

export interface GovernorateArchivalDetail {
  tribes: string;
  jurisdiction: string;
  census: string;
  chefLieu: string;
  surfaceKm2: string;
  caidatHistorique: string;
  shelfmarks: string[];
  monuments: string[];
  eras: string[];
  methodologyHint: string;
  archivalOverview?: string;
  primaryCotes?: string[];
}

export const GOV_ARCHIVAL_ENRICHMENT: Record<string, GovernorateArchivalDetail> = {
  tunis: {
    tribes: "Familles Baldiya de la Médina, Oulad Sidi Ali Azouz, fractions de l'Ariana et La Goulette",
    jurisdiction: "Tribunaux Charaïques de Tunis (Hanafite & Malikite), Séries Notariées Diwan al-Insha",
    census: "Recensements municipaux de Tunis 1891, 1921, 1926, 1931 et 1936",
    chefLieu: "Tunis (Médina & Banlieues)",
    surfaceKm2: "346 km²",
    caidatHistorique: "Caïdat de la Ville de Tunis & Dar El-Bey",
    shelfmarks: [
      "ANT Série SG (Secrétariat Général du Gouvernement)",
      "Fonds Dar El-Bey (Décrets beylicaux & Sceaux)",
      "Mahkama Charaïte de Tunis (Registres Malikite & Hanafite 1856-1956)",
      "CADN Nantes (Série État Civil Consulaire de Tunis)",
      "Archives du Grand Rabbinat de Tunis (Fonds Grana & Twansa)",
    ],
    monuments: [
      "Grande Mosquée Zitouna",
      "Médina de Tunis (Patrimoine Mondial UNESCO)",
      "Palais Dar Hussein, Dar Lasram & Dar Ben Abdallah",
      "Porte Bab Bhar & Casbah de Tunis",
    ],
    eras: ["punique", "romaine", "arabo_islamique", "hafside", "ottomane", "beylicale"],
    methodologyHint: "Pour les familles de la Médina (Baldiya), croiser en priorité les sijillats des cadis de la Zitouna avec les actes de habous familiaux (Ahli) conservés aux Archives Nationales de la Kasbah.",
  },
  ariana: {
    tribes: "Oulad Sidi Abid, notables maraîchers de La Soukra, lignées hispano-mauresques andalouses",
    jurisdiction: "Justice de Paix de Tunis-Nord et Qadi Malikite de l'Ariana, Séries Habous des Vergers",
    census: "Cahiers de la Majba du Caïdat de Tunis Banlieue 1860-1881",
    chefLieu: "Ariana",
    surfaceKm2: "482 km²",
    caidatHistorique: "Caïdat de la Banlieue Nord de Tunis",
    shelfmarks: [
      "ANT Série E (Affaires Générales de l'Ariana)",
      "Cahiers de la Majba 1860-1881 (Banlieue Nord)",
      "Actes des Adoul de La Soukra et Raoued",
      "Registres Fonciers de la Conservation de la Propriété Foncière",
    ],
    monuments: [
      "Manoirs maraîchers historiques de la Soukra",
      "Mausolée Sidi Amor Boukhtiwa",
      "Jardins de l'Ariana et roseraies historiques",
    ],
    eras: ["hafside", "ottomane", "beylicale", "contemporaine"],
    methodologyHint: "Rechercher les concessions agricoles et les propriétés maraîchères dans les registres fonciers du Tribunal Mixte et de la Conservation de la Propriété Foncière (1885+).",
  },
  ben_arous: {
    tribes: "Habitants de Radès, Hammam-Lif, Mohamedia et Oulad Boumhel",
    jurisdiction: "Juridiction du Caïdat de la Banlieue Sud, Fonds du Palais Beylical de Ksar Saïd",
    census: "Dénombrements ruraux et séries d'immatriculation foncière 1892-1940",
    chefLieu: "Ben Arous",
    surfaceKm2: "761 km²",
    caidatHistorique: "Caïdat de la Banlieue Sud de Tunis & Caïdat des Oulad Boumhel",
    shelfmarks: [
      "Fonds du Palais Beylical de Hammam-Lif (Résidence d'été des Beys)",
      "ANT Série F (Travaux Publics & Chemins de Fer de Banlieue)",
      "Registres Paroissiaux et Communaux de Radès et Mégrine",
    ],
    monuments: [
      "Palais Beylical d'Hammam-Lif",
      "Colline historique de Radès (Maxula-Prata antique)",
      "Mont Boukornine & Parc National",
    ],
    eras: ["romaine", "beylicale", "contemporaine"],
    methodologyHint: "Vérifier les listes nominatives d'employés et d'artisans beylicaux attachés aux résidences d'été et aux thermes beylicaux d'Hammam-Lif.",
  },
  manouba: {
    tribes: "Fractions de Oued Ellil, Den-Den, lignées de Sidi Amor Boukhtiwa",
    jurisdiction: "Tribunal de Première Instance de Tunis-Ouest, Séries des Habous Familiaux",
    census: "Registres de population et état civil de la Manouba 1908-1956",
    chefLieu: "La Manouba",
    surfaceKm2: "1 137 km²",
    caidatHistorique: "Caïdat de l'Oued Ellil & Manouba",
    shelfmarks: [
      "Archives du Palais Kobbet Ennhas",
      "ANT Série Habous Familiaux de la Vallée de la Medjerda",
      "Registres des Adoul de Tebourba et Oued Ellil (Fonds Andalou)",
    ],
    monuments: [
      "Palais Kobbet Ennhas (XVIIIe siècle)",
      "Palais Ksar Saïd (Lieu de signature du Traité de 1881)",
      "Mausolée Lalla Manoubia",
    ],
    eras: ["andalouse", "ottomane", "beylicale"],
    methodologyHint: "La présence morisque andalouse le long de la vallée de la Medjerda (Tebourba) est documentée dans les registres de répartition des terres irriguées de 1609-1750.",
  },
  bizerte: {
    tribes: "Confédérations des Mogods, Mateur, Ouchtata et Menzel Bourguiba",
    jurisdiction: "Tribunal Mixte et Qadi de Bizerte, Archives de l'Amirauté et de la Marine",
    census: "Recensements des Européens et Tunisiens du Nord 1911, 1926, 1936",
    chefLieu: "Bizerte (Hippo Diarrhytus)",
    surfaceKm2: "3 750 km²",
    caidatHistorique: "Caïdat de Bizerte & Mateur",
    shelfmarks: [
      "Archives de l'Amirauté et des Pêcheries de Bizerte",
      "ANT Série Marine & Douanes Beylicales du Nord",
      "Registres Paroissiaux de l'Église Notre-Dame de France",
      "Registres de l'État Civil Consulaire Français et Italien",
    ],
    monuments: [
      "Vieux Port de Bizerte & Forteresse de la Kasbah",
      "Fort d'Espagne (XVIe siècle)",
      "Parc National du Lac Ichkeul (UNESCO)",
      "Cap Blanc (Point le plus septentrional d'Afrique)",
    ],
    eras: ["punique", "romaine", "arabo_islamique", "ottomane", "beylicale", "contemporaine"],
    methodologyHint: "Pour les familles de pêcheurs italiens et maltais de Bizerte et Ferryville (Menzel Bourguiba), les archives d'embarquement maritime du port de Bizerte (1888-1956) sont capitales.",
  },
  beja: {
    tribes: "Tribus des Amdoun, Bejaoua, Nefza et fractions de Teboursouk",
    jurisdiction: "Tribunal Charaïque de Béja, Séries des Terres Céréalières et Habous de Sidi Bou Arba",
    census: "Registres fiscaux de la Majba 1860-1881 et rôle de conscription militaire",
    chefLieu: "Béja (Vaga)",
    surfaceKm2: "3 740 km²",
    caidatHistorique: "Caïdat de Béja & Téboursouk",
    shelfmarks: [
      "ANT Série Terres Céréalières et Henchirs Beylicaux",
      "Sijillats du Qadi Malikite de Béja (1852-1956)",
      "Cahiers de la Majba des Amdoun et Béjaoua (1860-1881)",
      "Actes des Adoul de Testour (Fonds Morisques Andalous)",
    ],
    monuments: [
      "Kasbah de Béja",
      "Site Romain Exceptionnel de Dougga (UNESCO - Thugga)",
      "Grande Mosquée de Testour (Horloge anti-horaire)",
      "Pont Trajan de Béja",
    ],
    eras: ["numide", "romaine", "andalouse", "ottomane", "beylicale"],
    methodologyHint: "À Testour et Téboursouk, les patronymes andalous (Chérif, Morisco, Haddad) se croisent avec les arbres généalogiques conservés par les familles descendantes des Morisques expulsés d'Espagne en 1609.",
  },
  jendouba: {
    tribes: "Confédérations des Khemir (Kroumirie), Ouled Bou Ghanem et Oulad Yahia",
    jurisdiction: "Mahkama Charaïya de Souk El Arba et Aïn Draham, Séries Forestières",
    census: "Registres nominatifs de la Kroumirie 1886-1936",
    chefLieu: "Jendouba (Souk El Arba)",
    surfaceKm2: "3 102 km²",
    caidatHistorique: "Caïdat de Souk El Arba & Kroumirie (Aïn Draham / Tabarka)",
    shelfmarks: [
      "ANT Série Kroumirie (Administration Provinciale)",
      "Archives Génoises de l'Île de Tabarka (Lomellini 1540-1741)",
      "Registres des Forêts de Chênes-lièges et Concessions Minières",
      "Cahiers nominatifs des Ouled Yahia et Ouled Bou Ghanem",
    ],
    monuments: [
      "Site Archéologique de Bulla Regia (Villas romaines souterraines)",
      "Fort Génois de Tabarka et Aiguilles Rocheuses",
      "Forêts de Chênes de Kroumirie (Aïn Draham)",
      "Site Antique de Chemtou (Simitthu - Marbre Numidique)",
    ],
    eras: ["numide", "romaine", "byzantine", "arabo_islamique", "ottomane", "beylicale"],
    methodologyHint: "L'histoire des familles coralliennes et génoises de Tabarka (familles tabarquines) se retrouve à la fois dans les registres notariés de Tabarka, à Gênes et à l'Île San Pietro (Carloforte, Sardaigne).",
  },
  le_kef: {
    tribes: "Grandes tribus des Dreid, Oulad Bou Ghanem, Oulad Sidi Khiar et Charne",
    jurisdiction: "Tribunal de la Casbah du Kef, Registres Notariés de la Frontière Algéro-Tunisienne",
    census: "Série Caïdale du Haut-Tell et recensements quinquennaux 1921-1936",
    chefLieu: "Le Kef (Sicca Veneria)",
    surfaceKm2: "4 965 km²",
    caidatHistorique: "Caïdat du Haut-Tell & Le Kef",
    shelfmarks: [
      "ANT Registres du Gouvernement Militaire de la Casbah du Kef",
      "Sijillats du Tribunal Charaïque du Kef (1862-1956)",
      "Registres des Déclarations de la Majba des Tribus Dreid",
      "Actes Notariés de la Zaouïa de Sidi Bou Makhlouf",
    ],
    monuments: [
      "Casbah Ottomane du Kef",
      "Basilique Romaine & Citerne Antique",
      "Zaouïa de Sidi Bou Makhlouf",
      "Synagogue du Kef (El Ghriba du Haut-Tell)",
    ],
    eras: ["numide", "romaine", "byzantine", "ottomane", "beylicale"],
    methodologyHint: "Carrefour frontalier avec l'Algérie constantinoise : de nombreuses familles keffoises possèdent des branches collatérales dans les tribus des Haractas et Nemenchas répertoriées aux ANOM d'Aix-en-Provence.",
  },
  siliana: {
    tribes: "Fractions des Oulad Aoun, Siliana et Oulad Ayar de Makthar",
    jurisdiction: "Juridiction de Makthar et Gaâfour, Actes Notariés des Habous de Sidi Bou Rouis",
    census: "Cahiers des impositions pastorales et recensements 1911-1946",
    chefLieu: "Siliana",
    surfaceKm2: "4 642 km²",
    caidatHistorique: "Caïdat des Oulad Aoun, Makthar & Kesra",
    shelfmarks: [
      "ANT Série Impositions Pastorales du Haut-Tell",
      "Registres Charaïques de Makthar (Mactaris antique)",
      "Actes des Adoul du Village Berbère de Kesra",
      "Cahiers de la Majba des Oulad Ayar (1861-1880)",
    ],
    monuments: [
      "Site Mégalithique et Romain de Makthar (Arc de Trajan)",
      "Village Perché Berbère de Kesra (Cascades et Oliveraies)",
      "Zaouïa de Sidi Bou Rouis",
      "Site Antique de Zama Regia (Bataille d'Hannibal)",
    ],
    eras: ["numide", "romaine", "berbere", "arabo_islamique", "beylicale"],
    methodologyHint: "À Kesra, les lignées berbères les plus anciennes ont conservé la transmission orale de leurs arbres d'ancêtres, complétée par les actes notariés de partage d'oliveraies séculaires.",
  },
  nabeul: {
    tribes: "Communautés du Cap-Bon, descendants andalous de Testour, Soliman et Nabeul",
    jurisdiction: "Tribunaux Charaïques de Nabeul et Kelibia, Séries des Vergers et Habous Maritimes",
    census: "Registres de l'État Civil municipal de Nabeul et Hammamet 1888-1956",
    chefLieu: "Nabeul (Neapolis)",
    surfaceKm2: "2 840 km²",
    caidatHistorique: "Caïdat du Cap-Bon & Soliman",
    shelfmarks: [
      "ANT Fonds Notarié du Cap-Bon (Nabeul, Kelibia, Hammamet)",
      "Registres de l'État Civil Municipal de Nabeul (1888-1956)",
      "Actes des Adoul de la Corporation des Potiers et Tisserands",
      "Registres des Vergers d'Agrumes et Droits d'Irrigation",
    ],
    monuments: [
      "Forteresse Byzantine et Ottomane de Kelibia (Aspis)",
      "Ateliers Traditionnels de Poterie de Nabeul",
      "Médina d'Hammamet & Fort Marin",
      "Site Archéologique de Kerkouane (UNESCO - Cité Punique intacte)",
    ],
    eras: ["punique", "romaine", "andalouse", "ottomane", "beylicale"],
    methodologyHint: "Le Cap-Bon allie traditions punico-romaines et apport andalou majeur à Soliman et Grombalia. Les registres des corporations de métiers de Nabeul détaillent la transmission familiale des ateliers.",
  },
  zaghouan: {
    tribes: "Lignées hispano-andalouses de Zaghouan, Zriba et Saouaf",
    jurisdiction: "Qadi de Zaghouan et conservation foncière des aqueducs historiques",
    census: "Dénombrements des familles morisques et séries fiscales du Caïdat de Zaghouan",
    chefLieu: "Zaghouan (Ziqua)",
    surfaceKm2: "2 820 km²",
    caidatHistorique: "Caïdat de Zaghouan & Zriba",
    shelfmarks: [
      "Archives des Concessions d'Eau de l'Aqueduc de Carthage",
      "ANT Série Caïdale de Zaghouan",
      "Registres Notariés des Familles Morisques de Zaghouan",
      "Fonds de la Zaouïa de Sidi Ali Azzouz",
    ],
    monuments: [
      "Temple des Eaux Romain de Zaghouan & Aqueduc vers Carthage",
      "Village Berbère Abandonné de Zriba Olia",
      "Zaouïa de Sidi Ali Azzouz (Berceau de la fabrication de la Chéchia)",
      "Djebel Zaghouan (1 295 m)",
    ],
    eras: ["romaine", "andalouse", "ottomane", "beylicale"],
    methodologyHint: "Les familles artisanes liées à la corporation des chéchias (chaouachis) de Tunis puisaient à Zaghouan leur approvisionnement en eau pour le feutrage de la laine (voir les rôles de la corporation des Chaouachia).",
  },
  sousse: {
    tribes: "Populations maritimes du Sahel, fractions de Kalaa Kebira, Msaken et Akouda",
    jurisdiction: "Tribunal Charaïque de Sousse, Séries Notariées des oliveraies et commerce maritime",
    census: "Recensements de Sousse 1901, 1911, 1921, 1931 et 1936",
    chefLieu: "Sousse (Hadrumetum)",
    surfaceKm2: "2 669 km²",
    caidatHistorique: "Caïdat de Sousse & Sahel Septentrional",
    shelfmarks: [
      "ANT Série Sahel (Oliveraies et Commerce d'Huile)",
      "Sijillats de la Mahkama Charaïya de Sousse (1850-1956)",
      "Registres du Port Commercial et de l'État Civil Municipal",
      "Fonds des Adoul de Msaken, Kalaa Kebira et Akouda",
    ],
    monuments: [
      "Ribat de Sousse & Tour de Khalef Al Fata",
      "Médina de Sousse (UNESCO) & Grande Mosquée Aghlabide",
      "Catacombes Romaines du Bon Pasteur",
      "Kasbah de Sousse & Musée Archéologique",
    ],
    eras: ["punique", "romaine", "aghlabide", "ottomane", "beylicale"],
    methodologyHint: "Les registres notariés de Msaken et de Sousse contiennent des milliers d'actes de vente et de transmission d'arbres (oliviers numérotés) qui permettent de reconstituer 5 à 7 générations d'ascendance.",
  },
  monastir: {
    tribes: "Lignées du Ribat de Monastir, Ksar Hellal, Moknine et Téboulba",
    jurisdiction: "Mahkama Charaïya de Monastir, Waqfs du Mausolée de Sidi El Mazeri",
    census: "Registres des corporations d'artisans tisserands et recensements du Sahel",
    chefLieu: "Monastir (Ruspina)",
    surfaceKm2: "1 024 km²",
    caidatHistorique: "Caïdat de Monastir & Sahel Central",
    shelfmarks: [
      "Archives du Grand Ribat d'Harthama Ibn A'yan",
      "ANT Série Habous de Sidi El Mazeri",
      "Registres des Corporations de Tisserands de Ksar Hellal et Moknine",
      "Cahiers de la Majba du Sahel Monastirien 1860-1881",
    ],
    monuments: [
      "Grand Ribat de Monastir (VIIIe siècle)",
      "Mausolée de la Famille Bourguiba",
      "Médina de Moknine (Poterie et Bijouterie Juive & Musulmane)",
      "Kasbah et Port de Pêche de Téboulba",
    ],
    eras: ["romaine", "aghlabide", "fatimide", "ottomane", "beylicale"],
    methodologyHint: "À Moknine, la coexistence séculaire des artisans potiers musulmans et bijoutiers israélites se retrouve dans les registres conjoints de la justice locale et des corporations d'orfèvres.",
  },
  mahdia: {
    tribes: "Lignées maritimes mahdoises, fractions de Chebba, El Jem et Ksour Essef",
    jurisdiction: "Tribunal Charaïque de Mahdia, Séries des pêcheries et concessions oléicoles",
    census: "Recensements de la population côtière et état civil municipal 1895-1956",
    chefLieu: "Mahdia (Cap Africa / Première Capitale Fatimide)",
    surfaceKm2: "2 878 km²",
    caidatHistorique: "Caïdat de Mahdia & Sahel Méridional",
    shelfmarks: [
      "ANT Série Marine Fatimide et Pêcheries Mahdoises",
      "Sijillats du Qadi de Mahdia et El Jem",
      "Registres des Déclarations de Majba des Tisserands de Soie",
      "Actes d'Adoul de Ksour Essef et Chebba",
    ],
    monuments: [
      "Skifa Kahla (Grande Porte Fortifiée Fatimide)",
      "Grande Mosquée Fatimide d'Obeid Allah El Mahdi",
      "Amphithéâtre Romain d'El Jem (UNESCO - Thysdrus)",
      "Bordj El Kebir (Fort Ottoman) & Cimetière Marin",
    ],
    eras: ["romaine", "fatimide", "ziride", "ottomane", "beylicale"],
    methodologyHint: "L'Amphithéâtre d'El Jem et sa région environnante comptaient d'importantes lignées de propriétaires terriens dont les successions sont consignées dans les registres du Caïdat de Mahdia.",
  },
  sfax: {
    tribes: "Familles citadines de la Médina de Sfax, fractions de Sakiet, Agareb et Kerkennah",
    jurisdiction: "Tribunal Charaïque de Sfax (Mahkama Charaïya), Séries Notariées des Oliveraies Sfaxiennes",
    census: "Recensements quinquennaux de Sfax 1911, 1921, 1926, 1931 et 1936",
    chefLieu: "Sfax (Taparura)",
    surfaceKm2: "7 545 km²",
    caidatHistorique: "Caïdat de Sousse & Sfax puis Caïdat Autonome de Sfax",
    shelfmarks: [
      "ANT Série Notariée de Sfax (Cartons Sfax 1 à 48)",
      "Mahkama Charaïya de Sfax (Séries Hanafite & Malikite)",
      "Registres des Corporations de Kerkennah (Pêcheurs maritimes)",
      "Déclarations Nominatives de la Majba de Sfax (1860-1881)",
      "Registres Foncier des Oliveraies de la Forêt Sfaxienne (Ghaba)",
    ],
    monuments: [
      "Remparts Crénelés et Médina de Sfax (Bordj Ennar)",
      "Grande Mosquée de Sfax (IXe siècle)",
      "Archipel des Îles Kerkennah (Pêche ancestrale à la Charfiya)",
      "Site Romain de Thyna (Thaenae)",
    ],
    eras: ["romaine", "aghlabide", "ziride", "ottomane", "beylicale"],
    methodologyHint: "Sfax possède le corpus d'actes d'adoul le plus complet de Tunisie pour le XIXe siècle. Les registres des Ghaba (oliveraies en copropriété) mentionnent systématiquement le nom du père, du grand-père et de la mère de chaque contractant.",
  },
  kairouan: {
    tribes: "Confédérations des Jlass (Beni Zid, Oulad Iddir), Ouled Khalifa et Chbika",
    jurisdiction: "Cour Magistrale Charaïque de Kairouan, Actes Notariés de la Grande Mosquée Okba",
    census: "Séries Majba du Caïdat des Jlass 1856-1881 et registres des nomades",
    chefLieu: "Kairouan (Capitale de l'Islam Maghrébin)",
    surfaceKm2: "6 712 km²",
    caidatHistorique: "Caïdat des Jlass & Kairouan",
    shelfmarks: [
      "ANT Série E (Affaires Régionales de Kairouan)",
      "Cour Magistrale Charaïque de Kairouan (Fonds Okba)",
      "Archives Notariées de la Zaouïa de Sidi Sahbi (Barbier du Prophète)",
      "Cahiers de la Majba des Confédérations des Jlass (1856-1881)",
    ],
    monuments: [
      "Grande Mosquée de Kairouan (Mosquée Okba Ibn Nafi)",
      "Bassins des Aghlabides (IXe siècle)",
      "Mausolée de Sidi Sahbi (Abou Zamaa El Balaoui)",
      "Médina de Kairouan (UNESCO) & Bir Barouta",
    ],
    eras: ["arabo_islamique", "aghlabide", "fatimide", "ziride", "ottomane", "beylicale"],
    methodologyHint: "Pour les familles chérifiennes et d'oulémas de Kairouan, les manuscrits des bibliothèques de la Grande Mosquée et de la Zaouïa de Sidi Sahbi renferment des arbres généalogiques remontant au Xe siècle.",
  },
  kasserine: {
    tribes: "Confédérations des Majer, Frachiche et Oulad Sidi Tlil de Fériana",
    jurisdiction: "Caïdat des Frachiche, Juridiction de Sbeïtla et justice coutumière tribale",
    census: "Recensements des tribus des steppes occidentales 1892-1946",
    chefLieu: "Kasserine (Cillium)",
    surfaceKm2: "8 260 km²",
    caidatHistorique: "Caïdat des Frachiche & Majer",
    shelfmarks: [
      "ANT Registres du Caïdat des Tribus des Steppes Occidentales",
      "Actes Coutumiers de la Mahkama de Sbeïtla (Sufetula)",
      "Recensements des Tribus Majer et Frachiche (1892-1946)",
      "Cahiers Nominatifs de la Majba de Fériana et Haïdra",
    ],
    monuments: [
      "Site Archéologique de Sbeïtla (Temples du Capitole Romain)",
      "Mausolée des Flavii à Cillium",
      "Site Byzantin d'Ammaedara (Haïdra)",
      "Mont Djebel Chambi (Point culminant de Tunisie 1 544 m)",
    ],
    eras: ["numide", "romaine", "byzantine", "berbere", "beylicale"],
    methodologyHint: "Dans les hautes steppes, la généalogie s'appuie sur la structure segmentaire des confédérations des Frachiche et des Majer : chaque individu est rattaché à son arch (tribu) puis à sa ferka (fraction).",
  },
  sidi_bouzid: {
    tribes: "Confédérations des Hammama, Oulad Aziz et fractions pastorales",
    jurisdiction: "Mahkama de Sidi Bouzid et Gafsa, Séries des parcours pastoraux et puits artésiens",
    census: "Cahiers de la Majba des Hammama et recensements nominatifs 1921-1936",
    chefLieu: "Sidi Bouzid",
    surfaceKm2: "7 400 km²",
    caidatHistorique: "Caïdat des Hammama (Sidi Bouzid & Gafsa)",
    shelfmarks: [
      "ANT Série Caïdale des Hammama (Cartons Majba 1860-1881)",
      "Registres des Droits de Parcours Pastoraux et Terres 'Arch",
      "Mahkama Charaïya de Sidi Bouzid et Regueb",
      "Dénombrements des Familles Nomades et Semi-sédentaires",
    ],
    monuments: [
      "Zaouïa du Saint Patron Sidi Bouzid El Ouni",
      "Plaines Steppiques de Regueb et Jelma",
      "Puits Artésiens Historiques et Parcours Pastoraux",
    ],
    eras: ["berbere", "arabo_islamique", "beylicale", "contemporaine"],
    methodologyHint: "La grande révolte de la Majba de 1864 sous Ali Ben Ghedhahem (chef des Majer) a laissé des rôles d'interrogatoires et de recensements nominatifs très détaillés aux Archives Nationales de Tunisie.",
  },
  gafsa: {
    tribes: "Lignées de l'oasis de Gafsa, Oulad Sidi Boubaker et mineurs de Métlaoui",
    jurisdiction: "Tribunal Charaïque de Gafsa, Séries Notariées de l'Oasis et bassins romains",
    census: "Recensements des ouvriers miniers et familles oasiennes 1906-1946",
    chefLieu: "Gafsa (Capsa)",
    surfaceKm2: "7 807 km²",
    caidatHistorique: "Caïdat de Gafsa & Métlaoui",
    shelfmarks: [
      "ANT Série Mines de Phosphates de Gafsa-Métlaoui",
      "Tribunal Charaïque de Gafsa (Séries Oasis et Droits d'Eau)",
      "Registres Paroissiaux et Miniers de Métlaoui et Redeyef",
      "Cahiers de la Majba de l'Oasis de Gafsa et El Ksar",
    ],
    monuments: [
      "Bassins Romains de Gafsa",
      "Kasbah de Gafsa",
      "Gorges de Selja et Train Légendaire Lézard Rouge",
      "Gisements Préhistoriques Capsiens",
    ],
    eras: ["capsienne_prehistorique", "romaine", "arabo_islamique", "ottomane", "beylicale"],
    methodologyHint: "À la fois berceau préhistorique (civilisation capsienne) et pôle minier majeur dès 1897 : consulter les registres d'embauche de la Compagnie des Phosphates de Gafsa (CPG) pour les ouvriers du Sud.",
  },
  tozeur: {
    tribes: "Familles savantes du Jérid, lignées d'Ibn Chabbat, Nefta et Degache",
    jurisdiction: "Tribunal Charaïque du Jérid à Tozeur, Séries Notariées des Droits d'Eau de l'Oasis",
    census: "Registres de répartition des eaux et état civil oasien 1890-1956",
    chefLieu: "Tozeur (Thusuros)",
    surfaceKm2: "5 593 km²",
    caidatHistorique: "Caïdat du Jérid (Tozeur, Nefta & Degache)",
    shelfmarks: [
      "Fonds Historique des Registres de Partage des Eaux d'Ibn Chabbat (XIIIe s.)",
      "Sijillats des Cadis du Jérid à Tozeur et Nefta",
      "ANT Série Habous des Palmeraies du Jérid",
      "Cahiers de l'État Civil Oasien et Recensements de Nefta",
    ],
    monuments: [
      "Quartier Historique d'Ouled El Hadef (Briques pleines ocre en relief)",
      "Palmeraie de Tozeur (400 000 palmiers dattiers)",
      "Nefta (La Corbeille & Zaouïas Soufies)",
      "Chott El Djérid (Lac Salé légendaire)",
    ],
    eras: ["romaine", "arabo_islamique", "hafside", "ottomane", "beylicale"],
    methodologyHint: "Les registres de répartition des eaux d'irrigation (Kaddas) du Jérid, conçus par le mathématicien Ibn Chabbat, constituent des registres nominatifs héréditaires remontant sans discontinuer sur plusieurs siècles.",
  },
  kebili: {
    tribes: "Confédérations des Merazig (Douz), Nefzaoua et Oulad Yacoub",
    jurisdiction: "Caïdat des Nefzaoua, Séries des caravanes sahariennes et droits coutumiers",
    census: "Dénombrements des nomades et sédentaires du Nefzaoua 1911-1936",
    chefLieu: "Kébili",
    surfaceKm2: "22 454 km²",
    caidatHistorique: "Caïdat des Nefzaoua (Kébili & Douz)",
    shelfmarks: [
      "ANT Série Confins Sahariens et Caïdat des Nefzaoua",
      "Registres des Caravanes Transsahariennes et Droits de Douane",
      "Dénombrements des Confédérations Merazig et Oulad Yacoub",
      "Mahkama Coutumière de Douz (Porte du Grand Erg)",
    ],
    monuments: [
      "Vieux Village Perché et Oasis de Kébili",
      "Dunes du Grand Erg Oriental à Douz",
      "Oasis de Jemna (Modèle autogéré d'agronomie)",
      "Zaouïa de Sidi Yacoub",
    ],
    eras: ["berbere", "arabo_islamique", "nomade_saharienne", "beylicale"],
    methodologyHint: "Pour les familles nomades Merazig de Douz et Oulad Yacoub, les cahiers de pacage sahariens et les registres du Service des Affaires Indigènes (1890-1956) fournissent les lignées agnatiques complètes.",
  },
  gabes: {
    tribes: "Lignées de l'oasis maritime de Gabès, Oulad Sidi Boulbaba et fractions de Chenini",
    jurisdiction: "Tribunal Charaïque de Gabès, Séries des Habous Oasiens et douanes maritimes",
    census: "Recensements de Gabès 1911, 1926, 1936 et séries militaires du Sud",
    chefLieu: "Gabès (Tacape)",
    surfaceKm2: "7 166 km²",
    caidatHistorique: "Caïdat des Aradh & Gabès",
    shelfmarks: [
      "ANT Série Aradh et Oasis Littorale de Gabès",
      "Tribunal Charaïque de Gabès (Séries Chenini et Teboulbou)",
      "Registres Notariés de la Zaouïa de Sidi Boulbaba (Compagnon du Prophète)",
      "Cahiers des Douanes Maritimes et du Commerce du Henné",
    ],
    monuments: [
      "Oasis Maritime Unique en Méditerranée de Gabès (Chenini)",
      "Mausolée de Sidi Boulbaba",
      "Village Berbère Troglodytique de Matmata",
      "Marché Historique de Jara (Henné et Épices)",
    ],
    eras: ["romaine", "berbere_troglodyte", "arabo_islamique", "ottomane", "beylicale"],
    methodologyHint: "À Matmata et Tamezret, les communautés berbères troglodytes ont préservé des contrats matrimoniaux et de succession rédigés en caractères arabes mais comportant des toponymes et patronymes amazighs séculaires.",
  },
  medenine: {
    tribes: "Confédération des Ouerghemma, communautés de l'Île de Djerba (Houmt Souk, Midoun)",
    jurisdiction: "Tribunaux Charaïques et Rabbiniques de Djerba, Caïdat de Médenine",
    census: "Registres des Ksours de Médenine et recensements de Djerba 1898-1956",
    chefLieu: "Médenine",
    surfaceKm2: "9 167 km²",
    caidatHistorique: "Caïdat des Ouerghemma & Caïdat de Djerba",
    shelfmarks: [
      "ANT Série Ksours des Ouerghemma (Cartons Médenine, Ben Gardane)",
      "Tribunal Charaïque et Rabbinique de Djerba (Houmt Souk & Midoun)",
      "Registres Paroissiaux et Notariés des Maltais et Grecs de Djerba (CADN)",
      "Actes des Adoul de Zarzis (Pêche aux éponges)",
    ],
    monuments: [
      "Synagogue de la Ghriba de Djerba (La plus ancienne d'Afrique)",
      "Ksours et Ghorfas de Médenine et Metameur",
      "Mosquée Souterraine Ibadite Fadhloun à Djerba",
      "Oliveraies Séculaires et Port de Zarzis",
    ],
    eras: ["romaine", "juive_antique", "ibadite", "berbere", "beylicale"],
    methodologyHint: "À Djerba, la recherche généalogique croise trois juridictions confessionnelles distinctes : les tribunaux charaïques malékites, les mahkamas ibadites pour les communautés de la Médina, et le Tribunal Rabbinique de la Ghriba.",
  },
  tataouine: {
    tribes: "Tribus berbères des Ksours (Chenini, Douiret, Guermessa) et nomades Oudaïa",
    jurisdiction: "Poste Militaire des Affaires Indigènes et Caïdat de Tataouine",
    census: "Dénombrement des populations des Ksours et caravanes du Sahara 1902-1946",
    chefLieu: "Tataouine",
    surfaceKm2: "38 889 km²",
    caidatHistorique: "Caïdat des Confins Sahariens & Poste Militaire de Tataouine",
    shelfmarks: [
      "Archives du Territoire Militaire du Sud (Commandement de Tataouine)",
      "ANT Séries Nominatives des Berbères des Ksours (Chenini, Douiret)",
      "Registres des Caravanes vers Ghadamès et Ghat (Libye)",
      "Cahiers d'Imposition des Nomades Oudaïa et fractions pastorales",
    ],
    monuments: [
      "Ksar Ouled Soltane (Ghorfas à 4 étages - UNESCO)",
      "Village Berbère Perché de Chenini & Mosquée des 7 Dormants",
      "Ksar Hadada & Village Troglodyte de Douiret",
      "Géoparc Mondial UNESCO du Dahar (Dinosaures et Météorites)",
    ],
    eras: ["berbere_ksourienne", "prehistorique", "nomade_saharienne", "militaire_sud"],
    methodologyHint: "Les greniers fortifiés collectifs (Ksours) constituaient de véritables conservatoires généalogiques : chaque ghorfa appartenait à une lignée familiale précise dont la clé se transmettait de père en fils aîné.",
  },
};

export default function TunisiaGovernoratesMap({
  variant = "full",
  hideHeaderBanners = false,
}: {
  /** Auth side panels use `embed` inside `hidden lg:flex` — delay Leaflet until lg. */
  variant?: "full" | "embed";
  hideHeaderBanners?: boolean;
} = {}) {
  const { t, isRtl, locale } = useTranslation();
  const { user, isAdmin } = useAuth();

  const normalizedRole = Number(user?.role);
  const isPlatformAdmin = isAdmin || normalizedRole === 1 || normalizedRole === 3;
  const userTierId = Number(user?.tier_id ?? (typeof user?.tier === "number" ? user?.tier : 1));
  const planSlug = String(user?.subscription_plan || user?.tier || "").toLowerCase();
  const isPaidPlan =
    planSlug.includes("premium") ||
    planSlug.includes("historian") ||
    planSlug.includes("chercheur") ||
    planSlug.includes("pro");
  const hasPaidAccess = isPlatformAdmin || userTierId >= 2 || isPaidPlan;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<RegionId>("all_tunisia");
  const [tileStyle, setTileStyle] = useState<TileLayerKey>("osm");
  const [viewportReady, setViewportReady] = useState(variant !== "embed");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"regions" | "governorates">("regions");
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(true);
  const [dossierExpanded, setDossierExpanded] = useState<boolean>(true);
  const [bottomPillsExpanded, setBottomPillsExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (variant !== "embed" || typeof window === "undefined") {
      setViewportReady(true);
      return;
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setViewportReady(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [variant]);

  const activeDossier = useMemo(() => {
    return regionDossiers[activeRegion] || regionDossiers.all_tunisia;
  }, [activeRegion]);

  const selectedGov = useMemo(() => {
    if (!selectedId) return null;
    return governorates.find((g) => g.id === selectedId) || null;
  }, [selectedId]);

  const selectedGovEnrichment = useMemo(() => {
    if (!selectedGov) return null;
    return getLocalizedGovEnrichment(selectedGov.id, locale);
  }, [selectedGov, locale]);

  const filteredGovernorates = useMemo(() => {
    let list = activeRegion === "all_tunisia" ? governorates : governorates.filter((g) => g.region === activeRegion);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.id.toLowerCase().includes(q) ||
          t(`gov_name_${g.id}`).toLowerCase().includes(q) ||
          g.notableFamilies.some(
            (f) => f.toLowerCase().includes(q) || t(`fam_${f}`).toLowerCase().includes(q),
          ),
      );
    }
    return list;
  }, [activeRegion, searchQuery, t]);

  const mapView = useMemo<{ coords: [number, number]; zoom: number }>(() => {
    const fallback: [number, number] = [34.4, 9.6];
    if (selectedGov) {
      const [lat, lng] = selectedGov.coords || [NaN, NaN];
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { coords: [lat, lng], zoom: 9 };
      }
    }
    if (activeRegion !== "all_tunisia" && filteredGovernorates.length > 0) {
      const valid = filteredGovernorates.filter(
        (g) => Number.isFinite(g.coords?.[0]) && Number.isFinite(g.coords?.[1]),
      );
      if (valid.length) {
        const avgLat = valid.reduce((acc, g) => acc + g.coords[0], 0) / valid.length;
        const avgLng = valid.reduce((acc, g) => acc + g.coords[1], 0) / valid.length;
        if (Number.isFinite(avgLat) && Number.isFinite(avgLng)) {
          return { coords: [avgLat, avgLng], zoom: 7 };
        }
      }
    }
    return { coords: fallback, zoom: 6 };
  }, [selectedGov, activeRegion, filteredGovernorates]);

  const handleRegionClick = (reg: RegionId) => {
    setActiveRegion(reg);
    setSelectedId(null);
  };

  const handleGovSelect = (gov: Governorate) => {
    setSelectedId(gov.id);
    setActiveRegion(gov.region);
  };

  const formatRegionLabel = (reg: RegionId) => t(REGION_LABEL_KEYS[reg]);
  const formatGovName = (govId: string) => t(`gov_name_${govId}`);
  const formatFamName = (famKey: string) => t(`fam_${famKey}`);

  const currentLayer = OPEN_SOURCE_TILE_LAYERS[tileStyle];

  const isEmbed = variant === "embed";

  if (isEmbed && !viewportReady) {
    return <div className="absolute inset-0 w-full h-full bg-[var(--card)] animate-pulse" />;
  }

  // Auth pages: interactive map with direct button to full interactive map page
  if (isEmbed) {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="absolute inset-0 z-0 flex h-full w-full flex-col bg-[var(--card)]"
      >
        {/* Top Header Floating Banner with Button to Full Interactive Map */}
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--gold)]/35 bg-gradient-to-r from-[var(--card)] via-[var(--gold)]/10 to-[var(--card)] px-3.5 py-2.5 z-[500] shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)] shadow-sm shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div className="truncate">
              <h3 className="font-display text-xs sm:text-sm font-extrabold text-[var(--foreground)] tracking-wide truncate">
                {t("map_auth_title", "Atlas Généalogique & Archivistique")}
              </h3>
              <p className="text-[0.62rem] text-[var(--muted-foreground)] font-medium truncate">
                {t("map_auth_subtitle", "24 gouvernorats, registres d'état civil & notariats beylicaux")}
              </p>
            </div>
          </div>

          <Link
            to="/interactive-map"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-base btn-gold text-xs px-3.5 py-1.5 rounded-xl shadow-md font-bold inline-flex items-center gap-1.5 whitespace-nowrap hover:scale-[1.03] transition-transform shrink-0"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>{t("map_btn_open_fullscreen", "Ouvrir la Carte Interactive Pleine Page ↗")}</span>
          </Link>
        </div>

        {/* Region Filter Chips */}
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-1.5 border-b border-[var(--gold)]/25 bg-[var(--card)]/95 px-2 py-2 z-[500]">
          {REGIONS.map((reg) => {
            const isActive = activeRegion === reg;
            return (
              <button
                key={reg}
                type="button"
                onClick={() => handleRegionClick(reg)}
                className={`rounded-md px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#b81428] !text-white border-[#b81428] shadow-md"
                    : "bg-[var(--card)] text-[var(--foreground)] border-[var(--gold)]/40 hover:border-[var(--gold)] hover:bg-[var(--gold)]/15"
                }`}
              >
                {formatRegionLabel(reg)}
              </button>
            );
          })}
        </div>

        {/* Map View */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-3 relative">
          <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)]">
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
              <span>
                {selectedGov
                  ? `${formatGovName(selectedGov.id)} (${selectedGov.population})`
                  : `${formatRegionLabel(activeRegion)} · ${filteredGovernorates.length} ${t("governorates_count")}`}
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-[var(--gold)]/35 bg-[var(--background)] p-1">
              <Layers className="h-3.5 w-3.5 text-[var(--gold)] mx-1.5" />
              {(Object.keys(OPEN_SOURCE_TILE_LAYERS) as TileLayerKey[]).map((key) => {
                const layer = OPEN_SOURCE_TILE_LAYERS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTileStyle(key)}
                    className={`rounded px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      tileStyle === key
                        ? "bg-[#d9a441] !text-[#1f160f] shadow-sm"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {t(layer.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border-2 border-[var(--gold)]/35 shadow-inner">
            <MapContainer
              center={[34.4, 9.6]}
              zoom={6}
              scrollWheelZoom
              zoomControl
              attributionControl={false}
              className="h-full w-full z-0"
              style={{ background: "#e8e0d0" }}
            >
              <MapCenterController coords={mapView.coords} zoom={mapView.zoom} />
              <MapZoomLocalizer
                zoomInTitle={t("map_zoom_in", "Zoom in")}
                zoomOutTitle={t("map_zoom_out", "Zoom out")}
              />
              <TileLayer key={currentLayer.id} url={currentLayer.url} maxZoom={18} />
              {filteredGovernorates.map((gov) => {
                const [glat, glng] = gov.coords || [NaN, NaN];
                if (!Number.isFinite(glat) || !Number.isFinite(glng)) return null;
                const isSelected = selectedId === gov.id;
                return (
                  <Marker
                    key={gov.id}
                    position={[glat, glng]}
                    icon={isSelected ? selectedIcon : goldIcon}
                    eventHandlers={{ click: () => handleGovSelect(gov) }}
                  >
                    <Tooltip direction="top" offset={[0, -10]}>
                      <span dir={isRtl ? "rtl" : "ltr"} className="font-display font-bold text-sm">
                        {formatGovName(gov.id)}
                      </span>
                    </Tooltip>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Selected Governorate Floating Overlay in Auth */}
            {selectedGov && (
              <div className="absolute bottom-2 start-2 end-2 z-[400] rounded-xl border border-[var(--gold)]/60 bg-[var(--card)]/95 p-3 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#b81428]" />
                    <span>{formatGovName(selectedGov.id)}</span>
                    <span className="text-[10px] text-[var(--gold)] font-mono">({selectedGov.population})</span>
                  </h4>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 line-clamp-1">
                    {selectedGovEnrichment?.caidatHistorique || formatRegionLabel(selectedGov.region)}
                  </p>
                </div>
                <Link
                  to={`/interactive-map?gov=${selectedGov.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-gold text-[0.65rem] px-3 py-1.5 rounded-lg shadow-sm font-bold inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>{t("map_open_dossier", "Inspecter le Dossier Détaillé")}</span>
                  <ExternalLink className="h-3 w-3 rtl:-scale-x-100" />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Governorates bottom scroll list */}
          <div className="mt-2 flex shrink-0 items-center gap-2 overflow-x-auto border-t border-[var(--gold)]/25 pt-2 text-xs">
            {filteredGovernorates.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGovSelect(g)}
                className={`shrink-0 rounded-md border px-3 py-1 text-xs font-semibold cursor-pointer ${
                  selectedId === g.id
                    ? "border-[#b81428] bg-[#b81428] !text-white"
                    : "border-[var(--gold)]/35 bg-[var(--background)] text-[var(--foreground)]"
                }`}
              >
                {formatGovName(g.id)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--gold)] mb-3">
          <Compass className="h-3.5 w-3.5" />
          {t("map_atlas_eyebrow")}
        </span>
        <h2 className="display-lg text-[var(--foreground)] font-bold">
          {t("map_atlas_title")}
        </h2>
        <div className="gold-rule mx-auto mt-3 mb-4 w-24" />
        <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed font-medium">
          {t("map_atlas_intro")}
        </p>

        {/* Choice: manipulate section directly OR navigate to full page & Freemium banner */}
        {!hideHeaderBanners && (
          <>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/interactive-map"
                className="btn-base btn-gold inline-flex items-center gap-2 text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xl hover:scale-[1.03] transition-transform font-bold"
              >
                <Compass className="h-4 w-4" />
                <span>{t("map_btn_open_fullscreen", "Ouvrir la Carte Interactive Pleine Page ↗")}</span>
                <ExternalLink className="h-3.5 w-3.5 rtl:-scale-x-100" />
              </Link>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">
                {t("map_full_page_hint", "Manipulez directement ci-dessous ou ouvrez en page dédiée plein écran")}
              </span>
            </div>

            {!hasPaidAccess && (
              <div className="surface-card rounded-2xl border-2 border-[var(--gold)]/45 bg-gradient-to-r from-[var(--gold)]/10 via-[var(--card)] to-[var(--gold)]/10 p-4 sm:p-5 my-5 max-w-3xl mx-auto shadow-md">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] shrink-0 border border-[var(--gold)]/35 shadow-sm">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[var(--gold)] block">
                        {t("map_freemium_preview_badge", "Aperçu Découverte · Version Complète pour Abonnés (Paliers 1 & 2)")}
                      </span>
                      <p className="text-xs text-[var(--foreground)]/90 mt-0.5 leading-relaxed">
                        {t("map_freemium_preview_desc", "Vous explorez actuellement l'aperçu gratuit de la section. La carte plein écran avec dossiers tribaux complets et registres de la Majba est réservée aux abonnés des Paliers 1 & 2.")}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/interactive-map"
                    className="btn-base btn-gold text-xs px-4 py-2.5 shrink-0 rounded-xl shadow-sm font-bold inline-flex items-center gap-2 whitespace-nowrap hover:scale-[1.02] transition-transform"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>{t("map_freemium_unlock_cta", "Débloquer la Carte Complète (Paliers 1 & 2)")}</span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Retractable Unified Filter Capsule (Regions & Governorates) */}
      <div className="mb-6 rounded-2xl border-2 border-[var(--gold)]/40 bg-[var(--card)]/95 shadow-xl backdrop-blur-md overflow-hidden transition-all">
        {/* Capsule Control Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:px-4 sm:py-3 border-b border-[var(--gold)]/25 bg-gradient-to-r from-[var(--gold)]/10 via-transparent to-[var(--gold)]/10">
          {/* Segmented Mode Switcher: Regions vs Governorates */}
          <div className="flex items-center gap-1 rounded-xl border border-[var(--gold)]/40 bg-[var(--background)]/90 p-1">
            <button
              type="button"
              onClick={() => {
                setFilterMode("regions");
                setFiltersExpanded(true);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterMode === "regions"
                  ? "bg-[#b81428] !text-white shadow-md"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>{t("map_tab_regions", "Régions")} ({REGIONS.length - 1})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterMode("governorates");
                setFiltersExpanded(true);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterMode === "governorates"
                  ? "bg-[#b81428] !text-white shadow-md"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <Landmark className="h-3.5 w-3.5" />
              <span>{t("map_tab_governorates", "Gouvernorats")} ({governorates.length})</span>
            </button>
          </div>

          {/* Active summary label */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
            <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>
              {selectedGov
                ? `${formatGovName(selectedGov.id)} (${formatRegionLabel(selectedGov.region)})`
                : `${formatRegionLabel(activeRegion)} (${activeDossier.governorates.length} ${t("governorates_count", "gouv.")})`}
            </span>
          </div>

          {/* Retractable Toggle Actions */}
          <div className="flex items-center gap-2 ms-auto">
            {/* Toggle Dossier Panel */}
            <button
              type="button"
              onClick={() => setDossierExpanded(!dossierExpanded)}
              className="btn-base btn-outline-ink text-[0.68rem] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-bold cursor-pointer"
              title={dossierExpanded ? t("map_hide_dossier", "Masquer Dossier") : t("map_show_dossier", "Afficher Dossier")}
            >
              {dossierExpanded ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5 text-[var(--gold)]" />}
              <span className="hidden sm:inline">{dossierExpanded ? t("map_hide_dossier", "Masquer Dossier") : t("map_show_dossier", "Afficher Dossier")}</span>
            </button>

            {/* Toggle Filters Expansion */}
            <button
              type="button"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="btn-base btn-gold text-[0.68rem] px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <span>{filtersExpanded ? t("map_collapse_filters", "Replier les filtres") : t("map_expand_filters", "Déplier les filtres")}</span>
              {filtersExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Retractable Body Content */}
        {filtersExpanded && (
          <div className="p-3 sm:p-4 animate-in fade-in duration-200">
            {filterMode === "regions" ? (
              <div className="space-y-2">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center justify-between">
                  <span>{t("map_select_region_prompt", "Sélectionnez une région pour explorer son patrimoine :")}</span>
                  <span className="text-[var(--gold)] font-mono">{REGIONS.length - 1} {t("map_geographic_regions_count", "régions géographiques")}</span>
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  {REGIONS.map((reg) => {
                    const isActive = activeRegion === reg && !selectedId;
                    const isParentOfSelected = selectedGov && selectedGov.region === reg;
                    const count = reg === "all_tunisia" ? 24 : regionDossiers[reg]?.governorates.length || 0;
                    return (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => handleRegionClick(reg)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                          isActive
                            ? "bg-[#b81428] !text-white border-[#b81428] shadow-md scale-[1.02]"
                            : isParentOfSelected
                            ? "bg-[#d9a441] !text-[#1f160f] border-[#d9a441] font-extrabold shadow-sm"
                            : "bg-[var(--card)] text-[var(--foreground)] border-[var(--gold)]/35 hover:border-[var(--gold)] hover:bg-[var(--gold)]/15"
                        }`}
                      >
                        <span>{formatRegionLabel(reg)}</span>
                        <span className={`text-[10px] font-mono rounded px-1.5 py-0.2 ${isActive ? "bg-white/20 text-white" : "bg-[var(--gold)]/20 text-[var(--gold)]"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {t("map_direct_gov_access", "Accès direct aux 24 gouvernorats :")}
                  </p>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("map_filter_gov_placeholder", "Filtrer gouvernorat ou famille...")}
                      className="w-full rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] ps-8 pe-6 py-1 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute end-2 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-h-36 overflow-y-auto p-1">
                  {filteredGovernorates.map((g) => {
                    const isSelected = selectedId === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleGovSelect(g)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1 ${
                          isSelected
                            ? "bg-[#b81428] !text-white border-[#b81428] font-bold shadow-md scale-105"
                            : "bg-[var(--card)] text-[var(--foreground)] border-[var(--gold)]/30 hover:border-[var(--gold)] hover:bg-[var(--gold)]/15"
                        }`}
                      >
                        <span>{formatGovName(g.id)}</span>
                        <span className="text-[9px] font-mono opacity-70">({g.population})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map + Sidebar Split (Equal Height) */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Left: OpenStreetMap Interactive Container */}
        <div className={`${dossierExpanded ? "lg:col-span-7" : "lg:col-span-12"} surface-card overflow-hidden p-3 border-2 border-[var(--gold)]/45 shadow-2xl rounded-xl flex flex-col h-[420px] sm:h-[560px] lg:h-[680px] bg-[var(--card)] transition-all duration-300 relative`}>
          {/* Floating Button to Re-open Dossier when collapsed */}
          {!dossierExpanded && (
            <button
              type="button"
              onClick={() => setDossierExpanded(true)}
              className="absolute top-4 end-4 z-[400] btn-base btn-gold text-xs px-3.5 py-2 rounded-xl shadow-2xl inline-flex items-center gap-2 font-bold cursor-pointer hover:scale-105 transition-all"
              title={t("map_expand_dossier_title", "Déplier le dossier archivistique")}
            >
              <PanelRightOpen className="h-4 w-4" />
              <span>
                {selectedGov
                  ? `${t("map_dossier_prefix", "Dossier :")} ${formatGovName(selectedGov.id)}`
                  : `${t("map_dossier_prefix", "Dossier :")} ${formatRegionLabel(activeRegion)}`}
              </span>
            </button>
          )}

          {/* Top Map Toolbar: Open-Source Layer Switcher + Status + Search */}
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)]">
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
              <span>
                {selectedGov
                  ? `${formatGovName(selectedGov.id)} (${selectedGov.population})`
                  : `${formatRegionLabel(activeRegion)} · ${filteredGovernorates.length} ${t("governorates_count")}`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[140px] sm:min-w-[190px]">
                <Search className="absolute start-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("map_search_placeholder", "Rechercher région, famille…")}
                  className="w-full rounded border border-[var(--gold)]/35 bg-[var(--background)] ps-7 pe-5 py-1 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                  >
                    ×
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-1 rounded-md border border-[var(--gold)]/35 bg-[var(--background)] p-1">
                <Layers className="h-3.5 w-3.5 text-[var(--gold)] mx-1.5" />
                {(Object.keys(OPEN_SOURCE_TILE_LAYERS) as TileLayerKey[]).map((key) => {
                  const layer = OPEN_SOURCE_TILE_LAYERS[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTileStyle(key)}
                      className={`rounded px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        tileStyle === key
                          ? "bg-[#d9a441] !text-[#1f160f] shadow-sm"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {t(layer.labelKey)}
                    </button>
                  );
                })}
              </div>

              <Link
                to="/interactive-map"
                title={hasPaidAccess ? t("map_open_full_page", "Ouvrir la Carte Interactive Complète") : t("map_freemium_unlock_cta", "Débloquer la Carte Complète (Paliers 1 & 2)")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-2.5 py-1.5 text-[0.68rem] font-bold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[#1f160f] transition-colors"
              >
                {hasPaidAccess ? <Maximize2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                <span>{hasPaidAccess ? t("map_full_page_short", "Pleine Page") : t("map_full_version_short", "Version Complète")}</span>
              </Link>
            </div>
          </div>

          {/* Map Canvas */}
          <div className="flex-1 w-full rounded-lg overflow-hidden relative min-h-0 border border-[var(--gold)]/30">
            <MapContainer
              center={[34.4, 9.6]}
              zoom={6}
              scrollWheelZoom={false}
              zoomControl={true}
              attributionControl={false}
              className="h-full w-full z-0"
              style={{ background: "#e8e0d0" }}
            >
              <MapCenterController coords={mapView.coords} zoom={mapView.zoom} />
              <MapZoomLocalizer
                zoomInTitle={t("map_zoom_in", "Zoom in")}
                zoomOutTitle={t("map_zoom_out", "Zoom out")}
              />
              <TileLayer
                key={currentLayer.id}
                url={currentLayer.url}
                maxZoom={18}
              />
              {filteredGovernorates.map((gov) => {
                const [glat, glng] = gov.coords || [NaN, NaN];
                if (!Number.isFinite(glat) || !Number.isFinite(glng)) return null;
                const isSelected = selectedId === gov.id;
                const govLabel = formatGovName(gov.id);
                return (
                  <Marker
                    key={gov.id}
                    position={[glat, glng]}
                    icon={isSelected ? selectedIcon : goldIcon}
                    eventHandlers={{
                      click: () => handleGovSelect(gov),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]}>
                      <span dir={isRtl ? "rtl" : "ltr"} className="font-display font-bold text-sm !text-[#1e1610]">
                        {govLabel}
                      </span>
                    </Tooltip>
                    <Popup>
                      <div dir={isRtl ? "rtl" : "ltr"} className="p-1.5 max-w-[230px] !text-[#1e1610] text-start">
                        <h4 className="font-display font-bold text-base !text-[#9f1239]">
                          {govLabel}
                        </h4>
                        <p className="text-xs font-semibold !text-[#5c4938] mt-0.5">
                          {formatRegionLabel(gov.region)} · {gov.population} {t("inhabitants")}
                        </p>
                        <p className="text-xs !text-[#2b2118] mt-2 leading-relaxed">
                          {t(`gov_desc_${gov.id}`)}
                        </p>
                        <button
                          onClick={() => handleGovSelect(gov)}
                          className="mt-3 w-full btn-base btn-gold text-[0.65rem] py-1.5 cursor-pointer"
                        >
                          {t("view_archival_details")}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
            <div className="pointer-events-none absolute bottom-1.5 end-2 z-[400] rounded bg-black/65 px-2 py-0.5 text-[0.62rem] font-semibold !text-white">
              © {t(currentLayer.labelKey)}
            </div>
          </div>

          {/* Quick Governorates Pill List (Retractable) */}
          <div className="mt-2 shrink-0 border-t border-[var(--gold)]/25 pt-1.5">
            <div className="flex items-center justify-between text-xs mb-1 px-1">
              <button
                type="button"
                onClick={() => setBottomPillsExpanded(!bottomPillsExpanded)}
                className="eyebrow text-[0.65rem] font-extrabold text-[var(--gold)] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{t("governorates_label")}: ({filteredGovernorates.length})</span>
                {bottomPillsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </button>
              <button
                type="button"
                onClick={() => setBottomPillsExpanded(!bottomPillsExpanded)}
                className="text-[10px] text-[var(--muted-foreground)] hover:text-[var(--gold)] cursor-pointer"
              >
                {bottomPillsExpanded ? t("map_collapse_list", "Replier la liste") : t("map_expand_list", "Déplier la liste")}
              </button>
            </div>

            {bottomPillsExpanded && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs animate-in fade-in duration-150">
                {filteredGovernorates.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      handleGovSelect(g);
                      if (!dossierExpanded) setDossierExpanded(true);
                    }}
                    className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer border ${
                      selectedId === g.id
                        ? "bg-[#b81428] !text-white border-[#b81428] font-bold shadow-sm"
                        : "bg-[var(--background)] text-[var(--foreground)] border-[var(--gold)]/35 hover:border-[var(--gold)] hover:bg-[var(--gold)]/15"
                    }`}
                  >
                    {formatGovName(g.id)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Dynamic Information Dossier Panel (Region or Governorate) - Retractable */}
        {dossierExpanded && (
          <div className="lg:col-span-5 surface-card p-4 sm:p-6 border-2 border-[var(--gold)]/45 shadow-2xl flex flex-col min-h-[420px] max-h-[540px] sm:max-h-none sm:h-[560px] lg:h-[680px] rounded-xl overflow-hidden bg-[var(--card)] animate-in fade-in duration-200">
            {selectedGov ? (
              /* INDIVIDUAL GOVERNORATE DOSSIER */
              <>
                <div className="shrink-0 border-b border-[var(--gold)]/30 pb-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedId(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline cursor-pointer"
                    >
                      <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
                      {t("back_to_overview")}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-[var(--gold)]/50 bg-[var(--gold)]/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-[var(--foreground)]">
                        {t("pop_prefix")} {selectedGov.population}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDossierExpanded(false)}
                        className="text-[var(--muted-foreground)] hover:text-[var(--gold)] p-1 rounded cursor-pointer"
                        title={t("map_hide_dossier_title", "Masquer le dossier pour agrandir la carte")}
                      >
                        <PanelRightClose className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <h3 className="display-lg text-2xl sm:text-3xl text-[var(--foreground)] font-bold">
                      {formatGovName(selectedGov.id)}
                    </h3>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)] mt-1">
                    {t("capital_label")}: {t(`gov_capital_${selectedGov.id}`)} · {formatRegionLabel(selectedGov.region)}
                  </p>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto pe-1 text-start space-y-4 py-3 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-1">
                      {t("historical_overview")}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                      {t(`gov_desc_${selectedGov.id}`)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[var(--secondary)]/80 border border-[var(--gold)]/35">
                    <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold text-xs uppercase tracking-[0.14em] mb-1.5">
                      <Archive className="h-4 w-4" />
                      <span>{t("archival_civil_records")}</span>
                    </div>
                    <p className="text-xs text-[var(--foreground)]/90 leading-relaxed">
                      {t(`gov_notes_${selectedGov.id}`)}
                    </p>
                  </div>

                  <div>
                    <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-1">
                      {t("key_historical_landmarks")}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] font-medium">
                      {t(`gov_landmarks_${selectedGov.id}`)}
                    </p>
                  </div>

                  {/* Rich Archival & Tribal Lineages Enrichment */}
                  {selectedGovEnrichment && (
                    <div className="p-3.5 rounded-lg bg-[var(--background)]/80 border border-[var(--gold)]/30 space-y-2.5">
                      <div>
                        <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
                          <GitBranch className="h-3.5 w-3.5" />
                          <span>{t("map_tribal_fractions_title", "Fractions Tribales & Notables Locaux")}</span>
                        </p>
                        <p className="text-xs text-[var(--foreground)] mt-0.5 leading-relaxed">
                          {selectedGovEnrichment.tribes}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--gold)]/15">
                        <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
                          <Archive className="h-3.5 w-3.5" />
                          <span>{t("map_charaa_jurisdiction_title", "Juridiction Charaïque & Séries d'Archives")}</span>
                        </p>
                        <p className="text-xs text-[var(--foreground)] mt-0.5 leading-relaxed">
                          {selectedGovEnrichment.jurisdiction}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--gold)]/15">
                        <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5" />
                          <span>{t("map_historical_census_title", "Recensements Historiques & Séries Fiscales (Majba)")}</span>
                        </p>
                        <p className="text-xs text-[var(--foreground)] mt-0.5 leading-relaxed">
                          {selectedGovEnrichment.census}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-2">
                      {t("historically_documented_lineages")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedGov.notableFamilies.map((famKey) => {
                        const famLabel = formatFamName(famKey);
                        return (
                          <Link
                            key={famKey}
                            to={`/gallery/trees?q=${encodeURIComponent(famLabel)}`}
                            className="rounded-md border border-[var(--gold)]/45 bg-[var(--background)] px-2.5 py-1 text-xs font-bold text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                          >
                            {famLabel}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="shrink-0 pt-3 border-t border-[var(--gold)]/25 grid grid-cols-2 gap-2.5 mt-auto">
                  <Link
                    to={`/gallery?q=${encodeURIComponent(formatGovName(selectedGov.id))}`}
                    className="btn-base btn-red text-[0.68rem] py-2.5 text-center flex items-center justify-center gap-1.5"
                  >
                    <Search className="h-3.5 w-3.5" /> {t("records")}
                  </Link>
                  <Link
                    to={`/gallery/trees?q=${encodeURIComponent(formatGovName(selectedGov.id))}`}
                    className="btn-base btn-outline-ink text-[0.68rem] py-2.5 text-center flex items-center justify-center gap-1.5"
                  >
                    <GitBranch className="h-3.5 w-3.5" /> {t("trees")}
                  </Link>
                </div>
              </>
            ) : (
              /* REGIONAL OVERVIEW DOSSIER */
              <>
                <div className="shrink-0 border-b border-[var(--gold)]/30 pb-3.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-[var(--gold)]/50 bg-[var(--gold)]/10 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                      {t("regional_archival_dossier")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--foreground)] font-bold">
                        {activeDossier.governorates.length} {t("governorates_count")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDossierExpanded(false)}
                        className="text-[var(--muted-foreground)] hover:text-[var(--gold)] p-1 rounded cursor-pointer"
                        title={t("map_hide_dossier_title", "Masquer le dossier pour agrandir la carte")}
                      >
                        <PanelRightClose className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <h3 className="display-lg text-2xl sm:text-3xl text-[var(--foreground)] font-bold">
                      {t(`dossier_title_${activeDossier.id}`)}
                    </h3>
                  </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto pe-1 text-start space-y-4 py-3 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-1">
                      {t("territory_demographics")}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                      {t(`dossier_summary_${activeDossier.id}`)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[var(--secondary)]/80 border border-[var(--gold)]/35">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)] mb-1">
                      {t("historical_settlement_layers")}
                    </p>
                    <p className="text-xs text-[var(--foreground)]/90 leading-relaxed">
                      {t(`dossier_settlement_${activeDossier.id}`)}
                    </p>
                  </div>

                  <div>
                    <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-1">
                      {t("archival_repositories_court")}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">
                      {t(`dossier_holdings_${activeDossier.id}`)}
                    </p>
                  </div>

                  {/* Interactive Member Governorates Cards */}
                  <div>
                    <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-2 flex items-center justify-between">
                      <span>{t("member_governorates")}</span>
                      <span className="font-mono text-[10px]">{activeDossier.governorates.length} {t("governorates_count", "gouvernorats")}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeDossier.governorates.map((govId) => {
                        const gObj = governorates.find((x) => x.id === govId);
                        if (!gObj) return null;
                        return (
                          <button
                            key={govId}
                            type="button"
                            onClick={() => handleGovSelect(gObj)}
                            className="flex items-center justify-between rounded-xl border border-[var(--gold)]/35 bg-[var(--background)]/80 p-2 text-start transition-all hover:border-[var(--gold)] hover:bg-[var(--gold)]/15 hover:scale-[1.02] cursor-pointer group"
                          >
                            <div>
                              <span className="text-xs font-bold text-[var(--foreground)] group-hover:text-[var(--gold)]">
                                {formatGovName(govId)}
                              </span>
                              <span className="block text-[10px] text-[var(--muted-foreground)]">
                                {getLocalizedGovEnrichment(govId, locale)?.chefLieu || t("capital_label")}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[var(--gold)] bg-[var(--gold)]/10 px-1.5 py-0.5 rounded">
                              {gObj.population}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-2">
                      {t("notable_family_lineages")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDossier.notableLineages.map((famKey) => {
                        const famLabel = formatFamName(famKey);
                        return (
                          <Link
                            key={famKey}
                            to={`/gallery/trees?q=${encodeURIComponent(famLabel)}`}
                            className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                          >
                            {famLabel}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Direct Search Actions */}
                <div className="shrink-0 pt-3 border-t border-[var(--gold)]/25 grid grid-cols-2 gap-2.5 mt-auto">
                  <Link
                    to={`/gallery?q=${encodeURIComponent(formatRegionLabel(activeRegion))}`}
                    className="btn-base btn-red text-[0.68rem] py-2.5 text-center flex items-center justify-center gap-1.5"
                  >
                    <Search className="h-3.5 w-3.5" /> {t("regional_records")}
                  </Link>
                  <Link
                    to={`/gallery/trees?q=${encodeURIComponent(formatRegionLabel(activeRegion))}`}
                    className="btn-base btn-outline-ink text-[0.68rem] py-2.5 text-center flex items-center justify-center gap-1.5"
                  >
                    <GitBranch className="h-3.5 w-3.5" /> {t("regional_trees")}
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Full Interactive Atlas Banner */}
      <div className="mt-8 rounded-2xl border-2 border-[var(--gold)]/45 bg-gradient-to-r from-[var(--gold)]/15 via-[var(--card)] to-[var(--gold)]/10 p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 text-start">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)] shadow-md shrink-0">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-extrabold text-[var(--foreground)] tracking-wide">
              {t("map_btn_open_fullscreen", "Ouvrir la Carte Interactive Pleine Page ↗")}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5 max-w-2xl leading-relaxed">
              {t(
                "map_bottom_banner_desc",
                "Consultez l'Atlas complet avec les volets rétractables dédiés aux cotes des Archives Nationales (ANT), aux confédérations tribales, aux cadastres et aux arbres généalogiques certifiés."
              )}
            </p>
          </div>
        </div>

        <Link
          to="/interactive-map"
          className="btn-base btn-gold font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform text-xs sm:text-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Compass className="h-4 w-4" />
          <span>{t("map_btn_open_fullscreen", "Ouvrir la Carte Interactive Pleine Page ↗")}</span>
          <ExternalLink className="h-4 w-4 rtl:-scale-x-100" />
        </Link>
      </div>
    </div>
  );
}
