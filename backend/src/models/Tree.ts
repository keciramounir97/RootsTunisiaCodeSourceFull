import { BaseModel } from './BaseModel';
import { Model } from 'objection';

export class Tree extends BaseModel {
    static tableName = 'family_trees';

    id!: number;
    user_id?: number;
    title!: string;
    description?: string;
    gedcom_path?: string;
    // Full GEDCOM content stored in the DB as a backup, so trees survive even if
    // the uploads folder is wiped. Populated on create/update; stripped from list
    // responses. Derived flag `has_gedcom_backup` is added on read.
    gedcom_text?: string | null;
    has_gedcom_backup?: number | boolean;
    data_format?: 'gedcom' | 'gedcomx' | 'gedcom7';
    archive_source?: string;
    document_code?: string;
    is_public!: boolean;

    static jsonSchema = {
        type: 'object',
        required: ['title'],
        properties: {
            id: { type: 'integer' },
            title: { type: 'string', minLength: 1, maxLength: 255 },
            is_public: { type: 'boolean' },
        },
    };

    static relationMappings = () => ({
        owner: {
            relation: Model.BelongsToOneRelation,
            modelClass: require('./User').User,
            join: {
                from: 'family_trees.user_id',
                to: 'users.id',
            },
        },
        people: {
            relation: Model.HasManyRelation,
            modelClass: require('./Person').Person,
            join: {
                from: 'family_trees.id',
                to: 'persons.tree_id',
            },
        },
        images: {
            relation: Model.HasManyRelation,
            modelClass: require('./Gallery').Gallery,
            join: {
                from: 'family_trees.id',
                to: 'gallery.tree_id',
            },
        },
    });
}
