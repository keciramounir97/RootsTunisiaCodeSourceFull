const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/GalleryImages.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Localize TUNISIAN_INITIAL_IMAGES
const oldInitialImagesRegex = /const TUNISIAN_INITIAL_IMAGES: ImageItem\[\] = \[([\s\S]*?)\];/;
const newInitialImages = `const TUNISIAN_INITIAL_IMAGES_EN: ImageItem[] = [
  {
    id: "img-tn-1",
    title: "Medina of Tunis Souk Alley & Archways",
    category: "Landmarks & Architecture",
    governorate: "Tunis",
    yearStr: "c. 1910",
    imageUrl: medina,
    description: "Traditional arched souk alleyways in the historic Medina of Tunis, a UNESCO World Heritage site and home to centuries of family residences.",
    likes: 88,
  },
  {
    id: "img-tn-2",
    title: "Sidi Bou Saïd Blue and White Coastal Architecture",
    category: "Landmarks & Architecture",
    governorate: "Tunis / Sidi Bou Saïd",
    yearStr: "c. 1925",
    imageUrl: sidiBouSaid,
    description: "Famous cliffside village overlooking the Gulf of Tunis, renowned for its blue lattice windows (mashrabiya) and whitewashed walls.",
    likes: 95,
  },
  {
    id: "img-tn-3",
    title: "Great Mosque of Kairouan & Ancient Minaret",
    category: "Historic Landmarks",
    governorate: "Kairouan",
    yearStr: "c. 1900",
    imageUrl: kairouan,
    description: "The premier spiritual and scholarship sanctuary of North Africa, founded in 670 AD, keeping family lineage registers and waqf charters.",
    likes: 112,
  },
  {
    id: "img-tn-4",
    title: "Roman Amphitheatre of El Jem",
    category: "Ancient Heritage",
    governorate: "Mahdia / El Jem",
    yearStr: "Historical Monument",
    imageUrl: eljem,
    description: "The majestic Roman amphitheatre of Thysdrus (El Jem), illustrating the deep antiquity and epigraphic legacy of central Tunisia.",
    likes: 74,
  },
  {
    id: "img-tn-5",
    title: "Traditional Domed Djerban Menzel Architecture",
    category: "Regional Heritage",
    governorate: "Médenine / Djerba",
    yearStr: "c. 1930",
    imageUrl: djerba,
    description: "Distinctive whitewashed domed houses (menzels) in Djerba, reflecting centuries of island community settlement and family heritage.",
    likes: 67,
  },
  {
    id: "img-tn-6",
    title: "Medina of Tunis Ornate Studded Door & Blue Grille",
    category: "Landmarks & Architecture",
    governorate: "Tunis",
    yearStr: "c. 1915",
    imageUrl: medina,
    description: "Ornate studded wooden door with wrought-iron grille in the Medina of Tunis, reflecting patrician architectural heritage.",
    likes: 104,
  },
];

const TUNISIAN_INITIAL_IMAGES_AR: ImageItem[] = [
  {
    id: "img-tn-1",
    title: "أروقة وأقواس أسواق مدينة تونس العتيقة",
    category: "معالم وعمارة",
    governorate: "تونس",
    yearStr: "حوالي 1910 م",
    imageUrl: medina,
    description: "أزقة وأسواق مسقوفة تقليدية في مدينة تونس التاريخية، المصنفة تراثاً عالمياً لليونسكو ومقر إقامة العائلات لقرون.",
    likes: 88,
  },
  {
    id: "img-tn-2",
    title: "سيدي بوسعيد — العمارة الساحلية الأندلسية الزرقاء",
    category: "معالم وعمارة",
    governorate: "تونس / سيدي بوسعيد",
    yearStr: "حوالي 1925 م",
    imageUrl: sidiBouSaid,
    description: "القرية العريقة المطلة على خليج قرطاج، المشهورة بالشبابيك المقوسة والشناشيل الزرقاء والجدران البيضاء.",
    likes: 95,
  },
  {
    id: "img-tn-3",
    title: "جامع القيروان الكبير ومئذنته الأثرية",
    category: "معالم تاريخية",
    governorate: "القيروان",
    yearStr: "حوالي 1900 م",
    imageUrl: kairouan,
    description: "المنارة العلمية والروحية الأبرز في شمال أفريقيا، التي تأسست سنة 670 م وتضم خزائن الأنساب وسجلات الأوقاف.",
    likes: 112,
  },
  {
    id: "img-tn-4",
    title: "مسرح الجم الروماني (قصر الجم)",
    category: "تراث قديم",
    governorate: "المهدية / الجم",
    yearStr: "معلم تاريخي",
    imageUrl: eljem,
    description: "المدرج الروماني الأثري الضخم بالجم، الشاهد على عراقة التراث وتاريخ الإقليم التونسي.",
    likes: 74,
  },
  {
    id: "img-tn-5",
    title: "عمارة المنازل التقليدية المقببة بجزيرة جربة",
    category: "تراث جهوي",
    governorate: "مدنين / جربة",
    yearStr: "حوالي 1930 م",
    imageUrl: djerba,
    description: "المنازل البيضاء المميزة بجربة المعتمدة على نظام معماري فريد يعكس استقرار مجتمعات الجزيرة وتراثها.",
    likes: 67,
  },
  {
    id: "img-tn-6",
    title: "باب خشبي مرصع بنقوش تقليدية وشباك حديدي بمدينة تونس",
    category: "معالم وعمارة",
    governorate: "تونس",
    yearStr: "حوالي 1915 م",
    imageUrl: medina,
    description: "باب عتيق مرصع بالمسامير مع شبكة حديدية مشغولة في مدينة تونس العتيقة، يعكس فخامة العمارة التونسية الأصيلة.",
    likes: 104,
  },
];`;

