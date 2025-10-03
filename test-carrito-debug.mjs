import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testCarritoDebug() {
    console.log('🧪 Test de debug del carrito...\n');

    try {
        // 1. Obtener productos
        console.log('1️⃣ Obteniendo productos...');
        const productosResponse = await fetch(`${API_BASE}/productos`);
        const productos = await productosResponse.json();

        const producto = productos[0];
        console.log('Producto de prueba:');
        console.log(`   - ID: ${producto.id_producto}`);
        console.log(`   - Descripción: ${producto.descripcion}`);
        console.log(`   - Precio Venta: ${producto.precio_venta} (tipo: ${typeof producto.precio_venta})`);
        console.log(`   - Stock: ${producto.stock}\n`);

        // 2. Simular la lógica de addToCart
        console.log('2️⃣ Simulando lógica de addToCart...');

        // Validar que el producto sea válido
        if (!producto || !producto.id_producto || !producto.descripcion) {
            console.log('❌ Producto inválido');
            return;
        }

        // Asegurar que el precio sea un número válido
        const precioValido = typeof producto.precio_venta === 'number' && !isNaN(producto.precio_venta)
            ? producto.precio_venta
            : 0;

        console.log('Validación de precio:');
        console.log(`   - precio_venta original: ${producto.precio_venta}`);
        console.log(`   - tipo: ${typeof producto.precio_venta}`);
        console.log(`   - isNaN: ${isNaN(producto.precio_venta)}`);
        console.log(`   - precioValido: ${precioValido}\n`);

        // 3. Simular item del carrito
        console.log('3️⃣ Simulando item del carrito...');
        const cartItem = {
            producto: producto,
            cantidad: 2,
            precioUnitario: precioValido
        };

        console.log('Item del carrito:');
        console.log(`   - Producto: ${cartItem.producto.descripcion}`);
        console.log(`   - Cantidad: ${cartItem.cantidad}`);
        console.log(`   - Precio Unitario: ${cartItem.precioUnitario}`);
        console.log(`   - Subtotal: ${cartItem.precioUnitario * cartItem.cantidad}\n`);

        // 4. Simular cálculo de total
        console.log('4️⃣ Simulando cálculo de total...');
        const cartItems = [cartItem];
        const total = cartItems.reduce((sum, item) => {
            const precioValido = typeof item.precioUnitario === 'number' && !isNaN(item.precioUnitario) ? item.precioUnitario : 0;
            const cantidadValida = typeof item.cantidad === 'number' && !isNaN(item.cantidad) ? item.cantidad : 0;
            const subtotal = precioValido * cantidadValida;
            console.log(`   - Item: ${item.producto.descripcion}, Precio: ${precioValido}, Cantidad: ${cantidadValida}, Subtotal: ${subtotal}`);
            return sum + subtotal;
        }, 0);

        console.log(`\nTotal del carrito: ${total}`);

        if (total === 0) {
            console.log('❌ PROBLEMA: El total es 0');
            console.log('Posibles causas:');
            console.log('   - precio_venta es 0 o null en la base de datos');
            console.log('   - Error en la validación de precio');
            console.log('   - Error en el cálculo');
        } else {
            console.log('✅ El carrito debería funcionar correctamente');
        }

    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        process.exit(1);
    }
}

testCarritoDebug();























