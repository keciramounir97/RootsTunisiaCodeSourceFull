const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const enPath = path.resolve(__dirname, '../src/locales/en.json');
const frPath = path.resolve(__dirname, '../src/locales/fr.json');

const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

// 1. New Translations to add to ar.json
const newAr = {
  // Plan names & features
  plan_zitouna_name: "باقة الزيتونة",
  plan_zitouna_price: "مجاناً",
  plan_zitouna_period: "مدى الحياة",
  plan_zitouna_tagline: "للعائلات التي تبدأ في بناء شجرتها الأولى",
  feat_zitouna_1: "شجرة عائلة واحدة، حتى 150 فرداً",
  feat_zitouna_2: "رفع الصور العائلية مع الشروحات والتوثيق",
  feat_zitouna_3: "قراءة دلائل الحقب التاريخية التونسية",
  feat_zitouna_4: "الوصول إلى منتدى الباحثين والمجتمع",
  feat_zitouna_5: "دعم فني قياسي مجاني",
  plan_zitouna_cta: "إنشاء حساب مجاني",

  plan_researcher_name: "باقة الباحث",
  plan_researcher_price: "39 د.ت",
  plan_researcher_period: "شهرياً",
  plan_researcher_tagline: "للبحث الأرشيفي المعمق والتوثيق المتقدم",
  feat_researcher_1: "أشجار عائلية وأفراد غير محدودة",
  feat_researcher_2: "وصول كامل لفهرس الأرشيف والمكتبة التاريخية",
  feat_researcher_3: "استيراد وتصدير ملفات GEDCOM 5.5.1 و 7",
  feat_researcher_4: "إدارة رموز الوثائق والاستشهادات المرجعية",
  feat_researcher_5: "حفظ التسجيلات الشفوية مع تفريغ نصوصها",
  feat_researcher_6: "مساعدة وأولوية في الاستشارات البحثية",
  plan_researcher_cta: "ابدأ البحث الأرشيفي",

  plan_institution_name: "باقة المؤسسات",
  plan_institution_price: "عند الطلب",
  plan_institution_period: "سنوياً",
  plan_institution_tagline: "للجمعيات والمدارس ومراكز الأرشيف والجامعات",
  feat_institution_1: "حسابات متعددة المقاعد لفريق العمل",
  feat_institution_2: "مساحة عمل مخصصة للرقمنة الجماعية",
  feat_institution_3: "مجموعات أرشيفية خاصة مع إدارة الصلاحيات",
  feat_institution_4: "تدريب متخصص في قراءة الخطوط المغربية والتونسية",
  feat_institution_5: "خط دعم مباشر مخصص في تونس",
  feat_institution_6: "اتفاقية مستوى الخدمة المخصصة وتصدير البيانات",
  plan_institution_cta: "اتصل بنا الآن",

  // Sidebar & Navigation
  usage_quotas: "الاستخدام والحصص المتاحة",
  contact_messages: "رسائل التواصل والاستفسارات",
  subscriptions: "الاشتراكات والباقات",

  // Sources & Archives toasts
  source_title_required: "عنوان المصدر مطلوب",
  source_updated_success: "تم تحديث المصدر بنجاح!",
  new_source_created: "تم إنشاء مصدر جديد بنجاح!",
  confirm_delete_source: "هل أنت متأكد من حذف هذا المصدر؟",
  source_deleted: "تم حذف المصدر بنجاح.",

  // Notes toasts
  note_title_required: "عنوان الملاحظة مطلوب",
  note_updated_success: "تم تحديث الملاحظة بنجاح!",
  new_note_added: "تمت إضافة ملاحظة جديدة بنجاح!",
  confirm_delete_note: "هل أنت متأكد من حذف هذه الملاحظة؟",
  note_deleted: "تم حذف الملاحظة بنجاح.",

  // Payment toasts & messages
  payment_recorded_success: "تم تسجيل تأكيد الدفع! سيتم تفعيل اشتراكك خلال لحظات.",
  payment_recorded_failed: "فشل تسجيل الدفع. يرجى الاتصال بالدعم الفني.",
  payment_proof_submitted: "تم تقديم إشعار الدفع بنجاح! سيقوم المشرف العام بمراجعته وتفعيل باقتك قريباً.",
  payment_proof_failed: "فشل إرسال إشعار الدفع. يرجى المحاولة لاحقاً.",
  user_upgrade_success: "تمت ترقية المستخدم بنجاح!",
  user_upgrade_failed: "فشلت ترقية المستخدم.",

  // Download requests
  status_approved: "تمت الموافقة",
  status_rejected: "مرفوض",
  status_pending: "قيد المراجعة",
  unknown_user: "مستخدم غير معروف",
  requested_to_download: "طلب تنزيل",
  content_uploaded_on: "تاريخ الرفع",
  download_requests_failed: "تعذر تحميل طلبات التنزيل",
  download_request_decision_failed: "تعذر تحديث حالة طلب التنزيل",
  requests_i_made: "طلبات قمت بها",
  requests_for_my_content: "طلبات تنزيل لمحتواي",
  no_download_requests: "لا توجد طلبات تنزيل حالياً",
  my_download_requests: "طلبات التنزيل الخاصة بي",

  // Tasks & Reminders
  task_board: "لوحة متابعة المهام البحثية",
  task_create: "إنشاء مهمة جديدة",
  task_title: "عنوان المهمة",
  task_description: "وصف وتفاصيل المهمة",
  task_status_todo: "قيد الانتظار",
  task_status_in_progress: "قيد التنفيذ",
  task_status_done: "مكتملة",
  task_no_tasks: "لا توجد مهام حالياً",
  status_todo: "قيد الانتظار",
  status_in_progress: "قيد التنفيذ",
  status_done: "مكتملة",

  note_new: "ملاحظة جديدة",
  note_title: "عنوان الملاحظة",
  note_content: "ابدأ كتابة ملاحظاتك هنا...",
  note_save: "حفظ الملاحظة",
  note_no_notes: "لا توجد ملاحظات مسجلة بعد. أنشئ ملاحظتك الأولى!",
  note_created: "تاريخ الإنشاء",
  note_updated: "آخر تحديث",

  reminders: "التذكيرات والمواعيد",
  reminder_new: "تذكير جديد",
  reminder_title: "عنوان التذكير",
  reminder_date: "التاريخ",
  reminder_time: "الوقت",
  reminder_type_custom: "مخصص",
  reminder_type_birthday: "ذكرى ميلاد",
  reminder_type_event: "مناسبة عائلية",
  reminder_type_task: "مهمة أرشيفية",
  reminder_create: "إنشاء التذكير",
  reminder_no_reminders: "لا توجد تذكيرات مسجلة حالياً",

  // Usage & Quotas
  usage_and_quotas: "الاستخدام والحصص المتاحة",
  usage_subtitle: "متابعة حدود الحساب واستهلاك الموارد الأرشيفية",
  upgrade_subscription: "ترقية الاشتراك",
  unlimited_super_admin: "مشرف متميز غير محدود",
  active_plan: "الباقة الحالية",
  super_admin_unlimited_tier: "المستوى غير المحدود للمسؤول المتميز",
  tier_features: "مزايا الباقة",
  super_admin_quota_unrestricted: "بصفتك مسؤولاً، يتمتع حسابك بحقوق إنشاء غير محدودة عبر جميع موارد المنصة.",
  user_quota_info: "يتم تحديد حصص الإنشاء في حسابك وفقاً لخطتك النشطة. يمكنك الترقية في أي وقت لزيادة السعة.",
  view_plans: "عرض خطط الترقية",
  quota_limit_reached: "تم بلوغ الحد الأقصى للحصة!",
  quota_limit_reached_desc: "تم استنفاد واحد أو أكثر من حدود الإنشاء في حسابك. قم بترقية خطتك لمتابعة بناء الأشجار ورفع الملفات.",
  upgrade_plan: "ترقية الباقة",
  full: "ممتلئ",
  unlimited_access: "وصول غير محدود",
  used: "مستخدم",
  manage_resource: "إدارة",
  custom_admin_quota: "حصة مخصصة من الإدارة",
  view_full_quotas: "عرض الحصص الكاملة",
  account_quotas: "حصص الحساب"
};

