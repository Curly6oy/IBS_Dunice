require('dotenv').config()

module.exports = {
    client: 'postgresql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'postgres',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'passsqlZe9',
        port: process.env.DB_PORT || '5432'
    },
    pool: {
        min: 2,
        max: 100
    },
    migrations: {
        tableName: 'knex_migrations'
    }
};
