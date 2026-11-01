const fs = require('fs');
const path = 'frontend/src/utils/sourceFallbackTranslations.ts';
let code = fs.readFileSync(path, 'utf8');

const arAdditions = `    "payment_beneficiary": "المستفيد / اسم صاحب الحساب",
    "payment_bank": "اسم البنك أو المؤسسة المالية",
    "payment_account": "رقم الحساب البنكي / IBAN",
    "payment_reference": "الرمز المرجعي للتحويل",
    "payment_currency": "العملة",
    "payment_method": "طريقة الدفع",
    "id_col": "المعرف",
    "article_num": "المادة رقم",
    "failed_load_approvals": "فشل تحميل طلبات الموافقة",
    "action_failed": "فشلت العملية، يرجى المحاولة لاحقاً",
    "failed_save_admin": "فشل حفظ بيانات المشرف",
    "privilege_dashboard": "لوحة التحكم",
    "privilege_trees": "أشجار العائلة",
    "privilege_individuals": "الأفراد والأسلاف",
    "privilege_gallery": "معرض الصور",
    "privilege_audios": "الأرشيف الصوتي",
    "privilege_documents": "الوثائق التاريخية",
    "privilege_books": "المكتبة والمخطوطات",
    "privilege_users": "إدارة المستخدمين",
    "privilege_suggestions": "الاقتراحات والطلبات",
    "privilege_approvals": "موافقات المستخدمين",
    "privilege_activity": "سجل النشاطات",
    "privilege_settings": "الإعدادات العامة",
    "tier_free": "المجانية",
    "tier_basic": "الأساسية",
    "tier_researcher": "الباحث",
    "tier_institution": "المؤسسات",
    "role_super_admin": "مشرف عام",
    "role_admin": "مشرف",
    "role_user": "مستخدم",
    "legacy.status_pending": "قيد المراجعة",
    "legacy.status_approved": "تمت الموافقة",
    "legacy.status_completed": "مكتمل",
    "legacy.status_rejected": "مرفوض",
    "legacy.status_all": "الكل",
    "status_all": "الكل",
`;

if (!code.includes('"payment_beneficiary"')) {
  code = code.replace('"ar": {', '"ar": {\n' + arAdditions);
  fs.writeFileSync(path, code, 'utf8');
  console.log('Successfully injected into sourceFallbackTranslations.ts (ar)');
} else {
  console.log('Already present in sourceFallbackTranslations.ts');
}
