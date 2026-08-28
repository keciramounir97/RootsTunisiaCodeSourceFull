/**
 * Migration: Creation Quota Limits for Subscription Tiers and User Overrides
 */

exports.up = async function(knex) {
  // 1. Add limit columns to subscription_tiers
  if (await knex.schema.hasTable('subscription_tiers')) {
    const cols = [
      { name: 'max_trees', type: (t) => t.integer('max_trees').defaultTo(5) },
      { name: 'max_gallery', type: (t) => t.integer('max_gallery').defaultTo(10) },
      { name: 'max_audios', type: (t) => t.integer('max_audios').defaultTo(5) },
      { name: 'max_documents', type: (t) => t.integer('max_documents').defaultTo(10) },
      { name: 'max_individuals', type: (t) => t.integer('max_individuals').defaultTo(50) },
    ];
    for (const c of cols) {
      if (!(await knex.schema.hasColumn('subscription_tiers', c.name))) {
        await knex.schema.alterTable('subscription_tiers', c.type);
      }
    }

    // Set defaults for default tiers (1=Basic: 10 of each, 2=Premium: 50+, 3=Family Historian: -1 unlimited)
    await knex('subscription_tiers').where('id', 1).update({
      max_trees: 10,
      max_gallery: 10,
      max_audios: 10,
      max_documents: 10,
      max_individuals: 10,
    });
    await knex('subscription_tiers').where('id', 2).update({
      max_trees: 50,
      max_gallery: 100,
      max_audios: 50,
      max_documents: 100,
      max_individuals: 500,
    });
    await knex('subscription_tiers').where('id', 3).update({
      max_trees: 1500,
      max_gallery: 1500,
      max_audios: 1500,
      max_documents: 1500,
      max_individuals: 1500,
    });
  }

  // 2. Add custom override columns to users table
  if (await knex.schema.hasTable('users')) {
    const userCols = [
      { name: 'custom_max_trees', type: (t) => t.integer('custom_max_trees').nullable() },
      { name: 'custom_max_gallery', type: (t) => t.integer('custom_max_gallery').nullable() },
      { name: 'custom_max_audios', type: (t) => t.integer('custom_max_audios').nullable() },
      { name: 'custom_max_documents', type: (t) => t.integer('custom_max_documents').nullable() },
      { name: 'custom_max_individuals', type: (t) => t.integer('custom_max_individuals').nullable() },
    ];
    for (const c of userCols) {
      if (!(await knex.schema.hasColumn('users', c.name))) {
        await knex.schema.alterTable('users', c.type);
      }
    }
  }
};

exports.down = async function(knex) {
  // Drop columns if needed
  if (await knex.schema.hasTable('subscription_tiers')) {
    const cols = ['max_trees', 'max_gallery', 'max_audios', 'max_documents', 'max_individuals'];
    for (const c of cols) {
      if (await knex.schema.hasColumn('subscription_tiers', c)) {
        await knex.schema.alterTable('subscription_tiers', (t) => t.dropColumn(c));
      }
    }
  }
  if (await knex.schema.hasTable('users')) {
    const uCols = ['custom_max_trees', 'custom_max_gallery', 'custom_max_audios', 'custom_max_documents', 'custom_max_individuals'];
    for (const c of uCols) {
      if (await knex.schema.hasColumn('users', c)) {
        await knex.schema.alterTable('users', (t) => t.dropColumn(c));
      }
    }
  }
};
