import fetch from 'node-fetch';

console.log('🔧 Test de Clientes Auth');
console.log('========================\n');

async function testClientAuth() {
    try {
        // Test 1: Verificar que el endpoint existe
        console.log('🔍 Probando endpoint de registro...');

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

        const response = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        console.log(`📊 Status: ${response.status}`);
        console.log(`📊 Status Text: ${response.statusText}`);

        const result = await response.json();
        console.log('📊 Response:', JSON.stringify(result, null, 2));

        if (response.ok) {
            console.log('✅ Registro exitoso');
        } else {
            console.log('❌ Error en registro');
        }

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
    }
}

testClientAuth();





















