import type { CustomService } from "../pages/Services";

export const DEFAULT_SERVICES_CATALOG: CustomService[] = [
  {
    id: 1,
    slug: "dechiffrage-transcription-paleographique",
    title: "Déchiffrage & Transcription Paléographique",
    category: "Paléographie & Traduction",
    price_eur: 0,
    price_usd: 0,
    price_tnd: 0,
    billing_unit: "Sur Devis",
    description:
      "Transcription diplomatique et traduction certifiée (français, anglais, arabe) d'actes manuscrits en arabe maghrébin, turc ottoman, italien ancien, judéo-arabe ou latin d'église.",
    full_offer:
      "Notre équipe d'historiens et de paléographes certifiés examine vos actes anciens manuscrits (sijillats des cadis malékites et hanafites, actes d'adoul, registres paroissiaux, ketoubot, actes notariés beylicaux). Nous réalisons une transcription diplomatique intégrale mot à mot accompagnée d'une traduction fidèle dans la langue de votre choix, complétée par des annotations onomastiques sur les patronymes, titres et toponymes.",
    deliverables: [
      "Transcription intégrale mot à mot du manuscrit original",
      "Traduction certifiée et annotée (français, anglais, arabe ou italien)",
      "Notes onomastiques et historiques sur les patronymes et filiations",
      "Examen paléographique des sceaux, tampons et paraphes d'adoul",
      "Livraison d'un dossier PDF haute résolution sous 48h à 72h",
    ],
    whatsapp_prefill:
      "Bonjour Roots Tunisia, je souhaite une consultation gratuite pour un déchiffrage et transcription paléographique.",
    order_index: 1,
    is_active: true,
  },
  {
    id: 2,
    slug: "recherche-in-situ-archives-nationales",
    title: "Recherche In Situ aux Archives Nationales",
    category: "Investigation sur le Terrain",
    price_eur: 0,
    price_usd: 0,
    price_tnd: 0,
    billing_unit: "Sur Devis",
    description:
      "Mandat d'un chercheur habilité à Tunis (dépôt de la Kasbah, municipalités, gouvernorats) pour retrouver, vérifier et photographier des registres et cotes physiques non numérisés.",
    full_offer:
      "Vous avez identifié une piste familiale, une cote d'archives non numérisée ou un registre physique conservé en Tunisie ? Nous mandatons un chercheur habilité directement auprès des Archives Nationales de Tunisie (La Kasbah), des tribunaux régionaux ou des dépôts municipaux des 24 gouvernorats. Le chercheur consulte sur place les liasses et registres originaux, vérifie la filiation et réalise des clichés haute définition des folios.",
    deliverables: [
      "Déplacement physique du chercheur aux Archives Nationales (Kasbah) ou en région",
      "Photographies haute définition des folios originaux et des reliures",
      "Recherche croisée dans les séries historiques, habous et rôles de la Majba (1860–1881)",
      "Rapport de recherche détaillé avec cotes exactes, dates hégiriennes et grégoriennes",
      "Fiche d'inventaire et relevé officiel de consultation archivistique",
    ],
    whatsapp_prefill:
      "Bonjour Roots Tunisia, je souhaite mandater un chercheur pour une recherche in situ aux Archives Nationales.",
    order_index: 2,
    is_active: true,
  },
  {
    id: 3,
    slug: "validation-filiation-dossier-notarie",
    title: "Validation de Filiation & Dossier Notarié",
    category: "Filiation & Preuves Juridiques",
    price_eur: 0,
    price_usd: 0,
    price_tnd: 0,
    billing_unit: "Sur Devis",
    description:
      "Constitution d'un dossier probatoire complet de filiation avec références archivistiques certifiées et chaîne de transmission générationnelle pour vos démarches officielles.",
    full_offer:
      "Pour vos démarches notariales, recherches successorales, constitutions de dossiers de nationalité ou vérifications d'ascendance ancienne, nous constituons un dossier de filiation complet et documenté. Chaque génération est validée par croisement rigoureux d'actes d'état civil, d'actes notariés d'adoul ('udul), de registres de Habous (Awqaf) et de rôles fiscaux beylicaux.",
    deliverables: [
      "Dossier complet de preuves documentaires et archivistiques par génération",
      "Validation paléographique de la chaîne de transmission familiale",
      "Tableau généalogique d'ascendance certifié avec cotes des sources primaires",
      "Concordance onomastique des variantes orthographiques du patronyme",
      "Livret de synthèse patrimoniale et archivistique au format PDF",
    ],
    whatsapp_prefill:
      "Bonjour Roots Tunisia, je souhaite une consultation pour une validation de filiation et dossier notarié.",
    order_index: 3,
    is_active: true,
  },
  {
    id: 4,
    slug: "etat-civil-naturalisations-consulats",
    title: "Recherches d'État Civil, Consulats & Naturalisations",
    category: "État Civil & Archives Consulaires",
    price_eur: 0,
    price_usd: 0,
    price_tnd: 0,
    billing_unit: "Sur Devis",
    description:
      "Localisation et extraction d'actes de naissance, mariage et décès (depuis 1886), dossiers de naturalisation (1924–1927) et registres consulaires méditerranéens (France, Italie, Malte).",
    full_offer:
      "Nous effectuons des recherches ciblées dans les registres d'état civil des 350 communes tunisiennes ainsi que dans les fonds diplomatiques et consulaires (CADN Nantes, ANOM Aix-en-Provence, registres paroissiaux de la Prélature de Tunis, archives consulaires italiennes et maltaises) pour reconstituer le parcours complet des familles établies en Tunisie aux XIXe et XXe siècles.",
    deliverables: [
      "Recherche dans les registres municipaux d'état civil tunisien (depuis 1886)",
      "Extraction des dossiers et décrets de naturalisation (1887–1956)",
      "Consultation des registres consulaires et paroissiaux (Tunis, La Goulette, Bizerte, Sfax, Sousse)",
      "Reconstitution chronologique des unions, naissances et domiciles",
      "Dossier numérique complet avec copies intégrales et transcriptions",
    ],
    whatsapp_prefill:
      "Bonjour Roots Tunisia, je souhaite rechercher des actes d'état civil ou un dossier de naturalisation.",
    order_index: 4,
    is_active: true,
  },
  {
    id: 5,
    slug: "cartographie-tribale-origines-regionales",
    title: "Étude d'Origine Patronymique & Cartographie Tribale",
    category: "Onomastique & Cartographie",
    price_eur: 0,
    price_usd: 0,
    price_tnd: 0,
    billing_unit: "Sur Devis",
    description:
      "Étude historique et géographique approfondie de votre patronyme (laqab, nisba), identification du caïdat ou de la confédération d'origine et cartographie des foyers historiques.",
    full_offer:
      "Chaque patronyme tunisien porte la mémoire d'un terroir, d'une confédération tribale, d'un métier de médina ou d'une migration méditerranéenne (andalouse, morisque, ottomane, insulaire). Nos historiens croisent les dénombrements de la Majba de 1860, les répertoires de caïdats et les chroniques régionales pour retracer l'ancrage géographique et historique de votre nom de famille.",
    deliverables: [
      "Étude étymologique et historique complète du patronyme (nisba, laqab, origine)",
      "Identification du caïdat historique, de l'outan ou de la fraction tribale d'origine",
      "Carte historique personnalisée des foyers de peuplement de la lignée",
      "Relevé des occurrences du patronyme dans les registres fiscaux et notariés",
      "Monographie nominative illustrée prête à être partagée en famille",
    ],
    whatsapp_prefill:
      "Bonjour Roots Tunisia, je souhaite commander une étude d'origine patronymique et cartographie historique.",
    order_index: 5,
    is_active: true,
  },
  {
    id: 6,
    slug: "monographie-familiale-arbre-prestige",
    title: "Monographie Familiale & Grand Arbre Généalogique",
    category: "Édition & Arbres Certifiés",
    price_eur: 0,
    price_usd: 0,
    price_tnd: 0,
    billing_unit: "Sur Devis",
    description:
      "Conception d'un arbre généalogique d'art sur mesure et rédaction d'un livre d'histoire familiale illustré de documents d'archives, cartes d'époque et biographies d'ancêtres.",
    full_offer:
      "Offrez à votre famille un héritage durable : nos généalogistes, historiens et graphistes conçoivent votre grand arbre généalogique calligraphié ou numérique ainsi qu'une monographie familiale complète. L'ouvrage réunit les arbres d'ascendance et de descendance, les photographies anciennes restaurées, les actes originaux traduits et le récit historique de chaque génération.",
    deliverables: [
      "Grand arbre généalogique sur mesure (format d'art haute définition prêt à encadrer)",
      "Livre-monographie de l'histoire familiale rédigé par nos historiens",
      "Intégration et restauration numérique de vos photographies et actes anciens",
      "Export GEDCOM standardisé et intégration dans votre espace privé Roots Tunisia",
      "Accompagnement personnalisé avec entretiens familiaux en visioconférence",
    ],
    whatsapp_prefill:
      "Bonjour Roots Tunisia, je souhaite créer une monographie familiale et un grand arbre généalogique.",
    order_index: 6,
    is_active: true,
  },
];

interface LocalizedServiceTranslation {
  title: string;
  category: string;
  description: string;
  full_offer: string;
  deliverables: string[];
  whatsapp_prefill: string;
}

export const LOCALIZED_SERVICES_BY_LOCALE: Record<
  string,
  Record<number, LocalizedServiceTranslation>
