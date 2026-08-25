import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'objection';
import { ActivityLog } from '../../models/ActivityLog';

@Injectable()
export class ActivityService {
    constructor(@Inject('KnexConnection') private readonly knex) { }

    async log(userId: number | null, type: string, description: string) {
        try {
            await this.knex('activity_logs').insert({
                actor_user_id: userId,
                type,
                description,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            });
        } catch (err) {
            console.error('Failed to log activity:', err.message);
            // Don't crash request if logging fails
        }
    }
    async findAll(limit = 50) {
        return ActivityLog.query(this.knex)
            .withGraphFetched('actor')
            .orderBy('created_at', 'desc')
            .limit(limit);
    }
}
