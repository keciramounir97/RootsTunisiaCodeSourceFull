import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  ShieldCheck,
  Mail,
  User,
  Phone,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import { useThemeStore } from "../../store/theme";
import { api } from "../../api/client";
import {
  getApiErrorMessage,
  requestWithFallback,
  shouldFallbackRoute,
} from "../../api/helpers";
import { useAuth } from "../components/AuthContext";
import { useTranslation } from "../../context/TranslationContext";
import Toast from "../../components/Toast";

export default function UsersPage() {
  const { theme } = useThemeStore();
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  const pageBg = isDark ? "bg-gray-900" : "bg-[var(--paper-color)]";
  const text = isDark ? "text-white" : "text-[var(--text-color)]";
  const card = isDark ? "bg-gray-800" : "bg-white";
  const border = isDark ? "border-gray-700" : "border-[var(--border-color)]";
  const subtle = isDark ? "bg-gray-800" : "bg-gray-50";
  const inputBg = isDark ? "bg-gray-800" : "bg-white";
  const inputText = isDark ? "text-white" : "text-[var(--text-color)]";

  const getRoleLabel = (role: string | number) => {
    if (typeof role === "number") {
      if (role === 3) return t("super_admin", "مشرف عام");
      if (role === 1) return t("admin", "مشرف");
      return t("user", "مستخدم");
    }
    const str = String(role).toLowerCase();
    if (str.includes("super")) return t("super_admin", "مشرف عام");
    if (str.includes("admin")) return t("admin", "مشرف");
    if (str.includes("user") || str.includes("member")) return t("user", "مستخدم");
    return t(str, String(role));
  };

  const [q, setQ] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleId: 2,
  });
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    roleId: 2,
    status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [emailModalUser, setEmailModalUser] = useState<any>(null);
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const openEmailModal = (userTarget: any) => {
    setEmailModalUser(userTarget);
    const tmpls = [
      {
        id: "welcome",
        name: t("tmpl_welcome", "ترحيب بالمستخدم (Welcome & Onboarding)"),
        subject: `مرحباً بك في منصة جذور تونس يا ${userTarget.fullName || ""}`,
        body: `عزيزي/عزيزتي ${userTarget.fullName || ""}،\n\nيسعدنا انضمامك إلى منصة "جذور تونس". يمكنك الآن توثيق أصولك وبناء شجرة عائلتك واستكشاف السجلات التاريخية.\n\nمع تحيات إدارة جذور تونس`,
      },
      {
        id: "verification",
        name: t("tmpl_verification", "تأكيد وتفعيل الحساب (Account Verification)"),
        subject: "تفعيل وتأكيد حسابك في جذور تونس",
        body: `مرحباً ${userTarget.fullName || ""}،\n\nيرجى تأكيد بريدك الإلكتروني لتفعيل حسابك بشكل كامل.\n\nمع تحيات إدارة جذور تونس`,
      },
      {
        id: "upgrade",
        name: t("tmpl_upgrade", "اعتماد وترقية الباقة (Subscription Upgrade)"),
        subject: "تمت ترقية باقة اشتراكك بنجاح | Roots Tunisia",
        body: `مرحباً ${userTarget.fullName || ""}،\n\nنود إبلاغك بأنه تم اعتماد ترقية باقة اشتراكك بنجاح، ويمكنك الآن التمتع بجميع المزايا.\n\nشكراً لثقتك بنا،\nإدارة الاشتراكات`,
      },
      {
        id: "custom",
        name: t("tmpl_custom", "رسالة مخصصة (Custom Message)"),
        subject: "",
        body: `مرحباً ${userTarget.fullName || ""}،\n\n`,
      },
    ];
    setEmailTemplates(tmpls);
    setSelectedTemplateId("welcome");
    setEmailSubject(tmpls[0].subject);
    setEmailBody(tmpls[0].body);
  };

  const handleTemplateChange = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = emailTemplates.find((t) => t.id === tmplId);
    if (tmpl) {
      setEmailSubject(tmpl.subject);
      setEmailBody(tmpl.body);
    }
  };

  const handleSendEmail = async () => {
    if (!emailModalUser?.email || !emailSubject.trim() || !emailBody.trim()) {
      notify(t("email_fields_required", "يرجى ملء عنوان ونص الرسالة"), "error");
      return;
    }
    setSendingEmail(true);
    try {
      await api.post("/admin/send-email", {
        to: emailModalUser.email,
        subject: emailSubject.trim(),
        body: emailBody.trim(),
      });
      notify(t("email_sent_success", `تم إرسال البريد الإلكتروني بنجاح عبر SMTP إلى ${emailModalUser.email}`));
      setEmailModalUser(null);
    } catch (err: any) {
      notify(err?.response?.data?.message || t("email_send_failed", "فشل إرسال البريد الإلكتروني"), "error");
    } finally {
      setSendingEmail(false);
    }
  };
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({ message: "", tone: "success" });

  const notify = useCallback((message: string, tone: "success" | "error" = "success") => {
    setToast({ message, tone });
  }, []);

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => {
      setToast({ message: "", tone: "success" });
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.message]);

  const loadUsers = useCallback(
    async ({ notify: notifyToast = false } = {}) => {
      setLoading(true);
      setError("");
      try {
        const { data } = await requestWithFallback(
          [() => api.get("/admin/users")],
          (err: any) => shouldFallbackRoute(err) || err?.response?.status === 500
        );
        setUsers(Array.isArray(data) ? data : []);
        if (notifyToast) {
          notify(t("users_loaded", "Users loaded."));
        }
      } catch (err) {
        setUsers([]);
        const message = getApiErrorMessage(err, "Failed to load users");
        setError(message);
        notify(message, "error");
      } finally {
        setLoading(false);
      }
    },
    [notify, t]
  );

  useEffect(() => {
    void loadUsers({ notify: true });
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (u) =>
        String(u.fullName || "").toLowerCase().includes(query) ||
        String(u.email || "").toLowerCase().includes(query) ||
        String(u.phone || "").toLowerCase().includes(query)
    );
  }, [users, q]);

  const loadRoles = useCallback(async () => {
    const { data } = await api.get("/admin/roles");
    return Array.isArray(data) ? data : [];
  }, []);

  const openAdd = async () => {
    setError("");
    setSaving(false);
    setForm({ fullName: "", email: "", phone: "", roleId: roles[0]?.id || 2 });
    setShowAdd(true);
    try {
      const data = roles.length ? roles : await loadRoles();
      setRoles(data);
      if (!form.roleId && data.length) {
        setForm((prev) => ({ ...prev, roleId: data[0].id }));
      }
    } catch (err) {
      setShowAdd(false);
      const message = getApiErrorMessage(err, "Failed to load roles");
      setError(message);
      notify(message, "error");
    }
  };

  const openEdit = async (u: any) => {
    if (!u) return;
    setError("");
    setSaving(false);
    setEditTarget(u);
    setEditForm({
      fullName: String(u.fullName || ""),
      phone: String(u.phone || ""),
      roleId: Number(u.roleId) || 2,
      status: String(u.status || "active"),
    });
    setShowEdit(true);

    if (roles.length) return;
    try {
      const data = await loadRoles();
      setRoles(data);
    } catch (err) {
      setShowEdit(false);
      setEditTarget(null);
      const message = getApiErrorMessage(err, "Failed to load roles");
      setError(message);
      notify(message, "error");
    }
  };

  const submitAdd = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        roleId: Number(form.roleId) || 2,
      };
      const { data } = await api.post("/admin/users", payload);
      setUsers((prev) => [data, ...prev]);
      setShowAdd(false);
      notify(t("user_created", "User created."));
    } catch (err) {
      const message = getApiErrorMessage(err, "Create user failed");
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (e: any) => {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim(),
        roleId: Number(editForm.roleId) || 2,
        status: editForm.status,
      };
      await api.patch(`/admin/users/${editTarget.id}`, payload);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editTarget.id
            ? {
                ...u,
                fullName: payload.fullName,
                phone: payload.phone || null,
                roleId: payload.roleId,
                roleName:
                  roles.find((r) => Number(r.id) === Number(payload.roleId))
                    ?.name || u.roleName,
                status: payload.status,
              }
            : u
        )
      );
      setShowEdit(false);
      setEditTarget(null);
      notify(t("user_updated", "User updated."));
    } catch (err) {
      const message = getApiErrorMessage(err, "Update user failed");
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (userToDelete: any) => {
    if (!userToDelete?.id) return;
    if (Number(userToDelete.id) === Number(currentUser?.id)) {
      notify(t("cannot_delete_self", "You cannot delete your own account."), "error");
      return;
    }

    const ok = window.confirm(
      t(
        "confirm_delete_user",
        `Delete ${userToDelete.fullName || userToDelete.email || "this user"}?`
      )
    );
    if (!ok) return;

    setSaving(true);
    setError("");
    try {
      await api.delete(`/admin/users/${userToDelete.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      notify(t("user_deleted", "User deleted."));
    } catch (err) {
      const message = getApiErrorMessage(err, "Delete user failed");
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`p-6 min-h-screen ${pageBg} ${text} heritage-page-root`}>
      <Toast message={toast.message} tone={toast.tone} />
      <div
          className={`rounded-xl p-6 mb-6 border ${border} shadow-lg
        bg-gradient-to-br from-[var(--brand-teal)]/10 via-[var(--brand-gold)]/8 to-[var(--teal-dark)]/10 
        heritage-panel heritage-panel--accent backdrop-blur-sm`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">{t("users", "Users")}</h3>
            <p className="opacity-70">
              {t(
                "users_desc",
                t("users_page_desc", "Registered users (name, email, phone) - passwords are never shown.")
              )}
            </p>
          </div>

          <button
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60
            bg-gradient-to-r from-[var(--brand-teal)] to-[var(--teal-dark)] text-white hover:opacity-90`}
            type="button"
            onClick={openAdd}
            disabled={currentUser?.role !== 1}
            title={
              currentUser?.role !== 1 ? t("admin_only", "Admin only") : t("add_user_hint", "Add a new user")
            }
          >
            <UserPlus className="w-5 h-5" />
            {t("add_user", "Add User")}
          </button>
        </div>

        <div className="mt-4 relative">
          <Search className={`w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-[var(--text-color)]/60`} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={`heritage-input w-full ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 py-2.5 rounded-lg border
            focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/25 focus:border-[var(--brand-gold)]/50 transition-all
            ${inputBg} ${inputText} ${border}`}
            placeholder={t("search_users", "Search users...")}
          />
        </div>
      </div>

      <div className={`rounded-xl border ${border} ${card} overflow-hidden shadow-md heritage-panel`}>
        {loading ? (
          <div className="p-12 text-center opacity-60">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-teal)]"></div>
            <p className="mt-4">{t("loading", "Loading...")}</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <div className={`text-lg font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center opacity-60">
            <User className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>{t("no_results", "No results.")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="heritage-table w-full text-sm">
              <thead className={`${subtle} ${isDark ? 'bg-[#2c1810]/50' : 'bg-[#f8f5ef]'}`}>
                <tr className={`text-start border-b ${border}`}>
                  <th className={`py-4 px-5 text-start font-semibold text-[var(--brand-teal)]`}>
                    {t("full_name", "Full Name")}
                  </th>
                  <th className={`py-4 px-5 text-start font-semibold text-[var(--brand-teal)]`}>
                    {t("email", "Email")}
                  </th>
                  <th className={`py-4 px-5 text-start font-semibold text-[var(--brand-teal)]`}>
                    {t("phone", "Phone")}
                  </th>
                  <th className={`py-4 px-5 text-start font-semibold text-[var(--brand-teal)]`}>
                    {t("role", "Role")}
                  </th>
                  <th className={`py-4 px-5 text-start font-semibold text-[var(--brand-teal)]`}>
                    {t("status", "Status")}
                  </th>
                  {currentUser?.role === 1 ? (
                    <th className={`py-4 px-5 text-end font-semibold text-[var(--brand-teal)]`}>
                      {t("actions", "Actions")}
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className={`admin-table-row border-b ${border} transition-colors ${
                      u.id === currentUser?.id 
                        ? 'bg-[var(--brand-gold)]/10' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <td className="py-4 px-5 text-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]`}>
                          <User className="w-5 h-5" />
                        </div>
                        <span className="font-semibold">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-start">
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 text-[var(--brand-teal)]/60`} />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-start">
                      {u.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className={`w-4 h-4 text-[var(--brand-teal)]/60`} />
                          <span>{u.phone}</span>
                        </div>
                      ) : (
                        <span className="opacity-40">-</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-start">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] border border-[var(--brand-teal)]/20`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {getRoleLabel(u.roleName || u.roleId)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-start">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                      ${u.status === 'active' 
                        ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')
                        : (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
                      }`}>
                        {u.status === 'active' ? t("active", "نشط") : t("inactive", "غير نشط")}
                      </span>
                    </td>
                    {currentUser?.role === 1 || currentUser?.role === 3 ? (
                      <td className="py-4 px-5 text-end">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className={`interactive-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${border} 
                            transition-all hover:shadow-md disabled:opacity-60 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-[var(--text-color)]`}
                            onClick={() => openEdit(u)}
                            disabled={saving}
                          >
                            <Pencil className="w-4 h-4" />
                            {t("edit", "Edit")}
                          </button>
                          <button
                            type="button"
                            className={`interactive-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg 
                            transition-all hover:shadow-md disabled:opacity-60 bg-red-600 hover:bg-red-700 text-white`}
                            onClick={() => deleteUser(u)}
                            disabled={saving}
                          >
                            <Trash2 className="w-4 h-4" />
                            {t("delete", "Delete")}
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send Email via SMTP Modal */}
      {emailModalUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
          <div className={`w-full max-w-lg rounded-2xl border ${border} ${card} p-6 shadow-2xl space-y-4 text-start`}>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--foreground)]">
                    {t("send_smtp_email_to", "إرسال بريد إلكتروني للمستخدم")}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {emailModalUser.fullName} &lt;{emailModalUser.email}&gt;
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailModalUser(null)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  {t("choose_email_model", "اختر نموذج بريد جاهز (Email Model):")}
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${border} ${inputBg} ${inputText} text-xs outline-none focus:border-[var(--gold)] cursor-pointer`}
                >
                  {emailTemplates.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  {t("email_subject", "عنوان الرسالة:")}
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${border} ${inputBg} ${inputText} text-xs outline-none focus:border-[var(--gold)]`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  {t("email_content", "محتوى الرسالة (يمكنك تعديلها على الفور):")}
                </label>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${border} ${inputBg} ${inputText} text-xs outline-none focus:border-[var(--gold)] leading-relaxed`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <span className="text-[0.68rem] text-[var(--muted-foreground)]">
                SMTP: Hostinger SSL (devteam@rootstunisia.com)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEmailModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold cursor-pointer"
                >
                  {t("cancel", "إلغاء")}
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="px-4 py-2 rounded-xl bg-[var(--gold)] text-black text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingEmail ? "animate-spin" : ""}`} />
                  <span>{t("send_via_smtp", "إرسال عبر SMTP")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showAdd ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => (saving ? null : setShowAdd(false))}
          />
          <div
            className={`relative w-full max-w-lg rounded-xl border ${border} ${card} p-6 shadow-2xl heritage-panel`}
            onClick={() => (saving ? null : setShowAdd(false))}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-bold">{t("add_user", "Add User")}</h4>
                <p className="text-sm opacity-70">
                  {t("add_user_email_hint", "We will email them a password-reset code to set their password.")}
                </p>
              </div>
              <button
                type="button"
                className={`p-2 rounded-md border ${border} hover:opacity-90 disabled:opacity-60`}
                onClick={() => setShowAdd(false)}
                disabled={saving}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={submitAdd}>
              <label className="block">
                <span className={`block text-sm font-semibold mb-2 text-[var(--text-color)]`}>
                  {t("full_name", "Full Name")} <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, fullName: e.target.value }))
                  }
                  required
                  className={`heritage-input w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputText} ${border}
                  focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/25 focus:border-[var(--brand-gold)]/50 transition-all`}
                  placeholder={t("full_name_placeholder", "Full name")}
                  disabled={saving}
                />
              </label>

              <label className="block">
                <span className={`block text-sm font-semibold mb-2 text-[var(--text-color)]`}>
                  {t("email", "Email")} <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                  required
                  type="email"
                  className={`heritage-input w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputText} ${border}
                  focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/25 focus:border-[var(--brand-gold)]/50 transition-all`}
                  placeholder={t("email_placeholder_example", "email@example.com")}
                  disabled={saving}
                />
              </label>

              <label className="block">
                <span className={`block text-sm font-semibold mb-2 text-[var(--text-color)]`}>
                  {t("phone", "Phone")} <span className="text-xs opacity-60">({t("optional", "Optional")})</span>
                </span>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, phone: e.target.value }))
                  }
                  className={`heritage-input w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputText} ${border}
                  focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/25 focus:border-[var(--brand-gold)]/50 transition-all`}
                  placeholder="+1 555 123 4567"
                  disabled={saving}
                />
              </label>

              <label className="block">
                <span className={`block text-sm font-semibold mb-2 text-[var(--text-color)]`}>
                  {t("role", "Role")}
                </span>
                <select
                  value={form.roleId}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, roleId: Number(e.target.value) }))
                  }
                  className={`heritage-input w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputText} ${border}
                  focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/25 focus:border-[var(--brand-gold)]/50 transition-all`}
                  disabled={saving}
                >
                  {(roles.length ? roles : [{ id: 2, name: "user" }]).map(
                    (r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    )
                  )}
                </select>
              </label>

              {error ? (
                <div className="text-sm text-[var(--brand-teal)] font-semibold">
                  {error}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className={`px-5 py-2.5 rounded-lg border ${border} font-semibold transition-all hover:shadow-md disabled:opacity-60 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-[var(--text-color)]`}
                  onClick={() => setShowAdd(false)}
                  disabled={saving}
                >
                  {t("cancel", "Cancel")}
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-60 bg-gradient-to-r from-[var(--brand-teal)] to-[var(--teal-dark)] text-white`}
                  disabled={saving}
                >
                  {saving ? t("creating", "Creating...") : t("create_user", "Create User")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showEdit ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => (saving ? null : setShowEdit(false))}
          />
          <div
            className={`relative w-full max-w-lg rounded-xl border ${border} ${card} p-6 shadow-2xl heritage-panel`}
            onClick={() => (saving ? null : setShowEdit(false))}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-bold">{t("edit_user", "Edit User")}</h4>
                <p className="text-sm opacity-70">
                  {editTarget?.email || ""}
                </p>
              </div>
              <button
                type="button"
                className={`p-2 rounded-md border ${border} hover:opacity-90 disabled:opacity-60`}
                onClick={() => setShowEdit(false)}
                disabled={saving}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={submitEdit}>
              <label className="block">
                <span className={`block text-sm font-semibold mb-2 text-[var(--text-color)]`}>
                  {t("full_name", "Full Name")} <span className="text-red-500">*</span>
                </span>
                <input
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, fullName: e.target.value }))
                  }
                  required
                  className={`heritage-input w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputText} ${border}
                  focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/25 focus:border-[var(--brand-gold)]/50 transition-all`}
                  disabled={saving}
                />
              </label>

              <label className="block">
                <span className={`block text-sm font-semibold mb-2 text-[var(--text-color)]`}>
                  {t("phone", "Phone")} <span className="text-xs opacity-60">({t("optional", "Optional")})</span>
                </span>
                <input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, phone: e.target.value }))
                  }
                  className={`heritage-input w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputText} ${border}
                  focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/25 focus:border-[var(--brand-gold)]/50 transition-all`}
                  disabled={saving}
                />
              </label>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className={`block text-sm font-semibold mb-2 text-[var(--text-color)]`}>
                    {t("role", "Role")}
                  </span>
                   <select
                     value={editForm.roleId}
                      onChange={(e) =>
                        setEditForm((s) => ({ ...s, roleId: Number(e.target.value) }))
                      }
                     className={`heritage-input w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputText} ${border}
                     focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/25 focus:border-[var(--brand-gold)]/50 transition-all`}
                     disabled={saving}
                   >
                    {((roles as any[]).length ? (roles as any[]) : [{ id: 2, name: "user" }]).map(
                      (r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="block">
                  <span className={`block text-sm font-semibold mb-2 text-[var(--text-color)]`}>
                    {t("status", "Status")}
                  </span>
                   <select
                     value={editForm.status}
                     onChange={(e) =>
                       setEditForm((s) => ({ ...s, status: e.target.value }))
                     }
                     className={`heritage-input w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputText} ${border}
                     focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/25 focus:border-[var(--brand-gold)]/50 transition-all`}
                     disabled={saving}
                   >
                    <option value="active">{t("active", "Active")}</option>
                    <option value="disabled">{t("disabled", "Disabled")}</option>
                  </select>
                </label>
              </div>

              {error ? (
                <div className="text-sm text-[var(--brand-teal)] font-semibold">
                  {error}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className={`px-5 py-2.5 rounded-lg border ${border} font-semibold transition-all hover:shadow-md disabled:opacity-60 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-[var(--text-color)]`}
                  onClick={() => setShowEdit(false)}
                  disabled={saving}
                >
                  {t("cancel", "Cancel")}
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-60 bg-gradient-to-r from-[var(--brand-teal)] to-[var(--teal-dark)] text-white`}
                  disabled={saving}
                >
                  {saving ? t("saving", "Saving...") : t("save", "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}





