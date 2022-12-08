export const seed = async (knex) => {
  await knex('statuses').del();
  await knex('statuses').insert([
    { name: 'новый' },
    { name: 'в работе' },
    { name: 'на тестировании' },
    { name: 'завершен' },
  ]);
};

export default seed;
