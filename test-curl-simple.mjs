import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testCurlSimple() {
    console.log('🧪 Test con curl...\n');

    try {
        // Test 1: Health check
        console.log('1️⃣ Health check...');
        const { stdout: healthOutput } = await execAsync('curl -s http://localhost:4000/api/health');
        console.log('Health response:', healthOutput);

        // Test 2: Productos
        console.log('\n2️⃣ Productos...');
        const { stdout: productosOutput } = await execAsync('curl -s http://localhost:4000/api/productos');
        console.log('Productos response length:', productosOutput.length);

        if (productosOutput.length > 0) {
            try {
                const productos = JSON.parse(productosOutput);
                console.log('Productos parseados:', productos.length);

                if (productos.length > 0) {
                    const primerProducto = productos[0];
                    console.log('Primer producto:');
                    console.log(`  - ID: ${primerProducto.id_producto}`);
                    console.log(`  - Descripción: ${primerProducto.descripcion}`);
                    console.log(`  - Precio: ${primerProducto.precio_venta}`);
                    console.log(`  - Stock: ${primerProducto.stock}`);
                }
            } catch (parseError) {
                console.log('Error parseando JSON:', parseError.message);
                console.log('Raw output:', productosOutput.substring(0, 200));
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testCurlSimple();