content = content.replace(oldInitialImagesRegex, newInitialImages);

// 2. Hook up locale
content = content.replace(
  /const \{ t \} = useTranslation\(\);/g,
  `const { t, locale } = useTranslation();
  const isArabic = locale === "ar";
  const defaultInitialImages = isArabic ? TUNISIAN_INITIAL_IMAGES_AR : TUNISIAN_INITIAL_IMAGES_EN;`
);

content = content.replace(/TUNISIAN_INITIAL_IMAGES/g, 'defaultInitialImages');

// 3. Category options
const oldCategoriesDef = `const categories = ["All", "Landmarks & Architecture", "Historic Landmarks", "Family Portraits", "Regional Heritage", "Ancient Heritage"];`;
const newCategoriesDef = `const categoryOptions = [
    { key: "All", labelKey: "cat_all", fallback: isArabic ? "الكل" : "All" },
    { key: "Landmarks & Architecture", labelKey: "img_cat_landmarks", fallback: isArabic ? "معالم وعمارة" : "Landmarks & Architecture" },
    { key: "Historic Landmarks", labelKey: "img_cat_historic", fallback: isArabic ? "معالم تاريخية" : "Historic Landmarks" },
    { key: "Family Portraits", labelKey: "img_cat_portraits", fallback: isArabic ? "بورتريهات عائلية" : "Family Portraits" },
    { key: "Regional Heritage", labelKey: "img_cat_regional", fallback: isArabic ? "تراث جهوي" : "Regional Heritage" },
    { key: "Ancient Heritage", labelKey: "img_cat_ancient", fallback: isArabic ? "تراث قديم" : "Ancient Heritage" },
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

// 4. Update search input placeholder
content = content.replace(
  /placeholder=\{t\("search_images_placeholder",[^)]+\)\}/g,
  `placeholder={t("search_images_placeholder", isArabic ? "ابحث عن صورة، معلم، أو ولاية…" : "Search photo by title, description or location…")}`
);

// 5. Update view high res and modal labels
content = content.replace(
  /<span>\{t\("view_high_res", "View Full Photo"\)\}<\/span>/g,
  `<span>{t("view_high_res", isArabic ? "عرض الصورة كاملة" : "View Full Photo")}</span>`
);

content = content.replace(
  /t\("historical_record", "Historical Record"\)/g,
  `t("historical_record", isArabic ? "سجل تاريخي" : "Historical Record")`
);

content = content.replace(
  /t\("tunisia", "Tunisia"\)/g,
  `t("tunisia", isArabic ? "تونس" : "Tunisia")`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated GalleryImages.tsx');
