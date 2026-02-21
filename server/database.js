import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log('🐘 PostgreSQL conectado correctamente'))
  .catch(err => console.error('❌ Error conectando a PostgreSQL:', err));

export const db = {

  async loginAdmin(loginField, password) {
    const result = await pool.query(
      `SELECT * FROM usuarios 
       WHERE (email = $1 OR username = $1)
       AND password = $2 AND rol = 'admin'`,
      [loginField, password]
    );
    return result.rows[0];
  },

  async loginCliente(loginField, password) {
    const result = await pool.query(
      `SELECT * FROM usuarios 
       WHERE (email = $1 OR telefono = $1)
       AND password = $2`,
      [loginField, password]
    );
    return result.rows[0];
  }

};
