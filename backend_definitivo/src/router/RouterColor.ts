import { Router } from 'express';
import {
  createColor,
  getColores,
  getColorById,
  updateColor,
  deleteColor
} from '../controllers/ColoresController';

import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

// Crear un color
router.post('/',
  body('nombre')
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage('Nombre es requerido y debe tener máximo 30 caracteres'),
  inputErrors,
  createColor
);

// Listar todos los colores
router.get('/', getColores);

// Obtener un color por id
router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  getColorById
);

// Actualizar un color
router.put('/:id',
  param('id').isInt().withMessage('ID inválido'),
  body('nombre')
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage('Nombre es requerido y debe tener máximo 30 caracteres'),
  inputErrors,
  updateColor
);

// Eliminar un color
router.delete('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  deleteColor
);

export default router;
