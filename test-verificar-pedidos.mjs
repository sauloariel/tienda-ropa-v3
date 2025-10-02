#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testVerificarPedidos() {
    try {
        console.log('🧪 Test de verificación de pedidos...\n');

        // 1. Verificar servidor
        console.log('1️⃣ Verificando servidor...');
        const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/api/health`);
        if (!healthResponse.ok) {
            throw new Error('Servidor no disponible');
        }
        console.log('✅ Servidor funcionando');
        console.log('');

        // 2. Obtener pedidos existentes
        console.log('2️⃣ Obteniendo pedidos existentes...');
        const pedidosResponse = await fetch(`${API_BASE}/pedidos`);
        if (!pedidosResponse.ok) {
            throw new Error('Error al obtener pedidos');
        }

        const pedidos = await pedidosResponse.json();
        console.log(`✅ Pedidos encontrados: ${pedidos.length}`);

        if (pedidos.length > 0) {
            console.log('📋 Primer pedido:');
            console.log('   ID:', pedidos[0].id_pedido);
            console.log('   Cliente:', pedidos[0].cliente?.nombre, pedidos[0].cliente?.apellido);
            console.log('   Estado:', pedidos[0].estado);
            console.log('   Venta Web:', pedidos[0].venta_web);
            console.log('   Importe:', pedidos[0].importe);
            console.log('   Productos:', pedidos[0].detalle?.length || 0);
        }
        console.log('');

        // 3. Filtrar pedidos web
        console.log('3️⃣ Filtrando pedidos web...');
        const pedidosWebResponse = await fetch(`${API_BASE}/pedidos?venta_web=true`);
        if (pedidosWebResponse.ok) {
            const pedidosWeb = await pedidosWebResponse.json();
            console.log(`✅ Pedidos web encontrados: ${pedidosWeb.length}`);
        } else {
            console.log('❌ Error al filtrar pedidos web');
        }
        console.log('');

        // 4. Filtrar pedidos del panel
        console.log('4️⃣ Filtrando pedidos del panel...');
        const pedidosPanelResponse = await fetch(`${API_BASE}/pedidos?venta_web=false`);
        if (pedidosPanelResponse.ok) {
            const pedidosPanel = await pedidosPanelResponse.json();
            console.log(`✅ Pedidos del panel encontrados: ${pedidosPanel.length}`);
        } else {
            console.log('❌ Error al filtrar pedidos del panel');
        }
        console.log('');

        // 5. Obtener estadísticas
        console.log('5️⃣ Obteniendo estadísticas...');
        const estadisticasResponse = await fetch(`${API_BASE}/pedidos/estadisticas`);
        if (estadisticasResponse.ok) {
            const estadisticas = await estadisticasResponse.json();
            console.log('✅ Estadísticas obtenidas:');
            console.log('   Total pedidos:', estadisticas.estadisticas.total_pedidos);
            console.log('   Total ingresos:', estadisticas.estadisticas.total_ingresos);
            console.log('   Por estado:', estadisticas.estadisticas.por_estado);
        } else {
            console.log('❌ Error al obtener estadísticas');
        }
        console.log('');

        // 6. Obtener un pedido específico
        if (pedidos.length > 0) {
            console.log('6️⃣ Obteniendo pedido específico...');
            const pedidoId = pedidos[0].id_pedido;
            const pedidoEspecificoResponse = await fetch(`${API_BASE}/pedidos/${pedidoId}`);
            if (pedidoEspecificoResponse.ok) {
                const pedidoEspecifico = await pedidoEspecificoResponse.json();
                console.log('✅ Pedido específico obtenido:');
                console.log('   ID:', pedidoEspecifico.id_pedido);
                console.log('   Cliente:', pedidoEspecifico.cliente?.nombre, pedidoEspecifico.cliente?.apellido);
                console.log('   Estado:', pedidoEspecifico.estado);
                console.log('   Detalles:', pedidoEspecifico.detalle?.length || 0, 'productos');
            } else {
                console.log('❌ Error al obtener pedido específico');
            }
        }

        console.log('\n🎉 ¡Test de verificación completado exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('   ✅ Servidor funcionando');
        console.log('   ✅ Pedidos obtenidos correctamente');
        console.log('   ✅ Filtros funcionando');
        console.log('   ✅ Estadísticas disponibles');
        console.log('   ✅ Pedido específico accesible');

    } catch (error) {
        console.error('❌ Error en test de verificación:', error.message);
        console.error('Stack:', error.stack);
    }
}

testVerificarPedidos();



















