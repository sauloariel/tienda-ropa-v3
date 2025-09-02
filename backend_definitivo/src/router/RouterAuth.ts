import { Router } from 'express';
import { loginEmpleado, verifyToken } from '../controllers/LoguinController';

const router = Router();

// Ruta para login
router.post('/login', loginEmpleado);

// Ruta para verificar token
router.get('/verify', verifyToken);

export default router;

