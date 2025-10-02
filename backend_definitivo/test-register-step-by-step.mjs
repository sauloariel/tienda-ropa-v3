import fetch from 'node-fetch';

console.log('🔍 Test Paso a Paso del Registro');
console.log('================================\n');

async function testStepByStep() {
    try {
        // Test 1: Verificar que el endpoint existe
        console.log('🔍 1. Verificando que el endpoint existe...');
        const response = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        console.log(`   Status: ${response.status}`);

        if (response.status === 404) {
            console.log('❌ Endpoint no encontrado');
            return;
        }
        console.log('✅ Endpoint existe');

        // Test 2: Probar con datos vacíos (debería dar error 400, no 500)
        console.log('\n🔍 2. Probando con datos vacíos...');
        const emptyResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        console.log(`   Status: ${emptyResponse.status}`);
        const emptyResult = await emptyResponse.text();
        console.log(`   Response: ${emptyResult}`);

        // Test 3: Probar con solo email (debería dar error 400, no 500)
        console.log('\n🔍 3. Probando con solo email...');
        const emailOnlyResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: "test@test.com" })
        });
        console.log(`   Status: ${emailOnlyResponse.status}`);
        const emailOnlyResult = await emailOnlyResponse.text();
        console.log(`   Response: ${emailOnlyResult}`);

        // Test 4: Probar con email y password (debería dar error 400, no 500)
        console.log('\n🔍 4. Probando con email y password...');
        const emailPassResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mail: "test@test.com",
                password: "123456"
            })
        });
        console.log(`   Status: ${emailPassResponse.status}`);
        const emailPassResult = await emailPassResponse.text();
        console.log(`   Response: ${emailPassResult}`);

        // Test 5: Probar con datos completos pero email existente
        console.log('\n🔍 5. Probando con datos completos (email existente)...');
        const completeResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mail: "test@test.com",
                password: "123456",
                nombre: "Test",
                apellido: "Usuario"
            })
        });
        console.log(`   Status: ${completeResponse.status}`);
        const completeResult = await completeResponse.text();
        console.log(`   Response: ${completeResult}`);

        // Test 6: Probar con email nuevo
        console.log('\n🔍 6. Probando con email nuevo...');
        const newEmailResponse = await fetch('http://localhost:4000/api/clientes/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mail: "nuevo@test.com",
                password: "123456",
                nombre: "Nuevo",
                apellido: "Usuario"
            })
        });
        console.log(`   Status: ${newEmailResponse.status}`);
        const newEmailResult = await newEmailResponse.text();
        console.log(`   Response: ${newEmailResult}`);

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
    }
}

testStepByStep();





















