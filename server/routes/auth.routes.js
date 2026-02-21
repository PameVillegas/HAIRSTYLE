import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// Login de administrador
router.post('/admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const loginField = email || username;

    // ⚠️ LOGIN TEMPORAL PARA QUE FUNCIONE EL SERVER
    if (!loginField || !password) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos'
      });
    }

    res.json({
      success: true,
      message: "Login admin temporal OK"
    });

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

    const loginField = telefono || email;

    // ⚠️ LOGIN TEMPORAL
    if (!loginField || !password) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos'
      });
    }

    res.json({
      success: true,
      message: "Login cliente temporal OK"
    });

  } catch (error) {
    console.error('Error en login cliente:', error);
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
});

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Rutas de auth funcionando', timestamp: new Date() });
});

// Crear usuario Abitu
router.post('/create-abitu', async (req, res) => {
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (username, password, nombre, rol) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Abitu', 'Abitu26', 'Administrador Abitu', 'admin']
    );

    res.json({
      success: true,
      message: 'Usuario Abitu creado',
      userId: result.rows[0].id
    });

  } catch (error) {
    if (error.code === '23505') {
      res.json({
        success: true,
        message: 'Usuario Abitu ya existe'
      });
    } else {
      console.error('Error creando Abitu:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

export default router;