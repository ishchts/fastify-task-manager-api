export default async (fastify) => {
  const {
    objection: {
      models: {
        task,
        label,
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
              labels: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      id: 'number',
                      name: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const tasks = await task.query().withGraphFetched('[creator, status, executor, labels]');
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
            labels: {
              type: 'array',
              items: {
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
        },
      },
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const findedTask = await task.query().withGraphFetched('labels').findById(req.params.id);
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
          labelIds: {
            type: 'array',
            items: {
              type: 'number',
            },
          },
        },
        additionalProperties: false,
      },
    },
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const labels = await label.query().findByIds(req.body.labelIds ?? []);
      delete req.body.labelIds;
      await task.transaction(async (trx) => {
        await task.query(trx).insertGraph({
          ...req.body,
          labels,
        }, { relate: true });
        reply.code(201);
      });
      reply.code(201);
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
          labelIds: {
            type: 'array',
            items: {
              type: 'number',
            },
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
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      const labels = await label.query().findByIds(req.body.labelIds ?? []);
      delete req.body.labelIds;
      await task.transaction(async (trx) => {
        const res = await task.query(trx).upsertGraph({
          id: req.params.id,
          ...req.body,
          description: req.body.description ?? '',
          executorId: req.body.executorId ?? null,
          labels,
        }, {
          relate: true,
          noDelete: ['creator', 'status', 'executor'],
          unrelate: ['labels'],
          noUpdate: ['labels'],
        });

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
    onRequest: [fastify.authenticate],
  }, async (req, reply) => {
    try {
      await task.query().deleteById(req.params.id);
      reply.code(200);
    } catch (error) {
      reply.send(error);
    }
  });
};
