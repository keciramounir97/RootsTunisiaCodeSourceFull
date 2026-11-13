import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import {
  TUNISIAN_HISTORICAL_ERAS,
  type HistoricalEraExtended,
  type HistoricalEraLeader,
  type HistoricalEraFamily,
  type EraAdministrativeDivision,
  type HistoricalEraSite,
} from "../data/historicalMapData";
import { localizeEraDetailsForLocale } from "../data/historicalMapLocales";

export const PERIODS_CMS_LOCALES = [
  { code: "fr", label: "Français", tag: "FR" },
  { code: "en", label: "English", tag: "EN" },
  { code: "ar", label: "العربية", tag: "AR" },
  { code: "es", label: "Español", tag: "ES" },
  { code: "it", label: "Italiano", tag: "IT" },
  { code: "mt", label: "Malti", tag: "MT" },
] as const;

export interface PeriodCategoryItem {
  key: string;
  label: string;
  icon: string;
  description: string;
}

export interface AdminPeriodCard extends HistoricalEraExtended {
  category: string;
  badge: string;
  isPublished: boolean;
  customTags?: string[];
  cardButtonLabel?: string;
}

export interface PeriodsHeroConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaPrimaryLabel: string;
  ctaPrimaryLink: string;
  ctaSecondaryLabel: string;
  ctaSecondaryLink: string;
}

export interface PeriodsKpiConfig {
  title: string;
  subtitle: string;
  rightText: string;
  badge: string;
  cardButtonLabel: string;
}

export interface PeriodsHomeSectionConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
}

export interface PeriodsCmsConfig {
  hero: PeriodsHeroConfig;
  kpi: PeriodsKpiConfig;
  homeSection: PeriodsHomeSectionConfig;
  categories: PeriodCategoryItem[];
  periods: AdminPeriodCard[];
}

export const PERIODS_CMS_STORAGE_KEY = "RootsTunisia_periods_cms_config_v4";
export const PERIODS_CMS_LOCALES_KEY = "RootsTunisia_periods_cms_locales_v4";

export const DEFAULT_PERIOD_CATEGORIES: PeriodCategoryItem[] = [
  {
    key: "antiquite",
    label: "Antiquité & Byzance",
    icon: "Landmark",
    description: "Carthage punique, Afrique romaine, Royaume vandale et Exarchat byzantin (814 av. J.-C. – 698).",
  },
  {
    key: "islam_medieval",
    label: "Dynasties Islamiques & Médiévales",
    icon: "Crown",
    description: "Conquête arabe, Aghlabides de Kairouan, Fatimides, Zirides, Almohades et Sultanat Hafside (647 – 1574).",
  },
  {
    key: "ottoman_beylical",
    label: "Régence Ottomane & Beylicat",
    icon: "Scroll",
    description: "Province impériale ottomane, Deylicat, Mouradites et Dynastie Husseinite de Tunis (1574 – 1881).",
  },
  {
    key: "contemporain",
    label: "Protectorat & République",
    icon: "Shield",
    description: "Protectorat français (1881 – 1956), Indépendance et République Tunisienne moderne (1956 – Aujourd'hui).",
  },
];

const LOCALIZED_CATEGORIES: Record<string, PeriodCategoryItem[]> = {
  fr: DEFAULT_PERIOD_CATEGORIES,
  en: [
    {
      key: "antiquite",
      label: "Antiquity & Byzantium",
      icon: "Landmark",
      description: "Punic Carthage, Roman Africa, Vandal Kingdom, and Byzantine Exarchate (814 BC – 698 AD).",
    },
    {
      key: "islam_medieval",
      label: "Islamic & Medieval Dynasties",
      icon: "Crown",
      description: "Arab Conquest, Aghlabids of Kairouan, Fatimids, Zirids, Almohads, and Hafsid Sultanate (647 – 1574).",
    },
    {
      key: "ottoman_beylical",
      label: "Ottoman Regency & Beylicate",
      icon: "Scroll",
      description: "Ottoman Imperial Province, Deylicate, Muradids, and Husseinite Dynasty of Tunis (1574 – 1881).",
    },
    {
      key: "contemporain",
      label: "Protectorate & Modern Republic",
      icon: "Shield",
      description: "French Protectorate (1881 – 1956), Independence, and Modern Tunisian Republic (1956 – Present).",
    },
  ],
  ar: [
    {
      key: "antiquite",
      label: "العصور القديمة والبيزنطية",
      icon: "Landmark",
      description: "قرطاج البونية، إفريقية الرومانية، المملكة الوندالية، والإكسارخية البيزنطية (814 ق.م – 698 م).",
    },
    {
      key: "islam_medieval",
      label: "الدول الإسلامية والوسيطة",
      icon: "Crown",
      description: "الفتح الإسلامي، الأغالبة بالقيروان، الفاطميون، الزيريون، الموحدون، والسلطنة الحفصية (647 – 1574).",
    },
    {
      key: "ottoman_beylical",
      label: "الإيالة العثمانية والبايات",
      icon: "Scroll",
      description: "الولاية العثمانية، الدايات، الدولة المرادية، والدولة الحسينية بتونس (1574 – 1881).",
    },
    {
      key: "contemporain",
      label: "الحماية والجمهورية الحديثة",
      icon: "Shield",
      description: "الحماية الفرنسية (1881 – 1956)، الاستقلال، والجمهورية التونسية الحديثة (1956 – اليوم).",
    },
  ],
  es: [
    {
      key: "antiquite",
      label: "Antigüedad y Bizancio",
      icon: "Landmark",
      description: "Cartago púnica, África romana, Reino vándalo y Exarcado bizantino (814 a.C. – 698).",
    },
    {
      key: "islam_medieval",
      label: "Dinastías Islámicas y Medievales",
      icon: "Crown",
      description: "Conquista árabe, Aglabíes de Kairuán, Fatimíes, Ziríes, Almohades y Sultanato Háfsida (647 – 1574).",
    },
    {
      key: "ottoman_beylical",
      label: "Regencia Otomana y Beylicato",
      icon: "Scroll",
      description: "Provincia imperial otomana, Deylicato, Muradíes y Dinastía Husseinita de Túnez (1574 – 1881).",
    },
    {
      key: "contemporain",
      label: "Protectorado y República",
      icon: "Shield",
      description: "Protectorado francés (1881 – 1956), Independencia y República Tunecina moderna (1956 – Hoy).",
    },
  ],
  it: [
    {
      key: "antiquite",
      label: "Antichità e Bisanzio",
      icon: "Landmark",
      description: "Cartagine punica, Africa romana, Regno vandalo ed Esarcato bizantino (814 a.C. – 698).",
    },
    {
      key: "islam_medieval",
      label: "Dinastie Islamiche e Medievali",
      icon: "Crown",
      description: "Conquista araba, Aghlabidi di Kairouan, Fatimidi, Ziridi, Almohadi e Sultanato Hafside (647 – 1574).",
    },
    {
      key: "ottoman_beylical",
      label: "Reggenza Ottomana e Beylicato",
      icon: "Scroll",
      description: "Provincia imperiale ottomana, Deylicato, Muraditi e Dinastia Husseinita di Tunisi (1574 – 1881).",
    },
    {
      key: "contemporain",
      label: "Protettorato e Repubblica",
      icon: "Shield",
      description: "Protettorato francese (1881 – 1956), Indipendenza e Repubblica Tunisina moderna (1956 – Oggi).",
    },
  ],
  mt: [
    {
      key: "antiquite",
      label: "Antikità u Biżanzju",
      icon: "Landmark",
      description: "Kartaġni Punika, Afrika Rumana, Renju Vandalu u Eżarkat Biżantin (814 QK – 698).",
    },
    {
      key: "islam_medieval",
      label: "Dinastiji Islamiċi u Medjevali",
      icon: "Crown",
      description: "Konkwista Għarbija, Aglabidi ta' Kairouan, Fatimidi, Żiridi, Almohadi u Sultanat Ħafsid (647 – 1574).",
    },
    {
      key: "ottoman_beylical",
      label: "Reġġenza Ottomana u Bejlikat",
      icon: "Scroll",
      description: "Provinċja imperjali Ottomana, Dejlikat, Muraditi u Dinastija Ħussejnita ta' Tuneż (1574 – 1881).",
    },
    {
      key: "contemporain",
      label: "Protettorat u Repubblika",
      icon: "Shield",
      description: "Protettorat Franċiż (1881 – 1956), Indipendenza u Repubblika Tuneżina moderna (1956 – Illum).",
    },
  ],
};

interface EraLocaleTranslation {
  title: string;
  displayPeriod: string;
  capital: string;
  empire: string;
  devletName: string;
  tunisiaEntityName: string;
  description: string;
  treatiesAndBorders: string;
  divisionsTitle: string;
  tunisRole: string;
  lineagesSummary: string;
  customTags: string[];
}

