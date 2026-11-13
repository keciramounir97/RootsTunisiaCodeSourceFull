import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { Knex } from "knex";

export interface CustomService {
  id: number;
  title: string;
  slug: string;
  category: string;
  price_eur: string;
  price_usd: string;
  price_tnd: string;
  billing_unit: string;
  short_desc: string;
  full_offer: string;
  deliverables: string[];
  whatsapp_text: string;
  contact_phone?: string;
  contact_email?: string;
  meeting_link?: string;
  meeting_enabled?: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceBooking {
  id: number;
  service_id: number;
  service_title: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_message: string;
  target_ancestor?: string | null;
  urgency?: string | null;
  preferred_contact?: string | null;
  booking_type?: string;
  meeting_date?: string | null;
  meeting_time?: string | null;
  meeting_type?: string | null;
  status: string; // 'Nouveau' | 'Contacté' | 'En cours' | 'Terminé' | 'Annulé'
  admin_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

const SERVICES_TABLE = "custom_services";
const BOOKINGS_TABLE = "service_bookings";

const INITIAL_SERVICES = [
  {
    title: "Déchiffrage & Transcription Paléographique",
    slug: "dechiffrage-transcription-paleographique",
    category: "Paléographie & Traduction",
    price_eur: "25 €",
    price_usd: "25 $",
    price_tnd: "80 TND",
    billing_unit: "par acte",
    short_desc:
      "Transcription et traduction française/anglaise d'actes manuscrits en arabe maghrébin, turc ottoman, italien ancien ou latin d'église.",
    full_offer:
      "Notre équipe d'historiens et de paléographes certifiés examine vos actes anciens manuscrits (sijillats des cadis malékites et hanafites, actes d'adoul, registres paroissiaux, actes notariés beylicaux). Nous réalisons une transcription diplomatique intégrale mot à mot accompagnée d'une traduction fidèle en français ou en anglais, complétée par des annotations onomastiques sur les patronymes et toponymes.",
    deliverables: JSON.stringify([
      "Transcription intégrale mot à mot",
      "Traduction certifiée en français ou anglais",
      "Notes onomastiques et historiques sur les patronymes",
      "Livraison PDF haute résolution sous 48h à 72h",
      "Examen paléographique des sceaux et paraphes",
    ]),
    whatsapp_text:
      "Bonjour Roots Tunisia, je souhaite commander une transcription/déchiffrage d'acte ancien.",
    is_published: true,
    sort_order: 1,
  },
  {
    title: "Recherche In Situ aux Archives Nationales",
    slug: "recherche-in-situ-archives-nationales",
    category: "Investigation sur le Terrain",
    price_eur: "49 €",
    price_usd: "49 $",
    price_tnd: "160 TND",
    billing_unit: "par dossier",
    short_desc:
      "Mandat d'un chercheur à Tunis (dépôt de la Kasbah, dépôts municipaux) pour retrouver, vérifier et photographier une cote physique.",
    full_offer:
      "Vous avez identifié une cote d'archives non numérisée ou un registre physique conservé en Tunisie ? Nous mandatons un chercheur habilité directement auprès des Archives Nationales de Tunisie (La Kasbah), des tribunaux régionaux ou des dépôts municipaux. Le chercheur consulte sur place les liasses et cartons originaux, vérifie l'authenticité et capture des photographies HD des folios demandés.",
    deliverables: JSON.stringify([
      "Déplacement physique du chercheur aux dépôts d'archives",
      "Photographies HD des folios originaux et des reliures",
      "Rapport de recherche détaillé avec cotes exactes et métadonnées",
      "Recherche croisée dans les séries SG, E et rôles de la Majba",
      "Fiche d'inventaire et relevé de consultation officielle",
    ]),
    whatsapp_text:
      "Bonjour Roots Tunisia, je souhaite mandater un chercheur pour une recherche in situ aux archives.",
    is_published: true,
    sort_order: 2,
  },
  {
    title: "Validation de Filiation & Dossier Notarié",
    slug: "validation-filiation-dossier-notarie",
    category: "Filiation & Preuves Juridiques",
    price_eur: "99 €",
    price_usd: "99 $",
    price_tnd: "320 TND",
    billing_unit: "par lignée",
    short_desc:
      "Constitution d'un dossier complet de filiation avec sceaux archivistiques et chaînes de transmission pour vos démarches officielles.",
    full_offer:
      "Pour vos démarches notariales, successions, constitutions de dossiers de nationalité ou vérifications d'ascendance beylicale, nous constituons un dossier de filiation complet et certifié. Chaque génération est validée par croisement rigoureux d'actes d'état civil, de contrats de mariage rédigés par les 'udul (adoul), de registres de Habous et de rôles fiscaux de la Majba (1860-1881).",
    deliverables: JSON.stringify([
      "Dossier complet de preuves juridiques et archivistiques",
      "Validation paléographique de la chaîne de transmission agnatique",
      "Livret de transmission patrimoniale relié au format PDF",
      "Arbre d'ascendance certifié avec cotes sources primaires",
      "Attestation d'analyse archivistique Roots Tunisia",
    ]),
    whatsapp_text:
      "Bonjour Roots Tunisia, je souhaite commander une validation de filiation notariée.",
    is_published: true,
    sort_order: 3,
  },
];

@Injectable()
export class CustomServicesService implements OnModuleInit {
  private readonly logger = new Logger(CustomServicesService.name);

  constructor(@Inject("KnexConnection") private readonly knex: Knex) {}

  onModuleInit() {
    // Run schema check and seeding asynchronously so server starts listening immediately
    this.ensureTables()
      .then(() => this.seedDefaultServices())
      .catch((err: any) => {
        this.logger.error("Failed to initialize custom services tables:", err?.message || err);
      });
  }

  private async ensureTables() {
    const hasServicesTable = await this.knex.schema.hasTable(SERVICES_TABLE);
    if (!hasServicesTable) {
      await this.knex.schema.createTable(SERVICES_TABLE, (table) => {
        table.increments("id").primary();
        table.string("title", 255).notNullable();
        table.string("slug", 255).notNullable().unique();
        table.string("category", 100).notNullable().defaultTo("Généalogie");
        table.string("price_eur", 50).notNullable().defaultTo("0 €");
        table.string("price_usd", 50).notNullable().defaultTo("0 $");
        table.string("price_tnd", 50).notNullable().defaultTo("0 TND");
        table.string("billing_unit", 50).notNullable().defaultTo("par prestation");
        table.text("short_desc").notNullable();
        table.text("full_offer").notNullable();
        table.text("deliverables").notNullable(); // JSON array
        table.string("whatsapp_text", 500).nullable();
        table.boolean("is_published").notNullable().defaultTo(true);
        table.integer("sort_order").notNullable().defaultTo(0);
        table.dateTime("created_at").defaultTo(this.knex.fn.now());
        table.dateTime("updated_at").defaultTo(this.knex.fn.now());
      });
      this.logger.log(`Created table ${SERVICES_TABLE}`);
    }

    const hasBookingsTable = await this.knex.schema.hasTable(BOOKINGS_TABLE);
    if (!hasBookingsTable) {
      await this.knex.schema.createTable(BOOKINGS_TABLE, (table) => {
        table.increments("id").primary();
        table.integer("service_id").notNullable();
        table.string("service_title", 255).notNullable();
        table.string("client_name", 255).notNullable();
        table.string("client_email", 255).notNullable();
        table.string("client_phone", 100).notNullable();
        table.text("client_message").notNullable();
        table.string("target_ancestor", 255).nullable();
        table.string("urgency", 50).nullable().defaultTo("Normal");
        table.string("preferred_contact", 50).nullable().defaultTo("WhatsApp");
        table.string("status", 50).notNullable().defaultTo("Nouveau");
        table.text("admin_notes").nullable();
        table.dateTime("created_at").defaultTo(this.knex.fn.now());
        table.dateTime("updated_at").defaultTo(this.knex.fn.now());
        table.index(["service_id"]);
        table.index(["status"]);
      });
      this.logger.log(`Created table ${BOOKINGS_TABLE}`);
    }

    // Safe Column Migrations for custom_services
    try {
      const hasContactPhone = await this.knex.schema.hasColumn(SERVICES_TABLE, "contact_phone");
      if (!hasContactPhone) {
        await this.knex.schema.table(SERVICES_TABLE, (table) => {
          table.string("contact_phone", 100).nullable().defaultTo("+216 71 234 567");
          table.string("contact_email", 255).nullable().defaultTo("contact@rootstunisia.com");
          table.string("meeting_link", 500).nullable();
          table.boolean("meeting_enabled").notNullable().defaultTo(true);
        });
        this.logger.log(`Added contact and meeting columns to ${SERVICES_TABLE}`);
      }
    } catch (e: any) {
      this.logger.warn(`Column check failed for ${SERVICES_TABLE}: ${e?.message}`);
    }

    // Safe Column Migrations for service_bookings
    try {
      const hasMeetingDate = await this.knex.schema.hasColumn(BOOKINGS_TABLE, "meeting_date");
      if (!hasMeetingDate) {
        await this.knex.schema.table(BOOKINGS_TABLE, (table) => {
          table.string("booking_type", 50).nullable().defaultTo("service");
          table.string("meeting_date", 50).nullable();
          table.string("meeting_time", 50).nullable();
          table.string("meeting_type", 100).nullable();
        });
        this.logger.log(`Added meeting columns to ${BOOKINGS_TABLE}`);
      }
    } catch (e: any) {
      this.logger.warn(`Column check failed for ${BOOKINGS_TABLE}: ${e?.message}`);
    }
  }

  private async seedDefaultServices() {
    // Mock seeding disabled: services are managed directly by admin without mock pricing
  }

  private parseServiceRow(row: any): CustomService {
    let deliverables: string[] = [];
    if (Array.isArray(row.deliverables)) {
      deliverables = row.deliverables;
    } else if (typeof row.deliverables === "string" && row.deliverables.trim()) {
      try {
        deliverables = JSON.parse(row.deliverables);
      } catch {
        deliverables = row.deliverables.split("\n").filter(Boolean);
      }
    }
    return {
      id: Number(row.id),
      title: row.title,
      slug: row.slug,
      category: row.category,
      price_eur: row.price_eur,
      price_usd: row.price_usd,
      price_tnd: row.price_tnd,
      billing_unit: row.billing_unit,
      short_desc: row.short_desc,
      full_offer: row.full_offer,
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      whatsapp_text: row.whatsapp_text || "",
      contact_phone: row.contact_phone || "+216 71 234 567",
      contact_email: row.contact_email || "contact@rootstunisia.com",
      meeting_link: row.meeting_link || "",
      meeting_enabled: row.meeting_enabled !== false,
      is_published: Boolean(row.is_published),
      sort_order: Number(row.sort_order || 0),
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  // =========================================================================
  // PUBLIC SERVICES
  // =========================================================================

  async listPublishedServices(): Promise<CustomService[]> {
    const rows = await this.knex(SERVICES_TABLE)
      .where("is_published", true)
      .orderBy("sort_order", "asc")
      .orderBy("id", "asc");
    return rows.map((r) => this.parseServiceRow(r));
  }

  async getServiceByIdOrSlug(idOrSlug: string | number): Promise<CustomService> {
    const isNum = !isNaN(Number(idOrSlug));
    const query = this.knex(SERVICES_TABLE);
    if (isNum) {
      query.where("id", Number(idOrSlug));
    } else {
      query.where("slug", String(idOrSlug));
    }
    const row = await query.first();
    if (!row) {
      throw new NotFoundException("Service not found");
    }
    return this.parseServiceRow(row);
  }

  async createBooking(payload: {
    service_id: number;
    client_name: string;
    client_email: string;
    client_phone: string;
    client_message: string;
    target_ancestor?: string;
    urgency?: string;
    preferred_contact?: string;
    booking_type?: string;
    meeting_date?: string;
    meeting_time?: string;
    meeting_type?: string;
  }): Promise<ServiceBooking> {
    const service = await this.knex(SERVICES_TABLE).where("id", payload.service_id).first();
    if (!service) {
      throw new BadRequestException("Service invalide ou introuvable");
    }

    if (!payload.client_name?.trim()) {
      throw new BadRequestException("Le nom du client est requis");
    }
    if (!payload.client_email?.trim() && !payload.client_phone?.trim()) {
      throw new BadRequestException("Un email ou un numéro de téléphone/WhatsApp est requis");
    }
    if (!payload.client_message?.trim()) {
      throw new BadRequestException("Veuillez préciser votre demande ou votre besoin");
    }

    const [id] = await this.knex(BOOKINGS_TABLE).insert({
      service_id: service.id,
      service_title: service.title,
      client_name: payload.client_name.trim(),
      client_email: (payload.client_email || "").trim().toLowerCase(),
      client_phone: (payload.client_phone || "").trim(),
      client_message: payload.client_message.trim(),
      target_ancestor: (payload.target_ancestor || "").trim() || null,
      urgency: payload.urgency || "Normal",
      preferred_contact: payload.preferred_contact || "WhatsApp",
      booking_type: payload.booking_type || (payload.meeting_date ? "meeting" : "service"),
      meeting_date: payload.meeting_date || null,
      meeting_time: payload.meeting_time || null,
      meeting_type: payload.meeting_type || null,
      status: "Nouveau",
      created_at: this.knex.fn.now(),
      updated_at: this.knex.fn.now(),
    });

    const bookingRow = await this.knex(BOOKINGS_TABLE).where("id", id).first();
    return bookingRow;
  }

  // =========================================================================
  // ADMIN SERVICES & BOOKING MANAGEMENT
  // =========================================================================

  async listAllServices(): Promise<Array<CustomService & { booking_count: number }>> {
    const services = await this.knex(SERVICES_TABLE)
      .orderBy("sort_order", "asc")
      .orderBy("id", "asc");

    const counts: any[] = await this.knex(BOOKINGS_TABLE)
      .select("service_id")
      .count("id as count")
      .groupBy("service_id");

    const countMap: Record<number, number> = {};
    for (const c of counts) {
      countMap[Number(c.service_id)] = Number(c.count || 0);
    }

    return services.map((r) => ({
      ...this.parseServiceRow(r),
      booking_count: countMap[Number(r.id)] || 0,
    }));
  }

  async createService(dto: {
    title: string;
    slug?: string;
    category?: string;
    price_eur?: string;
    price_usd?: string;
    price_tnd?: string;
    billing_unit?: string;
    short_desc: string;
    full_offer: string;
    deliverables?: string[] | string;
    whatsapp_text?: string;
    contact_phone?: string;
    contact_email?: string;
    meeting_link?: string;
    meeting_enabled?: boolean;
    is_published?: boolean;
    sort_order?: number;
  }): Promise<CustomService> {
    if (!dto.title?.trim()) {
      throw new BadRequestException("Le titre du service est requis");
    }

    let slug = dto.slug?.trim() || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug) slug = `service-${Date.now()}`;

    // ensure unique slug
    const existing = await this.knex(SERVICES_TABLE).where("slug", slug).first();
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const deliverablesJson = Array.isArray(dto.deliverables)
      ? JSON.stringify(dto.deliverables)
      : typeof dto.deliverables === "string"
      ? JSON.stringify(dto.deliverables.split("\n").filter(Boolean))
      : JSON.stringify([]);

    const [id] = await this.knex(SERVICES_TABLE).insert({
      title: dto.title.trim(),
      slug,
      category: dto.category?.trim() || "Généalogie",
      price_eur: dto.price_eur?.trim() || "0",
      price_usd: dto.price_usd?.trim() || "0",
      price_tnd: dto.price_tnd?.trim() || "0",
      billing_unit: dto.billing_unit?.trim() || "Sur Devis",
      short_desc: dto.short_desc?.trim() || "",
      full_offer: dto.full_offer?.trim() || dto.short_desc || "",
      deliverables: deliverablesJson,
      whatsapp_text: dto.whatsapp_text?.trim() || `Bonjour Roots Tunisia, je souhaite commander le service ${dto.title}`,
      contact_phone: dto.contact_phone?.trim() || "+216 71 234 567",
      contact_email: dto.contact_email?.trim() || "contact@rootstunisia.com",
      meeting_link: dto.meeting_link?.trim() || null,
      meeting_enabled: dto.meeting_enabled !== false,
      is_published: dto.is_published !== false,
      sort_order: Number(dto.sort_order || 0),
      created_at: this.knex.fn.now(),
      updated_at: this.knex.fn.now(),
    });

    const row = await this.knex(SERVICES_TABLE).where("id", id).first();
    return this.parseServiceRow(row);
  }

  async updateService(
    id: number,
    dto: Partial<{
      title: string;
      slug: string;
      category: string;
      price_eur: string;
      price_usd: string;
      price_tnd: string;
      billing_unit: string;
      short_desc: string;
      full_offer: string;
      deliverables: string[] | string;
      whatsapp_text: string;
      contact_phone: string;
      contact_email: string;
      meeting_link: string;
      meeting_enabled: boolean;
      is_published: boolean;
      sort_order: number;
    }>,
  ): Promise<CustomService> {
    const existing = await this.knex(SERVICES_TABLE).where("id", id).first();
    if (!existing) {
      throw new NotFoundException("Service not found");
    }

    const updateData: any = {
      updated_at: this.knex.fn.now(),
    };

    if (dto.title !== undefined) updateData.title = dto.title.trim();
    if (dto.slug !== undefined) updateData.slug = dto.slug.trim();
    if (dto.category !== undefined) updateData.category = dto.category.trim();
    if (dto.price_eur !== undefined) updateData.price_eur = dto.price_eur.trim();
    if (dto.price_usd !== undefined) updateData.price_usd = dto.price_usd.trim();
    if (dto.price_tnd !== undefined) updateData.price_tnd = dto.price_tnd.trim();
    if (dto.billing_unit !== undefined) updateData.billing_unit = dto.billing_unit.trim();
    if (dto.short_desc !== undefined) updateData.short_desc = dto.short_desc.trim();
    if (dto.full_offer !== undefined) updateData.full_offer = dto.full_offer.trim();
    if (dto.deliverables !== undefined) {
      updateData.deliverables = Array.isArray(dto.deliverables)
        ? JSON.stringify(dto.deliverables)
        : typeof dto.deliverables === "string"
        ? JSON.stringify(dto.deliverables.split("\n").filter(Boolean))
        : JSON.stringify([]);
    }
    if (dto.whatsapp_text !== undefined) updateData.whatsapp_text = dto.whatsapp_text.trim();
    if (dto.contact_phone !== undefined) updateData.contact_phone = dto.contact_phone.trim();
    if (dto.contact_email !== undefined) updateData.contact_email = dto.contact_email.trim();
    if (dto.meeting_link !== undefined) updateData.meeting_link = dto.meeting_link.trim();
    if (dto.meeting_enabled !== undefined) updateData.meeting_enabled = Boolean(dto.meeting_enabled);
    if (dto.is_published !== undefined) updateData.is_published = Boolean(dto.is_published);
    if (dto.sort_order !== undefined) updateData.sort_order = Number(dto.sort_order);

    await this.knex(SERVICES_TABLE).where("id", id).update(updateData);
    const updated = await this.knex(SERVICES_TABLE).where("id", id).first();
    return this.parseServiceRow(updated);
  }

  async deleteService(id: number): Promise<{ success: boolean }> {
    const existing = await this.knex(SERVICES_TABLE).where("id", id).first();
    if (!existing) {
      throw new NotFoundException("Service not found");
    }
    await this.knex(SERVICES_TABLE).where("id", id).delete();
    return { success: true };
  }

  async listBookings(filters?: { service_id?: number; status?: string }): Promise<ServiceBooking[]> {
    const query = this.knex(BOOKINGS_TABLE).orderBy("created_at", "desc");
    if (filters?.service_id) {
      query.where("service_id", filters.service_id);
    }
    if (filters?.status) {
      query.where("status", filters.status);
    }
    return query;
  }

  async updateBookingStatus(
    id: number,
    payload: { status?: string; admin_notes?: string },
  ): Promise<ServiceBooking> {
    const existing = await this.knex(BOOKINGS_TABLE).where("id", id).first();
    if (!existing) {
      throw new NotFoundException("Booking not found");
    }
    const updateData: any = { updated_at: this.knex.fn.now() };
    if (payload.status) updateData.status = payload.status;
    if (payload.admin_notes !== undefined) updateData.admin_notes = payload.admin_notes;

    await this.knex(BOOKINGS_TABLE).where("id", id).update(updateData);
    return this.knex(BOOKINGS_TABLE).where("id", id).first();
  }

  async deleteBooking(id: number): Promise<{ success: boolean }> {
    const existing = await this.knex(BOOKINGS_TABLE).where("id", id).first();
    if (!existing) {
      throw new NotFoundException("Booking not found");
    }
    await this.knex(BOOKINGS_TABLE).where("id", id).delete();
    return { success: true };
  }
}
