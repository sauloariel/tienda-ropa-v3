import { Router } from 'express';
import {
    loginCliente,
    registerCliente,
    verifyClienteToken,
    logoutCliente,
    verifyEmail,
    resendVerificationEmail,
    solicitarRecuperacionPasswordCliente,
    verificarTokenRecuperacionCliente,
    cambiarPasswordConTokenCliente
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

// Rutas de recuperación de contraseña
router.post('/forgot-password', solicitarRecuperacionPasswordCliente);
router.get('/reset-password/:resetToken', verificarTokenRecuperacionCliente);
router.post('/reset-password', cambiarPasswordConTokenCliente);

export default router;







