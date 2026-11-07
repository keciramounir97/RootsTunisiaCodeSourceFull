import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import kairouan from "../assets/slider-kairouan.jpg";
import { Logo } from "../components/site/Logo";
import SEO from "../components/SEO";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const signupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.number().optional(),
  agreeTermsAndAge: z.boolean().refine((val) => val === true, {
    message: "You must be at least 16 years old and agree to the Terms of Service and Privacy Policy",
  }),
  marketingConsent: z.boolean().optional(),
});

type RegisterFormData = z.infer<typeof signupFormSchema>;

const governorates = [
  "Tunis", "Ariana", "Ben Arous", "La Manouba", "Nabeul", "Zaghouan", "Bizerte",
  "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse", "Monastir", "Mahdia",
  "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid", "Gafsa", "Tozeur", "Kébili",
  "Gabès", "Médenine", "Tataouine", "Diaspora / International",
];

export default function SignUp() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: 2,
      agreeTermsAndAge: false,
      marketingConsent: false,
    },
  });

  
  const handleVerifyAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError(t("code_required", "يرجى إدخال رمز التحقق المكون من 6 أرقام"));
      return;
    }
    setVerifying(true);
    setError("");
    try {
      await fetch("/api/auth/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          code: verificationCode.trim(),
        }),
      });
      setVerifySuccess(true);
      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 1500);
    } catch {
      setError(t("verification_failed", "فشل التحقق من الرمز المدخل"));
    } finally {
      setVerifying(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setLoading(true);
    try {
      setRegisteredEmail(data.email.trim().toLowerCase());
      await registerAuth(data.name.trim(), undefined, data.email.trim().toLowerCase(), data.password, (data as any).dob);
      setVerificationPending(true);
      if (data.marketingConsent) {
        try {
          await fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email.trim().toLowerCase() }),
          });
        } catch {
          // Non-blocking newsletter subscription
        }
      }
      navigate("/admin", { replace: true });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("registration_failed", "Registration failed. Please try again.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-[85vh] py-8 sm:py-12">
      <SEO
        title={t("seo_signup_title", "إنشاء حساب — جذور تونس")}
        description="Join Roots Tunisia to document your family tree, search archive registers and preserve Tunisian heritage."
        keywords={["Register Roots Tunisia", "Create Tunisian genealogy account"]}
      />

      <div className="mx-auto max-w-[var(--content-max)] px-3 sm:px-5">
        <div className="surface-card grid lg:grid-cols-2 rounded-lg border border-[var(--gold)]/40 overflow-hidden shadow-2xl min-h-[620px]">
          {/* Left Photo Part */}
          <div className="relative hidden lg:block overflow-hidden min-h-[600px]">
            <img
              src={kairouan}
              alt={t("kairouan_courtyard_alt", "صحن جامع القيروان الكبير")}
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
            <div className="hero-scrim absolute inset-0" />
            <div className="absolute bottom-12 left-12 right-12 max-w-md z-10 rtl:text-right">
              <p className="eyebrow text-[var(--gold)]">{t("roots_tunisia", "Roots Tunisia")}</p>
              <p className="mt-3 font-display text-3xl text-white font-semibold leading-snug">
                {t("signup_hero_title", "Preserve your family story for generations to come.")}
              </p>
              <p className="mt-2 text-xs text-white/80 leading-relaxed">
                {t("signup_hero_desc", "Build multi-generational lineages with verified archival citations from across 24 Tunisian governorates.")}
              </p>
            </div>
          </div>

          {/* Right Form Part */}
          <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[var(--card)]">
            {verificationPending ? (
              <div className="w-full max-w-md p-6 rounded-2xl border border-[var(--gold)]/40 bg-[var(--card)] shadow-2xl text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center mx-auto border border-[var(--gold)]/30">
                  <Eye className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display text-[var(--foreground)]">
                    {t("verify_account_title", "تأكيد ملكية الحساب عبر البريد")}
                  </h2>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                    {t("verify_account_instructions", "تم إرسال رمز تحقق مكون من 6 أرقام إلى بريدك الإلكتروني:")}
                    <br />
                    <strong className="text-[var(--gold)] font-mono">{registeredEmail}</strong>
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
                    {error}
                  </div>
                )}

                {verifySuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-bold">
                    ✓ {t("account_confirmed_welcome", "تم تأكيد الحساب بنجاح! جاري تحويلك إلى لوحة التحكم...")}
                  </div>
                ) : (
                  <form onSubmit={handleVerifyAccount} className="space-y-4">
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      className="w-48 mx-auto text-center font-mono text-2xl font-bold tracking-[8px] py-2 px-3 rounded-xl border-2 border-[var(--gold)] bg-[var(--background)] text-[var(--foreground)] outline-none"
                    />

                    <div className="space-y-2">
                      <button
                        type="submit"
                        disabled={verifying || !verificationCode.trim()}
                        className="btn-base btn-gold w-full text-xs font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50"
                      >
                        {verifying ? t("verifying", "جاري التحقق...") : t("confirm_and_activate", "تأكيد وتفعيل الحساب")}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/admin", { replace: true })}
                        className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline block mx-auto cursor-pointer"
                      >
                        {t("continue_to_dashboard", "المتابعة لاحقاً إلى لوحة التحكم")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
            <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
              <Logo />
              <h1 className="display-lg mt-8 text-[var(--foreground)]">{t("create_account", "Create your account")}</h1>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {t("signup_subtitle", "Start building your Tunisian family tree with verified records.")}
              </p>

              {error && (
                <div className="mt-4 p-4 rounded text-sm bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-200 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-8 grid gap-4">
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {t("full_name", "Full Name")}
                  </span>
                  <input
                    {...register("name")}
                    type="text"
                    required
                    className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] rtl:text-right"
                    placeholder={t("placeholder_name_example", "Mohamed Ben Amor")}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {t("email_address", "Email Address")}
                  </span>
                  <input
                    {...register("email")}
                    type="email"
                    required
                    className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] rtl:text-right"
                    placeholder={t("placeholder_email_example", "you@example.tn")}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {t("password", "Password")}
                  </span>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] rtl:text-right"
                      placeholder={t("placeholder_min_chars", "At least 6 characters")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 rtl:right-auto rtl:left-3 top-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </label>

                {/* Explicit Consent & Age Controls */}
                <div className="space-y-3 pt-2 text-xs text-[var(--muted-foreground)]">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      {...register("agreeTermsAndAge")}
                      type="checkbox"
                      id="signup-agree-terms"
                      className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-[var(--gold)] focus:ring-[var(--gold)]"
                    />
                    <span className="leading-snug">
                      {t("signup_agree_age_prefix", "I confirm that I am at least 16 years of age and agree to the")}{" "}
                      <Link to="/terms" target="_blank" className="text-[var(--gold)] underline hover:text-[var(--foreground)]">
                        {t("terms_of_service", "Terms of Service")}
                      </Link>{" "}
                      {t("and", "and")}{" "}
                      <Link to="/privacy" target="_blank" className="text-[var(--gold)] underline hover:text-[var(--foreground)]">
                        {t("privacy_policy", "Privacy Policy")}
                      </Link>
                      . <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.agreeTermsAndAge && (
                    <p className="text-xs text-red-500 pl-6.5">{errors.agreeTermsAndAge.message}</p>
                  )}

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      {...register("marketingConsent")}
                      type="checkbox"
                      id="signup-marketing-consent"
                      className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-[var(--gold)] focus:ring-[var(--gold)]"
                    />
                    <span className="leading-snug">
                      {t("signup_marketing_optin", "(Optional) I would like to receive occasional email updates about newly indexed Tunisian archives and historical records. You can unsubscribe at any time.")}
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={loading} className="btn-base btn-red w-full mt-3">
                  {loading ? t("creating_account", "Creating account…") : t("create_free_account", "Create free account")}
                </button>
              </div>

              <p className="mt-6 text-sm text-[var(--muted-foreground)] text-center">
                {t("already_have_account", "Already have an account?")}{" "}
                <Link to="/login" className="font-semibold text-[var(--gold)] hover:underline">
                  {t("login", "Sign in")}
                </Link>
              </p>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}