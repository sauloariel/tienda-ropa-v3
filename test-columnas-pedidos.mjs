#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testColumnasPedidos() {
    try {
        console.log('🧪 Test de columnas de pedidos...\n');

        // 1. Obtener un pedido existente
        console.log('1️⃣ Obteniendo pedidos existentes...');
        const pedidosResponse = await fetch(`${API_BASE}/pedidos`);
        if (!pedidosResponse.ok) {
            throw new Error('Error al obtener pedidos');
        }

        const pedidos = await pedidosResponse.json();
        console.log(`✅ Pedidos encontrados: ${pedidos.length}`);

        if (pedidos.length === 0) {
            throw new Error('No hay pedidos para probar');
        }

        const pedido = pedidos[0];
        console.log('📋 Primer pedido:', pedido.id_pedido);
        console.log('');

        // 2. Verificar si tiene los nuevos campos
        console.log('2️⃣ Verificando nuevos campos...');
        const camposNuevos = {
            direccion_entrega: 'direccion_entrega' in pedido,
            horario_recepcion: 'horario_recepcion' in pedido,
            descripcion_pedido: 'descripcion_pedido' in pedido
        };

        console.log('📊 Campos disponibles:');
        console.log('   📍 direccion_entrega:', camposNuevos.direccion_entrega ? '✅' : '❌');
        console.log('   ⏰ horario_recepcion:', camposNuevos.horario_recepcion ? '✅' : '❌');
        console.log('   📝 descripcion_pedido:', camposNuevos.descripcion_pedido ? '✅' : '❌');
        console.log('');

        // 3. Mostrar valores actuales
        console.log('3️⃣ Valores actuales:');
        if (pedido.direccion_entrega) {
            console.log('   📍 Dirección:', pedido.direccion_entrega);
        } else {
            console.log('   📍 Dirección: (vacío)');
        }

        if (pedido.horario_recepcion) {
            console.log('   ⏰ Horario:', pedido.horario_recepcion);
        } else {
            console.log('   ⏰ Horario: (vacío)');
        }

        if (pedido.descripcion_pedido) {
            console.log('   📝 Descripción:', pedido.descripcion_pedido);
        } else {
            console.log('   📝 Descripción: (vacío)');
        }
        console.log('');

        // 4. Verificar estructura completa del pedido
        console.log('4️⃣ Estructura completa del pedido:');
        const camposPedido = Object.keys(pedido);
        console.log('📋 Campos disponibles:', camposPedido.length);
        camposPedido.forEach(campo => {
            const valor = pedido[campo];
            const tipo = typeof valor;
            const tieneValor = valor !== null && valor !== undefined && valor !== '';
            console.log(`   ${tieneValor ? '✅' : '⚪'} ${campo}: ${tipo} ${tieneValor ? `(${valor})` : '(vacío)'}`);
        });
        console.log('');

        // 5. Resumen
        const todosCamposDisponibles = Object.values(camposNuevos).every(v => v);

        console.log('🎉 ¡Test de columnas completado!');
        console.log('');

        if (todosCamposDisponibles) {
            console.log('✅ TODAS LAS COLUMNAS ESTÁN DISPONIBLES');
            console.log('   El modelo de pedidos se actualizó correctamente.');
            console.log('   El panel administrativo puede mostrar la nueva información.');
        } else {
            console.log('⚠️  FALTAN ALGUNAS COLUMNAS');
            console.log('   Es posible que necesites reiniciar el servidor o actualizar la base de datos.');
        }

    } catch (error) {
        console.error('❌ Error en test de columnas:', error.message);
        console.error('Stack:', error.stack);
    }
}

testColumnasPedidos();























