import { Router } from 'express';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';
import {
  createTalla,
  getTallas,
  getTallaById,
  updateTalla,
  deleteTalla
} from '../controllers/TallaController';

const router = Router();

// Crear Talla
router.post('/',
  body('nombre')
    .isString().notEmpty().withMessage('El nombre de la talla es obligatorio')
    .isLength({ max: 30 }).withMessage('El nombre no puede superar los 30 caracteres'),
  body('id_tipo_talle')
    .isInt().withMessage('El ID del tipo de talle es obligatorio'),
  inputErrors,
  createTalla
);

// Obtener todas las tallas
router.get('/', getTallas);

// Obtener talla por ID
router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  getTallaById
);

// Actualizar talla por ID
router.put('/:id',
  param('id').isInt().withMessage('ID inválido'),
  body('nombre').optional().isString().isLength({ max: 30 }),
  body('id_tipo_talle').optional().isInt(),
  inputErrors,
  updateTalla
);

// Eliminar talla por ID
router.delete('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  deleteTalla
);

export default router;
