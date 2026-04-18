import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'commnision',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
});

export async function query<T = any>(sql: string, params?: unknown[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params as any[]);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

export async function execute(sql: string, params?: unknown[]): Promise<number> {
  const [result] = await pool.execute(sql, params as any[]);
  return (result as any).affectedRows || 0;
}

export default pool;