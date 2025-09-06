#!/usr/bin/env node

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

const FRONTEND_URL = 'http://localhost:5173';

console.log('🧪 Iniciando smoke test de tienda-ropa...');

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

// Función para build
async function buildProject() {
    return new Promise((resolve, reject) => {
        console.log('🔨 Construyendo proyecto...');

        const build = spawn('npm', ['run', 'build'], {
            cwd: process.cwd(),
            stdio: 'pipe',
            shell: true
        });

        let output = '';

        build.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.log(`[BUILD] ${text.trim()}`);
        });

        build.stderr.on('data', (data) => {
            const text = data.toString();
            console.error(`[BUILD ERROR] ${text.trim()}`);
        });

        build.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Build exitoso');
                resolve();
            } else {
                console.error('❌ Build falló');
                reject(new Error(`Build terminó con código ${code}`));
            }
        });

        build.on('error', (error) => {
            console.error('❌ Error durante build:', error);
            reject(error);
        });
    });
}

// Función para iniciar preview
function startPreview() {
    return new Promise((resolve, reject) => {
        console.log('🚀 Iniciando preview...');

        const preview = spawn('npm', ['run', 'preview', '--', '--port', '5173'], {
            cwd: process.cwd(),
            stdio: 'pipe',
            shell: true
        });

        let previewReady = false;
        let output = '';

        preview.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.log(`[PREVIEW] ${text.trim()}`);

            // Detectar cuando el preview está listo
            if (text.includes('Local:') && text.includes('5173')) {
                previewReady = true;
                resolve(preview);
            }
        });

        preview.stderr.on('data', (data) => {
            const text = data.toString();
            console.error(`[PREVIEW ERROR] ${text.trim()}`);
        });

        preview.on('error', (error) => {
            console.error('❌ Error al iniciar preview:', error);
            reject(error);
        });

        preview.on('exit', (code) => {
            if (!previewReady) {
                console.error('❌ Preview terminó antes de estar listo');
                console.error('Output del preview:', output);
                reject(new Error(`Preview terminó con código ${code}`));
            }
        });

        // Timeout de 30 segundos
        setTimeout(() => {
            if (!previewReady) {
                console.error('❌ Timeout esperando que el preview esté listo');
                preview.kill();
                reject(new Error('Timeout iniciando preview'));
            }
        }, 30000);
    });
}

// Función para ejecutar tests
async function runTests() {
    try {
        console.log('⏳ Esperando que el preview esté completamente listo...');
        await setTimeout(3000); // Esperar 3 segundos adicionales

        // Test: Verificar que la página carga
        console.log('🔍 Test: Verificando que la página carga...');
        const response = await fetchWithTimeout(FRONTEND_URL);

        if (!response.ok) {
            throw new Error(`Página no carga: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();

        // Verificar elementos básicos
        if (!html.includes('<div id="root">')) {
            throw new Error('No se encontró div#root en el HTML');
        }

        // Verificar que no está completamente vacío
        if (html.length < 100) {
            throw new Error('HTML parece estar vacío o muy corto');
        }

        console.log('✅ Página carga correctamente');
        console.log(`📊 Tamaño del HTML: ${html.length} caracteres`);

        return true;

    } catch (error) {
        console.error('❌ Smoke test falló:', error.message);
        return false;
    }
}

// Función principal
async function main() {
    let preview = null;
    let success = false;

    try {
        await buildProject();
        preview = await startPreview();
        success = await runTests();

    } catch (error) {
        console.error('❌ Error durante smoke test:', error.message);
        success = false;
    } finally {
        if (preview) {
            console.log('🛑 Cerrando preview...');
            preview.kill();
            await setTimeout(2000); // Esperar que se cierre
        }
    }

    process.exit(success ? 0 : 1);
}

main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
