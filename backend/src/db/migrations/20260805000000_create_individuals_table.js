exports.up = function(knex) {
  return knex.schema.hasTable('individuals').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('individuals', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().nullable();
        table.string('name', 255).notNullable();
        table.string('given', 255).nullable();
        table.string('surname', 255).nullable();
        table.string('gender', 20).nullable();
        table.string('birth_year', 100).nullable();
        table.string('birth_place', 255).nullable();
        table.string('death_date', 100).nullable();
        table.string('death_place', 255).nullable();
        table.string('profession', 255).nullable();
        table.text('details').nullable();
        table.text('custom_fields').nullable();
        table.text('source_links').nullable();
        table.text('gedcom_text').nullable();
        table.boolean('is_backed_up').defaultTo(true);
        table.boolean('is_public').defaultTo(true);
        table.timestamps(true, true);
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('individuals');
};
