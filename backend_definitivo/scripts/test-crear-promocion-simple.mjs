import fetch from 'node-fetch';

// Configuración
const BASE_URL = 'http://localhost:3000/api/marketing';

console.log('🎯 Test Simple - Crear Promoción desde Frontend');
console.log('===============================================\n');

// Función para crear una promoción
async function crearPromocion() {
    const promocionData = {
        nombre: 'Promoción Test Frontend',
        descripcion: 'Promoción creada desde el frontend para pruebas',
        tipo: 'PORCENTAJE',
        valor: 20.00,
        codigo_descuento: 'FRONTEND20',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días
        minimo_compra: 30.00,
        uso_maximo: 25,
        estado: 'ACTIVA'
    };

    console.log('📝 Creando promoción con los siguientes datos:');
    console.log(JSON.stringify(promocionData, null, 2));
    console.log('\n🚀 Enviando petición...');

    try {
        const response = await fetch(`${BASE_URL}/promociones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(promocionData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ ¡Promoción creada exitosamente!');
            console.log('🆔 ID:', result.id_promocion);
            console.log('📋 Nombre:', result.nombre);
            console.log('🏷️  Código:', result.codigo_descuento);
            console.log('💰 Descuento:', `${result.valor}%`);
            console.log('📅 Válida hasta:', new Date(result.fecha_fin).toLocaleDateString());

            return result;
        } else {
            console.log('❌ Error creando promoción:');
            console.log('Status:', response.status);
            console.log('Error:', result);
            return null;
        }
    } catch (error) {
        console.log('❌ Error de conexión:', error.message);
        console.log('💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
        return null;
    }
}

// Función para verificar la promoción creada
async function verificarPromocion(promocionId) {
    if (!promocionId) return;

    console.log('\n🔍 Verificando promoción creada...');

    try {
        const response = await fetch(`${BASE_URL}/promociones/${promocionId}`);
        const result = await response.json();

        if (response.ok) {
            console.log('✅ Promoción verificada correctamente');
            console.log('📊 Estado actual:');
            console.log(`   - Uso actual: ${result.uso_actual}/${result.uso_maximo}`);
            console.log(`   - Estado: ${result.estado}`);
            console.log(`   - Creada: ${new Date(result.createdAt).toLocaleString()}`);
        } else {
            console.log('❌ Error verificando promoción:', result);
        }
    } catch (error) {
        console.log('❌ Error verificando promoción:', error.message);
    }
}

// Función para probar validación del código
async function probarValidacionCodigo() {
    console.log('\n🔍 Probando validación del código de descuento...');

    const testData = {
        codigo: 'FRONTEND20',
        monto_compra: 50.00
    };

    try {
        const response = await fetch(`${BASE_URL}/validate-codigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        if (response.ok) {
            if (result.valid) {
                console.log('✅ Código válido');
                console.log(`💰 Descuento aplicable: $${result.promocion.descuento}`);
                console.log(`🏷️  Promoción: ${result.promocion.nombre}`);
            } else {
                console.log('❌ Código inválido:', result.error);
            }
        } else {
            console.log('❌ Error validando código:', result);
        }
    } catch (error) {
        console.log('❌ Error validando código:', error.message);
    }
}

// Función principal
async function main() {
    console.log('🚀 Iniciando test de creación de promoción...\n');

    // Crear promoción
    const promocion = await crearPromocion();

    if (promocion) {
        // Verificar promoción
        await verificarPromocion(promocion.id_promocion);

        // Probar validación
        await probarValidacionCodigo();

        console.log('\n🎉 ¡Test completado exitosamente!');
        console.log('✅ La promoción se creó correctamente desde el frontend');
    } else {
        console.log('\n❌ Test falló - No se pudo crear la promoción');
    }
}

// Ejecutar test
main();

