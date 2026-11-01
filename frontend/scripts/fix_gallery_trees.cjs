const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/GalleryTrees.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Hook up locale
content = content.replace(
  /const \{ t \} = useTranslation\(\);/g,
  `const { t, locale } = useTranslation();
  const isArabic = locale === "ar";`
);

// 2. Governorates options
const oldGovDef = `const governorates = ["All", "Tunis", "Sfax", "Mahdia", "Kairouan", "Sousse", "Djerba", "Bizerte"];`;
const newGovDef = `const governorateOptions = [
    { key: "All", labelKey: "gov_all", fallback: isArabic ? "الكل" : "All" },
    { key: "Tunis", labelKey: "gov_tunis", fallback: isArabic ? "تونس" : "Tunis" },
    { key: "Sfax", labelKey: "gov_sfax", fallback: isArabic ? "صفاقس" : "Sfax" },
    { key: "Mahdia", labelKey: "gov_mahdia", fallback: isArabic ? "المهدية" : "Mahdia" },
    { key: "Kairouan", labelKey: "gov_kairouan", fallback: isArabic ? "القيروان" : "Kairouan" },
    { key: "Sousse", labelKey: "gov_sousse", fallback: isArabic ? "سوسة" : "Sousse" },
    { key: "Djerba", labelKey: "gov_djerba", fallback: isArabic ? "جربة" : "Djerba" },
    { key: "Bizerte", labelKey: "gov_bizerte", fallback: isArabic ? "بنزرت" : "Bizerte" },
  ];`;

content = content.replace(oldGovDef, newGovDef);

// Replace mapping over governorates
content = content.replace(
  /\{governorates\.map\(\(gov\) => \(/g,
  `{governorateOptions.map((govOpt) => (`
);
content = content.replace(
  /key=\{gov\}/g,
  `key={govOpt.key}`
);
content = content.replace(
  /onClick=\{\(\) => setSelectedGov\(gov\)\}/g,
  `onClick={() => setSelectedGov(govOpt.key)}`
);
content = content.replace(
  /selectedGov === gov/g,
  `selectedGov === govOpt.key`
);
content = content.replace(
  />\s*\{gov\}\s*<\/button>/g,
  `>{t(govOpt.labelKey, govOpt.fallback)}</button>`
);

// 3. Search placeholder
content = content.replace(
  /placeholder=\{t\("search_trees_placeholder",[^)]+\)\}/g,
  `placeholder={t("search_trees_placeholder", isArabic ? "ابحث عن شجرة عائلة، لقب، أو باحث…" : "Search family tree, surname, or creator…")}`
);

// 4. Empty state fallbacks
content = content.replace(
  /\{t\("no_trees_yet_title", "Aucun arbre généalogique publié"\)\}/g,
  `{t("no_trees_yet_title", isArabic ? "لا توجد أشجار عائلية منشورة حالياً" : "Aucun arbre généalogique publié")}`
);
content = content.replace(
  /\{t\(\s*"no_trees_yet_desc",\s*"Créez et sauvegardez vos arbres généalogiques dans l'Éditeur d'Arbres\. Ils s'afficheront automatiquement ici avec leurs cartes de famille\.",\s*\)\}/g,
  `{t("no_trees_yet_desc", isArabic ? "أنشئ واحفظ أشجارك العائلية في محرر الأشجار؛ وستظهر تلقائياً هنا مع بطاقات النسب التفاعلية." : "Créez et sauvegardez vos arbres généalogiques dans l'Éditeur d'Arbres. Ils s'afficheront automatiquement ici avec leurs cartes de famille.")}`
);
content = content.replace(
  /<span>Ouvrir l'Éditeur d'Arbres \(Tree Builder\)<\/span>/g,
  `<span>{t("open_tree_builder", isArabic ? "فتح محرر الأشجار (Tree Builder)" : "Ouvrir l'Éditeur d'Arbres (Tree Builder)")}</span>`
);

// 5. Card labels
content = content.replace(
  /\|\| "Roots Tunisia Researcher"/g,
  `|| (isArabic ? "باحث في جذور تونس" : "Roots Tunisia Researcher")`
);
content = content.replace(
  /\|\| "Arbre généalogique numérisé et documenté\."/g,
  `|| (isArabic ? "شجرة عائلية موثقة ومؤرشفة رقمياً." : "Arbre généalogique numérisé et documenté.")`
);
content = content.replace(
  /\|\| "Tunisie"/g,
  `|| (isArabic ? "تونس" : "Tunisie")`
);
content = content.replace(
  /\{t\("generations_label", "Générations:"\)\}/g,
  `{t("generations_label", isArabic ? "الأجيال:" : "Générations:")}`
);
content = content.replace(
  /\{t\("individuals_label", "Individus:"\)\}/g,
  `{t("individuals_label", isArabic ? "الأفراد:" : "Individus:")}`
);
content = content.replace(
  /\{t\("by_author", "Proposé par"\)\}/g,
  `{t("by_author", isArabic ? "مقدمة من طرف" : "Proposé par")}`
);
content = content.replace(
  /\{t\("recently_updated", "Mis à jour récemment"\)\}/g,
  `{t("recently_updated", isArabic ? "تم التحديث مؤخراً" : "Mis à jour récemment")}`
);
content = content.replace(
  /\{t\("explore_family_card", "Explorer la Carte de Famille"\)\}/g,
  `{t("explore_family_card", isArabic ? "استكشاف بطاقة العائلة" : "Explorer la Carte de Famille")}`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated GalleryTrees.tsx');
