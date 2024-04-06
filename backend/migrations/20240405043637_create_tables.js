exports.up = function (knex) {
    return knex.schema.createTable("players", (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()')).unique();
        table.varchar("name").notNullable();
        table.integer("scores").notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("players");
};