import fetch from 'node-fetch';

console.log('🔍 Debug de Clientes Auth');
console.log('==========================\n');

async function debugClientAuth() {
    try {
        // Test 1: Verificar que el servidor está funcionando
        console.log('🔍 1. Verificando servidor...');
        const healthResponse = await fetch('http://localhost:4000/api/productos');
        console.log(`   Status: ${healthResponse.status}`);

        if (!healthResponse.ok) {
            console.log('❌ Servidor no está funcionando');
            return;
        }
        console.log('✅ Servidor funcionando');

        // Test 2: Verificar endpoint de registro
        console.log('\n🔍 2. Probando endpoint de registro...');

        const testData = {
            dni: "12345678",
            cuit_cuil: "20123456789",
            nombre: "Test",
            apellido: "Usuario",
            domicilio: "Calle Test 123",
            telefono: "1234567890",
            mail: "test@test.com",
            password: "123456"
        };

        console.log('   Datos de prueba:', JSON.stringify(testData, null, 2));

        const response = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        console.log(`   Status: ${response.status}`);
        console.log(`   Status Text: ${response.statusText}`);

        const result = await response.text();
        console.log('   Response (raw):', result);

        try {
            const jsonResult = JSON.parse(result);
            console.log('   Response (JSON):', JSON.stringify(jsonResult, null, 2));
        } catch (e) {
            console.log('   Response no es JSON válido');
        }

        // Test 3: Verificar otros endpoints de clientes
        console.log('\n🔍 3. Probando otros endpoints de clientes...');

        const clientesResponse = await fetch('http://localhost:4000/api/clientes');
        console.log(`   /api/clientes Status: ${clientesResponse.status}`);

        if (clientesResponse.ok) {
            const clientes = await clientesResponse.json();
            console.log(`   Total clientes: ${clientes.length}`);
        }

    } catch (error) {
        console.error('❌ Error durante el debug:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Esperar un poco para que el servidor se inicie
setTimeout(debugClientAuth, 3000);
















