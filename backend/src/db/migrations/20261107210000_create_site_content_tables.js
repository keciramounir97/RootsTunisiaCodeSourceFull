/**
 * Public Content Manager storage.
 * (SiteContentService also creates these lazily at boot; this migration keeps
 * knex-managed environments in sync.)
 */
exports.up = async function (knex) {
    if (!(await knex.schema.hasTable('site_content'))) {
        await knex.schema.createTable('site_content', (table) => {
            table.string('key', 100).primary();
            table.text('value', 'longtext').notNullable();
            table.integer('updated_by').nullable();
            table.dateTime('updated_at').defaultTo(knex.fn.now());
        });
    }

    if (!(await knex.schema.hasTable('site_content_assets'))) {
        await knex.schema.createTable('site_content_assets', (table) => {
            table.string('filename', 255).primary();
            table.string('mime_type', 100).notNullable();
            table.specificType('data', 'longblob').notNullable();
            table.integer('size').notNullable().defaultTo(0);
            table.dateTime('created_at').defaultTo(knex.fn.now());
        });
    }
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('site_content_assets');
    await knex.schema.dropTableIfExists('site_content');
};
