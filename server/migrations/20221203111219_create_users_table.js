export const up = (knex) => knex.schema.createTable('users', (table) => {
  table.increments('id');
  table.string('first_name', 40).notNullable();
  table.string('last_name', 40).notNullable();
  table.string('email', 40).notNullable();
  table.string('password_digested', 40).notNullable();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
});

export const down = (knex) => knex.schema.dropTable('users');
