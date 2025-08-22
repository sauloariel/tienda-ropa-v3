import Express from 'express';
import db from './config/db';

// Importación de routers
import routerCliente from './router/RouterCliente';
import routerCategorias from './router/RouterCategorias';
import routerDetallePedidos from './router/RouterDetallePedidos';
import routerEmpleados from './router/RouterEmpleados';
import routerImagenes from './router/RouterImagenes';
import routerLogin from './router/RouterLoguin';
import routerPedidos from './router/RouterPedidos';
import routerProductos from './router/RouterProductos';
import routerProveedores from './router/RouterProveedores';
import routerRoles from './router/RouterRoles';

const server = Express();

// Middlewares para parsear JSON y formularios
server.use(Express.json());
server.use(Express.urlencoded({ extended: true }));

// Rutas base organizadas por recurso
server.use('/api/clientes', routerCliente);
server.use('/api/categorias', routerCategorias);
server.use('/api/detalle-pedidos', routerDetallePedidos);
server.use('/api/empleados', routerEmpleados);
server.use('/api/imagenes', routerImagenes);
server.use('/api/login', routerLogin);
server.use('/api/pedidos', routerPedidos);
server.use('/api/productos', routerProductos);
server.use('/api/proveedores', routerProveedores);
server.use('/api/roles', routerRoles);

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
