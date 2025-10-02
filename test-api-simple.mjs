import fetch from 'node-fetch';

async function testAPISimple() {
    console.log('🧪 Test simple de API...\n');

    try {
        // Test 1: Health check
        console.log('1️⃣ Verificando servidor...');
        const healthResponse = await fetch('http://localhost:4000/api/health');
        console.log(`Health status: ${healthResponse.status}`);

        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('Health data:', healthData);
        }

        // Test 2: Productos
        console.log('\n2️⃣ Obteniendo productos...');
        const productosResponse = await fetch('http://localhost:4000/api/productos');
        console.log(`Productos status: ${productosResponse.status}`);

        if (productosResponse.ok) {
            const productos = await productosResponse.json();
            console.log(`Productos obtenidos: ${productos.length}`);

            if (productos.length > 0) {
                const primerProducto = productos[0];
                console.log('Primer producto:');
                console.log(`  - ID: ${primerProducto.id_producto}`);
                console.log(`  - Descripción: ${primerProducto.descripcion}`);
                console.log(`  - Precio: ${primerProducto.precio_venta}`);
                console.log(`  - Stock: ${primerProducto.stock}`);
            }
        } else {
            const errorText = await productosResponse.text();
            console.log('Error en productos:', errorText);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAPISimple();



















