import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Knex } from "knex";
import * as crypto from "crypto";
import {
  fillSeries,
  resolveAnalyticsWindow,
  type AnalyticsGranularity,
  type AnalyticsQuery,
} from "./analytics-window";

type CollectPayload = {
  path?: string;
  title?: string;
  referrer?: string;
  locale?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
};

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(@Inject("KnexConnection") private readonly knex: Knex) {}

  async ensureTable() {
    if (!(await this.knex.schema.hasTable("analytics_pageviews"))) {
      await this.knex.schema.createTable("analytics_pageviews", (t) => {
        t.bigIncrements("id");
        t.string("path", 500).notNullable().index();
        t.string("title", 500).nullable();
        t.string("referrer", 1000).nullable();
        t.string("locale", 16).nullable().index();
        t.string("session_id", 64).nullable().index();
        t.string("visitor_hash", 64).nullable().index();
        t.string("user_agent", 500).nullable();
        t.timestamp("created_at").defaultTo(this.knex.fn.now()).index();
      });
      this.logger.log("Created analytics_pageviews table");
    }
  }

  private visitorHash(ip?: string, ua?: string) {
    const raw = `${ip || "0.0.0.0"}|${(ua || "").slice(0, 180)}`;
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 32);
  }

  async collect(payload: CollectPayload) {
    await this.ensureTable();
    const path = String(payload.path || "/").slice(0, 500);
    if (!path.startsWith("/")) return { ok: false };
    // Never store admin/API noise as public pageviews
    if (path.startsWith("/admin") || path.startsWith("/api")) return { ok: true, skipped: true };

    await this.knex("analytics_pageviews").insert({
      path,
      title: payload.title ? String(payload.title).slice(0, 500) : null,
      referrer: payload.referrer ? String(payload.referrer).slice(0, 1000) : null,
      locale: payload.locale ? String(payload.locale).slice(0, 16) : null,
      session_id: payload.sessionId ? String(payload.sessionId).slice(0, 64) : null,
      visitor_hash: this.visitorHash(payload.ip, payload.userAgent),
      user_agent: payload.userAgent ? String(payload.userAgent).slice(0, 500) : null,
    });
    return { ok: true };
  }

  async getLive(input: number | AnalyticsQuery = 30) {
    await this.ensureTable();
    const query: AnalyticsQuery = typeof input === "number" ? { minutes: input } : input || {};
    const window = resolveAnalyticsWindow(query);
    const fromSec = Math.floor(window.from.getTime() / 1000);
    const toSec = Math.floor(window.to.getTime() / 1000);
    const sessionOffset = await this.sessionOffsetMinutes();
    const bucketSql = this.bucketSql(window.granularity, window.tzOffsetMinutes - sessionOffset);
    const inWindow = "UNIX_TIMESTAMP(created_at) >= ? AND UNIX_TIMESTAMP(created_at) < ?";
    const bounds = [fromSec, toSec];

    const [activeSessionsRow] = await this.knex("analytics_pageviews")
      .whereRaw(inWindow, bounds)
      .countDistinct({ c: "session_id" });
    const [activeVisitorsRow] = await this.knex("analytics_pageviews")
      .whereRaw(inWindow, bounds)
      .countDistinct({ c: "visitor_hash" });
    const [pageviewsRow] = await this.knex("analytics_pageviews")
      .whereRaw(inWindow, bounds)
      .count({ c: "*" });

    const topPages = await this.knex("analytics_pageviews")
      .select("path")
      .count({ views: "*" })
      .whereRaw(inWindow, bounds)
      .groupBy("path")
      .orderBy("views", "desc")
      .limit(12);

    const recent = await this.knex("analytics_pageviews")
      .select("path", "title", "locale", "referrer", "created_at")
      .whereRaw(inWindow, bounds)
      .orderBy("created_at", "desc")
      .limit(25);

    const byBucket = await this.knex("analytics_pageviews")
      .select(this.knex.raw(`${bucketSql} as bucket`))
      .count({ views: "*" })
      .whereRaw(inWindow, bounds)
      .groupBy("bucket")
      .orderBy("bucket", "asc");

    const sparse = byBucket.map((r: any) => ({ t: String(r.bucket ?? ""), views: Number(r.views || 0) }));

    return {
      windowMinutes: window.windowMinutes,
      range: window.range,
      from: window.from.toISOString(),
      to: window.to.toISOString(),
      anchorDate: window.anchorDate,
      tzOffsetMinutes: window.tzOffsetMinutes,
      activeSessions: Number((activeSessionsRow as any)?.c || 0),
      activeVisitors: Number((activeVisitorsRow as any)?.c || 0),
      pageviews: Number((pageviewsRow as any)?.c || 0),
      topPages: topPages.map((r: any) => ({ path: r.path, views: Number(r.views || 0) })),
      recent,
      series: fillSeries(sparse, window.from, window.to, window.granularity, window.tzOffsetMinutes),
      seriesGranularity: window.granularity,
      source: "first_party",
      generatedAt: new Date().toISOString(),
    };
  }

  private async sessionOffsetMinutes(): Promise<number> {
    try {
      const raw = await this.knex.raw("SELECT TIMESTAMPDIFF(MINUTE, UTC_TIMESTAMP(), NOW()) AS off");
      const rows = Array.isArray(raw) ? raw[0] : raw?.rows;
      const first = Array.isArray(rows) ? rows[0] : rows;
      const off = Number(first?.off);
      return Number.isFinite(off) ? off : 0;
    } catch (err: any) {
      this.logger.warn(`analytics timezone lookup failed: ${err?.message || err}`);
      return 0;
    }
  }

  private bucketSql(granularity: AnalyticsGranularity, shiftMinutes: number): string {
    const shift = Math.trunc(Number.isFinite(shiftMinutes) ? shiftMinutes : 0);
    const expr = shift === 0 ? "created_at" : `DATE_ADD(created_at, INTERVAL ${shift} MINUTE)`;
    const fmt =
      granularity === "minute"
        ? "%Y-%m-%d %H:%i"
        : granularity === "hour"
          ? "%Y-%m-%d %H:00"
          : granularity === "day"
            ? "%Y-%m-%d"
            : "%Y-%m";
    return `DATE_FORMAT(${expr}, '${fmt}')`;
  }

  getGaConfigStatus() {
    const measurementId = String(
      process.env.GA_MEASUREMENT_ID || process.env.VITE_GA_MEASUREMENT_ID || "G-X750JBGTXR",
    ).trim();
    const propertyId = String(process.env.GA4_PROPERTY_ID || "566029672")
      .trim()
      .replace(/^properties\//, "");
    const searchConsoleVerification = String(process.env.GOOGLE_SITE_VERIFICATION || "").trim();
    const hasServiceAccount = Boolean(
      process.env.GA_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS,
    );
    return {
      measurementId: measurementId || null,
      propertyId: propertyId || null,
      measurementConfigured: Boolean(measurementId),
      propertyConfigured: Boolean(propertyId),
      dataApiConfigured: Boolean(propertyId && hasServiceAccount),
      searchConsoleVerification: searchConsoleVerification || null,
      searchConsoleConfigured: Boolean(searchConsoleVerification),
    };
  }

  /**
   * Optional Google Analytics Data API realtime pull.
   * Requires GA4_PROPERTY_ID + GA_SERVICE_ACCOUNT_JSON (stringified service account).
   */
  async getGaRealtime() {
    const status = this.getGaConfigStatus();
    if (!status.dataApiConfigured) {
      return {
        configured: false,
        message: status.propertyId
          ? "Google Analytics property is configured. Add GA_SERVICE_ACCOUNT_JSON to load realtime users from the Data API."
          : "Set GA_MEASUREMENT_ID, GA4_PROPERTY_ID, and GA_SERVICE_ACCOUNT_JSON to connect Google Analytics realtime metrics.",
        status,
      };
    }

    try {
      const token = await this.getGoogleAccessToken();
      const propertyId = String(status.propertyId || "").replace(/^properties\//, "");
      const res = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dimensions: [{ name: "unifiedScreenName" }],
            metrics: [{ name: "activeUsers" }],
            limit: 12,
          }),
        },
      );
      const json: any = await res.json();
      if (!res.ok) {
        return { configured: true, error: json?.error?.message || `GA API HTTP ${res.status}`, status };
      }
      const rows = Array.isArray(json.rows)
        ? json.rows.map((row: any) => ({
            page: row.dimensionValues?.[0]?.value || "(not set)",
            activeUsers: Number(row.metricValues?.[0]?.value || 0),
          }))
        : [];
      const activeUsers = rows.reduce((sum: number, r: any) => sum + (r.activeUsers || 0), 0);
      return {
        configured: true,
        activeUsers,
        topScreens: rows,
        status,
        generatedAt: new Date().toISOString(),
        source: "google_analytics_realtime",
      };
    } catch (err: any) {
      this.logger.warn(`GA realtime failed: ${err?.message || err}`);
      return { configured: true, error: err?.message || String(err), status };
    }
  }

  private async getGoogleAccessToken(): Promise<string> {
    const raw = process.env.GA_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("GA_SERVICE_ACCOUNT_JSON missing");
    const sa = JSON.parse(raw);
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
    const claim = Buffer.from(
      JSON.stringify({
        iss: sa.client_email,
        scope: "https://www.googleapis.com/auth/analytics.readonly",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      }),
    ).toString("base64url");
    const unsigned = `${header}.${claim}`;
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsigned);
    const signature = signer.sign(sa.private_key, "base64url");
    const jwt = `${unsigned}.${signature}`;

    const body = new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    });
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const tokenJson: any = await tokenRes.json();
    if (!tokenRes.ok || !tokenJson.access_token) {
      throw new Error(tokenJson?.error_description || tokenJson?.error || "Failed to obtain Google access token");
    }
    return tokenJson.access_token as string;
  }
}
