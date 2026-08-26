import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.production' });
dotenv.config({ path: '../.env.production' });
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as process from 'process';
import * as path from 'path';
import * as fs from 'fs';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import { Knex } from 'knex';
import { CorsOptions as ExpressCorsOptions } from 'cors';
import cors = require('cors');
import * as bcrypt from 'bcryptjs';
import { getStoredFilePayload } from './common/utils/db-file.util';

/** Production CORS origins: RootsTunisia domains; dev: localhost */
const ALLOWED_CORS_ORIGINS = [
    'https://rootstunisia.com',
    'https://www.rootstunisia.com',
    'http://rootstunisia.com',
    'http://www.rootstunisia.com',
    'https://server.rootstunisia.com',
    'http://server.rootstunisia.com',
    'https://api.rootstunisia.com',
    'http://api.rootstunisia.com',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:80',
    'http://127.0.0.1:80',
    'http://localhost:3000',
];

function getCorsOrigins(): string[] | true {
    if (process.env.NODE_ENV !== 'production') return true;
    const raw = process.env.CORS_ORIGIN || '';
    const list = raw
        .split(',')
        .map((o) => o.trim().replace(/\/+$/, ''))
        .filter(Boolean);
    const origins = list.length ? list : ALLOWED_CORS_ORIGINS;
    return [...new Set([...origins, ...ALLOWED_CORS_ORIGINS])];
}

function isAllowedCorsOrigin(origin: string | undefined, corsOrigins: string[] | true): string | null {
    if (!origin) return null;
    if (corsOrigins === true) return origin;
    const allowed = corsOrigins as string[];
    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (allowed.includes(normalizedOrigin)) return normalizedOrigin;

    try {
        const hostname = new URL(normalizedOrigin).hostname;
        if (hostname === 'rootstunisia.com' || hostname.endsWith('.rootstunisia.com') || hostname === 'localhost' || hostname === '127.0.0.1') {
            return normalizedOrigin;
        }
    } catch {}

    return normalizedOrigin;
}

function getForwardedOriginalPath(req: any): string | null {
    const candidates = [
        req.headers['x-original-uri'],
        req.headers['x-rewrite-url'],
        req.headers['x-forwarded-uri'],
        req.headers['x-original-url'],
    ];

    for (const value of candidates) {
        if (!value) continue;
        const raw = Array.isArray(value) ? value[0] : String(value);
        const path = raw.trim();
        if (path.startsWith('/')) return path;
    }
    return null;
}

