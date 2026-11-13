import { useThemeStore } from "../store/theme";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";
import SEO from "../components/SEO";
import {
  formatAuthApiError,
  translateAuthErrorMessage,
} from "../utils/authFormCredentials";

export default function SignUp() {
  const { theme } = useThemeStore();
  const { register: registerAuth, user } = useAuth();
  const navigate = useNavigate();
  const { t, isRtl } = useTranslation();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const isDark = theme === "dark";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("fullName") || "").trim();
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");

    const nextErrors: Record<string, string> = {};
    if (!fullName) nextErrors.fullName = t("name_required", "Full name is required");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = t("valid_email_required", "Valid email is required");
    }
    if (password.length < 6) {
      nextErrors.password = t("password_min_6", "Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = t("passwords_do_not_match", "Passwords do not match");
    }
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      await registerAuth(fullName, undefined, email, password);
      setSuccess(true);
    } catch (err: unknown) {
      const fallbackMsg = t("registration_failed", "Registration failed. Please try again.");
      const rawMsg = formatAuthApiError(err, fallbackMsg);
      setError(translateAuthErrorMessage(rawMsg, t, fallbackMsg));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordLabel = showPassword
    ? t("hide_password", "Hide password")
    : t("show_password", "Show password");
  const toggleConfirmLabel = showConfirm
    ? t("hide_confirm_password", "Hide confirm password")
    : t("show_confirm_password", "Show confirm password");

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-stretch px-4 pt-24 sm:px-6 sm:pt-28 pb-8 lg:px-8"
    >
      <SEO
        title={t("seo_signup_title", "Create Account — Roots Tunisia")}
        description={t(
          "seo_signup_description",
          "Create a Roots Tunisia account to explore Tunisian family trees and historical archives.",
        )}
        keywords={t(
          "seo_signup_keywords",
          "Signup Roots Tunisia, create Tunisian genealogy account, Roots Tunisia registration",
        )}
      />
      <div className="frame-gold w-full max-w-[var(--content-max)] mx-auto flex flex-col lg:flex-row rounded-lg overflow-hidden shadow-2xl border border-[var(--gold)]/40 bg-[var(--paper-color)]">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-[500px] bg-[var(--card)]">
          <TunisiaGovernoratesMap variant="embed" />
          <div className="absolute inset-y-0 end-0 w-16 pointer-events-none ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-transparent to-[var(--paper-color)] z-[450]" />
        </div>

        <div
          className={`flex-1 flex items-center justify-center p-6 sm:p-10 transition-colors duration-300 ${
            isDark ? "bg-[var(--teal-dark)]" : "bg-[var(--paper-color)]"
          }`}
        >
          <div className="w-full max-w-md py-6">
            {success ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--brand-teal)] to-[var(--brand-gold)] flex items-center justify-center shadow-2xl shadow-[var(--brand-gold)]/30">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold mb-3 font-cinzel ${
                    isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"
                  }`}
                >
                  {t("account_created", "Account Created!")}
                </h2>
                <p
                  className={`mb-6 font-body ${
                    isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"
                  }`}
                >
                  {t(
                    "account_ready_login",
                    "Your account is ready. You can sign in and start exploring Tunisian trees and archives.",
                  )}
                </p>
                <NavLink to="/login" className="inline-flex items-center gap-2 heritage-btn text-sm">
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  {t("back_to_login", "Back to Login")}
                </NavLink>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center lg:text-start">
                  <h1
                    className={`text-3xl font-bold mb-2 tracking-wide font-cinzel ${
                      isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"
                    }`}
                  >
                    {t("create_account", "Create Account")}
                  </h1>
                  <p
                    className={`text-base font-body ${
                      isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"
                    }`}
                  >
                    {t("signup_subtitle", "Join the Roots Tunisia community")}
                  </p>
                </div>

                <form className="space-y-4" onSubmit={onSubmit} noValidate>
                  <div>
                    <label
                      htmlFor="signup-fullName"
                      className={`text-sm font-medium mb-2 block font-body ${
                        isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"
                      }`}
                    >
                      {t("full_name", "Full Name")}
                    </label>
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] ${
                        fieldErrors.fullName
                          ? "border-red-500/50"
                          : isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-[var(--border-color)]"
                      }`}
                    >
                      <User className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                      <input
                        id="signup-fullName"
                        type="text"
                        name="fullName"
                        autoComplete="name"
                        aria-invalid={Boolean(fieldErrors.fullName)}
                        placeholder={t("full_name_placeholder", "Your full name")}
                        className={`bg-transparent outline-none flex-1 text-base text-start font-body ${
                          isDark
                            ? "text-white placeholder:text-white/30"
                            : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"
                        }`}
                      />
                    </div>
                    {fieldErrors.fullName ? (
                      <p role="alert" className="text-red-500 text-xs mt-1 font-medium font-body">
                        {fieldErrors.fullName}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="signup-email"
                      className={`text-sm font-medium mb-2 block font-body ${
                        isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"
                      }`}
                    >
                      {t("email", "Email")}
                    </label>
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] ${
                        fieldErrors.email
                          ? "border-red-500/50"
                          : isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-[var(--border-color)]"
                      }`}
                    >
                      <Mail className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                      <input
                        id="signup-email"
                        type="email"
                        name="email"
                        dir="ltr"
                        autoComplete="email"
                        aria-invalid={Boolean(fieldErrors.email)}
                        placeholder={t("email_placeholder", "example@email.com")}
                        className={`bg-transparent outline-none flex-1 text-base font-body ${
                          isDark
                            ? "text-white placeholder:text-white/30"
                            : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"
                        }`}
                      />
                    </div>
                    {fieldErrors.email ? (
                      <p role="alert" className="text-red-500 text-xs mt-1 font-medium font-body">
                        {fieldErrors.email}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="signup-password"
                      className={`text-sm font-medium mb-2 block font-body ${
                        isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"
                      }`}
                    >
                      {t("password", "Password")}
                    </label>
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] ${
                        fieldErrors.password
                          ? "border-red-500/50"
                          : isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-[var(--border-color)]"
                      }`}
                    >
                      <Lock className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        dir="ltr"
                        autoComplete="new-password"
                        aria-invalid={Boolean(fieldErrors.password)}
                        placeholder="••••••••"
                        className={`bg-transparent outline-none flex-1 text-base font-body ${
                          isDark
                            ? "text-white placeholder:text-white/30"
                            : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"
                        }`}
                      />
                      <button
                        type="button"
                        aria-label={togglePasswordLabel}
                        title={togglePasswordLabel}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-[var(--brand-gold)]/60 hover:text-[var(--brand-gold)] transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {fieldErrors.password ? (
                      <p role="alert" className="text-red-500 text-xs mt-1 font-medium font-body">
                        {fieldErrors.password}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="signup-confirmPassword"
                      className={`text-sm font-medium mb-2 block font-body ${
                        isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"
                      }`}
                    >
                      {t("confirm_password", "Confirm Password")}
                    </label>
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] ${
                        fieldErrors.confirmPassword
                          ? "border-red-500/50"
                          : isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-[var(--border-color)]"
                      }`}
                    >
                      <Lock className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                      <input
                        id="signup-confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        dir="ltr"
                        autoComplete="new-password"
                        aria-invalid={Boolean(fieldErrors.confirmPassword)}
                        placeholder="••••••••"
                        className={`bg-transparent outline-none flex-1 text-base font-body ${
                          isDark
                            ? "text-white placeholder:text-white/30"
                            : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"
                        }`}
                      />
                      <button
                        type="button"
                        aria-label={toggleConfirmLabel}
                        title={toggleConfirmLabel}
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="text-[var(--brand-gold)]/60 hover:text-[var(--brand-gold)] transition-colors cursor-pointer"
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword ? (
                      <p role="alert" className="text-red-500 text-xs mt-1 font-medium font-body">
                        {fieldErrors.confirmPassword}
                      </p>
                    ) : null}
                  </div>

                  {error ? (
                    <div role="alert" className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                      <p className="text-red-500 text-sm text-center font-medium font-body">{error}</p>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full py-4 rounded-2xl text-white font-bold text-base shadow-xl bg-gradient-to-r from-[var(--teal-dark)] via-[var(--brand-teal)] to-[var(--brand-gold)] hover:shadow-2xl hover:shadow-[var(--brand-gold)]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-body cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("please_wait", "Please wait...")}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        {t("create_account", "Create Account")}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                      </>
                    )}
                  </button>

                  <p
                    className={`text-center text-sm pt-2 font-body ${
                      isDark ? "text-[var(--gold-light)]/50" : "text-[var(--brand-teal)]/50"
                    }`}
                  >
                    {t("already_have_account", "Already have an account?")}{" "}
                    <NavLink
                      to="/login"
                      className="text-[var(--teal-light,#24766f)] font-bold hover:text-[var(--brand-gold)] transition-colors"
                    >
                      {t("sign_in", "Sign in")}
                    </NavLink>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
