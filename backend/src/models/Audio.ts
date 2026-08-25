import { BaseModel } from './BaseModel';

export class Audio extends BaseModel {
    static tableName = 'audios';

    id!: number;
    title!: string;
    description?: string;
    audio_path?: string;
    // DB backup copy of the uploaded audio bytes (survives an uploads-folder wipe).
    audio_data?: Buffer | null;
    audio_mime_type?: string | null;
    duration?: number;
    category?: string;
    archive_source?: string;
    uploaded_by?: number;
    is_public!: boolean;
    likes!: number;

    static jsonSchema = {
        type: 'object',
        required: ['title'],
        properties: {
            id: { type: 'integer' },
            title: { type: 'string', minLength: 1, maxLength: 255 },
            is_public: { type: 'boolean' },
        },
    };

    // Never ship the raw audio bytes in JSON responses (kept for DB backup only).
    $formatJson(json: any) {
        json = super.$formatJson(json);
        delete json.audio_data;
        return json;
    }
}
