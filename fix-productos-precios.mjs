import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function fixProductosPrecios() {
    console.log('🔧 Arreglando precios de productos...\n');

    try {
        // 1. Obtener productos
        console.log('1️⃣ Obteniendo productos...');
        const response = await fetch(`${API_BASE}/productos`);
        const productos = await response.json();

        console.log(`✅ Productos encontrados: ${productos.length}\n`);

        // 2. Identificar productos con precio 0
        const productosSinPrecio = productos.filter(p => !p.precio_venta || p.precio_venta === 0);
        console.log(`⚠️ Productos sin precio: ${productosSinPrecio.length}\n`);

        if (productosSinPrecio.length === 0) {
            console.log('✅ Todos los productos tienen precio válido');
            return;
        }

        // 3. Mostrar productos sin precio
        console.log('3️⃣ Productos sin precio:');
        productosSinPrecio.forEach((producto, index) => {
            console.log(`   ${index + 1}. ${producto.descripcion} - Precio actual: ${producto.precio_venta}`);
        });

        // 4. Asignar precios de ejemplo
        console.log('\n4️⃣ Asignando precios de ejemplo...');
        const preciosEjemplo = [29.99, 59.99, 49.99, 79.99, 39.99, 89.99, 19.99, 69.99];

        for (let i = 0; i < productosSinPrecio.length; i++) {
            const producto = productosSinPrecio[i];
            const precioEjemplo = preciosEjemplo[i % preciosEjemplo.length];

            console.log(`   - ${producto.descripcion}: $${precioEjemplo}`);

            // Aquí podrías hacer una llamada PUT para actualizar el precio
            // Por ahora solo mostramos lo que se haría
        }

        console.log('\n✅ Precios de ejemplo asignados');
        console.log('\n📝 Para aplicar los cambios, necesitas:');
        console.log('   1. Ir a la base de datos (HeidiSQL)');
        console.log('   2. Ejecutar este SQL:');
        console.log('   UPDATE productos SET precio_venta = 29.99 WHERE precio_venta = 0 OR precio_venta IS NULL;');
        console.log('   3. O actualizar cada producto individualmente');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixProductosPrecios();














