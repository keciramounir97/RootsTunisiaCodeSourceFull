import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { UPLOADS_DIR } from '../../common/utils/file.utils';

export const ADMIN_UPLOADS_DIR = path.join(UPLOADS_DIR, 'admin');

const TASK_STATUSES = new Set(['todo', 'in_progress', 'done']);

@Injectable()
export class WorkspaceService {
    constructor(@Inject('KnexConnection') private readonly knex) { }

    private now() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    private clean(value: any) {
        const text = String(value ?? '').trim();
        return text.length ? text : null;
    }

    private imageUrl(file?: Express.Multer.File) {
        return file ? `/uploads/admin/${file.filename}` : undefined;
    }

    private withAuthor(table: string) {
        return this.knex(table)
            .leftJoin('users', `${table}.admin_id`, 'users.id')
            .select(`${table}.*`, 'users.email as user_email')
            .orderBy(`${table}.created_at`, 'desc');
    }

    // ----- Admin notes -----

    listNotes() {
        return this.withAuthor('admin_notes');
    }

    async createNote(adminId: number, data: any, file?: Express.Multer.File) {
        const title = this.clean(data?.title);
        if (!title) throw new BadRequestException('Title is required');
        const [id] = await this.knex('admin_notes').insert({
            admin_id: adminId,
            title,
            content: this.clean(data?.content) || '',
            image_url: this.imageUrl(file) || null,
        });
        return this.knex('admin_notes').where('id', id).first();
    }

    async updateNote(id: number, data: any, file?: Express.Multer.File) {
        const row = await this.knex('admin_notes').where('id', id).first();
        if (!row) throw new NotFoundException('Note not found');
        const patch: Record<string, any> = { updated_at: this.now() };
        if (data?.title !== undefined) patch.title = this.clean(data.title) || row.title;
        if (data?.content !== undefined) patch.content = String(data.content ?? '');
        const imageUrl = this.imageUrl(file);
        if (imageUrl) patch.image_url = imageUrl;
        await this.knex('admin_notes').where('id', id).update(patch);
        return this.knex('admin_notes').where('id', id).first();
    }

    async deleteNote(id: number) {
        const deleted = await this.knex('admin_notes').where('id', id).delete();
        if (!deleted) throw new NotFoundException('Note not found');
        return { deleted: true };
    }

    // ----- Admin tasks -----

    listTasks() {
        return this.withAuthor('admin_tasks');
    }

    async createTask(adminId: number, data: any, file?: Express.Multer.File) {
        const title = this.clean(data?.title);
        if (!title) throw new BadRequestException('Title is required');
        const status = TASK_STATUSES.has(String(data?.status)) ? String(data.status) : 'todo';
        const [id] = await this.knex('admin_tasks').insert({
            admin_id: adminId,
            title,
            description: this.clean(data?.description) || '',
            status,
            image_url: this.imageUrl(file) || null,
        });
        return this.knex('admin_tasks').where('id', id).first();
    }

    async updateTask(id: number, data: any, file?: Express.Multer.File) {
        const row = await this.knex('admin_tasks').where('id', id).first();
        if (!row) throw new NotFoundException('Task not found');
        const patch: Record<string, any> = { updated_at: this.now() };
        if (data?.title !== undefined) patch.title = this.clean(data.title) || row.title;
        if (data?.description !== undefined) patch.description = String(data.description ?? '');
        if (data?.status !== undefined && TASK_STATUSES.has(String(data.status))) {
            patch.status = String(data.status);
        }
        const imageUrl = this.imageUrl(file);
        if (imageUrl) patch.image_url = imageUrl;
        await this.knex('admin_tasks').where('id', id).update(patch);
        return this.knex('admin_tasks').where('id', id).first();
    }

    async deleteTask(id: number) {
        const deleted = await this.knex('admin_tasks').where('id', id).delete();
        if (!deleted) throw new NotFoundException('Task not found');
        return { deleted: true };
    }
}
