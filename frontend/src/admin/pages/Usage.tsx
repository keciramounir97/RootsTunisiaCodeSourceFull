import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { useAuth } from "../components/AuthContext";
import {
  Gauge,
  Crown,
  Network,
  UserRound,
  Image,
  Music,
  FileText,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Archive,
  StickyNote,
  ListChecks,
  CheckCircle2,
} from "lucide-react";

const REFRESH_INTERVAL_MS = 18_000;

type QuotaItem = { used: number; max: number; custom?: boolean };

function unwrapQuotas(payload: any) {
  const root = payload?.data?.data ?? payload?.data ?? payload;
  if (!root || typeof root !== "object") return null;
  return root;
}

function QuotaSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-pulse">
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2 flex-1">
          <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-72 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="h-36 rounded-2xl bg-gray-200 dark:bg-gray-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 rounded-2xl bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  );
}

export default function Usage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [quotas, setQuotas] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  const fetchQuotas = useCallback(async (opts?: { silent?: boolean }) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    if (!opts?.silent) setInitialLoading(true);
    try {
      const res = await api.get("/my/quotas");
      if (!mountedRef.current) return;
      setQuotas(unwrapQuotas(res.data) ?? unwrapQuotas(res) ?? null);
    } catch {
      // keep last good snapshot on background refresh failures
    } finally {
      inFlightRef.current = false;
      if (mountedRef.current) setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void fetchQuotas({ silent: false });

    const onFocus = () => {
      if (document.visibilityState === "visible") {
        void fetchQuotas({ silent: true });
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchQuotas({ silent: true });
      }
    }, REFRESH_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.clearInterval(intervalId);
    };
  }, [fetchQuotas]);

  if (initialLoading && !quotas) {
    return <QuotaSkeleton />;
  }

  const isSuperAdmin = Boolean(
    user?.role === 1 ||
      user?.role === 3 ||
      quotas?.isSuperAdmin
  );

  const limits: Record<string, QuotaItem> = quotas?.limits || {};

  const resourceConfig: Array<{
    key: "trees" | "individuals" | "gallery" | "audios" | "documents" | "sources" | "notes" | "tasks";
    title: string;
    desc: string;
    Icon: any;
    createUrl: string;
  }> = [
    { key: "trees", title: t("family_trees", "Family Trees"), desc: t("trees_desc", "Trees created in your account"), Icon: Network, createUrl: "/admin/trees" },
    { key: "individuals", title: t("individuals", "Individuals"), desc: t("ind_desc", "Persons created in your family trees"), Icon: UserRound, createUrl: "/admin/individuals" },
    { key: "sources", title: t("my_sources", "My Sources"), desc: t("sources_desc", "Custom saved archive sources"), Icon: Archive, createUrl: "/admin/sources-archives" },
    { key: "notes", title: t("research_notes", "Research Notes"), desc: t("notes_desc", "Private notes attached to people/events"), Icon: StickyNote, createUrl: "/admin/notes" },
    { key: "tasks", title: t("research_tasks", "Research Tasks"), desc: t("tasks_desc", "Genealogy tasks (e.g. find birth record)"), Icon: ListChecks, createUrl: "/admin/tasks" },
    { key: "gallery", title: t("gallery_images", "Gallery Images"), desc: t("gallery_desc", "Photos & archive images uploaded"), Icon: Image, createUrl: "/admin/gallery" },
    { key: "audios", title: t("audio_files", "Audio Files"), desc: t("audio_desc", "Audio recordings & oral histories"), Icon: Music, createUrl: "/admin/audios" },
    { key: "documents", title: t("documents", "Documents"), desc: t("doc_desc", "Historical documents & PDFs"), Icon: FileText, createUrl: "/admin/documents" },
  ];

  const isAnyLimitReached =
    !isSuperAdmin &&
    Object.values(limits).some(
      (q) => q && q.max !== -1 && Number(q.used) >= Number(q.max)
    );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#d9a441]/15 text-[#d9a441]">
            <Gauge className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-cinzel text-[var(--text-color)]">
              {t("usage_and_quotas", "Usage & Quotas")}
            </h1>
            <p className="text-xs text-[var(--text-color)] opacity-70">
              {t("usage_subtitle", "Monitor your account creation limits and resource usage")}
            </p>
          </div>
        </div>

        {!isSuperAdmin && (
          <Link
            to="/admin/user-upgrade"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs shadow-md hover:shadow-lg transition-all"
          >
            <Crown className="w-4 h-4" />
            <span>{t("upgrade_subscription", "Upgrade Subscription")}</span>
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border-color)] bg-gradient-to-br from-[#092C2B] to-[#124d4b] text-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#d9a441]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[0.65rem] font-extrabold uppercase tracking-widest bg-[#d9a441] text-[#092C2B]">
                {isSuperAdmin
                  ? t("unlimited_super_admin", "Unlimited Super Admin")
                  : quotas?.tierName || t("active_plan", "Active Plan")}
              </span>
            </div>
            <h2
              className="text-2xl font-bold font-cinzel !text-white"
              style={{ color: "#ffffff", textShadow: "none" }}
            >
              {isSuperAdmin
                ? t("super_admin_unlimited_tier", "Super Admin Unlimited Tier")
                : `${quotas?.tierName || t("basic", "Basic")} ${t("tier_features", "Tier Features")}`}
            </h2>
            <p
              className="text-xs !text-white/90 mt-1 max-w-xl"
              style={{ color: "rgba(255, 255, 255, 0.9)", textShadow: "none" }}
            >
              {isSuperAdmin
                ? t("super_admin_quota_unrestricted", "As an Administrator, your account possesses unrestricted unlimited creation rights across all platform resources.")
                : t("user_quota_info", "Your account creation quotas are determined by your active subscription plan. Upgrade anytime to unlock higher limits.")}
            </p>
          </div>

          {!isSuperAdmin && (
            <Link
              to="/admin/user-upgrade"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#092C2B] font-bold text-xs hover:bg-gray-100 transition-colors shrink-0 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#d9a441]" />
              <span>{t("view_plans", "View Upgrade Plans")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          )}
        </div>
      </div>

      {isAnyLimitReached && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">{t("quota_limit_reached", "Quota Limit Reached!")}</p>
              <p className="text-xs opacity-90">
                {t("quota_limit_reached_desc", "One or more creation limits on your account are currently maxed out. Upgrade your plan to continue creating trees and uploading files.")}
              </p>
            </div>
          </div>
          <Link
            to="/admin/user-upgrade"
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition shrink-0 text-center"
          >
            {t("upgrade_plan", "Upgrade Plan")}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourceConfig.map(({ key, title, desc, Icon, createUrl }) => {
          const item = limits[key];
          // Prefer API values only — no hardcoded tier caps
          const used = item ? Number(item.used) || 0 : 0;
          const max = item && item.max !== undefined && item.max !== null
            ? Number(item.max)
            : isSuperAdmin
            ? -1
            : null;
          const isUnlimited = isSuperAdmin || max === -1;
          const isCustom = Boolean(item?.custom);
          const percentage =
            isUnlimited || max === null || max <= 0
              ? 0
              : Math.min(100, Math.round((used / max) * 100));
          const isFull = !isUnlimited && max !== null && used >= max;
          const isNearFull = !isUnlimited && percentage >= 80 && !isFull;
          const maxLabel = isUnlimited ? "∞" : max === null ? "—" : String(max);

          return (
            <div
              key={key}
              className={`rounded-2xl border bg-white dark:bg-[#1a2e2d] p-6 shadow-md flex flex-col justify-between space-y-4 transition-all hover:shadow-lg ${
                isFull
                  ? "border-red-500/50 dark:border-red-500/40 ring-2 ring-red-500/20"
                  : isNearFull
                  ? "border-amber-500/50 dark:border-amber-500/40"
                  : "border-[var(--border-color)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isFull
                          ? "bg-red-500/15 text-red-500"
                          : "bg-[#d9a441]/15 text-[#d9a441]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">
                        {title}
                      </h3>
                      <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                        {desc}
                      </p>
                    </div>
                  </div>

                  {isFull && (
                    <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-extrabold uppercase bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                      {t("full", "Full")}
                    </span>
                  )}
                  {isUnlimited && (
                    <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-extrabold uppercase bg-teal-500/15 text-[#0d9488] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#0d9488]" />
                      {t("unlimited", "Unlimited")}
                    </span>
                  )}
                </div>

                <div className="my-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black font-mono text-gray-900 dark:text-white">
                      {used}
                    </span>
                    <span className="text-sm font-bold text-gray-400">
                      / {maxLabel}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-gray-500">
                    {isUnlimited
                      ? t("unlimited_access", "Unlimited Access")
                      : max === null
                      ? t("waiting_quota", "Waiting for quota…")
                      : `${percentage}% ${t("used", "used")}`}
                  </span>
                </div>

                {!isUnlimited && max !== null ? (
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isFull
                          ? "bg-red-500"
                          : isNearFull
                          ? "bg-amber-500"
                          : "bg-gradient-to-r from-[#d9a441] to-[#e8c377]"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                ) : isUnlimited ? (
                  <div className="w-full bg-teal-500/10 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0d9488] w-full" />
                  </div>
                ) : (
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden" />
                )}
              </div>

              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                <Link
                  to={createUrl}
                  className="text-xs font-bold text-[#0d9488] dark:text-[#2dd4bf] hover:underline inline-flex items-center gap-1"
                >
                  <span>{t("manage_resource", "Manage")} {title}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>

                {isCustom && !isSuperAdmin && (
                  <span className="text-[0.65rem] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                    {t("custom_admin_quota", "Custom Admin Quota")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
