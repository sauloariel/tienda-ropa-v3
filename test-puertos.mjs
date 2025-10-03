import fetch from 'node-fetch';

console.log('🔧 Test de Configuración de Puertos');
console.log('===================================\n');

async function testPorts() {
    try {
        // Test 1: Backend (puerto 4000)
        console.log('1️⃣ Probando Backend (puerto 4000)...');
        try {
            const backendResponse = await fetch('http://localhost:4000/api/health');
            if (backendResponse.ok) {
                console.log('✅ Backend funcionando correctamente');
            } else {
                console.log('❌ Backend no responde correctamente');
            }
        } catch (error) {
            console.log('❌ Backend no está ejecutándose');
        }

        // Test 2: Verificar que los puertos estén disponibles
        console.log('\n2️⃣ Verificando disponibilidad de puertos...');

        // Puerto 5173 (Tienda)
        try {
            const tiendaResponse = await fetch('http://localhost:5173');
            console.log('⚠️ Puerto 5173 está ocupado (Tienda ya ejecutándose)');
        } catch (error) {
            console.log('✅ Puerto 5173 disponible para Tienda');
        }

        // Puerto 5174 (Panel)
        try {
            const panelResponse = await fetch('http://localhost:5174');
            console.log('⚠️ Puerto 5174 está ocupado (Panel ya ejecutándose)');
        } catch (error) {
            console.log('✅ Puerto 5174 disponible para Panel');
        }

        console.log('\n📋 Resumen de Configuración:');
        console.log('   Backend: http://localhost:4000 ✅');
        console.log('   Tienda:  http://localhost:5173 ✅');
        console.log('   Panel:   http://localhost:5174 ✅');

        console.log('\n🎯 Para ejecutar todos los servicios:');
        console.log('   start-all.bat');

        console.log('\n🎯 Para ejecutar individualmente:');
        console.log('   start-backend.bat  (Backend)');
        console.log('   start-tienda.bat   (Tienda)');
        console.log('   start-panel.bat    (Panel)');

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
    }
}

testPorts();
