const LOCALIZED_ERA_CONTENT: Record<string, Record<string, EraLocaleTranslation>> = {
  en: {
    punique: {
      title: "Punic Antiquity & Carthage",
      displayPeriod: "814 BC – 146 BC",
      capital: "Carthage",
      empire: "Metropolitan Republic of Carthage & Numidia",
      devletName: "Republic of Carthage (Phoenician-Punic Maritime Empire)",
      tunisiaEntityName: "Metropolitan Territory of Carthage & Fossa Regia",
      description:
        "Carthage dominates western Mediterranean trade. The metropolitan Carthaginian territory is separated from the Numidian Kingdom of Massinissa by the famed Fossa Regia (trench drawn by Scipio Aemilianus in 146 BC).",
      treatiesAndBorders:
        "The Fossa Regia links Thabraca (Tabarka) in the northwest to Thaenae (Thyna, south of Sfax). The interior belongs to the Numidian kings (Massylii and Masaesyli).",
      divisionsTitle: "Metropolitan Territories & Punic Cities",
      tunisRole:
        "Thunes (Tunis): Libyco-Punic satellite city erected on the strategic isthmus separating the Lake of Tunis from the Sejoumi lagoon, guarding Byrsa against land assaults.",
      lineagesSummary:
        "Phoenician-Punic epigraphic Semitic registers based on theophoric filiation, along with bilingual Libyco-Berber stelae from Dougga and Carthaginian necropolises.",
      customTags: ["814 BC – 146 BC", "Capital: Carthage", "Republic of Carthage", "Hannibal Barca", "Barcids"],
    },
    romaine: {
      title: "Africa Proconsularis & Roman Empire",
      displayPeriod: "146 BC – 439 AD",
      capital: "Hadrumetum / Carthago",
      empire: "Provincia Africa Proconsularis & Byzacena",
      devletName: "Imperium Romanum (Roman Empire)",
      tunisiaEntityName: "Provinces of Africa Proconsularis, Byzacena & Tripolitania",
      description:
        "Tunisia becomes the 'granary of Rome'. A dense network of 200 municipal cities (El Jem, Dougga, Bulla Regia, Sbeitla) connected by the Saharan Limes and the Zaghouan Aqueduct.",
      treatiesAndBorders:
        "Southern frontier protected by the Limes Tripolitanus linking Gafsa/Capsa, Bezereos, and Tillibari (Remada).",
      divisionsTitle: "Roman Provinces & Municipal Curiae",
      tunisRole:
        "Tunes: Flourishing Roman municipium attached to Julia Carthago, major imperial road junction toward Sicca Veneria (El Kef) and the Zaghouan Aqueduct.",
      lineagesSummary:
        "Classical Roman tripartite Tria Nomina (praenomen, nomen, cognomen) engraved on over 30,000 funerary stelae recorded in the Corpus Inscriptionum Latinarum (CIL VIII).",
      customTags: ["146 BC – 439 AD", "Capital: Carthago", "Roman Empire", "Septimius Severus", "CIL VIII"],
    },
    vandale_byzantine: {
      title: "Vandal Kingdom & Byzantine Restoration",
      displayPeriod: "439 – 647 / 698",
      capital: "Carthage",
      empire: "Regnum Vandalorum then Exarchate of Africa (Byzantium)",
      devletName: "Byzantine Empire / Exarchatus Africae",
      tunisiaEntityName: "Exarchate of Carthage & Fortresses of Africa",
      description:
        "Genseric establishes the Vandal Kingdom in 439. In 533, Belisarius reconquers Carthage for Emperor Justinian, building a powerful network of Byzantine fortresses (Haidra, Kelibia, Tebessa, Sbeitla).",
      treatiesAndBorders:
        "The Exarchate of Carthage extends from the Tunisian coasts to Tripolitania and Sardinia.",
      divisionsTitle: "Byzantine Military Duchies & Eparchies",
      tunisRole:
        "Tunes: Fortified stronghold guarding the southern access to the lagoon of Carthage under the Byzantine dukes of Africa.",
      lineagesSummary:
        "Patrimonial charters of the Exarchate of Carthage, Albertini Tablets (notarial deeds on cedar wood), and ecclesiastical council records.",
      customTags: ["439 – 698 AD", "Capital: Carthage", "Byzantine Exarchate", "Genseric & Belisarius", "Albertini Tablets"],
    },
    omeyyade: {
      title: "Umayyad Caliphate & Dawn of Islam",
      displayPeriod: "647 – 800",
      capital: "Kairouan",
      empire: "Umayyad Caliphate of Damascus",
      devletName: "Al-Khilafa Al-Umawiyya (Umayyad Caliphate)",
      tunisiaEntityName: "Wilayat Ifriqiya",
      description:
        "Arrival of Islam in the Maghreb. Victory of Sufetula in 647, foundation of Kairouan in 670 by Uqba Ibn Nafi, and foundation of the Zitouna Mosque of Tunis in 698 by Hassan Ibn al-Nu'man. Kairouan becomes the capital of the Muslim West.",
      treatiesAndBorders:
        "Wilayat Ifriqiya encompasses the eastern Maghreb and serves as the launchpad for the conquest of Al-Andalus (711).",
      divisionsTitle: "Kouras & Districts of Wilayat Ifriqiya",
      tunisRole:
        "Historic foundation of Islamic Tunis in 698 by Hassan Ibn al-Nu'man: creation of the naval arsenal (Dar al-Sina'a), the channel to La Goulette, and the Zitouna Mosque.",
      lineagesSummary:
        "Registers of the Diwan al-Jund of Kairouan recording Arab tribal banners (Mudarites, Yemenites, Banu Fihr) and allied Amazigh confederations.",
      customTags: ["647 – 800", "Capital: Kairouan", "Umayyad Caliphate", "Uqba Ibn Nafi", "Fihrids"],
    },
    aghlabide: {
      title: "Aghlabid Emirate of Ifriqiya",
      displayPeriod: "800 – 909",
      capital: "Kairouan / Raqqada",
      empire: "Sovereign Emirate of Banu al-Aghlab",
      devletName: "Imarat Al-Aghaliba (Aghlabid Emirate)",
      tunisiaEntityName: "Aghlabid Ifriqiya & Conquest of Sicily",
      description:
        "Ibrahim Ibn al-Aghlab founds a sovereign dynasty in Ifriqiya in 800. Scientific and architectural golden age: Aghlabid Basins, conquest of Sicily (827–831), foundation of Raqqada, and codification of Maliki jurisprudence.",
      treatiesAndBorders:
        "The emirate extends from Constantine to Tripoli and controls Sicily, Malta, and the Strait of Sicily.",
      divisionsTitle: "Aghlabid Kouras of Ifriqiya",
      tunisRole:
        "Tunis emerges as the major naval and university hub of Ifriqiya; the Zitouna Mosque is magnificently rebuilt in 864.",
      lineagesSummary:
        "Legal transmission chains (Isnad) of the Maliki scholars of Kairouan and Tunis, Habous endowments, and wills recorded under Grand Qadi Imam Sahnoun.",
      customTags: ["800 – 909", "Capital: Kairouan", "Aghlabid Emirate", "Ibrahim Ibn al-Aghlab", "Imam Sahnoun"],
    },
    fatimide: {
      title: "Fatimid Caliphate & Zirid Dynasty",
      displayPeriod: "909 – 1159",
      capital: "Mahdia / Al-Mansouria",
      empire: "Fatimid Caliphate of Ifriqiya then Zirid Emirate",
      devletName: "Al-Khilafa Al-Fatimiyya & Banu Ziri",
      tunisiaEntityName: "Fatimid Ifriqiya then Zirid Emirate",
      description:
        "Proclamation of the Fatimid Caliphate in 909 by Ubayd Allah al-Mahdi and foundation of the fortified capital of Mahdia in 916. After the Fatimids depart for Cairo in 969, Tunisia is governed by the Zirids (Sabra Al-Mansouria) and Banu Khurasan in Tunis.",
      treatiesAndBorders:
        "Control of the eastern Maghreb, followed by the Hilalian migration (from 1051) which reshapes rural tribal lineages.",
      divisionsTitle: "Fatimid Amilates & Zirid Principalities",
      tunisRole:
        "Sovereign principality under the Banu Khurasan dynasty (1059–1159), surrounded by ramparts and centered on Dar El-Khurasani.",
      lineagesSummary:
        "Fatimid chancellery registers, Cairo Genizah trade deeds, Qadi records of Tunis, and Sanhadja and Banu Hilal tribal genealogies.",
      customTags: ["909 – 1159", "Capital: Mahdia", "Fatimids & Zirids", "Ubayd Allah al-Mahdi", "Sanhadja & Banu Hilal"],
    },
    almohade: {
      title: "Almohad Period of the Greater Maghreb",
      displayPeriod: "1159 – 1228",
      capital: "Tunis / Marrakesh",
      empire: "Almohad Caliphate (Al-Muwahhidun)",
      devletName: "Al-Dawla Al-Muwahhidiyya (Almohad Empire)",
      tunisiaEntityName: "Province of Ifriqiya under Almohad Governorship",
      description:
        "Abd al-Mu'min unifies the Maghreb and Al-Andalus. Tunis is liberated from Norman occupation in 1159 and becomes the administrative capital of Ifriqiya under Almohad governors, ancestors of the Hafsids.",
      treatiesAndBorders:
        "Vast empire stretching from Seville and Marrakesh to Tripoli.",
      divisionsTitle: "Governorships of the Almohad Sheikhs",
      tunisRole:
        "Tunis officially becomes the capital of Ifriqiya under Governor Sheikh Abd al-Wahid Ibn Abi Hafs, with the Kasbah of Tunis as seat of power.",
      lineagesSummary:
        "Almohad imperial chancellery registers, Hintata and Masmouda military rolls, and diplomatic charters with Pisa and Genoa.",
      customTags: ["1159 – 1228", "Capital: Tunis", "Almohad Empire", "Abd al-Mu'min", "Banu Hafs"],
    },
    hafside: {
      title: "Hafsid Sultanate of Tunis & Andalusian Refugees",
      displayPeriod: "1228 – 1574",
      capital: "Tunis",
      empire: "Hafsid Kingdom of Tunis (Al-Dawla Al-Hafsiyya)",
      devletName: "Al-Dawla Al-Hafsiyya (Sovereign Hafsid Sultanate)",
      tunisiaEntityName: "Hafsid Sultanate of Tunis & Ifriqiya",
      description:
        "Abu Zakariya Yahya proclaims Hafsid independence in 1228. Tunis becomes the radiant capital of the eastern Maghreb, welcoming Andalusian scholars and artisans, founding madrasas, and witnessing the birth of Ibn Khaldun (1332).",
      treatiesAndBorders:
        "The sultanate extends from Constantine and Béjaïa to Tripoli, with maritime treaties signed with Venice, Genoa, Pisa, Florence, and Aragon.",
      divisionsTitle: "Hafsid Outans & Provinces",
      tunisRole:
        "Undisputed golden age of Tunis: royal Kasbah, first Madrasas (Ech-Chammaïyya), Zitouna University, and Andalusian quarters.",
      lineagesSummary:
        "Notarial registers of the Kasbah Adoul, Maliki court Sijills, Zitouna Habous charters, and Ibn Khaldun's Kitab al-Ibar.",
      customTags: ["1228 – 1574", "Capital: Tunis", "Hafsid Sultanate", "Abu Zakariya Yahya", "Ibn Khaldun"],
    },
    ottomane: {
      title: "Ottoman Regency of Tunis & Muradid Dynasty",
      displayPeriod: "1574 – 1705",
      capital: "Tunis",
      empire: "Ottoman Empire & Eyalet of Tunis (Regency of Tunis)",
      devletName: "Ottoman Regency of Tunis",
      tunisiaEntityName: "Eyalet of Tunis / Ottoman Regency",
      description:
        "In 1574, Sinan Pasha and Uluç Ali expel the Spanish. Tunis becomes an autonomous Ottoman Eyalet governed by Pashas, Deys, and the hereditary Muradid Beys (from 1613), welcoming 80,000 Moriscos from Spain in 1609.",
      treatiesAndBorders:
        "Borders stabilize against Algiers to the west and Tripoli to the southeast; consular capitulations signed with France and England.",
      divisionsTitle: "Makhzen Caidats & Garrison Fortresses",
      tunisRole:
        "Seat of a sovereign Mediterranean state: octagonal Ottoman minarets (Youssef Dey, Hammouda Pasha), Chechia guilds, and La Goulette fortress.",
      lineagesSummary:
        "Ottoman military and fiscal Defters (ANT Kasbah), Hanafi and Maliki Sharia court Sijills, Morisco notarial deeds, and consular registers.",
      customTags: ["1574 – 1705", "Capital: Tunis", "Ottoman Regency", "Youssef Dey & Murad Bey", "Moriscos 1609"],
    },
    husseinite: {
      title: "Husseinite Beylicate & The 60 Caidats",
      displayPeriod: "1705 – 1881",
      capital: "Tunis / Le Bardo",
      empire: "Beylical Kingdom of Tunis (Al-Mamlaka Al-Tunisiyya)",
      devletName: "Beylical Kingdom of Tunis",
      tunisiaEntityName: "National Territory of the 60 Caidats & Majba Rolls",
      description:
        "Foundation of the Husseinite dynasty in 1705 by Hussein Ben Ali. Remarkable modern state sovereignty: 60 caidats, Abolition of Slavery (1846), Fundamental Pact (1857), Constitution of 1861 (first in the Arab world), and the nominal Majba tax census (1860).",
      treatiesAndBorders:
        "Border treaties of 1840 and 1860; semi-annual fiscal expeditions of the Northern and Southern Mahalla.",
      divisionsTitle: "The 60 Territorial Caidats & Majba Regions",
      tunisRole:
        "Heart of the modern Beylical state: Bardo Palace, Dar El-Bey, Sadiki College (1875), State Printing Press, and European consulates.",
      lineagesSummary:
        "Complete nominal Majba registers of 1860–1869 (ANT Kasbah Series 1–60) listing heads of households by caidat and tribal fraction, plus Adoul Sijills.",
      customTags: ["1705 – 1881", "Capital: Tunis / Bardo", "Husseinite Kingdom", "Hussein Ben Ali & Kheireddine", "Majba 1860"],
    },
    protectorat: {
      title: "French Protectorate & Modern Civil Registration",
      displayPeriod: "1881 – 1956",
      capital: "Tunis",
      empire: "Regency of Tunis (French Protectorate)",
      devletName: "Regency of Tunis (Protectorate)",
      tunisiaEntityName: "Civil Controls & Southern Military Territories",
      description:
        "Treaty of Bardo (1881) and La Marsa Convention (1883). Final border delimitation (Tripoli Convention of 1910), introduction of municipal civil registration in 1886, and rise of the National Movement leading to Independence.",
      treatiesAndBorders:
        "Tripoli Convention (May 19, 1910) fixing the southern border from Ras Jedir to Ghadames; division into Civil Controls and Military Territories.",
      divisionsTitle: "Civil Controls & Military Territories",
      tunisRole:
        "Dual metropolis combining the historic Medina with the modern grid city, seat of the Residence General, Municipal Archives, and national independence leaders.",
      lineagesSummary:
        "Municipal and consular Civil Status registers (Births, Marriages, Deaths) from 1886, naturalization decrees (1924–1927), and military service rolls.",
      customTags: ["1881 – 1956", "Capital: Tunis", "Protectorate", "Moncef Bey & Bourguiba", "Civil Status 1886"],
    },
    republique: {
      title: "Modern Tunisian Republic & 24 Governorates",
      displayPeriod: "1956 – Present",
      capital: "Tunis",
      empire: "Republic of Tunisia (Al-Jumhuriyya Al-Tunisiyya)",
      devletName: "Republic of Tunisia",
      tunisiaEntityName: "National Territory of the 24 Governorates & Municipalities",
      description:
        "Independence on March 20, 1956, proclamation of the Republic on July 25, 1957, promulgation of the Personal Status Code (1956), and organization into 24 governorates, 264 delegations, and 350 municipalities.",
      treatiesAndBorders:
        "Full national sovereignty, unified civil registration, and centralization at the National Archives of Tunisia.",
      divisionsTitle: "The 24 Governorates of the Republic",
      tunisRole:
        "Sovereign political, economic, and cultural capital: Carthage Palace, Bardo Parliament, Kasbah Government Square, and National Archives of Tunisia.",
      lineagesSummary:
        "Unified Civil Status registers across 350 Tunisian municipalities, patronymic standardization laws, National Identity Card (CIN), and digitized Land Registry (CPF).",
      customTags: ["1956 – Present", "Capital: Tunis", "Republic of Tunisia", "24 Governorates", "350 Municipalities"],
    },
  },
  ar: {
    punique: {
      title: "العهد البونيقي القرطاجي والمملكة النوميدية",
      displayPeriod: "814 ق.م – 146 ق.م",
      capital: "قرطاج",
      empire: "جمهورية قرطاج والمملكة النوميدية",
      devletName: "جمهورية قرطاج البحرية البونيقية",
      tunisiaEntityName: "المجال القرطاجي وخط فوسا ريجيا",
      description:
        "هيمنت قرطاج على تجارة غرب المتوسط، وانفصل مجالها الحضري عن المملكة النوميدية بقيادة ماسينيسا عبر الخندق الملكي الشهير (فوسا ريجيا) المرسوم سنة 146 ق.م.",
      treatiesAndBorders:
        "يربط خط فوسا ريجيا بين طبرقة شمالاً وطينة جنوب صفاقس، بينما حكم الملوك النوميديون المناطق الداخلية.",
      divisionsTitle: "الأقاليم القرطاجية والمدن البونيقية",
      tunisRole:
        "تونس (ترشيش): حاضرة ليبية-بونيقية استراتيجية على البرزخ الفاصل بين بحيرة تونس وسبخة السيجومي لحماية قرطاج براً.",
      lineagesSummary:
        "النقائش البونيقية واللبنية المزدوجة في دقة وتوفاة قرطاج التي توثق سلاسل النسب الكنعانية والأمازيغية القديمة.",
      customTags: ["814 ق.م – 146 ق.م", "العاصمة : قرطاج", "جمهورية قرطاج", "حنبعل برقا", "عائلة برقا"],
    },
    romaine: {
      title: "إفريقيا البروقنصلية والعهد الروماني",
      displayPeriod: "146 ق.م – 439 م",
      capital: "قرطاج / حضرموت (سوسة)",
      empire: "مقاطعة إفريقيا البروقنصلية وبيزاسينا",
      devletName: "الإمبراطورية الرومانية",
      tunisiaEntityName: "مقاطعات إفريقيا البروقنصلية وبيزاسينا وطرابلس",
      description:
        "أصبحت تونس مطمورة قمح روما، وازدهرت فيها أكثر من 200 مدينة بلدية (الجم، دقة، بولا ريجيا، سبيطلة) مرتبطة بخط الليمس الدفاعي جنوباً وحنايا زغوان.",
      treatiesAndBorders:
        "حماية الحدود الجنوبية عبر خط الليمس الممتد من قفصة إلى رمادة.",
      divisionsTitle: "المقاطعات والبلديات الرومانية",
      tunisRole:
        "تونس (Tunes): بلدية رومانية مزدهرة وملتقى الطرق الإمبراطورية الكبرى نحو الكاف وحنايا زغوان.",
      lineagesSummary:
        "النظام الثلاثي للأسماء الرومانية-الأفريقية الموثق في أكثر من 30 ألف نقيشة جنائزية وبلدية ضمن المدونة اللاتينية (CIL VIII).",
      customTags: ["146 ق.م – 439 م", "العاصمة : قرطاج", "العهد الروماني", "سبتيموس سيفيروس", "نقائش CIL VIII"],
    },
    vandale_byzantine: {
      title: "العهد الوندالي والاستعادة البيزنطية لإفريقية",
      displayPeriod: "439 – 647 / 698 م",
      capital: "قرطاج",
      empire: "المملكة الوندالية ثم إكسارخية إفريقية البيزنطية",
      devletName: "الإمبراطورية البيزنطية (إكسارخية قرطاج)",
      tunisiaEntityName: "إكسارخية قرطاج والقلاع البيزنطية",
      description:
        "أسس جنسريق المملكة الوندالية سنة 439 م، وفي سنة 533 م استعاد القائد بيليزاريوس قرطاج لصالح الإمبراطور جستنيان وشيد شبكة حصون بيزنطية كبرى (حيدرة، قليبية، سبيطلة).",
      treatiesAndBorders:
        "امتدت إكسارخية قرطاج من السواحل التونسية إلى طرابلس وسردينيا.",
      divisionsTitle: "الدوقيات العسكرية والمقاطعات البيزنطية",
      tunisRole:
        "تونس: قلعة حصينة تحرس المدخل الجنوبي لبحيرة قرطاج تحت إمرة الدوقيات البيزنطية.",
      lineagesSummary:
        "لوحات ألبرتيني الخشبية (45 عقداً عدلياً موثقاً) وسجلات المجامع الكنسية بقرطاج.",
      customTags: ["439 – 698 م", "العاصمة : قرطاج", "إكسارخية قرطاج", "جستنيان وجرجير", "لوحات ألبرتيني"],
    },
    omeyyade: {
      title: "الخلافة الأموية وولاية إفريقية (تأسيس القيروان)",
      displayPeriod: "647 – 800 م",
      capital: "القيروان",
      empire: "الخلافة الأموية بدمشق",
      devletName: "الخلافة الأموية",
      tunisiaEntityName: "ولاية إفريقية",
      description:
        "الفتح الإسلامي لإفريقية: معركة سبيطلة سنة 647 م، وتأسيس القيروان سنة 670 م على يد عقبة بن نافع، وتأسيس جامع الزيتونة بتونس سنة 698 م على يد حسان بن النعمان.",
      treatiesAndBorders:
        "شملت ولاية إفريقية المغرب الأدنى والأوسط وكانت قاعدة انطلاق فتح الأندلس سنة 711 م.",
      divisionsTitle: "الكور والأقاليم في ولاية إفريقية",
      tunisRole:
        "تأسيس تونس الإسلامية سنة 698 م على يد حسان بن النعمان، وإنشاء دار الصناعة البحرية وجامع الزيتونة المعمور.",
      lineagesSummary:
        "دفاتر ديوان الجند بالقيروان التي وثقت القبائل العربية الفاتحة (قريش، فهر، الأزد، تميم) والقبائل الأمازيغية.",
      customTags: ["647 – 800 م", "العاصمة : القيروان", "الخلافة الأموية", "عقبة بن نافع", "الأسرة الفهرية"],
    },
    aghlabide: {
      title: "الدولة الأغلبية بإفريقية وعاصمتها القيروان",
      displayPeriod: "800 – 909 م",
      capital: "القيروان / رقادة",
      empire: "إمارة بني الأغلب المستقلة",
      devletName: "الدولة الأغلبية",
      tunisiaEntityName: "إفريقية الأغلبية وفتح صقلية",
      description:
        "أسس إبراهيم بن الأغلب دولة مستقلة في إفريقية سنة 800 م، وشهدت البلاد عصراً ذهبياً علمياً وعمرانياً: فسقيات الأغالبة، فتح صقلية (827 م)، وتدوين الفقه المالكي.",
      treatiesAndBorders:
        "امتدت الدولة من قسنطينة إلى طرابلس مع السيطرة على صقلية ومالطا.",
      divisionsTitle: "كور الدولة الأغلبية بإفريقية",
      tunisRole:
        "برزت تونس كقطب بحري وعلمي أول، وأعيد بناء جامع الزيتونة في حلته التاريخية سنة 864 م.",
      lineagesSummary:
        "سلاسل الإسناد الفقهية لعلماء القيروان وتونس، وعقود الأحباس الموثقة في عهد الإمام سحنون.",
      customTags: ["800 – 909 م", "العاصمة : القيروان", "الدولة الأغلبية", "إبراهيم بن الأغلب", "الإمام سحنون"],
    },
    fatimide: {
      title: "الخلافة الفاطمية بالمهدية والدولة الزيرية",
      displayPeriod: "909 – 1159 م",
      capital: "المهدية / صبرة المنصورية",
      empire: "الخلافة الفاطمية ثم الإمارة الزيرية الصنهاجية",
      devletName: "الخلافة الفاطمية والدولة الزيرية",
      tunisiaEntityName: "إفريقية الفاطمية والزيرية وإمارة بني خراسان",
      description:
        "تأسيس الخلافة الفاطمية سنة 909 م وبناء العاصمة الحصينة المهدية سنة 916 م. وبعد انتقال الفاطميين إلى القاهرة سنة 969 م حكم الزيريون إفريقية من صبرة المنصورية، وحكم بنو خراسان مدينة تونس.",
      treatiesAndBorders:
        "تحولات ديموغرافية وقبلية كبرى مع الهجرة الهلالية ابتداءً من منتصف القرن الحادي عشر.",
      divisionsTitle: "العمالات الفاطمية والإمارات الزيرية",
      tunisRole:
        "إمارة مستقلة مزدهرة تحت حكم أسرة بني خراسان (1059–1159 م) محصنة بالأسوار وقصر دار الخراساني.",
      lineagesSummary:
        "سجلات الدواوين الفاطمية والزيرية، ووثائق الجنيزة، وأنساب قبائل صنهاجة وبني هلال وبني سليم.",
      customTags: ["909 – 1159 م", "العاصمة : المهدية", "الفاطميون والزيريون", "المعز بن باديس", "بنو خراسان"],
    },
    almohade: {
      title: "العهد الموحدي وتوحيد بلاد المغرب والأندلس",
      displayPeriod: "1159 – 1228 م",
      capital: "تونس / مراكش",
      empire: "الخلافة الموحدية",
      devletName: "الدولة الموحدية",
      tunisiaEntityName: "ولاية إفريقية في العهد الموحدي",
      description:
        "وحّد عبد المؤمن بن علي بلاد المغرب والأندلس، وحرر تونس والمهدية سنة 1159 م، فاتخذت تونس عاصمة إدارية لإفريقية تحت ولاية شيوخ هنتاتة أجداد الحفصيين.",
      treatiesAndBorders:
        "إمبراطورية ممتدة من إشبيلية ومراكش غرباً إلى طرابلس شرقاً.",
      divisionsTitle: "ولايات الشيوخ الموحدين بإفريقية",
      tunisRole:
        "أصبحت تونس العاصمة الرسمية لإفريقية وتأسست قصبة تونس مقراً للحكم والجيش.",
      lineagesSummary:
        "سجلات الدواوين الموحدية، وأنساب قبائل هنتاتة ومصمودة، والمعاهدات التجارية مع بيزا وجنوة.",
      customTags: ["1159 – 1228 م", "العاصمة : تونس", "الدولة الموحدية", "عبد المؤمن بن علي", "آل أبي حفص"],
    },
    hafside: {
      title: "الدولة الحفصية بتونس والأندلسيون والمقدمة الخلدونية",
      displayPeriod: "1228 – 1574 م",
      capital: "تونس",
      empire: "السلطنة الحفصية بتونس",
      devletName: "الدولة الحفصية",
      tunisiaEntityName: "السلطنة الحفصية بتونس وإفريقية",
      description:
        "أعلن أبو زكريا يحيى الحفصي استقلال السلطنة سنة 1228 م، فغدت تونس حاضرة كبرى استقبلت المهاجرين الأندلسيين وشهدت تأسيس المدارس العلمية وميلاد العلامة عبد الرحمن بن خلدون (1332 م).",
      treatiesAndBorders:
        "امتدت السلطنة من قسنطينة وبجاية إلى طرابلس مع معاهدات بحرية مع البندقية وجنوة وفلورنسا وأراغون.",
      divisionsTitle: "الأوطان والأقاليم الحفصية",
      tunisRole:
        "العصر الذهبي لمدينة تونس: قصبة تونس، المدارس الحفصية (الشماعية والمنتصرية)، وازدهار جامع الزيتونة.",
      lineagesSummary:
        "رسوم العدول بالقصبة، وحجج الأحباس الزيتونية، وتراجم البيوتات التونسية والأندلسية في كتاب العبر لابن خلدون.",
      customTags: ["1228 – 1574 م", "العاصمة : تونس", "السلطنة الحفصية", "أبو زكريا يحيى", "ابن خلدون"],
    },
    ottomane: {
      title: "إيالة تونس العثمانية والدولة المرادية",
      displayPeriod: "1574 – 1705 م",
      capital: "تونس",
      empire: "الدولة العثمانية وإيالة تونس",
      devletName: "إيالة تونس العثمانية",
      tunisiaEntityName: "إيالة تونس والبايات المراديون",
      description:
        "في سنة 1574 م دخل سنان باشا وقلج علي تونس، فأصبحت إيالة عثمانية ذات حكم ذاتي تحت إمرة الباشوات والدايات ثم البايات المراديين، واستقبلت 80 ألف أندلسي موريسكي سنة 1609 م.",
      treatiesAndBorders:
        "استقرار الحدود الغربية والشرقية وإبرام المعاهدات القنصلية والبحرية.",
      divisionsTitle: "قيادات المخزن والحاميات العثمانية",
      tunisRole:
        "حاضرة البحر المتوسط: بناء الجوامع الحنفية ذات المآذن المثمنة (يوسف داي وحمودة باشا)، أسواق الشاشية، وقلعة حلق الوادي.",
      lineagesSummary:
        "الدفاتر الجبائية والعسكرية العثمانية بالأرشيف الوطني التونسي، وسجلات المحاكم الشرعية الحنفية والمالكية، وعقود الأندلسيين بتستور وسليمان.",
      customTags: ["1574 – 1705 م", "العاصمة : تونس", "الإيالة العثمانية", "يوسف داي ومراد باي", "الأندلسيون 1609"],
    },
    husseinite: {
      title: "المملكة التونسية الحسينية ونظام الـ 60 قيادة",
      displayPeriod: "1705 – 1881 م",
      capital: "تونس / قصر باردو",
      empire: "المملكة التونسية الحسينية",
      devletName: "الدولة الحسينية بتونس",
      tunisiaEntityName: "تراب الـ 60 قيادة ودفاتر المجبة",
      description:
        "تأسيس الدولة الحسينية سنة 1705 م على يد حسين بن علي: بناء الدولة الحديثة، إلغاء الرق (1846 م)، عهد الأمان (1857 م)، دستور 1861 م، والإحصاء الاسمي الشامل للمجبة (1860 م).",
      treatiesAndBorders:
        "تنظيم تراب المملكة في 60 قيادة وإدارتها عبر محلة الشمال ومحلة الجنوب.",
      divisionsTitle: "القيادات الترابية الـ 60 وأقاليم المجبة",
      tunisRole:
        "قلب الدولة التونسية الحديثة: قصر باردو، دار الباي بالقصبة، المدرسة الصادقية (1875 م)، والمطبعة الرسمية.",
      lineagesSummary:
        "دفاتر إحصاء المجبة الاسمية (1860–1869) بالأرشيف الوطني التونسي التي تحصي أرباب العائلات حسب القيادة والعرش، مع حجج العدول.",
      customTags: ["1705 – 1881 م", "العاصمة : تونس", "الدولة الحسينية", "حسين بن علي وخير الدين", "دفاتر المجبة 1860"],
    },
    protectorat: {
      title: "فترة الحماية الفرنسية وتثبيت الحدود والحالة المدنية",
      displayPeriod: "1881 – 1956 م",
      capital: "تونس",
      empire: "إيالة تونس (فترة الحماية)",
      devletName: "فترة الحماية بتونس",
      tunisiaEntityName: "المراقبات المدنية والجهات العسكرية بالجنوب",
      description:
        "معاهدة باردو (1881 م) واتفاقية المرسى (1883 م)، ترسيم الحدود الجنوبية نهائياً (اتفاقية طرابلس 1910 م)، إحداث سجلات الحالة المدنية البلدية سنة 1886 م، وتصاعد الحركة الوطنية حتى الاستقلال.",
      treatiesAndBorders:
        "اتفاقية طرابلس (19 ماي 1910) لترسيم الحدود من رأس جدير إلى غدامس وتقسيم الجنوب إلى جهات عسكرية.",
      divisionsTitle: "المراقبات المدنية والجهات العسكرية",
      tunisRole:
        "حاضرة مزدوجة تجمع بين المدينة العتيقة والأحياء الحديثة، ومعقل الحركة الوطنية والزعماء الوطنيين.",
      lineagesSummary:
        "سجلات الحالة المدنية البلدية والقنصلية (الولادات والزواج والوفيات) منذ 1886، ودفاتر التجنيد، وأرشيف نانت وأكس أون بروفانس.",
      customTags: ["1881 – 1956 م", "العاصمة : تونس", "فترة الحماية", "المنصف باي وبورقيبة", "الحالة المدنية 1886"],
    },
    republique: {
      title: "الجمهورية التونسية الحديثة والـ 24 ولاية",
      displayPeriod: "1956 – اليوم",
      capital: "تونس",
      empire: "الجمهورية التونسية",
      devletName: "الجمهورية التونسية",
      tunisiaEntityName: "الولايات الـ 24 والبلديات التونسية",
      description:
        "الاستقلال في 20 مارس 1956، وإعلان الجمهورية في 25 جويلية 1957، وإصدار مجلة الأحوال الشخصية، والتنظيم الترابي المعاصر في 24 ولاية و264 معتمدية و350 بلدية.",
      treatiesAndBorders:
        "السيادة الوطنية الكاملة وتوحيد سجلات الحالة المدنية ومركزتها بالأرشيف الوطني التونسي.",
      divisionsTitle: "ولايات الجمهورية التونسية الـ 24",
      tunisRole:
        "العاصمة السياسية والاقتصادية والثقافية للجمهورية: قصر قرطاج، مجلس النواب بباردو، ساحة الحكومة بالقصبة، والأرشيف الوطني التونسي.",
      lineagesSummary:
        "سجلات الحالة المدنية الموحدة في 350 بلدية، وقوانين تثبيت الألقاب العائلية، وبطاقة التعريف الوطنية، والسجل العقاري.",
      customTags: ["1956 – اليوم", "العاصمة : تونس", "الجمهورية التونسية", "24 ولاية", "350 بلدية"],
    },
  },
  es: {
    punique: {
      title: "Antigüedad Púnica y Cartago",
      displayPeriod: "814 a.C. – 146 a.C.",
      capital: "Cartago",
      empire: "República Metropolitana de Cartago y Numidia",
      devletName: "República de Cartago (Imperio Marítimo Fenicio-Púnico)",
      tunisiaEntityName: "Territorio Metropolitano de Cartago y Fossa Regia",
      description:
        "Cartago domina el comercio del Mediterráneo occidental. El territorio cartaginés está separado del Reino Númida de Masinisa por la célebre Fossa Regia (trazada en 146 a.C.).",
      treatiesAndBorders:
        "La Fossa Regia une Thabraca (Tabarka) al noroeste con Thaenae (Thyna, al sur de Sfax).",
      divisionsTitle: "Territorios Metropolitanos y Ciudades Púnicas",
      tunisRole:
        "Thunes (Túnez): Ciudad satélite líbico-púnica situada en el istmo estratégico entre el lago de Túnez y la laguna Sejoumi.",
      lineagesSummary:
        "Registros epigráficos semíticos fenicio-púnicos y estelas bilingües líbico-bereberes de Dougga y Cartago.",
      customTags: ["814 a.C. – 146 a.C.", "Capital: Cartago", "República de Cartago", "Aníbal Barca", "Bárcidas"],
    },
    romaine: {
      title: "África Proconsular e Imperio Romano",
      displayPeriod: "146 a.C. – 439 d.C.",
      capital: "Hadrumetum / Carthago",
      empire: "Provincia Africa Proconsularis y Byzacena",
      devletName: "Imperium Romanum (Imperio Romano)",
      tunisiaEntityName: "Provincias de África Proconsular, Bizacena y Tripolitania",
      description:
        "Túnez se convierte en el «granero de Roma». Red de 200 ciudades municipales (El Jem, Dougga, Bulla Regia, Sbeitla) conectadas por el Limes sahariano y el acueducto de Zaghouan.",
      treatiesAndBorders:
        "Frontera sur protegida por el Limes Tripolitanus que une Gafsa/Capsa y Remada.",
      divisionsTitle: "Provincias y Curias Municipales Romanas",
      tunisRole:
        "Tunes: Municipio romano floreciente vinculado a Julia Carthago y cruce de calzadas imperiales.",
      lineagesSummary:
        "Fórmula tripartita romana Tria Nomina grabada en más de 30.000 inscripciones del Corpus Inscriptionum Latinarum (CIL VIII).",
      customTags: ["146 a.C. – 439 d.C.", "Capital: Carthago", "Imperio Romano", "Septimio Severo", "CIL VIII"],
    },
    vandale_byzantine: {
      title: "Época Vándala y Restauración Bizantina",
      displayPeriod: "439 – 647 / 698",
      capital: "Cartago",
      empire: "Reino Vándalo y Exarcado de África (Bizancio)",
      devletName: "Imperio Bizantino / Exarchatus Africae",
      tunisiaEntityName: "Exarcado de Cartago y Fortalezas de África",
      description:
        "Genserico establece el reino vándalo en 439. En 533, Belisario reconquista Cartago para el emperador Justiniano y erige una red de fortalezas bizantinas (Haidra, Kelibia, Sbeitla).",
      treatiesAndBorders:
        "El Exarcado de Cartago se extiende desde las costas tunecinas hasta Tripolitania y Cerdeña.",
      divisionsTitle: "Ducados Militares y Eparquías Bizantinas",
      tunisRole:
        "Tunes: Bastión fortificado que vigila el acceso sur a la laguna de Cartago.",
      lineagesSummary:
        "Cartas patrimoniales del Exarcado de Cartago y Tabletas Albertini (45 actas notariales en madera).",
      customTags: ["439 – 698", "Capital: Cartago", "Exarcado Bizantino", "Genserico y Belisario", "Tabletas Albertini"],
    },
    omeyyade: {
      title: "Califato Omeya y Alba del Islam",
      displayPeriod: "647 – 800",
      capital: "Kairuán",
      empire: "Califato Omeya de Damasco",
      devletName: "Al-Khilafa Al-Umawiyya (Califato Omeya)",
      tunisiaEntityName: "Wilayat Ifriqiya",
      description:
        "Llegada del Islam al Magreb: victoria de Sufetula en 647, fundación de Kairuán en 670 por Uqba Ibn Nafi y fundación de la Mezquita Zitouna de Túnez en 698 por Hassan Ibn al-Nu'man.",
      treatiesAndBorders:
        "La Wilayat Ifriqiya abarca el Magreb oriental y sirve de base para la conquista de Al-Ándalus (711).",
      divisionsTitle: "Kouras y Distritos de la Wilayat de Ifriqiya",
      tunisRole:
        "Fundación histórica de la Túnez islámica en 698, su arsenal naval (Dar al-Sina'a) y la Mezquita Zitouna.",
      lineagesSummary:
        "Registros del Diwan al-Jund de Kairuán que consignan los linajes árabes y las confederaciones bereberes.",
      customTags: ["647 – 800", "Capital: Kairuán", "Califato Omeya", "Uqba Ibn Nafi", "Fihríes"],
    },
    aghlabide: {
      title: "Emirato Aglabí de Ifriqiya",
      displayPeriod: "800 – 909",
      capital: "Kairuán / Raqqada",
      empire: "Emirato Soberano de los Banu al-Aghlab",
      devletName: "Imarat Al-Aghaliba (Emirato Aglabí)",
      tunisiaEntityName: "Ifriqiya Aglabí y Conquista de Sicilia",
      description:
        "Ibrahim Ibn al-Aghlab funda una dinastía soberana en 800. Edad de oro científica y arquitectónica: Estanques de los Aglabíes, conquista de Sicilia (827–831) y fundación de Raqqada.",
      treatiesAndBorders:
        "El emirato se extiende de Constantina a Trípoli y controla Sicilia y Malta.",
      divisionsTitle: "Kouras Aglabíes de Ifriqiya",
      tunisRole:
        "Túnez se consolida como polo naval y universitario con la reconstrucción monumental de la Mezquita Zitouna en 864.",
      lineagesSummary:
        "Cadenas de transmisión jurídica (Isnad) de los maestros malikíes de Kairuán y Túnez bajo el Gran Cadí Sahnoun.",
      customTags: ["800 – 909", "Capital: Kairuán", "Emirato Aglabí", "Ibrahim Ibn al-Aghlab", "Imam Sahnoun"],
    },
    fatimide: {
      title: "Califato Fatimí y Dinastía Zirí",
      displayPeriod: "909 – 1159",
      capital: "Mahdia / Al-Mansouria",
      empire: "Califato Fatimí de Ifriqiya y Emirato Zirí",
      devletName: "Califato Fatimí y Dinastía Zirí",
      tunisiaEntityName: "Ifriqiya Fatimí y Principado de los Banu Khurasan",
      description:
        "Proclamación del Califato Fatimí en 909 y fundación de la capital fortificada de Mahdia en 916. Tras la partida fatimí a El Cairo en 969, gobiernan los Ziríes (Sabra Al-Mansouria) y los Banu Khurasan en Túnez.",
      treatiesAndBorders:
        "Control del Magreb oriental y transformación demográfica con la migración hilalí desde 1051.",
      divisionsTitle: "Amilatos Fatimíes y Principados Ziríes",
      tunisRole:
        "Principado soberano bajo la dinastía de los Banu Khurasan (1059–1159) con murallas y el palacio Dar El-Khurasani.",
      lineagesSummary:
        "Registros de cancillería fatimí, documentos de la Genizah de El Cairo y genealogías Sanhadja y Banu Hilal.",
      customTags: ["909 – 1159", "Capital: Mahdia", "Fatimíes y Ziríes", "Ubayd Allah al-Mahdi", "Banu Khurasan"],
    },
    almohade: {
      title: "Período Almohade del Gran Magreb",
      displayPeriod: "1159 – 1228",
      capital: "Túnez / Marrakech",
      empire: "Califato Almohade (Al-Muwahhidun)",
      devletName: "Imperio Almohade",
      tunisiaEntityName: "Provincia de Ifriqiya bajo Gobierno Almohade",
      description:
        "Abd al-Mumin unifica el Magreb y Al-Ándalus. Túnez es liberada de la ocupación normanda en 1159 y se convierte en la capital administrativa de Ifriqiya bajo gobernadores almohades.",
      treatiesAndBorders:
        "Imperio extendido desde Sevilla y Marrakech hasta Trípoli.",
      divisionsTitle: "Gobernaciones de los Jeques Almohades",
      tunisRole:
        "Túnez se convierte oficialmente en capital de Ifriqiya y se funda la Kasbah de Túnez.",
      lineagesSummary:
        "Registros imperiales almohades, linajes Hintata y Masmouda y tratados con Pisa y Génova.",
      customTags: ["1159 – 1228", "Capital: Túnez", "Imperio Almohade", "Abd al-Mumin", "Banu Hafs"],
    },
    hafside: {
      title: "Sultanato Háfsida de Túnez y Refugiados Andalusíes",
      displayPeriod: "1228 – 1574",
      capital: "Túnez",
      empire: "Reino Háfsida de Túnez (Al-Dawla Al-Hafsiyya)",
      devletName: "Sultanato Háfsida Soberano",
      tunisiaEntityName: "Sultanato Háfsida de Túnez e Ifriqiya",
      description:
        "Abu Zakariya Yahya proclama la independencia háfsida en 1228. Túnez se convierte en la capital radiante del Magreb oriental, acogiendo a los refugiados andalusíes y viendo nacer a Ibn Jaldún (1332).",
      treatiesAndBorders:
        "El sultanato se extiende de Constantina a Trípoli y firma tratados comerciales con Venecia, Génova, Pisa, Florencia y Aragón.",
      divisionsTitle: "Outans y Provincias Háfsidas",
      tunisRole:
        "Edad de oro de Túnez: Kasbah real, primeras madrasas (Ech-Chammaïyya), Universidad Zitouna y barrios andalusíes.",
      lineagesSummary:
        "Registros notariales de los Adoul de la Kasbah, Sijills malikíes, Habous de la Zitouna y manuscritos de Ibn Jaldún.",
      customTags: ["1228 – 1574", "Capital: Túnez", "Sultanato Háfsida", "Abu Zakariya Yahya", "Ibn Jaldún"],
    },
    ottomane: {
      title: "Regencia Otomana de Túnez y Dinastía Muradí",
      displayPeriod: "1574 – 1705",
      capital: "Túnez",
      empire: "Imperio Otomano y Eyalet de Túnez",
      devletName: "Regencia Otomana de Túnez",
      tunisiaEntityName: "Eyalet de Túnez / Regencia Otomana",
      description:
        "En 1574, Sinan Bajá y Uluç Ali expulsan a los españoles. Túnez se convierte en un Eyalet otomano autónomo gobernado por Bajás, Deys y los Beys hereditarios Muradíes, acogiendo a 80.000 moriscos españoles en 1609.",
      treatiesAndBorders:
        "Estabilización de las fronteras frente a Argel y Trípoli y capitulaciones marítimas con Francia e Inglaterra.",
      divisionsTitle: "Caidatos Majzén y Fortalezas de Guarnición",
      tunisRole:
        "Sede de un Estado mediterráneo soberano: minaretes octogonales otomanos, gremios de chechias y fortaleza de La Goleta.",
      lineagesSummary:
        "Defters fiscales y militares otomanos (ANT Kasbah), Sijills de los tribunales hanafí y malikí y actas notariales moriscas de Testour.",
      customTags: ["1574 – 1705", "Capital: Túnez", "Regencia Otomana", "Youssef Dey y Murad Bey", "Moriscos 1609"],
    },
    husseinite: {
      title: "Beylicato Husseinita y los 60 Caidatos",
      displayPeriod: "1705 – 1881",
      capital: "Túnez / El Bardo",
      empire: "Reino Beylical de Túnez (Al-Mamlaka Al-Tunisiyya)",
      devletName: "Reino Beylical de Túnez",
      tunisiaEntityName: "Territorio Nacional de los 60 Caidatos y Padrones de la Majba",
      description:
        "Fundación de la dinastía Husseinita en 1705 por Hussein Ben Ali. Soberanía estatal moderna: 60 caidatos, abolición de la esclavitud (1846), Pacto Fundamental (1857), Constitución de 1861 y censo fiscal nominal de la Majba (1860).",
      treatiesAndBorders:
        "Delimitación fronteriza de 1840 y 1860 y recaudación semestral mediante la Mahalla del Norte y del Sur.",
      divisionsTitle: "Los 60 Caidatos Territoriales y Regiones de la Majba",
      tunisRole:
        "Corazón del Estado beylical moderno: Palacio del Bardo, Dar El-Bey, Colegio Sadiki (1875) y consulados europeos.",
      lineagesSummary:
        "Registros nominales completos de la Majba de 1860–1869 (ANT Kasbah Series 1 a 60) por caidato y fracción tribal.",
      customTags: ["1705 – 1881", "Capital: Túnez / Bardo", "Beylicato Husseinita", "Hussein Ben Ali y Kheireddine", "Majba 1860"],
    },
    protectorat: {
      title: "Protectorado Francés y Registro Civil Moderno",
      displayPeriod: "1881 – 1956",
      capital: "Túnez",
      empire: "Regencia de Túnez (Protectorado Francés)",
      devletName: "Regencia de Túnez (Protectorado)",
      tunisiaEntityName: "Controles Civiles y Territorios Militares del Sur",
      description:
        "Tratado del Bardo (1881) y Convención de La Marsa (1883). Delimitación internacional definitiva (Convención de Trípoli de 1910), instauración del registro civil municipal en 1886 y auge del Movimiento Nacional.",
      treatiesAndBorders:
        "Convención de Trípoli (1910) que traza la frontera sur desde Ras Jedir hasta Ghadamés.",
      divisionsTitle: "Controles Civiles y Territorios Militares",
      tunisRole:
        "Metrópolis dual que une la Medina histórica con la ciudad moderna y los archivos municipales.",
      lineagesSummary:
        "Registros de Estado Civil municipal y consular desde 1886, decretos de naturalización (1924–1927) y matrículas militares.",
      customTags: ["1881 – 1956", "Capital: Túnez", "Protectorado", "Moncef Bey y Bourguiba", "Estado Civil 1886"],
    },
    republique: {
      title: "República Tunecina Moderna y 24 Gobernaciones",
      displayPeriod: "1956 – Hoy",
      capital: "Túnez",
      empire: "República Tunecina (Al-Jumhuriyya Al-Tunisiyya)",
      devletName: "República Tunecina",
      tunisiaEntityName: "Territorio Nacional de las 24 Gobernaciones y Municipios",
      description:
        "Independencia el 20 de marzo de 1956, proclamación de la República el 25 de julio de 1957, Código del Estatuto Personal y organización territorial en 24 gobernaciones, 264 delegaciones y 350 municipios.",
      treatiesAndBorders:
        "Soberanía nacional íntegra y centralización en los Archivos Nacionales de Túnez.",
      divisionsTitle: "Las 24 Gobernaciones de la República",
      tunisRole:
        "Capital soberana, política, económica y cultural: Palacio de Cartago, Parlamento del Bardo, Kasbah y Archivos Nacionales.",
      lineagesSummary:
        "Registros de Estado Civil unificados de los 350 municipios tunecinos, Documento Nacional de Identidad (CIN) y Registro de la Propiedad.",
      customTags: ["1956 – Hoy", "Capital: Túnez", "República Tunecina", "24 Gobernaciones", "350 Municipios"],
    },
  },
  it: {
    punique: {
      title: "Antichità Punica e Cartagine",
      displayPeriod: "814 a.C. – 146 a.C.",
      capital: "Cartagine",
      empire: "Repubblica Metropolitana di Cartagine e Numidia",
      devletName: "Repubblica di Cartagine (Impero Marittimo Fenicio-Punico)",
      tunisiaEntityName: "Territorio Metropolitano di Cartagine e Fossa Regia",
      description:
        "Cartagine domina il commercio del Mediterraneo occidentale. Il territorio metropolitano cartaginese è separato dal Regno Numida di Massinissa dalla celebre Fossa Regia (tracciata nel 146 a.C.).",
      treatiesAndBorders:
        "La Fossa Regia collega Thabraca (Tabarka) a nord-ovest a Thaenae (Thyna, a sud di Sfax).",
      divisionsTitle: "Territori Metropolitani e Città Puniche",
      tunisRole:
        "Thunes (Tunisi): Città satellite libico-punica eretta sull'istmo strategico tra il lago di Tunisi e la laguna Sejoumi.",
      lineagesSummary:
        "Registri epigrafici semitici fenicio-punici e stele bilingui libico-berbere di Dougga e Cartagine.",
      customTags: ["814 a.C. – 146 a.C.", "Capitale: Cartagine", "Repubblica di Cartagine", "Annibale Barca", "Barcidi"],
    },
    romaine: {
      title: "Africa Proconsolare e Impero Romano",
      displayPeriod: "146 a.C. – 439 d.C.",
      capital: "Hadrumetum / Carthago",
      empire: "Provincia Africa Proconsularis e Byzacena",
      devletName: "Imperium Romanum (Impero Romano)",
      tunisiaEntityName: "Province d'Africa Proconsolare, Bizacena e Tripolitania",
      description:
        "La Tunisia diventa il «granaio di Roma». Rete di 200 città municipali (El Jem, Dougga, Bulla Regia, Sbeitla) collegate dal Limes sahariano e dall'acquedotto di Zaghouan.",
      treatiesAndBorders:
        "Frontiera meridionale protetta dal Limes Tripolitanus tra Gafsa/Capsa e Remada.",
      divisionsTitle: "Province e Curiae Municipali Romane",
      tunisRole:
        "Tunes: Fiorente municipio romano collegato a Julia Carthago e snodo viario imperiale.",
      lineagesSummary:
        "Formula tripartita romana Tria Nomina incisa su oltre 30.000 iscrizioni del Corpus Inscriptionum Latinarum (CIL VIII).",
      customTags: ["146 a.C. – 439 d.C.", "Capitale: Carthago", "Impero Romano", "Settimio Severo", "CIL VIII"],
    },
    vandale_byzantine: {
      title: "Epoca Vandala e Restaurazione Bizantina",
      displayPeriod: "439 – 647 / 698",
      capital: "Cartagine",
      empire: "Regno Vandalo ed Esarcato d'Africa (Bisanzio)",
      devletName: "Impero Bizantino / Exarchatus Africae",
      tunisiaEntityName: "Esarcato di Cartagine e Fortezze d'Africa",
      description:
        "Genserico fonda il regno vandalo nel 439. Nel 533 Belisario riconquista Cartagine per l'imperatore Giustiniano costruendo una potente rete di fortezze bizantine (Haidra, Kelibia, Sbeitla).",
      treatiesAndBorders:
        "L'Esarcato di Cartagine si estende dalle coste tunisine alla Tripolitania e alla Sardegna.",
      divisionsTitle: "Ducati Militari ed Eparchie Bizantine",
      tunisRole:
        "Tunes: Roccaforte fortificata a guardia dell'accesso meridionale alla laguna di Cartagine.",
      lineagesSummary:
        "Carte patrimoniali dell'Esarcato di Cartagine e Tavolette Albertini (45 atti notarili su legno).",
      customTags: ["439 – 698", "Capitale: Cartagine", "Esarcato Bizantino", "Genserico e Belisario", "Tavolette Albertini"],
    },
    omeyyade: {
      title: "Califfato Omayyade e Alba dell'Islam",
      displayPeriod: "647 – 800",
      capital: "Kairouan",
      empire: "Califfato Omayyade di Damasco",
      devletName: "Al-Khilafa Al-Umawiyya (Califfato Omayyade)",
      tunisiaEntityName: "Wilayat Ifriqiya",
      description:
        "Arrivo dell'Islam nel Maghreb: vittoria di Sufetula nel 647, fondazione di Kairouan nel 670 da parte di Uqba Ibn Nafi e fondazione della Moschea Zitouna di Tunisi nel 698 da parte di Hassan Ibn al-Nu'man.",
      treatiesAndBorders:
        "La Wilayat Ifriqiya comprende il Maghreb orientale e funge da base per la conquista di Al-Andalus (711).",
      divisionsTitle: "Koura e Distretti della Wilayat d'Ifriqiya",
      tunisRole:
        "Fondazione storica della Tunisi islamica nel 698, del grande arsenale navale (Dar al-Sina'a) e della Moschea Zitouna.",
      lineagesSummary:
        "Registri del Diwan al-Jund di Kairouan che attestano i lignaggi arabi e le confederazioni berbere.",
      customTags: ["647 – 800", "Capitale: Kairouan", "Califfato Omayyade", "Uqba Ibn Nafi", "Fihridi"],
    },
    aghlabide: {
      title: "Emirato Aghlabide d'Ifriqiya",
      displayPeriod: "800 – 909",
      capital: "Kairouan / Raqqada",
      empire: "Emirato Sovrano dei Banu al-Aghlab",
      devletName: "Imarat Al-Aghaliba (Emirato Aghlabide)",
      tunisiaEntityName: "Ifriqiya Aghlabide e Conquista della Sicilia",
      description:
        "Ibrahim Ibn al-Aghlab fonda una dinastia sovrana nell'800. Età dell'oro scientifica e architettonica: Bacini degli Aghlabidi, conquista della Sicilia (827–831) e fondazione di Raqqada.",
      treatiesAndBorders:
        "L'emirato si estende da Costantina a Tripoli e controlla la Sicilia e Malta.",
      divisionsTitle: "Koura Aghlabidi d'Ifriqiya",
      tunisRole:
        "Tunisi s'impone come polo navale e universitario con la ricostruzione monumentale della Moschea Zitouna nell'864.",
      lineagesSummary:
        "Catene di trasmissione giuridica (Isnad) dei maestri malikiti di Kairouan e Tunisi sotto il Gran Qadi Sahnoun.",
      customTags: ["800 – 909", "Capitale: Kairouan", "Emirato Aghlabide", "Ibrahim Ibn al-Aghlab", "Imam Sahnoun"],
    },
    fatimide: {
      title: "Califfato Fatimide e Dinastia Ziride",
      displayPeriod: "909 – 1159",
      capital: "Mahdia / Al-Mansouria",
      empire: "Califfato Fatimide d'Ifriqiya ed Emirato Ziride",
      devletName: "Califfato Fatimide e Dinastia Ziride",
      tunisiaEntityName: "Ifriqiya Fatimide e Principato dei Banu Khurasan",
      description:
        "Proclamazione del Califfato Fatimide nel 909 e fondazione della capitale fortificata di Mahdia nel 916. Dopo la partenza per Il Cairo nel 969, governano gli Ziridi (Sabra Al-Mansouria) e i Banu Khurasan a Tunisi.",
      treatiesAndBorders:
        "Controllo del Maghreb orientale e trasformazione demografica con la migrazione hilaliana dal 1051.",
      divisionsTitle: "Amilati Fatimidi e Principati Ziridi",
      tunisRole:
        "Principato sovrano sotto la dinastia dei Banu Khurasan (1059–1159) con mura e il palazzo Dar El-Khurasani.",
      lineagesSummary:
        "Registri di cancelleria fatimide, documenti della Genizah del Cairo e genealogie Sanhadja e Banu Hilal.",
      customTags: ["909 – 1159", "Capitale: Mahdia", "Fatimidi e Ziridi", "Ubayd Allah al-Mahdi", "Banu Khurasan"],
    },
    almohade: {
      title: "Periodo Almohade del Grande Maghreb",
      displayPeriod: "1159 – 1228",
      capital: "Tunisi / Marrakech",
      empire: "Califfato Almohade (Al-Muwahhidun)",
      devletName: "Impero Almohade",
      tunisiaEntityName: "Provincia d'Ifriqiya sotto Governatorato Almohade",
      description:
        "Abd al-Mu'min unifica il Maghreb e Al-Andalus. Tunisi viene liberata dall'occupazione normanna nel 1159 e diventa la capitale amministrativa dell'Ifriqiya sotto i governatori almohadi.",
      treatiesAndBorders:
        "Impero esteso da Siviglia e Marrakech fino a Tripoli.",
      divisionsTitle: "Governatorati degli Sceicchi Almohadi",
      tunisRole:
        "Tunisi diventa ufficialmente la capitale dell'Ifriqiya con la fondazione della Kasbah di Tunisi.",
      lineagesSummary:
        "Registri imperiali almohadi, lignaggi Hintata e Masmouda e trattati diplomatici con Pisa e Genova.",
      customTags: ["1159 – 1228", "Capitale: Tunisi", "Impero Almohade", "Abd al-Mu'min", "Banu Hafs"],
    },
    hafside: {
      title: "Sultanato Hafside di Tunisi e Rifugiati Andalusi",
      displayPeriod: "1228 – 1574",
      capital: "Tunisi",
      empire: "Regno Hafside di Tunisi (Al-Dawla Al-Hafsiyya)",
      devletName: "Sultanato Hafside Sovrano",
      tunisiaEntityName: "Sultanato Hafside di Tunisi e Ifriqiya",
      description:
        "Abu Zakariya Yahya proclama l'indipendenza hafside nel 1228. Tunisi diventa la capitale splendente del Maghreb orientale, accogliendo i rifugiati andalusi e dando i natali a Ibn Khaldun (1332).",
      treatiesAndBorders:
        "Il sultanato si estende da Costantina a Tripoli e firma trattati commerciali con Venezia, Genova, Pisa, Firenze e Aragona.",
      divisionsTitle: "Outan e Province Hafsidi",
      tunisRole:
        "Età dell'oro di Tunisi: Kasbah reale, prime madrase (Ech-Chammaïyya), Università Zitouna e quartieri andalusi.",
      lineagesSummary:
        "Registri notarili degli Adoul della Kasbah, Sijill malikiti, Habous della Zitouna e manoscritti di Ibn Khaldun.",
      customTags: ["1228 – 1574", "Capitale: Tunisi", "Sultanato Hafside", "Abu Zakariya Yahya", "Ibn Khaldun"],
    },
    ottomane: {
      title: "Reggenza Ottomana di Tunisi e Dinastia Muradita",
      displayPeriod: "1574 – 1705",
      capital: "Tunisi",
      empire: "Impero Ottomano ed Eyalet di Tunisi",
      devletName: "Reggenza Ottomana di Tunisi",
      tunisiaEntityName: "Eyalet di Tunisi / Reggenza Ottomana",
      description:
        "Nel 1574 Sinan Pascià e Uluç Ali espellono gli spagnoli. Tunisi diventa un Eyalet ottomano autonomo governato da Pascià, Dey e Bey ereditari Muraditi, accogliendo 80.000 moriscos nel 1609.",
      treatiesAndBorders:
        "Stabilizzazione dei confini verso Algeri e Tripoli e capitolazioni marittime con Francia, Inghilterra e stati italiani.",
      divisionsTitle: "Caidati Makhzen e Fortezze di Guarnigione",
      tunisRole:
        "Sede di uno Stato mediterraneo sovrano: minareti ottagonali ottomani, corporazioni della chechia e fortezza de La Goulette.",
      lineagesSummary:
        "Defter fiscali e militari ottomani (ANT Kasbah), Sijill dei tribunali hanafita e malikita e atti notarili moriscos di Testour.",
      customTags: ["1574 – 1705", "Capitale: Tunisi", "Reggenza Ottomana", "Youssef Dey e Murad Bey", "Moriscos 1609"],
    },
    husseinite: {
      title: "Beylicato Husseinita e i 60 Caidati",
      displayPeriod: "1705 – 1881",
      capital: "Tunisi / Il Bardo",
      empire: "Regno Beylicale di Tunisi (Al-Mamlaka Al-Tunisiyya)",
      devletName: "Regno Beylicale di Tunisi",
      tunisiaEntityName: "Territorio Nazionale dei 60 Caidati e Ruoli della Majba",
      description:
        "Fondazione della dinastia Husseinita nel 1705 da parte di Hussein Ben Ali. Sovranità statale moderna: 60 caidati, abolizione della schiavitù (1846), Patto Fondamentale (1857), Costituzione del 1861 e censimento fiscale nominativo della Majba (1860).",
      treatiesAndBorders:
        "Delimitazione dei confini del 1840 e 1860 e riscossione semestrale tramite la Mahalla del Nord e del Sud.",
      divisionsTitle: "I 60 Caidati Territoriali e Regioni della Majba",
      tunisRole:
        "Cuore dello Stato beylicale moderno: Palazzo del Bardo, Dar El-Bey, Collegio Sadiki (1875) e consolati europei.",
      lineagesSummary:
        "Registri nominativi completi della Majba del 1860–1869 (ANT Kasbah Serie 1–60) per caidato e frazione tribale.",
      customTags: ["1705 – 1881", "Capitale: Tunisi / Bardo", "Beylicato Husseinita", "Hussein Ben Ali e Kheireddine", "Majba 1860"],
    },
    protectorat: {
      title: "Protettorato Francese e Stato Civile Moderno",
      displayPeriod: "1881 – 1956",
      capital: "Tunisi",
      empire: "Reggenza di Tunisi (Protettorato Francese)",
      devletName: "Reggenza di Tunisi (Protettorato)",
      tunisiaEntityName: "Controlli Civili e Territori Militari del Sud",
      description:
        "Trattato del Bardo (1881) e Convenzione de La Marsa (1883). Delimitazione internazionale definitiva (Convenzione di Tripoli del 1910), istituzione dello stato civile municipale nel 1886 e Movimento Nazionale.",
      treatiesAndBorders:
        "Convenzione di Tripoli (1910) che traccia il confine meridionale da Ras Jedir a Ghadames.",
      divisionsTitle: "Controlli Civili e Territori Militari",
      tunisRole:
        "Metropoli duale che unisce la Medina storica alla città moderna e agli archivi municipali.",
      lineagesSummary:
        "Registri di Stato Civile municipale e consolare dal 1886, decreti di naturalizzazione (1924–1927) e ruoli matricolari.",
      customTags: ["1881 – 1956", "Capitale: Tunisi", "Protettorato", "Moncef Bey e Bourguiba", "Stato Civile 1886"],
    },
    republique: {
      title: "Repubblica Tunisina Moderna e 24 Governatorati",
      displayPeriod: "1956 – Oggi",
      capital: "Tunisi",
      empire: "Repubblica Tunisina (Al-Jumhuriyya Al-Tunisiyya)",
      devletName: "Repubblica Tunisina",
      tunisiaEntityName: "Territorio Nazionale dei 24 Governatorati e Comuni",
      description:
        "Indipendenza il 20 marzo 1956, proclamazione della Repubblica il 25 luglio 1957, Codice dello Statuto Personale e organizzazione territoriale in 24 governatorati, 264 delegazioni e 350 comuni.",
      treatiesAndBorders:
        "Sovranità nazionale integrale e centralizzazione presso gli Archivi Nazionali di Tunisia.",
      divisionsTitle: "I 24 Governatorati della Repubblica",
      tunisRole:
        "Capitale sovrana, politica, economica e culturale: Palazzo di Cartagine, Parlamento del Bardo, Kasbah e Archivi Nazionali.",
      lineagesSummary:
        "Registri di Stato Civile unificati dei 350 comuni tunisini, Carta d'Identità Nazionale (CIN) e Libro Fondiario.",
      customTags: ["1956 – Oggi", "Capitale: Tunisi", "Repubblica Tunisina", "24 Governatorati", "350 Comuni"],
    },
  },
  mt: {
    punique: {
      title: "Antikità Punika u Kartaġni",
      displayPeriod: "814 QK – 146 QK",
      capital: "Kartaġni",
      empire: "Repubblika Metropolitana ta' Kartaġni u Numidja",
      devletName: "Repubblika ta' Kartaġni (Imperu Marittimu Feniċju-Puniku)",
      tunisiaEntityName: "Territorju Metropolitan ta' Kartaġni u Fossa Regia",
      description:
        "Kartaġni tiddomina l-kummerċ fil-Punent tal-Mediterran. It-territorju Kartaġiniż huwa separat mir-Renju Numidjan ta' Massinissa permezz tal-Fossa Regia (imfassla fl-146 QK).",
      treatiesAndBorders:
        "Il-Fossa Regia tgħaqqad Thabraca (Tabarka) ma' Thaenae (Thyna, fin-nofsinhar ta' Sfax).",
      divisionsTitle: "Territorji Metropolitani u Bliet Puniċi",
      tunisRole:
        "Thunes (Tuneż): Belt satellita Libiko-Punika mibnija fuq l-istmu strateġiku bejn il-lag ta' Tuneż u l-laguna Sejoumi.",
      lineagesSummary:
        "Reġistri epigrafiċi Semitiċi Feniċju-Puniċi u steli bilingwi Libiko-Berberi ta' Dougga u Kartaġni.",
      customTags: ["814 QK – 146 QK", "Kapitali: Kartaġni", "Repubblika ta' Kartaġni", "Annibale Barka", "Barċidi"],
    },
    romaine: {
      title: "Afrika Prokonsulari u Imperu Ruman",
      displayPeriod: "146 QK – 439 WK",
      capital: "Hadrumetum / Carthago",
      empire: "Provincia Africa Proconsularis u Byzacena",
      devletName: "Imperium Romanum (Imperu Ruman)",
      tunisiaEntityName: "Provinċji ta' Afrika Prokonsulari, Biżaċena u Tripolitanja",
      description:
        "It-Tuneżija ssir il-«maħżen tal-qamħ ta' Ruma». Netwerk ta' 200 belt muniċipali (El Jem, Dougga, Bulla Regia, Sbeitla) konnessi mil-Limes Saħarjan u l-akwedott ta' Zaghouan.",
      treatiesAndBorders:
        "Fruntiera tan-nofsinhar imħarsa mil-Limes Tripolitanus bejn Gafsa/Capsa u Remada.",
      divisionsTitle: "Provinċji u Curiae Muniċipali Rumani",
      tunisRole:
        "Tunes: Muniċipju Ruman importanti marbut ma' Julia Carthago u salib it-toroq imperjali.",
      lineagesSummary:
        "Formula tripartita Rumana Tria Nomina mnaqqxa fuq aktar minn 30,000 iskrizzjoni fil-Corpus Inscriptionum Latinarum (CIL VIII).",
      customTags: ["146 QK – 439 WK", "Kapitali: Carthago", "Imperu Ruman", "Settimju Severu", "CIL VIII"],
    },
    vandale_byzantine: {
      title: "Żmien il-Vandali u r-Restawrazzjoni Biżantina",
      displayPeriod: "439 – 647 / 698",
      capital: "Kartaġni",
      empire: "Renju Vandalu u Eżarkat tal-Afrika (Biżanzju)",
      devletName: "Imperu Biżantin / Exarchatus Africae",
      tunisiaEntityName: "Eżarkat ta' Kartaġni u Fortizzi tal-Afrika",
      description:
        "Ġenseriku jwaqqaf ir-renju Vandalu fl-439. Fil-533, Belisarju jirrikonkwista Kartaġni għall-Imperatur Ġustinjanu u jibni netwerk ta' fortizzi Biżantini (Haidra, Kelibia, Sbeitla).",
      treatiesAndBorders:
        "L-Eżarkat ta' Kartaġni jinfirex mill-kosti Tuneżini sat-Tripolitanja u Sqallija.",
      divisionsTitle: "Dukati Militari u Eparkiji Biżantini",
      tunisRole:
        "Tunes: Forti strateġiku li jħares id-dħul tan-nofsinhar għal-laguna ta' Kartaġni.",
      lineagesSummary:
        "Karti patrimonjali tal-Eżarkat ta' Kartaġni u t-Tavli Albertini (45 att nutarili fuq l-injam).",
      customTags: ["439 – 698", "Kapitali: Kartaġni", "Eżarkat Biżantin", "Ġenseriku u Belisarju", "Tavli Albertini"],
    },
    omeyyade: {
      title: "Kaliffat Umajjad u l-Bidu tal-Iżlam",
      displayPeriod: "647 – 800",
      capital: "Kairouan",
      empire: "Kaliffat Umajjad ta' Damasku",
      devletName: "Al-Khilafa Al-Umawiyya (Kaliffat Umajjad)",
      tunisiaEntityName: "Wilayat Ifriqiya",
      description:
        "Wasla tal-Iżlam fil-Maghreb: rebħa ta' Sufetula fl-647, twaqqif ta' Kairouan fl-670 minn Uqba Ibn Nafi u twaqqif tal-Moskea Zitouna ta' Tuneż fl-698 minn Hassan Ibn al-Nu'man.",
      treatiesAndBorders:
        "Il-Wilayat Ifriqiya tinkludi l-Lvant tal-Maghreb u sservi bħala bażi għall-konkwista ta' Al-Andalus (711).",
      divisionsTitle: "Kouras u Distretti tal-Wilayat Ifriqiya",
      tunisRole:
        "Twaqqif storiku ta' Tuneż Iżlamika fl-698, l-arsenal navali (Dar al-Sina'a) u l-Moskea Zitouna.",
      lineagesSummary:
        "Reġistri tad-Diwan al-Jund ta' Kairouan li jniżżlu l-linaġġi Għarab u l-konfederazzjonijiet Berberi.",
      customTags: ["647 – 800", "Kapitali: Kairouan", "Kaliffat Umajjad", "Uqba Ibn Nafi", "Fihridi"],
    },
    aghlabide: {
      title: "Emirat Aglabid ta' Ifriqiya",
      displayPeriod: "800 – 909",
      capital: "Kairouan / Raqqada",
      empire: "Emirat Sovran tal-Banu al-Aghlab",
      devletName: "Imarat Al-Aghaliba (Emirat Aglabid)",
      tunisiaEntityName: "Ifriqiya Aglabida u Konkwista ta' Sqallija u Malta",
      description:
        "Ibrahim Ibn al-Aghlab iwaqqaf dinastija sovrana fit-800. Żmien tad-deheb xjentifiku u arkitettoniku: il-Ġwiebi tal-Aglabidi, il-konkwista ta' Sqallija (827) u Malta (870), u t-twaqqif ta' Raqqada.",
      treatiesAndBorders:
        "L-emirat jinfirex minn Constantine sa Tripli u jikkontrolla Sqallija u Malta.",
      divisionsTitle: "Kouras Aglabidi ta' Ifriqiya",
      tunisRole:
        "Tuneż issir ċentru navali u universitarju ewlieni bir-rikostruzzjoni monumentali tal-Moskea Zitouna fit-864.",
      lineagesSummary:
        "Ktajjen ta' trażmissjoni ġuridika (Isnad) tal-imgħallmin Malikiti ta' Kairouan u Tuneż taħt il-Gran Qadi Sahnoun.",
      customTags: ["800 – 909", "Kapitali: Kairouan", "Emirat Aglabid", "Ibrahim Ibn al-Aghlab", "Imam Sahnoun"],
    },
    fatimide: {
      title: "Kaliffat Fatimid u Dinastija Żirida",
      displayPeriod: "909 – 1159",
      capital: "Mahdia / Al-Mansouria",
      empire: "Kaliffat Fatimid ta' Ifriqiya u Emirat Żirid",
      devletName: "Kaliffat Fatimid u Dinastija Żirida",
      tunisiaEntityName: "Ifriqiya Fatimida u Prinċipat tal-Banu Khurasan",
      description:
        "Proklamazzjoni tal-Kaliffat Fatimid fid-909 u twaqqif tal-kapitali ffortifikata ta' Mahdia fid-916. Wara t-tluq lejn il-Kajr fid-969, jiggvernaw iż-Żiridi (Sabra Al-Mansouria) u l-Banu Khurasan f'Tuneż.",
      treatiesAndBorders:
        "Kontroll tal-Lvant tal-Maghreb u bidla demografika bil-migrazzjoni Hilaljana mill-1051.",
      divisionsTitle: "Amilati Fatimidi u Prinċipati Żiridi",
      tunisRole:
        "Prinċipat sovran taħt id-dinastija tal-Banu Khurasan (1059–1159) bis-swar u l-palazz Dar El-Khurasani.",
      lineagesSummary:
        "Reġistri tal-kanċellerija Fatimida, dokumenti tal-Genizah tal-Kajr u ġenealoġiji Sanhadja u Banu Hilal.",
      customTags: ["909 – 1159", "Kapitali: Mahdia", "Fatimidi u Żiridi", "Ubayd Allah al-Mahdi", "Banu Khurasan"],
    },
    almohade: {
      title: "Perjodu Almohad tal-Maghreb il-Kbir",
      displayPeriod: "1159 – 1228",
      capital: "Tuneż / Marrakech",
      empire: "Kaliffat Almohad (Al-Muwahhidun)",
      devletName: "Imperu Almohad",
      tunisiaEntityName: "Provinċja ta' Ifriqiya taħt Gvern Almohad",
      description:
        "Abd al-Mu'min jgħaqqad il-Maghreb u Al-Andalus. Tuneż tinħeles mill-okkupazzjoni Normanna fl-1159 u ssir il-kapitali amministrattiva ta' Ifriqiya taħt gvernaturi Almohadi.",
      treatiesAndBorders:
        "Imperu mifrux minn Sivilja u Marrakech sa Tripli.",
      divisionsTitle: "Gvernatorati tax-Xejkijiet Almohadi",
      tunisRole:
        "Tuneż issir uffiċjalment il-kapitali ta' Ifriqiya bit-twaqqif tal-Kasbah ta' Tuneż.",
      lineagesSummary:
        "Reġistri imperjali Almohadi, linaġġi Hintata u Masmouda u trattati diplomatiċi ma' Pisa u Ġenova.",
      customTags: ["1159 – 1228", "Kapitali: Tuneż", "Imperu Almohad", "Abd al-Mu'min", "Banu Hafs"],
    },
    hafside: {
      title: "Sultanat Ħafsid ta' Tuneż u Rifuġjati Andalusjani",
      displayPeriod: "1228 – 1574",
      capital: "Tuneż",
      empire: "Renju Ħafsid ta' Tuneż (Al-Dawla Al-Hafsiyya)",
      devletName: "Sultanat Ħafsid Sovran",
      tunisiaEntityName: "Sultanat Ħafsid ta' Tuneż u Ifriqiya",
      description:
        "Abu Zakariya Yahya jipproklama l-indipendenza Ħafsida fl-1228. Tuneż issir il-kapitali brillanti tal-Lvant tal-Maghreb, tilqa' r-rifuġjati Andalusjani u tara t-twelid ta' Ibn Khaldun (1332).",
      treatiesAndBorders:
        "Is-sultanat jinfirex minn Constantine sa Tripli u jiffirma trattati kummerċjali ma' Venezja, Ġenova, Pisa, Firenze u Aragona.",
      divisionsTitle: "Outans u Provinċji Ħafsidi",
      tunisRole:
        "Żmien tad-deheb ta' Tuneż: il-Kasbah irjali, l-ewwel madrasi (Ech-Chammaïyya), l-Università Zitouna u l-kwartieri Andalusjani.",
      lineagesSummary:
        "Reġistri nutarili tal-Adoul tal-Kasbah, Sijills Malikiti, Habous taż-Zitouna u manuskritti ta' Ibn Khaldun.",
      customTags: ["1228 – 1574", "Kapitali: Tuneż", "Sultanat Ħafsid", "Abu Zakariya Yahya", "Ibn Khaldun"],
    },
    ottomane: {
      title: "Reġġenza Ottomana ta' Tuneż u Dinastija Muradita",
      displayPeriod: "1574 – 1705",
      capital: "Tuneż",
      empire: "Imperu Ottoman u Eyalet ta' Tuneż",
      devletName: "Reġġenza Ottomana ta' Tuneż",
      tunisiaEntityName: "Eyalet ta' Tuneż / Reġġenza Ottomana",
      description:
        "Fl-1574 Sinan Pasha u Uluç Ali jkeċċu lill-Ispanjoli. Tuneż issir Eyalet Ottoman awtonomu mmexxi minn Pashas, Deys u Beys ereditarji Muraditi, u tilqa' 80,000 Morisko Spanjol fl-1609.",
      treatiesAndBorders:
        "Stabbilizzazzjoni tal-fruntieri ma' Alġeri u Tripli u kapitulazzjonijiet marittimi ma' Franza u l-Ingilterra.",
      divisionsTitle: "Caidats Makhzen u Fortizzi tal-Gwarniġjon",
      tunisRole:
        "Sede ta' Stat Mediterranju sovran: minareti ottagonali Ottomani, korporazzjonijiet tax-xaxija u l-fortizza ta' La Goulette.",
      lineagesSummary:
        "Defters fiskali u militari Ottomani (ANT Kasbah), Sijills tal-qrati Ħanafiti u Malikiti u atti nutarili Moriski ta' Testour.",
      customTags: ["1574 – 1705", "Kapitali: Tuneż", "Reġġenza Ottomana", "Youssef Dey u Murad Bey", "Moriski 1609"],
    },
    husseinite: {
      title: "Bejlikat Ħussejnit u s-60 Caidat",
      displayPeriod: "1705 – 1881",
      capital: "Tuneż / Il-Bardo",
      empire: "Renju Bejlikali ta' Tuneż (Al-Mamlaka Al-Tunisiyya)",
      devletName: "Renju Bejlikali ta' Tuneż",
      tunisiaEntityName: "Territorju Nazzjonali tas-60 Caidat u Reġistri tal-Majba",
      description:
        "Twaqqif tad-dinastija Ħussejnita fl-1705 minn Hussein Ben Ali. Sovranità statali moderna: 60 caidat, abolizzjoni tal-iskjavitù (1846), Patt Fundamentali (1857), Kostituzzjoni tal-1861 u ċensiment fiskali nominattiv tal-Majba (1860).",
      treatiesAndBorders:
        "Delimitazzjoni tal-fruntieri tal-1840 u l-1860 u ġbir tat-taxxa permezz tal-Mahalla tat-Tramuntana u tan-Nofsinhar.",
      divisionsTitle: "Is-60 Caidat Territorjali u Reġjuni tal-Majba",
      tunisRole:
        "Qalb l-Istat Bejlikali modern: il-Palazz tal-Bardo, Dar El-Bey, il-Kulleġġ Sadiki (1875) u l-konsulati Ewropej (inkluż dak Brittaniku-Malti).",
      lineagesSummary:
        "Reġistri nominattivi kompluti tal-Majba tal-1860–1869 (ANT Kasbah Serje 1–60) u reġistri konsulari u parrokkjali tal-komunità Maltija f'Tuneż.",
      customTags: ["1705 – 1881", "Kapitali: Tuneż / Bardo", "Bejlikat Ħussejnit", "Hussein Ben Ali u Kheireddine", "Majba 1860"],
    },
    protectorat: {
      title: "Protettorat Franċiż u Stat Ċivili Modern",
      displayPeriod: "1881 – 1956",
      capital: "Tuneż",
      empire: "Reġġenza ta' Tuneż (Protettorat Franċiż)",
      devletName: "Reġġenza ta' Tuneż (Protettorat)",
      tunisiaEntityName: "Kontrolli Ċivili u Territorji Militari tan-Nofsinhar",
      description:
        "Trattat tal-Bardo (1881) u Konvenzjoni ta' La Marsa (1883). Delimitazzjoni internazzjonali definittiva (Konvenzjoni ta' Tripli tal-1910), twaqqif tal-istat ċivili muniċipali fl-1886 u l-Moviment Nazzjonali.",
      treatiesAndBorders:
        "Konvenzjoni ta' Tripli (1910) li tiffissa l-fruntiera tan-nofsinhar minn Ras Jedir sa Ghadames.",
      divisionsTitle: "Kontrolli Ċivili u Territorji Militari",
      tunisRole:
        "Metropoli doppja li tgħaqqad il-Medina storika mal-belt moderna u l-arkivji muniċipali.",
      lineagesSummary:
        "Reġistri tal-Istat Ċivili muniċipali u konsulari mill-1886, digrieti ta' naturalizzazzjoni (1924–1927) u reġistri parrokkjali ta' Santa Kruċ f'Tuneż.",
      customTags: ["1881 – 1956", "Kapitali: Tuneż", "Protettorat", "Moncef Bey u Bourguiba", "Stat Ċivili 1886"],
    },
    republique: {
      title: "Repubblika Tuneżina Moderna u 24 Governatorat",
      displayPeriod: "1956 – Illum",
      capital: "Tuneż",
      empire: "Repubblika Tuneżina (Al-Jumhuriyya Al-Tunisiyya)",
      devletName: "Repubblika Tuneżina",
      tunisiaEntityName: "Territorju Nazzjonali tal-24 Governatorat u Muniċipalitajiet",
      description:
        "Indipendenza fl-20 ta' Marzu 1956, proklamazzjoni tar-Repubblika fil-25 ta' Lulju 1957, Kodiċi tal-Istatut Personali u organizzazzjoni territorjali f'24 governatorat, 264 delegazzjoni u 350 muniċipalità.",
      treatiesAndBorders:
        "Sovranità nazzjonali sħiħa u ċentralizzazzjoni fl-Arkivji Nazzjonali tat-Tuneżija.",
      divisionsTitle: "L-24 Governatorat tar-Repubblika",
      tunisRole:
        "Kapitali sovrana, politika, ekonomika u kulturali: il-Palazz ta' Kartaġni, il-Parlament tal-Bardo, il-Kasbah u l-Arkivji Nazzjonali.",
      lineagesSummary:
        "Reġistri tal-Istat Ċivili unifikati tat-350 muniċipalità Tuneżina, Karta tal-Identità Nazzjonali (CIN) u Reġistru tal-Artijiet.",
      customTags: ["1956 – Illum", "Kapitali: Tuneż", "Repubblika Tuneżina", "24 Governatorat", "350 Muniċipalità"],
    },
  },
};

