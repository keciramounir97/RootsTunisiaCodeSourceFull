export type SubscriptionLocale = "fr" | "en" | "ar" | "es" | "it" | "mt";

const SUPPORTED: readonly SubscriptionLocale[] = ["fr", "en", "ar", "es", "it", "mt"];

export function cleanSubscriptionLocale(rawLocale: string): SubscriptionLocale {
  const clean = (rawLocale || "fr").toLowerCase().split("-")[0];
  return (SUPPORTED as readonly string[]).includes(clean)
    ? (clean as SubscriptionLocale)
    : "fr";
}

function normalizeTextKey(raw: string): string {
  return String(raw || "")
    .trim()
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

const DEFAULT_TIER_NAMES: Record<number, Record<SubscriptionLocale, string>> = {
  1: {
    fr: "Découverte Patrimoine",
    en: "Heritage Discovery",
    ar: "استكشاف التراث",
    es: "Descubrimiento del Patrimonio",
    it: "Scoperta del Patrimonio",
    mt: "Skoperta tal-Wirt",
  },
  2: {
    fr: "Chercheur & Actes",
    en: "Researcher & Records",
    ar: "باحث والوثائق المدنية",
    es: "Investigador y Actas",
    it: "Ricercatore e Atti",
    mt: "Riċerkatur u Reġistri",
  },
  3: {
    fr: "Historien Pro",
    en: "Historian Pro",
    ar: "مؤرخ محترف",
    es: "Historiador Pro",
    it: "Storico Pro",
    mt: "Storiku Pro",
  },
};

const KNOWN_TIER_NAMES: Record<string, Record<SubscriptionLocale, string>> = {
  "decouverte patrimoine": DEFAULT_TIER_NAMES[1],
  "découverte patrimoine": DEFAULT_TIER_NAMES[1],
  basic: DEFAULT_TIER_NAMES[1],
  "heritage discovery": DEFAULT_TIER_NAMES[1],
  "chercheur & actes": DEFAULT_TIER_NAMES[2],
  premium: DEFAULT_TIER_NAMES[2],
  "researcher & records": DEFAULT_TIER_NAMES[2],
  "historien pro": DEFAULT_TIER_NAMES[3],
  "historien & généalogie pro": {
    fr: "Historien & Généalogie Pro",
    en: "Historian & Genealogy Pro",
    ar: "مؤرخ وأنساب محترف",
    es: "Historiador y Genealogía Pro",
    it: "Storico e Genealogia Pro",
    mt: "Storiku u Ġenealoġija Pro",
  },
  "family historian": DEFAULT_TIER_NAMES[3],
  "historian pro": DEFAULT_TIER_NAMES[3],
};

const DEFAULT_TIER_BADGES: Record<number, Record<SubscriptionLocale, string>> = {
  1: {
    fr: "Accès Gratuit",
    en: "Free Access",
    ar: "وصول مجاني",
    es: "Acceso Gratuito",
    it: "Accesso Gratuito",
    mt: "Aċċess B'xejn",
  },
  2: {
    fr: "Recommandé — Actes & Registres",
    en: "Recommended — Records & Registers",
    ar: "موصى به — الوثائق والسجلات",
    es: "Recomendado — Actas y Registros",
    it: "Consigliato — Atti e Registri",
    mt: "Rakkomandat — Atti u Reġistri",
  },
  3: {
    fr: "Recherche Avancée & Expert",
    en: "Advanced Research & Expert",
    ar: "بحث متقدم وإرشاد خبير",
    es: "Investigación Avanzada y Experto",
    it: "Ricerca Avanzata ed Esperto",
    mt: "Riċerka Avvanzata u Espert",
  },
};

const KNOWN_TIER_BADGES: Record<string, Record<SubscriptionLocale, string>> = {
  "accès gratuit": DEFAULT_TIER_BADGES[1],
  "gratuit pour démarrer": {
    fr: "Gratuit pour démarrer",
    en: "Free to start",
    ar: "مجاني للبدء",
    es: "Gratis para empezar",
    it: "Gratis per iniziare",
    mt: "B'xejn biex tibda",
  },
  "recommandé - actes & registres": DEFAULT_TIER_BADGES[2],
  "le plus populaire - actes & registres": {
    fr: "Le Plus Populaire — Actes & Registres",
    en: "Most Popular — Records & Registers",
    ar: "الأكثر شعبية — الوثائق والسجلات",
    es: "Más Popular — Actas y Registros",
    it: "Più Popolare — Atti e Registri",
    mt: "L-Aktar Popolari — Atti u Reġistri",
  },
  "accès aux actes & registres": {
    fr: "Accès aux actes & registres",
    en: "Access to records & registers",
    ar: "الوصول إلى الوثائق والسجلات",
    es: "Acceso a actas y registros",
    it: "Accesso ad atti e registri",
    mt: "Aċċess għal atti u reġistri",
  },
  "recherche avancée & expert": DEFAULT_TIER_BADGES[3],
  "recherche avancée & assistance dédiée": {
    fr: "Recherche Avancée & Assistance Dédiée",
    en: "Advanced Research & Dedicated Assistance",
    ar: "بحث متقدم ومرافقة مخصصة",
    es: "Investigación Avanzada y Asistencia Dedicada",
    it: "Ricerca Avanzata e Assistenza Dedicata",
    mt: "Riċerka Avvanzata u Għajnuna Ddedikata",
  },
  "assistance & recherche avancée": {
    fr: "Assistance & recherche avancée",
    en: "Assistance & advanced research",
    ar: "مرافقة وبحث متقدم",
    es: "Asistencia e investigación avanzada",
    it: "Assistenza e ricerca avanzata",
    mt: "Għajnuna u riċerka avvanzata",
  },
};

const DEFAULT_TIER_DESCRIPTIONS: Record<number, Record<SubscriptionLocale, string>> = {
  1: {
    fr: "Visualisation d’arbres, répertoires des fonds d’archives et import/export GEDCOM.",
    en: "Interactive tree visualization, archive repository directories, and GEDCOM import/export.",
    ar: "عرض شجرات العائلة التفاعلية، وأدلة الأرشيفات التونسية، واستيراد وتصدير ملفات GEDCOM.",
    es: "Visualización de árboles, repertorios de fondos de archivo e importación/exportación GEDCOM.",
    it: "Visualizzazione degli alberi, repertori dei fondi d'archivio e import/export GEDCOM.",
    mt: "Viżwalizzazzjoni ta' siġar tal-familja, direttorji tal-arkivji u importazzjoni/esportazzjoni GEDCOM.",
  },
  2: {
    fr: "Accès complet aux actes d’état civil numérisés, registres paroissiaux et décrets de naturalisation (1924–1927).",
    en: "Full access to digitized civil records, parish registers, and naturalization decrees (1924–1927).",
    ar: "وصول كامل لوثائق الحالة المدنية المرقمنة، والسجلات الكنسية، ومراسيم التجنيس (1924–1927).",
    es: "Acceso completo a actas civiles digitalizadas, registros parroquiales y decretos de naturalización (1924–1927).",
    it: "Accesso completo agli atti di stato civile digitalizzati, registri parrocchiali e decreti di naturalizzazione (1924–1927).",
    mt: "Aċċess sħiħ għal reġistri ċivili diġitizzati, reġistri parrokkjali u digrieti ta' naturalizzazzjoni (1924–1927).",
  },
  3: {
    fr: "Assistance aux recherches ciblées en dépôts, déchiffrage paléographique et suivi personnalisé.",
    en: "Targeted archival repository research assistance, paleographic decipherment, and personalized guidance.",
    ar: "مرافقة في الأبحاث الميدانية بالأرشيف، وفك الخطوط القديمة، ومتابعة بحثية مخصصة.",
    es: "Asistencia en búsquedas dirigidas en archivos, descifrado paleográfico y seguimiento personalizado.",
    it: "Assistenza per ricerche mirate in archivio, decifrazione paleografica e supporto personalizzato.",
    mt: "Għajnuna għal riċerka mmirata fl-arkivji, deċifrar paleografiku u segwitu personalizzat.",
  },
};

const KNOWN_TIER_DESCRIPTIONS: Record<string, Record<SubscriptionLocale, string>> = {
  "visualisation d'arbres, répertoires des fonds d'archives et import/export gedcom.":
    DEFAULT_TIER_DESCRIPTIONS[1],
  "visualisation d'arbres généalogiques, consultation des répertoires de fonds d'archives et import/export gedcom.": {
    fr: "Visualisation d’arbres généalogiques, consultation des répertoires de fonds d’archives et import/export GEDCOM.",
    en: "Family tree visualization, browsing archival repository directories, and standard GEDCOM import/export.",
    ar: "عرض شجرات العائلة، وتصفح أدلة أرصدة الأرشيف، واستيراد وتصدير ملفات GEDCOM.",
    es: "Visualización de árboles genealógicos, consulta de repertorios de archivos e importación/exportación GEDCOM.",
    it: "Visualizzazione di alberi genealogici, consultazione dei repertori archivistici e import/export GEDCOM.",
    mt: "Viżwalizzazzjoni ta' siġar tal-familja, konsultazzjoni tad-direttorji tal-arkivji u importazzjoni/esportazzjoni GEDCOM.",
  },
  "visualisation d'arbres et répertoires d'archives.": DEFAULT_TIER_DESCRIPTIONS[1],
  "accès complet aux actes d'état civil numérisés, registres paroissiaux et décrets de naturalisation (1924-1927).":
    DEFAULT_TIER_DESCRIPTIONS[2],
  "accès complet aux actes d'état civil, registres paroissiaux, sijillats notariés et décrets de naturalisation (1924-1927).": {
    fr: "Accès complet aux actes d’état civil, registres paroissiaux, sijillats notariés et décrets de naturalisation (1924–1927).",
    en: "Full access to civil status records, parish registers, notarial sijillat, and naturalization decrees (1924–1927).",
    ar: "وصول كامل لوثائق الحالة المدنية، والسجلات الكنسية، والسجلات العدلية، ومراسيم التجنيس (1924–1927).",
    es: "Acceso completo a actas del registro civil, registros parroquiales, sijillat notariales y decretos de naturalización (1924–1927).",
    it: "Accesso completo agli atti di stato civile, registri parrocchiali, sijillat notarili e decreti di naturalizzazione (1924–1927).",
    mt: "Aċċess sħiħ għal atti ċivili, reġistri parrokkjali, sijillat notarili u digrieti ta' naturalizzazzjoni (1924–1927).",
  },
  "accès complet aux actes d'état civil numérisés.": DEFAULT_TIER_DESCRIPTIONS[2],
  "assistance aux recherches ciblées en dépôts, déchiffrage paléographique et suivi personnalisé.":
    DEFAULT_TIER_DESCRIPTIONS[3],
  "assistance aux recherches ciblées, déchiffrage de manuscrits (arabe, ottoman, italien) et accès prioritaire aux nouveaux fonds.": {
    fr: "Assistance aux recherches ciblées, déchiffrage de manuscrits (arabe, ottoman, italien) et accès prioritaire aux nouveaux fonds.",
    en: "Targeted archival research assistance, manuscript decipherment (Arabic, Ottoman, Italian), and priority access to new holdings.",
    ar: "مرافقة في الأبحاث الميدانية، وفك رموز المخطوطات (العربية والعثمانية والإيطالية)، وأولوية الوصول إلى الأرصدة الجديدة.",
    es: "Asistencia en búsquedas dirigidas, descifrado de manuscritos (árabe, otomano, italiano) y acceso prioritario a nuevos fondos.",
    it: "Assistenza per ricerche mirate, decifrazione di manoscritti (arabo, ottomano, italiano) e accesso prioritario ai nuovi fondi.",
    mt: "Għajnuna għal riċerka mmirata, deċifrar ta' manuskritti (Għarbi, Ottoman, Taljan) u aċċess prijoritarju għal fondi ġodda.",
  },
  "assistance aux recherches ciblées et paléographie.": DEFAULT_TIER_DESCRIPTIONS[3],
};

const KNOWN_FEATURE_BULLETS: Record<string, Record<SubscriptionLocale, string>> = {
  // Tier 1 bullets (fallback + live API variants)
  "visualisation interactive d'arbres généalogiques (2d/3d)": {
    fr: "Visualisation interactive d’arbres généalogiques (2D/3D)",
    en: "Interactive 2D/3D family tree visualization",
    ar: "عرض تفاعلي ثنائي وثلاثي الأبعاد لشجرات العائلة",
    es: "Visualización interactiva de árboles genealógicos (2D/3D)",
    it: "Visualizzazione interattiva di alberi genealogici (2D/3D)",
    mt: "Viżwalizzazzjoni interattiva ta' siġar tal-familja (2D/3D)",
  },
  "arbres généalogiques interactifs & visualisation 2d/3d": {
    fr: "Arbres généalogiques interactifs & visualisation 2D/3D",
    en: "Interactive family trees & 2D/3D visualization",
    ar: "شجرات عائلة تفاعلية وعرض ثنائي وثلاثي الأبعاد",
    es: "Árboles genealógicos interactivos y visualización 2D/3D",
    it: "Alberi genealogici interattivi e visualizzazione 2D/3D",
    mt: "Siġar tal-familja interattivi u viżwalizzazzjoni 2D/3D",
  },
  "inventaires des 19 grands fonds d'archives tunisiens": {
    fr: "Inventaires des 19 grands fonds d’archives tunisiens",
    en: "Inventories of the 19 major Tunisian archive repositories",
    ar: "فهارس وأدلة 19 رصيداً أرشيفياً تونسياً رئيسياً",
    es: "Inventarios de los 19 grandes fondos de archivo tunecinos",
    it: "Inventari dei 19 principali fondi archivistici tunisini",
    mt: "Inventarji tad-19-il fond ewlieni tal-arkivji Tuneżini",
  },
  "inventaires et guides des 19 grands fonds d'archives tunisiens": {
    fr: "Inventaires et guides des 19 grands fonds d'archives tunisiens",
    en: "Inventories and guides of the 19 major Tunisian archive holdings",
    ar: "فهارس وأدلة 19 رصيداً أرشيفياً تونسياً رئيسياً",
    es: "Inventarios y guías de los 19 grandes fondos de archivo tunecinos",
    it: "Inventari e guide dei 19 principali fondi archivistici tunisini",
    mt: "Inventarji u gwidi tad-19-il fond ewlieni tal-arkivji Tuneżini",
  },
  "importation et exportation gedcom standard": {
    fr: "Importation et exportation GEDCOM standard",
    en: "Standard GEDCOM import & export",
    ar: "استيراد وتصدير قياسي بصيغة GEDCOM",
    es: "Importación y exportación GEDCOM estándar",
    it: "Importazione ed esportazione GEDCOM standard",
    mt: "Importazzjoni u esportazzjoni standard ta' GEDCOM",
  },
  "importation et exportation gedcom 5.5.1 standard": {
    fr: "Importation et exportation GEDCOM 5.5.1 standard",
    en: "Standard GEDCOM 5.5.1 import & export",
    ar: "استيراد وتصدير قياسي بصيغة GEDCOM 5.5.1",
    es: "Importación y exportación estándar GEDCOM 5.5.1",
    it: "Importazione ed esportazione standard GEDCOM 5.5.1",
    mt: "Importazzjoni u esportazzjoni standard GEDCOM 5.5.1",
  },
  "fiches d'individus et repères chronologiques": {
    fr: "Fiches d’individus et repères chronologiques",
    en: "Individual profiles & historical timeline markers",
    ar: "بطاقات الأفراد والمعالم الزمنية التاريخية",
    es: "Fichas individuales y referencias cronológicas",
    it: "Schede individuali e riferimenti cronologici",
    mt: "Skedi tal-individwi u punti kronoloġiċi",
  },
  "fiches récapitulatives des individus et repères chronologiques": {
    fr: "Fiches récapitulatives des individus et repères chronologiques",
    en: "Summary individual sheets & chronological markers",
    ar: "بطاقات تلخيصية للأفراد ومعالم زمنية",
    es: "Fichas resumen de individuos y referencias cronológicas",
    it: "Schede riepilogative degli individui e riferimenti cronologici",
    mt: "Skedi sommarji tal-individwi u punti kronoloġiċi",
  },
  "accès libre à la communauté et aux récits d'histoire": {
    fr: "Accès libre à la communauté et aux récits d’histoire",
    en: "Open access to the community & historical stories",
    ar: "وصول حر للمجتمع والروايات التاريخية",
    es: "Acceso libre a la comunidad y relatos históricos",
    it: "Accesso libero alla community e ai racconti storici",
    mt: "Aċċess ħieles għall-komunità u r-rakkonti storiċi",
  },
  "accès libre à la communauté des chercheurs et passionnés": {
    fr: "Accès libre à la communauté des chercheurs et passionnés",
    en: "Free access to the community of researchers & enthusiasts",
    ar: "وصول مفتوح لمجتمع الباحثين والمهتمين بالأنساب",
    es: "Acceso libre a la comunidad de investigadores y apasionados",
    it: "Accesso libero alla community di ricercatori e appassionati",
    mt: "Aċċess ħieles għall-komunità ta' riċerkaturi u dilettanti",
  },

  // Tier 2 bullets (fallback + live API variants)
  "tout ce qui est inclus dans découverte": {
    fr: "Tout ce qui est inclus dans Découverte",
    en: "Everything included in Heritage Discovery",
    ar: "كل ما هو مشمول في باقة استكشاف التراث",
    es: "Todo lo incluido en Descubrimiento",
    it: "Tutto ciò che è incluso in Scoperta",
    mt: "Dak kollu inkluż f'Skoperta tal-Wirt",
  },
  "consultation & téléchargement hd des actes d'état civil numérisés": {
    fr: "Consultation & téléchargement HD des actes d’état civil numérisés",
    en: "Viewing & HD downloads of digitized civil status records",
    ar: "تصفح وتحميل وثائق الحالة المدنية المرقمنة بدقة عالية",
    es: "Consulta y descarga HD de actas civiles digitalizadas",
    it: "Consultazione e download HD degli atti di stato civile digitalizzati",
    mt: "Konsultazzjoni u tniżżil HD tar-reġistri ċivili diġitizzati",
  },
  "consultation et téléchargement hd des actes d'état civil & sijillats": {
    fr: "Consultation et téléchargement HD des actes d'état civil & sijillats",
    en: "Viewing & HD downloads of civil status records & sijillat",
    ar: "تصفح وتحميل وثائق الحالة المدنية والسجلات الشرعية بدقة عالية",
    es: "Consulta y descarga HD de actas de estado civil y sijillat",
    it: "Consultazione e download HD degli atti di stato civile e sijillat",
    mt: "Konsultazzjoni u tniżżil HD tal-atti ċivili u s-sijillat",
  },
  "index nominatif des décrets de naturalisation (1924-1927)": {
    fr: "Index nominatif des décrets de naturalisation (1924–1927)",
    en: "Name index of naturalization decrees (1924–1927)",
    ar: "فهرس اسمي لمراسيم التجنيس التونسية (1924–1927)",
    es: "Índice nominativo de decretos de naturalización (1924–1927)",
    it: "Indice nominativo dei decreti di naturalizzazione (1924–1927)",
    mt: "Indiċi tal-ismijiet tad-digrieti ta' naturalizzazzjoni (1924–1927)",
  },
  "registres paroissiaux & consulaires (italiens, maltais, français)": {
    fr: "Registres paroissiaux & consulaires (italiens, maltais, français)",
    en: "Parish & consular registers (Italian, Maltese, French)",
    ar: "السجلات الكنسية والقنصلية (الإيطالية والمالطية والفرنسية)",
    es: "Registros parroquiales y consulares (italianos, malteses, franceses)",
    it: "Registri parrocchiali e consolari (italiani, maltesi, francesi)",
    mt: "Reġistri parrokkjali u konsulari (Taljani, Maltin, Franċiżi)",
  },
  "recoupement automatique des patronymes et filiations directes": {
    fr: "Recoupement automatique des patronymes et filiations directes",
    en: "Automatic cross-referencing of surnames & direct lineages",
    ar: "ربط ومطابقة تلقائية للألقاب العائلية وسلاسل النسب المباشرة",
    es: "Cruce automático de apellidos y filiaciones directas",
    it: "Incrocio automatico di cognomi e filiazioni dirette",
    mt: "Tqabbil awtomatiku tal-kunjomijiet u l-linji diretti tal-familja",
  },
  "exports pdf haute résolution pour livrets de famille": {
    fr: "Exports PDF haute résolution pour livrets de famille",
    en: "High-resolution PDF exports for family booklets",
    ar: "تصدير ملفات PDF عالية الدقة لكتيبات العائلة",
    es: "Exportación PDF en alta resolución para libros de familia",
    it: "Esportazione PDF ad alta risoluzione per libretti di famiglia",
    mt: "Esportazzjoni PDF b'riżoluzzjoni għolja għal kotba tal-familja",
  },
  "exports pdf haute résolution pour impression patrimoniale": {
    fr: "Exports PDF haute résolution pour impression patrimoniale",
    en: "High-resolution PDF exports for heritage printing",
    ar: "تصدير ملفات PDF عالية الدقة للطباعة التراثية الفاخرة",
    es: "Exportación PDF en alta resolución para impresión patrimonial",
    it: "Esportazione PDF ad alta risoluzione per stampa patrimoniale",
    mt: "Esportazzjoni PDF b'riżoluzzjoni għolja għall-istampar tal-wirt",
  },
  "support prioritaire par email sous 24h": {
    fr: "Support prioritaire par email sous 24h",
    en: "Priority email support within 24h",
    ar: "دعم فني أولوي عبر البريد الإلكتروني خلال 24 ساعة",
    es: "Soporte prioritario por correo en 24h",
    it: "Supporto prioritario via email entro 24h",
    mt: "Sapport prijoritarju bl-email fi żmien 24 siegħa",
  },
  "support prioritaire par e-mail sous 24h": {
    fr: "Support prioritaire par e-mail sous 24h",
    en: "Priority email support within 24h",
    ar: "دعم فني أولوي عبر البريد الإلكتروني خلال 24 ساعة",
    es: "Soporte prioritario por correo electrónico en 24h",
    it: "Supporto prioritario via e-mail entro 24h",
    mt: "Sapport prijoritarju bl-email fi żmien 24 siegħa",
  },

  // Tier 3 bullets (fallback + live API variants)
  "tout ce qui est inclus dans chercheur d'actes": {
    fr: "Tout ce qui est inclus dans Chercheur d’Actes",
    en: "Everything included in Researcher & Records",
    ar: "كل ما هو مشمول في باقة باحث والوثائق",
    es: "Todo lo incluido en Investigador y Actas",
    it: "Tutto ciò che è incluso in Ricercatore e Atti",
    mt: "Dak kollu inkluż f'Riċerkatur u Reġistri",
  },
  "tout ce qui est inclus dans chercheur & actes": {
    fr: "Tout ce qui est inclus dans Chercheur & Actes",
    en: "Everything included in Researcher & Records",
    ar: "كل ما هو مشمول في باقة باحث والوثائق",
    es: "Todo lo incluido en Investigador y Actas",
    it: "Tutto ciò che è incluso in Ricercatore e Atti",
    mt: "Dak kollu inkluż f'Riċerkatur u Reġistri",
  },
  "demande de recherche ciblée auprès des dépôts d'archives": {
    fr: "Demande de recherche ciblée auprès des dépôts d’archives",
    en: "Targeted research requests across archival repositories",
    ar: "طلبات بحث موجهة لدى مراكز حفظ الأرشيف",
    es: "Solicitudes de búsqueda dirigida en depósitos de archivo",
    it: "Richieste di ricerca mirata presso gli archivi",
    mt: "Talbiet għal riċerka mmirata fid-depożiti tal-arkivji",
  },
  "demande de recherche ciblée auprès des dépôts d'archives tunisiens": {
    fr: "Demande de recherche ciblée auprès des dépôts d'archives tunisiens",
    en: "Targeted research requests across Tunisian archive repositories",
    ar: "طلبات بحث ميداني موجهة لدى دور ومراكز الأرشيف التونسية",
    es: "Solicitudes de búsqueda dirigida en depósitos de archivo tunecinos",
    it: "Richieste di ricerca mirata presso i depositi archivistici tunisini",
    mt: "Talbiet għal riċerka mmirata fid-depożiti tal-arkivji Tuneżini",
  },
  "aide au déchiffrage & transcription (arabe, ottoman, italien)": {
    fr: "Aide au déchiffrage & transcription (arabe, ottoman, italien)",
    en: "Decipherment & transcription aid (Arabic, Ottoman, Italian)",
    ar: "مساعدة في فك الخطوط والنسخ (العربية، العثمانية، الإيطالية)",
    es: "Ayuda de descifrado y transcripción (árabe, otomano, italiano)",
    it: "Assistenza alla decifrazione e trascrizione (arabo, ottomano, italiano)",
    mt: "Għajnuna fid-deċifrar u t-traskrizzjoni (Għarbi, Ottoman, Taljan)",
  },
  "aide au déchiffrage & transcription d'écritures anciennes (arabe, ottoman, italien, maltais)": {
    fr: "Aide au déchiffrage & transcription d'écritures anciennes (arabe, ottoman, italien, maltais)",
    en: "Decipherment & transcription of historical scripts (Arabic, Ottoman, Italian, Maltese)",
    ar: "مساعدة في فك ونسخ الخطوط القديمة (العربية، العثمانية، الإيطالية، المالطية)",
    es: "Descifrado y transcripción de escrituras antiguas (árabe, otomano, italiano, maltés)",
    it: "Decifrazione e trascrizione di scritture antiche (arabo, ottomano, italiano, maltese)",
    mt: "Deċifrar u traskrizzjoni ta' kitbiet antiki (Għarbi, Ottoman, Taljan, Malti)",
  },
  "validation de filiation avec référent généalogiste": {
    fr: "Validation de filiation avec référent généalogiste",
    en: "Lineage validation with a dedicated genealogist",
    ar: "توثيق سلاسل النسب بمرافقة باحث مختص",
    es: "Validación de filiación con un genealogista referente",
    it: "Validazione della filiazione con un genealogista referente",
    mt: "Validazzjoni tal-filiżjoni ma' ġenealoġista dedikat",
  },
  "vérification notariale et validation de filiation avec référent généalogiste": {
    fr: "Vérification notariale et validation de filiation avec référent généalogiste",
    en: "Notarial verification & lineage validation with a dedicated genealogist",
    ar: "تحقيق عدلي وتوثيق لسلسلة النسب بمرافقة باحث أنساب مختص",
    es: "Verificación notarial y validación de filiación con genealogista referente",
    it: "Verifica notarile e validazione della filiazione con genealogista referente",
    mt: "Verifika notarili u validazzjoni tal-filiżjoni ma' ġenealoġista dedikat",
  },
  "accès prioritaire aux nouveaux registres indexés": {
    fr: "Accès prioritaire aux nouveaux registres indexés",
    en: "Priority access to newly indexed registers",
    ar: "أولوية الوصول إلى السجلات المفهرسة حديثاً",
    es: "Acceso prioritario a nuevos registros indexados",
    it: "Accesso prioritario ai nuovi registri indicizzati",
    mt: "Aċċess prijoritarju għal reġistri ġodda indiċjati",
  },
  "accès prioritaire aux nouveaux registres indexés en avant-première": {
    fr: "Accès prioritaire aux nouveaux registres indexés en avant-première",
    en: "Early priority access to newly indexed archival registers",
    ar: "أولوية الوصول الحصري والمبكر إلى السجلات المفهرسة حديثاً",
    es: "Acceso prioritario anticipado a los nuevos registros indexados",
    it: "Accesso prioritario in anteprima ai nuovi registri indicizzati",
    mt: "Aċċess prijoritarju bikri għar-reġistri l-ġodda indiċjati",
  },
  "assistance directe par whatsapp & messagerie dédiée": {
    fr: "Assistance directe par WhatsApp & messagerie dédiée",
    en: "Direct WhatsApp & dedicated messaging support",
    ar: "مرافقة مباشرة عبر واتساب والمراسلة المخصصة",
    es: "Asistencia directa por WhatsApp y mensajería dedicada",
    it: "Assistenza diretta tramite WhatsApp e messaggistica dedicata",
    mt: "Għajnuna diretta permezz ta' WhatsApp u messaġġi dedikati",
  },
  "assistance directe et personnalisée par whatsapp & messagerie dédiée": {
    fr: "Assistance directe et personnalisée par WhatsApp & messagerie dédiée",
    en: "Direct personalized WhatsApp & dedicated researcher messaging support",
    ar: "مرافقة مباشرة وشخصية عبر واتساب والمراسلة البحثية المخصصة",
    es: "Asistencia directa y personalizada por WhatsApp y mensajería dedicada",
    it: "Assistenza diretta e personalizzata tramite WhatsApp e messaggistica dedicata",
    mt: "Għajnuna diretta u personalizzata permezz ta' WhatsApp u messaġġi dedikati",
  },
  // Additional DB / CMS feature bullet variants
  "création et édition de votre arbre familial (jusqu'à 50 individus)": {
    fr: "Création et édition de votre arbre familial (jusqu'à 50 individus)",
    en: "Create and edit your family tree (up to 50 individuals)",
    ar: "إنشاء وتعديل شجرة عائلتك (حتى 50 فرداً)",
    es: "Creación y edición de su árbol familiar (hasta 50 individuos)",
    it: "Creazione e modifica del tuo albero genealogico (fino a 50 individui)",
    mt: "Ħolqien u editjar tas-siġra tal-familja tiegħek (sa 50 individwu)",
  },
  "exploration de l'annuaire historique des noms de famille tunisiens": {
    fr: "Exploration de l'annuaire historique des noms de famille tunisiens",
    en: "Explore the historical directory of Tunisian family surnames",
    ar: "استكشاف الدليل التاريخي للألقاب العائلية التونسية",
    es: "Exploración del directorio histórico de apellidos tunecinos",
    it: "Esplorazione dell'annuario storico dei cognomi tunisini",
    mt: "Esplorazzjoni tad-direttorju storiku tal-kunjomijiet Tuneżini",
  },
  "consultation de la carte interactive des archives et lieux de mémoire": {
    fr: "Consultation de la carte interactive des archives et lieux de mémoire",
    en: "Interactive map of archive repositories & heritage landmarks",
    ar: "الاطلاع على الخريطة التفاعلية للأرشيفات ومعالم الذاكرة",
    es: "Consulta del mapa interactivo de archivos y lugares de memoria",
    it: "Consultazione della mappa interattiva degli archivi e luoghi della memoria",
    mt: "Konsultazzjoni tal-mappa interattiva tal-arkivji u postijiet ta' memorja",
  },
  "accès aux guides méthodologiques de recherche généalogique en tunisie": {
    fr: "Accès aux guides méthodologiques de recherche généalogique en Tunisie",
    en: "Access to methodological guides for genealogical research in Tunisia",
    ar: "الوصول إلى الأدلة المنهجية للبحث في الأنساب بتونس",
    es: "Acceso a las guías metodológicas de investigación genealógica en Túnez",
    it: "Accesso alle guide metodologiche di ricerca genealogica in Tunisia",
    mt: "Aċċess għall-gwidi metodoloġiċi tar-riċerka ġenealoġika f'Tuneżija",
  },
  "sauvegarde sécurisée de vos premières fiches et notes familiales": {
    fr: "Sauvegarde sécurisée de vos premières fiches et notes familiales",
    en: "Secure cloud backup of your initial family profiles & research notes",
    ar: "حفظ آمن لبطاقاتك وملاحظاتك العائلية الأولى",
    es: "Copia de seguridad protegida de sus primeras fichas y notas familiares",
    it: "Salvataggio sicuro delle tue prime schede e note familiari",
    mt: "Ħażna sigura tal-ewwel skedi u noti tal-familja tiegħek",
  },
  "consultation intégrale des actes de naissance, mariage et décès numérisés": {
    fr: "Consultation intégrale des actes de naissance, mariage et décès numérisés",
    en: "Full access to digitized birth, marriage, and death certificates",
    ar: "اطلاع كامل على عقود الولادة والزواج والوفاة المرقمنة",
    es: "Consulta integral de actas digitalizadas de nacimiento, matrimonio y defunción",
    it: "Consultazione integrale degli atti di nascita, matrimonio e morte digitalizzati",
    mt: "Konsultazzjoni sħiħa ta' atti tat-twelid, żwieġ u mewt diġitizzati",
  },
  "accès aux registres paroissiaux, consulaires et sijillats notariaux (adoul)": {
    fr: "Accès aux registres paroissiaux, consulaires et sijillats notariaux (Adoul)",
    en: "Access to parish, consular, and notarial sijillat (Adoul) registers",
    ar: "الوصول إلى السجلات الكنسية والقنصلية ودفاتر العدول الشرعية",
    es: "Acceso a registros parroquiales, consulares y sijillat notariales (Adoul)",
    it: "Accesso ai registri parrocchiali, consolari e sijillat notarili (Adoul)",
    mt: "Aċċess għar-reġistri parrokkjali, konsulari u sijillat notarili (Adoul)",
  },
  "recherche dans les décrets de naturalisation (1924-1927) et recensements": {
    fr: "Recherche dans les décrets de naturalisation (1924–1927) et recensements",
    en: "Search across naturalization decrees (1924–1927) and historical censuses",
    ar: "البحث في مراسيم التجنيس (1924–1927) والتعدادات السكانية",
    es: "Búsqueda en decretos de naturalización (1924–1927) y censos históricos",
    it: "Ricerca nei decreti di naturalizzazione (1924–1927) e nei censimenti",
    mt: "Tfittxija fid-digrieti ta' naturalizzazzjoni (1924–1927) u ċensimenti",
  },
  "téléchargement des actes et manuscrits originaux en haute résolution": {
    fr: "Téléchargement des actes et manuscrits originaux en haute résolution",
    en: "High-resolution downloads of original records and manuscripts",
    ar: "تحميل الوثائق والمخطوطات الأصلية بدقة عالية",
    es: "Descarga de actas y manuscritos originales en alta resolución",
    it: "Download di atti e manoscritti originali ad alta risoluzione",
    mt: "Tniżżil ta' atti u manuskritti oriġinali b'riżoluzzjoni għolja",
  },
  "5 arbres généalogiques complets (jusqu'à 2 000 individus) & export gedcom": {
    fr: "5 arbres généalogiques complets (jusqu'à 2 000 individus) & export GEDCOM",
    en: "5 complete family trees (up to 2,000 individuals) & GEDCOM export",
    ar: "5 شجرات عائلة كاملة (حتى 2000 فرد) مع تصدير GEDCOM",
    es: "5 árboles genealógicos completos (hasta 2.000 individuos) y exportación GEDCOM",
    it: "5 alberi genealogici completi (fino a 2.000 individui) ed esportazione GEDCOM",
    mt: "5 siġar tal-familja kompluti (sa 2,000 individwu) u esportazzjoni GEDCOM",
  },
  "support prioritaire par nos archivistes sous 24h": {
    fr: "Support prioritaire par nos archivistes sous 24h",
    en: "Priority support from our archivists within 24h",
    ar: "دعم أولوي من طرف أرشيفينا المختصين خلال 24 ساعة",
    es: "Soporte prioritario de nuestros archiveros en 24h",
    it: "Supporto prioritario dai nostri archivisti entro 24h",
    mt: "Sapport prijoritarju mill-arkivisti tagħna fi żmien 24 siegħa",
  },
  "toutes les archives et privilèges de la formule chercheur & actes": {
    fr: "Toutes les archives et privilèges de la formule Chercheur & Actes",
    en: "All archives and privileges of the Researcher & Records plan",
    ar: "جميع الأرشيفات والمزايا المشمولة في باقة باحث والوثائق",
    es: "Todos los archivos y privilegios del plan Investigador y Actas",
    it: "Tutti gli archivi e i privilegi del piano Ricercatore e Atti",
    mt: "L-arkivji u l-privileġġi kollha tal-pjan Riċerkatur u Reġistri",
  },
  "arbres généalogiques, individus, actes et galerie multimédia illimités": {
    fr: "Arbres généalogiques, individus, actes et galerie multimédia illimités",
    en: "Unlimited family trees, individuals, records, and multimedia gallery",
    ar: "شجرات عائلة وأفراد ووثائق ومعرض وسائط غير محدودة",
    es: "Árboles genealógicos, individuos, actas y galería multimedia ilimitados",
    it: "Alberi genealogici, individui, atti e galleria multimediale illimitati",
    mt: "Siġar tal-familja, individwi, atti u gallerija multimedjali bla limitu",
  },
  "aide au déchiffrage et traduction d'actes anciens (arabe, ottoman, italien, français)": {
    fr: "Aide au déchiffrage et traduction d'actes anciens (arabe, ottoman, italien, français)",
    en: "Decipherment and translation aid for old records (Arabic, Ottoman, Italian, French)",
    ar: "مساعدة في فك الخطوط وترجمة الوثائق القديمة (العربية، العثمانية، الإيطالية، الفرنسية)",
    es: "Ayuda en el descifrado y traducción de actas antiguas (árabe, otomano, italiano, francés)",
    it: "Assistenza nella decifrazione e traduzione di atti antichi (arabo, ottomano, italiano, francese)",
    mt: "Għajnuna fid-deċifrar u t-traduzzjoni ta' atti antiki (Għarbi, Ottoman, Taljan, Franċiż)",
  },
  "recherches ciblées sur demande dans les fonds d'archives nationaux et diocésains": {
    fr: "Recherches ciblées sur demande dans les fonds d'archives nationaux et diocésains",
    en: "On-demand targeted searches across national and diocesan archive holdings",
    ar: "أبحاث ميدانية موجهة حسب الطلب في الأرصدة الأرشيفية الوطنية والأسقفية",
    es: "Búsquedas dirigidas bajo demanda en fondos de archivos nacionales y diocesanos",
    it: "Ricerche mirate su richiesta nei fondi archivistici nazionali e diocesani",
    mt: "Tfittxijiet immirati fuq talba fil-fondi tal-arkivji nazzjonali u djoċesani",
  },
  "vérification de filiation et constitution de dossier historique certifié": {
    fr: "Vérification de filiation et constitution de dossier historique certifié",
    en: "Lineage verification and preparation of a certified historical dossier",
    ar: "التحقق من النسب وإعداد ملف تاريخي وعائلي موثق",
    es: "Verificación de filiación y elaboración de expediente histórico certificado",
    it: "Verifica della filiazione e costituzione di un fascicolo storico certificato",
    mt: "Verifika tal-filiżjoni u tħejjija ta' dossier storiku ċċertifikat",
  },
  "accompagnement personnalisé par un généalogiste référent (whatsapp & visio)": {
    fr: "Accompagnement personnalisé par un généalogiste référent (WhatsApp & visio)",
    en: "Personalized guidance from a dedicated genealogist (WhatsApp & video call)",
    ar: "مرافقة شخصية من طرف باحث أنساب مخصص (عبر واتساب ومكالمات الفيديو)",
    es: "Acompañamiento personalizado por un genealogista asignado (WhatsApp y videollamada)",
    it: "Accompagnamento personalizzato da un genealogista dedicato (WhatsApp e videochiamata)",
    mt: "Gwida personalizzata minn ġenealoġista ddedikat (WhatsApp u sejħa bil-vidjo)",
  },
};

export const DEFAULT_LOCALIZED_TIER_SERVICES: Record<number, Record<SubscriptionLocale, string[]>> = {
  1: {
    fr: [
      "Visualisation interactive d’arbres généalogiques (2D/3D)",
      "Inventaires des 19 grands fonds d’archives tunisiens",
      "Importation et exportation GEDCOM standard",
      "Fiches d’individus et repères chronologiques",
      "Accès libre à la communauté et aux récits d’histoire",
    ],
    en: [
      "Interactive 2D/3D family tree visualization",
      "Inventories of the 19 major Tunisian archive repositories",
      "Standard GEDCOM import & export",
      "Individual profiles & historical timeline markers",
      "Open access to the community & historical stories",
    ],
    ar: [
      "عرض تفاعلي ثنائي وثلاثي الأبعاد لشجرات العائلة",
      "فهارس وأدلة 19 رصيداً أرشيفياً تونسياً رئيسياً",
      "استيراد وتصدير قياسي بصيغة GEDCOM",
      "بطاقات الأفراد والمعالم الزمنية التاريخية",
      "وصول حر للمجتمع والروايات التاريخية",
    ],
    es: [
      "Visualización interactiva de árboles genealógicos (2D/3D)",
      "Inventarios de los 19 grandes fondos de archivo tunecinos",
      "Importación y exportación GEDCOM estándar",
      "Fichas individuales y referencias cronológicas",
      "Acceso libre a la comunidad y relatos históricos",
    ],
    it: [
      "Visualizzazione interattiva di alberi genealogici (2D/3D)",
      "Inventari dei 19 principali fondi archivistici tunisini",
      "Importazione ed esportazione GEDCOM standard",
      "Schede individuali e riferimenti cronologici",
      "Accesso libero alla community e ai racconti storici",
    ],
    mt: [
      "Viżwalizzazzjoni interattiva ta' siġar tal-familja (2D/3D)",
      "Inventarji tad-19-il fond ewlieni tal-arkivji Tuneżini",
      "Importazzjoni u esportazzjoni standard ta' GEDCOM",
      "Skedi tal-individwi u punti kronoloġiċi",
      "Aċċess ħieles għall-komunità u r-rakkonti storiċi",
    ],
  },
  2: {
    fr: [
      "Tout ce qui est inclus dans Découverte",
      "Consultation & téléchargement HD des actes d’état civil numérisés",
      "Index nominatif des décrets de naturalisation (1924–1927)",
      "Registres paroissiaux & consulaires (italiens, maltais, français)",
      "Exports PDF haute résolution pour livrets de famille",
      "Support prioritaire par email sous 24h",
    ],
    en: [
      "Everything included in Heritage Discovery",
      "Viewing & HD downloads of digitized civil status records",
      "Name index of naturalization decrees (1924–1927)",
      "Parish & consular registers (Italian, Maltese, French)",
      "High-resolution PDF exports for family booklets",
      "Priority email support within 24h",
    ],
    ar: [
      "كل ما هو مشمول في باقة استكشاف التراث",
      "تصفح وتحميل وثائق الحالة المدنية المرقمنة بدقة عالية",
      "فهرس اسمي لمراسيم التجنيس التونسية (1924–1927)",
      "السجلات الكنسية والقنصلية (الإيطالية والمالطية والفرنسية)",
      "تصدير ملفات PDF عالية الدقة لكتيبات العائلة",
      "دعم فني أولوي عبر البريد الإلكتروني خلال 24 ساعة",
    ],
    es: [
      "Todo lo incluido en Descubrimiento",
      "Consulta y descarga HD de actas civiles digitalizadas",
      "Índice nominativo de decretos de naturalización (1924–1927)",
      "Registros parroquiales y consulares (italianos, malteses, franceses)",
      "Exportación PDF en alta resolución para libros de familia",
      "Soporte prioritario por correo en 24h",
    ],
    it: [
      "Tutto ciò che è incluso in Scoperta",
      "Consultazione e download HD degli atti di stato civile digitalizzati",
      "Indice nominativo dei decreti di naturalizzazione (1924–1927)",
      "Registri parrocchiali e consolari (italiani, maltesi, francesi)",
      "Esportazione PDF ad alta risoluzione per libretti di famiglia",
      "Supporto prioritario via email entro 24h",
    ],
    mt: [
      "Dak kollu inkluż f'Skoperta tal-Wirt",
      "Konsultazzjoni u tniżżil HD tar-reġistri ċivili diġitizzati",
      "Indiċi tal-ismijiet tad-digrieti ta' naturalizzazzjoni (1924–1927)",
      "Reġistri parrokkjali u konsulari (Taljani, Maltin, Franċiżi)",
      "Esportazzjoni PDF b'riżoluzzjoni għolja għal kotba tal-familja",
      "Sapport prijoritarju bl-email fi żmien 24 siegħa",
    ],
  },
  3: {
    fr: [
      "Tout ce qui est inclus dans Chercheur d’Actes",
      "Demande de recherche ciblée auprès des dépôts d’archives",
      "Aide au déchiffrage & transcription (arabe, ottoman, italien)",
      "Validation de filiation avec référent généalogiste",
      "Accès prioritaire aux nouveaux registres indexés",
      "Assistance directe par WhatsApp & messagerie dédiée",
    ],
    en: [
      "Everything included in Researcher & Records",
      "Targeted research requests across archival repositories",
      "Decipherment & transcription aid (Arabic, Ottoman, Italian)",
      "Lineage validation with a dedicated genealogist",
      "Priority access to newly indexed registers",
      "Direct WhatsApp & dedicated messaging support",
    ],
    ar: [
      "كل ما هو مشمول في باقة باحث والوثائق",
      "طلبات بحث موجهة لدى مراكز حفظ الأرشيف",
      "مساعدة في فك الخطوط والنسخ (العربية، العثمانية، الإيطالية)",
      "توثيق سلاسل النسب بمرافقة باحث مختص",
      "أولوية الوصول إلى السجلات المفهرسة حديثاً",
      "مرافقة مباشرة عبر واتساب والمراسلة المخصصة",
    ],
    es: [
      "Todo lo incluido en Investigador y Actas",
      "Solicitudes de búsqueda dirigida en depósitos de archivo",
      "Ayuda de descifrado y transcripción (árabe, otomano, italiano)",
      "Validación de filiación con un genealogista referente",
      "Acceso prioritario a nuevos registros indexados",
      "Asistencia directa por WhatsApp y mensajería dedicada",
    ],
    it: [
      "Tutto ciò che è incluso in Ricercatore e Atti",
      "Richieste di ricerca mirata presso gli archivi",
      "Assistenza alla decifrazione e trascrizione (arabo, ottomano, italiano)",
      "Validazione della filiazione con un genealogista referente",
      "Accesso prioritario ai nuovi registri indicizzati",
      "Assistenza diretta tramite WhatsApp e messaggistica dedicata",
    ],
    mt: [
      "Dak kollu inkluż f'Riċerkatur u Reġistri",
      "Talbiet għal riċerka mmirata fid-depożiti tal-arkivji",
      "Għajnuna fid-deċifrar u t-traskrizzjoni (Għarbi, Ottoman, Taljan)",
      "Validazzjoni tal-filiżjoni ma' ġenealoġista dedikat",
      "Aċċess prijoritarju għal reġistri ġodda indiċjati",
      "Għajnuna diretta permezz ta' WhatsApp u messaġġi dedikati",
    ],
  },
};

export function localizeTierName(rawName: string | undefined, tierId: number, locale: string): string {
  const loc = cleanSubscriptionLocale(locale);
  const trimmed = rawName?.trim() || "";
  if (loc === "fr" && trimmed) return trimmed;
  if (trimmed) {
    const matched = KNOWN_TIER_NAMES[normalizeTextKey(trimmed)];
    if (matched) return matched[loc];
  }
  return DEFAULT_TIER_NAMES[tierId]?.[loc] || trimmed || `${loc === "ar" ? "الباقة" : "Tier"} ${tierId}`;
}

export function localizeTierBadge(rawBadge: string | undefined, tierId: number, locale: string): string {
  const loc = cleanSubscriptionLocale(locale);
  const trimmed = rawBadge?.trim() || "";
  if (loc === "fr" && trimmed) return trimmed;
  if (trimmed) {
    const matched = KNOWN_TIER_BADGES[normalizeTextKey(trimmed)];
    if (matched) return matched[loc];
  }
  return DEFAULT_TIER_BADGES[tierId]?.[loc] || trimmed;
}

export function localizeTierDescription(rawDesc: string | undefined, tierId: number, locale: string): string {
  const loc = cleanSubscriptionLocale(locale);
  const trimmed = rawDesc?.trim() || "";
  if (loc === "fr" && trimmed) return trimmed;
  if (trimmed) {
    const matched = KNOWN_TIER_DESCRIPTIONS[normalizeTextKey(trimmed)];
    if (matched) return matched[loc];
  }
  return DEFAULT_TIER_DESCRIPTIONS[tierId]?.[loc] || trimmed;
}

export function localizeTierFeature(rawBullet: string, locale: string): string {
  const loc = cleanSubscriptionLocale(locale);
  const trimmed = rawBullet.trim();
  if (!trimmed || loc === "fr") return trimmed;
  const matched = KNOWN_FEATURE_BULLETS[normalizeTextKey(trimmed)];
  return matched ? matched[loc] : trimmed;
}

const CURRENCY_NAMES_BY_CODE: Record<string, Record<SubscriptionLocale, string>> = {
  USD: {
    fr: "Dollar Américain",
    en: "US Dollar",
    ar: "دولار أمريكي",
    es: "Dólar Estadounidense",
    it: "Dollaro Statunitense",
    mt: "Dollaru Amerikan",
  },
  TND: {
    fr: "Dinar Tunisien",
    en: "Tunisian Dinar",
    ar: "دينار تونسي",
    es: "Dinar Tunecino",
    it: "Dinaro Tunisino",
    mt: "Dinar Tuneżin",
  },
  EUR: {
    fr: "Euro",
    en: "Euro",
    ar: "يورو",
    es: "Euro",
    it: "Euro",
    mt: "Ewro",
  },
  GBP: {
    fr: "Livre Sterling",
    en: "British Pound",
    ar: "جنيه إسترليني",
    es: "Libra Esterlina",
    it: "Sterlina Britannica",
    mt: "Lira Sterlina",
  },
  CAD: {
    fr: "Dollar Canadien",
    en: "Canadian Dollar",
    ar: "دولار كندي",
    es: "Dólar Canadiense",
    it: "Dollaro Canadese",
    mt: "Dollaru Kanadiż",
  },
  SAR: {
    fr: "Riyal Saoudien",
    en: "Saudi Riyal",
    ar: "ريال سعودي",
    es: "Riyal Saudí",
    it: "Riyal Saudita",
    mt: "Riyal Sawdi",
  },
  AED: {
    fr: "Dirham des Émirats",
    en: "UAE Dirham",
    ar: "درهم إماراتي",
    es: "Dirham EAU",
    it: "Dirham EAU",
    mt: "Dirham UAE",
  },
  MAD: {
    fr: "Dirham Marocain",
    en: "Moroccan Dirham",
    ar: "درهم مغربي",
    es: "Dirham Marroquí",
    it: "Dirham Marocchino",
    mt: "Dirham Marokkin",
  },
  DZD: {
    fr: "Dinar Algérien",
    en: "Algerian Dinar",
    ar: "دينار جزائري",
    es: "Dinar Argelino",
    it: "Dinaro Algerino",
    mt: "Dinar Alġerin",
  },
  CHF: {
    fr: "Franc Suisse",
    en: "Swiss Franc",
    ar: "فرنك سويسري",
    es: "Franco Suizo",
    it: "Franco Svizzero",
    mt: "Frank Żvizzeru",
  },
};

export function localizeCurrencyName(code: string | undefined, fallbackName: string | undefined, locale: string): string {
  const loc = cleanSubscriptionLocale(locale);
  const upperCode = String(code || "").trim().toUpperCase();
  return CURRENCY_NAMES_BY_CODE[upperCode]?.[loc] || fallbackName?.trim() || upperCode;
}

