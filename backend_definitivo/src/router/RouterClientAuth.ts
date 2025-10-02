import { Router } from 'express';
import {
    loginCliente,
    registerCliente,
    verifyClienteToken,
    logoutCliente,
    verifyEmail,
    resendVerificationEmail
} from '../controllers/ClientAuthController';

const router = Router();

// Rutas de autenticación para clientes
router.post('/login', loginCliente);
router.post('/register', registerCliente);
router.post('/verify', verifyClienteToken);
router.post('/logout', logoutCliente);

// Rutas de verificación de email
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

export default router;







