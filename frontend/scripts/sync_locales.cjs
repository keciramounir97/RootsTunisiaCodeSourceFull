const fs = require('fs');
const path = require('path');

const arPath = path.join(__dirname, '../src/locales/ar.json');
const enPath = path.join(__dirname, '../src/locales/en.json');
const frPath = path.join(__dirname, '../src/locales/fr.json');

const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

const newAr = {
  "skip_to_main_content": "الانتقال إلى المحتوى الرئيسي",
  "view_note": "عرض الملاحظة",
  "edit_note": "تعديل الملاحظة",
  "delete_note": "حذف الملاحظة",
  "add_research_note": "+ إضافة ملاحظة بحثية",
  "view_task_details": "عرض تفاصيل المهمة",
  "edit_task": "تعديل المهمة",
  "delete_task": "حذف المهمة",
  "open_file": "فتح الملف",
  "download": "تحميل",
  "admin.individuals.saved_in_db": "محفوظ في قاعدة البيانات",
  "edit_source": "تعديل المصدر",
  "delete_source": "حذف المصدر",
  "default_tree_name": "شجرة العائلة والنسب",
  "seo_audio_title": "التاريخ الشفوي التونسي — الذاكرة العائلية المسجلة",
  "seo_contact_title": "اتصل بنا — جذور تونس",
  "seo_gallery_title": "المعرض البصري — جذور تونس",
  "seo_trees_title": "أشجار العائلات التونسية — جذور تونس",
  "seo_home_title": "جذور تونس — المصادر، الأرشيف، والأنساب",
  "seo_library_title": "المكتبة الجينيالوجية — جذور تونس",
  "seo_login_title": "تسجيل الدخول — جذور تونس",
  "seo_payment_title": "تأكيد الاشتراك — جذور تونس",
  "seo_periods_title": "الحقب التاريخية التونسية — جذور تونس",
  "seo_refund_title": "سياسة الاسترجاع والإلغاء — جذور تونس",
  "seo_reset_title": "إعادة تعيين كلمة المرور — جذور تونس",
  "seo_signup_title": "إنشاء حساب — جذور تونس",
  "seo_sources_title": "دليل المصادر والأرشيف التونسي — جذور تونس",
  "seo_subscriptions_title": "الاشتراكات والباقات — جذور تونس"
};

const newEn = {
  "skip_to_main_content": "Skip to main content",
  "view_note": "View Full Note",
  "edit_note": "Edit Note",
  "delete_note": "Delete Note",
  "add_research_note": "+ Add Research Note",
  "view_task_details": "View Task Details",
  "edit_task": "Edit Task",
  "delete_task": "Delete Task",
  "open_file": "Open file",
  "download": "Download",
  "admin.individuals.saved_in_db": "Saved in DB",
  "edit_source": "Edit Source",
  "delete_source": "Delete Source",
  "default_tree_name": "Family Lineage Tree",
  "seo_audio_title": "Tunisian Oral Histories — Recorded Family Memory",
  "seo_contact_title": "Contact Roots Tunisia — Research Help & Partnerships",
  "seo_gallery_title": "Tunisian Visual Heritage — Roots Tunisia Photo Gallery",
  "seo_trees_title": "Tunisian Family Trees — Roots Tunisia Genealogy Gallery",
  "seo_home_title": "Roots Tunisia — Tunisian Sources, Archives & Family Timelines",
  "seo_library_title": "Tunisian Genealogy Library — Manuscripts, Registers & Guides",
  "seo_login_title": "Login — Roots Tunisia",
  "seo_payment_title": "Confirm Subscription — Roots Tunisia",
  "seo_periods_title": "Tunisian Historical Periods — Records by Era",
  "seo_refund_title": "Refund & Cancellation Policy — Roots Tunisia",
  "seo_reset_title": "Reset Password — Roots Tunisia",
  "seo_signup_title": "Create Account — Roots Tunisia",
  "seo_sources_title": "Tunisian Genealogy Sources & Archives Directory",
  "seo_subscriptions_title": "Subscriptions — Roots Tunisia Research Plans"
};

const newFr = {
  "skip_to_main_content": "Aller au contenu principal",
  "view_note": "Voir la note",
  "edit_note": "Modifier la note",
  "delete_note": "Supprimer la note",
  "add_research_note": "+ Ajouter une note",
  "view_task_details": "Voir les détails de la tâche",
  "edit_task": "Modifier la tâche",
  "delete_task": "Supprimer la tâche",
  "open_file": "Ouvrir le fichier",
  "download": "Télécharger",
  "admin.individuals.saved_in_db": "Sauvegardé en BDD",
  "edit_source": "Modifier la source",
  "delete_source": "Supprimer la source",
  "default_tree_name": "Arbre Généalogique Familial",
  "seo_audio_title": "Mémoires orales tunisiennes — Roots Tunisia",
  "seo_contact_title": "Contactez Roots Tunisia",
  "seo_gallery_title": "Patrimoine visuel tunisien — Galerie Photos",
  "seo_trees_title": "Arbres généalogiques tunisiens — Roots Tunisia",
  "seo_home_title": "Roots Tunisia — Sources, Archives & Arbres",
  "seo_library_title": "Bibliothèque généalogique tunisienne",
  "seo_login_title": "Connexion — Roots Tunisia",
  "seo_payment_title": "Confirmer l'abonnement — Roots Tunisia",
  "seo_periods_title": "Périodes historiques tunisiennes",
  "seo_refund_title": "Politique de remboursement — Roots Tunisia",
  "seo_reset_title": "Réinitialiser le mot de passe — Roots Tunisia",
  "seo_signup_title": "Créer un compte — Roots Tunisia",
  "seo_sources_title": "Répertoire des sources et archives tunisiennes",
  "seo_subscriptions_title": "Abonnements et Forfaits — Roots Tunisia"
};

Object.assign(ar, newAr);
Object.assign(en, newEn);
Object.assign(fr, newFr);

fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf8');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(frPath, JSON.stringify(fr, null, 2), 'utf8');

console.log('Appended additional titles and SEO keys successfully');