function getDefaultCategoryForEraId(id: string): string {
  const clean = id.toLowerCase();
  if (["punique", "romaine", "vandale", "byzantine", "vandale_byzantine"].includes(clean)) {
    return "antiquite";
  }
  if (
    [
      "conquete_arabe",
      "omeyyade",
      "aghlabide",
      "fatimide",
      "fatimide_ziride",
      "almohade",
      "hafside",
    ].includes(clean)
  ) {
    return "islam_medieval";
  }
  if (["ottomane", "husseinite"].includes(clean)) {
    return "ottoman_beylical";
  }
  return "contemporain";
}

const BUTTON_LABEL_BY_LOCALE: Record<string, string> = {
  fr: "DÉCOUVRIR LA PÉRIODE",
  en: "DISCOVER THE PERIOD",
  ar: "اكتشف الحقبة التاريخية",
  es: "DESCUBRIR EL PERÍODO",
  it: "SCOPRI L'EPOCA",
  mt: "SKOPRI L-EPOKA",
};

const BADGE_PREFIX_BY_LOCALE: Record<string, string> = {
  fr: "ÈRE",
  en: "ERA",
  ar: "حقبة",
  es: "ERA",
  it: "ERA",
  mt: "EPOKA",
};

export function buildDefaultPeriodCards(locale = "fr"): AdminPeriodCard[] {
  const cleanLoc = (locale || "fr").toLowerCase().split("-")[0];
  const btnLabel = BUTTON_LABEL_BY_LOCALE[cleanLoc] || BUTTON_LABEL_BY_LOCALE.fr;
  const prefix = BADGE_PREFIX_BY_LOCALE[cleanLoc] || BADGE_PREFIX_BY_LOCALE.fr;
  const localeMap = LOCALIZED_ERA_CONTENT[cleanLoc];

  return TUNISIAN_HISTORICAL_ERAS.map((era, idx) => {
    const trans = localeMap?.[era.id];
    const displayPeriod = trans?.displayPeriod || era.displayPeriod;
    const subArrays = localizeEraDetailsForLocale(era, cleanLoc);
    return {
      ...era,
      ...subArrays,
      title: trans?.title || (cleanLoc === "ar" && era.arabicTitle ? era.arabicTitle : era.title),
      displayPeriod,
      capital: trans?.capital || era.capital,
      empire: trans?.empire || era.empire,
      devletName: trans?.devletName || era.devletName,
      tunisiaEntityName: trans?.tunisiaEntityName || era.tunisiaEntityName,
      description: trans?.description || era.description,
      treatiesAndBorders: trans?.treatiesAndBorders || era.treatiesAndBorders,
      divisionsTitle: trans?.divisionsTitle || era.divisionsTitle,
      tunisRole: trans?.tunisRole || era.tunisRole,
      lineagesSummary: trans?.lineagesSummary || era.lineagesSummary,
      stepNumber: era.stepNumber || idx + 1,
      category: getDefaultCategoryForEraId(era.id),
      badge: `${prefix} #${String(era.stepNumber || idx + 1).padStart(2, "0")} • ${displayPeriod}`,
      isPublished: true,
      customTags: trans?.customTags || [],
      cardButtonLabel: btnLabel,
    };
  });
}