// 2. Add to ar.json
Object.assign(ar, newAr);
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf8');
console.log('Updated ar.json with new translations.');

// Also add to en and fr if missing
for (const [k, v] of Object.entries(newAr)) {
  if (!en[k]) en[k] = k.replace(/_/g, ' ');
  if (!fr[k]) fr[k] = k.replace(/_/g, ' ');
}
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(frPath, JSON.stringify(fr, null, 2), 'utf8');
console.log('Synced en.json and fr.json.');

// 3. Patch subscriptions.tsx
const subPath = path.resolve(__dirname, '../src/pages/subscriptions.tsx');
let subContent = fs.readFileSync(subPath, 'utf8');

subContent = subContent.replace('key={p.name}', 'key={p.id}');
subContent = subContent.replace('{p.period}', '{t(p.periodKey, p.periodFallback)}');
subContent = subContent.replace(
  `{p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
                    <span>{f}</span>
                  </li>
                ))}`,
  `{p.features.map((f) => (
                  <li key={f.key} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
                    <span>{t(f.key, f.fallback)}</span>
                  </li>
                ))}`
);

fs.writeFileSync(subPath, subContent, 'utf8');
console.log('Patched subscriptions.tsx');

// 4. Patch payment.tsx
const payPath = path.resolve(__dirname, '../src/pages/payment.tsx');
let payContent = fs.readFileSync(payPath, 'utf8');

