import { Router } from 'express';
import {
    loginCliente,
    registerCliente,
    verifyClienteToken,
    logoutCliente
} from '../controllers/ClientAuthController';

const router = Router();

// Rutas de autenticación para clientes
router.post('/login', loginCliente);
router.post('/register', registerCliente);
router.get('/verify', verifyClienteToken);
router.post('/logout', logoutCliente);

export default router;





