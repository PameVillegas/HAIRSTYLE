import pkg from 'pg';
const { Pool } = pkg;

// 🔹 configuración conexión PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hairstyle',
  password: 'Teito2009',
  port: 5432,
});

// 🔹 función para inicializar conexión
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    client.release();
    console.log('🐘 PostgreSQL conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    throw error;
  }
}

// ✅ EXPORTS IMPORTANTES
export const db = pool;
export { pool };
export default pool;
