import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, ExternalLink, Eye, RefreshCcw, Users } from "lucide-react";
import { api } from "../../api/client";
import { getGaMeasurementId } from "../../analytics/ga";
import { useTranslation } from "../../context/TranslationContext";
import AnalyticsCalendar, {
  todayYmd,
  tzOffsetMinutesForYmd,
  type AnalyticsRangeMode,
} from "../components/AnalyticsCalendar";

type LivePayload = {
  live?: {
    windowMinutes?: number;
    range?: string;
    from?: string;
    to?: string;
    anchorDate?: string | null;
    activeSessions?: number;
    activeVisitors?: number;
    pageviews?: number;
    topPages?: { path: string; views: number }[];
    recent?: { path: string; title?: string; locale?: string; referrer?: string; created_at: string }[];
    series?: { t: string; views: number }[];
    source?: string;
    generatedAt?: string;
    seriesGranularity?: string;
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
    measurementConfigured?: boolean;
    propertyConfigured?: boolean;
    dataApiConfigured?: boolean;
    searchConsoleVerification?: string | null;
    searchConsoleConfigured?: boolean;
  };
};

const SEARCH_CONSOLE_HINT =
  "Set VITE_GOOGLE_SITE_VERIFICATION on the frontend and GOOGLE_SITE_VERIFICATION on the backend, then verify rootstunisia.com in Search Console.";

function isLiveStats(value: unknown): value is NonNullable<LivePayload["live"]> {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return "pageviews" in row || "activeVisitors" in row || "activeSessions" in row || "series" in row;
}

/** Accept the Nest envelope, a double wrap, or a flat live object. */
export function readLivePayload(payload: unknown): LivePayload {
  let current: unknown = payload;
  for (let depth = 0; depth < 3; depth += 1) {
    if (!current || typeof current !== "object") break;
    const row = current as Record<string, unknown>;
    if (row.live || row.config || row.googleAnalytics || isLiveStats(row)) {
      if (isLiveStats(row) && !row.live) return { live: row as LivePayload["live"] };
      return row as LivePayload;
    }
    if (row.data && typeof row.data === "object") {
      current = row.data;
      continue;
    }
    break;
  }
  return {};
}

function metricValue(value: number | undefined, hasData: boolean, loading: boolean): number | string {
  if (!hasData && loading) return "…";
  return value ?? 0;
}

