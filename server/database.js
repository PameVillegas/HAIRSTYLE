import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'hairstyle_user', // tu usuario
  password: process.env.DB_PASSWORD || 'Teito2009', // tu contraseña
  database: process.env.DB_NAME || 'hairstyle_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Crear base de datos si no existe y usarla
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);
    
    // Crear tablas
    await createTables(connection);

    connection.release();

    console.log('✅ Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    process.exit(1);
  }
}

async function createTables(connection) {
  const tables = [
    // Tabla usuarios (admin)
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      rol ENUM('admin') DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabla clientes
    `CREATE TABLE IF NOT EXISTS clientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      telefono VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      password VARCHAR(255),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Tabla tratamientos
    `CREATE TABLE IF NOT EXISTS tratamientos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      precio DECIMAL(10,2) NOT NULL DEFAULT 0,
      duracion INT DEFAULT 60,
      descripcion TEXT,
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Tabla turnos
    `CREATE TABLE IF NOT EXISTS turnos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cliente_id INT NOT NULL,
      tratamiento_id INT NOT NULL,
      fecha DATE NOT NULL,
      hora TIME NOT NULL,
      estado ENUM('pendiente','confirmado','completado','cancelado') DEFAULT 'pendiente',
      notas TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id)
    )`,

    // Tabla promociones
    `CREATE TABLE IF NOT EXISTS promociones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      descuento DECIMAL(5,2),
      precio_especial DECIMAL(10,2),
      fecha_inicio DATE,
      fecha_fin DATE,
      imagen_url VARCHAR(500),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Tabla galería
    `CREATE TABLE IF NOT EXISTS galeria (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      imagen_url VARCHAR(500) NOT NULL,
      categoria VARCHAR(100),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const table of tables) {
    await connection.query(table);
  }

  // Crear usuario admin por defecto
  const [adminRows] = await connection.query('SELECT COUNT(*) as count FROM usuarios');
  if (adminRows[0].count === 0) {
    await connection.query(
      'INSERT INTO usuarios (username, password, nombre, rol) VALUES (?, ?, ?, ?)',
      ['admin', 'admin123', 'Administrador', 'admin']
    );
  }
}

// Funciones de la base de datos
export const db = {
  // Autenticación Admin
  async loginAdmin(username, password) {
    const [rows] = await pool.query(
      'SELECT id, username, nombre, rol FROM usuarios WHERE username = ? AND password = ? AND rol = "admin"',
      [username, password]
    );
    return rows[0];
  },

  // Autenticación Cliente
  async loginCliente(telefono, password) {
    const [rows] = await pool.query(
      'SELECT id, nombre, telefono, email FROM clientes WHERE telefono = ? AND password = ? AND activo = TRUE',
      [telefono, password]
    );
    return rows[0];
  },

  // Registrar cliente
  async registrarCliente(nombre, telefono, email, password) {
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, telefono, email, password) VALUES (?, ?, ?, ?)',
      [nombre, telefono, email, password]
    );
    return result.insertId;
  },

  // Ejemplo: obtener todos los clientes
  async getAllClientes() {
    const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nombre');
    return rows;
  }

  // Aquí podés copiar el resto de tus funciones (tratamientos, turnos, promociones, galería)
};

export default db;
