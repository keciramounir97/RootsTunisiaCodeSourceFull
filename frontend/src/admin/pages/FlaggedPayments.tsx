import { useEffect, useState } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ExternalLink,
  Flag,
  Mail,
  Phone,
  RefreshCw,
  Trash2,
  Wallet,
  X,
  AlertCircle,
  Crown,
} from "lucide-react";

type PaymentFlag = "refund" | "false_payment" | "fraudulent";

interface FlaggedPayment {
  id: number;
  user_id: number;
  tier_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  proof_url?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  admin_message?: string;
  flag?: PaymentFlag | null;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  tier_name?: string;
  created_at: string;
  reviewed_at?: string;
}

const FLAG_LABELS: Record<PaymentFlag, { key: string; fallback: string }> = {
  refund: { key: "flag_refund", fallback: "Refund" },
  false_payment: { key: "flag_false_payment", fallback: "False payment" },
  fraudulent: { key: "flag_fraudulent", fallback: "Fraudulent" },
};

export default function FlaggedPayments() {
  const { t, isRtl } = useTranslation();
  const [payments, setPayments] = useState<FlaggedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });

  const fetchFlagged = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get("/admin/subscription-payments/flagged");
      const list: FlaggedPayment[] = Array.isArray(data) ? data : data?.data || [];
      setPayments(list);
    } catch (err: any) {
      setPayments([]);
      setLoadError(
        err?.userMessage ||
          err?.response?.data?.message ||
          t("flagged_payments_load_failed", "Failed to load flagged payments.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlagged();
  }, []);

  const clearFlag = async (id: number) => {
    setProcessingId(id);
    setNotification({ type: "", text: "" });
    try {
      await api.patch(`/admin/subscription-payments/${id}/flag`, { flag: null });
      setNotification({
        type: "success",
        text: t("payment_flag_cleared", "تم إزالة الوسم."),
      });
      fetchFlagged();
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err?.response?.data?.message || t("action_failed", "فشل تنفيذ الإجراء"),
      });
    } finally {
      setProcessingId(null);
    }
  };

  const erasePayment = async (id: number) => {
    if (
      !window.confirm(
        t("confirm_erase_payment", "هل تريد حذف هذا السجل نهائياً؟ لا يمكن التراجع.")
      )
    ) {
      return;
    }
    setProcessingId(id);
    setNotification({ type: "", text: "" });
    try {
      await api.delete(`/admin/subscription-payments/${id}`);
      setNotification({
        type: "success",
        text: t("payment_erased", "تم حذف سجل الدفع."),
      });
      fetchFlagged();
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err?.response?.data?.message || t("action_failed", "فشل تنفيذ الإجراء"),
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
              {t("flagged_payments_title", "المدفوعات الموسومة (Flagged Payments)")}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t(
                "flagged_payments_subtitle",
                "عرض المدفوعات الموسومة كاسترداد أو دفع مزيف أو احتيال"
              )}
            </p>
          </div>
        </div>
        <button
          onClick={fetchFlagged}
          title={t("refresh", "تحديث")}
          className="p-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--gold)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {notification.text && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification({ type: "", text: "" })}
            className="p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loadError && !loading && (
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[var(--border)] text-[var(--muted-foreground)] space-y-2">
          <Flag className="w-8 h-8 text-[var(--gold)] mx-auto opacity-50" />
          <p className="text-sm font-bold">
            {loadError
              ? t("payments_unavailable", "تعذر تحميل المدفوعات. حاول التحديث لاحقاً.")
              : t("no_flagged_payments", "لا توجد مدفوعات موسومة حالياً.")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => {
            const isBusy = processingId === payment.id;
            const flagKey = payment.flag || "fraudulent";
            const flagMeta = FLAG_LABELS[flagKey] || FLAG_LABELS.fraudulent;

            return (
              <div
                key={payment.id}
                className="p-5 rounded-3xl border-2 border-rose-500/40 bg-[var(--card)] shadow-md space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[var(--foreground)]">
                        {payment.user_name || `${t("user", "المستخدم")} #${payment.user_id}`}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md text-[0.68rem] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center gap-1">
                        <Flag className="w-3 h-3" />
                        {t(flagMeta.key, flagMeta.fallback)}
                      </span>
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        #{payment.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap text-xs text-[var(--muted-foreground)]">
                      {payment.user_email && (
                        <span className="flex items-center gap-1 font-mono">
                          <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
                          {payment.user_email}
                        </span>
                      )}
                      {payment.user_phone && (
                        <span className="flex items-center gap-1 font-mono" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
                          {payment.user_phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                        {new Date(payment.created_at).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-[var(--gold)]" />
                        {payment.payment_method || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="text-start sm:text-end space-y-1">
                    <div className="font-display font-bold text-[var(--gold)] flex items-center gap-1 sm:justify-end">
                      <Crown className="w-4 h-4" />
                      {payment.tier_name || `Tier #${payment.tier_id}`}
                    </div>
                    <div className="font-display text-lg font-extrabold text-[var(--foreground)]">
                      {payment.amount} {payment.currency || "USD"}
                    </div>
                    <div className="text-[0.7rem] font-bold text-[var(--muted-foreground)]">
                      {t("current_status", "الحالة")}: {payment.status}
                    </div>
                  </div>
                </div>

                {payment.admin_message && (
                  <p className="text-xs p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">
                    <span className="font-bold text-[var(--foreground)]">
                      {t("sent_message", "الرسالة المرسلة للعميل")}:
                    </span>{" "}
                    {payment.admin_message}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-end gap-2">
                  {payment.proof_url && (
                    <a
                      href={payment.proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--gold)] hover:underline flex items-center gap-1"
                    >
                      {t("open_original", "فتح الرابط الأصلي")}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => clearFlag(payment.id)}
                    className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer disabled:opacity-50"
                  >
                    {t("clear_flag", "إزالة الوسم")}
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => erasePayment(payment.id)}
                    className="px-4 py-2 rounded-xl border border-rose-500/50 bg-rose-500/10 text-rose-500 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t("erase_payment", "مسح السجل")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
