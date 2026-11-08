import { useThemeStore } from "../store/theme";
import { NavLink } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";
import SEO from "../components/SEO";
import { formatAuthApiError } from "../utils/authFormCredentials";

export default function ResetPassword() {
  const { theme } = useThemeStore();
  const { requestReset, verifyReset } = useAuth();
  const { t } = useTranslation();

  const [step, setStep] = useState<"request" | "verify" | "done">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isDark = theme === "dark";

  const handleRequestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const targetEmail = String(new FormData(event.currentTarget).get("email") || "")
      .trim()
      .toLowerCase();
    try {
      const res = await requestReset(targetEmail);
      setEmail(targetEmail);
      if (res?.code) {
        setCode(res.code);
      }
      setStep("verify");
    } catch (err: unknown) {
      setError(
        formatAuthApiError(
          err,
          t("reset_failed", "Password reset request failed. Please try again."),
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyReset(email, code.trim(), newPassword);
      setStep("done");
    } catch (err: unknown) {
      setError(
        formatAuthApiError(
          err,
          t("verify_failed", "Password reset verification failed. Check your code."),
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-stretch px-4 pt-24 sm:px-6 sm:pt-28 pb-8 lg:px-8">
      <SEO
        title={t("seo_reset_title", "إعادة تعيين كلمة المرور — جذور تونس")}
        description="Reset your password to regain access to your Roots Tunisia account."
      />
      <div className="frame-gold w-full max-w-[var(--content-max)] mx-auto flex flex-col lg:flex-row rounded-lg overflow-hidden shadow-2xl border border-[var(--gold)]/40 bg-[var(--paper-color)]">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-[500px] bg-[var(--card)]">
          <TunisiaGovernoratesMap />
          <div className="absolute inset-y-0 right-0 w-16 pointer-events-none bg-gradient-to-r from-transparent to-[var(--paper-color)] z-[450]" />
        </div>

        <div
          className={`flex-1 flex items-center justify-center p-6 sm:p-10 transition-colors duration-300 ${
            isDark ? "bg-[var(--teal-dark)]" : "bg-[var(--paper-color)]"
          }`}
        >
          <div className="w-full max-w-md">
            {step === "done" ? (
              <div className="text-center">
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
                  <ArrowLeft className="w-4 h-4" />
                  {t("signin_now", "Sign In Now")}
                </NavLink>
              </div>
            ) : step === "verify" ? (
              <form onSubmit={handleVerifyReset} className="space-y-5">
                <div className="mb-2 text-center lg:text-left">
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
                    <strong>{email}</strong>
                  </p>
                </div>

                {error ? (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                  </div>
                ) : null}

                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`w-full rounded-2xl border-2 px-4 py-3.5 text-center font-mono tracking-widest ${
                    isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[var(--border-color)]"
                  }`}
                  placeholder={t("six_digit_code", "6-DIGIT CODE")}
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full rounded-2xl border-2 px-4 py-3.5 ${
                    isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[var(--border-color)]"
                  }`}
                  placeholder={t("new_password", "New Password")}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[var(--teal-dark)] via-[var(--brand-teal)] to-[var(--brand-gold)] disabled:opacity-60"
                >
                  {loading ? t("verifying", "Verifying…") : t("reset_password", "Reset Password")}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="w-full text-sm text-[var(--brand-gold)]"
                >
                  {t("change_email_address", "← Change Email Address")}
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleRequestReset} noValidate>
                <div className="mb-2 text-center lg:text-left">
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
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                  </div>
                ) : null}

                <div
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 ${
                    isDark ? "bg-white/5 border-white/10" : "bg-white border-[var(--border-color)]"
                  }`}
                >
                  <Mail className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder={t("placeholder_email_example", "you@example.tn")}
                    className={`bg-transparent outline-none flex-1 ${
                      isDark ? "text-white" : "text-[var(--brand-teal)]"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[var(--teal-dark)] via-[var(--brand-teal)] to-[var(--brand-gold)] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? t("sending_code", "Sending code…") : t("send_reset_code", "Send Reset Code")}
                  <ArrowRight className="w-4 h-4" />
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
