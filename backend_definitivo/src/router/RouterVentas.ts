import { Router } from 'express';
import {
    createVenta,
    getVentas,
    getVentaById,
    getEstadisticasVentas,
    anularVenta
} from '../controllers/VentasController';

import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

// Crear nueva venta
router.post('/',
    body('total').isDecimal().withMessage('El total debe ser un número decimal'),
    body('metodo_pago').isString().notEmpty().withMessage('El método de pago es obligatorio'),
    body('items').isArray().withMessage('Los items deben ser un array'),
    body('items.*.id_producto').isInt().withMessage('ID de producto inválido'),
    body('items.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0'),
    body('items.*.precio_unitario').isDecimal().withMessage('Precio unitario inválido'),
    body('items.*.subtotal').isDecimal().withMessage('Subtotal inválido'),
    inputErrors,
    createVenta
);

// Obtener todas las ventas
router.get('/', getVentas);

// Obtener estadísticas de ventas
router.get('/estadisticas', getEstadisticasVentas);

// Obtener una venta por ID
router.get('/:id',
    param('id').isInt().withMessage('ID inválido'),
    inputErrors,
    getVentaById
);

// Anular venta
router.put('/:id/anular',
    param('id').isInt().withMessage('ID inválido'),
    inputErrors,
    anularVenta
);

export default router;

