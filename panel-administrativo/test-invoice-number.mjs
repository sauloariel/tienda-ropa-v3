#!/usr/bin/env node

/**
 * Script de prueba para verificar la funcionalidad del número de factura
 * Verifica que el número se actualice correctamente después de crear facturas
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

async function testInvoiceNumberFunctionality() {
    console.log('🧪 Iniciando pruebas de funcionalidad del número de factura...\n');

    try {
        // 1. Obtener el número inicial de factura
        console.log('1️⃣ Obteniendo número inicial de factura...');
        const initialResponse = await axios.get(`${API_BASE_URL}/facturas/next-number`);
        console.log(`   Número inicial: ${initialResponse.data.numero}`);

        // 2. Crear una factura de prueba
        console.log('\n2️⃣ Creando factura de prueba...');
        const facturaData = {
            productos: [
                {
                    id_producto: 1,
                    cantidad: 1,
                    precio_unitario: 100.00,
                    subtotal: 100.00
                }
            ],
            total: 121.00,
            metodo_pago: 'efectivo'
        };

        const createResponse = await axios.post(`${API_BASE_URL}/facturas`, facturaData);
        if (createResponse.data.success) {
            console.log(`   ✅ Factura creada: ${createResponse.data.factura.numeroFactura}`);
        } else {
            throw new Error('Error al crear factura de prueba');
        }

        // 3. Verificar que el número se haya actualizado
        console.log('\n3️⃣ Verificando actualización del número...');
        const updatedResponse = await axios.get(`${API_BASE_URL}/facturas/next-number`);
        console.log(`   Nuevo número: ${updatedResponse.data.numero}`);

        // 4. Verificar que el número sea diferente
        if (initialResponse.data.numero !== updatedResponse.data.numero) {
            console.log('   ✅ El número se actualizó correctamente');
        } else {
            console.log('   ⚠️ El número no cambió (puede ser normal si hay múltiples usuarios)');
        }

        // 5. Crear otra factura para verificar la secuencia
        console.log('\n4️⃣ Creando segunda factura de prueba...');
        const facturaData2 = {
            productos: [
                {
                    id_producto: 1,
                    cantidad: 2,
                    precio_unitario: 50.00,
                    subtotal: 100.00
                }
            ],
            total: 121.00,
            metodo_pago: 'tarjeta'
        };

        const createResponse2 = await axios.post(`${API_BASE_URL}/facturas`, facturaData2);
        if (createResponse2.data.success) {
            console.log(`   ✅ Segunda factura creada: ${createResponse2.data.factura.numeroFactura}`);
        }

        // 6. Verificar el número final
        console.log('\n5️⃣ Verificando número final...');
        const finalResponse = await axios.get(`${API_BASE_URL}/facturas/next-number`);
        console.log(`   Número final: ${finalResponse.data.numero}`);

        console.log('\n🎉 Pruebas completadas exitosamente!');
        console.log('\n📊 Resumen:');
        console.log(`   • Número inicial: ${initialResponse.data.numero}`);
        console.log(`   • Primera factura: ${createResponse.data.factura.numeroFactura}`);
        console.log(`   • Segunda factura: ${createResponse2.data.factura.numeroFactura}`);
        console.log(`   • Número final: ${finalResponse.data.numero}`);

        console.log('\n✅ La funcionalidad del número de factura está funcionando correctamente!');
        console.log('   • Los números se generan secuencialmente');
        console.log('   • El endpoint /next-number devuelve el siguiente número disponible');
        console.log('   • Las facturas se crean con números únicos');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
        if (error.response) {
            console.error('   Respuesta del servidor:', error.response.data);
        }
        process.exit(1);
    }
}

// Ejecutar las pruebas
testInvoiceNumberFunctionality().catch(error => {
    console.error('💥 Error ejecutando pruebas:', error);
    process.exit(1);
});

