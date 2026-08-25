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
                t.string('email', 255).notNullable().unique();
                t.string('password', 255).notNullable();
                t.integer('role_id').unsigned().references('id').inTable('roles').onDelete('RESTRICT');
                t.string('status', 50).notNullable().defaultTo('active');
                t.text('admin_privileges').nullable();
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

        // 7) contact_messages table
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

        // 8) newsletter_subscribers table
        if (!(await knex.schema.hasTable('newsletter_subscribers'))) {
            await knex.schema.createTable('newsletter_subscribers', (t) => {
                t.increments('id');
                t.string('email', 255).notNullable().unique();
                t.timestamp('created_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created newsletter_subscribers table');
        }

        // 9) app_settings table
        if (!(await knex.schema.hasTable('app_settings'))) {
            await knex.schema.createTable('app_settings', (t) => {
                t.string('key', 100).primary();
                t.text('value').notNullable();
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created app_settings table');
        }

        // 10) password_resets table
        if (!(await knex.schema.hasTable('password_resets'))) {
            await knex.schema.createTable('password_resets', (t) => {
                t.string('email', 255).primary();
                t.string('code_hash', 255).notNullable();
                t.dateTime('expires_at').notNullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
            });
            console.log('🟡 Schema patch: created password_resets table');
        }

        console.log('🟢 Schema verification complete');
    } catch (err: any) {
        console.warn('⚠️ ensureCriticalSchema warning:', err?.message || err);
    }
}

/** Auto-seed default admins on database connection */
async function seedInitialData(knex: Knex) {
    try {
        if (!knex || !(await knex.schema.hasTable('users'))) {
            return;
        }

        // 1) Seed default roles
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

        // 2) Seed admin accounts
        const adminDefaults = [
            {
                email: 'karimadmin@rootstunisia.com',
                password: 'admin2025$',
                fullName: 'Karim Admin',
                roleId: 1,
            },
            {
                email: 'kameladmin@rootstunisia.com',
                password: 'vivreplusfort18041972SS',
                fullName: 'Kamel Admin',
                roleId: 1,
            },
            {
                email: 'devteam@rootstunisia.com',
                password: 'admin2025$',
                fullName: 'Dev Team Admin',
                roleId: 1,
            },
            {
                email: 'marcousorilious@gmail.com',
                password: 'admin2025$',
                fullName: 'Marcous Orilious Admin',
                roleId: 1,
            },
            {
                email: 'admin@rootstunisia.com',
                password: 'admin2025$',
                fullName: 'Administrator',
                roleId: 1,
            },
            {
                email: 'superadmin@rootstunisia.com',
                password: 'admin2025$',
                fullName: 'Super Administrator',
                roleId: 3,
            },
        ];

        for (const admin of adminDefaults) {
            const normalizedEmail = admin.email.toLowerCase().trim();
            const existing = await knex('users').where({ email: normalizedEmail }).first();
            if (!existing) {
                const hash = await bcrypt.hash(admin.password, 10);
                await knex('users').insert({
                    full_name: admin.fullName,
                    email: normalizedEmail,
                    password: hash,
                    role_id: admin.roleId,
                    status: 'active',
                });
                console.log(`✅ Seed Admin Created: ${normalizedEmail} (${admin.fullName})`);
            }
        }
    } catch (err: any) {
        console.warn('⚠️ seedInitialData skipped or warning:', err?.message || err);
    }
}

async function ensureSchemaReady(knex: Knex) {
    console.log('INFO checking migrations...');
    try {
        const migrationsDir = path.join(process.cwd(), 'src', 'db', 'migrations');
        await knex.migrate.latest({ directory: migrationsDir });
        console.log('INFO migrations up to date');
    } catch (migErr: any) {
        console.warn('🟠 Migration runner warning (critical schema patch will handle tables):', migErr?.message);
    }

    await ensureCriticalSchema(knex);
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

        // Fallback CORS header injector
        app.use((req: any, res: any, next: () => void) => {
            const requestOrigin = req.headers.origin as string | undefined;
            const allowedOrigin = isAllowedCorsOrigin(requestOrigin, corsOrigins);

            if (allowedOrigin) {
                res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
                res.setHeader('Vary', 'Origin');
                res.setHeader('Access-Control-Allow-Credentials', 'true');
            }

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
            console.warn('Initial schema setup warning:', e);
        }

        // Port
        const port = process.env.PORT || 5000;
        await app.listen(port, '0.0.0.0');

        console.log('🟢 SERVER READY');
        console.log(`🟢 DB CONNECTED - Application running on port: ${port}`);

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('🟡 SIGTERM received, shutting down gracefully');
            await app.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('🔴 SERVER ERROR:', error);
        process.exit(1);
    }
}
bootstrap();
