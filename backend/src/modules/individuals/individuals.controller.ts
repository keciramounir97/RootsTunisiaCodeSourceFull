import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Individual } from '../../models/Individual';
import { Knex } from 'knex';
import { Request as ExpressRequest } from 'express';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Controller()
export class IndividualsController {
  constructor(
    @Inject('KnexConnection') private readonly knex: Knex,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  private resolveIndividualId(id: string) {
    const raw = String(id || '').trim();
    const numericMatch = raw.match(/^(?:ind-)?(\d+)$/i);
    if (numericMatch) return Number(numericMatch[1]);
    if (!raw) throw new BadRequestException('Invalid individual id');
    return raw;
  }

  private parseIndividual(item: any) {
    if (!item) return item;
    let customFields = item.custom_fields || item.customFields;
    if (typeof customFields === 'string') {
      try { customFields = JSON.parse(customFields); } catch { customFields = []; }
    }
    let sourceLinks = item.source_links || item.sourceLinks;
    if (typeof sourceLinks === 'string') {
      try { sourceLinks = JSON.parse(sourceLinks); } catch { sourceLinks = []; }
    }
    return {
      id: item.id,
      userId: item.user_id,
      name: item.name,
      given: item.given || '',
      surname: item.surname || '',
      gender: item.gender || '',
      birthYear: item.birth_year || '',
      birthPlace: item.birth_place || '',
      deathDate: item.death_date || '',
      deathPlace: item.death_place || '',
      profession: item.profession || '',
      details: item.details || '',
      customFields: Array.isArray(customFields) ? customFields : [],
      sourceLinks: Array.isArray(sourceLinks) ? sourceLinks : [],
      gedcomText: item.gedcom_text || item.gedcomText || '',
      isBackedUp: item.is_backed_up !== undefined ? Boolean(item.is_backed_up) : true,
      isPublic: item.is_public !== undefined ? Boolean(item.is_public) : true,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }

  // Standard columns for bulk listings (excluding heavy LONGTEXT gedcom_text)
  private readonly summaryColumns = [
    'id', 'user_id', 'tree_id', 'gedcom_id', 'name', 'first_name', 'last_name',
    'given', 'surname', 'gender', 'birth_year', 'birth_date', 'birth_place',
    'death_date', 'death_place', 'profession', 'details', 'custom_fields',
    'source_links', 'is_backed_up', 'is_public', 'created_at', 'updated_at'
  ];

  private indCache = new Map<string, { data: any; expiry: number }>();

  private getCached(key: string) {
    const item = this.indCache.get(key);
    if (item && item.expiry > Date.now()) return item.data;
    return null;
  }

  private setCached(key: string, data: any, ttlMs = 5000) {
    this.indCache.set(key, { data, expiry: Date.now() + ttlMs });
  }

  public clearCache() {
    this.indCache.clear();
  }

  // Public Endpoint: list public individuals
  @Get('individuals')
  async listPublicIndividuals() {
    const cached = this.getCached('public');
    if (cached) return cached;

    const list = await Individual.query(this.knex)
      .select(this.summaryColumns)
      .where('is_public', true)
      .orderBy('id', 'desc');
    const result = list.map((item) => this.parseIndividual(item));
    this.setCached('public', result);
    return result;
  }

  // Admin / My Endpoints: list all individuals
  @Get('admin/individuals')
  @UseGuards(JwtAuthGuard)
  async listAdminIndividuals() {
    const cached = this.getCached('admin');
    if (cached) return cached;

    const list = await Individual.query(this.knex)
      .select(this.summaryColumns)
      .orderBy('id', 'desc');
    const result = list.map((item) => this.parseIndividual(item));
    this.setCached('admin', result);
    return result;
  }

  // GET single individual with full details including gedcom_text
  @Get('individuals/:id')
  async getIndividual(@Param('id') id: string) {
    const resolvedId = this.resolveIndividualId(id);
    const cached = this.getCached(`ind_${resolvedId}`);
    if (cached) return cached;

    const existing = await Individual.query(this.knex).findById(resolvedId);
    if (!existing) throw new NotFoundException('Individual not found');
    const result = this.parseIndividual(existing);
    this.setCached(`ind_${resolvedId}`, result);
    return result;
  }

  @Post('admin/individuals')
  @UseGuards(JwtAuthGuard)
  async createIndividual(@Body() body: any, @Request() req: ExpressRequest) {
    const userId = (req.user as any)?.id || null;
    if (userId) {
      await this.subscriptionsService.checkUserQuota(userId, 'individuals');
    }
    const payload = {
      user_id: userId,
      name: body.name || 'Sans Nom',
      given: body.given || '',
      surname: body.surname || '',
      gender: body.gender || '',
      birth_year: body.birthYear || '',
      birth_place: body.birthPlace || '',
      death_date: body.deathDate || '',
      death_place: body.deathPlace || '',
      profession: body.profession || '',
      details: body.details || '',
      custom_fields: JSON.stringify(body.customFields || []),
      source_links: JSON.stringify(body.sourceLinks || []),
      gedcom_text: body.gedcomText || '',
      is_backed_up: body.isBackedUp !== undefined ? Boolean(body.isBackedUp) : true,
      is_public: body.isPublic !== undefined ? Boolean(body.isPublic) : (body.is_public !== undefined ? Boolean(body.is_public) : true),
    };

    const inserted = await Individual.query(this.knex).insert(payload);
    this.clearCache();
    return this.parseIndividual(inserted);
  }

  @Put('admin/individuals/:id')
  @UseGuards(JwtAuthGuard)
  async updateIndividual(@Param('id') id: string, @Body() body: any) {
    const resolvedId = this.resolveIndividualId(id);
    const existing = await Individual.query(this.knex).findById(resolvedId);
    if (!existing) throw new NotFoundException('Individual not found');

    const payload: any = {};
    if (body.name !== undefined) payload.name = body.name;
    if (body.given !== undefined) payload.given = body.given;
    if (body.surname !== undefined) payload.surname = body.surname;
    if (body.gender !== undefined) payload.gender = body.gender;
    if (body.birthYear !== undefined) payload.birth_year = body.birthYear;
    if (body.birthPlace !== undefined) payload.birth_place = body.birthPlace;
    if (body.deathDate !== undefined) payload.death_date = body.deathDate;
    if (body.deathPlace !== undefined) payload.death_place = body.deathPlace;
    if (body.profession !== undefined) payload.profession = body.profession;
    if (body.details !== undefined) payload.details = body.details;
    if (body.customFields !== undefined) payload.custom_fields = JSON.stringify(body.customFields);
    if (body.sourceLinks !== undefined) payload.source_links = JSON.stringify(body.sourceLinks);
    if (body.gedcomText !== undefined) payload.gedcom_text = body.gedcomText;
    if (body.isBackedUp !== undefined) payload.is_backed_up = Boolean(body.isBackedUp);
    if (body.isPublic !== undefined) payload.is_public = Boolean(body.isPublic);

    const updated = await Individual.query(this.knex).patchAndFetchById(resolvedId, payload);
    this.clearCache();
    return this.parseIndividual(updated);
  }

  @Delete('admin/individuals/:id')
  @UseGuards(JwtAuthGuard)
  async deleteIndividual(@Param('id') id: string) {
    const resolvedId = this.resolveIndividualId(id);
    const existing = await Individual.query(this.knex).findById(resolvedId);
    if (!existing) throw new NotFoundException('Individual not found');
    await Individual.query(this.knex).deleteById(resolvedId);
    this.clearCache();
    return { success: true, id: resolvedId };
  }
}
