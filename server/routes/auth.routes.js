import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// Login de administrador
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    // Verificar si existe la tabla, si no crearla
    try {
      await pool.query('SELECT 1 FROM usuarios LIMIT 1');
    } catch (e) {
      // Tabla no existe, crear estructura
      await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          nombre VARCHAR(255) NOT NULL,
          rol VARCHAR(20) DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      // Crear usuario Abitu por defecto
      await pool.query(
        'INSERT INTO usuarios (username, password, nombre, rol) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING',
        ['Abitu', 'Abitu26', 'Administrador', 'admin']
      );
    }

    const result = await pool.query(
      'SELECT id, username, nombre, rol FROM usuarios WHERE username = $1 AND password = $2 AND rol = $3',
      [username, password, 'admin']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Usuario o contraseña incorrectos'
      });
    }

    const admin = result.rows[0];
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: admin.id,
        username: admin.username,
        nombre: admin.nombre,
        rol: admin.rol
      }
    });

  } catch (error) {
    console.error('Error en login admin:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
});

// Registrar administrador
router.post('/registrar-admin', async (req, res) => {
  try {
    const { username, nombre, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    const result = await pool.query(
      'INSERT INTO usuarios (username, nombre, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, username, nombre, rol',
      [username, nombre || username, password, 'admin']
    );

    const admin = result.rows[0];
    res.status(201).json({
      success: true,
      message: 'Administrador registrado exitosamente',
      user: {
        id: admin.id,
        username: admin.username,
        nombre: admin.nombre,
        rol: admin.rol
      }
    });

  } catch (error) {
    console.error('Error en registro admin:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'El nombre de usuario ya existe'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
});

// Login de cliente
router.post('/cliente', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    const result = await pool.query(
      'SELECT id, username, nombre, telefono, email FROM clientes WHERE username = $1 AND password = $2 AND activo = TRUE',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Usuario o contraseña incorrectos'
      });
    }

    const cliente = result.rows[0];
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: cliente.id,
        username: cliente.username,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email,
        rol: 'cliente'
      }
    });

  } catch (error) {
    console.error('Error en login cliente:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
});

// Registrar nuevo cliente
router.post('/registrar', async (req, res) => {
  try {
    const { username, nombre, telefono, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    const existingUser = await pool.query(
      'SELECT id FROM clientes WHERE username = $1 OR telefono = $1',
      [username]
    );
    
    if (telefono) {
      const existingPhone = await pool.query(
        'SELECT id FROM clientes WHERE telefono = $1',
        [telefono]
      );
      if (existingPhone.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Ya existe un cliente registrado con este número de teléfono'
        });
      }
    }
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un cliente registrado con este nombre de usuario'
      });
    }

    const result = await pool.query(
      'INSERT INTO clientes (username, nombre, telefono, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, nombre, telefono, email',
      [username, nombre || username, telefono || null, email || null, password]
    );

    const cliente = result.rows[0];
    res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      user: {
        id: cliente.id,
        username: cliente.username,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email,
        rol: 'cliente'
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'El nombre de usuario ya existe'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
});

// Obtener datos del cliente
router.get('/cliente/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const clienteResult = await pool.query(
      'SELECT id, nombre, telefono, email, created_at FROM clientes WHERE id = $1 AND activo = TRUE',
      [id]
    );

    if (clienteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    const turnosResult = await pool.query(`
      SELECT 
        t.id,
        t.fecha,
        t.hora,
        t.estado,
        t.notas,
        tr.nombre as tratamiento,
        tr.precio,
        tr.duracion
      FROM turnos t
      JOIN tratamientos tr ON t.tratamiento_id = tr.id
      WHERE t.cliente_id = $1
      ORDER BY t.fecha DESC, t.hora DESC
    `, [id]);

    res.json({
      success: true,
      cliente: clienteResult.rows[0],
      turnos: turnosResult.rows
    });

  } catch (error) {
    console.error('Error obteniendo datos del cliente:', error);
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