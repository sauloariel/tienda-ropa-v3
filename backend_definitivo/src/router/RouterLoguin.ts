import { Router } from 'express';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';
import { createLoguin, getLoguines, getLoguinById, updateLoguin, deleteLoguin } from '../controllers/LoguinController';

const router = Router();

// Crear loguin
router.post('/',
  body('id_empleado').isInt().withMessage('ID de empleado inválido'),
  body('id_rol').isInt().withMessage('ID de rol inválido'),
  body('usuario').isString().notEmpty().withMessage('Usuario es obligatorio').isLength({ max: 20 }).withMessage('Usuario máximo 20 caracteres'),
  body('passwd').optional().isString().withMessage('Contraseña debe ser texto').isLength({ max: 500 }),
  body('password_provisoria').optional().isBoolean().withMessage('password_provisoria debe ser booleano'),
  body('fecha_cambio_pass').optional().isISO8601().toDate().withMessage('Fecha de cambio de contraseña inválida'),
  inputErrors,
  createLoguin
);

// Obtener todos los loguines
router.get('/', getLoguines);

// Obtener loguin por ID
router.get('/:id',
  param('id').isInt().withMessage('ID de loguin inválido'),
  inputErrors,
  getLoguinById
);

// Actualizar loguin por ID
router.put('/:id',
  param('id').isInt().withMessage('ID de loguin inválido'),
  body('id_empleado').optional().isInt().withMessage('ID de empleado inválido'),
  body('id_rol').optional().isInt().withMessage('ID de rol inválido'),
  body('usuario').optional().isString().isLength({ max: 20 }),
  body('passwd').optional().isString().isLength({ max: 500 }),
  body('password_provisoria').optional().isBoolean(),
  body('fecha_cambio_pass').optional().isISO8601().toDate(),
  inputErrors,
  updateLoguin
);

// Eliminar loguin por ID
router.delete('/:id',
  param('id').isInt().withMessage('ID de loguin inválido'),
  inputErrors,
  deleteLoguin
);

export default router;
