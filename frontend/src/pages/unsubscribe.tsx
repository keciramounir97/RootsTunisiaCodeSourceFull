import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MailX, CheckCircle2, AlertCircle, Home, ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";

export default function Unsubscribe() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError(t("provide_valid_email", "Please provide a valid email address."));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || t("unsubscribe_process_failed", "Failed to process unsubscription request."));
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t("unsubscribe_error_generic", "An unexpected error occurred. Please try again or contact support."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-[85vh] py-12 px-4 sm:px-6 flex items-center justify-center">
      <SEO
        title={t("unsubscribe_seo_title", "Unsubscribe from Newsletter — Roots Tunisia")}
        description={t("unsubscribe_seo_desc", "Manage your communication preferences and unsubscribe from Roots Tunisia marketing and archival updates.")}
      />

      <div className="surface-card max-w-lg w-full p-8 sm:p-10 rounded-xl border border-[var(--gold)]/40 shadow-2xl space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          {success ? <CheckCircle2 className="h-8 w-8 text-emerald-500" /> : <MailX className="h-8 w-8" />}
        </div>

        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
            {t("email_preferences", "Email Preferences")}
          </span>
          <h1 className="font-display text-2xl font-bold">
            {success ? t("unsubscribed_success_title", "You have been unsubscribed") : t("unsubscribe_title", "Unsubscribe from Updates")}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            {success
              ? t("unsubscribed_success_message", `We have removed ${email} from our promotional and research newsletter lists. You will no longer receive marketing communications.`)
              : t("unsubscribe_intro_message", "We are sorry to see you go. Enter your email below to opt out of archival updates, new collection announcements, and promotional newsletters.")}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded text-sm bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-200 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 pt-4 text-center">
            <div className="p-4 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted-foreground)] text-left">
              <strong className="text-[var(--foreground)] block mb-1">{t("important_note", "Important Note:")}</strong>
              {t("unsubscribe_legal_disclaimer", "If you have an active Roots Tunisia account, you may still receive essential transactional emails (such as password resets, security notices, and purchase confirmations) as permitted by law.")}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Link to="/" className="btn-base btn-gold flex items-center justify-center gap-2">
                <Home className="h-4 w-4" /> {t("return_to_home", "Return to Home")}
              </Link>
              <Link to="/contact" className="btn-base btn-outline-light flex items-center justify-center gap-2">
                {t("contact_support", "Contact Support")}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <label className="grid gap-1.5 text-left">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {t("email_address", "Email Address")}
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder_email_example", "you@example.tn")}
                className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] w-full"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-base btn-red w-full flex items-center justify-center gap-2"
            >
              {loading ? t("processing_unsubscription", "Processing unsubscription…") : t("confirm_unsubscribe", "Confirm Unsubscribe")}
            </button>

            <div className="text-center pt-2">
              <Link to="/" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--gold)] inline-flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> {t("back_to_roots_tunisia", "Back to Roots Tunisia")}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
