import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { initializeDatabase } from './database.js';
import appointmentRoutes from './routes/appointments.routes.js';
import authRoutes from './routes/auth.routes.js';
import mainRoutes from './routes/main.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ extended: true, limit: '10mb' }));

let clientDistPath, clientPublicPath;

if (process.env.VERCEL) {
  clientDistPath = join(__dirname, '../client/dist');
  clientPublicPath = join(__dirname, '../client/public');
} else {
  clientDistPath = join(__dirname, '../client/dist');
  clientPublicPath = join(__dirname, '../client/public');
}

app.use(express.static(clientDistPath));
app.use('/fotos', express.static(clientPublicPath));

// Servir páginas HTML explícitamente
app.get('/entrar.html', (req, res) => {
  res.sendFile(join(clientDistPath, 'entrar.html'));
});
app.get('/panel.html', (req, res) => {
  res.sendFile(join(clientDistPath, 'panel.html'));
});
app.get('/admin.html', (req, res) => {
  res.sendFile(join(clientDistPath, 'admin.html'));
});
app.get('/cliente.html', (req, res) => {
  res.sendFile(join(clientDistPath, 'cliente.html'));
});
app.get('/cliente.html', (req, res) => {
  res.sendFile(join(clientDistPath, 'cliente.html'));
});
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);

app.get('*', (req, res) => {
  res.sendFile(join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();
    console.log('PostgreSQL conectado');
  } catch (error) {
    console.error('Advertencia: DB no conectada -', error.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server on port ${PORT}`);
  });
}

startServer();