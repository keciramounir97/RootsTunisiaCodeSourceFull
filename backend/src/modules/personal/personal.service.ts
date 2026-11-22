import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

const TASK_STATUSES = new Set(['todo', 'in_progress', 'done']);
const TASK_PRIORITIES = new Set(['low', 'medium', 'high']);
const REMINDER_TYPES = new Set(['birthday', 'event', 'task', 'custom']);

@Injectable()
export class PersonalService {
    constructor(@Inject('KnexConnection') private readonly knex) { }

    private now() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    private clean(value: any) {
        const text = String(value ?? '').trim();
        return text.length ? text : null;
    }

    private async findOwned(table: string, userId: number, id: number) {
        const row = await this.knex(table).where({ id, user_id: userId }).first();
        if (!row) throw new NotFoundException('Item not found');
        return row;
    }

    // ----- Notes -----

    listNotes(userId: number) {
        return this.knex('user_notes').where('user_id', userId).orderBy('updated_at', 'desc');
    }

    async createNote(userId: number, data: any) {
        const title = this.clean(data?.title);
        if (!title) throw new BadRequestException('Title is required');
        const [id] = await this.knex('user_notes').insert({
            user_id: userId,
            title,
            content: this.clean(data?.content) || '',
        });
        return this.knex('user_notes').where('id', id).first();
    }

    async updateNote(userId: number, id: number, data: any) {
        await this.findOwned('user_notes', userId, id);
        const patch: Record<string, any> = { updated_at: this.now() };
        if (data?.title !== undefined) patch.title = this.clean(data.title) || 'Untitled';
        if (data?.content !== undefined) patch.content = String(data.content ?? '');
        await this.knex('user_notes').where('id', id).update(patch);
        return this.knex('user_notes').where('id', id).first();
    }

    async deleteNote(userId: number, id: number) {
        await this.findOwned('user_notes', userId, id);
        await this.knex('user_notes').where('id', id).delete();
        return { deleted: true };
    }

    // ----- Tasks -----

    listTasks(userId: number) {
        return this.knex('user_tasks').where('user_id', userId).orderBy('created_at', 'asc');
    }

    async createTask(userId: number, data: any) {
        const title = this.clean(data?.title);
        if (!title) throw new BadRequestException('Title is required');
        const status = TASK_STATUSES.has(String(data?.status)) ? String(data.status) : 'todo';
        const priority = TASK_PRIORITIES.has(String(data?.priority)) ? String(data.priority) : 'medium';
        const [id] = await this.knex('user_tasks').insert({
            user_id: userId,
            title,
            description: this.clean(data?.description) || '',
            status,
            priority,
            due_date: this.clean(data?.due_date),
        });
        return this.knex('user_tasks').where('id', id).first();
    }

    async updateTask(userId: number, id: number, data: any) {
        await this.findOwned('user_tasks', userId, id);
        const patch: Record<string, any> = { updated_at: this.now() };
        if (data?.title !== undefined) patch.title = this.clean(data.title) || 'Untitled';
        if (data?.description !== undefined) patch.description = String(data.description ?? '');
        if (data?.status !== undefined && TASK_STATUSES.has(String(data.status))) {
            patch.status = String(data.status);
        }
        if (data?.priority !== undefined && TASK_PRIORITIES.has(String(data.priority))) {
            patch.priority = String(data.priority);
        }
        if (data?.due_date !== undefined) patch.due_date = this.clean(data.due_date);
        await this.knex('user_tasks').where('id', id).update(patch);
        return this.knex('user_tasks').where('id', id).first();
    }

    async deleteTask(userId: number, id: number) {
        await this.findOwned('user_tasks', userId, id);
        await this.knex('user_tasks').where('id', id).delete();
        return { deleted: true };
    }

    // ----- Reminders -----

    listReminders(userId: number) {
        return this.knex('user_reminders')
            .where('user_id', userId)
            .orderBy('reminder_date', 'asc');
    }

    async createReminder(userId: number, data: any) {
        const title = this.clean(data?.title);
        const reminderDate = this.clean(data?.reminder_date);
        if (!title || !reminderDate) {
            throw new BadRequestException('Title and reminder date are required');
        }
        const type = REMINDER_TYPES.has(String(data?.type)) ? String(data.type) : 'custom';
        const [id] = await this.knex('user_reminders').insert({
            user_id: userId,
            title,
            reminder_date: reminderDate,
            reminder_time: this.clean(data?.reminder_time),
            type,
        });
        return this.knex('user_reminders').where('id', id).first();
    }

    async updateReminder(userId: number, id: number, data: any) {
        await this.findOwned('user_reminders', userId, id);
        const patch: Record<string, any> = { updated_at: this.now() };
        if (data?.title !== undefined) patch.title = this.clean(data.title) || 'Untitled';
        if (data?.reminder_date !== undefined) patch.reminder_date = this.clean(data.reminder_date);
        if (data?.reminder_time !== undefined) patch.reminder_time = this.clean(data.reminder_time);
        if (data?.type !== undefined && REMINDER_TYPES.has(String(data.type))) patch.type = String(data.type);
        await this.knex('user_reminders').where('id', id).update(patch);
        return this.knex('user_reminders').where('id', id).first();
    }

    async deleteReminder(userId: number, id: number) {
        await this.findOwned('user_reminders', userId, id);
        await this.knex('user_reminders').where('id', id).delete();
        return { deleted: true };
    }

    // ----- Task comments -----

    private async ensureTaskCommentsTable() {
        try {
            const has = await this.knex.schema.hasTable('task_comments');
            if (!has) {
                await this.knex.schema.createTable('task_comments', (t: any) => {
                    t.increments('id').primary();
                    t.integer('task_id').unsigned().notNullable();
                    t.integer('user_id').unsigned().notNullable();
                    t.text('content').notNullable();
                    t.timestamp('created_at').defaultTo(this.knex.fn.now());
                    t.timestamp('updated_at').defaultTo(this.knex.fn.now());
                });
            }
        } catch {}
    }

    async getTaskComments(taskId: number, userId: number) {
        await this.ensureTaskCommentsTable();
        await this.findOwned('user_tasks', userId, taskId);
        return this.knex('task_comments').where('task_id', taskId).orderBy('created_at', 'asc');
    }

    async addTaskComment(taskId: number, userId: number, content: string) {
        await this.ensureTaskCommentsTable();
        await this.findOwned('user_tasks', userId, taskId);
        const cleanContent = this.clean(content);
        if (!cleanContent) throw new BadRequestException('Comment content is required');
        const [id] = await this.knex('task_comments').insert({
            task_id: taskId,
            user_id: userId,
            content: cleanContent,
            created_at: this.now(),
            updated_at: this.now(),
        });
        return this.knex('task_comments').where('id', id).first();
    }
}
