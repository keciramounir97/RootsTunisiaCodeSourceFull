/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasComments = await knex.schema.hasTable('social_comments');
  if (!hasComments) {
    await knex.schema.createTable('social_comments', (table) => {
      table.increments('id').primary();
      table.string('media_key', 255).notNullable().index();
      table.integer('user_id').unsigned().notNullable().index();
      table.string('user_name', 255).defaultTo('Member');
      table.text('content').notNullable();
      table.string('entity_type', 100).defaultTo('tree');
      table.integer('entity_id').unsigned().nullable();
      table.boolean('is_approved').defaultTo(true).index();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  const hasLikes = await knex.schema.hasTable('social_likes');
  if (!hasLikes) {
    await knex.schema.createTable('social_likes', (table) => {
      table.increments('id').primary();
      table.string('media_key', 255).notNullable().index();
      table.integer('user_id').unsigned().notNullable().index();
      table.string('entity_type', 100).defaultTo('tree');
      table.integer('entity_id').unsigned().nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.unique(['media_key', 'user_id']);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('social_likes');
  await knex.schema.dropTableIfExists('social_comments');
};