export const DEFAULT_PERIODS_CMS_CONFIG: PeriodsCmsConfig = {
  hero: {
    eyebrow: "Chronologie Historique Complète de la Tunisie",
    title: "Les Grandes Périodes de la Tunisie",
    subtitle:
      "De Carthage à la République moderne : découvrez chaque période historique, sa capitale, ses souverains et ses documents d'archives associés.",
    image: "",
    ctaPrimaryLabel: "Ouvrir la Carte Interactive",
    ctaPrimaryLink: "/interactive-map",
    ctaSecondaryLabel: "Explorer les Sources & Archives",
    ctaSecondaryLink: "/sources",
  },
  kpi: {
    title: "12 Époques Historiques Répertoriées",
    subtitle: "De 814 av. J.-C. à aujourd'hui · Tracés géographiques et archives documentées",
    rightText: "Progression chronologique continue",
    badge: "12 Périodes",
    cardButtonLabel: "DÉCOUVRIR LA PÉRIODE",
  },
  homeSection: {
    eyebrow: "CHRONOLOGIE HISTORIQUE (814 AV. J.-C. – AUJOURD'HUI)",
    title: "Périodes",
    subtitle:
      "Parcourez les 12 époques de l'histoire tunisienne : capitales, souverains, grandes lignées et fonds d'archives rattachés à chaque époque.",
    ctaLabel: "Explorer Toutes les Périodes",
  },
  categories: DEFAULT_PERIOD_CATEGORIES,
  periods: buildDefaultPeriodCards("fr"),
};

