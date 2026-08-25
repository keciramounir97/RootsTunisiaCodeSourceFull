/**
 * Add updated_at to books (BaseModel expects it)
 */
exports.up = async function (knex) {
    const hasColumn = await knex.schema.hasColumn('books', 'updated_at');
    if (!hasColumn) {
        await knex.schema.alterTable('books', (table) => {
            table.dateTime('updated_at').defaultTo(knex.fn.now());
        });
    }
};

exports.down = async function (knex) {
    const hasColumn = await knex.schema.hasColumn('books', 'updated_at');
    if (hasColumn) {
        await knex.schema.alterTable('books', (table) => {
            table.dropColumn('updated_at');
        });
    }
};
