export const seed = async (knex) => {
  await knex('tasks').del();
  await knex('tasks').insert([
    {
      name: 'task seed111',
      description: 'description seed111',
      creator_id: 26,
      executor_id: 27,
      status_id: 40,
    },
    {
      name: 'task seed222',
      description: 'description seed222',
      creator_id: 27,
      executor_id: 26,
      status_id: 41,
    },
    {
      name: 'task seed333',
      description: 'description seed333',
      creator_id: 28,
      executor_id: 29,
      status_id: 42,
    },
    {
      name: 'task seed444',
      description: 'description seed444',
      creator_id: 29,
      executor_id: 28,
      status_id: 43,
    },
  ]);
};

export default seed;
