import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testSimpleCompra() {
    console.log('🧪 Test simple de compra...\n');

    try {
        // 1. Verificar servidor
        console.log('1️⃣ Verificando servidor...');
        const healthResponse = await fetch(`${API_BASE}/health`);
        if (!healthResponse.ok) {
            throw new Error('Servidor no disponible');
        }
        console.log('✅ Servidor funcionando\n');

        // 2. Obtener cliente
        console.log('2️⃣ Obteniendo cliente...');
        const clientesResponse = await fetch(`${API_BASE}/clientes`);
        const clientes = await clientesResponse.json();
        const cliente = clientes[0];
        console.log(`✅ Cliente: ${cliente.nombre} ${cliente.apellido}\n`);

        // 3. Obtener producto
        console.log('3️⃣ Obteniendo producto...');
        const productosResponse = await fetch(`${API_BASE}/productos`);
        const productos = await productosResponse.json();
        const producto = productos[0];
        console.log(`✅ Producto: ${producto.descripcion}\n`);

        // 4. Crear compra simple
        console.log('4️⃣ Creando compra...');
        const compraData = {
            cliente_id: cliente.id_cliente,
            cliente_nombre: `${cliente.nombre} ${cliente.apellido}`.trim(),
            cliente_telefono: cliente.telefono || '123456789',
            cliente_email: 'test@test.com',
            direccion_entrega: 'Test Address 123',
            horario_recepcion: '15:00-18:00',
            descripcion_pedido: 'Test order description',
            observaciones: 'Test observations',
            metodo_pago: 'efectivo',
            items: [{
                id_producto: producto.id_producto,
                cantidad: 1,
                precio_unitario: producto.precio_venta,
                subtotal: producto.precio_venta,
                color: 'Test',
                talla: 'M'
            }]
        };

        console.log('📦 Datos de compra:');
        console.log(`   - Cliente: ${compraData.cliente_nombre}`);
        console.log(`   - Dirección: ${compraData.direccion_entrega}`);
        console.log(`   - Horario: ${compraData.horario_recepcion}`);
        console.log(`   - Descripción: ${compraData.descripcion_pedido}\n`);

        const compraResponse = await fetch(`${API_BASE}/compra-integrada/procesar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(compraData)
        });

        if (!compraResponse.ok) {
            const errorText = await compraResponse.text();
            throw new Error(`Error en compra: ${compraResponse.status} - ${errorText}`);
        }

        const compraResult = await compraResponse.json();
        console.log('✅ Compra procesada exitosamente');
        console.log(`   - Resultado: ${JSON.stringify(compraResult, null, 2)}\n`);

        // 5. Verificar pedidos
        console.log('5️⃣ Verificando pedidos...');
        const pedidosResponse = await fetch(`${API_BASE}/pedidos`);
        const pedidos = await pedidosResponse.json();
        console.log(`✅ Total de pedidos: ${pedidos.length}`);

        if (pedidos.length > 0) {
            const ultimoPedido = pedidos[pedidos.length - 1];
            console.log(`   - Último pedido ID: ${ultimoPedido.id_pedido}`);
            console.log(`   - Estado: ${ultimoPedido.estado}`);
            console.log(`   - Dirección: ${ultimoPedido.direccion_entrega || 'No disponible'}`);
            console.log(`   - Horario: ${ultimoPedido.horario_recepcion || 'No disponible'}`);
            console.log(`   - Descripción: ${ultimoPedido.descripcion_pedido || 'No disponible'}`);
        }

        console.log('\n🎉 Test completado exitosamente!');

    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        process.exit(1);
    }
}

testSimpleCompra();























