/**
 * Align subscription_tiers with public pricing: Premium $1.99, Historian $3.99.
 * Only rewrites the legacy seed amounts (9.99 / 19.99) so custom admin prices stay intact.
 */
exports.up = async function (knex) {
  if (!(await knex.schema.hasTable("subscription_tiers"))) return;

  await knex("subscription_tiers")
    .where({ id: 2 })
    .whereIn("price", [9.99, "9.99"])
    .update({ price: 1.99 });

  await knex("subscription_tiers")
    .where({ id: 3 })
    .whereIn("price", [19.99, "19.99"])
    .update({ price: 3.99 });

  await knex("subscription_tiers")
    .where({ id: 2 })
    .whereRaw("ROUND(price, 2) = ?", [9.99])
    .update({ price: 1.99 });

  await knex("subscription_tiers")
    .where({ id: 3 })
    .whereRaw("ROUND(price, 2) = ?", [19.99])
    .update({ price: 3.99 });
};

exports.down = async function (knex) {
  if (!(await knex.schema.hasTable("subscription_tiers"))) return;

  await knex("subscription_tiers")
    .where({ id: 2 })
    .whereIn("price", [1.99, "1.99"])
    .update({ price: 9.99 });

  await knex("subscription_tiers")
    .where({ id: 3 })
    .whereIn("price", [3.99, "3.99"])
    .update({ price: 19.99 });
};
