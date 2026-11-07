import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import { ActivityService } from "../activity/activity.service";
import { UpdateSettingsDto } from "./dto/settings.dto";
import {
  resolveStoredFilePath,
  safeUnlink,
  SITE_UPLOADS_DIR,
} from "../../common/utils/file.utils";
import * as fs from "fs";
import * as path from "path";
import { imageSize } from "image-size";

type SettingsShape = {
  allowRegistration: boolean;
  defaultLanguage: string;
  notifyAdmins: boolean;
  activityRetentionDays: number;
};

type SiteImageRecord = {
  id: number;
  imagePath: string;
  sortOrder: number;
  title?: string | null;
  caption?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type SiteImagesShape = {
  heroUseDefault: boolean;
  backgroundUseDefault: boolean;
  heroImages: SiteImageRecord[];
  backgroundImages: SiteImageRecord[];
  backgroundImage: SiteImageRecord | null;
};

const DEFAULT_SETTINGS: SettingsShape = {
  allowRegistration: true,
  defaultLanguage: "en",
  notifyAdmins: true,
  activityRetentionDays: 90,
};

export type PaymentSettingsShape = {
  enabled: boolean;
  method: string;
  beneficiary: string;
  bank: string;
  account: string;
  reference: string;
  currency: string;
  instructions: string;
  proofRequired: boolean;
};

const DEFAULT_PAYMENT_SETTINGS: PaymentSettingsShape = {
  enabled: true,
  method: "Bank Transfer",
  beneficiary: "",
  bank: "",
  account: "",
  reference: "",
  currency: "USD",
  instructions: "",
  proofRequired: true,
};

const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as Array<
  keyof SettingsShape
>;
const SITE_HERO_USE_DEFAULT_KEY = "siteHeroUseDefault";
const SITE_BACKGROUND_USE_DEFAULT_KEY = "siteBackgroundUseDefault";

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @Inject("KnexConnection") private readonly knex,
    private readonly activityService: ActivityService,
  ) {}

  async onModuleInit() {
    try {
      await this.ensureSettingsSchema();
    } catch (err: any) {
      console.warn(`Settings schema init skipped: ${err?.message || err}`);
    }
  }

  private async ensureSettingsSchema() {
    if (!(await this.knex.schema.hasTable("app_settings"))) {
      await this.knex.schema.createTable("app_settings", (table) => {
        table.string("key").primary();
        table.text("value").notNullable();
        table.dateTime("updated_at").defaultTo(this.knex.fn.now());
      });
    }

    if (!(await this.knex.schema.hasTable("site_images"))) {
      await this.knex.schema.createTable("site_images", (table) => {
        table.increments("id").primary();
        table.string("type", 40).notNullable();
        table.string("image_path", 512).notNullable();
        table.integer("sort_order").notNullable().defaultTo(0);
        table.string("title", 255).nullable();
        table.text("caption").nullable();
        table.integer("width").nullable();
        table.integer("height").nullable();
        table.boolean("is_active").notNullable().defaultTo(false);
        table.dateTime("created_at").defaultTo(this.knex.fn.now());
        table.dateTime("updated_at").defaultTo(this.knex.fn.now());
        table.index(["type", "sort_order"]);
      });
    } else {
      if (!(await this.knex.schema.hasColumn("site_images", "updated_at"))) {
        await this.knex.schema.alterTable("site_images", (table) => {
          table.dateTime("updated_at").nullable();
        });
      }
      if (!(await this.knex.schema.hasColumn("site_images", "title"))) {
        await this.knex.schema.alterTable("site_images", (table) => {
          table.string("title", 255).nullable();
        });
      }
      if (!(await this.knex.schema.hasColumn("site_images", "caption"))) {
        await this.knex.schema.alterTable("site_images", (table) => {
          table.text("caption").nullable();
        });
      }
      if (!(await this.knex.schema.hasColumn("site_images", "width"))) {
        await this.knex.schema.alterTable("site_images", (table) => {
          table.integer("width").nullable();
        });
      }
      if (!(await this.knex.schema.hasColumn("site_images", "height"))) {
        await this.knex.schema.alterTable("site_images", (table) => {
          table.integer("height").nullable();
        });
      }
      if (!(await this.knex.schema.hasColumn("site_images", "is_active"))) {
        await this.knex.schema.alterTable("site_images", (table) => {
          table.boolean("is_active").notNullable().defaultTo(false);
        });
      }
    }
  }

  private static readonly BANNER_MIN_W = 1920;
  private static readonly BANNER_MIN_H = 1080;
  private static readonly BANNER_RATIO_MIN = 1.7;
  private static readonly BANNER_RATIO_MAX = 1.85;

  private isValidBannerDimensions(width: number, height: number) {
    const w = Number(width);
    const h = Number(height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return false;
    const ratio = w / h;
    return (
      w >= SettingsService.BANNER_MIN_W &&
      h >= SettingsService.BANNER_MIN_H &&
      ratio >= SettingsService.BANNER_RATIO_MIN &&
      ratio <= SettingsService.BANNER_RATIO_MAX
    );
  }

  formatBannerSlide(row: any) {
    return {
      id: Number(row.id),
      imagePath: row.image_path,
      imageUrl: row.image_path,
      width: row.width != null ? Number(row.width) : null,
      height: row.height != null ? Number(row.height) : null,
      title: row.title || null,
      caption: row.caption || null,
      isActive: Boolean(row.is_active),
      sortOrder: Number(row.sort_order || 0),
      createdAt: row.created_at,
    };
  }

  async listBannerSlides(activeOnly = false) {
    await this.ensureSettingsSchema();
    let query = this.knex("site_images")
      .where({ type: "banner" })
      .orderBy("sort_order", "asc")
      .orderBy("id", "asc");
    if (activeOnly) {
      query = query.andWhere({ is_active: true });
    }
    const rows = await query;
    return (rows || []).map((row: any) => this.formatBannerSlide(row));
  }

  /**
   * Import the homepage's current default diaporama images into the banner
   * library (idempotent). Used so admin cards show what is already playing.
   * Dimension hard-reject is skipped for these legacy slides only.
   */
  async seedHomepageDefaultBanners(actorId: number) {
    await this.ensureSettingsSchema();
    const existing = await this.knex("site_images")
      .where({ type: "banner" })
      .select("id", "image_path", "title");
    const existingPaths = new Set(
      existing.map((row: any) => String(row.image_path || "")),
    );
    const existingTitles = new Set(
      existing.map((row: any) => String(row.title || "").toLowerCase()),
    );

    const defaults = [
      {
        file: "01_Carthage_Ancient_Ruins_Landscape.jpg",
        title: "Carthage Ancient Ruins",
        dest: "banner-default-carthage.jpg",
      },
      {
        file: "11_Sidi_Bou_Said_Blue_Doors_Bougainvillea.jpg",
        title: "Sidi Bou Said Blue Doors",
        dest: "banner-default-sidi.jpg",
      },
      {
        file: "14_Kairouan_Mosque_Arched_Doorways_Dome.jpg",
        title: "Kairouan Mosque",
        dest: "banner-default-kairouan.jpg",
      },
      {
        file: "04_El_Jem_Amphitheater_Panorama.jpg",
        title: "El Jem Amphitheater",
        dest: "banner-default-eljem.jpg",
      },
      {
        file: "16_Medina_Ornate_Door_Blue_Grille.jpg",
        title: "Medina Ornate Door",
        dest: "banner-default-medina.jpg",
      },
      {
        file: "17_Fortress_Aerial_Courtyard_Palms.jpg",
        title: "Fortress Courtyard",
        dest: "banner-default-fortress.jpg",
      },
    ];

    // Prefer bundled backend assets (works in production). Fallback to frontend src in monorepo.
    const bundledDir = path.join(__dirname, "..", "..", "..", "assets", "banner-defaults");
    const monorepoFrontendDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "frontend",
      "src",
      "assets",
    );
    const assetsDir = fs.existsSync(bundledDir) ? bundledDir : monorepoFrontendDir;
    const maxRow = await this.knex("site_images")
      .where({ type: "banner" })
      .max("sort_order as max")
      .first();
    let nextOrder = Number(maxRow?.max || 0);
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    let created = 0;

    for (const item of defaults) {
      const imagePath = `/uploads/site/${item.dest}`;
      if (
        existingPaths.has(imagePath) ||
        existingTitles.has(item.title.toLowerCase())
      ) {
        continue;
      }

      const src = path.join(assetsDir, item.file);
      const destAbs = path.join(SITE_UPLOADS_DIR, item.dest);
      if (!fs.existsSync(src)) {
        console.warn(`Banner seed skipped missing asset: ${src}`);
        continue;
      }
      try {
        fs.copyFileSync(src, destAbs);
      } catch (err: any) {
        console.warn(`Banner seed copy failed for ${item.file}: ${err?.message || err}`);
        continue;
      }

      let width: number | null = null;
      let height: number | null = null;
      try {
        const dims = imageSize(fs.readFileSync(destAbs));
        width = Number(dims?.width || 0) || null;
        height = Number(dims?.height || 0) || null;
      } catch {
        /* keep null */
      }

      nextOrder += 1;
      await this.knex("site_images").insert({
        type: "banner",
        image_path: imagePath,
        sort_order: nextOrder,
        title: item.title,
        caption: null,
        width,
        height,
        is_active: true,
        created_at: now,
        updated_at: now,
      });
      created += 1;
    }

    if (created > 0) {
      await this.activityService.log(
        actorId,
        "settings",
        `Seeded ${created} homepage default banner slide(s)`,
      );
    }
    return {
      created,
      slides: await this.listBannerSlides(false),
    };
  }

  async addBannerSlide(
    file: Express.Multer.File,
    meta: { width?: number; height?: number; title?: string },
    actorId: number,
  ) {
    await this.ensureSettingsSchema();
    if (!file) {
      throw new BadRequestException(
        "Image file is required / Fichier image requis",
      );
    }

    // Measure real pixels from the uploaded file (do not trust client form fields)
    let width = 0;
    let height = 0;
    try {
      const buffer = fs.readFileSync(file.path);
      const dims = imageSize(buffer);
      width = Number(dims?.width || 0);
      height = Number(dims?.height || 0);
    } catch {
      safeUnlink(file.path);
      throw new BadRequestException(
        "Could not read image dimensions / Impossible de lire les dimensions de l'image",
      );
    }
    if (!this.isValidBannerDimensions(width, height)) {
      safeUnlink(file.path);
      throw new BadRequestException(
        `Banner rejected: must be at least 1920×1080 and 16:9 ratio (1.70–1.85). Got ${width || "?"}×${height || "?"}. / Bannière refusée : minimum 1920×1080 et ratio 16:9 (1,70–1,85). Reçu ${width || "?"}×${height || "?"}.`,
      );
    }

    const maxRow = await this.knex("site_images")
      .where({ type: "banner" })
      .max("sort_order as max")
      .first();
    const nextOrder = Number(maxRow?.max || 0) + 1;
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const imagePath = `/uploads/site/${file.filename}`;

    const [id] = await this.knex("site_images").insert({
      type: "banner",
      image_path: imagePath,
      sort_order: nextOrder,
      title: meta?.title || null,
      caption: null,
      width,
      height,
      is_active: false,
      created_at: now,
      updated_at: now,
    });

    await this.activityService.log(
      actorId,
      "settings",
      `Uploaded banner slide #${id}`,
    );
    const row = await this.knex("site_images").where({ id }).first();
    return this.formatBannerSlide(row);
  }

  async setBannerSelection(ids: number[], actorId: number) {
    await this.ensureSettingsSchema();
    const normalizedIds = (Array.isArray(ids) ? ids : [])
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0);
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    await this.knex("site_images")
      .where({ type: "banner" })
      .update({ is_active: false, updated_at: now });

    for (let i = 0; i < normalizedIds.length; i++) {
      await this.knex("site_images")
        .where({ id: normalizedIds[i], type: "banner" })
        .update({
          is_active: true,
          sort_order: i + 1,
          updated_at: now,
        });
    }

    await this.activityService.log(
      actorId,
      "settings",
      `Updated banner diaporama selection (${normalizedIds.length} active)`,
    );
    return this.listBannerSlides(false);
  }

  async updateBannerSlide(
    id: number,
    data: { title?: string; caption?: string; isActive?: boolean },
    actorId: number,
  ) {
    await this.ensureSettingsSchema();
    const row = await this.knex("site_images")
      .where({ id, type: "banner" })
      .first();
    if (!row) {
      throw new BadRequestException("Banner slide not found");
    }
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const update: any = { updated_at: now };
    if (data.title !== undefined) update.title = data.title || null;
    if (data.caption !== undefined) update.caption = data.caption || null;
    if (data.isActive !== undefined) update.is_active = Boolean(data.isActive);
    await this.knex("site_images")
      .where({ id, type: "banner" })
      .update(update);
    await this.activityService.log(
      actorId,
      "settings",
      `Updated banner slide #${id}`,
    );
    const updated = await this.knex("site_images").where({ id }).first();
    return this.formatBannerSlide(updated);
  }

  async deleteBannerSlide(id: number, actorId: number) {
    await this.ensureSettingsSchema();
    const row = await this.knex("site_images")
      .where({ id, type: "banner" })
      .first();
    if (!row) return { deleted: false };
    safeUnlink(resolveStoredFilePath(row.image_path));
    await this.knex("site_images").where({ id, type: "banner" }).delete();
    await this.activityService.log(
      actorId,
      "settings",
      `Deleted banner slide #${id}`,
    );
    return { deleted: true };
  }

  private parseValue(
    key: keyof SettingsShape,
    value: string | null | undefined,
  ) {
    if (value === undefined || value === null || value === "")
      return DEFAULT_SETTINGS[key];
    if (key === "allowRegistration" || key === "notifyAdmins") {
      return value === "true" || value === "1";
    }
    if (key === "activityRetentionDays") {
      const days = Number(value);
      if (!Number.isFinite(days)) return DEFAULT_SETTINGS.activityRetentionDays;
      return Math.min(365, Math.max(7, Math.round(days)));
    }
    if (key === "defaultLanguage") {
      return ["en", "fr", "ar", "es"].includes(value)
        ? value
        : DEFAULT_SETTINGS.defaultLanguage;
    }
    return value;
  }

  private serializeValue(value: boolean | number | string) {
    return String(value);
  }

  private parseBooleanSetting(
    value: string | null | undefined,
    fallback: boolean,
  ) {
    if (value === undefined || value === null || value === "") return fallback;
    const normalized = String(value).trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) return true;
    if (["false", "0", "no"].includes(normalized)) return false;
    return fallback;
  }

  private async readSetting(key: string, fallback: string) {
    await this.ensureSettingsSchema();
    const row = await this.knex("app_settings").where({ key }).first();
    return row?.value !== undefined && row?.value !== null
      ? String(row.value)
      : fallback;
  }

  private async writeSetting(key: string, value: boolean | number | string) {
    await this.ensureSettingsSchema();
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const serialized = String(value);
    const existing = await this.knex("app_settings").where({ key }).first();
    if (existing) {
      await this.knex("app_settings")
        .where({ key })
        .update({ value: serialized, updated_at: now });
    } else {
      await this.knex("app_settings").insert({
        key,
        value: serialized,
        updated_at: now,
      });
    }
  }

  private formatSiteImage(row: any): SiteImageRecord {
    return {
      id: Number(row.id),
      imagePath: row.image_path,
      sortOrder: Number(row.sort_order || 0),
      title: row.title || null,
      caption: row.caption || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getSettings(): Promise<SettingsShape> {
    await this.ensureSettingsSchema();
    const rows = await this.knex("app_settings")
      .whereIn("key", SETTING_KEYS)
      .select("key", "value");
    const stored = new Map<string, string>(
      rows.map((row: any) => [String(row.key), String(row.value)]),
    );

    return {
      allowRegistration: this.parseValue(
        "allowRegistration",
        stored.get("allowRegistration"),
      ) as boolean,
      defaultLanguage: this.parseValue(
        "defaultLanguage",
        stored.get("defaultLanguage"),
      ) as string,
      notifyAdmins: this.parseValue(
        "notifyAdmins",
        stored.get("notifyAdmins"),
      ) as boolean,
      activityRetentionDays: this.parseValue(
        "activityRetentionDays",
        stored.get("activityRetentionDays"),
      ) as number,
    };
  }

  async getPaymentSettings(): Promise<PaymentSettingsShape> {
    await this.ensureSettingsSchema();
    const keys = Object.keys(DEFAULT_PAYMENT_SETTINGS).map((key) => `payment.${key}`);
    const rows = await this.knex("app_settings").whereIn("key", keys).select("key", "value");
    const stored = new Map<string, string>(
      rows.map((row: any) => [String(row.key), String(row.value)]),
    );
    const result = { ...DEFAULT_PAYMENT_SETTINGS };
    for (const key of Object.keys(result) as Array<keyof PaymentSettingsShape>) {
      const value = stored.get(`payment.${key}`);
      if (value === undefined) continue;
      if (key === "enabled" || key === "proofRequired") {
        (result[key] as boolean) = this.parseBooleanSetting(value, result[key] as boolean);
      } else {
        (result[key] as string) = value;
      }
    }
    return result;
  }

  async updatePaymentSettings(data: Partial<PaymentSettingsShape>, actorId: number) {
    const current = await this.getPaymentSettings();
    const next: PaymentSettingsShape = {
      ...current,
      ...Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      ),
    } as PaymentSettingsShape;
    for (const key of Object.keys(next) as Array<keyof PaymentSettingsShape>) {
      await this.writeSetting(`payment.${key}`, next[key] as string | number | boolean);
    }
    await this.activityService.log(actorId, "settings", "Updated payment settings");
    return next;
  }

  async updateSettings(
    data: UpdateSettingsDto,
    actorId: number,
  ): Promise<SettingsShape> {
    await this.ensureSettingsSchema();
    const current = await this.getSettings();
    const next: SettingsShape = {
      allowRegistration: data.allowRegistration ?? current.allowRegistration,
      defaultLanguage: data.defaultLanguage ?? current.defaultLanguage,
      notifyAdmins: data.notifyAdmins ?? current.notifyAdmins,
      activityRetentionDays:
        data.activityRetentionDays !== undefined
          ? Math.min(
              365,
              Math.max(7, Math.round(Number(data.activityRetentionDays))),
            )
          : current.activityRetentionDays,
    };

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    for (const key of SETTING_KEYS) {
      const value = this.serializeValue(next[key]);
      const existing = await this.knex("app_settings").where({ key }).first();
      if (existing) {
        await this.knex("app_settings")
          .where({ key })
          .update({ value, updated_at: now });
      } else {
        await this.knex("app_settings").insert({ key, value, updated_at: now });
      }
    }

    await this.activityService.log(
      actorId,
      "settings",
      "Updated platform settings",
    );
    return next;
  }

  async getSiteImages(): Promise<SiteImagesShape> {
    await this.ensureSettingsSchema();
    const [heroDefault, backgroundDefault, heroRows, backgroundRows] =
      await Promise.all([
        this.readSetting(SITE_HERO_USE_DEFAULT_KEY, "true"),
        this.readSetting(SITE_BACKGROUND_USE_DEFAULT_KEY, "true"),
        this.knex("site_images")
          .where({ type: "hero" })
          .orderBy("sort_order", "asc")
          .orderBy("id", "asc"),
        this.knex("site_images")
          .where({ type: "background" })
          .orderBy("sort_order", "asc")
          .orderBy("id", "asc"),
      ]);
    const formattedBackgroundImages = backgroundRows.map((row: any) =>
      this.formatSiteImage(row),
    );

    return {
      heroUseDefault: this.parseBooleanSetting(heroDefault, true),
      backgroundUseDefault: this.parseBooleanSetting(backgroundDefault, true),
      heroImages: heroRows.map((row: any) => this.formatSiteImage(row)),
      backgroundImages: formattedBackgroundImages,
      backgroundImage:
        formattedBackgroundImages[formattedBackgroundImages.length - 1] || null,
    };
  }

  async updateHeroOptions(data: any, actorId: number) {
    if (data?.heroUseDefault !== undefined) {
      await this.writeSetting(
        SITE_HERO_USE_DEFAULT_KEY,
        this.parseBooleanSetting(data.heroUseDefault, true),
      );
      await this.activityService.log(
        actorId,
        "settings",
        "Updated hero image visibility",
      );
    }
    return this.getSiteImages();
  }

  async addHeroImages(files: Express.Multer.File[], actorId: number) {
    await this.ensureSettingsSchema();
    if (!files?.length)
      throw new BadRequestException("At least one hero image is required");

    const maxRow = await this.knex("site_images")
      .where({ type: "hero" })
      .max("sort_order as max")
      .first();
    let nextOrder = Number(maxRow?.max || 0);
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const rows = files.map((file) => {
      nextOrder += 1;
      return {
        type: "hero",
        image_path: `/uploads/site/${file.filename}`,
        sort_order: nextOrder,
        created_at: now,
        updated_at: now,
      };
    });

    await this.knex("site_images").insert(rows);
    await this.activityService.log(
      actorId,
      "settings",
      `Uploaded ${files.length} hero image(s)`,
    );
    return this.getSiteImages();
  }

  async updateHeroImage(
    id: number,
    data: { title?: string; caption?: string; sortOrder?: number },
    actorId: number,
  ) {
    await this.ensureSettingsSchema();
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const update: any = { updated_at: now };
    if (data.title !== undefined) update.title = data.title || null;
    if (data.caption !== undefined) update.caption = data.caption || null;
    if (data.sortOrder !== undefined)
      update.sort_order = Number(data.sortOrder);
    await this.knex("site_images").where({ id, type: "hero" }).update(update);
    await this.activityService.log(
      actorId,
      "settings",
      `Updated hero image #${id}`,
    );
    return this.getSiteImages();
  }

  async reorderHeroImages(ids: number[], actorId: number) {
    await this.ensureSettingsSchema();
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    for (let i = 0; i < ids.length; i++) {
      await this.knex("site_images")
        .where({ id: ids[i], type: "hero" })
        .update({ sort_order: i + 1, updated_at: now });
    }
    await this.activityService.log(
      actorId,
      "settings",
      "Reordered hero images",
    );
    return this.getSiteImages();
  }

  async deleteHeroImage(id: number, actorId: number) {
    await this.ensureSettingsSchema();
    const row = await this.knex("site_images")
      .where({ id, type: "hero" })
      .first();
    if (!row) return this.getSiteImages();
    safeUnlink(resolveStoredFilePath(row.image_path));
    await this.knex("site_images").where({ id, type: "hero" }).delete();
    await this.activityService.log(actorId, "settings", "Deleted hero image");
    return this.getSiteImages();
  }

  async updateBackgroundOptions(data: any, actorId: number) {
    if (data?.backgroundUseDefault !== undefined) {
      await this.writeSetting(
        SITE_BACKGROUND_USE_DEFAULT_KEY,
        this.parseBooleanSetting(data.backgroundUseDefault, true),
      );
      await this.activityService.log(
        actorId,
        "settings",
        "Updated background image visibility",
      );
    }
    return this.getSiteImages();
  }

  async addBackgroundImages(files: Express.Multer.File[], actorId: number) {
    await this.ensureSettingsSchema();
    if (!files?.length)
      throw new BadRequestException(
        "At least one background image is required",
      );

    const maxRow = await this.knex("site_images")
      .where({ type: "background" })
      .max("sort_order as max")
      .first();
    let nextOrder = Number(maxRow?.max || 0);

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const rows = files.map((file) => {
      nextOrder += 1;
      return {
        type: "background",
        image_path: `/uploads/site/${file.filename}`,
        sort_order: nextOrder,
        created_at: now,
        updated_at: now,
      };
    });

    await this.knex("site_images").insert(rows);
    await this.activityService.log(
      actorId,
      "settings",
      `Uploaded ${files.length} background image(s)`,
    );
    return this.getSiteImages();
  }

  async deleteBackgroundImage(id: number, actorId: number) {
    await this.ensureSettingsSchema();
    const row = await this.knex("site_images")
      .where({ id, type: "background" })
      .first();
    if (!row) return this.getSiteImages();
    safeUnlink(resolveStoredFilePath(row.image_path));
    await this.knex("site_images").where({ id, type: "background" }).delete();
    await this.activityService.log(
      actorId,
      "settings",
      "Deleted background image",
    );
    return this.getSiteImages();
  }

  async deleteBackgroundImages(actorId: number) {
    await this.ensureSettingsSchema();
    const existing = await this.knex("site_images")
      .where({ type: "background" })
      .select("id", "image_path");
    for (const row of existing) {
      safeUnlink(resolveStoredFilePath(row.image_path));
    }
    await this.knex("site_images").where({ type: "background" }).delete();
    await this.activityService.log(
      actorId,
      "settings",
      "Deleted background images",
    );
    return this.getSiteImages();
  }
}
