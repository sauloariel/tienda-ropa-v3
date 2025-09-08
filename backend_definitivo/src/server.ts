import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './config/db';
import authRoutes from './router/auth.routes';
import empleadosRoutes from './router/RouterEmpleados';
import rolesRoutes from './router/RouterRoles';
import loguinRoutes from './router/RouterLoguin';
import productosRoutes from './router/RouterProductos';
import clientesRoutes from './router/RouterCliente';
import clientAuthRoutes from './router/RouterClientAuth';
import pedidosRoutes from './router/RouterPedidos';
// import categoriasRoutes from './router/RouterCategorias'; // Integrado en productos
import proveedoresRoutes from './router/RouterProveedores';
import estadisticasRoutes from './router/RouterEstadisticas';
import facturasRoutes from './router/RouterFacturas';
import ventasRoutes from './router/RouterVentas';
import marketingRoutes from './router/RouterMarketing';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'Backend API funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            auth: '/auth',
            empleados: '/empleados',
            roles: '/roles',
            loguin: '/loguin',
            productos: '/productos',
            clientes: '/clientes',
            pedidos: '/pedidos',
            categorias: '/productos/categorias',
            proveedores: '/proveedores',
            estadisticas: '/estadisticas',
            facturas: '/facturas',
            ventas: '/ventas',
            marketing: '/marketing'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de empleados
app.use('/api/empleados', empleadosRoutes);

// Rutas de roles
app.use('/api/roles', rolesRoutes);

// Rutas de loguin (usuarios de login)
app.use('/api/loguin', loguinRoutes);

// Rutas de productos
app.use('/api/productos', productosRoutes);

// Rutas de clientes
app.use('/api/clientes', clientesRoutes);

// Rutas de autenticación de clientes
app.use('/api/clientes/auth', clientAuthRoutes);

// Rutas de pedidos
app.use('/api/pedidos', pedidosRoutes);

// Rutas de categorías (integradas en productos)
// app.use('/api/categorias', categoriasRoutes); // Comentado - ahora está en /api/productos/categorias

// Rutas de proveedores
app.use('/api/proveedores', proveedoresRoutes);

// Rutas de estadísticas
app.use('/api/estadisticas', estadisticasRoutes);

// Rutas de facturas
app.use('/api/facturas', facturasRoutes);

// Rutas de ventas
app.use('/api/ventas', ventasRoutes);

// Rutas de marketing
app.use('/api/marketing', marketingRoutes);

export default app;
