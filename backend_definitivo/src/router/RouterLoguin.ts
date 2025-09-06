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
import {
  getLoguinUsers,
  getLoguinUserById,
  getLoguinUserByEmpleado,
  createLoguinUser,
  updateLoguinUser,
  deleteLoguinUser
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

// ===== RUTAS CRUD PARA GESTIONAR USUARIOS DE LOGIN =====

// Obtener todos los usuarios de login
router.get('/', getLoguinUsers);

// Obtener usuario de login por ID
router.get('/:id',
  param('id').isInt().withMessage('ID debe ser un número entero'),
  inputErrors,
  getLoguinUserById
);

// Obtener usuario de login por empleado
router.get('/empleado/:id_empleado',
  param('id_empleado').isInt().withMessage('ID empleado debe ser un número entero'),
  inputErrors,
  getLoguinUserByEmpleado
);

// Crear usuario de login
router.post('/',
  body('usuario').isString().notEmpty().withMessage('Usuario es obligatorio'),
  body('password').isString().notEmpty().withMessage('Contraseña es obligatoria'),
  body('id_empleado').isInt().withMessage('ID empleado debe ser un número entero'),
  body('id_rol').isInt().withMessage('ID rol debe ser un número entero'),
  inputErrors,
  createLoguinUser
);

// Actualizar usuario de login
router.put('/:id',
  param('id').isInt().withMessage('ID debe ser un número entero'),
  body('usuario').optional().isString().notEmpty().withMessage('Usuario debe ser una cadena no vacía'),
  body('password').optional().isString().notEmpty().withMessage('Contraseña debe ser una cadena no vacía'),
  body('id_rol').optional().isInt().withMessage('ID rol debe ser un número entero'),
  inputErrors,
  updateLoguinUser
);

// Eliminar usuario de login
router.delete('/:id',
  param('id').isInt().withMessage('ID debe ser un número entero'),
  inputErrors,
  deleteLoguinUser
);

export default router;
