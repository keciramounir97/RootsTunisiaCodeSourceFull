import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Layout,
  Save,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Globe,
  Upload,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  FileText,
  Sliders,
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
}

const LANGUAGES = [
  { code: "ar", label: "العربية (Arabic)", flag: "🇹🇳", dir: "rtl" },
  { code: "fr", label: "Français (French)", flag: "🇫🇷", dir: "ltr" },
  { code: "en", label: "English (English)", flag: "🇬🇧", dir: "ltr" },
  { code: "es", label: "Español (Spanish)", flag: "🇪🇸", dir: "ltr" },
  { code: "it", label: "Italiano (Italian)", flag: "🇮🇹", dir: "ltr" },
  { code: "mt", label: "Malti (Maltese)", flag: "🇲🇹", dir: "ltr" },
];

const PAGES_CONFIG = [
  { id: "home", label: "الصفحة الرئيسية (Home)", path: "/", icon: "🏠", desc: "الواجهة الكبرى، الإحصائيات، دعوة الانضمام" },
  { id: "about", label: "عن المنصة ورسالتها (About Us)", path: "/about", icon: "🏛️", desc: "الرؤية التاريخية، الأهداف الأكاديمية" },
  { id: "periods", label: "الحقب التاريخية (Periods)", path: "/periods", icon: "⏳", desc: "الخط الزمني للحضارات من قرطاج للمعاصر" },
  { id: "sources", label: "المصادر والأرشيف (Sources & Archives)", path: "/sources", icon: "📜", desc: "سجلات العدول، دفاتر الباي، الحبوب" },
  { id: "gallery", label: "المعرض التراثي (Gallery Hub)", path: "/gallery", icon: "🖼️", desc: "المجموعات التراثية، الصور التاريخية" },
  { id: "subscriptions", label: "الباقات والاشتراكات (Subscriptions)", path: "/subscriptions", icon: "👑", desc: "خطط العضوية، الضمانات، الأسئلة الشائعة" },
  { id: "contact", label: "اتصل بنا وبيانات التواصل (Contact)", path: "/contact", icon: "📞", desc: "بيانات الهاتف، نموذج الرسائل، الدعم" },
  { id: "footer", label: "تذييل الموقع وروابط التواصل (Footer)", path: "/", icon: "⚓", desc: "النبذة التوثيقية، الروابط السريعة، الحقوق" },
];

