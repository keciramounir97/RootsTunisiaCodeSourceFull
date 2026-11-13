import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { Knex } from "knex";

export interface PeriodSourceLink {
  id: number;
  period_id: string;
  source_type: "document" | "tree" | "book" | "gallery" | "audio" | "article";
  source_id: number;
  custom_title?: string | null;
  custom_notes?: string | null;
  created_at?: string;
}

export interface EnrichedPeriodSource {
  id: number;
  link_id: number;
  period_id: string;
  source_type: string;
  source_id: number;
  title: string;
  description?: string;
  archive_source?: string;
  document_code?: string;
  location?: string;
  year?: string;
  thumbnail?: string;
  media_url?: string;
  custom_notes?: string;
  created_at?: string;
}

const TABLE_NAME = "period_sources";

@Injectable()
export class PeriodsService implements OnModuleInit {
  private readonly logger = new Logger(PeriodsService.name);

  constructor(@Inject("KnexConnection") private readonly knex: Knex) {}

  onModuleInit() {
    this.ensureTable()
      .then(() => this.seedInitialLinks())
      .catch((err) => {
        this.logger.error("Failed to initialize period_sources table:", err?.message || err);
      });
  }

  private async ensureTable() {
    const hasTable = await this.knex.schema.hasTable(TABLE_NAME);
    if (!hasTable) {
      await this.knex.schema.createTable(TABLE_NAME, (table) => {
        table.increments("id").primary();
        table.string("period_id", 100).notNullable();
        table.string("source_type", 50).notNullable(); // 'document' | 'tree' | 'book' | 'gallery' | 'audio' | 'article'
        table.integer("source_id").notNullable();
        table.string("custom_title", 255).nullable();
        table.text("custom_notes").nullable();
        table.dateTime("created_at").defaultTo(this.knex.fn.now());

        table.index(["period_id"]);
        table.index(["source_type", "source_id"]);
      });
      this.logger.log(`Created table ${TABLE_NAME}`);
    }
  }

  private async seedInitialLinks() {
    try {
      const count = await this.knex(TABLE_NAME).count("id as cnt").first();
      if (Number(count?.cnt || 0) > 0) return;

      // Find available IDs from tables to seed realistic links
      const [firstBook, firstTree, firstGallery, firstAudio] = await Promise.all([
        this.knex("books").select("id", "category").first().catch(() => null),
        this.knex("family_trees").select("id").first().catch(() => null),
        this.knex("gallery").select("id").first().catch(() => null),
        this.knex("audios").select("id").first().catch(() => null),
      ]);

      const initialLinks = [
        {
          period_id: "ottomane",
          source_type: "document",
          source_id: firstBook ? Number(firstBook.id) : 1,
          custom_title: "Defter du Diwan & Sijillat des Janissaires (1600–1620)",
          custom_notes: "Cote ANT Kasbah — Série Beylicale et Registres consulaires de Tunis.",
        },
        {
          period_id: "husseinite",
          source_type: "document",
          source_id: firstBook ? Number(firstBook.id) : 1,
          custom_title: "Rôles Nominatifs de la Majba de 1860 (Caïdat des Jlass & Tunis)",
          custom_notes: "Recensement de 18 420 chefs de famille et actes d'adoul.",
        },
        {
          period_id: "hafside",
          source_type: "book",
          source_id: firstBook ? Number(firstBook.id) : 1,
          custom_title: "Traité de la Muqaddima d'Ibn Khaldoun (Tunis 1377)",
          custom_notes: "Bibliothèque Nationale de Tunisie & Archives Zitouniennes.",
        },
        {
          period_id: "protectorat",
          source_type: "document",
          source_id: firstBook ? Number(firstBook.id) : 1,
          custom_title: "Registre des Décrets de Naturalisation (1924–1927)",
          custom_notes: "ANOM Aix-en-Provence & Archives de La Kasbah.",
        },
        {
          period_id: "republique",
          source_type: "document",
          source_id: firstBook ? Number(firstBook.id) : 1,
          custom_title: "Décret d'Abolition du Régime Monarchique & Proclamation de la République (1957)",
          custom_notes: "Journal Officiel de la République Tunisienne (JORT).",
        },
      ];

      if (firstTree) {
        initialLinks.push({
          period_id: "husseinite",
          source_type: "tree",
          source_id: Number(firstTree.id),
          custom_title: "Arbre de Transmission Notariée & Lignées Beylicales",
          custom_notes: "Filiation continue vérifiée aux Archives Nationales de Tunisie.",
        });
      }

      if (firstGallery) {
        initialLinks.push({
          period_id: "ottomane",
          source_type: "gallery",
          source_id: Number(firstGallery.id),
          custom_title: "Gravure Historique de La Karraka et des remparts de La Goulette (vers 1600)",
          custom_notes: "Dépôt des cartes et plans anciens.",
        });
      }

      if (firstAudio) {
        initialLinks.push({
          period_id: "protectorat",
          source_type: "audio",
          source_id: Number(firstAudio.id),
          custom_title: "Témoignage Oral sur les Registres d'Adoul de Sfax et Mahdia",
          custom_notes: "Fonds de récits oraux et mémoires généalogiques.",
        });
      }

      for (const link of initialLinks) {
        await this.knex(TABLE_NAME).insert({
          ...link,
          created_at: this.knex.fn.now(),
        });
      }

      this.logger.log(`Seeded ${initialLinks.length} initial period source links`);
    } catch (err: any) {
      this.logger.warn("Seeding initial period sources skipped:", err?.message || err);
    }
  }

