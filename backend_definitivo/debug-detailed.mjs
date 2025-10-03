import fetch from 'node-fetch';

console.log('🔍 Debug Detallado del Error 500');
console.log('================================\n');

async function debugDetailed() {
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

        // Test 2: Probar endpoint de clientes (GET)
        console.log('\n🔍 2. Probando GET /api/clientes...');
        const clientesResponse = await fetch('http://localhost:4000/api/clientes');
        console.log(`   Status: ${clientesResponse.status}`);
        
        if (clientesResponse.ok) {
            const clientes = await clientesResponse.json();
            console.log(`   ✅ Total clientes: ${clientes.length}`);
        } else {
            const error = await clientesResponse.text();
            console.log(`   ❌ Error: ${error}`);
        }

        // Test 3: Probar endpoint de login (debería fallar pero no con 500)
        console.log('\n🔍 3. Probando POST /api/clientes/auth/login...');
        const loginData = { mail: "test@test.com", password: "123456" };
        const loginResponse = await fetch('http://localhost:4000/api/clientes/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        console.log(`   Status: ${loginResponse.status}`);
        const loginResult = await loginResponse.text();
        console.log(`   Response: ${loginResult}`);

        // Test 4: Probar endpoint de registro con datos mínimos
        console.log('\n🔍 4. Probando POST /api/clientes/auth/register (mínimo)...');
        const registerData = {
            mail: "test@test.com",
            password: "123456",
            nombre: "Test",
            apellido: "Usuario"
        };
        
        console.log('   Datos enviados:', JSON.stringify(registerData, null, 2));
        
        const registerResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });
        
        console.log(`   Status: ${registerResponse.status}`);
        console.log(`   Status Text: ${registerResponse.statusText}`);
        
        const registerResult = await registerResponse.text();
        console.log(`   Response: ${registerResult}`);

        // Test 5: Probar con datos diferentes
        console.log('\n🔍 5. Probando con email diferente...');
        const registerData2 = {
            mail: "test2@test.com",
            password: "123456",
            nombre: "Test2",
            apellido: "Usuario2"
        };
        
        const registerResponse2 = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData2)
        });
        
        console.log(`   Status: ${registerResponse2.status}`);
        const registerResult2 = await registerResponse2.text();
        console.log(`   Response: ${registerResult2}`);

    } catch (error) {
        console.error('❌ Error durante el debug:', error.message);
        console.error('Stack:', error.stack);
    }
}

debugDetailed();

























