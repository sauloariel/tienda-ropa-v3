import express from 'express';
import cors from 'cors';
import db from './config/db';
import authRoutes from './router/auth.routes';
import empleadosRoutes from './router/RouterEmpleados';
import rolesRoutes from './router/RouterRoles';
import loguinRoutes from './router/RouterLoguin';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de empleados
app.use('/empleados', empleadosRoutes);

// Rutas de roles
app.use('/roles', rolesRoutes);

// Rutas de loguin (usuarios de login)
app.use('/loguin', loguinRoutes);

(async () => {
  await db.authenticate();
  await db.sync();
  console.log('✅ DB is connected');
})();

export default app;   // <-- export default
