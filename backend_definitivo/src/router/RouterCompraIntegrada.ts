import { Router } from 'express';
import {
    procesarCompraIntegrada,
    getComprasCliente
} from '../controllers/CompraIntegradaController';

import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

// Procesar compra completa desde la tienda web
router.post('/procesar',
    [
        body('cliente_id').isInt().withMessage('ID del cliente inválido'),
        body('cliente_nombre').isString().notEmpty().withMessage('Nombre del cliente requerido'),
        body('cliente_telefono').isString().notEmpty().withMessage('Teléfono del cliente requerido'),
        body('cliente_email').optional().isEmail().withMessage('Email inválido'),
        body('direccion_entrega').optional().isString().withMessage('Dirección inválida'),
        body('observaciones').optional().isString().withMessage('Observaciones inválidas'),
        body('metodo_pago').isString().notEmpty().withMessage('Método de pago requerido'),
        body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
        body('items.*.id_producto').isInt().withMessage('ID de producto inválido'),
        body('items.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0'),
        body('items.*.precio_unitario').isDecimal().withMessage('Precio unitario inválido'),
        body('items.*.subtotal').isDecimal().withMessage('Subtotal inválido'),
        body('items.*.color').optional().isString().withMessage('Color inválido'),
        body('items.*.talla').optional().isString().withMessage('Talla inválida'),
        inputErrors
    ],
    procesarCompraIntegrada
);

// Obtener compras del cliente
router.get('/cliente/:cliente_id',
    [
        param('cliente_id').isInt().withMessage('ID del cliente inválido'),
        inputErrors
    ],
    getComprasCliente
);

export default router;























