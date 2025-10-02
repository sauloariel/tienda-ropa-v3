import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backend_definitivo', 'database.sqlite');
const db = new Database(dbPath);

try {
  console.log('🚀 Iniciando migración de geolocalización...');
  
  // Agregar columnas para coordenadas
  console.log('📍 Agregando columnas de coordenadas...');
  db.exec(`
    ALTER TABLE pedidos ADD COLUMN latitud DECIMAL(10, 8) NULL;
  `);
  console.log('✅ Columna latitud agregada');
  
  db.exec(`
    ALTER TABLE pedidos ADD COLUMN longitud DECIMAL(11, 8) NULL;
  `);
  console.log('✅ Columna longitud agregada');
  
  // Agregar columnas para información adicional de envío
  console.log('📞 Agregando columnas de contacto...');
  db.exec(`
    ALTER TABLE pedidos ADD COLUMN telefono_contacto VARCHAR(255) NULL;
  `);
  console.log('✅ Columna telefono_contacto agregada');
  
  db.exec(`
    ALTER TABLE pedidos ADD COLUMN notas_entrega TEXT NULL;
  `);
  console.log('✅ Columna notas_entrega agregada');
  
  // Verificar la estructura de la tabla
  console.log('🔍 Verificando estructura de la tabla...');
  const tableInfo = db.prepare('PRAGMA table_info(pedidos)').all();
  console.log('📋 Estructura actual de la tabla pedidos:');
  tableInfo.forEach(column => {
    console.log(`  - ${column.name}: ${column.type} ${column.notnull ? 'NOT NULL' : 'NULL'}`);
  });
  
  console.log('🎉 ¡Migración completada exitosamente!');
  
} catch (error) {
  console.error('❌ Error durante la migración:', error.message);
  if (error.message.includes('duplicate column name')) {
    console.log('💡 Las columnas ya existen en la tabla. Migración no necesaria.');
  }
} finally {
  db.close();
}





