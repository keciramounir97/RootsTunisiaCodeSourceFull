import { Injectable, Inject, NotFoundException } from '@nestjs/common';

@Injectable()
export class SourcesService {
    constructor(@Inject('KnexConnection') private readonly knex) {}

    async listByUser(userId: number) {
        return this.knex('user_sources')
            .where({ user_id: userId })
            .orderBy('created_at', 'desc');
    }

    async getById(id: number, userId?: number) {
        const query = this.knex('user_sources').where({ id });
        if (userId) query.where({ user_id: userId });
        const source = await query.first();
        if (!source) throw new NotFoundException('Source not found');
        return source;
    }

    async create(userId: number, data: { title: string; url?: string; description?: string; icon_url?: string }) {
        const [id] = await this.knex('user_sources').insert({
            user_id: userId,
            title: data.title,
            url: data.url || '',
            description: data.description || '',
            icon_url: data.icon_url || '',
        });
        return this.knex('user_sources').where({ id }).first();
    }

    async update(id: number, userId: number, data: { title?: string; url?: string; description?: string; icon_url?: string }) {
        await this.getById(id, userId);
        const patch: any = { updated_at: this.knex.fn.now() };
        if (data.title !== undefined) patch.title = data.title;
        if (data.url !== undefined) patch.url = data.url;
        if (data.description !== undefined) patch.description = data.description;
        if (data.icon_url !== undefined) patch.icon_url = data.icon_url;

        await this.knex('user_sources').where({ id, user_id: userId }).update(patch);
        return this.knex('user_sources').where({ id }).first();
    }

    async delete(id: number, userId: number) {
        await this.getById(id, userId);
        await this.knex('user_sources').where({ id, user_id: userId }).del();
        return { deleted: true };
    }

    async listAll() {
        return this.knex('user_sources')
            .select('user_sources.*', 'users.email as user_email')
            .leftJoin('users', 'user_sources.user_id', 'users.id')
            .orderBy('user_sources.created_at', 'desc');
    }
}
