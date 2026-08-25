import { BaseModel } from './BaseModel';

export class Task extends BaseModel {
    static tableName = 'tasks';

    id!: number;
    user_id!: number;
    title!: string;
    description?: string;
    status!: 'todo' | 'in_progress' | 'done';
    priority!: 'low' | 'medium' | 'high';
    due_date?: string;
    assigned_to?: number;
    image_url?: string;

    static jsonSchema = {
        type: 'object',
        required: ['user_id', 'title', 'status'],
        properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            title: { type: 'string', minLength: 1, maxLength: 255 },
            status: { type: 'string', enum: ['todo', 'in_progress', 'done'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            image_url: { type: 'string', maxLength: 500 },
        },
    };
}