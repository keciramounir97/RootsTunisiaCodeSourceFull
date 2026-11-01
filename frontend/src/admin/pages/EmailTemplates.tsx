import { useState, useEffect } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Mail,
  Plus,
  Edit2,
  Trash2,
  Save,
  Send,
  Eye,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  FileText,
  Copy,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import Toast from "../../components/Toast";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault?: boolean;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "welcome",
    name: "ترحيب بالمستخدم الجديد (Welcome & Onboarding)",
    subject: "مرحباً بك في منصة جذور تونس | Welcome to Roots Tunisia",
    body: "عزيزي/عزيزتي {{name}}،\n\nيسرنا انضمامك إلى منصة \"جذور تونس\" لتوثيق الأنساب والتراث التاريخي. يمكنك الآن البدء في بناء شجرة عائلتك واستكشاف السجلات والأرشيف التاريخي.\n\nنتمنى لك رحلة بحث موفقة!\nفريق عمل جذور تونس",
    isDefault: true,
  },
  {
    id: "verification",
    name: "تفعيل وتأكيد الحساب (Account Verification)",
    subject: "تفعيل وتأكيد حسابك في منصة جذور تونس",
    body: "مرحباً {{name}}،\n\nشكراً لتسجيلك في جذور تونس. لتأكيد ملكية حسابك، يرجى تأكيد بريدك الإلكتروني لمرة واحدة فقط للبدء في استخدام كافة خدمات المنصة.\n\nمع تحيات إدارة جذور تونس",
    isDefault: true,
  },
  {
    id: "request_approved",
    name: "الموافقة على طلب التحميل (Download Request Approved)",
    subject: "تمت الموافقة على طلب تحميل الأرشيف | Roots Tunisia",
    body: "مرحباً {{name}}،\n\nيسعدنا إبلاغك بأنه تمت مراجعة وقبول طلبك لتحميل السجل/الملف التوثيقي المطلوب. يمكنك الآن تنزيل المحتوى مباشرة من حسابك في المنصة.\n\nشكراً لاهتمامك بتراث تونس،\nفريق الأرشيف",
    isDefault: true,
  },
  {
    id: "subscription_upgrade",
    name: "اعتماد وترقية الاشتراك (Subscription Upgrade)",
    subject: "تهانينا! تم اعتماد باقة اشتراكك في جذور تونس",
    body: "مرحباً {{name}}،\n\nتم التحقق من إشعار الدفع واعتماد ترقية باقة حسابك بنجاح. يمكنك الآن التمتع بكافة الحدود والمزايا الموسعة الخاصة باشتراكك.\n\nشكراً لثقتكم بنا،\nإدارة الاشتراكات",
    isDefault: true,
  },
  {
    id: "custom_notice",
    name: "إشعار إداري عام (Administrative Notice)",
    subject: "إشعار هام من إدارة منصة جذور تونس",
    body: "مرحباً {{name}}،\n\nنود إعلامكم بالتحديثات الجديدة المتعلقة بحسابكم والمنصة التوثيقية.\n\nإذا كان لديكم أي استفسار، لا تترددوا في الرد على هذه الرسالة.\n\nمع فائق التقدير،\nفريق إدارة جذور تونس",
    isDefault: true,
  },
];