export function getDefaultPeriodsCmsConfig(locale = "fr"): PeriodsCmsConfig {
  const clean = (locale || "fr").toLowerCase();
  const categories = LOCALIZED_CATEGORIES[clean] || DEFAULT_PERIOD_CATEGORIES;
  const periods = buildDefaultPeriodCards(clean);

  if (clean === "en") {
    return {
      hero: {
        eyebrow: "Complete Historical Timeline of Tunisia",
        title: "The Historical Periods of Tunisia",
        subtitle:
          "From Punic Carthage to the modern Republic: explore each historical era, its capital, rulers, and linked archival records.",
        image: "",
        ctaPrimaryLabel: "Open Interactive Map",
        ctaPrimaryLink: "/interactive-map",
        ctaSecondaryLabel: "Explore Sources & Archives",
        ctaSecondaryLink: "/sources",
      },
      kpi: {
        title: "12 Canonical Historical Eras",
        subtitle: "From 814 BC to Present · Geographical boundaries and documented archives",
        rightText: "Continuous chronological progression",
        badge: "12 Periods",
        cardButtonLabel: "DISCOVER THE PERIOD",
      },
      homeSection: {
        eyebrow: "HISTORICAL TIMELINE (814 BC – PRESENT)",
        title: "Historical Periods",
        subtitle:
          "Explore the 12 eras of Tunisian history: capitals, rulers, notable lineages, and archival holdings linked to each period.",
        ctaLabel: "Explore All Periods",
      },
      categories,
      periods,
    };
  }

  if (clean === "ar") {
    return {
      hero: {
        eyebrow: "التسلسل الزمني الكامل لتاريخ تونس",
        title: "الحقب التاريخية الكبرى للبلاد التونسية",
        subtitle:
          "من قرطاج البونية إلى الجمهورية الحديثة: اكتشف كل حقبة تاريخية وعاصمتها وحكامها والوثائق الأرشيفية المرتبطة بها.",
        image: "",
        ctaPrimaryLabel: "فتح الخريطة التفاعلية",
        ctaPrimaryLink: "/interactive-map",
        ctaSecondaryLabel: "تصفح المصادر والأرشيفات",
        ctaSecondaryLink: "/sources",
      },
      kpi: {
        title: "12 حقبة تاريخية موثقة",
        subtitle: "من 814 ق.م إلى اليوم · الحدود التاريخية والأرصدة الأرشيفية الموثقة",
        rightText: "تسلسل زمني متصل",
        badge: "12 حقبة تاريخية",
        cardButtonLabel: "اكتشف الحقبة التاريخية",
      },
      homeSection: {
        eyebrow: "التسلسل التاريخي (814 ق.م – اليوم)",
        title: "الحقب التاريخية",
        subtitle:
          "استكشف الحقب التاريخية الـ 12 لتونس: العواصم، الحكام، الأسر البارزة، والأرصدة الأرشيفية المرتبطة بكل عصر.",
        ctaLabel: "تصفح جميع الحقب",
      },
      categories,
      periods,
    };
  }

  if (clean === "es") {
    return {
      hero: {
        eyebrow: "Cronología Histórica Completa de Túnez",
        title: "Los Grandes Períodos de Túnez",
        subtitle:
          "De Cartago a la República moderna: descubra cada período histórico, su capital, sus gobernantes y sus archivos asociados.",
        image: "",
        ctaPrimaryLabel: "Abrir Mapa Interactivo",
        ctaPrimaryLink: "/interactive-map",
        ctaSecondaryLabel: "Explorar Fuentes y Archivos",
        ctaSecondaryLink: "/sources",
      },
      kpi: {
        title: "12 Épocas Históricas Registradas",
        subtitle: "De 814 a.C. a hoy · Límites geográficos y archivos documentados",
        rightText: "Progresión cronológica continua",
        badge: "12 Períodos",
        cardButtonLabel: "DESCUBRIR EL PERÍODO",
      },
      homeSection: {
        eyebrow: "CRONOLOGÍA HISTÓRICA (814 A.C. – HOY)",
        title: "Períodos",
        subtitle: "Recorra las 12 épocas de la historia tunecina: capitales, soberanos, linajes y archivos.",
        ctaLabel: "Explorar Todos los Períodos",
      },
      categories,
      periods,
    };
  }

  if (clean === "it") {
    return {
      hero: {
        eyebrow: "Cronologia Storica Completa della Tunisia",
        title: "Le Grandi Epoche della Tunisia",
        subtitle:
          "Da Cartagine alla Repubblica moderna: scopri ogni epoca storica, la sua capitale, i sovrani e i documenti d'archivio associati.",
        image: "",
        ctaPrimaryLabel: "Apri Mappa Interattiva",
        ctaPrimaryLink: "/interactive-map",
        ctaSecondaryLabel: "Esplora Fonti e Archivi",
        ctaSecondaryLink: "/sources",
      },
      kpi: {
        title: "12 Epoche Storiche Censite",
        subtitle: "Dall'814 a.C. a oggi · Confini geografici e archivi documentati",
        rightText: "Progressione cronologica continua",
        badge: "12 Epoche",
        cardButtonLabel: "SCOPRI L'EPOCA",
      },
      homeSection: {
        eyebrow: "CRONOLOGIA STORICA (814 A.C. – OGGI)",
        title: "Epoche",
        subtitle: "Esplora le 12 epoche della storia tunisina: capitali, sovrani, lignaggi e archivi.",
        ctaLabel: "Esplora Tutte le Epoche",
      },
      categories,
      periods,
    };
  }

  if (clean === "mt") {
    return {
      hero: {
        eyebrow: "Kronoloġija Storika Kompluta tat-Tuneżija",
        title: "Il-Perjodi Storiċi tat-Tuneżija",
        subtitle:
          "Minn Kartaġni sar-Repubblika moderna: skopri kull epoka storika, il-kapitali tagħha, il-mexxejja u d-dokumenti arkivistiċi.",
        image: "",
        ctaPrimaryLabel: "Iftaħ il-Mappa Interattiva",
        ctaPrimaryLink: "/interactive-map",
        ctaSecondaryLabel: "Esplora s-Sorsi u l-Arkivji",
        ctaSecondaryLink: "/sources",
      },
      kpi: {
        title: "12-il Epoka Storika Dokumentata",
        subtitle: "Mit-814 QK sal-lum · Fruntieri ġeografiċi u arkivji dokumentati",
        rightText: "Progressjoni kronoloġika kontinwa",
        badge: "12-il Epoka",
        cardButtonLabel: "SKOPRI L-EPOKA",
      },
      homeSection: {
        eyebrow: "KRONOLOĠIJA STORIKA (814 QK – ILLUM)",
        title: "Perjodi Storiċi",
        subtitle: "Esplora t-12-il epoka tal-istorja Tuneżina: bliet kapitali, mexxejja, linaġġi u arkivji.",
        ctaLabel: "Esplora l-Perjodi Kollha",
      },
      categories,
      periods,
    };
  }

  return DEFAULT_PERIODS_CMS_CONFIG;
}

