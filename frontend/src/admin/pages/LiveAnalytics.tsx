import { useEffect, useState } from "react";
import { Activity, BarChart3, ExternalLink, RefreshCcw, Users, Eye, Radio } from "lucide-react";
import { api } from "../../api/client";
import { useTranslation } from "../../context/TranslationContext";

type LivePayload = {
  live?: {
    windowMinutes?: number;
    activeSessions?: number;
    activeVisitors?: number;
    pageviews?: number;
    topPages?: { path: string; views: number }[];
    recent?: { path: string; title?: string; locale?: string; referrer?: string; created_at: string }[];
    series?: { t: string; views: number }[];
    source?: string;
    generatedAt?: string;
  };
  googleAnalytics?: {
    configured?: boolean;
    activeUsers?: number;
    topScreens?: { page: string; activeUsers: number }[];
    error?: string;
    message?: string;
    source?: string;
  };
  config?: {
    measurementId?: string | null;
    propertyId?: string | null;
    dataApiConfigured?: boolean;
    searchConsoleVerification?: string | null;
  };
};

export default function LiveAnalytics() {
  const { t, isRtl } = useTranslation();
  const [data, setData] = useState<LivePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(30);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/analytics/live?minutes=${minutes}`);
      setData((res.data || res) as LivePayload);
    } catch (err: any) {
      setError(err?.userMessage || err?.message || t("live_analytics_load_error", "Failed to load live analytics"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 15000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes]);

  const live = data?.live;
  const ga = data?.googleAnalytics;
  const config = data?.config;
  const maxSeries = Math.max(1, ...(live?.series || []).map((s) => s.views || 0));

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <Radio className="h-6 w-6 text-[var(--gold)]" />
            {t("live_analytics", "Live Analytics")}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {t(
              "live_analytics_desc",
              "Realtime first-party traffic plus Google Analytics when configured.",
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
            <option value={180}>3 h</option>
            <option value={1440}>24 h</option>
          </select>
          <button
            type="button"
            onClick={() => void load()}
            className="btn-base btn-outline-ink text-sm py-2 px-3 inline-flex items-center gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {t("refresh", "Refresh")}
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="easy-stat-card">
          <div className="easy-stat-icon gold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p>{t("active_visitors", "Active visitors")}</p>
            <strong>{live?.activeVisitors ?? "—"}</strong>
            <span>{t("last_n_minutes", `Last ${minutes} minutes`).replace("{n}", String(minutes))}</span>
          </div>
        </article>
        <article className="easy-stat-card">
          <div className="easy-stat-icon teal">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p>{t("active_sessions", "Active sessions")}</p>
            <strong>{live?.activeSessions ?? "—"}</strong>
            <span>{live?.source || "first_party"}</span>
          </div>
        </article>
        <article className="easy-stat-card">
          <div className="easy-stat-icon blue">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p>{t("pageviews", "Pageviews")}</p>
            <strong>{live?.pageviews ?? "—"}</strong>
            <span>{live?.generatedAt ? new Date(live.generatedAt).toLocaleTimeString() : ""}</span>
          </div>
        </article>
        <article className="easy-stat-card">
          <div className="easy-stat-icon purple">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p>{t("ga_active_users", "GA active users")}</p>
            <strong>{ga?.configured ? ga.activeUsers ?? 0 : "—"}</strong>
            <span>{ga?.configured ? "Google Analytics" : t("ga_not_linked", "Not linked yet")}</span>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card rounded-xl border border-[var(--border)] p-4">
          <h2 className="font-semibold mb-3">{t("traffic_over_time", "Traffic over time")}</h2>
          <div className="flex items-end gap-1 h-40">
            {(live?.series || []).length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">{t("no_data_yet", "No data yet")}</p>
            ) : (
              (live?.series || []).map((point) => (
                <div
                  key={point.t}
                  title={`${point.t}: ${point.views}`}
                  className="flex-1 min-w-[4px] rounded-t bg-[var(--gold)]/80"
                  style={{ height: `${Math.max(6, (point.views / maxSeries) * 100)}%` }}
                />
              ))
            )}
          </div>
        </div>

        <div className="surface-card rounded-xl border border-[var(--border)] p-4">
          <h2 className="font-semibold mb-3">{t("top_pages", "Top pages")}</h2>
          <ul className="space-y-2">
            {(live?.topPages || []).length === 0 ? (
              <li className="text-sm text-[var(--muted-foreground)]">{t("no_data_yet", "No data yet")}</li>
            ) : (
              (live?.topPages || []).map((row) => (
                <li key={row.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-mono">{row.path}</span>
                  <span className="shrink-0 text-[var(--gold)] font-semibold">{row.views}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card rounded-xl border border-[var(--border)] p-4">
          <h2 className="font-semibold mb-3">{t("recent_pageviews", "Recent pageviews")}</h2>
          <div className="max-h-80 overflow-auto space-y-2">
            {(live?.recent || []).map((row, idx) => (
              <div key={`${row.created_at}-${idx}`} className="text-sm border-b border-[var(--border)]/60 pb-2">
                <div className="font-mono truncate">{row.path}</div>
                <div className="text-[var(--muted-foreground)] text-xs">
                  {row.locale || "—"} · {new Date(row.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card rounded-xl border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-semibold">{t("google_analytics_title", "Google Analytics")}</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--muted-foreground)]">{t("measurement_id", "Measurement ID")}</dt>
              <dd className="font-mono">{config?.measurementId || t("not_set", "Not set")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--muted-foreground)]">{t("ga4_property_id", "GA4 Property ID")}</dt>
              <dd className="font-mono">{config?.propertyId || t("not_set", "Not set")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--muted-foreground)]">{t("data_api", "Data API")}</dt>
              <dd>{config?.dataApiConfigured ? t("connected", "Connected") : t("pending_setup", "Pending setup")}</dd>
            </div>
          </dl>
          {ga?.message || ga?.error ? (
            <p className="text-xs text-[var(--muted-foreground)]">{ga.message || ga.error}</p>
          ) : null}
          {(ga?.topScreens || []).length > 0 ? (
            <ul className="space-y-1 text-sm">
              {ga!.topScreens!.map((row) => (
                <li key={row.page} className="flex justify-between gap-2">
                  <span className="truncate">{row.page}</span>
                  <span className="text-[var(--gold)]">{row.activeUsers}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noreferrer"
              className="btn-base btn-outline-ink text-xs py-2 px-3 inline-flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Google Analytics
            </a>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            {t(
              "live_analytics_ga_hint",
              "Google Analytics realtime tracking and first-party visit counter are active.",
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
