import { Router } from 'express';
import {
  createProducto, getProductos, getProductoById, updateProducto, deleteProducto, updateProductoStock,
  createCategoria, getCategorias, getCategoriaById, updateCategoria, deleteCategoria
} from '../controllers/ProductosController';

import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

// Crear producto
router.post('/',
  body('descripcion').isString().notEmpty().withMessage('La descripción es obligatoria'),
  body('id_proveedor').isInt().withMessage('El ID del proveedor debe ser un número'),
  body('id_categoria').isInt().withMessage('El ID de la categoría debe ser un número'),
  body('stock').isInt({ min: 0 }).withMessage('Stock inválido'),
  body('precio_venta').isDecimal().withMessage('El precio de venta debe ser un número decimal'),
  body('precio_compra').isDecimal().withMessage('El precio de compra debe ser un número decimal'),
  body('stock_seguridad').isInt().withMessage('Stock de seguridad inválido'),
  inputErrors,
  createProducto
);

// Obtener todos los productos
router.get('/', getProductos);

// Obtener un producto por ID
router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  getProductoById
);

// Actualizar producto
router.put('/:id',
  param('id').isInt().withMessage('ID inválido'),
  body('descripcion').optional().isString().notEmpty().withMessage('La descripción no puede estar vacía'),
  body('stock').optional().isInt().withMessage('Stock inválido'),
  body('precio_venta').optional().isDecimal().withMessage('Precio de venta inválido'),
  body('precio_compra').optional().isDecimal().withMessage('Precio de compra inválido'),
  body('stock_seguridad').optional().isInt().withMessage('Stock de seguridad inválido'),
  inputErrors,
  updateProducto
);

// Actualizar stock de producto
router.put('/:id/stock',
  param('id').isInt().withMessage('ID inválido'),
  body('cantidad_vendida').isInt({ min: 1 }).withMessage('Cantidad vendida debe ser mayor a 0'),
  inputErrors,
  updateProductoStock
);

// Eliminar producto
router.delete('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  deleteProducto
);

// ==================== RUTAS DE CATEGORÍAS ====================

// Crear categoría
router.post('/categorias',
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
router.get('/categorias', getCategorias);

// Obtener categoría por ID
router.get('/categorias/:id',
  param('id').isInt().withMessage('ID de categoría inválido'),
  inputErrors,
  getCategoriaById
);

// Actualizar categoría por ID
router.put('/categorias/:id',
  param('id').isInt().withMessage('ID de categoría inválido'),
  body('nombre_categoria').optional().isString().isLength({ max: 50 }),
  body('descripcion').optional().isString().isLength({ max: 50 }),
  body('estado').optional().isString().isLength({ max: 8 }),
  inputErrors,
  updateCategoria
);

// Eliminar categoría por ID
router.delete('/categorias/:id',
  param('id').isInt().withMessage('ID de categoría inválido'),
  inputErrors,
  deleteCategoria
);

export default router;
