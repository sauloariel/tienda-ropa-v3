import Express from 'express';
import cors from 'cors';
import db from './config/db';

// Importación de routers
import routerAuth from './router/RouterAuth';
import routerCliente from './router/RouterCliente';
import routerCategorias from './router/RouterCategorias';
import routerColores from './router/RouterColor';
import routerDetallePedidos from './router/RouterDetallePedidos';
import routerEmpleados from './router/RouterEmpleados';
import routerImagenes from './router/RouterImagenes';
import routerPedidos from './router/RouterPedidos';
import routerProductos from './router/RouterProductos';
import routerProveedores from './router/RouterProveedores';
import routerRoles from './router/RouterRoles';
import routerTallas from './router/RouterTalla';
import routerTipoTalle from './router/RouterTalle';
import routerEstadisticas from './router/RouterEstadisticas';
import routerVentas from './router/RouterVentas';
import routerFacturas from './router/RouterFacturas';

const server = Express();

// Middleware CORS para permitir conexiones desde el frontend
server.use(cors({
  origin: true, // Permitir todas las conexiones en desarrollo
  credentials: true
}));

// Middlewares para parsear JSON y formularios
server.use(Express.json());
server.use(Express.urlencoded({ extended: true }));

// Rutas base organizadas por recurso
server.use('/auth', routerAuth); // Router de autenticación
server.use('/api/clientes', routerCliente);
server.use('/api/categorias', routerCategorias);
server.use('/api/colores', routerColores);
server.use('/api/detalle-pedidos', routerDetallePedidos);
server.use('/api/empleados', routerEmpleados);
server.use('/api/imagenes', routerImagenes);
server.use('/api/pedidos', routerPedidos);
server.use('/api/productos', routerProductos);
server.use('/api/proveedores', routerProveedores);
server.use('/api/roles', routerRoles);
server.use('/api/tallas', routerTallas);
server.use('/api/tipo-talle', routerTipoTalle);
server.use('/api/estadisticas', routerEstadisticas);
server.use('/api/ventas', routerVentas);
server.use('/api/facturas', routerFacturas);

// Conexión a la base de datos
async function connectDB() {
  try {
    await db.authenticate();
    await db.sync();
    console.log('✅ DB is connected');
  } catch (error) {
    console.error('❌ Error connecting to the DB:', error);
  }
}

connectDB();

export default server;
