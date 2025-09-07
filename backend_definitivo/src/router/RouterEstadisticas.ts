import { Router } from 'express';
import {
    getEstadisticasGenerales,
    getVentasMensuales,
    getProductosTopVentas,
    getCategoriasTopVentas,
    getClientesTopCompras,
    getActividadReciente,
    getResumenFinanciero
} from '../controllers/EstadisticasController';

const router = Router();

// Ruta raíz de estadísticas - resumen general
router.get('/', (req, res) => {
    res.json({
        message: 'Estadísticas disponibles',
        endpoints: {
            generales: '/estadisticas/generales',
            ventasMensuales: '/estadisticas/ventas-mensuales',
            productosTop: '/estadisticas/productos-top',
            categoriasTop: '/estadisticas/categorias-top',
            clientesTop: '/estadisticas/clientes-top',
            actividadReciente: '/estadisticas/actividad-reciente',
            resumenFinanciero: '/estadisticas/resumen-financiero'
        }
    });
});

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

export default router;
