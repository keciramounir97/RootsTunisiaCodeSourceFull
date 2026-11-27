import { fillSeries, resolveAnalyticsWindow } from "./analytics-window";

describe("resolveAnalyticsWindow", () => {
  const now = new Date("2026-11-27T15:30:00.000Z");

  it("treats a calendar day in the admin timezone as local midnight bounds", () => {
    const window = resolveAnalyticsWindow({
      date: "2026-11-27",
      range: "day",
      tzOffsetMinutes: 60,
      now,
    });
    expect(window.range).toBe("day");
    expect(window.granularity).toBe("hour");
    expect(window.anchorDate).toBe("2026-11-27");
    expect(window.from.toISOString()).toBe("2026-11-26T23:00:00.000Z");
    expect(window.to.toISOString()).toBe("2026-11-27T23:00:00.000Z");
  });

  it("expands a week to the Monday-Sunday civil week", () => {
    const window = resolveAnalyticsWindow({
      date: "2026-11-27",
      range: "week",
      tzOffsetMinutes: 0,
      now,
    });
    expect(window.granularity).toBe("day");
    expect(window.from.toISOString()).toBe("2026-11-23T00:00:00.000Z");
    expect(window.to.toISOString()).toBe("2026-11-30T00:00:00.000Z");
  });

  it("uses every day of the calendar month, including leap day", () => {
    const window = resolveAnalyticsWindow({
      date: "2024-02-10",
      range: "month",
      tzOffsetMinutes: 0,
    });
    expect(window.granularity).toBe("day");
    expect(window.from.toISOString()).toBe("2024-02-01T00:00:00.000Z");
    expect(window.to.toISOString()).toBe("2024-03-01T00:00:00.000Z");
    expect(window.windowMinutes).toBe(29 * 24 * 60);
  });

  it("buckets a calendar year by month", () => {
    const window = resolveAnalyticsWindow({
      date: "2026-06-15",
      range: "year",
      tzOffsetMinutes: 0,
      now,
    });
    expect(window.range).toBe("year");
    expect(window.granularity).toBe("month");
    expect(window.from.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(window.to.toISOString()).toBe("2027-01-01T00:00:00.000Z");
    const series = fillSeries([], window.from, window.to, window.granularity, 0);
    expect(series.map((point) => point.t)).toEqual([
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
      "2026-11",
      "2026-12",
    ]);
  });

  it("keeps rolling minute windows when no calendar date is sent", () => {
    const window = resolveAnalyticsWindow({ minutes: 30, now });
    expect(window.range).toBe("live");
    expect(window.granularity).toBe("minute");
    expect(window.windowMinutes).toBe(30);
    expect(window.from.toISOString()).toBe("2026-11-27T15:00:00.000Z");
    expect(window.to.toISOString()).toBe(now.toISOString());
  });

  it("uses month buckets for a 365-day rolling window", () => {
    const window = resolveAnalyticsWindow({ minutes: 525600, now });
    expect(window.range).toBe("live");
    expect(window.granularity).toBe("month");
  });

  it("accepts inclusive from/to dates and rejects an impossible day", () => {
    const custom = resolveAnalyticsWindow({
      from: "2026-11-01",
      to: "2026-11-03",
      tzOffsetMinutes: 0,
    });
    expect(custom.range).toBe("custom");
    expect(custom.from.toISOString()).toBe("2026-11-01T00:00:00.000Z");
    expect(custom.to.toISOString()).toBe("2026-11-04T00:00:00.000Z");

    const fallback = resolveAnalyticsWindow({ date: "2026-02-29", minutes: 15, now });
    expect(fallback.range).toBe("live");
    expect(fallback.windowMinutes).toBe(15);
  });

  it("fills a local day with 24 hour buckets and overlays counts", () => {
    const window = resolveAnalyticsWindow({
      date: "2026-11-27",
      range: "day",
      tzOffsetMinutes: 60,
    });
    const series = fillSeries(
      [{ t: "2026-11-27 09:00", views: 4 }],
      window.from,
      window.to,
      window.granularity,
      window.tzOffsetMinutes,
    );
    expect(series).toHaveLength(24);
    expect(series[0].t).toBe("2026-11-27 00:00");
    expect(series[9]).toEqual({ t: "2026-11-27 09:00", views: 4 });
    expect(series[23].t).toBe("2026-11-27 23:00");
    expect(series.reduce((sum, point) => sum + point.views, 0)).toBe(4);
  });
});
