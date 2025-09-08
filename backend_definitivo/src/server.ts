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
app.use('/auth', authRoutes);

// Rutas de empleados
app.use('/empleados', empleadosRoutes);

// Rutas de roles
app.use('/roles', rolesRoutes);

// Rutas de loguin (usuarios de login)
app.use('/loguin', loguinRoutes);

// Rutas de productos
app.use('/productos', productosRoutes);

// Rutas de clientes
app.use('/clientes', clientesRoutes);

// Rutas de autenticación de clientes
app.use('/clientes/auth', clientAuthRoutes);

// Rutas de pedidos
app.use('/pedidos', pedidosRoutes);

// Rutas de categorías (integradas en productos)
// app.use('/categorias', categoriasRoutes); // Comentado - ahora está en /productos/categorias

// Rutas de proveedores
app.use('/proveedores', proveedoresRoutes);

// Rutas de estadísticas
app.use('/estadisticas', estadisticasRoutes);

// Rutas de facturas
app.use('/facturas', facturasRoutes);

// Rutas de ventas
app.use('/ventas', ventasRoutes);

// Rutas de marketing
app.use('/marketing', marketingRoutes);

export default app;
