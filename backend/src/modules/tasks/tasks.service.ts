import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Task } from '../../models/Task';
import { TaskComment } from '../../models/TaskComment';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class TasksService {
    constructor(
        @Inject('KnexConnection') private readonly knex,
        private readonly subscriptionsService: SubscriptionsService,
    ) {}

    async listByUser(userId: number) {
        return Task.query(this.knex).where('user_id', userId).orderBy('created_at', 'desc');
    }

    async getById(id: number, userId?: number) {
        const query = Task.query(this.knex).findById(id);
        if (userId) query.where('user_id', userId);
        const task = await query;
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async create(data: Partial<Task>) {
        if (data.user_id) {
            await this.subscriptionsService.checkUserQuota(data.user_id, 'tasks');
        }
        return Task.query(this.knex).insertAndFetch(data);
    }

    async update(id: number, data: Partial<Task>, userId: number) {
        const task = await this.getById(id, userId);
        return Task.query(this.knex).patchAndFetchById(id, data);
    }

    async delete(id: number, userId: number) {
        const task = await this.getById(id, userId);
        await Task.query(this.knex).deleteById(id);
        return { deleted: true };
    }

    async getComments(taskId: number) {
        return TaskComment.query(this.knex).where('task_id', taskId).orderBy('created_at', 'asc');
    }

    async addComment(taskId: number, userId: number, content: string) {
        return TaskComment.query(this.knex).insertAndFetch({ task_id: taskId, user_id: userId, content });
    }

    async listAll() {
        return Task.query(this.knex)
            .select('tasks.*', 'users.email as user_email')
            .leftJoin('users', 'tasks.user_id', 'users.id')
            .orderBy('tasks.created_at', 'desc');
    }

    async adminUpdate(id: number, data: Partial<Task>) {
        await this.getById(id);
        return Task.query(this.knex).patchAndFetchById(id, data);
    }

    async adminDelete(id: number) {
        await this.getById(id);
        await Task.query(this.knex).deleteById(id);
        return { deleted: true };
    }
}