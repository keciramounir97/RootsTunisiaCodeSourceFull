import { useThemeStore } from "../store/theme";
import { NavLink } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import AOS from "aos";
import { useEffect, useState } from "react";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import MaghrebTribesMap from "../components/MaghrebTribesMap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../api/validation";
import { z } from "zod";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const { theme } = useThemeStore();
  const { requestReset } = useAuth();
  const { t } = useTranslation();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const isDark = theme === "dark";

  const handleReset = async (data: ResetPasswordFormData) => {
    setError("");
    setLoading(true);
    try {
      await requestReset(data.email.trim().toLowerCase());
      setSuccess(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("reset_failed", "Password reset failed. Please try again.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch pt-24 sm:pt-28 pb-8">
      <div className="w-full max-w-[var(--content-max)] mx-auto flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-color)] bg-[var(--paper-color)]">
        {/* Left side — map */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-[500px]">
          <MaghrebTribesMap />
          <div className="absolute inset-y-0 right-0 w-16 pointer-events-none bg-gradient-to-r from-transparent to-[var(--paper-color)]" />
        </div>

        {/* Right side — form */}
        <div className={`flex-1 flex items-center justify-center p-6 sm:p-10 transition-colors duration-300 ${
          isDark ? "bg-[var(--teal-dark)]" : "bg-[var(--paper-color)]"
        }`}>
          <div className="w-full max-w-md" data-aos="fade-left">
            {success ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--brand-teal)] to-[var(--brand-gold)] flex items-center justify-center shadow-2xl shadow-[var(--brand-gold)]/30">
                  <KeyRound className="w-10 h-10 text-white" />
                </div>
                <h2 className={`text-2xl font-bold mb-3 font-cinzel ${isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"}`}>
                  {t("check_your_email", "Check Your Email")}
                </h2>
                <p className={`mb-6 font-body ${isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"}`}>
                  {t("reset_link_sent", "A password reset link has been sent to your inbox.")}
                </p>
                <NavLink
                  to="/login"
                  className="inline-flex items-center gap-2 heritage-btn text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("back_to_login", "Back to Login")}
                </NavLink>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center lg:text-left">
                  <h1 className={`text-3xl font-bold mb-2 tracking-wide font-cinzel ${
                    isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"
                  }`}>
                    {t("reset_password", "Reset Password")}
                  </h1>
                  <p className={`text-base font-body ${isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"}`}>
                    {t("reset_subtitle", "Enter your email to receive a reset link")}
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(handleReset)}>
                  <div>
                    <label className={`text-sm font-medium mb-2 block font-body ${isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"}`}>
                      {t("email", "Email")}
                    </label>
                    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] focus-within:shadow-lg focus-within:shadow-[var(--brand-gold)]/10 ${
                      errors.email ? "border-red-500/50 animate-pulse border-2" : isDark ? "bg-white/5 border-white/10" : "bg-white border-[var(--border-color)]"
                    }`}>
                      <Mail className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                      <input
                        type="email"
                        {...register("email")}
                        placeholder={t("email_placeholder", "example@email.com")}
                        className={`bg-transparent outline-none flex-1 text-base font-body ${isDark ? "text-white placeholder:text-white/30" : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-medium font-body">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                      <p className="text-red-500 text-sm text-center font-medium font-body">{error}</p>
                    </div>
                  )}

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
                        <KeyRound className="w-5 h-5" />
                        {t("send_reset_link", "Send Reset Link")}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <NavLink
                      to="/login"
                      className={`inline-flex items-center gap-1 text-sm font-body transition-colors ${isDark ? "text-[var(--gold-light)]/50 hover:text-[var(--brand-gold)]" : "text-[var(--brand-teal)]/50 hover:text-[var(--teal-light)]"}`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t("back_to_login", "Back to Login")}
                    </NavLink>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}