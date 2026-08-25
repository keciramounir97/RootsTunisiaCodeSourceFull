import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Reminder } from '../../models/Reminder';

@Injectable()
export class RemindersService {
    constructor(@Inject('KnexConnection') private readonly knex) {}

    async listByUser(userId: number) {
        return Reminder.query(this.knex).where('user_id', userId).orderBy('reminder_date', 'asc');
    }

    async getById(id: number, userId?: number) {
        const query = Reminder.query(this.knex).findById(id);
        if (userId) query.where('user_id', userId);
        const reminder = await query;
        if (!reminder) throw new NotFoundException('Reminder not found');
        return reminder;
    }

    async create(data: Partial<Reminder>) {
        return Reminder.query(this.knex).insertAndFetch(data);
    }

    async update(id: number, data: Partial<Reminder>, userId: number) {
        await this.getById(id, userId);
        return Reminder.query(this.knex).patchAndFetchById(id, data);
    }

    async delete(id: number, userId: number) {
        await this.getById(id, userId);
        await Reminder.query(this.knex).deleteById(id);
        return { deleted: true };
    }
}