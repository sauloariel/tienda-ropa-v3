#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testColumnasSimple() {
    try {
        console.log('🧪 Test simple de columnas...\n');

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
        console.log('📋 Primer pedido ID:', pedido.id_pedido);
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
        console.log('   📍 Dirección:', pedido.direccion_entrega || '(vacío)');
        console.log('   ⏰ Horario:', pedido.horario_recepcion || '(vacío)');
        console.log('   📝 Descripción:', pedido.descripcion_pedido || '(vacío)');
        console.log('');

        // 4. Resumen
        const todosCamposDisponibles = Object.values(camposNuevos).every(v => v);

        console.log('🎉 ¡Test completado!');
        console.log('');

        if (todosCamposDisponibles) {
            console.log('✅ TODAS LAS COLUMNAS ESTÁN DISPONIBLES');
            console.log('   El formulario mejorado puede guardar la información.');
            console.log('   El panel administrativo puede mostrar los datos.');
        } else {
            console.log('⚠️  FALTAN ALGUNAS COLUMNAS');
            console.log('   Es posible que necesites reiniciar el servidor.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testColumnasSimple();














