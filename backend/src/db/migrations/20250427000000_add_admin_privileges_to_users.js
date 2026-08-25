export async function up(knex) {
  const hasColumn = await knex.schema.hasColumn("users", "admin_privileges");
  if (!hasColumn) {
    await knex.schema.alterTable("users", (table) => {
      table.text("admin_privileges").nullable();
    });
  }
}

export async function down(knex) {
  const hasColumn = await knex.schema.hasColumn("users", "admin_privileges");
  if (hasColumn) {
    await knex.schema.alterTable("users", (table) => {
      table.dropColumn("admin_privileges");
    });
  }
}
