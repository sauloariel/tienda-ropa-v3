import { Router } from 'express';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';
import {
  createEmpleado,
  getEmpleados,
  getEmpleadoById,
  updateEmpleado,
  deleteEmpleado
} from '../controllers/EmpleadosController';

const router = Router();

// Crear empleado
router.post('/',
  body('cuil').isLength({ min: 11, max: 11 }).withMessage('CUIL debe tener 11 caracteres'),
  body('nombre').isString().notEmpty().withMessage('Nombre requerido'),
  body('apellido').isString().notEmpty().withMessage('Apellido requerido'),
  body('domicilio').isString().notEmpty().withMessage('Domicilio requerido'),
  body('telefono').isString().notEmpty().withMessage('Teléfono requerido'),
  body('mail').isEmail().withMessage('Email inválido'),
  body('sueldo').optional().isDecimal().withMessage('Sueldo inválido'),
  body('puesto').optional().isString(),
  body('estado').optional().isString().isLength({ max: 8 }),
  inputErrors,
  createEmpleado
);

// Obtener todos los empleados
router.get('/', getEmpleados);

// Obtener empleado por ID
router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  getEmpleadoById
);

// Actualizar empleado por ID
router.put('/:id',
  param('id').isInt().withMessage('ID inválido'),
  body('cuil').optional().isLength({ min: 11, max: 11 }).withMessage('CUIL debe tener 11 caracteres'),
  body('nombre').optional().isString(),
  body('apellido').optional().isString(),
  body('domicilio').optional().isString(),
  body('telefono').optional().isString(),
  body('mail').optional().isEmail(),
  body('sueldo').optional().isDecimal(),
  body('puesto').optional().isString(),
  body('estado').optional().isString().isLength({ max: 8 }),
  inputErrors,
  updateEmpleado
);

// Eliminar empleado por ID
router.delete('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  deleteEmpleado
);

export default router;
