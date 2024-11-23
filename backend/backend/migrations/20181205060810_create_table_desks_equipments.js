exports.up = function(knex, Promise) {
    return knex.schema.createTable('desks_equipments', table => {
        table.increments('id').primary();
        table.integer('equipmentId').references('id').inTable('equipments').onDelete('CASCADE');  // каскадное удаление
        table.integer('deskId').references('id').inTable('desks').onDelete('CASCADE');  // каскадное удаление
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('desks_equipments');
};
