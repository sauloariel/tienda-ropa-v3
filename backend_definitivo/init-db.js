const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar a la base de datos
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔌 Conectando a la base de datos...');

// Función para ejecutar queries de forma asíncrona
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

// Función para obtener resultados de forma asíncrona
function getQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function initializeDatabase() {
    try {
        console.log('📊 Inicializando base de datos...');

        // Insertar categorías de ejemplo
        const categorias = [
            { nombre: 'Ropa de Mujer', descripcion: 'Vestidos, blusas, pantalones y más' },
            { nombre: 'Ropa de Hombre', descripcion: 'Camisetas, pantalones, camisas y más' },
            { nombre: 'Calzado', descripcion: 'Zapatillas, zapatos, sandalias y más' },
            { nombre: 'Accesorios', descripcion: 'Bolsos, cinturones, joyería y más' },
            { nombre: 'Ropa Infantil', descripcion: 'Ropa para niños y niñas' }
        ];

        console.log('🏷️ Insertando categorías...');
        for (const categoria of categorias) {
            await runQuery(
                'INSERT OR IGNORE INTO categorias (nombre_categoria, descripcion, estado) VALUES (?, ?, ?)',
                [categoria.nombre, categoria.descripcion, 'ACTIVO']
            );
        }

        // Insertar proveedores de ejemplo
        const proveedores = [
            { nombre: 'Proveedor A', direccion: 'Dirección A', telefono: '123-456-789' },
            { nombre: 'Proveedor B', direccion: 'Dirección B', telefono: '987-654-321' }
        ];

        console.log('🏢 Insertando proveedores...');
        for (const proveedor of proveedores) {
            await runQuery(
                'INSERT OR IGNORE INTO proveedores (nombre_proveedor, direccion, telefono, estado) VALUES (?, ?, ?, ?)',
                [proveedor.nombre, proveedor.direccion, proveedor.telefono, 'ACTIVO']
            );
        }

        // Obtener IDs de categorías y proveedores
        const categoriasDB = await getQuery('SELECT id_categoria FROM categorias');
        const proveedoresDB = await getQuery('SELECT id_proveedor FROM proveedores');

        // Insertar productos de ejemplo
        const productos = [
            {
                descripcion: 'Camiseta Básica de Algodón',
                id_proveedor: proveedoresDB[0].id_proveedor,
                id_categoria: categoriasDB[1].id_categoria, // Ropa de Hombre
                stock: 50,
                precio_venta: 25.99,
                precio_compra: 15.00,
                stock_seguridad: 10,
                estado: 'ACTIVO'
            },
            {
                descripcion: 'Vestido Floral de Verano',
                id_proveedor: proveedoresDB[0].id_proveedor,
                id_categoria: categoriasDB[0].id_categoria, // Ropa de Mujer
                stock: 15,
                precio_venta: 89.99,
                precio_compra: 60.00,
                stock_seguridad: 5,
                estado: 'ACTIVO'
            },
            {
                descripcion: 'Pantalón Vaquero Clásico',
                id_proveedor: proveedoresDB[1].id_proveedor,
                id_categoria: categoriasDB[1].id_categoria, // Ropa de Hombre
                stock: 30,
                precio_venta: 65.50,
                precio_compra: 45.00,
                stock_seguridad: 8,
                estado: 'ACTIVO'
            },
            {
                descripcion: 'Zapatillas Deportivas Running',
                id_proveedor: proveedoresDB[1].id_proveedor,
                id_categoria: categoriasDB[2].id_categoria, // Calzado
                stock: 25,
                precio_venta: 120.00,
                precio_compra: 80.00,
                stock_seguridad: 5,
                estado: 'ACTIVO'
            },
            {
                descripcion: 'Blusa Elegante de Seda',
                id_proveedor: proveedoresDB[0].id_proveedor,
                id_categoria: categoriasDB[0].id_categoria, // Ropa de Mujer
                stock: 8,
                precio_venta: 75.99,
                precio_compra: 50.00,
                stock_seguridad: 3,
                estado: 'ACTIVO'
            }
        ];

        console.log('👕 Insertando productos...');
        for (const producto of productos) {
            await runQuery(
                'INSERT OR IGNORE INTO productos (descripcion, id_proveedor, id_categoria, stock, precio_venta, precio_compra, stock_seguridad, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [producto.descripcion, producto.id_proveedor, producto.id_categoria, producto.stock, producto.precio_venta, producto.precio_compra, producto.stock_seguridad, producto.estado]
            );
        }

        // Insertar variantes de productos (talles y colores)
        const productosDB = await getQuery('SELECT id_producto FROM productos');

        console.log('🎨 Insertando variantes de productos...');
        for (const producto of productosDB) {
            // Agregar talles
            const talles = ['S', 'M', 'L', 'XL'];
            for (const talle of talles) {
                await runQuery(
                    'INSERT OR IGNORE INTO producto_variantes (id_producto, talle, stock_variante) VALUES (?, ?, ?)',
                    [producto.id_producto, talle, Math.floor(Math.random() * 20) + 5]
                );
            }

            // Agregar colores
            const colores = ['Negro', 'Blanco', 'Azul'];
            for (const color of colores) {
                await runQuery(
                    'INSERT OR IGNORE INTO producto_variantes (id_producto, color, stock_variante) VALUES (?, ?, ?)',
                    [producto.id_producto, color, Math.floor(Math.random() * 15) + 3]
                );
            }
        }

        // Insertar imágenes de ejemplo
        console.log('🖼️ Insertando imágenes...');
        const imagenes = [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1564257631407-3deb5f3d0f5c?w=400&h=400&fit=crop'
        ];

        for (let i = 0; i < productosDB.length && i < imagenes.length; i++) {
            await runQuery(
                'INSERT OR IGNORE INTO imagenes (id_producto, url, descripcion) VALUES (?, ?, ?)',
                [productosDB[i].id_producto, imagenes[i], 'Imagen del producto']
            );
        }

        console.log('✅ Base de datos inicializada correctamente!');

        // Mostrar resumen
        const totalCategorias = await getQuery('SELECT COUNT(*) as count FROM categorias');
        const totalProductos = await getQuery('SELECT COUNT(*) as count FROM productos');
        const totalVariantes = await getQuery('SELECT COUNT(*) as count FROM producto_variantes');
        const totalImagenes = await getQuery('SELECT COUNT(*) as count FROM imagenes');

        console.log('\n📊 Resumen de la base de datos:');
        console.log(`   Categorías: ${totalCategorias[0].count}`);
        console.log(`   Productos: ${totalProductos[0].count}`);
        console.log(`   Variantes: ${totalVariantes[0].count}`);
        console.log(`   Imágenes: ${totalImagenes[0].count}`);

    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
    } finally {
        db.close();
        console.log('🔌 Conexión cerrada.');
    }
}

// Ejecutar la inicialización
initializeDatabase();
