import { Router } from 'express';
import {
    createFactura,
    getFacturas,
    getFacturaById,
    anularFactura,
    getEstadisticasFacturas,
    getNextFacturaNumber,
    validateCreateFactura
} from '../controllers/FacturaController';

const router = Router();

// Crear nueva factura
router.post('/', validateCreateFactura, createFactura);

// Obtener siguiente número de factura
router.get('/next-number', getNextFacturaNumber);

// Obtener todas las facturas
router.get('/', getFacturas);

// Obtener estadísticas de facturas
router.get('/estadisticas', getEstadisticasFacturas);

// Obtener factura por ID
router.get('/:id', getFacturaById);

// Anular factura
router.put('/:id/anular', anularFactura);

export default router;