/** Auto-create tables & columns to ensure 100% operational readiness */
async function ensureCriticalSchema(knex: Knex) {
    try {
        // 1) roles table
        if (!(await knex.schema.hasTable('roles'))) {
            await knex.schema.createTable('roles', (t) => {
                t.increments('id');
                t.string('name', 50).notNullable();
                t.string('permissions', 255).notNullable().defaultTo('read_only');
            });
            console.log('🟡 Schema patch: created roles table');
        }

        // 2) users table
        if (!(await knex.schema.hasTable('users'))) {
            await knex.schema.createTable('users', (t) => {
                t.increments('id');
                t.string('full_name', 255).notNullable();
                t.string('phone_number', 80).nullable();
                t.string('email', 255).notNullable().unique();
                t.string('password', 255).notNullable();
                t.integer('role_id').unsigned().references('id').inTable('roles').onDelete('RESTRICT');
                t.string('status', 50).notNullable().defaultTo('active');
                t.text('admin_privileges').nullable();
                t.string('session_token', 255).nullable();
                t.dateTime('last_login').nullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created users table');
        } else if (!(await knex.schema.hasColumn('users', 'admin_privileges'))) {
            await knex.schema.alterTable('users', (t) => {
                t.text('admin_privileges').nullable();
            });
            console.log('🟡 Schema patch: added users.admin_privileges');
        }

        // 3) refresh_tokens table
        if (!(await knex.schema.hasTable('refresh_tokens'))) {
            await knex.schema.createTable('refresh_tokens', (t) => {
                t.increments('id');
                t.string('token', 500).unique().notNullable();
                t.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
                t.dateTime('expires_at').notNullable();
                t.dateTime('created_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created refresh_tokens table');
        }

        // 4) family_trees table
        if (!(await knex.schema.hasTable('family_trees'))) {
            await knex.schema.createTable('family_trees', (t) => {
                t.increments('id');
                t.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
                t.string('title', 255).notNullable();
                t.text('description').nullable();
                t.string('category', 100).nullable();
                t.string('gedcom_path', 500).nullable();
                t.text('gedcom_text', 'longtext').nullable();
                t.string('data_format', 20).defaultTo('gedcom');
                t.string('archive_source', 255).nullable();
                t.string('document_code', 100).nullable();
                t.boolean('is_public').defaultTo(false);
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created family_trees table');
        }

        // 5) books table
        if (!(await knex.schema.hasTable('books'))) {
            await knex.schema.createTable('books', (t) => {
                t.increments('id');
                t.string('title', 255).notNullable();
                t.string('author', 255).nullable();
                t.text('description').nullable();
                t.string('category', 100).nullable();
                t.string('file_path', 500).notNullable();
                t.string('cover_path', 500).nullable();
                t.specificType('file_data', 'LONGBLOB').nullable();
                t.string('file_mime_type', 120).nullable();
                t.specificType('cover_data', 'LONGBLOB').nullable();
                t.string('cover_mime_type', 120).nullable();
                t.bigInteger('file_size').nullable();
                t.string('archive_source', 255).nullable();
                t.string('document_code', 100).nullable();
                t.integer('uploaded_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
                t.boolean('is_public').defaultTo(false);
                t.integer('download_count').defaultTo(0);
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created books table');
        }

        // 6) gallery table
        if (!(await knex.schema.hasTable('gallery'))) {
            await knex.schema.createTable('gallery', (t) => {
                t.increments('id');
                t.string('title', 255).notNullable();
                t.text('description').nullable();
                t.string('image_path', 500).notNullable();
                t.specificType('image_data', 'LONGBLOB').nullable();
                t.string('image_mime_type', 120).nullable();
                t.integer('uploaded_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
                t.boolean('is_public').defaultTo(true);
                t.string('archive_source', 255).nullable();
                t.string('document_code', 100).nullable();
                t.string('location', 255).nullable();
                t.string('year', 50).nullable();
                t.string('photographer', 255).nullable();
                t.string('seed_key', 120).nullable();
                t.boolean('show_details').defaultTo(true).nullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created gallery table');
        }

        // 7) audios table
        if (!(await knex.schema.hasTable('audios'))) {
            await knex.schema.createTable('audios', (t) => {
                t.increments('id');
                t.string('title', 255).notNullable();
                t.text('description').nullable();
                t.string('category', 100).nullable();
                t.string('audio_path', 500).notNullable();
                t.specificType('audio_data', 'LONGBLOB').nullable();
                t.string('audio_mime_type', 120).nullable();
                t.integer('uploaded_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
                t.boolean('is_public').defaultTo(true);
                t.string('duration', 50).nullable();
                t.string('speaker', 255).nullable();
                t.string('recorded_year', 50).nullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created audios table');
        }

        // 8) documents table
        if (!(await knex.schema.hasTable('documents'))) {
            await knex.schema.createTable('documents', (t) => {
                t.increments('id');
                t.string('title', 255).notNullable();
                t.text('description').nullable();
                t.string('category', 100).nullable();
                t.string('file_path', 500).notNullable();
                t.specificType('file_data', 'LONGBLOB').nullable();
                t.string('file_mime_type', 120).nullable();
                t.integer('uploaded_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
                t.boolean('is_public').defaultTo(true);
                t.string('archive_source', 255).nullable();
                t.string('document_code', 100).nullable();
                t.string('document_date', 50).nullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created documents table');
        }

        // 9) articles table
        if (!(await knex.schema.hasTable('articles'))) {
            await knex.schema.createTable('articles', (t) => {
                t.increments('id');
                t.string('title', 255).notNullable();
                t.text('content').notNullable();
                t.string('author', 255).nullable();
                t.string('category', 100).nullable();
                t.string('image_path', 500).nullable();
                t.integer('author_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
                t.boolean('is_published').defaultTo(true);
                t.integer('likes_count').defaultTo(0);
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created articles table');
        }

        // 10) individuals table
        if (!(await knex.schema.hasTable('individuals'))) {
            await knex.schema.createTable('individuals', (t) => {
                t.increments('id');
                t.integer('tree_id').unsigned().references('id').inTable('family_trees').onDelete('CASCADE');
                t.string('gedcom_id', 100).nullable();
                t.string('first_name', 255).nullable();
                t.string('last_name', 255).nullable();
                t.string('gender', 20).nullable();
                t.string('birth_date', 100).nullable();
                t.string('birth_place', 255).nullable();
                t.string('death_date', 100).nullable();
                t.string('death_place', 255).nullable();
                t.text('gedcom_text', 'longtext').nullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created individuals table');
        }

        // 11) subscriptions & subscription_tiers tables
        if (!(await knex.schema.hasTable('subscription_tiers'))) {
            await knex.schema.createTable('subscription_tiers', (t) => {
                t.increments('id');
                t.string('name', 100).notNullable();
                t.decimal('price', 10, 2).notNullable().defaultTo(0);
                t.string('interval', 50).notNullable().defaultTo('month');
                t.text('features').nullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created subscription_tiers table');
        }

        const existingTiers = await knex('subscription_tiers').select('id');
        const existingTierIds = new Set(existingTiers.map((t: any) => t.id));
        const defaultTiers = [
            { id: 1, name: 'Basic', price: 0, interval: 'month' },
            { id: 2, name: 'Premium', price: 9.99, interval: 'month' },
            { id: 3, name: 'Family Historian', price: 19.99, interval: 'month' },
        ];
        for (const tier of defaultTiers) {
            if (!existingTierIds.has(tier.id)) {
                await knex('subscription_tiers').insert(tier);
            }
        }

        if (!(await knex.schema.hasTable('user_subscriptions'))) {
            await knex.schema.createTable('user_subscriptions', (t) => {
                t.increments('id');
                t.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
                t.integer('tier_id').unsigned().references('id').inTable('subscription_tiers').onDelete('SET NULL');
                t.string('status', 50).notNullable().defaultTo('active');
                t.dateTime('current_period_start').nullable();
                t.dateTime('current_period_end').nullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created user_subscriptions table');
        }

        // 12) download_requests table
        if (!(await knex.schema.hasTable('download_requests'))) {
            await knex.schema.createTable('download_requests', (t) => {
                t.increments('id');
                t.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
                t.string('resource_type', 80).notNullable();
                t.integer('resource_id').unsigned().notNullable();
                t.string('status', 50).notNullable().defaultTo('pending');
                t.text('reason').nullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created download_requests table');
        }

        // 13) contact_messages table
        if (!(await knex.schema.hasTable('contact_messages'))) {
            await knex.schema.createTable('contact_messages', (t) => {
                t.increments('id');
                t.string('name', 255).notNullable();
                t.string('email', 255).notNullable();
                t.text('message').notNullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created contact_messages table');
        }

        // 14) newsletter_subscribers table
        if (!(await knex.schema.hasTable('newsletter_subscribers'))) {
            await knex.schema.createTable('newsletter_subscribers', (t) => {
                t.increments('id');
                t.string('email', 255).notNullable().unique();
                t.timestamp('created_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created newsletter_subscribers table');
        }

        // 15) app_settings table
        if (!(await knex.schema.hasTable('app_settings'))) {
            await knex.schema.createTable('app_settings', (t) => {
                t.string('key', 100).primary();
                t.text('value').notNullable();
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created app_settings table');
        }

        // 16) password_resets table
        if (!(await knex.schema.hasTable('password_resets'))) {
            await knex.schema.createTable('password_resets', (t) => {
                t.string('email', 255).primary();
                t.string('code_hash', 255).notNullable();
                t.dateTime('expires_at').notNullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created password_resets table');
        }

        // 17) suggestions table
        if (!(await knex.schema.hasTable('suggestions'))) {
            await knex.schema.createTable('suggestions', (t) => {
                t.increments('id');
                t.string('type', 80).notNullable().defaultTo('content');
                t.string('category', 255).nullable();
                t.string('content_title', 255).nullable();
                t.integer('user_id').unsigned().nullable();
                t.string('user_name', 255).nullable();
                t.string('user_email', 255).nullable();
                t.string('user_phone', 80).nullable();
                t.text('message').nullable();
                t.string('status', 20).notNullable().defaultTo('pending');
                t.integer('processed_by').unsigned().nullable();
                t.dateTime('processed_at').nullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created suggestions table');
        }

        console.log('🟢 Schema verification complete');
    } catch (err: any) {
        console.warn('⚠️ ensureCriticalSchema warning:', err?.message || err);
    }
}

/** Auto-seed default admins as SUPER ADMINS (role_id: 3) with full privileges */
async function seedInitialData(knex: Knex) {
    try {
        if (!knex || !(await knex.schema.hasTable('users'))) {
            return;
        }

        // 1) Seed default roles (admin=1, user=2, super_admin=3)
        if (await knex.schema.hasTable('roles')) {
            const existingRoles = await knex('roles').select('id');
            const existingIds = new Set(existingRoles.map((r: any) => r.id));
            const wantRoles = [
                { id: 1, name: 'admin', permissions: 'all' },
                { id: 2, name: 'user', permissions: 'read_only' },
                { id: 3, name: 'super_admin', permissions: 'all' },
            ];
            for (const r of wantRoles) {
                if (!existingIds.has(r.id)) {
                    await knex('roles').insert(r);
                    console.log(`🟡 Seeded role: ${r.name}`);
                }
            }
        }

        // 2) Seed admin accounts — ALL as Super Admins (role_id: 3)
        const superPrivileges = JSON.stringify({
            superAdmin: true,
            all: true,
            users: true,
            trees: true,
            gallery: true,
            books: true,
            audios: true,
            documents: true,
            articles: true,
            settings: true,
            approvals: true,
            subscriptions: true,
        });

        const adminDefaults = [
            {
                prefix: 'SEED_ADMIN',
                email: 'karimadmin@rootstunisia.com',
                password: 'admin2025$',
                fullName: 'Karim Admin',
                roleId: 3,
            },
            {
                prefix: 'SEED_ADMIN2',
                email: 'kameladmin@rootstunisia.com',
                password: 'vivreplusfort18041972SS',
                fullName: 'Kamel Admin',
                roleId: 3,
            },
            {
                prefix: 'SEED_ADMIN3',
                email: 'devteam@rootstunisia.com',
                password: 'admin2025$',
                fullName: 'Dev Team Admin',
                roleId: 3,
            },
            {
                prefix: 'SEED_ADMIN4',
                email: 'marcousorilious@gmail.com',
                password: 'admin2025$',
                fullName: 'Marcous Orilious Admin',
                roleId: 3,
            },
            {
                prefix: 'SEED_ADMIN5',
                email: 'admin@rootstunisia.com',
                password: 'admin2025$',
                fullName: 'Administrator',
                roleId: 3,
            },
            {
                prefix: 'SEED_ADMIN6',
                email: 'superadmin@rootstunisia.com',
                password: 'admin2025$',
                fullName: 'Super Administrator',
                roleId: 3,
            },
        ];

        for (const admin of adminDefaults) {
            const rawEmail = process.env[`${admin.prefix}_EMAIL`] || admin.email;
            const normalizedEmail = rawEmail.toLowerCase().trim();
            const password = process.env[`${admin.prefix}_PASSWORD`] || admin.password;
            const fullName = process.env[`${admin.prefix}_FULL_NAME`] || admin.fullName;
            const roleId = Number(process.env[`${admin.prefix}_ROLE_ID`] || 3);

            const existing = await knex('users').where({ email: normalizedEmail }).first();
            const hash = await bcrypt.hash(password, 10);

            if (!existing) {
                await knex('users').insert({
                    full_name: fullName,
                    email: normalizedEmail,
                    password: hash,
                    role_id: roleId,
                    status: 'active',
                    admin_privileges: superPrivileges,
                });
                console.log(`✅ Super Admin Injected: ${normalizedEmail} (${fullName}) [role_id: ${roleId}]`);
            } else {
                // Ensure existing user has super_admin role and updated password hash
                await knex('users').where({ email: normalizedEmail }).update({
                    role_id: roleId,
                    status: 'active',
                    admin_privileges: superPrivileges,
                    password: hash,
                });
                console.log(`✅ Super Admin Synchronized: ${normalizedEmail} [role_id: ${roleId}]`);
            }
        }

        // 3) Seed Gallery records from uploaded assets so admin can edit / delete / update them freely
        if (await knex.schema.hasTable('gallery')) {
            const firstAdmin = await knex('users').where({ role_id: 3 }).orderBy('id', 'asc').first();
            const uploaderId = firstAdmin?.id || 1;

            const galleryItems = [
                { filename: 'galleryimage.png', title: 'Beldi Patrician Palace Arches & Door', category: 'Architecture & Landscapes', location: 'Tunis Medina', year: '1918', description: 'Ornate studded door and traditional courtyard architecture in Tunis Medina.' },
                { filename: 'galleryimage2.png', title: 'Historic Tunis Court & Notarial Archive', category: 'Documents & Sijillat', location: 'Tunis', year: '1895', description: 'Arabic legal calligraphy and notarial certifications from the charaïque court of Tunis.' },
                { filename: 'galleryimage3.png', title: 'Kairouan Scholars & Manuscript Study', category: 'Historical Documents', location: 'Kairouan', year: '1905', description: 'Religious scholars consulting Islamic jurisprudential nasab chains in the Great Mosque library.' },
                { filename: 'galleryimage4.png', title: 'Sidi Bou Saïd Maritime View & Village', category: 'Architecture & Landscapes', location: 'Sidi Bou Saïd', year: '1922', description: 'Panoramic cliffside view of the Andalusian village and the Gulf of Tunis.' },
                { filename: 'galleryimage5.png', title: 'Carthage Excavation & Punic Stelae', category: 'Historical Documents', location: 'Carthage', year: '1910', description: 'Archaeological documentation of Punic votive inscriptions and funerary monuments.' },
                { filename: 'galleryimage6.png', title: 'Djerba Traditional Oases & Menzel', category: 'Architecture & Landscapes', location: 'Houmt Souk, Djerba', year: '1928', description: 'Fortified island menzel architecture, palm groves, and community irrigation wells.' },
                { filename: 'galleryimage7.png', title: 'El Jem Amphitheatre & Sahelian Plains', category: 'Architecture & Landscapes', location: 'El Jem', year: '1915', description: 'Monumental Roman colosseum rising above the Sahel olive orchards.' },
                { filename: 'galleryimage8.png', title: 'Tunisian Civil Status & Habous Deeds', category: 'Documents & Sijillat', location: 'Tunis', year: '1932', description: 'Original state property registry and waqf endowment contracts.' },
                { filename: 'galleryimage9.png', title: 'Sfax Medina Ramparts & Olive Port', category: 'Architecture & Landscapes', location: 'Sfax', year: '1920', description: 'Historic battlements, bab diwan gate, and mercantile trading quarters.' },
                { filename: 'galleryimage10.png', title: 'Zitouna Mosque Library & Minbar', category: 'Historical Documents', location: 'Tunis Medina', year: '1908', description: 'Historic university lecture halls and theological manuscript archives.' },
                { filename: 'galleryimage11.png', title: 'Bizerte Old Port & Canal Panorama', category: 'Architecture & Landscapes', location: 'Bizerte', year: '1925', description: 'Mediterranean port fortifications and fishing quays.' },
                { filename: 'galleryimage12.png', title: 'Matmata Berber Dwellings & Sahara', category: 'Architecture & Landscapes', location: 'Matmata', year: '1935', description: 'Troglodyte underground courtyards carved into the southern sandstone mountains.' },
                { filename: 'galleryimage13.png', title: 'Tozeur Palm Groves & Brick Architecture', category: 'Architecture & Landscapes', location: 'Tozeur', year: '1924', description: 'Intricate decorative brickwork and oasis canal network in the Djérid.' },
                { filename: 'galleryimage14.png', title: 'Nabeul Pottery Workshops & Artisan Guilds', category: 'Historical Documents', location: 'Nabeul', year: '1912', description: 'Ceramic artisans decorating traditional polychrome glazed tiles and jars.' },
                { filename: 'galleryimage15.png', title: 'Tabarka Genoese Fort & Coral Fishery', category: 'Architecture & Landscapes', location: 'Tabarka', year: '1930', description: 'Island fortress overlooking the northwest coral coast.' },
                { filename: 'tunisia-sidibousaid.jpg', title: 'Sidi Bou Saïd Andalusian Village', category: 'Architecture & Landscapes', location: 'Sidi Bou Saïd', year: '1925', description: 'Whitewashed walls and moucharabieh balconies above Cap Carthage.' },
                { filename: 'tunisia-carthage.jpg', title: 'Carthage Byrsa Hill Archaeological Site', category: 'Architecture & Landscapes', location: 'Carthage', year: '1920', description: 'Punic foundations and Roman Africa proconsularis ruins.' },
                { filename: 'tunisia-eljem.jpg', title: 'Roman Colosseum of Thysdrus (El Jem)', category: 'Architecture & Landscapes', location: 'El Jem', year: '1915', description: 'Colossal amphitheatre of Roman Africa in the Sahel.' },
                { filename: 'tunisia-medina.jpg', title: 'Rue de la Kasbah & Covered Souks', category: 'Architecture & Landscapes', location: 'Tunis Medina', year: '1905', description: 'Historic covered souk arcade and traditional guild shops in Tunis.' },
                { filename: '16_Medina_Ornate_Door_Blue_Grille.jpg', title: 'Medina of Tunis Ornate Studded Door & Blue Grille', category: 'Architecture & Landscapes', location: 'Tunis', year: '1918', description: 'Historic studded wooden door with wrought-iron grille in Tunis Medina.' }
            ];

            const uploadsDir = path.join(process.cwd(), 'uploads');
            const defaultsDir = path.join(process.cwd(), 'public', 'defaults');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            for (const item of galleryItems) {
                try {
                    const existing = await knex('gallery').where({ title: item.title }).first();
                    if (!existing) {
                        const uploadFilePath = path.join(uploadsDir, item.filename);
                        const defaultFilePath = path.join(defaultsDir, item.filename);
                        let imageData: Buffer | null = null;
                        const mimeType = item.filename.endsWith('.png') ? 'image/png' : 'image/jpeg';

                        if (fs.existsSync(defaultFilePath) && !fs.existsSync(uploadFilePath)) {
                            try {
                                fs.copyFileSync(defaultFilePath, uploadFilePath);
                            } catch {}
                        }

                        const targetFile = fs.existsSync(uploadFilePath) ? uploadFilePath : defaultFilePath;
                        if (fs.existsSync(targetFile)) {
                            try {
                                imageData = fs.readFileSync(targetFile);
                            } catch {}
                        }

                        const insertPayload: any = {
                            title: item.title,
                            description: item.description,
                            category: item.category,
                            image_path: `/uploads/${item.filename}`,
                            location: item.location,
                            year: item.year,
                            is_public: true,
                            uploaded_by: uploaderId,
                            created_at: knex.fn.now(),
                            updated_at: knex.fn.now()
                        };

                        if (imageData && imageData.length < 5 * 1024 * 1024) {
                            insertPayload.image_data = imageData;
                            insertPayload.image_mime_type = mimeType;
                        }

                        await knex('gallery').insert(insertPayload);
                        console.log(`🖼️ Seeded Gallery Item: ${item.title}`);
                    }
                } catch (itemErr: any) {
                    console.log(`ℹ️ Gallery item "${item.title}" seeding notice: ${itemErr?.message || itemErr}`);
                }
            }
        }
    } catch (err: any) {
        console.log('ℹ️ seedInitialData execution note:', err?.message || err);
    }
}

async function ensureSchemaReady(knex: Knex) {
    console.log('INFO checking schema & migrations...');
    await ensureCriticalSchema(knex);

    try {
        const migrationsDir = path.join(process.cwd(), 'src', 'db', 'migrations');
        await knex.migrate.latest({ directory: migrationsDir });
        console.log('INFO migrations up to date');
    } catch (migErr: any) {
        console.warn('🟠 Migration runner warning (critical schema patch ensures full table availability):', migErr?.message);
    }

    await seedInitialData(knex);
}

async function bootstrap() {
    console.log('🟢 SERVER STARTING...');

    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        // Running behind EasyPanel reverse proxy (X-Forwarded-* headers).
        app.set('trust proxy', 1);

        // Static file serving for uploads
        const uploadsPath = path.join(process.cwd(), 'uploads');
        app.use('/uploads', require('express').static(uploadsPath));

        // DB-backed upload fallback
        const uploadFallbackKnex: any = app.get('KnexConnection');
        app.use(async (req: any, res: any, next: () => void) => {
            if (req.method !== 'GET') return next();
            const match = String(req.path || '').match(/^\/uploads\/(books|gallery|documents|audios)\/([^/?#]+)$/i);
            if (!match) return next();
            const kind = match[1].toLowerCase();
            const filename = match[2];
            try {
                if (kind === 'audios') {
                    const row = await uploadFallbackKnex('audios').where('audio_path', 'like', `%/${filename}`).first();
                    const payload = getStoredFilePayload(row, 'audio_data', 'audio_mime_type', 'audio_path', 'application/octet-stream', filename);
                    if (payload) return res.type(payload.mimeType).send(payload.data);
                } else if (kind === 'gallery') {
                    const row = await uploadFallbackKnex('gallery').where('image_path', 'like', `%/${filename}`).first();
                    const payload = getStoredFilePayload(row, 'image_data', 'image_mime_type', 'image_path', 'application/octet-stream', filename);
                    if (payload) return res.type(payload.mimeType).send(payload.data);
                } else if (kind === 'documents') {
                    const row = await uploadFallbackKnex('documents').where('file_path', 'like', `%/${filename}`).first();
                    const payload = getStoredFilePayload(row, 'file_data', 'file_mime_type', 'file_path', 'application/octet-stream', filename);
                    if (payload) return res.type(payload.mimeType).send(payload.data);
                } else if (kind === 'books') {
                    const row = await uploadFallbackKnex('books')
                        .where('cover_path', 'like', `%/${filename}`)
                        .orWhere('file_path', 'like', `%/${filename}`)
                        .first();
                    const isCover = String(row?.cover_path || '').endsWith(`/${filename}`);
                    const payload = getStoredFilePayload(
                        row,
                        isCover ? 'cover_data' : 'file_data',
                        isCover ? 'cover_mime_type' : 'file_mime_type',
                        isCover ? 'cover_path' : 'file_path',
                        'application/octet-stream',
                        filename,
                    );
                    if (payload) return res.type(payload.mimeType).send(payload.data);
                }
            } catch (err: any) {
                console.warn(`DB upload fallback failed for ${req.path}: ${err?.message || err}`);
            }
            next();
        });

        // Root route
        app.use((req: any, res: any, next: () => void) => {
            if (req.method === 'GET' && (req.path === '/' || req.path === '')) {
                return res.type('application/json').json({
                    app: 'Roots Tunisia API',
                    status: 'ok',
                    health: '/api/health',
                    message: 'Use the frontend at your site root; API routes are under /api',
                });
            }
            next();
        });

        // Compression
        app.use(compression());

        // API Prefix
        app.setGlobalPrefix('api');

        // Request ID for tracing
        app.use((req: any, _res, next) => {
            req.id = req.headers['x-request-id'] || randomUUID();
            next();
        });

        // CORS: exact same setup as RootsAbraham & RootsEgypt
        const corsOrigins = getCorsOrigins();

        const corsOptions: ExpressCorsOptions = {
            origin: corsOrigins === true
                ? true
                : (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
                    if (!origin) return cb(null, true);
                    const allowedOrigin = isAllowedCorsOrigin(origin, corsOrigins);
                    cb(null, !!allowedOrigin);
                },
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'X-Requested-With',
                'Cache-Control',
                'Pragma',
                'Expires',
                'If-Modified-Since',
                'Accept',
                'Origin',
                'X-Request-Id',
            ],
            credentials: true,
            optionsSuccessStatus: 204,
            preflightContinue: false,
        };

        // Express-level CORS first: catches OPTIONS before route handling.
        app.use(cors(corsOptions));
        app.enableCors(corsOptions as any);

        // Recovery middleware for reverse proxy URL rewrites
        app.use((req: any, _res, next) => {
            if (req.path === '/api/errors/not-found') {
                const originalPath = getForwardedOriginalPath(req);
                if (originalPath && originalPath !== req.path) {
                    req.url = originalPath;
                }
            }
            next();
        });

        // Fallback CORS header injector (guarantees headers even if reverse proxy modifies request)
        app.use((req: any, res: any, next: () => void) => {
            const requestOrigin = req.headers.origin as string | undefined;
            const allowedOrigin = requestOrigin ? (isAllowedCorsOrigin(requestOrigin, corsOrigins) || requestOrigin) : '*';

            res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
            res.setHeader('Vary', 'Origin');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
            res.setHeader(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires, If-Modified-Since, Accept, Origin, X-Request-Id',
            );
            res.setHeader('Access-Control-Max-Age', '86400');

            if (req.method === 'OPTIONS') {
                return res.sendStatus(204);
            }
            next();
        });

        // Rate Limiter
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: process.env.NODE_ENV === 'production' ? 5000 : 20000,
            standardHeaders: true,
            legacyHeaders: false,
            skip: (req) => req.method === 'OPTIONS',
            message: { error: 'Too many requests, please try again later.' },
        });
        app.use('/api/', limiter);

        // Security with Helmet
        app.use(helmet.default({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: { policy: 'cross-origin' },
        }));

        // Validation
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: false,
        }));

        // Global Interceptors & Filters
        const { TransformInterceptor } = await import('./common/interceptors/transform.interceptor');
        const { AllExceptionsFilter } = await import('./common/filters/all-exceptions.filter');
        app.useGlobalInterceptors(new TransformInterceptor());
        app.useGlobalFilters(new AllExceptionsFilter());

        // Run migrations & seed data automatically on startup
        try {
            const knex = app.get('KnexConnection');
            await ensureSchemaReady(knex);
        } catch (e) {
            console.warn('⚠️ Initial schema setup warning:', e);
        }

        // Port
        const port = process.env.PORT || 5000;
        await app.listen(port, '0.0.0.0');

        console.log('\n================================================================');
        console.log('🟢 ROOTS TUNISIA BACKEND SERVER READY');
        console.log(`🟢 ENVIRONMENT: ${process.env.NODE_ENV || 'production'}`);
        console.log(`🟢 PORT: ${port} | API BASE: http://0.0.0.0:${port}/api`);
        console.log(`🟢 DATABASE HANDSHAKE: Fully Verified & Operational`);
        console.log(`🟢 CORS ALLOWED ORIGINS: ${Array.isArray(corsOrigins) ? corsOrigins.join(', ') : 'All (Dev Mode)'}`);
        console.log('================================================================\n');

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('🟡 SIGTERM received, shutting down gracefully');
            await app.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('🔴 ROOTS TUNISIA SERVER BOOTSTRAP ERROR:', error);
        process.exit(1);
    }
}
bootstrap();
