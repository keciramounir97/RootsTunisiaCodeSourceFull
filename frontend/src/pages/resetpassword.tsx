import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../api/validation";
import { z } from "zod";
import carthage from "../assets/slider-carthage.jpg";
import { Logo } from "../components/site/Logo";
import SEO from "../components/SEO";
import { ArrowLeft, AlertCircle, KeyRound, Mail } from "lucide-react";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
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
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-[85vh] py-8 sm:py-12">
      <SEO
        title="Reset Password — Roots Tunisia"
        description="Reset your password to regain access to your Roots Tunisia account."
      />

      <div className="mx-auto max-w-7xl px-3 sm:px-5">
        <div className="surface-card grid lg:grid-cols-2 rounded-lg border border-[var(--gold)]/40 overflow-hidden shadow-2xl min-h-[620px]">
          {/* Left Photo Part */}
          <div className="relative hidden lg:block overflow-hidden min-h-[600px]">
            <img
              src={carthage}
              alt="Ruins of Carthage overlooking the Mediterranean"
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
            <div className="hero-scrim absolute inset-0" />
            <div className="absolute bottom-12 left-12 right-12 max-w-md z-10">
              <p className="eyebrow text-[var(--gold)]">Roots Tunisia</p>
              <p className="mt-3 font-display text-3xl text-white font-semibold leading-snug">
                Account recovery for researchers and genealogists.
              </p>
              <p className="mt-2 text-xs text-white/80 leading-relaxed">
                Secure access to your family tree pedigrees, uploaded oral histories, and digitized manuscripts.
              </p>
            </div>
          </div>

          {/* Right Form Part */}
          <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[var(--card)]">
            <div className="w-full max-w-md">
              <Logo />

              {success ? (
                <div className="mt-8 text-center surface-card p-8 border border-[var(--gold)]/40">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)]">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <h2 className="display-lg text-2xl text-[var(--foreground)]">
                    Check Your Email
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">
                    If an account exists with that address, we have sent instructions to reset your password.
                  </p>
                  <div className="mt-6">
                    <Link to="/login" className="btn-base btn-gold text-xs">
                      <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(handleReset)}>
                  <h1 className="display-lg mt-8 text-[var(--foreground)]">Reset Password</h1>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Enter your account email to receive reset instructions.
                  </p>

                  {error && (
                    <div className="mt-4 p-4 rounded text-sm bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-200 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="mt-8 grid gap-5">
                    <label className="grid gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        Email Address
                      </span>
                      <div className="relative">
                        <input
                          {...register("email")}
                          type="email"
                          required
                          className="w-full rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                          placeholder="you@example.tn"
                        />
                        <Mail className="absolute right-3 top-3.5 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
                      </div>
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </label>

                    <button type="submit" disabled={loading} className="btn-base btn-red w-full">
                      {loading ? "Sending link…" : "Send reset link"}
                    </button>
                  </div>

                  <p className="mt-6 text-sm text-[var(--muted-foreground)] text-center">
                    Remember your password?{" "}
                    <Link to="/login" className="font-semibold text-[var(--gold)] hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}