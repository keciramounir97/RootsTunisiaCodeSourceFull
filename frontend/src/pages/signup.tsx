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
import AOS from "aos";
import { useEffect, useState } from "react";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import MaghrebTribesMap from "../components/MaghrebTribesMap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../api/validation";
import { z } from "zod";

const signupFormSchema = signupSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupFormSchema>;

export default function Signup() {
  const { theme } = useThemeStore();
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const isDark = theme === "dark";

  const onSubmit = async (data: SignupFormData) => {
    setError("");
    setLoading(true);
    try {
      await signup(data.fullName.trim(), data.phone ? data.phone.trim() : undefined, data.email.trim().toLowerCase(), data.password);
      setSuccess(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("signup_failed", "Registration failed. Please try again.");
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
          <div className="w-full max-w-md py-6" data-aos="fade-left">
            {success ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--brand-teal)] to-[var(--brand-gold)] flex items-center justify-center shadow-2xl shadow-[var(--brand-gold)]/30">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
                <h2 className={`text-2xl font-bold mb-3 font-cinzel ${isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"}`}>
                  {t("account_created", "Account Created!")}
                </h2>
                <p className={`mb-6 font-body ${isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"}`}>
                  {t("account_pending_approval", "Your account is pending admin approval. You will receive an email when it is validated.")}
                </p>
                <NavLink
                  to="/login"
                  className="inline-flex items-center gap-2 heritage-btn text-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  {t("back_to_login", "Back to Login")}
                </NavLink>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center lg:text-left">
                  <h1 className={`text-3xl font-bold mb-2 tracking-wide font-cinzel ${
                    isDark ? "text-[var(--gold-light)]" : "text-[var(--brand-teal)]"
                  }`}>
                    {t("create_account", "Create Account")}
                  </h1>
                  <p className={`text-base font-body ${isDark ? "text-[var(--gold-light)]/60" : "text-[var(--brand-teal)]/60"}`}>
                    {t("signup_subtitle", "Join the Roots Tunisia community")}
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label className={`text-sm font-medium mb-2 block font-body ${isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"}`}>
                      {t("full_name", "Full Name")}
                    </label>
                    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] focus-within:shadow-lg focus-within:shadow-[var(--brand-gold)]/10 ${
                      errors.fullName ? "border-red-500/50 animate-pulse border-2" : isDark ? "bg-white/5 border-white/10" : "bg-white border-[var(--border-color)]"
                    }`}>
                      <User className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                      <input
                        type="text"
                        {...register("fullName")}
                        placeholder={t("full_name_placeholder", "Your full name")}
                        className={`bg-transparent outline-none flex-1 text-base font-body ${isDark ? "text-white placeholder:text-white/30" : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"}`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1 font-medium font-body">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

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

                  <div>
                    <label className={`text-sm font-medium mb-2 block font-body ${isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"}`}>
                      {t("password", "Password")}
                    </label>
                    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] focus-within:shadow-lg focus-within:shadow-[var(--brand-gold)]/10 ${
                      errors.password ? "border-red-500/50 animate-pulse border-2" : isDark ? "bg-white/5 border-white/10" : "bg-white border-[var(--border-color)]"
                    }`}>
                      <Lock className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="••••••••"
                        className={`bg-transparent outline-none flex-1 text-base font-body ${isDark ? "text-white placeholder:text-white/30" : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"}`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[var(--brand-gold)]/60 hover:text-[var(--brand-gold)] transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 font-medium font-body">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`text-sm font-medium mb-2 block font-body ${isDark ? "text-[var(--gold-light)]/80" : "text-[var(--brand-teal)]/80"}`}>
                      {t("confirm_password", "Confirm Password")}
                    </label>
                    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all focus-within:border-[var(--brand-gold)] focus-within:shadow-lg focus-within:shadow-[var(--brand-gold)]/10 ${
                      errors.confirmPassword ? "border-red-500/50 animate-pulse border-2" : isDark ? "bg-white/5 border-white/10" : "bg-white border-[var(--border-color)]"
                    }`}>
                      <Lock className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="••••••••"
                        className={`bg-transparent outline-none flex-1 text-base font-body ${isDark ? "text-white placeholder:text-white/30" : "text-[var(--brand-teal)] placeholder:text-[var(--brand-teal)]/30"}`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[var(--brand-gold)]/60 hover:text-[var(--brand-gold)] transition-colors">
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 font-medium font-body">
                        {errors.confirmPassword.message}
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
                        <UserPlus className="w-5 h-5" />
                        {t("create_account", "Create Account")}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className={`text-center text-sm pt-2 font-body ${isDark ? "text-[var(--gold-light)]/50" : "text-[var(--brand-teal)]/50"}`}>
                    {t("already_have_account", "Already have an account?")}{" "}
                    <NavLink to="/login" className="text-[var(--teal-light)] font-bold hover:text-[var(--brand-gold)] transition-colors">
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