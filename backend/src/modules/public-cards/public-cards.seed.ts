export interface PublicCardDirectorySeed {
  kind: "archive" | "source";
  category: string;
  badge: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  sortOrder: number;
}

export const VERIFIED_ARCHIVES_SEED: PublicCardDirectorySeed[] = [
  // --- 1. TUNISIE (Archives Nationales, Dépôts & Communes) ---
  {
    kind: "archive",
    category: "tunisia",
    badge: "Archives d'État • Tunis",
    title: "Archives Nationales de Tunisie (ANT)",
    description:
      "Dépôt central de l'histoire tunisienne. Conserve les registres fiscaux de la Majba (recensements nominatifs 1860–1869), les décrets et ordonnances beylicales husseinites, les jugements des tribunaux séculiers de l'Ouzara et les fonds d'actes notariés ('udul).",
    link: "http://www.archives.nat.tn",
    tags: ["Majba 1860-1869", "Décrets Beylicaux", "Notariats 'Udul", "Tribunaux Ouzara"],
    sortOrder: 1,
  },
  {
    kind: "archive",
    category: "tunisia",
    badge: "Patrimoine Écrit & Manuscrits • Tunis",
    title: "Bibliothèque Nationale de Tunisie (BNT)",
    description:
      "Conservation du patrimoine imprimé et manuscrit. Abrite les journaux historiques de la Régence, les annuaires administratifs Didot-Bottin, les dictionnaires biographiques des lettrés et des grandes familles (Tarājim), et les archives de l'Université Zitouna.",
    link: "https://www.bnt.nat.tn",
    tags: ["Manuscrits Arabes", "Tarājim (Biographies)", "Presse Historique", "Zitouna"],
    sortOrder: 2,
  },
  {
    kind: "archive",
    category: "tunisia",
    badge: "État Civil Municipal • Capitale",
    title: "Archives Municipales de la Ville de Tunis (État Civil)",
    description:
      "Registres des actes de naissances, mariages et décès de la commune de Tunis depuis l'instauration de l'état civil moderne (1886). Permet également la recherche des concessions et permis d'inhumation des cimetières de la capitale.",
    link: "https://www.commune-tunis.gov.tn",
    tags: ["État Civil (1886-1956)", "Naissances", "Mariages", "Cimetières Municipaux"],
    sortOrder: 3,
  },
  {
    kind: "archive",
    category: "tunisia",
    badge: "Fondations Pieuses • Tunis",
    title: "Archives des Habous & Waqf de Tunisie",
    description:
      "Fonds de la Jamâïyat el-Habous. Les actes de constitution de waqf familial (habous ahlī) mentionnent l'arbre généalogique exhaustif des fondateurs, ascendants et de l'ensemble des bénéficiaires et descendants sur plusieurs siècles.",
    link: "http://www.affaires-religieuses.tn",
    tags: ["Habous Familial", "Waqf Ahlī", "Généalogies Authentiques", "Successions"],
    sortOrder: 4,
  },

  // --- 2. FRANCE (Protectorat, État Civil Consulaire, Militaires) ---
  {
    kind: "archive",
    category: "france",
    badge: "Archives Diplomatiques & Consulaires • Nantes",
    title: "Centre des Archives Diplomatiques de Nantes (CADN)",
    description:
      "Le fonds fondamental du Protectorat (1881–1956). Conserve la totalité de l'état civil consulaire des Européens de Tunisie, les décrets de naturalisation beylicale et française (1924–1927), les listes électorales, et les déclarations de tutelle et successions.",
    link: "https://www.diplomatie.gouv.fr/fr/archives-diplomatiques/",
    tags: ["État Civil Consulaire", "Naturalisations 1924-1927", "Successions", "Listes Électorales"],
    sortOrder: 5,
  },
  {
    kind: "archive",
    category: "france",
    badge: "Fonds Coloniaux & Protectorat • Aix-en-Provence",
    title: "Archives Nationales d'Outre-Mer (ANOM)",
    description:
      "Registres matricules militaires des engagés et appelés en Tunisie, dossiers de carrière des fonctionnaires du Protectorat, concessions agricoles, correspondances ministérielles et rapports de sûreté publique en Afrique du Nord.",
    link: "https://archives-nationales-outre-mer.culture.gouv.fr/",
    tags: ["Registres Matricules", "Personnel Protectorat", "Colonisation", "Afrique du Nord"],
    sortOrder: 6,
  },
  {
    kind: "archive",
    category: "france",
    badge: "Archives Centrales • Pierrefitte / Paris",
    title: "Archives Nationales de France (Pierrefitte-sur-Seine)",
    description:
      "Conservation des dossiers individuels de demandes de naturalisation présidentielle française déposées par les résidents de Tunisie (Français, Italiens, Maltais, Israélites et Tunisiens musulmans) avec arbres généalogiques et enquêtes préfectorales.",
    link: "https://www.archives-nationales.culture.gouv.fr",
    tags: ["Décrets de Naturalisation", "Ministère de la Justice", "Dossiers Individuels"],
    sortOrder: 7,
  },
  {
    kind: "archive",
    category: "france",
    badge: "Archives Militaires • Château de Vincennes & Caen",
    title: "Service Historique de la Défense (SHD)",
    description:
      "Dossiers individuels de carrière, états de service, citations et pensions d'invalidité des soldats tunisiens ayant servi dans l'armée française (notamment le 4e Régiment de Tirailleurs Tunisiens et le 1er Régiment de Spahis) lors des deux guerres mondiales.",
    link: "https://www.servicehistorique.sga.defense.gouv.fr/",
    tags: ["4e Tirailleurs Tunisiens", "1er Spahis", "Guerre 1914-1918", "Guerre 1939-1945"],
    sortOrder: 8,
  },
  {
    kind: "archive",
    category: "france",
    badge: "Bibliothèque Numérique • BnF Paris",
    title: "Gallica — Bibliothèque Nationale de France (BnF)",
    description:
      "Accès intégral numérisé au Journal Officiel Tunisien (1883–1956), aux annuaires Didot-Bottin d'Afrique du Nord et à la presse historique d'époque (La Dépêche Tunisienne, Le Petit Tunisien), indispensables pour retrouver adresses, professions et avis nécrologiques.",
    link: "https://gallica.bnf.fr",
    tags: ["Journal Officiel Tunisien", "Annuaires Commerciaux", "Presse Quotidienne"],
    sortOrder: 9,
  },
  {
    kind: "archive",
    category: "france",
    badge: "Base Nominative des Combattants",
    title: "Mémoire des Hommes (Ministère des Armées)",
    description:
      "Base de données officielle permettant la recherche nominative des tirailleurs, spahis et personnels militaires originaires de Tunisie déclarés « Morts pour la France » durant la Première Guerre mondiale, la Seconde Guerre mondiale et la Guerre d'Indochine.",
    link: "https://www.memoiredeshommes.sga.defense.gouv.fr",
    tags: ["Morts pour la France", "Tirailleurs Tunisiens", "Sépultures Militaires"],
    sortOrder: 10,
  },

  // --- 3. ITALIE & SICILE (Communauté Italienne de Tunisie) ---
  {
    kind: "archive",
    category: "italy",
    badge: "Portail National d'État Civil • Ministère de la Culture",
    title: "Portale Antenati (Archives d'État d'Italie)",
    description:
      "Portail officiel de la généalogie italienne donnant accès gratuitement à des millions d'actes d'état civil numérisés (Palerme, Trapani, Messine, Pantelleria) d'où sont issues les familles italiennes et siciliennes établies à Tunis, La Goulette, Bizerte et Sousse.",
    link: "https://antenati.cultura.gov.it",
    tags: ["État Civil Italien", "Sicile", "Pantelleria", "Familles de La Goulette"],
    sortOrder: 11,
  },
  {
    kind: "archive",
    category: "italy",
    badge: "Affaires Étrangères • Rome",
    title: "Archivio Storico Diplomatico (MAECI - Rome)",
    description:
      "Archives du Ministère des Affaires Étrangères italien. Conserve les registres d'immatriculation consulaire, les demandes de passeports et les actes d'état civil des sujets italiens établis dans la Régence (Consulat Général de Tunis, La Goulette, Sfax, Monastir).",
    link: "https://asd.esteri.it/",
    tags: ["Consulat Italien Tunis", "La Goulette", "Immatriculations Consulaires", "Passeports"],
    sortOrder: 12,
  },
  {
    kind: "archive",
    category: "italy",
    badge: "Archives Provinciales • Palerme, Sicile",
    title: "Archivio di Stato di Palermo (Sicile)",
    description:
      "Registres d'embarquement portuaires vers La Goulette et Tunis, délivrance de passeports pour l'Afrique du Nord, et listes de conscription militaire (Liste di leva) des familles siciliennes ayant émigré en Tunisie entre 1860 et 1940.",
    link: "https://saassipa.cultura.gov.it/",
    tags: ["Émigration Sicilienne", "Listes d'embarquement", "Conscription Leva", "Palerme"],
    sortOrder: 13,
  },
  {
    kind: "archive",
    category: "italy",
    badge: "Archives Maritimes & Notariales • Trapani",
    title: "Archivio di Stato di Trapani (Sicile)",
    description:
      "Fonds d'archives des pêcheurs de corail, marins et négociants de Trapani et de l'île de Pantelleria qui ont fondé les communautés italiennes historiques de La Goulette, Tabarka et de la péninsule du Cap Bon.",
    link: "https://archiviodistatotrapani.cultura.gov.it",
    tags: ["Trapani", "Pantelleria", "Pêcheurs de Corail", "Tabarka"],
    sortOrder: 14,
  },

  // --- 4. MALTE (Communauté Maltaise de Tunisie) ---
  {
    kind: "archive",
    category: "malta",
    badge: "Archives Nationales • Rabat & Mdina",
    title: "National Archives of Malta (Arkivji Nazzjonali ta' Malta)",
    description:
      "Registres officiels de demandes de passeports pour Tunis, dépositions judiciaires et certificats de sujets britanniques délivrés aux citoyens maltais vivant à Tunis, Sousse, Mahdia et Djerba de 1840 à 1940.",
    link: "https://nationalarchives.gov.mt",
    tags: ["Passeports pour Tunis (1840-1940)", "Sujets Britanniques", "Émigration Maltaise"],
    sortOrder: 15,
  },
  {
    kind: "archive",
    category: "malta",
    badge: "Registres Paroissiaux • Malte & Tunisie",
    title: "Geneanum — Archives & Généalogie Maltaise (Collection Adami)",
    description:
      "Collection Adami et registres paroissiaux numérisés : actes de baptême, mariage et sépulture des familles maltaises enregistrés dans les paroisses catholiques de Malte et de Tunisie (Sainte-Croix de Tunis, Saint-Félix de Sousse).",
    link: "https://geneanum.com",
    tags: ["Actes Paroissiaux", "Baptêmes & Mariages", "Sainte-Croix de Tunis"],
    sortOrder: 16,
  },

  // --- 5. ROYAUME-UNI & COMMONWEALTH ---
  {
    kind: "archive",
    category: "uk",
    badge: "Archives Gouvernementales • Kew, Londres",
    title: "The National Archives (TNA - Kew, Royaume-Uni)",
    description:
      "Séries diplomatiques du Foreign Office (FO 102, FO 335, FO 84) relatives au Consulat Général de Sa Majesté à Tunis, incluant l'enregistrement des sujets britanniques, des marchands maltais et des résidents protégés sous juridiction beylicale.",
    link: "https://www.nationalarchives.gov.uk",
    tags: ["Foreign Office FO 102 / FO 335", "Consulat Général Tunis", "Protégés Britanniques"],
    sortOrder: 17,
  },
  {
    kind: "archive",
    category: "uk",
    badge: "Sépultures Militaires Alliées",
    title: "Commonwealth War Graves Commission (CWGC)",
    description:
      "Registres commémoratifs et localisation des sépultures des soldats britanniques, canadiens, australiens, néo-zélandais et alliés tombés lors de la Campagne de Tunisie (1942–1943) et inhumés dans les cimetières militaires de Medjez-el-Bab et Enfidaville.",
    link: "https://www.cwgc.org",
    tags: ["Campagne de Tunisie 1943", "Medjez-el-Bab", "Enfidaville", "Cimetières Militaires"],
    sortOrder: 18,
  },

  // --- 6. ARCHIVES JUIVES & ISRAÉLITES DE TUNISIE ---
  {
    kind: "archive",
    category: "jewish",
    badge: "Généalogie Juive Nord-Africaine • Paris",
    title: "Cercle de Généalogie Juive (CGJ - Paris)",
    description:
      "Association de référence pour la généalogie juive de Tunisie. Dépouillements complets des registres d'état civil israélite, relevés des sépultures des cimetières du Borgel et de Bab El Khadra à Tunis, et contrats de mariage rabbiniques (kétouboth).",
    link: "https://www.genealoj.org",
    tags: ["État Civil Israélite", "Cimetière du Borgel", "Kétouboth", "Granas & Twansa"],
    sortOrder: 19,
  },
  {
    kind: "archive",
    category: "jewish",
    badge: "Archives Historiques Communautaires • Jérusalem",
    title: "Central Archives for the History of the Jewish People (CAHJP)",
    description:
      "Plus vaste centre d'archives historiques du judaïsme tunisien. Conserve les registres des tribunaux rabbiniques de Tunis, les registres de Mohel (circoncisions de 1845 à 1950), et les documents d'archives des communautés Granas (Livournais) et Twansa.",
    link: "https://cahjp.nli.org.il",
    tags: ["Tribunal Rabbinique Tunis", "Livres de Mohel (1845-1950)", "Granas (Livournais)", "Twansa"],
    sortOrder: 20,
  },
  {
    kind: "archive",
    category: "jewish",
    badge: "Archives Scolaires & Communautaires • Paris",
    title: "Alliance Israélite Universelle (AIU - Paris)",
    description:
      "Registres d'inscription scolaire nominatifs des écoles de l'AIU fondées à Tunis (dès 1878), Sousse, Sfax, Nabeul, Bizerte et Djerba, incluant filiations complètes, professions des parents et dates de naissance des élèves.",
    link: "https://www.aiu.org/",
    tags: ["Écoles AIU Tunis", "Registres Scolaires", "Djerba", "Sousse", "Sfax"],
    sortOrder: 21,
  },
  {
    kind: "archive",
    category: "jewish",
    badge: "Société Savante & Recherche • Paris",
    title: "Société d'Histoire des Juifs de Tunisie (SHJT)",
    description:
      "Études monographiques, dépouillements généalogiques et fonds documentaires sur l'histoire des patronymes juifs tunisiens (origines ibériques, toscanes ou autochtones) et leurs trajectoires migratoires en Méditerranée.",
    link: "https://shjt.fr",
    tags: ["Patronymes Juifs Tunisiens", "Histoire Communautaire", "Monographies Familiales"],
    sortOrder: 22,
  },

  // --- 7. ARCHIVES OTTOMANES & ISLAMIQUES ---
  {
    kind: "archive",
    category: "ottoman",
    badge: "Archives Impériales Ottomanes • Istanbul",
    title: "Devlet Arşivleri — Osmanlı Arşivi (Archives d'État Ottomanes)",
    description:
      "Fonds impérial ottoman (Mühimme Defterleri). Conserve les firmans sultaniques concernant la Régence de Tunis (Pachalik puis Beylicat husseinite), les nominations des Pachas et Deys, et les correspondances de chancellerie entre Istanbul et le Bardo.",
    link: "https://www.devletarsivleri.gov.tr",
    tags: ["Firmans Impériaux", "Pachalik de Tunis", "Divan-ı Hümayun", "Dynastie Husseinite"],
    sortOrder: 23,
  },
  {
    kind: "archive",
    category: "ottoman",
    badge: "Documentation Islamique • Istanbul",
    title: "IRCICA — Research Centre for Islamic History and Art",
    description:
      "Institution de l'OCI conservant d'importantes collections photographiques d'époque beylicale sur Tunis, des répertoires de manuscrits islamiques, de chartes waqf et d'études sur l'art, les corporations et les notariats arabo-musulmans.",
    link: "https://www.ircica.org",
    tags: ["Photothèque Beylicale", "Manuscrits Islamiques", "Corporations & Notariats"],
    sortOrder: 24,
  },
  {
    kind: "archive",
    category: "ottoman",
    badge: "Grande Mosquée Zitouna • Tunis",
    title: "Fonds des Manuscrits de la Mosquée Zitouna (Département BNT)",
    description:
      "Registres d'enseignants et d'étudiants de l'Université Zitouna, diplômes et licences d'enseignement religieux (ijāzāt), biographies de lettrés (tarājim), chorfas et cadis malékites et hanafites de Tunisie, conservés au Département des Manuscrits de la BNT.",
    link: "https://www.bnt.nat.tn",
    tags: ["Diplômes Ijaza", "Cadis Hanafites & Malékites", "Chorfas", "Lettrés Zitouniens"],
    sortOrder: 25,
  },

  // --- 8. ALGÉRIE & MAGHREB (Liens Transfrontaliers) ---
  {
    kind: "archive",
    category: "maghreb",
    badge: "Archives Nationales • Alger",
    title: "Centre National des Archives d'Algérie (CNA)",
    description:
      "Fonds documentaires sur les régions frontalières tuniso-algériennes (Khmir, Mogod, Medjerda, Nemencha), traités frontaliers et déplacements séculaires de populations et tribus nomades entre la Tunisie et l'Algérie.",
    link: "https://www.archives-nationales.dz",
    tags: ["Tribus Frontalières", "Khmir & Nemencha", "Constantinois", "Frontière Tuniso-Algérienne"],
    sortOrder: 26,
  },
  {
    kind: "archive",
    category: "maghreb",
    badge: "Archives Nationales • Rabat",
    title: "Archives du Maroc (Rabat)",
    description:
      "Documents d'archives relatifs aux familles andalouses ayant transité par Fès et Tétouan avant de s'établir à Testour, Soliman et Tunis, ainsi que les registres des grandes confréries soufies communes (Tidjaniya, Shadhiliya).",
    link: "https://www.archivesdumaroc.ma",
    tags: ["Familles Andalouses", "Testour & Soliman", "Confréries Soufies", "Chérifiens"],
    sortOrder: 27,
  },
  {
    kind: "archive",
    category: "maghreb",
    badge: "Base Nominative IREL • En Ligne",
    title: "ANOM — Base IREL des Registres d'Afrique du Nord (Algérie / Tunisie)",
    description:
      "Recherche nominative en ligne dans les registres d'état civil et paroissiaux des localités limitrophes (Bône/Annaba, Constantine, Souk Ahras, Tébessa) où résidaient de nombreuses familles d'origine ou d'alliance tunisienne.",
    link: "https://archives-nationales-outre-mer.culture.gouv.fr/web/guest/etat-civil",
    tags: ["Base IREL", "Constantine", "Bône / Annaba", "Frontière & Échanges"],
    sortOrder: 28,
  },
];
