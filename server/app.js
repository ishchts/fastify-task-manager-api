import path from 'path';
import AutoLoad from '@fastify/autoload';
import { fileURLToPath } from 'url';
import fastifyObjectionjs from 'fastify-objectionjs';

import * as knexConfig from '../knexfile.js';
import models from './models/index.js';

const mode = 'development';
// eslint-disable-next-line
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line
const __dirname = path.dirname(__filename);
// Pass --options via CLI arguments in command to enable these options.
export const options = {};

export default async function app(fastify, opts) {
  fastify.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
}
