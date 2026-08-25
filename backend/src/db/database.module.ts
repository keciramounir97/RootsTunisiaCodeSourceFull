import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Model } from 'objection';
import * as Knex from 'knex';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'KnexConnection',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const knexConfig = {
                    client: 'mysql2',
                    connection: {
                        host: configService.get<string>('DB_HOST') || '127.0.0.1',
                        port: Number(configService.get<number>('DB_PORT')) || 3306,
                        user: configService.get<string>('DB_USER') || 'karim',
                        password: configService.get<string>('DB_PASSWORD') || '636363',
                        database: configService.get<string>('DB_NAME') || configService.get<string>('DB_DATABASE') || 'rootstunisiadb',
                        charset: 'utf8mb4',
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
                    debug: configService.get<string>('NODE_ENV') === 'development',
                };

                let knex = Knex.default(knexConfig);
                Model.knex(knex);

                const host = configService.get<string>('DB_HOST') || '127.0.0.1';
                const database = configService.get<string>('DB_NAME') || 'RootsTunisia';

                try {
                    await knex.raw('SELECT 1');
                    console.log(`🟢 DB HANDSHAKE OK (${host})`);
                    return knex;
                } catch (err: any) {
                    console.warn(`⚠️ Primary DB host (${host}) failed: ${err?.message}. Trying local MySQL fallback...`);
                    try { await knex.destroy(); } catch {}

                    const localConfig = {
                        ...knexConfig,
                        connection: {
                            ...knexConfig.connection,
                            host: '127.0.0.1',
                            port: 3306,
                            user: 'root',
                            password: '636363',
                            database,
                        },
                    };
                    knex = Knex.default(localConfig);
                    Model.knex(knex);
                    try {
                        await knex.raw('SELECT 1');
                        console.log('🟢 DB HANDSHAKE OK (local fallback 127.0.0.1 root)');
                        return knex;
                    } catch (fallbackErr: any) {
                        const mounirConfig = {
                            ...localConfig,
                            connection: {
                                ...localConfig.connection,
                                user: 'mounir',
                            },
                        };
                        const knexMounir = Knex.default(mounirConfig);
                        Model.knex(knexMounir);
                        try {
                            await knexMounir.raw('SELECT 1');
                            console.log('🟢 DB HANDSHAKE OK (local fallback 127.0.0.1 mounir)');
                            return knexMounir;
                        } catch {
                            console.error('🔴 DB HANDSHAKE FAILED on all hosts');
                            return knex;
                        }
                    }
                }
            },
        },
    ],
    exports: ['KnexConnection'],
})
export class DatabaseModule { }
