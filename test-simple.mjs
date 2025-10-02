#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testSimple() {
    try {
        console.log('🧪 Test simple...');

        // 1. Verificar servidor
        console.log('1️⃣ Verificando servidor...');
        const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/api/health`);
        if (!healthResponse.ok) {
            throw new Error('Servidor no disponible');
        }
        console.log('✅ Servidor funcionando');

        // 2. Obtener clientes existentes
        console.log('\n2️⃣ Obteniendo clientes existentes...');
        const clientesResponse = await fetch(`${API_BASE}/clientes`);
        if (!clientesResponse.ok) {
            throw new Error('Error al obtener clientes');
        }

        const clientes = await clientesResponse.json();
        console.log(`✅ Clientes encontrados: ${clientes.length}`);

        if (clientes.length > 0) {
            console.log('📋 Primer cliente:', clientes[0]);
        }

        // 3. Obtener pedidos existentes
        console.log('\n3️⃣ Obteniendo pedidos existentes...');
        const pedidosResponse = await fetch(`${API_BASE}/pedidos`);
        if (!pedidosResponse.ok) {
            throw new Error('Error al obtener pedidos');
        }

        const pedidos = await pedidosResponse.json();
        console.log(`✅ Pedidos encontrados: ${pedidos.length}`);

        if (pedidos.length > 0) {
            console.log('📋 Primer pedido:', pedidos[0]);
        }

        // 4. Obtener productos existentes
        console.log('\n4️⃣ Obteniendo productos existentes...');
        const productosResponse = await fetch(`${API_BASE}/productos`);
        if (!productosResponse.ok) {
            throw new Error('Error al obtener productos');
        }

        const productos = await productosResponse.json();
        console.log(`✅ Productos encontrados: ${productos.length}`);

        if (productos.length > 0) {
            console.log('📋 Primer producto:', productos[0]);
        }

        console.log('\n✅ Test simple completado exitosamente');

    } catch (error) {
        console.error('❌ Error en test simple:', error.message);
        console.error('Stack:', error.stack);
    }
}

testSimple();



