export default function LiveAnalytics() {
  const { t, isRtl, locale } = useTranslation();
  const [data, setData] = useState<LivePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(30);
  const [anchor, setAnchor] = useState(todayYmd);
  const [range, setRange] = useState<AnalyticsRangeMode>("day");

  const liveMinutesLabel = useMemo(() => {
    if (minutes < 60) return t("last_n_minutes", "Last {n} minutes").replace("{n}", String(minutes));
    const hours = Math.round(minutes / 60);
    return t("last_n_hours", "Last {n} hours").replace("{n}", String(hours));
  }, [minutes, t]);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError(null);
      const tzAnchor = range === "live" ? todayYmd() : anchor;
      const params = new URLSearchParams();
      params.set("tzOffset", String(tzOffsetMinutesForYmd(tzAnchor)));
      if (range === "live") {
        params.set("minutes", String(minutes));
        params.set("range", "live");
      } else {
        params.set("date", anchor);
        params.set("range", range);
      }
      try {
        const res = await api.get(`/admin/analytics/live?${params.toString()}`);
        setData(readLivePayload(res.data ?? res));
      } catch (err: any) {
        setError(err?.userMessage || err?.message || t("live_analytics_load_error", "Failed to load Google Analytics"));
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [anchor, minutes, range, t],
  );

  useEffect(() => {
    void load();
    const pollMs = range === "live" || anchor === todayYmd() ? 15000 : 60000;
    const id = window.setInterval(() => void load(true), pollMs);
    return () => window.clearInterval(id);
  }, [anchor, load, range]);

  useEffect(() => {
    const previous = document.title;
    document.title = `${t("live_analytics", "Google Analytics")} · ${t("map_breadcrumb_roots", "Roots Tunisia")}`;
    return () => {
      document.title = previous;
    };
  }, [t]);

  const live = data?.live;
  const ga = data?.googleAnalytics;
  const config = data?.config;
  const hasLive = Boolean(live);
  const measurementId = String(config?.measurementId || getGaMeasurementId() || "").trim();
  const propertyId = String(config?.propertyId || "").trim();
  const verification = String(config?.searchConsoleVerification || "").trim();
  const dataApi = Boolean(config?.dataApiConfigured);
  const series = live?.series || [];
  const maxSeries = Math.max(1, ...series.map((point) => point.views || 0));
  const seriesTotal = series.reduce((sum, point) => sum + (point.views || 0), 0);

  const summary = useMemo(() => {
    if (range === "live") return liveMinutesLabel;
    const [year, month, day] = anchor.split("-").map(Number);
    const anchorDate = new Date(year, (month || 1) - 1, day || 1);
    const format = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
    if (range === "day") return format.format(anchorDate);
    if (range === "week") {
      const start = new Date(anchorDate);
      const weekday = start.getDay();
      start.setDate(start.getDate() + (weekday === 0 ? -6 : 1 - weekday));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${format.format(start)} – ${format.format(end)}`;
    }
    if (range === "month") {
      return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(anchorDate);
    }
    return String(year);
  }, [anchor, liveMinutesLabel, locale, range]);

  const granularityLabel = t(
    `ga_bucket_${live?.seriesGranularity || "hour"}`,
    live?.seriesGranularity || "hour",
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
            {t("live_analytics", "Google Analytics")}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">
            {t(
              "live_analytics_desc",
              "Visitors by day, week, month, or year, plus the Google Analytics configuration.",
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="btn-base btn-outline-ink inline-flex items-center gap-2 px-3 py-2 text-sm"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {t("refresh", "Refresh")}
        </button>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <section className="grid items-start gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <AnalyticsCalendar
          anchor={anchor}
          range={range}
          locale={locale}
          isRtl={isRtl}
          summary={summary}
          minutes={minutes}
          labels={{
            live: t("ga_range_live", "Live"),
            day: t("ga_range_day", "Day"),
            week: t("ga_range_week", "Week"),
            month: t("ga_range_month", "Month"),
            year: t("ga_range_year", "Year"),
            prev: t("ga_calendar_prev", "Previous month"),
            next: t("ga_calendar_next", "Next month"),
            pick: t("ga_pick_date", "Choose a date"),
          }}
          onAnchorChange={setAnchor}
          onRangeChange={setRange}
          onMinutesChange={setMinutes}
        />

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="easy-stat-card">
              <div className="easy-stat-icon gold">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p>{t("active_visitors", "Active visitors")}</p>
                <strong>{metricValue(live?.activeVisitors, hasLive, loading)}</strong>
                <span>{summary}</span>
              </div>
            </article>
            <article className="easy-stat-card">
              <div className="easy-stat-icon teal">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p>{t("active_sessions", "Active sessions")}</p>
                <strong>{metricValue(live?.activeSessions, hasLive, loading)}</strong>
                <span>{live?.source || "first_party"}</span>
              </div>
            </article>
            <article className="easy-stat-card">
              <div className="easy-stat-icon blue">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <p>{t("pageviews", "Pageviews")}</p>
                <strong>{metricValue(live?.pageviews, hasLive, loading)}</strong>
                <span>{granularityLabel}</span>
              </div>
            </article>
            <article className="easy-stat-card">
              <div className="easy-stat-icon purple">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p>{t("ga_active_users", "GA active users")}</p>
                {dataApi ? (
                  <strong>{ga?.activeUsers ?? 0}</strong>
                ) : (
                  <strong className="!text-base font-mono break-all">
                    {measurementId || t("ga_not_configured", "Not configured")}
                  </strong>
                )}
                <span>
                  {dataApi
                    ? "Google Analytics"
                    : measurementId
                      ? t("ga_tag_active", "Tracking tag active")
                      : propertyId
                        ? t("ga_realtime_service_account", "Realtime needs a service account")
                        : t("ga_not_configured", "Not configured")}
                </span>
              </div>
            </article>
          </div>

          <div className="surface-card rounded-xl border border-[var(--border)] p-4">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="font-semibold">{t("traffic_over_time", "Traffic over time")}</h2>
              <span className="text-xs text-[var(--muted-foreground)]">{summary}</span>
            </div>
            {seriesTotal === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">{t("no_data_yet", "No data yet")}</p>
            ) : (
              <div className="flex h-40 items-end gap-1">
                {series.map((point) => (
                  <div
                    key={point.t}
                    title={`${point.t}: ${point.views}`}
                    className="min-w-[3px] flex-1 rounded-t bg-[var(--gold)]/80"
                    style={{ height: `${Math.max(point.views > 0 ? 8 : 0, (point.views / maxSeries) * 100)}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card rounded-xl border border-[var(--border)] p-4">
          <h2 className="mb-3 font-semibold">{t("top_pages", "Top pages")}</h2>
          <ul className="space-y-2">
            {(live?.topPages || []).length === 0 ? (
              <li className="text-sm text-[var(--muted-foreground)]">{t("no_data_yet", "No data yet")}</li>
            ) : (
              (live?.topPages || []).map((row) => (
                <li key={row.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-mono">{row.path}</span>
                  <span className="shrink-0 font-semibold text-[var(--gold)]">{row.views ?? 0}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="surface-card rounded-xl border border-[var(--border)] p-4">
          <h2 className="mb-3 font-semibold">{t("recent_pageviews", "Recent pageviews")}</h2>
          <div className="max-h-80 space-y-2 overflow-auto">
            {(live?.recent || []).length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">{t("no_data_yet", "No data yet")}</p>
            ) : (
              (live?.recent || []).map((row, idx) => (
                <div key={`${row.created_at}-${idx}`} className="border-b border-[var(--border)]/60 pb-2 text-sm">
                  <div className="truncate font-mono">{row.path || "/"}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {row.locale || "—"}
                    {row.created_at ? ` · ${new Date(row.created_at).toLocaleString(locale)}` : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="surface-card space-y-3 rounded-xl border border-[var(--border)] p-4">
        <h2 className="font-semibold">{t("live_analytics", "Google Analytics")}</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-start justify-between gap-3 rounded-lg bg-[var(--background)]/50 px-3 py-2">
            <dt className="text-[var(--muted-foreground)]">{t("measurement_id", "Measurement ID")}</dt>
            <dd className="text-end">
              {measurementId ? (
                <span className="font-mono">{measurementId}</span>
              ) : (
                <>
                  <span>{t("ga_not_configured", "Not configured")}</span>
                  <span className="mt-0.5 block text-[10px] text-[var(--muted-foreground)]">GA_MEASUREMENT_ID</span>
                </>
              )}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3 rounded-lg bg-[var(--background)]/50 px-3 py-2">
            <dt className="text-[var(--muted-foreground)]">{t("ga4_property_id", "GA4 Property ID")}</dt>
            <dd className="text-end">
              {propertyId ? (
                <span className="font-mono">{propertyId}</span>
              ) : (
                <>
                  <span>{t("ga_not_configured", "Not configured")}</span>
                  <span className="mt-0.5 block text-[10px] text-[var(--muted-foreground)]">GA4_PROPERTY_ID</span>
                </>
              )}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3 rounded-lg bg-[var(--background)]/50 px-3 py-2">
            <dt className="text-[var(--muted-foreground)]">{t("data_api", "Data API")}</dt>
            <dd className="text-end">
              {dataApi
                ? t("connected", "Connected")
                : propertyId
                  ? t("ga_realtime_service_account", "Realtime needs a service account")
                  : t("ga_not_configured", "Not configured")}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3 rounded-lg bg-[var(--background)]/50 px-3 py-2">
            <dt className="text-[var(--muted-foreground)]">{t("search_console_title", "Google Search Console")}</dt>
            <dd className="text-end">
              {verification ? (
                <span className="font-mono break-all">{verification}</span>
              ) : (
                <>
                  <span>{t("ga_not_configured", "Not configured")}</span>
                  <span className="mt-0.5 block text-[10px] text-[var(--muted-foreground)]">GOOGLE_SITE_VERIFICATION</span>
                </>
              )}
            </dd>
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
                <span className="text-[var(--gold)]">{row.activeUsers ?? 0}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noreferrer"
            className="btn-base btn-outline-ink inline-flex items-center gap-1.5 px-3 py-2 text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Google Analytics
          </a>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noreferrer"
            className="btn-base btn-outline-ink inline-flex items-center gap-1.5 px-3 py-2 text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Search Console
          </a>
        </div>
        <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
          {t("search_console_setup_hint", SEARCH_CONSOLE_HINT)}
        </p>
      </section>
    </div>
  );
}
