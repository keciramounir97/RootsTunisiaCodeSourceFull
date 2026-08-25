import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../api/validation";
import { z } from "zod";
import carthage from "../assets/slider-carthage.jpg";
import { Logo } from "../components/site/Logo";
import SEO from "../components/SEO";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setLoading(true);
    try {
      const loggedUser = await login(data.email.trim().toLowerCase(), data.password);
      if (loggedUser) {
        navigate("/admin", { replace: true });
      } else {
        setError(t("login_failed_no_user", "Login failed: No user data received"));
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("invalid_credentials", "Invalid credentials. Please check your email and password.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-[85vh] py-8 sm:py-12">
      <SEO
        title="Login — Roots Tunisia"
        description="Sign in to your Roots Tunisia account to continue your Tunisian family research."
        keywords={["Login Roots Tunisia", "Tunisian genealogy account"]}
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
                Your lineage is waiting in the registers.
              </p>
              <p className="mt-2 text-xs text-white/80 leading-relaxed">
                Connect ancestors across Ottoman sijillat, central état civil, and Mediterranean archival collections.
              </p>
            </div>
          </div>

          {/* Right Form Part */}
          <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[var(--card)]">
            <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
              <Logo />
              <h1 className="display-lg mt-8 text-[var(--foreground)]">Welcome back</h1>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Sign in to continue building your Tunisian family tree.
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
                    Email
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

                <label className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                      Password
                    </span>
                    <Link
                      to="/reset-password"
                      className="text-xs font-semibold text-[var(--gold)] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </label>

                <button type="submit" disabled={loading} className="btn-base btn-red w-full mt-2">
                  {loading ? "Signing in…" : "Sign in to account"}
                </button>
              </div>

              <p className="mt-8 text-sm text-[var(--muted-foreground)] text-center">
                New to Roots Tunisia?{" "}
                <Link to="/signup" className="font-semibold text-[var(--gold)] hover:underline">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}