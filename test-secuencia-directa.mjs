import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testSecuenciaDirecta() {
    console.log('🧪 Test directo de secuencia...\n');

    try {
        // 1. Verificar servidor
        console.log('1️⃣ Verificando servidor...');
        const healthResponse = await fetch(`${API_BASE}/health`);
        if (!healthResponse.ok) {
            throw new Error('Servidor no disponible');
        }
        console.log('✅ Servidor funcionando\n');

        // 2. Crear pedido simple directamente
        console.log('2️⃣ Creando pedido simple...');
        const pedidoData = {
            id_cliente: 1,
            id_empleados: 1,
            fecha_pedido: new Date().toISOString(),
            importe: 50.00,
            estado: 'pendiente',
            anulacion: false,
            venta_web: true,
            direccion_entrega: 'Test Address',
            horario_recepcion: '15:00-18:00',
            descripcion_pedido: 'Test description',
            productos: [{
                id_producto: 1,
                cantidad: 1,
                precio_venta: 50.00,
                subtotal: 50.00,
                color: 'Test',
                talla: 'M'
            }]
        };

        console.log('📦 Datos del pedido:');
        console.log(`   - Cliente: ${pedidoData.id_cliente}`);
        console.log(`   - Dirección: ${pedidoData.direccion_entrega}`);
        console.log(`   - Horario: ${pedidoData.horario_recepcion}`);
        console.log(`   - Descripción: ${pedidoData.descripcion_pedido}\n`);

        const pedidoResponse = await fetch(`${API_BASE}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoData)
        });

        if (!pedidoResponse.ok) {
            const errorText = await pedidoResponse.text();
            throw new Error(`Error en pedido: ${pedidoResponse.status} - ${errorText}`);
        }

        const pedidoResult = await pedidoResponse.json();
        console.log('✅ Pedido creado exitosamente');
        console.log(`   - ID: ${pedidoResult.id_pedido}`);
        console.log(`   - Estado: ${pedidoResult.estado}`);
        console.log(`   - Dirección: ${pedidoResult.direccion_entrega}`);
        console.log(`   - Horario: ${pedidoResult.horario_recepcion}`);
        console.log(`   - Descripción: ${pedidoResult.descripcion_pedido}\n`);

        // 3. Verificar que se guardó correctamente
        console.log('3️⃣ Verificando pedido guardado...');
        const getResponse = await fetch(`${API_BASE}/pedidos/${pedidoResult.id_pedido}`);
        if (getResponse.ok) {
            const pedidoGuardado = await getResponse.json();
            console.log('✅ Pedido verificado en base de datos');
            console.log(`   - ID: ${pedidoGuardado.id_pedido}`);
            console.log(`   - Estado: ${pedidoGuardado.estado}`);
            console.log(`   - Dirección: ${pedidoGuardado.direccion_entrega}`);
            console.log(`   - Horario: ${pedidoGuardado.horario_recepcion}`);
            console.log(`   - Descripción: ${pedidoGuardado.descripcion_pedido}`);
        } else {
            console.log('❌ No se pudo verificar el pedido');
        }

        console.log('\n🎉 Test de secuencia completado exitosamente!');

    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        process.exit(1);
    }
}

testSecuenciaDirecta();
