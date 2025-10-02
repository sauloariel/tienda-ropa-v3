import { Router } from 'express';
import { basicAuthMarketing } from '../middleware/basicAuthMarketing';
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
    usarCodigoDescuento,
    getProductosDisponibles,
    agregarProductosPromocion,
    getPromocionesActivasProductos
} from '../controllers/MarketingController';

const router = Router();

// Aplicar middleware de autenticación básica a todas las rutas
router.use(basicAuthMarketing);

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

// Obtener productos disponibles para promociones
router.get('/productos-disponibles', getProductosDisponibles);

// Agregar productos a una promoción
router.post('/promociones/:id/productos', agregarProductosPromocion);

// Obtener promociones activas para productos específicos
router.get('/promociones-activas', getPromocionesActivasProductos);

export default router;


