import express from 'express';
import { db } from '../database.js';
import pkg from 'pg';
const { Pool } = pkg;

// Usar la misma configuración de conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const router = express.Router();

// Login de administrador
router.post('/admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Usar email o username
    const loginField = email || username;
    
    const user = await db.loginAdmin(loginField, password);
    
    if (user) {
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          nombre: user.nombre,
          rol: user.rol
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }
  } catch (error) {
    console.error('Error en login admin:', error);
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
});

// Login de cliente
router.post('/cliente', async (req, res) => {
  try {
    const { telefono, email, password } = req.body;
    
    // Usar email o teléfono
    const loginField = telefono || email;
    
    const user = await db.loginCliente(loginField, password);
    
    if (user) {
      res.json({
        success: true,
        user: {
          id: user.id,
          nombre: user.nombre,
          telefono: user.telefono,
          email: user.email
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }
  } catch (error) {
    console.error('Error en login cliente:', error);
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
});

// Listar usuarios admin (solo para debug)
router.get('/list-admins', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT username, nombre, rol FROM usuarios WHERE rol = $1',
      ['admin']
    );
    
    client.release();
    res.json({ 
      success: true, 
      users: result.rows 
    });
  } catch (error) {
    console.error('Error listando admins:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error del servidor' 
    });
  }
});

// Crear usuario admin adicional
router.post('/create-admin', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Verificar si el usuario Abitu ya existe
    const existingUser = await client.query(
      'SELECT COUNT(*) as count FROM usuarios WHERE username = $1',
      ['Abitu']
    );
    
    if (parseInt(existingUser.rows[0].count) === 0) {
      // Crear el nuevo usuario admin
      await client.query(
        'INSERT INTO usuarios (username, password, nombre, rol) VALUES ($1, $2, $3, $4)',
        ['Abitu', 'Abitu26', 'Administrador Abitu', 'admin']
      );
      
      client.release();
      res.json({ 
        success: true, 
        message: 'Usuario Abitu creado exitosamente' 
      });
    } else {
      client.release();
      res.json({ 
        success: true, 
        message: 'Usuario Abitu ya existe' 
      });
    }
  } catch (error) {
    console.error('Error creando admin:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error del servidor' 
    });
  }
});

export default router;