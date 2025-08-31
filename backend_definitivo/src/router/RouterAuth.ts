import { Router } from 'express';
import { login, verifyToken } from '../controllers/AuthController';

const router = Router();

// Ruta para login
router.post('/login', login);

// Ruta para verificar token
router.get('/verify', verifyToken);

export default router;

