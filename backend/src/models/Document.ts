import { BaseModel } from './BaseModel';

export class Document extends BaseModel {
    static tableName = 'documents';

    id!: number;
    title!: string;
    description?: string;
    file_path?: string;
    file_type?: string;
    // DB backup copy of the uploaded bytes (survives an uploads-folder wipe).
    file_data?: Buffer | null;
    file_mime_type?: string | null;
    category?: string;
    archive_source?: string;
    document_code?: string;
    date?: string;
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

    // Never ship the raw file bytes in JSON responses (kept for DB backup only).
    $formatJson(json: any) {
        json = super.$formatJson(json);
        delete json.file_data;
        return json;
    }
}
