import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  Tooltip,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import { MapPin, Search, GitBranch, Archive, BookOpen, ChevronRight, ArrowLeft, Building2, Users } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

// Custom gold and red marker icons
const goldIcon = L.divIcon({
  className: "",
  html: `<div style="background:#d9a441;width:18px;height:18px;border-radius:50%;border:3px solid #f7f2e8;box-shadow:0 2px 10px rgba(217,164,65,0.6);display:flex;align-items:center;justify-content:center;cursor:pointer;"><div style="width:6px;height:6px;background:#f7f2e8;border-radius:50%;"></div></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const selectedIcon = L.divIcon({
  className: "",
  html: `<div style="background:#c8102e;width:22px;height:22px;border-radius:50%;border:3px solid #f7f2e8;box-shadow:0 0 15px rgba(200,16,46,0.9);display:flex;align-items:center;justify-content:center;cursor:pointer;"><div style="width:7px;height:7px;background:#f7f2e8;border-radius:50%;"></div></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

interface Governorate {
  id: string;
  name: string;
  nameAr: string;
  coords: [number, number];
  region: string;
  capital: string;
  population: string;
  description: string;
  genealogyNotes: string;
  landmarks: string;
  notableFamilies: string[];
}

interface RegionInfo {
  id: string;
  title: string;
  titleAr: string;
  summary: string;
  historicalSettlement: string;
  archivalHoldings: string;
  governorates: string[];
  notableLineages: string[];
}

const regionDossiers: Record<string, RegionInfo> = {
  "All Regions": {
    id: "all",
    title: "All 24 Tunisian Governorates",
    titleAr: "كامل تراب الجمهورية التونسية",
    summary: "Across 24 governorates spanning Carthage, the Sahel, the Tell highlands, the Medjerda valley, and the Saharan oases, Tunisia possesses the richest continuous civil and judicial records in North Africa.",
    historicalSettlement: "Numidian, Punic, Roman, Vandal, Byzantine, Arab-Islamic, Aghlabid, Fatimid, Hafsid, Ottoman, Andalusian (Morisco), and Italian-Levantine layers.",
    archivalHoldings: "Archives Nationales de Tunisie (ANT), Central État Civil (1886+), Charaïque court registers (sijillat), Habous public & private deeds, and Majba poll tax census rolls.",
    governorates: ["Tunis", "Ariana", "Ben Arous", "La Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse", "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid", "Gafsa", "Tozeur", "Kébili", "Gabès", "Médenine", "Tataouine"],
    notableLineages: ["Ben Achour", "Fourati", "Chabbi", "Lasram", "Zarrouk", "Sellami", "Bourguiba", "Caïd Essebsi", "Khmiri", "Marzougui"],
  },
  "Greater Tunis": {
    id: "greater-tunis",
    title: "Greater Tunis & The Gulf",
    titleAr: "إقليم تونس الكبرى وخليج تونس",
    summary: "The political, scholarly, and administrative heartland comprising Tunis, Ariana, Ben Arous, and La Manouba, centered around the historic Medina of Tunis and Zitouna Mosque.",
    historicalSettlement: "Punic Carthage, Roman metropolis, Aghlabid & Hafsid capital, Ottoman corsair aristocracy, Beldi patrician lineages, and Andalusian Morisco quarters.",
    archivalHoldings: "Archives Nationales de Tunisie (Kasbah), Prime Ministry beylical decrees, Zitouna University nasab registries, Central municipal état civil, and Italian consulate church records.",
    governorates: ["Tunis", "Ariana", "Ben Arous", "La Manouba"],
    notableLineages: ["Ben Achour", "Caïd Essebsi", "Lasram", "Zarrouk", "Djaziri", "Baccouche", "Mami", "Chennoufi", "Ennaifer", "Bouhajeb"],
  },
  "North": {
    id: "north",
    title: "Northern Maritime Bastions",
    titleAr: "الشمال البحري وبنزرت",
    summary: "Strategic northern coastline dominated by the historic naval port of Bizerte, Andalusian Ghar El Melh, Cap Angela, and Lake Ichkeul.",
    historicalSettlement: "Phoenician Hippo Diarrhytus, Byzantine forts, Andalusian seafaring exiles, French naval garrison, and White Russian refugee diaspora.",
    archivalHoldings: "French naval civil registers (1881–1963), Ghar El Melh corsair & Andalusian records, and municipal registers of Menzel Bourguiba & Bizerte.",
    governorates: ["Bizerte"],
    notableLineages: ["Guiga", "Boukhris", "Allani", "Ben Cheikh", "Baccari", "Ben Rejeb"],
  },
  "North East": {
    id: "north-east",
    title: "Cap Bon & Zaghouan Springs",
    titleAr: "الوطن القبلي وجبال زغوان",
    summary: "Peninsula of fertile vineyards, pottery guilds (Nabeul), Punic Kerkuane, Soliman Morisco hub, and Zaghouan Roman aqueduct springs.",
    historicalSettlement: "Punic maritime cities, Morisco settlements from Granada and Valencia (1609+), and Sicilian agricultural immigrants.",
    archivalHoldings: "Morisco land and trade guild sijillat in Soliman & Nabeul, Zaghouan Roman water tenure deeds, and Hammamet caïdat census records.",
    governorates: ["Nabeul", "Zaghouan"],
    notableLineages: ["Haddad", "Kharraz", "Gharbi", "Chaouch", "Boudhina", "Mani", "Triki", "Khouja"],
  },
  "North West": {
    id: "north-west",
    title: "North West & Medjerda Valley",
    titleAr: "الشمال الغربي وحوض مجردة",
    summary: "The fertile breadbasket of Béja, Roman Dougga, Tabarka Genoese coral coast, Sicca Veneria (Le Kef), and the oak forests of Kroumirie.",
    historicalSettlement: "Numidian kingdoms, Roman agrarian coloniae, Khmir and Drid tribal confederations, and Tabarka Genoese-Lomellini diaspora.",
    archivalHoldings: "Dougga & Bulla Regia epigraphy rolls, Sidi Bou Makhlouf Sufi zawiya registers, border garrison files, and Drid tribal land registers.",
    governorates: ["Béja", "Jendouba", "Le Kef", "Siliana"],
    notableLineages: ["Dridi", "Amdouni", "Khmiri", "Ayari", "Mazigh", "Chebbi", "Boughanmi", "Souissi", "Maktari"],
  },
  "Sahel": {
    id: "sahel",
    title: "Sahelian Coast & Sfax Plain",
    titleAr: "الساحل التونسي وصفاقس",
    summary: "Dynamic olive groves, coastal ribats (Sousse, Monastir), Fatimid Mahdia silk weavers, monumental Medina of Sfax, and Kerkennah archipelago.",
    historicalSettlement: "Phoenician Hadrumetum, 9th-century Aghlabid ribats, Fatimid Caliphate capital, and autonomous Sfax mercantile families.",
    archivalHoldings: "Sfax Municipal Archives (1700+), Sousse Qadi court registers, Sahelian habous olive tenure contracts, and Kerkennah maritime charters.",
    governorates: ["Sousse", "Monastir", "Mahdia", "Sfax"],
    notableLineages: ["Fourati", "Sellami", "Abid", "Fendri", "Bourguiba", "Mzali", "Boujnah", "Jenayah", "Hamza", "Farhat", "Sfar"],
  },
  "Central West": {
    id: "central-west",
    title: "Central Steppes & Sacred Kairouan",
    titleAr: "الوسط الغربي والسباسب والقيروان",
    summary: "Spiritual cradle of the Maghreb in Kairouan, Roman Sufetula (Sbeitla), Mount Chaambi (Kasserine), and the historic Hamama steppes of Sidi Bouzid.",
    historicalSettlement: "Arab-Islamic conquest capital (670 CE), Aghlabid golden age, Maliki jurist dynasties, Fraichiche & Hamama tribal alliances.",
    archivalHoldings: "Kairouan Great Mosque parchment nasab manuscripts, Aghlabid judicial records, Sufetula epigraphic archives, and Sharifian scrolls of Sidi Bouzid.",
    governorates: ["Kairouan", "Kasserine", "Sidi Bouzid"],
    notableLineages: ["Alouini", "Mourali", "Attia", "Bouraoui", "Chammakhi", "Bouazizi", "Nasri", "Gharbi", "Majri", "Kadri"],
  },
  "South West": {
    id: "south-west",
    title: "South West & The Djérid Oases",
    titleAr: "الجنوب الغربي وواحات الجريد",
    summary: "Ancient Capsian origins in Gafsa, palm grove canal irrigation networks of Tozeur, Chott el-Djerid salt expanse, and Kébili Saharan dunes.",
    historicalSettlement: "Prehistoric Capsian culture, Roman oasis garrisons, Ibn Chabbat irrigation water share holders, and Marazig nomadic camel caravans.",
    archivalHoldings: "Ibn Chabbat 13th-century water-share scrolls, Tozeur palm inheritance deeds, CPG mining personnel archives (1897+), and desert tribal manifests.",
    governorates: ["Gafsa", "Tozeur", "Kébili"],
    notableLineages: ["Chabbi", "Ibn Chabbat", "Ben Othman", "Gafsi", "Marzougui", "Douzi", "Dabbabi", "Yacoubi", "Bousmaha"],
  },
  "South East": {
    id: "south-east",
    title: "South East, Ksour & Djerba Island",
    titleAr: "الجنوب الشرقي وجربة وقصور تطاوين",
    summary: "Mediterranean maritime oasis of Gabès, Djerba island multicultural haven (Ghriba synagogue & menzels), and multi-story Ksour granaries of Tataouine.",
    historicalSettlement: "Amazigh troglodyte settlements (Matmata, Chenini), Djerba Ibadi & Jewish communities, and Ouderna & Ouled Dabbab ksour keepers.",
    archivalHoldings: "Djerba Jewish ketubot & cemetery rolls, Ibadi manuscripts, Sidi Boulbaba zawiya texts, and Ksar Ouled Soltane grain deposit contracts.",
    governorates: ["Gabès", "Médenine", "Tataouine"],
    notableLineages: ["Trabelsi", "Djerbi", "Ouderni", "Ksouri", "Bannani", "Boulbaba", "Zammouri", "Chenini", "Douiri", "Jlassi"],
  },
};

const governorates: Governorate[] = [
  // ── GREATER TUNIS ──
  {
    id: "tunis",
    name: "Tunis",
    nameAr: "تونس",
    coords: [36.8065, 10.1815],
    region: "Greater Tunis",
    capital: "Tunis Medina",
    population: "1,075,000",
    description: "Capital of the Republic, historic seat of the Husainid Beys, Carthage, and the spiritual center of the Zitouna University.",
    genealogyNotes: "Archives Nationales de Tunisie (ANT), Ottoman sijillat (1574–1881), majba registers, habous deeds, and central état civil from 1886.",
    landmarks: "Medina of Tunis (UNESCO), Ruins of Carthage, Bardo Palace, Zitouna Mosque",
    notableFamilies: ["Ben Achour", "Caïd Essebsi", "Djaziri", "Lasram", "Zarrouk", "Ben Ayed"],
  },
  {
    id: "ariana",
    name: "Ariana",
    nameAr: "أريانة",
    coords: [36.8625, 10.1956],
    region: "Greater Tunis",
    capital: "Ariana",
    population: "576,000",
    description: "Northern suburban plain known for its historic Andalusian gardens, rose cultivation, and beylical summer villas.",
    genealogyNotes: "Municipal état civil registers, agricultural land concession deeds, and connections to the Tunis caïdat.",
    landmarks: "Parc du Belvédère hinterland, historic Borj Baccouche, Raoued coast",
    notableFamilies: ["Baccouche", "Mami", "Ennaifer", "Bouhajeb"],
  },
  {
    id: "ben-arous",
    name: "Ben Arous",
    nameAr: "بن عروس",
    coords: [36.7533, 10.2281],
    region: "Greater Tunis",
    capital: "Ben Arous",
    population: "631,000",
    description: "Southern gateway to Tunis along the Gulf, home to Radès, Hammam-Lif thermal springs, and Mount Boukornine.",
    genealogyNotes: "Parish records of the French Protectorate era, railway worker registers, and Ottoman caïdat records.",
    landmarks: "Mount Boukornine National Park, Beylical Palace of Hammam-Lif, Radès Port",
    notableFamilies: ["Belkhodja", "Klibi", "Chennoufi", "Snoussi"],
  },
  {
    id: "manouba",
    name: "La Manouba",
    nameAr: "منوبة",
    coords: [36.8100, 10.0972],
    region: "Greater Tunis",
    capital: "La Manouba",
    population: "379,000",
    description: "Fertile Medjerda plains, holy shrine of Lella Manoubia, and historic Beylical palaces (Ksar El Warda).",
    genealogyNotes: "Military academy archives of Bardo, Sufi tariqa lineage manuscripts, and habous land deeds.",
    landmarks: "Ksar El Warda (National Military Museum), Saint Lella Manoubia Mausoleum",
    notableFamilies: ["Kassar", "Farhat", "Ben Mustapha", "Tlili"],
  },

  // ── NORTH EAST / CAP BON ──
  {
    id: "nabeul",
    name: "Nabeul",
    nameAr: "نابل",
    coords: [36.4561, 10.7376],
    region: "North East",
    capital: "Nabeul",
    population: "787,000",
    description: "The Cap Bon peninsula: pottery guilds of Nabeul, Andalusian town of Soliman, and Punic fortress of Kelibia.",
    genealogyNotes: "Morisco/Andalusian settlement records (1609+), pottery trade guilds inheritance papers, and Kelibia maritime registers.",
    landmarks: "Kelibia Fort, Kerkuane Punic City (UNESCO), Hammamet Medina",
    notableFamilies: ["Haddad", "Kharraz", "Gharbi", "Chaouch", "Boudhina"],
  },
  {
    id: "zaghouan",
    name: "Zaghouan",
    nameAr: "زغوان",
    coords: [36.4029, 10.1429],
    region: "North East",
    capital: "Zaghouan",
    population: "176,000",
    description: "Mountain spring supplying ancient Carthage with water via the Roman Aqueduct; Morisco haven.",
    genealogyNotes: "Andalusian family papers from 17th century, olive mill deeds, and Roman/Byzantine stone epigraphy records.",
    landmarks: "Temple des Eaux (Roman Water Temple), Mount Zaghouan, Zriba El Alia",
    notableFamilies: ["Mani", "Triki", "Ben Rejeb", "Khouja"],
  },
  {
    id: "bizerte",
    name: "Bizerte",
    nameAr: "بنزرت",
    coords: [37.2744, 9.8739],
    region: "North",
    capital: "Bizerte",
    population: "568,000",
    description: "Northernmost point of the African continent (Cap Angela), naval arsenal, and historic Andalusian port of Ghar El Melh.",
    genealogyNotes: "French naval civil status (1881–1963), White Russian refugee cemetery records (1920), and Andalusian sijillat.",
    landmarks: "Vieux Port of Bizerte, Ichkeul National Park (UNESCO), Ghar El Melh Forts",
    notableFamilies: ["Guiga", "Boukhris", "Allani", "Ben Cheikh", "Baccari"],
  },

  // ── NORTH WEST ──
  {
    id: "beja",
    name: "Béja",
    nameAr: "باجة",
    coords: [36.7256, 9.1817],
    region: "North West",
    capital: "Béja",
    population: "303,000",
    description: "Ancient Vaga, breadbasket of Roman Africa, nestled in the rolling wheat plains of the Medjerda.",
    genealogyNotes: "Tribal registers of the Drid and Amdoun confederations, majba tax lists, and Dougga archaeological archives.",
    landmarks: "Dougga / Thugga (UNESCO), Kasbah of Béja, Medjerda Valley Bridges",
    notableFamilies: ["Dridi", "Amdouni", "Trabelsi", "Riahi", "Jouini"],
  },
  {
    id: "jendouba",
    name: "Jendouba",
    nameAr: "جندوبة",
    coords: [36.5011, 8.7803],
    region: "North West",
    capital: "Jendouba",
    population: "401,000",
    description: "Historic Bulla Regia subterranean villas, Tabarka coral coast, and dense oak forests of the Kroumirie.",
    genealogyNotes: "Colonial forestry concessions, Tabarka Genoese-Lomellini diaspora records, and Khmir tribal rolls.",
    landmarks: "Bulla Regia subterranean villas, Tabarka Genoese Castle, Ain Draham Mountains",
    notableFamilies: ["Khmiri", "Ayari", "Boughanmi", "Souissi", "Gharbi"],
  },
  {
    id: "le-kef",
    name: "Le Kef",
    nameAr: "الكاف",
    coords: [36.1822, 8.7149],
    region: "North West",
    capital: "Le Kef (Sicca Veneria)",
    population: "243,000",
    description: "High fortress city perched on Table de Jugurtha, melting pot of Jewish, Muslim, and Ottoman Sufi orders.",
    genealogyNotes: "Sidi Bou Makhlouf Sufi zawiya registers, border garrison military files, and Jewish cemetery records.",
    landmarks: "Kasbah of Le Kef, Sidi Bou Makhlouf Mausoleum, Table de Jugurtha",
    notableFamilies: ["Mazigh", "Chabbi", "Chebbi", "Mansouri", "Bouassida"],
  },
  {
    id: "siliana",
    name: "Siliana",
    nameAr: "سليانة",
    coords: [36.0847, 9.3708],
    region: "North West",
    capital: "Siliana",
    population: "223,000",
    description: "Rugged highlands holding the Numidian Battle of Zama site and the Roman city of Mactaris (Makthar).",
    genealogyNotes: "Ouled Ayar tribal records, Makthar archaeological inscriptions, and colonial agricultural settlement rolls.",
    landmarks: "Mactaris Roman Ruins (Makthar), Jama Mosque, Zama Battlefield",
    notableFamilies: ["Ayari", "Siliani", "Hammami", "Maktari", "Jouini"],
  },

  // ── SAHEL & CENTRAL EAST ──
  {
    id: "sousse",
    name: "Sousse",
    nameAr: "سوسة",
    coords: [35.8256, 10.6369],
    region: "Sahel",
    capital: "Sousse",
    population: "675,000",
    description: "The Pearl of the Sahel, Hadrumetum of antiquity, 9th-century Aghlabid ribat, and Mediterranean trade hub.",
    genealogyNotes: "Sousse Qadi court registers, maritime merchant contracts, habous of the Great Mosque, and municipal état civil.",
    landmarks: "Ribat of Sousse (UNESCO), Medina of Sousse, Port El Kantaoui",
    notableFamilies: ["Boujnah", "Baccouche", "Melliti", "Chouikha", "Jenayah", "Letaief"],
  },
  {
    id: "monastir",
    name: "Monastir",
    nameAr: "المنستير",
    coords: [35.7779, 10.8261],
    region: "Sahel",
    capital: "Monastir",
    population: "548,000",
    description: "Ancient Ruspina, coastal ribat fortress where religious scholars resided, and birthplace of President Habib Bourguiba.",
    genealogyNotes: "Ribat monastic endowment rolls, Sahelian olive tenure agreements, and Bourguiba family historical archive.",
    landmarks: "Ribat of Monastir, Mausoleum of Habib Bourguiba, Marina",
    notableFamilies: ["Bourguiba", "Essid", "Mzali", "Kallal", "Sayah", "Ghedira"],
  },
  {
    id: "mahdia",
    name: "Mahdia",
    nameAr: "المهدية",
    coords: [35.5047, 11.0622],
    region: "Sahel",
    capital: "Mahdia",
    population: "410,000",
    description: "10th-century Fatimid Caliphate capital, silk weaving tradition, Skifa Kahla gateway, and nearby El Jem colosseum.",
    genealogyNotes: "Fatimid era foundations, silk weaving guild registers, and Ottoman caïdat books of the Sahel.",
    landmarks: "Amphitheatre of El Jem (UNESCO), Skifa Kahla (Black Gate), Borj El Kebir",
    notableFamilies: ["Hamza", "Farhat", "Ben Romdhane", "Sfar", "Kacem"],
  },
  {
    id: "sfax",
    name: "Sfax",
    nameAr: "صفاقس",
    coords: [34.7406, 10.7603],
    region: "Sahel",
    capital: "Sfax",
    population: "1,030,000",
    description: "Tunisia's premier commercial and industrial engine, 9th-century monumental limestone Medina, olive empire, and Kerkennah archipelago.",
    genealogyNotes: "Sfax Municipal Archives, notary and commercial registers (1700+), Kermadi and Charfi family maritime documents, and Kerkennah island lists.",
    landmarks: "Medina of Sfax, Bab Diwan, Kerkennah Islands, Thyna Roman Site",
    notableFamilies: ["Fourati", "Abid", "Sellami", "Fendri", "Kammoun", "Hachicha", "Ellouze"],
  },

  // ── CENTRAL WEST ──
  {
    id: "kairouan",
    name: "Kairouan",
    nameAr: "القيروان",
    coords: [35.6781, 10.0963],
    region: "Central West",
    capital: "Kairouan",
    population: "570,000",
    description: "The spiritual heart of the Maghreb founded in 670 CE by Uqba ibn Nafi; capital of the Aghlabids.",
    genealogyNotes: "Oldest nasab chains in North Africa, Aghlabid parchment manuscripts, Maliki jurisprudential registers, and sharifian rolls.",
    landmarks: "Great Mosque of Kairouan (UNESCO), Aghlabid Basins, Mausoleum of Sidi Sahbi",
    notableFamilies: ["Alouini", "Mourali", "Attia", "Bouraoui", "Chammakhi", "Bardi"],
  },
  {
    id: "kasserine",
    name: "Kasserine",
    nameAr: "القصرين",
    coords: [35.1676, 8.8365],
    region: "Central West",
    capital: "Kasserine",
    population: "439,000",
    description: "Mountainous crossroads beneath Mount Chaambi (Tunisia's highest peak); Roman Cillium and Sbeitla (Sufetula).",
    genealogyNotes: "Sufetula epigraphy, Fraichiche and Majer tribal confederation registers, and colonial border police files.",
    landmarks: "Archaeological Site of Sbeitla (Sufetula), Mount Chaambi, Roman Arch of Cillium",
    notableFamilies: ["Gharbi", "Nasri", "Hafsi", "Boulaabi", "Majri"],
  },
  {
    id: "sidi-bouzid",
    name: "Sidi Bouzid",
    nameAr: "سيدي بوزيد",
    coords: [35.0382, 9.4849],
    region: "Central West",
    capital: "Sidi Bouzid",
    population: "430,000",
    description: "Central agricultural steppes; historic homeland of the Hamama tribe and the cradle of the 2010–2011 Tunisian Revolution.",
    genealogyNotes: "Ouled Sidi Bouzid sharifian genealogy scrolls, Hamama tribal land records, and caïdat census sheets.",
    landmarks: "Mausoleum of Sidi Bouzid, Post Office Square, Mount Mghilla Nature Reserve",
    notableFamilies: ["Bouazizi", "Hamdouni", "Kadri", "Zitouni", "Amri"],
  },

  // ── SOUTH WEST / THE DJÉRID ──
  {
    id: "gafsa",
    name: "Gafsa",
    nameAr: "قفصة",
    coords: [34.4250, 8.7842],
    region: "South West",
    capital: "Gafsa",
    population: "337,000",
    description: "Ancient Capsa, giving its name to the prehistoric Capsian culture; famous Roman baths and phosphate oasis basins.",
    genealogyNotes: "Capsian archaeological records, Roman bath inscriptions, and mining company (CPG) personnel registries (1897+).",
    landmarks: "Roman Baths of Gafsa, Capsian Archaeological Museum, Selja Gorges",
    notableFamilies: ["Gafsi", "Dabbabi", "Znaidi", "Mbarki", "Khadhraoui"],
  },
  {
    id: "tozeur",
    name: "Tozeur",
    nameAr: "توزر",
    coords: [33.9197, 8.1336],
    region: "South West",
    capital: "Tozeur",
    population: "107,000",
    description: "Heart of the Djérid palm groves, master architect Ibn Chabbat water-sharing scrolls, and geometric ochre-brick medinas.",
    genealogyNotes: "Ibn Chabbat irrigation water-share registers (13th century), oasis palm grove inheritance deeds, and Chott el-Djerid caravan manifests.",
    landmarks: "Ouled El Hadef Historic Quarter, Tozeur Palm Grove, Chott el-Djerid Salt Lake",
    notableFamilies: ["Chabbi", "Ibn Chabbat", "Ben Othman", "Gueblaoui", "Bousmaha"],
  },
  {
    id: "kebili",
    name: "Kébili",
    nameAr: "قبلي",
    coords: [33.7050, 8.9650],
    region: "South West",
    capital: "Kébili",
    population: "157,000",
    description: "Gateway to the Sahara dunes (Douz), date palm oases, and ancient Berber/Arab nomadic heritage.",
    genealogyNotes: "Marazig nomadic tribe lineage charts, camel brand registration marks, and desert guide logbooks.",
    landmarks: "Douz International Sahara Festival, Grand Erg Oriental, Nefzaoua Oases",
    notableFamilies: ["Marzougui", "Douzi", "Yacoubi", "Ben Amor", "Ghouma"],
  },

  // ── SOUTH EAST ──
  {
    id: "gabes",
    name: "Gabès",
    nameAr: "قابس",
    coords: [33.8815, 10.0982],
    region: "South East",
    capital: "Gabès",
    population: "374,000",
    description: "Unique Mediterranean maritime oasis (Chenini Nahal) and companion of the Prophet Sidi Boulbaba.",
    genealogyNotes: "Sidi Boulbaba zawiya manuscripts, maritime oasis irrigation charts, and Matmata troglodyte family records.",
    landmarks: "Mausoleum of Sidi Boulbaba, Troglodyte village of Matmata, Chenini Oasis",
    notableFamilies: ["Boulbaba", "Zammouri", "Chennoufi", "Arbi", "Marzouk"],
  },
  {
    id: "medenine",
    name: "Médenine",
    nameAr: "مدنين",
    coords: [33.3549, 10.5055],
    region: "South East",
    capital: "Médenine",
    population: "479,000",
    description: "Ksour fortified granaries (Ksar Medenine), Amazigh mountain villages of Beni Khedache, and the island of Djerba.",
    genealogyNotes: "Djerba Jewish ketubot & cemetery rolls, Ibadi manuscripts, and Ksour grain deposit deeds (16th–20th c.).",
    landmarks: "Island of Djerba (UNESCO), El Ghriba Synagogue, Ksar Ouled Debbab",
    notableFamilies: ["Trabelsi", "Ksouri", "Bannani", "Gharbi", "Djerbi", "Haddad"],
  },
  {
    id: "tataouine",
    name: "Tataouine",
    nameAr: "تطاوين",
    coords: [32.9297, 10.4518],
    region: "South East",
    capital: "Tataouine",
    population: "149,000",
    description: "Rugged desert bastion, Ksar Ouled Soltane multi-story ghorfas, Amazigh village of Chenini, and dinosaur fossil beds.",
    genealogyNotes: "Ouled Dabbab and Ouderna tribal confederation registers, French disciplinary battalions (BILA) archives, and Berber oral poetry.",
    landmarks: "Ksar Ouled Soltane, Ksar Chenini, Ksar Douiret, Guermessa",
    notableFamilies: ["Ouderni", "Dabbabi", "Chenini", "Douiri", "Jlassi"],
  },
];

const regions = [
  "All Regions",
  "Greater Tunis",
  "North",
  "North East",
  "North West",
  "Sahel",
  "Central West",
  "South West",
  "South East",
];

// Helper to center the map when selecting governorate
function MapCenterController({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 8, { duration: 1.2 });
    }
  }, [coords, map]);
  return null;
}

