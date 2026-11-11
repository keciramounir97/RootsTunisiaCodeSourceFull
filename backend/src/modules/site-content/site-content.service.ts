import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { imageSize } from "image-size";
import { ActivityService } from "../activity/activity.service";
import { safeUnlink, SITE_CONTENT_UPLOADS_DIR } from "../../common/utils/file.utils";
import {
  collectUploadedFilenames,
  ContentPage,
  mergeWithDefaults,
  PublicSiteContent,
  sanitizePages,
  SITE_CONTENT_KEY,
  SITE_CONTENT_UPLOAD_URL_PREFIX,
  SITE_CONTENT_VERSION,
  SiteContentDocument,
  toPublicContent,
} from "./site-content.model";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

export const SITE_CONTENT_FILENAME_RE = /^[A-Za-z0-9._-]{1,200}$/;

const toIso = (value: unknown): string | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

@Injectable()
export class SiteContentService implements OnModuleInit {
  private readonly logger = new Logger(SiteContentService.name);
  private schemaReady: Promise<void> | null = null;
  private cachedDoc: SiteContentDocument | null = null;
  private cachedPublic: PublicSiteContent | null = null;
  private cacheExpiry = 0;

  constructor(
    @Inject("KnexConnection") private readonly knex,
    private readonly activityService: ActivityService,
  ) {}

  async onModuleInit() {
    try {
      await this.ensureSchema();
    } catch (err: any) {
      this.logger.warn(`Site content schema init skipped: ${err?.message || err}`);
    }
  }

  /** Idempotent, self-healing schema (also callable lazily on first request). */
  private ensureSchema(): Promise<void> {
    if (!this.schemaReady) {
      this.schemaReady = (async () => {
        if (!(await this.knex.schema.hasTable("site_content"))) {
          await this.knex.schema.createTable("site_content", (table) => {
            table.string("key", 100).primary();
            table.text("value", "longtext").notNullable();
            table.integer("updated_by").nullable();
            table.dateTime("updated_at").defaultTo(this.knex.fn.now());
          });
        }
        if (!(await this.knex.schema.hasTable("site_content_assets"))) {
          await this.knex.schema.createTable("site_content_assets", (table) => {
            table.string("filename", 255).primary();
            table.string("mime_type", 100).notNullable();
            table.specificType("data", "longblob").notNullable();
            table.integer("size").notNullable().defaultTo(0);
            table.dateTime("created_at").defaultTo(this.knex.fn.now());
          });
        }
      })().catch((err) => {
        this.schemaReady = null; // retry next time
        throw err;
      });
    }
    return this.schemaReady;
  }

  private async readStored(): Promise<{
    pages: ContentPage[] | null;
    updatedAt: string | null;
    updatedBy: number | null;
  }> {
    await this.ensureSchema();
    const row = await this.knex("site_content").where({ key: SITE_CONTENT_KEY }).first();
    if (!row) return { pages: null, updatedAt: null, updatedBy: null };
    let pages: ContentPage[] | null = null;
    try {
      const parsed = JSON.parse(String(row.value));
      pages = Array.isArray(parsed?.pages) ? parsed.pages : null;
    } catch (err: any) {
      this.logger.error(`Stored ${SITE_CONTENT_KEY} is not valid JSON: ${err?.message || err}`);
    }
    return {
      pages,
      updatedAt: toIso(row.updated_at),
      updatedBy: row.updated_by != null ? Number(row.updated_by) : null,
    };
  }

  /** Admin view: default schema overlaid with stored values (cached for 60s). */
  async getDocument(): Promise<SiteContentDocument> {
    const now = Date.now();
    if (this.cachedDoc && this.cacheExpiry > now) {
      return this.cachedDoc;
    }
    const stored = await this.readStored();
    const doc = {
      version: SITE_CONTENT_VERSION,
      updatedAt: stored.updatedAt,
      updatedBy: stored.updatedBy,
      pages: mergeWithDefaults(stored.pages),
    };
    this.cachedDoc = doc;
    this.cacheExpiry = now + 60000;
    return doc;
  }

