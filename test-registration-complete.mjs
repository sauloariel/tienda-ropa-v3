import fetch from 'node-fetch';

console.log('🔧 Test Completo de Registro de Cliente');
console.log('=====================================\n');

async function testCompleteRegistration() {
    try {
        // Test 1: Verificar que el servidor esté funcionando
        console.log('1️⃣ Verificando servidor...');
        const healthResponse = await fetch('http://localhost:4000/api/health');
        if (healthResponse.ok) {
            console.log('✅ Servidor funcionando correctamente');
        } else {
            console.log('❌ Servidor no responde');
            return;
        }

        // Test 2: Probar registro con datos válidos
        console.log('\n2️⃣ Probando registro con datos válidos...');
        const testData = {
            mail: `testuser${Date.now()}@example.com`,
            password: "password123",
            nombre: "Test",
            apellido: "Usuario",
            telefono: "1234567890",
            domicilio: "Calle Test 123"
        };

        const registerResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        console.log(`📊 Status: ${registerResponse.status}`);
        const registerResult = await registerResponse.json();
        console.log('📊 Response:', JSON.stringify(registerResult, null, 2));

        if (registerResponse.ok) {
            console.log('✅ Registro exitoso');
        } else {
            console.log('❌ Error en registro');
            return;
        }

        // Test 3: Probar login con las credenciales creadas
        console.log('\n3️⃣ Probando login con credenciales creadas...');
        const loginResponse = await fetch('http://localhost:4000/api/clientes/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail: testData.mail,
                password: testData.password
            })
        });

        console.log(`📊 Status: ${loginResponse.status}`);
        const loginResult = await loginResponse.json();
        console.log('📊 Response:', JSON.stringify(loginResult, null, 2));

        if (loginResponse.ok) {
            console.log('✅ Login exitoso');
        } else {
            console.log('❌ Error en login');
        }

        // Test 4: Probar registro con email duplicado
        console.log('\n4️⃣ Probando registro con email duplicado...');
        const duplicateResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        console.log(`📊 Status: ${duplicateResponse.status}`);
        const duplicateResult = await duplicateResponse.json();
        console.log('📊 Response:', JSON.stringify(duplicateResult, null, 2));

        if (duplicateResponse.status === 400) {
            console.log('✅ Validación de email duplicado funcionando');
        } else {
            console.log('❌ Error en validación de email duplicado');
        }

        console.log('\n🎉 Todos los tests completados');

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
    }
}

testCompleteRegistration();

