import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testProductosAPI() {
    console.log('🧪 Test de API de productos...\n');

    try {
        // 1. Verificar servidor
        console.log('1️⃣ Verificando servidor...');
        const healthResponse = await fetch(`${API_BASE}/health`);
        if (!healthResponse.ok) {
            throw new Error('Servidor no disponible');
        }
        console.log('✅ Servidor funcionando\n');

        // 2. Obtener productos
        console.log('2️⃣ Obteniendo productos...');
        const productosResponse = await fetch(`${API_BASE}/productos`);
        const productos = await productosResponse.json();

        if (!productos || productos.length === 0) {
            throw new Error('No hay productos disponibles');
        }

        console.log(`✅ Productos encontrados: ${productos.length}\n`);

        // 3. Analizar los primeros productos
        console.log('3️⃣ Analizando productos...');
        productos.slice(0, 3).forEach((producto, index) => {
            console.log(`Producto ${index + 1}:`);
            console.log(`   - ID: ${producto.id_producto}`);
            console.log(`   - Descripción: ${producto.descripcion}`);
            console.log(`   - Precio Venta: ${producto.precio_venta} (tipo: ${typeof producto.precio_venta})`);
            console.log(`   - Stock: ${producto.stock}`);
            console.log(`   - Categoría: ${producto.categoria?.nombre_categoria || 'Sin categoría'}`);
            console.log('');
        });

        // 4. Verificar si hay productos con precio 0
        const productosConPrecioCero = productos.filter(p => p.precio_venta === 0 || !p.precio_venta);
        if (productosConPrecioCero.length > 0) {
            console.log(`⚠️ Productos con precio 0 o nulo: ${productosConPrecioCero.length}`);
            productosConPrecioCero.slice(0, 3).forEach(p => {
                console.log(`   - ${p.descripcion}: ${p.precio_venta}`);
            });
        } else {
            console.log('✅ Todos los productos tienen precio válido');
        }

        // 5. Verificar estructura de datos
        console.log('\n4️⃣ Verificando estructura de datos...');
        const primerProducto = productos[0];
        console.log('Campos disponibles en el primer producto:');
        Object.keys(primerProducto).forEach(key => {
            console.log(`   - ${key}: ${typeof primerProducto[key]} = ${primerProducto[key]}`);
        });

    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        process.exit(1);
    }
}

testProductosAPI();























