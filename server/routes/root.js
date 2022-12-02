export default async function root(fastify) {
  fastify.get('/', async (request, reply) => ({ root: true }));
}
