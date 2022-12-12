export default async (fastify) => {
  const {
    objection: {
      models: {
        task,
      },
    },
  } = fastify;

  fastify.get('/', {
    schema: {
      tags: ['tasks'],
      description: 'Список задач',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              },
              name: {
                type: 'string',
                minLength: 3,
              },
              description: {
                type: 'string',
              },
              createdAt: {
                type: 'string',
                format: 'datetime',
              },
              creator: {
                type: 'object',
                properties: {
                  firstName: {
                    type: 'string',
                  },
                  lastName: {
                    type: 'string',
                  },
                },
              },
              status: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                },
              },
              executor: {
                type: ['object', 'null'],
                properties: {
                  firstName: {
                    type: ['string'],
                  },
                  lastName: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  }, async (req, reply) => {
    try {
      const tasks = await task.query().withGraphFetched('[creator, status, executor]');
      reply.code(200).send(tasks);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.get('/:id', {
    schema: {
      tags: ['tasks'],
      description: 'Деталка задачи',
      response: {
        200: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            statusId: {
              type: 'number',
            },
            creatorId: {
              type: 'number',
            },
            executorId: {
              type: ['number', 'null'],
            },
          },
        },
      },
    },
  }, async (req, reply) => {
    try {
      const findedTask = await task.query().findById(req.params.id);
      reply.code(200).send(findedTask);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.post('/', {
    schema: {
      tags: ['tasks'],
      description: 'Создание новой задачи',
      body: {
        type: 'object',
        required: ['name', 'creatorId', 'statusId'],
        properties: {
          name: {
            type: 'string',
            minLength: 3,
          },
          description: {
            type: 'string',
          },
          creatorId: {
            type: 'number',
          },
          statusId: {
            type: 'number',
          },
          executorId: {
            type: 'number',
          },
        },
        additionalProperties: false,
      },
    },
  }, async (req, reply) => {
    try {
      await task.transaction(async (trx) => {
        await task.query(trx).insert(req.body);
        reply.code(201);
      });
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.patch('/:id', {
    schema: {
      tags: ['tasks'],
      description: 'Редактирование задачи',
      body: {
        type: 'object',
        required: ['name', 'creatorId', 'statusId'],
        properties: {
          name: {
            type: 'string',
            minLength: 3,
          },
          description: {
            type: 'string',
          },
          creatorId: {
            type: 'number',
          },
          statusId: {
            type: 'number',
          },
          executorId: {
            type: 'number',
          },
        },
        additionalProperties: false,
      },
      response: {
        200: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 3,
            },
            description: {
              type: 'string',
            },
            creatorId: {
              type: 'number',
            },
            statusId: {
              type: 'number',
            },
            executorId: {
              type: ['number', 'null'],
            },
          },
        },
      },
    },
  }, async (req, reply) => {
    try {
      await task.transaction(async (trx) => {
        const res = await task.query(trx).upsertGraph({
          id: req.params.id,
          ...req.body,
          description: req.body.description ?? '',
          executorId: req.body.executorId ?? null,
        }, { noDelete: true, relate: true });
        reply.code(200).send(res);
      });
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.delete('/:id', {
    schema: {
      tags: ['tasks'],
      description: 'Удаление задачи',
    },
  }, async (req, reply) => {
    try {
      await task.query().deleteById(req.params.id);
      reply.code(200);
    } catch (error) {
      reply.send(error);
    }
  });
};
