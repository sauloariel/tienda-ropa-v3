import { Router } from 'express';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';
import { createRol, getRoles, getRolById, updateRol, deleteRol } from '../controllers/RolesController';

const router = Router();

// Crear un rol
router.post('/',
  body('descripcion')
    .isString().notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ max: 15 }).withMessage('La descripción no puede superar los 15 caracteres'),
  inputErrors,
  createRol
);

// Obtener todos los roles
router.get('/', getRoles);

// Obtener rol por ID
router.get('/:id',
  param('id').isInt().withMessage('ID del rol inválido'),
  inputErrors,
  getRolById
);

// Actualizar rol por ID
router.put('/:id',
  param('id').isInt().withMessage('ID del rol inválido'),
  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto')
    .isLength({ max: 15 }).withMessage('La descripción no puede superar los 15 caracteres'),
  inputErrors,
  updateRol
);

// Eliminar rol por ID (puede ser eliminación lógica o física según tu lógica)
router.delete('/:id',
  param('id').isInt().withMessage('ID del rol inválido'),
  inputErrors,
  deleteRol
);

export default router;
