import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      options: '-c client_encoding=UTF8'
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'hairstyle_db',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      options: '-c client_encoding=UTF8'
    };

export const pool = new Pool(dbConfig);

export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL conectado correctamente');
    
    if (process.env.DATABASE_URL) {
      console.log('Conectado usando DATABASE_URL');
    } else {
      console.log('Base de datos:', dbConfig.database);
      console.log('Host:', dbConfig.host + ':' + dbConfig.port);
    }
    
    await createTables(client);
    
    client.release();
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error);
    throw error;
  }
}

async function createTables(client) {
  try {
    await client.query(`
      ALTER TABLE clientes 
      ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE
    `);
  } catch (err) {
    console.log('Columna username ya existe o no se pudo agregar');
  }

  try {
    await client.query(`
      ALTER TABLE tratamientos 
      ADD COLUMN IF NOT EXISTS imagen_url VARCHAR(500)
    `);
  } catch (err) {
    console.log('Columna imagen_url ya existe o no se pudo agregar');
  }

  const tables = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      rol VARCHAR(20) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      telefono VARCHAR(50),
      email VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS tratamientos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      precio DECIMAL(10,2) NOT NULL DEFAULT 0,
      duracion INTEGER DEFAULT 60,
      descripcion TEXT,
      imagen_url VARCHAR(500),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS turnos (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER NOT NULL,
      tratamiento_id INTEGER NOT NULL,
      fecha DATE NOT NULL,
      hora TIME NOT NULL,
      estado VARCHAR(20) DEFAULT 'pendiente',
      notas TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id)
    )`,

    `CREATE TABLE IF NOT EXISTS promociones (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      descuento DECIMAL(5,2),
      precio_especial DECIMAL(10,2),
      fecha_inicio DATE,
      fecha_fin DATE,
      imagen_url VARCHAR(500),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS galeria (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      imagen_url VARCHAR(500) NOT NULL,
      categoria VARCHAR(100),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS horarios_bloqueados (
      id SERIAL PRIMARY KEY,
      fecha DATE NOT NULL,
      hora TIME,
      motivo VARCHAR(255),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS legajos (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER NOT NULL,
      tratamiento VARCHAR(255),
      tipo VARCHAR(50) DEFAULT 'facial',
      fecha DATE NOT NULL,
      datos JSONB NOT NULL,
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS bloqueos (
      id SERIAL PRIMARY KEY,
      fecha DATE,
      hora TIME,
      todo_el_dia BOOLEAN DEFAULT FALSE,
      motivo VARCHAR(255),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS testimonios (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER NOT NULL,
      texto TEXT NOT NULL,
      calificacion INTEGER DEFAULT 5,
      aprobado BOOLEAN DEFAULT FALSE,
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
    )`
  ];

  for (const table of tables) {
    await client.query(table);
  }
  
  console.log('Tablas creadas/verificadas');

  const adminResult = await client.query('SELECT COUNT(*) as count FROM usuarios');
  if (parseInt(adminResult.rows[0].count) === 0) {
    await client.query(
      'INSERT INTO usuarios (username, password, nombre, rol) VALUES ($1, $2, $3, $4)',
      ['Abitu', 'Abitu26', 'Administrador', 'admin']
    );
    
    await client.query(
      'INSERT INTO usuarios (username, password, nombre, rol) VALUES ($1, $2, $3, $4)',
      ['admin', 'admin123', 'Administrador', 'admin']
    );
    
    console.log('Usuarios admin creados');
    const clienteTest = await client.query('SELECT COUNT(*) as count FROM clientes WHERE username = $1', ['cliente1']);
if (parseInt(clienteTest.rows[0].count) === 0) {
  await client.query(
    'INSERT INTO clientes (username, nombre, telefono, email, password, activo) VALUES ($1, $2, $3, $4, $5, $6)',
    ['cliente1', 'Cliente Prueba', '3388123456', null, 'cliente123', true]
  );
  console.log('Cliente de prueba creado');
}
  }
  const clienteTest = await client.query('SELECT COUNT(*) as count FROM clientes WHERE username = $1', ['cliente1']);
if (parseInt(clienteTest.rows[0].count) === 0) {
  await client.query(
    'INSERT INTO clientes (username, nombre, telefono, email, password, activo) VALUES ($1, $2, $3, $4, $5, $6)',
    ['cliente1', 'Cliente Prueba', '3388123456', null, 'cliente123', true]
  );
  console.log('Cliente de prueba creado');
}
  const tratamientosResult = await client.query('SELECT COUNT(*) as count FROM tratamientos');
  if (parseInt(tratamientosResult.rows[0].count) === 0) {
    const tratamientos = [
      { nombre: 'LIFTING DE PESTAÑAS', precio: 14000, duracion: 90, descripcion: 'Lifting profesional de pestañas' },
      { nombre: 'Diseño y perfilado de cejas', precio: 10000, duracion: 45, descripcion: 'Diseño personalizado de cejas' },
      { nombre: 'Alisados', precio: 0, duracion: 180, descripcion: 'Consultar precio' },
      { nombre: 'Peinados', precio: 0, duracion: 60, descripcion: 'Consultar precio' },
      { nombre: 'Baños de crema', precio: 15000, duracion: 60, descripcion: 'Tratamiento nutritivo' },
      { nombre: 'Limpiezas faciales', precio: 20000, duracion: 75, descripcion: 'Limpieza facial profunda', imagen_url: '/fotos/facial.jpg' },
      { nombre: 'Cortes de puntas', precio: 10000, duracion: 30, descripcion: 'Corte de puntas' }
    ];

    for (const t of tratamientos) {
      await client.query(
        'INSERT INTO tratamientos (nombre, precio, duracion, descripcion, activo) VALUES ($1, $2, $3, $4, $5)',
        [t.nombre, t.precio, t.duracion, t.descripcion, true]
      );
    }
    
    console.log('Tratamientos cargados');
  }

  // Agregar 'Cortes de puntas' si no existe
  const cortesExist = await client.query("SELECT COUNT(*) as count FROM tratamientos WHERE nombre ILIKE '%cortes de puntas%'");
  if (parseInt(cortesExist.rows[0].count) === 0) {
    await client.query(
      'INSERT INTO tratamientos (nombre, precio, duracion, descripcion, activo) VALUES ($1, $2, $3, $4, $5)',
      ['Cortes de puntas', 10000, 30, 'Corte de puntas', true]
    );
    console.log('Tratamiento "Cortes de puntas" agregado');
  }
}

export const db = {
  async loginAdmin(username, password) {
    const result = await pool.query(
      'SELECT id, username, nombre, rol FROM usuarios WHERE username = $1 AND password = $2 AND rol = $3',
      [username, password, 'admin']
    );
    return result.rows[0];
  },

  async loginCliente(telefono, password) {
    const result = await pool.query(
      'SELECT id, nombre, telefono, email FROM clientes WHERE telefono = $1 AND password = $2 AND activo = TRUE',
      [telefono, password]
    );
    return result.rows[0];
  },

  async registrarCliente(nombre, telefono, email, password) {
    const result = await pool.query(
      'INSERT INTO clientes (nombre, telefono, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [nombre, telefono, email, password]
    );
    return result.rows[0].id;
  },

  async getAllClientes() {
    const result = await pool.query('SELECT * FROM clientes ORDER BY nombre');
    return result.rows;
  }
};

export default db;


