import express from 'express';
import { db, pool } from '../database.js';

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

// Ruta de prueba simple
router.get('/test', (req, res) => {
  res.json({ message: 'Rutas de auth funcionando', timestamp: new Date() });
});

// Crear usuario Abitu en la base de datos
router.post('/create-abitu', async (req, res) => {
  try {
    // Intentar crear el usuario directamente
    const result = await pool.query(
      'INSERT INTO usuarios (username, password, nombre, rol) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Abitu', 'Abitu26', 'Administrador Abitu', 'admin']
    );
    
    res.json({ 
      success: true, 
      message: 'Usuario Abitu creado exitosamente',
      userId: result.rows[0].id
    });
  } catch (error) {
    // Si el error es porque ya existe, está bien
    if (error.code === '23505') { // Código de PostgreSQL para violación de unicidad
      res.json({ 
        success: true, 
        message: 'Usuario Abitu ya existe' 
      });
    } else {
      console.error('Error creando Abitu:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error del servidor: ' + error.message 
      });
    }
  }
});

export default router;