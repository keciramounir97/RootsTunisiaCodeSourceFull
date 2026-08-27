import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  Marker,
  ZoomControl,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import L from "leaflet";

// Custom burgundy marker icon
const burgundyIcon = L.divIcon({
  className: "",
  html: `<div style="background:#c1913e;width:18px;height:18px;border-radius:50%;border:3px solid #FDFBF7;box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;"><div style="width:6px;height:6px;background:#FDFBF7;border-radius:50%;"></div></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/* Injected tooltip + popup styles */
const customStyles = `
  .maghreb-tooltip {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
  }
  .maghreb-tooltip .leaflet-tooltip {
    background: #FDFBF7 !important;
    color: #111111 !important;
    border: 1px solid #c1913e !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18) !important;
    font-family: inherit !important;
    padding: 8px 14px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
  }
  .maghreb-tooltip .leaflet-tooltip-top:before,
  .maghreb-tooltip .leaflet-tooltip-bottom:before,
  .maghreb-tooltip .leaflet-tooltip-left:before,
  .maghreb-tooltip .leaflet-tooltip-right:before {
    border-top-color: #c1913e !important;
    border-bottom-color: #c1913e !important;
    border-left-color: #c1913e !important;
    border-right-color: #c1913e !important;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 10px !important;
    box-shadow: 0 6px 24px rgba(0,0,0,0.2) !important;
    border: 1px solid #c1913e !important;
    background: #FDFBF7 !important;
    color: #111111 !important;
  }
  .leaflet-popup-tip {
    border: 1px solid #c1913e !important;
    background: #FDFBF7 !important;
  }
  .maghreb-popup-content {
    font-family: inherit;
    line-height: 1.5;
  }
  .maghreb-popup-content h4 {
    color: #c1913e;
    margin: 0 0 6px 0;
    font-size: 15px;
  }
  .maghreb-popup-content strong {
    color: #c1913e;
  }
  .maghreb-popup-content p {
    margin: 4px 0;
    font-size: 12px;
  }
`;

/* =======================
   DATA TYPES
   ======================= */
interface MaghrebRegion {
  name: string;
  country: string;
  color: string;
  coordinates: [number, number][];
  description: string;
  history: string;
  tribes: string;
  attractions: string;
}

interface MaghrebCity {
  name: string;
  country: string;
  coords: [number, number];
  importance: string;
}

/* =======================
   DATA: REGIONS OF THE ARAB MAGHREB UNION
   ======================= */
const maghrebRegions: MaghrebRegion[] = [
  // ── MOROCCO ──
  {
    name: "Fès & Meknès",
    country: "Maroc",
    color: "#c1913e",
    coordinates: [
      [34.5, -6.0],
      [34.5, -4.0],
      [33.5, -4.0],
      [33.5, -6.0],
    ],
    description: "Foyer académique et spirituel",
    history: "Cœur intellectuel du Maroc, abritant l'Université millénaire Al-Qarawiyyin. Foyer historique des manuscrits de lignages chérifiens et des registres des cadis idrisides.",
    tribes: "Idrissi, Alami, Benjelloun, Fassi, Aït Youssi",
    attractions: "Médina de Fès, Bab Mansour à Meknès, Ruines romaines de Volubilis",
  },
  {
    name: "Marrakech & Souss",
    country: "Maroc",
    color: "#c1913e",
    coordinates: [
      [31.5, -9.5],
      [31.5, -7.0],
      [29.5, -7.0],
      [29.5, -9.5],
    ],
    description: "Dynasties impériales et traditions chleuhs",
    history: "Berceau et capitale des grands empires Almoravide et Almohade. Carrefour stratégique des tribus berbères chleuhs et portes du Souss.",
    tribes: "Glaoui, Sossi, Aït Baamrane, Ouled Yahia",
    attractions: "Place Jemaa el-Fna, Koutoubia, Médina de Taroudant",
  },
  {
    name: "Rabat & Gharb",
    country: "Maroc",
    color: "#c1913e",
    coordinates: [
      [35.0, -7.0],
      [35.0, -6.0],
      [33.7, -6.0],
      [33.7, -7.0],
    ],
    description: "Capitale administrative et archives du Makhzen",
    history: "Région côtière abritant les archives royales et du Makhzen. Historiquement marquée par l'installation des familles andalouses expulsées.",
    tribes: "Zaer, Gharbaoui, Cherkaoui, Andalusian lineages",
    attractions: "Tour Hassan, Kasbah des Oudayas, Chellah",
  },
  {
    name: "Tanger & Rif",
    country: "Maroc",
    color: "#c1913e",
    coordinates: [
      [36.0, -6.0],
      [36.0, -3.0],
      [35.0, -3.0],
      [35.0, -6.0],
    ],
    description: "Porte de la Méditerranée et montagnes du Rif",
    history: "Région montagneuse rifaine marquée par l'histoire de la résistance, les dynasties mérinides et les routes maritimes internationales.",
    tribes: "Ghomara, Zenata, Rifi, Beni Ouarain",
    attractions: "Grottes d'Hercule, Chefchaouen la bleue, Médina de Tétouan",
  },
  {
    name: "Tafilalet & Draâ",
    country: "Maroc",
    color: "#c1913e",
    coordinates: [
      [32.5, -6.0],
      [32.5, -3.5],
      [29.5, -3.5],
      [29.5, -6.0],
    ],
    description: "Berceau Alaouite et routes caravanières",
    history: "Oasis sahariennes et berceau d'origine de la dynastie Alaouite régnante. Site de l'ancienne Sijilmassa, plaque tournante du commerce transsaharien.",
    tribes: "Filali, Diri, Mezouar, Ouled Hamza",
    attractions: "Ruines de Sijilmassa, Vallée du Draâ, Ksar d'Aït Benhaddou",
  },

  // ── ALGERIA ──
  {
    name: "Alger & Mitidja",
    country: "Algérie",
    color: "#c1913e",
    coordinates: [
      [36.9, 2.0],
      [36.9, 4.0],
      [36.2, 4.0],
      [36.2, 2.0],
    ],
    description: "Régence ottomane et Archives Nationales",
    history: "Siège historique de la Régence d'Alger, marqué par l'héritage ottoman, andalou et colonial. Abrite le Centre National des Archives (CNA).",
    tribes: "Deylik, Mitidji, Belkacem, Andalusi families",
    attractions: "Casbah d'Alger, Basilique Notre-Dame d'Afrique, Jardin d'Essai",
  },
  {
    name: "Oranie & Tlemcen",
    country: "Algérie",
    color: "#c1913e",
    coordinates: [
      [36.2, -2.5],
      [36.2, 1.0],
      [34.5, 1.0],
      [34.5, -2.5],
    ],
    description: "Royaume Zianide et influences espagnoles",
    history: "Algérie occidentale, marquée par la présence espagnole à Oran et la grandeur de Tlemcen, ancienne capitale zianide, riche en manuscrits.",
    tribes: "Zianide, Ouled Mimoun, Beni Amer, Orani, Hamian",
    attractions: "Fort de Santa Cruz à Oran, Grande Mosquée de Tlemcen",
  },
  {
    name: "Constantine & Est",
    country: "Algérie",
    color: "#c1913e",
    coordinates: [
      [37.0, 5.0],
      [37.0, 8.5],
      [35.5, 8.5],
      [35.5, 5.0],
    ],
    description: "Beylik de l'Est et culture chaouia",
    history: "Région de Constantine, bâtie sur les gorges du Rhummel. Archives importantes du Beylik de l'Est et registres de la charia ottomane.",
    tribes: "Beylik, Chaouia, Benbadis, Ouled Soltane",
    attractions: "Pont suspendu de Sidi M'Cid, Palais du Bey, Ruines romaines de Djemila",
  },
  {
    name: "Kabylie",
    country: "Algérie",
    color: "#c1913e",
    coordinates: [
      [36.9, 4.0],
      [36.9, 5.5],
      [36.3, 5.5],
      [36.3, 4.0],
    ],
    description: "Confédérations berbères de Haute Kabylie",
    history: "Massifs montagneux abritant une forte tradition orale. Arbres généalogiques préservés au sein des comités de villages (Tajmaât).",
    tribes: "Ath Yanni, Ath Menguellet, Zouaoua, Flissa",
    attractions: "Parc National du Djurdjura, Gorges de Kherrata",
  },
  {
    name: "Sahara & Mzab",
    country: "Algérie",
    color: "#c1913e",
    coordinates: [
      [34.5, 1.0],
      [34.5, 8.5],
      [28.0, 8.5],
      [28.0, 1.0],
    ],
    description: "Pentapole du Mzab et Touareg du Tassili",
    history: "Oasis sahariennes du Sud. Les archives de la communauté Ibadi de Ghardaïa documentent des siècles de généalogies familiales.",
    tribes: "Mozabites, Chaâmba, Touareg Ajjer, Tebu",
    attractions: "Vallée du M'zab, Djanet, Peintures rupestres du Tassili n'Ajjer",
  },

  // ── LIBYA ──
  {
    name: "Tripolitaine",
    country: "Libye",
    color: "#c1913e",
    coordinates: [
      [33.0, 11.5],
      [33.0, 15.0],
      [30.0, 15.0],
      [30.0, 11.5],
    ],
    description: "Archives Karamanli et Sijil al-Madani",
    history: "Libye occidentale. Sijil al-Madani de Tripoli, registres judiciaires ottomans et archives de la dynastie Karamanli.",
    tribes: "Mahmoudi, Tarhuna, Warfalla, Tripoli families",
    attractions: "Site romain de Leptis Magna, Théâtre de Sabratha, Vieille ville de Tripoli",
  },
  {
    name: "Cyrénaïque",
    country: "Libye",
    color: "#c1913e",
    coordinates: [
      [33.0, 19.5],
      [33.0, 25.0],
      [29.0, 25.0],
      [29.0, 19.5],
    ],
    description: "Ordre Senussi et tribus Hilaliennes",
    history: "Est libyen, abritant les archives de l'ordre religieux Senussi. Point de passage historique de la migration des tribus arabes hilaliennes.",
    tribes: "Saadi, Harabi, Baraasa, Senussi lineages",
    attractions: "Cité grecque de Cyrène, Palais d'El-Manar à Benghazi",
  },
  {
    name: "Fezzan",
    country: "Libye",
    color: "#c1913e",
    coordinates: [
      [30.0, 10.0],
      [30.0, 19.5],
      [24.0, 19.5],
      [24.0, 10.0],
    ],
    description: "Royaume des Garamantes et Sahara",
    history: "Libye du Sud. Royaume historique des Garamantes. Registres des caravanes sahariennes reliant le Fezzan au Sahel.",
    tribes: "Megarha, Touareg Fezzan, Tebu, Fezzani",
    attractions: "Ruines archéologiques de Germa, Oasis d'Ubari",
  },

  // ── MAURITANIA ──
  {
    name: "Adrar & Chinguetti",
    country: "Mauritanie",
    color: "#c1913e",
    coordinates: [
      [23.0, -13.0],
      [23.0, -8.0],
      [19.0, -8.0],
      [19.0, -13.0],
    ],
    description: "Bibliothèques de manuscrits anciens",
    history: "Plateaux de l'Adrar. Foyer intellectuel historique avec les bibliothèques familiales de Chinguetti préservant les généalogies (Nasab).",
    tribes: "Smasside, Kounta, Idawali, Laghlal",
    attractions: "Bibliothèques de manuscrits de Chinguetti, Oasis de Terjit",
  },
  {
    name: "Trarza & Brakna",
    country: "Mauritanie",
    color: "#c1913e",
    coordinates: [
      [19.0, -17.0],
      [19.0, -13.0],
      [16.0, -13.0],
      [16.0, -17.0],
    ],
    description: "Émirat du Trarza et commerce du fleuve",
    history: "Sud-ouest mauritanien, zone d'influence historique de l'Émirat du Trarza. Archives coloniales et traités d'alliances tribales.",
    tribes: "Ouled Ahmed, Trarza, Brakna, Ehel Barikalla",
    attractions: "Rosso historique, Vestiges d'Aoudaghost",
  },
  {
    name: "Tagant & Est",
    country: "Mauritanie",
    color: "#c1913e",
    coordinates: [
      [19.0, -11.0],
      [19.0, -5.0],
      [15.0, -5.0],
      [15.0, -11.0],
    ],
    description: "Cités caravanières de l'Est",
    history: "Centre et Est mauritanien. Cités historiques de Tichitt et Oualata. Contient des manuscrits de savants locaux sur l'histoire tribale.",
    tribes: "Tajakanat, Idaouali, Ehel Sidy Mahmoud",
    attractions: "Ancienne ville fortifiée de Tichitt, Oasis de Tidjikja",
  },

  // ── TUNISIA (PRE-EXISTING) ──
  {
    name: "Tunis & Banlieue",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [36.92, 9.85],
      [36.95, 10.40],
      [36.60, 10.35],
      [36.55, 9.85],
      [36.70, 9.75],
    ],
    description: "Capitale politique et culturelle",
    history: "Cœur historique de la Tunisie, fondée par les Berbères puis successivement phénicienne, romaine, arabe et ottomane. Siège du pouvoir husseinite et de la République.",
    tribes: "Belaid, Bahri, Makhzen, Beni Khaled",
    attractions: "Médina de Tunis, Site de Carthage, Bardo, Sidi Bou Saïd",
  },
  {
    name: "Bizerte & Cap Nord",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [37.40, 9.40],
      [37.35, 10.35],
      [37.00, 10.15],
      [36.90, 9.60],
      [37.10, 9.25],
    ],
    description: "Port stratégique du nord",
    history: "Port naturel depuis l'Antiquité, dernier bastion français en Afrique du Nord jusqu'en 1963. Berceau de la marine tunisienne.",
    tribes: "Ouled Aoun, Berbères Kroumirs, Beni Atia",
    attractions: "Vieille ville de Bizerte, Lac Ichkeul, Cap Angela",
  },
  {
    name: "Nabeul & Cap Bon",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [37.00, 10.70],
      [36.95, 11.25],
      [36.40, 11.00],
      [36.35, 10.45],
      [36.65, 10.40],
    ],
    description: "Péninsule du Cap Bon, grenier agricole",
    history: "Région agricole riche depuis l'Antiquité punique, célèbre pour ses vins, ses agrumes et ses poteries.",
    tribes: "Ouled Sarsar, Beni Brahim, Ouled Chérif",
    attractions: "Kerkouane, Hammamet, Kelibia, Neapolis",
  },
  {
    name: "Kairouan & Centre",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [36.00, 9.20],
      [36.10, 10.50],
      [35.00, 10.40],
      [34.90, 8.90],
      [35.40, 8.50],
    ],
    description: "Ville sainte et steppes centrales",
    history: "Fondée en 670 par Oqba Ibn Nafi, quatrième ville sainte de l'Islam et plus ancienne cité islamique du Maghreb.",
    tribes: "Fraichich, Hamama, Jlass, Ouled Bou Ali",
    attractions: "Grande Mosquée, Bassins Aghlabides, Zaouïa Sidi Sahab",
  },
  {
    name: "Sousse & Sahel",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [36.10, 10.20],
      [36.15, 10.85],
      [35.70, 10.85],
      [35.65, 10.20],
    ],
    description: "Capitale du Sahel, perle touristique",
    history: "Port phénicien d'Hadrumète, capitale byzantine puis centre intellectuel aghlabide. Cœur du tourisme tunisien.",
    tribes: "Mhaya, Beni Zid, Ouled Saïd",
    attractions: "Médina de Sousse, Ribat, Port El Kantaoui, Friguia",
  },
  {
    name: "Monastir & Mahdia",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [35.80, 10.55],
      [35.85, 11.20],
      [35.20, 11.20],
      [35.15, 10.50],
    ],
    description: "Sahel sud, berceau présidentiel",
    history: "Monastir ville natale de Bourguiba. Mahdia première capitale fatimide califale au Xe siècle, port de pêche historique.",
    tribes: "Beni Kacem, Ouled Saïd, Beni Zid",
    attractions: "Mausolée Bourguiba, Ribat de Monastir, Mahdia, El Jem",
  },
  {
    name: "Sfax & South Coast",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [35.00, 10.30],
      [35.10, 11.30],
      [34.35, 11.10],
      [34.30, 10.20],
    ],
    description: "Capitale économique du Sud",
    history: "Deuxième métropole tunisienne, grand port commerçant depuis le Moyen Âge, célèbre pour son industrie de l'huile d'olive.",
    tribes: "Aghalika, Ouled Bou Ali, Beni Kacem",
    attractions: "Médina de Sfax, Kerkennah, Thyna, Dar Jellouli",
  },
  {
    name: "Gabès & Gulf",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [34.20, 9.40],
      [34.30, 10.40],
      [33.65, 10.35],
      [33.60, 9.20],
    ],
    description: "Oasis côtière du golfe",
    history: "Ancienne Tacape romaine, oasis côtière unique mêlant mer et palmeraie, carrefour commercial entre le Sahel et le Sahara.",
    tribes: "Beni Zid, Touazine, Ouled Yahia",
    attractions: "Oasis de Gabès, Chenini, Matmata, Tamezret",
  },
  {
    name: "Tozeur & Djerid",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [34.30, 7.60],
      [34.30, 9.20],
      [33.40, 9.20],
      [33.40, 7.30],
    ],
    description: "Porte du Sahara, oasis millénaires",
    history: "Ville des mille palmes et du Chott el-Jérid, carrefour caravanier reliant le Maghreb à l'Afrique subsaharienne.",
    tribes: "Ouled Yahia, Ouled Moussa, Beni Brahim",
    attractions: "Chott el-Jérid, Ong El Jemel, Dar Cheraït, Nefta",
  },
  {
    name: "Djerba & Médenine",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [33.85, 10.50],
      [33.90, 11.65],
      [33.15, 11.55],
      [33.10, 10.40],
    ],
    description: "Île des Lotophages, terre de tolérance",
    history: "Légendaire île d'Homère, foyer de la communauté juive depuis le VIe siècle av. J.-C., symbole de coexistence religieuse.",
    tribes: "Beni Moussa, Beni Oulid, Ouled Aoun",
    attractions: "Synagogue El Ghriba, Houmt Souk, Guellala, Borj El Kebir",
  },
  {
    name: "Tataouine & Extreme Sud",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [33.10, 9.80],
      [33.10, 11.20],
      [31.80, 11.00],
      [31.70, 9.30],
    ],
    description: "Terre des ksour berbères",
    history: "Terre des Ksour berbères et décor de Star Wars, région de greniers fortifiés et de villages troglodytes.",
    tribes: "Ouled Debbab, Touareg sédentarisés, Beni Brahim",
    attractions: "Ksar Ouled Soltane, Chenini Ghomrassen, Douiret",
  },
  {
    name: "Le Kef & Nord-Ouest",
    country: "Tunisie",
    color: "#c1913e",
    coordinates: [
      [36.65, 8.00],
      [36.65, 9.30],
      [35.85, 9.30],
      [35.80, 8.00],
    ],
    description: "Nord-ouest montagneux, grenier de Rome",
    history: "Ville fortifiée berbère et byzantine, région céréalière qui nourrissait Rome. Sites numides parmi les mieux préservés.",
    tribes: "Kroumirs, Ouled Aoun, Jlass",
    attractions: "Dougga, Bulla Regia, Le Kef, Chemtou",
  },
];

/* =======================
   DATA: CITIES
   ======================= */
const maghrebCities: MaghrebCity[] = [
  // Morocco
  { name: "Rabat", country: "Maroc", coords: [34.020, -6.833], importance: "Capitale politique, Archives du Makhzen" },
  { name: "Fès", country: "Maroc", coords: [34.033, -5.000], importance: "Ancienne capitale spirituelle, Université Al-Qarawiyyin" },
  { name: "Marrakech", country: "Maroc", coords: [31.629, -7.981], importance: "Cité ocre des Almoravides, Palais Bahia" },
  { name: "Tanger", country: "Maroc", coords: [35.759, -5.833], importance: "Porte de l'Europe, histoire cosmopolite" },
  { name: "Oujda", country: "Maroc", coords: [34.680, -1.910], importance: "Porte de l'Est, carrefour algéro-marocain" },

  // Algeria
  { name: "Alger", country: "Algérie", coords: [36.753, 3.058], importance: "Capitale nationale, Archives Nationales CNA" },
  { name: "Oran", country: "Algérie", coords: [35.697, -0.633], importance: "Cité radieuse espagnole et ottomane" },
  { name: "Constantine", country: "Algérie", coords: [36.365, 6.614], importance: "Cité des ponts suspendus, Beylik de l'Est" },
  { name: "Tlemcen", country: "Algérie", coords: [34.878, -1.316], importance: "Cité d'art andalou, ancienne capitale zianide" },
  { name: "Ghardaïa", country: "Algérie", coords: [32.490, 3.666], importance: "Pentapole du Mzab, archives ibadites" },

  // Libya
  { name: "Tripoli", country: "Libye", coords: [32.887, 13.187], importance: "Capitale nationale, Archives Karamanli" },
  { name: "Benghazi", country: "Libye", coords: [32.116, 20.066], importance: "Perle de la Cyrénaïque, histoire senoussie" },
  { name: "Sebha", country: "Libye", coords: [27.037, 14.428], importance: "Porte du Fezzan saharien" },
  { name: "Ghadamès", country: "Libye", coords: [30.133, 9.500], importance: "Perle du désert, oasis fortifiée UNESCO" },

  // Mauritania
  { name: "Nouakchott", country: "Mauritanie", coords: [18.085, -15.978], importance: "Capitale nationale, Archives Nationales" },
  { name: "Chinguetti", country: "Mauritanie", coords: [20.450, -12.350], importance: "Septième ville sainte, manuscrits anciens" },
  { name: "Oualata", country: "Mauritanie", coords: [17.300, -7.016], importance: "Cité caravanière aux façades peintes" },
  { name: "Nouadhibou", country: "Mauritanie", coords: [20.930, -17.030], importance: "Grand port atlantique du Nord" },

  // Tunisia (Pre-existing)
  { name: "Tunis", country: "Tunisie", coords: [36.8065, 10.1815], importance: "Capitale politique et culturelle, Archives Nationales" },
  { name: "Kairouan", country: "Tunisie", coords: [35.678, 10.096], importance: "Ville sainte de l'Islam, patrimoine mondial" },
  { name: "Sfax", country: "Tunisie", coords: [34.740, 10.760], importance: "Capitale économique, premier port industriel" },
  { name: "Sousse", country: "Tunisie", coords: [35.825, 10.636], importance: "Perle du Sahel, station balnéaire" },
  { name: "Bizerte", country: "Tunisie", coords: [37.274, 9.874], importance: "Port nord, ville maritime historique" },
  { name: "Gabès", country: "Tunisie", coords: [33.883, 10.097], importance: "Oasis côtière, porte du désert" },
  { name: "Tozeur", country: "Tunisie", coords: [33.919, 8.133], importance: "Ville des mille palmes, porte du Sahara" },
  { name: "Djerba", country: "Tunisie", coords: [33.866, 10.850], importance: "Île aux 300 mosquées, tolérance interreligieuse" },
  { name: "Monastir", country: "Tunisie", coords: [35.774, 10.826], importance: "Cité présidentielle, Ribat historique" },
  { name: "Mahdia", country: "Tunisie", coords: [35.502, 11.062], importance: "Ancienne capitale fatimide, port de pêche" },
];

/* =======================
   MAIN COMPONENT
   ======================= */
export default function MaghrebTribesMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#f8f5ef]/10 flex items-center justify-center animate-pulse">
        <span className="text-white/20 text-xs uppercase tracking-widest font-cinzel">
          Loading Map...
        </span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <style>{customStyles}</style>
      {/* @ts-ignore */}
      <MapContainer
        center={[30.5, 4.0]}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        attributionControl={false}
        className="h-full w-full bg-transparent outline-none"
        style={{ background: "#aad3df", height: "100%" }}
      >
        <ZoomControl position="bottomright" />
        {/* @ts-ignore */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="opacity-85"
        />

        {/* REGIONAL POLYGONS */}
        {maghrebRegions.map((region) => (
          <div key={`${region.country}-${region.name}`}>
            <Polygon
              positions={region.coordinates as any}
              pathOptions={{
                color: region.color,
                fillColor: region.color,
                fillOpacity: 0.22,
                weight: 2,
              }}
            >
              <Tooltip sticky direction="center" className="maghreb-tooltip">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#c1913e",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: "bold", color: "#c1913e", fontSize: 13, fontFamily: "Cinzel, serif" }}>
                      {region.name} ({region.country})
                    </div>
                    <div style={{ fontSize: 11, color: "#111", marginTop: 1 }}>
                      {region.description}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Popup>
                <div className="maghreb-popup-content">
                  <h4>{region.name} ({region.country})</h4>
                  <p>
                    <strong>Histoire :</strong> {region.history}
                  </p>
                  <p>
                    <strong>Familles/Tribus :</strong> {region.tribes}
                  </p>
                  <p>
                    <strong>Site clé :</strong> {region.attractions}
                  </p>
                </div>
              </Popup>
            </Polygon>
          </div>
        ))}

        {/* CITY MARKERS */}
        {maghrebCities.map((city) => (
          <Marker key={`${city.country}-${city.name}`} position={city.coords as any} icon={burgundyIcon}>
            <Popup>
              <div className="maghreb-popup-content">
                <h4>{city.name} ({city.country})</h4>
                <p>{city.importance}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
