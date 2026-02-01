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
app.use('/', systemRoutes);
app.use('/api/appointments', appointmentRoutes);



// Servir frontend en producción (opcional)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/dist')));
}




// Inicializar servidor
async function startServer(port = 3000) {
  try {
    // Inicializar base de datos
    await initializeDatabase();
    console.log('✅ Base de datos inicializada');

    // Intentar arrancar en el puerto indicado
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Servidor corriendo en http://localhost:${port}`);
    });

    // Manejar error de puerto ocupado
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠ Puerto ${port} ocupado. Probando puerto ${port + 1}...`);
        startServer(port + 1); // intenta con el siguiente puerto
      } else {
        console.error('❌ Error al iniciar el servidor:', err);
      }
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Arrancar servidor en puerto 3000
startServer();
