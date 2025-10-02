#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testPedidoBasico() {
    try {
        console.log('🧪 Test de pedido básico...\n');

        // 1. Obtener cliente existente
        console.log('1️⃣ Obteniendo cliente existente...');
        const clientesResponse = await fetch(`${API_BASE}/clientes`);
        const clientes = await clientesResponse.json();
        const cliente = clientes[0];
        console.log('✅ Cliente:', cliente.nombre, cliente.apellido, '(ID:', cliente.id_cliente + ')');
        console.log('');

        // 2. Crear pedido del panel (sin validación de stock)
        console.log('2️⃣ Creando pedido del panel...');
        const pedidoData = {
            id_cliente: cliente.id_cliente,
            importe: 100.00,
            venta_web: false, // Pedido del panel, no web
            productos: [
                {
                    id_producto: 1,
                    cantidad: 1,
                    precio_venta: 50.00,
                    descuento: 0
                },
                {
                    id_producto: 2,
                    cantidad: 1,
                    precio_venta: 50.00,
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
            const errorText = await pedidoResponse.text();
            console.log('❌ Error response:', errorText);
            throw new Error(`Error al crear pedido: ${pedidoResponse.status} ${pedidoResponse.statusText}`);
        }

        const pedidoResult = await pedidoResponse.json();
        console.log('✅ Pedido creado exitosamente');
        console.log('🆔 ID Pedido:', pedidoResult.pedido.id_pedido);
        console.log('💰 Importe:', pedidoResult.pedido.importe);
        console.log('🌐 Venta Web:', pedidoResult.pedido.venta_web);
        console.log('');

        const pedidoId = pedidoResult.pedido.id_pedido;

        // 3. Verificar que aparece en la lista
        console.log('3️⃣ Verificando que aparece en la lista...');
        const todosPedidosResponse = await fetch(`${API_BASE}/pedidos`);
        const todosPedidos = await todosPedidosResponse.json();
        const pedidoEncontrado = todosPedidos.find(p => p.id_pedido === pedidoId);

        if (pedidoEncontrado) {
            console.log('✅ Pedido encontrado en la lista');
            console.log('📦 Estado:', pedidoEncontrado.estado);
            console.log('👤 Cliente:', pedidoEncontrado.cliente?.nombre, pedidoEncontrado.cliente?.apellido);
        } else {
            console.log('❌ Pedido NO encontrado en la lista');
        }
        console.log('');

        // 4. Cambiar estado
        console.log('4️⃣ Cambiando estado...');
        const cambioEstadoResponse = await fetch(`${API_BASE}/pedidos/${pedidoId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'procesando' })
        });

        if (cambioEstadoResponse.ok) {
            const estadoResult = await cambioEstadoResponse.json();
            console.log('✅ Estado cambiado:', estadoResult.message);
        } else {
            console.log('❌ Error al cambiar estado');
        }

        console.log('\n🎉 ¡Test de pedido básico completado!');

    } catch (error) {
        console.error('❌ Error en test de pedido básico:', error.message);
        console.error('Stack:', error.stack);
    }
}

testPedidoBasico();



















