import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  Download,
  RefreshCw,
  User,
  X,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import { useThemeStore } from "../../store/theme";
import { useTranslation } from "../../context/TranslationContext";
import { notifyAdmin } from "../utils/notifications";

type RequestStatus = "pending" | "approved" | "rejected" | "all";

type DownloadRequest = {
  id: number;
  content_type: string;
  content_id: number;
  content_title?: string | null;
  content_created_at?: string | null;
  status: string;
  requested_at?: string;
  processed_at?: string | null;
  requesterName?: string;
  requesterEmail?: string;
  requesterPhone?: string;
  reason?: string | null;
};

const statusOptions: RequestStatus[] = ["pending", "approved", "rejected", "all"];

export default function DownloadRequests() {
  const { theme } = useThemeStore();
  const { t, isRtl } = useTranslation();
  const isDark = theme === "dark";
  const [status, setStatus] = useState<RequestStatus>("pending");
  const [requests, setRequests] = useState<DownloadRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const palette = useMemo(
    () => ({
      page: isDark ? "bg-[#071827] text-[#f5f1e8]" : "bg-[#f5f1e8] text-[#162238]",
      panel: isDark ? "bg-white/5 border-white/10" : "bg-white border-[#d8e2ea]",
      muted: isDark ? "text-[#f5f1e8]/65" : "text-[#162238]/65",
      accent: isDark ? "text-[#d9a441]" : "text-[#24766f]",
      button: isDark ? "border-white/10 hover:bg-white/10" : "border-[#d8e2ea] hover:bg-[#24766f]/8",
    }),
    [isDark]
  );

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/admin/download-requests?status=${status}`);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          t("download_requests_failed", "Failed to load download requests")
        )
      );
    } finally {
      setLoading(false);
    }
  }, [status, t]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const decide = async (id: number, action: "approve" | "reject") => {
    setActionId(id);
    try {
      const { data } = await api.put(`/admin/download-requests/${id}/${action}`);
      notifyAdmin(
        data?.message ||
          (action === "approve"
            ? t("download_request_approved", "تمت الموافقة على طلب التحميل بنجاح.")
            : t("download_request_rejected", "تم رفض طلب التحميل."))
      );
      await loadRequests();
    } catch (err) {
      notifyAdmin(
        getApiErrorMessage(
          err,
          t("download_request_decision_failed", "فشل تحديث حالة طلب التحميل")
        ),
        "error"
      );
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  };

  const contentTypeLabel = (type: string) =>
    ({
      tree: t("family_tree", "شجرة العائلة"),
      book: t("books", "الكتب والمخطوطات"),
      gallery: t("gallery", "المعرض والصور"),
      audio: t("audios", "الأرشيف الصوتي"),
      document: t("documents", "الوثائق التاريخية"),
    }[type] || type);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className={`min-h-screen p-6 text-start ${palette.page}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6 pb-4 border-b border-[var(--gold)]/20">
        <div>
          <p className={`text-xs uppercase tracking-[0.2em] font-bold ${palette.accent}`}>
            {t("approvals", "إدارة التنزيلات والموافقات")}
          </p>
          <h1 className="text-2xl font-bold mt-1 font-display">
            {t("download_requests_page_title", "طلبات تحميل المحتوى والأرشيف (Download Requests)")}
          </h1>
          <p className={`mt-1.5 max-w-2xl text-xs ${palette.muted}`}>
            {t(
              "download_requests_desc",
              "مراجعة طلبات المستخدمين لتحميل الأشجار، الكتب، الوثائق، والصوتيات المحمية، مع فحص بيانات المستخدم وسبب طلبه للمحتوى"
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadRequests()}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold ${palette.button} transition-colors cursor-pointer`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{t("refresh", "تحديث")}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setStatus(option)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              status === option
                ? "bg-[var(--gold)] border-[var(--gold)] text-black shadow-sm"
                : palette.button
            }`}
          >
            {t(`status_${option}`, option.toUpperCase())}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-500 text-xs mb-4">
          {error}
        </div>
      ) : null}

      <div className={`rounded-2xl border overflow-hidden shadow-sm ${palette.panel}`}>
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[var(--muted-foreground)]">{t("loading", "جاري التحميل...")}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center">
            <Download className={`w-12 h-12 mx-auto mb-3 opacity-30 ${palette.accent}`} />
            <p className="font-semibold text-sm">{t("no_download_requests", "لا توجد طلبات تحميل حالياً")}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="space-y-3 flex-1">
                  {/* User & Request Target */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 font-bold text-sm text-[var(--foreground)]">
                      <User className="w-4 h-4 text-[var(--gold)]" />
                      {request.requesterName || t("unknown_user", "مستخدم")}
                    </span>

                    {request.requesterEmail && (
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <Mail className="w-3.5 h-3.5" />
                        {request.requesterEmail}
                      </span>
                    )}

                    {request.requesterPhone && (
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <Phone className="w-3.5 h-3.5" />
                        {request.requesterPhone}
                      </span>
                    )}
                  </div>

                  {/* Requested File info */}
                  <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 border border-[var(--border)] text-xs flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span className="font-semibold text-[var(--foreground)]">
                      {request.content_title || contentTypeLabel(request.content_type)}
                    </span>
                    <span className="text-[var(--muted-foreground)]">
                      (#{request.content_id}) — {contentTypeLabel(request.content_type)}
                    </span>
                  </div>

                  {/* User Justification / Reason */}
                  <div className="p-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[var(--gold)] font-bold">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{t("request_reason_title", "مبرر وسبب طلب التحميل (Why user wants this content):")}</span>
                    </div>
                    <p className="text-[var(--foreground)] leading-relaxed italic ps-5">
                      {request.reason?.trim()
                        ? `"${request.reason}"`
                        : t("no_specific_reason_provided", "لم يحدد المستخدم مبرراً إضافياً (طلب عام)")}
                    </p>
                  </div>

                  {/* Metadata Date Badges */}
                  <div className={`flex flex-wrap gap-4 text-[0.7rem] ${palette.muted}`}>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {t("requested_on", "تاريخ الطلب")}: {formatDate(request.requested_at)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {t("status", "الحالة")}: <strong className="uppercase">{request.status}</strong>
                    </span>
                    {request.processed_at && (
                      <span>{t("processed_at", "تاريخ المعالجة")}: {formatDate(request.processed_at)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {request.status === "pending" ? (
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      type="button"
                      disabled={actionId === request.id}
                      onClick={() => void decide(request.id, "approve")}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t("approve_request", "قبول الطلب")}</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionId === request.id}
                      onClick={() => void decide(request.id, "reject")}
                      className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      <span>{t("reject_request", "رفض الطلب")}</span>
                    </button>
                  </div>
                ) : (
                  <div className="shrink-0 self-end lg:self-center">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        request.status === "approved"
                          ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-500 border border-red-500/30"
                      }`}
                    >
                      {request.status === "approved" ? t("approved", "تمت الموافقة") : t("rejected", "مرفوض")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
