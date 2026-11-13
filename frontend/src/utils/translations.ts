import en from "../locales/en.json";
import fr from "../locales/fr.json";
import ar from "../locales/ar.json";
import es from "../locales/es.json";
import it from "../locales/it.json";
import mt from "../locales/mt.json";
import { SOURCE_FALLBACK_TRANSLATIONS } from "./sourceFallbackTranslations";
import { AUTO_TRANSLATIONS } from "./generatedTranslations";
import { englishGeneratedTranslations } from "./englishGeneratedTranslations";
import { FEATURE_TRANSLATIONS } from "./featureTranslations";
import { ADDITION_TRANSLATIONS } from "./siteAdditionTranslations";

export const SUPPORTED_LOCALES = ["en", "fr", "ar", "es", "it", "mt"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "fr";

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
  es: "ES",
  it: "IT",
  mt: "MT",
};

export const LOCALE_FULL_NAMES: Record<SupportedLocale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  es: "Español",
  it: "Italiano",
  mt: "Malti",
};

export const RTL_LOCALES: SupportedLocale[] = ["ar"];

// Filter to ensure only authentic Arabic strings with Arabic characters are retained for 'ar'
function filterArabic(dict: Record<string, string> = {}): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(dict)) {
    if (typeof v === "string" && /[\u0600-\u06FF]/.test(v)) {
      result[k] = v;
    }
  }
  return result;
}

// Fallback dictionary for common UI words when key is missing or fallback passed in English/French
const AR_FALLBACK_PHRASES: Record<string, string> = {
  home: "الرئيسية",
  dashboard: "لوحة القيادة",
  users: "المستخدمون",
  admin: "مسؤول",
  "super admin": "المسؤول المتميز",
  save: "حفظ",
  cancel: "إلغاء",
  delete: "حذف",
  edit: "تعديل",
  update: "تحديث",
  refresh: "تحديث",
  close: "إغلاق",
  open: "فتح",
  view: "عرض",
  loading: "جاري التحميل...",
  "loading...": "جاري التحميل...",
  search: "بحث",
  "search...": "بحث...",
  filter: "تصفية",
  status: "الحالة",
  actions: "الإجراءات",
  date: "التاريخ",
  created: "تاريخ الإنشاء",
  updated: "تاريخ التحديث",
  download: "تنزيل",
  upload: "رفع",
  public: "عام",
  private: "خاص",
  details: "التفاصيل",
  name: "الاسم",
  "full name": "الاسم الكامل",
  email: "البريد الإلكتروني",
  phone: "رقم الهاتف",
  address: "العنوان",
  yes: "نعم",
  no: "لا",
  all: "الكل",
  total: "الإجمالي",
  active: "نشط",
  inactive: "غير نشط",
  pending: "قيد المراجعة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  trees: "أشجار العائلات",
  books: "الكتب والمخطوطات",
  audios: "التسجيلات الصوتية",
  documents: "الوثائق التاريخية",
  gallery: "المعرض التراثي",
  notes: "الملاحظات",
  tasks: "المهام",
  reminders: "التذكيرات",
  requests: "الطلبات",
  settings: "الإعدادات",
  help: "المساعدة",
  contact: "اتصل بنا",
  logout: "تسجيل الخروج",
  login: "تسجيل الدخول",
  signup: "إنشاء حساب",
  "sign in": "تسجيل الدخول",
  "sign up": "إنشاء حساب",
  "sign out": "تسجيل الخروج",
  "my account": "حسابي الشخصي",
  "export csv": "تصدير CSV",
  "request download": "طلب تنزيل",
  upgrade: "ترقية",
  "upgrade plan": "ترقية الباقة",
  overview: "نظرة عامة",
  pricing: "الأسعار والباقات",
  terms: "شروط الخدمة",
  privacy: "سياسة الخصوصية",
  refund: "سياسة الاسترداد",
  support: "الدعم الفني",
  security: "الأمان",
  password: "كلمة المرور",
  "confirm password": "تأكيد كلمة المرور",
  notifications: "الإشعارات",
  localization: "التعريب واللغات",
  language: "اللغة",
  theme: "السمة والنمط",
  dark: "داكن",
  light: "فاتح",
  system: "النظام",
  individuals: "الأفراد",
  members: "الأعضاء",
  sources: "المصادر",
  archives: "الأرشيفات",
  governorate: "الولاية",
  city: "المدينة",
  region: "المنطقة",
  birth: "الولادة",
  death: "الوفاة",
  marriage: "الزواج",
  father: "الأب",
  mother: "الأم",
  children: "الأبناء",
  spouse: "الزوج / الزوجة",
  notes_title: "الملاحظات والمسودات",
  genealogy: "علم الأنساب",
  heritage: "التراث التونسي",
  unlimited: "غير محدود",
  free: "مجاني",
  pro: "احترافي",
  enterprise: "مؤسسي",
  submit: "إرسال",
  confirm: "تأكيد",
  back: "رجوع",
  next: "التالي",
  previous: "السابق",
  continue: "متابعة",
  select: "تحديد",
  choose: "اختر",
  remove: "إزالة",
  clear: "مسح",
  apply: "تطبيق",
  reset: "إعادة ضبط",
  preview: "معاينة",
  error: "خطأ",
  success: "نجاح",
  warning: "تحذير",
  info: "معلومات",
  category: "الفئة",
  code: "الرمز",
  reference: "المرجع",
  period: "الفترة",
  century: "القرن",
  author: "المؤلف",
  title: "العنوان",
  description: "الوصف",
  message: "الرسالة",
  subject: "الموضوع",
  recipient: "المستلم",
  send: "إرسال",
  read: "قراءة",
  unread: "غير مقروء",
  manage: "إدارة",
  view_all: "عرض الكل",
  see_more: "المزيد",
  learn_more: "معرفة المزيد",
  get_started: "ابدأ الآن",
};

