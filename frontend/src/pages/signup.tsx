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
  role: z.number().default(2),
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
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setLoading(true);
    try {
      await registerAuth(
        data.name.trim(),
        data.email.trim().toLowerCase(),
        data.password,
        data.role
      );
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
        title="Create Account — Roots Tunisia"
        description="Join Roots Tunisia to document your family tree, search archive registers and preserve Tunisian heritage."
        keywords={["Register Roots Tunisia", "Create Tunisian genealogy account"]}
      />

      <div className="mx-auto max-w-7xl px-3 sm:px-5">
        <div className="surface-card grid lg:grid-cols-2 rounded-lg border border-[var(--gold)]/40 overflow-hidden shadow-2xl min-h-[620px]">
          {/* Left Photo Part */}
          <div className="relative hidden lg:block overflow-hidden min-h-[600px]">
            <img
              src={kairouan}
              alt="Great Mosque of Kairouan courtyard"
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
            <div className="hero-scrim absolute inset-0" />
            <div className="absolute bottom-12 left-12 right-12 max-w-md z-10">
              <p className="eyebrow text-[var(--gold)]">Roots Tunisia</p>
              <p className="mt-3 font-display text-3xl text-white font-semibold leading-snug">
                Preserve your family story for generations to come.
              </p>
              <p className="mt-2 text-xs text-white/80 leading-relaxed">
                Build multi-generational lineages with verified archival citations from across 24 Tunisian governorates.
              </p>
            </div>
          </div>

          {/* Right Form Part */}
          <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[var(--card)]">
            <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
              <Logo />
              <h1 className="display-lg mt-8 text-[var(--foreground)]">Create your account</h1>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Start building your Tunisian family tree with verified records.
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
                    Full Name
                  </span>
                  <input
                    {...register("name")}
                    type="text"
                    required
                    className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                    placeholder="Mohamed Ben Amor"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Email Address
                  </span>
                  <input
                    {...register("email")}
                    type="email"
                    required
                    className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                    placeholder="you@example.tn"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Ancestral Governorate / Region
                  </span>
                  <select
                    className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  >
                    {governorates.map((g) => (
                      <option key={g} value={g} className="bg-[var(--card)] text-[var(--foreground)]">
                        {g}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </label>

                <button type="submit" disabled={loading} className="btn-base btn-red w-full mt-3">
                  {loading ? "Creating account…" : "Create free account"}
                </button>
              </div>

              <p className="mt-6 text-sm text-[var(--muted-foreground)] text-center">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-[var(--gold)] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}