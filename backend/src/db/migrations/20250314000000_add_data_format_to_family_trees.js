exports.up = async function (knex) {
    if (await knex.schema.hasTable('family_trees')) {
        const hasCol = await knex.schema.hasColumn('family_trees', 'data_format');
        if (!hasCol) {
            await knex.schema.alterTable('family_trees', (table) => {
                table.string('data_format', 20).defaultTo('gedcom');
            });
        }
    }
};

exports.down = async function (knex) {
    if (await knex.schema.hasTable('family_trees')) {
        const hasCol = await knex.schema.hasColumn('family_trees', 'data_format');
        if (hasCol) {
            await knex.schema.alterTable('family_trees', (table) => {
                table.dropColumn('data_format');
            });
        }
    }
};
