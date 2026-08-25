import { BaseModel } from './BaseModel';

export class SubscriptionPayment extends BaseModel {
    static tableName = 'subscription_payments';

    id!: number;
    user_id!: number;
    tier_id!: number;
    amount!: number;
    currency!: string;
    payment_method!: string;
    proof_url?: string;
    notes?: string;
    status!: 'pending' | 'approved' | 'rejected';
    reviewed_by?: number;
    reviewed_at?: string;

    static jsonSchema = {
        type: 'object',
        required: ['user_id', 'tier_id', 'amount'],
        properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            tier_id: { type: 'integer' },
            amount: { type: 'number' },
            currency: { type: 'string', minLength: 3, maxLength: 3 },
            payment_method: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
        },
    };
}
