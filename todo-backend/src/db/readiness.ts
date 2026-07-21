import { sql } from 'drizzle-orm';
import { db } from './index.ts';

export const isDbReady = async (): Promise<boolean> => {
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
};
