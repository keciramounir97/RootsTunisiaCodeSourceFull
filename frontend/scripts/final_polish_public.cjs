const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const enPath = path.resolve(__dirname, '../src/locales/en.json');
const frPath = path.resolve(__dirname, '../src/locales/fr.json');

const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

const newPublicKeys = {
  research_tools_eyebrow: "أدوات البحث والتوثيق",
  research_tools_title: "كل ما تحتاجه لتوثيق أنساب العائلة التونسية",
  research_tools_intro: "استكشف باقتنا المتكاملة من الأدوات المصممة لحفظ الأسماء، الشهادات الشفوية، الصور، والاستشهادات الأرشيفية التاريخية.",
  open_tool: "فتح الأداة ←",
  tunisian_timeline_eyebrow: "الخط الزمني التونسي",
  tunisian_timeline_title: "سجلات ووثائق تمتد عبر ثلاثة آلاف عام من التاريخ",
  tunisian_timeline_intro: "أنتجت كل حقبة تاريخية أنواعاً محددة من الوثائق. إن فهم طبيعة السجلات العائدة لكل عصر هو مفتاح البحث الجينيالوجي الدقيق.",
  explore_all_9_periods: "استكشف جميع الحقب التاريخية التسع بالتفصيل",
  primary_sources_eyebrow: "المصادر الأولية",
  digitized_catalogued_records: "سجلات ووثائق مرقمنة ومفهرسة",
  digitized_records_intro: "اطلع على الوثائق الأصلية والسجلات المفهرسة من الأرشيفات البلدية والمؤسسات الدينية والخزائن الوطنية في تونس.",
  archival_repositories_eyebrow: "الخزائن والمقرات الأرشيفية",
  official_archives_title: "الأرشيفات الرسمية في تونس وخارجها",
  tunisia: "تونس",
  nav_genealogy_gallery: "معرض الأنساب التونسية",
  genealogy_gallery_subtitle: "أنساب عامة موثقة بمستخرجات الحالة المدنية، دفاتر المحاكم الشرعية، صكوك الأحباس والذاكرة العائلية.",
  create_your_tree: "أنشئ شجرة عائلتك",
  upgrade_for_gedcom_export: "ترقية لتصدير ملفات GEDCOM",
  search_family_name_placeholder: "ابحث عن اسم عائلة، قبيلة، أرشيف أو ولاية…",
  family_tree_builder: "محرر شجرة العائلة والأنساب",
  explore_public_lineages: "استكشف سلاسل الأنساب التونسية العامة",
  explore_public_lineages_intro: "تحمل كل شجرة عائلية مصدرها الأرشيفي ورمز وثيقتها ليتمكن الباحثون من تدقيق الأدلة وتوسيعها.",
  eljem_colosseum_alt: "مسرح الجم الروماني، تونس",
  carthage_ruins_alt: "آثار قرطاج المطلة على البحر الأبيض المتوسط",
  kairouan_courtyard_alt: "صحن جامع القيروان الكبير"
};

for (const [k, v] of Object.entries(newPublicKeys)) {
  ar[k] = v;
  if (!en[k]) en[k] = k.replace(/_/g, ' ');
  if (!fr[k]) fr[k] = en[k];
}

fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf8');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(frPath, JSON.stringify(fr, null, 2), 'utf8');
console.log('Saved new keys in locales');

// Update alt tags in home.tsx, login.tsx, resetpassword.tsx, signup.tsx
const homePath = path.resolve(__dirname, '../src/pages/home.tsx');
if (fs.existsSync(homePath)) {
  let c = fs.readFileSync(homePath, 'utf8');
  c = c.replace(/alt="Roman Colosseum of El Jem, Tunisia"/g, 'alt={t("eljem_colosseum_alt", "مسرح الجم الروماني، تونس")}');
  fs.writeFileSync(homePath, c, 'utf8');
  console.log('Fixed home.tsx alt tag');
}

const loginPath = path.resolve(__dirname, '../src/pages/login.tsx');
if (fs.existsSync(loginPath)) {
  let c = fs.readFileSync(loginPath, 'utf8');
  c = c.replace(/alt="Ruins of Carthage overlooking the Mediterranean"/g, 'alt={t("carthage_ruins_alt", "آثار قرطاج المطلة على البحر الأبيض المتوسط")}');
  fs.writeFileSync(loginPath, c, 'utf8');
  console.log('Fixed login.tsx alt tag');
}

const resetPath = path.resolve(__dirname, '../src/pages/resetpassword.tsx');
if (fs.existsSync(resetPath)) {
  let c = fs.readFileSync(resetPath, 'utf8');
  c = c.replace(/alt="Ruins of Carthage overlooking the Mediterranean"/g, 'alt={t("carthage_ruins_alt", "آثار قرطاج المطلة على البحر الأبيض المتوسط")}');
  fs.writeFileSync(resetPath, c, 'utf8');
  console.log('Fixed resetpassword.tsx alt tag');
}

const signupPath = path.resolve(__dirname, '../src/pages/signup.tsx');
if (fs.existsSync(signupPath)) {
  let c = fs.readFileSync(signupPath, 'utf8');
  c = c.replace(/alt="Great Mosque of Kairouan courtyard"/g, 'alt={t("kairouan_courtyard_alt", "صحن جامع القيروان الكبير")}');
  fs.writeFileSync(signupPath, c, 'utf8');
  console.log('Fixed signup.tsx alt tag');
}
