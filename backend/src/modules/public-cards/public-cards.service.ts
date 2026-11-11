import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { ActivityService } from "../activity/activity.service";
import { VERIFIED_ARCHIVES_SEED } from "./public-cards.seed";

export type PublicCardKind = "source" | "archive" | "directory" | "all";
export const PUBLIC_CARD_KINDS: PublicCardKind[] = ["source", "archive", "directory", "all"];

export interface PublicCardTranslation {
  title?: string;
  description?: string;
}

export interface PublicCard {
  id: number;
  kind: PublicCardKind;
  category?: string;
  badge?: string;
  tags?: string[];
  title: string;
  description: string;
  link: string;
  translations: Record<string, PublicCardTranslation>;
  sortOrder: number;
  isPublished: boolean;
  updatedAt: string | null;
}

const LOCALE_RE = /^[a-z]{2,3}$/;
const TABLE = "public_cards";
const LOCATIONS_TABLE = "public_card_locations";

const clean = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

/** Only http(s), mailto, tel and site-relative links are accepted. */
export function sanitizeLink(value: unknown): string {
  const raw = clean(value, 1000);
  if (!raw) return "";
  const compact = raw.replace(/[\u0000-\u0020]+/g, "").toLowerCase();
  if (compact.startsWith("/") && !compact.startsWith("//")) return raw;
  if (/^(https?:|mailto:|tel:)/.test(compact)) return raw;
  // bare domain typed by the admin (e.g. www.archives.nat.tn)
  if (/^[a-z0-9.-]+\.[a-z]{2,}([/?#].*)?$/i.test(raw)) return `https://${raw}`;
  throw new BadRequestException(
    "Invalid link. Use https://…, a site path like /gallery/trees, mailto: or tel:.",
  );
}

function sanitizeTranslations(input: unknown): Record<string, PublicCardTranslation> {
  const out: Record<string, PublicCardTranslation> = {};
  if (!input || typeof input !== "object") return out;
  for (const [locale, raw] of Object.entries(input as Record<string, any>)) {
    if (!LOCALE_RE.test(locale)) continue;
    const title = clean(raw?.title, 255);
    const description = clean(raw?.description, 4000);
    if (title || description) out[locale] = { ...(title ? { title } : {}), ...(description ? { description } : {}) };
  }
  return out;
}

const toIso = (value: unknown): string | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

@Injectable()
export class PublicCardsService implements OnModuleInit {
  private readonly logger = new Logger(PublicCardsService.name);
  private schemaReady: Promise<void> | null = null;

  constructor(
    @Inject("KnexConnection") private readonly knex,
    private readonly activityService: ActivityService,
  ) {}

  async onModuleInit() {
    try {
      await this.ensureSchema();
    } catch (err: any) {
      this.logger.warn(`Public cards schema init skipped: ${err?.message || err}`);
    }
  }

  /** Creates the table and seeds it ONCE (from the cards that were previously built into the site). */
  private ensureSchema(): Promise<void> {
    if (!this.schemaReady) {
      this.schemaReady = (async () => {
        // Ensure locations table exists
        if (!(await this.knex.schema.hasTable(LOCATIONS_TABLE))) {
          await this.knex.schema.createTable(LOCATIONS_TABLE, (table) => {
            table.increments("id").primary();
            table.string("key", 64).notNullable().unique();
            table.string("label", 128).notNullable();
            table.string("icon", 64).nullable();
            table.string("description", 500).nullable();
            table.integer("sort_order").notNullable().defaultTo(0);
          });
          const defaultLocations = [
            { key: "tunisia", label: "Tunisie", icon: "Landmark", description: "Archives d'État, dépôts notariaux et fonds beylicaux", sort_order: 1 },
            { key: "france", label: "France", icon: "Building2", description: "Fonds du Protectorat, CADN, ANOM et SHD", sort_order: 2 },
            { key: "italy", label: "Italie & Sicile", icon: "Ship", description: "État civil Antenati, consulats et archives provinciales", sort_order: 3 },
            { key: "malta", label: "Malte", icon: "Shield", description: "Archives nationales maltaises et registres paroissiaux", sort_order: 4 },
            { key: "uk", label: "Royaume-Uni", icon: "Crown", description: "Foreign Office, consulat général et sépultures alliées", sort_order: 5 },
            { key: "jewish", label: "Fonds Juifs", icon: "Scroll", description: "Cercle de généalogie, AIU, SHJT et archives rabbiniques", sort_order: 6 },
            { key: "ottoman", label: "Ottoman & Islamique", icon: "Moon", description: "Archives impériales ottomanes, IRCICA et Zitouna", sort_order: 7 },
            { key: "maghreb", label: "Algérie & Maghreb", icon: "Globe", description: "Archives transfrontalières d'Afrique du Nord", sort_order: 8 },
          ];
          for (const loc of defaultLocations) {
            await this.knex(LOCATIONS_TABLE).insert(loc);
          }
        }

        if (await this.knex.schema.hasTable(TABLE)) {
          // Check for missing columns
          if (!(await this.knex.schema.hasColumn(TABLE, "category"))) {
            await this.knex.schema.alterTable(TABLE, (table) => {
              table.string("category", 64).nullable().defaultTo("tunisia");
            });
          }
          if (!(await this.knex.schema.hasColumn(TABLE, "badge"))) {
            await this.knex.schema.alterTable(TABLE, (table) => {
              table.string("badge", 128).nullable();
            });
          }
          if (!(await this.knex.schema.hasColumn(TABLE, "tags"))) {
            await this.knex.schema.alterTable(TABLE, (table) => {
              table.text("tags", "longtext").nullable();
            });
          }
          // Seed verified archives if empty or only legacy cards exist
          const countObj = await this.knex(TABLE).count("id as count").first();
          const count = Number(countObj?.count || 0);
          const hasBadgedCard = await this.knex(TABLE).whereNotNull("badge").whereNot("badge", "").first();
          if (count === 0 || !hasBadgedCard) {
            await this.seedVerifiedArchives();
          }
          return;
        }

        await this.knex.schema.createTable(TABLE, (table) => {
          table.increments("id").primary();
          table.string("kind", 20).notNullable().index();
          table.string("slug", 64).nullable();
          table.string("category", 64).nullable().defaultTo("tunisia");
          table.string("badge", 128).nullable();
          table.text("tags", "longtext").nullable();
          table.string("title", 255).notNullable();
          table.text("description", "longtext").nullable();
          table.string("link", 1000).nullable();
          table.text("translations", "longtext").nullable();
          table.integer("sort_order").notNullable().defaultTo(0);
          table.boolean("is_published").notNullable().defaultTo(true);
          table.dateTime("created_at").defaultTo(this.knex.fn.now());
          table.dateTime("updated_at").defaultTo(this.knex.fn.now());
        });
        await this.seedVerifiedArchives();
      })().catch((err) => {
        this.schemaReady = null;
        throw err;
      });
    }
    return this.schemaReady;
  }

  private map(row: any): PublicCard {
    let translations: Record<string, PublicCardTranslation> = {};
    try {
      translations = sanitizeTranslations(JSON.parse(String(row.translations || "{}")));
    } catch {
      translations = {};
    }
    let tagsList: string[] = [];
    try {
      if (Array.isArray(row.tags)) tagsList = row.tags;
      else if (typeof row.tags === "string" && row.tags.startsWith("[")) tagsList = JSON.parse(row.tags);
      else if (typeof row.tags === "string" && row.tags.trim()) tagsList = row.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
    } catch {
      tagsList = [];
    }
    return {
      id: Number(row.id),
      kind: row.kind,
      category: String(row.category || row.slug || "tunisia"),
      badge: String(row.badge || ""),
      tags: tagsList,
      title: String(row.title || ""),
      description: String(row.description || ""),
      link: String(row.link || ""),
      translations,
      sortOrder: Number(row.sort_order || 0),
      isPublished: Boolean(row.is_published),
      updatedAt: toIso(row.updated_at),
    };
  }

  private requireKind(kind: unknown): PublicCardKind {
    if (!PUBLIC_CARD_KINDS.includes(kind as PublicCardKind)) {
      throw new BadRequestException(`kind must be one of ${PUBLIC_CARD_KINDS.join(", ")}`);
    }
    return kind as PublicCardKind;
  }

  async seedVerifiedArchives(actorId?: number) {
    await this.knex(TABLE).delete();
    for (const seed of VERIFIED_ARCHIVES_SEED) {
      await this.knex(TABLE).insert({
        kind: seed.kind,
        slug: seed.title.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 60),
        category: seed.category,
        badge: seed.badge,
        tags: JSON.stringify(seed.tags),
        title: seed.title,
        description: seed.description,
        link: seed.link,
        translations: JSON.stringify({}),
        sort_order: seed.sortOrder,
        is_published: true,
      });
    }
    this.logger.log(`Seeded ${VERIFIED_ARCHIVES_SEED.length} verified public archive cards`);
    if (actorId) {
      await this.log(actorId, `Reset directory to ${VERIFIED_ARCHIVES_SEED.length} verified official archive cards`);
    }
    return { count: VERIFIED_ARCHIVES_SEED.length };
  }

  async list(kind: string | undefined, onlyPublished: boolean): Promise<PublicCard[]> {
    await this.ensureSchema();
    const query = this.knex(TABLE).orderBy("sort_order", "asc").orderBy("id", "asc");
    if (kind && kind !== "all") query.where({ kind });
    if (onlyPublished) query.where({ is_published: true });
    return (await query).map((row) => this.map(row));
  }

  async getLocations() {
    await this.ensureSchema();
    return this.knex(LOCATIONS_TABLE).orderBy("sort_order", "asc").orderBy("id", "asc");
  }

  async addLocation(body: any, actorId: number) {
    await this.ensureSchema();
    const key = clean(body?.key || body?.id || body?.label, 64).toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    const label = clean(body?.label || body?.name, 128);
    if (!key || !label) throw new BadRequestException("Location key and label are required");
    const existing = await this.knex(LOCATIONS_TABLE).where({ key }).first();
    if (existing) throw new BadRequestException("Location with this key already exists");
    const last = await this.knex(LOCATIONS_TABLE).max({ max: "sort_order" }).first();
    const [id] = await this.knex(LOCATIONS_TABLE).insert({
      key,
      label,
      icon: clean(body?.icon, 64) || "FolderArchive",
      description: clean(body?.description, 500),
      sort_order: Number(last?.max ?? -1) + 1,
    });
    await this.log(actorId, `Added location "${label}"`);
    return this.knex(LOCATIONS_TABLE).where({ id }).first();
  }

  async saveLocations(locations: any[], actorId: number) {
    await this.ensureSchema();
    if (!Array.isArray(locations)) throw new BadRequestException("locations must be an array");
    await this.knex(LOCATIONS_TABLE).delete();
    let idx = 1;
    for (const loc of locations) {
      const key = clean(loc.key || loc.id || loc.label, 64).toLowerCase().replace(/[^a-z0-9_-]/g, "_");
      const label = clean(loc.label || loc.name, 128);
      if (!key || !label) continue;
      await this.knex(LOCATIONS_TABLE).insert({
        key,
        label,
        icon: clean(loc.icon, 64) || "FolderArchive",
        description: clean(loc.description, 500),
        sort_order: typeof loc.sort_order === "number" ? loc.sort_order : idx++,
      });
    }
    await this.log(actorId, `Updated archive locations (${locations.length} locations)`);
    return this.getLocations();
  }

  async deleteLocation(key: string, actorId: number) {
    await this.ensureSchema();
    const cleanKey = clean(key, 64);
    await this.knex(LOCATIONS_TABLE).where({ key: cleanKey }).delete();
    await this.log(actorId, `Deleted location "${cleanKey}"`);
    return { success: true };
  }

  async create(body: any, actorId: number): Promise<PublicCard> {
    await this.ensureSchema();
    const kind = body?.kind && PUBLIC_CARD_KINDS.includes(body.kind) ? body.kind : "archive";
    const title = clean(body?.title, 255);
    if (!title) throw new BadRequestException("Name (title) is required");
    const category = clean(body?.category || body?.slug, 64) || "tunisia";
    const badge = clean(body?.badge, 128);
    const tags = Array.isArray(body?.tags) ? JSON.stringify(body.tags) : clean(body?.tags, 1000);
    const last = await this.knex(TABLE).where({ kind }).max({ max: "sort_order" }).first();
    const [id] = await this.knex(TABLE).insert({
      kind,
      category,
      badge,
      tags,
      title,
      description: clean(body?.description, 4000),
      link: sanitizeLink(body?.link),
      translations: JSON.stringify(sanitizeTranslations(body?.translations)),
      sort_order: Number(last?.max ?? -1) + 1,
      is_published: body?.isPublished === false ? false : true,
    });
    await this.log(actorId, `Created ${kind} card "${title}"`);
    return this.map(await this.knex(TABLE).where({ id }).first());
  }

  async update(id: number, body: any, actorId: number): Promise<PublicCard> {
    await this.ensureSchema();
    const existing = await this.knex(TABLE).where({ id }).first();
    if (!existing) throw new NotFoundException("Card not found");
    const patch: Record<string, any> = { updated_at: new Date() };
    if (body?.title !== undefined) {
      const title = clean(body.title, 255);
      if (!title) throw new BadRequestException("Name (title) is required");
      patch.title = title;
    }
    if (body?.category !== undefined) patch.category = clean(body.category, 64);
    if (body?.badge !== undefined) patch.badge = clean(body.badge, 128);
    if (body?.tags !== undefined) {
      patch.tags = Array.isArray(body.tags) ? JSON.stringify(body.tags) : clean(body.tags, 1000);
    }
    if (body?.description !== undefined) patch.description = clean(body.description, 4000);
    if (body?.link !== undefined) patch.link = sanitizeLink(body.link);
    if (body?.translations !== undefined) {
      patch.translations = JSON.stringify(sanitizeTranslations(body.translations));
    }
    if (body?.isPublished !== undefined) patch.is_published = Boolean(body.isPublished);
    if (body?.sortOrder !== undefined && Number.isFinite(Number(body.sortOrder))) {
      patch.sort_order = Number(body.sortOrder);
    }
    await this.knex(TABLE).where({ id }).update(patch);
    await this.log(actorId, `Updated ${existing.kind} card "${patch.title || existing.title}"`);
    return this.map(await this.knex(TABLE).where({ id }).first());
  }

  async remove(id: number, actorId: number) {
    await this.ensureSchema();
    const existing = await this.knex(TABLE).where({ id }).first();
    if (!existing) throw new NotFoundException("Card not found");
    await this.knex(TABLE).where({ id }).delete();
    await this.log(actorId, `Deleted ${existing.kind} card "${existing.title}"`);
    return { success: true };
  }

  async reorder(kind: string, ids: unknown, actorId: number) {
    await this.ensureSchema();
    const k = this.requireKind(kind);
    if (!Array.isArray(ids)) throw new BadRequestException("ids must be an array");
    let position = 0;
    for (const raw of ids) {
      const id = Number(raw);
      if (!Number.isInteger(id)) continue;
      await this.knex(TABLE).where({ id, kind: k }).update({ sort_order: position++ });
    }
    await this.log(actorId, `Reordered ${k} cards`);
    return this.list(k, false);
  }

  private async log(actorId: number, message: string) {
    try {
      await this.activityService.log(actorId, "settings", message);
    } catch (err: any) {
      this.logger.warn(`Activity log failed: ${err?.message || err}`);
    }
  }
}

