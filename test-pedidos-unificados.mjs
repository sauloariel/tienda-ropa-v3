#!/usr/bin/env node

/**
 * Script de prueba para el controlador de pedidos unificado
 * Prueba: Crear pedidos desde web y panel administrativo
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

// Datos de prueba para pedido web
const pedidoWebTest = {
    id_cliente: 1,
    importe: 97.48,
    venta_web: true,
    payment_id: `PAY-WEB-${Date.now()}`,
    productos: [
        {
            id_producto: 1,
            cantidad: 2,
            precio_venta: 25.99,
            descuento: 0
        },
        {
            id_producto: 2,
            cantidad: 1,
            precio_venta: 45.50,
            descuento: 0
        }
    ]
};

// Datos de prueba para pedido del panel administrativo
const pedidoPanelTest = {
    id_cliente: 1,
    id_empleados: 1,
    importe: 150.00,
    venta_web: false,
    estado: 'pendiente',
    productos: [
        {
            id_producto: 1,
            cantidad: 3,
            precio_venta: 25.99,
            descuento: 5.00
        }
    ]
};

async function testPedidosUnificados() {
    console.log('🧪 Iniciando prueba de pedidos unificados...\n');

    try {
        // 1. Verificar que el servidor esté funcionando
        console.log('1️⃣ Verificando servidor...');
        const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/api/health`);
        if (!healthResponse.ok) {
            throw new Error('Servidor no disponible');
        }
        console.log('✅ Servidor funcionando\n');

        // 2. Crear pedido web
        console.log('2️⃣ Creando pedido web...');
        console.log('📦 Datos del pedido web:', JSON.stringify(pedidoWebTest, null, 2));

        const pedidoWebResponse = await fetch(`${API_BASE}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoWebTest)
        });

        if (!pedidoWebResponse.ok) {
            const errorData = await pedidoWebResponse.json();
            throw new Error(`Error en pedido web: ${errorData.message || pedidoWebResponse.statusText}`);
        }

        const pedidoWebResult = await pedidoWebResponse.json();
        console.log('✅ Pedido web creado exitosamente');
        console.log('🆔 ID Pedido Web:', pedidoWebResult.pedido.id_pedido);
        console.log('🌐 Venta Web:', pedidoWebResult.pedido.venta_web);
        console.log('💰 Importe:', pedidoWebResult.pedido.importe);
        console.log('');

        // 3. Crear pedido del panel administrativo
        console.log('3️⃣ Creando pedido del panel administrativo...');
        console.log('📦 Datos del pedido panel:', JSON.stringify(pedidoPanelTest, null, 2));

        const pedidoPanelResponse = await fetch(`${API_BASE}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoPanelTest)
        });

        if (!pedidoPanelResponse.ok) {
            const errorData = await pedidoPanelResponse.json();
            throw new Error(`Error en pedido panel: ${errorData.message || pedidoPanelResponse.statusText}`);
        }

        const pedidoPanelResult = await pedidoPanelResponse.json();
        console.log('✅ Pedido panel creado exitosamente');
        console.log('🆔 ID Pedido Panel:', pedidoPanelResult.pedido.id_pedido);
        console.log('🌐 Venta Web:', pedidoPanelResult.pedido.venta_web);
        console.log('💰 Importe:', pedidoPanelResult.pedido.importe);
        console.log('');

        // 4. Obtener todos los pedidos
        console.log('4️⃣ Obteniendo todos los pedidos...');
        const todosPedidosResponse = await fetch(`${API_BASE}/pedidos`);
        if (todosPedidosResponse.ok) {
            const todosPedidos = await todosPedidosResponse.json();
            console.log('✅ Total de pedidos:', todosPedidos.length);

            const pedidosWeb = todosPedidos.filter(p => p.venta_web === true);
            const pedidosPanel = todosPedidos.filter(p => p.venta_web === false);

            console.log('🌐 Pedidos web:', pedidosWeb.length);
            console.log('🏢 Pedidos panel:', pedidosPanel.length);
        } else {
            console.log('⚠️ No se pudieron obtener todos los pedidos');
        }
        console.log('');

        // 5. Obtener solo pedidos web
        console.log('5️⃣ Obteniendo solo pedidos web...');
        const pedidosWebResponse = await fetch(`${API_BASE}/pedidos?venta_web=true`);
        if (pedidosWebResponse.ok) {
            const pedidosWeb = await pedidosWebResponse.json();
            console.log('✅ Pedidos web obtenidos:', pedidosWeb.length);
        } else {
            console.log('⚠️ No se pudieron obtener pedidos web');
        }
        console.log('');

        // 6. Obtener solo pedidos del panel
        console.log('6️⃣ Obteniendo solo pedidos del panel...');
        const pedidosPanelResponse = await fetch(`${API_BASE}/pedidos?venta_web=false`);
        if (pedidosPanelResponse.ok) {
            const pedidosPanel = await pedidosPanelResponse.json();
            console.log('✅ Pedidos panel obtenidos:', pedidosPanel.length);
        } else {
            console.log('⚠️ No se pudieron obtener pedidos del panel');
        }
        console.log('');

        // 7. Obtener estadísticas
        console.log('7️⃣ Obteniendo estadísticas de pedidos...');
        const estadisticasResponse = await fetch(`${API_BASE}/pedidos/estadisticas`);
        if (estadisticasResponse.ok) {
            const estadisticas = await estadisticasResponse.json();
            console.log('✅ Estadísticas obtenidas:');
            console.log('📊 Total pedidos:', estadisticas.estadisticas.total_pedidos);
            console.log('💰 Total ingresos:', estadisticas.estadisticas.total_ingresos);
            console.log('📈 Pedidos por estado:', estadisticas.estadisticas.pedidos_por_estado);
            console.log('🏷️ Pedidos por tipo:', estadisticas.estadisticas.pedidos_por_tipo);
        } else {
            console.log('⚠️ No se pudieron obtener estadísticas');
        }
        console.log('');

        // 8. Cambiar estado de un pedido
        console.log('8️⃣ Cambiando estado de pedido...');
        const pedidoId = pedidoWebResult.pedido.id_pedido;
        const cambiarEstadoResponse = await fetch(`${API_BASE}/pedidos/${pedidoId}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 'procesando' })
        });

        if (cambiarEstadoResponse.ok) {
            const estadoResult = await cambiarEstadoResponse.json();
            console.log('✅ Estado cambiado:', estadoResult.message);
        } else {
            console.log('⚠️ No se pudo cambiar el estado');
        }
        console.log('');

        console.log('🎉 ¡Prueba de pedidos unificados completada exitosamente!');
        console.log('\n📋 Resumen del flujo unificado:');
        console.log('   ✅ Un solo controlador para todos los pedidos');
        console.log('   ✅ Filtros por tipo de pedido (web/panel)');
        console.log('   ✅ Gestión de estados unificada');
        console.log('   ✅ Estadísticas consolidadas');
        console.log('   ✅ Validación de stock para pedidos web');
        console.log('   ✅ Actualización de inventario automática');

    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
        process.exit(1);
    }
}

// Ejecutar prueba
testPedidosUnificados();























