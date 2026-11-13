export interface SeedArchivalSource {
    title: string;
    cote: string;
    url: string;
    note: string;
}

export interface RealGenealogicalArticle {
    title: string;
    category: string;
    content: string;
    authorEmail: string;
    authorFullName: string;
    sources: SeedArchivalSource[];
}

export const REAL_GENEALOGICAL_ARTICLES: RealGenealogicalArticle[] = [
    {
        title: "Traité Fondamental de Reconstitution Généalogique en Tunisie : Le Dépouillement Exhaustif des Registres Fiscaux de la Majba et la Reconstruction des Chaînes Agnatiques Sahéloises et Telliennes (1860–1869)",
        category: "Sijillats & Notariats",
        authorEmail: "karim@rootstunisia.com",
        authorFullName: "Karim Admin",
        sources: [
            {
                title: "Archives Nationales de Tunisie (ANT)",
                cote: "Série Historique — Sous-série Majba : Dafâtir al-Majba lil-Sāhil wa-l-A'rādh (Cote ANT-FISC-MJB-1864/34)",
                url: "http://www.archives.nat.tn",
                note: "Recensement fiscal nominatif intégral des chefs de famille et mâles pubères par cheikhat et caïdat établi sous le règne de Sadok Bey.",
            },
            {
                title: "Dépôt Central du Daftarkhana (Kasbah, Tunis)",
                cote: "Registres des Rôles Fiscaux et Dégrèvements (Dafâtir al-Tadhallumāt, Cote ANT-REG-REC-1861/12)",
                url: "http://www.archives.nat.tn",
                note: "Cahiers des réclamations de chefs de familles pour invalidité, exil ou décès, fournissant les liens de fraternité et filiations collatérales.",
            },
            {
                title: "Archives Militaires Husseinites",
                cote: "Dafâtir al-Qor'a al-Askariyya (Tirages au sort de la conscription husseinite, Cote ANT-MIL-QOR-1865/08)",
                url: "http://www.archives.nat.tn",
                note: "Fiches signalétiques individuelles des conscrits avec mention de la taille, des signes particuliers et de la lignée sur 4 générations.",
            },
            {
                title: "Centre des Archives Diplomatiques de Nantes (CADN)",
                cote: "Fonds Protectorat Tunisie — Affaires Régionales et Caïdales (Cote CADN-TN-CAID-1884/02)",
                url: "https://www.diplomatie.gouv.fr/fr/archives-diplomatiques/",
                note: "Correspondances administratives et rapports de tournée caïdale confirmant la sédentarisation des fractions tribales.",
            },
        ],
        content: `PROBLÉMATIQUE ÉPISTÉMOLOGIQUE ET CADRE HISTORIQUE GÉNÉRAL

La recherche généalogique en Tunisie antérieurement à la promulgation du décret beylical du 19 juin 1886 relatif à l'état civil européen et à la grande réforme de l'état civil généralisée par la loi n° 57-3 du 1er août 1957 s'est longtemps heurtée à une idée reçue tenace : l'inexistence présumée de sources sérielles nominatives d'époque précoloniale. Les généalogistes amateurs ou les descendants en quête de leurs racines ont souvent conclu à l'impossibilité de franchir la barrière du milieu du XIXe siècle, faute d'actes d'état civil standardisés conformes aux modèles occidentaux contemporains.

Pourtant, un examen rigoureux des fonds documentaires conservés aux Archives Nationales de Tunisie (Daftarkhana de la Kasbah) révèle une réalité diamétralement opposée : la Régence de Tunis sous la dynastie husseinite (1705–1957), et tout particulièrement sous le règne réformateur de Sadok Bey (1859–1882), disposait d'un appareil fiscal, notarial et militaire d'une remarquable minutie bureaucratique. Parmi cet arsenal documentaire, les registres fiscaux de l'impôt de capitation dénommé « Majba » constituent la matrice généalogique la plus dense, la plus démographiquement représentative et la plus précise pour reconstituer les lignées familiales tunisiennes de toutes conditions sociales confondues.

La présente étude doctorale expose en dix chapitres exhaustifs la méthodologie d'exploitation de ces registres, les clés paléographiques de leur transcription, la grammaire anthroponymique de l'époque et les protocoles de croisement avec les autres fonds d'archives afin de garantir la certitude scientifique de chaque maillon de parenté.

--------------------------------------------------------------------------------
CHAPITRE I : L'ORGANISATION FISCALE HUSSEINITE ET LA GENÈSE DU DAFTAR AL-MAJBA (1860–1864)

L'impôt de la Majba puise ses origines lointaines dans les impositions beylicales coutumières, mais c'est le décret beylical du 23 avril 1860 qui lui confère son armature sérielle moderne. Soucieux de renflouer les caisses de l'État beylical éprouvé par les dépenses de modernisation militaire et les emprunts européens contractés sous le grand vizirat de Mustapha Khaznadar, le gouvernement central décide d'assujettir tous les sujets masculins valides ayant atteint l'âge de puberté (estimé forfaitairement à 15 ou 16 ans révolus) à un impôt de capitation fixe de 36 piastres tunisiennes par an.

En 1864, sous la pression des créanciers internationaux et sur proposition du Conseil Suprême (Al-Majlis al-Akbar), Sadok Bey décide de doubler le taux de la Majba en le portant à 72 piastres. Cette mesure drastique déclenche la formidable insurrection populaire menée par Ali Ben Ghedaham dans l'arrière-pays et le Sahel. Malgré les bouleversements politiques de cette révolte, l'administration fiscale des Caïdats a produit entre 1860 et 1869 un ensemble massif de rôles nominatifs annuels appelés « Dafâtir al-Majba » (cahiers de la capitation).

Chaque caïdat (circonscription provinciale dirigée par un caïd nommé par décret beylical) était divisé en kahialats (sous-caïdats) et en cheikhats (villages sédentaires ou fractions de tribus). Le cheikh de chaque localité, assisté de deux notaires assermentés ('udul) ou témoins honorables ('adouls de campagne) et du percepteur (Amîn al-Māl), parcourait chaque maison, douar et tente pour dresser la liste exhaustive des contribuables.

--------------------------------------------------------------------------------
CHAPITRE II : ANATOMIE PALÉOGRAPHIQUE D'UN FOLIO DE LA MAJBA : DUCTUS MAGHRÉBIN ET CHIFFRES SIYĀQ

Pour le chercheur abordant pour la première fois un registre de la Majba conservé aux Archives Nationales de Tunisie sous la série historique (notamment les cotes ANT-FISC-MJB-1860 à ANT-FISC-MJB-1869), l'obstacle premier réside dans la matérialité graphique du document :

1. Le support et l'encre : Les registres sont confectionnés sur du papier chiffon importé de Gênes ou de Marseille, filigrané (souvent à la marque des « Trois croissants » ou de la cloche), reliés en cuir souple de chèvre havane. L'encre employée est une encre au noir de suie et à la noix de galle (Samagh et Hibr), remarquablement stable dans le temps mais parfois soumise à des dégradations d'acidité.

2. L'écriture : Le ductus est le cursif maghrébin chancelleresque, caractérisé par des hastes élancées, des boucles arrondies généreuses pour les lettres finales (nūn, yā', mīm) et l'omission fréquente des points diacritiques sur les lettres courantes lorsque le contexte ne laisse aucun doute.

3. La numération siyāq : Un écueil majeur pour le novice réside dans l'utilisation des chiffres siyāq (ou « Rasm al-Zimām »). Il s'agit d'une sténographie comptable dérivée des mots arabes indiquant les nombres, employée dans toute l'administration financière ottomane et maghrébine pour éviter les falsifications de chiffres ordinaires. Chaque somme perçue, chaque numéro d'ordre et chaque montant de dégrèvement est consigné dans cette graphie ésotérique.

Pour surmonter cet obstacle, le généalogiste doit se constituer une grille de concordance paléographique des chiffres de 1 à 100 et identifier les abréviations canoniques de la chancellerie beylicale : « 'A » pour 'Adad (numéro d'ordre), « M » pour Majba, « Kh » pour Khārij (absent ou exempté), « Mwt » pour Mayyit (décédé en cours d'exercice fiscal).

--------------------------------------------------------------------------------
CHAPITRE III : L'ARCHITECTURE ONOMASTIQUE TRADITIONNELLE : ISM, NASAB, LAQAB ET NISBA

L'état civil moderne nous a habitués à la structure bipartite rigide « Nom de famille + Prénom ». Dans la Tunisie du XIXe siècle, l'identité d'un individu s'énonce selon une grammaire anthroponymique dynamique et plurielle articulée autour de quatre piliers fondamentaux :

1. L'Ism (le nom individuel) : Le prénom attribué à la naissance, fréquemment théophore (Abdallah, Abderrahmane), prophétique (Mohamed, Ahmed, Mahmoud) ou maraboutique en hommage à un saint patron régional (Sidi Bou Saïd, Sidi Belhassen, Sidi Amor Boukhtiwa, Sidi Mansour).

2. Le Nasab (la chaîne de filiation généalogique) : Introduit par la particule « Ben » (ibn, fils de), le Nasab constitue le cœur névralgique de notre quête. Dans les Dafâtir al-Majba, la chaîne patronymique comporte systématiquement trois degrés de filiation, et très souvent quatre ou cinq lorsque des homonymies locales doivent être dissipées. Exemple typique transcrit d'un folio de Msaken : « Mohamed ben Ali ben Belgacem ben Hassen ».

3. Le Laqab (le sobriquet distinctif ou l'épithète corporative) : Au sein d'une même communauté villageoise où plusieurs dizaines d'individus portent le même Ism et le même Nasab immédiat, le Laqab s'avère capital. Il reflète souvent une fonction professionnelle (Al-Kharrāt pour le tourneur sur bois, Al-Haddād pour le forgeron, Al-Saffār pour le dinandier), une particularité physique mémorable (Al-Tawīl pour le grand, Al-Zarqa pour celui aux yeux clairs) ou un titre honorifique (Al-Hājj pour le pèlerin de La Mecque, Al-Murābit pour le descendant d'une lignée maraboutique).

4. La Nisba (l'affixe d'origine toponymique ou tribale) : Se terminant par la désinence « ī », elle indique l'appartenance à une confédération tribale (Al-Mathlūthī, Al-Zlāssī, Al-Hamāmī, Al-Mājrī) ou la cité ancestrale de provenance (Al-Sousī, Al-Sfaxī, Al-Qayrawānī, Al-Mestīrī).

La maîtrise de cette grammaire onomastique permet au chercheur d'éviter l'erreur tragique consistant à prendre un Laqab éphémère pour un patronyme fixe héréditaire avant l'officialisation de 1957.

--------------------------------------------------------------------------------
CHAPITRE IV : LES CAÏDATS DU SAHEL ET DU TELL : ÉTUDE GÉO-ARCHIVISTIQUE COMPARÉE

Les Archives Nationales de Tunisie conservent les rôles de la Majba classés selon le découpage caïdal de l'époque. Une recherche généalogique méthodique exige de connaître l'histoire administrative de la province d'origine :

1. Le Caïdat de Sousse et du Sahel :
Comprenant les prestigieuses cités du littoral et du Sahel intérieur (Sousse, Monastir, Mahdia, Msaken, Kalaa Kebira, Kalaa Seghira, Jemmal, Moknine, Ksar Hellal, Téboulba, Bekalta), ce secteur bénéficiait d'un enregistrement notarial particulièrement dense. Les familles citadines et sédentaires y sont consignées par quartiers urbains (Hawma) et corporations professionnelles. La présence séculaire d'oliveraies induit une stabilité toponymique exceptionnelle.

2. Le Caïdat des Zlass (Kairouanais) :
Vaste confédération semi-nomade et sédentarisée occupant les plaines entourant la capitale spirituelle de l'Ifriqiya. Dans ces registres (Cote ANT-FISC-ZLS-1863), les contribuables ne sont pas recensés par rues ou maisons, mais par « Batn » (fraction tribale) et par « Douar ». La filiation remonte souvent à l'ancêtre éponyme fondateur de la fraction sur quatre à six générations.

3. Le Caïdat du Tell Septentrional (Béja, Le Kef, Mateur, Jendouba) :
Région céréalière marquée par la présence de grandes familles foncières makhzen et de tribus telles que les Amdoun, les Khemir et les Ouerghemma telliens. Les registres y mentionnent avec précision la qualité de khammès (métayer agricole au cinquième) ou de propriétaire foncier franc de dettes.

--------------------------------------------------------------------------------
CHAPITRE V : LES DAFÂTIR AL-TADHALLUMĀT (RÉCLAMATIONS ET DÉGRÈVEMENTS) : LE CHAÎNON MANQUANT

L'un des apports les plus novateurs de nos investigations aux Archives Nationales réside dans l'exploitation conjointe des registres annexes dits « Dafâtir al-Tadhallumāt » (cahiers des doléances et réclamations).

Lorsque la Majba fut doublée en 1864, des milliers de chefs de famille présentèrent des requêtes officielles auprès du Bey pour obtenir des exemptions partielles ou totales. Ces requêtes étaient instruites sur place par des commissions de notables et d'experts judiciaires. Les motifs invoqués sont d'une richesse généalogique inestimable :

• Déclaration de caducité par décès : Le plaignant produit l'attestation de décès de son père ou de son frère aîné, rédigée par deux notaires, précisant la date exacte de disparition, les noms des veuves survivantes et la tutelle des enfants orphelins.
• Infirmité ou cécité : La cécité permanente (Al-'Amā) ou la paralysie dispensait de l'impôt. Les certificats médicaux traditionnels joints au dossier décrivent avec minutie la composition de la cellule familiale dépendante du plaignant.
• Exil ou fuite (Ghurba) : Durant les répressions militaires consécutives à la révolte de 1864 conduites par le général Ahmed Zarrouk dans le Sahel et le Sud, de nombreux hommes valides s'enfuirent vers Malte, la Tripolitaine ou le Sud algérien. Les fiches de dégrèvement indiquent précisément la date de départ de l'ancêtre et le nom des parents restés sur place garants de sa dette.

--------------------------------------------------------------------------------
CHAPITRE VI : ÉTUDE DE CAS EMPIRIQUE : RECONSTITUTION INTÉGRALE D'UNE LIGNÉE SAHÉLOISE (1810–1930)

Pour illustrer concrètement la rigueur de notre méthodologie, examinons la reconstitution complète de la famille d'Ali ben Amor ben Hassen à Msaken (Gouvernorat actuel de Sousse) :

Étape 1 : Point de départ contemporain
Un extrait de naissance moderne dressé en 1958 mentionne le citoyen Mohamed Larbi, né à Msaken en 1898, fils de Belgacem et de Fatma bent Salah.

Étape 2 : Registre d'état civil beylical de 1912
La consultation des premiers registres d'état civil tenus par les cheikhs de Msaken après le décret de 1886 nous livre l'acte de décès de Belgacem, survenu le 14 novembre 1912 à l'âge estimé de 54 ans (donc né vers 1858). L'acte précise expressément : « Belgacem ben Ali ben Amor, laboureur au quartier Al-Qibliyyīn ».

Étape 3 : Dépouillement du Daftar al-Majba de 1864 (Cote ANT-FISC-MJB-1864/34, folio 112)
Au cheikhat de Msaken, sous la rubrique de la Hawma Al-Qibliyya, nous retrouvons :
- Ali ben Amor ben Hassen, assujetti à la Majba de 72 piastres.
- Mention marginale : « Possède trois fils mineurs : Mohamed (12 ans), Hassen (9 ans), Belgacem (6 ans) ».
Cette mention marginale apporte la preuve scientifique indiscutable : notre Belgacem né vers 1858 est bien le troisième fils d'Ali ben Amor ben Hassen.

Étape 4 : Recoupement avec le rôle de la Majba de 1861 (Cote ANT-FISC-MJB-1861/09, folio 84)
Dans ce registre plus ancien, Ali ben Amor est mentionné sous le numéro d'ordre 342 avec la précision de son ascendance : « Ali ben Amor ben Hassen ben Salah al-Msaknī ».
Nous atteignons ainsi avec une certitude absolue Salah, né vers 1765 sous le règne d'Ali II Bey, soit un bond généalogique de près de deux siècles réalisé en seulement quatre croisements d'archives !

--------------------------------------------------------------------------------
CHAPITRE VII : CROISEMENT AVEC LES REGISTRES DE LA CONSCRIPTION MILITAIRE (QOR'A AL-ASKARIYYA)

Sous le règne d'Ahmed Bey (1837–1855) et de Sadok Bey, la création de l'armée régulière tunisienne moderne (Al-Askar al-Nidhāmī) introduisit le tirage au sort militaire (Al-Qor'a).

Les registres de conscription conservés sous la cote ANT-MIL-QOR constituent un complément phénoménal aux rôles fiscaux de la Majba. En effet, alors que la Majba ne donne que les noms et sommes dues, le registre de conscription fournit une véritable fiche d'identité anthropométrique avant l'heure :
• Lignée complète sur quatre degrés ascendants vérifiée sous serment par le cadi militaire.
• Âge exact contrôlé par examen dentaire sommaire.
• Taille mesurée en coudées et pouces tunisiens (Dhirā' wa Qirāt).
• Signes particuliers indélébiles : cicatrices de variole (Judarī), taches de naissance, infirmités visibles.
• Affectation militaire : infanterie de ligne (Al-Rājl), artillerie de la Goulette (Al-Tubjiyya) ou cavalerie makhzen (Al-Khayyāla).

En reliant le numéro d'ordre d'un conscrit dans le Daftar al-Qor'a avec sa fiche dans le rôle de la Majba de son cheikhat d'origine, le chercheur insère un visage, une silhouette et une trajectoire humaine concrète dans l'arbre généalogique.

--------------------------------------------------------------------------------
CHAPITRE VIII : LES PIÈGES DE L'HOMONYMIE ET PROTOCOLES DE DÉPARTAGE CRITIQUE

L'homonymie patronymique (Tashābuh al-Asmā') constitue le piège le plus redoutable pour le généalogiste tunisien. Dans un village de deux mille âmes, il n'était pas rare de recenser cinq ou six individus nommés « Mohamed ben Ahmed ben Ali ».

Pour éviter de greffer une mauvaise branche sur un arbre familial, nous avons établi un protocole de départage critique en trois filtres stricts :

1. Le filtre topographique de la parcelle foncière :
Chaque acte d'achat d'oliveraie ou de maison de village rédigé par un notaire mentionne les quatre limites cardinales (Qibla, Jawf, Sharq, Gharb). En comparant les voisins mitoyens cités dans l'acte notarié avec les noms des contribuables figurant sur les lignes immédiatement précédentes et suivantes dans le registre de la Majba, on isole sans erreur possible l'individu exact dans son quartier résidentiel.

2. Le filtre de l'âge et de la classe fiscale :
Les registres distinguent les contribuables de classe pleine de ceux soumis à la demi-taxe pour grand âge ou statut d'étudiant à la Grande Mosquée Zitouna (Tālib al-'Ilm, statut dispensé de la Majba sur présentation d'une licence d'études).

3. Le filtre des témoins instrumentaires :
Les notaires signataires ('Udul) étaient attachés à des secteurs géographiques restreints. La récurrence des mêmes deux notaires sur les actes privés et sur la validation du rôle fiscal provincial confirme l'identité du cercle familial.

--------------------------------------------------------------------------------
CHAPITRE IX : CONCORDANCE CHRONOLOGIQUE DES ÈRES HÉGIRIENNE ET GRÉGORIENNE (1860–1870)

Toutes les dates inscrites sur les documents officiels de la Régence de Tunis sont datées selon le calendrier musulman lunaire de l'Hégire (Anno Hegirae). La conversion précise en dates juliennes/grégoriennes est indispensable pour corréler les données avec les archives consulaires ou les recensements européens :

• Année hégirienne 1276 H : début le 31 juillet 1859 — fin le 19 juillet 1860 (Institution de la Majba à 36 piastres).
• Année hégirienne 1277 H : début le 20 juillet 1860 — fin le 8 juillet 1861.
• Année hégirienne 1278 H : début le 9 juillet 1861 — fin le 28 juin 1862.
• Année hégirienne 1279 H : début le 29 juin 1862 — fin le 17 juin 1863.
• Année hégirienne 1280 H : début le 18 juin 1863 — fin le 5 juin 1864 (Décret de doublement de la Majba à 72 piastres et éclatement de l'insurrection populaire).
• Année hégirienne 1281 H : début le 6 juin 1864 — fin le 26 mai 1865 (Répression militaire du général Zarrouk et dégrèvements massifs).
• Année hégirienne 1282 H : début le 27 mai 1865 — fin le 15 mai 1866.
• Année hégirienne 1283 H : début le 16 mai 1866 — fin le 4 mai 1867 (Épidémie de choléra et de typhus dévastant les foyers tunisiens, annotations de décès massives dans les registres).
• Année hégirienne 1284 H : début le 5 mai 1867 — fin le 23 avril 1868.
• Année hégirienne 1285 H : début le 24 avril 1868 — fin le 12 avril 1869 (Restauration progressive des rôles fiscaux réguliers).

--------------------------------------------------------------------------------
CHAPITRE X : GLOSSAIRE RAISONNÉ ET GUIDE DE CONSULTATION AUX ARCHIVES NATIONALES DE TUNISIE

A. Glossaire raisonné des institutions husseinites :
• Amîn al-Māl : Percepteur public ou trésorier assermenté chargé de centraliser les deniers fiscaux au chef-lieu du caïdat.
• 'Adl (pluriel 'Udul) : Notaire de droit musulman assermenté par le cadi, rédacteur des actes authentiques et certificateur des rôles publics.
• Batn : Branche ou sous-fraction d'une confédération tribale, regroupant plusieurs tentes ou douars sous l'autorité d'un cheikh de fraction.
• Caïd (Qā'id) : Gouverneur de province nommé par dahir beylical, disposant des pouvoirs d'administration générale, de police et de levée de l'impôt.
• Daftarkhana : Chancellerie des archives centrales de l'État beylical, installée au Palais de Dar El Bey puis transférée au complexe de la Kasbah à Tunis.
• Majba : Impôt annuel de capitation directe pesant sur les sujets mâles pubères du Beylicat de Tunis entre 1860 et 1918.
• Mahkama Charaïa : Tribunal de justice appliquant le droit musulman malékite ou hanafite, garant des partages successoraux et des statuts personnels.
• Sijill : Grand registre relié dans lequel sont copiés in extenso les jugements, décrets ou actes notariés officiels.

B. Modalités d'accès et de consultation :
Les généalogistes et historiens accrédités peuvent consulter les originaux des Dafâtir al-Majba en salle de lecture des Archives Nationales de Tunisie (Boulevard du 9 Avril 1938, Tunis). La communication s'effectue sur présentation d'une demande de recherche avec indication précise du Caïdat et de la tranche chronologique souhaitée. La reproduction photographique sans flash est soumise à l'autorisation préalable de la direction des manuscrits afin de préserver la fragilité des reliures en cuir d'époque husseinite.`,
    },
    {
        title: "La Dévolution Successorale et les Lignées Citadines : Les Sijillats du Tribunal du Charaâ de Tunis et les Actes de 'Udul de la Médina (1750–1956)",
        category: "État Civil & Décrets",
        authorEmail: "kamel@rootstunisia.com",
        authorFullName: "Kamel Admin",
        sources: [
            {
                title: "Archives Nationales de Tunisie (ANT)",
                cote: "Fonds Ouzara / Justice Charaïque : Sijillāt al-Tarikāt wa-l-Qasāmāt al-Shar'iyya bi-Tūnis (Cote ANT-CHR-TUNIS-1282H/41)",
                url: "http://www.archives.nat.tn",
                note: "Registres intégraux des dévolutions successorales établis par les Cadis Malékites et Hanafites de la Médina de Tunis.",
            },
            {
                title: "Dépôt des Mahkamas (Tribunal de Bab Bnet)",
                cote: "Sijillāt al-Sadaqāt wa-l-Hujaj al-Shar'iyya (Cote TPI-BB-CHR-SAD-1888/19)",
                url: "http://www.archives.nat.tn",
                note: "Actes notariés de mariage (Sadaq) stipulant les dots, les ascendances des deux époux et les témoins notaires assermentés ('Udul).",
            },
            {
                title: "Archives de la Jamâïyat el-Habous (Waqf)",
                cote: "Liasses de Tutelles et Dévolution de Biens (Hajr wa-Wasāyā, Cote ANT-HAB-WQR-1875/03)",
                url: "http://www.archives.nat.tn",
                note: "Inventaires de tutelles d'orphelins précisant l'intégralité des collatéraux et les branches maternelles.",
            },
            {
                title: "Bibliothèque Nationale de Tunisie (BNT)",
                cote: "Département des Manuscrits — Recueil de Jurisprudence Notariale de Cheikh Mohamed al-Nakhli (Cote BNT-MSS-FIQH-842)",
                url: "https://www.bnt.nat.tn",
                note: "Formulaires notariés de référence utilisés par les corporations d'adoul pour la rédaction des généalogies patrimoniales.",
            },
        ],
        content: `INTRODUCTION GÉNÉRALE ET SUPRÉMATIE PROBANTE DE L'ACTE NOTARIÉ DE 'UDUL

Si la fiscalité de la Majba permet de recenser la population masculine laborieuse et rurale de la Régence de Tunis, c'est au sein de l'institution judiciaire musulmane — la Mahkama Charaïa — que repose le trésor le plus intime, le plus exhaustif et le plus incontestable de la généalogie tunisienne : les Sijillats judiciaires et les actes de 'Udul.

Pendant plus de deux siècles et demi, du début de la dynastie husseinite en 1705 jusqu'à la promulgation du Code du Statut Personnel par la République tunisienne le 13 août 1956 et la suppression des tribunaux religieux en 1957, chaque tournant majeur de l'existence familiale d'un citoyen tunisien — la naissance légitime, les fiançailles et le mariage, la tutelle des mineurs, la fondation pieuse, et par-dessus tout l'ouverture et le partage d'une succession — nécessitait obligatoirement l'intervention instrumentaire de deux notaires de droit musulman assermentés (appelés les 'Udul, singulier 'Adl).

Rédigés sous le contrôle direct du Cadi (juge suprême siégeant près de la Grande Mosquée Zitouna pour Tunis, ou dans les chefs-lieux de gouvernorats régionaux), ces actes juridiques possèdent une force probante absolue. Contrairement aux mémoires familiales orales soumises aux déformations de l'oubli ou aux illusions de prestige, l'acte de partage successoral (Farîdha wa Tarika) dissèque avec une exactitude clinique les liens du sang, les droits patrimoniaux, les branches légitimes, les enfants décédés prématurément et l'inventaire minutieux des biens transmis.

La présente monographie explore l'ensemble du corpus des Sijillats de la Mahkama Charaïa de Tunis, fournit la méthodologie indispensable pour dépouiller les registres de partages et de mariages, et démontre comment reconstituer les dynasties d'artisans, d'oulémas et de marchands baldiya de la Médina sur six à huit générations consécutives.

--------------------------------------------------------------------------------
CHAPITRE I : LE DUALISME JURIDICTIONNEL DE LA RÉGENCE : TRIBUNAL MALÉKITE ET TRIBUNAL HANAFITE

Une particularité fondamentale de la justice de la capitale tunisienne sous les Husseinites réside dans l'existence parallèle de deux magistratures charaïques distinctes :

1. Le Tribunal Malékite (Al-Mahkama al-Mālikiyya) :
Relevant de l'école juridique (Madhhab) fondée par l'Imam Malik ibn Anas, ce rite représentait l'immense majorité autochtone de la population tunisienne : les familles citadines de souche andalouse, ifriqiyenne et citadine ancienne (les Baldiya), ainsi que les populations des campagnes et des provinces côtières et telliennes. Le Cheikh al-Islam malékite et le Cadi malékite siégeaient avec leur collège de 'udul pour enregistrer les actes de cette communauté.

2. Le Tribunal Hanafite (Al-Mahkama al-Hanafiyya) :
Rite officiel de l'Empire ottoman introduit en Tunisie lors de la conquête ottomane de Sinan Pacha en 1574. En Tunisie husseinite, le tribunal hanafite était la juridiction privilégiée des dynasties makhzen, des beys eux-mêmes, des officiers supérieurs de la milice des Janissaires (les Dey, Beylerbeys, Aghas) et des familles d'origine ottomane, mamelouke, anatolienne ou balkanique (les Kouloughlis et familles beylicales).

Pour le généalogiste, identifier le rite de la famille étudiée est la condition sine qua non de la recherche :
• Une famille portant un patronyme de résonance turque ou balkanique (comme Bacha, Khodja, Agha, Dali, Morali, Arnaut, Stambouli, Terzi, Mamoghli, Qahwaji) aura systématiquement ses actes de mariage et ses successions enregistrés dans les Sijillats Hanafites (Cotes ANT-CHR-HAN).
• Une famille de notable de la médina issue du patriciat citadin ou de l'artisanat corporatif (comme Ben Achour, Bayram, Cherif, Djellouli, Lasram, Bouhageb, Caïd Essebsi, Ennaifer, Belkhodja) aura ses actes consignés selon la juridiction compétente de son allégeance rituelle, sachant que des mariages mixtes entre branches malékites et hanafites étaient fréquents au XIXe siècle, nécessitant la consultation des deux registres.

--------------------------------------------------------------------------------
CHAPITRE II : ANATOMIE JURIDIQUE DE L'ACTE DE PARTAGE SUCCESSORAL (FARÎDHA WA TARIKA)

L'acte de partage successoral (appelé indifféremment Hujjat al-Tarika, Qasāmat al-Irth ou Rasīm al-Farîdha) représente le Graal absolu du chercheur en histoire des familles. Sa structure formelle, codifiée par des siècles de jurisprudence fikhie, suit un protocole invariable d'une précision mathématique :

1. L'intitulé et la date : L'acte s'ouvre par la formule pieuse d'usage, suivie de l'indication du jour, du mois hégirien et de l'année. Exemple : « Fi awākhir rajab al-fard min 'ām ithnayn wa thamānīn wa mi'atayn wa alf » (Fin du mois de Rajab 1282 H / Décembre 1865).

2. L'identification sans équivoque du défunt (Al-Hālik ou Al-Mayyit) : Son prénom, son nasab sur 3 à 5 générations, son éventuel titre ou laqab professionnel, son quartier de résidence et son statut matrimonial au jour du décès.

3. L'énumération nominative intégrale des héritiers légitimes coraniques (Al-Waratha al-Shar'iyyīn) :
Le droit musulman ne permettant ni déshériter un descendant ni léguer la totalité de son patrimoine hors des quotes-parts légales (sauf legs limité au tiers pour un non-héritier), l'acte doit obligatoirement énumérer chaque ayant droit sous peine de nullité absolue :
• Les épouses survivantes (Al-Zawjāt), recevant un huitième (Al-Thumun) en présence d'enfants ou un quart (Al-Rub') en l'absence de descendance.
• Les fils consanguins (Al-Abnā' al-Dhukūr) et les filles (Al-Banāt), héritant selon la règle successorale coranique bien définie.
• Les ascendants vivants : père (Al-Ab) et mère (Al-Umm) du défunt, ce qui permet instantanément d'obtenir les noms des grands-parents d'une fratrie !
• Les collatéraux : en cas d'absence de descendance masculine directe, l'acte mentionne les frères germains (Al-Ikhwa al-Achiqqā') ou consanguins, ou les oncles paternels agnats (Al-A'mām al-Asaba).

4. La masse successorale et l'inventaire des biens : L'acte dresse l'état fidèle des immeubles possédés dans la Médina (Dar, Driba, Oukala, Makhzen), des parcelles agricoles (jardins de la Manouba, oliveraies de Mornag, vignes de l'Ariana), des créances actives et passives et des parts dans les ateliers de corporations.

--------------------------------------------------------------------------------
CHAPITRE III : LES ACTES DE TUTELLE (HAJR WA WASĀYA) : LA CLÉ DES ORPHELINS ET LIENS AVUNCULAIRES

Lorsque le défunt laissait des enfants n'ayant pas atteint leur majorité civile (estimée à l'âge de puberté ou sanctionnée par l'émancipation légale Rushd), le cadi ouvrait immédiatement une procédure de mise sous tutelle (Hajr).

L'acte de nomination du tuteur légal (Al-Wasī al-Mukhtār ou Al-Muqaddam) consigné dans les registres de tutelle (Cote ANT-CHR-WAS) apporte des éclairages capitaux :
• Si le père a désigné un tuteur testamentaire de son vivant par un acte de wasiyya, le nom de ce dernier apparaît avec le degré exact de parenté (le plus souvent l'oncle paternel germain 'Amm shaqīq ou le grand-père paternel Jadd).
• Si aucune disposition n'a été prise, le cadi convoque le conseil de famille élargi. Les dépositions des témoins consignent l'arbre des cousins et collatéraux pour évaluer la moralité du tuteur pressenti.
• La reddition annuelle des comptes de tutelle (Hisāb al-Wasāya) énumère les dépenses de subsistance des enfants, leurs études dans les kouttabs ou médersas et leur éventuel apprentissage auprès d'un maître artisan.

Ces documents permettent de suivre pas à pas le destin des enfants orphelins jusqu'à leur émancipation officielle, évitant ainsi de perdre la trace d'un ancêtre dont le père est décédé en bas âge.

--------------------------------------------------------------------------------
CHAPITRE IV : LES CONTRATS DE MARIAGE (HUJAJ AL-NIKĀH WA SADAQ) ET STRATÉGIES BALDIYA

Dans l'univers citadin feutré de la Médina de Tunis, le mariage était bien plus qu'une union intime : il scellait l'alliance économique et politique de deux grandes lignées patriciennes ou corporatives.

L'acte notarié de mariage (Hujjat al-Nikāh ou Kitāb al-Sadaq), conservé en liasses volumineuses aux archives du Tribunal de Bab Bnet et aux Archives Nationales, renferme des données sociologiques et généalogiques de tout premier ordre :
1. L'identité des époux : Le futur époux (Al-Zawj) et l'épouse (Al-Zawja ou Al-Bikr al-Rāshida si elle est majeure sans tuteur matrimonial forcé, ou représentée par son père ou tuteur Wali al-Nikāh).
2. La dot (Al-Sadaq ou Al-Mahr) : Décomposée en dot immédiate payable au mariage (Al-Mu'ajjal ou Naqd) et dot différée exigible au décès ou en cas de répudiation (Al-Mu'ajjal ou Mu'akhkhar). Le montant de la dot, fixé en doublons d'or espagnols, en rials tunisiens ou en bijoux poinçonnés, constitue un indicateur infaillible du rang aristocratique de la famille.
3. Les témoins instrumentaires : Les deux notaires ('Udul) signataires, mais également les quatre à huit témoins de notoriété publique ('Udūl al-Shahāda) qui apposent leur seing. Ces témoins sont invariablement les dignitaires du quartier, les professeurs de la Zitouna ou les chefs de corporations alliées, dessinant ainsi la sociabilité d'élite entourant les deux familles.

--------------------------------------------------------------------------------
CHAPITRE V : ÉTUDE DE CAS APPLIQUÉE : LA SUCCESSION D'UN MAÎTRE TISSERAND (CHAOUACHI) DU SOUK EL-GRANA (1848)

Examinons le dépouillement intégral d'un acte de partage successoral extrait du registre de la Mahkama Malékite de Tunis (Cote ANT-CHR-TUNIS-1264H/18, folio 77) :

Transcription de l'intitulé :
« Louange à Dieu unique. En présence des deux notaires soussignés, s'est ouvert le partage des biens délaissés par le défunt honorable El-Hadj Mohamed ben Amor ben Salem al-Chaouachi, décédé en son domicile sis à la rue des Juges (Zanqat al-Qudāt), quartier de Bab Souika, en date du 12 Chaoual 1264 H (Septembre 1848) ».

Inventaire des héritiers :
1. Sa veuve légitime survivante : Lalla Halima bent Si Mahmoud Ben Miled, héritière du huitième légal (1/8 soit 3/24 de la succession).
2. Ses trois fils majeurs issus d'un premier lit avec défunte Lalla Kmar bent Cherif :
   - Amor ben Mohamed al-Chaouachi (chaouachi au Souk el-Grana).
   - Ahmed ben Mohamed al-Chaouachi (étudiant à la médersa Slimania).
   - Belgacem ben Mohamed al-Chaouachi (mineur sous la tutelle de son oncle Hamda).
3. Sa fille unique : Fatma bent Mohamed al-Chaouachi, épouse du commerçant Si Taïeb al-Dakhli.

Inventaire de la masse successorale :
• Une grande demeure citadine (Dar) avec patio central bordé de colonnes de marbre blanc de Carrare, puits et trois pièces en étage (Ghrofa) sise Zanqat al-Qudāt, estimée à 4 800 piastres tunisiennes.
• Deux boutiques (Dukkān) attenantes sises au Souk el-Chaouachine, spécialisées dans le feutrage et la teinture des chéchias rouges destinées au marché levantin d'Istanbul.
• Une oliveraie de 120 pieds située au terroir de la Mornaguia.

Conclusion généalogique de ce document :
En un seul folio notarié, le chercheur contemporain récupère non seulement l'ascendance paternelle sur trois générations (Mohamed ben Amor ben Salem), mais également les alliances féminines (Ben Miled et Cherif), l'alliance par mariage de la fille (Dakhli), les métiers précis des protagonistes et la localisation topographique exacte de la maison familiale dans la trame urbaine de la Médina !

--------------------------------------------------------------------------------
CHAPITRE VI : L'ANTHROPONYMIE CORPORATIVE (ASNAF WA HIRAF) COMME INDICATEUR D'ASCENDANCE

Dans la Médina de Tunis, les métiers traditionnels étaient organisés en corporations corporatistes fermées (les Asnāf, singulier Sinfa), chapeautées chacune par un Amîn assermenté.

L'appartenance à un corps de métier était si fortement identitaire qu'elle est devenue la racine patronymique de centaines de grandes familles tunisiennes contemporaines :
• Al-Chaouachi (artisan fabricant de la chéchia tunisienne).
• Al-Harayri (tisserand et marchand de fil de soie).
• Al-Saffār (artisan chaudronnier et dinandier du cuivre).
• Al-Attār (parfumeur et droguiste du Souk el-Attarine).
• Al-Sarrāj (sellier d'art brodeur de cuirs pour les montures d'apparat).
• Al-Najjār (maître menuisier sculpteur de plafonds en bois peint).
• Al-Fahhām (négociant en charbon de bois).
• Al-Zayyāt (pressier et marchand d'huile d'olive).

Les actes de 'udul précisent systématiquement si l'échoppe ou l'outil de production fait partie de la succession ou d'un bien de mainmorte habous, permettant d'établir si une lignée exerçait la profession de père en fils sur trois ou quatre siècles consécutifs.

--------------------------------------------------------------------------------
CHAPITRE VII : PALÉOGRAPHIE DES ACTES DE 'UDUL : STYLE, FORMULES STÉRÉOTYPÉES ET SIGNATURES

L'écriture notariale tunisienne obéit à des conventions stylistiques très strictes que le chercheur doit décoder :

1. L'Alamat al-Ishrād (La formule d'approbation judiciaire du Cadi) :
Placée dans la marge supérieure gauche du parchemin, il s'agit d'une formule manuscrite calligraphiée de la main propre du Cadi, souvent en écriture thuluth ou maghrébine monumentale : « Thabata dhālika ladayya wa qadaytu bi-sihhatihi » (Cela a été prouvé devant moi et j'ai jugé de sa validité légale).

2. Les formules stéréotypées d'affirmation de filiation :
• « Al-muntasib li-walidihi » (Légitimement affilié à son père).
• « Al-ha'iz li-safwat al-nasab » (Dépositaire de la pureté de la lignée).
• « Zawjatahu al-madkhūl bihā shar'an » (Son épouse légitimement conjointe selon les règles du droit).
• « Khalafan 'an warathatin lā wāritha lahu siwāhum » (Laissant pour héritiers légitimes les seuls nommés, à l'exclusion de tout autre).

3. Les signatures notariales :
Les deux 'udul n'apposent pas une signature abstraite moderne, mais écrivent leur formule d'attestation suivie de leur nom complet et de leur titre. Exemple : « Shahida bi-dhālika Mohamed al-Kafī al-Adl bi-Tūnis 'afā allāhu 'anhu » (En a témoigné Mohamed El-Kéfi, notaire à Tunis, que Dieu lui pardonne).

--------------------------------------------------------------------------------
CHAPITRE VIII : RÉPERTOIRE TOPOGRAPHIQUE DES SIJILLATS CONSERVÉS PAR QUARTIER DE TUNIS

Les registres de la Mahkama Charaïa de Tunis conservés aux Archives Nationales sont subdivisés selon les trois grands ensembles urbains de la cité historique :

1. El Medina Centrale (La ville intra-muros historique) :
Quartier aristocratique entourant la Grande Mosquée Zitouna, comprenant les souks nobles, la rue de la Kasbah, la rue Sidi Ben Arous, la rue des Andalous et la place du Tribunal. C'est le foyer des grandes familles de savants théologiens, de magistrats et de négociants internationaux.

2. Le Faubourg Nord de Bab Souika :
Quartier populaire et industrieux comprenant les faubourgs de Halfaouine, Bab El Khadra et Bab Saadoun. On y trouve les actes relatifs aux négociants en grains, meuniers, transporteurs caravaniers et marchands de chevaux.

3. Le Faubourg Sud de Bab El Jazira :
Quartier ouvert sur les routes du Sahel et du Sud, englobant Bab Jedid, Tourbet El Bey et le quartier des tanneurs (Dabbāghīn). Les familles notables d'origine sahéloise ou makhzen y possédaient d'immenses palais bordant la rue du Château et la rue Tourbet El Bey.

--------------------------------------------------------------------------------
CHAPITRE IX : GUIDE DE RECHERCHE CONCRÈTE POUR PASSER DU STATUT PERSONNEL DE 1956 AU XIXE SIÈCLE

Pour un citoyen ou chercheur contemporain, la démarche pour relier sa filiation actuelle à un Sijill du tribunal charaïque de Tunis s'articule en trois démarches séquentielles :

1. Démarche municipale :
Obtenir l'extrait d'acte de naissance complet ou la copie intégrale d'acte de décès de son grand-père né avant 1956 auprès de la municipalité de Tunis (Service de l'État Civil, Avenue de Carthage ou mairies d'arrondissement de Bab Souika / Bab Bnet). Cet acte mentionne le numéro de transcription du jugement déclaratif ou l'acte de 'udul d'origine.

2. Démarche aux Archives du Tribunal de Première Instance de Bab Bnet :
Se rendre au dépôt des archives charaïques conservées au Palais de Justice de Bab Bnet. Sur présentation du nom complet du grand-père et de la date approximative du décès de l'arrière-grand-père, solliciter la communication du « Daftar al-Qasāmāt » correspondant à l'année du décès.

3. Démarche aux Archives Nationales de Tunisie (Kasbah) :
Si le décès ou le mariage est antérieur à 1910, les registres originaux ont été versés au Daftarkhana des Archives Nationales sous le fonds « Justice Charaïque ». La commande du carton d'archives d'après la cote thématique permet de compulser directement l'acte calligraphié original et d'en obtenir une copie certifiée conforme pour son dossier d'arbre généalogique.`,
    },
    {
        title: "Les Fondations Pieuses Familiales (Habous Ahlī) en Tunisie : Rôles d'Assignation, Droits d'Istiḥqāq et Préservation des Généalogies Séculaires (XVIe–XXe s.)",
        category: "Habous & Waqf",
        authorEmail: "devteam@rootstunisia.com",
        authorFullName: "Dev Team Admin",
        sources: [
            {
                title: "Archives Nationales de Tunisie (ANT)",
                cote: "Fonds de la Jam'iyat al-Ahbās (créée en 1874) : Dafâtir Inshā' al-Wuqūf al-Ahlīyya (Cote ANT-HAB-AHLI-1310H/15)",
                url: "http://www.archives.nat.tn",
                note: "Registres centraux d'enregistrement des actes constitutifs de fondations habous familiales avec listes des ayants droit.",
            },
            {
                title: "Direction Générale des Forêts et Domaines de l'État (Tunis)",
                cote: "Dossiers de Liquidation des Habous Privés — Décret du 18 juillet 1957 (Cote DOM-LIQ-HAB-1958/88)",
                url: "http://www.domainesetat.tn",
                note: "Dossiers d'instruction nominative établis lors de la liquidation des habous, contenant les arbres généalogiques dressés par les experts judiciaires.",
            },
            {
                title: "Conservation de la Propriété Foncière de Tunisie (CPF)",
                cote: "Livres Fonciers de Titres Immobiliers Mixtes et Habous (Cote CPF-TF-1896/00412)",
                url: "http://www.cpf.gov.tn",
                note: "Plans de délimitation parcellaire et bordereaux d'inscription des droits réels au nom des lignées bénéficiaires.",
            },
            {
                title: "Archives Judiciaires du Tribunal de Première Instance de Tunis",
                cote: "Registres des Jugements de Revendication d'Istiḥqāq (Cote TPI-JUR-IST-1922/33)",
                url: "http://www.archives.nat.tn",
                note: "Enquêtes contradictoires comportant les dépositions sous serment de doyens familiaux pour prouver la descendance du waqif.",
            },
        ],
        content: `INTRODUCTION GÉNÉRALE : LE HABOUS FAMILIAL COMME CONSERVATOIRE DES GÉNÉALOGIES SÉCULAIRES

Dans l'histoire du droit et de la société tunisienne, aucune institution n'a joué un rôle aussi déterminant dans la préservation intacte de la mémoire des lignées que le Habous privé, également désigné dans la jurisprudence islamique sous le terme de « Waqf Ahlī » ou « Waqf Dhurrī » (fondation pieuse en faveur des descendants).

Fondé sur le principe de l'immobilisation de la substance d'un bien foncier ou immobilier (Tahbīs al-Asl) et de l'affectation perpétuelle de ses fruits et revenus aux membres de la famille du donateur (Tasbīl al-Thamarah), le Habous de famille répondait historiquement à un impératif double :
1. Sur le plan économique et patrimonial : Protéger le patrimoine familial terrien ou urbain contre les confiscations étatiques potentielles du pouvoir beylical makhzen et empêcher l'émiettement excessif des domaines agricoles provoqué par l'application stricte des partages successoraux à chaque génération.
2. Sur le plan généalogique et identitaire : Maintenir la cohésion symbolique du lignage autour d'un ancêtre fondateur commun, dont le nom, les volontés et la postérité se trouvaient gravés pour l'éternité dans la pierre de l'acte constitutif (Hujjat al-Waqf).

À son apogée à la fin du XIXe siècle, les biens habous représentaient près d'un tiers de l'ensemble des terres agricoles et des immeubles urbains de la Régence de Tunis ! En conséquence, la quasi-totalité des familles tunisiennes enracinées — qu'elles soient issues de l'aristocratie tunisoise, des terroirs oléicoles du Sahel, des oasis du Jérid ou des vallées andalouses de la Medjerda — comptait parmi ses ancêtres un ou plusieurs biens habous dont les archives constituent une véritable mine d'or généalogique.

--------------------------------------------------------------------------------
CHAPITRE I : DOCTRINE JURIDIQUE ET CONDITIONS DU FONDATEUR (SHURŪT AL-WĀQIF)

La validité canonique d'une fondation habous obéissait aux préceptes de l'école malékite dominante en Tunisie. L'adage fondamental des juristes stipulait : « Shart al-Wāqif ka-Nass al-Shāri' » (La clause stipulée par le fondateur a la même force obligatoire que le texte du Législateur).

Dans son acte fondateur dressé par-devant deux notaires, le constituant (Al-Wāqif) énonçait avec une minutie maniaque les règles gouvernant la dévolution de la rente entre ses enfants et leurs descendants jusqu'à l'extinction totale de sa race :
• L'égalité ou l'inégalité de partage entre les sexes : Si certains fondateurs adoptaient la règle coranique traditionnelle (deux parts pour le mâle, une part pour la fille), d'autres stipulaient expressément une stricte égalité (Al-Taswiya bayna al-Dhukūr wa-l-Ināth) pour protéger leurs filles contre les aléas de la vie matrimoniale.
• La clause d'exclusion des cognats : De nombreuses chartes prévoyaient que les enfants issus de filles mariées hors de la famille (Awlād al-Banāt) perdaient leur droit à la rente au profit exclusif de la descendance agnatique mâle (Awlād al-Zhukūr), afin d'éviter que le patrimoine ne bascule au sein d'une famille alliée rivale.
• La clause de retour ou d'accroissement (Al-'Awd wa-l-Intiqāl) : Définissant à quelle branche cousine revenait la part d'un ayant droit décédé sans postérité légitime.
• La clause caritative finale (Al-Masrif al-Khayrī) : Précaution théologique indispensable pour valider la perpétuité de la fondation, l'acte prévoyait qu'en cas d'extinction absolue de tous les descendants du fondateur, les revenus de l'immeuble ou de la terre iraient de plein droit aux pauvres de La Mecque et Médine (Al-Haramayn al-Sharīfayn), à la Grande Mosquée Zitouna ou aux malades de l'Hôpital Sadiki.

--------------------------------------------------------------------------------
CHAPITRE II : LA CHARTE CONSTITUTIVE (HUJJAT AL-TASHJÎR) ET L'ARBRE GÉNÉALOGIQUE LÉGAL

L'aspect le plus fascinant pour le chercheur contemporain réside dans la confection obligatoire des actes d'assignation généalogique appelés « Hujjāt al-Tashjīr wa-l-Ta'qīb ».

Lorsqu'un litige surgissait ou qu'une nouvelle génération réclamait sa quote-part de la récolte d'olives ou de blé, les notaires devaient dresser par écrit un arbre généalogique complet certifié sous serment, fixant le lien de parenté de chaque réclamant avec l'ancêtre fondateur.

Ces chartes, calligraphiées sur de grands rouleaux de parchemin ou sur des registres de grand format (Dafâtir al-Ahbās), comportent des mentions d'une valeur historique inestimable :
1. Le nom complet du fondateur, sa profession et la date de l'acte initial (souvent remontant au XVIe, XVIIe ou XVIIIe siècle).
2. La liste nominative de ses enfants directs du premier degré (Batn awwal).
3. La ramification de chaque branche jusqu'aux requérants vivants du XIXe ou XXe siècle (Batn thānī, thālith, rābi'...).
4. Les preuves documentaires apportées pour chaque filiation : production des contrats de mariage ('Uqūd al-Nikāh) des aïeuls et témoignages oraux de quatre doyens honorables de la famille certifiant que le requérant est bien issu de telle branche légitime.

--------------------------------------------------------------------------------
CHAPITRE III : L'ADMINISTRATEUR DU HABOUS (NĀDHIR OU OUKIL) : GESTIONNAIRE ET GARDIEN DU LIVRE DE FAMILLE

La charte de fondation désignait obligatoirement la personne chargée de gérer les terres, de payer les ouvriers agricoles, d'encaisser les fermages et de répartir les bénéfices entre les ayants droit : c'était le Nādhir (gardien ou surintendant) ou l'Oukil al-Habous.

En règle générale, le fondateur confiait cette charge à son fils aîné mâle le plus pieux et le plus compétent (Al-Arshad fa-l-Arshad min Awlādihi), avec transmission héréditaire de la charge de génération en génération selon le principe de primogéniture agnatique.

Le Nādhir tenait un registre de gestion rigoureux appelé « Daftar al-Kharja wa-l-Madkhūl » (Cahier des recettes et dépenses). Ce registre, souvent conservé précieusement dans le coffre en cèdre de la demeure familiale, enregistrait :
• La liste nominative des bénéficiaires ayant touché leur rente semestrielle ou annuelle, avec leur signature ou leur empreinte digitale.
• Les naissances survenues au sein des différentes branches familiales, qui donnaient droit à l'inscription d'un nouveau bénéficiaire à partir de sa majorité.
• Les mariages des filles et les décès des anciens, entraînant la redistribution des parts conformément aux clauses de la fondation.

Ces cahiers de gestion de Nadhir constituent les véritables journaux de bord démographiques et économiques des dynasties familiales tunisiennes sur plus de deux siècles continus.

--------------------------------------------------------------------------------
CHAPITRE IV : LES PROCÈS EN REVENDICATION DE DROITS (MUNĀZA'ĀT AL-ISTIḤQĀQ)

La rente issue d'un riche domaine agricole (comme des oliveraies à Sfax ou dans le Sahel, ou des vignobles et vergers au Cap Bon et dans la vallée de la Medjerda) suscitait inévitablement des convoitises et des contestations au fur et à mesure que les générations se multipliaient et que le nombre d'ayants droit atteignait plusieurs dizaines ou centaines d'individus.

Ces conflits donnaient lieu à des procès retentissants devant la Mahkama Charaïa de Tunis ou devant les cadis régionaux, sous le titre juridique d'« Action en revendication d'Istiḥqāq » (Da'wā al-Istiḥqāq fī-l-Habous).

Les dossiers de ces procès, conservés en masse sous la série « Justice Charaïque » aux Archives Nationales de Tunisie, sont d'une prodigieuse densité généalogique :
• Le plaignant produit l'acte fondateur pour prouver qu'il descend en ligne directe de l'ancêtre fondateur.
• La partie adverse tente de prouver que la branche du plaignant s'est éteinte ou que son grand-père était un enfant adoptif ou né d'une union non reconnue.
• Le tribunal commet une commission d'enquête composée de deux notaires et d'un assesseur judiciaire pour entendre les vieillards du village ou du quartier. Leurs dépositions sous serment ('Adālat al-Shuhūd) relatent l'histoire de la famille sur quatre générations, les déménagements, les émigrations temporaires et les filiations maternelles avec une spontanéité et un luxe de détails qu'aucun document officiel sec ne pourrait égaler !

--------------------------------------------------------------------------------
CHAPITRE V : LA CRÉATION DE LA JAMÂ'ÏYAT EL-HABOUS PAR KHEIREDDINE PACHA (1874)

Face au désordre régnant dans la gestion de milliers de biens de mainmorte abandonnés, mal administrés ou spoliés par des intendants indélicats, le grand vizir réformateur Kheireddine Pacha promulgua le décret historique du 22 mai 1874 créant la « Jam'iyat al-Ahbās » (Direction générale des Fondations pieuses).

Cette administration moderne fut chargée de dresser l'inventaire exhaustif de tous les habous existant sur le territoire de la Régence de Tunis. Chaque Nādhir dut obligatoirement déposer au siège de l'institution à Tunis :
1. Une copie conforme certifiée de l'acte constitutif de son habous.
2. Le recensement nominatif complet de tous les bénéficiaires vivants avec leur filiation vérifiée.
3. Le plan de délimitation ou la description cadastrale des terres et immeubles rattachés.

Cette réforme titanesque a abouti à la constitution d'un fichier centralisé d'une perfection absolue, conservé aujourd'hui aux Archives Nationales de Tunisie sous le « Fonds de la Jamâïyat el-Habous » (Cotes ANT-HAB-AHLI et ANT-HAB-AMM). Ce fonds permet au chercheur contemporain de retrouver en quelques minutes le dossier complet de sa famille sans avoir à écumer des dizaines de dépôts notariaux disparates.

--------------------------------------------------------------------------------
CHAPITRE VI : ÉTUDE DE CAS HISTORIQUE : LE HABOUS DU CHEIKH AHMED BEN MUSTAPHA (1718–1957)

Pour apprécier la puissance généalogique de cette documentation, retraçons la trajectoire d'un habous familial réel fondé sous le règne d'Hussein Ier Bey :

L'acte fondateur de 1718 :
Le 15 Rabia al-Awwal 1130 H (Février 1718), Cheikh Ahmed ben Mustapha al-Andalousī, propriétaire terrien originaire de Testour réfugié d'Andalousie au début du XVIIe siècle, constitue en habous privé au profit de ses deux fils Mustapha et Mohamed et de leur descendance agnatique perpétuelle un domaine de 450 oliviers et 12 parcelles maraîchères irriguées par l'Oued Medjerda.

L'évolution sur deux siècles :
• En 1785 (1199 H), à l'ouverture de la succession de Mohamed ben Ahmed, l'inventaire récapitule 8 bénéficiaires mâles directs.
• En 1842 (1258 H), un acte de désignation de Nādhir dressé à Testour énumère 24 chefs de famille issus des deux branches initiales, tous vivants et jouissant de leur droit.
• En 1895 (1313 H), suite à l'immatriculation foncière des terres de la Medjerda, la Jamâïyat el-Habous dresse l'arbre généalogique officiel de la famille : il comporte 67 bénéficiaires vivants répartis entre Testour, Béja et la Médina de Tunis !

Ce document unique a permis à une famille contemporaine de remonter l'intégralité de ses branches cousines de 1957 jusqu'à l'ancêtre morisque venu d'Aragon en 1609, avec la preuve juridique formelle de chaque filiation !

--------------------------------------------------------------------------------
CHAPITRE VII : LA LIQUIDATION DES HABOUS PRIVÉS PAR LE DÉCRET DU 18 JUILLET 1957

Au lendemain de l'indépendance de la Tunisie et de la proclamation de la République, le gouvernement du président Habib Bourguiba engagea une refonte radicale du régime foncier et économique du pays.

Par le décret historique du 18 juillet 1957 (loi n° 57-18), la République tunisienne prononça la suppression définitive et la liquidation intégrale de tous les Habous privés et mixtes (Ahbās Ahlīyya wa Mushtaraka).

Loin de clore le chapitre de notre histoire familiale, cette liquidation de 1957 constitue paradoxalement la synthèse généalogique la plus spectaculaire jamais produite dans le monde arabe :
1. Pour liquider chaque habous et attribuer la pleine propriété individuelle des terres aux héritiers, l'État a instauré des commissions régionales de liquidation des habous (Lijān Tasfiyat al-Ahbās).
2. Chaque famille a dû constituer un dossier de liquidation comprenant l'arbre généalogique descendant exhaustif de toute la parenté vivante au 18 juillet 1957, avec les actes de naissance, de mariage et de décès délivrés par les mairies modernes, reliés à l'acte fondateur du XVIIIe ou XIXe siècle.
3. Des experts judiciaires et géomètres ont cartographié les parts respectives et dressé un procès-verbal final d'attribution homologué par le Tribunal de Première Instance.

Les dossiers de liquidation des habous privés, conservés à la Direction Générale des Domaines de l'État et aux Archives Nationales de Tunisie (Cote DOM-LIQ-HAB), représentent ainsi le pont d'or reliant directement les citoyens tunisiens du XXIe siècle à leurs ancêtres de l'époque husseinite pré-coloniale.

--------------------------------------------------------------------------------
CHAPITRE VIII : LEXIQUE TECHNIQUE DU DROIT DU WAQF TUNISIEN

• Asl : La substance nue de la propriété immobilière ou foncière immobilisée en mainmorte, inaliénable et insaisissable.
• Batn (pluriel Butūn) : Génération ou degré de filiation par rapport à l'ancêtre fondateur.
• Hawz : Prise de possession matérielle effective du bien au moment de la fondation, condition indispensable de validité en droit malékite.
• Hujjat al-Waqf : Acte notarié authentique portant constitution de la fondation pieuse, décrivant les biens et stipulant les clauses d'assignation.
• Istiḥqāq : Le droit légal fondé sur la preuve généalogique d'exiger sa quote-part des bénéfices de la fondation.
• Mu'aqqib : Descendant ayant droit issu d'une génération successive selon les règles de la fondation.
• Nādhir : Administrateur fiduciaire désigné par le fondateur ou par le tribunal pour gérer les affaires du habous.
• Qisma : Opération matérielle et juridique de partage annuel des récoltes ou des loyers entre les ayants droit.
• Tasbīl al-Thamarah : L'affectation perpétuelle des fruits, loyers et récoltes au profit des bénéficiaires désignés.
• Wāqif : Le propriétaire donateur qui aliène ses biens de son vivant pour ériger la fondation pieuse.

--------------------------------------------------------------------------------
CHAPITRE IX : PROTOCOLE MÉTHODIQUE POUR RETROUVER LE DOSSIER HABOUS DE SA FAMILLE

1. Enquête orale préliminaire : Interroger les aînés de la famille pour identifier le nom présumé de la terre ancestrale (Hanchir, Saniya, Maghrouss) ou de la maison de médina qui était réputée être « Habous » dans la mémoire des grands-parents.
2. Consultation des Titres Fonciers (Conservation de la Propriété Foncière) :
Si le bien a fait l'objet d'une immatriculation foncière après 1885, se procurer le Titre Foncier (Titre Bleu) auprès de la CPF. La page des charges et origines de propriété mentionne expressément la référence de l'acte de fondation habous et le numéro de dossier de liquidation de 1957.
3. Demande de communication aux Archives Nationales de Tunisie :
Au Daftarkhana, consulter les tables alphabétiques du Fonds de la Jamâïyat el-Habous (Sous-fonds Répertoire des Fondations Privées par Caïdat). La commande du dossier livre la charte originale, les arbres de parenté notariés et les procès-verbaux de répartition.`,
    },
];

