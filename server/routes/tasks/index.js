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
      query: {
        type: 'object',
        properties: {
          status: {
            type: 'number',
          },
          executor: {
            type: 'number',
          },
          label: {
            type: 'number',
          },
          isCreator: {
            type: 'boolean',
          },
        },
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'creatorId', 'statusId'],
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
                    id: {
                      type: 'number',
                    },
                    name: {
                      id: 'string',
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
      const result = await task.transaction(async (trx) => {
        const tasks = task.query(trx)
          .withGraphJoined('[creator, status, executor, labels]');

        if (req.query.status) {
          tasks.modify('filterBy', 'statusId', req.query.status);
        }
        if (req.query.executor) {
          tasks.modify('filterBy', 'executorId', req.query.executor);
        }

        if (req.query.isCreator) {
          tasks.modify('filterBy', 'creatorId', req.user.payload.id);
        }

        if (req.query.label) {
          tasks.modify('filterBy', 'labels.id', req.query.label);
        }

        return tasks;
      });

      reply.code(200).send(result);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.get('/:id', {
    schema: {
      tags: ['tasks'],
      description: 'Деталка задачи',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
          },
        },
      },
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
      const findedTask = await task.query().withGraphJoined('labels').findById(req.params.id);
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
      response: {
        201: {},
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
      });
      reply.code(201).send({});
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.patch('/:id', {
    schema: {
      tags: ['tasks'],
      description: 'Редактирование задачи',
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
      await task.query().deleteById(req.params.id);
      reply.code(200);
    } catch (error) {
      reply.send(error);
    }
  });
};
