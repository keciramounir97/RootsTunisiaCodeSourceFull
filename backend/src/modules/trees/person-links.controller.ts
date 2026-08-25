import {
  Controller, Get, Post, Delete, Body, Param,
  UseGuards, Request, NotFoundException, ForbiddenException,
  BadRequestException, ParseIntPipe, Inject
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TreesService } from './trees.service';
import { Person } from '../../models/Person';
import { PersonLink } from '../../models/PersonLink';

@Controller()
export class PersonLinksController {
  constructor(
    private readonly treesService: TreesService,
    @Inject('KnexConnection') private readonly knex,
  ) {}

  private async ensurePersonAccess(personId: number, user: any) {
    const person = await Person.query(this.knex).findById(personId).withGraphFetched('tree');
    if (!person || !person.tree) throw new NotFoundException('Person not found');

    const roleId = Number(user.role_id ?? user.roleId ?? user.role ?? 0);
    const isAdmin = roleId === 1 || roleId === 3 || user.roleName === 'admin' || user.roleName === 'super_admin';

    if (!isAdmin && person.tree.user_id !== user.id) {
      // For public trees, still allow reading but not modifying
      if (!person.tree.is_public) throw new ForbiddenException('Forbidden');
    }
    return person;
  }

  /** Public: list links for a person in a public tree */
  @Get('people/:id/links')
  async listPublicLinks(@Param('id', ParseIntPipe) id: number) {
    const person = await Person.query(this.knex).findById(id).withGraphFetched('tree');
    if (!person || !person.tree) throw new NotFoundException('Person not found');
    if (!person.tree.is_public) throw new ForbiddenException('Forbidden');

    return PersonLink.query(this.knex).where('person_id', id).orderBy('created_at', 'asc');
  }

  /** Authenticated: list links for own/admin person */
  @Get('my/people/:id/links')
  @UseGuards(JwtAuthGuard)
  async listMyLinks(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.ensurePersonAccess(id, req.user);
    return PersonLink.query(this.knex).where('person_id', id).orderBy('created_at', 'asc');
  }

  /** Authenticated: add a link to a person */
  @Post('my/people/:id/links')
  @UseGuards(JwtAuthGuard)
  async addLink(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { label: string; url: string; type?: string; document_id?: number },
    @Request() req,
  ) {
    const person = await Person.query(this.knex).findById(id).withGraphFetched('tree');
    if (!person || !person.tree) throw new NotFoundException('Person not found');

    const roleId = Number(req.user.role_id ?? req.user.roleId ?? req.user.role ?? 0);
    const isAdmin = roleId === 1 || roleId === 3;
    if (!isAdmin && person.tree.user_id !== req.user.id) throw new ForbiddenException('Forbidden');

    if (!body.label?.trim()) throw new BadRequestException('Label is required');
    if (!body.url?.trim()) throw new BadRequestException('URL is required');

    const link = await PersonLink.query(this.knex).insertAndFetch({
      person_id: id,
      label: body.label.trim(),
      url: body.url.trim(),
      type: (body.type === 'document' ? 'document' : 'external') as 'external' | 'document',
      document_id: body.document_id ?? null,
    });

    return link;
  }

  /** Authenticated: remove a link */
  @Delete('my/people/:id/links/:linkId')
  @UseGuards(JwtAuthGuard)
  async removeLink(
    @Param('id', ParseIntPipe) id: number,
    @Param('linkId', ParseIntPipe) linkId: number,
    @Request() req,
  ) {
    const person = await Person.query(this.knex).findById(id).withGraphFetched('tree');
    if (!person || !person.tree) throw new NotFoundException('Person not found');

    const roleId = Number(req.user.role_id ?? req.user.roleId ?? req.user.role ?? 0);
    const isAdmin = roleId === 1 || roleId === 3;
    if (!isAdmin && person.tree.user_id !== req.user.id) throw new ForbiddenException('Forbidden');

    const link = await PersonLink.query(this.knex).findById(linkId);
    if (!link || link.person_id !== id) throw new NotFoundException('Link not found');

    await PersonLink.query(this.knex).deleteById(linkId);
    return { message: 'Deleted' };
  }
}
