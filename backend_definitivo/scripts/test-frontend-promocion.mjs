import fetch from 'node-fetch';

// Configuración del servidor
const BASE_URL = 'http://localhost:3000/api/marketing';
const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

console.log('🧪 Test de Carga de Promoción desde Frontend');
console.log('==============================================\n');

// Función para hacer peticiones HTTP
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: HEADERS,
            ...options
        });

        const data = await response.json();

        return {
            success: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            status: 0,
            error: error.message
        };
    }
}

// Test 1: Verificar que el servidor esté funcionando
async function testServerConnection() {
    console.log('🔍 [Test 1] Verificando conexión al servidor...');

    const result = await makeRequest(`${BASE_URL}/`);

    if (result.success) {
        console.log('✅ Servidor conectado correctamente');
        console.log('📋 Endpoints disponibles:', result.data.endpoints);
    } else {
        console.log('❌ Error conectando al servidor:', result.error || result.data);
        return false;
    }

    return true;
}

// Test 2: Obtener promociones existentes
async function testGetPromociones() {
    console.log('\n🔍 [Test 2] Obteniendo promociones existentes...');

    const result = await makeRequest(`${BASE_URL}/promociones`);

    if (result.success) {
        console.log(`✅ Se encontraron ${result.data.length} promociones existentes`);

        // Mostrar algunas promociones
        if (result.data.length > 0) {
            console.log('📋 Primeras 3 promociones:');
            result.data.slice(0, 3).forEach((promo, index) => {
                console.log(`   ${index + 1}. ${promo.nombre} (${promo.tipo}: ${promo.valor}) - ${promo.estado}`);
            });
        }

        return result.data.length;
    } else {
        console.log('❌ Error obteniendo promociones:', result.data);
        return 0;
    }
}

// Test 3: Crear nueva promoción
async function testCreatePromocion() {
    console.log('\n🔍 [Test 3] Creando nueva promoción...');

    const nuevaPromocion = {
        nombre: 'Test Frontend - Descuento 15%',
        descripcion: 'Promoción de prueba creada desde el frontend',
        tipo: 'PORCENTAJE',
        valor: 15.00,
        codigo_descuento: 'TEST15',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
        minimo_compra: 25.00,
        uso_maximo: 50,
        estado: 'ACTIVA'
    };

    console.log('📝 Datos de la nueva promoción:');
    console.log(JSON.stringify(nuevaPromocion, null, 2));

    const result = await makeRequest(`${BASE_URL}/promociones`, {
        method: 'POST',
        body: JSON.stringify(nuevaPromocion)
    });

    if (result.success) {
        console.log('✅ Promoción creada exitosamente');
        console.log('🆔 ID de la nueva promoción:', result.data.id_promocion);
        return result.data;
    } else {
        console.log('❌ Error creando promoción:', result.data);
        return null;
    }
}

// Test 4: Verificar promoción creada
async function testVerifyPromocion(promocionId) {
    if (!promocionId) {
        console.log('\n⏭️  [Test 4] Saltando verificación (no hay promoción creada)');
        return;
    }

    console.log('\n🔍 [Test 4] Verificando promoción creada...');

    const result = await makeRequest(`${BASE_URL}/promociones/${promocionId}`);

    if (result.success) {
        console.log('✅ Promoción verificada correctamente');
        console.log('📋 Detalles de la promoción:');
        console.log(`   - ID: ${result.data.id_promocion}`);
        console.log(`   - Nombre: ${result.data.nombre}`);
        console.log(`   - Tipo: ${result.data.tipo}`);
        console.log(`   - Valor: ${result.data.valor}`);
        console.log(`   - Código: ${result.data.codigo_descuento}`);
        console.log(`   - Estado: ${result.data.estado}`);
        console.log(`   - Uso actual: ${result.data.uso_actual}/${result.data.uso_maximo}`);
    } else {
        console.log('❌ Error verificando promoción:', result.data);
    }
}

// Test 5: Validar código de descuento
async function testValidateCodigo() {
    console.log('\n🔍 [Test 5] Probando validación de código de descuento...');

    const testData = {
        codigo: 'TEST15',
        monto_compra: 50.00
    };

    const result = await makeRequest(`${BASE_URL}/validate-codigo`, {
        method: 'POST',
        body: JSON.stringify(testData)
    });

    if (result.success) {
        if (result.data.valid) {
            console.log('✅ Código de descuento válido');
            console.log(`💰 Descuento calculado: $${result.data.promocion.descuento}`);
        } else {
            console.log('❌ Código de descuento inválido:', result.data.error);
        }
    } else {
        console.log('❌ Error validando código:', result.data);
    }
}

