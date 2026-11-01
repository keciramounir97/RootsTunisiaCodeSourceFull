const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/GalleryDocuments.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update TUNISIAN_INITIAL_DOCS with localized variants
const oldInitialDocsRegex = /const TUNISIAN_INITIAL_DOCS: DocumentItem\[\] = \[([\s\S]*?)\];/;
const newInitialDocs = `const TUNISIAN_INITIAL_DOCS_EN: DocumentItem[] = [
  {
    id: "doc-tn-1",
    title: "Beylical Sijill Decrees — Tunis Medina (1852)",
    type: "Beylical Decree",
    governorate: "Tunis",
    dateStr: "1268 AH / 1852 AD",
    archiveFonds: "Archives Nationales de Tunisie (Fonds Sadiki / Beylical)",
    summary: "Royal decree bearing the seal of Ahmed I Bey granting waqf exemptions and naming lineage leaders in Tunis Medina.",
    previewImage: manuscriptImage,
  },
  {
    id: "doc-tn-2",
    title: "Habous Land Deed — Olive Groves of Sfax & Mahdia",
    type: "Habous & Property",
    governorate: "Sfax / Mahdia",
    dateStr: "1874 AD",
    archiveFonds: "Registres Charaïques de Sfax",
    summary: "Endowment deed detailing family inheritance, olive grove boundaries (ghaba), and patron lineage names in coastal Tunisia.",
    previewImage: manuscriptImage,
  },
  {
    id: "doc-tn-3",
    title: "Etat Civil Civil Extract — Protectorate Register (1894)",
    type: "Etat Civil",
    governorate: "Bizerte",
    dateStr: "1894 AD",
    archiveFonds: "Archives du Protectorat & ANOM",
    summary: "Civil registry extract recording birth, parent names, occupation, and residence in Bizerte under late 19th century registers.",
    previewImage: manuscriptImage,
  },
  {
    id: "doc-tn-4",
    title: "Kairouan Waqf Charter for Al-Zaytuna Scholars",
    type: "Waqf & Education",
    governorate: "Kairouan",
    dateStr: "1782 AD",
    archiveFonds: "Bibliothèque Nationale de Tunisie",
    summary: "Scholar waqf certificate establishing family lineage ties and scholarship stipends for Kairouani scholars studying in Zaytuna.",
    previewImage: manuscriptImage,
  },
];

const TUNISIAN_INITIAL_DOCS_AR: DocumentItem[] = [
  {
    id: "doc-tn-1",
    title: "أوامر ودفاتر البايات بالمحاكم الشرعية — تونس المدينة (1852 م)",
    type: "مرسوم بايلي",
    governorate: "تونس",
    dateStr: "1268 هـ / 1852 م",
    archiveFonds: "الأرشيف الوطني التونسي (سلسلة دار الباي)",
    summary: "فرمان ملكي بختم أحمد باشا باي يمنح إعفاءات للأوقاف ويسمي شيوخ الأنساب بمدينة تونس.",
    previewImage: manuscriptImage,
  },
  {
    id: "doc-tn-2",
    title: "حجة وقف أرض — غابات زيتون صفاقس والمهدية",
    type: "حبس وأملاك",
    governorate: "صفاقس / المهدية",
    dateStr: "1874 م",
    archiveFonds: "سجلات صفاقس الشرعية والأحباس",
    summary: "صك حبس عائلي يفصل المواريث وحدود الغابات وأسماء البطون والأنساب بالساحل التونسي.",
    previewImage: manuscriptImage,
  },
  {
    id: "doc-tn-3",
    title: "مستخرج حالة مدنية — دفاتر سجلات الحماية (1894 م)",
    type: "حالة مدنية",
    governorate: "بنزرت",
    dateStr: "1894 م",
    archiveFonds: "أرشيف الحالة المدنية التونسية",
    summary: "مستخرج ولادة رسمي يسجل اسم المولود والوالدين والمهنة ومقر الإقامة ببنزرت أواخر القرن التاسع عشر.",
    previewImage: manuscriptImage,
  },
  {
    id: "doc-tn-4",
    title: "صك وقف القيروان لطلبة وعلماء جامع الزيتونة",
    type: "وقف وتعليم",
    governorate: "القيروان",
    dateStr: "1782 م",
    archiveFonds: "المكتبة الوطنية التونسية",
    summary: "حجة وقفية تثبت الأنساب ورواتب المنح المخصصة للطلبة القيروانيين الدارسين بجامع الزيتونة المعمور.",
    previewImage: manuscriptImage,
  },
];`;

content = content.replace(oldInitialDocsRegex, newInitialDocs);

// 2. Hook up locale
content = content.replace(
  /const \{ t \} = useTranslation\(\);/g,
  `const { t, locale } = useTranslation();
  const isArabic = locale === "ar";
  const defaultInitialDocs = isArabic ? TUNISIAN_INITIAL_DOCS_AR : TUNISIAN_INITIAL_DOCS_EN;`
);

content = content.replace(/TUNISIAN_INITIAL_DOCS/g, 'defaultInitialDocs');

// 3. Category options
const oldTypesDef = `const documentTypes = ["All", "Beylical Decree", "Habous & Property", "Etat Civil", "Waqf & Education"];`;
const newTypesDef = `const typeOptions = [
    { key: "All", labelKey: "cat_all", fallback: isArabic ? "الكل" : "All" },
    { key: "Beylical Decree", labelKey: "doc_beylical_decree", fallback: isArabic ? "مرسوم بايلي" : "Beylical Decree" },
    { key: "Habous & Property", labelKey: "doc_habous_property", fallback: isArabic ? "حبس وأملاك" : "Habous & Property" },
    { key: "Etat Civil", labelKey: "doc_etat_civil", fallback: isArabic ? "حالة مدنية" : "Etat Civil" },
    { key: "Waqf & Education", labelKey: "doc_waqf_education", fallback: isArabic ? "وقف وتعليم" : "Waqf & Education" },
  ];`;

content = content.replace(oldTypesDef, newTypesDef);

// Replace mapping over documentTypes
content = content.replace(
  /\{documentTypes\.map\(\(type\) => \(/g,
  `{typeOptions.map((typeOpt) => (`
);
content = content.replace(
  /key=\{type\}/g,
  `key={typeOpt.key}`
);
content = content.replace(
  /onClick=\{\(\) => setTypeFilter\(type\)\}/g,
  `onClick={() => setTypeFilter(typeOpt.key)}`
);
content = content.replace(
  /typeFilter === type/g,
  `typeFilter === typeOpt.key`
);
content = content.replace(
  />\s*\{type\}\s*<\/button>/g,
  `>{t(typeOpt.labelKey, typeOpt.fallback)}</button>`
);

// 4. Update search input placeholder
content = content.replace(
  /placeholder=\{t\("search_docs_placeholder",[^)]+\)\}/g,
  `placeholder={t("search_docs_placeholder", isArabic ? "ابحث في الوثائق، الصكوك، والمراسيم البايليّة…" : "Search by keyword, governorate, or title…")}`
);

// 5. Update preview button and tags
content = content.replace(
  /<span>\{t\("preview_extract", "Preview Extract"\)\}<\/span>/g,
  `<span>{t("preview_extract", isArabic ? "معاينة المستخرج" : "Preview Extract")}</span>`
);

content = content.replace(
  /<span>\{t\("request_high_res", "Request Full Access"\)\}<\/span>/g,
  `<span>{t("request_high_res", isArabic ? "طلب الوصول الكامل" : "Request Full Access")}</span>`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated GalleryDocuments.tsx');
