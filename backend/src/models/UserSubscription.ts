import { BaseModel } from './BaseModel';

export class UserSubscription extends BaseModel {
    static tableName = 'user_subscriptions';

    id!: number;
    user_id!: number;
    tier_id!: number;
    status!: 'active' | 'canceled' | 'expired' | 'trial';
    current_period_start!: string;
    current_period_end!: string;
    canceled_at?: string;
    payment_id?: number;

    static jsonSchema = {
        type: 'object',
        required: ['user_id', 'tier_id', 'status'],
        properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            tier_id: { type: 'integer' },
            status: { type: 'string', enum: ['active', 'canceled', 'expired', 'trial'] },
        },
    };
}