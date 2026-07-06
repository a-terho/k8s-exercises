/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: 'postgres',
    // CRITICAL: missing this setting might cause drizzle-kit migrate to fail silently
    ssl: false,
  },
});
