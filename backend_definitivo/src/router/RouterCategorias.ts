import { Router } from 'express';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';
import {createCategoria,getCategorias,getCategoriaById,updateCategoria,deleteCategoria,
} from '../controllers/CategoriaController';

const router = Router();

// Crear categoría
router.post('/',
  body('nombre_categoria')
    .isString().notEmpty().withMessage('El nombre de la categoría es obligatorio')
    .isLength({ max: 50 }).withMessage('El nombre no puede superar 50 caracteres'),
  body('descripcion')
    .isString().notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ max: 50 }).withMessage('La descripción no puede superar 50 caracteres'),
  body('estado')
    .optional()
    .isString().isLength({ max: 8 }).withMessage('El estado no puede superar 8 caracteres'),
  inputErrors,
  createCategoria
);

// Obtener todas las categorías
router.get('/', getCategorias);

// Obtener categoría por ID
router.get('/:id',
  param('id').isInt().withMessage('ID de categoría inválido'),
  inputErrors,
  getCategoriaById
);

// Actualizar categoría por ID
router.put('/:id',
  param('id').isInt().withMessage('ID de categoría inválido'),
  body('nombre_categoria').optional().isString().isLength({ max: 50 }),
  body('descripcion').optional().isString().isLength({ max: 50 }),
  body('estado').optional().isString().isLength({ max: 8 }),
  inputErrors,
  updateCategoria
);

// Eliminar categoría por ID
router.delete('/:id',
  param('id').isInt().withMessage('ID de categoría inválido'),
  inputErrors,
  deleteCategoria
);

export default router;
