import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export async function initializeDatabase() {
  try {
    await pool.connect();
    console.log('🐘 PostgreSQL conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
    throw error;
  }
}
