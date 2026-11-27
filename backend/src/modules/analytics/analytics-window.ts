export type AnalyticsGranularity = "minute" | "hour" | "day" | "month";
export type AnalyticsRangeName = "live" | "day" | "week" | "month" | "year" | "custom";

export type AnalyticsQuery = {
  minutes?: number;
  date?: string;
  range?: string;
  from?: string;
  to?: string;
  tzOffsetMinutes?: number;
  now?: Date;
};

export type AnalyticsWindow = {
  from: Date;
  to: Date;
  range: AnalyticsRangeName;
  granularity: AnalyticsGranularity;
  anchorDate: string | null;
  windowMinutes: number;
  tzOffsetMinutes: number;
};

export type SeriesPoint = { t: string; views: number };

const MAX_LIVE_MINUTES = 525_600;
const MAX_SPAN_MS = 366 * 24 * 60 * 60 * 1000;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

type CivilDate = { y: number; m: number; d: number };

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatYmd(y: number, m: number, d: number): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function clampTz(offset?: number): number {
  const n = Number(offset);
  if (!Number.isFinite(n)) return 0;
  return Math.max(-14 * 60, Math.min(14 * 60, Math.trunc(n)));
}

export function parseYmd(value?: string): CivilDate | null {
  if (!value) return null;
  const match = DATE_RE.exec(value.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return { y, m, d };
}

function addDays(date: CivilDate, days: number): CivilDate {
  const dt = new Date(Date.UTC(date.y, date.m - 1, date.d + days));
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

function compareYmd(a: CivilDate, b: CivilDate): number {
  return a.y - b.y || a.m - b.m || a.d - b.d;
}

function startOfIsoWeek(date: CivilDate): CivilDate {
  const dt = new Date(Date.UTC(date.y, date.m - 1, date.d));
  const day = dt.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
}

/** Civil midnight for an admin timezone, as a UTC instant. */
function civilStartUtc(date: CivilDate, tzOffsetMinutes: number): Date {
  return new Date(Date.UTC(date.y, date.m - 1, date.d, 0, 0, 0) - tzOffsetMinutes * 60_000);
}

function ymdFromInstant(ms: number, tzOffsetMinutes: number): CivilDate {
  const shifted = new Date(ms + tzOffsetMinutes * 60_000);
  return {
    y: shifted.getUTCFullYear(),
    m: shifted.getUTCMonth() + 1,
    d: shifted.getUTCDate(),
  };
}

function parseInstant(value?: string): Date | null {
  if (!value || !value.includes("T")) return null;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : new Date(ms);
}

function granularityForSpanMs(ms: number): AnalyticsGranularity {
  const minutes = ms / 60_000;
  if (minutes <= 180) return "minute";
  if (minutes <= 36 * 60) return "hour";
  if (minutes <= 62 * 24 * 60) return "day";
  return "month";
}

function granularityForRange(range: AnalyticsRangeName, ms: number): AnalyticsGranularity {
  if (range === "day") return "hour";
  if (range === "week" || range === "month") return "day";
  if (range === "year") return "month";
  return granularityForSpanMs(ms);
}

function finish(
  from: Date,
  to: Date,
  range: AnalyticsRangeName,
  anchorDate: string | null,
  tzOffsetMinutes: number,
): AnalyticsWindow {
  let end = to;
  if (end.getTime() - from.getTime() > MAX_SPAN_MS) {
    end = new Date(from.getTime() + MAX_SPAN_MS);
  }
  const span = Math.max(60_000, end.getTime() - from.getTime());
  return {
    from,
    to: end,
    range,
    granularity: granularityForRange(range, span),
    anchorDate,
    windowMinutes: Math.round(span / 60_000),
    tzOffsetMinutes,
  };
}

function calendarBounds(
  anchor: CivilDate,
  range: "day" | "week" | "month" | "year",
  tzOffsetMinutes: number,
): AnalyticsWindow {
  let start = anchor;
  let endExclusive = addDays(anchor, 1);
  if (range === "week") {
    start = startOfIsoWeek(anchor);
    endExclusive = addDays(start, 7);
  } else if (range === "month") {
    start = { y: anchor.y, m: anchor.m, d: 1 };
    endExclusive = anchor.m === 12 ? { y: anchor.y + 1, m: 1, d: 1 } : { y: anchor.y, m: anchor.m + 1, d: 1 };
  } else if (range === "year") {
    start = { y: anchor.y, m: 1, d: 1 };
    endExclusive = { y: anchor.y + 1, m: 1, d: 1 };
  }
  return finish(
    civilStartUtc(start, tzOffsetMinutes),
    civilStartUtc(endExclusive, tzOffsetMinutes),
    range,
    formatYmd(anchor.y, anchor.m, anchor.d),
    tzOffsetMinutes,
  );
}

export function resolveAnalyticsWindow(input: AnalyticsQuery = {}): AnalyticsWindow {
  const now = input.now ?? new Date();
  const tz = clampTz(input.tzOffsetMinutes);
  const rangeRaw = String(input.range || "").toLowerCase();
  const namedRange = (["day", "week", "month", "year"] as const).find((name) => name === rangeRaw) || null;

  const fromYmd = parseYmd(input.from);
  const toYmd = parseYmd(input.to);
  if (fromYmd && toYmd) {
    const startParts = compareYmd(fromYmd, toYmd) <= 0 ? fromYmd : toYmd;
    const endParts = compareYmd(fromYmd, toYmd) <= 0 ? toYmd : fromYmd;
    return finish(
      civilStartUtc(startParts, tz),
      civilStartUtc(addDays(endParts, 1), tz),
      "custom",
      formatYmd(startParts.y, startParts.m, startParts.d),
      tz,
    );
  }

  const fromInstant = parseInstant(input.from);
  const toInstant = parseInstant(input.to);
  if (fromInstant && toInstant && toInstant > fromInstant) {
    return finish(fromInstant, toInstant, "custom", null, tz);
  }

  const parsedAnchor = parseYmd(input.date);
  const anchor =
    parsedAnchor ||
    (namedRange ? ymdFromInstant(now.getTime(), tz) : null);
  if (anchor && (namedRange || !input.minutes)) {
    return calendarBounds(anchor, namedRange || "day", tz);
  }

  const minutes = Math.min(Math.max(Number(input.minutes) || 30, 5), MAX_LIVE_MINUTES);
  return finish(new Date(now.getTime() - minutes * 60_000), now, "live", null, tz);
}

function alignBucketStart(ms: number, granularity: AnalyticsGranularity, tzOffsetMinutes: number): number {
  const shifted = new Date(ms + tzOffsetMinutes * 60_000);
  if (granularity === "minute") shifted.setUTCSeconds(0, 0);
  else if (granularity === "hour") shifted.setUTCMinutes(0, 0, 0);
  else if (granularity === "day") shifted.setUTCHours(0, 0, 0, 0);
  else {
    shifted.setUTCDate(1);
    shifted.setUTCHours(0, 0, 0, 0);
  }
  return shifted.getTime() - tzOffsetMinutes * 60_000;
}

function nextBucket(ms: number, granularity: AnalyticsGranularity, tzOffsetMinutes: number): number {
  if (granularity === "minute") return ms + 60_000;
  if (granularity === "hour") return ms + 3_600_000;
  if (granularity === "day") return ms + 86_400_000;
  const shifted = new Date(ms + tzOffsetMinutes * 60_000);
  const next = new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, 1));
  return next.getTime() - tzOffsetMinutes * 60_000;
}

