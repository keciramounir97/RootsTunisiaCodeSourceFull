import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Note } from '../../models/Note';

@Injectable()
export class NotesService {
    constructor(@Inject('KnexConnection') private readonly knex) {}

    async listByUser(userId: number) {
        return Note.query(this.knex).where('user_id', userId).where('is_archived', false).orderBy('created_at', 'desc');
    }

    async getById(id: number, userId?: number) {
        const query = Note.query(this.knex).findById(id);
        if (userId) query.where('user_id', userId);
        const note = await query;
        if (!note) throw new NotFoundException('Note not found');
        return note;
    }

    async create(data: Partial<Note>) {
        return Note.query(this.knex).insertAndFetch(data);
    }

    async update(id: number, data: Partial<Note>, userId: number) {
        await this.getById(id, userId);
        return Note.query(this.knex).patchAndFetchById(id, data);
    }

    async delete(id: number, userId: number) {
        await this.getById(id, userId);
        await Note.query(this.knex).deleteById(id);
        return { deleted: true };
    }

    async listAll() {
        return Note.query(this.knex)
            .select('notes.*', 'users.email as user_email')
            .leftJoin('users', 'notes.user_id', 'users.id')
            .orderBy('notes.created_at', 'desc');
    }

    async adminUpdate(id: number, data: Partial<Note>) {
        await this.getById(id);
        return Note.query(this.knex).patchAndFetchById(id, data);
    }

    async adminDelete(id: number) {
        await this.getById(id);
        await Note.query(this.knex).deleteById(id);
        return { deleted: true };
    }
}