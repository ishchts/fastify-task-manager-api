export default async function example(fastify, opts) {
  fastify.get('/', async (request, reply) => {
    const users = await fastify.objection.models.user.query();

    reply.send({ users });
  });
  fastify.post('/', async (request, reply) => {
    reply.send({ users: 'create users' });
  });
  fastify.patch('/:id', async (request, reply) => {
    reply.send({ users: 'patch users' });
  });
  fastify.delete('/:id', async (request, reply) => {
    reply.send({ users: 'delete users' });
  });
}
