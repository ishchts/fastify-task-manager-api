export default async function example(fastify, opts) {
  fastify.get('/', async (request, reply) => 'this is an example');
}
