const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/Research.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Hook up locale
content = content.replace(
  /const \{ t \} = useTranslation\(\);/g,
  `const { t, locale } = useTranslation();
  const isArabic = locale === "ar";`
);

// 2. Replace hardcoded Loading...
content = content.replace(
  /<p className="py-20 text-center text-\[var\(--gold\)\] font-display text-lg">Loading…<\/p>/g,
  `<p className="py-20 text-center text-[var(--gold)] font-display text-lg">{t("loading", isArabic ? "جاري التحميل..." : "Loading…")}</p>`
);

// 3. Update search placeholder fallback
content = content.replace(
  /placeholder=\{t\("research_input_placeholder",[^)]+\)\}/g,
  `placeholder={t("research_input_placeholder", isArabic ? "ابحث عن اسم عائلة، قبيلة، أرشيف أو ولاية…" : "Search family name, tribe, archive or governorate…")}`
);

// 4. Update empty state fallbacks
content = content.replace(
  /\{t\("no_matching_trees",[^)]+\)\}/g,
  `{t("no_matching_trees", isArabic ? "لم يتم العثور على أشجار عائلية مطابقة لبحثك." : "No matching trees found.")}`
);

content = content.replace(
  /\{t\("no_matching_books",[^)]+\)\}/g,
  `{t("no_matching_books", isArabic ? "لم يتم العثور على وثائق مكتبية مطابقة لبحثك." : "No matching library documents found.")}`
);

content = content.replace(
  /\{t\("pedigree_load_failed",[^)]+\)\}/g,
  `{t("pedigree_load_failed", isArabic ? "تعذر تحميل بيانات شجرة النسب." : "Failed to load pedigree data.")}`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated Research.tsx');
