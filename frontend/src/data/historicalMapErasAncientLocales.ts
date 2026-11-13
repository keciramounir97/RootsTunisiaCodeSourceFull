export interface DivisionLocaleTranslation {
  name: string;
  seat?: string;
  chefLieu?: string;
  description: string;
  historicalTribes?: string;
  archivalNotes?: string;
}

export interface LeaderLocaleTranslation {
  name: string;
  role: string;
  reignOrDates: string;
  achievements: string;
}

export interface FamilyLocaleTranslation {
  name: string;
  role: string;
  origin: string;
  lineageNotes: string;
}

export interface KeySiteLocaleTranslation {
  name: string;
  role: string;
}

export interface EraDetailsTranslation {
  divisions: Record<string, DivisionLocaleTranslation>;
  leaders: LeaderLocaleTranslation[];
  families: FamilyLocaleTranslation[];
  keySites: KeySiteLocaleTranslation[];
  archivalSources: string[];
}

export const HISTORICAL_ERAS_ANCIENT_LOCALES: Record<
  string,
  Record<string, EraDetailsTranslation>
> = {
  en: {
    punique: {
      divisions: {
        carthage_core: {
          name: "Carthage Metropolis",
          seat: "Carthage Byrsa",
          description: "Political heart, sanctuaries of Tanit, and naval arsenals.",
        },
        chora_capbon: {
          name: "Chora of Cap Bon",
          seat: "Kerkouane / Aspis (Kelibia)",
          description: "Great Punic agricultural estates and coastal fisheries.",
        },
        medjerda_valley: {
          name: "Valley of the Bagrada",
          seat: "Utica",
          description: "Metropolitan grain basket stretching from Utica to Sicca.",
        },
        byzacena_punic: {
          name: "Coastal Region of Hadrumetum",
          seat: "Hadrumetum (Sousse)",
          description: "Punic trading posts and merchant ports of the Sahel.",
        },
        numidia_massyles: {
          name: "Kingdom of the Massyli",
          seat: "Thugga (Dougga) / Cirta",
          description: "Territory of Numidian kings allied with Carthage and later united under Massinissa.",
        },
      },
      leaders: [
        {
          name: "Hannibal Barca",
          role: "Commander-in-Chief & Suffete of Carthage",
          reignOrDates: "247 BC – 183 BC",
          achievements:
            "Universal military genius, victor at Cannae and Lake Trasimene, and democratic reformer of Carthage's constitution.",
        },
        {
          name: "Hamilcar Barca",
          role: "Strategist & Founder of Barcid Power",
          reignOrDates: "275 BC – 228 BC",
          achievements:
            "Commander-in-Chief of the First Punic War, pacifier of Ifriqiya, and conqueror of Hispania.",
        },
        {
          name: "Mago the Great",
          role: "Suffete & Founder of the Magonid Dynasty",
          reignOrDates: "550 BC – 530 BC",
          achievements:
            "Organizer of the citizen army and Carthage's maritime hegemony across the western Mediterranean.",
        },
        {
          name: "Massinissa",
          role: "First King of Unified Numidia",
          reignOrDates: "238 BC – 148 BC",
          achievements:
            "Unifier of the Massyli and Masaesyli Berber kingdoms and builder of the Numidian cities of Dougga and Cirta.",
        },
      ],
      families: [
        {
          name: "Barcid Dynasty",
          role: "Military aristocracy, suffetes, and generals",
          origin: "Carthage Metropolis (Byrsa Hill)",
          lineageNotes:
            "Lineage of Hamilcar, Hannibal, Hasdrubal, and Mago that governed Carthage and founded Cartagena.",
        },
        {
          name: "House of the Magonids",
          role: "Senators and leaders of the Punic oligarchy",
          origin: "Carthage",
          lineageNotes:
            "Dominant rulers within the Council of One Hundred and Four from the 6th to the 4th century BC.",
        },
        {
          name: "Massylian Royal Lineage",
          role: "Numidian kings bordering the Fossa Regia",
          origin: "Dougga (Thugga) / Cirta",
          lineageNotes:
            "Royal line of Gala, Massinissa, Micipsa, and Jugurtha ruling over the western high plains.",
        },
      ],
      keySites: [
        { name: "Carthage", role: "Punic imperial metropolitan capital" },
        {
          name: "Dougga (Thugga)",
          role: "Great Numido-Roman city (Libyco-Punic Mausoleum)",
        },
        { name: "Bulla Regia", role: "Residence of the Numidian kings" },
        { name: "Kerkouane", role: "Intact coastal Punic city of Cap Bon" },
      ],
      archivalSources: [
        "Neo-Punic inscriptions and votive stelae of the Tophet of Salammbô",
        "Writings of Polybius, Livy, and Appian on the course of the Fossa Regia",
        "Mosaics and Libyco-Berber epigraphy from Bulla Regia and Dougga",
      ],
    },
    romaine: {
      divisions: {
        zeugitana: {
          name: "Africa Zeugitana (North)",
          seat: "Carthago Colonia",
          description: "Proconsular senatorial province of northern Tunisia.",
        },
        byzacena: {
          name: "Provincia Byzacena (Center)",
          seat: "Hadrumetum (Sousse)",
          description: "Prosperous olive-oil province centered on Hadrumetum and Thysdrus.",
        },
        tripolitana: {
          name: "Tripolitania (South)",
          seat: "Tacape (Gabès)",
          description: "Military zone of the Limes and Saharan borderlands.",
        },
        capsa_region: {
          name: "District of Capsa (Gafsa)",
          seat: "Capsa",
          description: "Forward post of the Limes facing nomadic Gaetulian tribes.",
        },
      },
      leaders: [
        {
          name: "Septimius Severus",
          role: "Roman Emperor from Africa",
          reignOrDates: "AD 193 – 211",
          achievements:
            "First Roman emperor of African origin; granted municipal or colonial status to numerous proconsular cities.",
        },
        {
          name: "Gordian I & Gordian II",
          role: "Proconsuls of Africa & Emperors",
          reignOrDates: "AD 238",
          achievements:
            "Proclaimed Roman emperors by the African senatorial youth in Thysdrus (Amphitheatre of El Jem).",
        },
        {
          name: "Scipio Aemilianus",
          role: "Consul of the Roman Republic",
          reignOrDates: "146 BC",
          achievements:
            "Conqueror of Byrsa and architect of the cadastral line of the Fossa Regia demarcating Roman Africa.",
        },
        {
          name: "Saint Cyprian",
          role: "Bishop and Doctor of Carthage",
          reignOrDates: "AD 200 – 258",
          achievements:
            "Father of the Church of Africa, martyred under Valerian, author of canonical epistles guiding Western Christendom.",
        },
      ],
      families: [
        {
          name: "African Senatorial Patriciate",
          role: "Owners of the great latifundia estates",
          origin: "Carthage, Utica, and Dougga",
          lineageNotes:
            "Prominent equestrian and senatorial families holding the fertile cereal plains of the Medjerda.",
        },
        {
          name: "Gens Caecilia of Thugga",
          role: "Benefactors and municipal duovirs",
          origin: "Thugga (Dougga)",
          lineageNotes:
            "Romano-Numidian elites who patronized the construction of the Capitol and Theatre of Dougga.",
        },
        {
          name: "Patricians of Hadrumetum & Thysdrus",
          role: "Exporters of Byzacena olive oil",
          origin: "Sousse (Hadrumetum) / El Jem",
          lineageNotes:
            "Patrons of the lavish mosaic residences displayed today at the Bardo and Sousse museums.",
        },
      ],
      keySites: [
        {
          name: "Hadrumetum (Sousse)",
          role: "Capital of the province of Byzacena",
        },
        {
          name: "Thysdrus (El Jem)",
          role: "Colossal amphitheatre and Roman olive-oil capital",
        },
        {
          name: "Sufetula (Sbeïtla)",
          role: "Capitol temples and seat of the Patrician Gregory",
        },
        {
          name: "Zaghouan (Ziqua)",
          role: "Water Temple and source of the Aqueduct of Carthage",
        },
      ],
      archivalSources: [
        "Corpus Inscriptionum Latinarum (CIL VIII) — 30,000 Latin inscriptions from Tunisia",
        "Tabula Peutingeriana and Antonine Itinerary",
        "Acts of the Councils of Carthage by Saint Cyprian and Saint Augustine",
      ],
    },
    vandale_byzantine: {
      divisions: {
        carthage_exarch: {
          name: "Seat of the Exarchate",
          seat: "Carthage",
          description: "Residence of the Imperial Exarch.",
        },
        byzacena_byz: {
          name: "Military Duchy of Byzacena",
          seat: "Sufetula (Sbeïtla)",
          description: "Fortified strongholds of Patrician Gregory.",
        },
        limes_tripoli: {
          name: "Duchy of Tripolitania",
          seat: "Tacape / Leptis",
          description: "Southeastern defensive frontier line.",
        },
      },
      leaders: [
        {
          name: "Gaiseric",
          role: "King of the Vandals and Alans",
          reignOrDates: "AD 428 – 477",
          achievements:
            "Captured Carthage in 439, founded the Vandal Kingdom of Africa, and dominated the western Mediterranean for 40 years.",
        },
        {
          name: "Justinian I the Great",
          role: "Byzantine Emperor",
          reignOrDates: "AD 527 – 565",
          achievements:
            "Launched the Reconquest of Africa in 533 and established the Praetorian Prefecture of Africa.",
        },
        {
          name: "Belisarius",
          role: "Commander-in-Chief of the East",
          reignOrDates: "AD 533 – 534",
          achievements:
            "Decisively defeated the Vandal army at Ad Decimum and Tricamarum, restoring Carthage to imperial authority.",
        },
        {
          name: "Gregory the Patrician",
          role: "Exarch of Africa",
          reignOrDates: "AD 641 – 647",
          achievements:
            "Proclaimed Africa's independence from Constantinople and moved his capital to Sufetula (Sbeïtla).",
        },
      ],
      families: [
        {
          name: "Hasdingi Dynasty",
          role: "Vandal royal house of Africa",
          origin: "Carthage and Radès",
          lineageNotes:
            "Royal Germanic Arian dynasty (Gaiseric, Huneric, Gunthamund, Thrasamund, Hilderic, Gelimer).",
        },
        {
          name: "Byzantine Patrician Aristocracy",
          role: "Military tribunes and praetorian prefects",
          origin: "Carthage, Kelibia, and Sufetula",
          lineageNotes:
            "Greek and Latin patricians administering the fortifications of the Byzantine limes.",
        },
        {
          name: "Autonomous Moorish Kings",
          role: "Tribal rulers of the interior",
          origin: "Tunisian Dorsal and Aurès",
          lineageNotes:
            "Berber dynasties of Antalas, Cabaon, and Iaudas who challenged and negotiated with Byzantine exarchs.",
        },
      ],
      keySites: [
        {
          name: "Carthage (Christian Basilicas)",
          role: "Capital of the Exarchate",
        },
        {
          name: "Sufetula (Sbeïtla)",
          role: "Decisive battle of 647 against the Muslim armies",
        },
        {
          name: "Kelibia (Fortress)",
          role: "Byzantine maritime stronghold",
        },
      ],
      archivalSources: [
        "Albertini Tablets (45 wooden notarial deeds discovered near Tébessa)",
        "Iohannis by Corippus (Byzantine epic on the Moorish wars in Tunisia)",
        "Procopius of Caesarea — History of the Vandal War",
      ],
    },
    omeyyade: {
      divisions: {
        koura_kairouan: {
          name: "Koura of Kairouan",
          seat: "Kairouan",
          description: "Center of governance of the Wilaya of Ifriqiya.",
        },
        koura_tunis: {
          name: "Koura of Tunis",
          seat: "Tunis",
          description: "Maritime arsenal and Great Mosque of Al-Zitouna.",
        },
        koura_sousse: {
          name: "Koura of Sousse",
          seat: "Sousse",
          description: "Ribat and naval departure port for the Mediterranean.",
        },
        koura_djerid: {
          name: "Koura of Jérid & Gafsa",
          seat: "Qastiliya (Tozeur)",
          description: "Strategic oases of southern Ifriqiya.",
        },
      },
      leaders: [
        {
          name: "Hassan Ibn al-Nu'man",
          role: "Governor & Builder of Tunis",
          reignOrDates: "AD 692 – 703",
          achievements:
            "Conquered Carthage, formally founded the Muslim city of Tunis, excavated its inner port, and built Al-Zitouna.",
        },
        {
          name: "Uqba Ibn Nafi al-Fihri",
          role: "Conqueror of Ifriqiya & Founder",
          reignOrDates: "AD 670 – 683",
          achievements:
            "Founded the holy city of Kairouan in 670 and its Great Mosque, anchoring Islamic civilization across the Maghreb.",
        },
        {
          name: "Musa Ibn Nusayr",
          role: "Governor General of the Maghreb",
          reignOrDates: "AD 705 – 714",
          achievements:
            "Completed the pacification of Ifriqiya, outfitted the Tunis fleet, and organized the expedition to Al-Andalus with Tariq Ibn Ziyad.",
        },
        {
          name: "Dihya (Al-Kahina)",
          role: "Queen of the Jerawa Berbers",
          reignOrDates: "AD 688 – 702",
          achievements:
            "Iconic figure of Amazigh sovereignty who united southern and Aurès tribes against the Umayyad armies.",
        },
      ],
      families: [
        {
          name: "House of the Fihrids",
          role: "Governors and generals of Ifriqiya",
          origin: "Kairouan and Medina of Tunis",
          lineageNotes:
            "Direct descendants of Uqba Ibn Nafi who led expeditions across Ifriqiya and Islamic Spain.",
        },
        {
          name: "Quraysh Nobility of Ifriqiya",
          role: "Qadis and garrison commanders",
          origin: "Kairouan and Tunis",
          lineageNotes:
            "Lineages of Banu Makhzum and Banu Zuhra established in the military camps of Ifriqiya.",
        },
        {
          name: "Awraba & Jerawa Chieftainships",
          role: "Confederated indigenous tribal leaders",
          origin: "High Steppes and Aurès",
          lineageNotes:
            "Prominent Berber houses of Kusayla and Dihya whose descendants later helped forge Maghrebi Islamic armies.",
        },
      ],
      keySites: [
        {
          name: "Kairouan (Great Mosque of Uqba)",
          role: "Capital of the Islamic Maghreb",
        },
        {
          name: "Tunis (Al-Zitouna Mosque)",
          role: "Foundation of the arsenal and Al-Zitouna University",
        },
        {
          name: "Ribat of Sousse",
          role: "Coastal sentinel guarding against Byzantine raids",
        },
      ],
      archivalSources: [
        "Chronicles of Futuh Ifriqiya and accounts by Ibn Abd al-Hakam",
        "Epigraphic foundation inscriptions of the Great Mosque of Kairouan (670)",
        "Early Kufic inscriptions of Al-Zitouna Mosque in Tunis (698)",
      ],
    },
    aghlabide: {
      divisions: {
        kairouan_raqqada: {
          name: "Capital Kairouan & Raqqada",
          seat: "Raqqada",
          description: "Seat of emiral palaces and great Maliki jurists (Sahnun).",
        },
        sahel_ribats: {
          name: "Region of the Sahel Ribats",
          seat: "Monastir / Sousse",
          description: "Spiritual ribats and Aghlabid maritime arsenals.",
        },
        sfax_ports: {
          name: "Koura of Sfax",
          seat: "Sfax",
          description: "Fortified ramparts and maritime exports.",
        },
        beja_cereales: {
          name: "Koura of Béja",
          seat: "Béja",
          description: "Cereal-producing heartland of the Tell.",
        },
      },
      leaders: [
        {
          name: "Ibrahim I Ibn al-Aghlab",
          role: "Founding Emir of the Dynasty",
          reignOrDates: "AD 800 – 812",
          achievements:
            "Founded the sovereign Emirate of Ifriqiya recognized by Abbasid Caliph Harun al-Rashid and built Al-Abbasiyya.",
        },
        {
          name: "Ziyadat Allah I",
          role: "Emir of Ifriqiya & Conqueror",
          reignOrDates: "AD 817 – 838",
          achievements:
            "Rebuilt the Great Mosque of Kairouan and Al-Zitouna of Tunis in splendor and ordered the conquest of Sicily (827).",
        },
        {
          name: "Imam Sahnun Ibn Saïd",
          role: "Grand Qadi of Kairouan & Supreme Jurist",
          reignOrDates: "AD 848 – 854",
          achievements:
            "Author of the renowned Mudawwana, foundational doctrinal code of the Maliki school across the Maghreb and Al-Andalus.",
        },
        {
          name: "Asad Ibn al-Furat",
          role: "Scholar, Magistrate & Army Commander",
          reignOrDates: "AD 759 – 828",
          achievements:
            "Disciple of Malik and Abu Hanifa; led the victorious naval landing in Sicily at Mazara del Vallo.",
        },
      ],
      families: [
        {
          name: "Dynasty of the Banu al-Aghlab",
          role: "Sovereign Emirs of Ifriqiya",
          origin: "Kairouan / Raqqada",
          lineageNotes:
            "Princely lineage originally from Khorasan ruling Tunisia and Sicily for over a century.",
        },
        {
          name: "House of the Tanukhis (Family of Sahnun)",
          role: "Jurisconsults and ulama of Ifriqiya",
          origin: "Kairouan and Tunis",
          lineageNotes:
            "Lineage of imams and qadis who codified Maliki jurisprudence and led scholarship at Al-Zitouna.",
        },
        {
          name: "Banu Qadim of Tunis",
          role: "Shipowners and governors of the city of Tunis",
          origin: "Medina of Tunis",
          lineageNotes:
            "Prominent Tunis patrician families administering the harbor, arsenal, and maritime trade with Italy.",
        },
      ],
      keySites: [
        {
          name: "Kairouan (Aghlabid Basins)",
          role: "Political capital and intellectual beacon",
        },
        {
          name: "Raqqada",
          role: "Palatial city of the Aghlabid sovereigns",
        },
        {
          name: "Ribat of Monastir",
          role: "Coastal spiritual and military fortress",
        },
      ],
      archivalSources: [
        "Manuscript of the Blue Quran of Kairouan and Maqsura parchments",
        "Chronicles of Ibn al-Athir and Al-Nuwayri",
        "Al-Mudawwana of Imam Sahnun (foundational Maliki legal code of Ifriqiya)",
      ],
    },
    fatimide: {
      divisions: {
        mahdia_core: {
          name: "Imperial Capital of Mahdia",
          seat: "Mahdia",
          description: "Fortified peninsula of Skifa Kahla and caliphal harbor.",
        },
        sabra_mansouria: {
          name: "Sabra Al-Mansuriya",
          seat: "Southern Kairouan",
          description: "Princely Zirid city at the gates of Kairouan.",
        },
        sfax_zirid: {
          name: "Principality of Sfax",
          seat: "Sfax",
          description: "Monumental ramparts and merchant fleet.",
        },
        gabes_oasis: {
          name: "Amilate of Gabès",
          seat: "Gabès",
          description: "Maritime and caravan crossroads.",
        },
      },
      leaders: [
        {
          name: "Ubayd Allah al-Mahdi",
          role: "First Fatimid Caliph",
          reignOrDates: "AD 909 – 934",
          achievements:
            "Founded the Fatimid Caliphate in Ifriqiya and built the impregnable maritime capital of Mahdia in 916.",
        },
        {
          name: "Al-Mu'izz li-Din Allah",
          role: "Caliph Conqueror of Egypt",
          reignOrDates: "AD 953 – 975",
          achievements:
            "Conquered Egypt in 969, founded Cairo and Al-Azhar Mosque, and entrusted governance of Ifriqiya to the Zirids.",
        },
        {
          name: "Bologhine Ibn Ziri",
          role: "Sovereign Emir of Ifriqiya",
          reignOrDates: "AD 972 – 984",
          achievements:
            "Founder of the prestigious Zirid dynasty ruling the central Maghreb and Ifriqiya from Al-Mansuriya.",
        },
        {
          name: "Al-Mu'izz Ibn Badis",
          role: "Zirid Emir Restorer of Sunnism",
          reignOrDates: "AD 1016 – 1062",
          achievements:
            "Dramatically broke with the Shiite Fatimid caliphate in 1048 to proclaim allegiance to the Sunni Abbasid caliph.",
        },
      ],
      families: [
        {
          name: "Zirid Sanhaja Dynasty",
          role: "Princes reigning in Mansuriya and Mahdia",
          origin: "Achir / Mahdia",
          lineageNotes:
            "Sanhaja Berber royal dynasty that governed Ifriqiya for nearly two centuries.",
        },
        {
          name: "Dynasty of the Banu Khurasan",
          role: "Independent princes of the city of Tunis",
          origin: "Medina of Tunis (Dar El-Khourassani)",
          lineageNotes:
            "Enlightened rulers of Tunis (1059–1159) who protected the city and expanded its maritime trade.",
        },
        {
          name: "Hilalian Chieftainships (Riyah & Zoghba)",
          role: "Bedouin warrior confederations",
          origin: "Kairouan plains and steppes",
          lineageNotes:
            "Bedouin Arab lineages that transformed linguistic Arabization and settlement across Tunisian plains.",
        },
      ],
      keySites: [
        {
          name: "Mahdia",
          role: "First Fatimid caliphal capital (916)",
        },
        {
          name: "Al-Mansuriya (Sabra)",
          role: "Zirid princely capital",
        },
        {
          name: "Sfax",
          role: "Zirid ramparts and major merchant port",
        },
      ],
      archivalSources: [
        "Monumental Kufic inscriptions of Skifa Kahla in Mahdia (916)",
        "Writings of Ibn Hammad and Ibn Hayyan on the Zirids of Sabra Al-Mansuriya",
        "Holdings of Fatimid decrees on the fisheries of Mahdia and Kerkennah",
      ],
    },
  },
  ar: {
    punique: {
      divisions: {
        carthage_core: {
          name: "قرطاج الحاضرة",
          seat: "قرطاج بيرصا",
          description: "القلب السياسي ومقدّسات تانيت والترسانات البحرية.",
        },
        chora_capbon: {
          name: "شبه جزيرة الرأس الطيب",
          seat: "كركوان / أسبس (قليبية)",
          description: "ضياع زراعية بونية كبرى ومصايد بحرية ساحلية.",
        },
        medjerda_valley: {
          name: "حوض مجردة (البغرادا)",
          seat: "أوتيكا",
          description: "مطمور القمح الحضري الممتد من أوتيكا إلى سيكا (الكاف).",
        },
        byzacena_punic: {
          name: "سواحل حضرموت",
          seat: "حضرموت (سوسة)",
          description: "المرافئ والمحطات التجارية البونية بالساحل.",
        },
        numidia_massyles: {
          name: "مملكة الماسيل",
          seat: "ثوغا (دقة) / سيرتا",
          description: "مجال الملوك النوميد حلفاء قرطاج ثم مملكة ماسينيسا الموحدة.",
        },
      },
      leaders: [
        {
          name: "حنبعل برقا",
          role: "القائد العام وشوفيط قرطاج",
          reignOrDates: "247 ق.م – 183 ق.م",
          achievements:
            "عبقرية عسكرية عالمية، منتصر معركتي كانّاي وبحيرة تراسيميني، ومصلح دستور قرطاج الديمقراطي.",
        },
        {
          name: "حملقار برقا",
          role: "الاستراتيجي ومؤسس سطوة آل برقا",
          reignOrDates: "275 ق.م – 228 ق.م",
          achievements:
            "القائد العام في الحرب البونية الأولى، وموحّد إفريقية وفاتح إسبانيا (إيبيريا).",
        },
        {
          name: "ماقون الأكبر",
          role: "شوفيط ومؤسس السلالة الماقونية",
          reignOrDates: "550 ق.م – 530 ق.م",
          achievements:
            "منظّم الجيش المدني القرطاجي ومهندس السيادة البحرية في غرب المتوسط.",
        },
        {
          name: "ماسينيسا",
          role: "أول ملوك نوميديا الموحدة",
          reignOrDates: "238 ق.م – 148 ق.م",
          achievements:
            "موحّد مملكتي الماسيل والماسيسيل الأمازيغيتين، وباني المدن النوميدية في دقة وسيرتا.",
        },
      ],
      families: [
        {
          name: "سلالة برقا",
          role: "الأرستقراطية العسكرية والشوفط والقادة",
          origin: "قرطاج الحاضرة (هضبة بيرصا)",
          lineageNotes:
            "سلالة حملقار وحنبعل وعزربعل وماقون التي قادت قرطاج وأسست قرطاجنة.",
        },
        {
          name: "بيت الماقونيين",
          role: "أعضاء مجلس الشيوخ وزعماء الأوليغارشية البونية",
          origin: "قرطاج",
          lineageNotes:
            "الحكام المهيمنون في مجلس المائة والأربعة من القرن السادس إلى الرابع قبل الميلاد.",
        },
        {
          name: "السلالة الملكية الماسيلية",
          role: "ملوك النوميد على تخوم الخندق الملكي (فوسا ريجيا)",
          origin: "دقة (ثوغا) / سيرتا",
          lineageNotes:
            "السلالة الملكية لغايا وماسينيسا ومكيبسا ويوغرطة الحاكمة بالسهول العليا الغربية.",
        },
      ],
      keySites: [
        { name: "قرطاج", role: "العاصمة الإمبراطورية الحضرية البونية" },
        { name: "دقة (ثوغا)", role: "حاضرة نوميدية رومانية كبرى (الضريح الليبي البوني)" },
        { name: "بولا ريجيا", role: "إقامة ملوك النوميد" },
        { name: "كركوان", role: "مدينة بونية ساحلية متكاملة بالوطن القبلي" },
      ],
      archivalSources: [
        "النقائش البونية الجديدة وأنصاب النذور بمعبد التوفيت بصلامبو",
        "نصوص بوليبيوس وتيتوس ليفيوس وأبيان حول مسار الخندق الملكي (فوسا ريجيا)",
        "الفسيفساء والكتابات الليبية-الأمازيغية في بولا ريجيا ودقة",
      ],
    },
    romaine: {
      divisions: {
        zeugitana: {
          name: "إفريقيا الشمالية زوغيتانا",
          seat: "قرطاج كولونيا",
          description: "ولاية قنصلية تابعة لمجلس الشيوخ بشمال تونس.",
        },
        byzacena: {
          name: "إقليم بيزاسينا (الوسط)",
          seat: "حضرموت (سوسة)",
          description: "ولاية زيتونية مزدهرة مركزها حضرموت وتيسدروس.",
        },
        tripolitana: {
          name: "إقليم طرابلس التونسي (الجنوب)",
          seat: "تاكابي (قابس)",
          description: "منطقة الليمس العسكرية وتخوم الصحراء.",
        },
        capsa_region: {
          name: "قضاء قفصة الروماني",
          seat: "كابسا (قفصة)",
          description: "موقع متقدم على خط الليمس في مواجهة قبائل الجيتول الرحّل.",
        },
      },
      leaders: [
        {
          name: "سبتيموس سيفيروس",
          role: "إمبراطور روما الإفريقي",
          reignOrDates: "193 – 211 م",
          achievements:
            "أول إمبراطور روماني من أصل إفريقي، منح صفة البلدية أو المستعمرة لعديد المدن البروقنصلية.",
        },
        {
          name: "غورديان الأول وغورديان الثاني",
          role: "بروقناصل إفريقيا وأباطرة",
          reignOrDates: "238 م",
          achievements:
            "نُودِي بهما إمبراطورين لروما من قبل شبيبة الأعيان الأفارقة في تيسدروس (قصر الجم).",
        },
        {
          name: "سكيبيو الإيميلي",
          role: "قنصل الجمهورية الرومانية",
          reignOrDates: "146 ق.م",
          achievements:
            "مدمّر بيرصا ومخطّط الخندق الملكي (فوسا ريجيا) الفاصل للمجال العقاري الروماني.",
        },
        {
          name: "القديس كبريانوس",
          role: "أسقف قرطاج ومعلمها",
          reignOrDates: "200 – 258 م",
          achievements:
            "أحد آباء كنيسة إفريقيا وشهيدها زمن فاليريان، وصاحب الرسائل الكنسية الموجّهة للمسيحية الغربية.",
        },
      ],
      families: [
        {
          name: "الأسر القنصلية الإفريقية",
          role: "ملاك الضيعات اللاتيفوندية الكبرى",
          origin: "قرطاج وأوتيكا ودقة",
          lineageNotes:
            "عائلات الفرسان والشيوخ الكبرى الحائزة على سهول القمح بسهل مجردة.",
        },
        {
          name: "آل سيسيليوس بدقة",
          role: "محسنون وقضاة بلديون (دووفير)",
          origin: "ثوغا (دقة)",
          lineageNotes:
            "نخب رومانية-نوميدية موّلت تشييد معبد الكابيتول ومسرح دقة.",
        },
        {
          name: "أعيان حضرموت وتيسدروس",
          role: "مصدّرو زيت زيتون بيزاسينا",
          origin: "سوسة (حضرموت) / الجم",
          lineageNotes:
            "مشيدو القصور الفاخرة المزينة بلوحات الفسيفساء المعروضة اليوم بمتحفي باردو وسوسة.",
        },
      ],
      keySites: [
        { name: "حضرموت (سوسة)", role: "عاصمة إقليم بيزاسينا" },
        { name: "تيسدروس (الجم)", role: "المدرج العملاق وعاصمة الزيت الرومانية" },
        { name: "سفيطلة (سبيطلة)", role: "معابد الكابيتول ومقر البطريق جرجير" },
        { name: "زغوان (زيكوا)", role: "معبد المياه ومنطلق حنايا قرطاج" },
      ],
      archivalSources: [
        "مدونة النقائش اللاتينية (CIL VIII) — 30 ألف نقيشة مكتشفة بتونس",
        "لوحة بويتينغر ودليل أنطونينوس",
        "أعمال مجامع قرطاج للقديس كبريانوس والقديس أوغسطينوس",
      ],
    },
    vandale_byzantine: {
      divisions: {
        carthage_exarch: {
          name: "حاضرة الإكسرخية بقرطاج",
          seat: "قرطاج",
          description: "مقر إقامة الإكسرخ الإمبراطوري.",
        },
        byzacena_byz: {
          name: "دوقية بيزاسينا العسكرية",
          seat: "سفيطلة (سبيطلة)",
          description: "قلاع وحصون البطريق جرجير.",
        },
        limes_tripoli: {
          name: "دوقية طرابلس",
          seat: "تاكابي / لبدة",
          description: "خط المراقبة والدفاع بالجنوب الشرقي.",
        },
      },
      leaders: [
        {
          name: "جنسريق",
          role: "ملك الوندال والألان",
          reignOrDates: "428 – 477 م",
          achievements:
            "استولى على قرطاج سنة 439 وأسس مملكة الوندال بإفريقيا وهيمن على غرب المتوسط أربعين عاماً.",
        },
        {
          name: "جستنيان الأول الكبير",
          role: "الإمبراطور البيزنطي",
          reignOrDates: "527 – 565 م",
          achievements:
            "أطلق حملة استرداد إفريقيا سنة 533 وأسس الولاية البريتورية لإفريقيا.",
        },
        {
          name: "بيليزاريوس",
          role: "القائد الأعلى لجيوش المشرق",
          reignOrDates: "533 – 534 م",
          achievements:
            "سحق الجيش الوندالي في معركتي آد ديكيموم وتريكاميرون، وأعاد قرطاج إلى التاج الإمبراطوري.",
        },
        {
          name: "جرجير البطريق (غريغوريوس)",
          role: "إكسرخ إفريقيا",
          reignOrDates: "641 – 647 م",
          achievements:
            "أعلن استقلال إفريقيا عن بيزنطة ونقل عاصمته إلى سفيطلة (سبيطلة).",
        },
      ],
      families: [
        {
          name: "الأسرة الهاسدنكية",
          role: "البيت الملكي الوندالي بإفريقيا",
          origin: "قرطاج ورادس",
          lineageNotes:
            "السلالة الجرمانية الآريوسية المالكة (جنسريق، هونريق، غونتاموند، تراساموند، هيلديريك، غيليمير).",
        },
        {
          name: "الأعيان البطارقة البيزنطيون",
          role: "قادة الفيالق وحكام الولايات",
          origin: "قرطاج وقليبية وسفيطلة",
          lineageNotes:
            "بطارقة يونانيون ولاتينيون أداروا حصون الليمس الدفاعي البيزنطي.",
        },
        {
          name: "ملوك المور الأمازيغ المستقلون",
          role: "زعماء القبائل بالداخل التونسي",
          origin: "الظهير التونسي والأوراس",
          lineageNotes:
            "سلالات أمازيغية لأنطالاس وكاباو ويوداس قاومت ثم عاهدت الإكسرخية البيزنطية.",
        },
      ],
      keySites: [
        { name: "قرطاج (البازيليكات المسيحية)", role: "عاصمة الإكسرخية" },
        { name: "سفيطلة (سبيطلة)", role: "المعركة الحاسمة سنة 647 أمام الجيوش المسلمة" },
        { name: "قليبية (الحصن)", role: "قلعة بحرية بيزنطية حصينة" },
      ],
      archivalSources: [
        "ألواح ألبرتيني (45 وثيقة توثيقية خشبية مكتشفة قرب تبسة)",
        "ملحمة اليوحناوية للشاعر كوريبوس (عن حروب المور بتونس)",
        "بروكوبيوس القيسراني — تاريخ حروب الوندال",
      ],
    },
    omeyyade: {
      divisions: {
        koura_kairouan: {
          name: "كورة القيروان",
          seat: "القيروان",
          description: "مركز حكم ولاية إفريقية.",
        },
        koura_tunis: {
          name: "كورة تونس والزيتونة",
          seat: "تونس",
          description: "دار الصناعة البحرية والجامع الأعظم بالزيتونة.",
        },
        koura_sousse: {
          name: "كورة سوسة",
          seat: "سوسة",
          description: "الرباط والميناء البحري للانطلاق نحو المتوسط.",
        },
        koura_djerid: {
          name: "كورة قسطيلية وقفصة",
          seat: "قسطيلية (توزر)",
          description: "الواحات الاستراتيجية بجنوب إفريقية.",
        },
      },
      leaders: [
        {
          name: "حسان بن النعمان الأزدي",
          role: "الوالي ومؤسس حاضرة تونس",
          reignOrDates: "692 – 703 م",
          achievements:
            "فتح قرطاج وأسس رسمياً مدينة تونس الإسلامية، وحفر ميناءها الداخلي وشيّد جامع الزيتونة.",
        },
        {
          name: "عقبة بن نافع الفهري",
          role: "فاتح إفريقية ومؤسس القيروان",
          reignOrDates: "670 – 683 م",
          achievements:
            "أسس مدينة القيروان المقدسة سنة 670 وجامعها الكبير، مرتكز الحضارة الإسلامية في بلاد المغرب.",
        },
        {
          name: "موسى بن نصير",
          role: "الوالي العام لبلاد المغرب",
          reignOrDates: "705 – 714 م",
          achievements:
            "وطّد الأمن نهائياً في إفريقية وسلّح أسطول تونس وأعدّ لفتح الأندلس مع طارق بن زياد.",
        },
        {
          name: "ديهيا (الكاهنة)",
          role: "ملكة البربر الجراوة",
          reignOrDates: "688 – 702 م",
          achievements:
            "شخصية رمزية للسيادة الأمازيغية، وحّدت قبائل الجنوب والأوراس في مواجهة الجيوش الأموية.",
        },
      ],
      families: [
        {
          name: "الأسرة الفهرية",
          role: "ولاة وقادة جيوش إفريقية",
          origin: "القيروان والمدينة العتيقة بتونس",
          lineageNotes:
            "أحفاد عقبة بن نافع المباشرون الذين قادوا الفتوحات في إفريقية والأندلس.",
        },
        {
          name: "أشراف قريش بإفريقية",
          role: "قضاة وأمراء الأرباض العسكرية",
          origin: "القيروان وتونس",
          lineageNotes:
            "بيوتات بني مخزوم وبني زهرة المستقرة في المعسكرات الأولى بإفريقية.",
        },
        {
          name: "زعامات أوربة وجراوة",
          role: "قيادات قبلية أصيلة متحالفة",
          origin: "السباسب العليا والأوراس",
          lineageNotes:
            "الأسر الأمازيغية الكبرى لكسيلة وديهيا التي أسهمت لاحقاً في بناء الجيوش الإسلامية المغاربية.",
        },
      ],
      keySites: [
        { name: "القيروان (جامع عقبة الكبير)", role: "عاصمة الفتح الإسلامي بالمغرب" },
        { name: "تونس (جامع الزيتونة)", role: "تأسيس دار الصناعة وجامعة الزيتونة" },
        { name: "رباط سوسة", role: "نقطة حراسة ساحلية ضد الغارات البيزنطية" },
      ],
      archivalSources: [
        "حوليات فتوح إفريقية وروايات ابن عبد الحكم",
        "النقائش التأسيسية بالجامع الكبير بالقيروان (670 م)",
        "الكتابات الكوفية الأولى بجامع الزيتونة بتونس (698 م)",
      ],
    },
    aghlabide: {
      divisions: {
        kairouan_raqqada: {
          name: "حاضرة القيروان ورقادة",
          seat: "رقادة",
          description: "مقر قصور الأمراء وكبار فقهاء المالكية (سحنون).",
        },
        sahel_ribats: {
          name: "إقليم الرباطات بالساحل",
          seat: "المنستير / سوسة",
          description: "الرباطات الروحية والترسانات البحرية الأغلبية.",
        },
        sfax_ports: {
          name: "كورة صفاقس",
          seat: "صفاقس",
          description: "الأسوار المحصنة والصادرات البحرية.",
        },
        beja_cereales: {
          name: "كورة باجة",
          seat: "باجة",
          description: "مركز إنتاج الحبوب بإقليم التل.",
        },
      },
      leaders: [
        {
          name: "إبراهيم بن الأغلب التميمي",
          role: "الأمير المؤسس للدولة الأغلبية",
          reignOrDates: "800 – 812 م",
          achievements:
            "أسس إمارة إفريقية المستقلة باعتراف الخليفة العباسي هارون الرشيد وشيّد مدينة العباسية.",
        },
        {
          name: "زيادة الله الأول",
          role: "أمير إفريقية وفاتح صقلية",
          reignOrDates: "817 – 838 م",
          achievements:
            "أعاد بناء جامع القيروان وجامع الزيتونة بأبهى حلة، وأصدر أمر فتح صقلية سنة 827.",
        },
        {
          name: "الإمام سحنون بن سعيد",
          role: "قاضي القيروان الأكبر والفقيه المرجع",
          reignOrDates: "848 – 854 م",
          achievements:
            "صاحب المدونة الكبرى، المرجع الفقهي المؤسس للمذهب المالكي في عموم بلاد المغرب والأندلس.",
        },
        {
          name: "أسد بن الفرات",
          role: "العالم والقاضي وقائد الأسطول",
          reignOrDates: "759 – 828 م",
          achievements:
            "تلميذ الإمام مالك وأبي حنيفة، قاد الإنزال العسكري المظفر في صقلية بمارس مازارا.",
        },
      ],
      families: [
        {
          name: "بنو الأغلب التميميون",
          role: "أمراء إفريقية السياديون",
          origin: "القيروان / رقادة",
          lineageNotes:
            "سلالة أميرية ذات أصول خراسانية حكمت تونس وصقلية لأكثر من قرن من الازدهار.",
        },
        {
          name: "آل سحنون التنوخيون",
          role: "فقهاء وعلماء إفريقية",
          origin: "القيروان وتونس",
          lineageNotes:
            "سلالة من الأئمة والقضاة ثبتت الفقه المالكي وقادت حلقات العلم بالزيتونة.",
        },
        {
          name: "بنو قادم بتونس",
          role: "مجهّزو السفن وولاة مدينة تونس",
          origin: "المدينة العتيقة بتونس",
          lineageNotes:
            "أسر بلدية كبرى أدارت ميناء تونس وترسانته والتجارة البحرية مع إيطاليا.",
        },
      ],
      keySites: [
        { name: "القيروان (فسقية الأغالبة)", role: "العاصمة السياسية والمنارة الفكرية" },
        { name: "رقادة", role: "المدينة القصرية للأمراء الأغالبة" },
        { name: "رباط المنستير", role: "قلعة ساحلية روحية وعسكرية" },
      ],
      archivalSources: [
        "مخطوط المصحف الأزرق بالقيروان ورقوق المقصورة",
        "حوليات ابن الأثير والنويري",
        "المدونة للإمام سحنون (دستور الفقه المالكي بإفريقية)",
      ],
    },
    fatimide: {
      divisions: {
        mahdia_core: {
          name: "حاضرة المهدية المعمورة",
          seat: "المهدية",
          description: "شبه جزيرة السقيفة الكحلاء المحصنة وميناء الخلافة.",
        },
        sabra_mansouria: {
          name: "صبرة المنصورية",
          seat: "جنوب القيروان",
          description: "حاضرة الأمراء الزيريين على أبواب القيروان.",
        },
        sfax_zirid: {
          name: "إمارة صفاقس",
          seat: "صفاقس",
          description: "أسوار منيعة وأسطول تجاري بحري.",
        },
        gabes_oasis: {
          name: "عمالة قابس",
          seat: "قابس",
          description: "مفترق بحري وتجاري لقوافل الصحراء.",
        },
      },
      leaders: [
        {
          name: "عبيد الله المهدي",
          role: "أول خليفة فاطمي",
          reignOrDates: "909 – 934 م",
          achievements:
            "أسس الخلافة الفاطمية بإفريقية وشيّد الحاضرة البحرية المنيعة المهدية سنة 916.",
        },
        {
          name: "المعز لدين الله الفاطمي",
          role: "الخليفة فاتح مصر",
          reignOrDates: "953 – 975 م",
          achievements:
            "فتح مصر سنة 969 وأسس القاهرة والجامع الأزهر، مفوضاً حكم إفريقية للأمراء الزيريين.",
        },
        {
          name: "بلكين بن زيري الصنهاجي",
          role: "الأمير السيادي لإفريقية",
          reignOrDates: "972 – 984 م",
          achievements:
            "مؤسس السلالة الزيرية المرموقة التي حكمت المغرب الأوسط وإفريقية من صبرة المنصورية.",
        },
        {
          name: "المعز بن باديس الزيري",
          role: "الأمير الزيري مجدّد المذهب السني",
          reignOrDates: "1016 – 1062 م",
          achievements:
            "قطع الولاء للخلافة الفاطمية سنة 1048 وأعلن الخطبة والبيعة للخلافة العباسية السنية.",
        },
      ],
      families: [
        {
          name: "بنو زيري الصنهاجيون",
          role: "أمراء صبرة المنصورية والمهدية",
          origin: "أشير / المهدية",
          lineageNotes:
            "سلالة ملكية أمازيغية صنهاجية حكمت إفريقية لقرابة قرنين من الزمن.",
        },
        {
          name: "بنو خراسان ملوك تونس",
          role: "أمراء مستقلون لمدينة تونس",
          origin: "المدينة العتيقة بتونس (دار الخراساني)",
          lineageNotes:
            "حكام مستنيرون بتونس (1059–1159) حموا المدينة وطوروا المبادلات التجارية.",
        },
        {
          name: "أمراء بني هلال (رياح وزغبة)",
          role: "كونفدراليات بدوية محاربة",
          origin: "سهول القيروان والسباسب",
          lineageNotes:
            "سلالات عربية بدوية أرست تحولاً عميقاً في التعريب اللغوي والاستيطان بالسهول التونسية.",
        },
      ],
      keySites: [
        { name: "المهدية", role: "أول عاصمة للخلافة الفاطمية (916)" },
        { name: "المنصورية (صبرة)", role: "عاصمة الأمراء الزيريين" },
        { name: "صفاقس", role: "أسوار زيرية وميناء تجاري كبير" },
      ],
      archivalSources: [
        "النقائش الكوفية الضخمة بالسقيفة الكحلاء بالمهدية (916)",
        "مؤلفات ابن حماد وابن حيان حول الزيريين بصبرة المنصورية",
        "رصيد المراسيم الفاطمية لمصايد الأسماك بالمهدية وقرقنة",
      ],
    },
  },
  es: {
    punique: {
      divisions: {
        carthage_core: {
          name: "Cartago Metrópoli",
          seat: "Cartago Byrsa",
          description: "Corazón político, santuarios de Tanit y arsenales navales.",
        },
        chora_capbon: {
          name: "Chora de Cabo Bon",
          seat: "Kerkouane / Aspis (Kelibia)",
          description: "Grandes explotaciones agrícolas púnicas y pesquerías costeras.",
        },
        medjerda_valley: {
          name: "Valle del Bagrada",
          seat: "Útica",
          description: "Granero cerealista metropolitano desde Útica hasta Sicca.",
        },
        byzacena_punic: {
          name: "Región Costera de Hadrumetum",
          seat: "Hadrumetum (Susa)",
          description: "Factorías y puertos mercantes púnicos del Sahel.",
        },
        numidia_massyles: {
          name: "Reino de los Masilios",
          seat: "Thugga (Dougga) / Cirta",
          description: "Territorio de los reyes numidas aliados de Cartago y luego de Masinisa.",
        },
      },
      leaders: [
        {
          name: "Aníbal Barca",
          role: "Generalísimo y Sufete de Cartago",
          reignOrDates: "247 a. C. – 183 a. C.",
          achievements:
            "Genio militar universal, vencedor en Cannas y Trasimeno, y reformador democrático de la constitución de Cartago.",
        },
        {
          name: "Amílcar Barca",
          role: "Estratega y Fundador del Poder Bárcida",
          reignOrDates: "275 a. C. – 228 a. C.",
          achievements:
            "Comandante en jefe de la Primera Guerra Púnica, pacificador de Ifriqiya y conquistador de Hispania.",
        },
        {
          name: "Magón el Grande",
          role: "Sufete y Fundador de la Dinastía Magónida",
          reignOrDates: "550 a. C. – 530 a. C.",
          achievements:
            "Organizador del ejército cívico y de la hegemonía marítima de Cartago en el Mediterráneo occidental.",
        },
        {
          name: "Masinisa",
          role: "Primer Rey de Numidia Unificada",
          reignOrDates: "238 a. C. – 148 a. C.",
          achievements:
            "Unificador de los reinos bereberes masilios y masesilios, constructor de las ciudades numidas de Dougga y Cirta.",
        },
      ],
      families: [
        {
          name: "Dinastía Bárcida",
          role: "Aristocracia militar, sufetes y generales",
          origin: "Cartago Metrópoli (Colina de Byrsa)",
          lineageNotes:
            "Linaje de Amílcar, Aníbal, Asdrúbal y Magón que gobernó Cartago y fundó Cartagena.",
        },
        {
          name: "Casa de los Magónidas",
          role: "Senadores y líderes de la oligarquía púnica",
          origin: "Cartago",
          lineageNotes:
            "Gobernantes predominantes en el Consejo de los Ciento Cuatro del siglo VI al IV a. C.",
        },
        {
          name: "Linaje Real Masilio",
          role: "Reyes numidas junto a la Fossa Regia",
          origin: "Dougga (Thugga) / Cirta",
          lineageNotes:
            "Linaje real de Gala, Masinisa, Micipsa y Yugurta que reinó sobre las altas llanuras occidentales.",
        },
      ],
      keySites: [
        { name: "Cartago", role: "Capital imperial metropolitana púnica" },
        { name: "Dougga (Thugga)", role: "Gran ciudad numido-romana (Mausoleo libio-púnico)" },
        { name: "Bulla Regia", role: "Residencia de los reyes numidas" },
        { name: "Kerkouane", role: "Ciudad púnica costera intacta de Cabo Bon" },
      ],
      archivalSources: [
        "Inscripciones neopúnicas y estelas votivas del Tofet de Salambó",
        "Textos de Polibio, Tito Livio y Apiano sobre el trazado de la Fossa Regia",
        "Mosaicos y epigrafía líbico-bereber de Bulla Regia y Dougga",
      ],
    },
    romaine: {
      divisions: {
        zeugitana: {
          name: "África Zeugitana (Norte)",
          seat: "Carthago Colonia",
          description: "Provincia senatorial proconsular del norte de Túnez.",
        },
        byzacena: {
          name: "Provincia Bizacena (Centro)",
          seat: "Hadrumetum (Susa)",
          description: "Próspera provincia oleícola centrada en Hadrumetum y Thysdrus.",
        },
        tripolitana: {
          name: "Tripolitania (Sur)",
          seat: "Tacape (Gabès)",
          description: "Zona militar del Limes y confines saharianos.",
        },
        capsa_region: {
          name: "Distrito de Capsa (Gafsa)",
          seat: "Capsa",
          description: "Puesto avanzado del Limes frente a las tribus nómadas gétulas.",
        },
      },
      leaders: [
        {
          name: "Septimio Severo",
          role: "Emperador Romano de África",
          reignOrDates: "193 – 211 d. C.",
          achievements:
            "Primer emperador romano de origen africano; concedió estatuto municipal o colonial a numerosas ciudades proconsulares.",
        },
        {
          name: "Gordiano I y Gordiano II",
          role: "Procónsules de África y Emperadores",
          reignOrDates: "238 d. C.",
          achievements:
            "Proclamados emperadores romanos por la juventud senatorial africana en Thysdrus (Anfiteatro de El Jem).",
        },
        {
          name: "Escipión Emiliano",
          role: "Cónsul de la República Romana",
          reignOrDates: "146 a. C.",
          achievements:
            "Conquistador de Byrsa y artífice del trazado catastral de la Fossa Regia que delimitó el África romana.",
        },
        {
          name: "San Cipriano",
          role: "Obispo y Doctor de Cartago",
          reignOrDates: "200 – 258 d. C.",
          achievements:
            "Padre de la Iglesia de África, mártir bajo Valeriano y autor de epístolas canónicas clave para la cristiandad occidental.",
        },
      ],
      families: [
        {
          name: "Patriciado Senatorial Africano",
          role: "Propietarios de los grandes latifundios",
          origin: "Cartago, Útica y Dougga",
          lineageNotes:
            "Grandes familias ecuestres y senatoriales titulares de las llanuras cerealistas del Medjerda.",
        },
        {
          name: "Gens Caecilia de Thugga",
          role: "Benefactores y duoviros municipales",
          origin: "Thugga (Dougga)",
          lineageNotes:
            "Élites romano-numidas mecenas que financiaron el Capitolio y el Teatro de Dougga.",
        },
        {
          name: "Patricios de Hadrumetum y Thysdrus",
          role: "Exportadores del aceite de oliva de Bizacena",
          origin: "Susa (Hadrumetum) / El Jem",
          lineageNotes:
            "Comitentes de las suntuosas residencias con mosaicos expuestas hoy en los museos del Bardo y Susa.",
        },
      ],
      keySites: [
        { name: "Hadrumetum (Susa)", role: "Capital de la provincia de Bizacena" },
        { name: "Thysdrus (El Jem)", role: "Anfiteatro colosal y capital oleícola romana" },
        { name: "Sufetula (Sbeïtla)", role: "Templos del Capitolio y sede del patricio Gregorio" },
        { name: "Zaghouan (Ziqua)", role: "Templo de las Aguas y origen del acueducto de Cartago" },
      ],
      archivalSources: [
        "Corpus Inscriptionum Latinarum (CIL VIII) — 30.000 inscripciones de Túnez",
        "Tabla de Peutinger e Itinerario de Antonino",
        "Actas de los Concilios de Cartago de San Cipriano y San Agustín",
      ],
    },
    vandale_byzantine: {
      divisions: {
        carthage_exarch: {
          name: "Sede del Exarcado",
          seat: "Cartago",
          description: "Residencia del Exarca imperial.",
        },
        byzacena_byz: {
          name: "Ducado Militar de Bizacena",
          seat: "Sufetula (Sbeïtla)",
          description: "Fortalezas del patricio Gregorio.",
        },
        limes_tripoli: {
          name: "Ducado de Tripolitania",
          seat: "Tacape / Leptis",
          description: "Línea defensiva del sureste.",
        },
      },
      leaders: [
        {
          name: "Genserico",
          role: "Rey de los Vándalos y Alanos",
          reignOrDates: "428 – 477 d. C.",
          achievements:
            "Tomó Cartago en 439, fundó el Reino vándalo de África y dominó el Mediterráneo occidental durante 40 años.",
        },
        {
          name: "Justiniano I el Grande",
          role: "Emperador Bizantino",
          reignOrDates: "527 – 565 d. C.",
          achievements:
            "Ordenó la Reconquista de África en 533 e instauró la Prefectura del Pretorio de África.",
        },
        {
          name: "Belisario",
          role: "Generalísimo de Oriente",
          reignOrDates: "533 – 534 d. C.",
          achievements:
            "Derrotó decisivamente al ejército vándalo en Ad Decimum y Tricaméron, restableciendo la autoridad imperial en Cartago.",
        },
        {
          name: "Gregorio el Patricio",
          role: "Exarca de África",
          reignOrDates: "641 – 647 d. C.",
          achievements:
            "Proclamó la independencia de África respecto a Bizancio y trasladó su capital a Sufetula (Sbeïtla).",
        },
      ],
      families: [
        {
          name: "Dinastía Asdinga",
          role: "Casa real vándala de África",
          origin: "Cartago y Radès",
          lineageNotes:
            "Linaje real germánico arriano (Genserico, Hunerico, Guntamundo, Trasamundo, Hilderico, Gelimer).",
        },
        {
          name: "Aristocracia Patricia Bizantina",
          role: "Tribunos militares y prefectos del pretorio",
          origin: "Cartago, Kelibia y Sufetula",
          lineageNotes:
            "Patricios griegos y latinos al cargo de las fortificaciones del limes bizantino.",
        },
        {
          name: "Reyes Mauros Autónomos",
          role: "Jefes tribales del interior",
          origin: "Dorsal tunecina y Aurès",
          lineageNotes:
            "Dinastías bereberes de Antalas, Cabaón y Iaudas que desafiaron y pactaron con los exarcas bizantinos.",
        },
      ],
      keySites: [
        { name: "Cartago (Basílicas Cristianas)", role: "Capital del Exarcado" },
        { name: "Sufetula (Sbeïtla)", role: "Batalla decisiva de 647 frente a los ejércitos musulmanes" },
        { name: "Kelibia (Fortaleza)", role: "Bastión marítimo bizantino" },
      ],
      archivalSources: [
        "Tablillas Albertini (45 actas notariales sobre madera halladas cerca de Tébessa)",
        "La Johánide de Coripo (epopeya bizantina sobre las guerras mauras en Túnez)",
        "Procopio de Cesarea — Historia de la Guerra de los Vándalos",
      ],
    },
    omeyyade: {
      divisions: {
        koura_kairouan: {
          name: "Koura de Kairuán",
          seat: "Kairuán",
          description: "Centro de gobierno de la Wilaya de Ifriqiya.",
        },
        koura_tunis: {
          name: "Koura de Túnez",
          seat: "Túnez",
          description: "Arsenal marítimo y Gran Mezquita de Al-Zitouna.",
        },
        koura_sousse: {
          name: "Koura de Susa",
          seat: "Susa",
          description: "Ribat y puerto naval de partida hacia el Mediterráneo.",
        },
        koura_djerid: {
          name: "Koura del Jérid y Gafsa",
          seat: "Qastiliya (Tozeur)",
          description: "Oasis estratégicos de la Ifriqiya meridional.",
        },
      },
      leaders: [
        {
          name: "Hassan Ibn al-Nu'man",
          role: "Gobernador y Constructor de Túnez",
          reignOrDates: "692 – 703 d. C.",
          achievements:
            "Conquistó Cartago, fundó oficialmente la ciudad musulmana de Túnez, excavó su puerto interior y edificó Al-Zitouna.",
        },
        {
          name: "Uqba Ibn Nafi al-Fihri",
          role: "Conquistador de Ifriqiya y Fundador",
          reignOrDates: "670 – 683 d. C.",
          achievements:
            "Fundó la ciudad santa de Kairuán en 670 y su Gran Mezquita, punto de anclaje de la civilización islámica en el Magreb.",
        },
        {
          name: "Musa Ibn Nusair",
          role: "Gobernador General del Magreb",
          reignOrDates: "705 – 714 d. C.",
          achievements:
            "Pacificó definitivamente Ifriqiya, armó la flota de Túnez y organizó la expedición a Al-Ándalus con Tariq Ibn Ziyad.",
        },
        {
          name: "Dihya (La Kahina)",
          role: "Reina de los Bereberes Jerawa",
          reignOrDates: "688 – 702 d. C.",
          achievements:
            "Figura emblemática de la soberanía amazigh que unificó a las tribus del sur y los Aurès frente a los ejércitos omeyas.",
        },
      ],
      families: [
        {
          name: "Casa de los Fihríes",
          role: "Gobernadores y generales de Ifriqiya",
          origin: "Kairuán y Medina de Túnez",
          lineageNotes:
            "Descendientes directos de Uqba Ibn Nafi que comandaron las campañas de Ifriqiya y Al-Ándalus.",
        },
        {
          name: "Nobleza Qurayshí de Ifriqiya",
          role: "Cadíes y comandantes de guarnición",
          origin: "Kairuán y Túnez",
          lineageNotes:
            "Linajes de Banu Makhzum y Banu Zuhra establecidos en los campamentos militares de Ifriqiya.",
        },
        {
          name: "Jefaturas Awraba y Jerawa",
          role: "Líderes tribales autóctonos confederados",
          origin: "Altas estepas y Aurès",
          lineageNotes:
            "Grandes familias bereberes de Kusayla y Dihya que contribuyeron después a forjar los ejércitos musulmanes magrebíes.",
        },
      ],
      keySites: [
        { name: "Kairuán (Gran Mezquita de Uqba)", role: "Capital de la conquista islámica del Magreb" },
        { name: "Túnez (Mezquita Al-Zitouna)", role: "Fundación del arsenal y de la Universidad Zitouna" },
        { name: "Ribat de Susa", role: "Centinela costero frente a las incursiones bizantinas" },
      ],
      archivalSources: [
        "Crónicas de Futuh Ifriqiya y relatos de Ibn Abd al-Hakam",
        "Inscripciones fundacionales de la Gran Mezquita de Kairuán (670)",
        "Inscripciones cúficas primitivas de la Mezquita Al-Zitouna en Túnez (698)",
      ],
    },
    aghlabide: {
      divisions: {
        kairouan_raqqada: {
          name: "Capital Kairuán y Raqqada",
          seat: "Raqqada",
          description: "Sede de los palacios emirales y grandes juristas malikíes (Sahnún).",
        },
        sahel_ribats: {
          name: "Región de los Ribats del Sahel",
          seat: "Monastir / Susa",
          description: "Ribats espirituales y arsenales marítimos aglabíes.",
        },
        sfax_ports: {
          name: "Koura de Sfax",
          seat: "Sfax",
          description: "Murallas fortificadas y exportaciones marítimas.",
        },
        beja_cereales: {
          name: "Koura de Béja",
          seat: "Béja",
          description: "Centro de producción cerealista del Tell.",
        },
      },
      leaders: [
        {
          name: "Ibrahim I Ibn al-Aghlab",
          role: "Emir Fundador de la Dinastía",
          reignOrDates: "800 – 812 d. C.",
          achievements:
            "Fundó el Emirato soberano de Ifriqiya reconocido por el califa abasí Harún al-Rashid y edificó Al-Abbasiyya.",
        },
        {
          name: "Ziyadat Allah I",
          role: "Emir de Ifriqiya y Conquistador",
          reignOrDates: "817 – 838 d. C.",
          achievements:
            "Reconstruyó con esplendor la Mezquita de Kairuán y la Zitouna de Túnez y ordenó la conquista de Sicilia (827).",
        },
        {
          name: "Imam Sahnún Ibn Saïd",
          role: "Gran Cadí de Kairuán y Jurista Supremo",
          reignOrDates: "848 – 854 d. C.",
          achievements:
            "Autor de la célebre Mudawwana, texto doctrinal fundacional de la escuela malikí en todo el Magreb y Al-Ándalus.",
        },
        {
          name: "Asad Ibn al-Furat",
          role: "Erudito, Magistrado y General en Jefe",
          reignOrDates: "759 – 828 d. C.",
          achievements:
            "Discípulo de Malik y Abu Hanifa; dirigió victoriosamente el desembarco naval en Sicilia en Mazara del Vallo.",
        },
      ],
      families: [
        {
          name: "Dinastía de los Banu al-Aghlab",
          role: "Emires soberanos de Ifriqiya",
          origin: "Kairuán / Raqqada",
          lineageNotes:
            "Linaje principesco originario de Jorasán que reinó durante más de un siglo sobre Túnez y Sicilia.",
        },
        {
          name: "Casa de los Tanujíes (Familia de Sahnún)",
          role: "Jurisconsultos y ulemas de Ifriqiya",
          origin: "Kairuán y Túnez",
          lineageNotes:
            "Estirpe de imames y cadíes que fijó la jurisprudencia malikí y dirigió la enseñanza en Al-Zitouna.",
        },
        {
          name: "Banu Qadim de Túnez",
          role: "Armadores y gobernadores de la ciudad de Túnez",
          origin: "Medina de Túnez",
          lineageNotes:
            "Grandes familias patricias tunecinas al mando del puerto, el arsenal y el comercio marítimo con Italia.",
        },
      ],
      keySites: [
        { name: "Kairuán (Estanques de los Aglabíes)", role: "Capital política y faro intelectual" },
        { name: "Raqqada", role: "Ciudad palaciega de los soberanos aglabíes" },
        { name: "Ribat de Monastir", role: "Fortaleza costera espiritual y militar" },
      ],
      archivalSources: [
        "Manuscrito del Corán Azul de Kairuán y pergaminos de la Maqsura",
        "Crónicas de Ibn al-Athir y Al-Nuwayri",
        "Al-Mudawwana del Imam Sahnún (código de derecho malikí de Ifriqiya)",
      ],
    },
    fatimide: {
      divisions: {
        mahdia_core: {
          name: "Capital Imperial de Mahdia",
          seat: "Mahdia",
          description: "Península fortificada de la Skifa Kahla y puerto califal.",
        },
        sabra_mansouria: {
          name: "Sabra Al-Mansouria",
          seat: "Kairuán Sur",
          description: "Ciudad principesca zirí a las puertas de Kairuán.",
        },
        sfax_zirid: {
          name: "Principado de Sfax",
          seat: "Sfax",
          description: "Murallas imponentes y flota mercante.",
        },
        gabes_oasis: {
          name: "Amilato de Gabès",
          seat: "Gabès",
          description: "Encrucijada marítima y caravanera.",
        },
      },
      leaders: [
        {
          name: "Ubayd Allah al-Mahdi",
          role: "Primer Califa Fatimí",
          reignOrDates: "909 – 934 d. C.",
          achievements:
            "Fundó el Califato fatimí en Ifriqiya y construyó la inexpugnable capital marítima de Mahdia en 916.",
        },
        {
          name: "Al-Mu'izz li-Din Allah",
          role: "Califa Conquistador de Egipto",
          reignOrDates: "953 – 975 d. C.",
          achievements:
            "Conquistó Egipto en 969, fundó El Cairo y la Mezquita Al-Azhar y confió el gobierno de Ifriqiya a los Ziríes.",
        },
        {
          name: "Bologhine Ibn Ziri",
          role: "Emir Soberano de Ifriqiya",
          reignOrDates: "972 – 984 d. C.",
          achievements:
            "Fundador de la prestigiosa dinastía zirí que gobernó el Magreb central e Ifriqiya desde Al-Mansouria.",
        },
        {
          name: "Al-Mu'izz Ibn Badis",
          role: "Emir Zirí Restaurador del Sunismo",
          reignOrDates: "1016 – 1062 d. C.",
          achievements:
            "Rompió solemnemente con el califato fatimí en 1048 para proclamar obediencia al califa suní abasí.",
        },
      ],
      families: [
        {
          name: "Dinastía de los Ziríes Sanhadja",
          role: "Príncipes reinantes en Mansouria y Mahdia",
          origin: "Achir / Mahdia",
          lineageNotes:
            "Estirpe real bereber sanhadja que gobernó Ifriqiya durante casi dos siglos.",
        },
        {
          name: "Dinastía de los Banu Jurasán",
          role: "Príncipes independientes de la ciudad de Túnez",
          origin: "Medina de Túnez (Dar El-Khourassani)",
          lineageNotes:
            "Soberanos ilustrados de Túnez (1059–1159) que protegieron la urbe y expandieron su comercio marítimo.",
        },
        {
          name: "Jefaturas Hilalíes (Riyah y Zoghba)",
          role: "Confederaciones guerreras beduinas",
          origin: "Llanuras de Kairuán y estepas",
          lineageNotes:
            "Linajes árabes beduinos que transformaron la arabización lingüística y el poblamiento de las llanuras tunecinas.",
        },
      ],
      keySites: [
        { name: "Mahdia", role: "Primera capital califal fatimí (916)" },
        { name: "Al-Mansouria (Sabra)", role: "Capital principesca zirí" },
        { name: "Sfax", role: "Murallas ziríes y gran puerto mercante" },
      ],
      archivalSources: [
        "Inscripciones cúficas monumentales de la Skifa Kahla de Mahdia (916)",
        "Escritos de Ibn Hammad e Ibn Hayyan sobre los Ziríes de Sabra Al-Mansouria",
        "Fondos de decretos fatimíes sobre las pesquerías de Mahdia y Kerkennah",
      ],
    },
  },
  it: {
    punique: {
      divisions: {
        carthage_core: {
          name: "Cartagine Metropoli",
          seat: "Cartagine Byrsa",
          description: "Cuore politico, santuari di Tanit e arsenali navali.",
        },
        chora_capbon: {
          name: "Chora di Capo Bon",
          seat: "Kerkouane / Aspis (Kelibia)",
          description: "Grandi tenute agricole puniche e pescherie costiere.",
        },
        medjerda_valley: {
          name: "Valle del Bagrada",
          seat: "Utica",
          description: "Granaio cerealicolo metropolitano da Utica a Sicca.",
        },
        byzacena_punic: {
          name: "Regione Costiera di Adrumeto",
          seat: "Hadrumetum (Susa)",
          description: "Empori e porti mercantili punici del Sahel.",
        },
        numidia_massyles: {
          name: "Regno dei Massili",
          seat: "Thugga (Dougga) / Cirta",
          description: "Territorio dei re numidi alleati di Cartagine e poi di Massinissa.",
        },
      },
      leaders: [
        {
          name: "Annibale Barca",
          role: "Generalissimo e Sufeta di Cartagine",
          reignOrDates: "247 a.C. – 183 a.C.",
          achievements:
            "Genio militare universale, vincitore a Canne e al Trasimeno e riformatore democratico della costituzione cartaginese.",
        },
        {
          name: "Amilcare Barca",
          role: "Stratega e Fondatore della Potenza Barcide",
          reignOrDates: "275 a.C. – 228 a.C.",
          achievements:
            "Comandante in capo nella Prima Guerra Punica, pacificatore dell'Ifriqiya e conquistatore dell'Iberia.",
        },
        {
          name: "Magone il Grande",
          role: "Sufeta e Fondatore della Dinastia Magonide",
          reignOrDates: "550 a.C. – 530 a.C.",
          achievements:
            "Organizzatore dell'esercito civico e dell'egemonia marittima di Cartagine nel Mediterraneo occidentale.",
        },
        {
          name: "Massinissa",
          role: "Primo Re della Numidia Unificata",
          reignOrDates: "238 a.C. – 148 a.C.",
          achievements:
            "Unificatore dei regni berberi massili e masesili, costruttore delle città numide di Dougga e Cirta.",
        },
      ],
      families: [
        {
          name: "Dinastia dei Barcidi",
          role: "Aristocrazia militare, sufeti e generali",
          origin: "Cartagine Metropoli (Colle di Byrsa)",
          lineageNotes:
            "Lignaggio di Amilcare, Annibale, Asdrubale e Magone che governò Cartagine e fondò Cartagena.",
        },
        {
          name: "Casa dei Magonidi",
          role: "Senatori e capi dell'oligarchia punica",
          origin: "Cartagine",
          lineageNotes:
            "Governanti dominanti del Consiglio dei Centoquattro dal VI al IV secolo a.C.",
        },
        {
          name: "Lignaggio Reale Massile",
          role: "Re numidi lungo la Fossa Regia",
          origin: "Dougga (Thugga) / Cirta",
          lineageNotes:
            "Stirpe reale di Gala, Massinissa, Micipsa e Giugurta sugli altopiani occidentali.",
        },
      ],
      keySites: [
        { name: "Cartagine", role: "Capitale imperiale metropolitana punica" },
        { name: "Dougga (Thugga)", role: "Grande città numido-romana (Mausoleo libico-punico)" },
        { name: "Bulla Regia", role: "Residenza dei re numidi" },
        { name: "Kerkouane", role: "Città punica costiera intatta di Capo Bon" },
      ],
      archivalSources: [
        "Iscrizioni neopuniche e stele votive del Tofet di Salammbô",
        "Opere di Polibio, Tito Livio e Appiano sul tracciato della Fossa Regia",
        "Mosaici ed epigrafia libico-berbera di Bulla Regia e Dougga",
      ],
    },
    romaine: {
      divisions: {
        zeugitana: {
          name: "Africa Zeugitana (Nord)",
          seat: "Carthago Colonia",
          description: "Provincia senatoria proconsolare della Tunisia settentrionale.",
        },
        byzacena: {
          name: "Provincia Bizacena (Centro)",
          seat: "Hadrumetum (Susa)",
          description: "Prospera provincia olivicola incentrata su Adrumeto e Thysdrus.",
        },
        tripolitana: {
          name: "Tripolitania (Sud)",
          seat: "Tacape (Gabès)",
          description: "Zona militare del Limes e confini sahariani.",
        },
        capsa_region: {
          name: "Distretto di Capsa (Gafsa)",
          seat: "Capsa",
          description: "Avamposto del Limes di fronte alle tribù nomadi dei Getuli.",
        },
      },
      leaders: [
        {
          name: "Settimio Severo",
          role: "Imperatore Romano d'Africa",
          reignOrDates: "193 – 211 d.C.",
          achievements:
            "Primo imperatore romano di origine africana; concesse il rango di municipio o colonia a numerose città proconsolari.",
        },
        {
          name: "Gordiano I e Gordiano II",
          role: "Proconsoli d'Africa e Imperatori",
          reignOrDates: "238 d.C.",
          achievements:
            "Proclamati imperatori romani dalla gioventù senatoria africana a Thysdrus (Anfiteatro di El Jem).",
        },
        {
          name: "Scipione Emiliano",
          role: "Console della Repubblica Romana",
          reignOrDates: "146 a.C.",
          achievements:
            "Conquistatore di Byrsa e ordinatore del tracciato catastale della Fossa Regia che delimitò l'Africa romana.",
        },
        {
          name: "San Cipriano",
          role: "Vescovo e Dottore di Cartagine",
          reignOrDates: "200 – 258 d.C.",
          achievements:
            "Padre della Chiesa d'Africa, martire sotto Valeriano e autore delle epistole canoniche per la cristianità occidentale.",
        },
      ],
      families: [
        {
          name: "Patriziato Senatoriale Africano",
          role: "Proprietari dei grandi latifondi",
          origin: "Cartagine, Utica e Dougga",
          lineageNotes:
            "Grandi famiglie equestri e senatorie detentrici delle pianure cerealicole della Medjerda.",
        },
        {
          name: "Gens Caecilia di Thugga",
          role: "Benefattori e duoviri municipali",
          origin: "Thugga (Dougga)",
          lineageNotes:
            "Élite romano-numide mecenati che finanziarono l'erezione del Campidoglio e del Teatro di Dougga.",
        },
        {
          name: "Patrizi di Adrumeto e Thysdrus",
          role: "Esportatori dell'olio d'oliva di Bizacena",
          origin: "Susa (Hadrumetum) / El Jem",
          lineageNotes:
            "Committenti delle fastose dimore a mosaico esposte oggi nei musei del Bardo e di Susa.",
        },
      ],
      keySites: [
        { name: "Hadrumetum (Susa)", role: "Capitale della provincia di Bizacena" },
        { name: "Thysdrus (El Jem)", role: "Anfiteatro colossale e capitale olivicola romana" },
        { name: "Sufetula (Sbeïtla)", role: "Templi del Campidoglio e sede del patrizio Gregorio" },
        { name: "Zaghouan (Ziqua)", role: "Tempio delle Acque e sorgente dell'acquedotto di Cartagine" },
      ],
      archivalSources: [
        "Corpus Inscriptionum Latinarum (CIL VIII) — 30.000 iscrizioni dalla Tunisia",
        "Tavola Peutingeriana e Itinerario Antonino",
        "Atti dei Concili di Cartagine di San Cipriano e Sant'Agostino",
      ],
    },
    vandale_byzantine: {
      divisions: {
        carthage_exarch: {
          name: "Sede dell'Esarcato",
          seat: "Cartagine",
          description: "Residenza dell'Esarca imperiale.",
        },
        byzacena_byz: {
          name: "Ducato Militare di Bizacena",
          seat: "Sufetula (Sbeïtla)",
          description: "Fortezze del patrizio Gregorio.",
        },
        limes_tripoli: {
          name: "Ducato di Tripolitania",
          seat: "Tacape / Leptis",
          description: "Linea di difesa sud-orientale.",
        },
      },
      leaders: [
        {
          name: "Genserico",
          role: "Re dei Vandali e degli Alani",
          reignOrDates: "428 – 477 d.C.",
          achievements:
            "Prese Cartagine nel 439, fondò il Regno vandalo d'Africa e dominò il Mediterraneo occidentale per 40 anni.",
        },
        {
          name: "Giustiniano I il Grande",
          role: "Imperatore Bizantino",
          reignOrDates: "527 – 565 d.C.",
          achievements:
            "Avviò la Riconquista dell'Africa nel 533 e istituì la Prefettura del Pretorio d'Africa.",
        },
        {
          name: "Belisario",
          role: "Generalissimo d'Oriente",
          reignOrDates: "533 – 534 d.C.",
          achievements:
            "Sconfisse l'esercito vandalo alle battaglie di Ad Decimum e Tricamaro, restituendo Cartagine all'autorità imperiale.",
        },
        {
          name: "Gregorio il Patrizio",
          role: "Esarca d'Africa",
          reignOrDates: "641 – 647 d.C.",
          achievements:
            "Proclamò l'indipendenza dell'Africa da Bisanzio e trasferì la capitale a Sufetula (Sbeïtla).",
        },
      ],
      families: [
        {
          name: "Dinastia degli Asdingi",
          role: "Casa reale vandala d'Africa",
          origin: "Cartagine e Radès",
          lineageNotes:
            "Stirpe reale germanica ariana (Genserico, Unerico, Guntamondo, Trasamondo, Ilderico, Gelimero).",
        },
        {
          name: "Aristocrazia Patrizia Bizantina",
          role: "Tribuni militari e prefetti del pretorio",
          origin: "Cartagine, Kelibia e Sufetula",
          lineageNotes:
            "Patrizi greci e latini preposti alle fortificazioni del limes bizantino.",
        },
        {
          name: "Re Mauri Autonomi",
          role: "Capi tribali dell'entroterra",
          origin: "Dorsale tunisina e Aurès",
          lineageNotes:
            "Dinastie berbere di Antalas, Cabaon e Iaudas che sfidarono e patteggiarono con gli esarchi bizantini.",
        },
      ],
      keySites: [
        { name: "Cartagine (Basiliche Cristiane)", role: "Capitale dell'Esarcato" },
        { name: "Sufetula (Sbeïtla)", role: "Battaglia decisiva del 647 contro gli eserciti musulmani" },
        { name: "Kelibia (Fortezza)", role: "Bastione marittimo bizantino" },
      ],
      archivalSources: [
        "Tavolette Albertini (45 atti notarili su legno scoperti presso Tébessa)",
        "La Iohannide di Corippo (epopea bizantina sulle guerre maure in Tunisia)",
        "Procopio di Cesarea — Storia della guerra vandalica",
      ],
    },
    omeyyade: {
      divisions: {
        koura_kairouan: {
          name: "Koura di Qayrawan",
          seat: "Qayrawan",
          description: "Centro di governo della Wilaya d'Ifriqiya.",
        },
        koura_tunis: {
          name: "Koura di Tunisi",
          seat: "Tunisi",
          description: "Arsenale marittimo e Grande Moschea della Zitouna.",
        },
        koura_sousse: {
          name: "Koura di Susa",
          seat: "Susa",
          description: "Ribat e porto navale di partenza per il Mediterraneo.",
        },
        koura_djerid: {
          name: "Koura del Jérid e Gafsa",
          seat: "Qastiliya (Tozeur)",
          description: "Oasi strategiche dell'Ifriqiya meridionale.",
        },
      },
      leaders: [
        {
          name: "Hassan Ibn al-Nu'man",
          role: "Governatore e Costruttore di Tunisi",
          reignOrDates: "692 – 703 d.C.",
          achievements:
            "Conquistò Cartagine, fondò ufficialmente la città musulmana di Tunisi, ne scavò il porto interno e costruì la Zitouna.",
        },
        {
          name: "Uqba Ibn Nafi al-Fihri",
          role: "Conquistatore dell'Ifriqiya e Fondatore",
          reignOrDates: "670 – 683 d.C.",
          achievements:
            "Fondò la città santa di Qayrawan nel 670 e la sua Grande Moschea, cardine della civiltà islamica nel Maghreb.",
        },
        {
          name: "Musa Ibn Nusayr",
          role: "Governatore Generale del Maghreb",
          reignOrDates: "705 – 714 d.C.",
          achievements:
            "Completò la pacificazione dell'Ifriqiya, armò la flotta di Tunisi e organizzò la spedizione in Al-Andalus con Tariq Ibn Ziyad.",
        },
        {
          name: "Dihya (La Kahina)",
          role: "Regina dei Berberi Jerawa",
          reignOrDates: "688 – 702 d.C.",
          achievements:
            "Figura emblematica della sovranità amazigh che unì le tribù del Sud e dell'Aurès contro gli eserciti omayyadi.",
        },
      ],
      families: [
        {
          name: "Casa dei Fihridi",
          role: "Governatori e generali d'Ifriqiya",
          origin: "Qayrawan e Medina di Tunisi",
          lineageNotes:
            "Discendenti diretti di Uqba Ibn Nafi alla guida delle spedizioni in Ifriqiya e Al-Andalus.",
        },
        {
          name: "Nobiltà Qurayshita d'Ifriqiya",
          role: "Qadi e comandanti di guarnigione",
          origin: "Qayrawan e Tunisi",
          lineageNotes:
            "Lignaggi dei Banu Makhzum e Banu Zuhra insediati nei campi militari dell'Ifriqiya.",
        },
        {
          name: "Capoclanati Awraba e Jerawa",
          role: "Capi tribali autoctoni confederati",
          origin: "Alte steppe e Aurès",
          lineageNotes:
            "Grandi famiglie berbere di Kusayla e Dihya che contribuirono poi a formare gli eserciti islamici del Maghreb.",
        },
      ],
      keySites: [
        { name: "Qayrawan (Grande Moschea di Uqba)", role: "Capitale della conquista islamica del Maghreb" },
        { name: "Tunisi (Moschea Al-Zitouna)", role: "Fondazione dell'arsenale e dell'Università Zitouna" },
        { name: "Ribat di Susa", role: "Sentinella costiera contro le incursioni bizantine" },
      ],
      archivalSources: [
        "Cronache di Futuh Ifriqiya e racconti di Ibn Abd al-Hakam",
        "Epigrafi fondative della Grande Moschea di Qayrawan (670)",
        "Iscrizioni cufiche primitive della Moschea Al-Zitouna di Tunisi (698)",
      ],
    },
    aghlabide: {
      divisions: {
        kairouan_raqqada: {
          name: "Capitale Qayrawan e Raqqada",
          seat: "Raqqada",
          description: "Sede dei palazzi emirali e dei grandi giuristi malikiti (Sahnun).",
        },
        sahel_ribats: {
          name: "Regione dei Ribat del Sahel",
          seat: "Monastir / Susa",
          description: "Ribat spirituali e arsenali marittimi aghlabidi.",
        },
        sfax_ports: {
          name: "Koura di Sfax",
          seat: "Sfax",
          description: "Mura fortificate ed esportazioni marittime.",
        },
        beja_cereales: {
          name: "Koura di Béja",
          seat: "Béja",
          description: "Polo di produzione cerealicola del Tell.",
        },
      },
      leaders: [
        {
          name: "Ibrahim I Ibn al-Aghlab",
          role: "Emiro Fondatore della Dinastia",
          reignOrDates: "800 – 812 d.C.",
          achievements:
            "Fondò l'Emirato sovrano d'Ifriqiya riconosciuto dal califfo abbaside Harun al-Rashid ed edificò Al-Abbasiyya.",
        },
        {
          name: "Ziyadat Allah I",
          role: "Emiro d'Ifriqiya e Conquistatore",
          reignOrDates: "817 – 838 d.C.",
          achievements:
            "Ricostruì sontuosamente la Moschea di Qayrawan e la Zitouna di Tunisi e ordinò la spedizione in Sicilia (827).",
        },
        {
          name: "Imam Sahnun Ibn Saïd",
          role: "Gran Qadi di Qayrawan e Giurista Supremo",
          reignOrDates: "848 – 854 d.C.",
          achievements:
            "Autore della celebre Mudawwana, codice dottrinale fondativo della scuola malikita in tutto il Maghreb e in Al-Andalus.",
        },
        {
          name: "Asad Ibn al-Furat",
          role: "Erudito, Magistrato e Comandante d'Armata",
          reignOrDates: "759 – 828 d.C.",
          achievements:
            "Discepolo di Malik e Abu Hanifa; guidò vittoriosamente lo sbarco militare in Sicilia a Mazara del Vallo.",
        },
      ],
      families: [
        {
          name: "Dinastia dei Banu al-Aghlab",
          role: "Emiri sovrani d'Ifriqiya",
          origin: "Qayrawan / Raqqada",
          lineageNotes:
            "Stirpe principesca originaria del Khorasan che regnò per oltre un secolo sulla Tunisia e sulla Sicilia.",
        },
        {
          name: "Casa dei Tanukhi (Famiglia di Sahnun)",
          role: "Giureconsulti e ulema d'Ifriqiya",
          origin: "Qayrawan e Tunisi",
          lineageNotes:
            "Lignaggio di imam e qadi che codificò la giurisprudenza malikita e guidò l'insegnamento alla Zitouna.",
        },
        {
          name: "Banu Qadim di Tunisi",
          role: "Armatori e governatori della città di Tunisi",
          origin: "Medina di Tunisi",
          lineageNotes:
            "Grandi famiglie patrizie tunisine che gestivano il porto, l'arsenale e il commercio marittimo con l'Italia.",
        },
      ],
      keySites: [
        { name: "Qayrawan (Bacini Aghlabidi)", role: "Capitale politica e faro intellettuale" },
        { name: "Raqqada", role: "Città palatina dei sovrani aghlabidi" },
        { name: "Ribat di Monastir", role: "Fortezza costiera spirituale e militare" },
      ],
      archivalSources: [
        "Manoscritto del Corano Blu di Qayrawan e pergamene della Maqsura",
        "Cronache di Ibn al-Athir e Al-Nuwayri",
        "Al-Mudawwana dell'Imam Sahnun (codice del fiqh malikita d'Ifriqiya)",
      ],
    },
    fatimide: {
      divisions: {
        mahdia_core: {
          name: "Capitale Imperiale di Mahdia",
          seat: "Mahdia",
          description: "Penisola fortificata della Skifa Kahla e porto califfale.",
        },
        sabra_mansouria: {
          name: "Sabra Al-Mansouria",
          seat: "Qayrawan Sud",
          description: "Città principesca ziride alle porte di Qayrawan.",
        },
        sfax_zirid: {
          name: "Principato di Sfax",
          seat: "Sfax",
          description: "Mura imponenti e flotta mercantile.",
        },
        gabes_oasis: {
          name: "Amilato di Gabès",
          seat: "Gabès",
          description: "Crocicchio marittimo e carovaniero.",
        },
      },
      leaders: [
        {
          name: "Ubayd Allah al-Mahdi",
          role: "Primo Califfo Fatimide",
          reignOrDates: "909 – 934 d.C.",
          achievements:
            "Fondò il Califfato fatimide in Ifriqiya ed eresse l'inespugnabile capitale marittima di Mahdia nel 916.",
        },
        {
          name: "Al-Mu'izz li-Din Allah",
          role: "Califfo Conquistatore d'Egitto",
          reignOrDates: "953 – 975 d.C.",
          achievements:
            "Conquistò l'Egitto nel 969, fondò Il Cairo e la Moschea di Al-Azhar e affidò il governo dell'Ifriqiya agli Ziridi.",
        },
        {
          name: "Bologhine Ibn Ziri",
          role: "Emiro Sovrano d'Ifriqiya",
          reignOrDates: "972 – 984 d.C.",
          achievements:
            "Fondatore della prestigiosa dinastia ziride che regnò sul Maghreb centrale e sull'Ifriqiya da Al-Mansouria.",
        },
        {
          name: "Al-Mu'izz Ibn Badis",
          role: "Emiro Ziride Restauratore del Sunnismo",
          reignOrDates: "1016 – 1062 d.C.",
          achievements:
            "Ruppe nettamente con il califfato fatimide nel 1048 per proclamare la fedeltà al califfo sunnita abbaside.",
        },
      ],
      families: [
        {
          name: "Dinastia degli Ziridi Sanhaja",
          role: "Principi regnanti a Mansouria e Mahdia",
          origin: "Achir / Mahdia",
          lineageNotes:
            "Stirpe reale berbera sanhaja che governò l'Ifriqiya per quasi due secoli.",
        },
        {
          name: "Dinastia dei Banu Khurasan",
          role: "Principi indipendenti della città di Tunisi",
          origin: "Medina di Tunisi (Dar El-Khourassani)",
          lineageNotes:
            "Sovrani illuminati di Tunisi (1059–1159) che protessero la città e svilupparono gli empori mercantili.",
        },
        {
          name: "Capoclanati Hilaliani (Riyah e Zoghba)",
          role: "Confederazioni guerriere beduine",
          origin: "Pianure di Qayrawan e steppe",
          lineageNotes:
            "Lignaggi arabi beduini che trasformarono l'arabizzazione linguistica e il popolamento delle pianure tunisine.",
        },
      ],
      keySites: [
        { name: "Mahdia", role: "Prima capitale califfale fatimide (916)" },
        { name: "Al-Mansouria (Sabra)", role: "Capitale principesca ziride" },
        { name: "Sfax", role: "Mura ziridi e grande porto mercantile" },
      ],
      archivalSources: [
        "Iscrizioni cufiche monumentali della Skifa Kahla di Mahdia (916)",
        "Scritti di Ibn Hammad e Ibn Hayyan sugli Ziridi di Sabra Al-Mansouria",
        "Fondi dei decreti fatimidi sulle pescherie di Mahdia e Kerkennah",
      ],
    },
  },
  mt: {
    punique: {
      divisions: {
        carthage_core: {
          name: "Kartaġni Metropoli",
          seat: "Kartaġni Byrsa",
          description: "Qalb politika, santwarji ta' Tanit u tarznari navali.",
        },
        chora_capbon: {
          name: "Chora ta' Cap Bon",
          seat: "Kerkouane / Aspis (Kelibia)",
          description: "Oqsma kbar agrikoli Puniċi u sajd kostali.",
        },
        medjerda_valley: {
          name: "Wied tal-Bagrada",
          seat: "Utica",
          description: "Maħżen tal-qamħ metropolitan minn Utica sa Sicca.",
        },
        byzacena_punic: {
          name: "Reġjun Kostali ta' Hadrumetum",
          seat: "Hadrumetum (Sousse)",
          description: "Posti kummerċjali u portijiet tal-merkanti Puniċi tas-Saħel.",
        },
        numidia_massyles: {
          name: "Renju tal-Massili",
          seat: "Thugga (Dougga) / Cirta",
          description: "Territorju tar-rejiet Numidi alleati ta' Kartaġni u wara ta' Massinissa.",
        },
      },
      leaders: [
        {
          name: "Annibali Barca",
          role: "Kmandant Kap u Xufet ta' Kartaġni",
          reignOrDates: "247 Q.K. – 183 Q.K.",
          achievements:
            "Ġenju militari universali, rebbieħ f'Kannaj u Trasimeno, u riformatur demokratiku tal-kostituzzjoni ta' Kartaġni.",
        },
        {
          name: "Amilkar Barca",
          role: "Strateġista u Fundatur tal-Qawwa Barċida",
          reignOrDates: "275 Q.K. – 228 Q.K.",
          achievements:
            "Kmandant kap tal-Ewwel Gwerra Punika, paċifikatur ta' Ifriqiya u konkwistatur ta' Hispanja.",
        },
        {
          name: "Mago l-Kbir",
          role: "Xufet u Fundatur tad-Dinastija Magonida",
          reignOrDates: "550 Q.K. – 530 Q.K.",
          achievements:
            "Organizzatur tal-armata ċivika u tal-eġemonija marittima ta' Kartaġni fil-Mediterran tal-Punent.",
        },
        {
          name: "Massinissa",
          role: "L-Ewwel Re tan-Numidja Unifikata",
          reignOrDates: "238 Q.K. – 148 Q.K.",
          achievements:
            "Unifikatur tar-renji Berberi Massili u Masesili, bennej tal-bliet Numidi ta' Dougga u Cirta.",
        },
      ],
      families: [
        {
          name: "Dinastija Barċida",
          role: "Aristokrazija militari, xufeti u ġenerali",
          origin: "Kartaġni Metropoli (Għolja ta' Byrsa)",
          lineageNotes:
            "Nisel ta' Amilkar, Annibali, Asdrubal u Mago li ħakmu Kartaġni u waqqfu Kartaġena.",
        },
        {
          name: "Dar il-Magonidi",
          role: "Senaturi u mexxejja tal-oligarkija Punika",
          origin: "Kartaġni",
          lineageNotes:
            "Mexxejja dominanti fil-Kunsill tal-Mija u Erbgħa mis-6 sar-4 seklu Q.K.",
        },
        {
          name: "Nisel Irjali Massili",
          role: "Rejiet Numidi tul il-Fossa Regia",
          origin: "Dougga (Thugga) / Cirta",
          lineageNotes:
            "Nisel rjali ta' Gala, Massinissa, Micipsa u Giugurta li ħakmu l-pjanuri għoljin tal-punent.",
        },
      ],
      keySites: [
        { name: "Kartaġni", role: "Kapitali imperjali metropolitana Punika" },
        { name: "Dougga (Thugga)", role: "Belt kbira Numida-Rumana (Mawżolew Libiku-Puniku)" },
        { name: "Bulla Regia", role: "Residenza tar-rejiet Numidi" },
        { name: "Kerkouane", role: "Belt Punika kostali intatta f'Cap Bon" },
      ],
      archivalSources: [
        "Iskrizzjonijiet neo-Puniċi u steli votivi tat-Tophet ta' Salammbô",
        "Kitbiet ta' Polibju, Livju u Appjanu dwar ir-rotta tal-Fossa Regia",
        "Mużajk u epigrafija Libika-Berbera ta' Bulla Regia u Dougga",
      ],
    },
    romaine: {
      divisions: {
        zeugitana: {
          name: "Afrika Żewġitana (Tramuntana)",
          seat: "Carthago Colonia",
          description: "Provinċja senatoriali prokonsolari tat-Tramuntana tat-Tuneżija.",
        },
        byzacena: {
          name: "Provinċja Biżaċena (Ċentru)",
          seat: "Hadrumetum (Sousse)",
          description: "Provinċja rikka taż-żejt taż-żebbuġa ċċentrata fuq Hadrumetum u Thysdrus.",
        },
        tripolitana: {
          name: "Tripolitanja (Nofsinhar)",
          seat: "Tacape (Gabès)",
          description: "Żona militari tal-Limes u konfini Saħarjani.",
        },
        capsa_region: {
          name: "Distrett ta' Capsa (Gafsa)",
          seat: "Capsa",
          description: "Post avvanzat tal-Limes quddiem it-tribujiet nomadi Ġetuli.",
        },
      },
      leaders: [
        {
          name: "Settimju Severu",
          role: "Imperatur Ruman mill-Afrika",
          reignOrDates: "193 – 211 W.K.",
          achievements:
            "L-ewwel imperatur Ruman ta' oriġini Afrikana; ta l-istatus ta' muniċipju jew kolonja lil ħafna bliet prokonsolari.",
        },
        {
          name: "Gordjanu I u Gordjanu II",
          role: "Prokonsli tal-Afrika u Imperaturi",
          reignOrDates: "238 W.K.",
          achievements:
            "Proklamati imperaturi Rumani miż-żgħażagħ senatoriali Afrikani f'Thysdrus (Anfiteatru ta' El Jem).",
        },
        {
          name: "Xipjun Emiljanu",
          role: "Konslu tar-Repubblika Rumana",
          reignOrDates: "146 Q.K.",
          achievements:
            "Konkwistatur ta' Byrsa u ordnatur tat-tqassim katastali tal-Fossa Regia li ddefinixxiet it-territorju Ruman.",
        },
        {
          name: "San Ċiprijanu",
          role: "Isqof u Duttur ta' Kartaġni",
          reignOrDates: "200 – 258 W.K.",
          achievements:
            "Missier il-Knisja tal-Afrika, martri taħt Valerjanu u awtur tal-ittri kanoniċi li mexxew il-Kristjaneżmu tal-Punent.",
        },
      ],
      families: [
        {
          name: "Patriċjat Senatorjali Afrikan",
          role: "Sidien tal-latifundji kbar",
          origin: "Kartaġni, Utica u Dougga",
          lineageNotes:
            "Familji kbar ekwestri u senatoriali li kienu jżommu l-pjanuri taċ-ċereali tal-Medjerda.",
        },
        {
          name: "Gens Caecilia ta' Thugga",
          role: "Benefatturi u duoviri muniċipali",
          origin: "Thugga (Dougga)",
          lineageNotes:
            "Eliti Rumani-Numidi li ffinanzjaw il-bini tal-Kapitolju u t-Teatru ta' Dougga.",
        },
        {
          name: "Patriċji ta' Hadrumetum u Thysdrus",
          role: "Esportaturi taż-żejt taż-żebbuġa tal-Biżaċena",
          origin: "Sousse (Hadrumetum) / El Jem",
          lineageNotes:
            "Patruni tad-djar lussużi bil-mużajk esposti llum fil-mużewijiet ta' Bardo u Sousse.",
        },
      ],
      keySites: [
        { name: "Hadrumetum (Sousse)", role: "Kapitali tal-provinċja tal-Biżaċena" },
        { name: "Thysdrus (El Jem)", role: "Anfiteatru kolossali u kapitali Rumana taż-żejt taż-żebbuġa" },
        { name: "Sufetula (Sbeïtla)", role: "Tempji tal-Kapitolju u sede tal-Patrizju Gregorju" },
        { name: "Zaghouan (Ziqua)", role: "Tempju tal-Ilma u bidu tal-akkwedott ta' Kartaġni" },
      ],
      archivalSources: [
        "Corpus Inscriptionum Latinarum (CIL VIII) — 30,000 iskrizzjoni mit-Tuneżija",
        "Tabula Peutingeriana u l-Itinerarju ta' Antoninu",
        "Atti tal-Konċilji ta' Kartaġni ta' San Ċiprijanu u Santu Wistin",
      ],
    },
    vandale_byzantine: {
      divisions: {
        carthage_exarch: {
          name: "Sede tal-Eżarkat",
          seat: "Kartaġni",
          description: "Residenza tal-Eżarka imperjali.",
        },
        byzacena_byz: {
          name: "Dukat Militari tal-Biżaċena",
          seat: "Sufetula (Sbeïtla)",
          description: "Fortizzi tal-Patrizju Gregorju.",
        },
        limes_tripoli: {
          name: "Dukat tat-Tripolitanja",
          seat: "Tacape / Leptis",
          description: "Linja difensiva tax-Xlokk.",
        },
      },
      leaders: [
        {
          name: "Ġenseriku",
          role: "Re tal-Vandali u l-Alani",
          reignOrDates: "428 – 477 W.K.",
          achievements:
            "Ħa Kartaġni fl-439, waqqaf ir-Renju Vandalu tal-Afrika u ħakem il-Mediterran tal-Punent għal 40 sena.",
        },
        {
          name: "Ġustinjanu I l-Kbir",
          role: "Imperatur Biżantin",
          reignOrDates: "527 – 565 W.K.",
          achievements:
            "Nieda r-Rikonkwista tal-Afrika fl-533 u waqqaf il-Prefettura Pretorjana tal-Afrika.",
        },
        {
          name: "Belisarju",
          role: "Ġeneralissmu tal-Lvant",
          reignOrDates: "533 – 534 W.K.",
          achievements:
            "Għeleb lill-armata Vandala f'Ad Decimum u Tricamarum, u rrestawra l-awtorità imperjali f'Kartaġni.",
        },
        {
          name: "Gregorju l-Patrizju",
          role: "Eżarka tal-Afrika",
          reignOrDates: "641 – 647 W.K.",
          achievements:
            "Ipproklama l-indipendenza tal-Afrika minn Biżanzju u mexxa l-kapitali lejn Sufetula (Sbeïtla).",
        },
      ],
      families: [
        {
          name: "Dinastija Hasdinga",
          role: "Dar rjali Vandala tal-Afrika",
          origin: "Kartaġni u Radès",
          lineageNotes:
            "Nisel rjali Ġermaniku Arjan (Ġenseriku, Huneriku, Guntamundu, Trasamundu, Hilderiku, Ġelimer).",
        },
        {
          name: "Aristokrazija Patrizja Biżantina",
          role: "Tribuni militari u prefetti pretorjani",
          origin: "Kartaġni, Kelibia u Sufetula",
          lineageNotes:
            "Patriċji Griegi u Latini li amministraw il-fortifikazzjonijiet tal-limes Biżantin.",
        },
        {
          name: "Rejiet Mauri Awtonomi",
          role: "Kapijiet tribali tal-intern",
          origin: "Dorsali Tuneżin u Aurès",
          lineageNotes:
            "Dinastiji Berberi ta' Antalas, Cabaon u Iaudas li sfidaw u mbagħad innegozjaw mal-eżarki Biżantini.",
        },
      ],
      keySites: [
        { name: "Kartaġni (Bażiliki Kristjani)", role: "Kapitali tal-Eżarkat" },
        { name: "Sufetula (Sbeïtla)", role: "Battalja deċiżiva tas-647 kontra l-armati Musulmani" },
        { name: "Kelibia (Fortizza)", role: "Swar marittimu Biżantin" },
      ],
      archivalSources: [
        "Tavli Albertini (45 kuntratt nutarili fuq l-injam misjuba ħdejn Tébessa)",
        "Il-Ġwanniade ta' Korippu (epopea Biżantina dwar il-gwerer Mauri fit-Tuneżija)",
        "Prokopju ta' Ċesarea — Storja tal-Gwerra Vandala",
      ],
    },
    omeyyade: {
      divisions: {
        koura_kairouan: {
          name: "Koura ta' Kairouan",
          seat: "Kairouan",
          description: "Ċentru tal-gvern tal-Wilaya ta' Ifriqiya.",
        },
        koura_tunis: {
          name: "Koura ta' Tuneż",
          seat: "Tuneż",
          description: "Arsenal marittimu u Moskea l-Kbira ta' Al-Zitouna.",
        },
        koura_sousse: {
          name: "Koura ta' Sousse",
          seat: "Sousse",
          description: "Ribat u port navali tat-tluq lejn il-Mediterran.",
        },
        koura_djerid: {
          name: "Koura tal-Jérid u Gafsa",
          seat: "Qastiliya (Tozeur)",
          description: "Oasi strateġiċi ta' Ifriqiya tan-Nofsinhar.",
        },
      },
      leaders: [
        {
          name: "Hassan Ibn al-Nu'man",
          role: "Gvernatur u Bennej ta' Tuneż",
          reignOrDates: "692 – 703 W.K.",
          achievements:
            "Konkwista Kartaġni, waqqaf uffiċjalment il-belt Musulmana ta' Tuneż, ħaffer il-port intern tagħha u bena l-Zitouna.",
        },
        {
          name: "Uqba Ibn Nafi al-Fihri",
          role: "Konkwistatur ta' Ifriqiya u Fundatur",
          reignOrDates: "670 – 683 W.K.",
          achievements:
            "Waqqaf il-belt qaddisa ta' Kairouan fis-670 u l-Moskea l-Kbira tagħha, ankra taċ-ċiviltà Iżlamika fil-Magreb.",
        },
        {
          name: "Musa Ibn Nusayr",
          role: "Gvernatur Ġenerali tal-Magreb",
          reignOrDates: "705 – 714 W.K.",
          achievements:
            "Ikkonsolida l-paċi f'Ifriqiya, arma l-flotta ta' Tuneż u organizza l-konkwista ta' Al-Andalus ma' Tariq Ibn Ziyad.",
        },
        {
          name: "Dihya (Al-Kahina)",
          role: "Reġina tal-Berberi Jerawa",
          reignOrDates: "688 – 702 W.K.",
          achievements:
            "Figura emblematika tas-sovranità Amażigħ li għaqqdet it-tribujiet tan-Nofsinhar u l-Aurès kontra l-armati Ommajjadi.",
        },
      ],
      families: [
        {
          name: "Dar il-Fihridi",
          role: "Gvernaturi u ġenerali ta' Ifriqiya",
          origin: "Kairouan u l-Medina ta' Tuneż",
          lineageNotes:
            "Dixxendenti diretti ta' Uqba Ibn Nafi li mexxew l-ispedizzjonijiet f'Ifriqiya u fi Spanja Musulmana.",
        },
        {
          name: "Nobiltà Qurayxita ta' Ifriqiya",
          role: "Qadi u kmandanti tal-gwarniġjon",
          origin: "Kairouan u Tuneż",
          lineageNotes:
            "Nisel ta' Banu Makhzum u Banu Zuhra stabbiliti fil-kampijiet militari ta' Ifriqiya.",
        },
        {
          name: "Mexxejja Awraba u Jerawa",
          role: "Kapijiet tribali awtoktoni konfederati",
          origin: "Steppi Għoljin u Aurès",
          lineageNotes:
            "Familji kbar Berberi ta' Kusayla u Dihya li aktar tard sawru l-armati Musulmani tal-Magreb.",
        },
      ],
      keySites: [
        { name: "Kairouan (Moskea l-Kbira ta' Uqba)", role: "Kapitali tal-konkwista Iżlamika tal-Magreb" },
        { name: "Tuneż (Moskea Al-Zitouna)", role: "Twaqqif tal-arsenal u tal-Università ta' Zitouna" },
        { name: "Ribat ta' Sousse", role: "Sentinella kostali kontra r-rejds Biżantini" },
      ],
      archivalSources: [
        "Kronaki ta' Futuh Ifriqiya u rakkonti ta' Ibn Abd al-Hakam",
        "Iskrizzjonijiet epigrafiċi tat-twaqqif tal-Moskea l-Kbira ta' Kairouan (670)",
        "Iskrizzjonijiet Kufiċi bikrija tal-Moskea Al-Zitouna f'Tuneż (698)",
      ],
    },
    aghlabide: {
      divisions: {
        kairouan_raqqada: {
          name: "Kapitali Kairouan u Raqqada",
          seat: "Raqqada",
          description: "Sede tal-palazzi emirali u ġuristi kbar Maliki (Sahnun).",
        },
        sahel_ribats: {
          name: "Reġjun tar-Ribats tas-Saħel",
          seat: "Monastir / Sousse",
          description: "Ribats spiritwali u arsenali marittimi Aglabidi.",
        },
        sfax_ports: {
          name: "Koura ta' Sfax",
          seat: "Sfax",
          description: "Swar fortifikati u esportazzjonijiet marittimi.",
        },
        beja_cereales: {
          name: "Koura ta' Béja",
          seat: "Béja",
          description: "Ċentru tal-produzzjoni taċ-ċereali fit-Tell.",
        },
      },
      leaders: [
        {
          name: "Ibrahim I Ibn al-Aghlab",
          role: "Emir Fundatur tad-Dinastija",
          reignOrDates: "800 – 812 W.K.",
          achievements:
            "Waqqaf l-Emirat sovran ta' Ifriqiya rikonoxxut mill-kaliff Abbasid Harun al-Rashid u bena Al-Abbasiyya.",
        },
        {
          name: "Ziyadat Allah I",
          role: "Emir ta' Ifriqiya u Konkwistatur",
          reignOrDates: "817 – 838 W.K.",
          achievements:
            "Bena mill-ġdid bil-kobor il-Moskea ta' Kairouan u ż-Zitouna ta' Tuneż u ordna l-konkwista ta' Sqallija (827).",
        },
        {
          name: "Imam Sahnun Ibn Saïd",
          role: "Gran Qadi ta' Kairouan u Ġurist Suprem",
          reignOrDates: "848 – 854 W.K.",
          achievements:
            "Awtur tal-famuża Mudawwana, kodiċi duttrinali fundatur tal-iskola Maliki madwar il-Magreb u Al-Andalus.",
        },
        {
          name: "Asad Ibn al-Furat",
          role: "Studjuż, Maġistrat u Kmandant tal-Armata",
          reignOrDates: "759 – 828 W.K.",
          achievements:
            "Dixxiplu ta' Malik u Abu Hanifa; mexxa b'suċċess l-inżul navali fi Sqallija f'Mazara del Vallo.",
        },
      ],
      families: [
        {
          name: "Dinastija tal-Banu al-Aghlab",
          role: "Emiri sovrani ta' Ifriqiya",
          origin: "Kairouan / Raqqada",
          lineageNotes:
            "Nisel prinċipesk oriġinarju minn Khorasan li ħakem fuq it-Tuneżija u Sqallija għal aktar minn seklu.",
        },
        {
          name: "Dar it-Tanukhi (Familja ta' Sahnun)",
          role: "Ġurekunsulti u studjużi ta' Ifriqiya",
          origin: "Kairouan u Tuneż",
          lineageNotes:
            "Nisel ta' imami u qadi li kkodifikaw il-ġurisprudenza Maliki u mexxew it-tagħlim f'Al-Zitouna.",
        },
        {
          name: "Banu Qadim ta' Tuneż",
          role: "Armaturi u gvernaturi tal-belt ta' Tuneż",
          origin: "Medina ta' Tuneż",
          lineageNotes:
            "Familji kbar patriċji Tuneżini li amministraw il-port, l-arsenal u l-kummerċ marittimu mal-Italja.",
        },
      ],
      keySites: [
        { name: "Kairouan (Baċiri Aglabidi)", role: "Kapitali politika u fanal intellettwali" },
        { name: "Raqqada", role: "Belt palazzjali tas-sovrani Aglabidi" },
        { name: "Ribat ta' Monastir", role: "Fortizza kostali spiritwali u militari" },
      ],
      archivalSources: [
        "Manuskritt tal-Koran Blu ta' Kairouan u parċmini tal-Maqsura",
        "Kronaki ta' Ibn al-Athir u Al-Nuwayri",
        "Al-Mudawwana tal-Imam Sahnun (kodiċi tal-fiqh Maliki ta' Ifriqiya)",
      ],
    },
    fatimide: {
      divisions: {
        mahdia_core: {
          name: "Kapitali Imperjali ta' Mahdia",
          seat: "Mahdia",
          description: "Peniżola fortifikata ta' Skifa Kahla u port kaliffali.",
        },
        sabra_mansouria: {
          name: "Sabra Al-Mansouria",
          seat: "Kairouan Nofsinhar",
          description: "Belt prinċipeska Zirida fil-bibien ta' Kairouan.",
        },
        sfax_zirid: {
          name: "Prinċipat ta' Sfax",
          seat: "Sfax",
          description: "Swar maestużi u flotta merkantili.",
        },
        gabes_oasis: {
          name: "Amilat ta' Gabès",
          seat: "Gabès",
          description: "Salib it-toroq marittimu u tal-karavani.",
        },
      },
      leaders: [
        {
          name: "Ubayd Allah al-Mahdi",
          role: "L-Ewwel Kaliff Fatimid",
          reignOrDates: "909 – 934 W.K.",
          achievements:
            "Waqqaf il-Kaliffat Fatimid f'Ifriqiya u bena l-kapitali marittima mħarsa ta' Mahdia fl-916.",
        },
        {
          name: "Al-Mu'izz li-Din Allah",
          role: "Kaliff Konkwistatur tal-Eġittu",
          reignOrDates: "953 – 975 W.K.",
          achievements:
            "Konkwista l-Eġittu fl-969, waqqaf il-Kajr u l-Moskea ta' Al-Azhar u fada t-tmexxija ta' Ifriqiya liż-Ziridi.",
        },
        {
          name: "Bologhine Ibn Ziri",
          role: "Emir Sovran ta' Ifriqiya",
          reignOrDates: "972 – 984 W.K.",
          achievements:
            "Fundatur tad-dinastija prestiġjuża Zirida li ħakmet fuq il-Magreb ċentrali u Ifriqiya minn Al-Mansouria.",
        },
        {
          name: "Al-Mu'izz Ibn Badis",
          role: "Emir Zirid Restawratur tas-Sunniżmu",
          reignOrDates: "1016 – 1062 W.K.",
          achievements:
            "Qata' r-rabta mal-kaliffat Fatimid fl-1048 biex jipproklama l-lealtà lill-kaliff Sunni Abbasid.",
        },
      ],
      families: [
        {
          name: "Dinastija taż-Ziridi Sanhaja",
          role: "Prinċpijiet li ħakmu f'Mansouria u Mahdia",
          origin: "Achir / Mahdia",
          lineageNotes:
            "Dinastija rjali Berbera Sanhaja li ggvernat Ifriqiya għal kważi żewġ sekli.",
        },
        {
          name: "Dinastija tal-Banu Khurasan",
          role: "Prinċpijiet indipendenti tal-belt ta' Tuneż",
          origin: "Medina ta' Tuneż (Dar El-Khourassani)",
          lineageNotes:
            "Sovrani mdawwlin ta' Tuneż (1059–1159) li ħarsu l-belt u żviluppaw l-istabbilimenti kummerċjali.",
        },
        {
          name: "Mexxejja Hilaljani (Riyah u Zoghba)",
          role: "Konfederazzjonijiet Bedwini ta' gwerriera",
          origin: "Pjanuri ta' Kairouan u steppi",
          lineageNotes:
            "Nisel Għarab Bedwini li biddlu l-Għarabizzazzjoni lingwistika u l-popolament tal-pjanuri Tuneżini.",
        },
      ],
      keySites: [
        { name: "Mahdia", role: "L-ewwel kapitali kaliffali Fatimida (916)" },
        { name: "Al-Mansouria (Sabra)", role: "Kapitali prinċipeska Zirida" },
        { name: "Sfax", role: "Swar Ziridi u port kummerċjali kbir" },
      ],
      archivalSources: [
        "Iskrizzjonijiet Kufiċi monumentali ta' Skifa Kahla f'Mahdia (916)",
        "Kitbiet ta' Ibn Hammad u Ibn Hayyan dwar iż-Ziridi ta' Sabra Al-Mansouria",
        "Fondi tad-digrieti Fatimidi dwar is-sajd ta' Mahdia u Kerkennah",
      ],
    },
  },
};