> = {
  fr: {
    1: {
      title: DEFAULT_SERVICES_CATALOG[0].title,
      category: DEFAULT_SERVICES_CATALOG[0].category,
      description: DEFAULT_SERVICES_CATALOG[0].description,
      full_offer: DEFAULT_SERVICES_CATALOG[0].full_offer!,
      deliverables: DEFAULT_SERVICES_CATALOG[0].deliverables as string[],
      whatsapp_prefill: DEFAULT_SERVICES_CATALOG[0].whatsapp_prefill!,
    },
    2: {
      title: DEFAULT_SERVICES_CATALOG[1].title,
      category: DEFAULT_SERVICES_CATALOG[1].category,
      description: DEFAULT_SERVICES_CATALOG[1].description,
      full_offer: DEFAULT_SERVICES_CATALOG[1].full_offer!,
      deliverables: DEFAULT_SERVICES_CATALOG[1].deliverables as string[],
      whatsapp_prefill: DEFAULT_SERVICES_CATALOG[1].whatsapp_prefill!,
    },
    3: {
      title: DEFAULT_SERVICES_CATALOG[2].title,
      category: DEFAULT_SERVICES_CATALOG[2].category,
      description: DEFAULT_SERVICES_CATALOG[2].description,
      full_offer: DEFAULT_SERVICES_CATALOG[2].full_offer!,
      deliverables: DEFAULT_SERVICES_CATALOG[2].deliverables as string[],
      whatsapp_prefill: DEFAULT_SERVICES_CATALOG[2].whatsapp_prefill!,
    },
    4: {
      title: DEFAULT_SERVICES_CATALOG[3].title,
      category: DEFAULT_SERVICES_CATALOG[3].category,
      description: DEFAULT_SERVICES_CATALOG[3].description,
      full_offer: DEFAULT_SERVICES_CATALOG[3].full_offer!,
      deliverables: DEFAULT_SERVICES_CATALOG[3].deliverables as string[],
      whatsapp_prefill: DEFAULT_SERVICES_CATALOG[3].whatsapp_prefill!,
    },
    5: {
      title: DEFAULT_SERVICES_CATALOG[4].title,
      category: DEFAULT_SERVICES_CATALOG[4].category,
      description: DEFAULT_SERVICES_CATALOG[4].description,
      full_offer: DEFAULT_SERVICES_CATALOG[4].full_offer!,
      deliverables: DEFAULT_SERVICES_CATALOG[4].deliverables as string[],
      whatsapp_prefill: DEFAULT_SERVICES_CATALOG[4].whatsapp_prefill!,
    },
    6: {
      title: DEFAULT_SERVICES_CATALOG[5].title,
      category: DEFAULT_SERVICES_CATALOG[5].category,
      description: DEFAULT_SERVICES_CATALOG[5].description,
      full_offer: DEFAULT_SERVICES_CATALOG[5].full_offer!,
      deliverables: DEFAULT_SERVICES_CATALOG[5].deliverables as string[],
      whatsapp_prefill: DEFAULT_SERVICES_CATALOG[5].whatsapp_prefill!,
    },
  },
  en: {
    1: {
      title: "Paleographic Deciphering & Archival Transcription",
      category: "Paleography & Translation",
      description:
        "Diplomatic word-for-word transcription and certified translation (English, French, Arabic) of handwritten deeds in Maghrebi Arabic, Ottoman Turkish, Old Italian, Judeo-Arabic, or Church Latin.",
      full_offer:
        "Our team of historians and certified paleographers examines your historical handwritten records (Maliki and Hanafi qadi sijillats, 'udul notarial deeds, parish registers, ketubot, and Beylical decrees). We produce a complete word-for-word diplomatic transcription accompanied by an accurate translation into your chosen language, enriched with onomastic notes on surnames, titles, and place names.",
      deliverables: [
        "Complete word-for-word transcription of the original manuscript",
        "Certified and annotated translation (English, French, Arabic, or Italian)",
        "Onomastic and historical notes on surnames and family lineages",
        "Paleographic examination of seals, stamps, and notarial signatures",
        "High-resolution PDF report delivered within 48 to 72 hours",
      ],
      whatsapp_prefill:
        "Hello Roots Tunisia, I would like a free consultation for paleographic deciphering and transcription.",
    },
    2: {
      title: "On-Site Archival Research at the National Archives",
      category: "On-Site Investigation",
      description:
        "Commission an accredited researcher in Tunis (Kasbah repository, municipal archives, governorates) to locate, verify, and photograph un-digitized physical registers and call numbers.",
      full_offer:
        "Have you identified a family lead, an un-digitized archival call number, or a physical register preserved in Tunisia? We assign an accredited researcher directly to the National Archives of Tunisia (Dar El-Bey, Kasbah), regional courts, or municipal repositories across all 24 governorates. The researcher inspects the original bundles on site, verifies filiation, and captures high-definition photographs of the folios.",
      deliverables: [
        "On-site visit by an accredited researcher to the National Archives (Kasbah) or regional repositories",
        "High-definition photographs of original folios and bindings",
        "Cross-referenced search in historical series, Habous (Awqaf), and Majba tax rolls (1860–1881)",
        "Detailed research report with exact call numbers, Hijri and Gregorian dates",
        "Official archival consultation inventory sheet",
      ],
      whatsapp_prefill:
        "Hello Roots Tunisia, I would like to commission an on-site researcher at the National Archives.",
    },
    3: {
      title: "Lineage Validation & Notarial Proof Dossier",
      category: "Lineage & Legal Proofs",
      description:
        "Compilation of a comprehensive evidentiary lineage dossier with certified archival references and generational transmission chains for your official and legal procedures.",
      full_offer:
        "For your notarial procedures, estate research, citizenship applications, or historical ancestry verification, we assemble a complete, documented lineage dossier. Every generation is validated by cross-referencing civil status records, 'udul marriage contracts, Habous endowment registers, and Beylical fiscal rolls.",
      deliverables: [
        "Complete dossier of documentary and archival proofs for each generation",
        "Paleographic validation of the family transmission chain",
        "Certified ancestry chart with primary source call numbers",
        "Onomastic concordance of surname spelling variants across languages",
        "Bound heritage and archival synthesis booklet in PDF format",
      ],
      whatsapp_prefill:
        "Hello Roots Tunisia, I would like a free consultation for lineage validation and a notarial dossier.",
    },
    4: {
      title: "Civil Status, Consular Records & Naturalization Research",
      category: "Civil Status & Consular Archives",
      description:
        "Location and extraction of birth, marriage, and death certificates (since 1886), naturalization files (1924–1927), and Mediterranean consular registers (France, Italy, Malta).",
      full_offer:
        "We conduct targeted research in the civil status registers of all 350 Tunisian municipalities as well as diplomatic and consular holdings (CADN Nantes, ANOM Aix-en-Provence, Prelature of Tunis parish registers, Italian and Maltese consular archives) to reconstruct the complete journey of families settled in Tunisia in the 19th and 20th centuries.",
      deliverables: [
        "Search in Tunisian municipal civil status registers (since 1886)",
        "Extraction of naturalization files and decrees (1887–1956)",
        "Consultation of consular and parish registers (Tunis, La Goulette, Bizerte, Sfax, Sousse)",
        "Chronological reconstruction of marriages, births, and residences",
        "Complete digital dossier with full copies and transcriptions",
      ],
      whatsapp_prefill:
        "Hello Roots Tunisia, I would like to search for civil status records or a naturalization file.",
    },
    5: {
      title: "Surname Origin Study & Tribal Cartography",
      category: "Onomastics & Cartography",
      description:
        "In-depth historical and geographical study of your surname (laqab, nisba), identification of the ancestral caïdat or confederation, and mapping of historical homelands.",
      full_offer:
        "Every Tunisian surname carries the memory of a territory, a tribal confederation, a Medina craft, or a Mediterranean migration (Andalusian, Morisco, Ottoman, or islander). Our historians cross-reference the 1860 Majba census rolls, caïdat directories, and regional chronicles to trace the geographical and historical roots of your family name.",
      deliverables: [
        "Complete etymological and historical study of the surname (nisba, laqab, origin)",
        "Identification of the historical caïdat, outan, or ancestral tribal fraction",
        "Custom historical map of the family's settlement areas",
        "Index of surname occurrences in fiscal and notarial registers",
        "Illustrated nominative monograph ready to share with your family",
      ],
      whatsapp_prefill:
        "Hello Roots Tunisia, I would like to order a surname origin study and historical cartography.",
    },
    6: {
      title: "Family Monograph & Bespoke Fine-Art Family Tree",
      category: "Publishing & Certified Trees",
      description:
        "Design of a custom fine-art family tree and authoring of an illustrated family history book featuring archival documents, period maps, and ancestor biographies.",
      full_offer:
        "Give your family a lasting legacy: our genealogists, historians, and designers craft your bespoke calligraphed or digital family tree alongside a comprehensive family monograph. The book brings together ancestry and descendancy charts, restored vintage photographs, translated original deeds, and the historical narrative of each generation.",
      deliverables: [
        "Custom fine-art family tree (high-definition print-ready format)",
        "Family history monograph book written by our historians",
        "Digital restoration and integration of your vintage photos and deeds",
        "Standardized GEDCOM export and integration into your private Roots Tunisia workspace",
        "Personalized guidance with family video interviews",
      ],
      whatsapp_prefill:
        "Hello Roots Tunisia, I would like to create a family monograph and a custom family tree.",
    },
  },
  ar: {
    1: {
      title: "فكّ الخطوط والنسخ الباليوغرافي للوثائق القديمة",
      category: "الباليوغرافيا والترجمة",
      description:
        "نسخٌ علميّ دقيق حرفاً بحرف وترجمة معتمدة (بالعربية والفرنسية والإنجليزية) للعقود والحجج المخطوطة بالخط المغربي والتركي العثماني والإيطالي القديم واللاتيني.",
      full_offer:
        "يتولّى فريقنا من المؤرّخين وخبراء الباليوغرافيا المعتمدين دراسة وثائقكم المخطوطة القديمة (سجلات القضاة المالكية والحنفية، حجج العدول، دفاتر الأحباس، والأوامر العليّة البايليكية). ننجز نسخاً كاملاً كلمةً بكلمة مرفقاً بترجمة دقيقة وموثّقة مع شروح تاريخية وأنسابية للألقاب والأعلام والأماكن.",
      deliverables: [
        "نسخ كامل ودقيق حرفاً بحرف للمخطوط أو الحجة الأصلية",
        "ترجمة معتمدة ومشروحة (بالعربية أو الفرنسية أو الإنجليزية أو الإيطالية)",
        "هوامش تاريخية وأنسابية حول الألقاب العائلية وسلسلة النسب",
        "فحص باليوغرافي للأختام والطوابع وعلامات العدول والقضاة",
        "تسليم ملف رقمي عالي الدقة (PDF) خلال 48 إلى 72 ساعة",
      ],
      whatsapp_prefill:
        "مرحباً جذور تونس، أرغب في استشارة مجانية لفكّ خط ونسخ وثيقة مخطوطة قديمة.",
    },
    2: {
      title: "البحث الميداني المباشر بالأرشيف الوطني التونسي",
      category: "البحث الميداني في الأرشيف",
      description:
        "تكليف باحث مؤرخ معتمد في تونس (أرشيف القصبة، البلديات، المحاكم والولايات) للبحث عن الدفاتر والسجلات الورقية غير المرقمنة والتحقق منها وتصويرها.",
      full_offer:
        "هل لديكم خيط عائلي أو رمز أرشيفي غير مرقمن أو دفتر محفوظ في تونس؟ نكلّف باحثاً مختصاً بالتوجه مباشرة إلى الأرشيف الوطني التونسي (دار الباي بالقصبة) أو المحاكم أو أرشيفات البلديات في الولايات الـ 24 للاطلاع الميداني على الملفات والدفاتر الأصلية والتثبّت من النسب والتقاط صور عالية الدقة للوثائق.",
      deliverables: [
        "تنقّل ميداني لباحث مختص إلى الأرشيف الوطني (القصبة) أو الأرشيفات الجهوية",
        "صور عالية الدقة للصفحات والوثائق الأصلية والأغلفة",
        "بحث متقاطع في السلاسل التاريخية ودفاتر الأحباس ودفاتر المججبى (1860–1881)",
        "تقرير بحثي مفصّل يتضمن الرموز الأرشيفية الدقيقة والتواريخ الهجرية والميلادية",
        "بطاقة جرد واستمارة اطلاع أرشيفي رسمية",
      ],
      whatsapp_prefill:
        "مرحباً جذور تونس، أرغب في تكليف باحث لإجراء بحث ميداني في الأرشيف الوطني.",
    },
    3: {
      title: "توثيق النسب وإعداد الملف العدلي والقانوني",
      category: "توثيق الأنساب والحجج القانونية",
      description:
        "إعداد ملف إثبات نسب متكامل مدعّم بالمراجع الأرشيفية المعتمدة وسلسلة الانتقال العائلي عبر الأجيال لإجراءاتكم الرسمية والتوثيقية.",
      full_offer:
        "لإجراءاتكم العدلية أو حصر الإرث أو ملفات الجنسية أو التثبّت من الأصول التاريخية العريقة، نقوم بتكوين ملف إثبات نسب كامل وموثّق. يتم التحقق من كل جيل عبر المقاطعة الدقيقة بين رسوم الحالة المدنية وعقود الزواج العدلية وحجج الأحباس والأوقاف والدفاتر الجبائية البايليكية.",
      deliverables: [
        "ملف متكامل للحجج الوثائقية والأرشيفية لكل جيل",
        "تصديق باليوغرافي على سلسلة النسب والانتقال العائلي",
        "مشجّر نسب معتمد مرفق برموز المصادر الأرشيفية الأولية",
        "جدول مطابقة تاريخية لمختلف صيغ كتابة اللقب العائلي",
        "كتيّب توثيقي جامع للتراث العائلي بصيغة PDF",
      ],
      whatsapp_prefill:
        "مرحباً جذور تونس، أرغب في استشارة مجانية لتوثيق النسب وإعداد ملف عدلي.",
    },
    4: {
      title: "أبحاث الحالة المدنية والأرشيفات القنصلية والتجنيس",
      category: "الحالة المدنية والأرشيف القنصلي",
      description:
        "استخراج رسوم الولادة والزواج والوفاة (منذ 1886)، وملفات التجنيس (1924–1927)، والسجلات القنصلية المتوسطية (فرنسا، إيطاليا، مالطا).",
      full_offer:
        "نجري أبحاثاً معمّقة في سجلات الحالة المدنية لـ 350 بلدية تونسية وفي الأرصدة الدبلوماسية والقنصلية (أرشيف نانت، أرشيف إيكس أون بروفانس، سجلات الكنائس والأبرشيات بتونس، والأرشيفات القنصلية الإيطالية والمالطية) لإعادة بناء المسار الكامل للعائلات التي عاشت في تونس خلال القرنين التاسع عشر والعشرين.",
      deliverables: [
        "البحث في سجلات الحالة المدنية البلدية التونسية (منذ 1886)",
        "استخراج ملفات وأوامر التجنيس التاريخية (1887–1956)",
        "الاطلاع على السجلات القنصلية والرعوية (تونس، حلق الوادي، بنزرت، صفاقس، سوسة)",
        "إعادة بناء التسلسل الزمني للزيجات والولادات ومقرات السكن",
        "ملف رقمي شامل يتضمن النسخ الكاملة والنسخ المفرّغة",
      ],
      whatsapp_prefill:
        "مرحباً جذور تونس، أرغب في البحث عن وثائق حالة مدنية أو ملف تجنيس.",
    },
    5: {
      title: "دراسة أصول الألقاب العائلية والخرائط القبلية التاريخية",
      category: "علم الألقاب والخرائط التاريخية",
      description:
        "دراسة تاريخية وجغرافية معمّقة للقب العائلة (اللقب، النسبة)، وتحديد القيادة أو الكونفدرالية القبلية الأصلية ورسم خريطة المواطن التاريخية.",
      full_offer:
        "يحمل كل لقب تونسي ذاكرة أرض أو قبيلة أو حرفة بلدية في المدينة العتيقة أو هجرة متوسطية (أندلسية، موريسكية، عثمانية أو مغاربية). يقاطع مؤرخونا إحصاءات المججبى لسنة 1860 ودفاتر القيادات والمصادر التاريخية لتتبّع الجذور الجغرافية والتاريخية لاسم عائلتكم.",
      deliverables: [
        "دراسة لغوية وتاريخية شاملة للقب العائلي (النسبة، الأصل، الدلالة)",
        "تحديد القيادة التاريخية أو الوطن أو الفرع القبلي الأصلي",
        "خريطة تاريخية مخصّصة لمجالات استقرار العائلة وانتشارها",
        "كشف بذكر اللقب العائلي في الدفاتر الجبائية والحجج العدلية",
        "دراسة تاريخية مصوّرة جاهزة للمشاركة مع أفراد العائلة",
      ],
      whatsapp_prefill:
        "مرحباً جذور تونس، أرغب في طلب دراسة حول أصل اللقب العائلي والخريطة التاريخية.",
    },
    6: {
      title: "إنجاز كتاب تاريخ العائلة والمشجّر العائلي الكبير",
      category: "التأليف والمشجّرات المعتمدة",
      description:
        "تصميم شجرة عائلة فنية مخصّصة وتأليف كتاب تاريخي للعائلة موثّق بالوثائق الأرشيفية والخرائط التاريخية وتراجم الأجداد.",
      full_offer:
        "امنحوا عائلتكم إرثاً خالداً: يصمّم خبراؤنا في الأنساب والتاريخ والتصميم مشجّر عائلتكم الفني أو الرقمي إلى جانب كتاب مرجعي شامل يجمع شجرات الأصول والفروع والصور العائلية القديمة المرمّمة والوثائق الأصلية المترجمة والسرد التاريخي لكل جيل.",
      deliverables: [
        "شجرة عائلة فنية كبرى مخصّصة (عالية الدقة جاهزة للطباعة والتأطير)",
        "كتاب شامل لتاريخ العائلة من تأليف مؤرخينا",
        "ترميم رقمي ودمج لصوركم العائلية وعقودكم القديمة",
        "ملف GEDCOM قياسي ودمج الشجرة في فضائكم الخاص على جذور تونس",
        "مرافقة شخصية مع جلسات حوار عائلي عبر الفيديو",
      ],
      whatsapp_prefill:
        "مرحباً جذور تونس، أرغب في إنجاز كتاب تاريخ العائلة وتصميم شجرة عائلة كبرى.",
    },
  },
  es: {
    1: {
      title: "Descifrado Paleográfico y Transcripción de Archivos",
      category: "Paleografía y Traducción",
      description:
        "Transcripción diplomática palabra por palabra y traducción certificada (español, francés, inglés, árabe) de documentos manuscritos en árabe magrebí, turco otomano, italiano antiguo o latín eclesiástico.",
      full_offer:
        "Nuestro equipo de historiadores y paleógrafos certificados examina sus documentos antiguos manuscritos (sijillats de cadíes malikíes y hanafíes, escrituras de adoul, registros parroquiales, ketubot y decretos beylicales). Realizamos una transcripción diplomática íntegra acompañada de una traducción fiel y notas onomásticas sobre apellidos, títulos y topónimos.",
      deliverables: [
        "Transcripción íntegra palabra por palabra del manuscrito original",
        "Traducción certificada y anotada al idioma elegido",
        "Notas onomásticas e históricas sobre apellidos y filiaciones",
        "Examen paleográfico de sellos, timbres y rúbricas notariales",
        "Entrega de informe PDF en alta resolución en 48 a 72 horas",
      ],
      whatsapp_prefill:
        "Hola Roots Tunisia, deseo una consulta gratuita para un descifrado y transcripción paleográfica.",
    },
    2: {
      title: "Investigación In Situ en los Archivos Nacionales",
      category: "Investigación sobre el Terreno",
      description:
        "Mandato de un investigador acreditado en Túnez (depósito de la Kasbah, municipalidades, gobernaciones) para localizar, verificar y fotografiar registros físicos no digitalizados.",
      full_offer:
        "¿Ha identificado una pista familiar, una signatura de archivo no digitalizada o un registro físico conservado en Túnez? Enviamos a un investigador acreditado directamente a los Archivos Nacionales de Túnez (La Kasbah), tribunales regionales o archivos municipales de las 24 gobernaciones para consultar los legajos originales y fotografiar los folios en alta definición.",
      deliverables: [
        "Desplazamiento físico del investigador a los Archivos Nacionales (Kasbah) o regiones",
        "Fotografías en alta definición de los folios originales y encuadernaciones",
        "Búsqueda cruzada en series históricas, Habous y padrones de la Majba (1860–1881)",
        "Informe detallado de investigación con signaturas exactas y fechas",
        "Ficha de inventario y acta oficial de consulta archivística",
      ],
      whatsapp_prefill:
        "Hola Roots Tunisia, deseo encargar a un investigador una búsqueda in situ en los Archivos Nacionales.",
    },
    3: {
      title: "Validación de Filiación y Expediente Notarial",
      category: "Filiación y Pruebas Jurídicas",
      description:
        "Constitución de un expediente probatorio completo de filiación con referencias archivísticas certificadas y cadena de transmisión generacional para sus trámites oficiales.",
      full_offer:
        "Para sus trámites notariales, sucesiones, expedientes de nacionalidad o verificación de ascendencia histórica, constituimos un dossier de filiación completo y documentado. Cada generación se valida cruzando actas del registro civil, contratos matrimoniales de adoul, registros de Habous y padrones fiscales beylicales.",
      deliverables: [
        "Expediente completo de pruebas documentales y archivísticas por generación",
        "Validación paleográfica de la cadena de transmisión familiar",
        "Árbol de ascendencia certificado con signaturas de fuentes primarias",
        "Concordancia onomástica de las variantes ortográficas del apellido",
        "Cuaderno de síntesis patrimonial y archivística en formato PDF",
      ],
      whatsapp_prefill:
        "Hola Roots Tunisia, deseo una consulta gratuita para validación de filiación y expediente notarial.",
    },
    4: {
      title: "Investigación de Registro Civil, Consulados y Naturalizaciones",
      category: "Registro Civil y Archivos Consulares",
      description:
        "Localización y extracción de partidas de nacimiento, matrimonio y defunción (desde 1886), expedientes de naturalización (1924–1927) y registros consulares mediterráneos.",
      full_offer:
        "Realizamos búsquedas específicas en los registros civiles de los 350 municipios tunecinos y en los fondos diplomáticos y consulares (CADN Nantes, ANOM Aix-en-Provence, registros parroquiales de Túnez, archivos consulares italianos y malteses) para reconstruir la trayectoria de las familias establecidas en Túnez en los siglos XIX y XX.",
      deliverables: [
        "Búsqueda en los registros municipales de estado civil tunecino (desde 1886)",
        "Extracción de expedientes y decretos de naturalización (1887–1956)",
        "Consulta de registros consulares y parroquiales (Túnez, La Goulette, Bizerta, Sfax, Susa)",
        "Reconstrucción cronológica de matrimonios, nacimientos y domicilios",
        "Dossier digital completo con copias íntegras y transcripciones",
      ],
      whatsapp_prefill:
        "Hola Roots Tunisia, deseo buscar partidas de registro civil o un expediente de naturalización.",
    },
    5: {
      title: "Estudio de Origen de Apellidos y Cartografía Tribal",
      category: "Onomástica y Cartografía",
      description:
        "Estudio histórico y geográfico profundo de su apellido (laqab, nisba), identificación del caidato o confederación de origen y cartografía de los asentamientos históricos.",
      full_offer:
        "Cada apellido tunecino guarda la memoria de un territorio, una confederación tribal, un oficio de la Medina o una migración mediterránea (andalusí, morisca, otomana o insular). Nuestros historiadores cruzan los censos de la Majba de 1860, directorios de caidatos y crónicas regionales para trazar el arraigo geográfico e histórico de su apellido.",
      deliverables: [
        "Estudio etimológico e histórico completo del apellido (nisba, laqab, origen)",
        "Identificación del caidato histórico, outan o fracción tribal ancestral",
        "Mapa histórico personalizado de las zonas de asentamiento del linaje",
        "Relación de apariciones del apellido en registros fiscales y notariales",
        "Monografía nominativa ilustrada lista para compartir en familia",
      ],
      whatsapp_prefill:
        "Hola Roots Tunisia, deseo solicitar un estudio de origen de apellido y cartografía histórica.",
    },
    6: {
      title: "Monografía Familiar y Gran Árbol Genealógico de Arte",
      category: "Edición y Árboles Certificados",
      description:
        "Diseño de un árbol genealógico artístico a medida y redacción de un libro de historia familiar ilustrado con documentos de archivo, mapas de época y biografías.",
      full_offer:
        "Regale a su familia un legado duradero: nuestros genealogistas, historiadores y diseñadores crean su gran árbol genealógico caligrafiado o digital junto con una monografía familiar completa que reúne árboles de ascendencia y descendencia, fotografías antiguas restauradas, escrituras traducidas y el relato histórico de cada generación.",
      deliverables: [
        "Gran árbol genealógico a medida (formato artístico en alta definición listo para enmarcar)",
        "Libro-monografía de la historia familiar redactado por nuestros historiadores",
        "Restauración digital e integración de sus fotografías y documentos antiguos",
        "Exportación GEDCOM estandarizada e integración en su espacio privado Roots Tunisia",
        "Acompañamiento personalizado con entrevistas familiares por videoconferencia",
      ],
      whatsapp_prefill:
        "Hola Roots Tunisia, deseo crear una monografía familiar y un gran árbol genealógico.",
    },
  },
  it: {
    1: {
      title: "Decifrazione Paleografica e Trascrizione d'Archivio",
      category: "Paleografia e Traduzione",
      description:
        "Trascrizione diplomatica parola per parola e traduzione certificata (italiano, francese, inglese, arabo) di atti manoscritti in arabo maghrebino, turco ottomano, italiano antico o latino ecclesiastico.",
      full_offer:
        "Il nostro team di storici e paleografi certificati esamina i vostri atti manoscritti antichi (sijill dei cadì malikiti e hanafiti, atti di adoul, registri parrocchiali, ketubot e decreti beylicali). Realizziamo una trascrizione diplomatica integrale accompagnata da una traduzione fedele e note onomastiche su cognomi, titoli e toponimi.",
      deliverables: [
        "Trascrizione integrale parola per parola del manoscritto originale",
        "Traduzione certificata e annotata (italiano, francese, inglese o arabo)",
        "Note onomastiche e storiche sui cognomi e sulle filiazioni",
        "Esame paleografico di sigilli, timbri e firme notarili",
        "Consegna di un dossier PDF ad alta risoluzione entro 48-72 ore",
      ],
      whatsapp_prefill:
        "Salve Roots Tunisia, desidero una consulenza gratuita per una decifrazione e trascrizione paleografica.",
    },
    2: {
      title: "Ricerca In Situ presso gli Archivi Nazionali",
      category: "Indagine sul Campo",
      description:
        "Incarico a un ricercatore accreditato a Tunisi (deposito della Kasbah, municipi, governatorati) per rintracciare, verificare e fotografare registri e segnature fisiche non digitalizzate.",
      full_offer:
        "Avete individuato una traccia familiare, una segnatura d'archivio non digitalizzata o un registro fisico conservato in Tunisia? Incarichiamo un ricercatore abilitato direttamente presso gli Archivi Nazionali della Tunisia (La Kasbah), i tribunali regionali o gli archivi municipali dei 24 governatorati per consultare i faldoni originali e fotografare i fogli in alta definizione.",
      deliverables: [
        "Sopralluogo fisico del ricercatore presso gli Archivi Nazionali (Kasbah) o in regione",
        "Fotografie ad alta definizione dei fogli originali e delle rilegature",
        "Ricerca incrociata nelle serie storiche, Habous e ruoli della Majba (1860–1881)",
        "Rapporto di ricerca dettagliato con segnature esatte e date egiriane e gregoriane",
        "Scheda d'inventario e attestato ufficiale di consultazione archivistica",
      ],
      whatsapp_prefill:
        "Salve Roots Tunisia, desidero incaricare un ricercatore per una ricerca in situ agli Archivi Nazionali.",
    },
    3: {
      title: "Validazione di Filiazione e Fascicolo Notarile",
      category: "Filiazione e Prove Giuridiche",
      description:
        "Costituzione di un fascicolo probatorio completo di filiazione con riferimenti archivistici certificati e catena di trasmissione generazionale per le vostre pratiche ufficiali.",
      full_offer:
        "Per le vostre pratiche notarili, successioni, richieste di cittadinanza o verifiche di ascendenza storica, costituiamo un fascicolo di filiazione completo e documentato. Ogni generazione è validata incrociando atti di stato civile, contratti matrimoniali degli adoul, registri Habous e ruoli fiscali beylicali.",
      deliverables: [
        "Fascicolo completo di prove documentarie e archivistiche per ogni generazione",
        "Validazione paleografica della catena di trasmissione familiare",
        "Albero d'ascendenza certificato con segnature delle fonti primarie",
        "Concordanza onomastica delle varianti ortografiche del cognome",
        "Libretto di sintesi patrimoniale e archivistica in formato PDF",
      ],
      whatsapp_prefill:
        "Salve Roots Tunisia, desidero una consulenza gratuita per validazione di filiazione e fascicolo notarile.",
    },
    4: {
      title: "Ricerche di Stato Civile, Consolati e Naturalizzazioni",
      category: "Stato Civile e Archivi Consolari",
      description:
        "Reperimento ed estrazione di atti di nascita, matrimonio e morte (dal 1886), fascicoli di naturalizzazione (1924–1927) e registri consolari mediterranei (Italia, Francia, Malta).",
      full_offer:
        "Effettuiamo ricerche mirate nei registri di stato civile dei 350 comuni tunisini e nei fondi diplomatici e consolari (CADN Nantes, ANOM Aix-en-Provence, registri parrocchiali della Prelatura di Tunisi, archivi consolari italiani e maltesi) per ricostruire il percorso completo delle famiglie stabilitesi in Tunisia nei secoli XIX e XX.",
      deliverables: [
        "Ricerca nei registri municipali di stato civile tunisino (dal 1886)",
        "Estrazione dei fascicoli e decreti di naturalizzazione (1887–1956)",
        "Consultazione dei registri consolari e parrocchiali (Tunisi, La Goulette, Biserta, Sfax, Sousse)",
        "Ricostruzione cronologica di matrimoni, nascite e residenze",
        "Dossier digitale completo con copie integrali e trascrizioni",
      ],
      whatsapp_prefill:
        "Salve Roots Tunisia, desidero ricercare atti di stato civile o un fascicolo di naturalizzazione.",
    },
    5: {
      title: "Studio sull'Origine del Cognome e Cartografia Tribale",
      category: "Onomastica e Cartografia",
      description:
        "Studio storico e geografico approfondito del vostro cognome (laqab, nisba), identificazione del caidato o della confederazione d'origine e mappatura degli insediamenti storici.",
      full_offer:
        "Ogni cognome tunisino conserva la memoria di un territorio, di una confederazione tribale, di un'arte della Medina o di una migrazione mediterranea (andalusa, morisca, ottomana, siciliana o isolana). I nostri storici incrociano i censimenti della Majba del 1860, i repertori dei caidati e le cronache regionali per ricostruire le radici geografiche e storiche del vostro cognome.",
      deliverables: [
        "Studio etimologico e storico completo del cognome (nisba, laqab, origine)",
        "Identificazione del caidato storico, dell'outan o della frazione tribale d'origine",
        "Mappa storica personalizzata dei luoghi d'insediamento del lignaggio",
        "Elenco delle occorrenze del cognome nei registri fiscali e notarili",
        "Monografia nominativa illustrata pronta da condividere in famiglia",
      ],
      whatsapp_prefill:
        "Salve Roots Tunisia, desidero richiedere uno studio sull'origine del cognome e cartografia storica.",
    },
    6: {
      title: "Monografia Familiare e Grande Albero Genealogico d'Arte",
      category: "Editoria e Alberi Certificati",
      description:
        "Progettazione di un albero genealogico d'arte su misura e redazione di un libro di storia familiare illustrato con documenti d'archivio, mappe d'epoca e biografie degli antenati.",
      full_offer:
        "Regalate alla vostra famiglia un'eredità duratura: i nostri genealogisti, storici e grafici realizzano il vostro grande albero genealogico calligrafato o digitale insieme a una monografia familiare completa che raccoglie alberi d'ascendenza e discendenza, fotografie d'epoca restaurate, atti originali tradotti e il racconto storico di ogni generazione.",
      deliverables: [
        "Grande albero genealogico su misura (formato d'arte ad alta definizione pronto da incorniciare)",
        "Libro-monografia della storia familiare redatto dai nostri storici",
        "Restauro digitale e integrazione delle vostre fotografie e atti antichi",
        "Esportazione GEDCOM standardizzata e integrazione nel vostro spazio privato Roots Tunisia",
        "Affiancamento personalizzato con interviste familiari in videoconferenza",
      ],
      whatsapp_prefill:
        "Salve Roots Tunisia, desidero realizzare una monografia familiare e un grande albero genealogico.",
    },
  },
  mt: {
    1: {
      title: "Deċifrar Paleografiku u Traskrizzjoni tal-Arkivji",
      category: "Paleografija u Traduzzjoni",
      description:
        "Traskrizzjoni diplomatika kelma b'kelma u traduzzjoni ċċertifikata (Malti, Ingliż, Franċiż, Għarbi, Taljan) ta' atti miktuba bl-idejn bl-Għarbi Magrebini, Tork Ottoman, Taljan antik jew Latin tal-Knisja.",
      full_offer:
        "It-tim tagħna ta' storiċi u paleografi ċċertifikati jeżamina d-dokumenti antiki miktuba bl-idejn tiegħek (sijillats tal-qadis, atti nutarili tal-adoul, reġistri parrokkjali ta' Tuneż u La Goulette, ketubot u digrieti tal-Bey). Inwettqu traskrizzjoni sħiħa kelma b'kelma flimkien ma' traduzzjoni fidila u noti onomastiċi dwar il-kunjomijiet u l-postijiet.",
      deliverables: [
        "Traskrizzjoni sħiħa kelma b'kelma tal-manoskritt oriġinali",
        "Traduzzjoni ċċertifikata u annotata (Ingliż, Franċiż, Għarbi, Taljan jew Malti)",
        "Noti onomastiċi u storiċi dwar il-kunjomijiet u l-linji tal-familja",
        "Eżami paleografiku tas-siġilli, timbri u firem nutarili",
        "Kunsinna ta' rapport PDF b'riżoluzzjoni għolja fi żmien 48 sa 72 siegħa",
      ],
      whatsapp_prefill:
        "Bongu Roots Tunisia, nixtieq konsultazzjoni b'xejn għal deċifrar u traskrizzjoni paleografika.",
    },
    2: {
      title: "Riċerka In Situ fl-Arkivji Nazzjonali tat-Tuneżija",
      category: "Investigazzjoni fuq il-Post",
      description:
        "Inkariga riċerkatur akkreditat f'Tuneż (depożitu tal-Kasbah, muniċipalitajiet, gvernatorati) biex isib, jivverifika u jieħu ritratti ta' reġistri fiżiċi mhux diġitizzati.",
      full_offer:
        "Identifikajt ħjiel familjari, referenza tal-arkivju mhux diġitizzata jew reġistru fiżiku miżmum fit-Tuneżija? Aħna ninkarigaw riċerkatur awtorizzat direttament fl-Arkivji Nazzjonali tat-Tuneżija (Il-Kasbah), qrati reġjonali jew arkivji muniċipali fl-24 gvernatorat biex jikkonsulta d-dokumenti oriġinali fuq il-post u jieħu ritratti HD tal-paġni.",
      deliverables: [
        "Żjara fuq il-post minn riċerkatur fl-Arkivji Nazzjonali (Kasbah) jew fir-reġjuni",
        "Ritratti b'definizzjoni għolja (HD) tal-paġni u r-reġistri oriġinali",
        "Tfittxija fis-serje storiċi, Habous u r-reġistri tat-taxxa tal-Majba (1860–1881)",
        "Rapport ta' riċerka dettaljat bir-referenzi eżatti u d-dati",
        "Skeda ta' inventarju u konferma uffiċjali tal-konsultazzjoni",
      ],
      whatsapp_prefill:
        "Bongu Roots Tunisia, nixtieq ninkariga riċerkatur għal riċerka in situ fl-Arkivji Nazzjonali.",
    },
    3: {
      title: "Validazzjoni tal-Filiżjoni u Dossier Nutarili",
      category: "Filiżjoni u Provi Legali",
      description:
        "Tħejjija ta' dossier kompleti ta' provi tal-filiżjoni b'referenzi tal-arkivji ċċertifikati u katina ta' trażmissjoni ġenerazzjonali għall-proċeduri uffiċjali tiegħek.",
      full_offer:
        "Għall-proċeduri nutarili tiegħek, wirt, applikazzjonijiet ta' ċittadinanza jew verifika ta' antenati storiċi, aħna nħejju dossier ta' filiżjoni sħiħ u dokumentat. Kull ġenerazzjoni hija vvalidata permezz ta' tqabbil rigoruż ta' atti tal-istat ċivili, kuntratti taż-żwieġ, reġistri tal-Habous u reġistri fiskali.",
      deliverables: [
        "Dossier sħiħ ta' provi dokumentarji u arkivistiċi għal kull ġenerazzjoni",
        "Validazzjoni paleografika tal-katina ta' trażmissjoni familjari",
        "Siġra tal-antenati ċċertifikata bir-referenzi tas-sorsi primarji",
        "Konkordanza onomastika tal-varjanti tal-ispelling tal-kunjom",
        "Ktejjeb ta' sintesi patrimonjali u arkivistika f'format PDF",
      ],
      whatsapp_prefill:
        "Bongu Roots Tunisia, nixtieq konsultazzjoni b'xejn għal validazzjoni tal-filiżjoni u dossier nutarili.",
    },
    4: {
      title: "Riċerka fl-Istat Ċivili, Konsulati u Naturalizzazzjonijiet",
      category: "Stat Ċivili u Arkivji Konsulari",
      description:
        "Sejba u estrazzjoni ta' ċertifikati tat-twelid, żwieġ u mewt (mill-1886), fajls ta' naturalizzazzjoni (1924–1927) u reġistri konsulari Mediterranji (Malta, Franza, l-Italja).",
      full_offer:
        "Inwettqu riċerka mmirata fir-reġistri tal-istat ċivili tat-350 muniċipalità Tuneżina kif ukoll fil-fondi diplomatiċi u konsulari (CADN Nantes, ANOM Aix-en-Provence, reġistri parrokkjali ta' Tuneż u La Goulette, u arkivji konsulari Maltin u Taljani) biex nibnu mill-ġdid il-vjaġġ sħiħ tal-familji stabbiliti fit-Tuneżija fis-sekli 19 u 20.",
      deliverables: [
        "Tfittxija fir-reġistri muniċipali tal-istat ċivili Tuneżin (mill-1886)",
        "Estrazzjoni ta' fajls u digrieti ta' naturalizzazzjoni (1887–1956)",
        "Konsultazzjoni ta' reġistri konsulari u parrokkjali (Tuneż, La Goulette, Bizerte, Sfax, Sousse)",
        "Rikostruzzjoni kronoloġika ta' żwiġijiet, twelid u residenzi",
        "Dossier diġitali komplut b'kopji sħaħ u traskrizzjonijiet",
      ],
      whatsapp_prefill:
        "Bongu Roots Tunisia, nixtieq infittex ċertifikati tal-istat ċivili jew fajl ta' naturalizzazzjoni.",
    },
    5: {
      title: "Studju dwar l-Oriġini tal-Kunjom u Kartografija Tribali",
      category: "Onomastika u Kartografija",
      description:
        "Studju storiku u ġeografiku fil-fond tal-kunjom tiegħek (laqab, nisba), identifikazzjoni tal-caïdat jew konfederazzjoni tal-oriġini u mappa tal-postijiet storiċi.",
      full_offer:
        "Kull kunjom Tuneżin iġorr il-memorja ta' territorju, konfederazzjoni tribali, sengħa tal-Medina jew migrazzjoni Mediterranja (Andalusija, Moriska, Ottomana, Maltija jew Sqallija). L-istoriċi tagħna jqabblu ċ-ċensimenti tal-Majba tal-1860, id-direttorji tal-caïdats u l-kronaki reġjonali biex jittraċċaw l-għeruq ġeografiċi u storiċi ta' kunjomok.",
      deliverables: [
        "Studju etimoloġiku u storiku sħiħ tal-kunjom (nisba, laqab, oriġini)",
        "Identifikazzjoni tal-caïdat storiku, outan jew frazzjoni tribali tal-oriġini",
        "Mappa storika personalizzata taż-żoni fejn għexet il-familja",
        "Lista ta' fejn jidher il-kunjom fir-reġistri fiskali u nutarili",
        "Monografija illustrata lesta biex tinqasam mal-familja",
      ],
      whatsapp_prefill:
        "Bongu Roots Tunisia, nixtieq nordna studju dwar l-oriġini tal-kunjom u kartografija storika.",
    },
    6: {
      title: "Monografija tal-Familja u Siġra Ġenealoġika Artistika",
      category: "Pubblikazzjoni u Siġar Ċertifikati",
      description:
        "Disinn ta' siġra tal-familja artistika apposta u kitba ta' ktieb tal-istorja tal-familja illustrat b'dokumenti tal-arkivji, mapep storiċi u bijografiji tal-antenati.",
      full_offer:
        "Agħti lill-familja tiegħek wirt dejjiemi: il-ġenealoġisti, l-istoriċi u d-disinjaturi tagħna joħolqu s-siġra tal-familja kaligrafata jew diġitali tiegħek flimkien ma' monografija familjari sħiħa li tiġbor is-siġar tal-antenati u d-dixxendenti, ritratti antiki restawrati, atti oriġinali tradotti u r-rakkont storiku ta' kull ġenerazzjoni.",
      deliverables: [
        "Siġra tal-familja artistika kbira apposta (format HD lest għall-inkwadrar)",
        "Ktieb-monografija tal-istorja tal-familja miktub mill-istoriċi tagħna",
        "Restawr diġitali u integrazzjoni tar-ritratti u d-dokumenti antiki tiegħek",
        "Esportazzjoni GEDCOM standardizzata u integrazzjoni fl-ispazju privat tiegħek fuq Roots Tunisia",
        "Gwida personalizzata b'intervisti familjari bil-vidjo",
      ],
      whatsapp_prefill:
        "Bongu Roots Tunisia, nixtieq noħloq monografija tal-familja u siġra ġenealoġika kbira.",
    },
  },
};

