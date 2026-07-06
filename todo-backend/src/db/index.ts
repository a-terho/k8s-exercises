import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.ts';

// const connectionString = `postgres://postgres:${process.env.POSTGRES_PASSWORD}@${process.env.DATABASE_HOST}/postgres`;

export const db = drizzle({
  connection: {
    host: process.env.DATABASE_HOST,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: 'postgres',
    ssl: false,
  },
  logger: process.env.NODE_ENV === 'development',
  schema,
});
