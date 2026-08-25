exports.up = async function (knex) {
    await knex.schema.alterTable('family_trees', (table) => {
        table.string('data_format', 20).defaultTo('gedcom');
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable('family_trees', (table) => {
        table.dropColumn('data_format');
    });
};
