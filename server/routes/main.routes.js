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

// Obtener todos los tratamientos
router.get('/tratamientos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tratamientos WHERE activo = TRUE ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo tratamientos:', error);
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

export default router;