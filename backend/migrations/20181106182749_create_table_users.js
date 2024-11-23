exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();  // Уникальный идентификатор
        table.string('name').notNull();    // Имя пользователя
        table.string('email').notNull().unique();  // Уникальный email
        table.string('password').notNull();  // Пароль
        table.timestamp('created_at').defaultTo(knex.fn.now());  // Время создания
        table.timestamp('updated_at').defaultTo(knex.fn.now());  // Время обновления, с дефолтным значением
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');  // Удаление таблицы при откате миграции
};
