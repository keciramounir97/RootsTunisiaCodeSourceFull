import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export default function Toast({
  message,
  tone = "success",
  onClose,
}: {
  message: string | null | undefined;
  tone?: "success" | "error" | "info";
  onClose?: () => void;
}) {
  if (!message) return null;

  const toneConfig = {
    error: {
      container:
        "border-amber-700/60 dark:border-[var(--gold)]/40 bg-stone-900/95 text-amber-100 shadow-2xl backdrop-blur-md",
      icon: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
      badge: "Erreur",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    info: {
      container:
        "border-[var(--gold)]/50 bg-stone-900/95 text-[var(--foreground)] shadow-2xl backdrop-blur-md",
      icon: <Info className="w-4 h-4 text-[var(--gold)] shrink-0" />,
      badge: "Info",
      badgeColor: "bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/30",
    },
    success: {
      container:
        "border-emerald-600/50 dark:border-emerald-500/40 bg-stone-900/95 text-emerald-100 shadow-2xl backdrop-blur-md",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
      badge: "Succès",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
  }[tone || "success"];

  return (
    <div
      className={`fixed top-24 z-[70] rtl:left-6 rtl:right-auto ltr:right-6 max-w-md rounded-xl border px-4 py-3 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${toneConfig.container}`}
      role="status"
      aria-live="polite"
    >
      {toneConfig.icon}
      <div className="flex-1 text-xs font-medium leading-snug">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition cursor-pointer"
          title="Fermer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
