const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/GalleryBooks.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update TUNISIAN_INITIAL_BOOKS with Arabic content when locale === 'ar'
const oldInitialBooksRegex = /const TUNISIAN_INITIAL_BOOKS: BookItem\[\] = \[([\s\S]*?)\];/;
const newInitialBooks = `const TUNISIAN_INITIAL_BOOKS_EN: BookItem[] = [
  {
    id: "book-tn-1",
    title: "Ithaf Ahl al-Zaman bi-Akhbar Muluk Tunis wa'l-Ahan (Chronicles of Tunis Beys)",
    author: "Ahmad ibn Abi Diyaf (1804–1874)",
    century: "19th Century",
    category: "Historical Chronicles",
    description: "The primary historical and genealogical chronicle of Husainid Tunisia, documenting royal lineages, administrative decrees, notables, and tribal relations.",
    pages: 420,
    coverImage: manuscriptImage,
    archiveReference: "Bibliothèque Nationale de Tunisie, MSS 14820",
  },
  {
    id: "book-tn-2",
    title: "Sijillat al-Mahkama al-Shara'iyya bi-Tunis (Charaïques Court Registers)",
    author: "Tunis Ottoman Chancery",
    century: "18th–19th Century",
    category: "Legal & Court Sijillat",
    description: "Digitized judicial records of marriages, inheritances, waqf deeds, and property sales in the Medina of Tunis from 1750 to 1881.",
    pages: 310,
    coverImage: manuscriptImage,
    archiveReference: "Archives Nationales de Tunisie, Serie H",
  },
  {
    id: "book-tn-3",
    title: "Nasab & Waqf Records of Kairouan Lineages",
    author: "Al-Kairowani Jurists",
    century: "17th Century",
    category: "Genealogy & Habous",
    description: "Detailed waqf endowments, noble nasab trees, and scholar lineages recorded in Kairouan and Mahdia during the Hafsid and early Ottoman eras.",
    pages: 265,
    coverImage: manuscriptImage,
    archiveReference: "Archives des Habous, Tunis",
  },
];

const TUNISIAN_INITIAL_BOOKS_AR: BookItem[] = [
  {
    id: "book-tn-1",
    title: "إتحاف أهل الزمان بأخبار ملوك تونس وعهد الأمان",
    author: "أحمد بن أبي الضياف (1804–1874 م)",
    century: "القرن 19 م",
    category: "سجلات تاريخية",
    description: "المصدر التاريخي والجينيالوجي الأساسي لتونس في العهد الحسيني، يوثق الأنساب والأوامر العلية وشيوخ القبائل والأعيان.",
    pages: 420,
    coverImage: manuscriptImage,
    archiveReference: "المكتبة الوطنية التونسية، م.خ 14820",
  },
  {
    id: "book-tn-2",
    title: "سجلات المحكمة الشرعية بتونس (الدفاتر القضائية)",
    author: "ديوان تونس العثماني",
    century: "القرن 18 – 19 م",
    category: "سجلات قانونية ومحاكم شرعية",
    description: "سجلات قضائية مرقمنة لعقود الزواج، المواريث، حجج الوقف، والبيوعات بمدينة تونس (1750–1881 م).",
    pages: 310,
    coverImage: manuscriptImage,
    archiveReference: "الأرشيف الوطني التونسي، السلسلة التاريخية",
  },
  {
    id: "book-tn-3",
    title: "أنساب وأوقاف أعيان وعلماء القيروان والساحل",
    author: "فقهاء وعدول القيروان",
    century: "القرن 17 م",
    category: "أنساب وأحباس",
    description: "حجج الوقف وتفاصيل شجرات النسب وسلاسل العلماء المحفوظة بالقيروان والمهدية خلال الفترتين الحفصية والعثمانية.",
    pages: 265,
    coverImage: manuscriptImage,
    archiveReference: "أرشيف الأوقاف، تونس",
  },
];`;

content = content.replace(oldInitialBooksRegex, newInitialBooks);

// 2. Update initial load to pick Arabic or English depending on locale
content = content.replace(
  /const \{ t \} = useTranslation\(\);/g,
  `const { t, locale } = useTranslation();
  const isArabic = locale === "ar";
  const defaultInitialBooks = isArabic ? TUNISIAN_INITIAL_BOOKS_AR : TUNISIAN_INITIAL_BOOKS_EN;`
);

content = content.replace(/TUNISIAN_INITIAL_BOOKS/g, 'defaultInitialBooks');

// 3. Update category filter buttons to render translated labels
const oldCategoriesDef = `const categories = ["All", "Historical Chronicles", "Legal & Court Sijillat", "Genealogy & Habous", "Manuscripts"];`;
const newCategoriesDef = `const categoryOptions = [
    { key: "All", labelKey: "cat_all", fallback: isArabic ? "الكل" : "All" },
    { key: "Historical Chronicles", labelKey: "cat_chronicles", fallback: isArabic ? "سجلات تاريخية" : "Historical Chronicles" },
    { key: "Legal & Court Sijillat", labelKey: "cat_sijillat", fallback: isArabic ? "سجلات قانونية ومحاكم شرعية" : "Legal & Court Sijillat" },
    { key: "Genealogy & Habous", labelKey: "cat_genealogy_habous", fallback: isArabic ? "أنساب وأحباس" : "Genealogy & Habous" },
    { key: "Manuscripts", labelKey: "cat_manuscripts", fallback: isArabic ? "مخطوطات نادرة" : "Manuscripts" },
  ];`;

content = content.replace(oldCategoriesDef, newCategoriesDef);

// Replace mapping over categories
content = content.replace(
  /\{categories\.map\(\(cat\) => \(/g,
  `{categoryOptions.map((catOpt) => (`
);
content = content.replace(
  /key=\{cat\}/g,
  `key={catOpt.key}`
);
content = content.replace(
  /onClick=\{\(\) => setCategoryFilter\(cat\)\}/g,
  `onClick={() => setCategoryFilter(catOpt.key)}`
);
content = content.replace(
  /categoryFilter === cat/g,
  `categoryFilter === catOpt.key`
);
content = content.replace(
  />\s*\{cat\}\s*<\/button>/g,
  `>{t(catOpt.labelKey, catOpt.fallback)}</button>`
);

// 4. Update pages count tag: `{book.pages ? `${book.pages} pages` : "Manuscript"}`
content = content.replace(
  /\{book\.pages \? `\$\{book\.pages\} pages` : "Manuscript"\}/g,
  `{book.pages ? \`\${book.pages} \${t("pages_count", isArabic ? "صفحة" : "pages")}\` : t("manuscript_tag", isArabic ? "مخطوطة" : "Manuscript")}`
);

// 5. Update search input placeholder
content = content.replace(
  /placeholder=\{t\("search_library_placeholder",[^)]+\)\}/g,
  `placeholder={t("search_books_placeholder", isArabic ? "ابحث في المخطوطات والكتب وسجلات المحاكم الشرعية…" : "Search manuscripts, books, or registers…")}`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated GalleryBooks.tsx');
