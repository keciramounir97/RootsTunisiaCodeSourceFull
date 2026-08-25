export async function up(knex) {
    await knex.schema.alterTable('tasks', (table) => {
        table.string('image_url', 500).nullable();
    });
    await knex.schema.alterTable('notes', (table) => {
        table.string('image_url', 500).nullable();
    });
}

export async function down(knex) {
    await knex.schema.alterTable('tasks', (table) => {
        table.dropColumn('image_url');
    });
    await knex.schema.alterTable('notes', (table) => {
        table.dropColumn('image_url');
    });
}
