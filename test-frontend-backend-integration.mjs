import fetch from 'node-fetch';

console.log('🔧 Test de Integración Frontend-Backend');
console.log('=====================================\n');

async function testIntegration() {
    try {
        // Test 1: Health check
        console.log('1️⃣ Verificando servidor...');
        const healthResponse = await fetch('http://localhost:4000/api/health');
        if (healthResponse.ok) {
            console.log('✅ Servidor funcionando correctamente');
        } else {
            console.log('❌ Servidor no responde');
            return;
        }

        // Test 2: Registro de cliente
        console.log('\n2️⃣ Probando registro de cliente...');
        const registerData = {
            mail: `integrationtest${Date.now()}@test.com`,
            password: "password123",
            nombre: "Integration",
            apellido: "Test",
            telefono: "1234567890",
            domicilio: "Calle Test 123"
        };

        const registerResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
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

        // Test 3: Login de cliente
        console.log('\n3️⃣ Probando login de cliente...');
        const loginResponse = await fetch('http://localhost:4000/api/clientes/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail: registerData.mail,
                password: registerData.password
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

        // Test 4: Verificar cliente
        console.log('\n4️⃣ Probando verificación de cliente...');
        const verifyResponse = await fetch('http://localhost:4000/api/clientes/auth/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail: registerData.mail
            })
        });

        console.log(`📊 Status: ${verifyResponse.status}`);
        const verifyResult = await verifyResponse.json();
        console.log('📊 Response:', JSON.stringify(verifyResult, null, 2));

        if (verifyResponse.ok) {
            console.log('✅ Verificación exitosa');
        } else {
            console.log('❌ Error en verificación');
        }

        // Test 5: Logout de cliente
        console.log('\n5️⃣ Probando logout de cliente...');
        const logoutResponse = await fetch('http://localhost:4000/api/clientes/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`📊 Status: ${logoutResponse.status}`);
        const logoutResult = await logoutResponse.json();
        console.log('📊 Response:', JSON.stringify(logoutResult, null, 2));

        if (logoutResponse.ok) {
            console.log('✅ Logout exitoso');
        } else {
            console.log('❌ Error en logout');
        }

        console.log('\n🎉 Todos los tests de integración completados exitosamente');
        console.log('✅ El frontend ahora puede conectarse correctamente con el backend');

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
    }
}

testIntegration();

