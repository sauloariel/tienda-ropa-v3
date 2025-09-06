#!/usr/bin/env node

/**
 * Script para probar el endpoint de login
 */

const BASE_URL = 'http://localhost:4000';

async function testLogin() {
    console.log('🧪 Probando endpoint de login...');

    try {
        // Probar health check
        console.log('1. Probando health check...');
        const healthResponse = await fetch(`${BASE_URL}/api/health`);
        const healthData = await healthResponse.json();

        if (healthData.ok) {
            console.log('✅ Health check OK');
        } else {
            console.log('❌ Health check falló');
            return;
        }

        // Probar login con admin
        console.log('2. Probando login con admin...');
        const loginResponse = await fetch(`${BASE_URL}/loguin/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: 'admin',
                password: 'admin123'
            })
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.success && loginData.token) {
            console.log('✅ Login admin exitoso');
            console.log(`   Token: ${loginData.token.substring(0, 20)}...`);
            console.log(`   Usuario: ${loginData.user.usuario}`);
            console.log(`   Rol: ${loginData.user.rol}`);
        } else {
            console.log('❌ Login admin falló:', loginData.message || 'Error desconocido');
            return;
        }

        // Probar login con lucia
        console.log('3. Probando login con lucia...');
        const luciaResponse = await fetch(`${BASE_URL}/loguin/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: 'lucia',
                password: 'lucia123'
            })
        });

        const luciaData = await luciaResponse.json();

        if (luciaResponse.ok && luciaData.success && luciaData.token) {
            console.log('✅ Login lucia exitoso');
            console.log(`   Token: ${luciaData.token.substring(0, 20)}...`);
            console.log(`   Usuario: ${luciaData.user.usuario}`);
            console.log(`   Rol: ${luciaData.user.rol}`);
        } else {
            console.log('❌ Login lucia falló:', luciaData.message || 'Error desconocido');
            return;
        }

        // Probar credenciales inválidas
        console.log('4. Probando credenciales inválidas...');
        const invalidResponse = await fetch(`${BASE_URL}/loguin/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: 'admin',
                password: 'password_incorrecta'
            })
        });

        const invalidData = await invalidResponse.json();

        if (invalidResponse.status === 401 && !invalidData.success) {
            console.log('✅ Credenciales inválidas correctamente rechazadas');
        } else {
            console.log('❌ Credenciales inválidas no fueron rechazadas correctamente');
        }

        console.log('🎉 Todas las pruebas de login pasaron exitosamente');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.message);
        process.exit(1);
    }
}

// Ejecutar la función
testLogin();

export default testLogin;
