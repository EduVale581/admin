import { Pool, type QueryResultRow } from "pg";

type GlobalWithPool = typeof globalThis & {
  __dbPool?: Pool;
};

const globalForDb = globalThis as GlobalWithPool;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no esta definida en el entorno");
}

const pool =
  globalForDb.__dbPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__dbPool = pool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  const result = await pool.query<T>(text, params);
  return result;
}
