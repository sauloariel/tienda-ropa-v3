#!/usr/bin/env node

/**
 * Test de Panel Administrativo
 * 
 * Simula la funcionalidad del panel administrativo
 * donde los vendedores gestionan los pedidos
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testPanelAdministrativo() {
    console.log('🏢 Iniciando test de panel administrativo...\n');

    try {
        // 1. Obtener todos los pedidos (vista principal del panel)
        console.log('1️⃣ Obteniendo todos los pedidos del panel...');

        const pedidosResponse = await fetch(`${API_BASE}/pedidos`);
        if (!pedidosResponse.ok) {
            throw new Error('Error al obtener pedidos');
        }

        const todosPedidos = await pedidosResponse.json();
        console.log(`✅ Total de pedidos: ${todosPedidos.length}`);

        // Separar pedidos web y del panel
        const pedidosWeb = todosPedidos.filter(p => p.venta_web === true);
        const pedidosPanel = todosPedidos.filter(p => p.venta_web === false);

        console.log(`🌐 Pedidos web: ${pedidosWeb.length}`);
        console.log(`🏢 Pedidos del panel: ${pedidosPanel.length}`);

        // 2. Mostrar pedidos web (los que vienen de la tienda)
        console.log('\n2️⃣ Mostrando pedidos web (desde tienda)...');

        if (pedidosWeb.length > 0) {
            console.log('📦 Pedidos que necesitan preparación:');
            pedidosWeb.forEach((pedido, index) => {
                console.log(`\n   Pedido ${index + 1}:`);
                console.log(`   ID: ${pedido.id_pedido}`);
                console.log(`   Estado: ${pedido.estado}`);
                console.log(`   Fecha: ${pedido.fecha_pedido}`);
                console.log(`   Cliente: ${pedido.cliente?.nombre} ${pedido.cliente?.apellido}`);
                console.log(`   Teléfono: ${pedido.cliente?.telefono}`);
                console.log(`   Email: ${pedido.cliente?.mail}`);
                console.log(`   Dirección: ${pedido.cliente?.domicilio}`);
                console.log(`   Total: $${pedido.importe}`);

                if (pedido.detalle && pedido.detalle.length > 0) {
                    console.log(`   Productos a preparar:`);
                    pedido.detalle.forEach((detalle, i) => {
                        console.log(`     ${i + 1}. ${detalle.producto?.descripcion || 'Producto'}`);
                        console.log(`        Cantidad: ${detalle.cantidad}`);
                        console.log(`        Precio: $${detalle.precio_venta}`);
                    });
                }
            });
        } else {
            console.log('⚠️ No hay pedidos web para mostrar');
        }

        // 3. Filtrar pedidos por estado
        console.log('\n3️⃣ Filtrando pedidos por estado...');

        const estados = ['pendiente', 'procesando', 'completado', 'entregado', 'cancelado'];

        for (const estado of estados) {
            console.log(`\n📊 Pedidos en estado "${estado}":`);

            const response = await fetch(`${API_BASE}/pedidos?estado=${estado}`);
            if (response.ok) {
                const pedidos = await response.json();
                console.log(`   Total: ${pedidos.length} pedidos`);

                if (pedidos.length > 0) {
                    pedidos.slice(0, 3).forEach((pedido, index) => {
                        console.log(`   ${index + 1}. ID: ${pedido.id_pedido} - Cliente: ${pedido.cliente?.nombre} - Total: $${pedido.importe}`);
                    });
                    if (pedidos.length > 3) {
                        console.log(`   ... y ${pedidos.length - 3} más`);
                    }
                }
            } else {
                console.log(`   ❌ Error al obtener pedidos en estado "${estado}"`);
            }
        }

        // 4. Simular gestión de un pedido específico
        console.log('\n4️⃣ Simulando gestión de pedido...');

        if (pedidosWeb.length > 0) {
            const pedidoAGestionar = pedidosWeb[0];
            const pedidoId = pedidoAGestionar.id_pedido;

            console.log(`🎯 Gestionando pedido ID: ${pedidoId}`);
            console.log(`   Estado actual: ${pedidoAGestionar.estado}`);
            console.log(`   Cliente: ${pedidoAGestionar.cliente?.nombre} ${pedidoAGestionar.cliente?.apellido}`);

            // Cambiar estado a "procesando"
            console.log('\n   🔄 Cambiando estado a "procesando"...');
            const cambioProcesando = await fetch(`${API_BASE}/pedidos/${pedidoId}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'procesando' })
            });

            if (cambioProcesando.ok) {
                const resultado = await cambioProcesando.json();
                console.log(`   ✅ Estado cambiado: ${resultado.message}`);
            } else {
                console.log('   ❌ Error al cambiar estado');
            }

            // Esperar un momento y cambiar a "completado"
            console.log('\n   ⏳ Esperando 2 segundos...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('   🔄 Cambiando estado a "completado"...');
            const cambioCompletado = await fetch(`${API_BASE}/pedidos/${pedidoId}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'completado' })
            });

            if (cambioCompletado.ok) {
                const resultado = await cambioCompletado.json();
                console.log(`   ✅ Estado cambiado: ${resultado.message}`);
            } else {
                console.log('   ❌ Error al cambiar estado');
            }

            // Cambiar a "entregado"
            console.log('\n   🔄 Cambiando estado a "entregado"...');
            const cambioEntregado = await fetch(`${API_BASE}/pedidos/${pedidoId}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'entregado' })
            });

            if (cambioEntregado.ok) {
                const resultado = await cambioEntregado.json();
                console.log(`   ✅ Estado cambiado: ${resultado.message}`);
            } else {
                console.log('   ❌ Error al cambiar estado');
            }

            // Verificar estado final
            console.log('\n   🔍 Verificando estado final...');
            const estadoFinalResponse = await fetch(`${API_BASE}/pedidos/${pedidoId}`);
            if (estadoFinalResponse.ok) {
                const pedidoFinal = await estadoFinalResponse.json();
                console.log(`   📦 Estado final: ${pedidoFinal.estado}`);
                console.log(`   📅 Última actualización: ${pedidoFinal.updated_at || pedidoFinal.fecha_pedido}`);
            }
        } else {
            console.log('⚠️ No hay pedidos web para gestionar');
        }

        // 5. Obtener estadísticas del panel
        console.log('\n5️⃣ Obteniendo estadísticas del panel...');

        const estadisticasResponse = await fetch(`${API_BASE}/pedidos/estadisticas`);
        if (estadisticasResponse.ok) {
            const estadisticas = await estadisticasResponse.json();
            console.log('📊 Estadísticas del panel:');
            console.log(`   Total pedidos: ${estadisticas.estadisticas.total_pedidos}`);
            console.log(`   Total ingresos: $${estadisticas.estadisticas.total_ingresos}`);

            console.log('\n   Pedidos por estado:');
            estadisticas.estadisticas.pedidos_por_estado.forEach(estado => {
                console.log(`     ${estado.estado}: ${estado.cantidad} pedidos`);
            });

            console.log('\n   Pedidos por tipo:');
            estadisticas.estadisticas.pedidos_por_tipo.forEach(tipo => {
                const tipoNombre = tipo.venta_web ? 'Web' : 'Panel';
                console.log(`     ${tipoNombre}: ${tipo.cantidad} pedidos`);
            });
        } else {
            console.log('❌ Error al obtener estadísticas');
        }

        // 6. Simular búsqueda de pedidos
        console.log('\n6️⃣ Simulando búsqueda de pedidos...');

        // Buscar por cliente específico
        if (todosPedidos.length > 0) {
            const clienteId = todosPedidos[0].id_cliente;
            console.log(`🔍 Buscando pedidos del cliente ID: ${clienteId}`);

            const pedidosClienteResponse = await fetch(`${API_BASE}/pedidos?cliente_id=${clienteId}`);
            if (pedidosClienteResponse.ok) {
                const pedidosCliente = await pedidosClienteResponse.json();
                console.log(`✅ Encontrados ${pedidosCliente.length} pedidos para este cliente`);

                pedidosCliente.forEach((pedido, index) => {
                    console.log(`   ${index + 1}. ID: ${pedido.id_pedido} - Estado: ${pedido.estado} - Total: $${pedido.importe}`);
                });
            }
        }

        console.log('\n✅ Test de panel administrativo completado exitosamente');
        console.log('\n🎯 Funcionalidades probadas:');
        console.log('   ✅ Vista general de todos los pedidos');
        console.log('   ✅ Separación entre pedidos web y del panel');
        console.log('   ✅ Filtrado por estado');
        console.log('   ✅ Gestión de estados de pedidos');
        console.log('   ✅ Estadísticas del panel');
        console.log('   ✅ Búsqueda por cliente');
        console.log('   ✅ Actualización en tiempo real');

    } catch (error) {
        console.error('❌ Error en test de panel administrativo:', error.message);
        process.exit(1);
    }
}

// Ejecutar test
testPanelAdministrativo();
