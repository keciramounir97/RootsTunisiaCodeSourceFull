import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Model } from 'objection';
import * as Knex from 'knex';
import * as dotenv from 'dotenv';

// Load production/local env explicitly
dotenv.config({ path: '.env.production' });
dotenv.config({ path: '../.env.production' });
dotenv.config();

type DbConnectionConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    charset: string;
};

function readConnectionFromDatabaseUrl(databaseUrl?: string): Partial<DbConnectionConfig> {
    if (!databaseUrl) return {};
    try {
        const parsed = new URL(databaseUrl);
        return {
            host: parsed.hostname,
            port: Number(parsed.port || 3306),
            user: decodeURIComponent(parsed.username || ''),
            password: decodeURIComponent(parsed.password || ''),
            database: (parsed.pathname || '').replace(/^\//, ''),
        };
    } catch {
        return {};
    }
}

function pickFirstDefined(...values: Array<string | number | undefined | null>): string | undefined {
    for (const value of values) {
        if (value === undefined || value === null) continue;
        const normalized = String(value).trim();
        if (normalized) return normalized;
    }
    return undefined;
}

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'KnexConnection',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const dbUrl = configService.get<string>('DATABASE_URL') || process.env.DATABASE_URL;
                const fromUrl = readConnectionFromDatabaseUrl(dbUrl);

                const primaryHost = pickFirstDefined(
                    process.env.DB_HOST,
                    configService.get<string>('DB_HOST'),
                    configService.get<string>('MYSQL_HOST'),
                    configService.get<string>('MYSQLHOST'),
                    fromUrl.host,
                    'rootstunisia_rootstunisiadb',
                ) || 'rootstunisia_rootstunisiadb';

                const port = Number(
                    pickFirstDefined(
                        process.env.DB_PORT,
                        configService.get<number>('DB_PORT'),
                        configService.get<number>('MYSQL_PORT'),
                        fromUrl.port,
                        3306,
                    ) || 3306,
                );

                const user = pickFirstDefined(
                    process.env.DB_USER,
                    configService.get<string>('DB_USER'),
                    configService.get<string>('MYSQL_USER'),
                    fromUrl.user,
                    'karim',
                ) || 'karim';

                const password = pickFirstDefined(
                    process.env.DB_PASSWORD,
                    configService.get<string>('DB_PASSWORD'),
                    configService.get<string>('MYSQL_PASSWORD'),
                    fromUrl.password,
                    '636363',
                ) || '636363';

                const database = pickFirstDefined(
                    process.env.DB_NAME,
                    process.env.DB_DATABASE,
                    configService.get<string>('DB_NAME'),
                    configService.get<string>('DB_DATABASE'),
                    fromUrl.database,
                    'rootstunisiadb',
                ) || 'rootstunisiadb';

                console.log(`🟡 DB ATTEMPT primaryHost=${primaryHost} port=${port} database=${database} user=${user}`);

                // Exact Easypanel candidate hosts from user credentials
                const candidateHosts = process.env.NODE_ENV === 'production'
                    ? [primaryHost, 'rootstunisia_rootstunisiadb', '2.24.71.239', '127.0.0.1', 'localhost']
                    : [primaryHost, '2.24.71.239', '127.0.0.1', 'localhost'];
                const uniqueHosts = [...new Set(candidateHosts.filter(Boolean))];

                const candidateUsers = [
                    { u: user, p: password },
                    { u: 'karim', p: '636363' },
                ];

                for (const h of uniqueHosts) {
                    for (const cred of candidateUsers) {
                        const knexConfig = {
                            client: 'mysql2',
                            connection: {
                                host: h,
                                port,
                                user: cred.u,
                                password: cred.p,
                                database,
                                charset: 'utf8mb4',
                                connectTimeout: 3000,
                            },
                            pool: {
                                min: 2,
                                max: 20,
                                acquireTimeoutMillis: 10000,
                                createTimeoutMillis: 10000,
                                destroyTimeoutMillis: 5000,
                                idleTimeoutMillis: 300000,
                                afterCreate: (conn: any, done: any) => {
                                    conn.on('error', (err: any) => {
                                        console.warn('⚠️ MySQL connection dropped/reset safely:', err?.message || err);
                                    });
                                    done(null, conn);
                                },
                            },
                            debug: false,
                        };

                        try {
                            const testKnex = Knex.default(knexConfig);
                            await testKnex.raw('SELECT 1');
                            console.log(`🟢 DB HANDSHAKE OK (host: ${h}, user: ${cred.u}, db: ${database})`);
                            Model.knex(testKnex);
                            return testKnex;
                        } catch (err: any) {
                            // Try next host/credential combination
                        }
                    }
                }

                console.error('🔴 DB HANDSHAKE FAILED on all hosts. Initializing fallback instance for graceful boot.');
                const fallbackKnex = Knex.default({
                    client: 'mysql2',
                    connection: {
                        host: primaryHost,
                        port,
                        user,
                        password,
                        database,
                        charset: 'utf8mb4',
                    },
                });
                Model.knex(fallbackKnex);
                return fallbackKnex;
            },
        },
    ],
    exports: ['KnexConnection'],
})
export class DatabaseModule { }
