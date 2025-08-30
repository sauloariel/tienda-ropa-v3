import { Router } from 'express';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';
import {
  loginEmpleado,
  verifyToken,
  logoutEmpleado,
  getCurrentUser,
  changePassword,
  solicitarRecuperacionPassword,
  verificarTokenRecuperacion,
  cambiarPasswordConToken
} from '../controllers/LoguinController';

const router = Router();

// ===== RUTAS DE AUTENTICACIÓN =====

// Login de empleado
router.post('/auth/login',
  body('usuario').isString().notEmpty().withMessage('Usuario es obligatorio'),
  body('password').isString().notEmpty().withMessage('Contraseña es obligatoria'),
  inputErrors,
  loginEmpleado
);

// Verificar token
router.get('/auth/verify', verifyToken);

// Logout
router.post('/auth/logout', logoutEmpleado);

// Obtener usuario actual
router.get('/auth/me', getCurrentUser);

// Cambiar contraseña (usuario autenticado)
router.put('/auth/change-password',
  body('password_actual').isString().notEmpty().withMessage('Contraseña actual es obligatoria'),
  body('password_nuevo').isString().notEmpty().withMessage('Nueva contraseña es obligatoria'),
  inputErrors,
  changePassword
);

// ===== RUTAS DE RECUPERACIÓN DE CONTRASEÑA =====

// Solicitar recuperación de contraseña
router.post('/auth/forgot-password',
  body('usuario').isString().notEmpty().withMessage('Usuario es obligatorio'),
  inputErrors,
  solicitarRecuperacionPassword
);

// Verificar token de recuperación
router.get('/auth/reset-password/:resetToken', verificarTokenRecuperacion);

// Cambiar contraseña con token de recuperación
router.post('/auth/reset-password',
  body('resetToken').isString().notEmpty().withMessage('Token de recuperación es obligatorio'),
  body('nuevaPassword').isString().notEmpty().withMessage('Nueva contraseña es obligatoria'),
  inputErrors,
  cambiarPasswordConToken
);

export default router;
