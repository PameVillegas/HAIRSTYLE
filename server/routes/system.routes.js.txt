import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('✅ Servidor funcionando y base de datos lista!');
});

export default router;
