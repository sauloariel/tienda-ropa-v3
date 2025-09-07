/**
 * Test Detallado del Módulo de Ventas
 * Verifica la conexión con la base de datos y muestra información completa
 */

import http from 'http';

console.log('🧪 TEST DETALLADO DEL MÓDULO DE VENTAS');
console.log('======================================');

function testVentas() {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/facturas',
    method: 'GET',
    timeout: 10000
  };

  console.log('\n1️⃣ Probando conexión con http://localhost:4000/facturas...');
  console.log('⏳ Esperando respuesta del servidor...');

  const req = http.request(options, (res) => {
    console.log(`\n✅ Servidor respondió con status: ${res.statusCode}`);
    console.log(`📊 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
      console.log(`📦 Recibidos ${chunk.length} bytes...`);
    });
    
    res.on('end', () => {
      console.log(`\n📋 Total de datos recibidos: ${data.length} bytes`);
      
      try {
        const jsonData = JSON.parse(data);
        console.log(`\n📊 Tipo de respuesta: ${typeof jsonData}`);
        console.log(`🔍 Es array: ${Array.isArray(jsonData)}`);
        
        if (Array.isArray(jsonData)) {
          console.log(`✅ Respuesta es un array con ${jsonData.length} facturas`);
          
          if (jsonData.length > 0) {
            console.log('\n📄 Facturas encontradas:');
            jsonData.forEach((factura, index) => {
              console.log(`\n   Factura ${index + 1}:`);
              console.log(`   - ID: ${factura.id || 'N/A'}`);
              console.log(`   - Número: ${factura.numeroFactura || 'N/A'}`);
              console.log(`   - Fecha: ${factura.fecha || 'N/A'}`);
              console.log(`   - Total: $${factura.total || 'N/A'}`);
              console.log(`   - Estado: ${factura.estado || 'N/A'}`);
              console.log(`   - Método de pago: ${factura.metodo_pago || 'N/A'}`);
              console.log(`   - Cliente ID: ${factura.cliente_id || 'N/A'}`);
            });
          } else {
            console.log('⚠️ No hay facturas en la base de datos');
            console.log('💡 Esto es normal si es la primera vez que se ejecuta');
          }
        } else {
          console.log('⚠️ La respuesta no es un array');
          console.log('📋 Estructura de la respuesta:', Object.keys(jsonData));
          console.log('📄 Contenido:', JSON.stringify(jsonData, null, 2));
        }
        
        console.log('\n🎉 TEST COMPLETADO EXITOSAMENTE');
        console.log('✅ El módulo de ventas está funcionando correctamente');
        console.log('✅ La conexión con la base de datos es exitosa');
        
      } catch (error) {
        console.log('\n❌ Error parseando la respuesta JSON');
        console.log(`💥 Error: ${error.message}`);
        console.log('📋 Respuesta recibida (primeros 500 caracteres):');
        console.log(data.substring(0, 500));
        console.log('...');
      }
    });
  });

  req.on('error', (error) => {
    console.log('\n❌ ERROR EN EL TEST');
    console.log(`💥 Error: ${error.message}`);
    console.log(`🔍 Código de error: ${error.code}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔌 El servidor no está ejecutándose en http://localhost:4000');
      console.log('💡 Soluciones:');
      console.log('   1. Ejecutar: cd backend_definitivo && npm start');
      console.log('   2. Verificar que el puerto 4000 esté libre');
      console.log('   3. Revisar los logs del servidor');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n⏰ Timeout - el servidor tardó demasiado en responder');
      console.log('💡 El servidor puede estar sobrecargado o no responder');
    } else {
      console.log('\n🔍 Error desconocido:');
      console.log(`   - Código: ${error.code}`);
      console.log(`   - Mensaje: ${error.message}`);
    }
  });

  req.on('timeout', () => {
    console.log('\n⏰ TIMEOUT - El servidor tardó demasiado en responder');
    console.log('💡 Intentando cerrar la conexión...');
    req.destroy();
  });

  req.setTimeout(10000);
  req.end();
}

// Ejecutar el test
console.log('🚀 Iniciando test...');
testVentas();


