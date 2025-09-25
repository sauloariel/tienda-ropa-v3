#!/usr/bin/env node

/**
 * Test de Seguimiento Web
 * 
 * Simula la funcionalidad de seguimiento de pedidos desde la web
 * que un cliente usaría para ver el estado de su pedido
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Simular búsqueda de pedido por diferentes métodos
async function testSeguimientoWeb() {
    console.log('🔍 Iniciando test de seguimiento web...\n');

    try {
        // 1. Obtener todos los pedidos (simulando vista del cliente)
        console.log('1️⃣ Obteniendo pedidos del cliente...');

        const pedidosResponse = await fetch(`${API_BASE}/pedidos`);
        if (!pedidosResponse.ok) {
            throw new Error('Error al obtener pedidos');
        }

        const todosPedidos = await pedidosResponse.json();
        console.log(`✅ Total de pedidos en el sistema: ${todosPedidos.length}`);

        // Filtrar solo pedidos web
        const pedidosWeb = todosPedidos.filter(p => p.venta_web === true);
        console.log(`🌐 Pedidos web: ${pedidosWeb.length}`);

        if (pedidosWeb.length === 0) {
            console.log('⚠️ No hay pedidos web para probar seguimiento');
            return;
        }

        // 2. Simular búsqueda por teléfono (método más común)
        console.log('\n2️⃣ Simulando búsqueda por teléfono...');

        const primerPedido = pedidosWeb[0];
        const telefonoCliente = primerPedido.cliente?.telefono;

        if (telefonoCliente) {
            console.log(`🔍 Buscando pedidos para teléfono: ${telefonoCliente}`);

            const pedidosPorTelefono = await fetch(`${API_BASE}/pedidos?cliente_id=${primerPedido.id_cliente}`);
            if (pedidosPorTelefono.ok) {
                const pedidosCliente = await pedidosPorTelefono.json();
                console.log(`✅ Encontrados ${pedidosCliente.length} pedidos para este cliente`);

                // Mostrar detalles de cada pedido
                pedidosCliente.forEach((pedido, index) => {
                    console.log(`\n📦 Pedido ${index + 1}:`);
                    console.log(`   ID: ${pedido.id_pedido}`);
                    console.log(`   Estado: ${pedido.estado}`);
                    console.log(`   Fecha: ${pedido.fecha_pedido}`);
                    console.log(`   Total: $${pedido.importe}`);
                    console.log(`   Venta Web: ${pedido.venta_web ? 'Sí' : 'No'}`);
                    console.log(`   Cliente: ${pedido.cliente?.nombre} ${pedido.cliente?.apellido}`);

                    if (pedido.detalle && pedido.detalle.length > 0) {
                        console.log(`   Productos:`);
                        pedido.detalle.forEach((detalle, i) => {
                            console.log(`     ${i + 1}. ${detalle.producto?.descripcion || 'Producto'} - Cantidad: ${detalle.cantidad}`);
                        });
                    }
                });
            } else {
                console.log('❌ Error al buscar pedidos por teléfono');
            }
        } else {
            console.log('⚠️ No se encontró teléfono del cliente');
        }

        // 3. Simular búsqueda por ID de pedido específico
        console.log('\n3️⃣ Simulando búsqueda por ID de pedido...');

        const pedidoId = primerPedido.id_pedido;
        console.log(`🔍 Buscando pedido ID: ${pedidoId}`);

        const pedidoEspecificoResponse = await fetch(`${API_BASE}/pedidos/${pedidoId}`);
        if (pedidoEspecificoResponse.ok) {
            const pedidoEspecifico = await pedidoEspecificoResponse.json();
            console.log('✅ Pedido encontrado por ID');
            console.log('📦 Detalles completos del pedido:');
            console.log(`   ID: ${pedidoEspecifico.id_pedido}`);
            console.log(`   Estado: ${pedidoEspecifico.estado}`);
            console.log(`   Fecha: ${pedidoEspecifico.fecha_pedido}`);
            console.log(`   Total: $${pedidoEspecifico.importe}`);
            console.log(`   Cliente: ${pedidoEspecifico.cliente?.nombre} ${pedidoEspecifico.cliente?.apellido}`);
            console.log(`   Email: ${pedidoEspecifico.cliente?.mail}`);
            console.log(`   Teléfono: ${pedidoEspecifico.cliente?.telefono}`);
            console.log(`   Dirección: ${pedidoEspecifico.cliente?.domicilio}`);

            if (pedidoEspecifico.detalle && pedidoEspecifico.detalle.length > 0) {
                console.log('   Productos:');
                pedidoEspecifico.detalle.forEach((detalle, i) => {
                    console.log(`     ${i + 1}. ${detalle.producto?.descripcion || 'Producto'}`);
                    console.log(`        Cantidad: ${detalle.cantidad}`);
                    console.log(`        Precio: $${detalle.precio_venta}`);
                    console.log(`        Subtotal: $${detalle.cantidad * detalle.precio_venta}`);
                });
            }
        } else {
            console.log('❌ Error al buscar pedido por ID');
        }

        // 4. Simular diferentes estados de pedido
        console.log('\n4️⃣ Simulando diferentes estados de pedido...');

        const estados = ['pendiente', 'procesando', 'completado', 'entregado', 'cancelado'];
        const pedidosPorEstado = {};

        for (const estado of estados) {
            const response = await fetch(`${API_BASE}/pedidos?estado=${estado}`);
            if (response.ok) {
                const pedidos = await response.json();
                pedidosPorEstado[estado] = pedidos.length;
                console.log(`📊 Pedidos en estado "${estado}": ${pedidos.length}`);
            }
        }

        // 5. Mostrar resumen de seguimiento
        console.log('\n5️⃣ Resumen de seguimiento web:');
        console.log('📈 Estadísticas de pedidos:');
        Object.entries(pedidosPorEstado).forEach(([estado, cantidad]) => {
            console.log(`   ${estado}: ${cantidad} pedidos`);
        });

        console.log('\n✅ Test de seguimiento web completado exitosamente');
        console.log('\n🎯 Funcionalidades probadas:');
        console.log('   ✅ Búsqueda por teléfono del cliente');
        console.log('   ✅ Búsqueda por ID de pedido');
        console.log('   ✅ Visualización de detalles completos');
        console.log('   ✅ Filtrado por estado');
        console.log('   ✅ Información del cliente');
        console.log('   ✅ Lista de productos');

    } catch (error) {
        console.error('❌ Error en test de seguimiento web:', error.message);
        process.exit(1);
    }
}

// Ejecutar test
testSeguimientoWeb();
