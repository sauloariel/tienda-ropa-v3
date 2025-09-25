import { Router } from 'express';
import {
    createPedido,
    getPedidos,
    getPedidoById,
    cambiarEstadoPedido,
    anularPedido,
    syncPedidos,
    getEstadisticasPedidos,
    getPedidoByNumber,
    getPedidosByPhone,
    getPedidosByEmail,
    getPedidosByCliente,
    getHistorialPedido
} from '../controllers/PedidosUnificadoController';

import { body, param, query } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

// Crear pedido (web o panel administrativo)
router.post('/',
    [
        body('id_cliente').isInt().withMessage('ID del cliente inválido'),
        body('importe').isDecimal().withMessage('Importe inválido'),
        body('productos').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
        body('productos.*.id_producto').isInt().withMessage('ID de producto inválido'),
        body('productos.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0'),
        body('productos.*.precio_venta').isDecimal().withMessage('Precio de venta inválido'),
        body('productos.*.descuento').optional().isDecimal().withMessage('Descuento inválido'),
        body('id_empleados').optional().isInt().withMessage('ID del empleado inválido'),
        body('fecha_pedido').optional().isISO8601().withMessage('Fecha de pedido inválida'),
        body('estado').optional().isString().withMessage('Estado inválido'),
        body('payment_id').optional().isString().withMessage('Payment ID inválido'),
        body('venta_web').optional().isBoolean().withMessage('Venta web debe ser booleano'),
        inputErrors
    ],
    createPedido
);

// Obtener todos los pedidos con filtros opcionales
router.get('/',
    [
        query('venta_web').optional().isBoolean().withMessage('Venta web debe ser booleano'),
        query('estado').optional().isString().withMessage('Estado inválido'),
        query('cliente_id').optional().isInt().withMessage('ID del cliente inválido'),
        inputErrors
    ],
    getPedidos
);

// Obtener estadísticas de pedidos
router.get('/estadisticas',
    [
        query('fecha_inicio').optional().isISO8601().withMessage('Fecha de inicio inválida'),
        query('fecha_fin').optional().isISO8601().withMessage('Fecha de fin inválida'),
        inputErrors
    ],
    getEstadisticasPedidos
);

// Obtener pedido por ID
router.get('/:id',
    [
        param('id').isInt().withMessage('ID inválido'),
        inputErrors
    ],
    getPedidoById
);

// Cambiar estado del pedido
router.put('/:id/estado',
    [
        param('id').isInt().withMessage('ID inválido'),
        body('estado').isIn(['pendiente', 'procesando', 'completado', 'entregado', 'cancelado', 'anulado'])
            .withMessage('Estado inválido. Estados permitidos: pendiente, procesando, completado, entregado, cancelado, anulado'),
        inputErrors
    ],
    cambiarEstadoPedido
);

// Anular pedido
router.put('/:id/anular',
    [
        param('id').isInt().withMessage('ID inválido'),
        inputErrors
    ],
    anularPedido
);

// Sincronizar múltiples pedidos
router.post('/sync',
    [
        body('pedidos').isArray({ min: 1 }).withMessage('Debe incluir al menos un pedido'),
        body('pedidos.*.id_cliente').isInt().withMessage('ID del cliente inválido'),
        body('pedidos.*.importe').isDecimal().withMessage('Importe inválido'),
        body('pedidos.*.productos').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
        body('pedidos.*.fecha_pedido').optional().isISO8601().withMessage('Fecha de pedido inválida'),
        body('pedidos.*.payment_id').optional().isString().withMessage('Payment ID inválido'),
        inputErrors
    ],
    syncPedidos
);

// Seguimiento de pedidos - Buscar por número de pedido
router.get('/seguimiento/:numeroPedido',
    [
        param('numeroPedido').isString().withMessage('Número de pedido inválido'),
        inputErrors
    ],
    getPedidoByNumber
);

// Seguimiento de pedidos - Buscar por teléfono
router.get('/seguimiento/telefono/:telefono',
    [
        param('telefono').isString().withMessage('Teléfono inválido'),
        inputErrors
    ],
    getPedidosByPhone
);

// Seguimiento de pedidos - Buscar por email
router.get('/seguimiento/email/:email',
    [
        param('email').isEmail().withMessage('Email inválido'),
        inputErrors
    ],
    getPedidosByEmail
);

// Obtener pedidos de un cliente específico
router.get('/cliente/:clienteId',
    [
        param('clienteId').isInt().withMessage('ID del cliente inválido'),
        query('estado').optional().isString().withMessage('Estado inválido'),
        query('fecha_inicio').optional().isISO8601().withMessage('Fecha de inicio inválida'),
        query('fecha_fin').optional().isISO8601().withMessage('Fecha de fin inválida'),
        inputErrors
    ],
    getPedidosByCliente
);

// Obtener historial de estados de un pedido
router.get('/:id/historial',
    [
        param('id').isInt().withMessage('ID inválido'),
        inputErrors
    ],
    getHistorialPedido
);

export default router;

