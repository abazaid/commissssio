const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'commnision',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});

async function setup() {
  const connection = await pool.getConnection();
  
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../src/lib/schema.sql'), 'utf8');
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      await connection.query(statement);
      console.log('✓ Executed');
    }
    
    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    await pool.end();
  }
}

setup();