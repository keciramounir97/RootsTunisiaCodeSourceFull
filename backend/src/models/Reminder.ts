import { BaseModel } from './BaseModel';

export class Reminder extends BaseModel {
    static tableName = 'reminders';

    id!: number;
    user_id!: number;
    title!: string;
    reminder_date!: string;
    reminder_time?: string;
    type!: 'birthday' | 'event' | 'task' | 'custom';
    is_completed!: boolean;

    static jsonSchema = {
        type: 'object',
        required: ['user_id', 'title', 'reminder_date', 'type'],
        properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            title: { type: 'string', minLength: 1, maxLength: 255 },
            reminder_date: { type: 'string' },
            type: { type: 'string', enum: ['birthday', 'event', 'task', 'custom'] },
            is_completed: { type: 'boolean' },
        },
    };
}