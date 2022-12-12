export const seed = async (knex) => {
  await knex('tasks').del();
  await knex('tasks').insert([
    {
      name: 'task seed',
      description: 'description seed',
      status_id: 32,
      creator_id: 22,
      executor_id: 23,
    },
  ]);
};

export default seed;
