import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line
const __dirname = path.dirname(__filename);

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

const seeds = {
  directory: path.join(__dirname, 'server', 'seeds'),
};

export const development = {
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite3',
  },
  migrations,
  seeds,
};

export const staging = {
  client: 'postgresql',
  connection: {
    database: 'my_db',
    user: 'username',
    password: 'password',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

export const production = {
  client: 'pg',
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  migrations,
  seeds,
};
