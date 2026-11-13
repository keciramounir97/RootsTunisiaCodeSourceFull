/**
 * ERA RESEARCH CHAPTERS & MONOGRAPHS
 * Comprehensive academic and pedagogical dossiers covering all 12 historical periods of Tunisia.
 * Structured into historical chapters with learning takeaways, legal/genealogical registry analyses, and primary sources.
 */

export interface HistoricalEraChapterSection {
  heading: string;
  paragraphs: string[];
  archivalNote?: string;
}

export interface HistoricalEraChapter {
  id: string;
  chapterNumber: number;
  romanNumber: string;
  title: string;
  subtitle: string;
  readingTimeMinutes: number;
  keyThemes: string[];
  summary: string;
  sections: HistoricalEraChapterSection[];
  keyTakeaways: string[];
  primarySourcesReferenced: string[];
}

export interface EraResearchDossier {
  eraId: string;
  eraTitle: string;
  historicalPeriod: string;
  pedagogicalOverview: string;
  epigraphQuote?: {
    text: string;
    author: string;
    source: string;
  };
  learningObjectives: string[];
  chapters: HistoricalEraChapter[];
}

export const ERA_RESEARCH_DOSSIERS: Record<string, EraResearchDossier> = {
  punique: {
    eraId: "punique",
    eraTitle: "Antiquité Punique & Carthage Métropolitaine",
    historicalPeriod: "814 av. J.-C. – 146 av. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier d'étude explore les 668 années de souveraineté punique en Tunisie : de la fondation d'Élyssa sur la colline de Byrsa à la constitution républicaine du Conseil des Cent-Quatre, l'agronomie savante de Magon, la Fossa Regia et les stèles épigraphiques votives.",
    epigraphQuote: {
      text: "Carthage ne régnait pas seulement par sa flotte ; elle possédait une constitution politique que les philosophes grecs plaçaient au premier rang des républiques bien policées.",
      author: "Aristote",
      source: "Politique, Livre II, Chapitre 11",
    },
    learningObjectives: [
      "Comprendre les dynamiques maritimes et commerciales qui ont fait de Carthage la première puissance de Méditerranée occidentale.",
      "Analyser le fonctionnement de la constitution républicaine punique (suffètes, sénat et tribunal des Cent-Quatre).",
      "Étudier le tracé cadastral fondateur de la Fossa Regia (fossé de Scipion) séparant le domaine métropolitain des royaumes numides.",
      "Maîtriser l'épigraphie sémitique punique et néo-punique pour l'étude des filiations antiques.",
    ],
    chapters: [
      {
        id: "ch1-elyssa-byrsa",
        chapterNumber: 1,
        romanNumber: "I",
        title: "La Fondation d'Élyssa & l'Ancrage Maritime",
        subtitle: "L'arrivée des Phéniciens de Tyr et l'installation sur l'isthme de Carthage (814 av. J.-C.)",
        readingTimeMinutes: 5,
        keyThemes: ["Fondation", "Phéniciens", "Byrsa", "Comptoirs côtiers"],
        summary:
          "En 814 av. J.-C., des marchands et aristocrates tyriens guidés par la princesse Élyssa s'implantent sur le promontoire stratégique de Byrsa, initiant huit siècles d'hégémonie marchande et navale.",
        sections: [
          {
            heading: "L'implantation stratégique sur le golfe de Tunis",
            paragraphs: [
              "Le choix du site de Carthage répond à une logique maritime et militaire exceptionnelle : une péninsule protégée entre le golfe de Tunis et la lagune de l'Ariana, dominée par la citadelle rocheuse de Byrsa.",
              "Dès le VIIe siècle av. J.-C., les Carthaginois transforment les simples comptoirs d'hivernage phéniciens (Utique, Hadrumète, Hippo Diarrhytus) en un réseau impérial maillé, contrôlant les passages étroits du canal de Sicile et le commerce des métaux.",
            ],
            archivalNote:
              "Sources textuelles : Récits de Timée de Tauroménion, Justin (Abrégé des Histoires Philippiques) et stèles votives du Tophet de Salammbô.",
          },
          {
            heading: "L'alliance fondatrice avec les populations libyco-berbères",
            paragraphs: [
              "Loin d'un isolement insulaire, Carthage négocie des traités territoriaux initiaux avec les chefs des tribus libyques locales, leur versant un tribut foncier annuel avant d'affirmer sa souveraineté directe sur la riche plaine de la Medjerda.",
            ],
          },
        ],
        keyTakeaways: [
          "Fondation datée canoniquement de 814 av. J.-C. par des colons tyriens.",
          "Contrôle absolu des routes commerciales entre l'Orient phénicien et l'Occident ibérique.",
          "Symbiose progressive entre élites puniques urbaines et populations agro-pastorales libyques.",
        ],
        primarySourcesReferenced: [
          "Corpus Inscriptionum Semiticarum (CIS I) — Inscriptions puniques de Carthage",
          "Fouilles archéologiques du Tophet de Salammbô et de la nécropole de Byrsa",
        ],
      },
      {
        id: "ch2-republique-cent-quatre",
        chapterNumber: 2,
        romanNumber: "II",
        title: "La Constitution Républicaine & les Institutions",
        subtitle: "Suffètes annuels, Sénat aristocratique et Tribunal des Cent-Quatre",
        readingTimeMinutes: 6,
        keyThemes: ["Suffètes", "Sénat", "Cent-Quatre", "Aristocratie", "Démocratie"],
        summary:
          "La République de Carthage combinait des éléments monarchiques (les deux suffètes), aristocratiques (le Sénat des Anciens) et populaires (l'assemblée du peuple réunie sur l'agora près des ports).",
        sections: [
          {
            heading: "L'équilibre des pouvoirs constitutionnels",
            paragraphs: [
              "Chaque année, les citoyens élisaient deux Suffètes (Shophetim) détenant le pouvoir exécutif civil et judiciaire suprême, distincts des généraux militaires qui commandaient les armées.",
              "Le Tribunal des Cent-Quatre, constitué de juges inamovibles, exerçait un contrôle rigoureux sur les magistrats et les stratèges de retour d'expédition pour empêcher toute tyrannie militaire.",
            ],
          },
        ],
        keyTakeaways: [
          "Régime républicain stable admiré par Aristote dans sa Politique.",
          "Séparation institutionnelle stricte entre commandement militaire et magistratures civiles.",
        ],
        primarySourcesReferenced: [
          "Aristote, Politique (Livre II, 11 sur la constitution de Carthage)",
          "Polybe, Histoires (Livre VI sur la comparaison entre Rome et Carthage)",
        ],
      },
      {
        id: "ch3-fossa-regia-medjerda",
        chapterNumber: 3,
        romanNumber: "III",
        title: "Le Territoire Métropolitain & la Fossa Regia",
        subtitle: "L'agriculture savante de Magon et la frontière des royaumes numides",
        readingTimeMinutes: 5,
        keyThemes: ["Fossa Regia", "Magon", "Medjerda", "Numidie", "Cadastre"],
        summary:
          "Carthage ne fut pas qu'une thalassocratie ; elle développa dans les plaines de la Medjerda et du cap Bon l'agronomie la plus avancée du monde antique, codifiée par le traité de Magon en 28 volumes.",
        sections: [
          {
            heading: "La mise en valeur de la chôra carthaginoise",
            paragraphs: [
              "Les agronomes puniques introduisirent le greffage systématique de l'olivier sauvage, les cépages améliorés et les méthodes de conservation des grains dans des silos souterrains étanches.",
              "La Fossa Regia (fossé tracé par Scipion Émilien en 146 av. J.-C.) délimita avec une précision millimétrique les terres métropolitaines carthaginoises face au royaume numide de Massinissa.",
            ],
            archivalNote:
              "Le traité d'agronomie de Magon fut le seul ouvrage de la bibliothèque de Carthage que le Sénat romain ordonna de traduire en latin après 146 av. J.-C.",
          },
        ],
        keyTakeaways: [
          "Pôle agricole de rang mondial approvisionnant toute la Méditerranée.",
          "La Fossa Regia constitue la première frontière cadastrée officielle de l'histoire tunisienne.",
        ],
        primarySourcesReferenced: [
          "Columelle et Pline l'Ancien (Citations du Traité d'Agronomie de Magon)",
          "Tracé épigraphique des bornes de la Fossa Regia (Musée du Bardo)",
        ],
      },
      {
        id: "ch4-onomastique-epigraphie",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Épigraphie Sémitique & Lignées Punique-Libyques",
        subtitle: "Comment décrypter les stèles funéraires votives et les généalogies",
        readingTimeMinutes: 5,
        keyThemes: ["Onomastique", "Tophet", "Stèles", "Généalogie antique"],
        summary:
          "Pour les généalogistes et historiens, les milliers de stèles funéraires et votives de Carthage révèlent un système onomastique sémitique fondé sur des chaînes de filiation ('fils d'un tel, petit-fils d'un tel') associées à des dieux protecteurs.",
        sections: [
          {
            heading: "La formule patronymique punique",
            paragraphs: [
              "Chaque patronyme punique comprenait le nom propre suivi de 'Ben' (fils de), remontant couramment sur trois à cinq générations (ex: 'Baalshillek ben Hanno ben Magon').",
              "Les prénoms sont majoritairement théophores : Hannibal ('Grâce de Baal'), Hamilcar ('Serviteur de Melqart'), Hasdrubal ('Secours de Baal').",
            ],
            archivalNote:
              "Corpus Inscriptionum Semiticarum (CIS I) — Plus de 6 000 stèles votives nominatives inventoriées.",
          },
        ],
        keyTakeaways: [
          "Structure onomastique sémitique rigoureuse avec chaînes de filiation directes.",
          "Identification précise des lignées aristocratiques (Barcides, Magonides, Gisconides).",
        ],
        primarySourcesReferenced: [
          "Corpus Inscriptionum Semiticarum (Pars Prima)",
          "Stèles bilingues libyco-puniques de Dougga (KAI 100-101)",
        ],
      },
    ],
  },

  romaine: {
    eraId: "romaine",
    eraTitle: "Afrique Proconsulaire & Empire Romain",
    historicalPeriod: "146 av. J.-C. – 439 apr. J.-C.",
    pedagogicalOverview:
      "Ce dossier d'étude magistral analyse les six siècles de romanisation de la Tunisie : l'édification de 200 cités municipales à monuments classés (El Jem, Dougga, Bulla Regia, Sbeïtla), le système du Limes saharien, la production d'huile d'olive et de blé, et le statut des citoyens romains d'Afrique.",
    epigraphQuote: {
      text: "L'Afrique ne se contente pas de nourrir le peuple romain ; elle lui donne ses plus grands juristes, ses orateurs les plus fervents et ses empereurs les plus résolus.",
      author: "Tertullien",
      source: "Apologétique, Carthage, vers 197",
    },
    learningObjectives: [
      "Comprendre l'organisation territoriale de la Provincia Africa Proconsularis et de la Byzacène.",
      "Analyser le fonctionnement municipal des curies locales et l'évergétisme des élites africaines.",
      "Étudier le réseau hydraulique impérial, notamment le grand aqueduc de Zaghouan à Carthage.",
      "Maîtriser la lecture des cippes et inscriptions latines du Corpus Inscriptionum Latinarum (CIL VIII).",
    ],
    chapters: [
      {
        id: "ch1-proconsulaire-civitas",
        chapterNumber: 1,
        romanNumber: "I",
        title: "L'Afrique Proconsulaire & le Grenier de Rome",
        subtitle: "Organisation sénatoriale, centuriation cadastrale et essor agricole",
        readingTimeMinutes: 5,
        keyThemes: ["Proconsul", "Centuriation", "Ager publicus", "Oléiculture"],
        summary:
          "Sous le principat d'Auguste, la Tunisie devient la seule province sénatoriale d'Occident commandée par un proconsul de rang consulaire, transformée en premier fournisseur de blé et d'huile d'olive de Rome.",
        sections: [
          {
            heading: "La centuriation et l'arpentage impérial",
            paragraphs: [
              "Les arpenteurs romains (agrimensores) quadrillent le sol tunisien en centuries régulières de 50 hectares, dont les traces fossilisées sont encore nettement visibles par photographie aérienne entre Sousse, Kairouan et Le Kef.",
              "Cette rigueur cadastrale sécurise la propriété terrienne et permet la levée de l'annone frumentaire approvisionnant directement la plèbe de Rome.",
            ],
            archivalNote:
              "Corpus Agrimensorum Romanorum et Tables cadastrales d'Orange et de Byzacène.",
          },
        ],
        keyTakeaways: [
          "Statut privilégié de province proconsulaire sénatoriale d'Afrique.",
          "Centuriation exhaustive du territoire tunisien et rôle de grenier impérial.",
        ],
        primarySourcesReferenced: [
          "Corpus Inscriptionum Latinarum (CIL VIII)",
          "Pline l'Ancien, Histoire Naturelle (Livre XVIII sur les rendements en blé d'Afrique)",
        ],
      },
      {
        id: "ch2-eljem-sbeitle-dougga",
        chapterNumber: 2,
        romanNumber: "II",
        title: "Les 200 Cités Municipales & l'Évergétisme",
        subtitle: "Thysdrus, Dougga, Sufetula et l'amphithéâtre colosse d'El Jem",
        readingTimeMinutes: 6,
        keyThemes: ["Thysdrus", "El Jem", "Dougga", "Sufetula", "Monuments"],
        summary:
          "Aucune région de l'Empire romain n'a compté une telle densité de cités dotées de forums, basiliques, théâtres et thermes somptueux, financés par la générosité des grandes familles oléicoles.",
        sections: [
          {
            heading: "L'Amphithéâtre de Thysdrus (El Jem) : joyau du tiers-siècle",
            paragraphs: [
              "Érigé vers 238 ap. J.-C. sous l'impulsion des notables de Byzacène qui proclamèrent l'empereur Gordien Ier, l'amphithéâtre d'El Jem pouvait accueillir 30 000 spectateurs, rivalisant directement avec le Colisée de Rome.",
              "Dougga (Thugga), perchée au-dessus de la vallée du Khalled, illustre la synthèse architecturale parfaite entre le capitole romain et le mausolée libyco-punique d'Atban.",
            ],
          },
        ],
        keyTakeaways: [
          "Densité urbaine sans équivalent en Méditerranée occidentale.",
          "Financement privé par l'évergétisme des patriciens d'Afrique.",
        ],
        primarySourcesReferenced: [
          "Inscriptions monumentales d'El Jem et du Capitole de Dougga",
          "Mosaïques de l'Enfant Dionysos et des Saisons (Musée du Bardo et Musée d'El Jem)",
        ],
      },
      {
        id: "ch3-aqueduc-zaghouan",
        chapterNumber: 3,
        romanNumber: "III",
        title: "L'Aqueduc de Zaghouan & le Génie Hydraulique",
        subtitle: "132 kilomètres d'arcades pour alimenter les thermes d'Antonin à Carthage",
        readingTimeMinutes: 5,
        keyThemes: ["Aqueduc", "Zaghouan", "Thermes d'Antonin", "Hydraulique"],
        summary:
          "Construit sous le règne de l'empereur Hadrien à la suite d'une sécheresse de cinq ans, l'aqueduc de Zaghouan est l'un des plus longs et spectaculaires ouvrages d'art de l'Antiquité.",
        sections: [
          {
            heading: "La captation des sources du Djebel Zaghouan et de Jouggar",
            paragraphs: [
              "Les ingénieurs romains captent les sources abondantes du Temple des Eaux de Zaghouan et franchissent la plaine de la Mornag et de l'Oued Miliane par des arches s'élevant jusqu'à 20 mètres de hauteur.",
              "L'aqueduc débitait plus de 30 000 mètres cubes d'eau pure par jour jusqu'aux immenses citernes de La Malga à Carthage, alimentant les gigantesques thermes d'Antonin inaugurés en 162 ap. J.-C.",
            ],
          },
        ],
        keyTakeaways: [
          "Exploit technique majeur unissant le Zaghouan à la capitale métropolitaine.",
          "Infrastructures d'hygiène publique et de salubrité urbaine de premier ordre.",
        ],
        primarySourcesReferenced: [
          "Inscriptions dédicatoires du Temple des Eaux de Zaghouan",
          "Études archéologiques de l'INP sur les citernes de La Malga",
        ],
      },
      {
        id: "ch4-inscriptions-latines-cil",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Le CIL VIII & l'Onomastique Romano-Africaine",
        subtitle: "Retrouver des magistrats, soldats et affranchis dans les épigraphes",
        readingTimeMinutes: 5,
        keyThemes: ["CIL VIII", "Épigraphie", "Tria nomina", "Curiales"],
        summary:
          "Le volume VIII du Corpus Inscriptionum Latinarum rassemble plus de 28 000 inscriptions découvertes en Tunisie et Algérie orientale, constituant le plus vaste registre d'état civil épigraphique du monde romain.",
        sections: [
          {
            heading: "Les Tria Nomina et l'ascension des familles africaines",
            paragraphs: [
              "L'adoption des 'trois noms' (Praenomen, Nomen, Cognomen) témoigne de l'octroi de la citoyenneté romaine aux élites tunisiennes, dont plusieurs accédèrent au Sénat de Rome et à la pourpre impériale sous les Sévères.",
              "Les cippes funéraires précisent l'âge exact, les magistratures exercées (duumvir, édile, flamine), et les liens de parenté sur plusieurs générations.",
            ],
            archivalNote:
              "Corpus Inscriptionum Latinarum (CIL VIII) — Berlin-Brandenburgische Akademie der Wissenschaften.",
          },
        ],
        keyTakeaways: [
          "Registre nominatif de plus de 28 000 citoyens et résidents de l'Afrique romaine.",
          "Intégration complète des élites africaines aux plus hauts échelons de l'Empire.",
        ],
        primarySourcesReferenced: [
          "Corpus Inscriptionum Latinarum, Vol. VIII (Inscriptiones Africae Latinae)",
          "Actes de mariage et inscriptions funéraires de Bulla Regia et Mustis",
        ],
      },
    ],
  },

  vandale_byzantine: {
    eraId: "vandale_byzantine",
    eraTitle: "Royaume Vandale & Exarchat Byzantin de Carthage",
    historicalPeriod: "439 – 698 apr. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier d'étude explore les 259 ans séparant la prise de Carthage par Genséric en 439 de la conquête arabe en 698. Découvrez la royauté vandale d'Afrique, la reconquête menée par le général Bélisaire sous Justinien en 533, et l'édification d'un réseau exceptionnel de forteresses byzantines à travers la Tunisie.",
    epigraphQuote: {
      text: "En un seul jour, l'Afrique tout entière, après quatre-vingt-quinze ans de sujétion aux Barbares, fut restituée à l'Empire romain par le courage de Bélisaire.",
      author: "Procope de Césarée",
      source: "Histoire de la Guerre des Vandales, Livre IV",
    },
    learningObjectives: [
      "Analyser la structure politique du Royaume vandale de Carthage et la domination de la flotte arianiste en Méditerranée.",
      "Comprendre les batailles de l'Ad Decimum et de Tricaméron menées par Bélisaire en 533 pour la reconquête justinienne.",
      "Étudier l'architecture militaire byzantine : citadelles de Kélibia, Haïdra (Ammaedara), Sbeïtla (Sufetula) et Aïn Tounga.",
      "Maîtriser les sources épigraphiques chrétiennes et les actes notariés privés des Tables d'Albertini.",
    ],
    chapters: [
      {
        id: "ch1-vandal-genseric",
        chapterNumber: 1,
        romanNumber: "I",
        title: "L'Invasion Vandale & le Royaume de Carthage (439)",
        subtitle: "Genséric, la prise du port naval et l'émancipation face à Rome",
        readingTimeMinutes: 5,
        keyThemes: ["Genséric", "Vandales", "Carthage", "Flotte navale"],
        summary:
          "En octobre 439, les Vandales de Genséric s'emparent par surprise de Carthage, établissant le premier royaume barbare souverain en Afrique du Nord.",
        sections: [
          {
            heading: "La rupture avec le gouvernement impérial de Ravenne",
            paragraphs: [
              "Genséric confisque les immenses latifundia des sénateurs romains autour de Carthage et de la vallée de la Medjerda pour les distribuer à sa noblesse guerrière vandale.",
              "Depuis les ports punico-romains de Carthage, il arme une formidable flotte de guerre qui soumet la Sardaigne, la Corse, les Baléares et saccage Rome en 455.",
            ],
            archivalNote:
              "Sources textuelles : Victor de Vita, Histoire de la persécution vandale en Afrique ; Procopius, De Bellis.",
          },
        ],
        keyTakeaways: [
          "Carthage redevient une capitale impériale maritime indépendante.",
          "Dualisme confessionnel entre souverains vandales ariens et population romano-africaine nicéenne.",
        ],
        primarySourcesReferenced: [
          "Victor de Vita, Historia persecutionis Africanae provinciae",
          "Tables d'Albertini (actes notariés privés sur bois découverts dans le Sud tunisien)",
        ],
      },
      {
        id: "ch2-belisaire-reconquete-533",
        chapterNumber: 2,
        romanNumber: "II",
        title: "La Reconquête Byzantine de Bélisaire (533)",
        subtitle: "Les victoires de l'Ad Decimum et de Tricaméron sous Justinien",
        readingTimeMinutes: 6,
        keyThemes: ["Bélisaire", "Justinien", "Decimum", "Tricaméron", "Restauration impériale"],
        summary:
          "En août 533, l'empereur Justinien charge son meilleur stratège, Bélisaire, de reconquérir l'Afrique. En trois mois, l'armée byzantine défait le roi Gélimer et libère Carthage.",
        sections: [
          {
            heading: "La marche foudroyante sur Carthage",
            paragraphs: [
              "Débarquée à Caput Vada (Chebba), l'armée romaine d'Orient progresse vers le nord le long du littoral du Sahel. À l'Ad Decimum (au dixième mille au sud de Tunis), la cavalerie de Bélisaire brise l'encerclement vandale.",
              "Le 15 septembre 533, Bélisaire fait son entrée triomphale à Carthage dans le palais du proconsul sans aucun pillage, célébrant le rétablissement de la légalité romaine.",
            ],
          },
        ],
        keyTakeaways: [
          "Fin définitive du Royaume vandale après 95 ans d'existence.",
          "Rattachement de la Tunisie à l'Empire romain d'Orient de Constantinople.",
        ],
        primarySourcesReferenced: [
          "Procope de Césarée, De Aedificiis (Sur les constructions de Justinien en Afrique)",
          "Inscriptions triomphales de Justinien conservées au Musée National du Bardo",
        ],
      },
      {
        id: "ch3-exarchat-carthage-forteresses",
        chapterNumber: 3,
        romanNumber: "III",
        title: "L'Exarchat de Carthage & les Forteresses Byzantines",
        subtitle: "Le Limes byzantin : Haïdra, Kélibia, Ain Tounga, Sbeïtla et Dougga",
        readingTimeMinutes: 6,
        keyThemes: ["Exarchat", "Fortifications", "Haïdra", "Kélibia", "Héraclius"],
        summary:
          "Face à la pression des confédérations maures de l'intérieur, les empereurs Maurice et Phocas créent l'Exarchat militaire de Carthage et fortifient systématiquement les cités tunisiennes.",
        sections: [
          {
            heading: "Le réseau monumental des citadelles de Tunisie",
            paragraphs: [
              "Les architectes militaires byzantins réutilisent les blocs de taille romains pour ceinturer les acropoles : la citadelle monumentale d'Ammaedara (Haïdra), le fort de Kélibia contrôlant le cap Bon, et les tours d'Ain Tounga (Thignica).",
              "En 610, c'est depuis Carthage que le fils de l'exarque d'Afrique, le futur empereur Héraclius, appareille avec la flotte tunisienne pour renverser l'usurpateur Phocas à Constantinople.",
            ],
            archivalNote:
              "Corpus des inscriptions chrétiennes et byzantines d'Afrique du Nord (CIL VIII Supplementum).",
          },
        ],
        keyTakeaways: [
          "L'Afrique byzantine devient l'une des provinces les plus fortifiées de l'Empire.",
          "Carthage sert de tremplin politique impérial au règne d'Héraclius le Grand.",
        ],
        primarySourcesReferenced: [
          "Inventaire archéologique des citadelles byzantines de Tunisie (INP Tunis)",
          "Actes des synodes carthaginois sous les empereurs justiniens",
        ],
      },
      {
        id: "ch4-archives-tables-albertini",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Les Tables d'Albertini & Registres Notariés Antiques",
        subtitle: "Actes de vente foncière, baux ruraux et onomastique romano-africaine",
        readingTimeMinutes: 5,
        keyThemes: ["Tables d'Albertini", "Notariat antique", "Onomastique", "Généalogie"],
        summary:
          "Les Tables d'Albertini constituent le plus exceptionnel ensemble d'actes notariés privés sur bois conservé pour l'Antiquité tardive en Tunisie.",
        sections: [
          {
            heading: "La pratique juridique notariale au Ve siècle",
            paragraphs: [
              "Rédigées en latin entre 493 et 496, ces 34 tablettes de cèdre consignant des ventes de parcelles d'oliviers sous le régime de la Lex Manciana mentionnent les noms précis des propriétaires terriens, témoins et tabellions.",
              "Elles démontrent la continuité absolue du droit romain de la terre et de la filiation familiale malgré les invasions barbares.",
            ],
          },
        ],
        keyTakeaways: [
          "Preuve tangible d'une administration notariale continue du droit foncier en Tunisie.",
          "Chaînes onomastiques précises associant noms romains et souches libyques autochtones.",
        ],
        primarySourcesReferenced: [
          "Tables d'Albertini — Actes de l'époque vandale (Édition Courtois, Leschi, Perrat, Saumagne)",
          "Fouilles épigraphiques de Carthage (Colline de Byrsa et Basilique de Damous El Karita)",
        ],
      },
    ],
  },

  omeyyade_islamique: {
    eraId: "omeyyade_islamique",
    eraTitle: "Aube de l'Islam & Califat Omeyyade d'Ifriqiya",
    historicalPeriod: "698 – 800 apr. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier pédagogique retrace l'intégration définitive de la Tunisie dans le giron arabo-musulman : la fondation de Kairouan par Uqba Ibn Nafi en 670, la prise finale de Carthage par Hassan Ibn al-Nu'man en 698, la fondation de l'arsenal et de la cité arabe de Tunis, et l'épopée vers l'Andalousie sous Musa Ibn Nusayr.",
    epigraphQuote: {
      text: "Uqba planta sa lance en plein cœur de la plaine d'Ifriqiya et s'écria : 'Voici votre Kairouan, lieu d'armes et de refuge pour la foi jusqu'à la fin des temps'.",
      author: "Ibn Abd al-Hakam",
      source: "Futūḥ Miṣr wa-l-Maghrib (Conquête de l'Égypte et du Maghreb), IXe siècle",
    },
    learningObjectives: [
      "Comprendre la logique géopolitique de la fondation de Kairouan en 670 comme premier pôle islamique d'Afrique du Nord.",
      "Analyser la prise définitive de Carthage par Hassan Ibn al-Nu'man en 698 et la décision stratégique de fonder Tunis.",
      "Étudier l'organisation administrative omeyyade : gouvernorat d'Ifriqiya, diwans militaires, et premières monnaies arabes au dinar d'or.",
      "Consulter les premières chroniques arabes et répertoires onomastiques des conquérants et tribus converties.",
    ],
    chapters: [
      {
        id: "ch1-uqba-kairouan-670",
        chapterNumber: 1,
        romanNumber: "I",
        title: "Uqba Ibn Nafi & la Fondation de Kairouan (670)",
        subtitle: "L'implantation de la première capitale islamique du Maghreb",
        readingTimeMinutes: 5,
        keyThemes: ["Uqba Ibn Nafi", "Kairouan", "Grande Mosquée", "Fondation"],
        summary:
          "En 670 (an 50 de l'Hégire), Uqba Ibn Nafi choisit la plaine intérieure de Kairouan pour édifier un camp retranché permanent à l'abri des flottes byzantines, jetant les bases de la métropole spirituelle de l'Ifriqiya.",
        sections: [
          {
            heading: "Le choix stratégique de l'intérieur des terres",
            paragraphs: [
              "Évitant les côtes exposées aux raids de la flotte impériale byzantine, Uqba fixe le camp militaire à égale distance des montagnes et de la mer, sur un nœud de pistes caravanières.",
              "Il délimite l'emplacement de la Grande Mosquée (Masjid Jāmi') et du palais du gouverneur (Dar al-Imara), distribuant les quartiers aux différentes fractions de l'armée arabe.",
            ],
          },
        ],
        keyTakeaways: [
          "Kairouan devient le centre névralgique de toutes les campagnes militaires vers l'ouest.",
          "Première grande mosquée d'Occident musulman, matrice de l'architecture islamique maghrébine.",
        ],
        primarySourcesReferenced: [
          "Ibn Abd al-Hakam, Futūḥ Miṣr wa-l-Maghrib",
          "Al-Maliki, Riyad al-Nufus (Biographies des savants de Kairouan)",
        ],
      },
      {
        id: "ch2-hassan-carthage-tunis-698",
        chapterNumber: 2,
        romanNumber: "II",
        title: "Hassan Ibn al-Nu'man & la Fondation de Tunis (698)",
        subtitle: "La chute définitive de Carthage et la création de l'arsenal maritime",
        readingTimeMinutes: 6,
        keyThemes: ["Hassan Ibn al-Nu'man", "Prise de Carthage", "Fondation de Tunis", "Arsenal"],
        summary:
          "En 698, le général Hassan Ibn al-Nu'man s'empare définitivement de Carthage. Plutôt que de relever la ville byzantine, il choisit d'édifier la nouvelle cité musulmane de Tunis sur les rives de la lagune.",
        sections: [
          {
            heading: "La décision stratégique de la lagune de Tunis",
            paragraphs: [
              "Hassan fait creuser un canal reliant la lagune de Tunis au golfe maritime (La Goulette) et y établit un arsenal de guerre (Dar al-Sina'a) pour construire la première flotte islamique d'Afrique.",
              "Pour peupler la ville naissante et bâtir les navires, il fait venir mille familles coptes d'Égypte spécialistes de la charpenterie navale, associées aux tribus arabes et berbères locales.",
            ],
          },
        ],
        keyTakeaways: [
          "698 sonne le glas de la domination byzantine en Méditerranée occidentale.",
          "Naissance de Tunis comme port de guerre et carrefour administratif pérenne.",
        ],
        primarySourcesReferenced: [
          "Ibn Idhari, Al-Bayan al-Mughrib fi Akhbar al-Andalus wa-l-Maghrib",
          "Ibn Khaldoun, Kitāb al-ʻIbar (Histoire des Berbères et dynasties musulmanes)",
        ],
      },
      {
        id: "ch3-musa-andalousie-diwan",
        chapterNumber: 3,
        romanNumber: "III",
        title: "Musa Ibn Nusayr & l'Épopée vers l'Andalousie",
        subtitle: "Pacification de l'Ifriqiya, Tariq Ibn Ziyad et l'essor maritime",
        readingTimeMinutes: 6,
        keyThemes: ["Musa Ibn Nusayr", "Tariq Ibn Ziyad", "Andalousie 711", "Diwan"],
        summary:
          "Sous le gouvernorat de Musa Ibn Nusayr, la Tunisie consolide son administration provinciale et arme les expéditions qui mèneront en 711 à la conquête de la péninsule ibérique par Tariq Ibn Ziyad.",
        sections: [
          {
            heading: "L'Ifriqiya, base arrière de l'Occident islamique",
            paragraphs: [
              "Musa achève la pacification des tribus berbères zénètes et sanhadja, les intégrant à part entière dans les corps d'élite de la cavalerie musulmane.",
              "Depuis Kairouan, le trésor public (Bayt al-Mal) centralise le tribut, rémunère les troupes inscrites au Diwan et finance les arsenaux navals de Tunis et Sousse.",
            ],
          },
        ],
        keyTakeaways: [
          "L'Ifriqiya pilote la projection arabo-berbère vers l'Espagne wisigothique.",
          "Émergence d'une armée mixte arabo-berbère aguerrie.",
        ],
        primarySourcesReferenced: [
          "Al-Raqiq al-Qayrawani, Tarikh Ifriqiya wa-l-Maghrib",
          "Chroniques d'Al-Maqqari, Nafh al-Tib",
        ],
      },
      {
        id: "ch4-archives-monnaies-dinar-ifriqiya",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Monnayage d'Ifriqiya & Premières Généalogies Arabes",
        subtitle: "Dinars d'or bilingues latins-arabes et chaînes de transmission notariales",
        readingTimeMinutes: 5,
        keyThemes: ["Dinar d'Ifriqiya", "Numismatique", "Généalogies", "Tribus arabes"],
        summary:
          "Les premières décennies islamiques sont documentées par les remarquables dinars d'or frappés à Kairouan et par les récits des généalogistes fixant l'implantation des tribus arabes en Tunisie.",
        sections: [
          {
            heading: "Les monnaies de transition et l'onomastique des Conquérants",
            paragraphs: [
              "Entre 698 et 715, les ateliers monétaires d'Ifriqiya émettent des dinars d'or de transition portant des légendes bilingues en latin et en arabe, avant d'adopter le modèle omeyyade purement épigraphique.",
              "Les tribus arabes venues d'Orient (Quraysh, Tamim, Azd, Kinda) s'établissent dans les villes, introduisant des registres d'ansāb (généalogies) consignés par les juristes de Kairouan.",
            ],
            archivalNote:
              "Collection numismatique de Kairouan et du Musée de la Monnaie de la Banque Centrale de Tunisie.",
          },
        ],
        keyTakeaways: [
          "Preuve archéologique de l'introduction précoce de l'administration monétaire islamique.",
          "Constitution des premiers répertoires généalogiques arabes et métissages patriciens.",
        ],
        primarySourcesReferenced: [
          "Dinars d'or d'Ifriqiya de l'an 80 à 132 de l'Hégire (Musée de Raqqada)",
          "Ibn Hazm, Jamharat Ansāb al-Arab (Généalogies des Arabes en Occident)",
        ],
      },
    ],
  },

  aghlabide: {
    eraId: "aghlabide",
    eraTitle: "Émirat Aghlabide & Fondation Navale",
    historicalPeriod: "800 – 909 apr. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier analyse le siècle d'or aghlabide : l'obtention de l'hérédité dynastique par Ibrahim Ier Ibn Al-Aghlab en 800, l'apogée monumental et savant de Kairouan, la conquête de la Sicile en 827 sous l'égide du cadi Asad Ibn Al-Furat, et le génie hydraulique des grands bassins circulaires de Kairouan.",
    epigraphQuote: {
      text: "Nulle cour d'Occident n'égalait la splendeur des palais d'Al-Abbasiyya et de Raqqada, où les émirs aghlabides recevaient les ambassadeurs de Charlemagne et de Byzance.",
      author: "Al-Bakri",
      source: "Kitāb al-Masālik wa-l-Mamālik (Livre des Routes et des Royaumes)",
    },
    learningObjectives: [
      "Comprendre l'émancipation politique d'Ibrahim Ier Ibn Al-Aghlab consacrant l'autonomie souveraine de la Tunisie vis-à-vis de Bagdad.",
      "Analyser le rôle théologique et juridique de l'école malékite de Kairouan avec la rédaction de la Mudawwana par l'imam Sahnun.",
      "Étudier l'expédition maritime de 827 depuis Sousse menant à la conquête de la Sicile et à la fondation de l'Émirat de Palerme.",
      "Examiner les réalisations de génie civil : les Bassins des Aghlabides, les ribats côtiers de Monastir et Sousse.",
    ],
    chapters: [
      {
        id: "ch1-ibrahim-fondation-800",
        chapterNumber: 1,
        romanNumber: "I",
        title: "Ibrahim Ier & l'Autonomie Souveraine (800)",
        subtitle: "Le pacte avec Harun al-Rachid et la fondation de la dynastie émirale",
        readingTimeMinutes: 5,
        keyThemes: ["Ibrahim Ibn Al-Aghlab", "Harun al-Rachid", "Al-Abbasiyya", "Souveraineté"],
        summary:
          "En l'an 800, le calife abbasside Harun al-Rachid concède à Ibrahim Ibn Al-Aghlab le gouvernement héréditaire de l'Ifriqiya en échange d'un tribut symbolique annuel, créant le premier État souverain autonome de Tunisie islamique.",
        sections: [
          {
            heading: "La cité royale d'Al-Abbasiyya",
            paragraphs: [
              "Pour se prémunir des séditions de la milice arabe des Jund de Kairouan, Ibrahim Ier fonde une cité palatiale fortifiée à Al-Abbasiyya (au sud de Kairouan), pourvue d'une garde fidèle et de manufactures textiles d'apparat (Tiraz).",
              "La dynastie stabilise les frontières intérieures et met fin aux insurrections kharidjites qui avaient ensanglanté le siècle précédent.",
            ],
          },
        ],
        keyTakeaways: [
          "Consécration de la Tunisie comme puissance dynastique autonome.",
          "Fondation des résidences palatiales d'Al-Abbasiyya puis de Raqqada.",
        ],
        primarySourcesReferenced: [
          "Ibn al-Athir, Al-Kamil fi al-Tarikh (La Somme des Histoires)",
          "Al-Nuwayri, Nihayat al-Arab fi Funun al-Adab",
        ],
      },
      {
        id: "ch2-kairouan-sahnun-mudawwana",
        chapterNumber: 2,
        romanNumber: "II",
        title: "L'Âge d'Or de Kairouan & l'Imam Sahnun",
        subtitle: "L'agrandissement de la Grande Mosquée et la compilation de la Mudawwana",
        readingTimeMinutes: 6,
        keyThemes: ["Sahnun", "Mudawwana", "Grande Mosquée", "Malékisme", "Savoirs"],
        summary:
          "Sous le règne de Ziyadat Allah Ier (817–838), la Grande Mosquée de Kairouan reçoit sa forme monumentale définitive avec son minaret carré à trois étages et sa coupole nervurée du mihrab.",
        sections: [
          {
            heading: "La Mudawwana al-Kubra : la bible juridique du Maghreb",
            paragraphs: [
              "Nommé grand cadi de Kairouan en 848, l'imam Sahnun rédige la Mudawwana, vaste recueil de jurisprudence malékite qui deviendra le code civil et religieux de tout le Maghreb et de l'Andalousie.",
              "Kairouan attire des étudiants de tout le bassin méditerranéen, développant la médecine avec Ishaq Ibn Imran et les mathématiques.",
            ],
            archivalNote:
              "Manuscrits sur parchemin de la Mudawwana conservés au Centre des Manuscrits de Raqqada.",
          },
        ],
        keyTakeaways: [
          "Enracinement définitif de la jurisprudence malékite en Tunisie.",
          "Édification architecturale du joyau de la Grande Mosquée de Kairouan.",
        ],
        primarySourcesReferenced: [
          "Imam Sahnun, Al-Mudawwana al-Kubra",
          "Al-Maliki, Riyad al-Nufus",
        ],
      },
      {
        id: "ch3-sicile-asad-furat-827",
        chapterNumber: 3,
        romanNumber: "III",
        title: "La Flotte de Sousse & la Conquête de la Sicile (827)",
        subtitle: "Asad Ibn al-Furat et l'expansion maritime vers l'Italie du Sud",
        readingTimeMinutes: 6,
        keyThemes: ["Sicile 827", "Asad Ibn al-Furat", "Sousse", "Ribat", "Palerme"],
        summary:
          "En juin 827, une armada de cent navires appareille du port de Sousse commandée par le cadi savant Asad Ibn al-Furat pour conquérir la Sicile byzantine, inaugurant deux siècles et demi de présence islamique en Sicile.",
        sections: [
          {
            heading: "La prise de Mazara et le siège de Syracuse",
            paragraphs: [
              "Les forces aghlabides débarquent à Mazara del Vallo et assiègent Palerme, qui devient la capitale d'un émirat prospère rattaché à Kairouan.",
              "Pour sécuriser le littoral tunisien contre les contre-attaques byzantines, les émirs élèvent la formidable chaîne des ribats de Monastir, Sousse et Lamta.",
            ],
          },
        ],
        keyTakeaways: [
          "La Tunisie devient la première puissance navale de Méditerranée centrale.",
          "Rayonnement de l'architecture et de la culture aghlabide en Sicile et Calabre.",
        ],
        primarySourcesReferenced: [
          "Michele Amari, Storia dei Musulmani di Sicilia (Édition des sources arabes)",
          "Ibn Idhari, Al-Bayan al-Mughrib",
        ],
      },
      {
        id: "ch4-bassins-hydrauliques-raqqada",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Bassins des Aghlabides & Manuscrits sur Parchemin",
        subtitle: "Génie hydraulique urbain et inventaires des bibliothèques de fondation",
        readingTimeMinutes: 5,
        keyThemes: ["Bassins", "Hydraulique", "Raqqada", "Parchemin coufique", "Archives"],
        summary:
          "Les immenses réservoirs circulaires des Aghlabides à Kairouan, d'un diamètre de 128 mètres, illustrent l'extraordinaire maîtrise hydraulique d'un État confronté aux rigueurs du climat semi-aride.",
        sections: [
          {
            heading: "Le chef-d'œuvre hydraulique d'Abou Ibrahim Ahmed (862)",
            paragraphs: [
              "Alimentés par l'Oued Merguellil via un ingénieux bassin de décantation octogonal, les réservoirs alimentaient en eau courante les palais et les jardins de la capitale.",
              "Le fonds des parchemins de Kairouan (dont le célèbre Coran Bleu) constitue le plus ancien ensemble de documents calligraphiés en écriture coufique conservé dans le monde arabo-musulman.",
            ],
            archivalNote:
              "Laboratoire National de Restauration des Manuscrits de Raqqada (Kairouan).",
          },
        ],
        keyTakeaways: [
          "Monuments hydrauliques les plus vastes du monde médiéval encore intacts.",
          "Conservation d'un patrimoine documentaire inestimable du IXe siècle.",
        ],
        primarySourcesReferenced: [
          "Inventaires des Wakfs de la Grande Mosquée de Kairouan (Catalogues INP)",
          "Recherches archéologiques sur le site palatial de Raqqada",
        ],
      },
    ],
  },

  fatimide: {
    eraId: "fatimide",
    eraTitle: "Califat Fatimide & Fondation de Mahdia",
    historicalPeriod: "909 – 973 apr. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier explore l'épopée fatimide née en Tunisie : la proclamation du califat ismaélien par Obeid Allah Al-Mahdi en 909, l'édification de la capitale maritime imprenable de Mahdia en 916 avec sa redoutable Skifa Kahla, la grande révolte kharidjite d'Abu Yazid, et le départ triomphal vers Le Caire en 973.",
    epigraphQuote: {
      text: "J'ai bâti Mahdia sur cette langue de terre afin que le monde entier sache que la mer et la terre obéissent au commandeur des croyants.",
      author: "Obeid Allah Al-Mahdi",
      source: "Chronique d'Al-Qadi al-Nu'man, Iftitāḥ al-Da'wa",
    },
    learningObjectives: [
      "Comprendre la prédication ismaélienne d'Abu Abdallah al-Chi'i chez les Kotama menant à la chute des Aghlabides en 909.",
      "Analyser le choix architectural et naval de la fondation de Mahdia en 916 sur son isthme rocheux.",
      "Étudier la terrible guerre civile de l'Homme à l'Âne (Abu Yazid) qui manqua d'anéantir l'Empire avant le redressement d'Al-Mansur.",
      "Examiner le monnayage d'or du dinar de Mahdia et les registres de chancellerie califale conservés.",
    ],
    chapters: [
      {
        id: "ch1-obeid-allah-mahdi-909",
        chapterNumber: 1,
        romanNumber: "I",
        title: "L'Avènement du Califat & la Chute de Raqqada (909)",
        subtitle: "La prédication chez les Kotama et la proclamation califale d'Obeid Allah",
        readingTimeMinutes: 5,
        keyThemes: ["Fatimides", "Obeid Allah", "Kotama", "Califat", "Ismaélisme"],
        summary:
          "En janvier 910 à Raqqada, Obeid Allah est proclamé Calife et Mahdi attendu, rejetant l'autorité des Abbassides de Bagdad et inaugurant un califat rival en Occident islamique.",
        sections: [
          {
            heading: "La mobilisation militaire des montagnards Kotama",
            paragraphs: [
              "Le missionnaire (dā'ī) Abu Abdallah convertit les tribus montagnardes de Petite Kabylie et de Tunisie occidentale, écrasant les armées aghlabides forteresse par forteresse.",
              "Le nouveau califat centralise la fiscalité et impose son propre rite dans les tribunaux, suscitant la résistance passive des juristes malékites de Kairouan.",
            ],
          },
        ],
        keyTakeaways: [
          "La Tunisie devient le siège d'un Califat universel rivalisant avec Bagdad.",
          "Transformation profonde de l'idéologie politique et des rituels de cour.",
        ],
        primarySourcesReferenced: [
          "Al-Qadi al-Nu'man, Iftitāḥ al-Da'wa wa-Ibtidā' al-Dawla",
          "Ibn Hammad, Akhbar Muluk Bani Ubayd",
        ],
      },
      {
        id: "ch2-mahdia-skifa-kahla-916",
        chapterNumber: 2,
        romanNumber: "II",
        title: "Mahdia, Forteresse Maritime Impériale (916)",
        subtitle: "L'isthme fortifié, la Skifa Kahla et le port militaire creusé dans le roc",
        readingTimeMinutes: 6,
        keyThemes: ["Mahdia", "Skifa Kahla", "Arsenal", "Port creusé", "Défense"],
        summary:
          "En 916, Al-Mahdi fonde ex nihilo la cité maritime de Mahdia sur une presqu'île rocheuse étroite, protégée par une muraille de 10 mètres d'épaisseur et une porte monumentale unique : la Skifa Kahla.",
        sections: [
          {
            heading: "Le sanctuaire imprenable tourné vers l'Orient",
            paragraphs: [
              "La Skifa Kahla (la sombre porte couverte) formait un sas voûté imprenable de 33 mètres de long muni de herses de fer et de mâchicoulis.",
              "Le port naval artificiel, creusé à même le grès marin comme les anciens cothons puniques, pouvait abriter 30 navires de guerre prêts à cingler vers la Sicile et l'Égypte.",
            ],
          },
        ],
        keyTakeaways: [
          "Chef-d'œuvre absolu de l'architecture militaire et navale du Xe siècle.",
          "Mahdia devient le cœur névralgique du pouvoir califal fatimide.",
        ],
        primarySourcesReferenced: [
          "Descriptions d'Ibn Hawqal dans Surat al-Ard",
          "Fouilles archéologiques de l'INP sur l'enceinte et le port de Mahdia",
        ],
      },
      {
        id: "ch3-abu-yazid-homme-ane",
        chapterNumber: 3,
        romanNumber: "III",
        title: "La Révolte d'Abu Yazid & le Triomphe d'Al-Mansur",
        subtitle: "L'assaut des tribus zénètes kharidjites et le siège héroïque de Sousse et Mahdia",
        readingTimeMinutes: 6,
        keyThemes: ["Abu Yazid", "Kharidjites", "Al-Mansur", "Sabra al-Mansuriya", "Victoire"],
        summary:
          "Entre 943 et 947, le chef kharidjite Abu Yazid (l'Homme à l'Âne) soulève les tribus pastorales, prend Kairouan et assiège Mahdia pendant plusieurs mois, menaçant la dynastie d'anéantissement.",
        sections: [
          {
            heading: "La contre-offensive victorieuse du calife Al-Mansur",
            paragraphs: [
              "Le troisième calife fatimide, Ismaïl Al-Mansur, brise le siège de Mahdia, défait les rebelles à Kairouan et poursuit Abu Yazid jusqu'aux monts du Hodna où ce dernier est capturé.",
              "Pour célébrer son triomphe, Al-Mansur fonde en 948 la somptueuse capitale circulaire de Sabra al-Mansuriya aux portes de Kairouan.",
            ],
          },
        ],
        keyTakeaways: [
          "Crise existentielle majeure résolue par la victoire militaire califale.",
          "Édification de Sabra al-Mansuriya, préfigurant le plan de la ville du Caire.",
        ],
        primarySourcesReferenced: [
          "Al-Qadi al-Nu'man, Al-Majālis wa-l-Musāyarāt",
          "Ibn Idhari, Al-Bayan al-Mughrib",
        ],
      },
      {
        id: "ch4-archives-monnaie-or-le-caire",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Le Dinar d'Or Fatimide & le Départ vers Le Caire (973)",
        subtitle: "L'expédition du général Jawhar et la transmission du pouvoir aux Zirides",
        readingTimeMinutes: 5,
        keyThemes: ["Dinar d'or", "Le Caire 969", "Jawhar", "Zirides", "Archives"],
        summary:
          "En 969, le général Jawhar al-Siqilli, parti de Tunisie, conquiert l'Égypte et fonde la cité du Caire (Al-Qāhira). En 973, le calife Al-Mu'izz quitte définitivement la Tunisie avec ses trésors, confiant l'Ifriqiya à son fidèle lieutenant Boloqqin Ibn Ziri.",
        sections: [
          {
            heading: "Le transfert d'empire et l'héritage tunisien",
            paragraphs: [
              "Le dinar fatimide en or pur frappé à Mahdia et Mansuriya, avec ses cercles concentriques d'écriture coufique, était réputé pour sa pureté dans tous les ports de Méditerranée.",
              "En confiant les rênes de la Tunisie aux Sanhadja de Boloqqin Ibn Ziri, Al-Mu'izz inaugure la première dynastie d'origine purement berbère régnant sur l'Ifriqiya.",
            ],
            archivalNote:
              "Actes de concession de gouvernement de l'an 362 H conservés dans les chroniques de chancellerie.",
          },
        ],
        keyTakeaways: [
          "La puissance tunisienne engendre la fondation de la métropole du Caire.",
          "Transition politique vers la dynastie berbère des Zirides.",
        ],
        primarySourcesReferenced: [
          "Dinars al-Mahdiya et al-Mansuriya (Cabinet des Médailles de Paris et BCT Tunis)",
          "Chronique d'Al-Maqrizi, Itti'az al-Hunafa bi-Akhbar al-A'imma al-Fatimiyyin",
        ],
      },
    ],
  },

  almohade_ziride: {
    eraId: "almohade_ziride",
    eraTitle: "Royaume Ziride & Épopée Almohade",
    historicalPeriod: "973 – 1229 apr. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier d'histoire étudie la transition complexe du Moyen Âge tunisien : l'épanouissement des émirs berbères sanhadja sous Boloqqin et Al-Mu'izz Ibn Badis, la rupture audacieuse avec Le Caire en 1048, le choc de l'invasion bédouine des Banu Hilal en 1051, et l'unification de tout le Maghreb sous l'Empire Almohade.",
    epigraphQuote: {
      text: "L'invasion des Banu Hilal en Ifriqiya fut pareille à une nuée de sauterelles dévorant tout sur son passage ; le plat pays fut dévasté, mais les cités côtières préservèrent leur commerce et leurs lois.",
      author: "Ibn Khaldoun",
      source: "Histoire des Berbères, Tome I",
    },
    learningObjectives: [
      "Analyser l'autonomie souveraine des émirs Zirides régnant depuis Sabra al-Mansuriya et Mahdia.",
      "Comprendre la décision d'Al-Mu'izz Ibn Badis de rejeter le chiisme fatimide en 1048 et de rétablir le sunnisme malékite.",
      "Étudier l'impact démographique et pastoral de l'arrivée des confédérations Banu Hilal et Banu Sulaym dès 1051.",
      "Comprendre l'intégration de la Tunisie dans l'Empire Almohade d'Abd al-Mumin en 1159 expulsant les Normands de Sicile.",
    ],
    chapters: [
      {
        id: "ch1-zirides-mansuriya-mahdia",
        chapterNumber: 1,
        romanNumber: "I",
        title: "La Dynastie Berbère des Zirides (973–1048)",
        subtitle: "Boloqqin Ibn Ziri, l'essor artistique de Mansuriya et la puissance maritime",
        readingTimeMinutes: 5,
        keyThemes: ["Zirides", "Boloqqin", "Mansuriya", "Sanhadja", "Culture"],
        summary:
          "Les Zirides, princes berbères Sanhadja, gouvernent la Tunisie avec faste depuis les palais de Sabra al-Mansuriya et Mahdia, développant le commerce maritime et encourageant les poètes et savants.",
        sections: [
          {
            heading: "La prospérité de l'art de cour ziride",
            paragraphs: [
              "Sous les règnes de Badis et d'Al-Mu'izz, les ateliers d'Ifriqiya produisent des boiseries sculptées, des reliures précieuses et des tissus de soie renommés.",
              "Bien que vassaux nominaux du calife fatimide résidant au Caire, les Zirides mènent une politique indépendante et frappent leur propre monnaie.",
            ],
          },
        ],
        keyTakeaways: [
          "Première grande dynastie souveraine d'origine berbère sanhadja en Tunisie.",
          "Épanouissement culturel et maintien de la suprématie navale en Méditerranée centrale.",
        ],
        primarySourcesReferenced: [
          "Ibn Abi Dinar, Al-Mu'nis fi Akhbar Ifriqiya wa Tunis",
          "Objets d'art zirides conservés au Musée National d'Art Islamique de Raqqada",
        ],
      },
      {
        id: "ch2-rupture-1048-choc-hilalien",
        chapterNumber: 2,
        romanNumber: "II",
        title: "La Rupture de 1048 & le Choc Hilalien (1051)",
        subtitle: "Le retour au sunnisme, la bataille de Haydaran et la dispersion bédouine",
        readingTimeMinutes: 6,
        keyThemes: ["1048", "Al-Mu'izz", "Banu Hilal", "Haydaran", "Arabisation"],
        summary:
          "En 1048, Al-Mu'izz Ibn Badis franchit le pas décisif : il fait proclamer le calife abbasside de Bagdad dans les mosquées et rétablit le rite sunnite. En représailles, Le Caire lâche sur l'Ifriqiya les tribus bédouines Banu Hilal et Banu Sulaym.",
        sections: [
          {
            heading: "La bataille d'Haydaran et le repli sur Mahdia",
            paragraphs: [
              "Le 14 avril 1052 à Haydaran (près de Gabès), l'armée ziride est mise en déroute par la cavalerie bédouine nomade.",
              "Privé de son arrière-pays, Al-Mu'izz abandonne Kairouan et se replie derrière les remparts imprenables de Mahdia. Les tribus hilaliennes (Riyah, Zughba, Athbadj) s'installent durablement dans les plaines intérieures.",
            ],
          },
        ],
        keyTakeaways: [
          "Accélération décisive de l'arabisation linguistique des campagnes tunisiennes.",
          "Séparation durable entre le pouvoir maritime des cités côtières et l'intérieur pastoral.",
        ],
        primarySourcesReferenced: [
          "Ibn Khaldoun, Kitāb al-ʻIbar (La geste hilalienne Taghribat Bani Hilal)",
          "Chronique d'Al-Tijani, Rihla (Voyage à travers la Tunisie au début du XIVe siècle)",
        ],
      },
      {
        id: "ch3-normands-almohades-1159",
        chapterNumber: 3,
        romanNumber: "III",
        title: "La Parenthèse Normande & la Libération Almohade (1159)",
        subtitle: "Roger II de Sicile, Abd al-Mumin et l'unification politique du Maghreb",
        readingTimeMinutes: 6,
        keyThemes: ["Normands", "Roger II", "Almohades", "Abd al-Mumin", "Mahdia 1160"],
        summary:
          "Profitant de l'émiettement ziride, le roi normand de Sicile Roger II s'empare de Mahdia, Sousse, Sfax et Djerba (1148–1160). En 1159, le calife almohade Abd al-Mumin arrive de Marrakech avec une armée gigantesque et libère tout le littoral tunisien.",
        sections: [
          {
            heading: "La campagne d'Abd al-Mumin et la capitulation normande",
            paragraphs: [
              "Abd al-Mumin assiège Mahdia par terre et par mer avec 200 vaisseaux. Le 11 janvier 1160, la garnison normande capitule.",
              "Pour la première fois de l'histoire islamique, toute l'Afrique du Nord de l'Atlantique à Tripoli et l'Andalousie sont réunies sous un commandement politique unique : le Califat Almohade.",
            ],
          },
        ],
        keyTakeaways: [
          "Expulsion définitive des armées normandes des côtes tunisiennes.",
          "Intégration de la Tunisie dans l'espace impérial unitaire almohade.",
        ],
        primarySourcesReferenced: [
          "Ibn al-Athir, Al-Kamil fi al-Tarikh",
          "Documents consulaires pisans et génois sur les ports tunisiens (1150–1180)",
        ],
      },
      {
        id: "ch4-archives-monnaie-carree-cadastre",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Le Dirham Carré Almohade & les Registres Fonciers",
        subtitle: "Monnaies épigraphiques carrées, recensements et gouverneurs Almohadistes",
        readingTimeMinutes: 5,
        keyThemes: ["Dirham carré", "Numismatique almohade", "Sayyid", "Cadastre", "Archives"],
        summary:
          "La souveraineté almohade en Tunisie s'incarne par une refonte monétaire radicale (les célèbres pièces carrées sans image) et par l'envoi de princes du sang (les Sayyid) pour gouverner Tunis et Kairouan.",
        sections: [
          {
            heading: "La typologie monétaire almohade",
            paragraphs: [
              "Le dirham d'argent et le demi-dinar d'or almohades rompent avec les cercles traditionnels pour adopter un carré inscrit dans un cercle, portant la formule de foi unitaire d'Ibn Tumart : 'Dieu est notre Seigneur, Muhammad notre messager, le Mahdi notre guide'.",
              "L'administration centrale de Marrakech diligente des inspecteurs pour recenser les terres utiles et réorganiser la perception de l'impôt foncier (Kharaj).",
            ],
            archivalNote:
              "Trésors monétaires almohades découverts à Mahdia et Sousse (BCT et INP).",
          },
        ],
        keyTakeaways: [
          "Uniformisation monétaire et fiscale à l'échelle de tout le Maghreb.",
          "Mise en place de l'administration provinciale qui enfantera le Sultanat hafside.",
        ],
        primarySourcesReferenced: [
          "Numismatique almohade d'Ifriqiya (Collections INP)",
          "Ibn Sahib al-Salat, Al-Mann bi-l-Imama",
        ],
      },
    ],
  },

  hafside: {
    eraId: "hafside",
    eraTitle: "Sultanat Hafside de Tunis",
    historicalPeriod: "1229 – 1574 apr. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier magistral retrace les trois siècles et demi du Sultanat hafside : l'émancipation souveraine d'Abou Zakariya Yahya en 1229, l'élévation définitive de Tunis au rang de capitale impériale de tout le Maghreb, la résistance victorieuse contre la croisade de Saint Louis à Carthage en 1270, l'âge d'or intellectuel d'Ibn Khaldoun, et la construction des medersas de la Zitouna.",
    epigraphQuote: {
      text: "Tunis devint le séjour du califat hafside, la métropole où affluèrent les savants d'Ifriqiya et les réfugiés d'Andalousie, parée d'écoles illustres, d'arsenaux et de palais admirés par les marchands de tout l'univers.",
      author: "Ibn Khaldoun",
      source: "Le Livre des Exemples (Kitāb al-ʻIbar), né à Tunis en 1332",
    },
    learningObjectives: [
      "Comprendre la proclamation de l'indépendance hafside en 1229 par Abou Zakariya Yahya Ier rompant avec Marrakech.",
      "Analyser le déroulement et l'échec de la huitième croisade menée par le roi de France Louis IX à Carthage en 1270.",
      "Étudier l'essor intellectuel de Tunis sous l'égide de l'Université de la Zitouna et les fondations de medersas (Chammaïya, Tawfiqiya).",
      "Examiner les traités diplomatiques et commerciaux conclus avec les Républiques maritimes de Venise, Gênes, Pise et l'Aragon.",
    ],
    chapters: [
      {
        id: "ch1-abou-zakariya-tunis-1229",
        chapterNumber: 1,
        romanNumber: "I",
        title: "Abou Zakariya & la Proclamation Califale de Tunis (1229)",
        subtitle: "L'indépendance de l'Ifriqiya et le choix de Tunis comme capitale souveraine",
        readingTimeMinutes: 5,
        keyThemes: ["Hafsides", "Abou Zakariya", "1229", "Tunis capitale", "Kasbah"],
        summary:
          "En 1229, le gouverneur hafside Abou Zakariya Yahya se proclame émir indépendant de Marrakech, supprime le nom du calife almohade de la Khutba du vendredi et fonde la dynastie qui régnera 345 ans sur la Tunisie.",
        sections: [
          {
            heading: "Tunis, cœur battant de l'État hafside",
            paragraphs: [
              "Abou Zakariya délaisse Kairouan et Mahdia pour faire de Tunis sa capitale exclusive. Il fait bâtir la Kasbah fortifiée de Tunis et la magnifique Mosquée de la Kasbah aux chapiteaux sculptés.",
              "Son autorité s'étend rapidement de Constantine à Tripoli, et les chérifs de La Mecque eux-mêmes lui reconnaissent en 1259 le titre de Calife et Commandeur des Croyants.",
            ],
          },
        ],
        keyTakeaways: [
          "Tunis devient définitivement et sans discontinuer la capitale de la Tunisie.",
          "Reconnaissance panislamique du califat hafside de Tunis.",
        ],
        primarySourcesReferenced: [
          "Ibn Khaldoun, Histoire des Berbères et des dynasties musulmanes d'Ifriqiya",
          "Brunschvig Robert, La Berbérie orientale sous les Hafsides (Monographie de référence)",
        ],
      },
      {
        id: "ch2-croisade-saint-louis-1270",
        chapterNumber: 2,
        romanNumber: "II",
        title: "La Croisade de Saint Louis à Carthage (1270)",
        subtitle: "Le débarquement français, l'épidémie de peste et le traité de paix d'Al-Moustansir",
        readingTimeMinutes: 6,
        keyThemes: ["1270", "Saint Louis", "Croisade", "Al-Moustansir", "Traité de paix"],
        summary:
          "En juillet 1270, le roi de France Louis IX (Saint Louis) débarque avec 10 000 croisés sur les ruines de Carthage pour convertir de force le sultan Al-Moustansir Billah et s'emparer de Tunis.",
        sections: [
          {
            heading: "L'échec de l'expédition et le traité du 31 octobre 1270",
            paragraphs: [
              "Harcelée par les archers et cavaliers légers tunisiens sous un soleil de plomb, l'armée croisée est décimée par la dysenterie et le typhus. Le roi Louis IX meurt sous sa tente à Carthage le 25 août 1270.",
              "Son frère Charles d'Anjou signe le 31 octobre un traité avantageux pour Tunis : les croisés évacuent le pays en échange d'une indemnité de guerre et le sultan conserve l'intégralité de sa souveraineté territoriale.",
            ],
          },
        ],
        keyTakeaways: [
          "Échec cuisant de la dernière grande croisade médiévale sous les murs de Tunis.",
          "Consolidation du prestige international et diplomatique du Sultan hafside.",
        ],
        primarySourcesReferenced: [
          "Chronique de Jean de Joinville, Vie de Saint Louis",
          "Texte du Traité de Tunis du 31 octobre 1270 (Archives d'État de Naples et de Palerme)",
        ],
      },
      {
        id: "ch3-ibn-khaldoun-medersas-zitouna",
        chapterNumber: 3,
        romanNumber: "III",
        title: "Ibn Khaldoun & le Réseau des Medersas de Tunis",
        subtitle: "La Muqaddima, la Medersa El-Chammaïya et l'accueil des Andalous",
        readingTimeMinutes: 6,
        keyThemes: ["Ibn Khaldoun", "Medersas", "Chammaïya", "Zitouna", "Andalousie"],
        summary:
          "Né rue Tourbet El-Bey à Tunis en 1332, Abd al-Rahman Ibn Khaldoun y fait ses études avant de révolutionner l'historiographie mondiale avec sa Muqaddima (Prolégomènes à l'Histoire universelle).",
        sections: [
          {
            heading: "L'institutionnalisation des collèges universitaires",
            paragraphs: [
              "Dès 1238, Abou Zakariya fonde la Medersa El-Chammaïya (la plus ancienne du Maghreb), suivie par la Medersa Al-Tawfiqiya et la Medersa Al-Mountaciriya, offrant bourses et hébergement aux étudiants de la Zitouna.",
              "L'afflux des familles nobles andalouses chassées de Séville, Cordoue et Valence enrichit l'administration, l'architecture des palais et les techniques agricoles du cap Bon.",
            ],
            archivalNote:
              "Maison natale d'Ibn Khaldoun (Médina de Tunis) et bibliothèque de la Mosquée Zitouna.",
          },
        ],
        keyTakeaways: [
          "Naissance à Tunis de la sociologie et de la philosophie critique de l'histoire.",
          "Création du premier réseau universitaire structuré d'enseignement supérieur du Maghreb.",
        ],
        primarySourcesReferenced: [
          "Ibn Khaldoun, Al-Ta'rif bi-Ibn Khaldun wa-Rihlatuhu Gharban wa-Sharqan (Autobiographie)",
          "Actes de fondation habous des Medersas de Tunis (Archives Nationales de Tunisie)",
        ],
      },
      {
        id: "ch4-archives-traites-notariat-hafside",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Traités Européens & Registres de la Chancellerie Hafside",
        subtitle: "Fonds diplomatiques avec Pise, Gênes, Venise, Aragon et registres de douane",
        readingTimeMinutes: 5,
        keyThemes: ["Traités", "Fondouks", "Venise", "Gênes", "Archives diplomatiques"],
        summary:
          "Les souverains hafsides signent des dizaines de traités de paix et de commerce garantissant la sécurité des marchands chrétiens résidant dans les fondouks de Tunis (Sidi Bou Khrissane, Bab El Bhar).",
        sections: [
          {
            heading: "Le notariat d'État et les droits de douane (Diwan al-Bahr)",
            paragraphs: [
              "La chancellerie de Tunis tenait des registres d'actes diplomatiques en arabe et en latin scellés du sceau califal (Al-Alama), stipulant un droit de douane fixe de 10% sur les marchandises importées.",
              "Ces traités sont aujourd'hui conservés aux Archives Nationales de Tunisie et dans les chancelleries d'Italie et de Catalogne, offrant une mine de données généalogiques et commerciales.",
            ],
            archivalNote:
              "Archives de la Couronne d'Aragon (Barcelone) et Archives d'État de Florence et Venise.",
          },
        ],
        keyTakeaways: [
          "Intégration commerciale remarquable de la Tunisie dans l'économie méditerranéenne.",
          "Conservation exceptionnelle d'originaux diplomatiques bilingues du XIIIe au XVIe siècle.",
        ],
        primarySourcesReferenced: [
          "L. de Mas-Latrie, Traités de paix et de commerce concernant les relations des chrétiens avec les Arabes de l'Afrique septentrionale",
          "Archives Nationales de Tunisie (Kasbah — Série Diplomatique)",
        ],
      },
    ],
  },

  ottomane: {
    eraId: "ottomane",
    eraTitle: "Régence Ottomane & Époque des Deys",
    historicalPeriod: "1574 – 1705 apr. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier de recherche analyse les 131 ans de la Régence ottomane de Tunis : l'expulsion définitive des Espagnols de La Goulette en 1574 par Sinan Pacha, l'organisation tripartite de l'Eyalet (Pacha, Dey, Bey), la tournée semestrielle de la Mahalla unifiant l'arrière-pays, l'accueil bienveillant des 80 000 Morisques andalous en 1609 et la mise en place des Defters d'archives de La Kasbah.",
    epigraphQuote: {
      text: "Tunis n'est point une province esclave du Grand Seigneur ; elle est une République guerrière et marchande où le Diwan élit ses chefs et où la justice s'exerce avec une rigueur que l'Europe admire.",
      author: "Laurent d'Arvieux",
      source: "Mémoires du Chevalier d'Arvieux, envoyé extraordinaire du Roi de France à Tunis en 1666",
    },
    learningObjectives: [
      "Comprendre l'articulation politique tripartite de la Régence : Pacha ottoman, Dey de la milice, et Bey du camp.",
      "Analyser la tournée fiscale semestrielle de la Mahalla et la pacification des caïdats intérieurs.",
      "Étudier l'impact économique, architectural et agricole de l'expulsion des Morisques en 1609.",
      "Maîtriser la consultation des Defters et des Sijillats des mahkamas hanéfite et malékite de Tunis.",
    ],
    chapters: [
      {
        id: "ch1-sinan-pacha-1574",
        chapterNumber: 1,
        romanNumber: "I",
        title: "La Libération de 1574 & la Fondation de l'Eyalet",
        subtitle: "L'expulsion des garnisons espagnoles de La Goulette et l'ancrage ottoman",
        readingTimeMinutes: 5,
        keyThemes: ["1574", "Sinan Pacha", "La Goulette", "Eyalet", "Souveraineté"],
        summary:
          "En août 1574, une formidable armada ottomane commandée par Sinan Pacha et le grand amiral Uluj Ali reprend la forteresse de La Karraka à La Goulette et la Kasbah de Tunis, mettant un terme définitif aux ambitions espagnoles en Afrique du Nord.",
        sections: [
          {
            heading: "La fin du protectorat espagnol et la réorganisation",
            paragraphs: [
              "La Tunisie est érigée en Eyalet (province souveraine) dotée d'une garnison permanente de 4 000 Janissaires venus d'Anatolie et des Balkans. L'administration beylicale et les tribunaux s'organisent à la Kasbah de Tunis.",
              "Dès les premières décennies, l'éloignement d'Istanbul favorise une émancipation rapide : le Diwan des officiers élit ses propres chefs (les Deys) et négocie ses propres capitulations maritimes.",
            ],
            archivalNote:
              "Fonds Trablusgarp ve Tunus — Archives ottomanes du Başbakanlık (Istanbul) et Registres de la Kasbah (ANT).",
          },
        ],
        keyTakeaways: [
          "1574 scelle l'appartenance définitive de la Tunisie à l'orbite islamique moderne.",
          "Instauration précoce d'une autonomie diplomatique et navale de fait.",
        ],
        primarySourcesReferenced: [
          "Chronique d'Ibn Abi Dinar — Al-Mu'nis fi Akhbar Ifriqiya wa Tunis",
          "Archives de la Chambre de Commerce de Marseille (Série Tunis 1580–1620)",
        ],
      },
      {
        id: "ch2-deys-janissaires-diwan",
        chapterNumber: 2,
        romanNumber: "II",
        title: "L'Ojak des Janissaires & le Pouvoir des Deys",
        subtitle: "Le gouvernement militaire de la Kasbah et les minarets octogonaux",
        readingTimeMinutes: 6,
        keyThemes: ["Deys", "Janissaires", "Youssef Dey", "Kasbah", "Mosquées hanéfites"],
        summary:
          "Entre 1598 et 1637, les Deys élus par l'armée turque (Othman Dey puis Youssef Dey) stabilisent les finances de la Régence, fortifient les ports et introduisent le rite hanéfite avec ses minarets octogonaux élancés.",
        sections: [
          {
            heading: "Le règne éclairé de Youssef Dey (1610–1637)",
            paragraphs: [
              "Youssef Dey fait édifier en 1616 la première grande mosquée hanéfite de la Médina de Tunis avec son minaret octogonal en pierre calcaire de Zaghouan, son marché aux esclaves militaires et ses fondouks.",
              "Il ouvre les portes de la Régence aux marchands français, toscans et anglais et dote la ville d'un corps de police urbaine réputé pour sa sévérité.",
            ],
          },
        ],
        keyTakeaways: [
          "Dualité religieuse constructive entre le rite officiel hanéfite et le rite malékite du peuple.",
          "Transformation urbaine de la Médina de Tunis (Souk el-Trouk, Souk el-Birka).",
        ],
        primarySourcesReferenced: [
          "Waqfiyya de la Mosquée Youssef Dey (1616 — ANT)",
          "Registres consulaires de la chancellerie de France à Tunis (CADN Nantes)",
        ],
      },
      {
        id: "ch3-dynastie-mouradite-mahalla",
        chapterNumber: 3,
        romanNumber: "III",
        title: "L'Avènement Héréditaire des Mouradites (1613)",
        subtitle: "La tournée de la Mahalla et le contrôle des caïdats territoriaux",
        readingTimeMinutes: 6,
        keyThemes: ["Mouradites", "Mahalla", "Caïdats", "Hammouda Pacha Bey"],
        summary:
          "Mourad Bey Ier, corsaire d'origine corse intégré à l'Ojak, obtient du Sultan le titre héréditaire de Pacha-Bey. Il crée l'institution fiscale de la Mahalla qui unifie l'autorité de l'État de Béja à Tozeur.",
        sections: [
          {
            heading: "La tournée semestrielle de la Mahalla",
            paragraphs: [
              "Deux fois par an, le Bey parcourt le pays à la tête de la colonne armée (la Mahalla du Nord en été pour les moissons céréalières, la Mahalla du Sud en hiver pour les dattes du Djerid et les taxes pastorales).",
              "Cette institution pacifie les tribus, arbitre les conflits entre confédérations et asseoit l'autorité de Tunis sur l'ensemble de l'arrière-pays.",
            ],
          },
        ],
        keyTakeaways: [
          "Passage d'une garnison militaire turque à une dynastie princière héréditaire tunisienne.",
          "La Mahalla devient l'instrument central d'intégration et d'affirmation étatique.",
        ],
        primarySourcesReferenced: [
          "Defters fiscaux de la Mahalla (Série Kasbah — ANT)",
          "Chroniques d'Al-Wazir Al-Sarraj — Al-Hulal Al-Sundusiyya",
        ],
      },
      {
        id: "ch4-morisques-andalous-1609",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "L'Exode Morisque de 1609 & la Renaissance Andalouse",
        subtitle: "L'installation de 80 000 réfugiés à Testour, Soliman, Zaghouan et Tebourba",
        readingTimeMinutes: 5,
        keyThemes: ["Morisques 1609", "Testour", "Chéchias", "Hydraulique", "Andalousie"],
        summary:
          "Expulsés d'Espagne par Philippe III en 1609, près de 80 000 Morisques sont accueillis en Tunisie par Othman Dey. Ils révolutionnent l'artisanat des chéchias et l'agriculture irriguée de la Medjerda.",
        sections: [
          {
            heading: "La fondation des cités d'art andalouses",
            paragraphs: [
              "Les Morisques fondent ou réhabilitent Testour, Soliman, Zaghouan, Tebourba, Medjez el-Bab et Rafraf. La Grande Mosquée de Testour, avec son horloge tournant à l'envers et ses étoiles de David, témoigne de leur syncrétisme raffiné.",
              "À Tunis, ils créent la puissante corporation des fabricants de chéchias (Souk el-Chaouachine), industrie de luxe qui exportera ses coiffes feutrées de laine dans tout le Levant, l'Égypte et l'Empire ottoman.",
            ],
          },
        ],
        keyTakeaways: [
          "Apport démographique, technique et linguistique déterminant pour l'identité tunisienne.",
          "Les chéchias de Tunis deviennent la première industrie manufacturière d'exportation.",
        ],
        primarySourcesReferenced: [
          "Actes notariés morisques de Testour et Soliman (BNT et ANT)",
          "Sijills de la corporation des Chaouachia de Tunis",
        ],
      },
      {
        id: "ch5-archives-defters-sijillats",
        chapterNumber: 5,
        romanNumber: "V",
        title: "Defters Ottomans & Archives du Charaâ",
        subtitle: "Comment retracer les lignées de la Régence dans les séries historiques de La Kasbah",
        readingTimeMinutes: 6,
        keyThemes: ["Defters", "Sijillats", "Charaâ", "Généalogie ottomane", "ANT"],
        summary:
          "Pour les généalogistes, la Régence ottomane inaugure la tenue systématique de registres écrits d'État conservés aujourd'hui aux Archives Nationales de Tunisie à la Kasbah.",
        sections: [
          {
            heading: "Les trois grandes séries de sources",
            paragraphs: [
              "1. Les Defters militaires : rôles de solde des janissaires et spahis, consignant filiations et promotions nominatives.",
              "2. Les Sijills des tribunaux du Charaâ : actes notariés d'achat foncier, contrats de mariage, actes de succession (I'lam Char'i) et déclarations de tutelle.",
              "3. Les registres des Habous : fondations pieuses familiales (Waqf ahlī) mentionnant les arbres généalogiques complets des légataires.",
            ],
            archivalNote:
              "Archives Nationales de Tunisie (Kasbah) — Séries Historiques et Fonds Dar El-Bey.",
          },
        ],
        keyTakeaways: [
          "Richesse exceptionnelle des dépôts d'archives tunisiens conservés à La Kasbah.",
          "Possibilité de remonter les filiations familiales avec certitude juridique jusqu'au XVIe siècle.",
        ],
        primarySourcesReferenced: [
          "Archives Nationales de Tunisie (ANT — Fonds Beylical et Tribunaux Charaïques)",
          "Bibliothèque Nationale de Tunisie (Fonds des Manuscrits et Sijills)",
        ],
      },
    ],
  },

  husseinite: {
    eraId: "husseinite",
    eraTitle: "Dynastie Husseinite & Beylicat de Tunis",
    historicalPeriod: "1705 – 1881 apr. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier magistral retrace les 176 années de l'Âge d'Or beylical sous les Husseinites : la fondation par Hussein Ben Ali en 1705, l'apogée souverain d'Hammouda Pacha (1782–1814), les réformes modernistes d'Ahmed Bey Ier, la promulgation du Pacte Fondamental Ahd El-Aman en 1857, la première Constitution du monde arabo-musulman en 1861, et la formidable richesse des rôles fiscaux de la Majba de 1860 conservés aux Archives Nationales.",
    epigraphQuote: {
      text: "Le Pacte Fondamental d'Ahd El-Aman ne fut point une concession arrachée par la force ; il fut le fruit mûr d'une civilisation juridique tunisienne affirmant que la sécurité de la personne, des biens et de l'honneur est un droit sacré garanti par l'État à tout sujet du Royaume.",
      author: "Ahmad Ibn Abi Diyaf",
      source: "Ithāf Ahl al-Zamān bi-Akhbār Mulūk Tūnis wa-Ahd al-Amān",
    },
    learningObjectives: [
      "Comprendre la fondation de la dynastie par Hussein Ben Ali en 1705 mettant fin aux guerres civiles de l'armée ottomane.",
      "Analyser le règne glorieux d'Hammouda Pacha (1782–1814) : souveraineté douanière, victoires contre Alger et Venise, et bâtisseur de Dar El-Bey.",
      "Étudier les grandes réformes institutionnelles : abolition de l'esclavage en 1846, Ahd El-Aman en 1857 et la Constitution de 1861.",
      "Maîtriser l'exploitation des rôles nominatifs de la Majba de 1860 et des registres des 60 caïdats territoriaux de l'ANT.",
    ],
    chapters: [
      {
        id: "ch1-hussein-ben-ali-1705",
        chapterNumber: 1,
        romanNumber: "I",
        title: "Hussein Ben Ali & l'Ordre Dynastique (1705)",
        subtitle: "La fin de la guerre civile mouradite et la fondation de la monarchie husseinite",
        readingTimeMinutes: 5,
        keyThemes: ["1705", "Hussein Ben Ali", "Husseinites", "Tourbet El-Bey", "Dynastie"],
        summary:
          "Le 15 juillet 1705, Hussein Ben Ali, commandant de la cavalerie des Spahis d'origine crétoise, est proclamé Bey par les dignitaires et l'armée de Tunis, fondant la dynastie qui régnera jusqu'en 1957.",
        sections: [
          {
            heading: "L'enracinement national du pouvoir beylical",
            paragraphs: [
              "Hussein Bey Ben Ali pacifie le pays, conclut des pactes avec les cheikhs des tribus de l'intérieur et fait restaurer les ponts et canaux de la Medjerda.",
              "Il fait édifier le mausolée dynastique de Tourbet El-Bey dans la Médina de Tunis, la Mosquée des Teinturiers (Al-Sabbaghine) et des medersas pour former l'élite juridique du pays.",
            ],
          },
        ],
        keyTakeaways: [
          "Fondation d'une monarchie tunisienne stable et reconnue par la Sublime Porte.",
          "Alliance durable entre la cour de Tunis et les grandes familles notables du pays.",
        ],
        primarySourcesReferenced: [
          "Ahmad Ibn Abi Diyaf, Ithāf Ahl al-Zamān (Tomes I & II)",
          "Actes de nomination des caïds par Hussein Ben Ali (ANT Kasbah)",
        ],
      },
      {
        id: "ch2-hammouda-pacha-apogee",
        chapterNumber: 2,
        romanNumber: "II",
        title: "L'Âge d'Or d'Hammouda Pacha (1782–1814)",
        subtitle: "L'émancipation diplomatique, la victoire sur Alger et la splendeur de Tunis",
        readingTimeMinutes: 6,
        keyThemes: ["Hammouda Pacha", "1782-1814", "Dar El-Bey", "Souveraineté", "Commerce"],
        summary:
          "Pendant 32 ans de règne, Hammouda Pacha Bey incarne le souverain le plus accompli de l'époque moderne : il libère la Tunisie de la tutelle encombrante de la Régence d'Alger, modernise l'artisanat et embellit la capitale.",
        sections: [
          {
            heading: "La souveraineté totale et les victoires militaires",
            paragraphs: [
              "Hammouda Pacha repousse deux invasions de l'armée du Dey d'Alger en 1807 et 1813, fixant définitivement le tracé de la frontière occidentale tunisienne sur l'Oued Mellègue.",
              "Il fait agrandir somptueusement le palais de Dar El-Bey à la Kasbah, fortifie les ports de Bizerte, La Goulette et Sfax, et finance la construction des souks couverts au cœur de la Médina.",
            ],
          },
        ],
        keyTakeaways: [
          "Apogée de la puissance militaire, financière et diplomatique de la Tunisie moderne.",
          "Émancipation définitive face à toute ingérence des puissances régionales voisines.",
        ],
        primarySourcesReferenced: [
          "Registres du Premier Ministère beylical (Dar El-Bey — ANT)",
          "Correspondances diplomatiques entre Hammouda Pacha et Napoléon Bonaparte",
        ],
      },
      {
        id: "ch3-ahd-el-aman-constitution-1861",
        chapterNumber: 3,
        romanNumber: "III",
        title: "Le Pacte Fondamental (1857) & la Constitution de 1861",
        subtitle: "Les grandes réformes libérales, l'école polytechnique du Bardo et le Conseil Suprême",
        readingTimeMinutes: 6,
        keyThemes: ["Ahd El-Aman 1857", "Constitution 1861", "Kheireddine", "Abolition esclavage 1846"],
        summary:
          "Sous Ahmed Bey Ier, Mohammed Bey et Sadok Bey, la Tunisie accomplit une révolution institutionnelle sans précédent en terre d'Islam : abolition de l'esclavage en 1846, déclaration des droits en 1857 et première constitution écrite en 1861.",
        sections: [
          {
            heading: "Le constitutionnalisme tunisien et le réformisme de Kheireddine",
            paragraphs: [
              "Promulguée le 26 avril 1861, la Constitution tunisienne de 114 articles instaure une monarchie constitutionnelle encadrée par un parlement (le Conseil Suprême / Al-Majlis al-Akbar) et proclame l'égalité absolue de tous les Tunisiens sans distinction de religion.",
              "Le général Kheireddine Pacha fonde en 1875 le Collège Sadiki pour former les futures élites bilingues de la Tunisie moderne.",
            ],
          },
        ],
        keyTakeaways: [
          "Première constitution d'un État arabo-musulman, devançant les réformes ottomanes.",
          "Naissance de la pensée réformiste tunisienne portée par Kheireddine et Ibn Abi Diyaf.",
        ],
        primarySourcesReferenced: [
          "Original calligraphié du Pacte Fondamental d'Ahd El-Aman de 1857 (ANT)",
          "Texte officiel de la Constitution de 1861 (Archives Nationales de Tunisie)",
        ],
      },
      {
        id: "ch4-majba-1860-archives-kasbah",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Les Rôles Fiscaux de la Majba (1860) & l'ANT",
        subtitle: "La mine d'or généalogique des 60 caïdats territoriaux de Tunisie",
        readingTimeMinutes: 6,
        keyThemes: ["Majba 1860", "Recensements", "ANT Kasbah", "Caïdats", "Généalogie tunisienne"],
        summary:
          "Pour tout descendant tunisien cherchant à retrouver ses ancêtres au XIXe siècle, les rôles d'imposition de la Majba de 1860 conservés aux Archives Nationales de Tunisie constituent le registre nominatif le plus précieux du pays.",
        sections: [
          {
            heading: "La structure des registres de capitation de 1860",
            paragraphs: [
              "Établis village par village, fraction par fraction et faubourg par faubourg pour l'ensemble des 60 caïdats, ces registres consignent pour chaque chef de famille son prénom, le nom de son père, de son grand-père, son métier et sa confrérie.",
              "La tentative de doubler cette taxe provoqua en 1864 la grande insurrection des tribus menée par Ali Ben Ghedhahem, dont les procès-verbaux d'arbitrage fourmillent d'informations généalogiques.",
            ],
            archivalNote:
              "Archives Nationales de Tunisie (Kasbah) — Série Historique : Registres de la Majba (Fonds Caïdats 1860–1864).",
          },
        ],
        keyTakeaways: [
          "Recensement nominatif quasi exhaustif de la population masculine adulte tunisienne en 1860.",
          "Outil indispensable pour relier un patronyme contemporain à son berceau tribal d'origine.",
        ],
        primarySourcesReferenced: [
          "Registres de la Majba de 1860 pour les caïdats du Nord, Sahel et Sud (ANT)",
          "Actes judiciaires de la commission financière internationale de 1869",
        ],
      },
    ],
  },

  protectorat: {
    eraId: "protectorat",
    eraTitle: "Protectorat Français & Mouvement National",
    historicalPeriod: "1881 – 1956 apr. J.-C.",
    pedagogicalOverview:
      "Ce grand dossier étudie les 75 années charnières du Protectorat : l'occupation militaire de 1881, le Traité du Bardo et les Conventions de La Marsa, la création décisive de l'état civil moderne en 1908 et des 24 contrôles civils, l'essor intellectuel des Jeunes Tunisiens, la fondation du Destour en 1920 et du Néo-Destour en 1934 à Ksar Hellal, et l'épopée héroïque menant à l'indépendance du 20 mars 1956.",
    epigraphQuote: {
      text: "La Tunisie est une patrie vivante avec sa personnalité propre, son histoire millénaire et ses droits imprescriptibles à la souveraineté nationale que nulle convention coloniale ne saurait effacer.",
      author: "Abdelaziz Thâalbi",
      source: "La Tunisie Martyre, Paris, 1920",
    },
    learningObjectives: [
      "Analyser le fonctionnement juridique bicéphale du Protectorat (administration beylicale maintenue et Résidence Générale de France).",
      "Comprendre la création de l'état civil moderne laïc en 1908 et l'organisation des municipalités tunisiennes.",
      "Étudier les étapes du mouvement de libération nationale : Jeunes Tunisiens, Destour, congrès de Ksar Hellal de 1934 et grèves de 1952–1954.",
      "Maîtriser la recherche dans les registres d'état civil communal et les archives diplomatiques du CADN de Nantes et de l'ANT.",
    ],
    chapters: [
      {
        id: "ch1-traite-bardo-controles-civils",
        chapterNumber: 1,
        romanNumber: "I",
        title: "Du Traité du Bardo aux Contrôles Civils (1881–1883)",
        subtitle: "Le traité du 12 mai 1881, les Conventions de La Marsa et le découpage territorial",
        readingTimeMinutes: 5,
        keyThemes: ["1881", "Traité du Bardo", "La Marsa", "Contrôles civils", "Résidence Générale"],
        summary:
          "Le 12 mai 1881 au palais de Ksar Saïd, Sadok Bey est contraint de signer le Traité du Bardo sous la menace des troupes du général Bréart. En 1883, les Conventions de La Marsa instaurent un protectorat direct sur toutes les administrations financières et judiciaires.",
        sections: [
          {
            heading: "L'administration bicéphale de la Régence",
            paragraphs: [
              "Le Bey conserve son trône et signe les décrets souverains (décrets beylicaux), mais le Résident Général de France détient la réalité du pouvoir exécutif et préside le Conseil des ministres.",
              "Le territoire est divisé en 19 Contrôles Civils au Nord et au Centre (Bizerte, Béja, Sousse, Sfax...) et en Territoires Militaires du Sud commandés par les officiers des affaires indigènes à Tataouine et Médenine.",
            ],
          },
        ],
        keyTakeaways: [
          "Maintien formel des structures de l'État beylical sous tutelle coloniale étroite.",
          "Mise en place de l'armature administrative moderne qui préfigure les futurs gouvernorats.",
        ],
        primarySourcesReferenced: [
          "Traité du Bardo (12 mai 1881) et Convention de La Marsa (8 juin 1883)",
          "Journal Officiel Tunisien (JOT) à partir de 1883",
        ],
      },
      {
        id: "ch2-etat-civil-1908-communes",
        chapterNumber: 2,
        romanNumber: "II",
        title: "La Révolution de l'État Civil de 1908 & les Communes",
        subtitle: "La tenue obligatoire des registres de naissances, mariages et décès",
        readingTimeMinutes: 6,
        keyThemes: ["État civil 1908", "Naissances", "Mariages", "Décès", "Communes"],
        summary:
          "Entre 1908 et 1910, des décrets beylicaux créent l'état civil moderne en Tunisie : pour la première fois, chaque citoyen est inscrit dans un registre d'état civil municipal avec son prénom, son nom de famille fixé et sa date de naissance précise.",
        sections: [
          {
            heading: "La formalisation définitive des patronymes familiaux",
            paragraphs: [
              "Avant 1908, les filiations reposaient sur la chaîne orale et notariée ('Untel fils d'Untel'). L'état civil moderne oblige les familles à déclarer un nom patronymique fixe, souvent tiré de la tribu, du village d'origine ou du métier artisanal.",
              "Les mairies et municipalités (Tunis, La Goulette, Bizerte, Sousse, Kairouan, Sfax) conservent depuis cette date les registres en double exemplaire, constituant la colonne vertébrale de toute recherche généalogique du XXe siècle.",
            ],
            archivalNote:
              "Registres d'état civil conservés dans les archives des 350 communes de Tunisie et aux Archives Nationales.",
          },
        ],
        keyTakeaways: [
          "Institutionnalisation de l'état civil républicain moderne en Tunisie.",
          "Fixation légale des noms de famille portés par les Tunisiens jusqu'à aujourd'hui.",
        ],
        primarySourcesReferenced: [
          "Décret beylical du 17 mai 1908 sur l'organisation de l'état civil",
          "Registres originaux d'état civil des municipalités tunisiennes",
        ],
      },
      {
        id: "ch3-mouvement-national-ksar-hellal",
        chapterNumber: 3,
        romanNumber: "III",
        title: "Le Mouvement National & le Congrès de Ksar Hellal (1934)",
        subtitle: "Des Jeunes Tunisiens à Bourguiba : la lutte pour la souveraineté",
        readingTimeMinutes: 6,
        keyThemes: ["Mouvement national", "Ksar Hellal 1934", "Bourguiba", "Destour", "Indépendance"],
        summary:
          "Dès le début du siècle, l'élite lettrée s'organise : Béchir Sfar et Ali Bach Hamba créent le mouvement des Jeunes Tunisiens en 1907. En 1920, Abdelaziz Thâalbi fonde le Destour. Le 2 mars 1934, Habib Bourguiba et ses compagnons fondent le Néo-Destour à Ksar Hellal.",
        sections: [
          {
            heading: "La mobilisation populaire et les martyrs du 9 avril 1938",
            paragraphs: [
              "Le Néo-Destour rompt avec le légalisme de l'ancienne garde et mobilise les paysans, les ouvriers de l'UGTT de Farhat Hached et les étudiants de la Zitouna.",
              "Les manifestations populaires réclamant un parlement tunisien culminent le 9 avril 1938 dans le sang, forgeant la fête des Martyrs et ouvrant la voie à la lutte armée des Fellagas au début des années 1950.",
            ],
          },
        ],
        keyTakeaways: [
          "Structuration politique moderne du combat de libération nationale.",
          "Symbiose héroïque entre syndicalisme (UGTT), parti politique et masses populaires.",
        ],
        primarySourcesReferenced: [
          "Actes du Congrès de Ksar Hellal du 2 mars 1934",
          "Archives du Tribunal Militaire et dossiers d'internement des militants nationalistes",
        ],
      },
      {
        id: "ch4-archives-protectorat-cadn-nantes",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Les Archives du Protectorat (ANT & CADN Nantes)",
        subtitle: "Séries régionales, dossiers de spoliation foncière et répertoires consulaires",
        readingTimeMinutes: 5,
        keyThemes: ["CADN Nantes", "ANT Série F", "Conservation foncière", "Archives 1881-1956"],
        summary:
          "La période du Protectorat a produit une masse documentaire monumentale conservée principalement à l'ANT de Tunis (fonds Premier Ministère) et au Centre des Archives Diplomatiques de Nantes (CADN).",
        sections: [
          {
            heading: "Les deux gisements documentaires indispensables",
            paragraphs: [
              "1. Le CADN à Nantes conserve les archives rapatriées de la Résidence Générale de France à Tunis : rapports de police, dossiers individuels de militants politiques, et rôles de la justice française en Tunisie.",
              "2. L'ANT à Tunis abrite les séries beylicales et régionales (Série E, Série F, Enseignement, Travaux Publics) et le cadastre moderne de la Conservation de la Propriété Foncière (titres fonciers bleus créés en 1885).",
            ],
            archivalNote:
              "Centre des Archives Diplomatiques de Nantes (CADN) — Fonds Tunisie (1881–1956) ; ANT Kasbah.",
          },
        ],
        keyTakeaways: [
          "Documentation minutieuse de l'histoire sociale, économique et politique tunisienne.",
          "Possibilité de retracer le parcours des militants, propriétaires et fonctionnaires.",
        ],
        primarySourcesReferenced: [
          "Inventaire sommaire des archives du Protectorat (CADN Nantes)",
          "Registres de la Conservation Foncière de Tunisie (Titres de propriété foncière)",
        ],
      },
    ],
  },

  republique: {
    eraId: "republique",
    eraTitle: "République Tunisienne Moderne & 24 Gouvernorats",
    historicalPeriod: "1956 – Aujourd'hui",
    pedagogicalOverview:
      "Ce grand dossier étudie la Tunisie contemporaine : la proclamation solennelle de l'indépendance le 20 mars 1956, la promulgation historique du Code du Statut Personnel le 13 août 1956 émancipant la femme tunisienne, l'abolition de la monarchie et proclamation de la République le 25 juillet 1957, l'évacuation militaire de Bizerte en 1963, l'organisation territoriale moderne en 24 gouvernorats et la révolution numérique des Archives Nationales.",
    epigraphQuote: {
      text: "L'Assemblée Nationale Constituante proclame à l'unanimité l'abolition du régime monarchique, la déchéance de la dynastie husseinite et l'instauration d'un régime républicain garantissant la souveraineté du peuple tunisien.",
      author: "Assemblée Nationale Constituante",
      source: "Résolution solennelle du 25 juillet 1957, Palais du Bardo",
    },
    learningObjectives: [
      "Comprendre les étapes de la décolonisation : protocole d'indépendance de 1956 et évacuation définitive de la base navale de Bizerte en 1963.",
      "Analyser le caractère d'avant-garde du Code du Statut Personnel (CSP) du 13 août 1956 abolissant la polygamie et la répudiation unilatérale.",
      "Étudier l'évolution du maillage territorial de la Tunisie moderne : passage des 14 délégations initiales aux 24 gouvernorats contemporains.",
      "Maîtriser les outils de recherche contemporains : registres numérisés de l'état civil républicain et consultation des fonds modernes de l'ANT.",
    ],
    chapters: [
      {
        id: "ch1-independance-republique-1956",
        chapterNumber: 1,
        romanNumber: "I",
        title: "L'Indépendance (1956) & la Proclamation de la République (1957)",
        subtitle: "Le protocole du 20 mars, la fin du règne de Lamine Bey et la présidence de Bourguiba",
        readingTimeMinutes: 5,
        keyThemes: ["20 mars 1956", "25 juillet 1957", "République", "Bourguiba", "Constitution 1959"],
        summary:
          "Le 20 mars 1956, la France reconnaît solennellement l'indépendance totale de la Tunisie. Le 25 juillet 1957, l'Assemblée Constituante dépose le dernier Bey de Tunis, Lamine Bey, et proclame la République.",
        sections: [
          {
            heading: "La construction de l'État national moderne",
            paragraphs: [
              "Élu président de la République, Habib Bourguiba engage la tunisification de tous les cadres de l'administration, de la magistrature, de l'armée et de la police nationale.",
              "Le 1er juin 1959, la première Constitution républicaine est promulguée, consacrant un régime républicain civil et démocratique fondé sur l'État de droit.",
            ],
          },
        ],
        keyTakeaways: [
          "Rétablissement de la souveraineté plénière de la nation tunisienne après 75 ans de protectorat.",
          "Passage d'une monarchie beylicale séculaire à une République moderne unitaire.",
        ],
        primarySourcesReferenced: [
          "Procès-verbal officiel du Protocole d'accord du 20 mars 1956",
          "Délibérations de l'Assemblée Nationale Constituante de 1956–1959",
        ],
      },
      {
        id: "ch2-code-statut-personnel-1956",
        chapterNumber: 2,
        romanNumber: "II",
        title: "Le Code du Statut Personnel (1956) & l'Émancipation Citoyenne",
        subtitle: "L'abolition de la polygamie, le consentement mutuel au mariage et l'égalité civile",
        readingTimeMinutes: 6,
        keyThemes: ["CSP 13 août 1956", "Émancipation des femmes", "Droit familial", "Progrès social"],
        summary:
          "Promulgué le 13 août 1956 avant même la proclamation de la République, le Code du Statut Personnel (CSP) constitue la législation sociale la plus progressiste du monde arabo-musulman, transformant en profondeur la famille tunisienne.",
        sections: [
          {
            heading: "Une révolution juridique sans précédent",
            paragraphs: [
              "Le CSP abolit définitivement la polygamie sous peine de sanctions pénales, interdit le mariage forcé des mineures en exigeant le consentement libre de la femme, et remplace la répudiation par le divorce judiciaire égalitaire.",
              "Pour l'état civil, les actes de mariage et de filiation doivent être obligatoirement enregistrés auprès des officiers municipaux, assurant la traçabilité juridique absolue des ascendances contemporaines.",
            ],
          },
        ],
        keyTakeaways: [
          "Pionnier absolu des droits des femmes dans le monde arabe et islamique.",
          "Consolidation définitive de l'état civil laïc et transparent pour toutes les familles tunisiennes.",
        ],
        primarySourcesReferenced: [
          "Texte officiel du Code du Statut Personnel (Décret beylical du 13 août 1956)",
          "Commentaires juridiques du Cheikh Mohamed Fadhel Ben Achour",
        ],
      },
      {
        id: "ch3-24-gouvernorats-territoire",
        chapterNumber: 3,
        romanNumber: "III",
        title: "L'Aménagement du Territoire & les 24 Gouvernorats",
        subtitle: "Du découpage colonial de 1956 aux 24 gouvernorats modernes et délégations",
        readingTimeMinutes: 5,
        keyThemes: ["24 gouvernorats", "Aménagement territorial", "Délégations", "Décentralisation"],
        summary:
          "Dès l'indépendance, la Tunisie réorganise son territoire pour effacer les disparités coloniales : les anciens caïdats et contrôles civils sont remplacés par des gouvernorats administrés par des gouverneurs civils.",
        sections: [
          {
            heading: "L'évolution du maillage administratif national",
            paragraphs: [
              "Initialement divisé en 14 gouvernorats en 1956, le territoire est progressivement réajusté pour désenclaver les régions de l'intérieur et du Sud (création des gouvernorats de Sidi Bouzid, Siliana, Kasserine, Tataouine, Kebili, Manouba...).",
              "Aujourd'hui, les 24 gouvernorats sont divisés en 264 délégations et plus de 2 000 imadas, garantissant l'accès des citoyens aux services publics d'état civil, de santé et d'éducation.",
            ],
          },
        ],
        keyTakeaways: [
          "Maillage administratif équilibré couvrant tout le territoire national du Nord au Sud.",
          "Structure géographique servant de référence à notre Atlas interactif Roots Tunisia.",
        ],
        primarySourcesReferenced: [
          "Décrets républicains portant création et délimitation des 24 gouvernorats",
          "Cartographie administrative officielle de l'Institut National de la Statistique (INS)",
        ],
      },
      {
        id: "ch4-archives-nationales-ere-numerique",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "L'Ère Numérique & les Archives Nationales de Tunisie (ANT)",
        subtitle: "Conservation du patrimoine mémoriel, digitalisation des registres et généalogie moderne",
        readingTimeMinutes: 5,
        keyThemes: ["ANT moderne", "Numérisation", "Archives nationales", "Généalogie 2.0"],
        summary:
          "Installées dans leur bâtiment moderne du boulevard du 9 avril à Tunis (La Kasbah), les Archives Nationales de Tunisie conservent des millions de documents, parchemins et registres couvrant douze siècles d'histoire.",
        sections: [
          {
            heading: "La sauvegarde et l'accès au patrimoine archivistique",
            paragraphs: [
              "L'ANT pilote d'ambitieux programmes de numérisation des fonds beylicaux, des rôles fiscaux de la Majba et des actes notariés d'Ifriqiya pour les rendre accessibles aux chercheurs et généalogistes du monde entier.",
              "Cette mémoire vivante permet à chaque citoyen et membre de la diaspora de renouer avec les racines profondes de ses aïeux, de l'Antiquité punique à la Tunisie républicaine d'aujourd'hui.",
            ],
            archivalNote:
              "Archives Nationales de Tunisie — 122 Boulevard du 9 Avril 1938, Tunis (Kasbah).",
          },
        ],
        keyTakeaways: [
          "Dépôt central de la mémoire souveraine de la Tunisie.",
          "Partenaire privilégié des démarches de recherche généalogique et historique certifiées.",
        ],
        primarySourcesReferenced: [
          "Inventaire général des Archives Nationales de Tunisie (Édition officielle)",
          "Bases de données numérisées des fonds historiques de l'ANT",
        ],
      },
    ],
  },
};

