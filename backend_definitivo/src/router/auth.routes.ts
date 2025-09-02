import { Router } from 'express';
import { loginEmpleado, getCurrentUser } from '../controllers/LoguinController';

const router = Router();
router.post('/login', loginEmpleado);
router.get('/me', getCurrentUser);
export default router;
