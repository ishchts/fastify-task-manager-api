export default async (fastify, opts) => {
  const {
    objection: {
      models: {
        user,
      },
    },
  } = fastify;
  fastify.get('/', {
    schema: {
      tags: ['users'],
      description: 'Получение пользователей',
      response: {
        200: {
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
  }, async (request, reply) => {
    const users = await user.query();

    reply.code(200).send(users);
  });

  fastify.post('/', {
    schema: {
      tags: ['users'],
      description: 'Создание пользователя',
      body: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            minLength: 2,
          },
          lastName: {
            type: 'string',
            minLength: 2,
          },
          email: {
            type: 'string',
            format: 'email',
          },
          password: {
            type: 'string',
            minLength: 3,
          },
        },
        required: ['firstName', 'lastName', 'email', 'password'],
        additionalProperties: false,
      },
      response: {
        201: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const newUser = await user.query().insert(request.body);
      reply.code(201).send(newUser);
    } catch (error) {
      reply.code(201).send(error);
    }
  });

  fastify.patch('/:id', {
    schema: {
      tags: ['users'],
      description: 'Редактирование пользователя',
      body: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            minLength: 2,
          },
          lastName: {
            type: 'string',
            minLength: 2,
          },
          email: {
            type: 'string',
            format: 'email',
          },
        },
        required: ['firstName', 'lastName', 'email'],
        additionalProperties: false,
      },
      response: {
        200: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  }, async (req, reply) => {
    try {
      const findedUser = await user.query().findById(Number(req.params.id));

      await findedUser.$query().patch(req.body);

      reply.code(200).send(findedUser);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['users'],
      description: 'Удаление пользователя',
    },
  }, async ({ params: { id } }, reply) => {
    try {
      await user.query().deleteById(id);
      reply.code(200);
    } catch (error) {
      reply.code(400).send(error);
    }
  });
};
