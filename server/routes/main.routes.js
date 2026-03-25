import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// ==================== CLIENTES ====================

// Obtener todos los clientes
router.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE activo = TRUE ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear nuevo cliente
router.post('/clientes', async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;
    
    if (!nombre || !telefono) {
      return res.status(400).json({ error: 'Nombre y teléfono son requeridos' });
    }

    const result = await pool.query(
      'INSERT INTO clientes (nombre, telefono, email) VALUES ($1, $2, $3) RETURNING *',
      [nombre, telefono, email || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando cliente:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Ya existe un cliente con ese teléfono' });
    } else {
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
});

// Actualizar cliente
router.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email } = req.body;
    
    const result = await pool.query(
      'UPDATE clientes SET nombre = $1, telefono = $2, email = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [nombre, telefono, email || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar cliente
router.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ==================== TRATAMIENTOS ====================

router.get('/tratamientos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tratamientos WHERE activo = TRUE ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo tratamientos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/tratamientos', async (req, res) => {
  try {
    const { nombre, precio, duracion, descripcion, imagen_url } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }
    const result = await pool.query(
      'INSERT INTO tratamientos (nombre, precio, duracion, descripcion, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, precio || 0, duracion || 60, descripcion || null, imagen_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando tratamiento:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.put('/tratamientos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, duracion, descripcion, imagen_url } = req.body;
    const result = await pool.query(
      'UPDATE tratamientos SET nombre = $1, precio = $2, duracion = $3, descripcion = $4, imagen_url = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [nombre, precio, duracion, descripcion, imagen_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tratamiento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando tratamiento:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.delete('/tratamientos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE tratamientos SET activo = FALSE WHERE id = $1', [id]);
    res.json({ message: 'Tratamiento eliminado' });
  } catch (error) {
    console.error('Error eliminando tratamiento:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ==================== TURNOS ====================

// Obtener todos los turnos con información de cliente y tratamiento
router.get('/turnos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.*,
        c.nombre as cliente_nombre,
        c.telefono as cliente_telefono,
        tr.nombre as tratamiento_nombre,
        tr.precio as tratamiento_precio,
        tr.duracion as tratamiento_duracion
      FROM turnos t
      JOIN clientes c ON t.cliente_id = c.id
      JOIN tratamientos tr ON t.tratamiento_id = tr.id
      ORDER BY t.fecha DESC, t.hora DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo turnos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear nuevo turno
router.post('/turnos', async (req, res) => {
  try {
    const { cliente_id, tratamiento_id, fecha, hora, notas } = req.body;
    
    if (!cliente_id || !tratamiento_id || !fecha || !hora) {
      return res.status(400).json({ error: 'Cliente, tratamiento, fecha y hora son requeridos' });
    }

    // Verificar que no haya conflicto de horarios
    const conflicto = await pool.query(
      'SELECT id FROM turnos WHERE fecha = $1 AND hora = $2 AND estado != $3',
      [fecha, hora, 'cancelado']
    );
    
    if (conflicto.rows.length > 0) {
      return res.status(400).json({ error: 'Ya hay un turno agendado en esa fecha y hora' });
    }

    const result = await pool.query(
      'INSERT INTO turnos (cliente_id, tratamiento_id, fecha, hora, notas) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cliente_id, tratamiento_id, fecha, hora, notas || null]
    );
    
    // Obtener información completa del turno creado
    const turnoCompleto = await pool.query(`
      SELECT 
        t.*,
        c.nombre as cliente_nombre,
        c.telefono as cliente_telefono,
        tr.nombre as tratamiento_nombre
      FROM turnos t
      JOIN clientes c ON t.cliente_id = c.id
      JOIN tratamientos tr ON t.tratamiento_id = tr.id
      WHERE t.id = $1
    `, [result.rows[0].id]);
    
    const turno = turnoCompleto.rows[0];
    
    // Crear mensaje de WhatsApp
    const mensaje = `¡Hola ${turno.cliente_nombre}! 💇‍♀️

Tu turno ha sido confirmado:
📅 Fecha: ${new Date(turno.fecha).toLocaleDateString('es-AR')}
🕐 Hora: ${turno.hora}
💄 Servicio: ${turno.tratamiento_nombre}

¡Te esperamos en HairStyle! ✨`;

    res.status(201).json({
      ...result.rows[0],
      whatsappEnviado: true,
      mensaje: mensaje,
      cliente: turno.cliente_nombre,
      telefono: turno.cliente_telefono
    });
  } catch (error) {
    console.error('Error creando turno:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar estado del turno
router.patch('/turnos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const result = await pool.query(
      'UPDATE turnos SET estado = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [estado, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando turno:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar turno completo
router.put('/turnos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id, tratamiento_id, fecha, hora, notas, estado } = req.body;
    
    const result = await pool.query(
      'UPDATE turnos SET cliente_id = $1, tratamiento_id = $2, fecha = $3, hora = $4, notas = $5, estado = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [cliente_id, tratamiento_id, fecha, hora, notas, estado || 'pendiente', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando turno:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar turno
router.delete('/turnos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM turnos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    res.json({ message: 'Turno eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando turno:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ==================== PROMOCIONES ====================

router.get('/promociones', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM promociones WHERE activo = TRUE ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo promociones:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ==================== GALERIA ====================

router.get('/galeria', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM galeria WHERE activo = TRUE ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo galeria:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Galería con subcarpetas locales
router.get('/galeria/local', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const galeriaPath = path.join(__dirname, '../../client/public/fotos');
  const categorias = {
    'perfilado': { nombre: 'Perfilado', icon: '✂️' },
    'alisados y tratamientos': { nombre: 'Alisados y Tratamientos', icon: '💇‍♀️' },
    'facial': { nombre: 'Facial', icon: '✨' },
    'peinados': { nombre: 'Peinados', icon: '👰' },
    'pestañas': { nombre: 'Pestañas', icon: '🌟' },
    'productos': { nombre: 'Productos', icon: '💄' }
  };
  
  const galeria = [];
  
  for (const [carpeta, info] of Object.entries(categorias)) {
    const carpetaPath = path.join(galeriaPath, carpeta);
    
    if (fs.existsSync(carpetaPath)) {
      const archivos = fs.readdirSync(carpetaPath).filter(archivo => {
        const ext = path.extname(archivo).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
      
      const imagenes = archivos.map(archivo => ({
        url: `/fotos/${carpeta}/${archivo}`,
        nombre: archivo
      }));
      
      if (imagenes.length > 0) {
        galeria.push({
          categoria: carpeta,
          nombre: info.nombre,
          icon: info.icon,
          imagenes: imagenes
        });
      }
    }
  }
  
  res.json(galeria);
});

// ==================== LEGAJOS ====================

router.get('/legajos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.*,
        c.nombre as cliente_nombre,
        c.telefono as cliente_telefono
      FROM legajos l
      JOIN clientes c ON l.cliente_id = c.id
      WHERE l.activo = TRUE
      ORDER BY l.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo legajos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/legajos/cliente/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;
    const result = await pool.query(`
      SELECT * FROM legajos 
      WHERE cliente_id = $1 AND activo = TRUE 
      ORDER BY created_at DESC
    `, [clienteId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo legajos del cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/legajos', async (req, res) => {
  try {
    const { cliente_id, tratamiento, tipo, fecha, datos } = req.body;
    
    if (!cliente_id || !fecha || !datos) {
      return res.status(400).json({ error: 'Cliente, fecha y datos son requeridos' });
    }

    const result = await pool.query(
      'INSERT INTO legajos (cliente_id, tratamiento, tipo, fecha, datos) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cliente_id, tratamiento || 'Facial', tipo || 'facial', fecha, datos]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando legajo:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/legajos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        l.*,
        c.nombre as cliente_nombre,
        c.telefono as cliente_telefono,
        c.email as cliente_email
      FROM legajos l
      JOIN clientes c ON l.cliente_id = c.id
      WHERE l.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Legajo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo legajo:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.delete('/legajos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE legajos SET activo = FALSE WHERE id = $1', [id]);
    res.json({ message: 'Legajo eliminado' });
  } catch (error) {
    console.error('Error eliminando legajo:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;