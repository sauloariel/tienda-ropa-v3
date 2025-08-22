import { Router } from 'express';
import { createPedido, getPedidos,  getPedidoById, anularPedido
} from '../controllers/PedidosController';

import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

// Crear pedido con detalle
router.post('/',
  body('id_cliente').isInt().withMessage('ID del cliente inválido'),
  body('id_empleados').isInt().withMessage('ID del empleado inválido'),
  body('payment_id').optional().isString().withMessage('El payment_id debe ser un string'),
  body('detalle').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto en el detalle'),
  body('detalle.*.id_producto').isInt().withMessage('ID de producto inválido'),
  body('detalle.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad inválida'),
  body('detalle.*.precio_venta').isDecimal().withMessage('Precio de venta inválido'),
  inputErrors,
  createPedido
);

// Obtener todos los pedidos
router.get('/', getPedidos);

// Obtener pedido por ID
router.get('/:id',
  param('id').isInt().withMessage('ID del pedido inválido'),
  inputErrors,
  getPedidoById
);

// Anular pedido (eliminación lógica)
router.put('/anular/:id',
  param('id').isInt().withMessage('ID del pedido inválido'),
  inputErrors,
  anularPedido
);

export default router;