export default function TunisiaGovernoratesMap() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>("All Regions");

  const activeDossier = useMemo(() => {
    return regionDossiers[activeRegion] || regionDossiers["All Regions"];
  }, [activeRegion]);

  const selectedGov = useMemo(() => {
    if (!selectedId) return null;
    return governorates.find((g) => g.id === selectedId) || null;
  }, [selectedId]);

  const filteredGovernorates = useMemo(() => {
    if (activeRegion === "All Regions") return governorates;
    return governorates.filter((g) => g.region === activeRegion);
  }, [activeRegion]);

  const handleRegionClick = (reg: string) => {
    setActiveRegion(reg);
    setSelectedId(null); // Return to regional overview mode
  };

  const handleGovSelect = (gov: Governorate) => {
    setSelectedId(gov.id);
    setActiveRegion(gov.region);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="eyebrow mb-2">Interactive Archival Atlas</p>
        <h2 className="display-lg text-[var(--foreground)]">
          Tunisia's 24 Governorates & Regional Archives
        </h2>
        <div className="gold-rule mx-auto mt-3 mb-4 w-20" />
        <p className="text-sm text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Click any region below to inspect its settlement history and holding institutions, or choose a governorate marker on the map to explore local lineages and civil record registers.
        </p>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => handleRegionClick(reg)}
            className={`rounded-sm px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] transition-all cursor-pointer ${
              activeRegion === reg && !selectedId
                ? "bg-[var(--primary)] text-white shadow-md font-extrabold"
                : activeRegion === reg
                ? "bg-[var(--gold)] text-[var(--accent-foreground)] font-bold"
                : "surface-card text-[var(--muted-foreground)] hover:text-[var(--gold)] hover:border-[var(--gold)]/50"
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Map + Sidebar Split (Equal Height) */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Left: Leaflet Map */}
        <div className="lg:col-span-7 xl:col-span-8 surface-card overflow-hidden p-2.5 border border-[var(--gold)]/40 shadow-xl rounded-md flex flex-col h-[540px] sm:h-[620px] lg:h-[680px]">
          <div className="flex-1 w-full rounded overflow-hidden relative min-h-0">
            <MapContainer
              center={selectedGov ? selectedGov.coords : [34.5, 9.5]}
              zoom={selectedGov ? 8 : 6}
              scrollWheelZoom={false}
              zoomControl={true}
              className="h-full w-full"
              style={{ background: "#f7f2e8" }}
            >
              {selectedGov && <MapCenterController coords={selectedGov.coords} />}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {filteredGovernorates.map((gov) => {
                const isSelected = selectedId === gov.id;
                return (
                  <Marker
                    key={gov.id}
                    position={gov.coords}
                    icon={isSelected ? selectedIcon : goldIcon}
                    eventHandlers={{
                      click: () => handleGovSelect(gov),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]}>
                      <span className="font-display font-semibold text-sm">{gov.name}</span>
                      <span className="block text-xs font-bold text-[var(--gold)]">{gov.nameAr}</span>
                    </Tooltip>
                    <Popup>
                      <div className="p-1 max-w-[220px]">
                        <h4 className="font-display font-bold text-base text-[var(--primary)]">{gov.name} — {gov.nameAr}</h4>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">{gov.region} · {gov.population} hab.</p>
                        <p className="text-xs text-[var(--foreground)] mt-2 line-clamp-3">{gov.description}</p>
                        <button
                          onClick={() => handleGovSelect(gov)}
                          className="mt-3 w-full btn-base btn-gold text-[0.6rem] py-1"
                        >
                          View Archival Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Quick Governorates Pill List */}
          <div className="mt-2.5 shrink-0 flex items-center gap-2 overflow-x-auto p-2 border-t border-[var(--gold)]/20 text-xs">
            <span className="eyebrow shrink-0 text-[0.6rem]">Governorates:</span>
            {filteredGovernorates.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGovSelect(g)}
                className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                  selectedId === g.id
                    ? "bg-[var(--primary)] text-white font-bold"
                    : "text-[var(--foreground)] hover:bg-[var(--gold)]/20 surface-card"
                }`}
              >
                {g.name} <span className="text-[0.65rem] opacity-75 font-arabic">({g.nameAr})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Information Dossier Panel (Region or Governorate) - Same Height */}
        <div className="lg:col-span-5 xl:col-span-4 surface-card p-5 sm:p-6 border-2 border-[var(--gold)]/40 shadow-2xl flex flex-col h-[540px] sm:h-[620px] lg:h-[680px] rounded-md overflow-hidden">
          {selectedGov ? (
            /* INDIVIDUAL GOVERNORATE DOSSIER */
            <>
              {/* Header (Shrink-0) */}
              <div className="shrink-0 border-b border-[var(--gold)]/25 pb-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
                  </button>
                  <span className="rounded-sm border border-[var(--gold)]/40 px-2 py-0.5 text-[0.6rem] font-bold text-[var(--gold)]">
                    Pop. {selectedGov.population}
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline justify-between">
                  <h3 className="display-lg text-2xl sm:text-3xl text-[var(--foreground)]">
                    {selectedGov.name}
                  </h3>
                  <span className="font-display text-2xl font-bold text-[var(--gold)]">
                    {selectedGov.nameAr}
                  </span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] mt-0.5">
                  Capital: {selectedGov.capital} · {selectedGov.region}
                </p>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 py-2 text-xs sm:text-sm leading-relaxed scrollbar-thin">
                {/* Overview */}
                <div>
                  <p className="eyebrow text-[0.62rem] text-[var(--gold)] mb-1">
                    Historical Overview
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/90">
                    {selectedGov.description}
                  </p>
                </div>

                {/* Archival Records */}
                <div className="p-3 rounded bg-[var(--secondary)]/60 border border-[var(--gold)]/25">
                  <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold text-xs uppercase tracking-[0.14em] mb-1">
                    <Archive className="h-3.5 w-3.5" />
                    <span>Archival & Civil Records</span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {selectedGov.genealogyNotes}
                  </p>
                </div>

                {/* Landmarks */}
                <div>
                  <p className="eyebrow text-[0.62rem] text-[var(--gold)] mb-1">
                    Key Historical Landmarks
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {selectedGov.landmarks}
                  </p>
                </div>

                {/* Notable Family Lineages */}
                <div>
                  <p className="eyebrow text-[0.62rem] text-[var(--gold)] mb-1.5">
                    Historically Documented Lineages
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedGov.notableFamilies.map((fam) => (
                      <Link
                        key={fam}
                        to={`/gallery/trees?q=${encodeURIComponent(fam)}`}
                        className="rounded-sm border border-[var(--gold)]/40 bg-[var(--card)] px-2 py-0.5 text-[0.62rem] font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                      >
                        {fam}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Shrink-0) */}
              <div className="shrink-0 pt-3 border-t border-[var(--gold)]/20 grid grid-cols-2 gap-2 mt-auto">
                <Link
                  to={`/gallery?q=${encodeURIComponent(selectedGov.name)}`}
                  className="btn-base btn-red text-[0.65rem] py-2 text-center flex items-center justify-center gap-1"
                >
                  <Search className="h-3.5 w-3.5" /> Records
                </Link>
                <Link
                  to={`/gallery/trees?q=${encodeURIComponent(selectedGov.name)}`}
                  className="btn-base btn-outline-ink text-[0.65rem] py-2 text-center flex items-center justify-center gap-1"
                >
                  <GitBranch className="h-3.5 w-3.5" /> Trees
                </Link>
              </div>
            </>
          ) : (
            /* REGIONAL OVERVIEW DOSSIER */
            <>
              {/* Region Header (Shrink-0) */}
              <div className="shrink-0 border-b border-[var(--gold)]/25 pb-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-sm border border-[var(--gold)]/50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                    Regional Archival Dossier
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] font-semibold">
                    {activeDossier.governorates.length} Governorates
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline justify-between">
                  <h3 className="display-lg text-2xl sm:text-3xl text-[var(--foreground)]">
                    {activeDossier.title}
                  </h3>
                  <span className="font-display text-2xl font-bold text-[var(--gold)]">
                    {activeDossier.titleAr}
                  </span>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 py-2 text-xs sm:text-sm leading-relaxed scrollbar-thin">
                {/* Regional Summary */}
                <div>
                  <p className="eyebrow text-[0.62rem] text-[var(--gold)] mb-1">
                    Territory & Demographics
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/90">
                    {activeDossier.summary}
                  </p>
                </div>

                {/* Settlement History */}
                <div className="p-3 rounded bg-[var(--secondary)]/60 border border-[var(--gold)]/25">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)] mb-1">
                    Historical Settlement Layers
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {activeDossier.historicalSettlement}
                  </p>
                </div>

                {/* Major Holding Archives */}
                <div>
                  <p className="eyebrow text-[0.62rem] text-[var(--gold)] mb-1">
                    Archival Repositories & Court Registers
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {activeDossier.archivalHoldings}
                  </p>
                </div>

                {/* Governorates inside this region */}
                <div>
                  <p className="eyebrow text-[0.62rem] text-[var(--gold)] mb-1.5">
                    Member Governorates (Click to focus)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {activeDossier.governorates.map((govName) => {
                      const gObj = governorates.find((x) => x.name === govName);
                      return (
                        <button
                          key={govName}
                          onClick={() => gObj && handleGovSelect(gObj)}
                          className="rounded-sm border border-[var(--gold)]/40 bg-[var(--card)] px-2 py-0.5 text-[0.62rem] font-bold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                        >
                          {govName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prominent Lineages */}
                <div>
                  <p className="eyebrow text-[0.62rem] text-[var(--gold)] mb-1.5">
                    Notable Family Lineages
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {activeDossier.notableLineages.map((fam) => (
                      <Link
                        key={fam}
                        to={`/gallery/trees?q=${encodeURIComponent(fam)}`}
                        className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[0.62rem] font-semibold text-[var(--muted-foreground)] hover:text-[var(--gold)] hover:border-[var(--gold)]"
                      >
                        {fam}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Search Actions (Shrink-0) */}
              <div className="shrink-0 pt-3 border-t border-[var(--gold)]/20 grid grid-cols-2 gap-2 mt-auto">
                <Link
                  to={`/gallery?q=${encodeURIComponent(activeRegion === "All Regions" ? "Tunisia" : activeRegion)}`}
                  className="btn-base btn-red text-[0.65rem] py-2 text-center flex items-center justify-center gap-1"
                >
                  <Search className="h-3.5 w-3.5" /> Regional Records
                </Link>
                <Link
                  to={`/gallery/trees?q=${encodeURIComponent(activeRegion === "All Regions" ? "Tunisia" : activeRegion)}`}
                  className="btn-base btn-outline-ink text-[0.65rem] py-2 text-center flex items-center justify-center gap-1"
                >
                  <GitBranch className="h-3.5 w-3.5" /> Regional Trees
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
