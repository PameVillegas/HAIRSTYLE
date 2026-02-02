import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeDatabase } from './database.js';
import systemRoutes from './routes/system.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';

// Inicializar la base de datos
initializeDatabase()
  .then(() => {
    console.log('Base de datos lista ✅');
  })
  .catch(err => {
    console.error('Error al inicializar la base de datos:', err);
  });

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente', timestamp: new Date() });
});

app.use('/', systemRoutes);
app.use('/api/appointments', appointmentRoutes);



// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  // Manejar rutas de la API que no existen
  app.get('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });
  
  // Todas las demás rutas las maneja el frontend (SPA)
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/dist/index.html'));
  });
}




// Inicializar servidor
async function startServer(port = 3000) {
  try {
    // Inicializar base de datos
    await initializeDatabase();
    console.log('✅ Base de datos inicializada');

    // Arrancar servidor
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Servidor corriendo en puerto ${port}`);
      console.log(`🌐 Accede en: http://localhost:${port}`);
    });

    // Manejar errores del servidor
    server.on('error', (err) => {
      console.error('❌ Error del servidor:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Arrancar servidor en puerto de Render o 3000
const PORT = process.env.PORT || 3000;
startServer(PORT);
