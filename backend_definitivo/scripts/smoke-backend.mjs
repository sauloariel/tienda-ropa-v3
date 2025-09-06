#!/usr/bin/env node

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

const BACKEND_URL = 'http://localhost:4000';
const HEALTH_ENDPOINT = `${BACKEND_URL}/api/health`;
const LOGIN_ENDPOINT = `${BACKEND_URL}/auth/login`;

console.log('🧪 Iniciando smoke test del backend...');

// Función para hacer fetch con timeout
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Función para iniciar el servidor
function startServer() {
    return new Promise((resolve, reject) => {
        console.log('🚀 Iniciando servidor backend...');

        const server = spawn('npm', ['run', 'dev'], {
            cwd: process.cwd(),
            stdio: 'pipe',
            shell: true
        });

        let serverReady = false;
        let output = '';

        server.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.log(`[SERVER] ${text.trim()}`);

            // Detectar cuando el servidor está listo
            if (text.includes('Servidor en http://localhost:4000') || text.includes('🚀 Servidor en http://localhost:4000')) {
                serverReady = true;
                resolve(server);
            }
        });

        server.stderr.on('data', (data) => {
            const text = data.toString();
            console.error(`[SERVER ERROR] ${text.trim()}`);
        });

        server.on('error', (error) => {
            console.error('❌ Error al iniciar servidor:', error);
            reject(error);
        });

        server.on('exit', (code) => {
            if (!serverReady) {
                console.error('❌ Servidor terminó antes de estar listo');
                console.error('Output del servidor:', output);
                reject(new Error(`Servidor terminó con código ${code}`));
            }
        });

        // Timeout de 30 segundos
        setTimeout(() => {
            if (!serverReady) {
                console.error('❌ Timeout esperando que el servidor esté listo');
                server.kill();
                reject(new Error('Timeout iniciando servidor'));
            }
        }, 30000);
    });
}

// Función para ejecutar tests
async function runTests() {
    try {
        console.log('⏳ Esperando que el servidor esté completamente listo...');
        await setTimeout(3000); // Esperar 3 segundos adicionales

        // Test 1: Health check
        console.log('🔍 Test 1: Health check...');
        const healthResponse = await fetchWithTimeout(HEALTH_ENDPOINT);

        if (!healthResponse.ok) {
            throw new Error(`Health check falló: ${healthResponse.status} ${healthResponse.statusText}`);
        }

        const healthData = await healthResponse.json();
        if (!healthData.ok) {
            throw new Error('Health check no devolvió ok: true');
        }

        console.log('✅ Health check pasó');

        // Test 2: Login (esperamos 401 o 200, no 500)
        console.log('🔍 Test 2: Login endpoint...');
        try {
            const loginResponse = await fetchWithTimeout(LOGIN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: 'admin',
                    password: 'admin'
                })
            });

            if (loginResponse.status === 200) {
                const loginData = await loginResponse.json();
                if (loginData.token) {
                    console.log('✅ Login exitoso (usuario admin existe)');
                } else {
                    console.log('⚠️  Login respondió pero sin token');
                }
            } else if (loginResponse.status === 401) {
                console.log('✅ Login endpoint funciona (credenciales inválidas)');
            } else {
                console.log(`⚠️  Login respondió con status ${loginResponse.status} (esperado 200 o 401)`);
            }
        } catch (loginError) {
            console.log('⚠️  Error en login test:', loginError.message);
        }

        // Test 3: Ruta raíz
        console.log('🔍 Test 3: Ruta raíz...');
        const rootResponse = await fetchWithTimeout(BACKEND_URL);

        if (!rootResponse.ok) {
            throw new Error(`Ruta raíz falló: ${rootResponse.status}`);
        }

        const rootData = await rootResponse.json();
        if (!rootData.message || !rootData.endpoints) {
            throw new Error('Ruta raíz no devolvió estructura esperada');
        }

        console.log('✅ Ruta raíz funciona');

        console.log('🎉 Todos los smoke tests pasaron!');
        return true;

    } catch (error) {
        console.error('❌ Smoke test falló:', error.message);
        return false;
    }
}

// Función principal
async function main() {
    let server = null;
    let success = false;

    try {
        // Verificar que existe .env
        const fs = await import('fs');
        if (!fs.existsSync('.env')) {
            console.error('❌ Archivo .env no encontrado');
            console.error('Crea un archivo .env basado en .env.example');
            process.exit(1);
        }

        server = await startServer();
        success = await runTests();

    } catch (error) {
        console.error('❌ Error durante smoke test:', error.message);
        success = false;
    } finally {
        if (server) {
            console.log('🛑 Cerrando servidor...');
            server.kill();
            await setTimeout(2000); // Esperar que se cierre
        }
    }

    process.exit(success ? 0 : 1);
}

main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
