import { Injectable, Inject, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { UpdateLegalDocumentDto, LEGAL_SLUGS, LEGAL_LOCALES } from './dto/legal.dto';
import { SEED_DOCUMENTS_BY_LOCALE, LegalLocale, LegalSlug } from './legal-seeds';

type LegalSection = { heading: string; body: string };

type LegalDocument = {
    slug: string;
    locale: string;
    title: string;
    intro: string;
    sections: LegalSection[];
    updatedAt?: string;
    translated?: boolean;
};

@Injectable()
export class LegalService implements OnModuleInit {
    constructor(
        @Inject('KnexConnection') private readonly knex,
        private readonly activityService: ActivityService,
    ) { }

    async onModuleInit() {
        try {
            await this.ensureSchema();
            await this.seedDefaults();
        } catch (err: any) {
            console.warn(`Legal schema init skipped: ${err?.message || err}`);
        }
    }

    private normalizeLocale(locale?: string): LegalLocale {
        const clean = String(locale || 'en').toLowerCase().split('-')[0];
        return LEGAL_LOCALES.includes(clean as LegalLocale) ? (clean as LegalLocale) : 'en';
    }

    private async ensureSchema() {
        if (!(await this.knex.schema.hasTable('legal_documents'))) {
            await this.knex.schema.createTable('legal_documents', (table) => {
                table.increments('id').primary();
                table.string('slug', 40).notNullable();
                table.string('locale', 5).notNullable();
                table.string('title', 255).notNullable();
                table.text('intro').nullable();
                table.text('sections').notNullable();
                table.integer('updated_by').nullable();
                table.dateTime('updated_at').defaultTo(this.knex.fn.now());
                table.unique(['slug', 'locale']);
            });
        }
    }

    private async seedDefaults() {
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        for (const slug of LEGAL_SLUGS) {
            for (const locale of LEGAL_LOCALES) {
                const existing = await this.knex('legal_documents').where({ slug, locale }).first();
                if (existing) continue;
                const seed = SEED_DOCUMENTS_BY_LOCALE[locale][slug];
                await this.knex('legal_documents').insert({
                    slug,
                    locale,
                    title: seed.title,
                    intro: seed.intro,
                    sections: JSON.stringify(seed.sections),
                    updated_at: now,
                });
            }
        }
    }

    private formatDocument(row: any, translated = true): LegalDocument {
        let sections: LegalSection[] = [];
        try {
            sections = JSON.parse(row.sections || '[]');
        } catch {
            sections = [];
        }
        return {
            slug: row.slug,
            locale: row.locale,
            title: row.title,
            intro: row.intro || '',
            sections,
            updatedAt: row.updated_at,
            translated,
        };
    }

    private assertValidSlug(slug: string): asserts slug is LegalSlug {
        if (!LEGAL_SLUGS.includes(slug as any)) {
            throw new BadRequestException(`Unknown legal document: ${slug}`);
        }
    }

    async listDocuments() {
        return LEGAL_SLUGS.map((slug) => ({ slug, title: SEED_DOCUMENTS_BY_LOCALE.en[slug].title }));
    }

    async getPublicDocument(slug: string, locale?: string) {
        this.assertValidSlug(slug);
        const normalizedLocale = this.normalizeLocale(locale);

        let row = await this.knex('legal_documents').where({ slug, locale: normalizedLocale }).first();
        if (!row && normalizedLocale !== 'en') {
            row = await this.knex('legal_documents').where({ slug, locale: 'en' }).first();
        }
        if (!row) throw new NotFoundException('Legal document not found');
        return this.formatDocument(row, row.locale === normalizedLocale);
    }

    async getAdminDocument(slug: string, locale?: string) {
        this.assertValidSlug(slug);
        const normalizedLocale = this.normalizeLocale(locale);

        const row = await this.knex('legal_documents').where({ slug, locale: normalizedLocale }).first();
        if (row) return this.formatDocument(row, true);

        const fallback = await this.knex('legal_documents').where({ slug, locale: 'en' }).first();
        if (!fallback) throw new NotFoundException('Legal document not found');
        return this.formatDocument({ ...fallback, locale: normalizedLocale }, false);
    }

    async updateDocument(slug: string, dto: UpdateLegalDocumentDto, actorId: number) {
        this.assertValidSlug(slug);
        const locale = this.normalizeLocale(dto.locale);

        const existing = await this.knex('legal_documents').where({ slug, locale }).first();
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const seed = SEED_DOCUMENTS_BY_LOCALE[locale][slug] || SEED_DOCUMENTS_BY_LOCALE.en[slug];
        const payload = {
            title: dto.title ?? existing?.title ?? seed.title,
            intro: dto.intro ?? existing?.intro ?? '',
            sections: JSON.stringify(dto.sections ?? (existing ? JSON.parse(existing.sections || '[]') : [])),
            updated_by: actorId,
            updated_at: now,
        };

        if (existing) {
            await this.knex('legal_documents').where({ slug, locale }).update(payload);
        } else {
            await this.knex('legal_documents').insert({ slug, locale, ...payload });
        }

        await this.activityService.log(actorId, 'legal', `Updated ${slug} (${locale}) legal document`);
        return this.getAdminDocument(slug, locale);
    }
}
