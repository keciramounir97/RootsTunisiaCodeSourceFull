import { BaseModel } from './BaseModel';

export class SubscriptionPageAccess extends BaseModel {
    static tableName = 'subscription_page_access';

    id!: number;
    tier_id!: number;
    page_key!: string;

    static jsonSchema = {
        type: 'object',
        required: ['tier_id', 'page_key'],
        properties: {
            id: { type: 'integer' },
            tier_id: { type: 'integer' },
            page_key: { type: 'string', minLength: 1, maxLength: 100 },
        },
    };
}