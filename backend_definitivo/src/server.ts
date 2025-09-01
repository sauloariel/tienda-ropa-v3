import express from 'express';
import cors from 'cors';
import db from './config/db';
import authRoutes from './router/auth.routes';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Rutas de autenticación
app.use('/auth', authRoutes);

(async () => {
  await db.authenticate();
  await db.sync();
  console.log('✅ DB is connected');
})();

export default app;   // <-- export default
