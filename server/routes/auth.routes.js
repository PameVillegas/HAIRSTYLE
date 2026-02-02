import express from 'express';
import { db } from '../database.js';

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

export default router;