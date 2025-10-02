import fetch from 'node-fetch';

console.log('🔍 Test de Conexión Simple');
console.log('==========================\n');

async function testConnection() {
    try {
        console.log('🔍 Probando conexión a http://localhost:4000...');

        const response = await fetch('http://localhost:4000/api/productos');

        if (response.ok) {
            console.log('✅ Servidor respondiendo correctamente');
            const data = await response.json();
            console.log(`📊 Productos encontrados: ${data.length}`);
        } else {
            console.log(`❌ Error del servidor: ${response.status}`);
        }

    } catch (error) {
        console.error('❌ Error de conexión:', error.message);

        if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 El servidor no está ejecutándose en el puerto 4000');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('💡 No se puede resolver localhost');
        }
    }
}

testConnection();





















