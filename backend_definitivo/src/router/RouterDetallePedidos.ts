import { Router } from 'express';
import {
  createDetallePedido,
  getDetallePedidos,
  getDetallePedidoById,
  updateDetallePedido,
  deleteDetallePedido
} from '../controllers/DetallePedidosController';

import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

// Crear detalle pedido
router.post('/',
  body('id_pedido').isInt({ gt: 0 }).withMessage('id_pedido inválido'),
  body('id_producto').isInt({ gt: 0 }).withMessage('id_producto inválido'),
  body('precio_venta').isDecimal({ decimal_digits: '0,2' }).withMessage('precio_venta inválido'),
  body('cantidad').isInt({ gt: 0 }).withMessage('cantidad inválida'),
  body('descuento').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('descuento inválido'),
  inputErrors,
  createDetallePedido
);

// Listar todos los detalles pedidos
router.get('/', getDetallePedidos);

// Obtener detalle pedido por id (usamos id compuesto? Si no, supongamos que usas un PK 'id' aparte)
router.get('/:id',
  param('id').isInt({ gt: 0 }).withMessage('ID inválido'),
  inputErrors,
  getDetallePedidoById
);

// Actualizar detalle pedido
router.put('/:id',
  param('id').isInt({ gt: 0 }).withMessage('ID inválido'),
  body('id_pedido').isInt({ gt: 0 }).withMessage('id_pedido inválido'),
  body('id_producto').isInt({ gt: 0 }).withMessage('id_producto inválido'),
  body('precio_venta').isDecimal({ decimal_digits: '0,2' }).withMessage('precio_venta inválido'),
  body('cantidad').isInt({ gt: 0 }).withMessage('cantidad inválida'),
  body('descuento').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('descuento inválido'),
  inputErrors,
  updateDetallePedido
);

// Eliminar detalle pedido
router.delete('/:id',
  param('id').isInt({ gt: 0 }).withMessage('ID inválido'),
  inputErrors,
  deleteDetallePedido
);

export default router;
