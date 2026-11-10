import type { PublicCardDto } from "../hooks/usePublicCards";

export const PUBLIC_CARDS_SEED_FALLBACK: PublicCardDto[] = [
  {
    id: 1,
    kind: "source",
    title: "État civil tunisien",
    description: "Municipalités · Archives Nationales de Tunisie — Naissances, mariages, décès, filiations parentales, professions, dates et lieux précis dans les 24 gouvernorats.",
    link: "http://www.archives.nat.tn",
    sortOrder: 0,
    isPublished: true,
    translations: {
      ar: {
        title: "دفاتر الحالة المدنية التونسية",
        description: "البلديات والمعتمديات · الأرشيف الوطني التونسي — الولادات، الزيجات، الوفيات، أسماء الوالدين، المهن، والمواقع والتواريخ الدقيقة في 24 ولاية.",
      },
      en: {
        title: "Tunisian Civil Registry (État Civil)",
        description: "Municipalities · Archives Nationales de Tunisie — Births, marriages, deaths, parental identities, occupations, exact dates and locations across 24 governorates.",
      },
      es: {
        title: "Registro civil tunecino",
        description: "Municipios · Archivos Nacionales de Túnez — Nacimientos, matrimonios, defunciones, filiación paterna, oficios, fechas y localidades en las 24 gobernaciones.",
      },
      it: {
        title: "Stato civile tunisino",
        description: "Municipi · Archivi Nazionali di Tunisia — Nascite, matrimoni, decessi, filiazione genitoriale, professioni, date e luoghi precisi nei 24 governatorati.",
      },
      mt: {
        title: "Stat ċivili Tuneżin",
        description: "Muniċipalitajiet · Arkivji Nazzjonali tat-Tuneżija — Twelid, żwiġijiet, imwiet, ismijiet tal-ġenituri, professjonijiet, dati u postijiet preċiżi fl-24 governorat.",
      },
    },
  },
  {
    id: 2,
    kind: "source",
    title: "Sijillat des tribunaux charaïques",
    description: "Archives Nationales de Tunisie · Dépôts des tribunaux régionaux — Successions, tutelles, contrats de mariage et partages d'héritage établissant les filiations sur plusieurs générations.",
    link: "http://www.archives.nat.tn",
    sortOrder: 1,
    isPublished: true,
    translations: {
      ar: {
        title: "سجلات المحاكم الشرعية",
        description: "الأرشيف الوطني التونسي · مستودعات المحاكم الجهوية — حجج التركات، الوصاية الشرعية، عقود الزواج، وقسمة المواريث التي تذكر الأبناء والأجداد لعدة أجيال.",
      },
      en: {
        title: "Charaïque Court Sijillat",
        description: "Archives Nationales de Tunisie · Regional Court Depositories — Inheritance distributions, legal guardianship, marriage settlements, and estate partitions establishing multi-generational descent.",
      },
      es: {
        title: "Sijillat de tribunales sharaï",
        description: "Archivos Nacionales de Túnez · Depósitos judiciales — Sucesiones, tutelas, dotes y particiones de herencia que fijan filiaciones a lo largo de varias generaciones.",
      },
      it: {
        title: "Sijillat dei tribunali sciaraitici",
        description: "Archivi Nazionali di Tunisia · Depositi dei tribunali regionali — Successioni, tutele legali, contratti matrimoniali e divisioni ereditarie che attestano la discendenza generazionale.",
      },
      mt: {
        title: "Sijillat tal-qrati xagħrija",
        description: "Arkivji Nazzjonali tat-Tuneżija · Qrati reġjonali — Suċċessjonijiet, kuratorji, kuntratti taż-żwieġ u qsim ta' wirt li jistabbilixxu linji ta' nisel fuq diversi ġenerazzjonijiet.",
      },
    },
  },
  {
    id: 3,
    kind: "source",
    title: "Fonds des Habous et Fondations Pieuses",
    description: "Archives Nationales de Tunisie · Fonds Jamaiyat el Habous — Actes de constitution de waqf familial (habous ahlia) détaillant la chaîne généalogique complète des bénéficiaires et fondateurs.",
    link: "http://www.archives.nat.tn",
    sortOrder: 2,
    isPublished: true,
    translations: {
      ar: {
        title: "سجلات الأحباس والأوقاف العائلية",
        description: "الأرشيف الوطني التونسي · أرشيف جمعية الأحباس — حجج تأسيس الأحباس العائلية التي تسرد شجرة المستحقين والواقفين بالكامل مع ذكر الفروع والأنساب عبر القرون.",
      },
      en: {
        title: "Habous & Pious Endowments Records",
        description: "Archives Nationales de Tunisie · Jamaiyat el Habous Collection — Family waqf deeds reciting complete genealogical lineages of donors, beneficiaries, and descendants.",
      },
      es: {
        title: "Fondos de Habús y Dotaciones Familiares",
        description: "Archivos Nacionales de Túnez · Colección Jamaiyat el Habous — Escrituras de waqf familiar que detallan la cadena genealógica completa de beneficiarios y fundadores.",
      },
      it: {
        title: "Fondo degli Habous e Fondazioni Familiari",
        description: "Archivi Nazionali di Tunisia · Collezione Jamaiyat el Habous — Atti di waqf familiare che descrivono l'intera catena genealogica di fondatori, eredi e beneficiari.",
      },
      mt: {
        title: "Fondi tal-Ħawf u Fondazzjonijiet Piji",
        description: "Arkivji Nazzjonali tat-Tuneżija · Fond Jamaiyat el Habous — Atti ta' waqf tal-familja li jiddokumentaw il-linja sħiħa tan-nisel tal-benefiċjarji u l-fundaturi.",
      },
    },
  },
  {
    id: 4,
    kind: "source",
    title: "Décrets et Registres Beylicaux",
    description: "Archives Nationales de Tunisie (Palais du Bardo) · Série Historique — Investitures caïdales, décrets d'anoblissement, pensions militaires makhzen et concessions foncières.",
    link: "http://www.archives.nat.tn",
    sortOrder: 3,
    isPublished: true,
    translations: {
      ar: {
        title: "المراسيم والأوامر العلية البايولية",
        description: "الأرشيف الوطني التونسي (قصر باردو) · السلسلة التاريخية — مراسيم تعيين القواد والمخازنية، فرمانات الشرف، الرواتب العسكرية والمصادرات العقارية لرجالات الدولة.",
      },
      en: {
        title: "Beylical Decrees & Diwan al-Insha",
        description: "Archives Nationales de Tunisie (Bardo Palace) · Historical Series — Administrative caïdal appointments, honorific firmans, makhzen pensions, and land grant titles.",
      },
      es: {
        title: "Decretos beylical y Diwan al-Insha",
        description: "Archivos Nacionales de Túnez (Palacio del Bardo) — Nombramientos de caídes, títulos nobiliarios, pensiones makhzen y mercedes de tierras.",
      },
      it: {
        title: "Decreti Beylicali e Diwan al-Insha",
        description: "Archivi Nazionali di Tunisia (Palazzo del Bardo) — Nomine caïdali, concessioni di rango, pensioni militari del makhzen e titoli terrieri della Reggenza.",
      },
      mt: {
        title: "Digrieti Bejlikali u Diwan al-Insha",
        description: "Arkivji Nazzjonali tat-Tuneżija (Palazz tal-Bardo) — Ħatriet amministrattivi, titli onorifiċi, pensjonijiet militari u konċessjonijiet ta' artijiet.",
      },
    },
  },
  {
    id: 5,
    kind: "source",
    title: "Cahiers Fiscaux de la Majba (1856-1881)",
    description: "Archives Nationales de Tunisie · Séries Financières — Recensements nominatifs des chefs de famille masculins imposables par caïdat, tribu et douar avant le protectorat.",
    link: "http://www.archives.nat.tn",
    sortOrder: 4,
    isPublished: true,
    translations: {
      ar: {
        title: "دفاتر ضريبة المجبى الجبائية (1856-1881)",
        description: "الأرشيف الوطني التونسي · السلاسل المالية — إحصاءات اسمية لجميع أرباب العائلات الخاضعين للضريبة حسب القيادات والقبائل والقرى قبل انتصاب الحماية.",
      },
      en: {
        title: "Majba Capitation Tax Registers (1856–1881)",
        description: "Archives Nationales de Tunisie · Financial Series — Comprehensive head-of-household tax rolls organized by caïdat, tribe, and douar prior to the protectorate.",
      },
      es: {
        title: "Cuadernos Fiscales de la Majba (1856-1881)",
        description: "Archivos Nacionales de Túnez · Serie Financiera — Padrones nominativos de cabezas de familia sujetos a impuesto por caídato, tribu y aduar.",
      },
      it: {
        title: "Registri Fiscali della Majba (1856–1881)",
        description: "Archivi Nazionali di Tunisia · Serie Finanziaria — Censimenti nominativi dei capifamiglia tassabili per caïdato, tribù e douar prima del protettorato.",
      },
      mt: {
        title: "Reġistri tat-Taxxa tal-Majba (1856–1881)",
        description: "Arkivji Nazzjonali tat-Tuneżija · Serje Finanzjarja — Reġistrazzjonijiet nominattivi tal-kapijiet tal-familja skont il-kaïdat, tribù u douar qabel il-protettorat.",
      },
    },
  },
  {
    id: 6,
    kind: "source",
    title: "Registres Paroissiaux et Diocésains",
    description: "Archevêché de Tunis · Archives de Carthage et de Sainte-Croix — Baptêmes, mariages et sépultures des communautés chrétiennes (italienne, maltaise, française) depuis le XVIIe siècle.",
    link: "https://www.diocesetunis.org",
    sortOrder: 5,
    isPublished: true,
    translations: {
      ar: {
        title: "سجلات الرعايا الكنسية والأبرشية",
        description: "مطرانية تونس · أرشيف كاتدرائية قرطاج وكنيسة سانتا كروتشي — سجلات التعميد والزواج والوفيات للجاليات الإيطالية والمالطية والفرنسية بتونس منذ القرن 17.",
      },
      en: {
        title: "Parish & Diocesan Catholic Registers",
        description: "Archdiocese of Tunis · Carthage & Sainte-Croix Archives — Baptisms, marriages, and burials for Italian, Maltese, and French communities settled in Tunisia since the 17th century.",
      },
      es: {
        title: "Registros Parroquiales y Diocesanos",
        description: "Arzobispado de Túnez — Bautismos, matrimonios y defunciones de las comunidades italiana, maltesa y francesa desde el siglo XVII.",
      },
      it: {
        title: "Registri Parrocchiali e Diocesani",
        description: "Arcidiocesi di Tunisi · Archivi di Cartagine e Santa Croce — Battesimi, matrimoni e sepolture delle comunità italiana, maltese e francese dal XVII secolo.",
      },
      mt: {
        title: "Reġistri Parrokkjali u Djoċesani",
        description: "Arċidjoċesi ta' Tuneż — Magħmudijiet, żwiġijiet u dfin għall-komunitajiet Taljani, Maltin u Franċiżi fit-Tuneżija mis-seklu 17.",
      },
    },
  },
  {
    id: 7,
    kind: "source",
    title: "Séries Rabbiniques et Communautaires Israélites",
    description: "Grand Rabbinat de Tunis · Dépôts de la Goulette et Djerba — Ketoubot (contrats matrimoniaux), jugements des tribunaux rabbiniques et registres de circoncision des communautés Touansa et Grana.",
    link: "http://www.archives.nat.tn",
    sortOrder: 6,
    isPublished: true,
    translations: {
      ar: {
        title: "السجلات الحاخامية لليهود التونسيين",
        description: "الحاخامية الكبرى بتونس · مستودعات حلق الوادي وجربة — عقود الزواج اليهودية (كيتوبوت)، أحكام المحاكم الحاخامية، وسجلات الطائفتين التوانسة والقرانة (الليفوريين).",
      },
      en: {
        title: "Jewish Rabbinical & Community Registers",
        description: "Grand Rabbinate of Tunis · La Goulette & Djerba Repositories — Ketubot (marriage deeds), rabbinical court rulings, and circumcision registries for the Touansa and Grana (Livornese) communities.",
      },
      es: {
        title: "Series Rabínicas y Comunitarias Judías",
        description: "Gran Rabinato de Túnez — Ketubot, actas de tribunales rabínicos y registros comunitarios de Touansa y Grana.",
      },
      it: {
        title: "Registri Rabbinici della Comunità Ebraica",
        description: "Gran Rabbinato di Tunisi — Ketubot matrimoniali, sentenze rabbiniche e registri comunitari per Touansa e Grana (livornesi).",
      },
      mt: {
        title: "Reġistri Rabiniċi u Komunitarji Lhud",
        description: "Gran Rabbinat ta' Tuneż — Ketubot, sentenzi tal-qrati rabiniċi u reġistri tal-komunitajiet Touansa u Grana.",
      },
    },
  },
  {
    id: 8,
    kind: "archive",
    title: "Archives Nationales de Tunisie (ANT)",
    description: "10 Rue du 2 Mars 1934, 1000 Tunis — Dépôt central conservant les archives beylicales, la série charaïque, la fiscalité de la Majba, le fonds des Habous et l'état civil historique.",
    link: "http://www.archives.nat.tn",
    sortOrder: 0,
    isPublished: true,
    translations: {
      ar: {
        title: "الأرشيف الوطني التونسي",
        description: "10 نهج 2 مارس 1934، 1000 تونس — المستودع المركزي المحتضن للأرشيف البايولي، السلسلة الشرعية، سجلات المجبى، دفاتر الأحباس وسجلات الحالة المدنية التاريخية.",
      },
      en: {
        title: "Archives Nationales de Tunisie (ANT)",
        description: "10 Rue du 2 Mars 1934, 1000 Tunis — Central repository housing beylical archives, charaïque court sijillat, Majba tax rolls, Habous registries, and historic civil records.",
      },
      es: {
        title: "Archivos Nacionales de Túnez (ANT)",
        description: "10 Rue du 2 Mars 1934, 1000 Túnez — Depósito central con fondos beylicales, sijillat charaïque, majba, habús y estado civil histórico.",
      },
      it: {
        title: "Archivi Nazionali di Tunisia (ANT)",
        description: "10 Rue du 2 Mars 1934, 1000 Tunisi — Deposito centrale contenente gli archivi beylicali, la serie sciaraitica, la majba e il registro civile storico.",
      },
      mt: {
        title: "Arkivji Nazzjonali tat-Tuneżija (ANT)",
        description: "10 Rue du 2 Mars 1934, 1000 Tuneż — Depożitu ċentrali li jżomm l-arkivji bejlikali, sijillat xagħrija, taxxa tal-majba u l-istat ċivili storiku.",
      },
    },
  },
  {
    id: 9,
    kind: "archive",
    title: "Bibliothèque Nationale de Tunisie (BNT)",
    description: "Boulevard 9 Avril 1938, 1008 Tunis — Dépôt légal, manuscrits arabes séculaires, arbres généalogiques patronymiques, presse d'époque et thèses universitaires d'histoire sociale.",
    link: "https://www.bnt.nat.tn",
    sortOrder: 1,
    isPublished: true,
    translations: {
      ar: {
        title: "المكتبة الوطنية التونسية",
        description: "شارع 9 أفريل 1938، 1008 تونس — الإيداع القانوني، المخطوطات الأثرية النادرة، مشجرات الأنساب العائلية، الصحافة التونسية القديمة والدراسات الأكاديمية.",
      },
      en: {
        title: "National Library of Tunisia (BNT)",
        description: "Boulevard 9 Avril 1938, 1008 Tunis — Legal depository, ancient Arabic manuscripts, patronymic genealogical charts, historic periodicals, and demographic research.",
      },
      es: {
        title: "Biblioteca Nacional de Túnez (BNT)",
        description: "Boulevard 9 Avril 1938, 1008 Túnez — Manuscritos árabes, árboles genealógicos impresos, prensa de época y monografías históricas.",
      },
      it: {
        title: "Biblioteca Nazionale di Tunisia (BNT)",
        description: "Boulevard 9 Avril 1938, 1008 Tunisi — Deposito legale, manoscritti arabi secolari, alberi genealogici stampati, periodici d'epoca e tesi storiche.",
      },
      mt: {
        title: "Bibljoteka Nazzjonali tat-Tuneżija (BNT)",
        description: "Boulevard 9 Avril 1938, 1008 Tuneż — Manusk Scripts antiki bl-Għarbi, charts ġenealoġiċi, gazzetti storiċi u studji demografiċi.",
      },
    },
  },
  {
    id: 10,
    kind: "archive",
    title: "Archives Municipales de la Ville de Tunis",
    description: "Hôtel de Ville de Tunis, Place de la Kasbah, 1000 Tunis — Registres municipaux de l'état civil depuis 1888, recensements de population de la capitale et registres des métiers.",
    link: "https://www.commune-tunis.gov.tn",
    sortOrder: 2,
    isPublished: true,
    translations: {
      ar: {
        title: "أرشيف بلدية مدينة تونس",
        description: "قصر بلدية تونس، ساحة القصبة، 1000 تونس — دفاتر الحالة المدنية البلدية منذ 1888، إحصاءات سكان الحاضرة، وسجلات نقابات الحرف وأمينات الأسواق.",
      },
      en: {
        title: "Municipal Archives of Tunis City",
        description: "City Hall, Place de la Kasbah, 1000 Tunis — Municipal vital records since 1888, capital demographic censuses, and guild membership registries.",
      },
      es: {
        title: "Archivos Municipales de la Ciudad de Túnez",
        description: "Ayuntamiento de Túnez, Plaza de la Kasbah — Registros de estado civil desde 1888 y censos municipales de la capital.",
      },
      it: {
        title: "Archivi Municipali della Città di Tunisi",
        description: "Municipio di Tunisi, Piazza della Kasbah — Registri di stato civile dal 1888, censimenti urbani della capitale e corporazioni.",
      },
      mt: {
        title: "Arkivji Muniċipali tal-Belt ta' Tuneż",
        description: "Muniċipju ta' Tuneż, Misraħ il-Kasbah — Reġistri tal-istat ċivili mill-1888 u ċensimenti tal-popolazzjoni tal-belt kapitali.",
      },
    },
  },
];