function formatBucket(ms: number, granularity: AnalyticsGranularity, tzOffsetMinutes: number): string {
  const d = new Date(ms + tzOffsetMinutes * 60_000);
  const y = d.getUTCFullYear();
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const hour = pad(d.getUTCHours());
  const minute = pad(d.getUTCMinutes());
  if (granularity === "minute") return `${y}-${m}-${day} ${hour}:${minute}`;
  if (granularity === "hour") return `${y}-${m}-${day} ${hour}:00`;
  if (granularity === "day") return `${y}-${m}-${day}`;
  return `${y}-${m}`;
}

export function enumerateBucketKeys(
  from: Date,
  to: Date,
  granularity: AnalyticsGranularity,
  tzOffsetMinutes: number,
): string[] {
  const keys: string[] = [];
  let cursor = alignBucketStart(from.getTime(), granularity, tzOffsetMinutes);
  if (nextBucket(cursor, granularity, tzOffsetMinutes) <= from.getTime()) {
    cursor = nextBucket(cursor, granularity, tzOffsetMinutes);
  }
  let guard = 0;
  while (cursor < to.getTime() && guard < 400) {
    keys.push(formatBucket(cursor, granularity, tzOffsetMinutes));
    cursor = nextBucket(cursor, granularity, tzOffsetMinutes);
    guard += 1;
  }
  return keys;
}

export function fillSeries(
  sparse: SeriesPoint[],
  from: Date,
  to: Date,
  granularity: AnalyticsGranularity,
  tzOffsetMinutes: number,
): SeriesPoint[] {
  const keys = enumerateBucketKeys(from, to, granularity, tzOffsetMinutes);
  const counts = new Map(sparse.map((point) => [String(point.t), Number(point.views) || 0]));
  if (keys.length === 0) {
    return sparse.map((point) => ({ t: String(point.t), views: Number(point.views) || 0 }));
  }
  return keys.map((t) => ({ t, views: counts.get(t) || 0 }));
}
