const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/components/FamilyCardModal.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Hook up locale
content = content.replace(
  /const \{ t \} = useTranslation\(\);/g,
  `const { t, locale } = useTranslation();
  const isArabic = locale === "ar";`
);

// 2. Tab buttons
content = content.replace(
  /\{t\("tree_graph_schema", "Schéma Graphique de l'Arbre"\)\}/g,
  `{t("tree_graph_schema", isArabic ? "المخطط البياني التفاعلي للشجرة" : "Schéma Graphique de l'Arbre")}`
);
content = content.replace(
  /\{t\("file_and_gedcom", "Fiche & GEDCOM"\)\}/g,
  `{t("file_and_gedcom", isArabic ? "البطاقة التوثيقية و GEDCOM" : "Fiche & GEDCOM")}`
);

// 3. Individual 3D card
content = content.replace(
  /\{t\("card_individual_3d", "Carte Individuelle 3D"\)\}/g,
  `{t("card_individual_3d", isArabic ? "بطاقة فردية ثلاثية الأبعاد" : "Carte Individuelle 3D")}`
);
content = content.replace(
  /\{t\("registered_document", "Document Registré"\)\}/g,
  `{t("registered_document", isArabic ? "وثيقة مسجلة وموثقة" : "Document Registré")}`
);
content = content.replace(
  /\{t\("birth", "Naissance"\)\}/g,
  `{t("birth", isArabic ? "الميلاد" : "Naissance")}`
);
content = content.replace(
  /\{t\("unknown_date", "Date inconnue"\)\}/g,
  `{t("unknown_date", isArabic ? "تاريخ غير معروف" : "Date inconnue")}`
);
content = content.replace(
  /\{t\("death", "Décès"\)\}/g,
  `{t("death", isArabic ? "الوفاة" : "Décès")}`
);
content = content.replace(
  /\{t\("living_or_unlisted", "Vivant \/ Non répertorié"\)\}/g,
  `{t("living_or_unlisted", isArabic ? "على قيد الحياة / غير مسجل" : "Vivant / Non répertorié")}`
);
content = content.replace(
  /\{t\("notice_and_details", "Notice & Détails"\)\}/g,
  `{t("notice_and_details", isArabic ? "البيانات والملاحظات التوثيقية" : "Notice & Détails")}`
);
content = content.replace(
  /\{t\("hover_card_3d", "Survolez la carte avec la souris pour faire pivoter en 3D"\)\}/g,
  `{t("hover_card_3d", isArabic ? "حرّك الفأرة فوق البطاقة للتفاعل ثلاثي الأبعاد" : "Survolez la carte avec la souris pour faire pivoter en 3D")}`
);

// 4. Schema tab hints
content = content.replace(
  /\{t\("interactive_tree_schema_hint", "Schéma interactif d'arborescence \(Molette pour Zoom, Glisser pour Pan\)"\)\}/g,
  `{t("interactive_tree_schema_hint", isArabic ? "مخطط شجري تفاعلي (عجلة الفأرة للتكبير، والسحب للتحريك)" : "Schéma interactif d'arborescence (Molette pour Zoom, Glisser pour Pan)")}`
);
content = content.replace(
  /\{t\("loading_gedcom", "Chargement GEDCOM\.\.\."\)\}/g,
  `{t("loading_gedcom", isArabic ? "جاري تحميل بيانات GEDCOM..." : "Chargement GEDCOM...")}`
);
content = content.replace(
  /\{t\("linked_cards", "Cartes Liées"\)\}/g,
  `{t("linked_cards", isArabic ? "بطاقات مرتبطة" : "Cartes Liées")}`
);

// 5. Details tab
content = content.replace(
  /\{t\("generations", "Générations"\)\}/g,
  `{t("generations", isArabic ? "الأجيال" : "Générations")}`
);
content = content.replace(
  /\{t\("persons", "Personnes"\)\}/g,
  `{t("persons", isArabic ? "الأفراد" : "Personnes")}`
);
content = content.replace(
  /\{t\("registry", "Registre"\)\}/g,
  `{t("registry", isArabic ? "السجل" : "Registre")}`
);
content = content.replace(
  /\{t\("tunisian_archives", "Archives Tunisiennes"\)\}/g,
  `{t("tunisian_archives", isArabic ? "الأرشيف التونسي" : "Archives Tunisiennes")}`
);

// 6. Request form & actions bar
content = content.replace(
  /\{t\("request_archive_access", "Demande d'Accès aux Archives"\)\}/g,
  `{t("request_archive_access", isArabic ? "طلب الوصول إلى الأرشيف" : "Demande d'Accès aux Archives")}`
);
content = content.replace(
  /\{isIndividualModal \? t\("individual", "Individu"\) : t\("tree", "Arbre"\)\}/g,
  `{isIndividualModal ? t("individual", isArabic ? "فرد" : "Individu") : t("tree", isArabic ? "شجرة" : "Arbre")}`
);
content = content.replace(
  /placeholder=\{t\("placeholder_archive_reason", "Indiquez le motif de votre recherche généalogique\.\.\."\)\}/g,
  `placeholder={t("placeholder_archive_reason", isArabic ? "وضح سبب بحثك الجينالوجي والغرض منه..." : "Indiquez le motif de votre recherche généalogique...")}`
);
content = content.replace(
  /\{t\("submit_access_request", "Envoyer la Demande d'Accès"\)\}/g,
  `{t("submit_access_request", isArabic ? "إرسال طلب الوصول" : "Envoyer la Demande d'Accès")}`
);
content = content.replace(
  /\{isIndividualModal \? t\("download_profile_extract", "Télécharger Fiche \/ Extrait"\) : t\("download_or_request_gedcom", "Télécharger \/ Demander GEDCOM"\)\}/g,
  `{isIndividualModal ? t("download_profile_extract", isArabic ? "تحميل البطاقة / المستخرج" : "Télécharger Fiche / Extrait") : t("download_or_request_gedcom", isArabic ? "تحميل / طلب ملف GEDCOM" : "Télécharger / Demander GEDCOM")}`
);
content = content.replace(
  /\{t\("close_card", "Fermer la Carte"\)\}/g,
  `{t("close_card", isArabic ? "إغلاق البطاقة" : "Fermer la Carte")}`
);

// Default fallbacks in metadata
content = content.replace(
  /"Notice généalogique documentée conservée dans le catalogue des archives de Tunisie\."/g,
  `(isArabic ? "وثيقة جينيالوجية موثقة محفوظة في فهارس الأرشيف التونسي." : "Notice généalogique documentée conservée dans le catalogue des archives de Tunisie.")`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated FamilyCardModal.tsx');
