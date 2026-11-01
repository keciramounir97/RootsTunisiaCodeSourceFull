import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Layers,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Link2,
  Type,
  FileText,
  Sliders,
  Sparkles,
  Globe,
  Layout,
  ExternalLink,
  Upload,
  Plus,
  Trash2,
  Check,
  RefreshCw,
} from "lucide-react";
import Toast from "../../components/Toast";

interface SectionContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  imageUrl?: string;
  stat1Number?: string;
  stat1Label?: string;
  stat2Number?: string;
  stat2Label?: string;
  stat3Number?: string;
  stat3Label?: string;
  customFields?: { key: string; label: string; value: string }[];
}

const LANGUAGES = [
  { code: "ar", label: "العربية (AR)", dir: "rtl" },
  { code: "fr", label: "Français (FR)", dir: "ltr" },
  { code: "en", label: "English (EN)", dir: "ltr" },
  { code: "es", label: "Español (ES)", dir: "ltr" },
  { code: "it", label: "Italiano (IT)", dir: "ltr" },
  { code: "mt", label: "Malti (MT)", dir: "ltr" },
];

const PAGES_CONFIG = [
  { id: "home", label: "الصفحة الرئيسية (Home)", path: "/" },
  { id: "about", label: "عن المنصة ورسالتها (About Us)", path: "/about" },
  { id: "periods", label: "الحقب التاريخية (Periods)", path: "/periods" },
  { id: "sources", label: "المصادر والأرشيف (Sources & Archives)", path: "/sources" },
  { id: "gallery", label: "المعرض التراثي (Gallery Hub)", path: "/gallery" },
  { id: "subscriptions", label: "الباقات والاشتراكات (Subscriptions)", path: "/subscriptions" },
  { id: "contact", label: "اتصل بنا وبيانات الهاتف (Contact Us)", path: "/contact" },
  { id: "footer", label: "تذييل الموقع وروابط التواصل (Footer)", path: "/" },
];

const SECTIONS_CONFIG: Record<string, { id: string; label: string }[]> = {
  home: [
    { id: "hero", label: "الواجهة الرئيسية وعنوان المنصة (Hero Banner)" },
    { id: "intro", label: "المقدمة والرسالة التراثية (Intro & Mission)" },
    { id: "stats", label: "الإحصائيات والأرقام (Stats Counters)" },
    { id: "cta", label: "دعوة للانضمام والبحث (Call To Action)" },
  ],
  about: [
    { id: "hero", label: "شعار الصفحة والافتتاحية (About Hero)" },
    { id: "vision", label: "الرؤية والهدف الأكاديمي (Vision & Goals)" },
    { id: "values", label: "المبادئ التوثيقية والنزاهة (Archival Principles)" },
  ],
  periods: [
    { id: "hero", label: "مقدمة الحقب التاريخية (Periods Hero)" },
    { id: "timeline", label: "الخط الزمني التفاعلي (Interactive Timeline)" },
  ],
  sources: [
    { id: "hero", label: "افتتاحية المصادر وسجلات الأرشيف (Sources Hero)" },
    { id: "guide", label: "دليل الاستشارة والبحث الأرشيفي (Consultation Guide)" },
  ],
  gallery: [
    { id: "hero", label: "واجهة المعرض والأقسام (Gallery Hub Hero)" },
    { id: "collections", label: "المجموعات التراثية والصور (Collections Overview)" },
  ],
  subscriptions: [
    { id: "hero", label: "رأس صفحة الباقات والأسعار (Tiers Hero & Subtitle)" },
    { id: "guarantee", label: "ضمان الأمان والخصوصية (Security Guarantee)" },
    { id: "faq", label: "الأسئلة الشائعة للاشتراك (Pricing FAQ)" },
  ],
  contact: [
    { id: "hero", label: "رأس صفحة التواصل (Contact Header)" },
    { id: "coordinates", label: "بيانات التواصل والهاتف (+961 36 26 082)" },
  ],
  footer: [
    { id: "brand", label: "نبذة المنصة في التذييل (Footer Bio)" },
    { id: "copyright", label: "حقوق النشر والشروط (Copyright & Credits)" },
  ],
};

