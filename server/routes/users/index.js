export default async (fastify, opts) => {
  fastify.get('/', {
    schema: {
      tags: ['users'],
      description: 'Получение пользователей',
      response: {
        200: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const users = await fastify.objection.models.user.query();

    reply.code(200).send({ users });
  });

  fastify.post('/', {
    schema: {
      tags: ['users'],
      description: 'Создание пользователя',
      body: {},
    },
  }, async (request, reply) => {
    reply.code(201).send({ users: 'create users' });
  });

  fastify.patch('/:id', {
    schema: {
      tags: ['users'],
    },
  }, async (request, reply) => {
    reply.send({ users: 'patch users' });
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['users'],
    },
  }, async (request, reply) => {
    reply.send({ users: 'delete users' });
  });
};
