exports.up = function(knex, Promise) {
    return knex.schema.createTable('equipments', table => {
        table.increments('id').primary();
        table.string('type').notNull();
        table.string('specification');
        table.string('patrimony').notNull();
        table.integer('userId').references('id').inTable('users').notNull().onDelete('CASCADE');  // каскадное удаление
        table.timestamp('expirationDate');  // можно изменить на DATE, если нужно
        table.timestamps();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('equipments');
};
