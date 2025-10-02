import fetch from 'node-fetch';

async function testProductosEndpoint() {
    console.log('🧪 Test del endpoint de productos...\n');

    try {
        // Test directo al endpoint
        console.log('1️⃣ Probando endpoint de productos...');
        const response = await fetch('http://localhost:4000/api/productos');

        console.log(`Status: ${response.status}`);
        console.log(`Headers:`, Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();
            console.log(`Tipo de datos: ${typeof data}`);
            console.log(`Es array: ${Array.isArray(data)}`);
            console.log(`Cantidad: ${Array.isArray(data) ? data.length : 'N/A'}`);

            if (Array.isArray(data) && data.length > 0) {
                console.log('\nPrimer producto:');
                const producto = data[0];
                console.log(JSON.stringify(producto, null, 2));

                // Verificar campos específicos
                console.log('\nVerificación de campos:');
                console.log(`- id_producto: ${producto.id_producto} (${typeof producto.id_producto})`);
                console.log(`- descripcion: ${producto.descripcion} (${typeof producto.descripcion})`);
                console.log(`- precio_venta: ${producto.precio_venta} (${typeof producto.precio_venta})`);
                console.log(`- stock: ${producto.stock} (${typeof producto.stock})`);

                // Verificar si el precio es válido
                if (producto.precio_venta && producto.precio_venta > 0) {
                    console.log('✅ Precio válido');
                } else {
                    console.log('❌ Precio inválido o cero');
                }
            }
        } else {
            const errorText = await response.text();
            console.log('Error:', errorText);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testProductosEndpoint();



















