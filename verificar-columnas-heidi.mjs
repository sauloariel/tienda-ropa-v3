#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function verificarColumnasHeidi() {
    try {
        console.log('🔍 Verificando columnas para HeidiSQL...\n');

        // Obtener un pedido y mostrar todas sus propiedades
        const pedidosResponse = await fetch(`${API_BASE}/pedidos`);
        const pedidos = await pedidosResponse.json();

        if (pedidos.length === 0) {
            console.log('❌ No hay pedidos para verificar');
            return;
        }

        const pedido = pedidos[0];
        console.log('📋 Estructura del pedido:');
        console.log('========================');

        // Mostrar todas las propiedades del pedido
        Object.keys(pedido).forEach((key, index) => {
            const valor = pedido[key];
            const tipo = typeof valor;
            const tieneValor = valor !== null && valor !== undefined && valor !== '';
            console.log(`${(index + 1).toString().padStart(2, '0')}. ${key.padEnd(20)} | ${tipo.padEnd(8)} | ${tieneValor ? '✅' : '⚪'} ${tieneValor ? `"${valor}"` : '(vacío)'}`);
        });

        console.log('\n🎯 Columnas que deberías ver en HeidiSQL:');
        console.log('==========================================');

        const columnasNuevas = ['direccion_entrega', 'horario_recepcion', 'descripcion_pedido'];
        columnasNuevas.forEach((columna, index) => {
            const existe = columna in pedido;
            console.log(`${index + 1}. ${columna.padEnd(20)} | ${existe ? '✅ EXISTE' : '❌ NO EXISTE'}`);
        });

        console.log('\n💡 Si no ves las columnas en HeidiSQL:');
        console.log('   1. Refresca la tabla (F5)');
        console.log('   2. Haz scroll hacia la derecha');
        console.log('   3. Verifica que estés en la base de datos "ecommerce"');
        console.log('   4. Verifica que estés en la tabla "pedidos"');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

verificarColumnasHeidi();























