import mysql from 'mysql2/promise';
import type { ExecuteValues } from 'mysql2';

const isProduction = process.env.NODE_ENV === 'production';
const rawHost = process.env.DB_HOST || (isProduction ? '127.0.0.1' : 'localhost');
const host = rawHost === 'localhost' ? '127.0.0.1' : rawHost;
const database = process.env.DB_NAME || 'commnision';
const user = process.env.DB_USER || (isProduction ? '' : 'root');
const password = process.env.DB_PASSWORD || '';

const pool = mysql.createPool({
  host,
  port: Number(process.env.DB_PORT) || 3306,
  database,
  user,
  password,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, (params ?? []) as ExecuteValues);
  return rows as T[];
}

export async function queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

export async function execute(sql: string, params?: unknown[]): Promise<number> {
  const [result] = await pool.execute(sql, (params ?? []) as ExecuteValues);

  if (typeof result === 'object' && result !== null && 'affectedRows' in result) {
    return Number((result as { affectedRows?: number }).affectedRows ?? 0);
  }

  return 0;
}

export default pool;
