// Script simple para ejecutar el SQL de pedidos usando el sistema de archivos
const fs = require('fs');
const path = require('path');

console.log('🚀 Cargando datos de pedidos en la base de datos...');

// Leer el archivo SQL
const sqlPath = path.join(__dirname, 'pedidos-data.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

console.log('✅ Archivo SQL leído correctamente');
console.log('📊 Contenido del archivo:');
console.log('   - 4 Clientes');
console.log('   - 2 Empleados');
console.log('   - 4 Categorías');
console.log('   - 3 Proveedores');
console.log('   - 8 Productos');
console.log('   - 8 Pedidos');
console.log('   - 12 Detalles de pedidos');

console.log('\n📋 INSTRUCCIONES PARA CARGAR LOS DATOS:');
console.log('1. Asegúrate de que el servidor backend esté corriendo');
console.log('2. Ejecuta el siguiente comando en la terminal:');
console.log(`   sqlite3 database.sqlite < "${sqlPath}"`);
console.log('3. O copia y pega el siguiente SQL en tu cliente de base de datos:');

console.log('\n' + '='.repeat(80));
console.log('SQL PARA EJECUTAR:');
console.log('='.repeat(80));
console.log(sqlContent);
console.log('='.repeat(80));

console.log('\n💡 DESPUÉS DE EJECUTAR EL SQL:');
console.log('   - Los pedidos aparecerán en el módulo de pedidos del panel administrativo');
console.log('   - Podrás ver los productos que compró cada cliente');
console.log('   - Los pedidos incluyen tanto ventas físicas como web');
console.log('   - Habrá diferentes estados: completado, procesando, pendiente, cancelado');

console.log('\n🎉 ¡Archivo SQL listo para ejecutar!');
