export const seed = async (knex) => {
  await knex('tasks').del();
  await knex('tasks').insert([
    {
      name: 'task seed',
      description: 'description seed',
      status_id: 36,
      creator_id: 24,
      executor_id: 25,
    },
  ]);
};

export default seed;