  // =========================================================================
  // PUBLIC GETTERS
  // =========================================================================

  async getSourcesByPeriod(periodId: string): Promise<EnrichedPeriodSource[]> {
    await this.ensureTable();
    const links = await this.knex(TABLE_NAME)
      .where({ period_id: periodId })
      .orderBy("id", "desc");

    if (!links || links.length === 0) return [];

    const enriched: EnrichedPeriodSource[] = [];

    for (const link of links) {
      const type = link.source_type;
      const sId = Number(link.source_id);

      try {
        if (type === "document" || type === "book") {
          const book = await this.knex("books").where({ id: sId }).first().catch(() => null);
          if (book) {
            enriched.push({
              id: book.id,
              link_id: link.id,
              period_id: link.period_id,
              source_type: type,
              source_id: sId,
              title: link.custom_title || book.title,
              description: book.description,
              archive_source: book.archive_source,
              document_code: book.document_code,
              location: book.category,
              year: book.year || book.created_at?.toString().slice(0, 4),
              thumbnail: book.cover_path,
              media_url: book.file_path,
              custom_notes: link.custom_notes,
              created_at: link.created_at,
            });
            continue;
          }
        } else if (type === "tree") {
          const tree = await this.knex("family_trees").where({ id: sId }).first().catch(() => null);
          if (tree) {
            enriched.push({
              id: tree.id,
              link_id: link.id,
              period_id: link.period_id,
              source_type: type,
              source_id: sId,
              title: link.custom_title || tree.title,
              description: tree.description,
              archive_source: tree.archive_source,
              document_code: tree.document_code,
              thumbnail: undefined,
              media_url: tree.gedcom_path,
              custom_notes: link.custom_notes,
              created_at: link.created_at,
            });
            continue;
          }
        } else if (type === "gallery") {
          const gal = await this.knex("gallery").where({ id: sId }).first().catch(() => null);
          if (gal) {
            enriched.push({
              id: gal.id,
              link_id: link.id,
              period_id: link.period_id,
              source_type: type,
              source_id: sId,
              title: link.custom_title || gal.title,
              description: gal.description,
              archive_source: gal.archive_source,
              document_code: gal.document_code,
              location: gal.location || gal.governorate,
              year: gal.year,
              thumbnail: gal.image_path,
              media_url: gal.image_path,
              custom_notes: link.custom_notes,
              created_at: link.created_at,
            });
            continue;
          }
        } else if (type === "audio") {
          const au = await this.knex("audios").where({ id: sId }).first().catch(() => null);
          if (au) {
            enriched.push({
              id: au.id,
              link_id: link.id,
              period_id: link.period_id,
              source_type: type,
              source_id: sId,
              title: link.custom_title || au.title,
              description: au.description,
              archive_source: au.speaker ? `Récit de : ${au.speaker}` : "Témoignage Oral",
              document_code: au.duration ? `Durée : ${au.duration}` : undefined,
              location: au.category,
              year: au.recorded_year,
              thumbnail: undefined,
              media_url: au.audio_path,
              custom_notes: link.custom_notes,
              created_at: link.created_at,
            });
            continue;
          }
        }

        // Fallback if record was deleted from source table
        enriched.push({
          id: sId,
          link_id: link.id,
          period_id: link.period_id,
          source_type: type,
          source_id: sId,
          title: link.custom_title || `Archive #${sId} (${type})`,
          description: link.custom_notes || "Document d'archive répertorié.",
          custom_notes: link.custom_notes,
          created_at: link.created_at,
        });
      } catch (err: any) {
        this.logger.warn(`Error resolving linked source ${link.id}:`, err?.message || err);
      }
    }

    return enriched;
  }

