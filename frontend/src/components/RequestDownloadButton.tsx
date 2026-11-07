import { useState } from "react";
import { Download } from "lucide-react";
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

/** Direct download — request-to-download workflow removed site-wide. */
export default function RequestDownloadButton({
  downloadHref,
  fileName,
  className = "",
}: RequestDownloadButtonProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const baseBtn = `inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
    isDark ? "border-white/15 hover:border-[#d9a441]" : "border-[#e8e4dc] hover:border-[#d9a441]"
  } hover:bg-[#d9a441]/10 disabled:cursor-not-allowed disabled:opacity-60`;

  const triggerDownload = async () => {
    if (!downloadHref) return;
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
      // Fallback: open the resource directly
      window.open(downloadHref, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <button type="button" onClick={triggerDownload} disabled={busy || !downloadHref} className={baseBtn}>
        <Download className="h-4 w-4" />
        {busy ? t("downloading", "Downloading…") : t("download", "Download")}
      </button>
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
