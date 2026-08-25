import { BaseModel } from './BaseModel';

export class SubscriptionTier extends BaseModel {
    static tableName = 'subscription_tiers';

    id!: number;
    name!: string;
    price!: number;
    interval!: 'monthly' | 'yearly';
    features!: string;
    is_active!: boolean;
    sort_order!: number;

    static jsonSchema = {
        type: 'object',
        required: ['name', 'price', 'interval'],
        properties: {
            id: { type: 'integer' },
            name: { type: 'string', minLength: 1, maxLength: 100 },
            price: { type: 'number' },
            interval: { type: 'string', enum: ['monthly', 'yearly'] },
            is_active: { type: 'boolean' },
        },
    };
}