export async function up(knex) {
    // 1. Subscription Tiers
    if (!(await knex.schema.hasTable('subscription_tiers'))) {
        await knex.schema.createTable('subscription_tiers', (table) => {
            table.increments('id').primary();
            table.string('name', 100).notNullable();
            table.decimal('price', 10, 2).notNullable();
            table.enu('interval', ['monthly', 'yearly']).notNullable().defaultTo('monthly');
            table.text('features');
            table.boolean('is_active').defaultTo(true);
            table.integer('sort_order').defaultTo(0);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });

        // Seed default subscription tiers
        await knex('subscription_tiers').insert([
            {
                name: 'Basic',
                price: 0,
                interval: 'monthly',
                features: '["Build up to 3 family trees","Basic tree visualization","Add up to 50 people per tree","Community access","Email support"]',
                sort_order: 1,
            },
            {
                name: 'Premium',
                price: 9.99,
                interval: 'monthly',
                features: '["Unlimited family trees","Advanced tree visualization","Unlimited people per tree","Archive document uploads","GEDCOM import/export","Priority email support","Advanced search & filters"]',
                sort_order: 2,
            },
            {
                name: 'Family Historian',
                price: 19.99,
                interval: 'monthly',
                features: '["Everything in Premium","AI-powered tree suggestions","AI note summarization","Task management & reminders","WhatsApp priority support","Early access to new features","Contribute to archive database"]',
                sort_order: 3,
            },
        ]);
    }

    // 2. User Subscriptions
    if (!(await knex.schema.hasTable('user_subscriptions'))) {
        await knex.schema.createTable('user_subscriptions', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.integer('tier_id').unsigned().notNullable().references('id').inTable('subscription_tiers');
            table.enu('status', ['active', 'canceled', 'expired', 'trial']).notNullable().defaultTo('trial');
            table.timestamp('current_period_start').defaultTo(knex.fn.now());
            table.timestamp('current_period_end');
            table.timestamp('canceled_at').nullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            table.index(['user_id']);
            table.index(['status']);
        });
    }

    // 3. Subscription Page Access
    if (!(await knex.schema.hasTable('subscription_page_access'))) {
        await knex.schema.createTable('subscription_page_access', (table) => {
            table.increments('id').primary();
            table.integer('tier_id').unsigned().notNullable().references('id').inTable('subscription_tiers').onDelete('CASCADE');
            table.string('page_key', 100).notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());

            table.unique(['tier_id', 'page_key']);
        });

        // Seed basic tier page access
        await knex('subscription_page_access').insert([
            { tier_id: 1, page_key: 'gallery' },
            { tier_id: 1, page_key: 'periods' },
            { tier_id: 1, page_key: 'sources' },
            { tier_id: 1, page_key: 'subscriptions' },
            { tier_id: 2, page_key: 'gallery' },
            { tier_id: 2, page_key: 'periods' },
            { tier_id: 2, page_key: 'sources' },
            { tier_id: 2, page_key: 'subscriptions' },
            { tier_id: 2, page_key: 'archives' },
            { tier_id: 2, page_key: 'gallery_upload' },
            { tier_id: 3, page_key: '*' },
        ]);
    }

    // 4. Tasks
    if (!(await knex.schema.hasTable('tasks'))) {
        await knex.schema.createTable('tasks', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.string('title', 255).notNullable();
            table.text('description').nullable();
            table.enu('status', ['todo', 'in_progress', 'done']).notNullable().defaultTo('todo');
            table.enu('priority', ['low', 'medium', 'high']).defaultTo('medium');
            table.date('due_date').nullable();
            table.integer('assigned_to').unsigned().nullable().references('id').inTable('users');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            table.index(['user_id', 'status']);
        });
    }

    // 5. Task Comments
    if (!(await knex.schema.hasTable('task_comments'))) {
        await knex.schema.createTable('task_comments', (table) => {
            table.increments('id').primary();
            table.integer('task_id').unsigned().notNullable().references('id').inTable('tasks').onDelete('CASCADE');
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.text('content').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            table.index(['task_id']);
        });
    }

    // 6. Notes
    if (!(await knex.schema.hasTable('notes'))) {
        await knex.schema.createTable('notes', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.string('title', 255).notNullable();
            table.text('content').nullable();
            table.boolean('is_archived').defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            table.index(['user_id', 'is_archived']);
        });
    }

    // 7. Reminders
    if (!(await knex.schema.hasTable('reminders'))) {
        await knex.schema.createTable('reminders', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.string('title', 255).notNullable();
            table.date('reminder_date').notNullable();
            table.time('reminder_time').nullable();
            table.enu('type', ['birthday', 'event', 'task', 'custom']).notNullable().defaultTo('custom');
            table.boolean('is_completed').defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            table.index(['user_id', 'reminder_date']);
        });
    }
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('reminders');
    await knex.schema.dropTableIfExists('notes');
    await knex.schema.dropTableIfExists('task_comments');
    await knex.schema.dropTableIfExists('tasks');
    await knex.schema.dropTableIfExists('subscription_page_access');
    await knex.schema.dropTableIfExists('user_subscriptions');
    await knex.schema.dropTableIfExists('subscription_tiers');
}