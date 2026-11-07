import { useState, useEffect } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { useThemeStore } from "../../store/theme";
import { useLanguage } from "../../i18n";
import { useAuth } from "../components/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { api } from "../../api/client";
import {
  User,
  Globe,
  Moon,
  Sun,
  Lock,
  Activity,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldAlert,
  Power,
  RefreshCw,
  Coins,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function UserSettings() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { language, changeLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { selectedCurrency, setCurrencyCode, currencies } = useCurrency();
  const isDark = theme === "dark";

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  // Activity Log Settings & History
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [togglingLog, setTogglingLog] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Account Deletion Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteMode, setDeleteMode] = useState<"direct" | "request">("direct");
  const [submittingDelete, setSubmittingDelete] = useState(false);

  // Status banner
  const [status, setStatus] = useState<{ type: string; msg: string }>({ type: "", msg: "" });

  const fetchUserData = async () => {
    setLoadingActivities(true);
    try {
      const [actRes, setRes] = await Promise.all([
        api.get("/my/activity").catch(() => ({ data: [] })),
        api.get("/my/activity-settings").catch(() => ({ data: { enabled: true } })),
      ]);
      setActivities(Array.isArray(actRes.data) ? actRes.data : actRes.data?.data || []);
      setLoggingEnabled(setRes.data?.enabled !== false);
    } catch {
      // ignore
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle Language Change
  const handleLangChange = (langCode: string) => {
    changeLanguage(langCode);
    setStatus({ type: "success", msg: t("language_changed", "تم تغيير اللغة بنجاح") });
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setStatus({ type: "error", msg: t("password_min_length", "يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.") });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", msg: t("password_match_error", "كلمة المرور الجديدة وتأكيدها غير متطابقين.") });
      return;
    }

    setChangingPass(true);
    setStatus({ type: "", msg: "" });
    try {
      const res = await api.post("/my/change-password", {
        currentPassword,
        newPassword,
      });
      setStatus({ type: "success", msg: res.data?.message || t("password_updated_success", "تم تحديث كلمة المرور بنجاح!") });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || t("password_update_failed", "فشل تحديث كلمة المرور. يرجى التحقق من كلمة المرور الحالية."),
      });
    } finally {
      setChangingPass(false);
    }
  };

  // Handle Activity Logging Toggle
  const handleToggleLogging = async () => {
    setTogglingLog(true);
    const nextState = !loggingEnabled;
    try {
      await api.patch("/my/activity-settings", { enabled: nextState });
      setLoggingEnabled(nextState);
      setStatus({
        type: "success",
        msg: t("activity_logging_updated", "تم تحديث إعدادات تسجيل النشاط بنجاح."),
      });
    } catch (err: any) {
      setStatus({ type: "error", msg: "Failed to update activity logging preference." });
    } finally {
      setTogglingLog(false);
    }
  };

  // Handle Account Deletion (Direct Self-Delete or Admin Request)
  const handleDeleteAccount = async () => {
    setSubmittingDelete(true);
    setStatus({ type: "", msg: "" });
    try {
      if (deleteMode === "direct") {
        if (!deletePassword) {
          setStatus({ type: "error", msg: t("enter_password_confirm_delete", "يرجى إدخال كلمة المرور لتأكيد الحذف الفوري للحساب.") });
          setSubmittingDelete(false);
          return;
        }
        await api.post("/my/account/self-delete", { password: deletePassword });
        setShowDeleteModal(false);
        await logout();
        window.location.href = "/?deleted=true";
        return;
      } else {
        const res = await api.post("/my/account-deletion", { reason: deletionReason });
        setStatus({
          type: "success",
          msg: res.data?.message || t("account_deletion_submitted", "تم تقديم طلب حذف الحساب بنجاح إلى المشرف العام."),
        });
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      setStatus({ type: "error", msg: err.response?.data?.message || t("account_deletion_failed", "فشل معالجة طلب حذف الحساب.") });
    } finally {
      setSubmittingDelete(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#d9a441]/15 text-[#d9a441]">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-cinzel text-[var(--text-color)]">
              {t("user_settings", "User Dashboard Settings")}
            </h1>
            <p className="text-xs text-[var(--text-color)] opacity-70">
              {t("user_settings_desc", "Manage your preferences, security, language, theme mode, and personal activity log.")}
            </p>
          </div>
        </div>
      </div>

      {status.msg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm border ${
            status.type === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-500/30"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-500/30"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{status.msg}</span>
        </div>
      )}

      {/* Grid of Settings Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Language & Appearance Card */}
        <div className="rounded-3xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] p-6 shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
            <Globe className="w-5 h-5 text-[#d9a441]" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">{t("language_and_appearance", "Language & Appearance")}</h3>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t("interface_language", "Interface Language:")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { code: "fr", label: "Français 🇫🇷" },
                { code: "en", label: "English 🇬🇧" },
                { code: "ar", label: "العربية 🇹🇳" },
                { code: "es", label: "Español 🇪🇸" },
                { code: "it", label: "Italiano 🇮🇹" },
                { code: "mt", label: "Malti 🇲🇹" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    language === lang.code
                      ? "border-[#d9a441] bg-[#d9a441]/15 text-[#d9a441]"
                      : "border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Preference */}
          <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#d9a441]" />
                <span>{t("preferred_currency", "عملة العرض وتتبع الاشتراكات:")}</span>
              </label>
              <span className="text-[0.7rem] font-bold text-[#d9a441] font-mono bg-[#d9a441]/10 px-2 py-0.5 rounded border border-[#d9a441]/30">
                {selectedCurrency.code} ({selectedCurrency.symbol})
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currencies.map((curr) => {
                const isSelected = selectedCurrency.code === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      setCurrencyCode(curr.code);
                      setStatus({
                        type: "success",
                        msg: t("currency_changed_success", "تم ضبط عملة الحساب بنجاح"),
                      });
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#d9a441]/15 border-[#d9a441] text-[#d9a441] ring-2 ring-[#d9a441]/30 shadow-sm"
                        : "border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#d9a441]/40"
                    }`}
                  >
                    <span>{curr.code}</span>
                    <span className="font-mono text-[0.7rem] text-gray-500">{curr.symbol}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Mode Toggle */}
          <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t("theme_mode", "Theme Mode:")}
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <div>
                  <span className="font-bold text-xs text-gray-900 dark:text-white">
                    {isDark ? t("dark_mode_active", "Dark Mode Active") : t("light_mode_active", "Light Mode Active")}
                  </span>
                  <p className="text-[0.7rem] text-gray-500">{t("toggle_theme_desc", "Toggle website color theme display")}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs shadow hover:shadow-md transition-all"
              >
                {t("switch_theme", "Switch Theme")}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Password & Security Card */}
        <div className="rounded-3xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#d9a441]" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">{t("password_and_security", "Password & Security")}</h3>
            </div>
            <Link
              to="/resetpassword"
              className="text-xs text-[#d9a441] hover:underline font-semibold flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {t("forgot_password_q", "Forgot Password?")}
            </Link>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t("current_password", "Current Password:")}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("placeholder_current_password", "Enter current password...")}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#d9a441]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t("new_password", "New Password:")}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("placeholder_new_password", "Enter new password (min 6 chars)...")}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#d9a441]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {t("confirm_new_password", "Confirm New Password:")}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("placeholder_confirm_password", "Re-enter new password...")}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#d9a441]/30"
              />
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs flex items-center justify-center gap-2 shadow hover:shadow-lg transition-all disabled:opacity-50"
            >
              {changingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{t("update_password", "Update Password")}</span>
            </button>
          </form>
        </div>
      </div>

      {/* 3. Activity Logging Preference & History Table */}
      <div className="rounded-3xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] p-6 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-[#d9a441]" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t("activity_log_controls", "Activity Log & Controls")}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("activity_log_desc", "Track your actions or turn activity logging ON/OFF for your account.")}
              </p>
            </div>
          </div>

          {/* Activity Logging ON/OFF Switch */}
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-2.5 rounded-2xl border border-[var(--border-color)]">
            <Power className={`w-4 h-4 ${loggingEnabled ? "text-green-500" : "text-gray-400"}`} />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {t("activity_log", "Activity Log:")} <span className={loggingEnabled ? "text-green-500 font-black" : "text-gray-400 font-bold"}>{loggingEnabled ? t("on", "ON") : t("off", "OFF")}</span>
            </span>
            <button
              onClick={handleToggleLogging}
              disabled={togglingLog}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                loggingEnabled
                  ? "bg-green-500 text-white shadow"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {togglingLog ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : loggingEnabled ? t("turn_off", "Turn OFF") : t("turn_on", "Turn ON")}
            </button>
          </div>
        </div>

        {/* Activity Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t("recent_account_activity", "Recent Account Activity")}</h4>
            <button
              onClick={fetchUserData}
              className="text-xs text-[#d9a441] hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t("refresh_log", "Refresh Log")}
            </button>
          </div>

          {loadingActivities ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#d9a441]" />
            </div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 border border-dashed rounded-2xl">
              {t("no_activity_logs", "No activity logs recorded yet.")}
            </div>
          ) : (
            <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-gray-900 dark:text-white">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-[var(--border-color)]">
                    <th className="text-start rtl:text-end px-4 py-3 font-semibold">{t("date_time", "Date & Time")}</th>
                    <th className="text-start rtl:text-end px-4 py-3 font-semibold">{t("category", "Category")}</th>
                    <th className="text-start rtl:text-end px-4 py-3 font-semibold">{t("description", "Description")}</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act) => (
                    <tr key={act.id} className="border-b border-[var(--border-color)] hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-[0.7rem] opacity-60">
                        {act.created_at || act.createdAt ? new Date(act.created_at || act.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-2.5 font-semibold capitalize text-[#d9a441]">{act.type}</td>
                      <td className="px-4 py-2.5 opacity-90">{act.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 4. Danger Zone / Delete Account */}
      <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          <div>
            <h3 className="font-bold text-lg text-red-600 dark:text-red-400">{t("danger_zone_delete", "Danger Zone — Delete Account")}</h3>
            <p className="text-xs text-red-700/80 dark:text-red-300/80">
              {t("danger_zone_desc", "Permanently delete or request account removal. This action will cancel your subscription and remove your profile.")}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => { if (!submittingDelete) setShowDeleteModal(false); }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-3xl border border-red-500/30 p-6 md:p-8 shadow-2xl w-full max-w-lg relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 border-b pb-3">
              <Trash2 className="w-6 h-6" />
              <h3 className="font-bold text-lg">{t("account_erasure_title", "Account & Personal Data Erasure")}</h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("target_account", "Target account:")} <b className="text-gray-900 dark:text-white">{user?.email}</b>
            </p>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDeleteMode("direct")}
                className={`py-2 px-3 rounded-lg transition-all ${
                  deleteMode === "direct"
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {t("instant_erasure", "Instant Erasure")}
              </button>
              <button
                type="button"
                onClick={() => setDeleteMode("request")}
                className={`py-2 px-3 rounded-lg transition-all ${
                  deleteMode === "request"
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {t("admin_review_request", "Admin Review Request")}
              </button>
            </div>

            {/* GDPR Notice */}
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[0.7rem] leading-relaxed text-red-800 dark:text-red-300 space-y-1">
              <strong className="block text-red-700 dark:text-red-400 font-bold uppercase tracking-wider text-[0.65rem]">
                {t("gdpr_erasure_policy", "GDPR Article 17 / Data Erasure Policy:")}
              </strong>
              <p>
                {t("erasure_warning_text", "Confirming erasure will permanently delete your user profile, personal family trees, individuals, private research notes, tasks, comments, reminders, and reset tokens.")}
              </p>
              <p className="opacity-80">
                {t("erasure_tax_notice", "Statutory billing invoices and payment references may be retained strictly for required accounting and tax auditing periods. Active sessions will be terminated immediately.")}
              </p>
            </div>

            {deleteMode === "direct" ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {t("enter_password_authorize_deletion", "Enter your current password to authorize permanent deletion:")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder={t("placeholder_password", "Your account password")}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs outline-none focus:border-red-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {t("reason_for_leaving_optional", "Reason for leaving (Optional):")}
                </label>
                <textarea
                  value={deletionReason}
                  onChange={(e) => setDeletionReason(e.target.value)}
                  rows={3}
                  placeholder={t("placeholder_reason_leaving", "Tell us why you are requesting account deletion...")}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs outline-none"
                />
              </div>
            )}

            <div className="pt-3 flex justify-end gap-3 border-t">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={submittingDelete}
                className="px-4 py-2 rounded-xl border text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={submittingDelete}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-2 shadow hover:bg-red-700 disabled:opacity-50"
              >
                {submittingDelete ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleteMode === "direct" ? t("permanently_erase_data", "Permanently Erase My Data") : t("submit_deletion_request", "Submit Deletion Request")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
