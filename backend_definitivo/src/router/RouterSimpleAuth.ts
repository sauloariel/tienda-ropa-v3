import { Router } from 'express';
import { simpleLogin } from '../controllers/SimpleAuthController';

const router = Router();

// Login simplificado
router.post('/simple-login', simpleLogin);

export default router;


















