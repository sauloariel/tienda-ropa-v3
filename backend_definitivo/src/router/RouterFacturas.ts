import { Router } from 'express';
import {
    createFactura,
    getFacturas,
    getFacturaById,
    anularFactura,
    getEstadisticasFacturas,
    validateCreateFactura
} from '../controllers/FacturaController';

const router = Router();

// Crear nueva factura
router.post('/', validateCreateFactura, createFactura);

// Obtener todas las facturas
router.get('/', getFacturas);

// Obtener estadísticas de facturas
router.get('/estadisticas', getEstadisticasFacturas);

// Obtener factura por ID
router.get('/:id', getFacturaById);

// Anular factura
router.put('/:id/anular', anularFactura);

export default router;
