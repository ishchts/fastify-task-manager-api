export const up = (knex) => knex.schema.createTable('users', (table) => {
  table.increments('id').primary();
  table.string('first_name').notNullable();
  table.string('last_name').notNullable();
  table.string('email').notNullable();
  table.string('password_digested').notNullable();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('users');
