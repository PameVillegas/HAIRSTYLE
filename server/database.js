import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión PostgreSQL
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Crear pool de conexiones
const pool = new Pool(dbConfig);

// Exportar el pool para uso directo
export { pool };

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Crear tablas
    await createTables(client);

    client.release();

    console.log('✅ Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    process.exit(1);
  }
}

async function createTables(client) {
  const tables = [
    // Tabla usuarios (admin)
    `CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      rol VARCHAR(20) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabla clientes
    `CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      telefono VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      password VARCHAR(255),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabla tratamientos
    `CREATE TABLE IF NOT EXISTS tratamientos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      precio DECIMAL(10,2) NOT NULL DEFAULT 0,
      duracion INTEGER DEFAULT 60,
      descripcion TEXT,
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabla turnos
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

    // Tabla promociones
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

    // Tabla galería
    `CREATE TABLE IF NOT EXISTS galeria (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      imagen_url VARCHAR(500) NOT NULL,
      categoria VARCHAR(100),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const table of tables) {
    await client.query(table);
  }

  // Crear usuarios admin por defecto
  const adminResult = await client.query('SELECT COUNT(*) as count FROM usuarios');
  if (parseInt(adminResult.rows[0].count) === 0) {
    // Crear usuario Abitu
    await client.query(
      'INSERT INTO usuarios (username, password, nombre, rol) VALUES ($1, $2, $3, $4)',
      ['Abitu', 'Abitu26', 'Administrador', 'admin']
    );
    
    // Crear usuario admin
    await client.query(
      'INSERT INTO usuarios (username, password, nombre, rol) VALUES ($1, $2, $3, $4)',
      ['admin', 'admin123', 'Administrador', 'admin']
    );
    
    console.log('✅ Usuarios admin creados: Abitu y admin');
  }
  
  // Cargar tratamientos por defecto
  const tratamientosResult = await client.query('SELECT COUNT(*) as count FROM tratamientos');
  if (parseInt(tratamientosResult.rows[0].count) === 0) {
    const tratamientos = [
      {
        nombre: 'LIFTING DE PESTAÑAS',
        precio: 14000,
        duracion: 90,
        descripcion: 'Lifting profesional de pestañas para una mirada más expresiva'
      },
      {
        nombre: 'Diseño y perfilado de cejas',
        precio: 10000,
        duracion: 45,
        descripcion: 'Diseño personalizado y perfilado profesional de cejas'
      },
      {
        nombre: 'Alisados',
        precio: 0,
        duracion: 180,
        descripcion: 'Consultar precio - Alisados profesionales'
      },
      {
        nombre: 'Peinados',
        precio: 0,
        duracion: 60,
        descripcion: 'Consultar precio - Peinados para eventos especiales'
      },
      {
        nombre: 'Baños de crema',
        precio: 15000,
        duracion: 60,
        descripcion: 'Tratamiento nutritivo e hidratante para el cabello'
      },
      {
        nombre: 'Limpiezas faciales',
        precio: 20000,
        duracion: 75,
        descripcion: 'Limpieza facial profunda y tratamiento de la piel'
      }
    ];

    for (const tratamiento of tratamientos) {
      await client.query(
        'INSERT INTO tratamientos (nombre, precio, duracion, descripcion, activo) VALUES ($1, $2, $3, $4, $5)',
        [tratamiento.nombre, tratamiento.precio, tratamiento.duracion, tratamiento.descripcion, true]
      );
    }
    
    console.log('✅ Tratamientos cargados con precios');
  }
}

// Funciones de la base de datos
export const db = {
  // Autenticación Admin
  async loginAdmin(username, password) {
    const result = await pool.query(
      'SELECT id, username, nombre, rol FROM usuarios WHERE username = $1 AND password = $2 AND rol = $3',
      [username, password, 'admin']
    );
    return result.rows[0];
  },

  // Autenticación Cliente
  async loginCliente(telefono, password) {
    const result = await pool.query(
      'SELECT id, nombre, telefono, email FROM clientes WHERE telefono = $1 AND password = $2 AND activo = TRUE',
      [telefono, password]
    );
    return result.rows[0];
  },

  // Registrar cliente
  async registrarCliente(nombre, telefono, email, password) {
    const result = await pool.query(
      'INSERT INTO clientes (nombre, telefono, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [nombre, telefono, email, password]
    );
    return result.rows[0].id;
  },

  // Ejemplo: obtener todos los clientes
  async getAllClientes() {
    const result = await pool.query('SELECT * FROM clientes ORDER BY nombre');
    return result.rows;
  }

  // Aquí podés copiar el resto de tus funciones (tratamientos, turnos, promociones, galería)
};

export default db;
