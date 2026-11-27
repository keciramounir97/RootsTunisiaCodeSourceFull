import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Knex } from "knex";
import * as crypto from "crypto";

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

  /** Max ~365 days of minute-based windows (first-party aggregates). */
  private static readonly MAX_LIVE_WINDOW_MINUTES = 525_600;

  private seriesBucketSql(windowMin: number): string {
    if (windowMin <= 3 * 60) {
      return "DATE_FORMAT(created_at, '%Y-%m-%d %H:%i')";
    }
    if (windowMin <= 24 * 60) {
      return "DATE_FORMAT(created_at, '%Y-%m-%d %H:00')";
    }
    if (windowMin <= 7 * 24 * 60) {
      return "DATE_FORMAT(created_at, '%Y-%m-%d')";
    }
    if (windowMin <= 45 * 24 * 60) {
      return "DATE_FORMAT(created_at, '%x-%v')";
    }
    return "DATE_FORMAT(created_at, '%Y-%m')";
  }

  async getLive(minutes = 30) {
    await this.ensureTable();
    const windowMin = Math.min(
      Math.max(Number(minutes) || 30, 5),
      AnalyticsService.MAX_LIVE_WINDOW_MINUTES,
    );
    const bucketSql = this.seriesBucketSql(windowMin);

    const [activeSessionsRow] = await this.knex("analytics_pageviews")
      .whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)", [windowMin])
      .countDistinct({ c: "session_id" });
    const [activeVisitorsRow] = await this.knex("analytics_pageviews")
      .whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)", [windowMin])
      .countDistinct({ c: "visitor_hash" });
    const [pageviewsRow] = await this.knex("analytics_pageviews")
      .whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)", [windowMin])
      .count({ c: "*" });

    const topPages = await this.knex("analytics_pageviews")
      .select("path")
      .count({ views: "*" })
      .whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)", [windowMin])
      .groupBy("path")
      .orderBy("views", "desc")
      .limit(12);

    const recent = await this.knex("analytics_pageviews")
      .select("path", "title", "locale", "referrer", "created_at")
      .orderBy("created_at", "desc")
      .limit(25);

    const byBucket = await this.knex("analytics_pageviews")
      .select(this.knex.raw(`${bucketSql} as bucket`))
      .count({ views: "*" })
      .whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)", [windowMin])
      .groupBy("bucket")
      .orderBy("bucket", "asc");

    return {
      windowMinutes: windowMin,
      activeSessions: Number((activeSessionsRow as any)?.c || 0),
      activeVisitors: Number((activeVisitorsRow as any)?.c || 0),
      pageviews: Number((pageviewsRow as any)?.c || 0),
      topPages: topPages.map((r: any) => ({ path: r.path, views: Number(r.views || 0) })),
      recent,
      series: byBucket.map((r: any) => ({ t: r.bucket, views: Number(r.views || 0) })),
      seriesGranularity:
        windowMin <= 3 * 60
          ? "minute"
          : windowMin <= 24 * 60
            ? "hour"
            : windowMin <= 7 * 24 * 60
              ? "day"
              : windowMin <= 45 * 24 * 60
                ? "week"
                : "month",
      source: "first_party",
      generatedAt: new Date().toISOString(),
    };
  }

  getGaConfigStatus() {
    const measurementId = process.env.GA_MEASUREMENT_ID || process.env.VITE_GA_MEASUREMENT_ID || "G-X750JBGTXR";
    const propertyId = process.env.GA4_PROPERTY_ID || "566029672";
    const hasServiceAccount = Boolean(
      process.env.GA_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS,
    );
    return {
      measurementId: measurementId || null,
      propertyId: propertyId || null,
      dataApiConfigured: Boolean(propertyId && hasServiceAccount),
      searchConsoleVerification: process.env.GOOGLE_SITE_VERIFICATION || null,
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
        message:
          "Set GA4_PROPERTY_ID and GA_SERVICE_ACCOUNT_JSON on the backend to stream Google Analytics realtime metrics.",
        status,
      };
    }

    try {
      const token = await this.getGoogleAccessToken();
      const propertyId = String(process.env.GA4_PROPERTY_ID).replace(/^properties\//, "");
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
