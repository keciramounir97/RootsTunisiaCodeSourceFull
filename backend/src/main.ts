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
import * as bcrypt from 'bcryptjs';
import { getStoredFilePayload } from './common/utils/db-file.util';

/**
 * Universal CORS Header setter
 * Reflects origin with credentials support for complete preflight & fetch compatibility
 */
function setCorsHeaders(req: any, res: any) {
    const origin = req.headers.origin as string | undefined;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires, If-Modified-Since, Accept, Origin, X-Request-Id');
    res.setHeader('Access-Control-Max-Age', '86400');
}

/** Auto-seed default admins on database connection */
async function seedInitialData(knex: any) {
    try {
        if (!knex || !(await knex.schema.hasTable('users'))) {
            return;
        }

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

async function bootstrap() {
    console.log('🟢 SERVER STARTING...');

    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        app.set('trust proxy', 1);

        // 1. First middleware: Global CORS and Preflight handler (never blocked by route matching or guards)
        app.use((req: any, res: any, next: () => void) => {
            setCorsHeaders(req, res);
            if (req.method === 'OPTIONS') {
                return res.status(204).end();
            }
            next();
        });

        // 2. Enable NestJS Native CORS with origin reflection
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires, If-Modified-Since, Accept, Origin, X-Request-Id',
            credentials: true,
            optionsSuccessStatus: 204,
            preflightContinue: false,
        });

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
            req.headers['x-request-id'] = req.headers['x-request-id'] || randomUUID();
            next();
        });

        // Rate Limiter (skip OPTIONS requests completely)
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

        // Run seed initial data
        try {
            const knex = app.get('KnexConnection');
            await seedInitialData(knex);
        } catch (e) {
            console.warn('Initial seeding error:', e);
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
