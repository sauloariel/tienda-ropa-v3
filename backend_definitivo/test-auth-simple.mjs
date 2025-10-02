import fetch from 'node-fetch';

console.log('🔧 Test de Autenticación Simplificada');
console.log('=====================================\n');

async function testSimpleAuth() {
    try {
        // Test 1: Registro de cliente
        console.log('🔍 1. Probando registro de cliente...');

        const registerData = {
            mail: "test@test.com",
            password: "123456",
            nombre: "Test",
            apellido: "Usuario",
            telefono: "1234567890",
            domicilio: "Calle Test 123"
        };

        const registerResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        console.log(`   Status: ${registerResponse.status}`);
        const registerResult = await registerResponse.json();
        console.log('   Resultado:', JSON.stringify(registerResult, null, 2));

        if (registerResponse.ok) {
            console.log('✅ Registro exitoso');
        } else {
            console.log('❌ Error en registro');
        }

        // Test 2: Login de cliente
        console.log('\n🔍 2. Probando login de cliente...');

        const loginData = {
            mail: "test@test.com",
            password: "123456"
        };

        const loginResponse = await fetch('http://localhost:4000/api/clientes/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        console.log(`   Status: ${loginResponse.status}`);
        const loginResult = await loginResponse.json();
        console.log('   Resultado:', JSON.stringify(loginResult, null, 2));

        if (loginResponse.ok) {
            console.log('✅ Login exitoso');
        } else {
            console.log('❌ Error en login');
        }

        // Test 3: Verificar cliente
        console.log('\n🔍 3. Probando verificación de cliente...');

        const verifyData = {
            mail: "test@test.com"
        };

        const verifyResponse = await fetch('http://localhost:4000/api/clientes/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verifyData)
        });

        console.log(`   Status: ${verifyResponse.status}`);
        const verifyResult = await verifyResponse.json();
        console.log('   Resultado:', JSON.stringify(verifyResult, null, 2));

        if (verifyResponse.ok) {
            console.log('✅ Verificación exitosa');
        } else {
            console.log('❌ Error en verificación');
        }

        console.log('\n🎉 ¡Test completado!');

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
    }
}

testSimpleAuth();





















