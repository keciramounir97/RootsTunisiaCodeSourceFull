const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const enPath = path.resolve(__dirname, '../src/locales/en.json');
const frPath = path.resolve(__dirname, '../src/locales/fr.json');

const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

// 1. Dashboard Keys to add / repair
const dashboardKeys = {
  // General & Statuses
  "common.saving": "جاري الحفظ...",
  status_approved: "تمت الموافقة",
  status_rejected: "مرفوض",
  status_pending: "قيد الانتظار",
  task_status_todo: "قيد الانتظار",
  task_status_in_progress: "قيد التنفيذ",
  task_status_done: "مكتملة",
  status_todo: "قيد الانتظار",
  status_in_progress: "قيد التنفيذ",
  status_done: "مكتملة",
  reminder_type_custom: "مخصص",
  reminder_type_birthday: "ذكرى ميلاد",
  reminder_type_event: "مناسبة عائلية",
  reminder_type_task: "مهمة بحثية",
  preview: "معاينة",
  cover_preview: "معاينة الغلاف",
  icon_preview: "معاينة الأيقونة",
  receipt_preview: "معاينة الإشعار",
  resource_creation_quotas: "حصص وسعات إنشاء الموارد:",

  // Dashboard page
  account_quotas: "حصص وسعات الحساب",
  view_full_quotas: "عرض كامل الحصص والحدود",
  log_status: "حالة السجل:",
  on_status: "مفعل",
  off_status: "معطل",
  activity_logging_off_notice: "تسجيل النشاطات معطل حالياً لحسابك. قم بتفعيله لاستئناف المتابعة التلقائية.",
  latest_updates: "آخر التحديثات وسجل النشاط",
  tunisia_control_panel: "لوحة تحكم منصة جذور تونس",
  easy_panel_title: "تراثك وأنسابك التونسية، منظمة بدقة",
  easy_panel_admin_desc: "إدارة مجتمع الباحثين، تنظيم السجلات العائلية، وتوثيق الأنساب المغاربية من لوحة واحدة واضحة.",
  easy_panel_user_desc: "ابنِ شجرة عائلتك، اجمع وثائق الأرشيف، واحفظ تاريخ أسرتك التونسية بكل موثوقية.",
  new_tree: "شجرة جديدة",
  browse_library: "تصفح المكتبة",
  total_users: "الأعضاء والباحثون",
  registered_users: "مستخدم مسجل",
  family_trees: "أشجار العائلات",
  lineage_workspaces: "مساحة نسب نشطة",
  total_people: "الأفراد والأعلام",
  indexed_relatives: "فرد مفهرس",
  total_books: "المقتنيات المكتبية",
  books_and_records: "كتاب وسجل تاريخي",
  my_trees: "أشجاري الخاصة",
  private_workspace: "مساحة عملك الخاصة",
  public_trees: "الأشجار العامة",
  shared_lineages: "أنساب عامة وموثقة",
  public_books: "الكتب والمراجع",
  research_materials: "مصادر وأبحاث مرقمنة",
  my_activity: "سجل نشاطاتي",
  recent_updates: "تحديثات وتعديلات حديثة",
  quick_actions: "إجراءات سريعة",
  keep_work_moving: "إدارة المحتوى والبيانات",
  recent_activity: "النشاط الحديث",
  dashboard_load_failed: "فشل تحميل بيانات لوحة التحكم.",

  // Articles & News
  posts_load_failed: "فشل تحميل المقالات والمنشورات الأرشيفية",
  content_required: "نص المقال أو المحتوى مطلوب",
  article_updated: "تم تحديث المقال بنجاح",
  article_created: "تم إنشاء المقال بنجاح",
  article_deleted: "تم حذف المقال بنجاح",
  article_desc: "وصف المقال والبحث التوثيقي",
  with_media: "مع وسائط وملفات مرفقة",
  no_articles: "لا توجد مقالات منشورة حالياً",

  // Books & Audios
  invalid_book_type: "نوع ملف الكتاب غير صالح. يرجى رفع ملف بصيغة PDF أو EPUB.",
  "legacy.audio_file_formats": "دعم ملفات MP3، WAV، M4A (الحد الأقصى 25 ميغابايت)",
  "legacy.invalid_doc_type": "نوع المستند غير مدعوم. يُسمح فقط بملفات PDF و DOC و DOCX و TXT و XLS و XLSX.",
  "legacy.document_file_formats": "دعم ملفات PDF، DOC، DOCX، TXT، XLS، XLSX (الحد الأقصى 25 ميغابايت)",
  "legacy.image_file_formats": "دعم ملفات JPG، PNG، GIF، WEBP (الحد الأقصى 10 ميغابايت)",
  "legacy.document_code_placeholder": "مثال: DOC-12345",
  "admin.individuals.gedcom_snippet_placeholder": "0 @I1@ INDI\n1 NAME أحمد /بن محمد/\n1 SEX M\n1 BIRT\n2 DATE 1905",

  // Legal Content & Settings
  legal_content_not_translated: "لا يتوفر محتوى مترجم لهذه اللغة — يتم عرض المحتوى الافتراضي.",
  how_long_activity_stored: "مدة الاحتفاظ بسجل النشاطات في الخادم",
  update_own_account_info: "تحديث معلومات حسابك الشخصي وكلمة المرور",
  app_name: "جذور تونس",

  // Sources and Archives admin
  source_name: "اسم المصدر الأرشيفي",
  placeholder_source_name: "مثال: دار المحفوظات التونسية، سجلات المجبى",
  source_website_url: "رابط الموقع / العنوان الإلكتروني (URL)",
  placeholder_source_url: "مثال: https://www.archives.nat.tn",
  placeholder_source_desc: "مثال: يحتوي على السجلات التاريخية للعائلات والأنساب التونسية",
  source_icon_flag: "أيقونة أو علم المصدر",
  change_icon: "تغيير الأيقونة",
  update_source: "تحديث المصدر",
  save_source: "حفظ المصدر",

  // Subscriptions & Tier Features
  save_quotas: "حفظ الحصص والحدود",
  edit_creation_quotas: "تعديل حصص الإنشاء",
  tier_features_failed: "فشل تحميل ميزات الباقات",
  tier_feature_update_failed: "فشل تحديث حالة الميزة",
  feature_added: "تمت إضافة الميزة بنجاح.",
  feature_remove_failed: "فشل حذف الميزة",
  tier_features_desc: "تحديد الميزات والصفحات المتاحة لكل باقة اشتراك في المنصة.",
  feature_key_placeholder: "رمز الميزة (مثال: export_gedcom)",
  feature_label_placeholder: "اسم الميزة بالعربية",
  no_features_yet: "لا توجد ميزات محددة بعد.",

  // Trees and GEDCOM
  "legacy.auto_saving": "جاري الحفظ التلقائي...",
  read_only_mode_notice: "أنت تتصفح شجرة مستخدم آخر للقراءة فقط. التعديلات غير مفعلة.",
  read_only: "للقراءة فقط",
  "legacy.code_mode": "كود GEDCOM المباشر (INDI)",
  no_valid_gedcom_records: "لم يتم العثور على سجلات أفراد صالحة في نص GEDCOM المرفق.",
  invalid_gedcom_syntax: "صيغة GEDCOM أو GEDCOM X غير صالحة.",
  placeholder_tree_category: "مثال: شجرة ملكية / عائلية",
  "legacy.gedcomx_format_xml": "صيغة XML",
  "legacy.gedcomx_format_gedx": "ملف .gedx",
  placeholder_doc_code: "مثال: DOC-12345",
  "legacy.tree_saved_gedcom7": "تم حفظ هذه الشجرة بصيغة GEDCOM 7.0 القياسية.",
  "legacy.tree_empty_readonly_hint": "لا تتوفر بيانات GEDCOM لهذه الشجرة حتى الآن.",
  "legacy.tree_empty_hint": "أضف شخصاً يدوياً أو قم باستيراد ملف GEDCOM للبدء.",
  "legacy.add_source_link": "إضافة رابط خارجي للمصدر",
  "legacy.source_link_placeholder": "https://... أو /uploads/documents/file.pdf",
  "legacy.paste_indi_gedcom": "لصق أو كتابة كود GEDCOM للفرد (INDI)",
  "legacy.dates_places": "التواريخ والأماكن",

  // User Settings feedback messages
  language_changed: "تم تغيير اللغة بنجاح",
  password_min_length: "يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.",
  password_match_error: "كلمة المرور الجديدة وتأكيدها غير متطابقين.",
  password_updated_success: "تم تحديث كلمة المرور بنجاح!",
  password_update_failed: "فشل تحديث كلمة المرور. يرجى التحقق من كلمة المرور الحالية.",
  activity_logging_updated: "تم تحديث إعدادات تسجيل النشاط بنجاح.",
  enter_password_confirm_delete: "يرجى إدخال كلمة المرور لتأكيد الحذف الفوري للحساب.",
  account_deletion_submitted: "تم تقديم طلب حذف الحساب بنجاح إلى المشرف العام.",
  account_deletion_failed: "فشل معالجة طلب حذف الحساب.",
  new_password: "كلمة المرور الجديدة"
};