  async getSourcesStats(): Promise<Record<string, { total: number; documents: number; trees: number; books: number; gallery: number; audios: number }>> {
    await this.ensureTable();
    const rows = await this.knex(TABLE_NAME)
      .select("period_id", "source_type")
      .count("id as cnt")
      .groupBy("period_id", "source_type");

    const result: Record<string, { total: number; documents: number; trees: number; books: number; gallery: number; audios: number }> = {};

    rows.forEach((r: any) => {
      const pId = String(r.period_id);
      const type = String(r.source_type);
      const count = Number(r.cnt || 0);

      if (!result[pId]) {
        result[pId] = { total: 0, documents: 0, trees: 0, books: 0, gallery: 0, audios: 0 };
      }

      result[pId].total += count;
      if (type === "document") result[pId].documents += count;
      else if (type === "tree") result[pId].trees += count;
      else if (type === "book") result[pId].books += count;
      else if (type === "gallery") result[pId].gallery += count;
      else if (type === "audio") result[pId].audios += count;
    });

    return result;
  }

  async getAllAvailableSources(search?: string, typeFilter?: string) {
    const q = (search || "").trim().toLowerCase();

    const [books, trees, gallery, audios] = await Promise.all([
      this.knex("books").select("id", "title", "author", "category", "archive_source", "document_code", "cover_path as thumbnail").limit(50).catch(() => []),
      this.knex("family_trees").select("id", "title", "archive_source", "document_code").limit(50).catch(() => []),
      this.knex("gallery").select("id", "title", "image_path as thumbnail", "archive_source", "document_code", "location").limit(50).catch(() => []),
      this.knex("audios").select("id", "title", "speaker", "duration", "recorded_year").limit(50).catch(() => []),
    ]);

    const all: any[] = [];

    books.forEach((b: any) => {
      const isDoc = (b.category || "").toLowerCase().includes("doc") || (b.category || "").toLowerCase().includes("manuscrit");
      all.push({
        source_id: b.id,
        source_type: isDoc ? "document" : "book",
        title: b.title,
        secondary: b.author || b.category,
        archive_source: b.archive_source,
        document_code: b.document_code,
        thumbnail: b.thumbnail,
      });
    });

    trees.forEach((t: any) => {
      all.push({
        source_id: t.id,
        source_type: "tree",
        title: t.title,
        secondary: "Arbre Généalogique",
        archive_source: t.archive_source,
        document_code: t.document_code,
        thumbnail: undefined,
      });
    });

    gallery.forEach((g: any) => {
      all.push({
        source_id: g.id,
        source_type: "gallery",
        title: g.title,
        secondary: g.location || "Photographie d'Archive",
        archive_source: g.archive_source,
        document_code: g.document_code,
        thumbnail: g.thumbnail,
      });
    });

    audios.forEach((a: any) => {
      all.push({
        source_id: a.id,
        source_type: "audio",
        title: a.title,
        secondary: a.speaker ? `Intervenant : ${a.speaker}` : "Récit Oral",
        archive_source: "Archives Sonores",
        document_code: a.duration,
        thumbnail: undefined,
      });
    });

    return all.filter((item) => {
      if (typeFilter && typeFilter !== "all" && item.source_type !== typeFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.secondary?.toLowerCase().includes(q) ||
        item.archive_source?.toLowerCase().includes(q) ||
        item.document_code?.toLowerCase().includes(q)
      );
    });
  }

