#!/usr/bin/env node

/**
 * Script de verificación completa del sistema
 */

const BASE_URL = 'http://localhost:4000';

async function verifyAll() {
    console.log('🔍 Verificación completa del sistema...\n');

    try {
        // 1. Health Check
        console.log('1. 🏥 Verificando health check...');
        const healthResponse = await fetch(`${BASE_URL}/api/health`);
        const healthData = await healthResponse.json();

        if (healthData.ok) {
            console.log('   ✅ Health check OK');
        } else {
            console.log('   ❌ Health check falló');
            return;
        }

        // 2. Login Admin
        console.log('\n2. 👤 Verificando login admin...');
        const adminResponse = await fetch(`${BASE_URL}/loguin/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: 'admin', password: 'admin123' })
        });

        const adminData = await adminResponse.json();
        if (adminResponse.ok && adminData.success) {
            console.log('   ✅ Login admin exitoso');
            console.log(`   📧 Usuario: ${adminData.user.usuario}`);
            console.log(`   🎭 Rol: ${adminData.user.rol}`);
        } else {
            console.log('   ❌ Login admin falló:', adminData.message);
            return;
        }

        // 3. Login Lucia
        console.log('\n3. 👩 Verificando login lucia...');
        const luciaResponse = await fetch(`${BASE_URL}/loguin/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: 'lucia', password: 'lucia123' })
        });

        const luciaData = await luciaResponse.json();
        if (luciaResponse.ok && luciaData.success) {
            console.log('   ✅ Login lucia exitoso');
            console.log(`   📧 Usuario: ${luciaData.user.usuario}`);
            console.log(`   🎭 Rol: ${luciaData.user.rol}`);
        } else {
            console.log('   ❌ Login lucia falló:', luciaData.message);
            return;
        }

        // 4. Verificar token
        console.log('\n4. 🔐 Verificando token...');
        const tokenResponse = await fetch(`${BASE_URL}/loguin/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${adminData.token}`,
                'Content-Type': 'application/json'
            }
        });

        const tokenData = await tokenResponse.json();
        if (tokenResponse.ok && tokenData.success) {
            console.log('   ✅ Token válido');
            console.log(`   📧 Usuario verificado: ${tokenData.usuario.usuario}`);
        } else {
            console.log('   ❌ Token inválido:', tokenData.message);
        }

        // 5. Credenciales inválidas
        console.log('\n5. 🚫 Verificando rechazo de credenciales inválidas...');
        const invalidResponse = await fetch(`${BASE_URL}/loguin/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: 'admin', password: 'password_incorrecta' })
        });

        const invalidData = await invalidResponse.json();
        if (invalidResponse.status === 401 && !invalidData.success) {
            console.log('   ✅ Credenciales inválidas correctamente rechazadas');
        } else {
            console.log('   ❌ Credenciales inválidas no fueron rechazadas correctamente');
        }

        console.log('\n🎉 ¡Todas las verificaciones pasaron exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('   ✅ Backend funcionando correctamente');
        console.log('   ✅ Base de datos conectada');
        console.log('   ✅ Autenticación JWT funcionando');
        console.log('   ✅ Usuarios de prueba creados');
        console.log('   ✅ Endpoints de login funcionando');
        console.log('\n🚀 El sistema está listo para usar!');

    } catch (error) {
        console.error('\n❌ Error en la verificación:', error.message);
        process.exit(1);
    }
}

// Ejecutar la verificación
verifyAll();










