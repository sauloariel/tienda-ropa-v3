import { Router } from 'express';
import { body, param } from 'express-validator';
import { createTalla, getTallas, getTallaById,updateTalla, deleteTalla,
} from '../controllers/TallaController';
import { inputErrors } from '../middleware';

const router = Router();

// Crear talla
router.post(
  '/',
  body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
  body('id_tipo_talle').isInt().withMessage('ID de tipo talle inválido'),
  inputErrors,
  createTalla
);

// Obtener todas las tallas
router.get('/', getTallas);

// Obtener talla por ID
router.get(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  getTallaById
);

// Actualizar talla
router.put(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  body('nombre').optional().isString(),
  body('id_tipo_talle').optional().isInt(),
  inputErrors,
  updateTalla
);

// Eliminar talla
router.delete(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  deleteTalla
);

export default router;
