import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, Shield, Check, X, Settings2 } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

const STORAGE_KEY = "roots_cookie_consent_v1";

export interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  timestamp: string;
  version: number;
}

export default function CookieConsentBanner() {
  const { t, isRtl } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  // Preference states
  const [prefStorage, setPrefStorage] = useState(true);
  const [analyticsStorage, setAnalyticsStorage] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setIsVisible(true);
    } else {
      try {
        const parsed: CookiePreferences = JSON.parse(saved);
        setPrefStorage(parsed.preferences ?? true);
        setAnalyticsStorage(parsed.analytics ?? false);
      } catch {
        setIsVisible(true);
      }
    }

    // Allow reopening cookie preferences from footer or settings
    const handleReopen = () => {
      setShowCustomize(true);
      setIsVisible(true);
    };

    window.addEventListener("roots:open-cookie-banner", handleReopen);
    return () => window.removeEventListener("roots:open-cookie-banner", handleReopen);
  }, []);

  const saveConsent = (preferences: boolean, analytics: boolean) => {
    const payload: CookiePreferences = {
      necessary: true,
      preferences,
      analytics,
      timestamp: new Date().toISOString(),
      version: 1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("roots:cookie-consent-updated", { detail: payload }));
    setIsVisible(false);
    setShowCustomize(false);
  };

  const handleAcceptAll = () => saveConsent(true, true);
  const handleRejectOptional = () => saveConsent(false, false);
  const handleSaveCustom = () => saveConsent(prefStorage, analyticsStorage);

  if (!isVisible) return null;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      role="region"
      aria-label={t("cookie_consent_banner")}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-black/50 backdrop-blur-md animate-fade-in"
    >
      <div className="mx-auto max-w-5xl surface-card rounded-xl border border-[var(--gold)]/40 p-6 sm:p-8 shadow-2xl bg-[var(--card)]/95">
        {!showCustomize ? (
          /* Main Banner */
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6 min-w-0">
            <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="h-10 w-10 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                  {t("cookie_banner_title")}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed max-w-2xl">
                  {t("cookie_banner_desc")}{" "}
                  <Link to="/cookies" className="text-[var(--gold)] underline hover:text-[var(--foreground)] font-medium">
                    {t("learn_more")}
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto lg:max-w-[min(100%,28rem)] shrink-0 justify-stretch sm:justify-end min-w-0">
              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="btn-base btn-outline-ink text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial min-w-[8.5rem] min-h-10"
              >
                <Settings2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{t("customize_cookies")}</span>
              </button>
              <button
                type="button"
                onClick={handleRejectOptional}
                className="btn-base btn-outline-ink text-xs py-2 px-4 flex-1 sm:flex-initial min-w-[8.5rem] min-h-10"
              >
                {t("reject_optional")}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="btn-base btn-gold text-xs py-2 px-5 font-semibold flex-1 sm:flex-initial min-w-[8.5rem] min-h-10"
              >
                {t("accept_all")}
              </button>
            </div>
          </div>
        ) : (
          /* Customize Preferences Modal */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[var(--gold)]" />
                <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                  {t("cookie_preferences_title")}
                </h3>
              </div>
              <button
                onClick={() => setShowCustomize(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                aria-label={t("close_customizer")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Essential */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-[var(--background)]/60 border border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[var(--foreground)]">
                      {t("essential_cookies")}
                    </span>
                    <span className="text-[0.65rem] px-2 py-0.5 rounded bg-[var(--gold)]/20 text-[var(--gold)] font-bold uppercase tracking-wider">
                      {t("required")}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                    {t("essential_cookies_desc")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-label={t("essential_cookies")}
                  className="h-4 w-4 rounded text-[var(--gold)] border-[var(--border)] opacity-70 cursor-not-allowed"
                />
              </div>

              {/* Preferences */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-[var(--background)]/60 border border-[var(--border)]">
                <div>
                  <span className="font-semibold text-sm text-[var(--foreground)]">
                    {t("preference_storage")}
                  </span>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                    {t("preference_storage_desc")}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefStorage}
                    onChange={(e) => setPrefStorage(e.target.checked)}
                    aria-label={t("preference_storage")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--gold)]"></div>
                </label>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-[var(--background)]/60 border border-[var(--border)]">
                <div>
                  <span className="font-semibold text-sm text-[var(--foreground)]">
                    {t("analytics_cookies")}
                  </span>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                    {t("analytics_cookies_desc")}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsStorage}
                    onChange={(e) => setAnalyticsStorage(e.target.checked)}
                    aria-label={t("analytics_cookies")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--gold)]"></div>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 sm:gap-3 pt-2 min-w-0">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="btn-base btn-outline-ink text-xs py-2 px-4 flex-1 sm:flex-initial min-h-10"
              >
                {t("reject_all_optional")}
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="btn-base btn-gold text-xs py-2 px-5 font-semibold flex items-center justify-center gap-1.5 flex-1 sm:flex-initial min-h-10"
              >
                <Check className="h-3.5 w-3.5 shrink-0" />
                {t("save_preferences")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
