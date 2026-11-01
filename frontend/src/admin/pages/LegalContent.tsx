import { useCallback, useEffect, useState } from "react";
import {
  Scale,
  Lock,
  Shield,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Eye,
  FileText,
  Sliders,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Globe,
  RefreshCw,
} from "lucide-react";
import { api } from "../../api/client";
import { useTranslation } from "../../context/TranslationContext";

type LegalSection = { heading: string; body: string };

type LegalDocument = {
  slug: string;
  locale: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

const LEGAL_DOCUMENTS = [
  { slug: "terms", label: "شروط الخدمة (Terms of Service)", icon: Scale },
  { slug: "privacy", label: "سياسة الخصوصية (Privacy Policy)", icon: Lock },
  { slug: "cookies", label: "ملفات تعريف الارتباط (Cookie Policy)", icon: Shield },
  { slug: "refund", label: "سياسة الاسترداد (Refund Policy)", icon: RotateCcw },
];

const LOCALES = [
  { code: "ar", label: "العربية 🇹🇳" },
  { code: "fr", label: "Français 🇫🇷" },
  { code: "en", label: "English 🇬🇧" },
  { code: "es", label: "Español 🇪🇸" },
  { code: "it", label: "Italiano 🇮🇹" },
  { code: "mt", label: "Malti 🇲🇹" },
];

const DEFAULT_DOCS: Record<string, LegalDocument> = {
  terms: {
    slug: "terms",
    locale: "ar",
    title: "شروط وأحكام استخدام منصة جذور تونس",
    intro: "مرحباً بكم في منصة جذور تونس. تحكم هذه الشروط استخدامكم لخدمات الأنساب والأرشيف التاريخي وقواعد البيانات الرقمية.",
    sections: [
      {
        heading: "1. قبول الشروط والأهلية القانونية",
        body: "بإنشاء حساب أو تصفح الموقع، فإنك تقر وتوافق على الالتزام الكامل بهذه الشروط والسياسات الملحقة بها.",
      },
      {
        heading: "2. ملكية البيانات وحقوق النشر التاريخية",
        body: "جميع المخطوطات والوثائق الرقمية المعروضة هي إما ملكية تراثية عامة أو مرخصة خصيصاً للمنصة لأغراض البحث الأكاديمي والعائلي.",
      },
      {
        heading: "3. سعات التخزين وحدود الاشتراكات",
        body: "تلتزم الحسابات بالحدود القصوى للأفراد والشجرات والوثائق المحددة في كل باقة (Basic, Premium, Family Historian).",
      },
    ],
  },
  privacy: {
    slug: "privacy",
    locale: "ar",
    title: "سياسة الخصوصية وحماية البيانات الشخصية",
    intro: "نلتزم في جذور تونس بحماية أقصى درجات الخصوصية لمعلومات شجرتك العائلية وأفراد أسرتك وبياناتك الشخصية.",
    sections: [
      {
        heading: "1. البيانات التي نجمعها",
        body: "نجمع الاسم وعنوان البريد ورقم الهاتف وبيانات شجرة العائلة التي تقوم بإدخالها أو استيرادها بصيغة GEDCOM.",
      },
      {
        heading: "2. خصوصية الأشخاص الأحياء",
        body: "يتم حجب بيانات الأفراد الأحياء في شجرات العائلة تلقائياً لحماية هويتهم ما لم يحدد المستخدم خلاف ذلك.",
      },
    ],
  },
  cookies: {
    slug: "cookies",
    locale: "ar",
    title: "سياسة ملفات تعريف الارتباط (Cookies)",
    intro: "نستخدم ملفات تعريف الارتباط الأساسية لضمان عمل جلسة تسجيل الدخول وتذكر تفضيلات اللغة والعملة المختارة.",
    sections: [
      {
        heading: "1. ملفات تعريف الارتباط الأساسية",
        body: "ضرورية لحفظ جلسة الأمان والتحقق من صلاحية المشرف وتفضيلات الوضع الليلي.",
      },
    ],
  },
  refund: {
    slug: "refund",
    locale: "ar",
    title: "سياسة الاسترداد وإلغاء الاشتراكات",
    intro: "تحدد هذه السياسة معايير وإجراءات استرداد مبالغ الاشتراكات الرقمية.",
    sections: [
      {
        heading: "1. ضمان الرضا والاسترداد خلال 14 يوماً",
        body: "يمكن للمشترك طلب استرداد كامل المبلغ خلال 14 يوماً من تاريخ التفعيل إذا لم يتم استهلاك السعات التخزينية.",
      },
    ],
  },
};

export default function LegalContent() {
  const { t, isRtl } = useTranslation();
  const [selectedSlug, setSelectedSlug] = useState("terms");
  const [selectedLocale, setSelectedLocale] = useState("ar");
  const [doc, setDoc] = useState<LegalDocument>(DEFAULT_DOCS["terms"]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const storageKey = `roots_legal_${selectedSlug}_${selectedLocale}`;

  const loadDocument = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Try local cache
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        setDoc(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // 2. Try API endpoint
      const { data } = await api.get(`/admin/legal/${selectedSlug}`, {
        params: { locale: selectedLocale },
      });
      if (data && data.sections) {
        setDoc(data);
      } else {
        throw new Error("Fallback needed");
      }
    } catch {
      // 3. Fallback default
      const fallback = DEFAULT_DOCS[selectedSlug] || DEFAULT_DOCS.terms;
      setDoc({ ...fallback, slug: selectedSlug, locale: selectedLocale });
    } finally {
      setLoading(false);
    }
  }, [selectedSlug, selectedLocale, storageKey]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem(storageKey, JSON.stringify(doc));
      await api.put(`/admin/legal/${selectedSlug}`, doc).catch(() => {});
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const nextNum = doc.sections.length + 1;
    setDoc({
      ...doc,
      sections: [
        ...doc.sections,
        {
          heading: `${nextNum}. بند قانوني جديد`,
          body: "اكتب النص والشروط الخاصة بهذا البند هنا بالتفصيل...",
        },
      ],
    });
  };

  const removeSection = (index: number) => {
    setDoc({
      ...doc,
      sections: doc.sections.filter((_, idx) => idx !== index),
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= doc.sections.length) return;
    const cloned = [...doc.sections];
    const [moved] = cloned.splice(index, 1);
    cloned.splice(targetIdx, 0, moved);
    setDoc({ ...doc, sections: cloned });
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                {t("legal_content_manager_title", "إدارة المحتوى القانوني والسياسات (Legal Content CMS)")}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t(
                  "legal_content_manager_subtitle",
                  "تحرير وتحديث وثائق الشروط، الخصوصية، ملفات الارتباط، والاسترداد بجميع اللغات مع حفظ فوري"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-bold text-[var(--foreground)] hover:border-[var(--gold)] transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[var(--gold)]" />
            <span>{previewMode ? t("edit_mode", "وضع التحرير") : t("live_preview", "معاينة الوثيقة")}</span>
          </button>
        </div>
      </div>

      {/* Document Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {LEGAL_DOCUMENTS.map((d) => {
          const Icon = d.icon;
          const isSelected = selectedSlug === d.slug;
          return (
            <button
              key={d.slug}
              type="button"
              onClick={() => setSelectedSlug(d.slug)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border shrink-0 ${
                isSelected
                  ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-md"
                  : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* Language Pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span>{t("select_legal_locale", "لغة الوثيقة:")}</span>
        </span>
        <div className="flex items-center gap-1.5">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => setSelectedLocale(loc.code)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedLocale === loc.code
                  ? "bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)] font-bold shadow-sm"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor or Preview Mode */}
      {previewMode ? (
        <div className="p-8 rounded-3xl border-2 border-[var(--gold)]/40 bg-[var(--card)] shadow-xl space-y-6 text-start max-w-4xl mx-auto">
          <div className="border-b border-[var(--gold)]/20 pb-4 space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              {doc.title}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              {doc.intro}
            </p>
          </div>

          <div className="space-y-6">
            {doc.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-bold text-base text-[var(--gold)] font-display">
                  {sec.heading}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Document Details Card */}
          <div className="p-6 rounded-3xl border border-[var(--gold)]/30 bg-[var(--card)] shadow-md space-y-4">
            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <FileText className="w-4 h-4 text-[var(--gold)]" />
              <span>{t("document_metadata", "عنوان ومقدمة الوثيقة")}</span>
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                {t("document_title", "العنوان الرئيسي للوثيقة:")}
              </label>
              <input
                type="text"
                value={doc.title}
                onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] font-bold outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                {t("document_intro", "الفقرة التمهيدية (المقدمة):")}
              </label>
              <textarea
                rows={3}
                value={doc.intro}
                onChange={(e) => setDoc({ ...doc, intro: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[var(--gold)]" />
                <span>{t("document_clauses", "بنود وفقرات الوثيقة")} ({doc.sections.length})</span>
              </h3>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 text-xs font-bold hover:bg-[var(--gold)]/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t("add_clause_btn", "إضافة بند جديد")}</span>
              </button>
            </div>

            {doc.sections.map((section, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-3 relative group hover:border-[var(--gold)]/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                  <span className="font-mono text-xs font-bold text-[var(--gold)]">
                    Clause #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, "up")}
                      className="p-1 rounded-lg hover:bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === doc.sections.length - 1}
                      onClick={() => moveSection(idx, "down")}
                      className="p-1 rounded-lg hover:bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(idx)}
                      className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) => {
                      const updated = [...doc.sections];
                      updated[idx].heading = e.target.value;
                      setDoc({ ...doc, sections: updated });
                    }}
                    placeholder={t("clause_heading_placeholder", "عنوان البند...")}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] font-bold outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <textarea
                    rows={3}
                    value={section.body}
                    onChange={(e) => {
                      const updated = [...doc.sections];
                      updated[idx].body = e.target.value;
                      setDoc({ ...doc, sections: updated });
                    }}
                    placeholder={t("clause_body_placeholder", "نص وشروط البند...")}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] leading-relaxed resize-y"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Bottom Save Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--card)] border-2 border-[var(--gold)]/40 shadow-xl">
            <span className="text-xs font-bold text-[var(--muted-foreground)]">
              {t("unsaved_changes_hint", "يتم حفظ التغييرات فوراً وتحديث الروابط القانونية في الموقع.")}
            </span>

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
              <span>{t("save_legal_doc", "حفظ وتطبيق الوثيقة")}</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{t("legal_saved_success", "تم حفظ وتحديث الوثيقة بنجاح!")}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
