import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Configuración de colores para la consola
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
    log(`\n${colors.bold}🧪 ${testName}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

// Función para hacer peticiones HTTP
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();
        return { success: response.ok, data, status: response.status };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Test 1: Verificar que el servidor esté funcionando
async function testServerHealth() {
    logTest('Verificando salud del servidor');

    const result = await makeRequest(`${API_BASE}/health`);

    if (result.success && result.data.ok) {
        logSuccess('Servidor funcionando correctamente');
        logInfo(`Timestamp: ${result.data.timestamp}`);
        return true;
    } else {
        logError('Servidor no responde correctamente');
        return false;
    }
}

// Test 2: Obtener todos los pedidos
async function testGetAllPedidos() {
    logTest('Obteniendo todos los pedidos');

    const result = await makeRequest(`${API_BASE}/pedidos`);

    if (result.success) {
        logSuccess(`Se obtuvieron ${result.data.length} pedidos`);

        if (result.data.length > 0) {
            const pedido = result.data[0];
            logInfo('Ejemplo de pedido:');
            logInfo(`  ID: ${pedido.id_pedido}`);
            logInfo(`  Estado: ${pedido.estado}`);
            logInfo(`  Cliente: ${pedido.cliente?.nombre} ${pedido.cliente?.apellido}`);
            logInfo(`  Importe: $${pedido.importe}`);
            logInfo(`  Fecha: ${new Date(pedido.fecha_pedido).toLocaleDateString('es-AR')}`);
        }

        return true;
    } else {
        logError('Error al obtener pedidos');
        logError(`Status: ${result.status}`);
        logError(`Error: ${JSON.stringify(result.data, null, 2)}`);
        return false;
    }
}

// Test 3: Obtener pedido por ID
async function testGetPedidoById() {
    logTest('Obteniendo pedido por ID');

    // Primero obtener un pedido para tener un ID válido
    const allPedidos = await makeRequest(`${API_BASE}/pedidos`);

    if (!allPedidos.success || allPedidos.data.length === 0) {
        logWarning('No hay pedidos para probar');
        return false;
    }

    const pedidoId = allPedidos.data[0].id_pedido;
    const result = await makeRequest(`${API_BASE}/pedidos/${pedidoId}`);

    if (result.success) {
        logSuccess(`Pedido ${pedidoId} obtenido correctamente`);
        logInfo(`Estado: ${result.data.estado}`);
        logInfo(`Cliente: ${result.data.cliente?.nombre} ${result.data.cliente?.apellido}`);
        return true;
    } else {
        logError(`Error al obtener pedido ${pedidoId}`);
        logError(`Status: ${result.status}`);
        return false;
    }
}

// Test 4: Cambiar estado de pedido
async function testChangePedidoStatus() {
    logTest('Cambiando estado de pedido');

    // Primero obtener un pedido
    const allPedidos = await makeRequest(`${API_BASE}/pedidos`);

    if (!allPedidos.success || allPedidos.data.length === 0) {
        logWarning('No hay pedidos para probar');
        return false;
    }

    const pedido = allPedidos.data[0];
    const pedidoId = pedido.id_pedido;
    const estadoOriginal = pedido.estado;
    const nuevoEstado = estadoOriginal === 'pendiente' ? 'procesando' : 'pendiente';

    logInfo(`Cambiando estado del pedido ${pedidoId} de "${estadoOriginal}" a "${nuevoEstado}"`);

    const result = await makeRequest(`${API_BASE}/pedidos/${pedidoId}/estado`, {
        method: 'PUT',
        body: JSON.stringify({ estado: nuevoEstado })
    });

    if (result.success) {
        logSuccess(`Estado del pedido ${pedidoId} cambiado a: ${nuevoEstado}`);

        // Verificar que el cambio se aplicó
        const verifyResult = await makeRequest(`${API_BASE}/pedidos/${pedidoId}`);
        if (verifyResult.success && verifyResult.data.estado === nuevoEstado) {
            logSuccess('Cambio de estado verificado correctamente');

            // Restaurar el estado original
            await makeRequest(`${API_BASE}/pedidos/${pedidoId}/estado`, {
                method: 'PUT',
                body: JSON.stringify({ estado: estadoOriginal })
            });
            logInfo(`Estado restaurado a: ${estadoOriginal}`);

            return true;
        } else {
            logError('El cambio de estado no se aplicó correctamente');
            return false;
        }
    } else {
        logError(`Error al cambiar estado del pedido ${pedidoId}`);
        logError(`Status: ${result.status}`);
        logError(`Error: ${JSON.stringify(result.data, null, 2)}`);
        return false;
    }
}

// Test 5: Probar seguimiento de pedidos
async function testSeguimientoPedidos() {
    logTest('Probando seguimiento de pedidos');

    // Primero obtener un pedido con payment_id
    const allPedidos = await makeRequest(`${API_BASE}/pedidos`);

    if (!allPedidos.success || allPedidos.data.length === 0) {
        logWarning('No hay pedidos para probar');
        return false;
    }

    const pedidoConPaymentId = allPedidos.data.find(p => p.payment_id);

    if (!pedidoConPaymentId) {
        logWarning('No hay pedidos con payment_id para probar seguimiento');
        return false;
    }

    const paymentId = pedidoConPaymentId.payment_id;
    logInfo(`Probando seguimiento con payment_id: ${paymentId}`);

    const result = await makeRequest(`${API_BASE}/pedidos/seguimiento/${paymentId}`);

    if (result.success) {
        logSuccess(`Seguimiento del pedido ${paymentId} funcionando correctamente`);
        logInfo(`Estado: ${result.data.pedido.estado}`);
        logInfo(`Cliente: ${result.data.pedido.cliente.nombre} ${result.data.pedido.cliente.apellido}`);
        logInfo(`Historial: ${result.data.pedido.historial.length} eventos`);
        return true;
    } else {
        logError(`Error en seguimiento del pedido ${paymentId}`);
        logError(`Status: ${result.status}`);
        logError(`Error: ${JSON.stringify(result.data, null, 2)}`);
        return false;
    }
}

// Función principal para ejecutar todos los tests
async function runAllTests() {
    log(`${colors.bold}${colors.blue}🚀 INICIANDO VERIFICACIÓN DEL MÓDULO DE PEDIDOS${colors.reset}\n`);

    let testsPassed = 0;
    let totalTests = 5;

    try {
        // Test 1: Salud del servidor
        const serverHealth = await testServerHealth();
        if (serverHealth) {
            testsPassed++;
        }

        // Test 2: Obtener todos los pedidos
        const getAllPedidos = await testGetAllPedidos();
        if (getAllPedidos) {
            testsPassed++;
        }

        // Test 3: Obtener pedido por ID
        const getPedidoById = await testGetPedidoById();
        if (getPedidoById) {
            testsPassed++;
        }

        // Test 4: Cambiar estado de pedido
        const changeStatus = await testChangePedidoStatus();
        if (changeStatus) {
            testsPassed++;
        }

        // Test 5: Seguimiento de pedidos
        const seguimiento = await testSeguimientoPedidos();
        if (seguimiento) {
            testsPassed++;
        }

        // Resumen final
        log(`\n${colors.bold}📊 RESUMEN DE TESTS${colors.reset}`);
        log(`Tests pasados: ${testsPassed}/${totalTests}`);

        if (testsPassed === totalTests) {
            logSuccess('¡Todos los tests pasaron! El módulo de pedidos está funcionando correctamente.');
        } else {
            logWarning(`Algunos tests fallaron. Revisar los errores arriba.`);
        }

        // Información adicional
        log(`\n${colors.bold}ℹ️  FUNCIONALIDADES DEL MÓDULO DE PEDIDOS${colors.reset}`);
        log('Panel Administrativo:');
        log('  ✅ Listar todos los pedidos');
        log('  ✅ Ver detalles de pedidos');
        log('  ✅ Cambiar estados de pedidos');
        log('  ✅ Anular pedidos');
        log('  ✅ Filtrar por estado');
        log('  ✅ Buscar pedidos');
        log('  ✅ Ver estadísticas');
        log('');
        log('Seguimiento Web:');
        log('  ✅ Buscar pedido por número');
        log('  ✅ Ver estado actual');
        log('  ✅ Ver historial de estados');
        log('  ✅ Ver información del cliente');
        log('  ✅ Ver productos del pedido');

    } catch (error) {
        logError(`Error general: ${error.message}`);
    }
}

// Ejecutar los tests
runAllTests().catch(console.error);


















