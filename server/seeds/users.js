import secure from '../lib/secure.js';

export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {
      first_name: 'Ekaterina', last_name: 'Tarasova', email: 'tarasova@mail.ru', password: secure('Qwerty11'),
    },
    {
      first_name: 'Nikita', last_name: 'Strogov', email: 'strogov@mail.ru', password: secure('Qwerty1234'),
    },
  ]);
};

export default seed;
