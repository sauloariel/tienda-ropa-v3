import fetch from 'node-fetch';

console.log('🔧 Test Simple de Registro');
console.log('==========================\n');

async function testSimpleRegister() {
    try {
        const registerData = {
            mail: "test@test.com",
            password: "123456",
            nombre: "Test",
            apellido: "Usuario"
        };

        console.log('📤 Enviando datos:', JSON.stringify(registerData, null, 2));

        const response = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        console.log(`📊 Status: ${response.status}`);
        console.log(`📊 Status Text: ${response.statusText}`);

        const result = await response.text();
        console.log('📊 Response (raw):', result);

        try {
            const jsonResult = JSON.parse(result);
            console.log('📊 Response (JSON):', JSON.stringify(jsonResult, null, 2));
        } catch (e) {
            console.log('📊 Response no es JSON válido');
        }

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
    }
}

testSimpleRegister();





















