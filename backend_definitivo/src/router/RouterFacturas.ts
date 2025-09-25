import { Router } from 'express';
import {
    createFactura,
    getFacturas,
    getFacturaById,
    anularFactura,
    getEstadisticasFacturas,
    getNextFacturaNumber,
    validateCreateFactura,
    getFacturasByCliente
} from '../controllers/FacturaController';
import { simpleRoleAuth, requireRole } from '../middleware/simpleRoleAuth';

const router = Router();

// Crear nueva factura
router.post('/', simpleRoleAuth, requireRole(['Admin', 'Vendedor']), validateCreateFactura, createFactura);

// Obtener siguiente número de factura
router.get('/next-number', getNextFacturaNumber);

// Obtener todas las facturas
router.get('/', simpleRoleAuth, requireRole(['Admin', 'Vendedor']), getFacturas);

// Obtener facturas de un cliente específico (sin autenticación para panel de usuario)
router.get('/cliente/:clienteId', getFacturasByCliente);

// Obtener estadísticas de facturas
router.get('/estadisticas', simpleRoleAuth, requireRole(['Admin', 'Vendedor']), getEstadisticasFacturas);

// Obtener factura por ID
router.get('/:id', simpleRoleAuth, requireRole(['Admin', 'Vendedor']), getFacturaById);

// Anular factura
router.put('/:id/anular', simpleRoleAuth, requireRole(['Admin', 'Vendedor']), anularFactura);

export default router;