  // =========================================================================
  // ADMIN MUTATIONS
  // =========================================================================

  async linkSource(
    periodId: string,
    payload: {
      source_type: string;
      source_id: number | string;
      custom_title?: string;
      custom_notes?: string;
    },
  ) {
    await this.ensureTable();
    const sId = Number(payload.source_id);

    // Check if link already exists
    const existing = await this.knex(TABLE_NAME)
      .where({
        period_id: periodId,
        source_type: payload.source_type,
        source_id: sId,
      })
      .first();

    if (existing) {
      // Update custom fields
      await this.knex(TABLE_NAME)
        .where({ id: existing.id })
        .update({
          custom_title: payload.custom_title || existing.custom_title,
          custom_notes: payload.custom_notes || existing.custom_notes,
        });
      return { success: true, message: "Lien mis à jour", id: existing.id };
    }

    const [newId] = await this.knex(TABLE_NAME).insert({
      period_id: periodId,
      source_type: payload.source_type,
      source_id: sId,
      custom_title: payload.custom_title || null,
      custom_notes: payload.custom_notes || null,
      created_at: this.knex.fn.now(),
    });

    return { success: true, message: "Source associée avec succès", id: newId };
  }

  async unlinkSource(linkId: number) {
    await this.ensureTable();
    const deleted = await this.knex(TABLE_NAME).where({ id: linkId }).del();
    if (!deleted) {
      throw new NotFoundException(`Lien source #${linkId} introuvable.`);
    }
    return { success: true, message: "Source détachée de la période" };
  }

  private async ensureSiteContentTable() {
    const hasTable = await this.knex.schema.hasTable("site_content");
    if (!hasTable) {
      await this.knex.schema.createTable("site_content", (table) => {
        table.string("key", 100).primary();
        table.text("value", "longtext").notNullable();
        table.integer("updated_by").nullable();
        table.dateTime("updated_at").defaultTo(this.knex.fn.now());
      });
    }
  }

  async getCmsJson(key: string): Promise<any> {
    await this.ensureSiteContentTable();
    const row = await this.knex("site_content").where({ key }).first();
    if (!row || !row.value) return null;
    try {
      return JSON.parse(String(row.value));
    } catch {
      return null;
    }
  }

  async saveCmsJson(key: string, data: any, userId?: number): Promise<any> {
    await this.ensureSiteContentTable();
    const payload = JSON.stringify(data || {});
    const now = new Date();
    const existing = await this.knex("site_content").where({ key }).first();
    if (existing) {
      await this.knex("site_content")
        .where({ key })
        .update({
          value: payload,
          updated_by: userId ?? null,
          updated_at: now,
        });
    } else {
      await this.knex("site_content").insert({
        key,
        value: payload,
        updated_by: userId ?? null,
        updated_at: now,
      });
    }
    return data;
  }
}

