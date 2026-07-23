import { pgTable, serial, text, boolean } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  message: text().notNull(),
  done: boolean().notNull().default(false),
});
