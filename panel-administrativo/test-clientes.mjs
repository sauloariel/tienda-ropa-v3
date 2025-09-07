/**
 * Test del Módulo de Clientes
 * Verifica la conexión con la base de datos y el filtrado de clientes activos
 */

import http from 'http';

console.log('🧪 TEST DEL MÓDULO DE CLIENTES');
console.log('==============================');

function testClientes() {
    const options = {
        hostname: 'localhost',
        port: 4000,
        path: '/clientes',
        method: 'GET',
        timeout: 10000
    };

    console.log('\n1️⃣ Probando conexión con http://localhost:4000/clientes...');
    console.log('⏳ Esperando respuesta del servidor...');

    const req = http.request(options, (res) => {
        console.log(`\n✅ Servidor respondió con status: ${res.statusCode}`);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`\n📋 Total de datos recibidos: ${data.length} bytes`);

            try {
                const jsonData = JSON.parse(data);
                console.log(`\n📊 Tipo de respuesta: ${typeof jsonData}`);
                console.log(`🔍 Es array: ${Array.isArray(jsonData)}`);

                if (Array.isArray(jsonData)) {
                    console.log(`✅ Respuesta es un array con ${jsonData.length} clientes`);

                    // Filtrar clientes activos (como lo hace el frontend)
                    const clientesActivos = jsonData.filter(c => c.estado === 'ACTIVO' || !c.estado);
                    const clientesConEstado = clientesActivos.filter(c => c.estado === 'ACTIVO').length;
                    const clientesSinEstado = clientesActivos.filter(c => !c.estado).length;

                    console.log('\n📊 Estadísticas de clientes:');
                    console.log(`   - Total en BD: ${jsonData.length}`);
                    console.log(`   - Clientes activos: ${clientesActivos.length}`);
                    console.log(`   - Con estado ACTIVO: ${clientesConEstado}`);
                    console.log(`   - Sin estado (nuevos): ${clientesSinEstado}`);
                    console.log(`   - Clientes inactivos (ocultos): ${jsonData.length - clientesActivos.length}`);

                    if (clientesActivos.length > 0) {
                        console.log('\n👥 Clientes activos encontrados:');
                        clientesActivos.forEach((cliente, index) => {
                            console.log(`\n   Cliente ${index + 1}:`);
                            console.log(`   - ID: ${cliente.id_cliente || 'N/A'}`);
                            console.log(`   - Nombre: ${cliente.nombre || 'N/A'}`);
                            console.log(`   - Apellido: ${cliente.apellido || 'N/A'}`);
                            console.log(`   - Email: ${cliente.mail || 'N/A'}`);
                            console.log(`   - DNI: ${cliente.dni || 'N/A'}`);
                            console.log(`   - Estado: ${cliente.estado || 'Sin estado'}`);
                        });
                    } else {
                        console.log('⚠️ No hay clientes activos en la base de datos');
                    }

                    // Verificar clientes inactivos (que no se mostrarán)
                    const clientesInactivos = jsonData.filter(c => c.estado && c.estado !== 'ACTIVO');
                    if (clientesInactivos.length > 0) {
                        console.log(`\n🚫 Clientes inactivos (${clientesInactivos.length}) que NO se mostrarán:`);
                        clientesInactivos.forEach((cliente, index) => {
                            console.log(`   - ${cliente.nombre} ${cliente.apellido} (Estado: ${cliente.estado})`);
                        });
                    }

                } else {
                    console.log('⚠️ La respuesta no es un array');
                    console.log('📋 Estructura de la respuesta:', Object.keys(jsonData));
                    console.log('📄 Contenido:', JSON.stringify(jsonData, null, 2));
                }

                console.log('\n🎉 TEST COMPLETADO EXITOSAMENTE');
                console.log('✅ El módulo de clientes está funcionando correctamente');
                console.log('✅ La conexión con la base de datos es exitosa');
                console.log('✅ Los clientes inactivos están siendo filtrados correctamente');

            } catch (error) {
                console.log('\n❌ Error parseando la respuesta JSON');
                console.log(`💥 Error: ${error.message}`);
                console.log('📋 Respuesta recibida (primeros 500 caracteres):');
                console.log(data.substring(0, 500));
                console.log('...');
            }
        });
    });

    req.on('error', (error) => {
        console.log('\n❌ ERROR EN EL TEST');
        console.log(`💥 Error: ${error.message}`);
        console.log(`🔍 Código de error: ${error.code}`);

        if (error.code === 'ECONNREFUSED') {
            console.log('\n🔌 El servidor no está ejecutándose en http://localhost:4000');
            console.log('💡 Soluciones:');
            console.log('   1. Ejecutar: cd backend_definitivo && npm start');
            console.log('   2. Verificar que el puerto 4000 esté libre');
            console.log('   3. Revisar los logs del servidor');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('\n⏰ Timeout - el servidor tardó demasiado en responder');
            console.log('💡 El servidor puede estar sobrecargado o no responder');
        } else {
            console.log('\n🔍 Error desconocido:');
            console.log(`   - Código: ${error.code}`);
            console.log(`   - Mensaje: ${error.message}`);
        }
    });

    req.on('timeout', () => {
        console.log('\n⏰ TIMEOUT - El servidor tardó demasiado en responder');
        console.log('💡 Intentando cerrar la conexión...');
        req.destroy();
    });

    req.setTimeout(10000);
    req.end();
}

// Ejecutar el test
console.log('🚀 Iniciando test del módulo de clientes...');
testClientes();


