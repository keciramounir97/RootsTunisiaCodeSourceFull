import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type AnalyticsRangeMode = "live" | "day" | "week" | "month" | "year";

type CalendarLabels = {
  live: string;
  day: string;
  week: string;
  month: string;
  year: string;
  prev: string;
  next: string;
  pick: string;
};

type AnalyticsCalendarProps = {
  anchor: string;
  range: AnalyticsRangeMode;
  locale: string;
  isRtl?: boolean;
  summary?: string;
  minutes: number;
  labels: CalendarLabels;
  onAnchorChange: (ymd: string) => void;
  onRangeChange: (range: AnalyticsRangeMode) => void;
  onMinutesChange: (minutes: number) => void;
};

const RANGES: AnalyticsRangeMode[] = ["live", "day", "week", "month", "year"];
const LIVE_WINDOWS = [
  { value: 15, label: "15m" },
  { value: 30, label: "30m" },
  { value: 60, label: "1h" },
  { value: 180, label: "3h" },
  { value: 1440, label: "24h" },
];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toYmd(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayYmd(): string {
  return toYmd(new Date());
}

export function tzOffsetMinutesForYmd(ymd: string): number {
  const [year, month, day] = ymd.split("-").map(Number);
  const localNoon = new Date(year, (month || 1) - 1, day || 1, 12, 0, 0, 0);
  return -localNoon.getTimezoneOffset();
}

function parseLocalYmd(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function firstWeekday(locale: string): number {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { firstDay?: number };
      getWeekInfo?: () => { firstDay?: number };
    };
    const first = info.weekInfo?.firstDay ?? info.getWeekInfo?.()?.firstDay;
    if (first === 7) return 0;
    if (typeof first === "number" && first >= 0 && first <= 6) return first;
  } catch {
    // Older runtimes omit weekInfo.
  }
  const lang = locale.toLowerCase();
  if (lang.startsWith("ar")) return 6;
  if (lang.startsWith("en")) return 0;
  return 1;
}

function isoWeekStart(value: string): string {
  const date = parseLocalYmd(value);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return toYmd(date);
}

export default function AnalyticsCalendar({
  anchor,
  range,
  locale,
  isRtl = false,
  summary,
  minutes,
  labels,
  onAnchorChange,
  onRangeChange,
  onMinutesChange,
}: AnalyticsCalendarProps) {
  const [viewYear, setViewYear] = useState(() => parseLocalYmd(anchor).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => parseLocalYmd(anchor).getMonth());

  useEffect(() => {
    const date = parseLocalYmd(anchor);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  }, [anchor]);

  const today = todayYmd();
  const weekStart = firstWeekday(locale);
  const anchorWeek = isoWeekStart(anchor);
  const anchorDate = parseLocalYmd(anchor);
  const monthTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(viewYear, viewMonth, 1),
  );
  const dayFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const weekdayLabels = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    return Array.from({ length: 7 }, (_, index) => {
      const wanted = (weekStart + index) % 7;
      return format.format(new Date(2026, 10, 1 + wanted));
    });
  }, [locale, weekStart]);

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const offset = (first.getDay() - weekStart + 7) % 7;
    const cursor = new Date(viewYear, viewMonth, 1 - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(cursor);
      date.setDate(cursor.getDate() + index);
      return date;
    });
  }, [viewMonth, viewYear, weekStart]);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const rangeLabel = (mode: AnalyticsRangeMode) => labels[mode];

  return (
    <section
      className="rounded-2xl border border-[#3a2c28] bg-[#171311] p-4 text-[#f6efe8] shadow-[0_18px_40px_rgba(28,16,12,0.28)]"
      aria-label={labels.pick}
    >
      <div className="grid grid-cols-5 gap-1 mb-4" role="group" aria-label={labels.pick}>
        {RANGES.map((mode) => {
          const selected = range === mode;
          return (
            <button
              key={mode}
              type="button"
              aria-pressed={selected}
              onClick={() => onRangeChange(mode)}
              className={`rounded-full px-1.5 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e08a72] ${
                selected ? "bg-[#e08a72] text-[#2b140f]" : "text-[#f6efe8]/75 hover:bg-white/10"
              }`}
            >
              {rangeLabel(mode)}
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label={labels.prev}
          onClick={() => shiftMonth(-1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#f6efe8]/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e08a72]"
        >
          <PrevIcon className="h-4 w-4" />
        </button>
        <h2 className="text-sm font-semibold capitalize">{monthTitle}</h2>
        <button
          type="button"
          aria-label={labels.next}
          onClick={() => shiftMonth(1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#f6efe8]/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e08a72]"
        >
          <NextIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {weekdayLabels.map((label, index) => (
          <div key={`${label}-${index}`} className="py-1 text-center text-[11px] text-[#f6efe8]/45">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1" role="grid">
        {cells.map((date) => {
          const value = toYmd(date);
          const inMonth = date.getMonth() === viewMonth;
          const isToday = value === today;
          const isFuture = value > today;
          const isSelected = range !== "live" && value === anchor;
          const inSelectedWeek = range === "week" && isoWeekStart(value) === anchorWeek && !isFuture;
          const inSelectedMonth =
            range === "month" &&
            date.getFullYear() === anchorDate.getFullYear() &&
            date.getMonth() === anchorDate.getMonth() &&
            !isFuture;

          return (
            <button
              key={value}
              type="button"
              role="gridcell"
              disabled={isFuture}
              aria-selected={isSelected}
              aria-current={isToday ? "date" : undefined}
              aria-label={dayFormatter.format(date)}
              onClick={() => {
                onAnchorChange(value);
                if (range === "live") onRangeChange("day");
              }}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e08a72] disabled:cursor-not-allowed disabled:bg-transparent disabled:text-[#f6efe8]/25 disabled:hover:bg-transparent ${
                isSelected
                  ? "bg-[#e08a72] font-semibold text-[#2b140f] shadow-[0_0_0_4px_rgba(224,138,114,0.2)]"
                  : inSelectedWeek || inSelectedMonth
                    ? "bg-[#e08a72]/25 text-[#f6efe8] hover:bg-[#e08a72]/40"
                    : isToday
                      ? "text-[#e08a72] ring-1 ring-[#e08a72]/80 hover:bg-white/10"
                      : inMonth
                        ? "text-[#f6efe8]/90 hover:bg-white/10"
                        : "text-[#f6efe8]/30 hover:bg-white/10"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {range === "live" ? (
        <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label={labels.live}>
          {LIVE_WINDOWS.map((option) => {
            const selected = minutes === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onMinutesChange(option.value)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e08a72] ${
                  selected ? "bg-[#e08a72] text-[#2b140f]" : "bg-white/10 text-[#f6efe8]/75 hover:bg-white/20"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {summary ? <p className="mt-3 text-xs text-[#f6efe8]/70">{summary}</p> : null}
    </section>
  );
}
