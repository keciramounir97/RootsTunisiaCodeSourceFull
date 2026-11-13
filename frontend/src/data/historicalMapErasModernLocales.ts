import type { EraDetailsTranslation } from "./historicalMapErasAncientLocales";

export const HISTORICAL_ERAS_MODERN_LOCALES: Record<
  string,
  Record<string, EraDetailsTranslation>
> = {
  en: {
    almohade: {
      divisions: {
        tunis_almohad: {
          name: "Governorate of Tunis",
          seat: "Tunis",
          description: "Residence of the Almohad governor Abu Muhammad Abd al-Wahid.",
        },
        mahdia_liberee: {
          name: "Liberated Mahdia",
          seat: "Mahdia",
          description: "End of the Norman occupation in 1159.",
        },
        kairouan_almohad: {
          name: "Kairouan",
          seat: "Kairouan",
          description: "Reorganization of the Habous endowments.",
        },
      },
      leaders: [
        {
          name: "Abd al-Mu'min Ibn Ali",
          role: "First Almohad Caliph of the Greater Maghreb",
          reignOrDates: "1130 – 1163",
          achievements:
            "Unified all of North Africa and Al-Andalus under one empire and liberated Tunis and Mahdia from Norman occupation in 1159.",
        },
        {
          name: "Abu Yusuf Yaqub al-Mansur",
          role: "Almohad Caliph & Builder",
          reignOrDates: "1184 – 1199",
          achievements:
            "Victor at the Battle of Alarcos, patron of philosopher Ibn Rushd (Averroes), and restorer of Ifriqiya's fortifications.",
        },
        {
          name: "Sheikh Abd al-Wahid Ibn Abi Hafs",
          role: "Almohad Governor of Ifriqiya",
          reignOrDates: "1207 – 1221",
          achievements:
            "Appointed by Caliph al-Nasir to pacify Ifriqiya, established himself in Tunis and laid the dynastic foundations of the Hafsids.",
        },
        {
          name: "Yahya Ibn Ghaniya",
          role: "Insurgent Almoravid Prince",
          reignOrDates: "1184 – 1237",
          achievements:
            "Leader of Almoravid resistance challenging Almohad rule for half a century across southern Tunisia and the Jérid.",
        },
      ],
      families: [
        {
          name: "House of the Banu Hafs (Hintata)",
          role: "Governors of Ifriqiya and future Sultans",
          origin: "Tinmel / Kasbah of Tunis",
          lineageNotes:
            "Descendants of Sheikh Abu Hafs Umar, Masmuda military and religious elite destined to reign over Tunis.",
        },
        {
          name: "Mu'minid Almohad Dynasty",
          role: "Universal Caliphs of Marrakech and Seville",
          origin: "Marrakech",
          lineageNotes:
            "Caliphal lineage descended from Abd al-Mu'min that instituted the cadastral survey of the entire Maghreb.",
        },
        {
          name: "Banu Ghaniya Almoravids",
          role: "Unvanquished nomadic lords of the South",
          origin: "Balearics / Jérid and Gafsa",
          lineageNotes:
            "Last Almoravid princely branch sustaining nomadic resistance across the Tunisian oases.",
        },
      ],
      keySites: [
        { name: "The Kasbah of Tunis", role: "Residence of the Almohad governors" },
        { name: "Mahdia", role: "Naval liberation of 1159" },
      ],
      archivalSources: [
        "Treatises of Ibn Tumart and Almohad charters of Tunis",
        "Writings of Ibn al-Abbar on Almohad Ifriqiya",
      ],
    },
    hafside: {
      divisions: {
        outan_tunis: {
          name: "Outan of Tunis & Sahel",
          seat: "Tunis (Dar El Sultan)",
          description: "Economic heartland, madrasas, and Andalusian artisans' guilds.",
        },
        outan_kef: {
          name: "Outan of El Kef & Medjerda",
          seat: "El Kef (Al-Kaf)",
          description: "Defensive bastion facing the western emirs.",
        },
        outan_djerid: {
          name: "Outan of the Jérid",
          seat: "Tozeur",
          description: "Scholarly zawiyas and hydraulic cadastre of Ibn Chabbat.",
        },
        outan_gabes_djerba: {
          name: "Outan of Gabès & Djerba",
          seat: "Gabès",
          description: "Coastal defense against Aragonese and Spanish corsairs.",
        },
      },
      leaders: [
        {
          name: "Abu Zakariya Yahya I",
          role: "Founder of the Independent Hafsid Sultanate",
          reignOrDates: "1228 – 1249",
          achievements:
            "Proclaimed Tunisia's full sovereignty, made Tunis the official capital, and erected Al-Shamma'iyya Madrasa.",
        },
        {
          name: "Al-Mustansir Billah",
          role: "Sultan & Universal Caliph of Tunis",
          reignOrDates: "1249 – 1277",
          achievements:
            "Recognized Caliph of Islam by the Sherifs of Mecca in 1259; repelled Louis IX's Crusade at Carthage (1270).",
        },
        {
          name: "Abu Faris Abd al-Aziz",
          role: "Reformist Hafsid Sultan",
          reignOrDates: "1394 – 1434",
          achievements:
            "Restored territorial unity from Tripoli to Constantine, founded hospitals and libraries, and endowed Al-Zitouna with manuscripts.",
        },
        {
          name: "Ibn Khaldun",
          role: "Father of Modern History & Sociology",
          reignOrDates: "1332 – 1406",
          achievements:
            "Born in the Medina of Tunis (Tourbet el-Bey Street), taught at Al-Zitouna, and authored the Muqaddima and Kitab al-Ibar.",
        },
      ],
      families: [
        {
          name: "Hafsid Sultans Dynasty",
          role: "Ruling dynasty of Ifriqiya",
          origin: "Kasbah Palace of Tunis",
          lineageNotes:
            "Sovereign dynasty guiding Tunisia for 346 years, safeguarding prosperity and international treaties.",
        },
        {
          name: "House of Ibn Khaldun (Banu Khaldun)",
          role: "Patricians, magistrates, and ministers",
          origin: "Seville / Tourbet El Bey, Tunis",
          lineageNotes:
            "Illustrious Andalusian family of Hadrami Yemenite descent producing statesmen and judges of Tunis.",
        },
        {
          name: "Exiled Andalusian Patriciate",
          role: "Scholars, poets, master artisans, and viziers",
          origin: "Córdoba, Valencia, Seville, and Granada",
          lineageNotes:
            "Great families (Ibn al-Abbar, Al-Qalshani, Ibn Hazm) transforming Tunisian arts, agronomy, and letters.",
        },
        {
          name: "House of Ibn Arafa & Zitouna Ulama",
          role: "Supreme muftis and masters of jurisprudence",
          origin: "Medina of Tunis",
          lineageNotes:
            "Lineage of Great Imam Ibn Arafa (1316–1401) codifying Tunisian notarial law for centuries.",
        },
      ],
      keySites: [
        { name: "Tunis (The Kasbah)", role: "Hafsid royal capital and seat of Al-Zitouna" },
        { name: "Testour", role: "Andalusian town of the Medjerda valley" },
        { name: "Le Bardo", role: "Residence of Hafsid pleasure gardens and pavilions" },
      ],
      archivalSources: [
        "Manuscripts of the National Library of Tunisia (Zitouna Holdings)",
        "Hafsid diplomatic treaties preserved in the archives of Barcelona and Florence",
        "Notarial deeds of the Andalusian Moriscos of Testour and Soliman",
        "The Muqaddima and History of the Berbers by Ibn Khaldun (born in Tunis in 1332)",
      ],
    },
    ottomane: {
      divisions: {
        dar_el_bey: {
          name: "Governorate of Tunis & The Kasbah",
          seat: "Tunis",
          description: "Seat of the Dey, the Janissary militia, and the Muradids.",
        },
        goulette_arsenal: {
          name: "La Goulette (Halk El Oued)",
          seat: "La Goulette",
          description: "Fortress of La Karraka and base of the Ottoman corsair fleet.",
        },
        garnison_kef: {
          name: "Border Garrison of El Kef",
          seat: "El Kef",
          description: "Key frontier stronghold facing the Regency of Algiers.",
        },
        caidat_beja_1600: {
          name: "Qaidate of Béja & Medjerda",
          seat: "Béja",
          description: "Cereal control and Spahi cavalry.",
        },
        caidat_jlass_1600: {
          name: "Qaidate of Jlass & Kairouan",
          seat: "Kairouan",
          description: "Securing the vast central plain.",
        },
        caidat_sfax_sahel: {
          name: "Qaidate of Sfax & the Sahel",
          seat: "Sfax",
          description: "Imperial maritime olive-oil trade.",
        },
        caidat_djerid_1600: {
          name: "Qaidate of the Jérid",
          seat: "Tozeur",
          description: "Oases and trans-Saharan caravans.",
        },
        caidat_ouerghemma_1600: {
          name: "Confederation of Ouerghemma",
          seat: "Médenine",
          description: "Frontier defense facing Tripoli.",
        },
      },
      leaders: [
        {
          name: "Sinan Pasha & Uluj Ali (Kilij Ali)",
          role: "Grand Ottoman Admirals",
          reignOrDates: "1574",
          achievements:
            "Expelled the Spanish garrisons from La Goulette and Tunis permanently, sealing Tunisia's status as an autonomous Ottoman regency.",
        },
        {
          name: "Murad Bey I",
          role: "Founder of the Hereditary Muradid Dynasty",
          reignOrDates: "1613 – 1631",
          achievements:
            "First hereditary Bey of Tunis; reorganized interior tax collection through the semi-annual Mahalla expedition.",
        },
        {
          name: "Hammouda Pasha Bey the Muradid",
          role: "Sovereign Builder Bey",
          reignOrDates: "1631 – 1666",
          achievements:
            "Built Hammouda Pasha Mosque with its octagonal minaret, established the Souk of Chechias, and endowed Tunis with merchant fondouks.",
        },
        {
          name: "Youssef Dey & Othman Dey",
          role: "Sovereign Deys of the Tunis Ojak",
          reignOrDates: "1598 – 1637",
          achievements:
            "Erected the first Hanafi mosque in Tunis and organized the reception of 80,000 Moriscos expelled from Spain (1609).",
        },
      ],
      families: [
        {
          name: "Muradid Beylical Dynasty",
          role: "Hereditary Beys of Tunis",
          origin: "Medina of Tunis (Dar El-Bey)",
          lineageNotes:
            "Princely lineage founded by Murad Bey ruling Tunisia until 1702.",
        },
        {
          name: "Morisco Notables from Spain",
          role: "Founders of agricultural towns and engineers",
          origin: "Testour, Soliman, Zaghouan, Tebourba",
          lineageNotes:
            "Families Al-Andalusi, Ben Mustapha, and Morisco who revolutionized hydraulic farming and horology.",
        },
        {
          name: "Sea Raïs & Admiralty of La Goulette",
          role: "Corsair captains and admirals",
          origin: "La Goulette / Tunis",
          lineageNotes:
            "Lineages of maritime captains (Darghouth, Al-Mami, Pichinino) projecting the Regency's naval power.",
        },
        {
          name: "Kouloughli & Turkish Aristocracy",
          role: "Officers of the Diwan and Hanafi magistrates",
          origin: "Kasbah of Tunis",
          lineageNotes:
            "Turko-Tunisian families holding senior military commands within the Ojak.",
        },
      ],
      keySites: [
        {
          name: "Tunis (Eyalet Capital)",
          role: "Dar El Bey, Kasbah, and Youssef Dey Mosque (1616)",
        },
        {
          name: "La Goulette (Halk El Oued)",
          role: "Maritime coastal fortress (La Karraka) and corsair arsenal",
        },
        {
          name: "El Kef (Al-Kaf)",
          role: "Key garrison stronghold facing the Regency of Algiers",
        },
        {
          name: "Bizerte",
          role: "Janissary garrison and port of the sea captains (Raïs)",
        },
        {
          name: "Kairouan",
          role: "Interior religious capital and stronghold of the ulama",
        },
        {
          name: "Sfax",
          role: "Major maritime and export hub of the Regency",
        },
      ],
      archivalSources: [
        "Ottoman fiscal and military defters (National Archives of Tunisia — Kasbah)",
        "Sijills of the Grand Hanafi and Maliki Sharia Courts of Tunis",
        "Consular registers of the French Chancellery in Tunis (CADN Nantes, Series A)",
        "Prime Ministerial Ottoman Archives in Istanbul (Trablusgarp ve Tunus Holdings)",
      ],
    },
    husseinite: {
      divisions: {
        caidat_tunis_bardo: {
          name: "Qaidate of Tunis & Le Bardo",
          seat: "Le Bardo",
          description: "Beylical palaces, Grand Vizierate, and state ministries.",
        },
        caidat_jlass: {
          name: "Qaidate of Jlass",
          seat: "Kairouan",
          description: "Enumeration of 18,420 heads of household in the 1860 Majba.",
        },
        caidat_ouerghemma: {
          name: "Qaidate of Ouerghemma",
          seat: "Médenine",
          description: "Warrior confederation of the Dahar and Jeffara.",
        },
        caidat_fraichiche: {
          name: "Qaidate of Fraichiche",
          seat: "Feriana / Thala",
          description: "Western High Steppes.",
        },
        caidat_djerid: {
          name: "Qaidate of the Jérid",
          seat: "Tozeur",
          description: "Palm groves and oasis Sharia courts.",
        },
        caidat_beja: {
          name: "Qaidate of Béja",
          seat: "Béja",
          description: "Medjerda plain and Makhzen cavalry tribes of Drid.",
        },
        caidat_sousse: {
          name: "Qaidate of Sousse",
          seat: "Sousse",
          description: "Major port and olive-growing center of the Sahel.",
        },
        caidat_sfax: {
          name: "Qaidate of Sfax",
          seat: "Sfax",
          description: "Maritime commerce and commercial tribunals.",
        },
      },
      leaders: [
        {
          name: "Hussein Ben Ali",
          role: "Founder of the Husseinite Royal Dynasty",
          reignOrDates: "1705 – 1735",
          achievements:
            "Restored internal peace and Tunisian sovereignty; founded Ennakhla Madrasa and the mausoleum of Tourbet El Bey.",
        },
        {
          name: "Hammouda Pasha the Great",
          role: "Sovereign Bey of Tunisia",
          reignOrDates: "1782 – 1814",
          achievements:
            "Military and economic zenith of the Regency; repelled Algerian incursions, modernized the army and Bardo Palace.",
        },
        {
          name: "Ahmed Bey I",
          role: "Reformist & Modernizing Sovereign",
          reignOrDates: "1837 – 1855",
          achievements:
            "Abolished slavery in Tunisia as early as 1846, founded Bardo Military School in 1840, and built the modern Tunisian army.",
        },
        {
          name: "Kheireddine Pasha",
          role: "Reformist Grand Vizier",
          reignOrDates: "1873 – 1877",
          achievements:
            "Author of the Arab-Islamic constitutional treatise, founded Sadiki College in 1875, and reorganized the Habous and State Archives.",
        },
        {
          name: "Sadok Bey",
          role: "Promulgator of the Constitution",
          reignOrDates: "1859 – 1882",
          achievements:
            "Promulgated the Fundamental Pact (Ahd El-Aman, 1857) and the first modern Constitution in the Arab-Muslim world in 1861.",
        },
      ],
      families: [
        {
          name: "Husseinite Royal Family",
          role: "Beys and reigning sovereigns of Tunisia",
          origin: "Le Bardo / Dar El-Bey, Tunis",
          lineageNotes:
            "Princely ruling dynasty from 1705 to 1957 that shaped the modern Tunisian state.",
        },
        {
          name: "High Makhzen Aristocracy",
          role: "Grand viziers, ministers, and qaids",
          origin: "Tunis, Sousse, and Sfax",
          lineageNotes:
            "Great state families: Ben Ayed, Djellouli, Lasram, Bouattour, Ben Zied, Caïd Essebsi, Sebaï, Belkodja.",
        },
        {
          name: "Lineages of Ulama & Sheikhs al-Islam",
          role: "Sheikhs of Al-Zitouna and Grand Muftis",
          origin: "Medina of Tunis",
          lineageNotes:
            "Great scholarly dynasties (Bayram, Ennaifer, Boukhris, Belkadhi, Baraket) holding theological chairs.",
        },
        {
          name: "Merchant Upper Bourgeoisie & Grana",
          role: "Bankers to the Bey, chechia industrialists, and exporters",
          origin: "Tunis, Sfax, Djerba",
          lineageNotes:
            "Families Nataf, Borgel, Lumbroso, Valensi, Chemla, Zaouche, and Baccouche driving Mediterranean finance and trade.",
        },
      ],
      keySites: [
        {
          name: "Bardo Palace",
          role: "Official residence of the Beys and promulgation of the 1861 Constitution",
        },
        {
          name: "The Kasbah of Tunis",
          role: "Seat of the Prime Ministry and the Beylical Treasury (Bayt al-Mal)",
        },
        {
          name: "La Mohammedia",
          role: "Monumental palace complex of Ahmed Bey I",
        },
      ],
      archivalSources: [
        "Complete registers of the 1860 Majba census (ANT Kasbah — Series 1 to 60)",
        "Archives of the Grand Vizierate of Mustapha Khaznadar and Kheireddine Pasha",
        "Notarial Sijills of the 60 Tunisian qaidates preserved at La Kasbah",
        "Original manuscript of the 1861 Tunisian Constitution",
      ],
    },
    protectorat: {
      divisions: {
        cc_tunis: {
          name: "Civil Control of Tunis & Suburbs",
          seat: "Tunis",
          description: "Residency General and central civil status services.",
        },
        cc_bizerte: {
          name: "Civil Control of Bizerte",
          seat: "Bizerte",
          description: "Strategic naval base of Sidi Abdallah.",
        },
        cc_sousse: {
          name: "Civil Control of Sousse",
          seat: "Sousse",
          description: "Sahel and Monastir region.",
        },
        cc_sfax: {
          name: "Civil Control of Sfax",
          seat: "Sfax",
          description: "Phosphate and olive-oil port.",
        },
        cc_kef: {
          name: "Civil Control of El Kef",
          seat: "El Kef",
          description: "High plateaus and mining districts.",
        },
        territoires_sud: {
          name: "Southern Military Territories",
          seat: "Médenine / Remada",
          description: "Saharan military administration.",
        },
      },
      leaders: [
        {
          name: "Moncef Bey (The People's Bey)",
          role: "Patriot Bey & National Martyr",
          reignOrDates: "1942 – 1943",
          achievements:
            "Supreme symbol of national dignity and independence; defied Vichy directives, deposed and exiled by colonial authorities.",
        },
        {
          name: "Habib Bourguiba",
          role: "Supreme Leader of National Liberation",
          reignOrDates: "1903 – 2000",
          achievements:
            "Founded the Neo-Destour at Ksar Hellal in 1934, led the struggle for independence, and secured internal autonomy and full sovereignty (1956).",
        },
        {
          name: "Farhat Hached",
          role: "Founder of the UGTT & National Martyr",
          reignOrDates: "1914 – 1952",
          achievements:
            "Founded the autonomous labor confederation UGTT in 1946, rallied workers for social and national emancipation, assassinated by the Red Hand.",
        },
        {
          name: "Abdelaziz Thâalbi",
          role: "Thinker & Founder of the Destour Party",
          reignOrDates: "1874 – 1944",
          achievements:
            "Author of 'La Tunisie Martyre' (1920), pioneer of the modern political and intellectual awakening of the Tunisian people.",
        },
        {
          name: "Lamine Bey",
          role: "Last Sovereign Bey of Tunis",
          reignOrDates: "1943 – 1957",
          achievements:
            "Signed Tunisia's independence protocol on March 20, 1956, prior to the peaceful proclamation of the Republic in 1957.",
        },
      ],
      families: [
        {
          name: "Families of the National & Destourian Movement",
          role: "Activists, autonomy ministers, and signatories",
          origin: "Tunis, Sahel, Sfax, and Kairouan",
          lineageNotes:
            "Families Bourguiba, Materi, Chenik, Mzali, Guellaty, Farhat, Hached, Ben Ammar, Baccouche, and Slim.",
        },
        {
          name: "Patrician Dynasties of the Medina",
          role: "Magistrates, academics, and men of letters",
          origin: "Tunis (Medina and northern suburbs)",
          lineageNotes:
            "Families Sfar, Mohsen, Ennaifer, Ben Achour, Chahed, Ben Romdhane, Zaouche, and Baccouche.",
        },
        {
          name: "European Families of Tunisia",
          role: "Physicians, railwaymen, architects, and farmers",
          origin: "Tunis, La Goulette, Bizerte, Sfax",
          lineageNotes:
            "Parish and consular registers of Sainte-Croix of Tunis, Notre-Dame of La Goulette, and Nantes archives.",
        },
      ],
      keySites: [
        {
          name: "Tunis (Residency General)",
          role: "Avenue de la Marine and administrative institutions",
        },
        { name: "Bizerte (Naval Base)", role: "Strategic military port" },
        {
          name: "Remada & Tataouine",
          role: "Command posts of the Southern Military Territories",
        },
      ],
      archivalSources: [
        "Municipal civil status and birth registers (1886–1956)",
        "Centre des Archives Diplomatiques de Nantes (CADN — Residency General Holdings)",
        "Archives Nationales d'Outre-Mer (ANOM Aix-en-Provence)",
        "Nominal index of naturalization decrees (1924–1927)",
      ],
    },
    republique: {
      divisions: {
        grand_tunis: {
          name: "Greater Tunis (Tunis, Ariana, Ben Arous, Manouba)",
          seat: "Tunis",
          description: "Political, economic, and university capital.",
        },
        nord_est: {
          name: "North-East (Nabeul, Bizerte, Zaghouan)",
          seat: "Nabeul / Bizerte",
          description: "Maritime Cap Bon and industrial pole of Bizerte.",
        },
        nord_ouest: {
          name: "North-West (Béja, Jendouba, El Kef, Siliana)",
          seat: "Béja / El Kef",
          description: "Wheat granary and cork-oak forests.",
        },
        centre_est: {
          name: "Center-East (Sousse, Monastir, Mahdia, Sfax)",
          seat: "Sousse / Sfax",
          description: "Economic, textile, and olive-oil basin.",
        },
        centre_ouest: {
          name: "Center-West (Kairouan, Kasserine, Sidi Bouzid)",
          seat: "Kairouan",
          description: "Historical steppes and agricultural heartland.",
        },
        sud_est: {
          name: "South-East (Gabès, Médenine, Tataouine)",
          seat: "Gabès / Médenine",
          description: "Jeffara, Djerba Island, and Ksour highlands.",
        },
        sud_ouest: {
          name: "South-West (Gafsa, Tozeur, Kebili)",
          seat: "Gafsa / Tozeur",
          description: "Mining basin and oases of the Jérid.",
        },
      },
      leaders: [
        {
          name: "Habib Bourguiba",
          role: "First President of the Tunisian Republic",
          reignOrDates: "1957 – 1987",
          achievements:
            "Father of the modern republic, promulgated the Code of Personal Status (1956) emancipating Tunisian women, and established universal free education and healthcare.",
        },
        {
          name: "Bahi Ladgham",
          role: "Prime Minister & Architect of the Administration",
          reignOrDates: "1957 – 1970",
          achievements:
            "Secretary General of the Presidency; organized the sovereign ministries of the young Republic and economic development plans.",
        },
        {
          name: "Tahar Haddad",
          role: "Visionary Thinker & Social Reformer",
          reignOrDates: "1899 – 1935",
          achievements:
            "Al-Zitouna graduate and author of 'Our Women in the Sharia and Society', intellectual forerunner of the Code of Personal Status.",
        },
        {
          name: "Beji Caid Essebsi",
          role: "Statesman & President of the Republic",
          reignOrDates: "2014 – 2019",
          achievements:
            "Historic minister under Bourguiba, Prime Minister during the 2011 democratic transition, and first directly elected president in 2014.",
        },
      ],
      families: [
        {
          name: "Great Academic & Republican Families",
          role: "Professors, diplomats, magistrates, and physicians",
          origin: "All 24 unified governorates",
          lineageNotes:
            "Lineages that built the administrative, hospital, and academic backbone of independent Tunisia.",
        },
        {
          name: "Founding Cadres of Tunisian Administration",
          role: "Engineers, planners, and officers",
          origin: "Greater Tunis, Sahel, South, and North-West",
          lineageNotes:
            "Personnel files preserved at La Kasbah and the National Archives of Tunisia (Presidency and Ministries Holdings).",
        },
      ],
      keySites: [
        { name: "Palace of Carthage", role: "Presidency of the Tunisian Republic" },
        {
          name: "La Kasbah (Government Palace)",
          role: "Office of the Prime Minister and National Archives of Tunisia",
        },
        {
          name: "Le Bardo (Assembly of People's Representatives)",
          role: "Seat of legislative power",
        },
        {
          name: "Bizerte (Evacuation Monument)",
          role: "Symbol of complete national liberation (October 15, 1963)",
        },
      ],
      archivalSources: [
        "National Archives of Tunisia (Republic, Presidency, and Ministries Holdings)",
        "Official Gazette of the Tunisian Republic (JORT since 1956)",
        "Contemporary civil registers of Tunisia's 350 municipalities",
      ],
    },
  },
  ar: {
    almohade: {
      divisions: {
        tunis_almohad: {
          name: "عمالة تونس",
          seat: "تونس",
          description: "مقر إقامة الوالي الموحدي أبي محمد عبد الواحد.",
        },
        mahdia_liberee: {
          name: "المهدية المحررة",
          seat: "المهدية",
          description: "نهاية الاحتلال النورماندي سنة 1159.",
        },
        kairouan_almohad: {
          name: "القيروان",
          seat: "القيروان",
          description: "إعادة تنظيم الأوقاف والأحباس.",
        },
      },
      leaders: [
        {
          name: "عبد المؤمن بن علي الكومي",
          role: "أول خليفة موحدي بالمغرب الكبير",
          reignOrDates: "1130 – 1163",
          achievements:
            "وحّد شمال إفريقيا والأندلس تحت إمبراطورية واحدة وحرّر تونس والمهدية من الاحتلال النورماندي سنة 1159.",
        },
        {
          name: "أبو يوسف يعقوب المنصور",
          role: "الخليفة الموحدي الباني",
          reignOrDates: "1184 – 1199",
          achievements:
            "بطل معركة الأرك وراعي الفيلسوف ابن رشد ومجدّد تحصينات إفريقية.",
        },
        {
          name: "الشيخ عبد الواحد بن أبي حفص",
          role: "الوالي الموحدي على إفريقية",
          reignOrDates: "1207 – 1221",
          achievements:
            "عيّنه الخليفة الناصر لتهدئة إفريقية، فاستقر بتونس ووضع الأسس السلالية للدولة الحفصية.",
        },
        {
          name: "يحيى بن غانية الميورقي",
          role: "الأمير المرابطي الثائر",
          reignOrDates: "1184 – 1237",
          achievements:
            "قائد المقاومة المرابطية التي تحدّت السلطة الموحدية طوال نصف قرن بالجنوب التونسي والجريد.",
        },
      ],
      families: [
        {
          name: "آل أبي حفص (هنتاتة)",
          role: "ولاة إفريقية وسلاطينها اللاحقون",
          origin: "تينمل / قصبة تونس",
          lineageNotes:
            "أحفاد الشيخ أبي حفص عمر، نخبة مصمودة العسكرية والدينية التي آل إليها ملك تونس.",
        },
        {
          name: "الأسرة المؤمنية الموحدية",
          role: "خلفاء مراكش وإشبيلية",
          origin: "مراكش",
          lineageNotes:
            "السلالة الخلافية المنحدرة من عبد المؤمن التي أحدثت التكسير والمسح العقاري لعموم بلاد المغرب.",
        },
        {
          name: "بنو غانية المرابطون",
          role: "أمراء البادية المقاومون بالجنوب",
          origin: "جزر البليار / الجريد وقفصة",
          lineageNotes:
            "آخر فرع أميري مرابطي واصل المقاومة في الواحات التونسية.",
        },
      ],
      keySites: [
        { name: "قصبة تونس", role: "مقر الولاة الموحدين" },
        { name: "المهدية", role: "التحرير البحري سنة 1159" },
      ],
      archivalSources: [
        "رسائل ابن تومرت والمواثيق الموحدية بتونس",
        "كتابات ابن الأبار حول إفريقية الموحدية",
      ],
    },
    hafside: {
      divisions: {
        outan_tunis: {
          name: "أوطان تونس والساحل",
          seat: "تونس (دار السلطان)",
          description: "القلب الاقتصادي والمدارس وأمناء الحرف الأندلسيين.",
        },
        outan_kef: {
          name: "وطن الكاف ومجردة",
          seat: "الكاف",
          description: "ثغر دفاعي أمام إمارات الغرب.",
        },
        outan_djerid: {
          name: "وطن الجريد",
          seat: "توزر",
          description: "الزوايا العالمة وقانون توزيع المياه لابن الشباط.",
        },
        outan_gabes_djerba: {
          name: "وطن قابس وجربة",
          seat: "قابس",
          description: "الدفاع الساحلي ضد غزوات الأراغون والإسبان.",
        },
      },
      leaders: [
        {
          name: "أبو زكريا يحيى الأول",
          role: "مؤسس الدولة الحفصية المستقلة",
          reignOrDates: "1228 – 1249",
          achievements:
            "أعلن السيادة التامة لتونس وجعلها العاصمة الرسمية وشيّد المدرسة الشماعية.",
        },
        {
          name: "المستنصر بالله الحفصي",
          role: "السلطان وخليفة المسلمين بتونس",
          reignOrDates: "1249 – 1277",
          achievements:
            "بويع بالخلافة من أشراف مكة سنة 1259، وصدّ بنجاح حملة لويس التاسع الصليبية على قرطاج (1270).",
        },
        {
          name: "أبو فارس عبد العزيز المتوكل",
          role: "السلطان الحفصي المصلح",
          reignOrDates: "1394 – 1434",
          achievements:
            "أعاد الوحدة الترابية من طرابلس إلى قسنطينة، وأنشأ المارستانات والمكتبات وأوقف المخطوطات على جامع الزيتونة.",
        },
        {
          name: "عبد الرحمن بن خلدون",
          role: "رائد علم التاريخ والاجتماع الحديث",
          reignOrDates: "1332 – 1406",
          achievements:
            "وُلد بالمدينة العتيقة بتونس (نهج تربة الباي)، ودرّس بالزيتونة، وألّف المقدمة وكتاب العبر.",
        },
      ],
      families: [
        {
          name: "السلاطين الحفصيون",
          role: "البيت الملكي الحاكم بإفريقية",
          origin: "قصر قصبة تونس",
          lineageNotes:
            "سلالة سيادية قادت تونس طوال 346 عاماً في ازدهار وعلاقات دبلوماسية دولية.",
        },
        {
          name: "عائلة ابن خلدون الحضرمية",
          role: "أعيان وقضاة ووزراء دولة",
          origin: "إشبيلية / تربة الباي، تونس",
          lineageNotes:
            "أسرة أندلسية عريقة من أصل يماني حضرمي أنجبت وزراء وقضاة كباراً بتونس.",
        },
        {
          name: "أعيان الأندلسيين المهجرين",
          role: "علماء وشعراء وحرفيون ووزراء",
          origin: "قرطبة وبلنسية وإشبيلية وغرناطة",
          lineageNotes:
            "أسر عريقة (ابن الأبار، القلشاني، ابن حزم) طوّرت الفنون والفلاحة والآداب التونسية.",
        },
        {
          name: "آل ابن عرفة وشيوخ الزيتونة",
          role: "كبار المفتين وأئمة الفقه والتوثيق",
          origin: "المدينة العتيقة بتونس",
          lineageNotes:
            "سلالة الإمام الأعظم ابن عرفة (1316–1401) الذي قنّن فقه التوثيق العدلي التونسي لقرون.",
        },
      ],
      keySites: [
        { name: "تونس (القصبة)", role: "العاصمة الملكية الحفصية وحاضرة جامع الزيتونة" },
        { name: "تستور", role: "الحاضرة الأندلسية بوادي مجردة" },
        { name: "باردو", role: "منتزه وبساتين السلاطين الحفصيين" },
      ],
      archivalSources: [
        "مخطوطات المكتبة الوطنية التونسية (الرصيد الزيتوني)",
        "المعاهدات الدبلوماسية الحفصية المحفوظة بأرشيف برشلونة وفلورنسا",
        "العقود العدلية للأندلسيين الموريسكيين بتستور وسليمان",
        "المقدمة وكتاب العبر لابن خلدون (المولود بتونس سنة 1332)",
      ],
    },
    ottomane: {
      divisions: {
        dar_el_bey: {
          name: "دار الباي وقصبة تونس",
          seat: "تونس",
          description: "مقر الداي ووجق الإنكشارية والأمراء المراديين.",
        },
        goulette_arsenal: {
          name: "حلق الوادي والكرّاكة",
          seat: "حلق الوادي",
          description: "حصن الكرّاكة وقاعدة الأسطول البحري العثماني.",
        },
        garnison_kef: {
          name: "حامية الكاف الحدودية",
          seat: "الكاف",
          description: "القلعة الرئيسية على الحدود الغربية أمام إيالة الجزائر.",
        },
        caidat_beja_1600: {
          name: "قيادة باجة وحوض مجردة",
          seat: "باجة",
          description: "الرقابة الزراعية وفرسان الصبايحية.",
        },
        caidat_jlass_1600: {
          name: "قيادة الجلاص والقيروان",
          seat: "القيروان",
          description: "تأمين السهل الأوسط الشاسع.",
        },
        caidat_sfax_sahel: {
          name: "قيادة صفاقس والساحل",
          seat: "صفاقس",
          description: "التجارة البحرية لزيت الزيتون بالإيالة.",
        },
        caidat_djerid_1600: {
          name: "قيادة الجريد وقسطيلية",
          seat: "توزر",
          description: "الواحات والقوافل العابرة للصحراء.",
        },
        caidat_ouerghemma_1600: {
          name: "حلف الورغمة بالجنوب",
          seat: "مدنين",
          description: "الدفاع عن التخوم أمام طرابلس.",
        },
      },
      leaders: [
        {
          name: "سنان باشا وقلج علي",
          role: "كبار أمراء البحار العثمانيين",
          reignOrDates: "1574",
          achievements:
            "حرّرا حلق الوادي وتونس نهائياً من الحاميات الإسبانية وأرسيا وضع تونس كإيالة عثمانية ذاتية الحكم.",
        },
        {
          name: "مراد باي الأول",
          role: "مؤسس السلالة المرادية الوراثية",
          reignOrDates: "1613 – 1631",
          achievements:
            "أول باي وراثي بتونس، أعاد تنظيم الجباية بالداخل التونسي عبر دورات المحلّة النصف سنوية.",
        },
        {
          name: "حمودة باشا المرادي",
          role: "الباي السيادي الباني",
          reignOrDates: "1631 – 1666",
          achievements:
            "شيّد جامع حمودة باشا ذي المئذنة المثمّنة وأسس سوق الشواشية وأثث تونس بالوكالات والفنادق التجارية.",
        },
        {
          name: "يوسف داي وعثمان داي",
          role: "دايات وجق تونس السياديون",
          reignOrDates: "1598 – 1637",
          achievements:
            "بنيا أول جامع حنفي بتونس ونظّما استقبال 80 ألفاً من الموريسكيين الأندلسيين المهجرين من إسبانيا (1609).",
        },
      ],
      families: [
        {
          name: "السلالة البايليكية المرادية",
          role: "بايات تونس الوراثيون",
          origin: "المدينة العتيقة بتونس (دار الباي)",
          lineageNotes:
            "سلالة أميرية أسسها مراد باي وحكمت تونس حتى سنة 1702.",
        },
        {
          name: "أعيان الموريسكيين الأندلسيين (1609)",
          role: "مؤسسو مدن فلاحية ومهندسو ري",
          origin: "تستور وسليمان وزغوان وطبربة",
          lineageNotes:
            "عائلات الأندلسي وبن مصطفى وموريسكو التي طورت هندسة المياه والساعات الشمسية.",
        },
        {
          name: "ريّاس البحر وأميرالية حلق الوادي",
          role: "قادة القرصنة البحرية والأميرالات",
          origin: "حلق الوادي / تونس",
          lineageNotes:
            "سلالات من ربابنة البحر (درغوث والمامي) ضمنت التفوق البحري لإيالة تونس.",
        },
        {
          name: "أعيان الكراغلة والأتراك",
          role: "ضباط الديوان وقضاة المذهب الحنفي",
          origin: "قصبة تونس",
          lineageNotes:
            "عائلات تونسية-تركية تقلّدت القيادات العسكرية العليا في الوجق.",
        },
      ],
      keySites: [
        { name: "تونس (عاصمة الإيالة)", role: "دار الباي والقصبة وجامع يوسف داي (1616)" },
        { name: "حلق الوادي", role: "حصن الكرّاكة البحري وترسانة الأساطيل" },
        { name: "الكاف", role: "قلعة الحامية الرئيسية في مواجهة إيالة الجزائر" },
        { name: "بنزرت", role: "حامية الإنكشارية وميناء الريّاس" },
        { name: "القيروان", role: "العاصمة الدينية بالداخل ومعقل العلماء" },
        { name: "صفاقس", role: "قطب بحري وتجاري رئيسي للتصدير بالإيالة" },
      ],
      archivalSources: [
        "الدفاتر الجبائية والعسكرية العثمانية (الأرشيف الوطني التونسي — القصبة)",
        "سجلات المحكمتين الشرعيتين الكبرى الحنفية والمالكية بتونس",
        "السجلات القنصلية للمستشارية الفرنسية بتونس (أرشيف نانت CADN — سلسلة A)",
        "أرشيف رئاسة الوزراء العثماني بإسطنبول (رصيد طرابلس الغرب وتونس)",
      ],
    },
    husseinite: {
      divisions: {
        caidat_tunis_bardo: {
          name: "قيادة تونس وقصر باردو",
          seat: "باردو",
          description: "القصور البايليكية والوزارة الكبرى والوزارات.",
        },
        caidat_jlass: {
          name: "قيادة الجلاص",
          seat: "القيروان",
          description: "إحصاء 18,420 رب عائلة في دفاتر مجبى 1860.",
        },
        caidat_ouerghemma: {
          name: "قيادة الورغمة",
          seat: "مدنين",
          description: "كونفدرالية الظاهر والجفارة المحاربة.",
        },
        caidat_fraichiche: {
          name: "قيادة الفراشيش",
          seat: "فريانة / تالة",
          description: "السباسب العليا الغربية.",
        },
        caidat_djerid: {
          name: "قيادة الجريد",
          seat: "توزر",
          description: "واحات النخيل والمحاكم الشرعية بالواحات.",
        },
        caidat_beja: {
          name: "قيادة باجة",
          seat: "باجة",
          description: "سهل مجردة وقبائل مخزن دريد.",
        },
        caidat_sousse: {
          name: "قيادة سوسة",
          seat: "سوسة",
          description: "القطب المينائي والزيتوني الكبير بالساحل.",
        },
        caidat_sfax: {
          name: "قيادة صفاقس",
          seat: "صفاقس",
          description: "التجارة البحرية ومحاكم التجارة.",
        },
      },
      leaders: [
        {
          name: "حسين بن علي الوجاقلي",
          role: "مؤسس السلالة الملكية الحسينية",
          reignOrDates: "1705 – 1735",
          achievements:
            "أرسى السلم الأهلي والسيادة التونسية وأسس مدرسة النخلة وضريح تربة الباي.",
        },
        {
          name: "حمودة باشا الكبير الحسيني",
          role: "باي تونس السيادي",
          reignOrDates: "1782 – 1814",
          achievements:
            "أوج القوة العسكرية والاقتصادية للمملكة، صدّ أطماع دايات الجزائر وحدّث الجيش وقصر باردو.",
        },
        {
          name: "أحمد باي الأول",
          role: "الملك المصلح والمحدّث",
          reignOrDates: "1837 – 1855",
          achievements:
            "أصدر أمر تحرير العبيد بتونس منذ سنة 1846، وأسس المدرسة الحربية بباردو سنة 1840 وبنى أول جيش تونسي حديث.",
        },
        {
          name: "خير الدين باشا التونسي",
          role: "الوزير الأكبر المصلح",
          reignOrDates: "1873 – 1877",
          achievements:
            "صاحب 'أقوم المسالك' والمشروع الدستوري الإسلامي، مؤسس المدرسة الصادقية (1875) ومنظّم الأوقاف والأرشيف الوطني.",
        },
        {
          name: "محمد الصادق باي",
          role: "مُصدر دستور 1861",
          reignOrDates: "1859 – 1882",
          achievements:
            "أصدر عهد الأمان (1857) وأول دستور مكتوب في العالم العربي والإسلامي سنة 1861.",
        },
      ],
      families: [
        {
          name: "الأسرة الحسينية المالكة",
          role: "بايات وملوك تونس الحاكمون",
          origin: "باردو / دار الباي، تونس",
          lineageNotes:
            "السلالة الملكية الحاكمة من 1705 إلى 1957 التي أرست دعائم الدولة التونسية الحديثة.",
        },
        {
          name: "أسر المخزن والوزراء الكبرى",
          role: "الوزراء الكبار والقياد ورجال الدولة",
          origin: "تونس وسوسة وصفاقس",
          lineageNotes:
            "أسر الدولة الكبرى: بن عياد، الجلولي، الأصرم، بوعتور، بن زيد، قائد السبسي، السباعي، بلخوجة.",
        },
        {
          name: "بيوتات العلم والإفتاء ومشايخ الإسلام",
          role: "مشايخ جامع الزيتونة وكبار المفتين",
          origin: "المدينة العتيقة بتونس",
          lineageNotes:
            "سلالات العلم الكبرى (بيرم، النيفر، بوخريص، بلقاضي، بركات) التي تولّت الكراسي العلمية والإفتاء.",
        },
        {
          name: "أعيان التجارة الكبرى والقَرَانَة",
          role: "مصرفيو الباي وصناعيو الشاشية والمصدّرون",
          origin: "تونس وصفاقس وجربة",
          lineageNotes:
            "عائلات نطاف، بورجل، لومبروزو، فالانسي، شملال، الزاوش وبكوش التي نشّطت المال والتجارة المتوسطية.",
        },
      ],
      keySites: [
        { name: "قصر باردو", role: "المقر الرسمي للبايات ومكان إعلان دستور 1861" },
        { name: "قصبة تونس", role: "مقر الوزارة الكبرى وبيت المال البايليكي" },
        { name: "المحمدية", role: "القصر الضخم لأحمد باي الأول" },
      ],
      archivalSources: [
        "دفاتر إحصاء المجبى الكاملة لعام 1860 (الأرشيف الوطني بالقصبة — السلاسل 1 إلى 60)",
        "أرشيف الوزارة الكبرى لمصطفى خزنه دار وخير الدين باشا",
        "السجلات العدلية لستين قيادة تونسية محفوظة بالقصبة",
        "النص الأصلي للدستور التونسي لعام 1861",
      ],
    },
    protectorat: {
      divisions: {
        cc_tunis: {
          name: "المراقبة المدنية بتونس والأحواز",
          seat: "تونس",
          description: "الإقامة العامة والمصالح المركزية للحالة المدنية.",
        },
        cc_bizerte: {
          name: "المراقبة المدنية ببنزرت",
          seat: "بنزرت",
          description: "القاعدة البحرية الاستراتيجية بسيدي عبد الله.",
        },
        cc_sousse: {
          name: "المراقبة المدنية بسوسة",
          seat: "سوسة",
          description: "الساحل وجهة المنستير.",
        },
        cc_sfax: {
          name: "المراقبة المدنية بصفاقس",
          seat: "صفاقس",
          description: "ميناء تصدير الفسفاط وزيت الزيتون.",
        },
        cc_kef: {
          name: "المراقبة المدنية بالكاف",
          seat: "الكاف",
          description: "الهضاب العليا والمناطق المنجمية.",
        },
        territoires_sud: {
          name: "الجهات العسكرية للجنوب",
          seat: "مدنين / رمادة",
          description: "الإدارة العسكرية الصحراوية.",
        },
      },
      leaders: [
        {
          name: "محمد المنصف باي (باي الشعب)",
          role: "الباي الوطني والشهيد الرمز",
          reignOrDates: "1942 – 1943",
          achievements:
            "رمز الكرامة الوطنية والسيادة، رفض أوامر حكومة فيشي فعزلته السلطات الاستعمارية ونفته.",
        },
        {
          name: "الحبيب بورقيبة",
          role: "الزعيم الأعلى للتحرير الوطني",
          reignOrDates: "1903 – 2000",
          achievements:
            "أسس الحزب الحر الدستوري الجديد بقصر هلال سنة 1934، وقاد الكفاح حتى الاستقلال والسيادة الكاملة (1956).",
        },
        {
          name: "فرحات حشاد",
          role: "مؤسس الاتحاد العام التونسي للشغل والشهيد الوطني",
          reignOrDates: "1914 – 1952",
          achievements:
            "أسس المنظمة الشغيلة سنة 1946 ووحّد العمال للتحرر الاجتماعي والوطني قبل اغتياله على يد اليد الحمراء.",
        },
        {
          name: "عبد العزيز الثعالبي",
          role: "المفكر ومؤسس الحزب الدستوري",
          reignOrDates: "1874 – 1944",
          achievements:
            "مؤلف كتاب 'تونس الشهيدة' (1920)، ورائد النهضة السياسية والفكرية الحديثة للشعب التونسي.",
        },
        {
          name: "محمد الأمين باي",
          role: "آخر بايات تونس السياديين",
          reignOrDates: "1943 – 1957",
          achievements:
            "وقّع وثيقة استقلال تونس في 20 مارس 1956 قبل إعلان النظام الجمهوري السلمي سنة 1957.",
        },
      ],
      families: [
        {
          name: "بيوتات الحركة الوطنية والدستورية",
          role: "مناضلون ووزراء الاستقلال الذاتي وموقعون",
          origin: "تونس والساحل وصفاقس والقيروان",
          lineageNotes:
            "عائلات بورقيبة، الماطري، شنيق، المزالي، القلاتي، فرحات، حشاد، بن عمار، بكوش، سليم.",
        },
        {
          name: "الأسر البلدية العريقة بالمدينة العتيقة",
          role: "قضاة وأساتذة جامعيون وأدباء",
          origin: "تونس (المدينة العتيقة والضاحية الشمالية)",
          lineageNotes:
            "عائلات صفر، محسن، النيفر، بن عاشور، الشاهد، بن رمضان، الزاوش، بكوش.",
        },
        {
          name: "الجاليات الأوروبية بتونس",
          role: "أطباء وسككيون ومعماريون وفلاحون",
          origin: "تونس وحلق الوادي وبنزرت وصفاقس",
          lineageNotes:
            "السجلات الكنسية والقنصلية لكنيسة الصليب المقدس بتونس ونوتردام حلق الوادي وأرشيف نانت.",
        },
      ],
      keySites: [
        { name: "تونس (الإقامة العامة)", role: "شارع البحرية والمؤسسات الإدارية" },
        { name: "بنزرت (القاعدة البحرية)", role: "ميناء عسكري استراتيجي" },
        { name: "رمادة وتطاوين", role: "مراكز قيادة الجهات العسكرية للجنوب" },
      ],
      archivalSources: [
        "سجلات الحالة المدنية البلدية والولادات (1886–1956)",
        "مركز الأرشيف الدبلوماسي بنانت (CADN — رصيد الإقامة العامة)",
        "الأرشيف الوطني لما وراء البحار (ANOM إيكس آن بروفانس)",
        "الفهرس الاسمي لمراسيم التجنيس (1924–1927)",
      ],
    },
    republique: {
      divisions: {
        grand_tunis: {
          name: "تونس الكبرى (تونس، أريانة، بن عروس، منوبة)",
          seat: "تونس",
          description: "العاصمة السياسية والاقتصادية والجامعية.",
        },
        nord_est: {
          name: "الشمال الشرقي (نابل، بنزرت، زغوان)",
          seat: "نابل / بنزرت",
          description: "الوطن القبلي البحري والقطب الصناعي ببنزرت.",
        },
        nord_ouest: {
          name: "الشمال الغربي (باجة، جندوبة، الكاف، سليانة)",
          seat: "باجة / الكاف",
          description: "مطمور القمح وغابات بلوط الفلين.",
        },
        centre_est: {
          name: "الوسط الشرقي (سوسة، المنستير، المهدية، صفاقس)",
          seat: "سوسة / صفاقس",
          description: "الحوض الاقتصادي والنسيجي والزيتوني.",
        },
        centre_ouest: {
          name: "الوسط الغربي (القيروان، القصرين، سيدي بوزيد)",
          seat: "القيروان",
          description: "السباسب التاريخية والمهد الفلاحي.",
        },
        sud_est: {
          name: "الجنوب الشرقي (قابس، مدنين، تطاوين)",
          seat: "قابس / مدنين",
          description: "الجفارة وجزيرة جربة وبلاد القصور.",
        },
        sud_ouest: {
          name: "الجنوب الغربي (قفصة، توزر، قبلي)",
          seat: "قفصة / توزر",
          description: "الحوض المنجمي وواحات الجريد.",
        },
      },
      leaders: [
        {
          name: "الحبيب بورقيبة",
          role: "أول رئيس للجمهورية التونسية",
          reignOrDates: "1957 – 1987",
          achievements:
            "باني الدولة الجمهورية الحديثة، أصدر مجلة الأحوال الشخصية (1956) لتحرير المرأة التونسية وعمّم التعليم والصحة العمومية المجانية.",
        },
        {
          name: "الباهي الأدغم",
          role: "الوزير الأول ومهندس الإدارة التونسية",
          reignOrDates: "1957 – 1970",
          achievements:
            "كاتب الدولة للرئاسة، نظّم الوزارات السيادية للجمهورية الفتية ومخططات التنمية الاقتصادية.",
        },
        {
          name: "الطاهر الحداد",
          role: "المفكر الطلائعي والمصلح الاجتماعي",
          reignOrDates: "1899 – 1935",
          achievements:
            "خريج جامع الزيتونة ومؤلف 'امرأتنا في الشريعة والمجتمع'، الملهم الفكري لمجلة الأحوال الشخصية.",
        },
        {
          name: "الباجي قائد السبسي",
          role: "رجل الدولة ورئيس الجمهورية",
          reignOrDates: "2014 – 2019",
          achievements:
            "الوزير التاريخي في عهد بورقيبة والوزير الأول في الانتقال الديمقراطي (2011) وأول رئيس منتخب بالاقتراع المباشر سنة 2014.",
        },
      ],
      families: [
        {
          name: "العائلات الجامعية والنقابية والجمهورية الكبرى",
          role: "أساتذة ودبلوماسيون وقضاة وأطباء",
          origin: "كافة الولايات الأربع والعشرين الموحدة",
          lineageNotes:
            "الأسر التي أرست الهيكلة الإدارية والاستشفائية والجامعية لتونس المستقلة.",
        },
        {
          name: "الإطارات المؤسسة للإدارة التونسية",
          role: "مهندسون ومخططون وضباط",
          origin: "تونس الكبرى والساحل والجنوب والشمال الغربي",
          lineageNotes:
            "ملفات أرشيفية محفوظة بالقصبة والأرشيف الوطني التونسي (رصيد الرئاسة والوزارات).",
        },
      ],
      keySites: [
        { name: "قصر قرطاج", role: "رئاسة الجمهورية التونسية" },
        { name: "القصبة (قصر الحكومة)", role: "رئاسة الحكومة والأرشيف الوطني التونسي" },
        { name: "باردو (مجلس نواب الشعب)", role: "مقر السلطة التشريعية" },
        { name: "بنزرت (نصب الجلاء)", role: "رمز التحرير التام للتراب الوطني (15 أكتوبر 1963)" },
      ],
      archivalSources: [
        "الأرشيف الوطني التونسي (أرصدة الجمهورية والرئاسة والوزارات)",
        "الرائد الرسمي للجمهورية التونسية (منذ 1956)",
        "السجلات المدنية المعاصرة لـ 350 بلدية في تونس",
      ],
    },
  },
  es: {
    almohade: {
      divisions: {
        tunis_almohad: {
          name: "Gobernación de Túnez",
          seat: "Túnez",
          description: "Residencia del gobernador almohade Abu Muhammad Abd al-Wahid.",
        },
        mahdia_liberee: {
          name: "Mahdia Liberada",
          seat: "Mahdia",
          description: "Fin de la ocupación normanda en 1159.",
        },
        kairouan_almohad: {
          name: "Kairuán",
          seat: "Kairuán",
          description: "Reorganización de los bienes habús.",
        },
      },
      leaders: [
        {
          name: "Abd al-Mu'min Ibn Ali",
          role: "Primer Califa Almohade del Gran Magreb",
          reignOrDates: "1130 – 1163",
          achievements:
            "Unificó todo el norte de África y Al-Ándalus bajo un solo imperio y liberó Túnez y Mahdia de los normandos en 1159.",
        },
        {
          name: "Abu Yusuf Yaqub al-Mansur",
          role: "Califa Almohade Constructor",
          reignOrDates: "1184 – 1199",
          achievements:
            "Vencedor de la batalla de Alarcos, protector del filósofo Averroes y restaurador de las fortalezas de Ifriqiya.",
        },
        {
          name: "Jeque Abd al-Wahid Ibn Abi Hafs",
          role: "Gobernador Almohade de Ifriqiya",
          reignOrDates: "1207 – 1221",
          achievements:
            "Designado por el califa al-Nasir para pacificar Ifriqiya, se asentó en Túnez y sentó las bases dinásticas hafsíes.",
        },
        {
          name: "Yahya Ibn Ghaniya",
          role: "Príncipe Almorávide Insurgente",
          reignOrDates: "1184 – 1237",
          achievements:
            "Líder de la resistencia almorávide que desafió el poder almohade durante medio siglo en el sur tunecino y el Jérid.",
        },
      ],
      families: [
        {
          name: "Casa de los Banu Hafs (Hintata)",
          role: "Gobernadores de Ifriqiya y futuros Sultanes",
          origin: "Tinmel / Kasbah de Túnez",
          lineageNotes:
            "Descendientes del jeque Abu Hafs Umar, élite religiosa y militar masmuda destinada a reinar en Túnez.",
        },
        {
          name: "Dinastía Muminida Almohade",
          role: "Califas universales de Marrakech y Sevilla",
          origin: "Marrakech",
          lineageNotes:
            "Linaje califal surgido de Abd al-Mu'min que implantó el catastro territorial en todo el Magreb.",
        },
        {
          name: "Banu Ghaniya Almorávides",
          role: "Señores nómadas insumisos del Sur",
          origin: "Baleares / Jérid y Gafsa",
          lineageNotes:
            "Última rama principesca almorávide que mantuvo la resistencia nómada en los oasis tunecinos.",
        },
      ],
      keySites: [
        { name: "La Kasbah de Túnez", role: "Residencia de los gobernadores almohades" },
        { name: "Mahdia", role: "Liberación naval de 1159" },
      ],
      archivalSources: [
        "Tratados de Ibn Tumart y cartas almohades de Túnez",
        "Escritos de Ibn al-Abbar sobre la Ifriqiya almohade",
      ],
    },
    hafside: {
      divisions: {
        outan_tunis: {
          name: "Outan de Túnez y Sahel",
          seat: "Túnez (Dar El Sultan)",
          description: "Corazón económico, madrasas y gremios artesanos andalusíes.",
        },
        outan_kef: {
          name: "Outan de El Kef y Medjerda",
          seat: "El Kef (Al-Kaf)",
          description: "Bastión defensivo frente a los emires occidentales.",
        },
        outan_djerid: {
          name: "Outan del Jérid",
          seat: "Tozeur",
          description: "Zawiyas eruditas y catastro hidráulico de Ibn Chabbat.",
        },
        outan_gabes_djerba: {
          name: "Outan de Gabès y Djerba",
          seat: "Gabès",
          description: "Defensa costera frente a corsarios aragoneses y españoles.",
        },
      },
      leaders: [
        {
          name: "Abu Zakariya Yahya I",
          role: "Fundador del Sultanato Hafsí Independiente",
          reignOrDates: "1228 – 1249",
          achievements:
            "Proclamó la plena soberanía de Túnez, la convirtió en capital oficial y edificó la Madraza Ech-Chammaïyya.",
        },
        {
          name: "Al-Mustansir Billah",
          role: "Sultán y Califa Universal de Túnez",
          reignOrDates: "1249 – 1277",
          achievements:
            "Reconocido Califa del Islam por los jerifes de La Meca en 1259; rechazó la Cruzada de Luis IX en Cartago (1270).",
        },
        {
          name: "Abu Faris Abd al-Aziz",
          role: "Sultán Hafsí Reformador",
          reignOrDates: "1394 – 1434",
          achievements:
            "Restableció la unidad territorial de Trípoli a Constantina, fundó hospitales y bibliotecas y dotó a Al-Zitouna de manuscritos.",
        },
        {
          name: "Ibn Jaldún",
          role: "Padre de la Historia Moderna y la Sociología",
          reignOrDates: "1332 – 1406",
          achievements:
            "Nacido en la Medina de Túnez (calle Tourbet el-Bey), enseñó en Al-Zitouna y redactó la Muqaddima y el Kitab al-Ibar.",
        },
      ],
      families: [
        {
          name: "Dinastía de los Sultanes Hafsíes",
          role: "Casa reinante en Ifriqiya",
          origin: "Palacio de la Kasbah de Túnez",
          lineageNotes:
            "Linaje soberano que gobernó Túnez durante 346 años, garantizando prosperidad y tratados internacionales.",
        },
        {
          name: "Casa de Ibn Jaldún (Banu Jaldún)",
          role: "Patricios, magistrados y ministros",
          origin: "Sevilla / Tourbet El Bey, Túnez",
          lineageNotes:
            "Ilustre familia andalusí de ascendencia yemení hadramí que dio grandes ministros y jueces a Túnez.",
        },
        {
          name: "Patriciado Andalusí Refugiado",
          role: "Eruditos, poetas, artesanos y visires",
          origin: "Córdoba, Valencia, Sevilla y Granada",
          lineageNotes:
            "Grandes familias (Ibn al-Abbar, Al-Qalshani, Ibn Hazm) que transformaron las artes, la agronomía y las letras tunecinas.",
        },
        {
          name: "Casa de Ibn Arafa y Ulemas de la Zitouna",
          role: "Muftíes supremos y maestros de jurisprudencia",
          origin: "Medina de Túnez",
          lineageNotes:
            "Estirpe del gran imam Ibn Arafa (1316–1401) que codificó el derecho notarial tunecino durante siglos.",
        },
      ],
      keySites: [
        { name: "Túnez (La Kasbah)", role: "Capital real hafsí y sede de Al-Zitouna" },
        { name: "Testour", role: "Ciudad andalusí del valle del Medjerda" },
        { name: "Le Bardo", role: "Residencia de jardines y pabellones de recreo hafsíes" },
      ],
      archivalSources: [
        "Manuscritos de la Biblioteca Nacional de Túnez (Fondos Zitouna)",
        "Tratados diplomáticos hafsíes conservados en los archivos de Barcelona y Florencia",
        "Actas notariales de los moriscos andalusíes de Testour y Soliman",
        "La Muqaddima y la Historia de los Bereberes de Ibn Jaldún (nacido en Túnez en 1332)",
      ],
    },
    ottomane: {
      divisions: {
        dar_el_bey: {
          name: "Gobernación de Túnez y La Kasbah",
          seat: "Túnez",
          description: "Sede del Dey, la milicia jenízara y los Muradíes.",
        },
        goulette_arsenal: {
          name: "La Goleta (Halk El Oued)",
          seat: "La Goleta",
          description: "Fortaleza de La Karraka y base de la flota corsaria otomana.",
        },
        garnison_kef: {
          name: "Guarnición Fronteriza de El Kef",
          seat: "El Kef",
          description: "Fortaleza clave frente a la Regencia de Argel.",
        },
        caidat_beja_1600: {
          name: "Caidato de Béja y Medjerda",
          seat: "Béja",
          description: "Control cerealista y caballería de Spahis.",
        },
        caidat_jlass_1600: {
          name: "Caidato de los Jlass y Kairuán",
          seat: "Kairuán",
          description: "Seguridad de la gran llanura central.",
        },
        caidat_sfax_sahel: {
          name: "Caidato de Sfax y del Sahel",
          seat: "Sfax",
          description: "Comercio marítimo de aceite de oliva del Imperio.",
        },
        caidat_djerid_1600: {
          name: "Caidato del Jérid",
          seat: "Tozeur",
          description: "Oasis y caravanas transaharianas.",
        },
        caidat_ouerghemma_1600: {
          name: "Confederación de los Ouerghemma",
          seat: "Médenine",
          description: "Defensa de la frontera frente a Trípoli.",
        },
      },
      leaders: [
        {
          name: "Sinán Pachá y Uluj Ali (Kilij Ali)",
          role: "Grandes Almirantes Otomanos",
          reignOrDates: "1574",
          achievements:
            "Expulsaron definitivamente a las guarniciones españolas de La Goleta y Túnez, sellando el estatus de regencia otomana autónoma.",
        },
        {
          name: "Murad Bey I",
          role: "Fundador de la Dinastía Hereditaria Muradí",
          reignOrDates: "1613 – 1631",
          achievements:
            "Primer bey hereditario de Túnez; reorganizó la recaudación interior mediante las giras semestrales de la Mahalla.",
        },
        {
          name: "Hammouda Pachá Bey el Muradí",
          role: "Bey Soberano Constructor",
          reignOrDates: "1631 – 1666",
          achievements:
            "Erigió la Mezquita Hammouda Pachá de minarete octogonal, fundó el zoco de las chechias y dotó a Túnez de fondouks mercantiles.",
        },
        {
          name: "Youssef Dey y Othman Dey",
          role: "Deyes Soberanos del Ojak de Túnez",
          reignOrDates: "1598 – 1637",
          achievements:
            "Edificaron la primera mezquita hanafí de Túnez y organizaron la acogida de los 80.000 moriscos expulsados de España (1609).",
        },
      ],
      families: [
        {
          name: "Dinastía Beylical de los Muradíes",
          role: "Beyes hereditarios de Túnez",
          origin: "Medina de Túnez (Dar El-Bey)",
          lineageNotes:
            "Linaje principesco fundado por Murad Bey que gobernó Túnez hasta 1702.",
        },
        {
          name: "Notables Moriscos de España",
          role: "Fundadores de ciudades agrícolas e ingenieros",
          origin: "Testour, Soliman, Zaghouan, Tebourba",
          lineageNotes:
            "Familias Al-Andalusi, Ben Mustapha y Morisco que revolucionaron el regadío agrícola y la relojería.",
        },
        {
          name: "Raïs del Mar y Almirantazgo de La Goleta",
          role: "Comandantes corsarios y almirantes",
          origin: "La Goleta / Túnez",
          lineageNotes:
            "Estirpes de capitanes navales (Darghouth, Al-Mami, Pichinino) que sostuvieron el poder marítimo de la Regencia.",
        },
        {
          name: "Aristocracia Kulugli y Turca",
          role: "Oficiales del Diván y magistrados hanafíes",
          origin: "Kasbah de Túnez",
          lineageNotes:
            "Familias turco-tunecinas titulares de los altos mandos militares del Ojak.",
        },
      ],
      keySites: [
        { name: "Túnez (Capital del Eyalato)", role: "Dar El Bey, Kasbah y Mezquita Youssef Dey (1616)" },
        { name: "La Goleta (Halk El Oued)", role: "Fortaleza marítima costera (La Karraka) y arsenal corsario" },
        { name: "El Kef (Al-Kaf)", role: "Fortaleza clave de guarnición frente a la Regencia de Argel" },
        { name: "Bizerta", role: "Guarnición de Jenízaros y puerto de los capitanes raïs" },
        { name: "Kairuán", role: "Capital religiosa interior y bastión de los ulemas" },
        { name: "Sfax", role: "Gran polo marítimo y exportador de la Regencia" },
      ],
      archivalSources: [
        "Defters fiscales y militares otomanos (Archivos Nacionales de Túnez — Kasbah)",
        "Sijills del Gran Tribunal Islámico Hanafí y Malikí de Túnez",
        "Registros consulares de la cancillería francesa en Túnez (CADN Nantes, Serie A)",
        "Archivos otomanos de Başbakanlık en Estambul (Fondos Trablusgarp ve Tunus)",
      ],
    },
    husseinite: {
      divisions: {
        caidat_tunis_bardo: {
          name: "Caidato de Túnez y Le Bardo",
          seat: "Le Bardo",
          description: "Palacios beylicales, Gran Visirato y ministerios.",
        },
        caidat_jlass: {
          name: "Caidato de los Jlass",
          seat: "Kairuán",
          description: "Padrón de 18.420 cabezas de familia en la Majba de 1860.",
        },
        caidat_ouerghemma: {
          name: "Caidato de los Ouerghemma",
          seat: "Médenine",
          description: "Confederación guerrera del Dahar y la Jeffara.",
        },
        caidat_fraichiche: {
          name: "Caidato de los Fraichiche",
          seat: "Feriana / Thala",
          description: "Altas estepas occidentales.",
        },
        caidat_djerid: {
          name: "Caidato del Jérid",
          seat: "Tozeur",
          description: "Palmerales y tribunales islámicos de los oasis.",
        },
        caidat_beja: {
          name: "Caidato de Béja",
          seat: "Béja",
          description: "Llanura del Medjerda y tribus majzén de los Drid.",
        },
        caidat_sousse: {
          name: "Caidato de Susa",
          seat: "Susa",
          description: "Gran polo portuario y oleícola del Sahel.",
        },
        caidat_sfax: {
          name: "Caidato de Sfax",
          seat: "Sfax",
          description: "Comercio marítimo y tribunales mercantiles.",
        },
      },
      leaders: [
        {
          name: "Hussein Ben Ali",
          role: "Fundador de la Dinastía Real Huseiní",
          reignOrDates: "1705 – 1735",
          achievements:
            "Restableció la paz interna y la soberanía tunecina; fundó la Madraza Ennakhla y el mausoleo de Tourbet El Bey.",
        },
        {
          name: "Hammouda Pachá el Grande",
          role: "Bey Soberano de Túnez",
          reignOrDates: "1782 – 1814",
          achievements:
            "Apogeo militar y económico de la Regencia; rechazó las incursiones de Argel y modernizó el ejército y el Palacio del Bardo.",
        },
        {
          name: "Ahmed Bey I",
          role: "Soberano Reformador y Modernizador",
          reignOrDates: "1837 – 1855",
          achievements:
            "Abolió la esclavitud en Túnez en 1846, fundó la Escuela Militar del Bardo en 1840 y creó el primer ejército moderno tunecino.",
        },
        {
          name: "Kheireddine Pachá",
          role: "Gran Visir Reformador",
          reignOrDates: "1873 – 1877",
          achievements:
            "Autor del tratado constitucional árabe-musulmán, fundó el Colegio Sadiki en 1875 y reorganizó los Habús y los Archivos del Estado.",
        },
        {
          name: "Sadok Bey",
          role: "Promulgador de la Constitución",
          reignOrDates: "1859 – 1882",
          achievements:
            "Promulgó el Pacto Fundamental (Ahd El-Aman, 1857) y la primera Constitución del mundo árabe-musulmán en 1861.",
        },
      ],
      families: [
        {
          name: "Familia Real Huseiní",
          role: "Beyes y soberanos reinantes en Túnez",
          origin: "Le Bardo / Dar El-Bey, Túnez",
          lineageNotes:
            "Dinastía principesca soberana de 1705 a 1957 que forjó el Estado moderno tunecino.",
        },
        {
          name: "Alta Aristocracia del Majzén",
          role: "Grandes visires, ministros y caídes",
          origin: "Túnez, Susa y Sfax",
          lineageNotes:
            "Grandes familias de Estado: Ben Ayed, Djellouli, Lasram, Bouattour, Ben Zied, Caïd Essebsi, Sebaï, Belkodja.",
        },
        {
          name: "Linajes de Ulemas y Jeques al-Islam",
          role: "Jeques de Al-Zitouna y Grandes Muftíes",
          origin: "Medina de Túnez",
          lineageNotes:
            "Grandes dinastías eruditas (Bayram, Ennaifer, Boukhris, Belkadhi, Baraket) titulares de las cátedras teológicas.",
        },
        {
          name: "Alta Burguesía Mercantil y Grana",
          role: "Banqueros del Bey, industriales de la chechia y exportadores",
          origin: "Túnez, Sfax, Djerba",
          lineageNotes:
            "Familias Nataf, Borgel, Lumbroso, Valensi, Chemla, Zaouche y Baccouche dinamizadoras de las finanzas mediterráneas.",
        },
      ],
      keySites: [
        { name: "Palacio del Bardo", role: "Residencia oficial de los Beyes y promulgación de la Constitución de 1861" },
        { name: "La Kasbah de Túnez", role: "Sede del Primer Ministerio y del Tesoro beylical (Bayt al-Mal)" },
        { name: "La Mohammedia", role: "Grandioso complejo palaciego de Ahmed Bey I" },
      ],
      archivalSources: [
        "Registros completos de la Majba de 1860 (ANT Kasbah — Series 1 a 60)",
        "Archivos del Gran Visirato de Mustapha Khaznadar y Kheireddine Pachá",
        "Sijills notariales de los 60 caidatos tunecinos conservados en La Kasbah",
        "Texto original de la Constitución tunecina de 1861",
      ],
    },
    protectorat: {
      divisions: {
        cc_tunis: {
          name: "Control Civil de Túnez y Alrededores",
          seat: "Túnez",
          description: "Residencia General y servicios centrales del registro civil.",
        },
        cc_bizerte: {
          name: "Control Civil de Bizerta",
          seat: "Bizerta",
          description: "Base naval estratégica de Sidi Abdallah.",
        },
        cc_sousse: {
          name: "Control Civil de Susa",
          seat: "Susa",
          description: "Sahel y región de Monastir.",
        },
        cc_sfax: {
          name: "Control Civil de Sfax",
          seat: "Sfax",
          description: "Puerto fosfatero y oleícola.",
        },
        cc_kef: {
          name: "Control Civil de El Kef",
          seat: "El Kef",
          description: "Altas mesetas y cuencas mineras.",
        },
        territoires_sud: {
          name: "Territorios Militares del Sur",
          seat: "Médenine / Remada",
          description: "Administración militar sahariana.",
        },
      },
      leaders: [
        {
          name: "Moncef Bey (El Bey del Pueblo)",
          role: "Bey Patriota y Mártir Nacional",
          reignOrDates: "1942 – 1943",
          achievements:
            "Símbolo supremo de dignidad e independencia nacional; rechazó las órdenes de Vichy y fue depuesto y exiliado por las autoridades coloniales.",
        },
        {
          name: "Habib Bourguiba",
          role: "Líder Supremo de la Liberación Nacional",
          reignOrDates: "1903 – 2000",
          achievements:
            "Fundó el Neo-Destour en Ksar Hellal en 1934, dirigió la lucha independentista y logró la autonomía interna y plena soberanía (1956).",
        },
        {
          name: "Farhat Hached",
          role: "Fundador de la UGTT y Mártir de la Nación",
          reignOrDates: "1914 – 1952",
          achievements:
            "Fundó la central sindical autónoma UGTT en 1946 y unió a los trabajadores por la emancipación nacional antes de ser asesinado por la Mano Roja.",
        },
        {
          name: "Abdelaziz Thâalbi",
          role: "Pensador y Fundador del Destour",
          reignOrDates: "1874 – 1944",
          achievements:
            "Autor de 'La Tunisie Martyre' (1920), pionero del despertar político e intelectual moderno del pueblo tunecino.",
        },
        {
          name: "Lamine Bey",
          role: "Último Bey Soberano de Túnez",
          reignOrDates: "1943 – 1957",
          achievements:
            "Firmó el protocolo de independencia de Túnez el 20 de marzo de 1956 antes de la abolición pacífica de la monarquía en 1957.",
        },
      ],
      families: [
        {
          name: "Familias del Movimiento Nacional y Destouriano",
          role: "Militantes, ministros de la autonomía y signatarios",
          origin: "Túnez, Sahel, Sfax y Kairuán",
          lineageNotes:
            "Familias Bourguiba, Materi, Chenik, Mzali, Guellaty, Farhat, Hached, Ben Ammar, Baccouche y Slim.",
        },
        {
          name: "Dinastías Patricias de la Medina",
          role: "Magistrados, académicos y hombres de letras",
          origin: "Túnez (Medina y suburbios norte)",
          lineageNotes:
            "Familias Sfar, Mohsen, Ennaifer, Ben Achour, Chahed, Ben Romdhane, Zaouche y Baccouche.",
        },
        {
          name: "Familias Europeas de Túnez",
          role: "Médicos, ferroviarios, arquitectos y agricultores",
          origin: "Túnez, La Goleta, Bizerta, Sfax",
          lineageNotes:
            "Registros parroquiales y consulares de Sainte-Croix de Túnez, Notre-Dame de La Goleta y archivos de Nantes.",
        },
      ],
      keySites: [
        { name: "Túnez (Residencia General)", role: "Avenida de la Marina e instituciones administrativas" },
        { name: "Bizerta (Base Naval)", role: "Puerto militar estratégico" },
        { name: "Remada y Tataouine", role: "Puestos de mando de los Territorios Militares del Sur" },
      ],
      archivalSources: [
        "Registros de estado civil municipal y nacimientos (1886–1956)",
        "Centro de Archivos Diplomáticos de Nantes (CADN — Fondos Residencia General)",
        "Archivos Nacionales de Ultramar (ANOM Aix-en-Provence)",
        "Índice nominal de decretos de naturalización (1924–1927)",
      ],
    },
    republique: {
      divisions: {
        grand_tunis: {
          name: "Gran Túnez (Túnez, Ariana, Ben Arous, Manouba)",
          seat: "Túnez",
          description: "Capital política, económica y universitaria.",
        },
        nord_est: {
          name: "Noreste (Nabeul, Bizerta, Zaghouan)",
          seat: "Nabeul / Bizerta",
          description: "Cabo Bon marítimo y polo industrial de Bizerta.",
        },
        nord_ouest: {
          name: "Noroeste (Béja, Jendouba, El Kef, Siliana)",
          seat: "Béja / El Kef",
          description: "Granero de trigo y bosques de alcornoques.",
        },
        centre_est: {
          name: "Centro-Este (Susa, Monastir, Mahdia, Sfax)",
          seat: "Susa / Sfax",
          description: "Cuenca económica, textil y oleícola.",
        },
        centre_ouest: {
          name: "Centro-Oeste (Kairuán, Kasserine, Sidi Bouzid)",
          seat: "Kairuán",
          description: "Estepas históricas y cuna agrícola.",
        },
        sud_est: {
          name: "Sureste (Gabès, Médenine, Tataouine)",
          seat: "Gabès / Médenine",
          description: "Jeffara, isla de Djerba y tierra de los Ksour.",
        },
        sud_ouest: {
          name: "Suroeste (Gafsa, Tozeur, Kébili)",
          seat: "Gafsa / Tozeur",
          description: "Cuenca minera y oasis del Jérid.",
        },
      },
      leaders: [
        {
          name: "Habib Bourguiba",
          role: "Primer Presidente de la República Tunecina",
          reignOrDates: "1957 – 1987",
          achievements:
            "Padre de la república moderna; promulgó el Código del Estatuto Personal (1956) emancipando a la mujer y universalizó la educación y sanidad gratuitas.",
        },
        {
          name: "Bahi Ladgham",
          role: "Primer Ministro y Arquitecto de la Administración",
          reignOrDates: "1957 – 1970",
          achievements:
            "Secretario General de la Presidencia; estructuró los ministerios soberanos de la joven República y los planes de desarrollo.",
        },
        {
          name: "Tahar Haddad",
          role: "Pensador Precursor y Reformador Social",
          reignOrDates: "1899 – 1935",
          achievements:
            "Egresado de Al-Zitouna y autor de 'Nuestra Mujer en la Charia y la Sociedad', referente intelectual del Código del Estatuto Personal.",
        },
        {
          name: "Beji Caid Essebsi",
          role: "Estadista y Presidente de la República",
          reignOrDates: "2014 – 2019",
          achievements:
            "Ministro histórico de Bourguiba, Primer Ministro de la transición democrática en 2011 y primer presidente elegido por sufragio directo en 2014.",
        },
      ],
      families: [
        {
          name: "Grandes Familias Universitarias y Republicanas",
          role: "Catedráticos, diplomáticos, magistrados y médicos",
          origin: "Las 24 gobernaciones unificadas",
          lineageNotes:
            "Linajes que forjaron la estructura administrativa, hospitalaria y universitaria del Túnez independiente.",
        },
        {
          name: "Cuadros Fundadores de la Administración Tunecina",
          role: "Ingenieros, planificadores y oficiales",
          origin: "Gran Túnez, Sahel, Sur y Noroeste",
          lineageNotes:
            "Expedientes conservados en La Kasbah y los Archivos Nacionales de Túnez (fondos Presidencia y Ministerios).",
        },
      ],
      keySites: [
        { name: "Palacio de Cartago", role: "Presidencia de la República Tunecina" },
        { name: "La Kasbah (Palacio de Gobierno)", role: "Jefatura de Gobierno y Archivos Nacionales de Túnez" },
        { name: "Le Bardo (Asamblea de Representantes)", role: "Sede del poder legislativo" },
        { name: "Bizerta (Monumento a la Evacuación)", role: "Símbolo de la liberación integral (15 de octubre de 1963)" },
      ],
      archivalSources: [
        "Archivos Nacionales de Túnez (Fondos República, Presidencia y Ministerios)",
        "Diario Oficial de la República Tunecina (JORT desde 1956)",
        "Registros civiles contemporáneos de los 350 municipios de Túnez",
      ],
    },
  },
  it: {
    almohade: {
      divisions: {
        tunis_almohad: {
          name: "Governatorato di Tunisi",
          seat: "Tunisi",
          description: "Residenza del governatore almohade Abu Muhammad Abd al-Wahid.",
        },
        mahdia_liberee: {
          name: "Mahdia Riconquistata",
          seat: "Mahdia",
          description: "Fine dell'occupazione normanna nel 1159.",
        },
        kairouan_almohad: {
          name: "Qayrawan",
          seat: "Qayrawan",
          description: "Riorganizzazione dei beni habous.",
        },
      },
      leaders: [
        {
          name: "Abd al-Mu'min Ibn Ali",
          role: "Primo Califfo Almohade del Grande Maghreb",
          reignOrDates: "1130 – 1163",
          achievements:
            "Unificò tutto il Nord Africa e Al-Andalus sotto un unico impero e liberò Tunisi e Mahdia dai Normanni nel 1159.",
        },
        {
          name: "Abu Yusuf Yaqub al-Mansur",
          role: "Califfo Almohade Costruttore",
          reignOrDates: "1184 – 1199",
          achievements:
            "Vincitore della battaglia di Alarcos, mecenate del filosofo Averroè e restauratore delle fortificazioni d'Ifriqiya.",
        },
        {
          name: "Sceicco Abd al-Wahid Ibn Abi Hafs",
          role: "Governatore Almohade d'Ifriqiya",
          reignOrDates: "1207 – 1221",
          achievements:
            "Nominato dal califfo al-Nasir per pacificare l'Ifriqiya, si stabilì a Tunisi gettando le basi dinastiche degli Hafsidi.",
        },
        {
          name: "Yahya Ibn Ghaniya",
          role: "Principe Almoravide Insorgente",
          reignOrDates: "1184 – 1237",
          achievements:
            "Capo della resistenza almoravide che sfidò il potere almohade per mezzo secolo nel Sud tunisino e nel Jérid.",
        },
      ],
      families: [
        {
          name: "Casa dei Banu Hafs (Hintata)",
          role: "Governatori d'Ifriqiya e futuri Sultani",
          origin: "Tinmel / Kasbah di Tunisi",
          lineageNotes:
            "Discendenti dello sceicco Abu Hafs Umar, élite religiosa e militare masmuda chiamata a regnare su Tunisi.",
        },
        {
          name: "Dinastia Mu'minide Almohade",
          role: "Califfi universali di Marrakech e Siviglia",
          origin: "Marrakech",
          lineageNotes:
            "Stirpe califfale discesa da Abd al-Mu'min che istituì il censimento catastale di tutto il Maghreb.",
        },
        {
          name: "Banu Ghaniya Almoravidi",
          role: "Signori nomadi ribelli del Sud",
          origin: "Baleari / Jérid e Gafsa",
          lineageNotes:
            "Ultimo ramo principesco almoravide che mantenne la resistenza nomade nelle oasi tunisine.",
        },
      ],
      keySites: [
        { name: "La Kasbah di Tunisi", role: "Residenza dei governatori almohadi" },
        { name: "Mahdia", role: "Liberazione navale del 1159" },
      ],
      archivalSources: [
        "Trattati di Ibn Tumart e carte almohadi di Tunisi",
        "Scritti di Ibn al-Abbar sull'Ifriqiya almohade",
      ],
    },
    hafside: {
      divisions: {
        outan_tunis: {
          name: "Outan di Tunisi e Sahel",
          seat: "Tunisi (Dar El Sultan)",
          description: "Cuore economico, madrase e corporazioni degli artigiani andalusi.",
        },
        outan_kef: {
          name: "Outan di El Kef e Medjerda",
          seat: "El Kef (Al-Kaf)",
          description: "Bastione difensivo di fronte agli emiri occidentali.",
        },
        outan_djerid: {
          name: "Outan del Jérid",
          seat: "Tozeur",
          description: "Zawiye dotte e catasto idraulico di Ibn Chabbat.",
        },
        outan_gabes_djerba: {
          name: "Outan di Gabès e Gerba",
          seat: "Gabès",
          description: "Difesa costiera contro i corsari aragonesi e spagnoli.",
        },
      },
      leaders: [
        {
          name: "Abu Zakariya Yahya I",
          role: "Fondatore del Sultanato Hafside Indipendente",
          reignOrDates: "1228 – 1249",
          achievements:
            "Proclamò la piena sovranità della Tunisia, rese Tunisi capitale ufficiale ed edificò la Madrasa Ech-Chammaïyya.",
        },
        {
          name: "Al-Mustansir Billah",
          role: "Sultano e Califfo Universale di Tunisi",
          reignOrDates: "1249 – 1277",
          achievements:
            "Riconosciuto Califfo dell'Islam dagli sceriffi della Mecca nel 1259; respinse la Crociata di Luigi IX a Cartagine (1270).",
        },
        {
          name: "Abu Faris Abd al-Aziz",
          role: "Sultano Hafside Riformatore",
          reignOrDates: "1394 – 1434",
          achievements:
            "Ristabilì l'unità territoriale da Tripoli a Costantina, fondò ospedali e biblioteche e dotò la Zitouna di manoscritti.",
        },
        {
          name: "Ibn Khaldun",
          role: "Padre della Storia Moderna e della Sociologia",
          reignOrDates: "1332 – 1406",
          achievements:
            "Nato nella Medina di Tunisi (via Tourbet el-Bey), insegnò alla Zitouna e compose la Muqaddima e il Kitab al-Ibar.",
        },
      ],
      families: [
        {
          name: "Dinastia dei Sultani Hafsidi",
          role: "Casa regnante sull'Ifriqiya",
          origin: "Palazzo della Kasbah di Tunisi",
          lineageNotes:
            "Stirpe sovrana che guidò la Tunisia per 346 anni garantendo prosperità e trattati internazionali.",
        },
        {
          name: "Casa di Ibn Khaldun (Banu Khaldun)",
          role: "Patrizi, magistrati e ministri",
          origin: "Siviglia / Tourbet El Bey, Tunisi",
          lineageNotes:
            "Illustre famiglia andalusa di ascendenza yemenita hadrami che diede insigni ministri e giudici a Tunisi.",
        },
        {
          name: "Patriziato Andaluso Esule",
          role: "Eruditi, poeti, maestri artigiani e visir",
          origin: "Cordova, Valencia, Siviglia e Granada",
          lineageNotes:
            "Grandi famiglie (Ibn al-Abbar, Al-Qalshani, Ibn Hazm) che rinnovarono arti, agronomia e lettere tunisine.",
        },
        {
          name: "Casa di Ibn Arafa e Ulema della Zitouna",
          role: "Supremi mufti e maestri di giurisprudenza",
          origin: "Medina di Tunisi",
          lineageNotes:
            "Lignaggio del grande imam Ibn Arafa (1316–1401) che codificò per secoli il diritto notarile tunisino.",
        },
      ],
      keySites: [
        { name: "Tunisi (La Kasbah)", role: "Capitale reale hafside e sede della Zitouna" },
        { name: "Testour", role: "Città andalusa della valle della Medjerda" },
        { name: "Le Bardo", role: "Residenza dei giardini e padiglioni reali hafsidi" },
      ],
      archivalSources: [
        "Manoscritti della Biblioteca Nazionale della Tunisia (Fondi Zitouna)",
        "Trattati diplomatici hafsidi conservati negli archivi di Barcellona e Firenze",
        "Atti notarili dei morischi andalusi di Testour e Soliman",
        "La Muqaddima e la Storia dei Berberi di Ibn Khaldun (nato a Tunisi nel 1332)",
      ],
    },
    ottomane: {
      divisions: {
        dar_el_bey: {
          name: "Governatorato di Tunisi e La Kasbah",
          seat: "Tunisi",
          description: "Sede del Dey, della milizia dei Giannizzeri e dei Muradidi.",
        },
        goulette_arsenal: {
          name: "La Goletta (Halk El Oued)",
          seat: "La Goletta",
          description: "Fortezza della Karraka e base della flotta corsara ottomana.",
        },
        garnison_kef: {
          name: "Guarnigione di Frontiera di El Kef",
          seat: "El Kef",
          description: "Piazzaforte chiave di fronte alla Reggenza d'Algeri.",
        },
        caidat_beja_1600: {
          name: "Caidato di Béja e Medjerda",
          seat: "Béja",
          description: "Controllo cerealicolo e cavalleria degli Spahi.",
        },
        caidat_jlass_1600: {
          name: "Caidato dei Jlass e Qayrawan",
          seat: "Qayrawan",
          description: "Sicurezza della grande piana centrale.",
        },
        caidat_sfax_sahel: {
          name: "Caidato di Sfax e del Sahel",
          seat: "Sfax",
          description: "Commercio marittimo dell'olio d'oliva dell'Impero.",
        },
        caidat_djerid_1600: {
          name: "Caidato del Jérid",
          seat: "Tozeur",
          description: "Oasi e carovane transahariane.",
        },
        caidat_ouerghemma_1600: {
          name: "Confederazione degli Ouerghemma",
          seat: "Médenine",
          description: "Difesa della frontiera di fronte a Tripoli.",
        },
      },
      leaders: [
        {
          name: "Sinan Pascià e Uluj Ali (Kilij Ali)",
          role: "Grandi Ammiragli Ottomani",
          reignOrDates: "1574",
          achievements:
            "Espulsero definitivamente le guarnigioni spagnole da La Goletta e Tunisi, sancendo la reggenza ottomana autonoma.",
        },
        {
          name: "Murad Bey I",
          role: "Fondatore della Dinastia Ereditaria Muradide",
          reignOrDates: "1613 – 1631",
          achievements:
            "Primo bey ereditario di Tunisi; riorganizzò la riscossione fiscale interna con la spedizione semestrale della Mahalla.",
        },
        {
          name: "Hammouda Pascià Bey il Muradide",
          role: "Bey Sovrano Costruttore",
          reignOrDates: "1631 – 1666",
          achievements:
            "Eresse la Moschea Hammouda Pascià dal minareto ottagonale, fondò il souk delle chechia e dotò Tunisi di fondouk mercantili.",
        },
        {
          name: "Youssef Dey e Othman Dey",
          role: "Dey Sovrani dell'Ojak di Tunisi",
          reignOrDates: "1598 – 1637",
          achievements:
            "Edificarono la prima moschea hanafita di Tunisi e organizzarono l'accoglienza degli 80.000 morischi espulsi dalla Spagna (1609).",
        },
      ],
      families: [
        {
          name: "Dinastia Beylicale dei Muradidi",
          role: "Bey ereditari di Tunisi",
          origin: "Medina di Tunisi (Dar El-Bey)",
          lineageNotes:
            "Stirpe principesca fondata da Murad Bey che regnò sulla Tunisia fino al 1702.",
        },
        {
          name: "Notabili Morischi di Spagna",
          role: "Fondatori di città agricole e ingegneri",
          origin: "Testour, Soliman, Zaghouan, Tebourba",
          lineageNotes:
            "Famiglie Al-Andalusi, Ben Mustapha e Morisco che rivoluzionarono l'idraulica agricola e l'orologeria.",
        },
        {
          name: "Raïs del Mare e Ammiragliato di La Goletta",
          role: "Comandanti corsari e ammiragli",
          origin: "La Goletta / Tunisi",
          lineageNotes:
            "Lignaggi di capitani navali (Darghouth, Al-Mami, Pichinino) protagonisti della potenza marittima della Reggenza.",
        },
        {
          name: "Aristocrazia Kulogli e Turca",
          role: "Ufficiali del Diwan e magistrati hanafiti",
          origin: "Kasbah di Tunisi",
          lineageNotes:
            "Famiglie turco-tunisine detentrici degli alti comandi militari dell'Ojak.",
        },
      ],
      keySites: [
        { name: "Tunisi (Capitale dell'Eyalet)", role: "Dar El Bey, Kasbah e Moschea Youssef Dey (1616)" },
        { name: "La Goletta (Halk El Oued)", role: "Fortezza marittima costiera (La Karraka) e arsenale corsaro" },
        { name: "El Kef (Al-Kaf)", role: "Fortezza chiave di guarnigione di fronte alla Reggenza d'Algeri" },
        { name: "Biserta", role: "Guarnigione di Giannizzeri e porto dei capitani raïs" },
        { name: "Qayrawan", role: "Capitale religiosa interna e roccaforte degli ulema" },
        { name: "Sfax", role: "Grande polo marittimo ed esportatore della Reggenza" },
      ],
      archivalSources: [
        "Defter fiscali e militari ottomani (Archivi Nazionali della Tunisia — Kasbah)",
        "Sijill del Gran Tribunale della Sharia Hanafita e Malikita di Tunisi",
        "Registri consolari della cancelleria francese a Tunisi (CADN Nantes, Serie A)",
        "Archivi ottomani di Başbakanlık a Istanbul (Fondi Trablusgarp ve Tunus)",
      ],
    },
    husseinite: {
      divisions: {
        caidat_tunis_bardo: {
          name: "Caidato di Tunisi e Le Bardo",
          seat: "Le Bardo",
          description: "Palazzi beylicali, Gran Visirato e ministeri.",
        },
        caidat_jlass: {
          name: "Caidato dei Jlass",
          seat: "Qayrawan",
          description: "Censimento di 18.420 capifamiglia nella Majba del 1860.",
        },
        caidat_ouerghemma: {
          name: "Caidato degli Ouerghemma",
          seat: "Médenine",
          description: "Confederazione guerriera del Dahar e della Jeffara.",
        },
        caidat_fraichiche: {
          name: "Caidato dei Fraichiche",
          seat: "Feriana / Thala",
          description: "Alte steppe occidentali.",
        },
        caidat_djerid: {
          name: "Caidato del Jérid",
          seat: "Tozeur",
          description: "Palmeti e tribunali della Sharia delle oasi.",
        },
        caidat_beja: {
          name: "Caidato di Béja",
          seat: "Béja",
          description: "Piana della Medjerda e tribù makhzen dei Drid.",
        },
        caidat_sousse: {
          name: "Caidato di Susa",
          seat: "Susa",
          description: "Grande polo portuale e olivicolo del Sahel.",
        },
        caidat_sfax: {
          name: "Caidato di Sfax",
          seat: "Sfax",
          description: "Commercio marittimo e tribunali mercantili.",
        },
      },
      leaders: [
        {
          name: "Hussein Ben Ali",
          role: "Fondatore della Dinastia Reale Husseinita",
          reignOrDates: "1705 – 1735",
          achievements:
            "Ristabilì la pace interna e la sovranità tunisina; fondò la Madrasa Ennakhla e il mausoleo di Tourbet El Bey.",
        },
        {
          name: "Hammouda Pascià il Grande",
          role: "Bey Sovrano di Tunisia",
          reignOrDates: "1782 – 1814",
          achievements:
            "Apogeo militare ed economico della Reggenza; respinse le mire d'Algeri e modernizzò l'esercito e il Palazzo del Bardo.",
        },
        {
          name: "Ahmed Bey I",
          role: "Sovrano Riformatore e Modernizzatore",
          reignOrDates: "1837 – 1855",
          achievements:
            "Abolì la schiavitù in Tunisia già nel 1846, fondò la Scuola Militare del Bardo nel 1840 e creò il primo esercito tunisino moderno.",
        },
        {
          name: "Kheireddine Pascià",
          role: "Gran Visir Riformatore",
          reignOrDates: "1873 – 1877",
          achievements:
            "Autore del manifesto costituzionale arabo-islamico, fondò il Collegio Sadiki nel 1875 e riorganizzò gli Habous e gli Archivi dello Stato.",
        },
        {
          name: "Sadok Bey",
          role: "Promulgatore della Costituzione",
          reignOrDates: "1859 – 1882",
          achievements:
            "Promulgò il Patto Fondamentale (Ahd El-Aman, 1857) e la prima Costituzione del mondo arabo-musulmano nel 1861.",
        },
      ],
      families: [
        {
          name: "Famiglia Reale Husseinita",
          role: "Bey e sovrani regnanti in Tunisia",
          origin: "Le Bardo / Dar El-Bey, Tunisi",
          lineageNotes:
            "Dinastia principesca sovrana dal 1705 al 1957 che diede vita allo Stato moderno tunisino.",
        },
        {
          name: "Alta Aristocrazia del Makhzen",
          role: "Grandi visir, ministri e caid",
          origin: "Tunisi, Susa e Sfax",
          lineageNotes:
            "Grandi casate di Stato: Ben Ayed, Djellouli, Lasram, Bouattour, Ben Zied, Caïd Essebsi, Sebaï, Belkodja.",
        },
        {
          name: "Lignaggi di Ulema e Sceicchi al-Islam",
          role: "Sceicchi della Zitouna e Grandi Mufti",
          origin: "Medina di Tunisi",
          lineageNotes:
            "Grandi dinastie erudite (Bayram, Ennaifer, Boukhris, Belkadhi, Baraket) titolari delle cattedre teologiche.",
        },
        {
          name: "Alta Borghesia Mercantile e Grana",
          role: "Banchieri del Bey, industriali della chechia ed esportatori",
          origin: "Tunisi, Sfax, Gerba",
          lineageNotes:
            "Famiglie Nataf, Borgel, Lumbroso, Valensi, Chemla, Zaouche e Baccouche animatrici della finanza mediterranea.",
        },
      ],
      keySites: [
        { name: "Palazzo del Bardo", role: "Residenza ufficiale dei Bey e promulgazione della Costituzione del 1861" },
        { name: "La Kasbah di Tunisi", role: "Sede del Primo Ministero e del Tesoro beylicale (Bayt al-Mal)" },
        { name: "La Mohammedia", role: "Grandioso complesso palaziale di Ahmed Bey I" },
      ],
      archivalSources: [
        "Registri completi della Majba del 1860 (ANT Kasbah — Serie da 1 a 60)",
        "Archivi del Gran Visirato di Mustapha Khaznadar e Kheireddine Pascià",
        "Sijill notarili dei 60 caidati tunisini conservati alla Kasbah",
        "Testo originale della Costituzione tunisina del 1861",
      ],
    },
    protectorat: {
      divisions: {
        cc_tunis: {
          name: "Controllo Civile di Tunisi e Dintorni",
          seat: "Tunisi",
          description: "Residenza Generale e servizi centrali dello stato civile.",
        },
        cc_bizerte: {
          name: "Controllo Civile di Biserta",
          seat: "Biserta",
          description: "Base navale strategica di Sidi Abdallah.",
        },
        cc_sousse: {
          name: "Controllo Civile di Susa",
          seat: "Susa",
          description: "Sahel e regione di Monastir.",
        },
        cc_sfax: {
          name: "Controllo Civile di Sfax",
          seat: "Sfax",
          description: "Porto fosfatiere e olivicolo.",
        },
        cc_kef: {
          name: "Controllo Civile di El Kef",
          seat: "El Kef",
          description: "Altipiani e distretti minerari.",
        },
        territoires_sud: {
          name: "Territori Militari del Sud",
          seat: "Médenine / Remada",
          description: "Amministrazione militare sahariana.",
        },
      },
      leaders: [
        {
          name: "Moncef Bey (Il Bey del Popolo)",
          role: "Bey Patriota e Martire Nazionale",
          reignOrDates: "1942 – 1943",
          achievements:
            "Simbolo supremo di dignità e indipendenza nazionale; rifiutò gli ordini di Vichy, fu deposto ed esiliato dalle autorità coloniali.",
        },
        {
          name: "Habib Bourguiba",
          role: "Leader Supremo della Liberazione Nazionale",
          reignOrDates: "1903 – 2000",
          achievements:
            "Fondò il Neo-Destour a Ksar Hellal nel 1934, guidò la lotta per l'indipendenza e ottenne l'autonomia interna e la piena sovranità (1956).",
        },
        {
          name: "Farhat Hached",
          role: "Fondatore dell'UGTT e Martire della Nazione",
          reignOrDates: "1914 – 1952",
          achievements:
            "Fondò la centrale sindacale autonoma UGTT nel 1946, unì i lavoratori per l'emancipazione nazionale e fu assassinato dalla Mano Rossa.",
        },
        {
          name: "Abdelaziz Thâalbi",
          role: "Pensatore e Fondatore del Destour",
          reignOrDates: "1874 – 1944",
          achievements:
            "Autore di 'La Tunisie Martyre' (1920), pioniere del risveglio politico e intellettuale moderno del popolo tunisino.",
        },
        {
          name: "Lamine Bey",
          role: "Ultimo Bey Sovrano di Tunisi",
          reignOrDates: "1943 – 1957",
          achievements:
            "Firmò il protocollo d'indipendenza della Tunisia il 20 marzo 1956 prima dell'abolizione pacifica del beylikato nel 1957.",
        },
      ],
      families: [
        {
          name: "Famiglie del Movimento Nazionale e Destouriano",
          role: "Militanti, ministri dell'autonomia e firmatari",
          origin: "Tunisi, Sahel, Sfax e Qayrawan",
          lineageNotes:
            "Famiglie Bourguiba, Materi, Chenik, Mzali, Guellaty, Farhat, Hached, Ben Ammar, Baccouche e Slim.",
        },
        {
          name: "Dinastie Patrizie della Medina",
          role: "Magistrati, accademici e letterati",
          origin: "Tunisi (Medina e sobborghi nord)",
          lineageNotes:
            "Famiglie Sfar, Mohsen, Ennaifer, Ben Achour, Chahed, Ben Romdhane, Zaouche e Baccouche.",
        },
        {
          name: "Famiglie Europee della Tunisia",
          role: "Medici, ferrovieri, architetti e agricoltori",
          origin: "Tunisi, La Goletta, Biserta, Sfax",
          lineageNotes:
            "Registri parrocchiali e consolari di Sainte-Croix di Tunisi, Notre-Dame de La Goletta e archivi di Nantes.",
        },
      ],
      keySites: [
        { name: "Tunisi (Residenza Generale)", role: "Avenue de la Marine e istituzioni amministrative" },
        { name: "Biserta (Base Navale)", role: "Porto militare strategico" },
        { name: "Remada e Tataouine", role: "Posti di comando dei Territori Militari del Sud" },
      ],
      archivalSources: [
        "Registri di stato civile municipale e delle nascite (1886–1956)",
        "Centro degli Archivi Diplomatici di Nantes (CADN — Fondi Residenza Generale)",
        "Archivi Nazionali d'Oltremare (ANOM Aix-en-Provence)",
        "Indice nominativo dei decreti di naturalizzazione (1924–1927)",
      ],
    },
    republique: {
      divisions: {
        grand_tunis: {
          name: "Grande Tunisi (Tunisi, Ariana, Ben Arous, Manouba)",
          seat: "Tunisi",
          description: "Capitale politica, economica e universitaria.",
        },
        nord_est: {
          name: "Nord-Est (Nabeul, Biserta, Zaghouan)",
          seat: "Nabeul / Biserta",
          description: "Capo Bon marittimo e polo industriale di Biserta.",
        },
        nord_ouest: {
          name: "Nord-Ovest (Béja, Jendouba, El Kef, Siliana)",
          seat: "Béja / El Kef",
          description: "Granaio di frumento e foreste di sughere.",
        },
        centre_est: {
          name: "Centro-Est (Susa, Monastir, Mahdia, Sfax)",
          seat: "Susa / Sfax",
          description: "Bacino economico, tessile e olivicolo.",
        },
        centre_ouest: {
          name: "Centro-Ovest (Qayrawan, Kasserine, Sidi Bouzid)",
          seat: "Qayrawan",
          description: "Steppe storiche e culla agricola.",
        },
        sud_est: {
          name: "Sud-Est (Gabès, Médenine, Tataouine)",
          seat: "Gabès / Médenine",
          description: "Jeffara, isola di Gerba e terra degli Ksour.",
        },
        sud_ouest: {
          name: "Sud-Ovest (Gafsa, Tozeur, Kébili)",
          seat: "Gafsa / Tozeur",
          description: "Bacino minerario e oasi del Jérid.",
        },
      },
      leaders: [
        {
          name: "Habib Bourguiba",
          role: "Primo Presidente della Repubblica Tunisina",
          reignOrDates: "1957 – 1987",
          achievements:
            "Padre dello Stato repubblicano moderno; promulgò il Codice dello Statuto Personale (1956) emancipando la donna e generalizzò scuola e sanità gratuite.",
        },
        {
          name: "Bahi Ladgham",
          role: "Primo Ministro e Architetto dell'Amministrazione",
          reignOrDates: "1957 – 1970",
          achievements:
            "Segretario Generale della Presidenza; strutturò i ministeri sovrani della giovane Repubblica e i piani di sviluppo.",
        },
        {
          name: "Tahar Haddad",
          role: "Pensatore Precursore e Riformatore Sociale",
          reignOrDates: "1899 – 1935",
          achievements:
            "Diplomato alla Zitouna e autore di 'La nostra donna nella Sharia e nella società', guida intellettuale del Codice dello Statuto Personale.",
        },
        {
          name: "Beji Caid Essebsi",
          role: "Statista e Presidente della Repubblica",
          reignOrDates: "2014 – 2019",
          achievements:
            "Storico ministro di Bourguiba, Primo Ministro della transizione democratica nel 2011 e primo presidente eletto a suffragio diretto nel 2014.",
        },
      ],
      families: [
        {
          name: "Grandi Famiglie Universitarie e Repubblicane",
          role: "Professori, diplomatici, magistrati e medici",
          origin: "Tutti i 24 governatorati unificati",
          lineageNotes:
            "Lignaggi che edificarono la struttura amministrativa, ospedaliera e universitaria della Tunisia indipendente.",
        },
        {
          name: "Quadri Fondatori dell'Amministrazione Tunisina",
          role: "Ingegneri, pianificatori e ufficiali",
          origin: "Grande Tunisi, Sahel, Sud e Nord-Ovest",
          lineageNotes:
            "Fascicoli d'archivio conservati alla Kasbah e agli Archivi Nazionali della Tunisia (fondi Presidenza e Ministeri).",
        },
      ],
      keySites: [
        { name: "Palazzo di Cartagine", role: "Presidenza della Repubblica Tunisina" },
        { name: "La Kasbah (Palazzo del Governo)", role: "Capo del Governo e Archivi Nazionali della Tunisia" },
        { name: "Le Bardo (Assemblea dei Rappresentanti)", role: "Sede del potere legislativo" },
        { name: "Biserta (Monumento dell'Evacuazione)", role: "Simbolo della liberazione integrale (15 ottobre 1963)" },
      ],
      archivalSources: [
        "Archivi Nazionali della Tunisia (Fondi Repubblica, Presidenza e Ministeri)",
        "Gazzetta Ufficiale della Repubblica Tunisina (JORT dal 1956)",
        "Registri civili contemporanei dei 350 comuni della Tunisia",
      ],
    },
  },
  mt: {
    almohade: {
      divisions: {
        tunis_almohad: {
          name: "Governatorat ta' Tuneż",
          seat: "Tuneż",
          description: "Residenza tal-gvernatur Almohad Abu Muhammad Abd al-Wahid.",
        },
        mahdia_liberee: {
          name: "Mahdia Liberata",
          seat: "Mahdia",
          description: "Tmiem tal-okkupazzjoni Normanna fl-1159.",
        },
        kairouan_almohad: {
          name: "Kairouan",
          seat: "Kairouan",
          description: "Riorganizzazzjoni tal-proprjetajiet Habous.",
        },
      },
      leaders: [
        {
          name: "Abd al-Mu'min Ibn Ali",
          role: "L-Ewwel Kaliff Almohad tal-Magreb il-Kbir",
          reignOrDates: "1130 – 1163",
          achievements:
            "Għaqqad l-Afrika ta' Fuq kollha u Al-Andalus taħt imperu wieħed u ħeles lil Tuneż u Mahdia min-Normanni fl-1159.",
        },
        {
          name: "Abu Yusuf Yaqub al-Mansur",
          role: "Kaliff Almohad Bennej",
          reignOrDates: "1184 – 1199",
          achievements:
            "Rebbieħ fil-battalja ta' Alarcos, patrun tal-filosofu Averroè u restawratur tal-fortifikazzjonijiet ta' Ifriqiya.",
        },
        {
          name: "Xejk Abd al-Wahid Ibn Abi Hafs",
          role: "Gvernatur Almohad ta' Ifriqiya",
          reignOrDates: "1207 – 1221",
          achievements:
            "Maħtur mill-kaliff al-Nasir biex jipaċifika Ifriqiya, stabbilixxa ruħu f'Tuneż u waqqaf is-sisien dinastiċi tal-Hafsidi.",
        },
        {
          name: "Yahya Ibn Ghaniya",
          role: "Prinċep Almoravid Ribelli",
          reignOrDates: "1184 – 1237",
          achievements:
            "Mexxej tar-reżistenza Almoravida li sfidat il-ħakma Almohada għal nofs seklu fin-Nofsinhar tat-Tuneżija u l-Jérid.",
        },
      ],
      families: [
        {
          name: "Dar il-Banu Hafs (Hintata)",
          role: "Gvernaturi ta' Ifriqiya u Sultani futuri",
          origin: "Tinmel / Kasbah ta' Tuneż",
          lineageNotes:
            "Dixxendenti tax-Xejk Abu Hafs Umar, elita reliġjuża u militari Masmuda mħejjija biex tirrenja fuq Tuneż.",
        },
        {
          name: "Dinastija Mu'minida Almohada",
          role: "Kaliffi universali ta' Marrakexx u Sivilja",
          origin: "Marrakexx",
          lineageNotes:
            "Nisel kaliffali mnissel minn Abd al-Mu'min li waqqaf iċ-ċensiment katastali tal-Magreb kollu.",
        },
        {
          name: "Banu Ghaniya Almoravidi",
          role: "Sinjuri nomadi mhux sottomessi tan-Nofsinhar",
          origin: "Baleari / Jérid u Gafsa",
          lineageNotes:
            "L-aħħar fergħa prinċipeska Almoravida li żammet ir-reżistenza nomada fl-oasi Tuneżini.",
        },
      ],
      keySites: [
        { name: "Il-Kasbah ta' Tuneż", role: "Residenza tal-gvernaturi Almohadi" },
        { name: "Mahdia", role: "Ħelsien navali tal-1159" },
      ],
      archivalSources: [
        "Trattati ta' Ibn Tumart u karti Almohadi ta' Tuneż",
        "Kitbiet ta' Ibn al-Abbar dwar Ifriqiya Almohada",
      ],
    },
    hafside: {
      divisions: {
        outan_tunis: {
          name: "Outan ta' Tuneż u s-Saħel",
          seat: "Tuneż (Dar El Sultan)",
          description: "Qalb ekonomika, madrasas u għaqdiet tal-artiġjani Andalusin.",
        },
        outan_kef: {
          name: "Outan ta' El Kef u Medjerda",
          seat: "El Kef (Al-Kaf)",
          description: "Bastjun difensiv quddiem l-emiri tal-Punent.",
        },
        outan_djerid: {
          name: "Outan tal-Jérid",
          seat: "Tozeur",
          description: "Żawiji studjużi u katast idrawliku ta' Ibn Chabbat.",
        },
        outan_gabes_djerba: {
          name: "Outan ta' Gabès u Djerba",
          seat: "Gabès",
          description: "Difiża kostali kontra l-kursara Aragoniżi u Spanjoli.",
        },
      },
      leaders: [
        {
          name: "Abu Zakariya Yahya I",
          role: "Fundatur tas-Sultanat Hafsid Indipendenti",
          reignOrDates: "1228 – 1249",
          achievements:
            "Ipproklama s-sovranità sħiħa tat-Tuneżija, għamel lil Tuneż kapitali uffiċjali u bena l-Madrasa Ech-Chammaïyya.",
        },
        {
          name: "Al-Mustansir Billah",
          role: "Sultan u Kaliff Universali ta' Tuneż",
          reignOrDates: "1249 – 1277",
          achievements:
            "Rikonoxxut bħala Kaliff tal-Iżlam mix-xrifji ta' Mekka fl-1259; rebaħ kontra l-Kruċjata ta' Lwiġi IX f'Kartaġni (1270).",
        },
        {
          name: "Abu Faris Abd al-Aziz",
          role: "Sultan Hafsid Riformatur",
          reignOrDates: "1394 – 1434",
          achievements:
            "Irrestawra l-unità territorjali minn Tripli sa Kostantina, waqqaf sptarijiet u bibljoteki u żied manuskritti f'Al-Zitouna.",
        },
        {
          name: "Ibn Khaldun",
          role: "Missier l-Istorja Moderna u s-Soċjoloġija",
          reignOrDates: "1332 – 1406",
          achievements:
            "Imwieled fil-Medina ta' Tuneż (triq Tourbet el-Bey), għallem f'Al-Zitouna u kiteb il-Muqaddima u l-Kitab al-Ibar.",
        },
      ],
      families: [
        {
          name: "Dinastija tas-Sultani Hafsidi",
          role: "Dar rjali fuq Ifriqiya",
          origin: "Palazz tal-Kasbah ta' Tuneż",
          lineageNotes:
            "Nisel sovran li mexxa t-Tuneżija għal 346 sena u żgura prosperità u trattati internazzjonali.",
        },
        {
          name: "Dar Ibn Khaldun (Banu Khaldun)",
          role: "Patriċji, maġistrati u ministri",
          origin: "Sivilja / Tourbet El Bey, Tuneż",
          lineageNotes:
            "Familja Andalusina illustri ta' dixxendenza Jemenita Hadrami li tat ministri u mħallfin kbar lil Tuneż.",
        },
        {
          name: "Patriċjat Andalusin Refuġjat",
          role: "Studjużi, poeti, artiġjani u viżiri",
          origin: "Kordoba, Valenzja, Sivilja u Granada",
          lineageNotes:
            "Familji kbar (Ibn al-Abbar, Al-Qalshani, Ibn Hazm) li ttrasformaw l-arti, l-agrikoltura u l-ittri Tuneżini.",
        },
        {
          name: "Dar Ibn Arafa u l-Ulema ta' Zitouna",
          role: "Mufti supremi u kaptani tal-ġurisprudenza",
          origin: "Medina ta' Tuneż",
          lineageNotes:
            "Nisel tal-Imam il-Kbir Ibn Arafa (1316–1401) li kkodifika l-liġi nutarili Tuneżina għal sekli sħaħ.",
        },
      ],
      keySites: [
        { name: "Tuneż (Il-Kasbah)", role: "Kapitali rjali Hafsida u sede ta' Al-Zitouna" },
        { name: "Testour", role: "Belt Andalusina tal-wied tal-Medjerda" },
        { name: "Le Bardo", role: "Residenza tal-ġonna u l-pavaljuni Hafsidi" },
      ],
      archivalSources: [
        "Manuskritti tal-Bibljoteka Nazzjonali tat-Tuneżija (Fondi Zitouna)",
        "Trattati diplomatiċi Hafsidi miżmuma fl-arkivji ta' Barċellona u Firenze",
        "Kuntratti nutarili tal-Moriski Andalusin ta' Testour u Soliman",
        "Il-Muqaddima u l-Istorja tal-Berberi ta' Ibn Khaldun (imwieled f'Tuneż fl-1332)",
      ],
    },
    ottomane: {
      divisions: {
        dar_el_bey: {
          name: "Governatorat ta' Tuneż u l-Kasbah",
          seat: "Tuneż",
          description: "Sede tad-Dey, tal-milizzja tal-Ġanissari u tal-Muradidi.",
        },
        goulette_arsenal: {
          name: "La Goulette (Halk El Oued)",
          seat: "La Goulette",
          description: "Fortizza ta' La Karraka u bażi tal-flotta kursara Ottomana.",
        },
        garnison_kef: {
          name: "Gwarniġjon tal-Fruntiera ta' El Kef",
          seat: "El Kef",
          description: "Fortizza ewlenija quddiem ir-Reġġenza ta' Alġer.",
        },
        caidat_beja_1600: {
          name: "Kajdat ta' Béja u Medjerda",
          seat: "Béja",
          description: "Kontroll taċ-ċereali u kavallerija Spahi.",
        },
        caidat_jlass_1600: {
          name: "Kajdat ta' Jlass u Kairouan",
          seat: "Kairouan",
          description: "Sigurtà tal-pjanura ċentrali kbira.",
        },
        caidat_sfax_sahel: {
          name: "Kajdat ta' Sfax u s-Saħel",
          seat: "Sfax",
          description: "Kummerċ marittimu taż-żejt taż-żebbuġa tal-Imperu.",
        },
        caidat_djerid_1600: {
          name: "Kajdat tal-Jérid",
          seat: "Tozeur",
          description: "Oasi u karavani trans-Saħarjani.",
        },
        caidat_ouerghemma_1600: {
          name: "Konfederazzjoni ta' Ouerghemma",
          seat: "Médenine",
          description: "Difiża tal-fruntiera quddiem Tripli.",
        },
      },
      leaders: [
        {
          name: "Sinan Pasha u Uluj Ali (Kilij Ali)",
          role: "Gran Ammiralli Ottomani",
          reignOrDates: "1574",
          achievements:
            "Keċċew għal dejjem il-gwarniġjoni Spanjoli minn La Goulette u Tuneż, u ssieltu l-istatus ta' reġġenza Ottomana awtonoma.",
        },
        {
          name: "Murad Bey I",
          role: "Fundatur tad-Dinastija Ereditarja Muradida",
          reignOrDates: "1613 – 1631",
          achievements:
            "L-ewwel bey ereditarju ta' Tuneż; riorganizza l-ġbir fiskali intern permezz tad-dawra biannwali tal-Mahalla.",
        },
        {
          name: "Hammouda Pasha Bey il-Muradid",
          role: "Bey Sovran Bennej",
          reignOrDates: "1631 – 1666",
          achievements:
            "Bena l-Moskea Hammouda Pasha bil-minaret ottagonali, waqqaf is-suq taċ-chechia u għammar lil Tuneż b'fondouks kummerċjali.",
        },
        {
          name: "Youssef Dey u Othman Dey",
          role: "Dey Sovrani tal-Ojak ta' Tuneż",
          reignOrDates: "1598 – 1637",
          achievements:
            "Bnew l-ewwel moskea Hanafi f'Tuneż u organizzaw il-merħba tat-80,000 Moriski mkeċċija minn Spanja (1609).",
        },
      ],
      families: [
        {
          name: "Dinastija Bejlikali tal-Muradidi",
          role: "Bejiet ereditarji ta' Tuneż",
          origin: "Medina ta' Tuneż (Dar El-Bey)",
          lineageNotes:
            "Nisel prinċipesk imwaqqaf minn Murad Bey li ħakem fuq it-Tuneżija sal-1702.",
        },
        {
          name: "Notabbli Moriski minn Spanja",
          role: "Fundaturi ta' bliet agrikoli u inġiniera",
          origin: "Testour, Soliman, Zaghouan, Tebourba",
          lineageNotes:
            "Familji Al-Andalusi, Ben Mustapha u Morisco li rrivoluzzjonaw it-tisqija agrikola u l-arloġġi.",
        },
        {
          name: "Raïs tal-Baħar u Ammirallat ta' La Goulette",
          role: "Kmandanti kursara u ammiralli",
          origin: "La Goulette / Tuneż",
          lineageNotes:
            "Nisel ta' kaptani navali (Darghouth, Al-Mami, Pichinino) li żguraw il-qawwa marittima tar-Reġġenza.",
        },
        {
          name: "Aristokrazija Kulugli u Torka",
          role: "Uffiċjali tad-Diwan u maġistrati Hanafi",
          origin: "Kasbah ta' Tuneż",
          lineageNotes:
            "Familji Torko-Tuneżini li kellhom il-kmandi militari għoljin tal-Ojak.",
        },
      ],
      keySites: [
        { name: "Tuneż (Kapitali tal-Eyalet)", role: "Dar El Bey, Kasbah u Moskea Youssef Dey (1616)" },
        { name: "La Goulette (Halk El Oued)", role: "Fortizza marittima kostali (La Karraka) u tarzna tal-kursara" },
        { name: "El Kef (Al-Kaf)", role: "Fortizza ewlenija tal-gwarniġjon quddiem ir-Reġġenza ta' Alġer" },
        { name: "Bizerte", role: "Gwarniġjon tal-Ġanissari u port tal-kaptani raïs" },
        { name: "Kairouan", role: "Kapitali reliġjuża interna u fortizza tal-ulema" },
        { name: "Sfax", role: "Ċentru kbir marittimu u esportatur tar-Reġġenza" },
      ],
      archivalSources: [
        "Defters fiskali u militari Ottomani (Arkivji Nazzjonali tat-Tuneżija — Kasbah)",
        "Sijills tal-Qorti l-Kbira tax-Xarija Hanafi u Maliki ta' Tuneż",
        "Reġistri konsulari tal-kanċellerija Franċiża f'Tuneż (CADN Nantes, Serje A)",
        "Arkivji Ottomani ta' Başbakanlık f'Istanbul (Fondi Trablusgarp ve Tunus)",
      ],
    },
    husseinite: {
      divisions: {
        caidat_tunis_bardo: {
          name: "Kajdat ta' Tuneż u Le Bardo",
          seat: "Le Bardo",
          description: "Palazzi bejlikali, Gran Viżirat u ministeri.",
        },
        caidat_jlass: {
          name: "Kajdat ta' Jlass",
          seat: "Kairouan",
          description: "Ċensiment ta' 18,420 kap ta' familja fil-Majba tal-1860.",
        },
        caidat_ouerghemma: {
          name: "Kajdat ta' Ouerghemma",
          seat: "Médenine",
          description: "Konfederazzjoni ta' gwerriera tad-Dahar u Jeffara.",
        },
        caidat_fraichiche: {
          name: "Kajdat ta' Fraichiche",
          seat: "Feriana / Thala",
          description: "Steppi Għoljin tal-Punent.",
        },
        caidat_djerid: {
          name: "Kajdat tal-Jérid",
          seat: "Tozeur",
          description: "Ġonna tal-palmi u qrati tax-Xarija tal-oasi.",
        },
        caidat_beja: {
          name: "Kajdat ta' Béja",
          seat: "Béja",
          description: "Pjanura tal-Medjerda u tribujiet makhzen ta' Drid.",
        },
        caidat_sousse: {
          name: "Kajdat ta' Sousse",
          seat: "Sousse",
          description: "Ċentru kbir tal-port u ż-żebbuġ tas-Saħel.",
        },
        caidat_sfax: {
          name: "Kajdat ta' Sfax",
          seat: "Sfax",
          description: "Kummerċ marittimu u qrati kummerċjali.",
        },
      },
      leaders: [
        {
          name: "Hussein Ben Ali",
          role: "Fundatur tad-Dinastija Rjali Husseinita",
          reignOrDates: "1705 – 1735",
          achievements:
            "Irrestawra l-paċi interna u s-sovranità Tuneżina; waqqaf il-Madrasa Ennakhla u l-mawżolew ta' Tourbet El Bey.",
        },
        {
          name: "Hammouda Pasha l-Kbir",
          role: "Bey Sovran tat-Tuneżija",
          reignOrDates: "1782 – 1814",
          achievements:
            "Qofol militari u ekonomiku tar-Reġġenza; rebaħ kontra t-theddid minn Alġer u mmodernizza l-armata u l-Palazz tal-Bardo.",
        },
        {
          name: "Ahmed Bey I",
          role: "Sovran Riformatur u Modernizzatur",
          reignOrDates: "1837 – 1855",
          achievements:
            "Abbolixxa l-iskjavitù fit-Tuneżija sa mill-1846, waqqaf l-Iskola Militari tal-Bardo fl-1840 u bena l-ewwel armata Tuneżina moderna.",
        },
        {
          name: "Kheireddine Pasha",
          role: "Gran Viżir Riformatur",
          reignOrDates: "1873 – 1877",
          achievements:
            "Awtur tat-trattat kostituzzjonali Għarbi-Musulman, waqqaf il-Kulleġġ Sadiki fl-1875 u riorganizza l-Habous u l-Arkivji tal-Istat.",
        },
        {
          name: "Sadok Bey",
          role: "Promulgatur tal-Kostituzzjoni",
          reignOrDates: "1859 – 1882",
          achievements:
            "Ippromulga l-Patt Fundamentali (Ahd El-Aman, 1857) u l-ewwel Kostituzzjoni fid-dinja Għarbija-Musulmana fl-1861.",
        },
      ],
      families: [
        {
          name: "Familja Rjali Husseinita",
          role: "Bejiet u sovrani li ħakmu fuq it-Tuneżija",
          origin: "Le Bardo / Dar El-Bey, Tuneż",
          lineageNotes:
            "Dinastija prinċipeska sovrana mill-1705 sal-1957 li bniet l-Istat modern Tuneżin.",
        },
        {
          name: "Aristokrazija Għolja tal-Makhzen",
          role: "Gran viżiri, ministri u kajdi",
          origin: "Tuneż, Sousse u Sfax",
          lineageNotes:
            "Familji kbar tal-Istat: Ben Ayed, Djellouli, Lasram, Bouattour, Ben Zied, Caïd Essebsi, Sebaï, Belkodja.",
        },
        {
          name: "Nisel ta' Ulema u Xejkijiet al-Islam",
          role: "Xejkijiet ta' Al-Zitouna u Gran Mufti",
          origin: "Medina ta' Tuneż",
          lineageNotes:
            "Dinastiji kbar ta' studjużi (Bayram, Ennaifer, Boukhris, Belkadhi, Baraket) fuq il-katedri teoloġiċi.",
        },
        {
          name: "Burgważija Għolja Merkantili u Grana",
          role: "Bankiera tal-Bey, industrijalisti taċ-chechia u esportaturi",
          origin: "Tuneż, Sfax, Djerba",
          lineageNotes:
            "Familji Nataf, Borgel, Lumbroso, Valensi, Chemla, Zaouche u Baccouche li mexxew il-finanzi Mediterranji.",
        },
      ],
      keySites: [
        { name: "Palazz tal-Bardo", role: "Residenza uffiċjali tal-Bejiet u promulgazzjoni tal-Kostituzzjoni tal-1861" },
        { name: "Il-Kasbah ta' Tuneż", role: "Sede tal-Prim Ministru u tat-Teżor bejlikal (Bayt al-Mal)" },
        { name: "La Mohammedia", role: "Kumpless monumentali tal-palazz ta' Ahmed Bey I" },
      ],
      archivalSources: [
        "Reġistri sħaħ tal-Majba tal-1860 (ANT Kasbah — Serje 1 sa 60)",
        "Arkivji tal-Gran Viżirat ta' Mustapha Khaznadar u Kheireddine Pasha",
        "Sijills nutarili tas-60 kajdat Tuneżin miżmuma fil-Kasbah",
        "Test oriġinali tal-Kostituzzjoni Tuneżina tal-1861",
      ],
    },
    protectorat: {
      divisions: {
        cc_tunis: {
          name: "Kontroll Ċivili ta' Tuneż u s-Subborgi",
          seat: "Tuneż",
          description: "Residenza Ġenerali u servizzi ċentrali tal-istat ċivili.",
        },
        cc_bizerte: {
          name: "Kontroll Ċivili ta' Bizerte",
          seat: "Bizerte",
          description: "Bażi navali strateġika ta' Sidi Abdallah.",
        },
        cc_sousse: {
          name: "Kontroll Ċivili ta' Sousse",
          seat: "Sousse",
          description: "Saħel u reġjun ta' Monastir.",
        },
        cc_sfax: {
          name: "Kontroll Ċivili ta' Sfax",
          seat: "Sfax",
          description: "Port tal-fosfati u ż-żejt taż-żebbuġa.",
        },
        cc_kef: {
          name: "Kontroll Ċivili ta' El Kef",
          seat: "El Kef",
          description: "Plateaux għoljin u distretti tal-minjieri.",
        },
        territoires_sud: {
          name: "Territorji Militari tan-Nofsinhar",
          seat: "Médenine / Remada",
          description: "Amministrazzjoni militari Saħarjana.",
        },
      },
      leaders: [
        {
          name: "Moncef Bey (Il-Bey tal-Poplu)",
          role: "Bey Patrijott u Martri Nazzjonali",
          reignOrDates: "1942 – 1943",
          achievements:
            "Simbolu suprem ta' dinjità u indipendenza nazzjonali; irrifjuta l-ordnijiet ta' Vichy, tneħħa u ġie eżiljat mill-awtoritajiet koloniali.",
        },
        {
          name: "Habib Bourguiba",
          role: "Mexxej Suprem tal-Ħelsien Nazzjonali",
          reignOrDates: "1903 – 2000",
          achievements:
            "Waqqaf in-Neo-Destour f'Ksar Hellal fl-1934, mexxa l-ġlieda għall-indipendenza u kiseb l-awtonomija interna u s-sovranità sħiħa (1956).",
        },
        {
          name: "Farhat Hached",
          role: "Fundatur tal-UGTT u Martri tan-Nazzjon",
          reignOrDates: "1914 – 1952",
          achievements:
            "Waqqaf l-għaqda trejdunjonista awtonoma UGTT fl-1946, għaqqad lill-ħaddiema għall-emanċipazzjoni nazzjonali u nqatel mill-Id il-Ħamra.",
        },
        {
          name: "Abdelaziz Thâalbi",
          role: "Ħassieb u Fundatur tad-Destour",
          reignOrDates: "1874 – 1944",
          achievements:
            "Awtur ta' 'La Tunisie Martyre' (1920), pijunier tal-qawmien politiku u intellettwali modern tal-poplu Tuneżin.",
        },
        {
          name: "Lamine Bey",
          role: "L-Aħħar Bey Sovran ta' Tuneż",
          reignOrDates: "1943 – 1957",
          achievements:
            "Iffirma l-protokoll tal-indipendenza tat-Tuneżija fl-20 ta' Marzu 1956 qabel l-abolizzjoni paċifika tar-reġim bejlikal fl-1957.",
        },
      ],
      families: [
        {
          name: "Familji tal-Moviment Nazzjonali u Destourjan",
          role: "Militanti, ministri tal-awtonomija u firmatarji",
          origin: "Tuneż, Saħel, Sfax u Kairouan",
          lineageNotes:
            "Familji Bourguiba, Materi, Chenik, Mzali, Guellaty, Farhat, Hached, Ben Ammar, Baccouche u Slim.",
        },
        {
          name: "Dinastiji Patriċji tal-Medina",
          role: "Maġistrati, akkademiċi u kittieba",
          origin: "Tuneż (Medina u subborgi tat-tramuntana)",
          lineageNotes:
            "Familji Sfar, Mohsen, Ennaifer, Ben Achour, Chahed, Ben Romdhane, Zaouche u Baccouche.",
        },
        {
          name: "Familji Ewropej tat-Tuneżija",
          role: "Tobba, ħaddiema tal-ferroviji, arkitetti u bdiewa",
          origin: "Tuneż, La Goulette, Bizerte, Sfax",
          lineageNotes:
            "Reġistri parrokkjali u konsulari ta' Sainte-Croix ta' Tuneż, Notre-Dame ta' La Goulette u l-arkivji ta' Nantes.",
        },
      ],
      keySites: [
        { name: "Tuneż (Residenza Ġenerali)", role: "Avenue de la Marine u istituzzjonijiet amministrattivi" },
        { name: "Bizerte (Bażi Navali)", role: "Port militari strateġiku" },
        { name: "Remada u Tataouine", role: "Postijiet ta' kmand tat-Territorji Militari tan-Nofsinhar" },
      ],
      archivalSources: [
        "Reġistri tal-istat ċivili muniċipali u tat-twelid (1886–1956)",
        "Ċentru tal-Arkivji Diplomatiċi ta' Nantes (CADN — Fondi Residenza Ġenerali)",
        "Arkivji Nazzjonali ta' Barra (ANOM Aix-en-Provence)",
        "Indiċi nominali tad-digrieti ta' naturalizzazzjoni (1924–1927)",
      ],
    },
    republique: {
      divisions: {
        grand_tunis: {
          name: "Tuneż il-Kbira (Tuneż, Ariana, Ben Arous, Manouba)",
          seat: "Tuneż",
          description: "Kapitali politika, ekonomika u universitarja.",
        },
        nord_est: {
          name: "Grigal (Nabeul, Bizerte, Zaghouan)",
          seat: "Nabeul / Bizerte",
          description: "Cap Bon marittimu u ċentru industrijali ta' Bizerte.",
        },
        nord_ouest: {
          name: "Majjistral (Béja, Jendouba, El Kef, Siliana)",
          seat: "Béja / El Kef",
          description: "Maħżen tal-qamħ u foresti tas-sufra.",
        },
        centre_est: {
          name: "Ċentru-Lvant (Sousse, Monastir, Mahdia, Sfax)",
          seat: "Sousse / Sfax",
          description: "Baċin ekonomiku, tat-tessuti u taż-żebbuġ.",
        },
        centre_ouest: {
          name: "Ċentru-Punent (Kairouan, Kasserine, Sidi Bouzid)",
          seat: "Kairouan",
          description: "Steppi storiċi u qalb agrikola.",
        },
        sud_est: {
          name: "Xlokk (Gabès, Médenine, Tataouine)",
          seat: "Gabès / Médenine",
          description: "Jeffara, gżira ta' Djerba u art tal-Ksour.",
        },
        sud_ouest: {
          name: "Lbiċ (Gafsa, Tozeur, Kébili)",
          seat: "Gafsa / Tozeur",
          description: "Baċin tal-minjieri u oasi tal-Jérid.",
        },
      },
      leaders: [
        {
          name: "Habib Bourguiba",
          role: "L-Ewwel President tar-Repubblika Tuneżina",
          reignOrDates: "1957 – 1987",
          achievements:
            "Missier ir-repubblika moderna; ippromulga l-Kodiċi tal-Istat Personali (1956) għall-emanċipazzjoni tan-nisa u ġeneralizza l-edukazzjoni u s-saħħa b'xejn.",
        },
        {
          name: "Bahi Ladgham",
          role: "Prim Ministru u Arkitett tal-Amministrazzjoni",
          reignOrDates: "1957 – 1970",
          achievements:
            "Segretarju Ġenerali tal-Presidenza; organizza l-ministeri sovrani tar-Repubblika żagħżugħa u l-pjanijiet ta' żvilupp.",
        },
        {
          name: "Tahar Haddad",
          role: "Ħassieb Prekursur u Riformatur Soċjali",
          reignOrDates: "1899 – 1935",
          achievements:
            "Gradwat minn Al-Zitouna u awtur ta' 'Nisietna fix-Xarija u s-Soċjetà', gwida intellettwali tal-Kodiċi tal-Istat Personali.",
        },
        {
          name: "Beji Caid Essebsi",
          role: "Statista u President tar-Repubblika",
          reignOrDates: "2014 – 2019",
          achievements:
            "Ministru storiku ta' Bourguiba, Prim Ministru tat-tranżizzjoni demokratika fl-2011 u l-ewwel president elett b'vot dirett fl-2014.",
        },
      ],
      families: [
        {
          name: "Familji Kbar Universitarji u Repubblikani",
          role: "Professuri, diplomatiċi, maġistrati u tobba",
          origin: "L-24 governatorat unifikati kollha",
          lineageNotes:
            "Nisel li bnew l-istruttura amministrattiva, tal-isptarijiet u universitarja tat-Tuneżija indipendenti.",
        },
        {
          name: "Kwadri Fundaturi tal-Amministrazzjoni Tuneżina",
          role: "Inġiniera, pjanifikaturi u uffiċjali",
          origin: "Tuneż il-Kbira, Saħel, Nofsinhar u Majjistral",
          lineageNotes:
            "Dossiers tal-arkivji miżmuma fil-Kasbah u fl-Arkivji Nazzjonali tat-Tuneżija (Fondi Presidenza u Ministeri).",
        },
      ],
      keySites: [
        { name: "Palazz ta' Kartaġni", role: "Presidenza tar-Repubblika Tuneżina" },
        { name: "Il-Kasbah (Palazz tal-Gvern)", role: "Kap tal-Gvern u Arkivji Nazzjonali tat-Tuneżija" },
        { name: "Le Bardo (Assemblea tar-Rappreżentanti)", role: "Sede tal-poter leġiżlattiv" },
        { name: "Bizerte (Monument tal-Evakwazzjoni)", role: "Simbolu tal-ħelsien integrali (15 ta' Ottubru 1963)" },
      ],
      archivalSources: [
        "Arkivji Nazzjonali tat-Tuneżija (Fondi Repubblika, Presidenza u Ministeri)",
        "Gazzetta Uffiċjali tar-Repubblika Tuneżina (JORT mill-1956)",
        "Reġistri ċivili kontemporanji tat-350 muniċipalità tat-Tuneżija",
      ],
    },
  },
};

