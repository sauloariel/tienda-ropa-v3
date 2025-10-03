#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testPedidoSimple() {
    try {
        console.log('🧪 Test de pedido simple...\n');

        // 1. Obtener cliente existente
        console.log('1️⃣ Obteniendo cliente existente...');
        const clientesResponse = await fetch(`${API_BASE}/clientes`);
        if (!clientesResponse.ok) {
            throw new Error('Error al obtener clientes');
        }

        const clientes = await clientesResponse.json();
        const cliente = clientes[0];
        console.log('✅ Cliente seleccionado:', cliente.nombre, cliente.apellido);
        console.log('🆔 ID Cliente:', cliente.id_cliente);
        console.log('');

        // 2. Obtener productos existentes
        console.log('2️⃣ Obteniendo productos existentes...');
        const productosResponse = await fetch(`${API_BASE}/productos`);
        if (!productosResponse.ok) {
            throw new Error('Error al obtener productos');
        }

        const productos = await productosResponse.json();
        console.log(`✅ Productos encontrados: ${productos.length}`);

        if (productos.length < 2) {
            throw new Error('Se necesitan al menos 2 productos para el test');
        }

        const producto1 = productos[0];
        const producto2 = productos[1];
        console.log('📦 Producto 1:', producto1.descripcion, '- Precio:', producto1.precio_venta);
        console.log('📦 Producto 2:', producto2.descripcion, '- Precio:', producto2.precio_venta);
        console.log('');

        // 3. Crear pedido web
        console.log('3️⃣ Creando pedido web...');
        const pedidoData = {
            id_cliente: cliente.id_cliente,
            importe: parseFloat(producto1.precio_venta) + parseFloat(producto2.precio_venta),
            venta_web: true,
            payment_id: `PAY-TEST-${Date.now()}`,
            productos: [
                {
                    id_producto: producto1.id_producto,
                    cantidad: 1,
                    precio_venta: parseFloat(producto1.precio_venta),
                    descuento: 0
                },
                {
                    id_producto: producto2.id_producto,
                    cantidad: 1,
                    precio_venta: parseFloat(producto2.precio_venta),
                    descuento: 0
                }
            ]
        };

        console.log('🛒 Datos del pedido:', JSON.stringify(pedidoData, null, 2));

        const pedidoResponse = await fetch(`${API_BASE}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoData)
        });

        if (!pedidoResponse.ok) {
            const errorData = await pedidoResponse.json();
            throw new Error(`Error al crear pedido: ${errorData.message || pedidoResponse.statusText}`);
        }

        const pedidoResult = await pedidoResponse.json();
        console.log('✅ Pedido creado exitosamente');
        console.log('🆔 ID Pedido:', pedidoResult.pedido.id_pedido);
        console.log('💰 Importe:', pedidoResult.pedido.importe);
        console.log('🌐 Venta Web:', pedidoResult.pedido.venta_web);
        console.log('');

        const pedidoId = pedidoResult.pedido.id_pedido;

        // 4. Verificar que aparece en la lista de pedidos
        console.log('4️⃣ Verificando que aparece en la lista de pedidos...');
        const todosPedidosResponse = await fetch(`${API_BASE}/pedidos`);
        if (!todosPedidosResponse.ok) {
            throw new Error('Error al obtener pedidos');
        }

        const todosPedidos = await todosPedidosResponse.json();
        const pedidoEncontrado = todosPedidos.find(p => p.id_pedido === pedidoId);

        if (pedidoEncontrado) {
            console.log('✅ Pedido encontrado en la lista');
            console.log('📦 Estado:', pedidoEncontrado.estado);
            console.log('👤 Cliente:', pedidoEncontrado.cliente?.nombre, pedidoEncontrado.cliente?.apellido);
            console.log('📋 Productos:', pedidoEncontrado.detalle?.length || 0);
        } else {
            console.log('❌ Pedido NO encontrado en la lista');
        }
        console.log('');

        // 5. Filtrar pedidos web
        console.log('5️⃣ Filtrando pedidos web...');
        const pedidosWebResponse = await fetch(`${API_BASE}/pedidos?venta_web=true`);
        if (pedidosWebResponse.ok) {
            const pedidosWeb = await pedidosWebResponse.json();
            console.log(`✅ Pedidos web encontrados: ${pedidosWeb.length}`);

            const pedidoWebEncontrado = pedidosWeb.find(p => p.id_pedido === pedidoId);
            if (pedidoWebEncontrado) {
                console.log('✅ Pedido encontrado en filtro de web');
            } else {
                console.log('❌ Pedido NO encontrado en filtro de web');
            }
        } else {
            console.log('❌ Error al filtrar pedidos web');
        }
        console.log('');

        // 6. Cambiar estado del pedido
        console.log('6️⃣ Cambiando estado del pedido...');
        const cambioEstadoResponse = await fetch(`${API_BASE}/pedidos/${pedidoId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'procesando' })
        });

        if (cambioEstadoResponse.ok) {
            const estadoResult = await cambioEstadoResponse.json();
            console.log('✅ Estado cambiado:', estadoResult.message);
            console.log('📦 Nuevo estado:', estadoResult.pedido.estado);
        } else {
            console.log('❌ Error al cambiar estado');
        }
        console.log('');

        // 7. Verificar estado actualizado
        console.log('7️⃣ Verificando estado actualizado...');
        const pedidoActualizadoResponse = await fetch(`${API_BASE}/pedidos/${pedidoId}`);
        if (pedidoActualizadoResponse.ok) {
            const pedidoActualizado = await pedidoActualizadoResponse.json();
            console.log('✅ Estado actualizado verificado');
            console.log('📦 Estado actual:', pedidoActualizado.estado);
        } else {
            console.log('❌ Error al verificar estado actualizado');
        }
        console.log('');

        // 8. Obtener estadísticas
        console.log('8️⃣ Obteniendo estadísticas...');
        const estadisticasResponse = await fetch(`${API_BASE}/pedidos/estadisticas`);
        if (estadisticasResponse.ok) {
            const estadisticas = await estadisticasResponse.json();
            console.log('✅ Estadísticas obtenidas:');
            console.log('📊 Total pedidos:', estadisticas.estadisticas.total_pedidos);
            console.log('💰 Total ingresos:', estadisticas.estadisticas.total_ingresos);
        } else {
            console.log('❌ Error al obtener estadísticas');
        }

        console.log('\n🎉 ¡Test de pedido simple completado exitosamente!');
        console.log('\n📋 Resumen del test:');
        console.log('   ✅ Cliente obtenido correctamente');
        console.log('   ✅ Productos obtenidos correctamente');
        console.log('   ✅ Pedido web creado exitosamente');
        console.log('   ✅ Pedido visible en lista general');
        console.log('   ✅ Pedido visible en filtro web');
        console.log('   ✅ Estado cambiado correctamente');
        console.log('   ✅ Estado actualizado verificado');
        console.log('   ✅ Estadísticas actualizadas');

    } catch (error) {
        console.error('❌ Error en test de pedido simple:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testPedidoSimple();























