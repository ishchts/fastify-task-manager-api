export const seed = async (knex) => {
  await knex('labels').del();
  await knex('labels').insert([
    { name: 'bug' },
    { name: 'feature' },
    { name: 'documentation' },
    { name: 'enhancement' },
    { name: 'help wanted' },
    { name: 'invalid' },
  ]);
};

export default seed;
