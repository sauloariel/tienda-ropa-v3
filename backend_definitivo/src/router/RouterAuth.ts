import { Router } from 'express';
import {
    loginEmpleado,
    verifyToken,
    logoutEmpleado,
    getCurrentUser,
    changePassword
} from '../controllers/LoguinController';

const router = Router();

// Ruta para login
router.post('/login', loginEmpleado);

// Ruta para verificar token
router.get('/verify', verifyToken);

// Ruta para logout
router.post('/logout', logoutEmpleado);

// Ruta para obtener usuario actual
router.get('/me', getCurrentUser);

// Ruta para cambiar contraseña
router.put('/change-password', changePassword);

export default router;