function findCanonicalServiceNumber(service: CustomService): number | null {
  const numId = Number(service.id);
  if (numId >= 1 && numId <= 6) {
    // Check if slug/title matches one of the 6 canonical services
    const slug = (service.slug || "").toLowerCase();
    const title = (service.title || "").toLowerCase();
    if (slug.includes("dechiffrage") || title.includes("déchiffrage") || title.includes("paleograph")) return 1;
    if (slug.includes("in-situ") || title.includes("in situ")) return 2;
    if (slug.includes("filiation") || title.includes("filiation")) return 3;
    if (slug.includes("etat-civil") || slug.includes("naturalisation") || title.includes("état civil")) return 4;
    if (slug.includes("cartographie") || title.includes("patronymique") || title.includes("cartographie")) return 5;
    if (slug.includes("monographie") || title.includes("monographie")) return 6;
    return numId;
  }
  const slug = (service.slug || "").toLowerCase();
  const title = (service.title || "").toLowerCase();
  if (slug.includes("dechiffrage") || title.includes("déchiffrage") || title.includes("paleograph")) return 1;
  if (slug.includes("in-situ") || title.includes("in situ")) return 2;
  if (slug.includes("filiation") || title.includes("filiation")) return 3;
  if (slug.includes("etat-civil") || slug.includes("naturalisation") || title.includes("état civil")) return 4;
  if (slug.includes("cartographie") || title.includes("patronymique") || title.includes("cartographie")) return 5;
  if (slug.includes("monographie") || title.includes("monographie")) return 6;
  return null;
}

