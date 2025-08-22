import { Router } from 'express';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';
import { createProveedor, getProveedores, getProveedorById, updateProveedor, deleteProveedor } from '../controllers/ProveedoresController';

const router = Router();

// Crear proveedor
router.post('/',
  body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 50 }).withMessage('El nombre no puede superar 50 caracteres'),
  body('contacto').isString().notEmpty().withMessage('El contacto es obligatorio').isLength({ max: 50 }).withMessage('El contacto no puede superar 50 caracteres'),
  body('direccion').isString().notEmpty().withMessage('La dirección es obligatoria').isLength({ max: 100 }).withMessage('La dirección no puede superar 100 caracteres'),
  body('telefono').isString().notEmpty().withMessage('El teléfono es obligatorio').isLength({ max: 20 }).withMessage('El teléfono no puede superar 20 caracteres'),
  inputErrors,
  createProveedor
);

// Obtener todos los proveedores
router.get('/', getProveedores);

// Obtener proveedor por ID
router.get('/:id',
  param('id').isInt().withMessage('ID del proveedor inválido'),
  inputErrors,
  getProveedorById
);

// Actualizar proveedor por ID
router.put('/:id',
  param('id').isInt().withMessage('ID del proveedor inválido'),
  body('nombre').optional().isString().withMessage('El nombre debe ser texto').isLength({ max: 50 }),
  body('contacto').optional().isString().withMessage('El contacto debe ser texto').isLength({ max: 50 }),
  body('direccion').optional().isString().withMessage('La dirección debe ser texto').isLength({ max: 100 }),
  body('telefono').optional().isString().withMessage('El teléfono debe ser texto').isLength({ max: 20 }),
  inputErrors,
  updateProveedor
);

// Eliminar proveedor por ID (puede ser eliminación lógica o física)
router.delete('/:id',
  param('id').isInt().withMessage('ID del proveedor inválido'),
  inputErrors,
  deleteProveedor
);

export default router;