  /** Public view: only non-empty overrides (cached for 60s). */
  async getPublicContent(): Promise<PublicSiteContent> {
    const now = Date.now();
    if (this.cachedPublic && this.cacheExpiry > now) {
      return this.cachedPublic;
    }
    const doc = await this.getDocument();
    const pub = toPublicContent(doc);
    this.cachedPublic = pub;
    return pub;
  }

  async saveDocument(body: any, actorId: number): Promise<SiteContentDocument> {
    this.cachedDoc = null;
    this.cachedPublic = null;
    this.cacheExpiry = 0;
    if (!body || typeof body !== "object") {
      throw new BadRequestException("Request body must be an object with `pages`");
    }
    const pages = sanitizePages(body.pages);
    const previous = await this.readStored();

    const payload = JSON.stringify({ version: SITE_CONTENT_VERSION, pages });
    const now = new Date();
    const existing = await this.knex("site_content").where({ key: SITE_CONTENT_KEY }).first();
    if (existing) {
      await this.knex("site_content")
        .where({ key: SITE_CONTENT_KEY })
        .update({ value: payload, updated_by: actorId ?? null, updated_at: now });
    } else {
      await this.knex("site_content").insert({
        key: SITE_CONTENT_KEY,
        value: payload,
        updated_by: actorId ?? null,
        updated_at: now,
      });
    }

    await this.removeOrphanedUploads(previous.pages || [], pages);
    try {
      await this.activityService.log(actorId, "settings", "Updated public site content");
    } catch (err: any) {
      this.logger.warn(`Activity log failed: ${err?.message || err}`);
    }
    return this.getDocument();
  }

  /** Delete uploaded images that were referenced before this save but are not anymore. */
  private async removeOrphanedUploads(before: ContentPage[], after: ContentPage[]) {
    try {
      const stillUsed = collectUploadedFilenames(after);
      for (const name of collectUploadedFilenames(before)) {
        if (stillUsed.has(name)) continue;
        safeUnlink(path.join(SITE_CONTENT_UPLOADS_DIR, name));
        await this.knex("site_content_assets").where({ filename: name }).delete();
      }
    } catch (err: any) {
      this.logger.warn(`Orphan upload cleanup failed: ${err?.message || err}`);
    }
  }

  async registerUpload(file: Express.Multer.File, actorId: number) {
    if (!file) {
      throw new BadRequestException("Image file is required (field name: image)");
    }
    let buffer: Buffer;
    let width = 0;
    let height = 0;
    try {
      buffer = fs.readFileSync(file.path);
      const dims = imageSize(buffer);
      width = Number(dims?.width || 0);
      height = Number(dims?.height || 0);
    } catch {
      safeUnlink(file.path);
      throw new BadRequestException("File is not a readable image");
    }
    if (!width || !height) {
      safeUnlink(file.path);
      throw new BadRequestException("Could not read image dimensions");
    }

    // Durable copy in the database: container disks can be ephemeral.
    try {
      await this.ensureSchema();
      const ext = path.extname(file.filename).toLowerCase();
      await this.knex("site_content_assets").insert({
        filename: file.filename,
        mime_type: MIME_BY_EXT[ext] || file.mimetype || "application/octet-stream",
        data: buffer,
        size: buffer.length,
      });
    } catch (err: any) {
      this.logger.warn(
        `Could not persist ${file.filename} in the database (disk copy only): ${err?.message || err}`,
      );
    }

    try {
      await this.activityService.log(actorId, "settings", `Uploaded site content image ${file.filename}`);
    } catch {
      /* non-blocking */
    }
    return {
      url: `${SITE_CONTENT_UPLOAD_URL_PREFIX}${file.filename}`,
      filename: file.filename,
      width,
      height,
      size: buffer.length,
    };
  }

  /** DB fallback used when the file is missing on disk (see main.ts). */
  async getAsset(filename: string): Promise<{ mimeType: string; data: Buffer } | null> {
    if (!SITE_CONTENT_FILENAME_RE.test(filename)) return null;
    await this.ensureSchema();
    const row = await this.knex("site_content_assets").where({ filename }).first();
    if (!row?.data) return null;
    return { mimeType: String(row.mime_type), data: Buffer.from(row.data) };
  }
}
