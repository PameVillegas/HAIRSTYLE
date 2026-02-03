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

// Debug: probar login admin
router.post('/debug-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Debug login - Usuario:', username, 'Password:', password);
    
    const client = await pool.connect();
    
    // Buscar usuario exacto
    const result = await client.query(
      'SELECT * FROM usuarios WHERE username = $1 AND password = $2 AND rol = $3',
      [username, password, 'admin']
    );
    
    console.log('Resultado query:', result.rows);
    
    client.release();
    
    if (result.rows.length > 0) {
      res.json({ 
        success: true, 
        message: 'Login exitoso',
        user: result.rows[0]
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Credenciales incorrectas',
        debug: { username, password }
      });
    }
  } catch (error) {
    console.error('Error en debug login:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Ruta de prueba para debug del login
router.post('/test-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const client = await pool.connect();
    
    // Buscar el usuario exacto
    const result = await client.query(
      'SELECT username, password, nombre, rol FROM usuarios WHERE username = $1',
      [username]
    );
    
    client.release();
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = user.password === password;
      
      res.json({
        success: true,
        found: true,
        username: user.username,
        storedPassword: user.password,
        providedPassword: password,
        passwordMatch: passwordMatch,
        user: passwordMatch ? {
          id: user.id,
          username: user.username,
          nombre: user.nombre,
          rol: user.rol
        } : null
      });
    } else {
      res.json({
        success: true,
        found: false,
        message: `Usuario '${username}' no encontrado`
      });
    }
  } catch (error) {
    console.error('Error en test login:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
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