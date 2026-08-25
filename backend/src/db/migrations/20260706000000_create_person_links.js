exports.up = async function (knex) {
  if (await knex.schema.hasTable('person_links')) return;
  const hasPersons = await knex.schema.hasTable('persons');
  const hasDocuments = await knex.schema.hasTable('documents');
  await knex.schema.createTable('person_links', (table) => {
    table.increments('id').primary();
    const pCol = table.integer('person_id').unsigned().notNullable();
    if (hasPersons) pCol.references('id').inTable('persons').onDelete('CASCADE');
    table.string('label').notNullable();
    table.text('url').notNullable();
    table.string('type').notNullable().defaultTo('external');
    const dCol = table.integer('document_id').unsigned().nullable();
    if (hasDocuments) dCol.references('id').inTable('documents').onDelete('SET NULL');
    table.dateTime('created_at').defaultTo(knex.fn.now());

    table.index(['person_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('person_links');
};
