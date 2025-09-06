import { Router } from 'express';
import {
    getPromociones,
    getPromocionById,
    createPromocion,
    updatePromocion,
    deletePromocion,
    togglePromocionEstado,
    getMarketingStats,
    getPromocionesPorVencer,
    getPromocionesExpiradas,
    validateCodigoDescuento,
    usarCodigoDescuento
} from '../controllers/MarketingController';

const router = Router();

// Ruta raíz de marketing
router.get('/', (req, res) => {
    res.json({
        message: 'Marketing API funcionando correctamente',
        endpoints: {
            promociones: '/marketing/promociones',
            stats: '/marketing/stats',
            promocionesPorVencer: '/marketing/promociones-por-vencer',
            promocionesExpiradas: '/marketing/promociones-expiradas',
            validateCodigo: '/marketing/validate-codigo',
            usarCodigo: '/marketing/usar-codigo'
        }
    });
});

// Obtener todas las promociones
router.get('/promociones', getPromociones);

// Obtener promoción por ID
router.get('/promociones/:id', getPromocionById);

// Crear nueva promoción
router.post('/promociones', createPromocion);

// Actualizar promoción
router.put('/promociones/:id', updatePromocion);

// Eliminar promoción
router.delete('/promociones/:id', deletePromocion);

// Cambiar estado de promoción
router.patch('/promociones/:id/estado', togglePromocionEstado);

// Obtener estadísticas de marketing
router.get('/stats', getMarketingStats);

// Obtener promociones por vencer
router.get('/promociones-por-vencer', getPromocionesPorVencer);

// Obtener promociones expiradas
router.get('/promociones-expiradas', getPromocionesExpiradas);

// Validar código de descuento
router.post('/validate-codigo', validateCodigoDescuento);

// Usar código de descuento
router.post('/usar-codigo', usarCodigoDescuento);

export default router;


