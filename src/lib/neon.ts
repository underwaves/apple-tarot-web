import { neon } from '@neondatabase/serverless';

// Default Neon connection string provided for the Auralune store
const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_mKdtEJSTQ67e@ep-autumn-bird-azteckwb-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const isExplicitLocal = process.env.LOCAL_DB_MODE === 'true';
const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
);

const connectionString = isExplicitLocal || hasSupabase
  ? (process.env.DATABASE_URL || '')
  : (process.env.DATABASE_URL || DEFAULT_NEON_URL);

export const isNeonConfigured = Boolean(
  !isExplicitLocal &&
  connectionString &&
  connectionString.startsWith('postgres')
);

let sqlInstance: ReturnType<typeof neon> | null = null;

export function getNeonSql() {
  if (!isNeonConfigured) return null;
  if (!sqlInstance) {
    sqlInstance = neon(connectionString);
  }
  return sqlInstance;
}

let isInitialized = false;

export async function ensureNeonSchema() {
  if (isInitialized) return;
  const sql = getNeonSql();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS auralune_store_kv (
        key VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    isInitialized = true;
  } catch (err) {
    console.warn('Neon schema ensure warning:', err);
  }
}

/**
 * Fetch a JSON document by key from Neon PostgreSQL
 */
export async function neonGet<T>(key: string, defaultValue: T): Promise<T> {
  const sql = getNeonSql();
  if (!sql) return defaultValue;

  try {
    await ensureNeonSchema();
    const rows = (await sql`
      SELECT data FROM auralune_store_kv WHERE key = ${key} LIMIT 1;
    `) as Array<{ data: unknown }>;
    if (Array.isArray(rows) && rows.length > 0 && rows[0]?.data !== undefined) {
      return rows[0].data as T;
    }
    return defaultValue;
  } catch (err) {
    console.error(`Neon get error for key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Store a JSON document by key into Neon PostgreSQL (upsert)
 */
export async function neonSet<T>(key: string, data: T): Promise<T> {
  const sql = getNeonSql();
  if (!sql) return data;

  try {
    await ensureNeonSchema();
    const jsonStr = JSON.stringify(data);
    await sql`
      INSERT INTO auralune_store_kv (key, data, updated_at)
      VALUES (${key}, ${jsonStr}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
    `;
    return data;
  } catch (err) {
    console.error(`Neon set error for key "${key}":`, err);
    throw err;
  }
}