const SECTIONS_CONFIG: Record<string, { id: string; label: string; desc: string; hasImage: boolean }[]> = {
  home: [
    { id: "hero", label: "الواجهة الرئيسية والافتتاحية (Hero Banner)", desc: "العنوان الرئيسي الأول، الصورة الكبرى، زر البحث", hasImage: true },
    { id: "intro", label: "المقدمة والرسالة التراثية (Intro & Mission)", desc: "فقرة التعريف بمنصة جذور تونس وأهدافها", hasImage: true },
    { id: "stats", label: "الإحصائيات والأرقام (Stats Counters)", desc: "أرقام السجلات الموثقة والولايات والأشجار", hasImage: false },
    { id: "cta", label: "دعوة للانضمام والبحث (Call To Action)", desc: "شريط الدعوة لإنشاء شجرة العائلة", hasImage: true },
  ],
  about: [
    { id: "hero", label: "شعار الصفحة والافتتاحية (About Hero)", desc: "رأس صفحة من نحن وخلفيتها التراثية", hasImage: true },
    { id: "vision", label: "الرؤية والهدف الأكاديمي (Vision & Goals)", desc: "رسالة الحفاظ على الهوية والأنساب التونسية", hasImage: true },
    { id: "values", label: "المبادئ التوثيقية والنزاهة (Archival Principles)", desc: "منهجية الفحص والمصادقة الصارمة", hasImage: false },
  ],
  periods: [
    { id: "hero", label: "مقدمة الحقب التاريخية (Periods Hero)", desc: "عنوان واستكشاف التسلسل الزمني للحضارات", hasImage: true },
    { id: "timeline", label: "الخط الزمني التفاعلي (Interactive Timeline)", desc: "تفاصيل كل حقبة (القرطاجية، الرومانية، العثمانية...)", hasImage: true },
  ],
  sources: [
    { id: "hero", label: "افتتاحية المصادر وسجلات الأرشيف (Sources Hero)", desc: "عنوان الوصول إلى الوثائق والمخطوطات", hasImage: true },
    { id: "guide", label: "دليل الاستشارة والبحث الأرشيفي (Consultation Guide)", desc: "خطوات التثبت من السجلات العائلية", hasImage: false },
  ],
  gallery: [
    { id: "hero", label: "واجهة المعرض والأقسام (Gallery Hub Hero)", desc: "رأس المعرض الرقمي للصور والوثائق", hasImage: true },
    { id: "collections", label: "المجموعات التراثية والصور (Collections Overview)", desc: "أقسام الأرشيف الفوتوغرافي والصوتي والوثائقي", hasImage: true },
  ],
  subscriptions: [
    { id: "hero", label: "رأس صفحة الباقات والأسعار (Tiers Hero & Subtitle)", desc: "العنوان الترويجي لشاشات الخطط والاشتراك", hasImage: false },
    { id: "guarantee", label: "ضمان الأمان والخصوصية (Security Guarantee)", desc: "بيان حماية البيانات العائلية والشخصية", hasImage: false },
    { id: "faq", label: "الأسئلة الشائعة للاشتراك (Pricing FAQ)", desc: "إجابات الأسئلة المتكررة حول طرق الدفع والترقية", hasImage: false },
  ],
  contact: [
    { id: "hero", label: "رأس صفحة التواصل (Contact Header)", desc: "افتتاحية صفحة التواصل والدعم المباشر", hasImage: false },
    { id: "coordinates", label: "بيانات التواصل ورقم الهاتف (+961 36 26 082)", desc: "رقم الدعم الرسمي والبريد وساعات العمل", hasImage: false },
  ],
  footer: [
    { id: "brand", label: "نبذة المنصة في التذييل (Footer Bio)", desc: "نص النبذة المختصرة أسفل كل صفحة", hasImage: false },
    { id: "copyright", label: "حقوق النشر والشروط (Copyright & Credits)", desc: "سطر الملكية الفكرية والروابط القانونية", hasImage: false },
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
};

export default function ContentManager() {
  const { t, isRtl } = useTranslation();

  // Navigation steps: 1 = Page selection, 2 = Section selection, 3 = Language selection, 4 = Content Editor
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [selectedSection, setSelectedSection] = useState<string>("hero");
  const [selectedLang, setSelectedLang] = useState<string>("ar");

  const [contentStore, setContentStore] = useState<Record<string, SectionContent>>({});
  const [saving, setSaving] = useState(false);
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
        message: t("image_upload_success", "تم رفع الصورة بنجاح وتعيينها لهذا القسم!"),
        tone: "success",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
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

  const activePageObj = PAGES_CONFIG.find((p) => p.id === selectedPage) || PAGES_CONFIG[0];
  const activeSections = SECTIONS_CONFIG[selectedPage] || [];
  const activeSectionObj = activeSections.find((s) => s.id === selectedSection) || activeSections[0];
  const activeLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start pb-20">
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

        {step === 4 && (
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
        )}
      </div>

      {/* Stepped Breadcrumb Tracker */}
      <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap font-medium">
          <button
            onClick={() => setStep(1)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              step === 1
                ? "bg-[var(--gold)] text-black font-bold shadow-sm"
                : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <span>1. {t("choose_page", "الصفحة")}:</span>
            <strong className="underline">{activePageObj.label.split(" ")[0]}</strong>
          </button>

          {isRtl ? <ChevronLeft className="w-4 h-4 text-[var(--muted-foreground)]" /> : <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />}

          <button
            onClick={() => setStep(2)}
            disabled={step < 2}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              step === 2
                ? "bg-[var(--gold)] text-black font-bold shadow-sm"
                : step > 2
                ? "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <span>2. {t("choose_section", "القسم")}:</span>
            <strong className="underline">{activeSectionObj?.label ? activeSectionObj.label.split(" ")[0] : ""}</strong>
          </button>

          {isRtl ? <ChevronLeft className="w-4 h-4 text-[var(--muted-foreground)]" /> : <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />}

          <button
            onClick={() => setStep(3)}
            disabled={step < 3}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              step === 3
                ? "bg-[var(--gold)] text-black font-bold shadow-sm"
                : step > 3
                ? "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <span>3. {t("choose_language", "اللغة")}:</span>
            <strong className="underline">{activeLangObj?.flag} {activeLangObj?.label ? activeLangObj.label.split(" ")[0] : ""}</strong>
          </button>

          {isRtl ? <ChevronLeft className="w-4 h-4 text-[var(--muted-foreground)]" /> : <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />}

          <span
            className={`px-3 py-1.5 rounded-xl ${
              step === 4
                ? "bg-emerald-600 text-white font-bold shadow-sm"
                : "opacity-40"
            }`}
          >
            4. {t("edit_inputs_and_image", "تعديل النصوص والصورة")}
          </span>
        </div>

        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as any)}
            className="px-3 py-1 rounded-xl border border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors cursor-pointer"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{t("back_step", "الرجوع للخطوة السابقة")}</span>
          </button>
        )}
      </div>

      {/* STEP 1: Select a Page */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[var(--foreground)] font-display">
              1. {t("step1_title", "اختر الصفحة المراد تعديل محتواها:")}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t("step1_subtitle", "انقر على أي صفحة لعرض قائمة كافة الأقسام التابعة لها")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PAGES_CONFIG.map((pg) => {
              const isSelected = selectedPage === pg.id;
              const sectionsCount = SECTIONS_CONFIG[pg.id]?.length || 0;
              return (
                <div
                  key={pg.id}
                  onClick={() => {
                    setSelectedPage(pg.id);
                    const firstSec = SECTIONS_CONFIG[pg.id]?.[0]?.id || "hero";
                    setSelectedSection(firstSec);
                    setStep(2); // Automatically advance to Step 2
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm relative overflow-hidden group ${
                    isSelected
                      ? "border-[var(--gold)] bg-[var(--gold)]/10 ring-2 ring-[var(--gold)]/30"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--gold)]/60 hover:shadow-md"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{pg.icon}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/25">
                        {sectionsCount} {t("sections_count", "أقسام")}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                        {pg.label}
                      </h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                        {pg.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-xs font-bold text-[var(--gold)]">
                    <span>{t("select_and_view_sections", "عرض الأقسام")}</span>
                    {isRtl ? <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: List of Every Section in Selected Page */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[var(--foreground)] font-display">
                2. {t("step2_title", "أقسام صفحة:")} <span className="text-[var(--gold)]">{activePageObj.label}</span>
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t("step2_subtitle", "اختر القسم الذي تريد تعديل نصوصه أو صورته")}
              </p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            >
              {t("change_page", "تغيير الصفحة")}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSections.map((sec) => {
              const isSelected = selectedSection === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => {
                    setSelectedSection(sec.id);
                    setStep(3); // Advance to Step 3: Which language?
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm relative group ${
                    isSelected
                      ? "border-[var(--gold)] bg-[var(--gold)]/10 ring-2 ring-[var(--gold)]/30"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--gold)]/60 hover:shadow-md"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)]">
                        <Layers className="w-5 h-5" />
                      </div>
                      {sec.hasImage && (
                        <span className="px-2 py-0.5 rounded-md text-[0.68rem] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>{t("has_image", "يتضمن صورة")}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                        {sec.label}
                      </h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                        {sec.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-xs font-bold text-[var(--gold)]">
                    <span>{t("select_language_prompt", "اختيار اللغة وتعديل المحتوى")}</span>
                    {isRtl ? <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Prompt "Which Language do you want to change?" */}
      {step === 3 && (
        <div className="space-y-5 max-w-3xl mx-auto py-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30 flex items-center justify-center mx-auto">
              <Globe className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold font-display text-[var(--foreground)]">
              {t("which_language_question", "أي لغة تريد تعديل محتواها لهذا القسم؟")}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t("section_target_indicator", "القسم المحدد:")} <strong className="text-[var(--gold)]">{activePageObj.label} &gt; {activeSectionObj?.label}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setStep(4); // Advance to Step 4: Content Inputs & Image
                  }}
                  className={`p-5 rounded-2xl border text-center transition-all cursor-pointer space-y-2 shadow-sm group ${
                    isSelected
                      ? "border-[var(--gold)] bg-[var(--gold)]/10 ring-2 ring-[var(--gold)]/30 shadow-md"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--gold)]/60 hover:scale-102"
                  }`}
                >
                  <span className="text-4xl block">{lang.flag}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                      {lang.label}
                    </h3>
                    <span className="text-[0.68rem] text-[var(--muted-foreground)] uppercase tracking-wider font-mono">
                      {lang.dir.toUpperCase()} • Code: {lang.code}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Content Inputs & Section Image */}
      {step === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs Column */}
          <div className={`${showLivePreview ? "lg:col-span-7" : "lg:col-span-12"} space-y-5`}>
            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-4">
              {/* Header Info */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">
                    {activePageObj.label} &gt; {activeSectionObj?.label}
                  </h3>
                  <p className="text-[0.7rem] text-[var(--muted-foreground)]">
                    {t("active_language", "اللغة النشطة:")} <strong className="text-[var(--gold)]">{activeLangObj.flag} {activeLangObj.label}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="px-2.5 py-1 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] font-bold outline-none cursor-pointer"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section Image Uploader / Changer */}
              <div className="p-4 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[var(--gold)]" />
                    <span>{t("section_image_prompt", "صورة هذا القسم (تغيير أو رفع صورة جديدة):")}</span>
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
                      alt="Thumbnail"
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

              {/* Text Inputs */}
              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                    {t("badge_text", "النص الترويجي الصغير (Badge / Eyebrow):")}
                  </label>
                  <input
                    type="text"
                    dir={activeLangObj.dir}
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
                    dir={activeLangObj.dir}
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
                    dir={activeLangObj.dir}
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
                    dir={activeLangObj.dir}
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
                    dir={activeLangObj.dir}
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
                    dir={activeLangObj.dir}
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

              {/* Bottom Action Save */}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-3.5 py-1.5 rounded-xl border border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  {t("change_language", "تغيير لغة التعديل")}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[var(--gold)] text-black text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all cursor-pointer"
                >
                  <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
                  <span>{t("save_section_changes", "حفظ تعديلات هذا القسم")}</span>
                </button>
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
                    اللغة: <strong>{activeLangObj.label}</strong>
                  </span>
                </div>

                {/* Rendered Component Preview Box */}
                <div
                  dir={activeLangObj.dir}
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
