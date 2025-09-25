import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testProductosDetallado() {
    console.log('🧪 Test detallado de productos...\n');

    try {
        // 1. Obtener productos
        console.log('1️⃣ Obteniendo productos...');
        const productosResponse = await fetch(`${API_BASE}/productos`);

        if (!productosResponse.ok) {
            throw new Error(`Error HTTP: ${productosResponse.status}`);
        }

        const productos = await productosResponse.json();
        console.log(`✅ Productos obtenidos: ${productos.length}\n`);

        // 2. Analizar cada producto
        console.log('2️⃣ Analizando productos...');
        productos.forEach((producto, index) => {
            console.log(`Producto ${index + 1}:`);
            console.log(`   - ID: ${producto.id_producto}`);
            console.log(`   - Descripción: ${producto.descripcion}`);
            console.log(`   - Precio Venta: ${producto.precio_venta} (tipo: ${typeof producto.precio_venta})`);
            console.log(`   - Stock: ${producto.stock}`);
            console.log(`   - Categoría: ${producto.categoria?.nombre_categoria || 'Sin categoría'}`);

            // Verificar si el precio es válido
            if (producto.precio_venta === 0 || producto.precio_venta === null || producto.precio_venta === undefined) {
                console.log(`   ⚠️ PROBLEMA: Precio inválido`);
            } else {
                console.log(`   ✅ Precio válido`);
            }
            console.log('');
        });

        // 3. Resumen de problemas
        console.log('3️⃣ Resumen de problemas...');
        const productosConPrecioCero = productos.filter(p => p.precio_venta === 0);
        const productosConPrecioNull = productos.filter(p => p.precio_venta === null || p.precio_venta === undefined);
        const productosConPrecioValido = productos.filter(p => p.precio_venta > 0);

        console.log(`   - Productos con precio 0: ${productosConPrecioCero.length}`);
        console.log(`   - Productos con precio null/undefined: ${productosConPrecioNull.length}`);
        console.log(`   - Productos con precio válido: ${productosConPrecioValido.length}`);

        if (productosConPrecioValido.length === 0) {
            console.log('\n❌ PROBLEMA CRÍTICO: No hay productos con precio válido');
            console.log('Esto explica por qué el carrito muestra $0.00');
        } else {
            console.log('\n✅ Hay productos con precio válido');
        }

    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        process.exit(1);
    }
}

testProductosDetallado();














