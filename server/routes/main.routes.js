import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// ==================== CLIENTES ====================

// Obtener todos los clientes
router.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, COALESCE(username, '') as username, nombre, telefono, email, activo, created_at 
      FROM clientes 
      WHERE activo = TRUE 
      ORDER BY nombre
    `);
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
    const { nombre, precio, duracion, descripcion, imagen_url, activo } = req.body;
    const result = await pool.query(
      'UPDATE tratamientos SET nombre = $1, precio = $2, duracion = $3, descripcion = $4, imagen_url = $5, activo = COALESCE($6, activo), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [nombre, precio, duracion, descripcion, imagen_url, activo, id]
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

router.get('/cliente/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        t.id,
        t.fecha,
        t.hora,
        t.estado,
        t.notas,
        tr.nombre as tratamiento,
        tr.precio as tratamiento_precio
      FROM turnos t
      JOIN tratamientos tr ON t.tratamiento_id = tr.id
      WHERE t.cliente_id = $1
      ORDER BY t.fecha DESC, t.hora DESC
    `, [id]);
    
    res.json({ success: true, turnos: result.rows });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, turnos: [] });
  }
});

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

// Obtener horarios ocupados para una fecha específica
router.get('/turnos/fecha/:fecha', async (req, res) => {
  try {
    const { fecha } = req.params;
    const result = await pool.query(`
      SELECT 
        t.hora,
        tr.duracion as tratamiento_duracion,
        tr.nombre as tratamiento_nombre,
        c.nombre as cliente_nombre
      FROM turnos t
      JOIN tratamientos tr ON t.tratamiento_id = tr.id
      JOIN clientes c ON t.cliente_id = c.id
      WHERE t.fecha = $1 AND t.estado != 'cancelado'
      ORDER BY t.hora
    `, [fecha]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo horarios ocupados:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear nuevo turno
router.post('/turnos', async (req, res) => {
  try {
    const { cliente_id, tratamiento_id, fecha, hora, notas, precio, duracion } = req.body;
    
    if (!cliente_id || !tratamiento_id || !fecha || !hora) {
      return res.status(400).json({ error: 'Cliente, tratamiento, fecha y hora son requeridos' });
    }

    // Obtener la duración del tratamiento
    const tratResult = await pool.query('SELECT nombre, duracion FROM tratamientos WHERE id = $1', [tratamiento_id]);
    if (tratResult.rows.length === 0) {
      return res.status(400).json({ error: 'Tratamiento no encontrado' });
    }
    
    // Verificar que no haya conflicto de horarios (solo mismo horario)
    const existentes = await pool.query(`
      SELECT t.id, t.hora
      FROM turnos t
      WHERE t.fecha = $1 AND t.hora = $2 AND t.estado != 'cancelado'
    `, [fecha, hora]);
    
    if (existentes.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Ya hay un turno agendado a esa hora.'
      });
    }

    // Si hay precio especial (alisado por cm), actualizar las notas
    var notasFinales = notas || null;
    if (precio) {
      notasFinales = (notas || '') + ' [PRECIO ESPECIAL: $' + precio + ']';
    }

    const result = await pool.query(
      'INSERT INTO turnos (cliente_id, tratamiento_id, fecha, hora, notas) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cliente_id, tratamiento_id, fecha, hora, notasFinales]
    );
    
    // Obtener información completa del turno creado
    const turnoCompleto = await pool.query(`
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

// Actualizar turno (estado, fecha, hora)
router.patch('/turnos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, fecha, hora } = req.body;
    
    let query = 'UPDATE turnos SET updated_at = CURRENT_TIMESTAMP';
    let params = [];
    let paramIndex = 1;
    
    if (estado) {
      query += ', estado = $' + paramIndex;
      params.push(estado);
      paramIndex++;
    }
    if (fecha) {
      query += ', fecha = $' + paramIndex;
      params.push(fecha);
      paramIndex++;
    }
    if (hora) {
      query += ', hora = $' + paramIndex;
      params.push(hora);
      paramIndex++;
    }
    
    query += ' WHERE id = $' + paramIndex + ' RETURNING *';
    params.push(id);
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    res.json({ success: true, turno: result.rows[0] });
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
    console.error('Error getting galeria:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Agregar foto a galería
router.post('/galeria', async (req, res) => {
  try {
    const { categoria, nombre, imagen_url } = req.body;
    
    const titulo = nombre || req.body.titulo;
    const url = imagen_url || req.body.url;
    
    if (!categoria || !titulo || !url) {
      return res.status(400).json({ error: 'Categoría, título e imagen son requeridos' });
    }
    
    const result = await pool.query(
      'INSERT INTO galeria (titulo, categoria, imagen_url, activo) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, categoria, url, true]
    );
    
    res.status(201).json({
      success: true,
      message: 'Foto agregada a galería',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding to galeria:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar foto de galería
router.delete('/galeria/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE galeria SET activo = FALSE WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foto no encontrada' });
    }
    
    res.json({ success: true, message: 'Foto eliminada' });
  } catch (error) {
    console.error('Error deleting from galeria:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Galería combinada: base de datos + locales
router.get('/galeria/local', async (req, res) => {
  // Obtener fotos de la base de datos
  let fotosDB = [];
  try {
    const result = await pool.query(
      'SELECT categoria, titulo as nombre, imagen_url as url FROM galeria WHERE activo = TRUE ORDER BY categoria, titulo'
    );
    fotosDB = result.rows;
  } catch(e) {
    console.log('No hay fotos en BD');
  }
  
  // Agrupar fotos de BD por categoría
  const categoriasDB = {};
  fotosDB.forEach(f => {
    if (!categoriasDB[f.categoria]) {
      categoriasDB[f.categoria] = {
        categoria: f.categoria,
        nombre: f.categoria.charAt(0).toUpperCase() + f.categoria.slice(1),
        icon: '📷',
        imagenes: []
      };
    }
    categoriasDB[f.categoria].imagenes.push({
      url: f.imagen_url,
      nombre: f.nombre
    });
  });
  
  // Fotos locales hardcodeadas
  const galeriaLocal = [
    {
      categoria: 'perfilado',
      nombre: 'Perfilado',
      icon: '✂️',
      imagenes: [
        { url: '/fotos/perfilado/IMG-20260325-WA0019.jpg', nombre: 'IMG-20260325-WA0019.jpg' },
        { url: '/fotos/perfilado/IMG-20260325-WA0021.jpg', nombre: 'IMG-20260325-WA0021.jpg' },
        { url: '/fotos/perfilado/IMG-20260325-WA0034.jpg', nombre: 'IMG-20260325-WA0034.jpg' },
        { url: '/fotos/perfilado/IMG-20260325-WA0038.jpg', nombre: 'IMG-20260325-WA0038.jpg' },
        { url: '/fotos/perfilado/IMG-20260325-WA0039.jpg', nombre: 'IMG-20260325-WA0039.jpg' },
        { url: '/fotos/perfilado/IMG-20260325-WA0046.jpg', nombre: 'IMG-20260325-WA0046.jpg' },
        { url: '/fotos/perfilado/IMG-20260325-WA0059.jpg', nombre: 'IMG-20260325-WA0059.jpg' },
        { url: '/fotos/perfilado/IMG-20260325-WA0063.jpg', nombre: 'IMG-20260325-WA0063.jpg' }
      ]
    },
    {
      categoria: 'alisados y tratamientos',
      nombre: 'Alisados y Tratamientos',
      icon: '💇‍♀️',
      imagenes: [
        { url: '/fotos/alisados y tratamientos/IMG-20260325-WA0028.jpg', nombre: 'IMG-20260325-WA0028.jpg' },
        { url: '/fotos/alisados y tratamientos/IMG-20260325-WA0032.jpg', nombre: 'IMG-20260325-WA0032.jpg' },
        { url: '/fotos/alisados y tratamientos/IMG-20260325-WA0035.jpg', nombre: 'IMG-20260325-WA0035.jpg' },
        { url: '/fotos/alisados y tratamientos/IMG-20260325-WA0042.jpg', nombre: 'IMG-20260325-WA0042.jpg' },
        { url: '/fotos/alisados y tratamientos/IMG-20260325-WA0050.jpg', nombre: 'IMG-20260325-WA0050.jpg' },
        { url: '/fotos/alisados y tratamientos/IMG-20260325-WA0051.jpg', nombre: 'IMG-20260325-WA0051.jpg' },
        { url: '/fotos/alisados y tratamientos/IMG-20260325-WA0052.jpg', nombre: 'IMG-20260325-WA0052.jpg' },
        { url: '/fotos/alisados y tratamientos/IMG-20260325-WA0056.jpg', nombre: 'IMG-20260325-WA0056.jpg' },
        { url: '/fotos/alisados y tratamientos/IMG-20260325-WA0060.jpg', nombre: 'IMG-20260325-WA0060.jpg' }
      ]
    },
    {
      categoria: 'peinados',
      nombre: 'Peinados',
      icon: '👰',
      imagenes: [
        { url: '/fotos/peinados/IMG-20260325-WA0023.jpg', nombre: 'IMG-20260325-WA0023.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0025.jpg', nombre: 'IMG-20260325-WA0025.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0027.jpg', nombre: 'IMG-20260325-WA0027.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0031.jpg', nombre: 'IMG-20260325-WA0031.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0033.jpg', nombre: 'IMG-20260325-WA0033.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0044.jpg', nombre: 'IMG-20260325-WA0044.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0045.jpg', nombre: 'IMG-20260325-WA0045.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0048.jpg', nombre: 'IMG-20260325-WA0048.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0049.jpg', nombre: 'IMG-20260325-WA0049.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0053.jpg', nombre: 'IMG-20260325-WA0053.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0055.jpg', nombre: 'IMG-20260325-WA0055.jpg' },
        { url: '/fotos/peinados/IMG-20260325-WA0064.jpg', nombre: 'IMG-20260325-WA0064.jpg' }
      ]
    },
    {
      categoria: 'facial',
      nombre: 'Facial',
      icon: '✨',
      imagenes: [
        { url: '/fotos/facial/IMG-20260325-WA0022.jpg', nombre: 'IMG-20260325-WA0022.jpg' },
        { url: '/fotos/facial/IMG-20260325-WA0030.jpg', nombre: 'IMG-20260325-WA0030.jpg' },
        { url: '/fotos/facial/IMG-20260325-WA0040.jpg', nombre: 'IMG-20260325-WA0040.jpg' },
        { url: '/fotos/facial/IMG-20260325-WA0041.jpg', nombre: 'IMG-20260325-WA0041.jpg' }
      ]
    },
    {
      categoria: 'pestañas',
      nombre: 'Pestañas',
      icon: '🌟',
      imagenes: [
        { url: '/fotos/pestañas/IMG-20260325-WA0024.jpg', nombre: 'IMG-20260325-WA0024.jpg' },
        { url: '/fotos/pestañas/IMG-20260325-WA0029.jpg', nombre: 'IMG-20260325-WA0029.jpg' },
        { url: '/fotos/pestañas/IMG-20260325-WA0036.jpg', nombre: 'IMG-20260325-WA0036.jpg' },
        { url: '/fotos/pestañas/IMG-20260325-WA0047.jpg', nombre: 'IMG-20260325-WA0047.jpg' },
        { url: '/fotos/pestañas/IMG-20260325-WA0054.jpg', nombre: 'IMG-20260325-WA0054.jpg' },
        { url: '/fotos/pestañas/IMG-20260325-WA0057.jpg', nombre: 'IMG-20260325-WA0057.jpg' },
        { url: '/fotos/pestañas/IMG-20260325-WA0058.jpg', nombre: 'IMG-20260325-WA0058.jpg' },
        { url: '/fotos/pestañas/IMG-20260325-WA0061.jpg', nombre: 'IMG-20260325-WA0061.jpg' }
      ]
    },
    {
      categoria: 'productos',
      nombre: 'Productos',
      icon: '💄',
      imagenes: [
        { url: '/fotos/productos/IMG-20260325-WA0020.jpg', nombre: 'IMG-20260325-WA0020.jpg' },
        { url: '/fotos/productos/IMG-20260325-WA0026.jpg', nombre: 'IMG-20260325-WA0026.jpg' },
        { url: '/fotos/productos/IMG-20260325-WA0037.jpg', nombre: 'IMG-20260325-WA0037.jpg' }
      ]
    }
  ];
  
  // Combinar fotos de BD con fotos locales
  Object.keys(categoriasDB).forEach(cat => {
    if (!galeriaLocal.find(g => g.categoria === cat)) {
      galeriaLocal.push(categoriasDB[cat]);
    } else {
      // Agregar fotos de BD a categoría existente
      var catLocal = galeriaLocal.find(g => g.categoria === cat);
      categoriasDB[cat].imagenes.forEach(img => {
        catLocal.imagenes.push(img);
      });
    }
  });
  
  res.json(galeriaLocal);
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

// Actualizar imagen de tratamiento
router.patch('/tratamientos/:id/imagen', async (req, res) => {
  try {
    const { id } = req.params;
    const { imagen_url } = req.body;
    
    const result = await pool.query(
      'UPDATE tratamientos SET imagen_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [imagen_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tratamiento no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando imagen:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ==================== TESTIMONIOS ====================

// Obtener testimonios aprobados
router.get('/testimonios', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.nombre as cliente_nombre
      FROM testimonios t
      JOIN clientes c ON t.cliente_id = c.id
      WHERE t.aprobado = TRUE AND t.activo = TRUE
      ORDER BY t.created_at DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo testimonios:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear testimonio (cliente)
router.post('/testimonios', async (req, res) => {
  try {
    const { cliente_id, texto, calificacion } = req.body;
    
    if (!texto || texto.trim().length < 10) {
      return res.status(400).json({ error: 'El testimonio debe tener al menos 10 caracteres' });
    }
    
    const result = await pool.query(
      'INSERT INTO testimonios (cliente_id, texto, calificacion) VALUES ($1, $2, $3) RETURNING *',
      [cliente_id, texto.trim(), calificacion || 5]
    );
    
    res.json({ success: true, message: '¡Gracias por tu opinión! Tu testimonio será revisado.', testimonio: result.rows[0] });
  } catch (error) {
    console.error('Error creando testimonio:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener todos los testimonios (admin)
router.get('/testimonios/todos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.nombre as cliente_nombre
      FROM testimonios t
      JOIN clientes c ON t.cliente_id = c.id
      WHERE t.activo = TRUE
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo testimonios:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Aprobar/rechazar testimonio (admin)
router.patch('/testimonios/:id/aprobar', async (req, res) => {
  try {
    const { id } = req.params;
    const { aprobado } = req.body;
    
    const result = await pool.query(
      'UPDATE testimonios SET aprobado = $1 WHERE id = $2 RETURNING *',
      [aprobado, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonio no encontrado' });
    }
    
    res.json({ success: true, testimonio: result.rows[0] });
  } catch (error) {
    console.error('Error aprobando testimonio:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar testimonio (admin)
router.delete('/testimonios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE testimonios SET activo = FALSE WHERE id = $1', [id]);
    res.json({ success: true, message: 'Testimonio eliminado' });
  } catch (error) {
    console.error('Error eliminando testimonio:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ==================== HORARIOS BLOQUEADOS ====================

// Obtener horarios bloqueados
router.get('/horarios-bloqueados', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM horarios_bloqueados WHERE activo = TRUE ORDER BY fecha, hora'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo horarios bloqueados:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Bloquear horario
router.post('/horarios-bloqueados', async (req, res) => {
  try {
    const { fecha, hora, motivo } = req.body;
    
    if (!fecha) {
      return res.status(400).json({ error: 'Fecha es requerida' });
    }
    
    const result = await pool.query(
      'INSERT INTO horarios_bloqueados (fecha, hora, motivo) VALUES ($1, $2, $3) RETURNING *',
      [fecha, hora || null, motivo || null]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error bloqueando horario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Desbloquear horario
router.delete('/horarios-bloqueados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'UPDATE horarios_bloqueados SET activo = FALSE WHERE id = $1',
      [id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error desbloqueando:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Verificar si un horario está bloqueado
router.get('/horario-bloqueado/:fecha/:hora', async (req, res) => {
  try {
    const { fecha, hora } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM horarios_bloqueados WHERE fecha = $1 AND hora = $2 AND activo = TRUE',
      [fecha, hora]
    );
    
    res.json({ bloqueado: result.rows.length > 0, data: result.rows[0] });
  } catch (error) {
    res.json({ bloqueado: false });
  }
});

export default router;