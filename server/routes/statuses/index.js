export default async (fastify) => {
  const {
    objection: {
      models: {
        status,
      },
    },
  } = fastify;

  fastify.get('/', {
    schema: {
      tags: ['statuses'],
      description: 'Получение списка статусов',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
            },
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const statuses = await status.query();
      reply.code(200).send(statuses);
    } catch (error) {
      throw Error(error);
    }
  });

  fastify.post('/', {
    schema: {
      tags: ['statuses'],
      description: 'Создание статуса',
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 3,
          },
        },
        required: ['name'],
        additionalProperties: false,
      },
      response: {
        201: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const res = await status.query().insert(req.body);
      reply.code(201).send(res);
    } catch (error) {
      throw Error(error);
    }
  });

  fastify.patch('/:id', {
    schema: {
      tags: ['statuses'],
      description: 'Редактирование статуса',
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 3,
          },
        },
        required: ['name'],
        additionalProperties: false,
      },
      response: {
        200: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const findedStatus = await status.query().findById(Number(req.params.id));
      if (!findedStatus) {
        throw Error('Статус не найден');
      }
      findedStatus.$query().patch(req.body.name);
      reply.code(200).send(findedStatus);
    } catch (error) {
      throw Error(error);
    }
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['statuses'],
      description: 'Удаление статуса',
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const res = await status.query().deleteById(Number(req.params.id));
      reply.code(200).send(res);
    } catch (error) {
      throw Error(error);
    }
  });
};
