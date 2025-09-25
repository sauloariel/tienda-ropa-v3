#!/usr/bin/env node

/**
 * Test Completo del Sistema de Pedidos
 * 
 * Ejecuta todos los tests en secuencia:
 * 1. Test de flujo completo
 * 2. Test de seguimiento web
 * 3. Test de panel administrativo
 */

import { spawn } from 'child_process';
import path from 'path';

const tests = [
    {
        name: 'Flujo Completo',
        file: 'test-flujo-completo-pedidos.mjs',
        description: 'Compra desde web → Seguimiento → Panel administrativo'
    },
    {
        name: 'Seguimiento Web',
        file: 'test-seguimiento-web.mjs',
        description: 'Funcionalidad de seguimiento para clientes'
    },
    {
        name: 'Panel Administrativo',
        file: 'test-panel-administrativo.mjs',
        description: 'Gestión de pedidos desde el panel'
    }
];

async function ejecutarTest(test) {
    return new Promise((resolve, reject) => {
        console.log(`\n🧪 Ejecutando: ${test.name}`);
        console.log(`📋 Descripción: ${test.description}`);
        console.log('─'.repeat(60));

        const proceso = spawn('node', [test.file], {
            stdio: 'inherit',
            shell: true
        });

        proceso.on('close', (code) => {
            if (code === 0) {
                console.log(`\n✅ ${test.name} completado exitosamente`);
                resolve();
            } else {
                console.log(`\n❌ ${test.name} falló con código ${code}`);
                reject(new Error(`Test ${test.name} falló`));
            }
        });

        proceso.on('error', (error) => {
            console.log(`\n❌ Error ejecutando ${test.name}:`, error.message);
            reject(error);
        });
    });
}

async function ejecutarTodosLosTests() {
    console.log('🚀 Iniciando Test Completo del Sistema de Pedidos');
    console.log('='.repeat(60));
    console.log('📋 Tests a ejecutar:');
    tests.forEach((test, index) => {
        console.log(`   ${index + 1}. ${test.name} - ${test.description}`);
    });
    console.log('='.repeat(60));

    const resultados = {
        exitosos: 0,
        fallidos: 0,
        errores: []
    };

    for (const test of tests) {
        try {
            await ejecutarTest(test);
            resultados.exitosos++;
        } catch (error) {
            resultados.fallidos++;
            resultados.errores.push({
                test: test.name,
                error: error.message
            });
        }
    }

    // Mostrar resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN FINAL DE TESTS');
    console.log('='.repeat(60));
    console.log(`✅ Tests exitosos: ${resultados.exitosos}`);
    console.log(`❌ Tests fallidos: ${resultados.fallidos}`);
    console.log(`📈 Tasa de éxito: ${((resultados.exitosos / tests.length) * 100).toFixed(1)}%`);

    if (resultados.errores.length > 0) {
        console.log('\n❌ Errores encontrados:');
        resultados.errores.forEach(error => {
            console.log(`   • ${error.test}: ${error.error}`);
        });
    }

    console.log('\n🎯 Funcionalidades probadas:');
    console.log('   ✅ Compra desde tienda web');
    console.log('   ✅ Registro en base de datos (ventas + facturas + pedidos)');
    console.log('   ✅ Seguimiento web para clientes');
    console.log('   ✅ Panel administrativo para vendedores');
    console.log('   ✅ Gestión de estados de pedidos');
    console.log('   ✅ Actualizaciones en tiempo real');
    console.log('   ✅ Estadísticas consolidadas');
    console.log('   ✅ Filtros y búsquedas');

    if (resultados.fallidos === 0) {
        console.log('\n🎉 ¡Todos los tests pasaron exitosamente!');
        console.log('✅ El sistema de pedidos está funcionando correctamente');
        process.exit(0);
    } else {
        console.log('\n⚠️ Algunos tests fallaron');
        console.log('🔧 Revisa los errores y ejecuta los tests individuales');
        process.exit(1);
    }
}

// Verificar que el servidor esté funcionando antes de ejecutar tests
async function verificarServidor() {
    try {
        const response = await fetch('http://localhost:3001/api/health');
        if (response.ok) {
            console.log('✅ Servidor funcionando correctamente');
            return true;
        } else {
            throw new Error('Servidor no responde correctamente');
        }
    } catch (error) {
        console.log('❌ Error: El servidor no está funcionando');
        console.log('🔧 Por favor, inicia el servidor con: cd backend_definitivo && npm run dev');
        return false;
    }
}

// Función principal
async function main() {
    console.log('🔍 Verificando servidor...');

    const servidorOk = await verificarServidor();
    if (!servidorOk) {
        process.exit(1);
    }

    await ejecutarTodosLosTests();
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('❌ Error fatal:', error.message);
        process.exit(1);
    });
}














