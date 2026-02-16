import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log('🐘 PostgreSQL conectado correctamente'))
  .catch(err => console.error('❌ Error conectando a PostgreSQL:', err));

export default pool;
