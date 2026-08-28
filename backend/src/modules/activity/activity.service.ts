import { Injectable, Inject } from '@nestjs/common';
import { ActivityLog } from '../../models/ActivityLog';

@Injectable()
export class ActivityService {
    constructor(@Inject('KnexConnection') private readonly knex) { }

    private async checkSchema() {
        try {
            if (await this.knex.schema.hasTable('users')) {
                if (!(await this.knex.schema.hasColumn('users', 'activity_logging_enabled'))) {
                    await this.knex.schema.alterTable('users', (t: any) => {
                        t.boolean('activity_logging_enabled').defaultTo(true);
                    });
                }
            }
        } catch {
            // ignore schema check errors
        }
    }

    async log(userId: number | null, type: string, description: string) {
        try {
            if (userId) {
                await this.checkSchema();
                const user = await this.knex('users').where({ id: userId }).select('activity_logging_enabled').first();
                if (user && (user.activity_logging_enabled === 0 || user.activity_logging_enabled === false)) {
                    return; // Logging disabled by user
                }
            }
            await this.knex('activity_logs').insert({
                actor_user_id: userId,
                type,
                description,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            });
        } catch (err: any) {
            console.error('Failed to log activity:', err?.message || err);
        }
    }

    async findAll(limit = 50) {
        return ActivityLog.query(this.knex)
            .withGraphFetched('actor')
            .orderBy('created_at', 'desc')
            .limit(limit);
    }

    async findMyActivity(userId: number, limit = 50) {
        return ActivityLog.query(this.knex)
            .where('actor_user_id', userId)
            .orderBy('created_at', 'desc')
            .limit(limit);
    }

    async getActivitySettings(userId: number) {
        await this.checkSchema();
        const user = await this.knex('users').where({ id: userId }).select('activity_logging_enabled').first();
        const enabled = user ? user.activity_logging_enabled !== 0 && user.activity_logging_enabled !== false : true;
        return { enabled };
    }

    async setActivityLogging(userId: number, enabled: boolean) {
        await this.checkSchema();
        await this.knex('users').where({ id: userId }).update({
            activity_logging_enabled: enabled ? 1 : 0,
        });
        return { enabled };
    }
}
