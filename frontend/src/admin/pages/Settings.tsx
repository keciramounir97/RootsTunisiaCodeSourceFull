import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Save,
  Coins,
  Shield,
  Globe,
  Bell,
  Database,
  UserCircle2,
  Moon,
  Sun,
  Share2,
} from "lucide-react";
import { useThemeStore } from "../../store/theme";
import { api } from "../../api/client";
import { useAuth } from "../components/AuthContext";
import { useTranslation } from "../../context/TranslationContext";
import { useCurrency } from "../../context/CurrencyContext";

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
  { value: "mt", label: "Malti" },
];

function apiErrorMessage(err: any, fallback: string): string {
  const raw = err?.response?.data?.message ?? err?.userMessage;
  if (Array.isArray(raw)) return raw.filter(Boolean).join(", ") || fallback;
  if (typeof raw === "string" && raw.trim()) return raw;
  return fallback;
}

export default function Settings() {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const { user, refreshMe } = useAuth();
  const { t } = useTranslation();
  const { selectedCurrency, setCurrencyCode, currencies } = useCurrency();
  const isDark = theme === "dark";
  const isAdmin = user?.role === 1 || user?.role === 3;

  const pageBg = isDark ? "bg-[#3e2723]" : "bg-[#f5f1e8]";
  const text = isDark ? "text-[#f8f5ef]" : "text-[#3e2723]";
  const card = isDark ? "bg-[#3e2723]" : "bg-white";
  const border = isDark ? "border-[#2c1810]" : "border-[#e8dfca]";
  const inputBg = isDark ? "bg-[#3e2723]" : "bg-white";
  const inputText = isDark ? "text-[#f8f5ef]" : "text-[#3e2723]";

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [settings, setSettings] = useState({
    allowRegistration: true,
    activityRetentionDays: 90,
    notifyAdmins: true,
    defaultLanguage: "fr",
    mockupDataActive: false,
  });

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const localMock = localStorage.getItem("mockupDataActive") === "true";

        if (!isAdmin) {
          setSettings((s) => ({ ...s, mockupDataActive: localMock }));
          return;
        }

        const { data } = await api.get("/admin/settings");
        if (!mounted) return;

        const dl = String(data?.defaultLanguage || "fr");
        const safeDefaultLanguage = LANGUAGES.some((l) => l.value === dl)
          ? dl
          : "fr";

        setSettings({
          allowRegistration: !!data?.allowRegistration,
          activityRetentionDays: Number(data?.activityRetentionDays) || 90,
          notifyAdmins: !!data?.notifyAdmins,
          defaultLanguage: safeDefaultLanguage,
          mockupDataActive: localMock,
        });
      } catch (err: any) {
        if (!mounted) return;
        setError(
          apiErrorMessage(
            err,
            t("load_settings_failed", "Failed to load settings"),
          ),
        );
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAdmin, t]);

  useEffect(() => {
    localStorage.setItem("mockupDataActive", String(settings.mockupDataActive));
  }, [settings.mockupDataActive]);

  useEffect(() => {
    setProfile({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    });
  }, [user?.fullName, user?.phone]);

  const updateSetting = (key: string, value: any) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const saveSettings = async () => {
    setSavingSettings(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/admin/settings", {
        allowRegistration: !!settings.allowRegistration,
        defaultLanguage: String(settings.defaultLanguage || "en"),
        notifyAdmins: !!settings.notifyAdmins,
        activityRetentionDays: Number(settings.activityRetentionDays) || 90,
      });
      setSuccess(t("settings_saved", "Settings saved."));
    } catch (err: any) {
      setError(
        apiErrorMessage(err, t("save_settings_failed", "Save settings failed")),
      );
    } finally {
      setSavingSettings(false);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setError("");
    setSuccess("");
    try {
      await api.patch("/auth/me", {
        fullName: profile.fullName.trim(),
        phone: profile.phone.trim(),
      });
      await refreshMe?.();
      setSuccess(t("profile_updated", "Profile updated."));
    } catch (err: any) {
      setError(
        apiErrorMessage(
          err,
          t("update_profile_failed", "Update profile failed"),
        ),
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleThemeToggle = () => {
    try {
      toggleTheme();
      setSuccess(
        theme === "dark"
          ? t("light_mode_active", "Light Mode Active")
          : t("dark_mode_active", "Dark Mode Active"),
      );
      setError("");
    } catch {
      setError(t("theme_toggle_failed", "Could not switch theme."));
    }
  };

  return (
    <div className={`p-4 min-h-screen ${pageBg} ${text}`}>
      <div
        className={`rounded-lg p-5 mb-6 border ${border}
        bg-gradient-to-r from-[#556b2f]/12 to-[#5d4037]/10 heritage-panel heritage-panel--accent`}
      >
        <h3 className="text-2xl font-bold">{t("settings", "Settings")}</h3>
        <p className="opacity-70">
          {t(
            "settings_desc",
            "Control security, notifications, and platform preferences.",
          )}
        </p>
      </div>

      {loading ? (
        <div className="py-10 text-center opacity-70">
          {t("loading", "Loading...")}
        </div>
      ) : null}

      {!loading && (error || success) ? (
        <div
          className={`mb-4 rounded-lg border ${border} ${card} p-4 heritage-panel`}
        >
          {error ? (
            <div className="text-[#a0552a] font-semibold" role="alert">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="text-[#5d4037] font-semibold" role="status">
              {success}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-4">
        {isAdmin ? (
          <div
            className={`rounded-lg shadow-sm p-5 border ${border} ${card} heritage-panel`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${isDark ? "bg-white/10" : "bg-[#3e2723]/10"}`}
              >
                <Shield className="w-5 h-5 text-[#3e2723]" />
              </div>
              <div>
                <div className="font-bold text-lg">{t("security", "Security")}</div>
                <div className="text-sm opacity-70">{t("manage_signup_rules", "Manage sign-up rules")}</div>
              </div>
            </div>

            <label className="flex items-center justify-between gap-3">
              <span className="font-medium">
                {t("allow_registration", "Allow Registration")}
              </span>
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) =>
                  updateSetting("allowRegistration", e.target.checked)
                }
                className="w-5 h-5"
                disabled={loading || savingSettings}
              />
            </label>
          </div>
        ) : null}

        {isAdmin ? (
          <div
            className={`rounded-lg shadow-sm p-5 border ${border} ${card} heritage-panel`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${isDark ? "bg-[#d4af37]/20" : "bg-[#d4af37]/15"}`}
              >
                <Globe className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <div className="font-bold text-lg">{t("localization", "Localization")}</div>
                <div className="text-sm opacity-70">{t("default_language", "Default language")}</div>
              </div>
            </div>

            <label className="block">
              <span className="font-medium">
                {t("default_language", "Default Language")}
              </span>
              <select
                value={settings.defaultLanguage}
                onChange={(e) =>
                  updateSetting("defaultLanguage", e.target.value)
                }
                className={`mt-2 w-full px-3 py-2 rounded-md border
              ${inputBg} ${inputText} ${border}`}
                disabled={loading || savingSettings}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {isAdmin ? (
          <div
            className={`rounded-lg shadow-sm p-5 border ${border} ${card} heritage-panel`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${isDark ? "bg-[#5d4037]/25" : "bg-[#5d4037]/15"}`}
              >
                <Bell className="w-5 h-5 text-[#5d4037]" />
              </div>
              <div>
                <div className="font-bold text-lg">{t("notifications", "Notifications")}</div>
                <div className="text-sm opacity-70">{t("admin_alerts", "Admin alerts")}</div>
              </div>
            </div>

            <label className="flex items-center justify-between gap-3">
              <span className="font-medium">
                {t("notify_admins", "Notify admins on critical actions")}
              </span>
              <input
                type="checkbox"
                checked={settings.notifyAdmins}
                onChange={(e) =>
                  updateSetting("notifyAdmins", e.target.checked)
                }
                className="w-5 h-5"
                disabled={loading || savingSettings}
              />
            </label>
          </div>
        ) : null}

        {isAdmin ? (
          <div
            className={`rounded-lg shadow-sm p-5 border ${border} ${card} heritage-panel`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${isDark ? "bg-[#556b2f]/25" : "bg-[#556b2f]/15"}`}
              >
                <Database className="w-5 h-5 text-[#556b2f]" />
              </div>
              <div>
                <div className="font-bold text-lg">{t("logs_retention", "Logs & Retention")}</div>
                <div className="text-sm opacity-70">
                  {t("how_long_activity_stored", "How long activity stays stored")}
                </div>
              </div>
            </div>

            <label className="block">
              <span className="font-medium">
                {t("activity_retention_days", "Activity retention (days)")}
              </span>
              <input
                type="number"
                min={7}
                max={365}
                value={settings.activityRetentionDays}
                onChange={(e) =>
                  updateSetting(
                    "activityRetentionDays",
                    Number(e.target.value || 0),
                  )
                }
                className={`mt-2 w-full px-3 py-2 rounded-md border
              ${inputBg} ${inputText} ${border}`}
                disabled={loading || savingSettings}
              />
            </label>
          </div>
        ) : null}

        <div
          className={`rounded-lg shadow-sm p-5 border ${border} ${card} heritage-panel`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${isDark ? "bg-[#d4af37]/20" : "bg-[#d4af37]/15"}`}
            >
              {isDark ? (
                <Moon className="w-5 h-5 text-[#d4af37]" />
              ) : (
                <Sun className="w-5 h-5 text-[#d4af37]" />
              )}
            </div>
            <div>
              <div className="font-bold text-lg">
                {t("language_and_appearance", "Language & Appearance")}
              </div>
              <div className="text-sm opacity-70">
                {t("toggle_theme_desc", "Toggle website color theme display")}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">{t("theme_mode", "Theme Mode:")}</div>
              <div className="text-sm opacity-70">
                {isDark
                  ? t("dark_mode_active", "Dark Mode Active")
                  : t("light_mode_active", "Light Mode Active")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`px-3 py-2 rounded-md border text-sm font-semibold ${border} ${
                  !isDark ? "bg-[#d4af37]/25" : ""
                }`}
                onClick={() => {
                  setTheme("light");
                  setSuccess(t("light_mode_active", "Light Mode Active"));
                  setError("");
                }}
                aria-pressed={!isDark}
              >
                {t("theme_light_mode", "Light Mode")}
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-md border text-sm font-semibold ${border} ${
                  isDark ? "bg-[#d4af37]/25" : ""
                }`}
                onClick={() => {
                  setTheme("dark");
                  setSuccess(t("dark_mode_active", "Dark Mode Active"));
                  setError("");
                }}
                aria-pressed={isDark}
              >
                {t("theme_dark_mode", "Dark Mode")}
              </button>
              <button
                type="button"
                className="heritage-btn heritage-btn--ghost inline-flex items-center gap-2 px-3 py-2 rounded-md"
                onClick={handleThemeToggle}
                aria-label={t("theme_toggle_aria", "Toggle theme")}
              >
                {t("switch_theme", "Switch Theme")}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg shadow-sm p-5 border ${border} ${card} heritage-panel`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${isDark ? "bg-white/10" : "bg-[#3e2723]/10"}`}
            >
              <Coins className="w-5 h-5 text-[#5d4037]" />
            </div>
            <div>
              <div className="font-bold text-lg">
                {t("platform_currency", "Display Currency")}
              </div>
              <div className="text-sm opacity-70">
                {t(
                  "currency_desc",
                  "Choose the default currency for your account, dashboard, and pricing",
                )}
              </div>
            </div>
          </div>

          <label className="block">
            <span className="font-medium">
              {t("current_currency", "Currently selected currency:")}
            </span>
            <select
              value={selectedCurrency?.code || ""}
              onChange={(e) => {
                try {
                  setCurrencyCode(e.target.value);
                  setSuccess(t("currency_updated", "Currency updated."));
                  setError("");
                } catch {
                  setError(
                    t("currency_update_failed", "Could not update currency."),
                  );
                }
              }}
              className={`mt-2 w-full px-3 py-2 rounded-md border
              ${inputBg} ${inputText} ${border}`}
            >
              {(currencies || []).map((c: any) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                  {c.name ? ` — ${c.name}` : ""}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          className={`rounded-lg shadow-sm p-5 border ${border} ${card} heritage-panel`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${isDark ? "bg-white/10" : "bg-[#3e2723]/10"}`}
            >
              <UserCircle2 className="w-5 h-5 text-[#5d4037]" />
            </div>
            <div>
              <div className="font-bold text-lg">{t("my_profile", "My Profile")}</div>
              <div className="text-sm opacity-70">
                {t("update_own_account_info", "Update your own account info")}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="font-medium">{t("email", "Email")}</span>
              <input
                value={user?.email || ""}
                disabled
                className={`mt-2 w-full px-3 py-2 rounded-md border opacity-80
                ${inputBg} ${inputText} ${border}`}
              />
            </label>

            <label className="block">
              <span className="font-medium">{t("full_name", "Full Name")}</span>
              <input
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, fullName: e.target.value }))
                }
                className={`mt-2 w-full px-3 py-2 rounded-md border
                ${inputBg} ${inputText} ${border}`}
                disabled={loading || savingProfile}
              />
            </label>

            <label className="block">
              <span className="font-medium">{t("phone", "Phone")}</span>
              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value }))
                }
                className={`mt-2 w-full px-3 py-2 rounded-md border
                ${inputBg} ${inputText} ${border}`}
                disabled={loading || savingProfile}
              />
            </label>

            <div className="flex justify-end">
              <button
                className="heritage-btn heritage-btn--ghost inline-flex items-center gap-2 px-4 py-2 rounded-md"
                type="button"
                disabled={loading || savingProfile}
                onClick={saveProfile}
              >
                <Save className="w-4 h-4" />
                {savingProfile
                  ? t("saving", "Saving...")
                  : t("save_profile", "Save Profile")}
              </button>
            </div>
          </div>
        </div>

        {/* Social Networks & Contact Channels (FB, Instagram, WhatsApp) */}
        <div className={`p-6 rounded-lg border shadow-sm ${card} ${border} md:col-span-2`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-[#d9a441]" />
              <h2 className="font-display font-semibold text-lg">
                Canaux Sociaux & Contact (Facebook, Instagram & WhatsApp)
              </h2>
            </div>
            <Link
              to="/admin/footer-settings"
              className="heritage-btn heritage-btn--ghost inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border border-[#d9a441]/40 text-[#d9a441] hover:bg-[#d9a441]/15 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Ouvrir l&apos;Éditeur de Canaux</span>
            </Link>
          </div>
          <p className="text-sm opacity-75 leading-relaxed">
            Configurez et modifiez directement les liens de votre page Facebook, compte Instagram, numéro WhatsApp et coordonnées directes. Ces paramètres mettent à jour automatiquement le Pied de page (Footer) et la Page Contact (/contact).
          </p>
        </div>
      </div>

      {isAdmin ? (
        <div className="mt-6 flex justify-end">
          <button
            className="heritage-btn inline-flex items-center gap-2 px-5 py-3 rounded-md shadow disabled:opacity-60"
            type="button"
            disabled={loading || savingSettings}
            onClick={saveSettings}
          >
            <Save className="w-5 h-5" />
            {savingSettings
              ? t("saving", "Saving...")
              : t("save_settings", "Save Settings")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
