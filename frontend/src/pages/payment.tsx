import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { api } from "../api/client";
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Smartphone,
  Copy,
  Check,
  CreditCard,
  Crown,
  Coins,
  Wallet,
} from "lucide-react";
import SEO from "../components/SEO";

interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  account_details: string;
  instructions: string;
  fee_note: string;
  badge: string;
  is_active: boolean;
  sort_order: number;
}

export default function Payment() {
  const { tier } = useParams<{ tier: string }>();
  const location = useLocation();
  const { t, isRtl } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedCurrency, convertPrice, currencies, setCurrencyCode } = useCurrency();

  const queryParams = new URLSearchParams(location.search);
  const tierParam = queryParams.get("tier") || (tier === "3" ? "3" : "2");
  const planSlug = queryParams.get("plan") || (tierParam === "3" ? "historian" : "premium");
  const intervalParam = queryParams.get("interval") || "monthly";

  // Tier base USD calculation:
  const isAnnual = intervalParam === "annual";
  const defaultUSD = tierParam === "3" ? (isAnnual ? 3.99 * 10 : 3.99) : (isAnnual ? 1.99 * 10 : 1.99);
  const amountFromQuery = parseFloat(queryParams.get("amount") || "");
  const baseUSD = !isNaN(amountFromQuery) && amountFromQuery > 0 ? amountFromQuery : defaultUSD;
  const tierName = tierParam === "3" ? "Historien & Généalogie Pro" : "Chercheur & Actes";
  const tierId = parseInt(tierParam, 10) || 2;

  // Real-time converted amount
  const converted = convertPrice(baseUSD);

  // Payment methods state loaded from Super Admin
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // Form states — proof file required (image or PDF)
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: string; msg: string }>({ type: "", msg: "" });
  const [copiedField, setCopiedField] = useState(false);

  // Fetch Super Admin configured payment methods
  useEffect(() => {
    (async () => {
      try {
        setLoadingMethods(true);
        const { data } = await api.get("/payment-methods");
        const items: PaymentMethod[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setPaymentMethods(items);
        if (items.length > 0) {
          setSelectedMethod(items[0]);
        }
      } catch {
        // Fallback default method
        const fallback: PaymentMethod = {
          id: 1,
          code: "bank_transfer",
          name: "Virement Bancaire (RIB / IBAN)",
          account_details: "Banque: BIAT Tunisie\nRIB: 0800 1234 5678 9012 3456\nTitulaire: Roots Tunisia",
          instructions: "Veuillez effectuer le virement bancaire puis saisir la référence ci-dessous.",
          fee_note: "Sans frais supplémentaires",
          badge: "Recommandé en Tunisie",
          is_active: true,
          sort_order: 1,
        };
        setPaymentMethods([fallback]);
        setSelectedMethod(fallback);
      } finally {
        setLoadingMethods(false);
      }
    })();
  }, []);

  const handleCopyDetails = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(true);
    setTimeout(() => setCopiedField(false), 2500);
  };

  const canSubmit = Boolean(selectedMethod && proofFile && !submitting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    if (!selectedMethod) {
      setStatus({
        type: "error",
        msg: t("select_payment_method_required", "Veuillez choisir un moyen de paiement."),
      });
      return;
    }
    if (!proofFile) {
      setStatus({
        type: "error",
        msg: t("payment_proof_required", "Veuillez joindre une preuve de paiement (image ou PDF)."),
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const formData = new FormData();
      formData.append("tier_id", String(tierId));
      formData.append("amount", String(converted.amount));
      formData.append("currency", converted.code);
      formData.append("payment_method", selectedMethod.name || "Virement Bancaire");
      formData.append("proof", proofFile);

      await api.post("/my/subscription/payment", formData);

      setStatus({
        type: "success",
        msg: t("payment_recorded_success", "تم تسجيل طلب تأكيد الدفع بنجاح! سيتم مراجعة وتفعيل اشتراكك بأسرع وقت."),
      });
      setProofFile(null);
      setTimeout(() => navigate("/subscriptions"), 3000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.userMessage ||
        t("payment_recorded_failed", "فشل تسجيل الدفع. يرجى الاتصال بالدعم الفني.");
      setStatus({
        type: "error",
        msg: Array.isArray(msg) ? msg.join(", ") : String(msg),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen pt-8 pb-20">
      <SEO
        title={t("seo_payment_title", "تأكيد الاشتراك والدفع — جذور تونس")}
        description="Confirm your Roots Tunisia subscription payment with localized Tunisian and international payment methods."
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          to="/subscriptions"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> {t("back_to_plans", "العودة إلى الخطط")}
        </Link>

        <div className="surface-card frame-gold p-6 sm:p-10 rounded-2xl border-2 border-[var(--gold)]/40 shadow-2xl space-y-8 text-start">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="eyebrow text-[var(--gold)] font-bold">{t("subscription_checkout", "تأكيد وتفعيل الاشتراك")}</span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              {t("confirm_your_plan", "تفاصيل الخطة والدفع")}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-lg mx-auto">
              {t("checkout_subtitle", "اختر وسيلة الدفع المناسبة واطلع على بيانات الحساب المعتمدة مباشرة من إدارة المنصة.")}
            </p>
          </div>

          {/* Plan Summary Card with Currency Switcher */}
          <div className="p-5 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)] font-bold">
                  {t("selected_plan", "الخطة المختارة")}
                </span>
                <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                  {tierName} {t("plan", "Plan")}
                </h3>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {isAnnual ? t("billed_annually", "فاتورة سنوية (شهرين مجاناً)") : t("billed_monthly", "فاتورة شهرية")}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-3xl font-extrabold text-[var(--gold)]">
                  {converted.formatted}
                </span>
              </div>

              {/* In-checkout Currency Switcher */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <Coins className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{t("currency", "العملة")}:</span>
                <select
                  value={selectedCurrency.code}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="bg-transparent font-bold font-mono text-[var(--foreground)] outline-none cursor-pointer border-b border-[var(--gold)]/40"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[var(--card)] text-[var(--foreground)]">
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Super Admin Configured Payment Methods Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[var(--gold)]" />
                <span>{t("select_payment_method", "اختر وسيلة الدفع المعتمدة")}</span>
              </h3>
              <span className="text-[0.68rem] text-[var(--muted-foreground)]">
                {paymentMethods.length} {t("methods_available", "طرق متاحة")}
              </span>
            </div>

            {loadingMethods ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="p-6 text-center text-sm rounded-xl border border-[var(--border)] text-[var(--muted-foreground)]">
                {t("no_payment_methods_active", "يرجى التواصل مع الدعم الفني لإتمام الدفع.")}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod?.id === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method)}
                      className={`p-4 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? "border-[var(--gold)] bg-[var(--gold)]/15 ring-2 ring-[var(--gold)]/40 shadow-md"
                          : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--gold)]/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-[var(--foreground)]">{method.name}</span>
                        {method.badge && (
                          <span className="px-2 py-0.5 rounded text-[0.62rem] font-bold bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30 shrink-0">
                            {method.badge}
                          </span>
                        )}
                      </div>

                      {method.fee_note && (
                        <p className="text-[0.7rem] text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ {method.fee_note}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Method Details Box (Configured by Super Admin) */}
            {selectedMethod && (
              <div className="p-5 sm:p-6 rounded-xl border border-[var(--gold)]/40 bg-[var(--background)] shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                    {t("official_account_coordinates", "بيانات الحساب المعتمدة")} — {selectedMethod.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyDetails(selectedMethod.account_details)}
                    className="btn-base btn-outline-light text-[0.7rem] py-1 px-2.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedField ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField ? t("copied", "تم النسخ!") : t("copy_coordinates", "نسخ البيانات")}</span>
                  </button>
                </div>

                {/* Exact Account Details text block */}
                <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed text-[var(--foreground)] select-all">
                  {selectedMethod.account_details}
                </div>

                {/* Instructions */}
                {selectedMethod.instructions && (
                  <div className="p-3.5 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/25 text-xs text-[var(--foreground)] space-y-1">
                    <strong className="text-[var(--gold)] font-bold block">
                      💡 {t("payment_instructions_title", "تعليمات الإيداع والتحويل")}:
                    </strong>
                    <p className="text-[var(--muted-foreground)] leading-relaxed">
                      {selectedMethod.instructions}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status Message */}
          {status.msg && (
            <div
              className={`p-4 rounded-xl text-sm flex items-center gap-3 shadow-md ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-200"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
              <span>{status.msg}</span>
            </div>
          )}

          {/* Confirmation Form — proof file only */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-[var(--gold)]/20">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)] mb-1.5">
                {t("payment_proof_label", "Preuve de paiement (image ou PDF) — obligatoire")}
              </label>
              <input
                type="file"
                accept=".pdf,image/*,.jpg,.jpeg,.png,.gif,.webp"
                onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-medium file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[var(--gold)]/20 file:text-[var(--gold)] file:font-bold file:cursor-pointer"
                required
              />
              {proofFile ? (
                <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                  {t("selected_file", "Fichier sélectionné")}:{" "}
                  <span className="font-semibold text-[var(--foreground)]">{proofFile.name}</span>
                </p>
              ) : (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  {t("payment_proof_hint", "Joignez une capture ou un PDF du virement pour valider la demande.")}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!canSubmit}
                className="btn-base btn-gold w-full py-4 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>
                  {submitting
                    ? t("processing", "جاري المعالجة...")
                    : `${t("confirm_payment_btn", "تأكيد وإرسال إشعار الدفع")} (${converted.formatted})`}
                </span>
              </button>
            </div>
          </form>

          {/* Security & Guarantee Footer */}
          <div className="pt-4 border-t border-[var(--gold)]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--gold)] shrink-0" />
              <span>{t("secure_verified_payment", "دفع آمن معتمد ومراجع يدوياً من إدارة المنصة")}</span>
            </div>
            <Link to="/refund" target="_blank" className="text-[var(--gold)] hover:underline">
              {t("refund_policy_link", "سياسة الاسترجاع والإلغاء")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