export default function EmailTemplates() {
  const { t, isRtl } = useTranslation();
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(DEFAULT_TEMPLATES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<EmailTemplate>(DEFAULT_TEMPLATES[0]);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({
    message: "",
    tone: "success",
  });
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load templates from API or LocalStorage
  const loadTemplates = async () => {
    try {
      const res = await api.get("/admin/email-templates");
      const list = Array.isArray(res.data) ? res.data : res.data?.data;
      if (Array.isArray(list) && list.length > 0) {
        setTemplates(list);
        setSelectedTemplate(list[0]);
        setForm(list[0]);
        return;
      }
    } catch {}

    const local = localStorage.getItem("roots_email_templates");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTemplates(parsed);
          setSelectedTemplate(parsed[0]);
          setForm(parsed[0]);
          return;
        }
      } catch {}
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSelect = (tmpl: EmailTemplate) => {
    setSelectedTemplate(tmpl);
    setForm(tmpl);
    setIsEditing(false);
    setIsNew(false);
  };

  const handleAddNew = () => {
    const newTmpl: EmailTemplate = {
      id: `custom_${Date.now()}`,
      name: t("new_email_model", "نموذج بريد جديد (New Email Template)"),
      subject: t("email_subject_placeholder", "عنوان الرسالة..."),
      body: t("email_body_placeholder", "مرحباً {{name}}،\n\nاكتب محتوى الرسالة هنا..."),
      isDefault: false,
    };
    setForm(newTmpl);
    setIsNew(true);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) {
      setToast({
        message: t("all_fields_required", "يرجى ملء جميع الحقول المطلوبة"),
        tone: "error",
      });
      return;
    }

    let updated: EmailTemplate[] = [];
    if (isNew) {
      updated = [form, ...templates];
    } else {
      updated = templates.map((tmpl) => (tmpl.id === form.id ? form : tmpl));
    }

    setTemplates(updated);
    setSelectedTemplate(form);
    setIsEditing(false);
    setIsNew(false);

    try {
      await api.post("/admin/email-templates", form);
    } catch {}

    localStorage.setItem("roots_email_templates", JSON.stringify(updated));
    setToast({
      message: t("template_saved_success", "تم حفظ وتحديث نموذج البريد الإلكتروني بنجاح!"),
      tone: "success",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm(t("confirm_delete_template", "هل أنت متأكد من حذف هذا النموذج؟"))) {
      const updated = templates.filter((t) => t.id !== id);
      setTemplates(updated);
      if (updated.length > 0) {
        setSelectedTemplate(updated[0]);
        setForm(updated[0]);
      }
      localStorage.setItem("roots_email_templates", JSON.stringify(updated));
      setToast({
        message: t("template_deleted_success", "تم حذف النموذج بنجاح"),
        tone: "success",
      });
    }
  };

  const handleSendTest = async () => {
    if (!testEmail.trim() || !testEmail.includes("@")) {
      setToast({
        message: t("valid_email_required", "يرجى إدخال بريد إلكتروني صحيح للتجربة"),
        tone: "error",
      });
      return;
    }

    setSendingTest(true);
    try {
      await api.post("/admin/send-email", {
        to: testEmail.trim(),
        subject: `[تجربة SMTP] ${form.subject}`,
        body: form.body
          .replace(/{{name}}/g, "Karim Admin")
          .replace(/{{email}}/g, testEmail.trim()),
      });

      setToast({
        message: t("test_email_sent_success", `تم إرسال البريد التجريبي بنجاح عبر SMTP إلى ${testEmail}`),
        tone: "success",
      });
    } catch (err: any) {
      setToast({
        message: err?.response?.data?.message || t("test_email_failed", "فشل إرسال البريد عبر SMTP"),
        tone: "error",
      });
    } finally {
      setSendingTest(false);
    }
  };

  const previewBody = form.body
    .replace(/{{name}}/g, "محمد التونسي")
    .replace(/{{email}}/g, "user@example.com")
    .replace(/{{site_name}}/g, "جذور تونس (Roots Tunisia)");

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start pb-16">
      {toast.message && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast({ message: "", tone: "success" })}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                {t("emails_page_title", "نماذج وقوالب البريد الإلكتروني (Email Models)")}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t(
                  "emails_page_subtitle",
                  "صياغة وإدارة قوالب الرسائل الجاهزة لإرسالها بضغطة زر إلى المستخدمين عبر خادم SMTP"
                )}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddNew}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t("create_new_model", "إنشاء نموذج جديد")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Template list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] px-2">
              {t("available_models", "النماذج المتاحة")} ({templates.length})
            </h3>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
              {templates.map((tmpl) => {
                const isActive = selectedTemplate.id === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelect(tmpl)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--foreground)] font-bold shadow-sm"
                        : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-[var(--gold)]/40 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <div className="space-y-0.5 truncate flex-1 pe-2">
                      <p className="truncate">{tmpl.name}</p>
                      <span className="text-[0.68rem] text-[var(--muted-foreground)] truncate block font-normal">
                        {tmpl.subject}
                      </span>
                    </div>

                    {!tmpl.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(tmpl.id);
                        }}
                        title={t("delete", "حذف")}
                        className="text-red-500 hover:text-red-700 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Placeholders Help Box */}
          <div className="p-4 rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold)]/5 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-[var(--gold)] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{t("variables_guide", "المتغيرات الديناميكية المدعومة:")}</span>
            </div>
            <ul className="space-y-1 text-[var(--muted-foreground)] text-[0.75rem]">
              <li><code className="text-[var(--gold)] font-mono">{"{{name}}"}</code>: اسم المستخدم الكامل</li>
              <li><code className="text-[var(--gold)] font-mono">{"{{email}}"}</code>: البريد الإلكتروني للمستخدم</li>
              <li><code className="text-[var(--gold)] font-mono">{"{{site_name}}"}</code>: اسم المنصة (جذور تونس)</li>
            </ul>
          </div>
        </div>

        {/* Right column: Editor & Preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--gold)]" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  {isNew
                    ? t("new_template_details", "تفاصيل النموذج الجديد")
                    : t("edit_template_details", "تعديل محتوى النموذج")}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:border-[var(--gold)] text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showPreview ? t("editor_view", "المحرر") : t("preview", "معاينة")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3.5 py-1.5 rounded-xl bg-[var(--gold)] text-black text-xs font-bold flex items-center gap-1 shadow-sm hover:opacity-95 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t("save", "حفظ النموذج")}</span>
                </button>
              </div>
            </div>

            {showPreview ? (
              /* Live Email Preview */
              <div className="p-5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] space-y-4">
                <div className="space-y-1 pb-3 border-b border-[var(--border)] text-xs">
                  <p><span className="text-[var(--muted-foreground)]">الموضوع:</span> <strong className="text-[var(--foreground)]">{form.subject}</strong></p>
                  <p><span className="text-[var(--muted-foreground)]">المرسل:</span> <span className="text-[var(--foreground)] font-mono">Roots Tunisia &lt;devteam@rootstunisia.com&gt;</span></p>
                </div>
                <div className="p-4 rounded-xl bg-white text-gray-800 font-sans shadow-sm text-sm whitespace-pre-line leading-relaxed border border-gray-200">
                  <div className="text-center pb-3 mb-3 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 font-serif">جذور تونس | Roots Tunisia</h2>
                  </div>
                  {previewBody}
                </div>
              </div>
            ) : (
              /* Form Inputs */
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    {t("template_name", "اسم وتصنيف النموذج")}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    {t("email_subject", "عنوان الرسالة (Email Subject)")}
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    {t("email_body", "نص ومحتوى الرسالة (Body Content)")}
                  </label>
                  <textarea
                    rows={9}
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors font-sans leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Test Send via SMTP Section */}
            <div className="pt-4 border-t border-[var(--border)]/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder={t("send_test_email_placeholder", "أدخل بريدك لتجربة إرسال النموذج عبر SMTP...")}
                  className="w-full sm:w-72 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={sendingTest}
                  className="px-3.5 py-1.5 rounded-xl border border-[var(--gold)]/50 bg-[var(--card)] hover:bg-[var(--gold)]/10 text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Send className={`w-3.5 h-3.5 text-[var(--gold)] ${sendingTest ? "animate-spin" : ""}`} />
                  <span>{t("send_test", "إرسال تجربة")}</span>
                </button>
              </div>

              <span className="text-[0.68rem] text-[var(--muted-foreground)]">
                خادم SMTP المعتمد: <strong className="text-[var(--gold)]">Hostinger SSL (465)</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