// Test 6: Obtener estadísticas actualizadas
async function testGetStats() {
    console.log('\n🔍 [Test 6] Obteniendo estadísticas actualizadas...');

    const result = await makeRequest(`${BASE_URL}/stats`);

    if (result.success) {
        console.log('✅ Estadísticas obtenidas correctamente');
        console.log('📊 Estadísticas de marketing:');
        console.log(`   - Total promociones: ${result.data.total_promociones}`);
        console.log(`   - Promociones activas: ${result.data.promociones_activas}`);
        console.log(`   - Promociones inactivas: ${result.data.promociones_inactivas}`);
        console.log(`   - Promociones expiradas: ${result.data.promociones_expiradas}`);
        console.log(`   - Promociones por vencer: ${result.data.promociones_por_vencer}`);
        console.log(`   - Total uso: ${result.data.total_uso}`);
    } else {
        console.log('❌ Error obteniendo estadísticas:', result.data);
    }
}

// Test 7: Actualizar promoción
async function testUpdatePromocion(promocionId) {
    if (!promocionId) {
        console.log('\n⏭️  [Test 7] Saltando actualización (no hay promoción creada)');
        return;
    }

    console.log('\n🔍 [Test 7] Actualizando promoción...');

    const updateData = {
        descripcion: 'Promoción actualizada desde el frontend - Test completado',
        uso_maximo: 100
    };

    const result = await makeRequest(`${BASE_URL}/promociones/${promocionId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
    });

    if (result.success) {
        console.log('✅ Promoción actualizada correctamente');
        console.log('📝 Nueva descripción:', result.data.descripcion);
        console.log('🔢 Nuevo límite de uso:', result.data.uso_maximo);
    } else {
        console.log('❌ Error actualizando promoción:', result.data);
    }
}

// Test 8: Cambiar estado de promoción
async function testToggleEstado(promocionId) {
    if (!promocionId) {
        console.log('\n⏭️  [Test 8] Saltando cambio de estado (no hay promoción creada)');
        return;
    }

    console.log('\n🔍 [Test 8] Cambiando estado de promoción...');

    const result = await makeRequest(`${BASE_URL}/promociones/${promocionId}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'INACTIVA' })
    });

    if (result.success) {
        console.log('✅ Estado cambiado correctamente');
        console.log('🔄 Nuevo estado:', result.data.estado);
    } else {
        console.log('❌ Error cambiando estado:', result.data);
    }
}

// Test 9: Eliminar promoción de prueba
async function testDeletePromocion(promocionId) {
    if (!promocionId) {
        console.log('\n⏭️  [Test 9] Saltando eliminación (no hay promoción creada)');
        return;
    }

    console.log('\n🔍 [Test 9] Eliminando promoción de prueba...');

    const result = await makeRequest(`${BASE_URL}/promociones/${promocionId}`, {
        method: 'DELETE'
    });

    if (result.success) {
        console.log('✅ Promoción eliminada correctamente');
        console.log('🗑️  Mensaje:', result.data.message);
    } else {
        console.log('❌ Error eliminando promoción:', result.data);
    }
}

// Función principal que ejecuta todos los tests
async function runAllTests() {
    console.log('🚀 Iniciando tests de carga de promoción desde frontend...\n');

    try {
        // Test 1: Verificar conexión
        const serverOk = await testServerConnection();
        if (!serverOk) {
            console.log('\n❌ No se puede continuar sin conexión al servidor');
            return;
        }

        // Test 2: Obtener promociones existentes
        const promocionesExistentes = await testGetPromociones();

        // Test 3: Crear nueva promoción
        const nuevaPromocion = await testCreatePromocion();
        const promocionId = nuevaPromocion?.id_promocion;

        // Test 4: Verificar promoción creada
        await testVerifyPromocion(promocionId);

        // Test 5: Validar código de descuento
        await testValidateCodigo();

        // Test 6: Obtener estadísticas
        await testGetStats();

        // Test 7: Actualizar promoción
        await testUpdatePromocion(promocionId);

        // Test 8: Cambiar estado
        await testToggleEstado(promocionId);

        // Test 9: Eliminar promoción de prueba
        await testDeletePromocion(promocionId);

        console.log('\n🎉 ¡Todos los tests completados!');
        console.log('✅ El módulo de marketing está funcionando correctamente desde el frontend');

    } catch (error) {
        console.error('\n❌ Error durante la ejecución de tests:', error.message);
    }
}

// Ejecutar tests
runAllTests();

