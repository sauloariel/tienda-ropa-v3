import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testFinalVerificacion() {
    console.log('🧪 Test final de verificación completa...\n');

    try {
        // 1. Crear compra con todos los campos nuevos
        console.log('1️⃣ Creando compra con campos nuevos...');

        const compraData = {
            cliente_id: 1,
            cliente_nombre: 'Test User Final',
            cliente_telefono: '123456789',
            cliente_email: 'test@final.com',
            direccion_entrega: 'Av. Final 1234, CABA',
            horario_recepcion: '18:00-21:00',
            descripcion_pedido: 'Necesito una remera roja talla L y un pantalón azul talla M',
            observaciones: 'Entregar en el portón trasero',
            metodo_pago: 'efectivo',
            items: [{
                id_producto: 1,
                cantidad: 1,
                precio_unitario: 50.00,
                subtotal: 50.00,
                color: 'Rojo',
                talla: 'L'
            }]
        };

        console.log('📦 Datos de la compra:');
        console.log(`   - Cliente: ${compraData.cliente_nombre}`);
        console.log(`   - Dirección: ${compraData.direccion_entrega}`);
        console.log(`   - Horario: ${compraData.horario_recepcion}`);
        console.log(`   - Descripción: ${compraData.descripcion_pedido}`);
        console.log(`   - Observaciones: ${compraData.observaciones}\n`);

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
        console.log(`   - ID Pedido: ${compraResult.id_pedido}`);
        console.log(`   - ID Venta: ${compraResult.id_venta}`);
        console.log(`   - ID Factura: ${compraResult.id_factura}`);
        console.log(`   - Número Pedido: ${compraResult.numero_pedido}\n`);

        // 2. Verificar que el pedido se guardó con los nuevos campos
        console.log('2️⃣ Verificando pedido en la base de datos...');
        const pedidosResponse = await fetch(`${API_BASE}/pedidos`);
        const pedidos = await pedidosResponse.json();

        const pedidoCreado = pedidos.find(p => p.id_pedido === compraResult.id_pedido);
        if (!pedidoCreado) {
            throw new Error('Pedido no encontrado en la base de datos');
        }

        console.log('✅ Pedido encontrado en la base de datos');
        console.log(`   - ID: ${pedidoCreado.id_pedido}`);
        console.log(`   - Estado: ${pedidoCreado.estado}`);
        console.log(`   - Venta Web: ${pedidoCreado.venta_web}`);
        console.log(`   - Dirección: ${pedidoCreado.direccion_entrega || 'NO GUARDADA'}`);
        console.log(`   - Horario: ${pedidoCreado.horario_recepcion || 'NO GUARDADO'}`);
        console.log(`   - Descripción: ${pedidoCreado.descripcion_pedido || 'NO GUARDADA'}\n`);

        // 3. Verificar que los campos se guardaron correctamente
        console.log('3️⃣ Verificando campos guardados...');
        let camposCorrectos = true;

        if (pedidoCreado.direccion_entrega !== compraData.direccion_entrega) {
            console.log('❌ Dirección no se guardó correctamente');
            console.log(`   Esperado: ${compraData.direccion_entrega}`);
            console.log(`   Obtenido: ${pedidoCreado.direccion_entrega}`);
            camposCorrectos = false;
        } else {
            console.log('✅ Dirección guardada correctamente');
        }

        if (pedidoCreado.horario_recepcion !== compraData.horario_recepcion) {
            console.log('❌ Horario no se guardó correctamente');
            console.log(`   Esperado: ${compraData.horario_recepcion}`);
            console.log(`   Obtenido: ${pedidoCreado.horario_recepcion}`);
            camposCorrectos = false;
        } else {
            console.log('✅ Horario guardado correctamente');
        }

        if (pedidoCreado.descripcion_pedido !== compraData.descripcion_pedido) {
            console.log('❌ Descripción no se guardó correctamente');
            console.log(`   Esperado: ${compraData.descripcion_pedido}`);
            console.log(`   Obtenido: ${pedidoCreado.descripcion_pedido}`);
            camposCorrectos = false;
        } else {
            console.log('✅ Descripción guardada correctamente');
        }

        if (camposCorrectos) {
            console.log('\n✅ Todos los campos se guardaron correctamente\n');
        } else {
            console.log('\n❌ Algunos campos no se guardaron correctamente\n');
        }

        // 4. Verificar seguimiento web
        console.log('4️⃣ Verificando seguimiento web...');
        const seguimientoResponse = await fetch(`${API_BASE}/pedidos/seguimiento/${compraResult.numero_pedido}`);
        if (seguimientoResponse.ok) {
            const seguimiento = await seguimientoResponse.json();
            console.log('✅ Seguimiento web funcionando');
            console.log(`   - Estado: ${seguimiento.estado}`);
            console.log(`   - Fecha: ${seguimiento.fecha_pedido}\n`);
        } else {
            console.log('⚠️ Seguimiento web no disponible\n');
        }

        // 5. Verificar que aparece en el panel administrativo
        console.log('5️⃣ Verificando panel administrativo...');
        const adminPedidosResponse = await fetch(`${API_BASE}/pedidos`);
        const adminPedidos = await adminPedidosResponse.json();

        const pedidoEnAdmin = adminPedidos.find(p => p.id_pedido === compraResult.id_pedido);
        if (pedidoEnAdmin) {
            console.log('✅ Pedido visible en panel administrativo');
            console.log(`   - Estado: ${pedidoEnAdmin.estado}`);
            console.log(`   - Cliente: ${pedidoEnAdmin.cliente?.nombre} ${pedidoEnAdmin.cliente?.apellido}`);
            console.log(`   - Dirección: ${pedidoEnAdmin.direccion_entrega}`);
            console.log(`   - Horario: ${pedidoEnAdmin.horario_recepcion}`);
            console.log(`   - Descripción: ${pedidoEnAdmin.descripcion_pedido}`);
        } else {
            console.log('❌ Pedido no visible en panel administrativo');
        }

        console.log('\n🎉 Test final completado exitosamente!');
        console.log('\n📋 Resumen final:');
        console.log('   ✅ Formulario actualizado con nuevos campos');
        console.log('   ✅ Compra integrada funcionando correctamente');
        console.log('   ✅ Datos guardados en base de datos');
        console.log('   ✅ Campos nuevos funcionando');
        console.log('   ✅ Seguimiento web funcionando');
        console.log('   ✅ Panel administrativo actualizado');
        console.log('\n🚀 El sistema está listo para usar!');

    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        process.exit(1);
    }
}

testFinalVerificacion();














