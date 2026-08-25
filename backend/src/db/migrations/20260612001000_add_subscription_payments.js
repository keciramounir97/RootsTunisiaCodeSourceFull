export async function up(knex) {
    // 1. Subscription Payments (user-submitted payment confirmations)
    await knex.schema.createTable('subscription_payments', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('tier_id').unsigned().notNullable().references('id').inTable('subscription_tiers');
        table.decimal('amount', 10, 2).notNullable();
        table.string('currency', 3).defaultTo('USD');
        table.string('payment_method', 50).defaultTo('bank_transfer');
        table.text('proof_url').nullable();
        table.text('notes').nullable();
        table.enu('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
        table.integer('reviewed_by').unsigned().nullable().references('id').inTable('users');
        table.timestamp('reviewed_at').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.index(['user_id']);
        table.index(['status']);
        table.index(['tier_id']);
    });

    // 2. Add payment_id to user_subscriptions for tracking which payment activated it
    await knex.schema.table('user_subscriptions', (table) => {
        table.integer('payment_id').unsigned().nullable().references('id').inTable('subscription_payments');
    });
}

export async function down(knex) {
    await knex.schema.table('user_subscriptions', (table) => {
        table.dropColumn('payment_id');
    });
    await knex.schema.dropTableIfExists('subscription_payments');
}
