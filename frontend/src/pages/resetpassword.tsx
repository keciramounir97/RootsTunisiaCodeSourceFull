import { useThemeStore } from "../store/theme";
import { NavLink } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";
import SEO from "../components/SEO";
import {
  formatAuthApiError,
  translateAuthErrorMessage,
} from "../utils/authFormCredentials";

export default function ResetPassword() {
  const { theme } = useThemeStore();
  const { requestReset, verifyReset } = useAuth();
  const { t, isRtl } = useTranslation();

  const [step, setStep] = useState<"request" | "verify" | "done">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isDark = theme === "dark";

  const handleRequestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    const targetEmail = String(new FormData(event.currentTarget).get("email") || "")
      .trim()
      .toLowerCase();

    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      setFieldErrors({
        email: t("valid_email_required", "Valid email is required"),
      });
      return;
    }

    setLoading(true);
    try {
      const res = await requestReset(targetEmail);
      setEmail(targetEmail);
      if (res?.code) {
        setCode(res.code);
      }
      setStep("verify");
    } catch (err: unknown) {
      const fallbackMsg = t(
        "reset_failed",
        "Password reset request failed. Please try again.",
      );
      const rawMsg = formatAuthApiError(err, fallbackMsg);
      setError(translateAuthErrorMessage(rawMsg, t, fallbackMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const nextErrors: Record<string, string> = {};
    if (!code.trim()) {
      nextErrors.code = t("reset_code_required", "Verification code is required");
    }
    if (newPassword.length < 6) {
      nextErrors.newPassword = t(
        "password_min_6",
        "Password must be at least 6 characters",
      );
    }
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      await verifyReset(email, code.trim(), newPassword);
      setStep("done");
    } catch (err: unknown) {
      const fallbackMsg = t(
        "verify_failed",
        "Password reset verification failed. Check your code.",
      );
      const rawMsg = formatAuthApiError(err, fallbackMsg);
      setError(translateAuthErrorMessage(rawMsg, t, fallbackMsg));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordLabel = showPassword
    ? t("hide_password", "Hide password")
    : t("show_password", "Show password");

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-stretch px-4 pt-24 sm:px-6 sm:pt-28 pb-8 lg:px-8"
    >
      <SEO
        title={t("seo_reset_title", "Reset Password — Roots Tunisia")}
        description={t(
          "seo_reset_description",
          "Reset your password to regain access to your Roots Tunisia account and family archives.",
        )}
        keywords={t(
          "seo_reset_keywords",
          "Reset password Roots Tunisia, recover Tunisian genealogy account",
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
          <div className="w-full max-w-md">
            {step === "done" ? (
              <div key="done-view" className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--brand-teal)] to-[var(--brand-gold)] flex items-center justify-center shadow-2xl">
                  <KeyRound className="w-10 h-10 text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold mb-3 font-cinzel ${
                    isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"
                  }`}
                >
                  {t("password_reset_complete", "Password Reset Complete")}
                </h2>
                <p
                  className={`mb-6 font-body ${
                    isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"
                  }`}
                >
                  {t(
                    "password_reset_success_desc",
                    "Your password has been updated successfully. You can now log in with your new password.",
                  )}
                </p>
                <NavLink
                  to="/login"
                  className="inline-flex items-center gap-2 text-[var(--brand-gold)] font-bold"
                >
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  {t("signin_now", "Sign In Now")}
                </NavLink>
              </div>
            ) : step === "verify" ? (
              <form key="verify-form" onSubmit={handleVerifyReset} className="space-y-5" noValidate>
                <div className="mb-2 text-center lg:text-start">
                  <h1
                    className={`text-3xl font-bold mb-2 font-cinzel ${
                      isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"
                    }`}
                  >
                    {t("enter_reset_code", "Enter Reset Code")}
                  </h1>
                  <p
                    className={`text-sm font-body ${
                      isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"
                    }`}
                  >
                    {t("reset_code_sent_to", "We sent a verification code to")}{" "}
                    <strong dir="ltr">{email}</strong>
                  </p>
                </div>

                {error ? (
                  <div role="alert" className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                  </div>
                ) : null}

                <div>
                  <label
                    htmlFor="reset-code"
                    className={`text-sm font-medium mb-2 block font-body ${
                      isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"
                    }`}
                  >
                    {t("verification_code", "Verification Code")}
                  </label>
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] ${
                      fieldErrors.code
                        ? "border-red-500/50"
                        : isDark
                          ? "bg-white/5 border-white/10"
                          : "bg-white border-[var(--border-color)]"
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                    <input
                      id="reset-code"
                      type="text"
                      name="code"
                      dir="ltr"
                      aria-invalid={Boolean(fieldErrors.code)}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={`bg-transparent outline-none flex-1 text-center font-mono tracking-widest ${
                        isDark ? "text-white placeholder:text-white/30" : "text-[var(--brand-teal)]"
                      }`}
                      placeholder={t("six_digit_code", "6-DIGIT CODE")}
                    />
                  </div>
                  {fieldErrors.code ? (
                    <p role="alert" className="text-red-500 text-xs mt-1 font-medium font-body">
                      {fieldErrors.code}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="reset-new-password"
                    className={`text-sm font-medium mb-2 block font-body ${
                      isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"
                    }`}
                  >
                    {t("new_password", "New Password")}
                  </label>
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] ${
                      fieldErrors.newPassword
                        ? "border-red-500/50"
                        : isDark
                          ? "bg-white/5 border-white/10"
                          : "bg-white border-[var(--border-color)]"
                    }`}
                  >
                    <Lock className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                    <input
                      id="reset-new-password"
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      dir="ltr"
                      autoComplete="new-password"
                      aria-invalid={Boolean(fieldErrors.newPassword)}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`bg-transparent outline-none flex-1 ${
                        isDark ? "text-white placeholder:text-white/30" : "text-[var(--brand-teal)]"
                      }`}
                      placeholder={t("new_password", "New Password")}
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
                  {fieldErrors.newPassword ? (
                    <p role="alert" className="text-red-500 text-xs mt-1 font-medium font-body">
                      {fieldErrors.newPassword}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[var(--teal-dark)] via-[var(--brand-teal)] to-[var(--brand-gold)] disabled:opacity-60 cursor-pointer"
                >
                  {loading ? t("verifying", "Verifying…") : t("reset_password", "Reset Password")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setFieldErrors({});
                    setStep("request");
                  }}
                  className="w-full text-sm text-[var(--brand-gold)] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{t("change_email_address", "Change Email Address")}</span>
                </button>
              </form>
            ) : (
              <form key="request-form" className="space-y-5" onSubmit={handleRequestReset} noValidate>
                <div className="mb-2 text-center lg:text-start">
                  <h1
                    className={`text-3xl font-bold mb-2 font-cinzel ${
                      isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"
                    }`}
                  >
                    {t("reset_password", "Reset Password")}
                  </h1>
                  <p
                    className={`text-sm font-body ${
                      isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"
                    }`}
                  >
                    {t(
                      "reset_password_instruction",
                      "Enter your account email to receive a password reset verification code.",
                    )}
                  </p>
                </div>

                {error ? (
                  <div role="alert" className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                  </div>
                ) : null}

                <div>
                  <label
                    htmlFor="reset-email"
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
                      id="reset-email"
                      type="email"
                      name="email"
                      dir="ltr"
                      autoComplete="email"
                      aria-invalid={Boolean(fieldErrors.email)}
                      placeholder={t("placeholder_email_example", "you@example.tn")}
                      className={`bg-transparent outline-none flex-1 ${
                        isDark ? "text-white placeholder:text-white/30" : "text-[var(--brand-teal)]"
                      }`}
                    />
                  </div>
                  {fieldErrors.email ? (
                    <p role="alert" className="text-red-500 text-xs mt-1 font-medium font-body">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[var(--teal-dark)] via-[var(--brand-teal)] to-[var(--brand-gold)] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? t("sending_code", "Sending code…") : t("send_reset_code", "Send Reset Code")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </button>

                <p
                  className={`text-center text-sm ${
                    isDark ? "text-[var(--gold-light)]/50" : "text-[var(--brand-teal)]/50"
                  }`}
                >
                  {t("remember_password", "Remember your password?")}{" "}
                  <NavLink to="/login" className="font-bold text-[var(--brand-gold)]">
                    {t("login", "Sign in")}
                  </NavLink>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
