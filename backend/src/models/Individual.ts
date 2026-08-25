import { Model } from 'objection';

export class Individual extends Model {
  static tableName = 'individuals';

  id!: number;
  user_id?: number;
  name!: string;
  given?: string;
  surname?: string;
  gender?: string;
  birth_year?: string;
  birth_place?: string;
  death_date?: string;
  death_place?: string;
  profession?: string;
  details?: string;
  custom_fields?: any;
  source_links?: any;
  gedcom_text?: string;
  is_backed_up?: boolean;
  is_public?: boolean;

  static jsonSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      user_id: { type: ['integer', 'null'] },
      name: { type: 'string' },
      given: { type: ['string', 'null'] },
      surname: { type: ['string', 'null'] },
      gender: { type: ['string', 'null'] },
      birth_year: { type: ['string', 'null'] },
      birth_place: { type: ['string', 'null'] },
      death_date: { type: ['string', 'null'] },
      death_place: { type: ['string', 'null'] },
      profession: { type: ['string', 'null'] },
      details: { type: ['string', 'null'] },
      gedcom_text: { type: ['string', 'null'] },
      is_backed_up: { type: 'boolean' },
      is_public: { type: 'boolean' },
    },
  };
}
