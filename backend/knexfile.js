
module.exports = {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'postgres',
      user:     'postgres',
      password: 'passsqlZe9',
      port: 5432
    },
    pool: {
      min: 2,
      max: 100
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
