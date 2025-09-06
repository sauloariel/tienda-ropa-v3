import { Router } from 'express';
import { loginEmpleado, getCurrentUser, verifyToken } from '../controllers/LoguinController';

const router = Router();
router.post('/login', loginEmpleado);
router.get('/verify', verifyToken);
router.get('/me', getCurrentUser);
export default router;
