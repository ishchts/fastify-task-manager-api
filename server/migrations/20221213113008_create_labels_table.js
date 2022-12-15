export const up = (knex) => knex.schema.createTable('labels', (table) => {
  table.increments('id').primary();
  table.string('name').notNullable();
});

export const down = (knex) => knex.schema.dropTable('labels');
