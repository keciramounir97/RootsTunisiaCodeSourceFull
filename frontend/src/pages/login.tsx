import { useThemeStore } from "../store/theme";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";
import SEO from "../components/SEO";
import {
  formatAuthApiError,
  readLoginCredentials,
} from "../utils/authFormCredentials";

export default function Login() {
  const { theme } = useThemeStore();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const isDark = theme === "dark";

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const { email, password } = readLoginCredentials(event.currentTarget);
    const nextErrors: { email?: string; password?: string } = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = t("valid_email_required", "Valid email is required");
    }
    if (!password) {
      nextErrors.password = t("password_required", "Password is required");
    }
    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser) {
        navigate("/admin", { replace: true });
      } else {
        setError(t("login_failed_no_user", "Login failed: No user data received"));
      }
    } catch (err: unknown) {
      setError(
        formatAuthApiError(
          err,
          t("invalid_credentials", "Invalid credentials. Please check your email and password."),
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-stretch px-4 pt-24 sm:px-6 sm:pt-28 pb-8 lg:px-8">
      <SEO
        title={t("seo_login_title", "تسجيل الدخول — جذور تونس")}
        description="Sign in to your Roots Tunisia account to continue your Tunisian family research."
        keywords={["Login Roots Tunisia", "Tunisian genealogy account"]}
      />
      <div className="frame-gold w-full max-w-[var(--content-max)] mx-auto flex flex-col lg:flex-row rounded-lg overflow-hidden shadow-2xl border border-[var(--gold)]/40 bg-[var(--paper-color)]">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-[500px] bg-[var(--card)]">
          <TunisiaGovernoratesMap variant="embed" />
          <div className="absolute inset-y-0 right-0 w-16 pointer-events-none bg-gradient-to-r from-transparent to-[var(--paper-color)] z-[450]" />
        </div>

        <div
          className={`flex-1 flex items-center justify-center p-6 sm:p-10 transition-colors duration-300 ${
            isDark ? "bg-[var(--teal-dark)]" : "bg-[var(--paper-color)]"
          }`}
        >
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h1
                className={`text-3xl font-bold mb-2 tracking-wide font-cinzel ${
                  isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"
                }`}
              >
                {t("welcome_back", "Welcome Back")}
              </h1>
              <p
                className={`text-base font-body ${
                  isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"
                }`}
              >
                {t("login_subtitle", "Sign in to your account")}
              </p>
            </div>

            <form className="space-y-5" onSubmit={onFormSubmit} noValidate>
              <div>
                <label
                  className={`text-sm font-medium mb-2 block font-body ${
                    isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"
                  }`}
                >
                  {t("email", "Email")}
                </label>
                <div
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] focus-within:shadow-lg focus-within:shadow-[var(--brand-gold)]/10 ${
                    fieldErrors.email
                      ? "border-red-500/50"
                      : isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-[var(--border-color)]"
                  }`}
                >
                  <Mail className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    placeholder={t("email_placeholder", "example@email.com")}
                    className={`bg-transparent outline-none flex-1 text-base font-body ${
                      isDark
                        ? "text-white placeholder:text-white/30"
                        : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"
                    }`}
                  />
                </div>
                {fieldErrors.email ? (
                  <p className="text-red-500 text-xs mt-1 font-medium font-body">{fieldErrors.email}</p>
                ) : null}
              </div>

              <div>
                <label
                  className={`text-sm font-medium mb-2 block font-body ${
                    isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"
                  }`}
                >
                  {t("login_password", "Password")}
                </label>
                <div
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] focus-within:shadow-lg focus-within:shadow-[var(--brand-gold)]/10 ${
                    fieldErrors.password
                      ? "border-red-500/50"
                      : isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-[var(--border-color)]"
                  }`}
                >
                  <Lock className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`bg-transparent outline-none flex-1 text-base font-body ${
                      isDark
                        ? "text-white placeholder:text-white/30"
                        : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[var(--brand-gold)]/60 hover:text-[var(--brand-gold)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p className="text-red-500 text-xs mt-1 font-medium font-body">{fieldErrors.password}</p>
                ) : null}
              </div>

              <div className="flex justify-end">
                <NavLink
                  to="/resetpassword"
                  className="text-sm text-[var(--teal-light,#24766f)] hover:text-[var(--brand-gold)] transition-colors font-medium font-body"
                >
                  {t("forgot_password", "Forgot password?")}
                </NavLink>
              </div>

              {error ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-500 text-sm text-center font-medium font-body">{error}</p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 rounded-2xl text-white font-bold text-base shadow-xl bg-gradient-to-r from-[var(--teal-dark)] via-[var(--brand-teal)] to-[var(--brand-gold)] hover:shadow-2xl hover:shadow-[var(--brand-gold)]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-body"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("please_wait", "Please wait...")}
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {t("login", "Login")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p
                className={`text-center text-sm pt-2 font-body ${
                  isDark ? "text-[var(--gold-light)]/50" : "text-[var(--brand-teal)]/50"
                }`}
              >
                {t("no_account_yet", "Don't have an account?")}{" "}
                <NavLink
                  to="/signup"
                  className="text-[var(--teal-light,#24766f)] font-bold hover:text-[var(--brand-gold)] transition-colors"
                >
                  {t("create_account", "Create account")}
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
