import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { api } from "../api/client";
import { CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { Section, SectionHeading } from "../components/site/Primitives";
import SEO from "../components/SEO";

export default function Payment() {
  const { tier } = useParams<{ tier: string }>();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<{ type: string; msg: string }>({ type: "", msg: "" });

  const queryParams = new URLSearchParams(location.search);
  const planParam = queryParams.get("plan") || tier || "researcher";
  const amountParam = queryParams.get("amount") || (planParam === "researcher" ? "39" : "0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const tierId = planParam === "basic" ? 1 : planParam === "researcher" ? 2 : 3;
      await api.post("/my/subscription/payment", {
        tier_id: tierId,
        amount: parseFloat(amountParam),
        proof_url: proofUrl || undefined,
        notes: notes || undefined,
      });
      setStatus({
        type: "success",
        msg: "Payment confirmation recorded! Your subscription will be active momentarily.",
      });
      setTimeout(() => navigate("/subscriptions"), 2500);
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to record payment. Please contact support.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen pt-12 pb-20">
      <SEO
        title="Confirm Subscription — Roots Tunisia"
        description="Confirm your Roots Tunisia subscription payment in Tunisian Dinars (TND)."
      />

      <div className="mx-auto max-w-xl px-5">
        <Link
          to="/subscriptions"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Plans
        </Link>

        <div className="surface-card p-8 sm:p-10 border-2 border-[var(--gold)]/40 shadow-xl">
          <p className="eyebrow text-center">Subscription Checkout</p>
          <h1 className="display-lg mt-2 text-center text-[var(--foreground)]">
            Confirm Your Plan
          </h1>

          <div className="mt-6 p-4 rounded bg-[var(--secondary)]/60 border border-[var(--gold)]/30 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)] font-bold">
                Selected Plan
              </span>
              <p className="font-display text-xl font-semibold text-[var(--foreground)] capitalize">
                {planParam} Plan
              </p>
            </div>
            <div className="text-right">
              <span className="font-display text-3xl font-bold text-[var(--primary)]">
                {amountParam} TND
              </span>
              <span className="block text-[0.65rem] text-[var(--muted-foreground)] uppercase tracking-[0.1em]">
                Monthly
              </span>
            </div>
          </div>

          {status.msg && (
            <div
              className={`mt-5 p-4 rounded text-sm flex items-center gap-2.5 ${
                status.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300 dark:bg-green-950 dark:text-green-200"
                  : "bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-200"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <span>{status.msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Bank Transfer / Proof Reference (Optional)
              </span>
              <input
                type="text"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="Bank transfer transaction ID or reference code"
                className="rounded-sm border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Additional Notes
              </span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special research or invoice instructions…"
                className="rounded-sm border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </label>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-base btn-red w-full py-3.5"
              >
                {submitting ? "Processing…" : `Confirm Subscription (${amountParam} TND)`}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--gold)]/20 flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
            <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
            <span>Secure payment processing for Tunisian researchers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
