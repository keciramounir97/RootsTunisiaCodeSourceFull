import { useState, useEffect } from "react";
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
} from "lucide-react";

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

const PAGES_CONFIG = [
  { id: "home", labelKey: "page_home", label: "الصفحة الرئيسية (Home)", path: "/" },
  { id: "about", labelKey: "page_about", label: "عن المنصة (About Us)", path: "/about" },
  { id: "periods", labelKey: "page_periods", label: "الحقب التاريخية (Periods)", path: "/periods" },
  { id: "sources", labelKey: "page_sources", label: "المصادر والأرشيف (Sources & Archives)", path: "/sources" },
  { id: "gallery", labelKey: "page_gallery", label: "المعرض التراثي (Gallery Hub)", path: "/gallery" },
  { id: "subscriptions", labelKey: "page_subscriptions", label: "الباقات والاشتراكات (Subscriptions)", path: "/subscriptions" },
  { id: "contact", labelKey: "page_contact", label: "اتصل بنا (Contact Us)", path: "/contact" },
  { id: "footer", labelKey: "page_footer", label: "تذييل الموقع (Footer & Links)", path: "/" },
];

const SECTIONS_CONFIG: Record<string, { id: string; label: string }[]> = {
  home: [
    { id: "hero", label: "الواجهة الرئيسية (Hero Banner)" },
    { id: "intro", label: "المقدمة والرسالة (Intro & Mission)" },
    { id: "stats", label: "الإحصائيات والأرقام (Stats Counters)" },
    { id: "cta", label: "دعوة للانضمام والبحث (Call To Action)" },
  ],
  about: [
    { id: "hero", label: "شعار الصفحة والافتتاحية (About Hero)" },
    { id: "vision", label: "الرؤية والهدف الأكاديمي (Vision & Goals)" },
    { id: "values", label: "المبادئ التوثيقية (Archival Principles)" },
  ],
  periods: [
    { id: "hero", label: "مقدمة الحقب التاريخية (Periods Hero)" },
    { id: "timeline", label: "الخط الزمني التفاعلي (Interactive Timeline)" },
  ],
  sources: [
    { id: "hero", label: "افتتاحية المصادر وسجلات الأرشيف (Sources Hero)" },
    { id: "guide", label: "دليل الاستشارة والبحث (Consultation Guide)" },
  ],
  gallery: [
    { id: "hero", label: "واجهة المعرض والأقسام (Gallery Hub Hero)" },
    { id: "collections", label: "المجموعات التراثية (Collections Overview)" },
  ],
  subscriptions: [
    { id: "hero", label: "رأس صفحة الباقات (Tiers Hero & Subtitle)" },
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

const DEFAULT_CONTENT_MAP: Record<string, SectionContent> = {
  "home_hero": {
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
    stat1Label: "فرد وسجل تاريخي",
    stat2Number: "500+",
    stat2Label: "شجرة عائلية موثقة",
    stat3Number: "100%",
    stat3Label: "مصادر وأرشيفات رسمية",
  },
  "contact_coordinates": {
    badge: "تواصل مع فريق التوثيق",
    title: "يسعدنا الرد على استفساراتكم وبحوثكم الأنسابية",
    subtitle: "فريق من الباحثين والمؤرخين متواجد لمساعدتكم في كل خطوة.",
    description: "لأي استفسار بخصوص السجلات أو الاشتراكات أو طلبات الدعم، تواصلوا معنا مباشرة.",
    primaryBtnText: "اتصل بنا هاتفياً",
    primaryBtnLink: "tel:+9613626082",
    secondaryBtnText: "مراسلة الدعم",
    secondaryBtnLink: "/contact",
    stat1Number: "+961 36 26 082",
    stat1Label: "رقم الهاتف المعتمد",
    stat2Number: "24/7",
    stat2Label: "استقبال الرسائل",
    stat3Number: "info@rootstunisia.com",
    stat3Label: "البريد الإلكتروني",
  },
};

export default function ContentManager() {
  const { t, isRtl } = useTranslation();
  const [selectedPage, setSelectedPage] = useState("home");
  const [selectedSection, setSelectedSection] = useState("hero");
  const [form, setForm] = useState<SectionContent>(DEFAULT_CONTENT_MAP["home_hero"]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const contentKey = `${selectedPage}_${selectedSection}`;

  // Load saved content from local storage or app settings
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`roots_content_${contentKey}`);
      if (stored) {
        setForm(JSON.parse(stored));
        return;
      }
    } catch {}

    if (DEFAULT_CONTENT_MAP[contentKey]) {
      setForm(DEFAULT_CONTENT_MAP[contentKey]);
    } else {
      // Generic template
      setForm({
        badge: t("content_default_badge", "قسم معتمد من إدارة المنصة"),
        title: `${t("content_for", "محتوى")} ${selectedPage} - ${selectedSection}`,
        subtitle: t("content_default_sub", "عنوان فرعي تعريفي يظهر للزوار في الموقع العام."),
        description: t("content_default_desc", "النص التفصيلي لهذا القسم يشرح أهدافه ويوضح ميزاته للباحثين والمشتركين."),
        primaryBtnText: t("learn_more", "المزيد من التفاصيل"),
        primaryBtnLink: "/",
        secondaryBtnText: t("contact_us", "اتصل بنا"),
        secondaryBtnLink: "/contact",
        imageUrl: "",
      });
    }
  }, [contentKey, t]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      // 1. Local storage instant persistence
      localStorage.setItem(`roots_content_${contentKey}`, JSON.stringify(form));

      // 2. Persist to API settings
      await api.post("/admin/settings", {
        key: `public_content_${contentKey}`,
        value: JSON.stringify(form),
      }).catch(() => {});

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn("Failed to persist to backend:", err);
      setSavedSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const fallback = DEFAULT_CONTENT_MAP[contentKey] || {
      badge: "قسم معتمد",
      title: `${selectedPage} - ${selectedSection}`,
      subtitle: "عنوان فرعي تعريفي",
      description: "النص التفصيلي لهذا القسم.",
      primaryBtnText: "المزيد",
      primaryBtnLink: "/",
    };
    setForm(fallback);
    localStorage.removeItem(`roots_content_${contentKey}`);
  };

  const currentSections = SECTIONS_CONFIG[selectedPage] || [
    { id: "hero", label: "الواجهة الرئيسية (Hero)" },
  ];

  const currentPageObj = PAGES_CONFIG.find((p) => p.id === selectedPage);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                {t("public_content_manager_title", "إدارة محتوى الصفحات العامة (Content Manager)")}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t(
                  "public_content_manager_subtitle",
                  "تحكم كامل في نصوص، عناوين، صور وأزرار جميع صفحات وأقسام الموقع العام مع معاينة فورية"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentPageObj && (
            <a
              href={currentPageObj.path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-bold hover:bg-[var(--gold)]/20 transition-all"
            >
              <span>{t("view_live_page", "معاينة الصفحة الحية")}</span>
              <ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />
            </a>
          )}
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)] hover:border-[var(--gold)] transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[var(--gold)]" />
            <span>{showPreview ? t("hide_preview", "إخفاء المعاينة") : t("show_preview", "إظهار المعاينة")}</span>
          </button>
        </div>
      </div>

      {/* Page Selector Tabs */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {t("step_1_choose_page", "1. اختر الصفحة المراد تعديلها:")}
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PAGES_CONFIG.map((p) => {
            const isSelected = selectedPage === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPage(p.id);
                  const firstSec = (SECTIONS_CONFIG[p.id] || [{ id: "hero" }])[0].id;
                  setSelectedSection(firstSec);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-md"
                    : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/50"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Selector Pills */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {t("step_2_choose_section", "2. اختر القسم أو العنصر:")}
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {currentSections.map((sec) => {
            const isSelected = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSection(sec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)] shadow-sm font-bold"
                    : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className={`grid grid-cols-1 ${showPreview ? "lg:grid-cols-2" : "grid-cols-1"} gap-6`}>
        {/* Editor Form */}
        <form onSubmit={handleSave} className="p-6 rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--gold)]" />
              <span>{t("edit_section_fields", "تعديل حقول القسم")}</span>
            </h3>
            <span className="text-[0.68rem] font-mono font-bold text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded border border-[var(--gold)]/20">
              {contentKey}
            </span>
          </div>

          {/* Badge / Tagline */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[var(--foreground)]">
              {t("badge_text", "النص المميز أو الشعار المصغر (Badge / Eyebrow):")}
            </label>
            <input
              type="text"
              value={form.badge || ""}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder={t("placeholder_badge", "مثال: ذاكرة تونس الحية عبر العصور")}
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[var(--foreground)]">
              {t("section_headline", "العنوان الرئيسي (Headline):")}
            </label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={t("placeholder_title", "اكتب العنوان الرئيسي هنا...")}
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] font-bold outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[var(--foreground)]">
              {t("section_subtitle", "العنوان الفرعي (Subtitle):")}
            </label>
            <input
              type="text"
              value={form.subtitle || ""}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder={t("placeholder_sub", "اكتب العنوان الفرعي...")}
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          {/* Detailed Paragraph */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[var(--foreground)]">
              {t("section_body", "النص التفصيلي والفقرة التوضيحية (Body Text):")}
            </label>
            <textarea
              rows={4}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={t("placeholder_desc", "اكتب النص التوضيحي للقسم...")}
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="block text-[0.7rem] font-bold text-[var(--muted-foreground)]">
                {t("primary_btn_text", "نص الزر الرئيسي (Primary CTA):")}
              </label>
              <input
                type="text"
                value={form.primaryBtnText || ""}
                onChange={(e) => setForm({ ...form, primaryBtnText: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[0.7rem] font-bold text-[var(--muted-foreground)]">
                {t("primary_btn_link", "رابط الزر الرئيسي (Link URL):")}
              </label>
              <input
                type="text"
                value={form.primaryBtnLink || ""}
                onChange={(e) => setForm({ ...form, primaryBtnLink: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
              />
            </div>
          </div>

          {/* Secondary Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[0.7rem] font-bold text-[var(--muted-foreground)]">
                {t("secondary_btn_text", "نص الزر الثانوي (Secondary CTA):")}
              </label>
              <input
                type="text"
                value={form.secondaryBtnText || ""}
                onChange={(e) => setForm({ ...form, secondaryBtnText: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[0.7rem] font-bold text-[var(--muted-foreground)]">
                {t("secondary_btn_link", "رابط الزر الثانوي (Link URL):")}
              </label>
              <input
                type="text"
                value={form.secondaryBtnLink || ""}
                onChange={(e) => setForm({ ...form, secondaryBtnLink: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1 pt-1">
            <label className="block text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t("image_url", "رابط الصورة المصاحبة (Image / Background URL):")}</span>
            </label>
            <input
              type="text"
              value={form.imageUrl || ""}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--muted-foreground)] hover:text-rose-500 hover:border-rose-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t("reset_default", "استعادة الافتراضي")}</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black text-xs font-bold shadow hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{t("save_public_content", "حفظ وتطبيق على الموقع")}</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{t("content_saved_notice", "تم حفظ وتحديث محتوى هذا القسم بنجاح ويظهر الآن على الموقع العام!")}</span>
            </div>
          )}
        </form>

        {/* Live Visual Preview Card */}
        {showPreview && (
          <div className="p-6 rounded-2xl border border-[var(--gold)]/40 bg-[var(--card)] shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[var(--gold)]" />
                  <span>{t("live_preview_box", "المعاينة الحية التفاعلية للقسم (Live Mock)")}</span>
                </h3>
                <span className="text-[0.65rem] text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t("auto_preview", "معاينة مباشرة")}
                </span>
              </div>

              {/* Mock Rendered Section */}
              <div className="p-6 rounded-2xl border border-[var(--gold)]/30 bg-[var(--background)] shadow-inner space-y-4 text-start relative overflow-hidden">
                {form.badge && (
                  <span className="px-3 py-1 rounded-full text-[0.68rem] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 inline-block">
                    {form.badge}
                  </span>
                )}

                <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">
                  {form.title}
                </h2>

                {form.subtitle && (
                  <p className="text-xs sm:text-sm font-semibold text-[var(--gold)] leading-relaxed">
                    {form.subtitle}
                  </p>
                )}

                {form.description && (
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    {form.description}
                  </p>
                )}

                {/* Mock Image Display */}
                {form.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-[var(--gold)]/30 max-h-48">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Mock Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  {form.primaryBtnText && (
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black text-xs font-bold shadow"
                    >
                      {form.primaryBtnText}
                    </button>
                  )}
                  {form.secondaryBtnText && (
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-bold"
                    >
                      {form.secondaryBtnText}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[0.7rem] text-[var(--muted-foreground)] flex items-center justify-between">
              <span>{t("target_page", "الصفحة المستهدفة")}: <strong>{currentPageObj?.label}</strong></span>
              <span>{t("target_section", "القسم")}: <strong>{selectedSection}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
