import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
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
import coloresRoutes from './router/RouterColor';
import tallasRoutes from './router/RouterTalla';
import tipoTalleRoutes from './router/RouterTipoTalle';
import imagenesRoutes from './router/RouterImagenes';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB límite
        files: 6 // máximo 6 archivos
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WEBP)'));
        }
    }
});

// Crear directorio uploads si no existe
import fs from 'fs';
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Middleware para servir archivos estáticos
app.use('/uploads', express.static('uploads'));

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
            colores: '/colores',
            tallas: '/tallas',
            tipoTalle: '/tipo-talle',
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

// Rutas de colores
app.use('/api/colores', coloresRoutes);

// Rutas de tallas
app.use('/api/tallas', tallasRoutes);

// Rutas de tipos de talla
app.use('/api/tipo-talle', tipoTalleRoutes);

// Rutas de imágenes
app.use('/api/imagenes', imagenesRoutes);

export default app;
