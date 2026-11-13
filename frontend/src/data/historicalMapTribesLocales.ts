export interface TribeLocaleTranslation {
  name: string;
  caidat1881?: string;
  capital?: string;
  homelandDescription: string;
  fractions?: string[];
  alliances?: string;
  majbaSources?: string;
  archivalCotes?: string[];
}

export const HISTORICAL_TRIBES_LOCALES: Record<
  string,
  Record<string, TribeLocaleTranslation>
> = {
  en: {
    ouerghemma: {
      name: "Ouerghemma",
      caidat1881: "Qaidate of Ouerghemma (Médenine / Jebel Dahar)",
      capital: "Médenine (Ksar Médenine)",
      homelandDescription:
        "Vast southeastern warrior confederation controlling the Jeffara plains, Jebel Dahar, and the Tripolitanian frontier.",
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
        "Southern Alliance (Leff Saff el-Ouerghemma) / Guardians of the Saharan caravan routes.",
      majbaSources:
        "1860 Majba tax registers (ANT Kasbah Dahar Series) and Ksour population rolls.",
      archivalCotes: [
        "ANT Kasbah — Qaidate of Ouerghemma Holdings (Calls 142/A to 148/D)",
        "Notarial Sijills of the Adoul of Ben Gardane and Tataouine",
        "Military Archives of Médenine (Southern Territories 1890–1912)",
      ],
    },
    jlass: {
      name: "Jlass (Zlass)",
      caidat1881: "Qaidate of Jlass (Kairouan)",
      capital: "Kairouan / Oueslatia",
      homelandDescription:
        "Powerful central confederation occupying the vast plain of Kairouan and the foothills of Jebel Oueslat.",
      fractions: [
        "Ouled Iddir",
        "Ouled Khelifa",
        "Ouled Sanad",
        "Beni Zid el-Kairouan",
        "Ouled Mansour",
      ],
      alliances:
        "Traditionally allied with the beylical Makhzen during the semi-annual Mahalla tax expeditions.",
      majbaSources:
        "1860–1869 Majba census (ANT Kairouan Series, 18,420 heads of household enumerated).",
      archivalCotes: [
        "ANT Kasbah — Sharia Sijill Registers of Kairouan (1750–1881)",
        "Habous Holdings of Sidi Sahbi and the Great Mosque",
        "Adoul Deeds of the Sbikha and Haffouz Plain",
      ],
    },
    fraichiche: {
      name: "Fraichiche",
      caidat1881: "Qaidate of Fraichiche (Thala & Kasserine)",
      capital: "Feriana / Thala",
      homelandDescription:
        "Mountain confederation of the High Steppes around Jebel Chambi and the plateaus of Feriana and Thelepte.",
      fractions: [
        "Ouled Ouezzen",
        "Ouled Ali Ben Aoun",
        "Ouled Naji",
        "Beni Ghorbal",
        "Ouled Guesmia",
      ],
      alliances:
        "Leff of Fraichiche / Historical rivals of the Majer for control of steppe pastures.",
      majbaSources:
        "1860 Majba tax rolls of the Fraichiche Qaidate — Kasserine and Sbeïtla repositories.",
      archivalCotes: [
        "ANT Kasbah — Dossiers of the Qaids of Feriana and Thala (Beylical Series 220)",
        "Sharia Court of Sbeïtla — Territorial Boundary Deeds",
      ],
    },
    majer: {
      name: "Majer",
      caidat1881: "Qaidate of Majer (High Steppes)",
      capital: "Thala / Rohia",
      homelandDescription:
        "Major warrior confederation occupying the borderland corridor between El Kef, Thala, and the Algerian frontier.",
      fractions: [
        "Ouled Messaoud",
        "Ouled Amor",
        "Kouache",
        "Ouled Helal",
      ],
      alliances: "Major defensive alliance with the tribes of the Medjerda valley.",
      majbaSources: "Majba Rolls of Thala (1860) — Central Repository of La Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Beylical Series Qaidate of Thala (Calls 88 to 94)",
        "Qadi Sijills of El Kef and Haïdra",
      ],
    },
    hamama: {
      name: "Hamama",
      caidat1881: "Qaidate of Hamama (Sidi Bouzid & Gafsa)",
      capital: "Sidi Bouzid / Northern Gafsa",
      homelandDescription:
        "Extensive confederation of the southern steppes stretching from the foothills of Gafsa to the Sidi Bouzid basin.",
      fractions: [
        "Ouled Aziz",
        "Ouled Radouane",
        "Ouled Moumen",
        "Ouled Souissi",
        "Ouled Slimane",
      ],
      alliances:
        "Leff of Hamama (Saff opposed to the Fraichiche in pastoral conflicts).",
      majbaSources: "1860 Census of the Gafsa and Sidi Bouzid region (ANT).",
      archivalCotes: [
        "ANT Kasbah — Qaidate of Hamama Holdings (Calls 105 to 112)",
        "Tax Registers of the Southern Mahalla",
      ],
    },
    nefzaoua: {
      name: "Nefzaoua",
      caidat1881: "Qaidate of Nefzaoua (Kebili)",
      capital: "Kebili / Douz",
      homelandDescription:
        "Ancient Berbero-Arab oasis and Saharan confederation, masters of the palm groves of Chott el-Jérid and Nefzaoua.",
      fractions: [
        "Marazig (Douz)",
        "Adhara",
        "Gharib",
        "Sabria",
        "Beni Zid el-Jérid",
      ],
      alliances: "Saharan confederation of caravaneers and oasis guardians.",
      majbaSources: "Majba Accounting of the Oases (1860) — ANT Kasbah Series.",
      archivalCotes: [
        "ANT Kasbah — Beylical Series Southern Oases (Calls 171 to 176)",
        "Oral Archives of the Marazig of Douz",
      ],
    },
    drid: {
      name: "Drid",
      caidat1881: "Qaidate of Drid (Medjerda Plain & Béja)",
      capital: "Béja / Testour",
      homelandDescription:
        "Cavalry Makhzen confederation settled in the fertile Medjerda valley to escort beylical convoys and secure the wheat granary.",
      fractions: [
        "Ouled Sidi Abid",
        "Ouled Arfa",
        "Ouled Manai",
        "Drid el-Makhzen",
      ],
      alliances: "Privileged Makhzen cavalry tribe serving the Beys of Tunis.",
      majbaSources: "Dedicated Tax Rolls of the Drid Cavalry (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Drid Makhzen Holdings (Beylical Series 44)",
        "Sharia Court of Béja",
      ],
    },
    ouled_ayar: {
      name: "Ouled Ayar",
      caidat1881: "Qaidate of Ouled Ayar (Makthar & Siliana)",
      capital: "Makthar (Mactaris) / Kesra",
      homelandDescription:
        "High-plateau confederation of Makthar and Jebel Kesra, renowned for its steeds and mountain warriors.",
      fractions: [
        "Ouled Salem",
        "Ouled Bou Ali",
        "Ouled Amor Ben Ali",
        "Ouled Khelil",
      ],
      alliances: "Alliance of the central Tell high plateaus.",
      majbaSources: "Majba Rolls of the Qaidate of Makthar (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Beylical Series Makthar (Call 131)",
        "Adoul Registers of Kesra and Siliana",
      ],
    },
    souassi: {
      name: "Souassi",
      caidat1881: "Qaidate of Souassi (Southern Sahel & Mahdia)",
      capital: "Es-Souassi / Ksour Essef",
      homelandDescription:
        "Major agro-pastoral confederation occupying the fertile plains of the Mahdia Sahel hinterland.",
      fractions: [
        "Ouled Moulahem",
        "Ouled Amor",
        "Ouled Zid",
        "Ouled Belhassen",
        "Chouachna",
      ],
      alliances: "Linked to the port-city network of the Sahel (Mahdia, Sfax).",
      majbaSources: "Majba Rolls of Mahdia and Souassi (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Souassi Registers (Call 82)",
        "Sharia Court of Mahdia",
      ],
    },
    beni_zid: {
      name: "Beni Zid",
      caidat1881: "Qaidate of Beni Zid (El Hamma & Gabès)",
      capital: "El Hamma / Metouia",
      homelandDescription:
        "Southern warrior tribe occupying the thermal plain of El Hamma and the hills bordering the Gulf of Gabès.",
      fractions: [
        "Chouarekh",
        "Zemzem",
        "Ouled Douis",
        "Hazem",
        "Smaala",
      ],
      alliances: "Pact with the maritime tribes of Gabès and the Jeffara.",
      majbaSources: "Majba Rolls of El Hamma of Gabès (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Beylical Series Gabès (Call 118)",
        "Sharia Court of El Hamma",
      ],
    },
    mogod: {
      name: "Mogod",
      caidat1881: "Qaidate of Mogod (Western Bizerte)",
      capital: "Sejnane / Nefza",
      homelandDescription:
        "Mountain tribe of the cork-oak forests and rugged northwestern coastline between Bizerte and Tabarka.",
      fractions: ["Ouled Mefdah", "Ouled Kassem", "Ouled Bou Baker"],
      alliances: "Coastal guardians of the northern littoral.",
      majbaSources: "Majba Rolls of the Mogods (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Qaidate of Mogod Holdings (Call 31)",
        "Municipal Archives of Sejnane",
      ],
    },
    khmir: {
      name: "Khmir (Kroumirs)",
      caidat1881: "Qaidate of Khmir (Aïn Draham & Tabarka)",
      capital: "Aïn Draham / Fernana",
      homelandDescription:
        "Confederation of the dense Kroumirie forests renowned for its resistance to expeditions and mastery of rugged mountain terrain.",
      fractions: [
        "Ouled Soltane",
        "Ouled Selim",
        "Ouled Theljane",
        "Ouled Khelil",
      ],
      alliances: "Mountaineer alliance of the Kroumirie range.",
      majbaSources: "Census Rolls of Tabarka and Aïn Draham (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Beylical Series Kroumirie (Call 19)",
        "General Residency Registers of Tabarka",
      ],
    },
    metallit: {
      name: "Metallit",
      caidat1881: "Qaidate of Metallit (Northern Sfax / El Jem)",
      capital: "Jbeniana / El Jem",
      homelandDescription:
        "Pastoral and olive-growing tribe bridging the Sahel and the Sfax basin.",
      fractions: ["Ouled Slimane", "Ouled Brahim", "Ouled Moussa"],
      alliances: "Allied with Sfaxian and Mahdian merchants.",
      majbaSources: "Olive-grove cadastre and 1860 Majba rolls — ANT.",
      archivalCotes: [
        "ANT Kasbah — Qaidate of Metallit Holdings",
        "Sijills of El Jem",
      ],
    },
    riah_chabbia: {
      name: "Riah & Chabbia (Jérid)",
      caidat1881: "Qaidate of the Jérid (Tozeur / Nefta)",
      capital: "Tozeur / Nefta",
      homelandDescription:
        "Prominent oasis families and lineages of the Jérid, Zitouna scholars, Chorfa, and trans-Saharan merchants.",
      fractions: [
        "Chorfa of Nefta",
        "Beni Ali",
        "Ouled Sidi Bouali",
        "Awlad Chebbi",
      ],
      alliances: "Sufi spiritual and intellectual radiance (Zawiyas of Nefta and Tozeur).",
      majbaSources: "Hydraulic cadastre of Ibn Chabbat and 1860 oasis Majba.",
      archivalCotes: [
        "ANT Kasbah — Irrigation Water and Habous Registers of the Jérid",
        "Notarial Sijills of Tozeur (Jérid Scholars Holdings)",
      ],
    },
    ouled_said: {
      name: "Ouled Saïd",
      caidat1881: "Qaidate of Ouled Saïd (Enfidha)",
      capital: "Enfidha (Dar El Bey) / Takrouna",
      homelandDescription:
        "Tribe of the Enfidha estate occupying the fertile plains bordering the Gulf of Hammamet and the Berber village of Takrouna.",
      fractions: ["Ouled Abdallah", "Ouled Mehdi", "Ouled Slimane", "Takrouna"],
      alliances: "Attached to the historic beylical estate of Enfidha.",
      majbaSources: "Enfidha Estate Litigation Dossier (1879–1880) and Majba rolls.",
      archivalCotes: [
        "ANT Kasbah — Enfidha Domain Holdings (Call 55/B)",
        "Notarial Archives of Sousse and Zaghouan",
      ],
    },
    matmata_djebalia: {
      name: "Matmata & Djebalia",
      caidat1881: "Qaidate of Djebalia (Matmata Mountains)",
      capital: "Matmata / Toujane",
      homelandDescription:
        "Troglodyte Zenata Berbers of the southern mountain ridges, famous for their fortified hilltop villages.",
      fractions: [
        "Old Matmata",
        "Toujane",
        "Tamezret",
        "Taoujout",
        "Beni Aïssa",
      ],
      alliances: "Mountain defensive pact of the Djebalia.",
      majbaSources: "Poll-tax registers of the troglodyte villages (1860).",
      archivalCotes: [
        "ANT Kasbah — Qaidate of Djebalia Holdings",
        "Oral and Notarial Archives of Toujane and Tamezret",
      ],
    },
    massyles: {
      name: "Massylian Numidians",
      capital: "Thugga (Dougga)",
      homelandDescription:
        "Great Numidian Berber people of the northern interior, founders of the unified Numidian kingdom.",
      fractions: ["Massyli of Thugga", "Numidians of Bulla Regia", "Sicca"],
      alliances: "Kingdom of Massinissa.",
      archivalCotes: [
        "Bilingual Libyco-Punic stelae of Dougga",
        "Corpus Inscriptionum Semiticarum",
      ],
    },
    cinithii: {
      name: "Cinithii & Ancient Libyans",
      capital: "Gigthis (Bougrara)",
      homelandDescription:
        "Autochthonous Libyco-Berber people of the Gulf of Gabès and the Jeffara plain.",
      fractions: ["Gigthis", "Zita", "Meninx (Djerba)"],
      alliances: "Southern Punic trading posts.",
      archivalCotes: ["Dedicatory inscriptions of Gigthis", "Writings of Ptolemy"],
    },
    musulamii: {
      name: "Musulamii",
      capital: "Ammaedara (Haïdra)",
      homelandDescription:
        "Great rebellious Berber confederation led by Tacfarinas against Roman rule.",
      fractions: ["Warriors of Thelepte", "Ammaedara", "Sufetula"],
      alliances: "Revolt of Tacfarinas (AD 17–24).",
      archivalCotes: ["Annals of Tacitus", "Inscriptions of Haïdra (CIL VIII)"],
    },
    getules: {
      name: "Gaetuli & Garamantes",
      capital: "Thiges / Nefta",
      homelandDescription:
        "Southern nomadic tribes controlling caravan trails beyond Chott el-Jérid and the Limes.",
      fractions: ["Nomads of the Jérid", "Chott el-Fejaj", "Dahar"],
      alliances: "Frontier pacts with Limes commanders.",
      archivalCotes: ["CIL VIII — Military inscriptions of Bezereos"],
    },
    maures_byz: {
      name: "Mauri & Laguatan (Leuathae)",
      capital: "Jebel Oueslat / Byzacena",
      homelandDescription:
        "Great Berber confederations resisting Byzantine authority under Antalas and Cabaon.",
      fractions: ["Leuathae", "Frexes", "Astrices"],
      alliances: "Moorish wars against Solomon and John Troglita.",
      archivalCotes: ["Iohannis by Corippus (6th century)", "Albertini Tablets"],
    },
    berberes_lawata: {
      name: "Lawata & Hawwara",
      capital: "Gafsa / Kairouan",
      homelandDescription:
        "Major Berber tribes of Ifriqiya joining the armies of Islam and embracing Arabization.",
      fractions: ["Plain Lawata", "Oasis Hawwara", "Zenata"],
      alliances: "Participation in the campaigns of Uqba and Musa Ibn Nusayr.",
      archivalCotes: ["Futuh Ifriqiya by Al-Waqidi", "History of Ibn Khaldun"],
    },
    arabes_jund: {
      name: "Arab Jund & Kairouanese Notables",
      capital: "Kairouan",
      homelandDescription:
        "Families of the Arab Jund of Abbasid origin and founding Maliki jurists.",
      fractions: ["Banu Tamim", "Banu Asad", "Notables of the Maqsura"],
      alliances: "Supporters of the Aghlabid emiral state.",
      archivalCotes: [
        "Al-Mudawwana by Imam Sahnun (Kairouan)",
        "Parchments of the Maqsura",
      ],
    },
    sanhadja_zirid: {
      name: "Sanhaja & Zirids",
      capital: "Sabra Al-Mansuriya",
      homelandDescription:
        "Great Sanhaja Berber dynasty ruling Ifriqiya with splendor and chivalry.",
      fractions: ["Banu Ziri", "Banu Hammad", "Talkata"],
      alliances: "Ruling Zirid dynasty.",
      archivalCotes: [
        "Ibn Hayyan — Al-Muqtabis",
        "Ibn Khaldun — History of the Berbers",
      ],
    },
    banu_hilal: {
      name: "Banu Hilal & Banu Sulaym",
      capital: "Kairouan Plain / Sbeïtla",
      homelandDescription:
        "Great nomadic Arab confederations settling in Ifriqiya from 1051, reshaping the tribal tapestry.",
      fractions: ["Athbaj", "Riyah", "Zoghba", "Banu Ali"],
      alliances: "Hilalian Epic (Taghribat Bani Hilal).",
      archivalCotes: [
        "Sirat Bani Hilal manuscripts",
        "Chronicles of Ibn al-Athir",
      ],
    },
    masmouda_hintata: {
      name: "Hintata & Masmuda",
      capital: "The Kasbah of Tunis",
      homelandDescription:
        "Almohad military and doctrinal aristocracy from which the lineage of Hafsid emirs emerged.",
      fractions: ["Banu Hafs", "Hintata", "Tinmel"],
      alliances: "Founding sheikhs of the Hafsid dynasty.",
      archivalCotes: [
        "Kitab al-Ansab by Ibn al-Qattan",
        "Almohad documents of Al-Zitouna",
      ],
    },
    riah_hafside: {
      name: "Confederation of Riah & Chabbia",
      capital: "Tozeur / Kairouan",
      homelandDescription:
        "Great Bedouin chieftains and Sufi spiritual masters of the Jérid and central steppe under the Hafsids.",
      fractions: ["Awlad Chebbi", "Riah", "Banu Ali"],
      alliances: "Complex relations between Makhzen alliance and oasis autonomy.",
      archivalCotes: ["Ibn Khaldun — Kitab al-Ibar", "Zitouna Sijills"],
    },
    andalous_testour: {
      name: "Moriscos & Andalusians of Tunis",
      capital: "Testour / Zaghouan / Soliman",
      homelandDescription:
        "Andalusian scholars, architects, and agronomists welcomed by the Hafsid sultans, creators of gardens and ornate mosques.",
      fractions: ["Andalusians of Testour", "Soliman", "Zaghouan", "Bardo"],
      alliances: "Hafsid royal charters and habous endowments.",
      archivalCotes: [
        "Morisco notarial deeds of Testour",
        "National Library of Tunisia",
      ],
    },
  },
  ar: {
    ouerghemma: {
      name: "الورغمة",
      caidat1881: "قيادة الورغمة (مدنين / جبل الظاهر)",
      capital: "مدنين (قصر مدنين)",
      homelandDescription:
        "كونفدرالية محاربة كبرى بالجنوب الشرقي التونسي تسيطر على سهول الجفارة وجبل الظاهر وتخوم طرابلس.",
      fractions: [
        "التوازين (بن قردان)",
        "الشداد",
        "الخزور",
        "أونيفة",
        "غمراسن",
        "الدويرات",
        "شنني",
      ],
      alliances: "حلف الجنوب (لف صف الورغمة) / حماة مسالك القوافل الصحراوية.",
      majbaSources: "دفاتر جباية المجبى لعام 1860 (الأرشيف الوطني بالقصبة — سلسلة الظاهر) وإحصاء القصور.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — رصيد قيادة الورغمة (العلب 142/أ إلى 148/د)",
        "السجلات العدلية لعدول بن قردان وتطاوين",
        "الأرشيف العسكري بمدنين (أقاليم الجنوب 1890–1912)",
      ],
    },
    jlass: {
      name: "الجلاص / الزلاص",
      caidat1881: "قيادة الجلاص (القيروان)",
      capital: "القيروان / الوسلاتية",
      homelandDescription:
        "كونفدرالية وسطى كبرى تشغل سهل القيروان الفسيح وسفوح جبل وسلات.",
      fractions: [
        "أولاد إيدير",
        "أولاد خليفة",
        "أولاد سند",
        "بني زيد القيروان",
        "أولاد منصور",
      ],
      alliances: "حليفة تقليدية للمخزن البايليكي خلال حملات المحلّة الجبائية.",
      majbaSources: "إحصاء المجبى 1860–1869 (سلسلة القيروان بالأرشيف الوطني: 18,420 رب عائلة محصياً).",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — سجلات المحكمة الشرعية بالقيروان (1750–1881)",
        "أرصدة أحباس سيدي الصحبي والجامع الكبير",
        "عقود عدول سهل السبيخة وحفوز",
      ],
    },
    fraichiche: {
      name: "الفراشيش",
      caidat1881: "قيادة الفراشيش (تالة والقصرين)",
      capital: "فريانة / تالة",
      homelandDescription:
        "كونفدرالية جبلية بالسباسب العليا حول جبل الشعانبي وهضاب فريانة وتلبت.",
      fractions: [
        "أولاد وزّان",
        "أولاد علي بن عون",
        "أولاد ناجي",
        "بني غربال",
        "أولاد قاسمية",
      ],
      alliances: "لف الفراشيش / المنافس التاريخي لقبيلة ماجر على المراعي بالسباسب.",
      majbaSources: "دفاتر مجبى عام 1860 لقيادة الفراشيش — مخازن القصرين وسبيطلة.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — ملفات قياد فريانة وتالة (السلسلة البايليكية 220)",
        "المحكمة الشرعية بسبيطلة — عقود الحدود الترابية",
      ],
    },
    majer: {
      name: "ماجر",
      caidat1881: "قيادة ماجر (السباسب العليا)",
      capital: "تالة / الروحية",
      homelandDescription:
        "كونفدرالية محاربة كبرى تشغل الممر الحدودي بين الكاف وتالة والحدود الجزائرية.",
      fractions: ["أولاد مسعود", "أولاد عمر", "الكواش", "أولاد هلال"],
      alliances: "تحالف دفاعي وثيق مع قبائل وادي مجردة.",
      majbaSources: "دفاتر مجبى تالة (1860) — المستودع المركزي بالقصبة.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — السلسلة البايليكية لقيادة تالة (العلب 88 إلى 94)",
        "سجلات قضاة الكاف وحيدرة",
      ],
    },
    hamama: {
      name: "الهمامة",
      caidat1881: "قيادة الهمامة (سيدي بوزيد وقفصة)",
      capital: "سيدي بوزيد / شمال قفصة",
      homelandDescription:
        "كونفدرالية شاسعة بالسباسب الجنوبية تمتد من سفوح قفصة إلى حوض سيدي بوزيد.",
      fractions: [
        "أولاد عزيز",
        "أولاد رضوان",
        "أولاد مومن",
        "أولاد السويسي",
        "أولاد سليمان",
      ],
      alliances: "لف الهمامة (الصف المقابل للفراشيش في النزاعات الرعوية).",
      majbaSources: "إحصاء عام 1860 لمنطقة قفصة وسيدي بوزيد (الأرشيف الوطني).",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — رصيد قيادة الهمامة (العلب 105 إلى 112)",
        "الدفاتر الجبائية لمحلّة الجنوب",
      ],
    },
    nefzaoua: {
      name: "نفزاوة",
      caidat1881: "قيادة نفزاوة (قبلي)",
      capital: "قبلي / دوز",
      homelandDescription:
        "كونفدرالية واحية وصحراوية عريقة بربرية-عربية، سيدة واحات النخيل بشط الجريد ونفزاوة.",
      fractions: [
        "المرازيق (دوز)",
        "العذارة",
        "غريب",
        "صابرية",
        "بني زيد الجريد",
      ],
      alliances: "كونفدرالية صحراوية للقوافل وحماة الواحات.",
      majbaSources: "حسابات مجبى الواحات (1860) — سلسلة القصبة بالأرشيف الوطني.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — السلسلة البايليكية لواحات الجنوب (العلب 171 إلى 176)",
        "الأرشيف الشفوي لقبيلة المرازيق بدوز",
      ],
    },
    drid: {
      name: "دريد",
      caidat1881: "قيادة دريد (سهل مجردة وباجة)",
      capital: "باجة / تستور",
      homelandDescription:
        "كونفدرالية مخزنية من الفرسان استقرت بسهل مجردة الخصب لمرافقة قوافل البايات وتأمين مطمور القمح.",
      fractions: [
        "أولاد سيدي عبيد",
        "أولاد عرفة",
        "أولاد مناعي",
        "دريد المخزن",
      ],
      alliances: "قبيلة مخزن مفضّلة لدى بايات تونس.",
      majbaSources: "الدفاتر الجبائية الخاصة بفرسان دريد (1860) — الأرشيف الوطني بالقصبة.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — رصيد مخزن دريد (السلسلة البايليكية 44)",
        "المحكمة الشرعية بباجة",
      ],
    },
    ouled_ayar: {
      name: "أولاد عيار",
      caidat1881: "قيادة أولاد عيار (مكثر وسليانة)",
      capital: "مكثر (مكتريس) / كسرى",
      homelandDescription:
        "كونفدرالية الهضاب العليا بمكثر وجبل كسرى، اشتهرت بخيولها ومحاربي الجبال.",
      fractions: ["أولاد سالم", "أولاد بو علي", "أولاد عمر بن علي", "أولاد خليل"],
      alliances: "تحالف الهضاب العليا للتل الأوسط.",
      majbaSources: "دفاتر مجبى قيادة مكثر (1860) — الأرشيف الوطني بالقصبة.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — السلسلة البايليكية لمكثر (العلبة 131)",
        "سجلات عدول كسرى وسليانة",
      ],
    },
    souassi: {
      name: "السواسي",
      caidat1881: "قيادة السواسي (الساحل الجنوبي والمهدية)",
      capital: "السواسي / قصور الساف",
      homelandDescription:
        "كونفدرالية زراعية رعوية كبرى تشغل السهول الخصبة بالظهير الداخلي لساحل المهدية.",
      fractions: [
        "أولاد مولاهم",
        "أولاد عمر",
        "أولاد زيد",
        "أولاد بلحسن",
        "الشواشنة",
      ],
      alliances: "مرتبطة بشبكة الموانئ الساحلية (المهدية وصفاقس).",
      majbaSources: "دفاتر مجبى المهدية والسواسي (1860) — الأرشيف الوطني.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — سجلات السواسي (العلبة 82)",
        "المحكمة الشرعية بالمهدية",
      ],
    },
    beni_zid: {
      name: "بني زيد",
      caidat1881: "قيادة بني زيد (الحامة وقابس)",
      capital: "الحامة / المطوية",
      homelandDescription:
        "قبيلة محاربة بالجنوب تشغل سهل الحامة الحراري والتلال المطلة على خليج قابس.",
      fractions: ["الشوارخ", "زمزم", "أولاد دويس", "حازم", "السمالة"],
      alliances: "ميثاق تحالف مع القبائل الساحلية بقابس والجفارة.",
      majbaSources: "دفاتر مجبى حامة قابس (1860) — الأرشيف الوطني.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — السلسلة البايليكية لقابس (العلبة 118)",
        "المحكمة الشرعية بالحامة",
      ],
    },
    mogod: {
      name: "المقاعد",
      caidat1881: "قيادة المقاعد (غرب بنزرت)",
      capital: "سجنان / نفزة",
      homelandDescription:
        "قبيلة جبلية بغابات بلوط الفلين والساحل الصخري الوعر بالشمال الغربي بين بنزرت وطبرقة.",
      fractions: ["أولاد مفداح", "أولاد قاسم", "أولاد بو بكر"],
      alliances: "حماة السواحل التونسية الشمالية.",
      majbaSources: "دفاتر مجبى المقاعد (1860) — الأرشيف الوطني بالقصبة.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — رصيد قيادة المقاعد (العلبة 31)",
        "الأرشيف البلدي بسجنان",
      ],
    },
    khmir: {
      name: "خمير (الكرومرية)",
      caidat1881: "قيادة خمير (عين دراهم وطبرقة)",
      capital: "عين دراهم / فرنانة",
      homelandDescription:
        "كونفدرالية غابات الكرومرية الكثيفة، اشتهرت بمقاومتها للحملات وتمكّنها من التضاريس الجبلية الوعرة.",
      fractions: [
        "أولاد سلطان",
        "أولاد سليم",
        "أولاد ثلجان",
        "أولاد خليل",
      ],
      alliances: "تحالف جبلي لسلسلة جبال خمير.",
      majbaSources: "دفاتر إحصاء طبرقة وعين دراهم (1860) — الأرشيف الوطني.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — السلسلة البايليكية لخمير (العلبة 19)",
        "سجلات الإقامة العامة بطبرقة",
      ],
    },
    metallit: {
      name: "المثاليث",
      caidat1881: "قيادة المثاليث (شمال صفاقس / الجم)",
      capital: "جبنيانة / الجم",
      homelandDescription:
        "قبيلة رعوية وزيتونية بين الساحل وحوض صفاقس.",
      fractions: ["أولاد سليمان", "أولاد إبراهيم", "أولاد موسى"],
      alliances: "حليفة لتجار صفاقس والمهدية.",
      majbaSources: "السجل العقاري لغابات الزيتون ودفاتر مجبى 1860 — الأرشيف الوطني.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — رصيد قيادة المثاليث",
        "سجلات الجم العدلية",
      ],
    },
    riah_chabbia: {
      name: "رياح والشابية (الجريد)",
      caidat1881: "قيادة الجريد (توزر / نفطة)",
      capital: "توزر / نفطة",
      homelandDescription:
        "كبرى العائلات والسلالات الواحية بالجريد، من علماء الزيتونة والأشراف وتجار القوافل الصحراوية.",
      fractions: ["أشراف نفطة", "بنو علي", "أولاد سيدي بوعلي", "أولاد الشابي"],
      alliances: "إشعاع روحي وفكري صوفي (زوايا نفطة وتوزر).",
      majbaSources: "السجل المائي لابن الشباط ومجبى الواحات لعام 1860.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — سجلات مياه الري وأحباس الجريد",
        "السجلات العدلية بتوزر (رصيد علماء الجريد)",
      ],
    },
    ouled_said: {
      name: "أولاد سعيد",
      caidat1881: "قيادة أولاد سعيد (النفيضة)",
      capital: "النفيضة (دار الباي) / تكرونة",
      homelandDescription:
        "قبيلة هنشير النفيضة، تشغل السهول الخصبة المطلة على خليج الحمامات والقرية الأمازيغية بتكرونة.",
      fractions: ["أولاد عبد الله", "أولاد مهدي", "أولاد سليمان", "تكرونة"],
      alliances: "تابعة تاريخياً لهنشير النفيضة البايليكي.",
      majbaSources: "ملف قضية هنشير النفيضة (1879–1880) ودفاتر المجبى.",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — رصيد هنشير النفيضة (العلبة 55/ب)",
        "الأرشيف التوثيقي بسوسة وزغوان",
      ],
    },
    matmata_djebalia: {
      name: "مطماطة وجبالية",
      caidat1881: "قيادة الجبالية (جبال مطماطة)",
      capital: "مطماطة / توجان",
      homelandDescription:
        "أمازيغ زناتة من سكان البيوت المحفورة على القمم الجبلية بالجنوب، اشتهروا بقراهم المحصنة.",
      fractions: ["مطماطة القديمة", "توجان", "تمزرط", "تاوجوت", "بني عيسى"],
      alliances: "حلف دفاعي جبلي للقرى الجبالية.",
      majbaSources: "دفاتر جباية الرقاب للقرى الجبلية (1860).",
      archivalCotes: [
        "الأرشيف الوطني بالقصبة — رصيد قيادة الجبالية",
        "الأرشيف الشفوي والعدلي بتوجان وتمزرط",
      ],
    },
    massyles: {
      name: "النوميد الماسيل",
      capital: "دقة (ثوغا)",
      homelandDescription:
        "شعب أمازيغي نوميدي عظيم بالداخل الشمالي، مؤسس المملكة النوميدية الموحدة.",
      fractions: ["ماسيل دقة", "نوميد بولا ريجيا", "سيكا (الكاف)"],
      alliances: "مملكة ماسينيسا.",
      archivalCotes: [
        "النصب الليبية الثنائية اللغة بدقة",
        "مدونة النقائش السامية (CIS)",
      ],
    },
    cinithii: {
      name: "السينيثيون والليبيون القدامى",
      capital: "جكتيس (بوغرارة)",
      homelandDescription:
        "شعب ليبي-أمازيغي أصيل بخليج قابس وسهل الجفارة.",
      fractions: ["جكتيس", "زيتا", "مينينكس (جربة)"],
      alliances: "المرافئ التجارية البونية بالجنوب.",
      archivalCotes: ["النقائش الإهدائية بجكتيس", "نصوص بطليموس الجغرافي"],
    },
    musulamii: {
      name: "الموسولاميون",
      capital: "أمويدرة (حيدرة)",
      homelandDescription:
        "كونفدرالية أمازيغية ثائرة كبرى قادها تاكفاريناس ضد الهيمنة الرومانية.",
      fractions: ["محاربو تلبت", "أمويدرة (حيدرة)", "سفيطلة (سبيطلة)"],
      alliances: "ثورة تاكفاريناس (17–24 م).",
      archivalCotes: ["حوليات تاسيتوس", "نقائش حيدرة اللاتينية (CIL VIII)"],
    },
    getules: {
      name: "الجيتول والغرامنت",
      capital: "تيغيس / نفطة",
      homelandDescription:
        "قبائل رحّل بالجنوب تسيطر على المسالك الصحراوية خلف شط الجريد والليمس الروماني.",
      fractions: ["رحّل الجريد", "شط الفجاج", "الظاهر"],
      alliances: "مواثيق حدودية مع قادة الليمس.",
      archivalCotes: ["CIL VIII — النقائش العسكرية ببزيريوس"],
    },
    maures_byz: {
      name: "قبائل المور واللواتة",
      capital: "جبل وسلات / بيزاسينا",
      homelandDescription:
        "كونفدراليات أمازيغية كبرى قاومت السلطة البيزنطية بقيادة أنطالاس وكاباو.",
      fractions: ["اللواتة", "الفريكس", "الأستريس"],
      alliances: "حروب المور ضد سليمان ويوحنا تروغليتا.",
      archivalCotes: ["ملحمة اليوحناوية لكوريبوس (القرن 6)", "ألواح ألبرتيني"],
    },
    berberes_lawata: {
      name: "قبائل لواتة وهوّارة",
      capital: "قفصة / القيروان",
      homelandDescription:
        "قبائل أمازيغية كبرى بإفريقية انضمت إلى جيوش الفتح الإسلامي وشاركت في التعريب والحضارة.",
      fractions: ["لواتة السهل", "هوّارة الواحات", "زناتة"],
      alliances: "المشاركة في حملات عقبة بن نافع وموسى بن نصير.",
      archivalCotes: ["فتوح إفريقية للواقدي", "تاريخ ابن خلدون"],
    },
    arabes_jund: {
      name: "الجند العربي وأعيان القيروان",
      capital: "القيروان",
      homelandDescription:
        "عائلات الجند العربي ذات الأصول العباسية والفقهاء المالكيون المؤسسون.",
      fractions: ["بنو تميم", "بنو أسد", "أعيان المقصورة"],
      alliances: "دعامة السلطة الأميرية الأغلبية.",
      archivalCotes: ["المدوّنة للإمام سحنون (القيروان)", "رقوق المقصورة القيروانية"],
    },
    sanhadja_zirid: {
      name: "صنهاجة وبنو زيري",
      capital: "صبرة المنصورية",
      homelandDescription:
        "سلالة أمازيغية صنهاجية عظيمة حكمت إفريقية بأبهة وشجاعة فائقة.",
      fractions: ["بنو زيري", "بنو حماد", "تلكاتة"],
      alliances: "السلالة الزيرية الحاكمة.",
      archivalCotes: ["ابن حيان — المقتبس", "ابن خلدون — كتاب العبر"],
    },
    banu_hilal: {
      name: "بنو هلال وبنو سليم",
      capital: "سهل القيروان / سبيطلة",
      homelandDescription:
        "كونفدراليات عربية رحّل كبرى استقرت بإفريقية بدءاً من سنة 1051 وأعادت تشكيل الخريطة القبلية.",
      fractions: ["الأثبج", "رياح", "زغبة", "بنو علي"],
      alliances: "التغريبة الهلالية (سيرة بني هلال).",
      archivalCotes: ["مخطوطات سيرة بني هلال", "تاريخ الكامل لابن الأثير"],
    },
    masmouda_hintata: {
      name: "هنتاتة ومصمودة",
      capital: "قصبة تونس",
      homelandDescription:
        "الأرستقراطية العسكرية والعقائدية الموحدية التي انبثقت منها سلالة الأمراء الحفصيين.",
      fractions: ["بنو حفص", "هنتاتة", "تينمل"],
      alliances: "الشيوخ المؤسسون للدولة الحفصية.",
      archivalCotes: ["كتاب الأنساب لابن القطان", "وثائق الموحدين بجامع الزيتونة"],
    },
    riah_hafside: {
      name: "قبائل رياح والشابية بالجريد",
      capital: "توزر / القيروان",
      homelandDescription:
        "كبار شيوخ البدو والأقطاب الصوفية بالجريد والسباسب الوسطى في العهد الحفصي.",
      fractions: ["أولاد الشابي", "رياح", "بنو علي"],
      alliances: "علاقات متشابكة بين تحالف المخزن والاستقلالية الواحية.",
      archivalCotes: ["ابن خلدون — كتاب العبر", "السجلات الزيتونية"],
    },
    andalous_testour: {
      name: "الأندلسيون الموريسكيون بتونس",
      capital: "تستور / زغوان / سليمان",
      homelandDescription:
        "علماء ومعماريون وفلاحون أندلسيون استقبلهم السلاطين الحفصيون، مبدعو الجنان والمساجد الفنية.",
      fractions: ["أندلسيو تستور", "سليمان", "زغوان", "باردو"],
      alliances: "الظهائر الملكية الحفصية والأحباس.",
      archivalCotes: ["العقود العدلية الموريسكية بتستور", "المكتبة الوطنية التونسية"],
    },
  },
  es: {
    ouerghemma: {
      name: "Ouerghemma",
      caidat1881: "Caidato de los Ouerghemma (Médenine / Jebel Dahar)",
      capital: "Médenine (Ksar Médenine)",
      homelandDescription:
        "Vasta confederación guerrera del sureste que controlaba las llanuras de la Jeffara, el Jebel Dahar y la frontera tripolitana.",
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
        "Alianza del Sur (Leff Saff el-Ouerghemma) / Guardianes de las rutas caravaneras saharianas.",
      majbaSources:
        "Registros fiscales de la Majba de 1860 (Serie ANT Kasbah Dahar) y censos de los Ksour.",
      archivalCotes: [
        "ANT Kasbah — Fondos Caidato de Ouerghemma (Signaturas 142/A a 148/D)",
        "Sijills Notariales de los Adules de Ben Gardane y Tataouine",
        "Archivos Militares de Médenine (Territorios del Sur 1890–1912)",
      ],
    },
    jlass: {
      name: "Jlass (Zlass)",
      caidat1881: "Caidato de los Jlass (Kairuán)",
      capital: "Kairuán / Oueslatia",
      homelandDescription:
        "Poderosa confederación central que ocupa la extensa llanura de Kairuán y las estribaciones del Jebel Oueslat.",
      fractions: [
        "Ouled Iddir",
        "Ouled Khelifa",
        "Ouled Sanad",
        "Beni Zid el-Kairouan",
        "Ouled Mansour",
      ],
      alliances:
        "Tradicionalmente aliada del Majzén beylical durante las expediciones fiscales de la Mahalla.",
      majbaSources:
        "Censo de la Majba 1860–1869 (Serie ANT Kairuán, 18.420 cabezas de familia censados).",
      archivalCotes: [
        "ANT Kasbah — Registros de los Sijills Islámicos de Kairuán (1750–1881)",
        "Fondos de los Habús de Sidi Sahbi y la Gran Mezquita",
        "Actas de Adules de la llanura de Sbikha y Haffouz",
      ],
    },
    fraichiche: {
      name: "Fraichiche",
      caidat1881: "Caidato de los Fraichiche (Thala y Kasserine)",
      capital: "Feriana / Thala",
      homelandDescription:
        "Confederación montañosa de las altas estepas alrededor del Jebel Chambi y las mesetas de Feriana y Thelepte.",
      fractions: [
        "Ouled Ouezzen",
        "Ouled Ali Ben Aoun",
        "Ouled Naji",
        "Beni Ghorbal",
        "Ouled Guesmia",
      ],
      alliances:
        "Leff de los Fraichiche / Rival histórica de los Majer por el control de los pastos esteparios.",
      majbaSources:
        "Listados fiscales de la Majba (1860) del Caidato de los Fraichiche — depósitos de Kasserine y Sbeïtla.",
      archivalCotes: [
        "ANT Kasbah — Expedientes de los Caídes de Feriana y Thala (Serie Beylical 220)",
        "Tribunal de la Charia de Sbeïtla — Actas de límites territoriales",
      ],
    },
    majer: {
      name: "Majer",
      caidat1881: "Caidato de los Majer (Altas Estepas)",
      capital: "Thala / Rohia",
      homelandDescription:
        "Gran confederación guerrera que ocupa el corredor fronterizo entre El Kef, Thala y la frontera argelina.",
      fractions: ["Ouled Messaoud", "Ouled Amor", "Kouache", "Ouled Helal"],
      alliances: "Gran alianza defensiva con las tribus del valle del Medjerda.",
      majbaSources: "Listas de la Majba de Thala (1860) — Depósito central de La Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylical Caidato de Thala (Signaturas 88 a 94)",
        "Sijills de los cadíes de El Kef y Haïdra",
      ],
    },
    hamama: {
      name: "Hamama",
      caidat1881: "Caidato de los Hamama (Sidi Bouzid y Gafsa)",
      capital: "Sidi Bouzid / Gafsa Norte",
      homelandDescription:
        "Vasta confederación de las estepas meridionales que se extiende desde las estribaciones de Gafsa hasta la cuenca de Sidi Bouzid.",
      fractions: [
        "Ouled Aziz",
        "Ouled Radouane",
        "Ouled Moumen",
        "Ouled Souissi",
        "Ouled Slimane",
      ],
      alliances:
        "Leff de los Hamama (Saff opuesto a los Fraichiche en los conflictos pastorales).",
      majbaSources: "Censo de 1860 de la región de Gafsa y Sidi Bouzid (ANT).",
      archivalCotes: [
        "ANT Kasbah — Fondos Caidato de los Hamama (Signaturas 105 a 112)",
        "Registros fiscales de la Mahalla del Sur",
      ],
    },
    nefzaoua: {
      name: "Nefzaoua",
      caidat1881: "Caidato de Nefzaoua (Kébili)",
      capital: "Kébili / Douz",
      homelandDescription:
        "Antigua confederación oasiana y sahariana berebero-árabe, dueña de los palmerales del Chott el-Jérid y del Nefzaoua.",
      fractions: [
        "Marazig (Douz)",
        "Adhara",
        "Gharib",
        "Sabria",
        "Beni Zid el-Jérid",
      ],
      alliances: "Confederación sahariana de caravaneros y guardianes de los oasis.",
      majbaSources: "Contabilidad de la Majba de los Oasis (1860) — Serie ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylical Oasis del Sur (Signaturas 171 a 176)",
        "Archivos orales de los Marazig de Douz",
      ],
    },
    drid: {
      name: "Drid",
      caidat1881: "Caidato de los Drid (Llanura del Medjerda y Béja)",
      capital: "Béja / Testour",
      homelandDescription:
        "Confederación majzén ecuestre establecida en la fértil llanura del Medjerda para escoltar convoyes beylicales y custodiar el granero triguero.",
      fractions: [
        "Ouled Sidi Abid",
        "Ouled Arfa",
        "Ouled Manai",
        "Drid el-Majzén",
      ],
      alliances: "Tribu majzén privilegiada al servicio de los Beyes de Túnez.",
      majbaSources: "Listas fiscales específicas de la caballería Drid (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Fondos Majzén de los Drid (Serie Beylical 44)",
        "Tribunal de la Charia de Béja",
      ],
    },
    ouled_ayar: {
      name: "Ouled Ayar",
      caidat1881: "Caidato de los Ouled Ayar (Makthar y Siliana)",
      capital: "Makthar (Mactaris) / Kesra",
      homelandDescription:
        "Confederación de las altas mesetas de Makthar y del Jebel Kesra, célebre por sus corceles y guerreros de montaña.",
      fractions: [
        "Ouled Salem",
        "Ouled Bou Ali",
        "Ouled Amor Ben Ali",
        "Ouled Khelil",
      ],
      alliances: "Alianza de las altas mesetas del Tell central.",
      majbaSources: "Listas de la Majba del Caidato de Makthar (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylical Makthar (Signatura 131)",
        "Registros de Adules de Kesra y Siliana",
      ],
    },
    souassi: {
      name: "Souassi",
      caidat1881: "Caidato de los Souassi (Sahel Sur y Mahdia)",
      capital: "Es-Souassi / Ksour Essef",
      homelandDescription:
        "Importante confederación agropastoral que ocupa las fértiles llanuras del interior del Sahel de Mahdia.",
      fractions: [
        "Ouled Moulahem",
        "Ouled Amor",
        "Ouled Zid",
        "Ouled Belhassen",
        "Chouachna",
      ],
      alliances: "Vinculada a la red de ciudades portuarias del Sahel (Mahdia, Sfax).",
      majbaSources: "Listas de la Majba de Mahdia y Souassi (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Registros de los Souassi (Signatura 82)",
        "Tribunal de la Charia de Mahdia",
      ],
    },
    beni_zid: {
      name: "Beni Zid",
      caidat1881: "Caidato de los Beni Zid (El Hamma y Gabès)",
      capital: "El Hamma / Metouia",
      homelandDescription:
        "Tribu guerrera del sur que ocupa la llanura termal de El Hamma y las colinas que bordean el golfo de Gabès.",
      fractions: ["Chouarekh", "Zemzem", "Ouled Douis", "Hazem", "Smaala"],
      alliances: "Pacto con las tribus marítimas de Gabès y la Jeffara.",
      majbaSources: "Listas de la Majba de El Hamma de Gabès (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylical Gabès (Signatura 118)",
        "Tribunal de la Charia de El Hamma",
      ],
    },
    mogod: {
      name: "Mogod",
      caidat1881: "Caidato de los Mogods (Bizerta Oeste)",
      capital: "Sejnane / Nefza",
      homelandDescription:
        "Tribu montañesa de los alcornocales y el litoral escarpado del noroeste entre Bizerta y Tabarka.",
      fractions: ["Ouled Mefdah", "Ouled Kassem", "Ouled Bou Baker"],
      alliances: "Guardianes costeros del litoral septentrional.",
      majbaSources: "Listas de la Majba de los Mogods (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Fondos Caidato de los Mogods (Signatura 31)",
        "Archivos municipales de Sejnane",
      ],
    },
    khmir: {
      name: "Khmir (Kroumires)",
      caidat1881: "Caidato de los Khmirs (Aïn Draham y Tabarka)",
      capital: "Aïn Draham / Fernana",
      homelandDescription:
        "Confederación de los densos bosques de Kroumirie célebre por su resistencia frente a expediciones y dominio del relieve montañoso.",
      fractions: [
        "Ouled Soltane",
        "Ouled Selim",
        "Ouled Theljane",
        "Ouled Khelil",
      ],
      alliances: "Alianza montañesa de la cordillera de Kroumirie.",
      majbaSources: "Listas censales de Tabarka y Aïn Draham (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylical Kroumirie (Signatura 19)",
        "Registros de la Residencia General de Tabarka",
      ],
    },
    metallit: {
      name: "Metallit",
      caidat1881: "Caidato de los Metallit (Sfax Norte / El Jem)",
      capital: "Jbeniana / El Jem",
      homelandDescription:
        "Tribu pastoral y oleícola entre el Sahel y la cuenca de Sfax.",
      fractions: ["Ouled Slimane", "Ouled Brahim", "Ouled Moussa"],
      alliances: "Aliada de los comerciantes sfaxíes y de Mahdia.",
      majbaSources: "Catastro oleícola y listas de la Majba de 1860 — ANT.",
      archivalCotes: [
        "ANT Kasbah — Fondos Caidato de los Metallit",
        "Sijills de El Jem",
      ],
    },
    riah_chabbia: {
      name: "Riah y Chabbia (Jérid)",
      caidat1881: "Caidato del Jérid (Tozeur / Nefta)",
      capital: "Tozeur / Nefta",
      homelandDescription:
        "Grandes familias y linajes oasianos del Jérid, eruditos de la Zitouna, jerifes y comerciantes transaharianos.",
      fractions: [
        "Jerifes de Nefta",
        "Beni Ali",
        "Ouled Sidi Bouali",
        "Awlad Chebbi",
      ],
      alliances:
        "Irradiación espiritual e intelectual sufí (zawiyas de Nefta y Tozeur).",
      majbaSources: "Catastro hidráulico de Ibn Chabbat y Majba oasiana de 1860.",
      archivalCotes: [
        "ANT Kasbah — Registros de Aguas de Riego y Habús del Jérid",
        "Sijills notariales de Tozeur (fondos de los eruditos del Jérid)",
      ],
    },
    ouled_said: {
      name: "Ouled Saïd",
      caidat1881: "Caidato de los Ouled Saïd (Enfidha)",
      capital: "Enfidha (Dar El Bey) / Takrouna",
      homelandDescription:
        "Tribu del dominio de Enfidha que ocupa las llanuras fértiles que bordean el golfo de Hammamet y el pueblo bereber de Takrouna.",
      fractions: ["Ouled Abdallah", "Ouled Mehdi", "Ouled Slimane", "Takrouna"],
      alliances: "Vinculada al dominio histórico beylical de Enfidha.",
      majbaSources: "Expediente del Litigio de Enfidha (1879–1880) y listas de la Majba.",
      archivalCotes: [
        "ANT Kasbah — Fondos del Dominio de Enfidha (Signatura 55/B)",
        "Archivos notariales de Susa y Zaghouan",
      ],
    },
    matmata_djebalia: {
      name: "Matmata y Djebalia",
      caidat1881: "Caidato de los Djebalia (Montes de Matmata)",
      capital: "Matmata / Toujane",
      homelandDescription:
        "Bereberes zenetes trogloditas de las crestas montañosas del sur, célebres por sus pueblos fortificados.",
      fractions: [
        "Antigua Matmata",
        "Toujane",
        "Tamezret",
        "Taoujout",
        "Beni Aïssa",
      ],
      alliances: "Pacto defensivo montañés de los Djebalia.",
      majbaSources: "Registros de capitación de los pueblos trogloditas (1860).",
      archivalCotes: [
        "ANT Kasbah — Fondos Caidato de los Djebalia",
        "Archivos orales y notariales de Toujane y Tamezret",
      ],
    },
    massyles: {
      name: "Numidas Masilios",
      capital: "Thugga (Dougga)",
      homelandDescription:
        "Gran pueblo bereber numida del interior septentrional, fundadores del reino numida unificado.",
      fractions: ["Masilios de Thugga", "Numidas de Bulla Regia", "Sicca"],
      alliances: "Reino de Masinisa.",
      archivalCotes: [
        "Estelas líbicas bilingües de Dougga",
        "Corpus Inscriptionum Semiticarum",
      ],
    },
    cinithii: {
      name: "Cinithii y Libios Antiguos",
      capital: "Gigthis (Bougrara)",
      homelandDescription:
        "Pueblo líbico-bereber autóctono del golfo de Gabès y la llanura de la Jeffara.",
      fractions: ["Gigthis", "Zita", "Meninx (Djerba)"],
      alliances: "Factorías púnicas del sur.",
      archivalCotes: ["Inscripciones dedicatorias de Gigthis", "Textos de Ptolomeo"],
    },
    musulamii: {
      name: "Musulamios",
      capital: "Ammaedara (Haïdra)",
      homelandDescription:
        "Gran confederación bereber rebelde liderada por Tacfarinas contra la dominación romana.",
      fractions: ["Guerreros de Thelepte", "Ammaedara", "Sufetula"],
      alliances: "Revuelta de Tacfarinas (17–24 d. C.).",
      archivalCotes: ["Anales de Tácito", "Inscripciones de Haïdra (CIL VIII)"],
    },
    getules: {
      name: "Gétulos y Garamantes",
      capital: "Thiges / Nefta",
      homelandDescription:
        "Tribus nómadas del sur que controlaban las rutas más allá del Chott el-Jérid y el Limes.",
      fractions: ["Nómadas del Jérid", "Chott el-Fejaj", "Dahar"],
      alliances: "Pactos fronterizos con los comandantes del Limes.",
      archivalCotes: ["CIL VIII — Inscripciones militares de Bezereos"],
    },
    maures_byz: {
      name: "Mauros y Leuathae",
      capital: "Jebel Oueslat / Bizacena",
      homelandDescription:
        "Grandes confederaciones bereberes reacias a la autoridad bizantina bajo Antalas y Cabaón.",
      fractions: ["Leuathae", "Frexes", "Astrices"],
      alliances: "Guerras mauras contra Salomón y Juan Troglita.",
      archivalCotes: ["La Johánide de Coripo (siglo VI)", "Tablillas Albertini"],
    },
    berberes_lawata: {
      name: "Lawata y Hawwara",
      capital: "Gafsa / Kairuán",
      homelandDescription:
        "Grandes tribus bereberes de Ifriqiya que se sumaron a los ejércitos del Islam y adoptaron la arabización.",
      fractions: ["Lawata de la llanura", "Hawwara de los oasis", "Zenata"],
      alliances: "Participación en las campañas de Uqba y Musa Ibn Nusair.",
      archivalCotes: ["Futuh Ifriqiya de Al-Waqidi", "Historia de Ibn Jaldún"],
    },
    arabes_jund: {
      name: "Yund Árabe y Notables Kairuaníes",
      capital: "Kairuán",
      homelandDescription:
        "Familias del Yund árabe de origen abasí y juristas malikíes fundadores.",
      fractions: ["Banu Tamim", "Banu Asad", "Notables de la Maqsura"],
      alliances: "Respaldo al poder emiral aglabí.",
      archivalCotes: [
        "Al-Mudawwana del Imam Sahnún (Kairuán)",
        "Pergaminos de la Maqsura",
      ],
    },
    sanhadja_zirid: {
      name: "Sanhadja y Ziríes",
      capital: "Sabra Al-Mansouria",
      homelandDescription:
        "Gran dinastía bereber sanhadji que reinó sobre Ifriqiya con esplendor y valentía.",
      fractions: ["Banu Ziri", "Banu Hammad", "Talkata"],
      alliances: "Dinastía reinante zirí.",
      archivalCotes: [
        "Ibn Hayyan — Al-Muqtabis",
        "Ibn Jaldún — Historia de los Bereberes",
      ],
    },
    banu_hilal: {
      name: "Banu Hilal y Banu Sulaym",
      capital: "Llanura de Kairuán / Sbeïtla",
      homelandDescription:
        "Grandes confederaciones árabes nómadas asentadas en Ifriqiya desde 1051, reconfigurando el mapa tribal.",
      fractions: ["Athbaj", "Riyah", "Zoghba", "Banu Ali"],
      alliances: "Epopeya hilalí (Taghribat Bani Hilal).",
      archivalCotes: [
        "Manuscritos de Sirat Bani Hilal",
        "Relatos de Ibn al-Athir",
      ],
    },
    masmouda_hintata: {
      name: "Hintata y Masmouda",
      capital: "La Kasbah de Túnez",
      homelandDescription:
        "Aristocracia militar y doctrinal almohade de la que surgió el linaje de los emires hafsíes.",
      fractions: ["Banu Hafs", "Hintata", "Tinmel"],
      alliances: "Jeques fundadores de la dinastía hafsí.",
      archivalCotes: [
        "Kitab al-Ansab de Ibn al-Qattan",
        "Documentos almohades de Al-Zitouna",
      ],
    },
    riah_hafside: {
      name: "Confederación de Riah y Chabbia",
      capital: "Tozeur / Kairuán",
      homelandDescription:
        "Grandes jefes beduinos y maestros espirituales sufíes del Jérid y la estepa central bajo los hafsíes.",
      fractions: ["Awlad Chebbi", "Riah", "Banu Ali"],
      alliances: "Relaciones complejas entre alianza majzén y autonomía de los oasis.",
      archivalCotes: ["Ibn Jaldún — Kitab al-Ibar", "Sijills de la Zitouna"],
    },
    andalous_testour: {
      name: "Moriscos y Andalusíes de Túnez",
      capital: "Testour / Zaghouan / Soliman",
      homelandDescription:
        "Eruditos, arquitectos y agricultores andalusíes acogidos por los sultanes hafsíes, creadores de huertos y mezquitas artísticas.",
      fractions: ["Andalusíes de Testour", "Soliman", "Zaghouan", "Bardo"],
      alliances: "Privilegios reales hafsíes y habús.",
      archivalCotes: [
        "Actas notariales moriscas de Testour",
        "Biblioteca Nacional de Túnez",
      ],
    },
  },
  it: {
    ouerghemma: {
      name: "Ouerghemma",
      caidat1881: "Caidato degli Ouerghemma (Médenine / Jebel Dahar)",
      capital: "Médenine (Ksar Médenine)",
      homelandDescription:
        "Vasta confederazione guerriera del sud-est che controllava le pianure della Jeffara, il Jebel Dahar e la frontiera tripolitana.",
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
        "Alleanza del Sud (Leff Saff el-Ouerghemma) / Guardiani delle piste carovaniere sahariane.",
      majbaSources:
        "Registri fiscali della Majba del 1860 (Serie ANT Kasbah Dahar) e censimento degli Ksour.",
      archivalCotes: [
        "ANT Kasbah — Fondi Caidato di Ouerghemma (Segnature 142/A–148/D)",
        "Sijill Notarili degli Adul di Ben Gardane e Tataouine",
        "Archivi Militari di Médenine (Territori del Sud 1890–1912)",
      ],
    },
    jlass: {
      name: "Jlass (Zlass)",
      caidat1881: "Caidato dei Jlass (Qayrawan)",
      capital: "Qayrawan / Oueslatia",
      homelandDescription:
        "Potente confederazione centrale che occupa la vasta piana di Qayrawan e i contrafforti del Jebel Oueslat.",
      fractions: [
        "Ouled Iddir",
        "Ouled Khelifa",
        "Ouled Sanad",
        "Beni Zid el-Kairouan",
        "Ouled Mansour",
      ],
      alliances:
        "Tradizionalmente alleata al Makhzen beylicale durante le spedizioni fiscali della Mahalla.",
      majbaSources:
        "Censimento della Majba 1860–1869 (Serie ANT Qayrawan, 18.420 capifamiglia censiti).",
      archivalCotes: [
        "ANT Kasbah — Registri dei Sijill della Sharia di Qayrawan (1750–1881)",
        "Fondi degli Habous di Sidi Sahbi e della Grande Moschea",
        "Atti degli Adul della piana di Sbikha e Haffouz",
      ],
    },
    fraichiche: {
      name: "Fraichiche",
      caidat1881: "Caidato dei Fraichiche (Thala e Kasserine)",
      capital: "Feriana / Thala",
      homelandDescription:
        "Confederazione montana delle alte steppe attorno al Jebel Chambi e agli altopiani di Feriana e Thelepte.",
      fractions: [
        "Ouled Ouezzen",
        "Ouled Ali Ben Aoun",
        "Ouled Naji",
        "Beni Ghorbal",
        "Ouled Guesmia",
      ],
      alliances:
        "Leff dei Fraichiche / Storica rivale dei Majer per il controllo dei pascoli di steppa.",
      majbaSources:
        "Ruoli fiscali della Majba (1860) del Caidato dei Fraichiche — depositi di Kasserine e Sbeïtla.",
      archivalCotes: [
        "ANT Kasbah — Fascicoli dei Caid di Feriana e Thala (Serie Beylicale 220)",
        "Tribunale della Sharia di Sbeïtla — Atti di confini territoriali",
      ],
    },
    majer: {
      name: "Majer",
      caidat1881: "Caidato dei Majer (Alte Steppe)",
      capital: "Thala / Rohia",
      homelandDescription:
        "Grande confederazione guerriera che occupa il corridoio di frontiera tra El Kef, Thala e il confine algerino.",
      fractions: ["Ouled Messaoud", "Ouled Amor", "Kouache", "Ouled Helal"],
      alliances: "Grande alleanza difensiva con le tribù della valle della Medjerda.",
      majbaSources: "Ruoli della Majba di Thala (1860) — Deposito centrale della Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylicale Caidato di Thala (Segnature 88–94)",
        "Sijill dei qadi di El Kef e Haïdra",
      ],
    },
    hamama: {
      name: "Hamama",
      caidat1881: "Caidato degli Hamama (Sidi Bouzid e Gafsa)",
      capital: "Sidi Bouzid / Gafsa Nord",
      homelandDescription:
        "Vasta confederazione delle steppe meridionali che si estende dalle pendici di Gafsa fino al bacino di Sidi Bouzid.",
      fractions: [
        "Ouled Aziz",
        "Ouled Radouane",
        "Ouled Moumen",
        "Ouled Souissi",
        "Ouled Slimane",
      ],
      alliances:
        "Leff degli Hamama (Saff opposto ai Fraichiche nei conflitti pastorali).",
      majbaSources: "Censimento del 1860 della regione di Gafsa e Sidi Bouzid (ANT).",
      archivalCotes: [
        "ANT Kasbah — Fondi Caidato degli Hamama (Segnature 105–112)",
        "Registri fiscali della Mahalla del Sud",
      ],
    },
    nefzaoua: {
      name: "Nefzaoua",
      caidat1881: "Caidato del Nefzaoua (Kébili)",
      capital: "Kébili / Douz",
      homelandDescription:
        "Antica confederazione oasiana e sahariana berbero-araba, signora dei palmeti dello Chott el-Jérid e del Nefzaoua.",
      fractions: [
        "Marazig (Douz)",
        "Adhara",
        "Gharib",
        "Sabria",
        "Beni Zid el-Jérid",
      ],
      alliances: "Confederazione sahariana dei carovanieri e custodi delle oasi.",
      majbaSources: "Contabilità della Majba delle Oasi (1860) — Serie ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylicale Oasi del Sud (Segnature 171–176)",
        "Archivi orali dei Marazig di Douz",
      ],
    },
    drid: {
      name: "Drid",
      caidat1881: "Caidato dei Drid (Piana della Medjerda e Béja)",
      capital: "Béja / Testour",
      homelandDescription:
        "Confederazione makhzen di cavalleria insediata nella fertile valle della Medjerda per scortare i convogli beylicali e proteggere il granaio.",
      fractions: [
        "Ouled Sidi Abid",
        "Ouled Arfa",
        "Ouled Manai",
        "Drid el-Makhzen",
      ],
      alliances: "Tribù makhzen privilegiata dai Bey di Tunisi.",
      majbaSources: "Ruoli fiscali dedicati alla cavalleria dei Drid (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Fondi Makhzen dei Drid (Serie Beylicale 44)",
        "Tribunale della Sharia di Béja",
      ],
    },
    ouled_ayar: {
      name: "Ouled Ayar",
      caidat1881: "Caidato degli Ouled Ayar (Makthar e Siliana)",
      capital: "Makthar (Mactaris) / Kesra",
      homelandDescription:
        "Confederazione degli altipiani di Makthar e del Jebel Kesra, rinomata per i cavalli e i guerrieri di montagna.",
      fractions: [
        "Ouled Salem",
        "Ouled Bou Ali",
        "Ouled Amor Ben Ali",
        "Ouled Khelil",
      ],
      alliances: "Alleanza degli altipiani del Tell centrale.",
      majbaSources: "Ruoli Majba del Caidato di Makthar (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylicale Makthar (Segnatura 131)",
        "Registri degli Adul di Kesra e Siliana",
      ],
    },
    souassi: {
      name: "Souassi",
      caidat1881: "Caidato dei Souassi (Sahel Sud e Mahdia)",
      capital: "Es-Souassi / Ksour Essef",
      homelandDescription:
        "Importante confederazione agropastorale che occupa le fertili pianure dell'entroterra del Sahel di Mahdia.",
      fractions: [
        "Ouled Moulahem",
        "Ouled Amor",
        "Ouled Zid",
        "Ouled Belhassen",
        "Chouachna",
      ],
      alliances: "Collegata alla rete delle città portuali del Sahel (Mahdia, Sfax).",
      majbaSources: "Ruoli della Majba di Mahdia e Souassi (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Registri dei Souassi (Segnatura 82)",
        "Tribunale della Sharia di Mahdia",
      ],
    },
    beni_zid: {
      name: "Beni Zid",
      caidat1881: "Caidato dei Beni Zid (El Hamma e Gabès)",
      capital: "El Hamma / Metouia",
      homelandDescription:
        "Tribù guerriera del sud che occupa la piana termale di El Hamma e le colline lungo il golfo di Gabès.",
      fractions: ["Chouarekh", "Zemzem", "Ouled Douis", "Hazem", "Smaala"],
      alliances: "Patto con le tribù marittime di Gabès e della Jeffara.",
      majbaSources: "Ruoli della Majba di El Hamma di Gabès (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylicale Gabès (Segnatura 118)",
        "Tribunale della Sharia di El Hamma",
      ],
    },
    mogod: {
      name: "Mogod",
      caidat1881: "Caidato dei Mogods (Biserta Ovest)",
      capital: "Sejnane / Nefza",
      homelandDescription:
        "Tribù montana delle foreste di sughero e del litorale scosceso del nord-ovest tra Biserta e Tabarka.",
      fractions: ["Ouled Mefdah", "Ouled Kassem", "Ouled Bou Baker"],
      alliances: "Custodi costieri del litorale settentrionale.",
      majbaSources: "Ruoli Majba dei Mogods (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Fondi Caidato dei Mogods (Segnatura 31)",
        "Archivi comunali di Sejnane",
      ],
    },
    khmir: {
      name: "Khmir (Kroumiri)",
      caidat1881: "Caidato dei Khmir (Aïn Draham e Tabarka)",
      capital: "Aïn Draham / Fernana",
      homelandDescription:
        "Confederazione delle fitte foreste della Kroumirie celebre per la resistenza alle spedizioni e il dominio del rilievo montuoso.",
      fractions: [
        "Ouled Soltane",
        "Ouled Selim",
        "Ouled Theljane",
        "Ouled Khelil",
      ],
      alliances: "Alleanza dei montanari della catena della Kroumirie.",
      majbaSources: "Ruoli censuari di Tabarka e Aïn Draham (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Serie Beylicale Kroumirie (Segnatura 19)",
        "Registri della Residenza Generale di Tabarka",
      ],
    },
    metallit: {
      name: "Metallit",
      caidat1881: "Caidato dei Metallit (Sfax Nord / El Jem)",
      capital: "Jbeniana / El Jem",
      homelandDescription:
        "Tribù pastorale e olivicola tra il Sahel e il bacino di Sfax.",
      fractions: ["Ouled Slimane", "Ouled Brahim", "Ouled Moussa"],
      alliances: "Alleata ai mercanti di Sfax e Mahdia.",
      majbaSources: "Catasto olivicolo e ruoli Majba 1860 — ANT.",
      archivalCotes: [
        "ANT Kasbah — Fondi Caidato dei Metallit",
        "Sijill di El Jem",
      ],
    },
    riah_chabbia: {
      name: "Riah e Chabbia (Jérid)",
      caidat1881: "Caidato del Jérid (Tozeur / Nefta)",
      capital: "Tozeur / Nefta",
      homelandDescription:
        "Grandi famiglie e lignaggi oasiani del Jérid, sapienti della Zitouna, sceriffi e mercanti transahariani.",
      fractions: [
        "Sceriffi di Nefta",
        "Beni Ali",
        "Ouled Sidi Bouali",
        "Awlad Chebbi",
      ],
      alliances:
        "Irraggiamento spirituale e intellettuale sufi (zawiye di Nefta e Tozeur).",
      majbaSources: "Catasto idraulico di Ibn Chabbat e Majba delle oasi del 1860.",
      archivalCotes: [
        "ANT Kasbah — Registri delle Acque irrigue e Habous del Jérid",
        "Sijill notarili di Tozeur (fondi dei letterati del Jérid)",
      ],
    },
    ouled_said: {
      name: "Ouled Saïd",
      caidat1881: "Caidato degli Ouled Saïd (Enfidha)",
      capital: "Enfidha (Dar El Bey) / Takrouna",
      homelandDescription:
        "Tribù del dominio di Enfidha che occupa le fertili pianure sul golfo di Hammamet e il villaggio berbero di Takrouna.",
      fractions: ["Ouled Abdallah", "Ouled Mehdi", "Ouled Slimane", "Takrouna"],
      alliances: "Legata allo storico dominio beylicale di Enfidha.",
      majbaSources: "Fascicolo della Vertenza di Enfidha (1879–1880) e ruoli Majba.",
      archivalCotes: [
        "ANT Kasbah — Fondi del Dominio di Enfidha (Segnatura 55/B)",
        "Archivi notarili di Susa e Zaghouan",
      ],
    },
    matmata_djebalia: {
      name: "Matmata e Djebalia",
      caidat1881: "Caidato dei Djebalia (Monti di Matmata)",
      capital: "Matmata / Toujane",
      homelandDescription:
        "Berberi zeneti trogloditi delle creste montuose del sud, celebri per i loro villaggi fortificati.",
      fractions: [
        "Matmata antica",
        "Toujane",
        "Tamezret",
        "Taoujout",
        "Beni Aïssa",
      ],
      alliances: "Patto difensivo montano dei Djebalia.",
      majbaSources: "Registri di capitazione dei villaggi trogloditi (1860).",
      archivalCotes: [
        "ANT Kasbah — Fondi Caidato dei Djebalia",
        "Archivi orali e notarili di Toujane e Tamezret",
      ],
    },
    massyles: {
      name: "Numidi Massili",
      capital: "Thugga (Dougga)",
      homelandDescription:
        "Grande popolo berbero numida dell'entroterra settentrionale, fondatori del regno numida unificato.",
      fractions: ["Massili di Thugga", "Numidi di Bulla Regia", "Sicca"],
      alliances: "Regno di Massinissa.",
      archivalCotes: [
        "Stele libiche bilingui di Dougga",
        "Corpus Inscriptionum Semiticarum",
      ],
    },
    cinithii: {
      name: "Cinithii e Antichi Libi",
      capital: "Gigthis (Bougrara)",
      homelandDescription:
        "Popolo libico-berbero autoctono del golfo di Gabès e della piana della Jeffara.",
      fractions: ["Gigthis", "Zita", "Meninx (Gerba)"],
      alliances: "Empori punici del Sud.",
      archivalCotes: ["Iscrizioni dedicatorie di Gigthis", "Scritti di Tolomeo"],
    },
    musulamii: {
      name: "Musulamii",
      capital: "Ammaedara (Haïdra)",
      homelandDescription:
        "Grande confederazione berbera ribelle guidata da Tacfarinas contro il dominio romano.",
      fractions: ["Guerrieri di Thelepte", "Ammaedara", "Sufetula"],
      alliances: "Rivolta di Tacfarinas (17–24 d.C.).",
      archivalCotes: ["Annali di Tacito", "Iscrizioni di Haïdra (CIL VIII)"],
    },
    getules: {
      name: "Getuli e Garamanti",
      capital: "Thiges / Nefta",
      homelandDescription:
        "Tribù nomadi del sud che controllavano le piste oltre lo Chott el-Jérid e il Limes.",
      fractions: ["Nomadi del Jérid", "Chott el-Fejaj", "Dahar"],
      alliances: "Patti di frontiera con i comandanti del Limes.",
      archivalCotes: ["CIL VIII — Iscrizioni militari di Bezereos"],
    },
    maures_byz: {
      name: "Mauri e Leuathae",
      capital: "Jebel Oueslat / Bizacena",
      homelandDescription:
        "Grandi confederazioni berbere riluttanti all'autorità bizantina sotto Antalas e Cabaon.",
      fractions: ["Leuathae", "Frexes", "Astrices"],
      alliances: "Guerre maure contro Salomone e Giovanni Troglita.",
      archivalCotes: ["La Iohannide di Corippo (VI secolo)", "Tavolette Albertini"],
    },
    berberes_lawata: {
      name: "Lawata e Hawwara",
      capital: "Gafsa / Qayrawan",
      homelandDescription:
        "Grandi tribù berbere d'Ifriqiya integrate negli eserciti dell'Islam e partecipi dell'arabizzazione.",
      fractions: ["Lawata della pianura", "Hawwara delle oasi", "Zenata"],
      alliances: "Partecipazione alle campagne di Uqba e Musa Ibn Nusayr.",
      archivalCotes: ["Futuh Ifriqiya di Al-Waqidi", "Storia di Ibn Khaldun"],
    },
    arabes_jund: {
      name: "Jund Arabo e Notabili di Qayrawan",
      capital: "Qayrawan",
      homelandDescription:
        "Famiglie del Jund arabo di origine abbaside e giuristi malikiti fondatori.",
      fractions: ["Banu Tamim", "Banu Asad", "Notabili della Maqsura"],
      alliances: "Sostegno al potere emirale aghlabide.",
      archivalCotes: [
        "Al-Mudawwana dell'Imam Sahnun (Qayrawan)",
        "Pergamene della Maqsura",
      ],
    },
    sanhadja_zirid: {
      name: "Sanhaja e Ziridi",
      capital: "Sabra Al-Mansuriya",
      homelandDescription:
        "Grande dinastia berbera sanhaja regnante sull'Ifriqiya con fasto e valore.",
      fractions: ["Banu Ziri", "Banu Hammad", "Talkata"],
      alliances: "Dinastia regnante ziride.",
      archivalCotes: [
        "Ibn Hayyan — Al-Muqtabis",
        "Ibn Khaldun — Storia dei Berberi",
      ],
    },
    banu_hilal: {
      name: "Banu Hilal e Banu Sulaym",
      capital: "Piana di Qayrawan / Sbeïtla",
      homelandDescription:
        "Grandi confederazioni arabe nomadi stabilitesi in Ifriqiya dal 1051, ridisegnando il tessuto tribale.",
      fractions: ["Athbaj", "Riyah", "Zoghba", "Banu Ali"],
      alliances: "Epopea hilaliana (Taghribat Bani Hilal).",
      archivalCotes: [
        "Manoscritti di Sirat Bani Hilal",
        "Cronache di Ibn al-Athir",
      ],
    },
    masmouda_hintata: {
      name: "Hintata e Masmouda",
      capital: "La Kasbah di Tunisi",
      homelandDescription:
        "Aristocrazia militare e dottrinale almohade da cui discese il lignaggio degli emiri hafsidi.",
      fractions: ["Banu Hafs", "Hintata", "Tinmel"],
      alliances: "Sceicchi fondatori della dinastia hafside.",
      archivalCotes: [
        "Kitab al-Ansab di Ibn al-Qattan",
        "Documenti almohadi della Zitouna",
      ],
    },
    riah_hafside: {
      name: "Confederazione di Riah e Chabbia",
      capital: "Tozeur / Qayrawan",
      homelandDescription:
        "Grandi capi beduini e maestri spirituali sufi del Jérid e della steppa centrale sotto gli Hafsidi.",
      fractions: ["Awlad Chebbi", "Riah", "Banu Ali"],
      alliances: "Rapporti complessi tra alleanza makhzen e autonomia oasiana.",
      archivalCotes: ["Ibn Khaldun — Kitab al-Ibar", "Sijill della Zitouna"],
    },
    andalous_testour: {
      name: "Morischi e Andalusi di Tunisi",
      capital: "Testour / Zaghouan / Soliman",
      homelandDescription:
        "Studiosi, architetti e agricoltori andalusi accolti dai sultani hafsidi, creatori di giardini e moschee d'arte.",
      fractions: ["Andalusi di Testour", "Soliman", "Zaghouan", "Bardo"],
      alliances: "Privilegi reali hafsidi e habous.",
      archivalCotes: [
        "Atti notarili morischi di Testour",
        "Biblioteca Nazionale della Tunisia",
      ],
    },
  },
  mt: {
    ouerghemma: {
      name: "Ouerghemma",
      caidat1881: "Kajdat ta' Ouerghemma (Médenine / Jebel Dahar)",
      capital: "Médenine (Ksar Médenine)",
      homelandDescription:
        "Konfederazzjoni vasta ta' gwerriera fix-Xlokk li kienet tikkontrolla l-pjanuri ta' Jeffara, Jebel Dahar u l-fruntiera ta' Tripli.",
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
        "Alleanza tan-Nofsinhar (Leff Saff el-Ouerghemma) / Gwardjani tar-rotot tal-karavani Saħarjani.",
      majbaSources:
        "Reġistri tat-taxxa Majba tal-1860 (Serje ANT Kasbah Dahar) u ċensimenti tal-Ksour.",
      archivalCotes: [
        "ANT Kasbah — Fondi Kajdat ta' Ouerghemma (Referenzi 142/A sa 148/D)",
        "Sijills Nutarili tal-Adoul ta' Ben Gardane u Tataouine",
        "Arkivji Militari ta' Médenine (Territorji tan-Nofsinhar 1890–1912)",
      ],
    },
    jlass: {
      name: "Jlass (Zlass)",
      caidat1881: "Kajdat ta' Jlass (Kairouan)",
      capital: "Kairouan / Oueslatia",
      homelandDescription:
        "Konfederazzjoni ċentrali b'saħħitha li tokkupa l-pjanura wiesgħa ta' Kairouan u l-għoljiet ta' Jebel Oueslat.",
      fractions: [
        "Ouled Iddir",
        "Ouled Khelifa",
        "Ouled Sanad",
        "Beni Zid el-Kairouan",
        "Ouled Mansour",
      ],
      alliances:
        "Tradizzjonalment alleata mal-Makhzen bejlikal matul l-ispedizzjonijiet fiskali tal-Mahalla.",
      majbaSources:
        "Ċensiment tal-Majba 1860–1869 (Serje ANT Kairouan, 18,420 kap ta' familja magħduda).",
      archivalCotes: [
        "ANT Kasbah — Reġistri tas-Sijills tax-Xarija ta' Kairouan (1750–1881)",
        "Fondi tal-Habous ta' Sidi Sahbi u l-Moskea l-Kbira",
        "Kuntratti tal-Adoul tal-pjanura ta' Sbikha u Haffouz",
      ],
    },
    fraichiche: {
      name: "Fraichiche",
      caidat1881: "Kajdat ta' Fraichiche (Thala u Kasserine)",
      capital: "Feriana / Thala",
      homelandDescription:
        "Konfederazzjoni muntanjuża tal-isteppi għoljin madwar Jebel Chambi u l-plateaux ta' Feriana u Thelepte.",
      fractions: [
        "Ouled Ouezzen",
        "Ouled Ali Ben Aoun",
        "Ouled Naji",
        "Beni Ghorbal",
        "Ouled Guesmia",
      ],
      alliances:
        "Leff tal-Fraichiche / Rivali storika tal-Majer għall-kontroll tal-mergħat tal-isteppa.",
      majbaSources:
        "Listi tat-taxxa Majba (1860) tal-Kajdat tal-Fraichiche — repożitorji ta' Kasserine u Sbeïtla.",
      archivalCotes: [
        "ANT Kasbah — Dossiers tal-Kajdi ta' Feriana u Thala (Serje Bejlikali 220)",
        "Qorti tax-Xarija ta' Sbeïtla — Kuntratti ta' konfini territorjali",
      ],
    },
    majer: {
      name: "Majer",
      caidat1881: "Kajdat ta' Majer (Steppi Għoljin)",
      capital: "Thala / Rohia",
      homelandDescription:
        "Konfederazzjoni kbira ta' gwerriera li tokkupa l-kuritur tal-fruntiera bejn El Kef, Thala u l-fruntiera Alġerina.",
      fractions: ["Ouled Messaoud", "Ouled Amor", "Kouache", "Ouled Helal"],
      alliances: "Alleanza difensiva ewlenija mat-tribujiet tal-wied tal-Medjerda.",
      majbaSources: "Listi tal-Majba ta' Thala (1860) — Repożitorju Ċentrali tal-Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Serje Bejlikali Kajdat ta' Thala (Referenzi 88 sa 94)",
        "Sijills tal-qadi ta' El Kef u Haïdra",
      ],
    },
    hamama: {
      name: "Hamama",
      caidat1881: "Kajdat tal-Hammama (Sidi Bouzid u Gafsa)",
      capital: "Sidi Bouzid / Gafsa Tramuntana",
      homelandDescription:
        "Konfederazzjoni wiesgħa tal-isteppi tan-nofsinhar li testendi mill-għoljiet ta' Gafsa sal-baċin ta' Sidi Bouzid.",
      fractions: [
        "Ouled Aziz",
        "Ouled Radouane",
        "Ouled Moumen",
        "Ouled Souissi",
        "Ouled Slimane",
      ],
      alliances:
        "Leff tal-Hammama (Saff oppost għall-Fraichiche fil-kunflitti pastorali).",
      majbaSources: "Ċensiment tal-1860 tar-reġjun ta' Gafsa u Sidi Bouzid (ANT).",
      archivalCotes: [
        "ANT Kasbah — Fondi Kajdat tal-Hammama (Referenzi 105 sa 112)",
        "Reġistri fiskali tal-Mahalla tan-Nofsinhar",
      ],
    },
    nefzaoua: {
      name: "Nefzaoua",
      caidat1881: "Kajdat ta' Nefzaoua (Kébili)",
      capital: "Kébili / Douz",
      homelandDescription:
        "Konfederazzjoni antika oasjana u Saħarjana Berbera-Għarbija, sidien tal-ġonna tal-palmi ta' Chott el-Jérid u Nefzaoua.",
      fractions: [
        "Marazig (Douz)",
        "Adhara",
        "Gharib",
        "Sabria",
        "Beni Zid el-Jérid",
      ],
      alliances: "Konfederazzjoni Saħarjana tal-karavani u l-gwardjani tal-oasi.",
      majbaSources: "Kontabilità tal-Majba tal-Oasi (1860) — Serje ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Serje Bejlikali Oasi tan-Nofsinhar (Referenzi 171 sa 176)",
        "Arkivji orali tal-Marazig ta' Douz",
      ],
    },
    drid: {
      name: "Drid",
      caidat1881: "Kajdat ta' Drid (Pjanura tal-Medjerda u Béja)",
      capital: "Béja / Testour",
      homelandDescription:
        "Konfederazzjoni makhzen ta' kavallerija stabbilita fil-pjanura fertili tal-Medjerda biex tiskorta l-konvojs bejlikali u tipproteġi l-maħżen tal-qamħ.",
      fractions: [
        "Ouled Sidi Abid",
        "Ouled Arfa",
        "Ouled Manai",
        "Drid el-Makhzen",
      ],
      alliances: "Tribù makhzen privileġġjata mill-Bejiet ta' Tuneż.",
      majbaSources: "Listi fiskali dedikati lill-kavallerija ta' Drid (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Fondi Makhzen ta' Drid (Serje Bejlikali 44)",
        "Qorti tax-Xarija ta' Béja",
      ],
    },
    ouled_ayar: {
      name: "Ouled Ayar",
      caidat1881: "Kajdat ta' Ouled Ayar (Makthar u Siliana)",
      capital: "Makthar (Mactaris) / Kesra",
      homelandDescription:
        "Konfederazzjoni tal-plateaux għoljin ta' Makthar u Jebel Kesra, magħrufa għaż-żwiemel u l-gwerriera tal-muntanji tagħha.",
      fractions: [
        "Ouled Salem",
        "Ouled Bou Ali",
        "Ouled Amor Ben Ali",
        "Ouled Khelil",
      ],
      alliances: "Alleanza tal-plateaux għoljin tat-Tell ċentrali.",
      majbaSources: "Listi Majba tal-Kajdat ta' Makthar (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Serje Bejlikali Makthar (Referenza 131)",
        "Reġistri tal-Adoul ta' Kesra u Siliana",
      ],
    },
    souassi: {
      name: "Souassi",
      caidat1881: "Kajdat ta' Souassi (Saħel Nofsinhar u Mahdia)",
      capital: "Es-Souassi / Ksour Essef",
      homelandDescription:
        "Konfederazzjoni agro-pastorali importanti li tokkupa l-pjanuri fertili ta' wara s-Saħel ta' Mahdia.",
      fractions: [
        "Ouled Moulahem",
        "Ouled Amor",
        "Ouled Zid",
        "Ouled Belhassen",
        "Chouachna",
      ],
      alliances: "Marbuta man-netwerk tal-bliet tal-portijiet tas-Saħel (Mahdia, Sfax).",
      majbaSources: "Listi tal-Majba ta' Mahdia u Souassi (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Reġistri ta' Souassi (Referenza 82)",
        "Qorti tax-Xarija ta' Mahdia",
      ],
    },
    beni_zid: {
      name: "Beni Zid",
      caidat1881: "Kajdat ta' Beni Zid (El Hamma u Gabès)",
      capital: "El Hamma / Metouia",
      homelandDescription:
        "Tribù gwerriera tan-nofsinhar li tokkupa l-pjanura termali ta' El Hamma u l-għoljiet madwar il-golf ta' Gabès.",
      fractions: ["Chouarekh", "Zemzem", "Ouled Douis", "Hazem", "Smaala"],
      alliances: "Patt mat-tribujiet marittimi ta' Gabès u Jeffara.",
      majbaSources: "Listi tal-Majba ta' El Hamma ta' Gabès (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Serje Bejlikali Gabès (Referenza 118)",
        "Qorti tax-Xarija ta' El Hamma",
      ],
    },
    mogod: {
      name: "Mogod",
      caidat1881: "Kajdat ta' Mogod (Bizerte Punent)",
      capital: "Sejnane / Nefza",
      homelandDescription:
        "Tribù muntanjuża tal-foresti tas-sufra u l-kosta wieqfa tal-Majjistral bejn Bizerte u Tabarka.",
      fractions: ["Ouled Mefdah", "Ouled Kassem", "Ouled Bou Baker"],
      alliances: "Gwardjani kostali tax-xatt tat-tramuntana.",
      majbaSources: "Listi Majba ta' Mogods (1860) — ANT Kasbah.",
      archivalCotes: [
        "ANT Kasbah — Fondi Kajdat ta' Mogods (Referenza 31)",
        "Arkivji muniċipali ta' Sejnane",
      ],
    },
    khmir: {
      name: "Khmir (Kroumiri)",
      caidat1881: "Kajdat ta' Khmir (Aïn Draham u Tabarka)",
      capital: "Aïn Draham / Fernana",
      homelandDescription:
        "Konfederazzjoni tal-foresti folti ta' Kroumirie magħrufa għar-reżistenza tagħha u l-ħakma tar-reġjun muntanjuż.",
      fractions: [
        "Ouled Soltane",
        "Ouled Selim",
        "Ouled Theljane",
        "Ouled Khelil",
      ],
      alliances: "Alleanza tal-muntanji tal-katina ta' Kroumirie.",
      majbaSources: "Listi taċ-ċensiment ta' Tabarka u Aïn Draham (1860) — ANT.",
      archivalCotes: [
        "ANT Kasbah — Serje Bejlikali Kroumirie (Referenza 19)",
        "Reġistri tar-Residenza Ġenerali ta' Tabarka",
      ],
    },
    metallit: {
      name: "Metallit",
      caidat1881: "Kajdat ta' Metallit (Sfax Tramuntana / El Jem)",
      capital: "Jbeniana / El Jem",
      homelandDescription:
        "Tribù pastorali u tat-tkabbir taż-żebbuġ bejn is-Saħel u l-baċin ta' Sfax.",
      fractions: ["Ouled Slimane", "Ouled Brahim", "Ouled Moussa"],
      alliances: "Alleata mal-kummerċjanti ta' Sfax u Mahdia.",
      majbaSources: "Katast taż-żebbuġ u listi Majba 1860 — ANT.",
      archivalCotes: [
        "ANT Kasbah — Fondi Kajdat ta' Metallit",
        "Sijills ta' El Jem",
      ],
    },
    riah_chabbia: {
      name: "Riah u Chabbia (Jérid)",
      caidat1881: "Kajdat tal-Jérid (Tozeur / Nefta)",
      capital: "Tozeur / Nefta",
      homelandDescription:
        "Familji kbar u nisel tal-oasi tal-Jérid, studjużi ta' Zitouna, xrifji u merkanti trans-Saħarjani.",
      fractions: [
        "Xrifji ta' Nefta",
        "Beni Ali",
        "Ouled Sidi Bouali",
        "Awlad Chebbi",
      ],
      alliances: "Influwenza spiritwali u intellettwali Sufi (żawiji ta' Nefta u Tozeur).",
      majbaSources: "Katast idrawliku ta' Ibn Chabbat u Majba tal-oasi tal-1860.",
      archivalCotes: [
        "ANT Kasbah — Reġistri tal-Ilma tat-Tisqija u Habous tal-Jérid",
        "Sijills nutarili ta' Tozeur (fondi tal-istudjużi tal-Jérid)",
      ],
    },
    ouled_said: {
      name: "Ouled Saïd",
      caidat1881: "Kajdat ta' Ouled Saïd (Enfidha)",
      capital: "Enfidha (Dar El Bey) / Takrouna",
      homelandDescription:
        "Tribù tad-dominju ta' Enfidha li tokkupa l-pjanuri fertili madwar il-golf ta' Hammamet u r-raħal Berberu ta' Takrouna.",
      fractions: ["Ouled Abdallah", "Ouled Mehdi", "Ouled Slimane", "Takrouna"],
      alliances: "Marbuta mad-dominju storiku bejlikal ta' Enfidha.",
      majbaSources: "Dossier tal-Kawża ta' Enfidha (1879–1880) u listi Majba.",
      archivalCotes: [
        "ANT Kasbah — Fondi tad-Dominju ta' Enfidha (Referenza 55/B)",
        "Arkivji nutarili ta' Sousse u Zaghouan",
      ],
    },
    matmata_djebalia: {
      name: "Matmata u Djebalia",
      caidat1881: "Kajdat ta' Djebalia (Muntanji ta' Matmata)",
      capital: "Matmata / Toujane",
      homelandDescription:
        "Berberi Zeneti trogloditi tal-qċaċet muntanjużi tan-nofsinhar, magħrufa għall-irħula fortifikati tagħhom.",
      fractions: [
        "Matmata l-Antika",
        "Toujane",
        "Tamezret",
        "Taoujout",
        "Beni Aïssa",
      ],
      alliances: "Patt difensiv muntanjuż tad-Djebalia.",
      majbaSources: "Reġistri tat-taxxa tal-irħula trogloditi (1860).",
      archivalCotes: [
        "ANT Kasbah — Fondi Kajdat ta' Djebalia",
        "Arkivji orali u nutarili ta' Toujane u Tamezret",
      ],
    },
    massyles: {
      name: "Numidi Massili",
      capital: "Thugga (Dougga)",
      homelandDescription:
        "Poplu kbir Berberu Numida tal-intern tat-tramuntana, fundaturi tar-renju Numida unifikat.",
      fractions: ["Massili ta' Thugga", "Numidi ta' Bulla Regia", "Sicca"],
      alliances: "Renju ta' Massinissa.",
      archivalCotes: [
        "Steli Libiċi bilingwi ta' Dougga",
        "Corpus Inscriptionum Semiticarum",
      ],
    },
    cinithii: {
      name: "Cinithii u Libiċi Antiki",
      capital: "Gigthis (Bougrara)",
      homelandDescription:
        "Poplu Libiku-Berberu awtoktonu tal-golf ta' Gabès u l-pjanura ta' Jeffara.",
      fractions: ["Gigthis", "Zita", "Meninx (Djerba)"],
      alliances: "Posti kummerċjali Puniċi tan-Nofsinhar.",
      archivalCotes: ["Iskrizzjonijiet dedikatorji ta' Gigthis", "Kitbiet ta' Ptolomew"],
    },
    musulamii: {
      name: "Musulamii",
      capital: "Ammaedara (Haïdra)",
      homelandDescription:
        "Konfederazzjoni kbira Berbera ribelli mmexxija minn Tacfarinas kontra l-ħakma Rumana.",
      fractions: ["Gwerriera ta' Thelepte", "Ammaedara", "Sufetula"],
      alliances: "Rewwixta ta' Tacfarinas (17–24 W.K.).",
      archivalCotes: ["Annali ta' Taċitu", "Iskrizzjonijiet ta' Haïdra (CIL VIII)"],
    },
    getules: {
      name: "Ġetuli u Garamanti",
      capital: "Thiges / Nefta",
      homelandDescription:
        "Tribujiet nomadi tan-nofsinhar li jikkontrollaw ir-rotot lil hinn minn Chott el-Jérid u l-Limes.",
      fractions: ["Nomadi tal-Jérid", "Chott el-Fejaj", "Dahar"],
      alliances: "Patti tal-fruntiera mal-kmandanti tal-Limes.",
      archivalCotes: ["CIL VIII — Iskrizzjonijiet militari ta' Bezereos"],
    },
    maures_byz: {
      name: "Mauri u Leuathae",
      capital: "Jebel Oueslat / Biżaċena",
      homelandDescription:
        "Konfederazzjonijiet kbar Berberi li rreżistew l-awtorità Biżantina taħt Antalas u Cabaon.",
      fractions: ["Leuathae", "Frexes", "Astrices"],
      alliances: "Gwerer Mauri kontra Salamun u Ġwanni Troglita.",
      archivalCotes: ["Il-Ġwanniade ta' Korippu (Seklu 6)", "Tavli Albertini"],
    },
    berberes_lawata: {
      name: "Lawata u Hawwara",
      capital: "Gafsa / Kairouan",
      homelandDescription:
        "Tribujiet kbar Berberi ta' Ifriqiya li ngħaqdu mal-armati tal-Iżlam u ħaddnu l-Għarabizzazzjoni.",
      fractions: ["Lawata tal-pjanura", "Hawwara tal-oasi", "Zenata"],
      alliances: "Parteċipazzjoni fil-kampanji ta' Uqba u Musa Ibn Nusayr.",
      archivalCotes: ["Futuh Ifriqiya ta' Al-Waqidi", "Storja ta' Ibn Khaldun"],
    },
    arabes_jund: {
      name: "Jund Għarbi u Notabbli ta' Kairouan",
      capital: "Kairouan",
      homelandDescription:
        "Familji tal-Jund Għarbi ta' oriġini Abbasida u ġuristi Maliki fundaturi.",
      fractions: ["Banu Tamim", "Banu Asad", "Notabbli tal-Maqsura"],
      alliances: "Appoġġ għall-poter emirali Aglabida.",
      archivalCotes: [
        "Al-Mudawwana tal-Imam Sahnun (Kairouan)",
        "Parċmini tal-Maqsura",
      ],
    },
    sanhadja_zirid: {
      name: "Sanhaja u Ziridi",
      capital: "Sabra Al-Mansouria",
      homelandDescription:
        "Dinastija kbira Berbera Sanhaja li ħakmet fuq Ifriqiya b'ġieħ u qlubija.",
      fractions: ["Banu Ziri", "Banu Hammad", "Talkata"],
      alliances: "Dinastija rjali Zirida.",
      archivalCotes: [
        "Ibn Hayyan — Al-Muqtabis",
        "Ibn Khaldun — Storja tal-Berberi",
      ],
    },
    banu_hilal: {
      name: "Banu Hilal u Banu Sulaym",
      capital: "Pjanura ta' Kairouan / Sbeïtla",
      homelandDescription:
        "Konfederazzjonijiet kbar Għarab nomadi stabbiliti f'Ifriqiya mill-1051, li biddlu l-mappa tribali.",
      fractions: ["Athbaj", "Riyah", "Zoghba", "Banu Ali"],
      alliances: "Epopea Hilaljana (Taghribat Bani Hilal).",
      archivalCotes: [
        "Manuskritti ta' Sirat Bani Hilal",
        "Kronaki ta' Ibn al-Athir",
      ],
    },
    masmouda_hintata: {
      name: "Hintata u Masmouda",
      capital: "Il-Kasbah ta' Tuneż",
      homelandDescription:
        "Aristokrazija militari u duttrinali Almohada li minnha ħarġet il-linja tal-emiri Hafsidi.",
      fractions: ["Banu Hafs", "Hintata", "Tinmel"],
      alliances: "Xejkijiet fundaturi tad-dinastija Hafsida.",
      archivalCotes: [
        "Kitab al-Ansab ta' Ibn al-Qattan",
        "Dokumenti Almohadi ta' Al-Zitouna",
      ],
    },
    riah_hafside: {
      name: "Konfederazzjoni ta' Riah u Chabbia",
      capital: "Tozeur / Kairouan",
      homelandDescription:
        "Kapijiet kbar Bedwini u mexxejja spiritwali Sufi tal-Jérid u l-isteppa ċentrali taħt il-Hafsidi.",
      fractions: ["Awlad Chebbi", "Riah", "Banu Ali"],
      alliances: "Relazzjonijiet kumplessi bejn alleanza makhzen u awtonomija tal-oasi.",
      archivalCotes: ["Ibn Khaldun — Kitab al-Ibar", "Sijills ta' Zitouna"],
    },
    andalous_testour: {
      name: "Moriski u Andalusin ta' Tuneż",
      capital: "Testour / Zaghouan / Soliman",
      homelandDescription:
        "Studjużi, arkitetti u bdiewa Andalusin milqugħa mis-sultani Hafsidi, ħallieqa ta' ġonna u moskej artistiċi.",
      fractions: ["Andalusin ta' Testour", "Soliman", "Zaghouan", "Bardo"],
      alliances: "Privileġġi rjali Hafsidi u habous.",
      archivalCotes: [
        "Kuntratti nutarili Moriski ta' Testour",
        "Biblijoteka Nazzjonali tat-Tuneżija",
      ],
    },
  },
};

