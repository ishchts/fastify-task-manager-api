export default async (fastify) => {
  const {
    objection: {
      models: {
        user,
      },
    },
  } = fastify;
  fastify.post('/sign-up', {
    schema: {
      tags: ['auth'],
      description: 'Авторизация',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
          },
          password: {
            type: 'string',
            minLength: 3,
          },
        },
        additionalProperties: false,
      },
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
            },
            refreshToken: {
              type: 'string',
            },
          },
        },
      },
    },
  }, async ({ body: { email, password }, cookies }, reply) => {
    try {
      const findedUser = await user.query().findOne({ email });

      if (!findedUser) {
        throw Error('Проверьте email');
      }

      if (!findedUser.verifyPassword(password)) {
        throw Error('Проверьте password');
      }

      const payload = {
        id: findedUser.id,
        firstName: findedUser.firstName,
        email: findedUser.email,
      };

      const accessToken = await reply.jwtSign({ payload }, { expiresIn: '30s' });
      const refreshToken = await reply.jwtSign({}, { expiresIn: '1d' });

      reply
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          httpOnly: true,
          sameSite: true,
        })
        .code(200)
        .send({ accessToken, refreshToken });
    } catch (error) {
      throw Error(error);
    }
  });
};