export function normalizePeriodsCmsConfig(raw: any, locale = "fr"): PeriodsCmsConfig {
  const cleanLoc = (locale || "fr").toLowerCase();
  const base = getDefaultPeriodsCmsConfig(cleanLoc);
  const frBase = DEFAULT_PERIODS_CMS_CONFIG;

  if (!raw || typeof raw !== "object") {
    return base;
  }

  const source =
    raw.locales && typeof raw.locales === "object" && raw.locales[cleanLoc]
      ? raw.locales[cleanLoc]
      : cleanLoc === "fr" && (raw.periods || raw.hero || raw.kpi)
      ? raw
      : null;

  if (!source || typeof source !== "object") {
    return base;
  }

  const defaultCards = buildDefaultPeriodCards(cleanLoc);
  const defaultMap = new Map(defaultCards.map((c) => [c.id, c]));
  const frMap = new Map(frBase.periods.map((c) => [c.id, c]));

  const pickLocalizedField = (
    itemVal: any,
    frDefaultVal: any,
    locDefaultVal: string
  ): string => {
    const str = String(itemVal ?? "").trim();
    if (!str) return locDefaultVal;
    if (cleanLoc !== "fr" && str === String(frDefaultVal ?? "").trim()) {
      return locDefaultVal;
    }
    return str;
  };

  let periods: AdminPeriodCard[] = defaultCards;
  if (Array.isArray(source.periods) && source.periods.length > 0) {
    periods = source.periods.map((item: any, idx: number) => {
      const fallback = defaultMap.get(item.id) || defaultCards[0];
      const frFallback = frMap.get(item.id) || frBase.periods[0];
      const customTags =
        Array.isArray(item.customTags) && item.customTags.length > 0
          ? item.customTags
          : fallback?.customTags || [];

      return {
        ...fallback,
        ...item,
        id: String(item.id || `periode_${idx + 1}`),
        stepNumber: Number(item.stepNumber ?? fallback?.stepNumber ?? idx + 1),
        year: Number(item.year ?? fallback?.year ?? 1600),
        displayPeriod: pickLocalizedField(item.displayPeriod, frFallback?.displayPeriod, fallback?.displayPeriod || ""),
        title: pickLocalizedField(item.title, frFallback?.title, fallback?.title || ""),
        arabicTitle: String(item.arabicTitle ?? fallback?.arabicTitle ?? ""),
        empire: pickLocalizedField(item.empire, frFallback?.empire, fallback?.empire || ""),
        devletName: pickLocalizedField(item.devletName, frFallback?.devletName, fallback?.devletName || ""),
        tunisiaEntityName: pickLocalizedField(
          item.tunisiaEntityName,
          frFallback?.tunisiaEntityName,
          fallback?.tunisiaEntityName || ""
        ),
        capital: pickLocalizedField(item.capital, frFallback?.capital, fallback?.capital || "Tunis"),
        description: pickLocalizedField(item.description, frFallback?.description, fallback?.description || ""),
        treatiesAndBorders: pickLocalizedField(
          item.treatiesAndBorders,
          frFallback?.treatiesAndBorders,
          fallback?.treatiesAndBorders || ""
        ),
        divisionsTitle: pickLocalizedField(
          item.divisionsTitle,
          frFallback?.divisionsTitle,
          fallback?.divisionsTitle || ""
        ),
        tunisRole: pickLocalizedField(item.tunisRole, frFallback?.tunisRole, fallback?.tunisRole || ""),
        lineagesSummary: pickLocalizedField(
          item.lineagesSummary,
          frFallback?.lineagesSummary,
          fallback?.lineagesSummary || ""
        ),
        namingStructure: String(item.namingStructure ?? fallback?.namingStructure ?? ""),
        survivalRating: String(item.survivalRating ?? fallback?.survivalRating ?? ""),
        keyRepositories: String(item.keyRepositories ?? fallback?.keyRepositories ?? ""),
        category: String(getDefaultCategoryForEraId(item.id || "") || item.category),
        badge: pickLocalizedField(item.badge, frFallback?.badge, fallback?.badge || ""),
        cardButtonLabel: pickLocalizedField(
          item.cardButtonLabel,
          frFallback?.cardButtonLabel,
          fallback?.cardButtonLabel || base.kpi.cardButtonLabel
        ),
        isPublished: item.isPublished !== false,
        customTags,
        eraTribes: fallback?.eraTribes || item.eraTribes || [],
        archivalSources:
          cleanLoc !== "fr"
            ? fallback?.archivalSources || []
            : Array.isArray(item.archivalSources)
            ? item.archivalSources
            : fallback?.archivalSources || [],
        notableLeaders:
          cleanLoc !== "fr"
            ? fallback?.notableLeaders || []
            : Array.isArray(item.notableLeaders)
            ? (item.notableLeaders as HistoricalEraLeader[])
            : fallback?.notableLeaders || [],
        notableFamilies:
          cleanLoc !== "fr"
            ? fallback?.notableFamilies || []
            : Array.isArray(item.notableFamilies)
            ? (item.notableFamilies as HistoricalEraFamily[])
            : fallback?.notableFamilies || [],
        administrativeDivisions:
          cleanLoc !== "fr"
            ? fallback?.administrativeDivisions || []
            : Array.isArray(item.administrativeDivisions)
            ? (item.administrativeDivisions as EraAdministrativeDivision[])
            : fallback?.administrativeDivisions || [],
        keySites:
          cleanLoc !== "fr"
            ? fallback?.keySites || []
            : Array.isArray(item.keySites)
            ? (item.keySites as HistoricalEraSite[])
            : fallback?.keySites || [],
      };
    });
  }

  const normalizedCategories: PeriodCategoryItem[] =
    Array.isArray(source.categories) && source.categories.length > 0
      ? source.categories.map((cat: PeriodCategoryItem, i: number) => {
          const locCat = base.categories.find((c) => c.key === cat.key) || base.categories[i];
          const frCat = frBase.categories.find((c) => c.key === cat.key) || frBase.categories[i];
          if (!locCat) return cat;
          return {
            ...cat,
            label: pickLocalizedField(cat.label, frCat?.label, locCat.label),
            description: pickLocalizedField(cat.description, frCat?.description, locCat.description),
          };
        })
      : base.categories;

  return {
    hero: {
      ...base.hero,
      ...(source.hero || {}),
      eyebrow: pickLocalizedField(source.hero?.eyebrow, frBase.hero.eyebrow, base.hero.eyebrow),
      title: pickLocalizedField(source.hero?.title, frBase.hero.title, base.hero.title),
      subtitle: pickLocalizedField(source.hero?.subtitle, frBase.hero.subtitle, base.hero.subtitle),
      ctaPrimaryLabel: pickLocalizedField(
        source.hero?.ctaPrimaryLabel,
        frBase.hero.ctaPrimaryLabel,
        base.hero.ctaPrimaryLabel
      ),
      ctaSecondaryLabel: pickLocalizedField(
        source.hero?.ctaSecondaryLabel,
        frBase.hero.ctaSecondaryLabel,
        base.hero.ctaSecondaryLabel
      ),
    },
    kpi: {
      ...base.kpi,
      ...(source.kpi || {}),
      title: pickLocalizedField(source.kpi?.title, frBase.kpi.title, base.kpi.title),
      subtitle: pickLocalizedField(source.kpi?.subtitle, frBase.kpi.subtitle, base.kpi.subtitle),
      rightText: pickLocalizedField(source.kpi?.rightText, frBase.kpi.rightText, base.kpi.rightText),
      badge: pickLocalizedField(source.kpi?.badge, frBase.kpi.badge, base.kpi.badge),
      cardButtonLabel: pickLocalizedField(
        source.kpi?.cardButtonLabel,
        frBase.kpi.cardButtonLabel,
        base.kpi.cardButtonLabel
      ),
    },
    homeSection: {
      ...base.homeSection,
      ...(source.homeSection || {}),
      eyebrow: pickLocalizedField(source.homeSection?.eyebrow, frBase.homeSection.eyebrow, base.homeSection.eyebrow),
      title: pickLocalizedField(source.homeSection?.title, frBase.homeSection.title, base.homeSection.title),
      subtitle: pickLocalizedField(
        source.homeSection?.subtitle,
        frBase.homeSection.subtitle,
        base.homeSection.subtitle
      ),
      ctaLabel: pickLocalizedField(
        source.homeSection?.ctaLabel,
        frBase.homeSection.ctaLabel,
        base.homeSection.ctaLabel
      ),
    },
    categories: normalizedCategories,
    periods,
  };
}

