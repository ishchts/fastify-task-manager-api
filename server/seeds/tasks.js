export const seed = async (knex) => {
  await knex('tasks').del();
  await knex('tasks').insert([
    {
      name: 'task seed111',
      description: 'description seed111',
      creator_id: 10,
      executor_id: 13,
      status_id: 5,
    },
    {
      name: 'task seed222',
      description: 'description seed222',
      creator_id: 11,
      executor_id: 12,
      status_id: 5,
    },
    {
      name: 'task seed333',
      description: 'description seed333',
      creator_id: 12,
      executor_id: 11,
      status_id: 6,
    },
    {
      name: 'task seed444',
      description: 'description seed444',
      creator_id: 13,
      executor_id: 10,
      status_id: 6,
    },
  ]);
};

export default seed;
