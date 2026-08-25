import { BaseModel } from './BaseModel';

export class TaskComment extends BaseModel {
    static tableName = 'task_comments';

    id!: number;
    task_id!: number;
    user_id!: number;
    content!: string;

    static jsonSchema = {
        type: 'object',
        required: ['task_id', 'user_id', 'content'],
        properties: {
            id: { type: 'integer' },
            task_id: { type: 'integer' },
            user_id: { type: 'integer' },
            content: { type: 'string', minLength: 1 },
        },
    };
}