// Merged dictionaries with precedence:
// Custom JSON locales > FEATURE_TRANSLATIONS > ADDITION_TRANSLATIONS > AUTO_TRANSLATIONS > SOURCE_FALLBACK_TRANSLATIONS > Generated EN
const dictionaries: Record<SupportedLocale, Record<string, string>> = {
  en: {
    ...englishGeneratedTranslations,
    ...(SOURCE_FALLBACK_TRANSLATIONS.en || {}),
    ...(AUTO_TRANSLATIONS.en || {}),
    ...(FEATURE_TRANSLATIONS.en || {}),
    ...(en as unknown as Record<string, string>),
    ...(ADDITION_TRANSLATIONS.en || {}),
  },
  fr: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.fr || {}),
    ...(AUTO_TRANSLATIONS.fr || {}),
    ...(FEATURE_TRANSLATIONS.fr || {}),
    ...(fr as unknown as Record<string, string>),
    ...(ADDITION_TRANSLATIONS.fr || {}),
  },
  ar: {
    ...filterArabic(SOURCE_FALLBACK_TRANSLATIONS.ar),
    ...filterArabic(AUTO_TRANSLATIONS.ar),
    ...filterArabic(FEATURE_TRANSLATIONS.ar),
    ...(ar as unknown as Record<string, string>),
    ...filterArabic(ADDITION_TRANSLATIONS.ar),
  },
  es: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.es || {}),
    ...(AUTO_TRANSLATIONS.es || {}),
    ...(FEATURE_TRANSLATIONS.es || {}),
    ...(es as unknown as Record<string, string>),
    ...(ADDITION_TRANSLATIONS.es || {}),
  },
  it: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.it || {}),
    ...(AUTO_TRANSLATIONS.it || {}),
    ...(FEATURE_TRANSLATIONS.it || {}),
    ...(it as unknown as Record<string, string>),
    ...(ADDITION_TRANSLATIONS.it || {}),
  },
  mt: {
    ...(SOURCE_FALLBACK_TRANSLATIONS.mt || {}),
    ...(AUTO_TRANSLATIONS.mt || {}),
    ...(FEATURE_TRANSLATIONS.mt || {}),
    ...(mt as unknown as Record<string, string>),
    ...(ADDITION_TRANSLATIONS.mt || {}),
  },
};

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as SupportedLocale);
}

export function localeLabel(locale: string): string {
  const norm = (locale || "en").toLowerCase();
  return LOCALE_LABELS[norm as SupportedLocale] || norm.toUpperCase();
}

export function tForLocale(locale: string, key: string, fallback?: string): string {
  const normalizedLocale = (locale || DEFAULT_LOCALE).toLowerCase() as SupportedLocale;
  const isAr = normalizedLocale === "ar";
  const dict = dictionaries[normalizedLocale] || dictionaries.fr;
  
  if (dict && dict[key]) {
    // If Arabic, ensure the resolved value is valid Arabic
    if (!isAr || /[\u0600-\u06FF]/.test(dict[key])) {
      return dict[key];
    }
  }

  const rawFb = SOURCE_FALLBACK_TRANSLATIONS[normalizedLocale];
  if (rawFb && rawFb[key]) {
    if (!isAr || /[\u0600-\u06FF]/.test(rawFb[key])) {
      return rawFb[key];
    }
  }

  // If in Arabic mode, NEVER fall back to French or English dictionaries!
  if (isAr) {
    // 1. Check direct ar.json dictionary first
    const arDirect = ar as unknown as Record<string, string>;
    if (arDirect[key] && /[\u0600-\u06FF]/.test(arDirect[key])) {
      return arDirect[key];
    }
    // 2. Check fallback argument if it's already in Arabic
    if (fallback !== undefined && /[\u0600-\u06FF]/.test(fallback)) {
      return fallback;
    }
    // 3. Check fallback phrase map
    if (fallback !== undefined) {
      const lowerFb = fallback.trim().toLowerCase();
      if (AR_FALLBACK_PHRASES[lowerFb]) {
        return AR_FALLBACK_PHRASES[lowerFb];
      }
    }
    // 4. Check key in phrase map
    const lowerKey = key.replace(/[._]/g, " ").trim().toLowerCase();
    if (AR_FALLBACK_PHRASES[lowerKey]) {
      return AR_FALLBACK_PHRASES[lowerKey];
    }
    // 5. Try resolving individual words in key
    const parts = lowerKey.split(/\s+/);
    if (parts.length > 1) {
      const translatedParts = parts.map((p) => AR_FALLBACK_PHRASES[p] || p);
      if (translatedParts.some((p) => /[\u0600-\u06FF]/.test(p))) {
        return translatedParts.join(" ");
      }
    }
    // 6. If fallback has Arabic text embedded, extract it
    if (fallback !== undefined && /[\u0600-\u06FF]/.test(fallback)) {
      return fallback;
    }
    // 7. Check if key is a known entity
    return AR_FALLBACK_PHRASES[parts[0]] || "جذور تونس";
  }

  // Fallback to French dictionary then English dictionary for non-Arabic locales
  if (dictionaries.fr && dictionaries.fr[key]) {
    return dictionaries.fr[key];
  }

  if (dictionaries.en && dictionaries.en[key]) {
    return dictionaries.en[key];
  }

  if (SOURCE_FALLBACK_TRANSLATIONS.en && SOURCE_FALLBACK_TRANSLATIONS.en[key]) {
    return SOURCE_FALLBACK_TRANSLATIONS.en[key];
  }

  // Fallback to provided human-readable string
  if (fallback !== undefined) {
    return fallback;
  }

  // Last fallback: prettified key
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
