exports.up = async function (knex) {
    if (!(await knex.schema.hasTable('subscription_payments'))) return;

    if (!(await knex.schema.hasColumn('subscription_payments', 'admin_message'))) {
        await knex.schema.alterTable('subscription_payments', (table) => {
            table.text('admin_message').nullable();
        });
    }

    if (!(await knex.schema.hasColumn('subscription_payments', 'flag'))) {
        await knex.schema.alterTable('subscription_payments', (table) => {
            table.string('flag', 50).nullable();
        });
    }
};

exports.down = async function (knex) {
    if (!(await knex.schema.hasTable('subscription_payments'))) return;

    if (await knex.schema.hasColumn('subscription_payments', 'flag')) {
        await knex.schema.alterTable('subscription_payments', (table) => {
            table.dropColumn('flag');
        });
    }

    if (await knex.schema.hasColumn('subscription_payments', 'admin_message')) {
        await knex.schema.alterTable('subscription_payments', (table) => {
            table.dropColumn('admin_message');
        });
    }
};
