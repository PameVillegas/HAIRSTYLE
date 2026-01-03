import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './database.js';
import { enviarMensajeTurno, inicializarWhatsApp, getWhatsAppStatus } from './whatsapp.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del cliente en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/dist')));
}

// Inicializar WhatsApp al arrancar el servidor
console.log('🚀 Iniciando servidor...\n');
inicializarWhatsApp();

// Estado de WhatsApp
app.get('/api/whatsapp/status', (req, res) => {
  res.json(getWhatsAppStatus());
});

// Obtener todos los clientes
app.get('/api/clientes', (req, res) => {
  const clientes = db.prepare('SELECT * FROM clientes').all();
  res.json(clientes);
});

// Crear cliente
app.post('/api/clientes', (req, res) => {
  const { nombre, telefono, email } = req.body;
  const result = db.prepare('INSERT INTO clientes (nombre, telefono, email) VALUES (?, ?, ?)').run(nombre, telefono, email);
  res.json({ id: result.lastInsertRowid, nombre, telefono, email });
});

// Actualizar cliente
app.put('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, email } = req.body;
  db.prepare('UPDATE clientes SET nombre = ?, telefono = ?, email = ? WHERE id = ?').run(nombre, telefono, email, id);
  res.json({ success: true });
});

// Eliminar cliente
app.delete('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM clientes WHERE id = ?').run(id);
  res.json({ success: true });
});

// Obtener todos los turnos
app.get('/api/turnos', (req, res) => {
  const turnos = db.prepare(`
    SELECT t.*, c.nombre as cliente_nombre, c.telefono 
    FROM turnos t 
    JOIN clientes c ON t.cliente_id = c.id 
    ORDER BY t.fecha DESC, t.hora DESC
  `).all();
  res.json(turnos);
});

// Crear turno y enviar WhatsApp
app.post('/api/turnos', async (req, res) => {
  const { cliente_id, tratamiento, fecha, hora, notas } = req.body;
  
  const result = db.prepare('INSERT INTO turnos (cliente_id, tratamiento, fecha, hora, notas) VALUES (?, ?, ?, ?, ?)').run(cliente_id, tratamiento, fecha, hora, notas);
  
  const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(cliente_id);
  
  // Enviar WhatsApp
  const whatsappResult = await enviarMensajeTurno(
    cliente.telefono,
    cliente.nombre,
    tratamiento,
    fecha,
    hora
  );
  
  // Generar mensaje para mostrar en la app
  const mensaje = `Hola ${cliente.nombre}! 👋\n\nTu turno ha sido confirmado:\n\n📅 Fecha: ${fecha}\n⏰ Hora: ${hora}\n💆 Tratamiento: ${tratamiento}\n\n¡Te esperamos!`;
  
  res.json({ 
    id: result.lastInsertRowid, 
    whatsappEnviado: whatsappResult.success,
    mensaje: mensaje,
    cliente: cliente.nombre,
    telefono: cliente.telefono
  });
});

// Actualizar estado del turno
app.patch('/api/turnos/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  db.prepare('UPDATE turnos SET estado = ? WHERE id = ?').run(estado, id);
  res.json({ success: true });
});

// Eliminar turno
app.delete('/api/turnos/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM turnos WHERE id = ?').run(id);
  res.json({ success: true });
});

// Servir el frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`\n🌐 Para acceder desde otra computadora en la misma red:`);
  console.log(`   Usa la IP de esta computadora en el puerto ${PORT}`);
  console.log(`   Ejemplo: http://192.168.1.X:${PORT}\n`);
});
