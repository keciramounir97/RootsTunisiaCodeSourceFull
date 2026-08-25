import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Model } from 'objection';
import * as Knex from 'knex';

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
                    configService.get<string>('DB_HOST'),
                    configService.get<string>('MYSQL_HOST'),
                    configService.get<string>('MYSQLHOST'),
                    process.env.DB_HOST,
                    process.env.MYSQL_HOST,
                    process.env.MYSQLHOST,
                    fromUrl.host,
                    'rootstunisia_rootstunisiadb',
                ) || 'rootstunisia_rootstunisiadb';

                const port = Number(
                    pickFirstDefined(
                        configService.get<number>('DB_PORT'),
                        configService.get<number>('MYSQL_PORT'),
                        process.env.DB_PORT,
                        process.env.MYSQL_PORT,
                        fromUrl.port,
                        3306,
                    ) || 3306,
                );

                const user = pickFirstDefined(
                    configService.get<string>('DB_USER'),
                    configService.get<string>('MYSQL_USER'),
                    configService.get<string>('MYSQLUSER'),
                    process.env.DB_USER,
                    process.env.MYSQL_USER,
                    process.env.MYSQLUSER,
                    fromUrl.user,
                    'karim',
                ) || 'karim';

                const password = pickFirstDefined(
                    configService.get<string>('DB_PASSWORD'),
                    configService.get<string>('MYSQL_PASSWORD'),
                    configService.get<string>('MYSQLPASSWORD'),
                    process.env.DB_PASSWORD,
                    process.env.MYSQL_PASSWORD,
                    process.env.MYSQLPASSWORD,
                    fromUrl.password,
                    '636363',
                ) || '636363';

                const database = pickFirstDefined(
                    configService.get<string>('DB_NAME'),
                    configService.get<string>('DB_DATABASE'),
                    configService.get<string>('MYSQL_DATABASE'),
                    configService.get<string>('MYSQLDATABASE'),
                    process.env.DB_NAME,
                    process.env.DB_DATABASE,
                    process.env.MYSQL_DATABASE,
                    process.env.MYSQLDATABASE,
                    fromUrl.database,
                    'rootstunisiadb',
                ) || 'rootstunisiadb';

                console.log(`🟡 DB CONFIG primaryHost=${primaryHost} port=${port} database=${database} user=${user}`);

                const candidateHosts = [
                    primaryHost,
                    'rootstunisia_rootstunisiadb',
                    '2.24.71.239',
                    'mysql',
                    '127.0.0.1',
                    'localhost',
                ];
                const uniqueHosts = [...new Set(candidateHosts)];

                const candidateUsers = [
                    { u: user, p: password },
                    { u: 'karim', p: '636363' },
                    { u: 'root', p: '636363' },
                    { u: 'root', p: '' },
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
                                connectTimeout: 10000,
                            },
                            pool: {
                                min: 0,
                                max: 5,
                                acquireTimeoutMillis: 30000,
                                createTimeoutMillis: 30000,
                                destroyTimeoutMillis: 5000,
                                idleTimeoutMillis: 30000,
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
                            // try next host/cred
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
