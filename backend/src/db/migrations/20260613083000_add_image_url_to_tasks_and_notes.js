exports.up = async function (knex) {
    if (await knex.schema.hasTable('tasks')) {
        const hasCol = await knex.schema.hasColumn('tasks', 'image_url');
        if (!hasCol) {
            await knex.schema.alterTable('tasks', (table) => {
                table.string('image_url', 500).nullable();
            });
        }
    }
    if (await knex.schema.hasTable('notes')) {
        const hasCol = await knex.schema.hasColumn('notes', 'image_url');
        if (!hasCol) {
            await knex.schema.alterTable('notes', (table) => {
                table.string('image_url', 500).nullable();
            });
        }
    }
};

exports.down = async function (knex) {
    if (await knex.schema.hasTable('tasks')) {
        const hasCol = await knex.schema.hasColumn('tasks', 'image_url');
        if (hasCol) {
            await knex.schema.alterTable('tasks', (table) => {
                table.dropColumn('image_url');
            });
        }
    }
    if (await knex.schema.hasTable('notes')) {
        const hasCol = await knex.schema.hasColumn('notes', 'image_url');
        if (hasCol) {
            await knex.schema.alterTable('notes', (table) => {
                table.dropColumn('image_url');
            });
        }
    }
};