function loadAllPeriodsLocalesBundle(): Record<string, PeriodsCmsConfig> {
  const out: Record<string, PeriodsCmsConfig> = {};
  for (const loc of PERIODS_CMS_LOCALES) {
    out[loc.code] = getDefaultPeriodsCmsConfig(loc.code);
  }
  try {
    const rawMulti = localStorage.getItem(PERIODS_CMS_LOCALES_KEY);
    if (rawMulti) {
      const parsed = JSON.parse(rawMulti);
      const map = parsed?.locales && typeof parsed.locales === "object" ? parsed.locales : parsed;
      if (map && typeof map === "object") {
        for (const loc of PERIODS_CMS_LOCALES) {
          if (map[loc.code]) {
            out[loc.code] = normalizePeriodsCmsConfig({ locales: map }, loc.code);
          }
        }
        return out;
      }
    }
    const rawLegacy = localStorage.getItem(PERIODS_CMS_STORAGE_KEY);
    if (rawLegacy) {
      const parsedLegacy = JSON.parse(rawLegacy);
      if (parsedLegacy?.locales) {
        for (const loc of PERIODS_CMS_LOCALES) {
          if (parsedLegacy.locales[loc.code]) {
            out[loc.code] = normalizePeriodsCmsConfig({ locales: parsedLegacy.locales }, loc.code);
          }
        }
      } else {
        out.fr = normalizePeriodsCmsConfig(parsedLegacy, "fr");
      }
    }
  } catch {}
  return out;
}

