exports.up = function(knex) {
  return knex.schema.hasTable('individuals').then((exists) => {
    if (!exists) return null;
    return knex.schema.hasColumn('individuals', 'gedcom_text').then((hasColumn) => {
      if (hasColumn) return null;
      return knex.schema.table('individuals', (table) => {
        table.text('gedcom_text').nullable();
      });
    });
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable('individuals').then((exists) => {
    if (!exists) return null;
    return knex.schema.hasColumn('individuals', 'gedcom_text').then((hasColumn) => {
      if (!hasColumn) return null;
      return knex.schema.table('individuals', (table) => {
        table.dropColumn('gedcom_text');
      });
    });
  });
};