const DEFAULT_SECTION_CONTENT: SectionContent = {
  badge: "ذاكرة تونس الحية عبر العصور",
  title: "استكشف أصولك التونسية واكتشف تاريخ عائلتك العريق",
  subtitle: "المنصة الأولى المخصصة للأنساب، السجلات العائلية، والأرشيف التاريخي في تونس والمغرب الكبير.",
  description: "ابحث في آلاف السجلات التاريخية، ابنِ شجرة عائلتك التفاعلية بصيغة GEDCOM، واستكشف مئات المخطوطات والوثائق الرسمية.",
  primaryBtnText: "ابدأ البحث الآن",
  primaryBtnLink: "/gallery",
  secondaryBtnText: "اكتشف باقات الاشتراك",
  secondaryBtnLink: "/subscriptions",
  imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
  stat1Number: "10,000+",
  stat1Label: "سجل ووثيقة تاريخية",
  stat2Number: "24",
  stat2Label: "ولاية مغطاة بالكامل",
  stat3Number: "3,000+",
  stat3Label: "شجرة عائلة موثقة",
  customFields: [],
};

export default function ContentManager() {
  const { t, isRtl } = useTranslation();
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [selectedSection, setSelectedSection] = useState<string>("hero");
  const [selectedLang, setSelectedLang] = useState<string>("ar");

  // Stores all content: key format = `${page}_${section}_${lang}`
  const [contentStore, setContentStore] = useState<Record<string, SectionContent>>({});
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({
    message: "",
    tone: "success",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentKey = `${selectedPage}_${selectedSection}_${selectedLang}`;
  const currentContent: SectionContent = contentStore[currentKey] || {
    ...DEFAULT_SECTION_CONTENT,
  };

  // Load from API / LocalStorage
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/settings");
        const sData = res.data?.data || res.data || {};
        if (sData.public_content_store) {
          const parsed = typeof sData.public_content_store === "string"
            ? JSON.parse(sData.public_content_store)
            : sData.public_content_store;
          setContentStore(parsed);
          return;
        }
      } catch {}

      const local = localStorage.getItem("roots_public_content_store");
      if (local) {
        try {
          setContentStore(JSON.parse(local));
        } catch {}
      }
    })();
  }, []);

  const updateCurrentContent = (field: keyof SectionContent, value: any) => {
    setContentStore((prev) => ({
      ...prev,
      [currentKey]: {
        ...(prev[currentKey] || DEFAULT_SECTION_CONTENT),
        [field]: value,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateCurrentContent("imageUrl", base64);
      setUploadingImage(false);
      setToast({
        message: t("image_upload_success", "تم رفع الصورة وتعيينها لهذا القسم بنجاح!"),
        tone: "success",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const addCustomField = () => {
    const fields = currentContent.customFields || [];
    const newField = {
      key: `field_${Date.now()}`,
      label: "عنصر مخصص جديد",
      value: "قيمة المحتوى...",
    };
    updateCurrentContent("customFields", [...fields, newField]);
  };

  const updateCustomField = (index: number, key: "label" | "value", val: string) => {
    const fields = [...(currentContent.customFields || [])];
    if (fields[index]) {
      fields[index][key] = val;
      updateCurrentContent("customFields", fields);
    }
  };

  const removeCustomField = (index: number) => {
    const fields = (currentContent.customFields || []).filter((_, i) => i !== index);
    updateCurrentContent("customFields", fields);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      try {
        await api.post("/admin/settings", {
          key: "public_content_store",
          value: JSON.stringify(contentStore),
        });
      } catch {
        await api.put("/settings", {
          public_content_store: contentStore,
        });
      }

      localStorage.setItem("roots_public_content_store", JSON.stringify(contentStore));
      setToast({
        message: t(
          "content_saved_success",
          `تم حفظ ونشر تعديلات المحتوى بنجاح لجميع اللغات والصفحات!`
        ),
        tone: "success",
      });
    } catch {
      localStorage.setItem("roots_public_content_store", JSON.stringify(contentStore));
      setToast({
        message: t(
          "content_saved_cached",
          "تم حفظ التعديلات بنجاح محلياً وتحديث الواجهة!"
        ),
        tone: "success",
      });
    } finally {
      setSaving(false);
    }
  };

  const availableSections = SECTIONS_CONFIG[selectedPage] || [];
  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start pb-16">
      {toast.message && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast({ message: "", tone: "success" })}
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                {t("content_manager_title", "إدارة وتعديل محتوى الموقع الكامل (Full Content CMS)")}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t(
                  "content_manager_subtitle",
                  "تحكم كامل في نصوص، صور، روابط، وأزرار كافة الصفحات بجميع اللغات الست مع المعاينة الفورية"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="px-3.5 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--gold)] text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[var(--gold)]" />
            <span>{showLivePreview ? t("hide_preview", "إخفاء المعاينة") : t("show_preview", "إظهار المعاينة")}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            <span>{t("save_all_content", "حفظ ونشر التعديلات")}</span>
          </button>
        </div>
      </div>

      {/* Step 1: Page Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] block">
          1. {t("select_target_page", "اختر الصفحة المراد تعديلها:")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PAGES_CONFIG.map((pg) => {
            const isSelected = selectedPage === pg.id;
            return (
              <button
                key={pg.id}
                onClick={() => {
                  setSelectedPage(pg.id);
                  const firstSec = SECTIONS_CONFIG[pg.id]?.[0]?.id || "hero";
                  setSelectedSection(firstSec);
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-[var(--gold)] bg-[var(--gold)] text-black shadow-md"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--gold)]/50 hover:text-[var(--foreground)]"
                }`}
              >
                {pg.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Section & Multi-language Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] block">
            2. {t("select_target_section", "اختر القسم أو المكون:")}
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] font-semibold outline-none focus:border-[var(--gold)] cursor-pointer"
          >
            {availableSections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.label}
              </option>
            ))}
          </select>
        </div>

        {/* Multi-Language Bar */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>3. {t("choose_language_tab", "لغة المحتوى (تعديل متزامن لجميع اللغات):")}</span>
          </label>
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-x-auto">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-1 ${
                    isSelected
                      ? "bg-[var(--gold)] text-black shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Form Column */}
        <div className={`${showLivePreview ? "lg:col-span-7" : "lg:col-span-12"} space-y-5`}>
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <span className="text-xs font-bold text-[var(--gold)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>
                  {t("editing_now", "أنت تقوم بتعديل:")} {selectedPage.toUpperCase()} / {selectedSection.toUpperCase()} ({currentLangObj.label})
                </span>
              </span>

              <span className="text-[0.7rem] px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] font-mono">
                Key: {currentKey}
              </span>
            </div>

            {/* Image Uploader & URL Box */}
            <div className="p-4 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[var(--gold)]" />
                  <span>{t("section_image_upload", "صورة هذا القسم (رفع صورة جديدة أو تعديل الرابط):")}</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-3 py-1.5 rounded-lg bg-[var(--gold)] text-black text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Upload className={`w-3.5 h-3.5 ${uploadingImage ? "animate-bounce" : ""}`} />
                  <span>{t("upload_image", "رفع صورة من جهازك")}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {currentContent.imageUrl ? (
                  <img
                    src={currentContent.imageUrl}
                    alt="Section thumbnail"
                    className="w-16 h-12 object-cover rounded-lg border border-[var(--gold)]/40 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-12 rounded-lg border border-dashed border-[var(--border)] flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-[var(--muted-foreground)]" />
                  </div>
                )}
                <input
                  type="text"
                  value={currentContent.imageUrl || ""}
                  onChange={(e) => updateCurrentContent("imageUrl", e.target.value)}
                  placeholder="https://... رابط الصورة المباشر أو المحملة"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
                />
              </div>
            </div>

            {/* Core Texts */}
            <div className="grid grid-cols-1 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                  {t("badge_text", "النص الترويجي الصغير (Badge / Eyebrow):")}
                </label>
                <input
                  type="text"
                  dir={currentLangObj.dir}
                  value={currentContent.badge || ""}
                  onChange={(e) => updateCurrentContent("badge", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                  {t("main_title", "العنوان الرئيسي (Main Heading):")}
                </label>
                <input
                  type="text"
                  dir={currentLangObj.dir}
                  value={currentContent.title || ""}
                  onChange={(e) => updateCurrentContent("title", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                  {t("subtitle_text", "العنوان الفرعي (Subtitle / Lead):")}
                </label>
                <input
                  type="text"
                  dir={currentLangObj.dir}
                  value={currentContent.subtitle || ""}
                  onChange={(e) => updateCurrentContent("subtitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                  {t("detailed_description", "الوصف التفصيلي (Detailed Body Copy):")}
                </label>
                <textarea
                  rows={4}
                  dir={currentLangObj.dir}
                  value={currentContent.description || ""}
                  onChange={(e) => updateCurrentContent("description", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] leading-relaxed"
                />
              </div>
            </div>

            {/* Buttons & Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--foreground)]">
                  {t("primary_button_text", "نص الزر الرئيسي:")}
                </label>
                <input
                  type="text"
                  dir={currentLangObj.dir}
                  value={currentContent.primaryBtnText || ""}
                  onChange={(e) => updateCurrentContent("primaryBtnText", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
                <input
                  type="text"
                  value={currentContent.primaryBtnLink || ""}
                  onChange={(e) => updateCurrentContent("primaryBtnLink", e.target.value)}
                  placeholder="/gallery"
                  className="w-full px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--muted-foreground)] outline-none focus:border-[var(--gold)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--foreground)]">
                  {t("secondary_button_text", "نص الزر الثانوي:")}
                </label>
                <input
                  type="text"
                  dir={currentLangObj.dir}
                  value={currentContent.secondaryBtnText || ""}
                  onChange={(e) => updateCurrentContent("secondaryBtnText", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
                <input
                  type="text"
                  value={currentContent.secondaryBtnLink || ""}
                  onChange={(e) => updateCurrentContent("secondaryBtnLink", e.target.value)}
                  placeholder="/subscriptions"
                  className="w-full px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--muted-foreground)] outline-none focus:border-[var(--gold)] font-mono"
                />
              </div>
            </div>

            {/* Stats / Custom Key-Values */}
            <div className="pt-2 border-t border-[var(--border)] space-y-2">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                {t("stats_counters", "أرقام وتعدادات القسم (Stats Counters):")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <input
                    type="text"
                    value={currentContent.stat1Number || ""}
                    onChange={(e) => updateCurrentContent("stat1Number", e.target.value)}
                    placeholder="10,000+"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-mono font-bold text-[var(--gold)] outline-none"
                  />
                  <input
                    type="text"
                    dir={currentLangObj.dir}
                    value={currentContent.stat1Label || ""}
                    onChange={(e) => updateCurrentContent("stat1Label", e.target.value)}
                    placeholder="سجل تاريخي"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={currentContent.stat2Number || ""}
                    onChange={(e) => updateCurrentContent("stat2Number", e.target.value)}
                    placeholder="24"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-mono font-bold text-[var(--gold)] outline-none"
                  />
                  <input
                    type="text"
                    dir={currentLangObj.dir}
                    value={currentContent.stat2Label || ""}
                    onChange={(e) => updateCurrentContent("stat2Label", e.target.value)}
                    placeholder="ولاية مغطاة"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={currentContent.stat3Number || ""}
                    onChange={(e) => updateCurrentContent("stat3Number", e.target.value)}
                    placeholder="3,000+"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-mono font-bold text-[var(--gold)] outline-none"
                  />
                  <input
                    type="text"
                    dir={currentLangObj.dir}
                    value={currentContent.stat3Label || ""}
                    onChange={(e) => updateCurrentContent("stat3Label", e.target.value)}
                    placeholder="شجرة عائلة"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Custom Content Items (Anything and everything!) */}
            <div className="pt-3 border-t border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{t("custom_fields_title", "عناصر ونصوص إضافية مخصصة لهذا القسم:")}</span>
                </label>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="px-2.5 py-1 rounded-lg border border-[var(--gold)]/40 hover:bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-bold cursor-pointer"
                >
                  + {t("add_custom_field", "إضافة حقل")}
                </button>
              </div>

              {(currentContent.customFields || []).map((cf, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                  <input
                    type="text"
                    value={cf.label}
                    onChange={(e) => updateCustomField(idx, "label", e.target.value)}
                    placeholder="اسم العنصر"
                    className="w-1/3 px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] font-semibold outline-none"
                  />
                  <input
                    type="text"
                    dir={currentLangObj.dir}
                    value={cf.value}
                    onChange={(e) => updateCustomField(idx, "value", e.target.value)}
                    placeholder="النص / المحتوى"
                    className="w-full px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomField(idx)}
                    className="text-red-500 hover:text-red-700 p-1 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Visual Preview Column */}
        {showLivePreview && (
          <div className="lg:col-span-5 sticky top-20 space-y-3">
            <div className="p-4 rounded-2xl border border-[var(--gold)]/40 bg-[var(--card)] shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] text-xs">
                <span className="font-bold text-[var(--gold)] flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{t("live_preview_card", "المعاينة الحية الفورية (Live Preview)")}</span>
                </span>
                <span className="text-[0.7rem] text-[var(--muted-foreground)]">
                  اللغة: <strong>{currentLangObj.label}</strong>
                </span>
              </div>

              {/* Rendered Component Preview Box */}
              <div
                dir={currentLangObj.dir}
                className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--background)] shadow-inner relative"
              >
                {/* Background Image / Thumbnail */}
                {currentContent.imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                    <img
                      src={currentContent.imageUrl}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>
                )}

                <div className="p-5 space-y-3 relative">
                  {currentContent.badge && (
                    <span className="inline-block px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
                      {currentContent.badge}
                    </span>
                  )}

                  <h3 className="text-base font-bold font-display text-[var(--foreground)] leading-snug">
                    {currentContent.title || "عنوان القسم التجريبي"}
                  </h3>

                  {currentContent.subtitle && (
                    <p className="text-xs font-semibold text-[var(--gold)]">
                      {currentContent.subtitle}
                    </p>
                  )}

                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    {currentContent.description || "الوصف والمحتوى التوثيقي لهذا القسم يظهر هنا بشكل فوري..."}
                  </p>

                  {/* Buttons preview */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentContent.primaryBtnText && (
                      <span className="px-3.5 py-1.5 rounded-lg bg-[var(--gold)] text-black text-xs font-bold shadow-sm inline-block">
                        {currentContent.primaryBtnText}
                      </span>
                    )}
                    {currentContent.secondaryBtnText && (
                      <span className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] text-[var(--foreground)] text-xs font-semibold inline-block">
                        {currentContent.secondaryBtnText}
                      </span>
                    )}
                  </div>

                  {/* Stats Counter preview */}
                  {(currentContent.stat1Number || currentContent.stat2Number) && (
                    <div className="pt-3 border-t border-[var(--border)] grid grid-cols-3 gap-2 text-center text-xs">
                      {currentContent.stat1Number && (
                        <div>
                          <p className="font-bold text-[var(--gold)] font-mono">{currentContent.stat1Number}</p>
                          <span className="text-[0.65rem] text-[var(--muted-foreground)]">{currentContent.stat1Label}</span>
                        </div>
                      )}
                      {currentContent.stat2Number && (
                        <div>
                          <p className="font-bold text-[var(--gold)] font-mono">{currentContent.stat2Number}</p>
                          <span className="text-[0.65rem] text-[var(--muted-foreground)]">{currentContent.stat2Label}</span>
                        </div>
                      )}
                      {currentContent.stat3Number && (
                        <div>
                          <p className="font-bold text-[var(--gold)] font-mono">{currentContent.stat3Number}</p>
                          <span className="text-[0.65rem] text-[var(--muted-foreground)]">{currentContent.stat3Label}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Custom fields preview */}
                  {(currentContent.customFields || []).length > 0 && (
                    <div className="pt-2 border-t border-[var(--border)] space-y-1 text-xs">
                      {currentContent.customFields?.map((f, i) => (
                        <div key={i} className="flex justify-between text-[0.72rem]">
                          <span className="text-[var(--muted-foreground)]">{f.label}:</span>
                          <strong className="text-[var(--foreground)]">{f.value}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
