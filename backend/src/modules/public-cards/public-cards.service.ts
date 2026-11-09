import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { ActivityService } from "../activity/activity.service";
import { PUBLIC_CARD_SEED } from "./public-cards.seed";

export type PublicCardKind = "source" | "archive";
export const PUBLIC_CARD_KINDS: PublicCardKind[] = ["source", "archive"];

export interface PublicCardTranslation {
  title?: string;
  description?: string;
}

export interface PublicCard {
  id: number;
  kind: PublicCardKind;
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
        if (await this.knex.schema.hasTable(TABLE)) return;
        await this.knex.schema.createTable(TABLE, (table) => {
          table.increments("id").primary();
          table.string("kind", 20).notNullable().index();
          table.string("slug", 64).nullable();
          table.string("title", 255).notNullable();
          table.text("description", "longtext").nullable();
          table.string("link", 1000).nullable();
          table.text("translations", "longtext").nullable();
          table.integer("sort_order").notNullable().defaultTo(0);
          table.boolean("is_published").notNullable().defaultTo(true);
          table.dateTime("created_at").defaultTo(this.knex.fn.now());
          table.dateTime("updated_at").defaultTo(this.knex.fn.now());
        });
        for (const seed of PUBLIC_CARD_SEED) {
          const base = seed.tr.fr || seed.tr.en || Object.values(seed.tr)[0];
          const translations: Record<string, PublicCardTranslation> = {};
          for (const [locale, value] of Object.entries(seed.tr)) {
            if (locale !== "fr") translations[locale] = value;
          }
          await this.knex(TABLE).insert({
            kind: seed.kind,
            slug: seed.slug,
            title: base.title,
            description: base.description,
            link: seed.link,
            translations: JSON.stringify(translations),
            sort_order: seed.sort,
            is_published: true,
          });
        }
        this.logger.log(`Seeded ${PUBLIC_CARD_SEED.length} public cards`);
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
    return {
      id: Number(row.id),
      kind: row.kind,
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

  async list(kind: string | undefined, onlyPublished: boolean): Promise<PublicCard[]> {
    await this.ensureSchema();
    const query = this.knex(TABLE).orderBy("sort_order", "asc").orderBy("id", "asc");
    if (kind) query.where({ kind: this.requireKind(kind) });
    if (onlyPublished) query.where({ is_published: true });
    return (await query).map((row) => this.map(row));
  }

  async create(body: any, actorId: number): Promise<PublicCard> {
    await this.ensureSchema();
    const kind = this.requireKind(body?.kind);
    const title = clean(body?.title, 255);
    if (!title) throw new BadRequestException("Name (title) is required");
    const last = await this.knex(TABLE).where({ kind }).max({ max: "sort_order" }).first();
    const [id] = await this.knex(TABLE).insert({
      kind,
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