let updatedCount = 0;
for (const [k, v] of Object.entries(dashboardKeys)) {
  if (ar[k] !== v) {
    ar[k] = v;
    updatedCount++;
  }
  if (!en[k]) {
    en[k] = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  if (!fr[k]) {
    fr[k] = en[k];
  }
}

fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf8');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(frPath, JSON.stringify(fr, null, 2), 'utf8');
console.log(`Updated ${updatedCount} translations in ar.json and synced locales.`);

// 2. Fix AdminNotes.tsx
const adminNotesPath = path.resolve(__dirname, '../src/admin/pages/AdminNotes.tsx');
if (fs.existsSync(adminNotesPath)) {
  let c = fs.readFileSync(adminNotesPath, 'utf8');
  c = c.replace(/alt="Preview"/g, 'alt={t("preview", "معاينة")}');
  fs.writeFileSync(adminNotesPath, c, 'utf8');
  console.log('Fixed AdminNotes.tsx');
}

// 3. Fix AdminTasks.tsx
const adminTasksPath = path.resolve(__dirname, '../src/admin/pages/AdminTasks.tsx');
if (fs.existsSync(adminTasksPath)) {
  let c = fs.readFileSync(adminTasksPath, 'utf8');
  c = c.replace(/alt="Preview"/g, 'alt={t("preview", "معاينة")}');
  fs.writeFileSync(adminTasksPath, c, 'utf8');
  console.log('Fixed AdminTasks.tsx');
}

// 4. Fix Books.tsx
const booksPath = path.resolve(__dirname, '../src/admin/pages/Books.tsx');
if (fs.existsSync(booksPath)) {
  let c = fs.readFileSync(booksPath, 'utf8');
  c = c.replace(/alt="Cover preview"/g, 'alt={t("cover_preview", "معاينة الغلاف")}');
  fs.writeFileSync(booksPath, c, 'utf8');
  console.log('Fixed Books.tsx');
}

// 5. Fix SourcesAndArchives.tsx
const sourcesPath = path.resolve(__dirname, '../src/admin/pages/SourcesAndArchives.tsx');
if (fs.existsSync(sourcesPath)) {
  let c = fs.readFileSync(sourcesPath, 'utf8');
  c = c.replace(/alt="Icon Preview"/g, 'alt={t("icon_preview", "معاينة الأيقونة")}');
  fs.writeFileSync(sourcesPath, c, 'utf8');
  console.log('Fixed admin/pages/SourcesAndArchives.tsx');
}

// 6. Fix Subscriptions.tsx
const subPath = path.resolve(__dirname, '../src/admin/pages/Subscriptions.tsx');
if (fs.existsSync(subPath)) {
  let c = fs.readFileSync(subPath, 'utf8');
  c = c.replace(
    /<h3>\s*Resource Creation Quotas:\s*<\/h3>/g,
    '<h3>{t("resource_creation_quotas", "حصص وسعات إنشاء الموارد:")}</h3>'
  );
  fs.writeFileSync(subPath, c, 'utf8');
  console.log('Fixed Subscriptions.tsx');
}

// 7. Fix UserUpgrade.tsx
const upgradePath = path.resolve(__dirname, '../src/admin/pages/UserUpgrade.tsx');
if (fs.existsSync(upgradePath)) {
  let c = fs.readFileSync(upgradePath, 'utf8');
  c = c.replace(/alt="Receipt Preview"/g, 'alt={t("receipt_preview", "معاينة الإشعار")}');
  fs.writeFileSync(upgradePath, c, 'utf8');
  console.log('Fixed UserUpgrade.tsx');
}

// 8. Fix MyDownloadRequests.tsx status
const myDownloadPath = path.resolve(__dirname, '../src/pages/MyDownloadRequests.tsx');
if (fs.existsSync(myDownloadPath)) {
  let c = fs.readFileSync(myDownloadPath, 'utf8');
  if (!c.includes('getStatusLabel')) {
    c = c.replace(
      /const contentTypeLabel = \(type: string\) =>/g,
      `const getStatusLabel = (status: string) => {
    if (status === "approved") return t("status_approved", "تمت الموافقة");
    if (status === "rejected") return t("status_rejected", "مرفوض");
    if (status === "pending") return t("status_pending", "قيد الانتظار");
    return status;
  };

  const contentTypeLabel = (type: string) =>`
    );
    c = c.replace(
      />\s*\{request\.status\}\s*<\/span>/g,
      `>{getStatusLabel(request.status)}</span>`
    );
    fs.writeFileSync(myDownloadPath, c, 'utf8');
    console.log('Fixed MyDownloadRequests.tsx');
  }
}

// 9. Fix UserSettings.tsx feedback messages
const userSettingsPath = path.resolve(__dirname, '../src/admin/pages/UserSettings.tsx');
if (fs.existsSync(userSettingsPath)) {
  let c = fs.readFileSync(userSettingsPath, 'utf8');
  c = c.replace(/setStatus\(\{\s*type:\s*"success",\s*msg:\s*`Language changed to \$\{langCode\.toUpperCase\(\)\}`\s*\}\);/g,
    'setStatus({ type: "success", msg: t("language_changed", "تم تغيير اللغة بنجاح") });');
  c = c.replace(/setStatus\(\{\s*type:\s*"error",\s*msg:\s*"New password must be at least 6 characters long\."\s*\}\);/g,
    'setStatus({ type: "error", msg: t("password_min_length", "يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.") });');
  c = c.replace(/setStatus\(\{\s*type:\s*"error",\s*msg:\s*"New password and confirmation do not match\."\s*\}\);/g,
    'setStatus({ type: "error", msg: t("password_match_error", "كلمة المرور الجديدة وتأكيدها غير متطابقين.") });');
  c = c.replace(/msg:\s*res\.data\?\.message\s*\|\|\s*"Password updated successfully!"/g,
    'msg: res.data?.message || t("password_updated_success", "تم تحديث كلمة المرور بنجاح!")');
  c = c.replace(/msg:\s*err\.response\?\.data\?\.message\s*\|\|\s*"Failed to update password\. Check your current password\."/g,
    'msg: err.response?.data?.message || t("password_update_failed", "فشل تحديث كلمة المرور. يرجى التحقق من كلمة المرور الحالية.")');
  c = c.replace(/msg:\s*`Activity logging turned \$\{nextState \? "ON" : "OFF"\}\.`/g,
    'msg: t("activity_logging_updated", "تم تحديث إعدادات تسجيل النشاط بنجاح.")');
  c = c.replace(/msg:\s*"Please enter your password to confirm immediate account deletion\."/g,
    'msg: t("enter_password_confirm_delete", "يرجى إدخال كلمة المرور لتأكيد الحذف الفوري للحساب.")');
  c = c.replace(/msg:\s*res\.data\?\.message\s*\|\|\s*"Account deletion request submitted to Super Admin\."/g,
    'msg: res.data?.message || t("account_deletion_submitted", "تم تقديم طلب حذف الحساب بنجاح إلى المشرف العام.")');
  c = c.replace(/msg:\s*err\.response\?\.data\?\.message\s*\|\|\s*"Failed to process deletion request\."/g,
    'msg: err.response?.data?.message || t("account_deletion_failed", "فشل معالجة طلب حذف الحساب.")');
  fs.writeFileSync(userSettingsPath, c, 'utf8');
  console.log('Fixed UserSettings.tsx feedback messages');
}

// 10. Fix Dashboard.tsx header
const dashPath = path.resolve(__dirname, '../src/admin/pages/Dashboard.tsx');
if (fs.existsSync(dashPath)) {
  let c = fs.readFileSync(dashPath, 'utf8');
  c = c.replace(/<h2>\{t\("latest_updates", "Tableau de Bord Activity"\)\}<\/h2>/g,
    '<h2>{t("latest_updates", "آخر التحديثات وسجل النشاط")}</h2>');
  fs.writeFileSync(dashPath, c, 'utf8');
  console.log('Fixed Dashboard.tsx heading');
}