/**
 * Returns the research dossier for an era, localized across all 6 languages (fr, en, ar, es, it, mt)
 */
export function getEraResearchDossier(
  eraId: string,
  locale: string = "fr",
  eraData?: {
    title?: string;
    displayPeriod?: string;
    capital?: string;
    devletName?: string;
    empire?: string;
    tunisiaEntityName?: string;
    description?: string;
    treatiesAndBorders?: string;
    tunisRole?: string;
    lineagesSummary?: string;
    divisionsTitle?: string;
    customTags?: string[];
  }
): EraResearchDossier {
  const normalized = (eraId || "").toLowerCase();
  const cleanLocale = (locale || "fr").toLowerCase();
  const frDossier = ERA_RESEARCH_DOSSIERS[normalized];

  if (cleanLocale === "fr" && frDossier) {
    return frDossier;
  }

  const title = eraData?.title || frDossier?.eraTitle || eraId.charAt(0).toUpperCase() + eraId.slice(1);
  const period = eraData?.displayPeriod || frDossier?.historicalPeriod || "";
  const capital = eraData?.capital || "Tunis";
  const stateName = eraData?.devletName || eraData?.empire || title;
  const desc = eraData?.description || frDossier?.pedagogicalOverview || "";
  const treaties = eraData?.treatiesAndBorders || desc;
  const tunisText = eraData?.tunisRole || desc;
  const lineagesText = eraData?.lineagesSummary || desc;
  const tags =
    eraData?.customTags && eraData.customTags.length > 0
      ? eraData.customTags
      : [title, capital, stateName];

  if (cleanLocale === "en") {
    return {
      eraId: normalized,
      eraTitle: title,
      historicalPeriod: period,
      pedagogicalOverview: desc,
      epigraphQuote: {
        text: "The history of Tunisia is a stratification of sovereign institutions where each era bequeathed its laws, its cities, and its archival registers.",
        author: "Ibn Khaldun",
        source: "Book of Lessons (Kitāb al-ʻIbar), Tunis",
      },
      learningObjectives: [
        `Master the chronological milestones and founding institutions of ${title} (${period}).`,
        `Analyze the sovereign governance centered in ${capital} under ${stateName}.`,
        "Examine territorial treaties, border demarcations, and administrative provinces.",
        "Identify the primary archival repositories, notarial acts, and genealogical registers of this period.",
      ],
      chapters: [
        {
          id: "ch1-foundations",
          chapterNumber: 1,
          romanNumber: "I",
          title: "Political Genesis & Sovereign Institutions",
          subtitle: `Founding events, state architecture and governance (${period})`,
          readingTimeMinutes: 5,
          keyThemes: tags.slice(0, 4),
          summary: desc,
          sections: [
            {
              heading: `State Organization under ${stateName}`,
              paragraphs: [desc, treaties],
              archivalNote:
                "Primary records preserved at the National Archives of Tunisia (Dar El-Bey, Kasbah) and the National Library of Tunisia.",
            },
          ],
          keyTakeaways: [
            `Sovereign state authority structured around ${capital} (${stateName}).`,
            "Documented diplomatic treaties and territorial demarcations.",
          ],
          primarySourcesReferenced: [
            "National Archives of Tunisia — Historical & State Series",
            "National Library of Tunisia — Department of Manuscripts",
          ],
        },
        {
          id: "ch2-tunis-capital",
          chapterNumber: 2,
          romanNumber: "II",
          title: "Tunis & Central State Institutions",
          subtitle: `Capital administration, courts, fortifications and urban networks`,
          readingTimeMinutes: 5,
          keyThemes: [capital, stateName, "Administration", "Heritage"],
          summary: tunisText,
          sections: [
            {
              heading: "Role of the Capital & Sovereign Administration",
              paragraphs: [tunisText, desc],
            },
          ],
          keyTakeaways: [
            `Centralization of sovereign, judicial, and military institutions in ${capital}.`,
            "Architectural, scholarly, and institutional legacy preserved in Tunisian archives.",
          ],
          primarySourcesReferenced: [
            "Prime Ministry Historical Holdings (Dar El-Bey, Tunis)",
            "Chancery Registers & Sovereign Decrees of Tunisia",
          ],
        },
        {
          id: "ch3-borders-treaties",
          chapterNumber: 3,
          romanNumber: "III",
          title: "Treaties, Borders & Territorial Divisions",
          subtitle: eraData?.divisionsTitle || "Provincial administration and strategic strongholds",
          readingTimeMinutes: 5,
          keyThemes: ["Treaties", "Borders", "Provinces", capital],
          summary: treaties,
          sections: [
            {
              heading: "Territorial Delimitation & Provincial Governance",
              paragraphs: [treaties, tunisText],
            },
          ],
          keyTakeaways: [
            "Structured territorial network connecting coastal metropolises and interior provinces.",
            "Continuity of administrative boundaries and fiscal jurisdictions.",
          ],
          primarySourcesReferenced: [
            "Territorial Cadastral & Provincial Registers (National Archives of Tunisia)",
            "Historical Cartography Collection — National Heritage Institute (INP)",
          ],
        },
        {
          id: "ch4-genealogy-archives",
          chapterNumber: 4,
          romanNumber: "IV",
          title: "Notarial System, Lineages & Archival Sources",
          subtitle: "Methodology for tracing families, tribes and historical documents",
          readingTimeMinutes: 5,
          keyThemes: ["Archives", "Genealogy", "Registers", "Lineages"],
          summary: lineagesText,
          sections: [
            {
              heading: "Genealogical Sources & Documentary Holdings",
              paragraphs: [lineagesText, treaties],
              archivalNote:
                "Consult our official directory of 28 national and international archival repositories on the Sources & Archives page.",
            },
          ],
          keyTakeaways: [
            "Authenticated archival records available for historical and genealogical verification.",
            "Cross-referencing of notarial deeds, fiscal rolls, and family lineages.",
          ],
          primarySourcesReferenced: [
            "General Inventory of the National Archives of Tunisia",
            "Center for Historical and Genealogical Research of Tunis",
          ],
        },
      ],
    };
  }

  if (cleanLocale === "ar") {
    return {
      eraId: normalized,
      eraTitle: title,
      historicalPeriod: period,
      pedagogicalOverview: desc,
      epigraphQuote: {
        text: "إنّ تاريخ تونس تراكمٌ للمؤسسات السيادية التي أورثت كلُّ حقبةٍ منها قوانينها وحواضرها وسجلّاتها الأرشيفية.",
        author: "ابن خلدون",
        source: "كتاب العبر وديوان المبتدأ والخبر، تونس",
      },
      learningObjectives: [
        `إتقان المعالم الكرونولوجية والمؤسسات التأسيسية لحقبة ${title} (${period}).`,
        `تحليل منظومة الحكم والسيادة المتمركزة في ${capital} في ظلّ ${stateName}.`,
        "دراسة المعاهدات الإقليمية وتخطيط الحدود والتقسيمات الإدارية.",
        "التعرّف على الأرصدة الأرشيفية الأولية والعقود العدلية وسجلات الأنساب الخاصة بهذه الفترة.",
      ],
      chapters: [
        {
          id: "ch1-foundations",
          chapterNumber: 1,
          romanNumber: "I",
          title: "النشأة السياسية والمؤسسات السيادية",
          subtitle: `الأحداث التأسيسية وبنية الدولة والحكم (${period})`,
          readingTimeMinutes: 5,
          keyThemes: tags.slice(0, 4),
          summary: desc,
          sections: [
            {
              heading: `تنظيم الدولة في عهد ${stateName}`,
              paragraphs: [desc, treaties],
              archivalNote:
                "وثائق أصلية محفوظة بالأرشيف الوطني التونسي (دار الباي، القصبة) ودار الكتب الوطنية التونسية.",
            },
          ],
          keyTakeaways: [
            `سلطة دولة ذات سيادة متمركزة حول ${capital} (${stateName}).`,
            "معاهدات دبلوماسية وتخوم ترابية موثّقة.",
          ],
          primarySourcesReferenced: [
            "الأرشيف الوطني التونسي — السلاسل التاريخية والسيادية",
            "دار الكتب الوطنية التونسية — قسم المخطوطات",
          ],
        },
        {
          id: "ch2-tunis-capital",
          chapterNumber: 2,
          romanNumber: "II",
          title: "تونس العاصمة ومؤسسات الدولة المركزية",
          subtitle: "الإدارة المركزية والمحاكم والتحصينات والشبكة الحضرية",
          readingTimeMinutes: 5,
          keyThemes: [capital, stateName, "الإدارة", "التراث"],
          summary: tunisText,
          sections: [
            {
              heading: "دور العاصمة والإدارة السيادية",
              paragraphs: [tunisText, desc],
            },
          ],
          keyTakeaways: [
            `تمركز المؤسسات السيادية والقضائية والعسكرية في ${capital}.`,
            "إرث معماري وعلمي ومؤسساتي محفوظ في الأرشيفات التونسية.",
          ],
          primarySourcesReferenced: [
            "الرصيد التاريخي للوزارة الأولى (دار الباي، القصبة)",
            "سجلات الديوان والأوامر العليّة والدواوين التونسية",
          ],
        },
        {
          id: "ch3-borders-treaties",
          chapterNumber: 3,
          romanNumber: "III",
          title: "المعاهدات والحدود والتقسيمات الترابية",
          subtitle: eraData?.divisionsTitle || "الإدارة الإقليمية والحواضر الاستراتيجية",
          readingTimeMinutes: 5,
          keyThemes: ["المعاهدات", "الحدود", "الأقاليم", capital],
          summary: treaties,
          sections: [
            {
              heading: "تحديد التخوم والحوكمة الإقليمية",
              paragraphs: [treaties, tunisText],
            },
          ],
          keyTakeaways: [
            "شبكة ترابية منظّمة تربط الحواضر الساحلية بالأقاليم الداخلية.",
            "استمرارية الدوائر الإدارية والاختصاصات الجبائية.",
          ],
          primarySourcesReferenced: [
            "دفاتر الأوطان والقيادات الترابية (الأرشيف الوطني التونسي)",
            "مجموعة الخرائط التاريخية — المعهد الوطني للتراث",
          ],
        },
        {
          id: "ch4-genealogy-archives",
          chapterNumber: 4,
          romanNumber: "IV",
          title: "النظام التوثيقي والأنساب والمصادر الأرشيفية",
          subtitle: "منهجية تتبّع العائلات والقبائل والوثائق التاريخية",
          readingTimeMinutes: 5,
          keyThemes: ["الأرشيف", "الأنساب", "الدفاتر", "السلالات"],
          summary: lineagesText,
          sections: [
            {
              heading: "المصادر الجينيالوجية والأرصدة الوثائقية",
              paragraphs: [lineagesText, treaties],
              archivalNote:
                "تصفّحوا أيضاً دليلنا الرسمي الذي يضمّ 28 مركز أرشيف وطنياً ودولياً في صفحة المصادر والأرشيف.",
            },
          ],
          keyTakeaways: [
            "توفّر وثائق أرشيفية موثّقة للبحث التاريخي والجينيالوجي.",
            "مقاطعة الحجج العدلية والدفاتر الجبائية وشجرات الأنساب العائلية.",
          ],
          primarySourcesReferenced: [
            "الجرد العام للأرشيف الوطني التونسي",
            "مركز الدراسات والبحوث التاريخية والجينيالوجية بتونس",
          ],
        },
      ],
    };
  }

  if (cleanLocale === "es") {
    return {
      eraId: normalized,
      eraTitle: title,
      historicalPeriod: period,
      pedagogicalOverview: desc,
      epigraphQuote: {
        text: "La historia de Túnez es una sedimentación de instituciones soberanas donde cada era legó sus leyes, sus ciudades y sus registros de archivo.",
        author: "Ibn Jaldún",
        source: "Libro de los Ejemplos (Kitāb al-ʻIbar), Túnez",
      },
      learningObjectives: [
        `Dominar los hitos cronológicos y las instituciones fundadoras de ${title} (${period}).`,
        `Analizar la gobernanza soberana centrada en ${capital} bajo ${stateName}.`,
        "Estudiar los tratados territoriales, la delimitación de fronteras y las provincias administrativas.",
        "Identificar los fondos de archivo primarios, actas notariales y registros genealógicos de este período.",
      ],
      chapters: [
        {
          id: "ch1-foundations",
          chapterNumber: 1,
          romanNumber: "I",
          title: "Génesis Política e Instituciones Soberanas",
          subtitle: `Acontecimientos fundadores, arquitectura estatal y gobernanza (${period})`,
          readingTimeMinutes: 5,
          keyThemes: tags.slice(0, 4),
          summary: desc,
          sections: [
            {
              heading: `Organización del Estado bajo ${stateName}`,
              paragraphs: [desc, treaties],
              archivalNote:
                "Fondos primarios conservados en los Archivos Nacionales de Túnez (Dar El-Bey, Kasbah) y la Biblioteca Nacional de Túnez.",
            },
          ],
          keyTakeaways: [
            `Autoridad estatal soberana estructurada en torno a ${capital} (${stateName}).`,
            "Tratados diplomáticos y delimitaciones territoriales documentadas.",
          ],
          primarySourcesReferenced: [
            "Archivos Nacionales de Túnez — Series Históricas y de Estado",
            "Biblioteca Nacional de Túnez — Departamento de Manuscritos",
          ],
        },
        {
          id: "ch2-tunis-capital",
          chapterNumber: 2,
          romanNumber: "II",
          title: "Túnez y las Instituciones Centrales del Estado",
          subtitle: "Administración de la capital, tribunales, fortificaciones y red urbana",
          readingTimeMinutes: 5,
          keyThemes: [capital, stateName, "Administración", "Patrimonio"],
          summary: tunisText,
          sections: [
            {
              heading: "Papel de la Capital y Administración Soberana",
              paragraphs: [tunisText, desc],
            },
          ],
          keyTakeaways: [
            `Centralización de las instituciones soberanas, judiciales y militares en ${capital}.`,
            "Legado arquitectónico, académico e institucional conservado en los archivos tunecinos.",
          ],
          primarySourcesReferenced: [
            "Fondo Histórico del Primer Ministerio (Dar El-Bey, Túnez)",
            "Registros de Cancillería y Decretos Soberanos de Túnez",
          ],
        },
        {
          id: "ch3-borders-treaties",
          chapterNumber: 3,
          romanNumber: "III",
          title: "Tratados, Fronteras y Divisiones Territoriales",
          subtitle: eraData?.divisionsTitle || "Administración provincial y plazas fuertes estratégicas",
          readingTimeMinutes: 5,
          keyThemes: ["Tratados", "Fronteras", "Provincias", capital],
          summary: treaties,
          sections: [
            {
              heading: "Delimitación Territorial y Gobernanza Provincial",
              paragraphs: [treaties, tunisText],
            },
          ],
          keyTakeaways: [
            "Red territorial estructurada que conecta las metrópolis costeras con las provincias del interior.",
            "Continuidad de las circunscripciones administrativas y jurisdicciones fiscales.",
          ],
          primarySourcesReferenced: [
            "Registros Catastrales y Provinciales (Archivos Nacionales de Túnez)",
            "Colección de Cartografía Histórica — Instituto Nacional del Patrimonio (INP)",
          ],
        },
        {
          id: "ch4-genealogy-archives",
          chapterNumber: 4,
          romanNumber: "IV",
          title: "Sistema Notarial, Linajes y Fuentes de Archivo",
          subtitle: "Metodología para rastrear familias, tribus y documentos históricos",
          readingTimeMinutes: 5,
          keyThemes: ["Archivos", "Genealogía", "Registros", "Linajes"],
          summary: lineagesText,
          sections: [
            {
              heading: "Fuentes Genealógicas y Fondos Documentales",
              paragraphs: [lineagesText, treaties],
              archivalNote:
                "Consulte también nuestro directorio oficial de 28 depósitos de archivos nacionales e internacionales en la página Fuentes y Archivos.",
            },
          ],
          keyTakeaways: [
            "Documentos de archivo autenticados disponibles para la verificación histórica y genealógica.",
            "Cruce de escrituras notariales, padrones fiscales y linajes familiares.",
          ],
          primarySourcesReferenced: [
            "Inventario General de los Archivos Nacionales de Túnez",
            "Centro de Estudios e Investigaciones Históricas de Túnez",
          ],
        },
      ],
    };
  }

  if (cleanLocale === "it") {
    return {
      eraId: normalized,
      eraTitle: title,
      historicalPeriod: period,
      pedagogicalOverview: desc,
      epigraphQuote: {
        text: "La storia della Tunisia è una sedimentazione di istituzioni sovrane in cui ogni epoca ha lasciato in eredità le proprie leggi, le proprie città e i propri registri d'archivio.",
        author: "Ibn Khaldun",
        source: "Il Libro degli Esempi (Kitāb al-ʻIbar), Tunisi",
      },
      learningObjectives: [
        `Padroneggiare le tappe cronologiche e le istituzioni fondatrici di ${title} (${period}).`,
        `Analizzare il governo sovrano incentrato su ${capital} sotto ${stateName}.`,
        "Esaminare i trattati territoriali, la delimitazione dei confini e le province amministrative.",
        "Identificare i fondi archivistici primari, gli atti notarili e i registri genealogici di questo periodo.",
      ],
      chapters: [
        {
          id: "ch1-foundations",
          chapterNumber: 1,
          romanNumber: "I",
          title: "Genesi Politica e Istituzioni Sovrane",
          subtitle: `Eventi fondatori, architettura statale e governo (${period})`,
          readingTimeMinutes: 5,
          keyThemes: tags.slice(0, 4),
          summary: desc,
          sections: [
            {
              heading: `Organizzazione dello Stato sotto ${stateName}`,
              paragraphs: [desc, treaties],
              archivalNote:
                "Fonti primarie conservate presso gli Archivi Nazionali della Tunisia (Dar El-Bey, Kasbah) e la Biblioteca Nazionale della Tunisia.",
            },
          ],
          keyTakeaways: [
            `Autorità statale sovrana strutturata attorno a ${capital} (${stateName}).`,
            "Trattati diplomatici e delimitazioni territoriali documentate.",
          ],
          primarySourcesReferenced: [
            "Archivi Nazionali della Tunisia — Serie Storiche e di Stato",
            "Biblioteca Nazionale della Tunisia — Dipartimento dei Manoscritti",
          ],
        },
        {
          id: "ch2-tunis-capital",
          chapterNumber: 2,
          romanNumber: "II",
          title: "Tunisi e le Istituzioni Centrali dello Stato",
          subtitle: "Amministrazione della capitale, tribunali, fortificazioni e rete urbana",
          readingTimeMinutes: 5,
          keyThemes: [capital, stateName, "Amministrazione", "Patrimonio"],
          summary: tunisText,
          sections: [
            {
              heading: "Ruolo della Capitale e Amministrazione Sovrana",
              paragraphs: [tunisText, desc],
            },
          ],
          keyTakeaways: [
            `Centralizzazione delle istituzioni sovrane, giudiziarie e militari a ${capital}.`,
            "Eredità architettonica, scientifica e istituzionale conservata negli archivi tunisini.",
          ],
          primarySourcesReferenced: [
            "Fondo Storico del Primo Ministero (Dar El-Bey, Tunisi)",
            "Registri di Cancelleria e Decreti Sovrani della Tunisia",
          ],
        },
        {
          id: "ch3-borders-treaties",
          chapterNumber: 3,
          romanNumber: "III",
          title: "Trattati, Confini e Divisioni Territoriali",
          subtitle: eraData?.divisionsTitle || "Amministrazione provinciale e piazzeforti strategiche",
          readingTimeMinutes: 5,
          keyThemes: ["Trattati", "Confini", "Province", capital],
          summary: treaties,
          sections: [
            {
              heading: "Delimitazione Territoriale e Governo Provinciale",
              paragraphs: [treaties, tunisText],
            },
          ],
          keyTakeaways: [
            "Rete territoriale strutturata che collega le metropoli costiere alle province interne.",
            "Continuità delle circoscrizioni amministrative e delle giurisdizioni fiscali.",
          ],
          primarySourcesReferenced: [
            "Registri Catastali e Provinciali (Archivi Nazionali della Tunisia)",
            "Collezione di Cartografia Storica — Istituto Nazionale del Patrimonio (INP)",
          ],
        },
        {
          id: "ch4-genealogy-archives",
          chapterNumber: 4,
          romanNumber: "IV",
          title: "Sistema Notarile, Lignaggi e Fonti d'Archivio",
          subtitle: "Metodologia per rintracciare famiglie, tribù e documenti storici",
          readingTimeMinutes: 5,
          keyThemes: ["Archivi", "Genealogia", "Registri", "Lignaggi"],
          summary: lineagesText,
          sections: [
            {
              heading: "Fonti Genealogiche e Fondi Documentari",
              paragraphs: [lineagesText, treaties],
              archivalNote:
                "Consulta anche il nostro repertorio ufficiale di 28 depositi archivistici nazionali e internazionali nella pagina Fonti e Archivi.",
            },
          ],
          keyTakeaways: [
            "Documenti d'archivio autenticati disponibili per la verifica storica e genealogica.",
            "Incrocio di atti notarili, ruoli fiscali e alberi genealogici familiari.",
          ],
          primarySourcesReferenced: [
            "Inventario Generale degli Archivi Nazionali della Tunisia",
            "Centro di Studi e Ricerche Storiche di Tunisi",
          ],
        },
      ],
    };
  }

  if (cleanLocale === "mt") {
    return {
      eraId: normalized,
      eraTitle: title,
      historicalPeriod: period,
      pedagogicalOverview: desc,
      epigraphQuote: {
        text: "L-istorja tat-Tuneżija hija sedimentazzjoni ta' istituzzjonijiet sovrani fejn kull epoka ħalliet il-liġijiet, il-bliet u r-reġistri tal-arkivji tagħha.",
        author: "Ibn Khaldun",
        source: "Il-Ktieb tal-Eżempji (Kitāb al-ʻIbar), Tuneż",
      },
      learningObjectives: [
        `ifhem il-mumenti kronoloġiċi u l-istituzzjonijiet fundaturi ta' ${title} (${period}).`,
        `Analizza t-tmexxija sovrana ċċentrata f'${capital} taħt ${stateName}.`,
        "Studja t-trattati territorjali, id-delimitazzjoni tal-fruntieri u l-provinċji amministrattivi.",
        "Identifika l-fondi ewlenin tal-arkivji, l-atti nutarili u r-reġistri ġenealoġiċi ta' dan il-perjodu.",
      ],
      chapters: [
        {
          id: "ch1-foundations",
          chapterNumber: 1,
          romanNumber: "I",
          title: "Ġenesi Politika u Istituzzjonijiet Sovrani",
          subtitle: `Avvenimenti fundaturi, arkitettura tal-Istat u governanza (${period})`,
          readingTimeMinutes: 5,
          keyThemes: tags.slice(0, 4),
          summary: desc,
          sections: [
            {
              heading: `Organizzazzjoni tal-Istat taħt ${stateName}`,
              paragraphs: [desc, treaties],
              archivalNote:
                "Fondi primarji miżmuma fl-Arkivji Nazzjonali tat-Tuneżija (Dar El-Bey, Kasbah) u l-Bibljoteka Nazzjonali tat-Tuneżija.",
            },
          ],
          keyTakeaways: [
            `Awtorità statali sovrana strutturata madwar ${capital} (${stateName}).`,
            "Trattati diplomatiċi u delimitazzjonijiet territorjali dokumentati.",
          ],
          primarySourcesReferenced: [
            "Arkivji Nazzjonali tat-Tuneżija — Serje Storiċi u tal-Istat",
            "Bibljoteka Nazzjonali tat-Tuneżija — Dipartiment tal-Manoskritti",
          ],
        },
        {
          id: "ch2-tunis-capital",
          chapterNumber: 2,
          romanNumber: "II",
          title: "Tuneż u l-Istituzzjonijiet Ċentrali tal-Istat",
          subtitle: "Amministrazzjoni tal-kapitali, qrati, fortifikazzjonijiet u netwerk urban",
          readingTimeMinutes: 5,
          keyThemes: [capital, stateName, "Amministrazzjoni", "Wirt"],
          summary: tunisText,
          sections: [
            {
              heading: "Ir-Rwol tal-Kapitali u l-Amministrazzjoni Sovrana",
              paragraphs: [tunisText, desc],
            },
          ],
          keyTakeaways: [
            `Ċentralizzazzjoni tal-istituzzjonijiet sovrani, ġudizzjarji u militari f'${capital}.`,
            "Wirt arkitettoniku, akkademiku u istituzzjonali miżmum fl-arkivji Tuneżini.",
          ],
          primarySourcesReferenced: [
            "Fond Storiku tal-Prim Ministeru (Dar El-Bey, Tuneż)",
            "Reġistri tal-Kanċellerija u Digrieti Sovrani tat-Tuneżija",
          ],
        },
        {
          id: "ch3-borders-treaties",
          chapterNumber: 3,
          romanNumber: "III",
          title: "Trattati, Fruntieri u Diviżjonijiet Territorjali",
          subtitle: eraData?.divisionsTitle || "Amministrazzjoni provinċjali u bliet strateġiċi",
          readingTimeMinutes: 5,
          keyThemes: ["Trattati", "Fruntieri", "Provinċji", capital],
          summary: treaties,
          sections: [
            {
              heading: "Delimitazzjoni Territorjali u Governanza Provinċjali",
              paragraphs: [treaties, tunisText],
            },
          ],
          keyTakeaways: [
            "Netwerk territorjali strutturat li jgħaqqad il-bliet kostali mal-provinċji ta' ġewwa.",
            "Kontinwità tad-distretti amministrattivi u l-ġurisdizzjonijiet fiskali.",
          ],
          primarySourcesReferenced: [
            "Reġistri Katastali u Provinċjali (Arkivji Nazzjonali tat-Tuneżija)",
            "Kollezzjoni tal-Kartografija Storika — Istitut Nazzjonali tal-Wirt (INP)",
          ],
        },
        {
          id: "ch4-genealogy-archives",
          chapterNumber: 4,
          romanNumber: "IV",
          title: "Sistema Nutarili, Linji tal-Familja u Sorsi tal-Arkivji",
          subtitle: "Metodoloġija għat-traċċar ta' familji, tribujiet u dokumenti storiċi",
          readingTimeMinutes: 5,
          keyThemes: ["Arkivji", "Ġenealoġija", "Reġistri", "Familji"],
          summary: lineagesText,
          sections: [
            {
              heading: "Sorsi Ġenealoġiċi u Fondi Dokumentarji",
              paragraphs: [lineagesText, treaties],
              archivalNote:
                "Ikkonsulta wkoll id-direttorju uffiċjali tagħna ta' 28 depożitu tal-arkivji nazzjonali u internazzjonali fil-paġna Sorsi u Arkivji.",
            },
          ],
          keyTakeaways: [
            "Dokumenti tal-arkivji awtentikati disponibbli għall-verifika storika u ġenealoġika.",
            "Tqabbil ta' atti nutarili, reġistri fiskali u siġar tal-familja.",
          ],
          primarySourcesReferenced: [
            "Inventarju Ġenerali tal-Arkivji Nazzjonali tat-Tuneżija",
            "Ċentru ta' Studji u Riċerka Storika ta' Tuneż",
          ],
        },
      ],
    };
  }

  if (frDossier) {
    return frDossier;
  }

  // Fallback enriched generator for any other variant
  const eraTitle = eraId.charAt(0).toUpperCase() + eraId.slice(1);
  return {
    eraId: normalized,
    eraTitle: `Période Historique : ${eraTitle}`,
    historicalPeriod: "Grand Dossier d'Étude & Monographie Académique",
    pedagogicalOverview:
      `Ce grand dossier de recherche approfondi explore les structures politiques, territoriales, démographiques et généalogiques de la période ${eraTitle}. Découvrez les chapitres d'analyse historique rédigés à partir des fonds des Archives Nationales de Tunisie.`,
    epigraphQuote: {
      text: "L'histoire de la Tunisie est une sédimentation d'institutions souveraines où chaque ère a légué ses lois, ses villes et ses registres d'archives.",
      author: "Ibn Khaldoun",
      source: "Le Livre des Exemples (Kitāb al-ʻIbar), Tunis",
    },
    learningObjectives: [
      `Maîtriser les repères chronologiques et événements fondateurs sous la période ${eraTitle}.`,
      "Analyser le découpage administratif et les chefs-lieux d'autorité territoriale.",
      "Étudier les mouvements de peuplement, les dynasties régnantes et les confédérations tribales.",
      "Consulter les fonds d'archives primaires et méthodologies généalogiques spécifiques à cette époque.",
    ],
    chapters: [
      {
        id: "ch1-fondations",
        chapterNumber: 1,
        romanNumber: "I",
        title: "Genèse Politique & Avènement Historique",
        subtitle: "Événements déclencheurs, traités de fondation et prise du pouvoir",
        readingTimeMinutes: 5,
        keyThemes: ["Fondation", "Pouvoir", "Souveraineté", "Chronologie"],
        summary: `Comment cette période s'est imposée en Tunisie, succédant à l'ère précédente par une restructuration complète des institutions et des frontières.`,
        sections: [
          {
            heading: "Le tournant politique fondateur",
            paragraphs: [
              `L'avènement de cette époque marque un basculement décisif dans l'organisation étatique tunisienne. Les nouvelles élites réorganisent l'administration fiscale et militaire depuis la capitale.`,
              `Les traités diplomatiques bilatéraux consolident les frontières terrestres face aux puissances voisines et réaffirment la souveraineté sur les façades maritimes septentrionale et orientale.`,
            ],
            archivalNote: "Documents consultables aux Archives Nationales de Tunisie (Kasbah) et au Centre d'Études Historiques.",
          },
        ],
        keyTakeaways: [
          "Établissement d'une autorité centrale souveraine reconnue internationalement.",
          "Stabilisation des circonscriptions territoriales intérieures.",
        ],
        primarySourcesReferenced: [
          "Archives Nationales de Tunisie (Séries Historiques)",
          "Bibliothèque Nationale de Tunisie (Département des Manuscrits)",
        ],
      },
      {
        id: "ch2-tunis-institutions",
        chapterNumber: 2,
        romanNumber: "II",
        title: "Le Rôle et le Rayonnement de Tunis",
        subtitle: "Monuments d'État, garnisons, tribunaux et urbanisme",
        readingTimeMinutes: 5,
        keyThemes: ["Tunis", "Kasbah", "Institutions", "Urbanisme"],
        summary: `L'affirmation de Tunis comme centre névralgique de décision, abritant les palais ministériels, les tribunaux suprêmes et les corporations marchandes.`,
        sections: [
          {
            heading: "La place de la capitale dans l'armature de l'État",
            paragraphs: [
              `Tunis concentre les rouages de la souveraineté : chancelleries, arsenaux, sièges de gouvernement et grands édifices religieux et universitaires.`,
              `C'est depuis la Kasbah et ses palais que sont promulgués les décrets et que sont tenus les registres officiels garantissant l'ordre notarié.`,
            ],
          },
        ],
        keyTakeaways: [
          "Centralisation des fonctions régaliennes à Tunis.",
          "Développement urbain, défensif et patrimonial remarquable.",
        ],
        primarySourcesReferenced: [
          "Archives du Premier Ministère (Dar El-Bey, Kasbah)",
          "Recueils des Habous et Fondations de la Zitouna",
        ],
      },
      {
        id: "ch3-demographie-peuplement",
        chapterNumber: 3,
        romanNumber: "III",
        title: "Démographie, Tribus & Société",
        subtitle: "Alliances territoriales, familles patriciennes et fractions déclarées",
        readingTimeMinutes: 5,
        keyThemes: ["Société", "Tribus", "Familles notables", "Peuplement"],
        summary: `Étude des composantes humaines du pays : aristocratie urbaine, chefferies de l'intérieur, confédérations pastorales et communautés maritimes.`,
        sections: [
          {
            heading: "L'équilibre entre sédentaires et pasteurs",
            paragraphs: [
              `Le pouvoir central maintient un réseau d'alliances avec les caïds et cheikhs des grandes tribus pour assurer la perception de l'impôt et la sécurité des routes caravanières.`,
              `Les grandes familles notables fournissent les magistrats, les cadis, les trésoriers et les hauts diplomates de l'administration.`,
            ],
          },
        ],
        keyTakeaways: [
          "Réseau complexe d'alliances makhzen et d'allégeances tribales.",
          "Rôle prépondérant des dynasties patriciennes dans la stabilité administrative.",
        ],
        primarySourcesReferenced: [
          "Rôles des caïdats territoriaux (Archives Nationales de Tunisie)",
          "Actes de concession et décrets de nomination beylicaux",
        ],
      },
      {
        id: "ch4-archives-registres",
        chapterNumber: 4,
        romanNumber: "IV",
        title: "Système Notarié & Registres d'Archives",
        subtitle: "Méthodologie pour retrouver des actes et retracer une lignée",
        readingTimeMinutes: 5,
        keyThemes: ["Archives", "Sijillats", "État civil", "Généalogie"],
        summary: `Guide pratique pour l'historien et le généalogiste souhaitant identifier des documents certifiés rattachés à cette époque.`,
        sections: [
          {
            heading: "Les fonds documentaires exploitables",
            paragraphs: [
              `Pour cette période, les chercheurs disposent de séries notariales, de registres fiscaux, de décrets souverains et d'actes judiciaires conservés dans les dépôts d'archives publics.`,
              `L'analyse rigoureuse des mentions de filiation (noms du père, du grand-père et de la tribu d'origine) permet de reconstituer des arbres généalogiques fiables.`,
            ],
            archivalNote: "Consultez également notre répertoire des 19 dépôts d'archives nationaux et internationaux sur la page Sources & Archives.",
          },
        ],
        keyTakeaways: [
          "Existence de documents certifiés consultables aux Archives Nationales de Tunisie.",
          "Importance de croiser actes notariés, rôles fiscaux et traditions orales familiales.",
        ],
        primarySourcesReferenced: [
          "Inventaire général des Archives Nationales de Tunisie",
          "Publications du Centre d'Études et de Recherches Historiques",
        ],
      },
    ],
  };
}
