export default async (fastify) => {
  const {
    objection: {
      models: {
        label,
      },
    },
  } = fastify;

  fastify.get('/', {
    schema: {
      tags: ['labels'],
      description: 'Получение списка меток',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              createAt: { type: 'string' },
            },
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const labels = await label.query();
      reply.code(200).send(labels);
    } catch (error) {
      throw Error(error);
    }
  });

  fastify.get('/:id', {
    schema: {
      tags: ['labels'],
      description: 'Полученние метки',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const labelItem = await label.query().findById(req.params.id);
      reply.code(200).send(labelItem);
    } catch (error) {
      throw Error(error);
    }
  });

  fastify.post('/', {
    schema: {
      tags: ['labels'],
      description: 'Создание метки',
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
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
      const newLabel = await label.query().insert(req.body);
      reply.code(201).send(newLabel);
    } catch (error) {
      throw Error(error);
    }
  });

  fastify.patch('/:id', {
    schema: {
      tags: ['labels'],
      description: 'Редактирование метки',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
          },
        },
      },
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
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
      const findedLabel = await label.query().upsertGraph({
        id: req.params.id,
        ...req.body,
      });

      reply.code(200).send(findedLabel);
    } catch (error) {
      throw Error(error);
    }
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['labels'],
      description: 'Удаление метки',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      await label.query().deleteById(req.params.id);
      reply.code(200);
    } catch (error) {
      throw Error(error);
    }
  });
};
