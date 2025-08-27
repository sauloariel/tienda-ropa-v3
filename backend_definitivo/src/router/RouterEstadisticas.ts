import { Router } from 'express';
import {
    getEstadisticasGenerales,
    getVentasMensuales,
    getProductosTopVentas,
    getCategoriasTopVentas,
    getClientesTopCompras,
    getActividadReciente,
    getResumenFinanciero,
    getEstadisticasInventario
} from '../controllers/EstadisticasController';

const router = Router();

// Estadísticas generales del dashboard
router.get('/generales', getEstadisticasGenerales);

// Ventas mensuales
router.get('/ventas-mensuales', getVentasMensuales);

// Productos más vendidos
router.get('/productos-top', getProductosTopVentas);

// Categorías más vendidas
router.get('/categorias-top', getCategoriasTopVentas);

// Clientes con más compras
router.get('/clientes-top', getClientesTopCompras);

// Actividad reciente
router.get('/actividad-reciente', getActividadReciente);

// Resumen financiero
router.get('/resumen-financiero', getResumenFinanciero);

// Estadísticas de inventario
router.get('/inventario', getEstadisticasInventario);

export default router;
