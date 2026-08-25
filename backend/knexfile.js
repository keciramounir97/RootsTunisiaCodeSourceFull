require('dotenv').config({ path: '.env.production' });
require('dotenv').config({ path: '../.env.production' });
require('dotenv').config();

module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || 'rootstunisia_rootstunisiadb',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'karim',
        password: process.env.DB_PASSWORD || '636363',
        database: process.env.DB_NAME || process.env.DB_DATABASE || 'rootstunisiadb',
        charset: 'utf8mb4',
    },
    migrations: {
        directory: './src/db/migrations',
        extension: process.env.NODE_ENV === 'production' ? 'js' : 'ts',
    },
    seeds: {
        directory: './src/db/seeds',
    },
};