export function loadLocalPeriodsCmsConfig(locale = "fr"): PeriodsCmsConfig {
  const clean = (locale || "fr").toLowerCase();
  const bundle = loadAllPeriodsLocalesBundle();
  return bundle[clean] || getDefaultPeriodsCmsConfig(clean);
}

export async function savePeriodsCmsConfig(
  config: PeriodsCmsConfig,
  locale = "fr"
): Promise<PeriodsCmsConfig> {
  const clean = (locale || "fr").toLowerCase();
  const normalized = normalizePeriodsCmsConfig({ locales: { [clean]: config } }, clean);
  const bundle = loadAllPeriodsLocalesBundle();
  bundle[clean] = normalized;

  const payload = {
    ...bundle.fr,
    locales: bundle,
  };

  try {
    localStorage.setItem(PERIODS_CMS_LOCALES_KEY, JSON.stringify(payload));
    localStorage.setItem(PERIODS_CMS_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(
      new CustomEvent("roots_periods_cms_updated", {
        detail: { locale: clean, config: normalized, locales: bundle },
      })
    );
  } catch {}

  try {
    await api.put("/admin/periods/config", payload);
  } catch (err) {
    console.warn("Saved periods config locally; server sync error:", err);
  }
  return normalized;
}

export function usePeriodsCmsConfig(overrideLocale?: string) {
  const { locale: contextLocale } = useTranslation();
  const activeLocale = (overrideLocale || contextLocale || "fr").toLowerCase();

  const [config, setConfig] = useState<PeriodsCmsConfig>(() =>
    loadLocalPeriodsCmsConfig(activeLocale)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setConfig(loadLocalPeriodsCmsConfig(activeLocale));
  }, [activeLocale]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/periods/config");
      const data = res.data?.data ?? res.data;
      if (
        data &&
        typeof data === "object" &&
        (data.periods || data.hero || data.kpi || data.locales)
      ) {
        const bundle = loadAllPeriodsLocalesBundle();
        if (data.locales && typeof data.locales === "object") {
          for (const loc of PERIODS_CMS_LOCALES) {
            if (data.locales[loc.code]) {
              bundle[loc.code] = normalizePeriodsCmsConfig({ locales: data.locales }, loc.code);
            }
          }
        } else {
          bundle.fr = normalizePeriodsCmsConfig(data, "fr");
        }
        const payload = { ...bundle.fr, locales: bundle };
        try {
          localStorage.setItem(PERIODS_CMS_LOCALES_KEY, JSON.stringify(payload));
          localStorage.setItem(PERIODS_CMS_STORAGE_KEY, JSON.stringify(payload));
        } catch {}
        setConfig(bundle[activeLocale] || getDefaultPeriodsCmsConfig(activeLocale));
      }
    } catch {
      // Keep local/default config
    } finally {
      setLoading(false);
    }
  }, [activeLocale]);

  useEffect(() => {
    refresh();

    const handleCustomUpdate = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.locales && detail.locales[activeLocale]) {
        setConfig(normalizePeriodsCmsConfig({ locales: detail.locales }, activeLocale));
      } else if (detail?.locale === activeLocale && detail?.config) {
        setConfig(normalizePeriodsCmsConfig({ locales: { [activeLocale]: detail.config } }, activeLocale));
      } else {
        setConfig(loadLocalPeriodsCmsConfig(activeLocale));
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (
        (e.key === PERIODS_CMS_STORAGE_KEY || e.key === PERIODS_CMS_LOCALES_KEY) &&
        e.newValue
      ) {
        setConfig(loadLocalPeriodsCmsConfig(activeLocale));
      }
    };

    window.addEventListener("roots_periods_cms_updated", handleCustomUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("roots_periods_cms_updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refresh, activeLocale]);

  const saveForActiveLocale = useCallback(
    (nextConfig: PeriodsCmsConfig) => savePeriodsCmsConfig(nextConfig, activeLocale),
    [activeLocale]
  );

  return {
    config,
    setConfig,
    loading,
    refresh,
    saveConfig: saveForActiveLocale,
    activeLocale,
  };
}

