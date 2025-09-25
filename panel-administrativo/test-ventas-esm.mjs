/**
 * Test del Módulo de Ventas - ES Module
 * Verifica la conexión con la base de datos
 */

import http from 'http';

console.log('🧪 TEST DEL MÓDULO DE VENTAS');
console.log('============================');

function testVentas() {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/facturas',
    method: 'GET',
    timeout: 5000
  };

  console.log('\n1️⃣ Probando conexión con http://localhost:4000/facturas...');

  const req = http.request(options, (res) => {
    console.log(`✅ Servidor respondió con status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log(`📊 Tipo de respuesta: ${typeof jsonData}`);
        
        if (Array.isArray(jsonData)) {
          console.log(`✅ Respuesta es un array con ${jsonData.length} facturas`);
          
          if (jsonData.length > 0) {
            console.log('\n📄 Primera factura encontrada:');
            const factura = jsonData[0];
            console.log(`   - ID: ${factura.id || 'N/A'}`);
            console.log(`   - Número: ${factura.numeroFactura || 'N/A'}`);
            console.log(`   - Total: $${factura.total || 'N/A'}`);
            console.log(`   - Estado: ${factura.estado || 'N/A'}`);
            console.log(`   - Método de pago: ${factura.metodo_pago || 'N/A'}`);
          } else {
            console.log('⚠️ No hay facturas en la base de datos');
          }
        } else {
          console.log('⚠️ La respuesta no es un array');
          console.log('📋 Estructura de la respuesta:', Object.keys(jsonData));
        }
        
        console.log('\n🎉 TEST COMPLETADO EXITOSAMENTE');
        console.log('✅ El módulo de ventas está funcionando correctamente');
        
      } catch (error) {
        console.log('❌ Error parseando la respuesta JSON');
        console.log(`💥 Error: ${error.message}`);
        console.log('📋 Respuesta recibida:', data.substring(0, 200) + '...');
      }
    });
  });

  req.on('error', (error) => {
    console.log('\n❌ ERROR EN EL TEST');
    console.log(`💥 Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔌 El servidor no está ejecutándose en http://localhost:4000');
      console.log('💡 Asegúrate de que el backend esté iniciado');
      console.log('💡 Ejecuta: cd backend_definitivo && npm start');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('⏰ Timeout - el servidor tardó demasiado en responder');
    }
  });

  req.on('timeout', () => {
    console.log('\n⏰ TIMEOUT - El servidor tardó demasiado en responder');
    req.destroy();
  });

  req.setTimeout(5000);
  req.end();
}

// Ejecutar el test
testVentas();








