export const up = (knex) => knex.schema.createTable('labels', (table) => {
  table.increments('id').primary();
  table.string('name').notNullable();
  table.timestamp('create_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('labels');
