import { Router } from 'express';
import {createProducto,getProductos, getProductoById, updateProducto, deleteProducto
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

// Eliminar producto
router.delete('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  deleteProducto
);

export default router;
