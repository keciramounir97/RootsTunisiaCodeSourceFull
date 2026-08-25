exports.up = async function (knex) {
    if (!(await knex.schema.hasTable('subscription_payments'))) {
        const hasUsers = await knex.schema.hasTable('users');
        const hasTiers = await knex.schema.hasTable('subscription_tiers');
        await knex.schema.createTable('subscription_payments', (table) => {
            table.increments('id').primary();
            const uCol = table.integer('user_id').unsigned().notNullable();
            if (hasUsers) uCol.references('id').inTable('users').onDelete('CASCADE');
            const tCol = table.integer('tier_id').unsigned().notNullable();
            if (hasTiers) tCol.references('id').inTable('subscription_tiers');
            table.decimal('amount', 10, 2).notNullable();
            table.string('currency', 3).defaultTo('USD');
            table.string('payment_method', 50).defaultTo('bank_transfer');
            table.text('proof_url').nullable();
            table.text('notes').nullable();
            table.enu('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
            table.integer('reviewed_by').unsigned().nullable();
            table.timestamp('reviewed_at').nullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            table.index(['user_id']);
            table.index(['status']);
            table.index(['tier_id']);
        });
    }

    if (await knex.schema.hasTable('user_subscriptions')) {
        const hasCol = await knex.schema.hasColumn('user_subscriptions', 'payment_id');
        if (!hasCol) {
            await knex.schema.table('user_subscriptions', (table) => {
                table.integer('payment_id').unsigned().nullable();
            });
        }
    }
};

exports.down = async function (knex) {
    if (await knex.schema.hasTable('user_subscriptions')) {
        const hasCol = await knex.schema.hasColumn('user_subscriptions', 'payment_id');
        if (hasCol) {
            await knex.schema.table('user_subscriptions', (table) => {
                table.dropColumn('payment_id');
            });
        }
    }
    await knex.schema.dropTableIfExists('subscription_payments');
};