export function localizeServiceItem(service: CustomService, locale: string): CustomService {
  const cleanLoc = (locale || "fr").toLowerCase();
  const normalizedBase: CustomService = {
    ...service,
    description: service.description || (service as any).short_desc || "",
    whatsapp_prefill: service.whatsapp_prefill || (service as any).whatsapp_text || "",
  };

  if (cleanLoc === "fr") {
    return normalizedBase;
  }

  const canonicalNum = findCanonicalServiceNumber(normalizedBase);
  const locMap = LOCALIZED_SERVICES_BY_LOCALE[cleanLoc] || LOCALIZED_SERVICES_BY_LOCALE.en;
  if (canonicalNum && locMap[canonicalNum]) {
    const trans = locMap[canonicalNum];
    return {
      ...normalizedBase,
      title: trans.title,
      category: trans.category,
      description: trans.description,
      full_offer: trans.full_offer,
      deliverables: trans.deliverables,
      whatsapp_prefill: trans.whatsapp_prefill,
    };
  }

  // Fallback generic translation for any custom admin-created service beyond the 6 canonical ones
  const fallbackCategoryByLoc: Record<string, string> = {
    en: "Specialized Genealogical Service",
    ar: "خدمة جينيالوجية وأرشيفية متخصصة",
    es: "Servicio Genealógico Especializado",
    it: "Servizio Genealogico Specializzato",
    mt: "Servizz Ġenealoġiku Speċjalizzat",
  };
  return {
    ...normalizedBase,
    category: fallbackCategoryByLoc[cleanLoc] || normalizedBase.category,
  };
}

export interface ServicesPageUiLabels {
  seoTitle: string;
  seoDesc: string;
  seoKeywords: string[];
  heroEyebrow: string;
  heroTitleMain: string;
  heroTitleGold: string;
  heroSubtitle: string;
  pill1: string;
  pill2: string;
  pill3: string;
  pill4: string;
  searchPlaceholder: string;
  allCategories: string;
  loadingServices: string;
  errorLoading: string;
  retryBtn: string;
  emptyTitle: string;
  emptyDesc: string;
  resetFiltersBtn: string;
  defaultCategoryBadge: string;
  refPrefix: string;
  freeConsultationBadge: string;
  freeConsultationSub: string;
  deliverablesIncludedLabel: string;
  bookFreeConsultationCta: string;
  chatWithAgentWhatsappCta: string;
  defaultWhatsappPrefill: (title: string) => string;
  methodEyebrow: string;
  methodTitle: string;
  methodDesc: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  faqQuestionText: string;
  faqLinkCta: string;
  // Detail & Booking Page
  detailLoading: string;
  detailNotFoundTitle: string;
  detailNotFoundDesc: string;
  detailBackToServices: string;
  detailAllServicesBreadcrumb: string;
  detailRefPrefix: string;
  detailFreeBadge: string;
  detailFreeHeading: string;
  detailFreeDesc: string;
  detailCustomQuoteBadge: string;
  detailPresentationHeading: string;
  detailFullOfferHeading: string;
  detailIncludedHeading: string;
  detailNeedDirectChatTitle: string;
  detailNeedDirectChatSub: string;
  detailOrderViaWhatsappCta: string;
  detailGuarantee1Title: string;
  detailGuarantee1Sub: string;
  detailGuarantee2Title: string;
  detailGuarantee2Sub: string;
  detailGuarantee3Title: string;
  detailGuarantee3Sub: string;
  formTopBadge: string;
  formHeadingZoom: string;
  formHeadingWhatsapp: string;
  formHeadingEmail: string;
  formSubZoom: string;
  formSubWhatsapp: string;
  formSubEmail: string;
  modeZoomLabel: string;
  modeWhatsappLabel: string;
  modeEmailLabel: string;
  noUploadNoticeBold: string;
  noUploadNoticeText: (modeLabel: string) => string;
  modeShareZoom: string;
  modeShareWhatsapp: string;
  modeShareEmail: string;
  successHeading: string;
  successDescPrefix: string;
  successDescMiddle: string;
  successDescSuffix: string;
  successRefLabel: string;
  successOpenWhatsappCta: string;
  successSendAnotherBtn: string;
  labelName: string;
  placeholderName: string;
  labelEmail: string;
  placeholderEmail: string;
  labelPhone: string;
  placeholderPhone: string;
  zoomScheduleHeading: string;
  labelPreferredDate: string;
  labelTimeSlot: string;
  slotMorning: string;
  slotAfternoon: string;
  slotLateAfternoon: string;
  slotEvening: string;
  labelTargetAncestor: string;
  placeholderTargetAncestor: string;
  labelUrgency: string;
  urgencyStandard: string;
  urgencyUrgent: string;
  urgencyExpress: string;
  labelMessage: string;
  placeholderMessage: string;
  submittingText: string;
  submitZoomCta: string;
  submitWhatsappCta: string;
  submitEmailCta: string;
  formFooterDisclaimer: string;
  errMissingFields: string;
  errMissingDate: string;
  errSubmitFailed: string;
}