payContent = payContent.replace(
  'msg: "Payment confirmation recorded! Your subscription will be active momentarily.",',
  'msg: t("payment_recorded_success", "تم تسجيل تأكيد الدفع! سيتم تفعيل اشتراكك خلال لحظات."),'
);
payContent = payContent.replace(
  'msg: err.response?.data?.message || "Failed to record payment. Please contact support.",',
  'msg: err.response?.data?.message || t("payment_recorded_failed", "فشل تسجيل الدفع. يرجى الاتصال بالدعم الفني."),'
);
payContent = payContent.replace(
  '{planParam} {t("plan", "Plan")}',
  '{planParam === "researcher" ? t("plan_researcher_name", "باقة الباحث") : planParam === "institution" ? t("plan_institution_name", "باقة المؤسسات") : t("plan_zitouna_name", "باقة الزيتونة")} {t("plan", "Plan")}'
);

fs.writeFileSync(payPath, payContent, 'utf8');
console.log('Patched payment.tsx');

// 5. Patch UserUpgrade.tsx
const upPath = path.resolve(__dirname, '../src/admin/pages/UserUpgrade.tsx');
let upContent = fs.readFileSync(upPath, 'utf8');

upContent = upContent.replace(
  'msg: `Payment proof for ${selectedTier.name} plan submitted! Super Admin will review and activate your tier shortly.`,',
  'msg: t("payment_proof_submitted", "تم تقديم إشعار الدفع بنجاح! سيقوم المشرف العام بمراجعته وتفعيل باقتك قريباً."),'
);
upContent = upContent.replace(
  'msg: err.response?.data?.message || "Failed to submit payment proof",',
  'msg: err.response?.data?.message || t("payment_proof_failed", "فشل إرسال إشعار الدفع. يرجى المحاولة لاحقاً."),'
);
upContent = upContent.replace(
  'msg: `User #${adminSelectedUser.id} upgraded successfully!`,',
  'msg: t("user_upgrade_success", "تمت ترقية المستخدم بنجاح!"),'
);
upContent = upContent.replace(
  'msg: err.response?.data?.message || "Failed to upgrade user",',
  'msg: err.response?.data?.message || t("user_upgrade_failed", "فشلت ترقية المستخدم."),'
);

fs.writeFileSync(upPath, upContent, 'utf8');
console.log('Patched UserUpgrade.tsx');
