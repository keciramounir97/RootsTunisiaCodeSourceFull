import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Clock, Download, X, HelpCircle, Send } from "lucide-react";
import { api } from "../api/client";
import { getApiErrorMessage } from "../api/helpers";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import { useThemeStore } from "../store/theme";

export type DownloadContentType = "tree" | "book" | "gallery" | "audio" | "document";

interface RequestDownloadButtonProps {
  contentType: DownloadContentType;
  contentId: number | string | null | undefined;
  downloadHref: string;
  fileName?: string;
  canDownloadDirectly?: boolean;
  className?: string;
}

export default function RequestDownloadButton({
  contentType,
  contentId,
  downloadHref,
  fileName,
  canDownloadDirectly = false,
  className = "",
}: RequestDownloadButtonProps) {
  const { user } = useAuth();
  const { t, isRtl } = useTranslation();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus(null);
    setError("");
    if (!user || canDownloadDirectly || contentId == null) return;

    api
      .get("/download-requests/mine/status", { params: { contentType, contentId } })
      .then(({ data }) => {
        if (!cancelled) setStatus(data?.status || null);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      });

    return () => {
      cancelled = true;
    };
  }, [user, canDownloadDirectly, contentType, contentId]);

  const baseBtn = `inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
    isDark ? "border-white/15 hover:border-[#d9a441]" : "border-[#e8e4dc] hover:border-[#d9a441]"
  } hover:bg-[#d9a441]/10 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer`;

  const triggerDownload = async () => {
    setBusy(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(downloadHref, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError(t("download_failed", "فشل التحميل"));
    } finally {
      setBusy(false);
    }
  };

  const handleRequestClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowReasonModal(true);
  };

  const submitRequestWithReason = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/download-requests", {
        contentType,
        contentId,
        reason: reason.trim(),
      });
      setStatus("pending");
      setShowReasonModal(false);
      setReason("");
    } catch (err) {
      setError(getApiErrorMessage(err, t("request_download_failed", "فشل إرسال طلب التحميل")));
    } finally {
      setBusy(false);
    }
  };

  if (canDownloadDirectly || status === "approved") {
    return (
      <div className={className}>
        <button type="button" onClick={triggerDownload} disabled={busy} className={baseBtn}>
          <Download className="h-4 w-4 text-[var(--gold)]" />
          {t("download", "تحميل")}
        </button>
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className={className}>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold opacity-80 ${
            isDark ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-amber-600/30 bg-amber-50 text-amber-700"
          }`}
        >
          <Clock className="h-4 w-4" />
          {t("request_pending", "طلب التحميل قيد المراجعة")}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <button type="button" onClick={handleRequestClick} disabled={busy} className={baseBtn}>
        {status === "rejected" ? <X className="h-4 w-4 text-red-500" /> : <Download className="h-4 w-4" />}
        {status === "rejected"
          ? t("request_denied_retry", "تم الرفض — أعد المحاولة")
          : t("request_download", "طلب تحميل المحتوى")}
      </button>
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="w-full max-w-md rounded-2xl border border-[var(--gold)]/40 bg-[var(--card)] p-6 shadow-2xl text-start space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[var(--foreground)]">
                  {t("request_download_modal_title", "طلب تصريح تحميل محتوى")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReasonModal(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitRequestWithReason} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                  {t(
                    "why_download_content_prompt",
                    "لماذا ترغب في تحميل هذا المحتوى؟ (يرجى توضيح الغرض: بحث أكاديمي، استكمال شجرة العائلة، توثيق تاريخي):"
                  )}
                  <span className="text-red-500 ms-1">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t(
                    "download_reason_placeholder",
                    "اكتب مبررك هنا لتسهيل موافقة المشرفين..."
                  )}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReasonModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  {t("cancel", "إلغاء")}
                </button>
                <button
                  type="submit"
                  disabled={busy || !reason.trim()}
                  className="px-4 py-2 rounded-xl bg-[var(--gold)] text-black text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${busy ? "animate-spin" : ""}`} />
                  <span>{t("submit_request", "إرسال طلب التحميل")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
