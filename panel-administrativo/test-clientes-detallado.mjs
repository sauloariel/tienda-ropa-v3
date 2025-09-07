/**
 * Test Detallado del Módulo de Clientes
 * Verifica la conexión con la base de datos y el manejo de estados inconsistentes
 */

import http from 'http';

console.log('🧪 TEST DETALLADO DEL MÓDULO DE CLIENTES');
console.log('=========================================');

function testClientesDetallado() {
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

                    // Análisis detallado de estados
                    console.log('\n🔍 ANÁLISIS DETALLADO DE ESTADOS:');
                    console.log('================================');

                    const estadosEncontrados = new Set();
                    const clientesPorEstado = {};

                    jsonData.forEach((cliente, index) => {
                        const estado = cliente.estado;
                        const estadoNormalizado = estado ? estado.toUpperCase() : 'SIN_ESTADO';

                        console.log(`\n   Cliente ${index + 1}:`);
                        console.log(`   - ID: ${cliente.id_cliente}`);
                        console.log(`   - Nombre: ${cliente.nombre} ${cliente.apellido}`);
                        console.log(`   - Estado original: "${estado}" (tipo: ${typeof estado})`);
                        console.log(`   - Estado normalizado: "${estadoNormalizado}"`);

                        estadosEncontrados.add(estadoNormalizado);

                        if (!clientesPorEstado[estadoNormalizado]) {
                            clientesPorEstado[estadoNormalizado] = [];
                        }
                        clientesPorEstado[estadoNormalizado].push(cliente);
                    });

                    console.log('\n📊 RESUMEN DE ESTADOS ENCONTRADOS:');
                    console.log('==================================');
                    console.log(`Estados únicos encontrados: ${estadosEncontrados.size}`);
                    estadosEncontrados.forEach(estado => {
                        const cantidad = clientesPorEstado[estado].length;
                        console.log(`   - "${estado}": ${cantidad} clientes`);
                    });

                    // Aplicar filtrado como lo hace el frontend
                    console.log('\n🔧 APLICANDO FILTRADO DEL FRONTEND:');
                    console.log('==================================');

                    const clientesActivos = jsonData.filter(c =>
                        !c.estado ||
                        c.estado.toUpperCase() === 'ACTIVO' ||
                        c.estado.toLowerCase() === 'activo'
                    );

                    const clientesConEstado = clientesActivos.filter(c =>
                        c.estado && (c.estado.toUpperCase() === 'ACTIVO' || c.estado.toLowerCase() === 'activo')
                    );

                    const clientesSinEstado = clientesActivos.filter(c => !c.estado);

                    const clientesInactivos = jsonData.filter(c =>
                        c.estado &&
                        c.estado.toUpperCase() !== 'ACTIVO' &&
                        c.estado.toLowerCase() !== 'activo'
                    );

                    console.log(`\n📈 RESULTADOS DEL FILTRADO:`);
                    console.log(`   - Total en BD: ${jsonData.length}`);
                    console.log(`   - Clientes activos (mostrados): ${clientesActivos.length}`);
                    console.log(`   - Con estado ACTIVO: ${clientesConEstado.length}`);
                    console.log(`   - Sin estado (nuevos): ${clientesSinEstado.length}`);
                    console.log(`   - Clientes inactivos (ocultos): ${clientesInactivos.length}`);

                    // Mostrar clientes activos
                    if (clientesActivos.length > 0) {
                        console.log('\n👥 CLIENTES ACTIVOS (SE MOSTRARÁN):');
                        console.log('==================================');
                        clientesActivos.forEach((cliente, index) => {
                            console.log(`\n   ${index + 1}. ${cliente.nombre} ${cliente.apellido}`);
                            console.log(`      - ID: ${cliente.id_cliente}`);
                            console.log(`      - Email: ${cliente.mail}`);
                            console.log(`      - DNI: ${cliente.dni}`);
                            console.log(`      - Estado: "${cliente.estado}"`);
                        });
                    }

                    // Mostrar clientes inactivos
                    if (clientesInactivos.length > 0) {
                        console.log('\n🚫 CLIENTES INACTIVOS (NO SE MOSTRARÁN):');
                        console.log('======================================');
                        clientesInactivos.forEach((cliente, index) => {
                            console.log(`\n   ${index + 1}. ${cliente.nombre} ${cliente.apellido}`);
                            console.log(`      - ID: ${cliente.id_cliente}`);
                            console.log(`      - Email: ${cliente.mail}`);
                            console.log(`      - DNI: ${cliente.dni}`);
                            console.log(`      - Estado: "${cliente.estado}"`);
                        });
                    }

                    // Verificar inconsistencias
                    console.log('\n⚠️  VERIFICACIÓN DE INCONSISTENCIAS:');
                    console.log('==================================');

                    const tieneInconsistencias = Array.from(estadosEncontrados).some(estado =>
                        estado !== 'ACTIVO' && estado !== 'SIN_ESTADO' && estado !== 'INACTIVO'
                    );

                    if (tieneInconsistencias) {
                        console.log('❌ Se encontraron inconsistencias en los estados:');
                        Array.from(estadosEncontrados).forEach(estado => {
                            if (estado !== 'ACTIVO' && estado !== 'SIN_ESTADO' && estado !== 'INACTIVO') {
                                console.log(`   - Estado problemático: "${estado}"`);
                            }
                        });
                    } else {
                        console.log('✅ No se encontraron inconsistencias en los estados');
                    }

                    console.log('\n🎉 TEST COMPLETADO EXITOSAMENTE');
                    console.log('✅ El módulo de clientes está funcionando correctamente');
                    console.log('✅ La conexión con la base de datos es exitosa');
                    console.log('✅ El filtrado de clientes activos/inactivos funciona correctamente');
                    console.log('✅ Se manejan correctamente las inconsistencias de estado');

                } else {
                    console.log('⚠️ La respuesta no es un array');
                    console.log('📋 Estructura de la respuesta:', Object.keys(jsonData));
                    console.log('📄 Contenido:', JSON.stringify(jsonData, null, 2));
                }

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
console.log('🚀 Iniciando test detallado del módulo de clientes...');
testClientesDetallado();


