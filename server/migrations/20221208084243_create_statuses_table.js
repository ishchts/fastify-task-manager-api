export const up = (knex) => knex.schema.createTable('statuses', (table) => {
  table.increments('id');
  table.string('name').notNullable();
  table.timestamp('create_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('statuses');
