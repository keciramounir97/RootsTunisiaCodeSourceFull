import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Individual } from '../../models/Individual';
import { Knex } from 'knex';
import { Request as ExpressRequest } from 'express';

@Controller()
export class IndividualsController {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

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

  // Public Endpoint: list public individuals
  @Get('individuals')
  async listPublicIndividuals() {
    const list = await Individual.query(this.knex)
      .where('is_public', true)
      .orderBy('id', 'desc');
    return list.map((item) => this.parseIndividual(item));
  }

  // Admin / My Endpoints: list all individuals
  @Get('admin/individuals')
  @UseGuards(JwtAuthGuard)
  async listAdminIndividuals() {
    const list = await Individual.query(this.knex).orderBy('id', 'desc');
    return list.map((item) => this.parseIndividual(item));
  }

  @Post('admin/individuals')
  @UseGuards(JwtAuthGuard)
  async createIndividual(@Body() body: any, @Request() req: ExpressRequest) {
    const userId = (req.user as any)?.id || null;
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
      is_public: body.isPublic !== undefined ? Boolean(body.isPublic) : true,
    };

    const inserted = await Individual.query(this.knex).insert(payload);
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
    return this.parseIndividual(updated);
  }

  @Delete('admin/individuals/:id')
  @UseGuards(JwtAuthGuard)
  async deleteIndividual(@Param('id') id: string) {
    const resolvedId = this.resolveIndividualId(id);
    const existing = await Individual.query(this.knex).findById(resolvedId);
    if (!existing) throw new NotFoundException('Individual not found');
    await Individual.query(this.knex).deleteById(resolvedId);
    return { success: true, id: resolvedId };
  }
}
