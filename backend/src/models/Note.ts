import { BaseModel } from './BaseModel';

export class Note extends BaseModel {
    static tableName = 'notes';

    id!: number;
    user_id!: number;
    title!: string;
    content?: string;
    is_archived!: boolean;
    image_url?: string;

    static jsonSchema = {
        type: 'object',
        required: ['user_id', 'title'],
        properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            title: { type: 'string', minLength: 1, maxLength: 255 },
            is_archived: { type: 'boolean' },
            image_url: { type: 'string', maxLength: 500 },
        },
    };
}