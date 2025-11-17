import { sql } from 'drizzle-orm';

export function buildConflictSet<T extends Record<string, any>>(row: T) {
  const set: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    set[key] = sql.raw(`excluded.${key}`);
  }
  return set;
}
