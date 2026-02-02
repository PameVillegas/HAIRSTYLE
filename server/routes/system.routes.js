import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Ruta de estado del servidor - v3
router.get('/status', (req, res) => {
  res.json({ 
    message: '✅ Servidor funcionando y base de datos lista!',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0'
  });
});

// En producción, servir el frontend React
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos
  router.use(express.static(join(__dirname, '../../client/dist')));
  
  // Ruta principal - servir el frontend
  router.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../../client/dist/index.html'));
  });
} else {
  // En desarrollo, mostrar mensaje de estado
  router.get('/', (req, res) => {
    res.send('✅ Servidor funcionando y base de datos lista! (Modo desarrollo)');
  });
}

export default router;
