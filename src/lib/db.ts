import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

export async function withTransaction<T>(
  fn: () => Promise<T>
): Promise<T> {
  await sql`BEGIN`;
  try {
    const result = await fn();
    await sql`COMMIT`;
    return result;
  } catch (e) {
    await sql`ROLLBACK`;
    throw e;
  }
}