export const SERVICES_UI_BY_LOCALE: Record<string, ServicesPageUiLabels> = {
  fr: {
    seoTitle: "Prestations de Services Généalogiques & Paléographiques | Roots Tunisia",
    seoDesc:
      "Services sur mesure d'archives, de déchiffrage paléographique, de recherche in situ aux Archives Nationales de Tunisie et de validation de filiation.",
    seoKeywords: [
      "Généalogie Tunisie",
      "Archives Nationales Tunisie",
      "Déchiffrage manuscrit arabe",
      "Paléographie Tunisie",
      "Filiation notariée Tunisie",
      "Recherche d'ancêtres",
    ],
    heroEyebrow: "Expertise Archivistique & Paléographique",
    heroTitleMain: "Nos Prestations & Services",
    heroTitleGold: "Généalogiques",
    heroSubtitle:
      "Mandatez nos chercheurs historiens et paléographes aux Archives Nationales de Tunisie pour retrouver, transcrire et certifier l'histoire de votre lignée.",
    pill1: "Archives Nationales (Kasbah)",
    pill2: "Transcriptions Certifiées",
    pill3: "Confidentialité Totale",
    pill4: "Réponse sous 24h",
    searchPlaceholder: "Rechercher une prestation (acte, transcription, in situ, notarié)...",
    allCategories: "Toutes les Prestations",
    loadingServices: "Chargement des offres de services...",
    errorLoading: "Impossible de charger les offres de services. Veuillez réessayer.",
    retryBtn: "Réessayer",
    emptyTitle: "Aucune prestation trouvée",
    emptyDesc: "Modifiez vos critères de recherche ou réinitialisez les filtres.",
    resetFiltersBtn: "Réinitialiser les filtres",
    defaultCategoryBadge: "Prestation Spécialisée",
    refPrefix: "Réf. #",
    freeConsultationBadge: "Consultation Gratuite • Sur Devis Personnalisé",
    freeConsultationSub:
      "Échange direct gratuit avec nos généalogistes (Zoom, WhatsApp ou Email) pour étudier vos documents et recevoir votre devis.",
    deliverablesIncludedLabel: "Livrables inclus :",
    bookFreeConsultationCta: "Réserver une Consultation Gratuite",
    chatWithAgentWhatsappCta: "Échanger avec un Agent (WhatsApp)",
    defaultWhatsappPrefill: (title) =>
      `Bonjour Roots Tunisia, je souhaite commander la prestation : ${title}`,
    methodEyebrow: "Garantie de Rigueur Archivistique",
    methodTitle: "Une Méthodologie Paléographique Irréprochable",
    methodDesc:
      "Chaque transcription et chaque recherche in situ fait l'objet d'un rapport formalisé comportant les cotes précises du dépôt (Archives Nationales de Tunisie, archives diocésaines, consulats ou municipalités), des photographies haute définition des folios originaux et une notice onomastique retraçant l'origine du patronyme.",
    pillar1Title: "100% In Situ",
    pillar1Desc: "Consultation physique directe dans les dépôts de Tunis et des régions.",
    pillar2Title: "Double Lecture",
    pillar2Desc: "Vérification croisée de chaque acte par deux spécialistes paléographes.",
    pillar3Title: "Certificat Scellé",
    pillar3Desc: "Livret ou attestation reliée pour vos démarches administratives et notariales.",
    faqQuestionText:
      "Une interrogation sur nos prestations, les registres ou les démarches administratives ?",
    faqLinkCta: "Consulter la Foire Aux Questions (FAQ) complète",
    detailLoading: "Chargement de la prestation...",
    detailNotFoundTitle: "Prestation non trouvée",
    detailNotFoundDesc: "Cette offre n'existe pas ou n'est plus active.",
    detailBackToServices: "Retour aux services",
    detailAllServicesBreadcrumb: "Toutes les prestations de services",
    detailRefPrefix: "Réf. prestation #",
    detailFreeBadge: "Consultation 100% Gratuite",
    detailFreeHeading: "Étude Préalable Gratuite & Devis Personnalisé",
    detailFreeDesc:
      "Aucun paiement en ligne requis. Lors de votre échange, vous transmettrez directement vos documents (photos, manuscrits, registres) à votre chercheur dédié pour établir votre devis et votre prestation sur mesure.",
    detailCustomQuoteBadge: "Sur Devis Sur-Mesure",
    detailPresentationHeading: "Présentation de la prestation",
    detailFullOfferHeading: "Détails complets de l'offre & Déroulement",
    detailIncludedHeading: "Ce qui est inclus dans votre commande :",
    detailNeedDirectChatTitle: "Besoin d'un échange préalable direct ?",
    detailNeedDirectChatSub: "Contactez immédiatement notre chercheur sur WhatsApp.",
    detailOrderViaWhatsappCta: "Commander via WhatsApp",
    detailGuarantee1Title: "Archives Officielles",
    detailGuarantee1Sub: "Cotes physiques exactes",
    detailGuarantee2Title: "Confidentialité",
    detailGuarantee2Sub: "Données familiales protégées",
    detailGuarantee3Title: "Réponse Rapide",
    detailGuarantee3Sub: "Prise en charge sous 24h",
    formTopBadge: "Consultation 100% Gratuite • Sur Devis",
    formHeadingZoom: "Planifier votre Appel Zoom Gratuit",
    formHeadingWhatsapp: "Consulter un Agent via WhatsApp",
    formHeadingEmail: "Demander une Consultation par Email",
    formSubZoom: "Choisissez la date et l'heure de votre visioconférence avec nos généalogistes.",
    formSubWhatsapp:
      "Échange direct avec un chercheur de Roots Tunisia pour faire le point sur vos recherches.",
    formSubEmail:
      "Recevez par retour d'email notre étude préliminaire et votre devis sur-mesure.",
    modeZoomLabel: "Appel Zoom",
    modeWhatsappLabel: "WhatsApp",
    modeEmailLabel: "Par Email",
    noUploadNoticeBold: "Aucun fichier à téléverser sur le site :",
    noUploadNoticeText: (modeLabel) =>
      `vous présenterez ou transmettrez directement vos photos d'actes, manuscrits et documents à votre chercheur généalogiste lors de votre consultation (${modeLabel}). Un devis sur-mesure vous sera alors établi.`,
    modeShareZoom: "partage d'écran Zoom",
    modeShareWhatsapp: "discussion WhatsApp",
    modeShareEmail: "échange d'emails",
    successHeading: "Demande de Consultation Enregistrée !",
    successDescPrefix: "Merci",
    successDescMiddle:
      "Votre demande a été transmise à notre équipe de chercheurs. Nous allons prendre contact avec vous via",
    successDescSuffix: "pour votre étude préalable gratuite.",
    successRefLabel: "Référence :",
    successOpenWhatsappCta: "Ouvrir la discussion WhatsApp avec ma référence",
    successSendAnotherBtn: "Envoyer une autre demande pour cette prestation",
    labelName: "Votre Nom & Prénom",
    placeholderName: "Ex: Karim Ben Salem",
    labelEmail: "Email",
    placeholderEmail: "votre@email.com",
    labelPhone: "Téléphone / WhatsApp",
    placeholderPhone: "+216 98 123 456",
    zoomScheduleHeading: "Planification de votre Visioconférence Zoom",
    labelPreferredDate: "Date Souhaitée",
    labelTimeSlot: "Créneau Horaire",
    slotMorning: "Matin",
    slotAfternoon: "Après-midi",
    slotLateAfternoon: "Fin de journée",
    slotEvening: "Soirée",
    labelTargetAncestor: "Ancêtre ciblé ou Référence de la famille (Optionnel)",
    placeholderTargetAncestor: "Ex: Hedi Fourati, né vers 1880 à Sfax / tribunal charaïque...",
    labelUrgency: "Délai souhaité pour votre démarche",
    urgencyStandard: "Standard (7-15 jours)",
    urgencyUrgent: "Urgent (48-72h)",
    urgencyExpress: "Express / Prioritaire",
    labelMessage: "Votre besoin & ce que vous attendez de nous",
    placeholderMessage:
      "Décrivez votre besoin : quel acte déchiffrer, quelle commune ou registre rechercher, quelles dates ou indices possédez-vous... Lors de votre échange, vous présenterez vos pièces directement au chercheur.",
    submittingText: "Enregistrement de votre demande...",
    submitZoomCta: "Confirmer mon Appel Zoom Gratuit",
    submitWhatsappCta: "Démarrer ma Consultation WhatsApp Gratuite",
    submitEmailCta: "Demander mon Étude & Devis Gratuit par Email",
    formFooterDisclaimer:
      "Étude de faisabilité et consultation 100% gratuites sans engagement. Devis personnalisé remis après examen.",
    errMissingFields:
      "Veuillez renseigner votre nom, email, téléphone et les détails de votre besoin pour la consultation gratuite.",
    errMissingDate: "Veuillez choisir une date souhaitée pour votre appel Zoom.",
    errSubmitFailed:
      "Erreur lors de l'enregistrement de votre consultation. Veuillez réessayer.",
  },
  en: {
    seoTitle: "Genealogical & Paleographic Services | Roots Tunisia",
    seoDesc:
      "Bespoke archival services, paleographic deciphering, on-site research at the National Archives of Tunisia, and certified lineage validation.",
    seoKeywords: [
      "Tunisia genealogy",
      "National Archives of Tunisia",
      "Arabic manuscript deciphering",
      "Tunisia paleography",
      "Certified Tunisian lineage",
      "Ancestor research Tunisia",
    ],
    heroEyebrow: "Archival & Paleographic Expertise",
    heroTitleMain: "Our Genealogical",
    heroTitleGold: "Services & Research",
    heroSubtitle:
      "Commission our historians and paleographers at the National Archives of Tunisia to locate, transcribe, and certify the history of your family lineage.",
    pill1: "National Archives (Kasbah)",
    pill2: "Certified Transcriptions",
    pill3: "Total Confidentiality",
    pill4: "24h Response Time",
    searchPlaceholder: "Search for a service (deed, transcription, on-site, notarial)...",
    allCategories: "All Services",
    loadingServices: "Loading genealogical services...",
    errorLoading: "Unable to load services at this time. Please try again.",
    retryBtn: "Retry",
    emptyTitle: "No services found",
    emptyDesc: "Adjust your search criteria or reset the category filters.",
    resetFiltersBtn: "Reset Filters",
    defaultCategoryBadge: "Specialized Service",
    refPrefix: "Ref. #",
    freeConsultationBadge: "Free Consultation • Custom Tailored Quote",
    freeConsultationSub:
      "Free direct consultation with our genealogists (Zoom, WhatsApp, or Email) to review your documents and receive a personalized quote.",
    deliverablesIncludedLabel: "Included Deliverables:",
    bookFreeConsultationCta: "Book a Free Consultation",
    chatWithAgentWhatsappCta: "Chat with an Archivist (WhatsApp)",
    defaultWhatsappPrefill: (title) =>
      `Hello Roots Tunisia, I would like to book a consultation for: ${title}`,
    methodEyebrow: "Archival Rigor Guarantee",
    methodTitle: "An Impeccable Paleographic Methodology",
    methodDesc:
      "Every transcription and on-site search is accompanied by a formal report containing exact repository call numbers (National Archives of Tunisia, diocesan archives, consulates, or municipalities), high-definition photographs of original folios, and an onomastic notice tracing the origin of the surname.",
    pillar1Title: "100% On-Site",
    pillar1Desc: "Direct physical consultation in repositories in Tunis and across all regions.",
    pillar2Title: "Dual Review",
    pillar2Desc: "Cross-verification of every historical record by two specialist paleographers.",
    pillar3Title: "Sealed Certificate",
    pillar3Desc: "Bound booklet or certified dossier for your administrative and family records.",
    faqQuestionText:
      "Have a question about our services, archival registers, or administrative procedures?",
    faqLinkCta: "Read the Complete Frequently Asked Questions (FAQ)",
    detailLoading: "Loading service details...",
    detailNotFoundTitle: "Service not found",
    detailNotFoundDesc: "This service offer does not exist or is no longer active.",
    detailBackToServices: "Back to services",
    detailAllServicesBreadcrumb: "All genealogical services",
    detailRefPrefix: "Service Ref. #",
    detailFreeBadge: "100% Free Consultation",
    detailFreeHeading: "Free Preliminary Study & Custom Quote",
    detailFreeDesc:
      "No online payment required. During your consultation, you will share your documents (photos, manuscripts, certificates) directly with your dedicated researcher to establish a tailored quote.",
    detailCustomQuoteBadge: "Custom Quote",
    detailPresentationHeading: "Service Overview",
    detailFullOfferHeading: "Full Offer Details & Workflow",
    detailIncludedHeading: "What is included in your order:",
    detailNeedDirectChatTitle: "Need a direct preliminary chat?",
    detailNeedDirectChatSub: "Contact our lead researcher immediately on WhatsApp.",
    detailOrderViaWhatsappCta: "Inquire via WhatsApp",
    detailGuarantee1Title: "Official Archives",
    detailGuarantee1Sub: "Exact physical call numbers",
    detailGuarantee2Title: "Confidentiality",
    detailGuarantee2Sub: "Protected family data",
    detailGuarantee3Title: "Fast Response",
    detailGuarantee3Sub: "Reviewed within 24 hours",
    formTopBadge: "100% Free Consultation • Custom Quote",
    formHeadingZoom: "Schedule Your Free Zoom Call",
    formHeadingWhatsapp: "Consult an Archivist via WhatsApp",
    formHeadingEmail: "Request a Consultation by Email",
    formSubZoom: "Choose the date and time for your video consultation with our genealogists.",
    formSubWhatsapp:
      "Direct conversation with a Roots Tunisia researcher to review your family research.",
    formSubEmail: "Receive our preliminary feasibility study and custom quote by email.",
    modeZoomLabel: "Zoom Call",
    modeWhatsappLabel: "WhatsApp",
    modeEmailLabel: "By Email",
    noUploadNoticeBold: "No files to upload on the website:",
    noUploadNoticeText: (modeLabel) =>
      `you will present or send your photos of deeds, manuscripts, and certificates directly to your genealogist during your consultation (${modeLabel}). A tailored quote will then be prepared for you.`,
    modeShareZoom: "Zoom screen sharing",
    modeShareWhatsapp: "WhatsApp chat",
    modeShareEmail: "email exchange",
    successHeading: "Consultation Request Registered!",
    successDescPrefix: "Thank you",
    successDescMiddle:
      "Your request has been forwarded to our research team. We will contact you via",
    successDescSuffix: "for your free preliminary study.",
    successRefLabel: "Reference:",
    successOpenWhatsappCta: "Open WhatsApp chat with my reference",
    successSendAnotherBtn: "Submit another request for this service",
    labelName: "Your Full Name",
    placeholderName: "e.g., Karim Ben Salem",
    labelEmail: "Email Address",
    placeholderEmail: "your@email.com",
    labelPhone: "Phone / WhatsApp",
    placeholderPhone: "+216 98 123 456",
    zoomScheduleHeading: "Schedule Your Zoom Video Call",
    labelPreferredDate: "Preferred Date",
    labelTimeSlot: "Time Slot",
    slotMorning: "Morning",
    slotAfternoon: "Afternoon",
    slotLateAfternoon: "Late Afternoon",
    slotEvening: "Evening",
    labelTargetAncestor: "Target Ancestor or Family Reference (Optional)",
    placeholderTargetAncestor: "e.g., Hedi Fourati, born c. 1880 in Sfax / Sharia court...",
    labelUrgency: "Desired Turnaround Time",
    urgencyStandard: "Standard (7–15 days)",
    urgencyUrgent: "Urgent (48–72h)",
    urgencyExpress: "Express / Priority",
    labelMessage: "Your Research Need & Expectations",
    placeholderMessage:
      "Describe what you need: which deed to decipher, which municipality or register to search, what dates or clues you have... You will share your documents directly with the researcher during your consultation.",
    submittingText: "Registering your request...",
    submitZoomCta: "Confirm My Free Zoom Call",
    submitWhatsappCta: "Start My Free WhatsApp Consultation",
    submitEmailCta: "Request My Free Study & Quote by Email",
    formFooterDisclaimer:
      "100% free feasibility study and consultation with no obligation. Personalized quote provided after review.",
    errMissingFields:
      "Please enter your name, email, phone number, and research details for the free consultation.",
    errMissingDate: "Please select a preferred date for your Zoom call.",
    errSubmitFailed: "An error occurred while saving your consultation request. Please try again.",
  },
  ar: {
    seoTitle: "خدمات الأنساب والباليوغرافيا والأرشيف | جذور تونس",
    seoDesc:
      "خدمات أرشيفية مخصّصة، فكّ الخطوط والنسخ الباليوغرافي، البحث الميداني في الأرشيف الوطني التونسي، وتوثيق شجرات الأنساب.",
    seoKeywords: [
      "الأنساب في تونس",
      "الأرشيف الوطني التونسي",
      "فك المخطوطات العربية",
      "الباليوغرافيا التونسية",
      "توثيق النسب والحجج",
      "البحث عن الأجداد في تونس",
    ],
    heroEyebrow: "خبرة أرشيفية وباليوغرافية معتمدة",
    heroTitleMain: "خدماتنا وأبحاثنا",
    heroTitleGold: "الجينيالوجية والأرشيفية",
    heroSubtitle:
      "كلّفوا باحثينا المؤرخين وخبراء الباليوغرافيا في الأرشيف الوطني التونسي بالبحث عن وثائق عائلتكم ونسخها وتوثيق تاريخ سلالتكم.",
    pill1: "الأرشيف الوطني (القصبة)",
    pill2: "نسخ وترجمة معتمدة",
    pill3: "سرية وخصوصية تامة",
    pill4: "ردّ خلال 24 ساعة",
    searchPlaceholder: "ابحث عن خدمة (فكّ خط، نسخ، بحث ميداني، توثيق نسب، حالة مدنية)...",
    allCategories: "جميع الخدمات",
    loadingServices: "جاري تحميل عروض الخدمات الأرشيفية...",
    errorLoading: "تعذّر تحميل عروض الخدمات حالياً. يرجى المحاولة مرة أخرى.",
    retryBtn: "إعادة المحاولة",
    emptyTitle: "لم يتم العثور على أي خدمة",
    emptyDesc: "قم بتعديل كلمات البحث أو إعادة ضبط فلاتر التصنيف.",
    resetFiltersBtn: "إعادة ضبط الفلاتر",
    defaultCategoryBadge: "خدمة أرشيفية متخصصة",
    refPrefix: "مرجع #",
    freeConsultationBadge: "استشارة مجانية • عرض سعر مخصّص",
    freeConsultationSub:
      "تواصل مباشر ومجاني مع خبرائنا في الأنساب (عبر زووم أو واتساب أو البريد الإلكتروني) لدراسة وثائقكم وتقديم عرض سعر مفصّل.",
    deliverablesIncludedLabel: "المخرجات والوثائق المتضمّنة :",
    bookFreeConsultationCta: "احجز استشارة مجانية",
    chatWithAgentWhatsappCta: "تحدث مع باحث مختص (واتساب)",
    defaultWhatsappPrefill: (title) =>
      `مرحباً جذور تونس، أرغب في طلب استشارة مجانية بخصوص خدمة : ${title}`,
    methodEyebrow: "ضمان الدقة والصرامة الأرشيفية",
    methodTitle: "منهجية باليوغرافية وتوثيقية معتمدة",
    methodDesc:
      "تخضع كل عملية نسخ أو بحث ميداني لتقرير علمي مفصّل يتضمن الرموز الأرشيفية الدقيقة للمركز (الأرشيف الوطني التونسي، الأرشيفات البلدية، القنصليات أو المحاكم)، وصوراً عالية الدقة للوثائق الأصلية، ومذكرة تاريخية حول أصل اللقب العائلي.",
    pillar1Title: "100% بحث ميداني",
    pillar1Desc: "اطلاع مباشر وميداني في مراكز الأرشيف بتونس العاصمة ومختلف الولايات.",
    pillar2Title: "مراجعة مزدوجة",
    pillar2Desc: "تدقيق متقاطع لكل وثيقة وعقد قديم من طرف خبيرين مختصين في الباليوغرافيا.",
    pillar3Title: "شهادة وملف موثّق",
    pillar3Desc: "كتيّب توثيقي أو شهادة بحث أرشيفي معتمدة لإجراءاتكم الإدارية والعائلية.",
    faqQuestionText:
      "هل لديكم استفسار حول خدماتنا أو السجلات الأرشيفية أو الإجراءات الإدارية؟",
    faqLinkCta: "تصفّح صفحة الأسئلة الشائعة (FAQ) الكاملة",
    detailLoading: "جاري تحميل تفاصيل الخدمة...",
    detailNotFoundTitle: "الخدمة غير موجودة",
    detailNotFoundDesc: "هذا العرض غير موجود أو لم يعد متاحاً حالياً.",
    detailBackToServices: "العودة إلى قائمة الخدمات",
    detailAllServicesBreadcrumb: "جميع الخدمات الأرشيفية والجينيالوجية",
    detailRefPrefix: "مرجع الخدمة #",
    detailFreeBadge: "استشارة مجانية 100%",
    detailFreeHeading: "دراسة أولية مجانية وعرض سعر مخصّص",
    detailFreeDesc:
      "لا يتطلب أي دفع عبر الإنترنت. خلال تواصلكم معنا، ستشاركون وثائقكم (صور عقود، مخطوطات، دفاتر عائلية) مباشرة مع الباحث المختص لإعداد عرض سعر يناسب طلبكم بدقة.",
    detailCustomQuoteBadge: "حسب الطلب",
    detailPresentationHeading: "تقديم الخدمة الأرشيفية",
    detailFullOfferHeading: "التفاصيل الكاملة للعرض ومراحل الإنجاز",
    detailIncludedHeading: "ما يتضمّنه طلبكم :",
    detailNeedDirectChatTitle: "هل ترغبون في تواصل فوري مباشر؟",
    detailNeedDirectChatSub: "تواصلوا الآن مع الباحث المختص عبر واتساب.",
    detailOrderViaWhatsappCta: "تواصل عبر واتساب",
    detailGuarantee1Title: "أرشيفات رسمية",
    detailGuarantee1Sub: "رموز ومراجع أرشيفية دقيقة",
    detailGuarantee2Title: "سرية تامة",
    detailGuarantee2Sub: "حماية كاملة للبيانات العائلية",
    detailGuarantee3Title: "استجابة سريعة",
    detailGuarantee3Sub: "دراسة الطلب خلال 24 ساعة",
    formTopBadge: "استشارة مجانية 100% • دراسة أولية",
    formHeadingZoom: "حجز مكالمة فيديو مجانية عبر زووم (Zoom)",
    formHeadingWhatsapp: "استشارة باحث مختص عبر واتساب",
    formHeadingEmail: "طلب استشارة ودراسة عبر البريد الإلكتروني",
    formSubZoom: "اختر التاريخ والتوقيت المناسبين لمكالمة الفيديو مع خبرائنا في الأنساب.",
    formSubWhatsapp: "تواصل مباشر مع باحث من جذور تونس لمناقشة وثائقكم وأبحاثكم العائلية.",
    formSubEmail: "احصلوا عبر البريد الإلكتروني على دراسة الجدوى الأولية وعرض السعر المخصّص.",
    modeZoomLabel: "مكالمة زووم",
    modeWhatsappLabel: "واتساب",
    modeEmailLabel: "بريد إلكتروني",
    noUploadNoticeBold: "لا حاجة لرفع أي ملفات على الموقع :",
    noUploadNoticeText: (modeLabel) =>
      `يمكنكم عرض أو إرسال صور العقود والمخطوطات والوثائق مباشرة إلى الباحث المختص أثناء الاستشارة (${modeLabel})، ليتم إعداد عرض سعر مخصّص لكم.`,
    modeShareZoom: "مشاركة الشاشة عبر زووم",
    modeShareWhatsapp: "محادثة واتساب",
    modeShareEmail: "تبادل الرسائل الإلكترونية",
    successHeading: "تم تسجيل طلب الاستشارة بنجاح!",
    successDescPrefix: "شكراً لك",
    successDescMiddle: "تم إحالة طلبكم إلى فريق الباحثين لدينا. سنتواصل معكم قريباً عبر",
    successDescSuffix: "لإجراء الدراسة الأولية المجانية.",
    successRefLabel: "رقم المرجع :",
    successOpenWhatsappCta: "فتح محادثة واتساب برقم مرجعي",
    successSendAnotherBtn: "إرسال طلب آخر لهذه الخدمة",
    labelName: "الاسم واللقب الكامل",
    placeholderName: "مثال: كريم بن سالم",
    labelEmail: "البريد الإلكتروني",
    placeholderEmail: "your@email.com",
    labelPhone: "رقم الهاتف / واتساب",
    placeholderPhone: "+216 98 123 456",
    zoomScheduleHeading: "تحديد موعد مكالمة الفيديو عبر زووم (Zoom)",
    labelPreferredDate: "التاريخ المفضّل",
    labelTimeSlot: "الفترة الزمنية",
    slotMorning: "صباحاً",
    slotAfternoon: "بعد الظهر",
    slotLateAfternoon: "مساءً",
    slotEvening: "ليلاً",
    labelTargetAncestor: "الجدّ المستهدف أو اسم العائلة والمنطقة (اختياري)",
    placeholderTargetAncestor: "مثال: الهادي الفراتي، مولود حوالي 1880 بصفاقس / المحكمة الشرعية...",
    labelUrgency: "الآجال المطلوبة لإنجاز البحث",
    urgencyStandard: "عادي (7–15 يوماً)",
    urgencyUrgent: "مستعجل (48–72 ساعة)",
    urgencyExpress: "أولوية قصوى / فوري",
    labelMessage: "تفاصيل طلبكم والوثائق المطلوب بحثها أو نسخها",
    placeholderMessage:
      "اشرحوا لنا حاجتكم: ما هي الوثيقة المراد فكّ خطها، أو البلدية والدفتر المراد البحث فيه، وما هي التواريخ أو القرائن المتوفرة لديكم...",
    submittingText: "جاري تسجيل طلبكم...",
    submitZoomCta: "تأكيد حجز مكالمة زووم المجانية",
    submitWhatsappCta: "بدء الاستشارة المجانية عبر واتساب",
    submitEmailCta: "طلب الدراسة وعرض السعر المجاني عبر البريد",
    formFooterDisclaimer:
      "دراسة الجدوى والاستشارة الأولية مجانية 100% دون أي التزام. يتم تقديم عرض السعر المخصّص بعد فحص الطلب.",
    errMissingFields:
      "يرجى إدخال الاسم والبريد الإلكتروني ورقم الهاتف وتفاصيل الطلب للاستفادة من الاستشارة المجانية.",
    errMissingDate: "يرجى اختيار التاريخ المفضّل لمكالمة زووم.",
    errSubmitFailed: "حدث خطأ أثناء تسجيل طلب الاستشارة. يرجى المحاولة مرة أخرى.",
  },
  es: {
    seoTitle: "Servicios Genealógicos y Paleográficos | Roots Tunisia",
    seoDesc:
      "Servicios a medida de archivos, descifrado paleográfico, investigación in situ en los Archivos Nacionales de Túnez y validación de filiación.",
    seoKeywords: [
      "Genealogía Túnez",
      "Archivos Nacionales de Túnez",
      "Descifrado manuscritos árabes",
      "Paleografía Túnez",
      "Filiación notarial Túnez",
      "Búsqueda de antepasados",
    ],
    heroEyebrow: "Experiencia Archivística y Paleográfica",
    heroTitleMain: "Nuestros Servicios",
    heroTitleGold: "Genealógicos",
    heroSubtitle:
      "Encargue a nuestros historiadores y paleógrafos en los Archivos Nacionales de Túnez la búsqueda, transcripción y certificación de la historia de su linaje.",
    pill1: "Archivos Nacionales (Kasbah)",
    pill2: "Transcripciones Certificadas",
    pill3: "Confidencialidad Total",
    pill4: "Respuesta en 24h",
    searchPlaceholder: "Buscar un servicio (acta, transcripción, in situ, notarial)...",
    allCategories: "Todos los Servicios",
    loadingServices: "Cargando ofertas de servicios...",
    errorLoading: "No se pudieron cargar las ofertas de servicios. Inténtelo de nuevo.",
    retryBtn: "Reintentar",
    emptyTitle: "No se encontraron servicios",
    emptyDesc: "Modifique sus criterios de búsqueda o restablezca los filtros.",
    resetFiltersBtn: "Restablecer filtros",
    defaultCategoryBadge: "Servicio Especializado",
    refPrefix: "Ref. #",
    freeConsultationBadge: "Consulta Gratuita • Presupuesto Personalizado",
    freeConsultationSub:
      "Intercambio directo gratuito con nuestros genealogistas (Zoom, WhatsApp o Email) para estudiar sus documentos y recibir su presupuesto.",
    deliverablesIncludedLabel: "Entregables incluidos:",
    bookFreeConsultationCta: "Reservar una Consulta Gratuita",
    chatWithAgentWhatsappCta: "Hablar con un Agente (WhatsApp)",
    defaultWhatsappPrefill: (title) =>
      `Hola Roots Tunisia, deseo solicitar el servicio: ${title}`,
    methodEyebrow: "Garantía de Rigor Archivístico",
    methodTitle: "Una Metodología Paleográfica Impecable",
    methodDesc:
      "Cada transcripción y cada investigación in situ es objeto de un informe formalizado con las signaturas exactas del depósito (Archivos Nacionales de Túnez, archivos diocesanos, consulados o municipalidades), fotografías en alta definición de los folios originales y una nota onomástica sobre el origen del apellido.",
    pillar1Title: "100% In Situ",
    pillar1Desc: "Consulta física directa en los depósitos de Túnez y de las regiones.",
    pillar2Title: "Doble Lectura",
    pillar2Desc: "Verificación cruzada de cada acta por dos especialistas paleógrafos.",
    pillar3Title: "Certificado Sellado",
    pillar3Desc: "Cuaderno o certificado encuadernado para sus trámites administrativos y notariales.",
    faqQuestionText:
      "¿Tiene alguna pregunta sobre nuestros servicios, los registros o los trámites administrativos?",
    faqLinkCta: "Consultar las Preguntas Frecuentes (FAQ) completas",
    detailLoading: "Cargando el servicio...",
    detailNotFoundTitle: "Servicio no encontrado",
    detailNotFoundDesc: "Esta oferta no existe o ya no está activa.",
    detailBackToServices: "Volver a los servicios",
    detailAllServicesBreadcrumb: "Todos los servicios genealógicos",
    detailRefPrefix: "Ref. servicio #",
    detailFreeBadge: "Consulta 100% Gratuita",
    detailFreeHeading: "Estudio Previo Gratuito y Presupuesto Personalizado",
    detailFreeDesc:
      "No se requiere pago en línea. Durante su consulta, transmitirá directamente sus documentos (fotos, manuscritos, registros) a su investigador dedicado para establecer su presupuesto a medida.",
    detailCustomQuoteBadge: "Presupuesto a Medida",
    detailPresentationHeading: "Presentación del servicio",
    detailFullOfferHeading: "Detalles completos de la oferta y desarrollo",
    detailIncludedHeading: "Qué está incluido en su pedido:",
    detailNeedDirectChatTitle: "¿Necesita una consulta previa directa?",
    detailNeedDirectChatSub: "Contacte inmediatamente con nuestro investigador por WhatsApp.",
    detailOrderViaWhatsappCta: "Consultar por WhatsApp",
    detailGuarantee1Title: "Archivos Oficiales",
    detailGuarantee1Sub: "Signaturas físicas exactas",
    detailGuarantee2Title: "Confidencialidad",
    detailGuarantee2Sub: "Datos familiares protegidos",
    detailGuarantee3Title: "Respuesta Rápida",
    detailGuarantee3Sub: "Atención en menos de 24h",
    formTopBadge: "Consulta 100% Gratuita • Presupuesto a Medida",
    formHeadingZoom: "Programar su Llamada Zoom Gratuita",
    formHeadingWhatsapp: "Consultar a un Agente por WhatsApp",
    formHeadingEmail: "Solicitar una Consulta por Email",
    formSubZoom: "Elija la fecha y hora de su videoconferencia con nuestros genealogistas.",
    formSubWhatsapp:
      "Conversación directa con un investigador de Roots Tunisia para analizar sus búsquedas.",
    formSubEmail:
      "Reciba por correo electrónico nuestro estudio preliminar y su presupuesto a medida.",
    modeZoomLabel: "Llamada Zoom",
    modeWhatsappLabel: "WhatsApp",
    modeEmailLabel: "Por Email",
    noUploadNoticeBold: "No es necesario subir archivos al sitio web:",
    noUploadNoticeText: (modeLabel) =>
      `presentará o enviará directamente sus fotos de actas, manuscritos y documentos a su investigador genealogista durante su consulta (${modeLabel}). Se le preparará un presupuesto a medida.`,
    modeShareZoom: "pantalla compartida en Zoom",
    modeShareWhatsapp: "chat de WhatsApp",
    modeShareEmail: "intercambio de correos",
    successHeading: "¡Solicitud de Consulta Registrada!",
    successDescPrefix: "Gracias",
    successDescMiddle:
      "Su solicitud ha sido transmitida a nuestro equipo de investigadores. Nos pondremos en contacto con usted vía",
    successDescSuffix: "para su estudio previo gratuito.",
    successRefLabel: "Referencia:",
    successOpenWhatsappCta: "Abrir chat de WhatsApp con mi referencia",
    successSendAnotherBtn: "Enviar otra solicitud para este servicio",
    labelName: "Su Nombre y Apellidos",
    placeholderName: "Ej: Karim Ben Salem",
    labelEmail: "Correo Electrónico",
    placeholderEmail: "su@email.com",
    labelPhone: "Teléfono / WhatsApp",
    placeholderPhone: "+216 98 123 456",
    zoomScheduleHeading: "Programación de su Videoconferencia Zoom",
    labelPreferredDate: "Fecha Deseada",
    labelTimeSlot: "Franja Horaria",
    slotMorning: "Mañana",
    slotAfternoon: "Tarde",
    slotLateAfternoon: "Final de la tarde",
    slotEvening: "Noche",
    labelTargetAncestor: "Antepasado buscado o Referencia familiar (Opcional)",
    placeholderTargetAncestor: "Ej: Hedi Fourati, nacido hacia 1880 en Sfax / tribunal...",
    labelUrgency: "Plazo deseado para su trámite",
    urgencyStandard: "Estándar (7-15 días)",
    urgencyUrgent: "Urgente (48-72h)",
    urgencyExpress: "Exprés / Prioritario",
    labelMessage: "Su necesidad y lo que espera de nosotros",
    placeholderMessage:
      "Describa su necesidad: qué acta descifrar, qué municipio o registro buscar, qué fechas o pistas posee...",
    submittingText: "Registrando su solicitud...",
    submitZoomCta: "Confirmar mi Llamada Zoom Gratuita",
    submitWhatsappCta: "Iniciar mi Consulta WhatsApp Gratuita",
    submitEmailCta: "Solicitar mi Estudio y Presupuesto Gratuito por Email",
    formFooterDisclaimer:
      "Estudio de viabilidad y consulta 100% gratuitos sin compromiso. Presupuesto personalizado entregado tras el examen.",
    errMissingFields:
      "Por favor complete su nombre, email, teléfono y los detalles de su necesidad para la consulta gratuita.",
    errMissingDate: "Por favor elija una fecha deseada para su llamada Zoom.",
    errSubmitFailed: "Error al registrar su consulta. Por favor inténtelo de nuevo.",
  },
  it: {
    seoTitle: "Servizi Genealogici e Paleografici | Roots Tunisia",
    seoDesc:
      "Servizi su misura d'archivio, decifrazione paleografica, ricerca in situ presso gli Archivi Nazionali della Tunisia e validazione di filiazione.",
    seoKeywords: [
      "Genealogia Tunisia",
      "Archivi Nazionali della Tunisia",
      "Decifrazione manoscritti arabi",
      "Paleografia Tunisia",
      "Filiazione notarile Tunisia",
      "Ricerca antenati Tunisia",
    ],
    heroEyebrow: "Competenza Archivistica e Paleografica",
    heroTitleMain: "I Nostri Servizi",
    heroTitleGold: "Genealogici",
    heroSubtitle:
      "Incaricate i nostri storici e paleografi presso gli Archivi Nazionali della Tunisia di ritrovare, trascrivere e certificare la storia del vostro lignaggio.",
    pill1: "Archivi Nazionali (Kasbah)",
    pill2: "Trascrizioni Certificate",
    pill3: "Riservatezza Totale",
    pill4: "Risposta entro 24h",
    searchPlaceholder: "Cerca un servizio (atto, trascrizione, in situ, notarile)...",
    allCategories: "Tutti i Servizi",
    loadingServices: "Caricamento delle offerte di servizi...",
    errorLoading: "Impossibile caricare le offerte di servizi. Riprova.",
    retryBtn: "Riprova",
    emptyTitle: "Nessun servizio trovato",
    emptyDesc: "Modifica i criteri di ricerca o reimposta i filtri.",
    resetFiltersBtn: "Reimposta filtri",
    defaultCategoryBadge: "Servizio Specializzato",
    refPrefix: "Rif. #",
    freeConsultationBadge: "Consulenza Gratuita • Preventivo Personalizzato",
    freeConsultationSub:
      "Colloquio diretto gratuito con i nostri genealogisti (Zoom, WhatsApp o Email) per esaminare i vostri documenti e ricevere un preventivo.",
    deliverablesIncludedLabel: "Elaborati inclusi:",
    bookFreeConsultationCta: "Prenota una Consulenza Gratuita",
    chatWithAgentWhatsappCta: "Parla con un Archivista (WhatsApp)",
    defaultWhatsappPrefill: (title) =>
      `Salve Roots Tunisia, desidero richiedere il servizio: ${title}`,
    methodEyebrow: "Garanzia di Rigore Archivistico",
    methodTitle: "Una Metodologia Paleografica Impeccabile",
    methodDesc:
      "Ogni trascrizione e ogni ricerca in situ è oggetto di un rapporto formale recante le segnature esatte del deposito (Archivi Nazionali della Tunisia, archivi diocesani, consolati o municipi), fotografie ad alta definizione dei fogli originali e una nota onomastica sull'origine del cognome.",
    pillar1Title: "100% In Situ",
    pillar1Desc: "Consultazione fisica diretta nei depositi di Tunisi e delle regioni.",
    pillar2Title: "Doppia Lettura",
    pillar2Desc: "Verifica incrociata di ogni atto da parte di due specialisti paleografi.",
    pillar3Title: "Certificato Sigillato",
    pillar3Desc: "Fascicolo o attestato rilegato per le vostre pratiche amministrative e notarili.",
    faqQuestionText:
      "Una domanda sui nostri servizi, sui registri o sulle pratiche amministrative?",
    faqLinkCta: "Consulta le Domande Frequenti (FAQ) complete",
    detailLoading: "Caricamento del servizio...",
    detailNotFoundTitle: "Servizio non trovato",
    detailNotFoundDesc: "Questa offerta non esiste o non è più attiva.",
    detailBackToServices: "Torna ai servizi",
    detailAllServicesBreadcrumb: "Tutti i servizi genealogici",
    detailRefPrefix: "Rif. servizio #",
    detailFreeBadge: "Consulenza 100% Gratuita",
    detailFreeHeading: "Studio Preliminare Gratuito e Preventivo Personalizzato",
    detailFreeDesc:
      "Nessun pagamento online richiesto. Durante il colloquio trasmetterete direttamente i vostri documenti (foto, manoscritti, registri) al ricercatore dedicato per stabilire il preventivo su misura.",
    detailCustomQuoteBadge: "Su Preventivo",
    detailPresentationHeading: "Presentazione del servizio",
    detailFullOfferHeading: "Dettagli completi dell'offerta e svolgimento",
    detailIncludedHeading: "Cosa è incluso nel vostro ordine:",
    detailNeedDirectChatTitle: "Bisogno di un colloquio preliminare diretto?",
    detailNeedDirectChatSub: "Contatta immediatamente il nostro ricercatore su WhatsApp.",
    detailOrderViaWhatsappCta: "Richiedi via WhatsApp",
    detailGuarantee1Title: "Archivi Ufficiali",
    detailGuarantee1Sub: "Segnature fisiche esatte",
    detailGuarantee2Title: "Riservatezza",
    detailGuarantee2Sub: "Dati familiari protetti",
    detailGuarantee3Title: "Risposta Rapida",
    detailGuarantee3Sub: "Presa in carico entro 24h",
    formTopBadge: "Consulenza 100% Gratuita • Su Preventivo",
    formHeadingZoom: "Pianifica la tua Chiamata Zoom Gratuita",
    formHeadingWhatsapp: "Consulta un Archivista via WhatsApp",
    formHeadingEmail: "Richiedi una Consulenza via Email",
    formSubZoom: "Scegli la data e l'ora della tua videoconferenza con i nostri genealogisti.",
    formSubWhatsapp:
      "Colloquio diretto con un ricercatore di Roots Tunisia per fare il punto sulle tue ricerche.",
    formSubEmail:
      "Ricevi via email il nostro studio preliminare e il tuo preventivo personalizzato.",
    modeZoomLabel: "Chiamata Zoom",
    modeWhatsappLabel: "WhatsApp",
    modeEmailLabel: "Via Email",
    noUploadNoticeBold: "Nessun file da caricare sul sito:",
    noUploadNoticeText: (modeLabel) =>
      `presenterai o invierai direttamente le foto di atti, manoscritti e documenti al tuo ricercatore genealogista durante la consulenza (${modeLabel}). Ti verrà quindi preparato un preventivo su misura.`,
    modeShareZoom: "condivisione schermo Zoom",
    modeShareWhatsapp: "chat WhatsApp",
    modeShareEmail: "scambio di email",
    successHeading: "Richiesta di Consulenza Registrata!",
    successDescPrefix: "Grazie",
    successDescMiddle:
      "La tua richiesta è stata trasmessa al nostro team di ricercatori. Ti contatteremo tramite",
    successDescSuffix: "per il tuo studio preliminare gratuito.",
    successRefLabel: "Riferimento:",
    successOpenWhatsappCta: "Apri la chat WhatsApp con il mio riferimento",
    successSendAnotherBtn: "Invia un'altra richiesta per questo servizio",
    labelName: "Nome e Cognome",
    placeholderName: "Es: Karim Ben Salem",
    labelEmail: "Email",
    placeholderEmail: "tua@email.com",
    labelPhone: "Telefono / WhatsApp",
    placeholderPhone: "+216 98 123 456",
    zoomScheduleHeading: "Pianificazione della Videoconferenza Zoom",
    labelPreferredDate: "Data Desiderata",
    labelTimeSlot: "Fascia Oraria",
    slotMorning: "Mattina",
    slotAfternoon: "Pomeriggio",
    slotLateAfternoon: "Tardo pomeriggio",
    slotEvening: "Sera",
    labelTargetAncestor: "Antenato cercato o Riferimento familiare (Opzionale)",
    placeholderTargetAncestor: "Es: Hedi Fourati, nato verso il 1880 a Sfax / tribunale...",
    labelUrgency: "Tempistica desiderata",
    urgencyStandard: "Standard (7-15 giorni)",
    urgencyUrgent: "Urgente (48-72h)",
    urgencyExpress: "Express / Prioritario",
    labelMessage: "La tua esigenza e cosa ti aspetti da noi",
    placeholderMessage:
      "Descrivi la tua esigenza: quale atto decifrare, quale comune o registro cercare, quali date o indizi possiedi...",
    submittingText: "Registrazione della richiesta...",
    submitZoomCta: "Conferma la mia Chiamata Zoom Gratuita",
    submitWhatsappCta: "Avvia la mia Consulenza WhatsApp Gratuita",
    submitEmailCta: "Richiedi Studio e Preventivo Gratuito via Email",
    formFooterDisclaimer:
      "Studio di fattibilità e consulenza 100% gratuiti senza impegno. Preventivo personalizzato fornito dopo l'esame.",
    errMissingFields:
      "Inserisci nome, email, telefono e i dettagli della tua richiesta per la consulenza gratuita.",
    errMissingDate: "Scegli una data desiderata per la chiamata Zoom.",
    errSubmitFailed: "Errore durante la registrazione della consulenza. Riprova.",
  },
  mt: {
    seoTitle: "Servizzi Ġenealoġiċi u Paleografiċi | Roots Tunisia",
    seoDesc:
      "Servizzi mfassla apposta ta' arkivji, deċifrar paleografiku, riċerka in situ fl-Arkivji Nazzjonali tat-Tuneżija u validazzjoni tal-filiżjoni.",
    seoKeywords: [
      "Ġenealoġija Tuneżija",
      "Arkivji Nazzjonali tat-Tuneżija",
      "Deċifrar ta' manuskritti Għarab",
      "Paleografija Tuneżija",
      "Filiżjoni nutarili Tuneżija",
      "Riċerka tal-antenati",
    ],
    heroEyebrow: "Kompetenza Arkivistika u Paleografika",
    heroTitleMain: "Is-Servizzi u r-Riċerka",
    heroTitleGold: "Ġenealoġiċi Tagħna",
    heroSubtitle:
      "Inkariga lill-istoriċi u l-paleografi tagħna fl-Arkivji Nazzjonali tat-Tuneżija biex isibu, jittraskrivu u jiċċertifikaw l-istorja tal-familja tiegħek.",
    pill1: "Arkivji Nazzjonali (Kasbah)",
    pill2: "Traskrizzjonijiet Ċertifikati",
    pill3: "Kunfidenzjalità Totali",
    pill4: "Tweġiba fi 24 siegħa",
    searchPlaceholder: "Fittex servizz (att, traskrizzjoni, in situ, nutarili)...",
    allCategories: "Is-Servizzi Kollha",
    loadingServices: "Qed jitgħabbew is-servizzi ġenealoġiċi...",
    errorLoading: "Ma setgħux jitgħabbew is-servizzi. Jekk jogħġbok erġa' pprova.",
    retryBtn: "Erġa' pprova",
    emptyTitle: "L-ebda servizz ma nstab",
    emptyDesc: "Immodifika l-kriterji tat-tfittxija jew irrisettja l-filtri.",
    resetFiltersBtn: "Irrisettja l-filtri",
    defaultCategoryBadge: "Servizz Speċjalizzat",
    refPrefix: "Ref. #",
    freeConsultationBadge: "Konsultazzjoni B'Xejn • Kwotazzjoni Personalizzata",
    freeConsultationSub:
      "Skambju dirett b'xejn mal-ġenealoġisti tagħna (Zoom, WhatsApp jew Email) biex nistudjaw id-dokumenti tiegħek u tirċievi l-kwotazzjoni tiegħek.",
    deliverablesIncludedLabel: "Dak li hu inkluż:",
    bookFreeConsultationCta: "Ibbukkja Konsultazzjoni B'Xejn",
    chatWithAgentWhatsappCta: "Kellem Aġent (WhatsApp)",
    defaultWhatsappPrefill: (title) =>
      `Bonġu Roots Tunisia, nixtieq nistaqsi dwar is-servizz: ${title}`,
    methodEyebrow: "Garanzija ta' Rigorożità Arkivistika",
    methodTitle: "Metodoloġija Paleografika Impekkabbli",
    methodDesc:
      "Kull traskrizzjoni u kull riċerka in situ hija akkumpanjata minn rapport formali bir-referenzi eżatti tad-depożitu (l-Arkivji Nazzjonali tat-Tuneżija, arkivji djoċesani, konsulati jew muniċipalitajiet), ritratti b'definizzjoni għolja tal-paġni oriġinali u nota onomastika dwar l-oriġini tal-kunjom.",
    pillar1Title: "100% In Situ",
    pillar1Desc: "Konsultazzjoni fiżika diretta fid-depożiti ta' Tuneż u tar-reġjuni.",
    pillar2Title: "Qari Doppju",
    pillar2Desc: "Verifika inkroċjata ta' kull att minn żewġ speċjalisti paleografi.",
    pillar3Title: "Ċertifikat Issiġillat",
    pillar3Desc: "Ktejjeb jew ċertifikat marbut għall-proċeduri amministrattivi u nutarili tiegħek.",
    faqQuestionText:
      "Għandek mistoqsija dwar is-servizzi tagħna, ir-reġistri jew il-proċeduri amministrattivi?",
    faqLinkCta: "Ikkonsulta l-Mistoqsijiet Frekwenti (FAQ) kollha",
    detailLoading: "Qed jitgħabba s-servizz...",
    detailNotFoundTitle: "Servizz mhux misjub",
    detailNotFoundDesc: "Din l-offerta ma teżistix jew m'għadhiex attiva.",
    detailBackToServices: "Lura għas-servizzi",
    detailAllServicesBreadcrumb: "Is-servizzi ġenealoġiċi kollha",
    detailRefPrefix: "Ref. servizz #",
    detailFreeBadge: "Konsultazzjoni 100% B'Xejn",
    detailFreeHeading: "Studju Preliminari B'Xejn u Kwotazzjoni Personalizzata",
    detailFreeDesc:
      "L-ebda ħlas onlajn mhu meħtieġ. Waqt il-konsultazzjoni tiegħek, tibgħat direttament id-dokumenti tiegħek (ritratti, manoskritti, reġistri) lir-riċerkatur dedikat tiegħek biex titħejja l-kwotazzjoni apposta.",
    detailCustomQuoteBadge: "Kwotazzjoni Apposta",
    detailPresentationHeading: "Preżentazzjoni tas-servizz",
    detailFullOfferHeading: "Dettalji sħaħ tal-offerta u l-proċess",
    detailIncludedHeading: "X'inhu inkluż fl-ordni tiegħek:",
    detailNeedDirectChatTitle: "Għandek bżonn tkellem riċerkatur direttament?",
    detailNeedDirectChatSub: "Ikkuntattja lir-riċerkatur tagħna immedjatament fuq WhatsApp.",
    detailOrderViaWhatsappCta: "Ikkuntattja fuq WhatsApp",
    detailGuarantee1Title: "Arkivji Uffiċjali",
    detailGuarantee1Sub: "Referenzi fiżiċi eżatti",
    detailGuarantee2Title: "Kunfidenzjalità",
    detailGuarantee2Sub: "Data tal-familja protetta",
    detailGuarantee3Title: "Tweġiba Mgħaġġla",
    detailGuarantee3Sub: "Meħuda f'idejna fi 24 siegħa",
    formTopBadge: "Konsultazzjoni 100% B'Xejn • Kwotazzjoni Apposta",
    formHeadingZoom: "Ippjana s-Sejħa Zoom B'Xejn Tiegħek",
    formHeadingWhatsapp: "Kellem Aġent fuq WhatsApp",
    formHeadingEmail: "Itlob Konsultazzjoni bl-Email",
    formSubZoom: "Agħżel id-data u l-ħin għall-vidjokonferenza tiegħek mal-ġenealoġisti tagħna.",
    formSubWhatsapp:
      "Skambju dirett ma' riċerkatur ta' Roots Tunisia biex tiddiskuti r-riċerka tiegħek.",
    formSubEmail:
      "Irċievi bl-email l-istudju preliminari tagħna u l-kwotazzjoni personalizzata tiegħek.",
    modeZoomLabel: "Sejħa Zoom",
    modeWhatsappLabel: "WhatsApp",
    modeEmailLabel: "Bl-Email",
    noUploadNoticeBold: "L-ebda fajl m'għandu jittella' fuq is-sit:",
    noUploadNoticeText: (modeLabel) =>
      `int turi jew tibgħat direttament ir-ritratti tal-atti, manoskritti u dokumenti tiegħek lir-riċerkatur ġenealoġista waqt il-konsultazzjoni tiegħek (${modeLabel}). Imbagħad titħejja kwotazzjoni mfassla għalik.`,
    modeShareZoom: "qsim tal-iskrin fuq Zoom",
    modeShareWhatsapp: "chat fuq WhatsApp",
    modeShareEmail: "skambju ta' emails",
    successHeading: "It-Talba għall-Konsultazzjoni Ġiet Irreġistrata!",
    successDescPrefix: "Grazzi",
    successDescMiddle:
      "It-talba tiegħek intbagħtet lit-tim ta' riċerkaturi tagħna. Se nikkuntattjawk permezz ta'",
    successDescSuffix: "għall-istudju preliminari b'xejn tiegħek.",
    successRefLabel: "Referenza:",
    successOpenWhatsappCta: "Iftaħ iċ-chat ta' WhatsApp bir-referenza tiegħi",
    successSendAnotherBtn: "Ibgħat talba oħra għal dan is-servizz",
    labelName: "Ismek u Kunjomok",
    placeholderName: "Eż: Karim Ben Salem",
    labelEmail: "Email",
    placeholderEmail: "tieghek@email.com",
    labelPhone: "Telefon / WhatsApp",
    placeholderPhone: "+216 98 123 456",
    zoomScheduleHeading: "Skedar tal-Vidjokonferenza Zoom Tiegħek",
    labelPreferredDate: "Data Mixtieqa",
    labelTimeSlot: "Ħin Mixtieq",
    slotMorning: "Filgħodu",
    slotAfternoon: "Wara nofsinhar",
    slotLateAfternoon: "Tard wara nofsinhar",
    slotEvening: "Filgħaxija",
    labelTargetAncestor: "Antenat imfittex jew Referenza tal-familja (Mhux obbligatorju)",
    placeholderTargetAncestor: "Eż: Hedi Fourati, imwieled madwar l-1880 fi Sfax...",
    labelUrgency: "Żmien mixtieq",
    urgencyStandard: "Standard (7-15-il jum)",
    urgencyUrgent: "Urġenti (48-72 siegħa)",
    urgencyExpress: "Express / Prijoritarju",
    labelMessage: "Il-bżonn tiegħek u x'tistenna minna",
    placeholderMessage:
      "Iddeskrivi l-bżonn tiegħek: liema att trid tiddeċifra, liema muniċipalità jew reġistru trid tfittex, liema dati jew ħjiel għandek...",
    submittingText: "Qed tiġi rreġistrata t-talba tiegħek...",
    submitZoomCta: "Ikkonferma s-Sejħa Zoom B'Xejn Tiegħi",
    submitWhatsappCta: "Ibda l-Konsultazzjoni WhatsApp B'Xejn Tiegħi",
    submitEmailCta: "Itlob l-Istudju u l-Kwotazzjoni B'Xejn bl-Email",
    formFooterDisclaimer:
      "Studju ta' fattibbiltà u konsultazzjoni 100% b'xejn mingħajr impenn. Kwotazzjoni personalizzata tingħata wara l-eżami.",
    errMissingFields:
      "Jekk jogħġbok daħħal ismek, l-email, it-telefon u d-dettalji tal-bżonn tiegħek għall-konsultazzjoni b'xejn.",
    errMissingDate: "Jekk jogħġbok agħżel data mixtieqa għas-sejħa Zoom tiegħek.",
    errSubmitFailed: "Żball waqt ir-reġistrazzjoni tal-konsultazzjoni tiegħek. Erġa' pprova.",
  },
};

