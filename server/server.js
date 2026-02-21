import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { initializeDatabase } from './database.js';

import systemRoutes from './routes/system.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import authRoutes from './routes/auth.routes.js';
import mainRoutes from './routes/main.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 Ruta de prueba
app.get('/test', (req, res) => {
  res.json({
    message: 'Servidor funcionando correctamente',
    timestamp: new Date()
  });
});

// 🔹 Rutas API
app.use('/', systemRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);

// 🔹 Producción: servir frontend
if (process.env.NODE_ENV === 'production') {

  app.get('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/dist/index.html'));
  });
}

// 🔹 Puerto (Render usa process.env.PORT)
const PORT = process.env.PORT || 3000;

// 🔹 Iniciar servidor
async function startServer() {

  try {
    await initializeDatabase();
    console.log('🐘 PostgreSQL conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }

  // ⚠️ EL SERVIDOR ARRANCA SIEMPRE (clave para Render)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });

}

startServer();