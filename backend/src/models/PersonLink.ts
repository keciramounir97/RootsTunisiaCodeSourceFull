import { Model } from 'objection';

export class PersonLink extends Model {
    static tableName = 'person_links';

    id!: number;
    person_id!: number;
    label!: string;
    url!: string;
    type!: 'external' | 'document';
    document_id?: number | null;
    created_at?: string;

    static jsonSchema = {
        type: 'object',
        required: ['person_id', 'label', 'url'],
        properties: {
            id: { type: 'integer' },
            person_id: { type: 'integer' },
            label: { type: 'string', minLength: 1, maxLength: 255 },
            url: { type: 'string', minLength: 1 },
            type: { type: 'string', enum: ['external', 'document'] },
            document_id: { type: ['integer', 'null'] },
        },
    };

    static relationMappings = () => ({
        person: {
            relation: Model.BelongsToOneRelation,
            modelClass: require('./Person').Person,
            join: {
                from: 'person_links.person_id',
                to: 'persons.id',
            },
        },
    });
}
