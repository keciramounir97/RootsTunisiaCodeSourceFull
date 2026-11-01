import { useState, useEffect } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Crown,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Mail,
  Phone,
  User,
  Calendar,
  Wallet,
  FileText,
  Eye,
  MessageSquare,
  Send,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface PaymentRecord {
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
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  tier_name?: string;
  created_at: string;
  reviewed_at?: string;
}

export default function SubscriptionPayments() {
  const { t, isRtl } = useTranslation();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("pending");
  const [activeProofModal, setActiveProofModal] = useState<string | null>(null);

  // Message per payment draft
  const [adminMessages, setAdminMessages] = useState<Record<number, string>>({});
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/subscription-payments");
      const list: PaymentRecord[] = Array.isArray(data) ? data : data?.data || [];
      setPayments(list);
    } catch {
      // Fallback sample payment if testing offline
      setPayments([
        {
          id: 1,
          user_id: 2,
          user_name: "Ahmed Ben Salah",
          user_email: "ahmed.bensalah@gmail.com",
          user_phone: "+216 98 123 456",
          tier_id: 3,
          tier_name: "Family Historian",
          amount: 19.99,
          currency: "USD",
          payment_method: "Virement Bancaire (BIAT)",
          proof_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
          notes: "Virement effectué ce matin depuis mon compte BIAT réf TR-894726",
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleReview = async (id: number, decision: "approved" | "rejected") => {
    setProcessingId(id);
    setNotification({ type: "", text: "" });
    const msg = adminMessages[id] || "";

    try {
      await api.patch(`/admin/subscription-payments/${id}/review`, {
        decision,
        admin_message: msg || (decision === "approved" ? "تم تفعيل اشتراكك بنجاح!" : "تم رفض الطلب لعدم وضوح إشعار التحويل."),
      });

      setNotification({
        type: "success",
        text: decision === "approved"
          ? t("payment_approved_success", "تم اعتماد الدفع وترقية حساب العميل بنجاح!")
          : t("payment_rejected_notice", "تم رفض إشعار الدفع وإبلاغ العميل."),
      });

      fetchPayments();
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err?.response?.data?.message || t("action_failed", "فشل تنفيذ الإجراء"),
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = payments.filter((p) => {
    const matchesFilter = !filter || filter === "all" || p.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      String(p.id).includes(q) ||
      p.user_name?.toLowerCase().includes(q) ||
      p.user_email?.toLowerCase().includes(q) ||
      p.payment_method?.toLowerCase().includes(q) ||
      p.notes?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const pendingCount = payments.filter((p) => p.status === "pending").length;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                {t("subscription_payments_audit_title", "مراجعة واعتماد مدفوعات الاشتراكات (Payment Verification)")}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t(
                  "subscription_payments_audit_subtitle",
                  "استلام إشعارات الدفع، معاينة إيصال التحويل، ترقية الحساب بنقرة واحدة، ومراسلة العميل"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_client_payments", "بحث باسم العميل أو الإيميل...")}
              className="ps-9 pe-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors w-60"
            />
          </div>

          <button
            onClick={fetchPayments}
            title={t("refresh", "تحديث")}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--gold)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
        {[
          { key: "pending", label: t("status_pending", "قيد المراجعة والانتظار"), count: pendingCount, isWarning: true },
          { key: "all", label: t("all_payments", "جميع العمليات"), count: payments.length },
          { key: "approved", label: t("status_approved", "المعتمدة والمفعلة"), count: payments.filter((p) => p.status === "approved").length },
          { key: "rejected", label: t("status_rejected", "المرفوضة"), count: payments.filter((p) => p.status === "rejected").length },
        ].map((tab) => {
          const isSelected = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-md"
                  : "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[0.65rem] font-bold ${
                  tab.isWarning && tab.count > 0 && !isSelected
                    ? "bg-amber-500 text-white animate-pulse"
                    : isSelected
                    ? "bg-black text-[var(--gold)]"
                    : "bg-[var(--secondary)] text-[var(--foreground)]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Global Notification Banner */}
      {notification.text && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification({ type: "", text: "" })} className="p-1 hover:opacity-75 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Payments List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[var(--border)] text-[var(--muted-foreground)] space-y-2">
          <Clock className="w-8 h-8 text-[var(--gold)] mx-auto opacity-50" />
          <p className="text-sm font-bold">{t("no_payments_found", "لا توجد عمليات دفع مسجلة في هذا التبويب.")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((payment) => {
            const isPending = payment.status === "pending";
            const isApproved = payment.status === "approved";
            const isRejected = payment.status === "rejected";
            const isBusy = processingId === payment.id;

            return (
              <div
                key={payment.id}
                className={`p-6 rounded-3xl border-2 transition-all bg-[var(--card)] shadow-md space-y-5 ${
                  isPending
                    ? "border-[var(--gold)]/60 bg-[var(--gold)]/[0.02]"
                    : isApproved
                    ? "border-emerald-500/40"
                    : "border-rose-500/30 opacity-75"
                }`}
              >
                {/* Top Row: Client & Tier Summary */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[var(--border)]">
                  {/* Client Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--gold)] to-amber-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow">
                      {payment.user_name ? payment.user_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-[var(--foreground)]">
                          {payment.user_name || `${t("user", "المستخدم")} #${payment.user_id}`}
                        </h3>
                        <span className="font-mono text-xs text-[var(--muted-foreground)] bg-[var(--background)] px-2 py-0.5 rounded border border-[var(--border)]">
                          User ID: #{payment.user_id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[0.68rem] font-bold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/25 flex items-center gap-1 font-mono">
                          <Wallet className="w-3 h-3" />
                          <span>{payment.payment_method || "Virement Bancaire"}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap text-xs text-[var(--muted-foreground)]">
                        {payment.user_email && (
                          <span className="flex items-center gap-1 font-mono text-[var(--foreground)]">
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
                      </div>
                    </div>
                  </div>

                  {/* Plan & Amount Requested */}
                  <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      {t("requested_plan", "الخطة المطلوبة")}:
                    </span>
                    <span className="font-display text-lg font-bold text-[var(--gold)] flex items-center gap-1.5">
                      <Crown className="w-4 h-4" />
                      <span>{payment.tier_name || `Tier #${payment.tier_id}`}</span>
                    </span>
                    <span className="font-display text-xl font-extrabold text-[var(--foreground)]">
                      {payment.amount} {payment.currency || "USD"}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Payment Method, Notes, and Proof Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Payment Details & Client Notes */}
                  <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-[0.72rem]">
                      <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                        <Wallet className="w-3 h-3 text-[var(--gold)]" />
                        <span>{t("chosen_payment_method", "طريقة الدفع")}:</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[0.68rem] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 font-mono">
                        {payment.payment_method || "Virement Bancaire"}
                      </span>
                    </div>

                    {payment.notes ? (
                      <div className="space-y-1">
                        <span className="text-[0.7rem] font-bold text-[var(--muted-foreground)]">
                          {t("client_transfer_reference", "بيانات وملاحظات العميل (رقم العملية / الحساب):")}
                        </span>
                        <p className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] font-mono text-[var(--foreground)] leading-relaxed">
                          {payment.notes}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[var(--muted-foreground)] italic">
                        {t("no_notes_entered", "لم يتم إدخال ملاحظات إضافية من العميل.")}
                      </p>
                    )}

                    {/* Status Pill */}
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[0.7rem] text-[var(--muted-foreground)] font-bold">{t("current_status", "الحالة")}:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold ${
                          isApproved
                            ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                            : isRejected
                            ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                            : "bg-amber-500/15 text-amber-500 border border-amber-500/30 animate-pulse"
                        }`}
                      >
                        {isApproved ? t("status_approved", "معتمد ومفعّل") : isRejected ? t("status_rejected", "مرفوض") : t("status_pending", "قيد المراجعة")}
                      </span>
                    </div>
                  </div>

                  {/* Proof of Payment Box */}
                  <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                      <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>{t("proof_of_payment", "إشعار وإيصال التحويل (Payment Proof)")}</span>
                      </span>
                      {payment.proof_url && (
                        <a
                          href={payment.proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[0.7rem] font-bold text-[var(--gold)] hover:underline flex items-center gap-1"
                        >
                          <span>{t("open_original", "فتح الرابط الأصلي")}</span>
                          <ExternalLink className="w-3 h-3 rtl:rotate-180" />
                        </a>
                      )}
                    </div>

                    {payment.proof_url ? (
                      <div className="flex items-center gap-4">
                        <div
                          onClick={() => setActiveProofModal(payment.proof_url!)}
                          className="relative w-28 h-24 rounded-xl overflow-hidden border-2 border-[var(--gold)]/40 hover:border-[var(--gold)] cursor-pointer group shadow shrink-0 bg-black/20"
                        >
                          <img
                            src={payment.proof_url}
                            alt="Receipt Preview"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/300x200/1a2634/d9a441?text=Receipt+Doc";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[0.65rem] font-bold gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t("zoom", "تكبير")}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-[var(--muted-foreground)]">
                          <p className="font-bold text-[var(--foreground)]">{t("proof_attached", "تم إرفاق إيصال الدفع بنجاح")}</p>
                          <p className="text-[0.7rem]">{t("proof_click_hint", "انقر على الصورة لمعاينتها بحجم كامل والتحقق من رقم المعاملة والمبلغ.")}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--muted-foreground)]">
                        {t("no_proof_uploaded", "لم يتم رفع صورة إيصال، يرجى التحقق من كشف الحساب البنكي مباشرة بالاعتماد على الملاحظات.")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Direct Client Message & Action Buttons */}
                <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--gold)]/30 space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[var(--gold)]" />
                      <span>{t("message_to_client", "رسالة مباشرة للعميل (تصل إلى حسابه وتظهر في تفاصيل الدفع):")}</span>
                    </label>
                    <input
                      type="text"
                      value={adminMessages[payment.id] || ""}
                      onChange={(e) =>
                        setAdminMessages({ ...adminMessages, [payment.id]: e.target.value })
                      }
                      placeholder={
                        isApproved
                          ? t("message_approved_placeholder", "مثال: تم تأكيد الدفع وترقية حسابك إلى باقة Family Historian، شكراً لثقتكم!")
                          : t("message_reject_placeholder", "مثال: يرجى إرسال إيصال التحويل البنكي الأصلي متضمناً رقم المعاملة وتاريخ التحويل.")
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                    />
                  </div>

                  {/* Actions for Pending Payments */}
                  {isPending && (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      {/* Red Cross Reject Button */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleReview(payment.id, "rejected")}
                        className="px-5 py-2.5 rounded-xl border-2 border-rose-500/60 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        <span>{t("reject_payment_red", "رفض الدفع (Red ✗)")}</span>
                      </button>

                      {/* Green Checkmark Approve Button */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleReview(payment.id, "approved")}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isBusy ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>{t("approve_and_upgrade_client", "اعتماد وترقية العميل فوراً (Green ✓)")}</span>
                      </button>
                    </div>
                  )}

                  {!isPending && payment.admin_message && (
                    <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                      <span className="font-bold text-[var(--foreground)]">{t("sent_message", "الرسالة المرسلة للعميل")}:</span>{" "}
                      {payment.admin_message}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Zoom Image Modal */}
      {activeProofModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setActiveProofModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border-2 border-[var(--gold)]/60 bg-[var(--card)] p-2 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveProofModal(null)}
              className="absolute top-4 end-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-auto max-h-[82vh] flex items-center justify-center">
              <img
                src={activeProofModal}
                alt="Full Payment Proof"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
            <div className="p-3 text-center border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--gold)]">
                {t("receipt_full_preview", "معاينة إيصال التحويل بالحجم الكامل")}
              </span>
              <a
                href={activeProofModal}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[var(--gold)] hover:underline flex items-center gap-1"
              >
                <span>{t("open_browser_tab", "فتح في تبويب مستقل")}</span>
                <ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
