const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Verificando estructura de la tabla producto_variante...');

// Verificar la estructura actual
db.all("PRAGMA table_info(producto_variante);", (err, rows) => {
  if (err) {
    console.error('❌ Error al verificar tabla:', err.message);
    return;
  }
  
  console.log('📋 Estructura actual de producto_variante:');
  rows.forEach(row => {
    console.log(`  - ${row.name}: ${row.type} ${row.notnull ? 'NOT NULL' : ''} ${row.dflt_value ? `DEFAULT ${row.dflt_value}` : ''}`);
  });
  
  // Verificar si existe la columna precio_venta
  const hasPrecioVenta = rows.some(row => row.name === 'precio_venta');
  
  if (!hasPrecioVenta) {
    console.log('🔧 Agregando columna precio_venta...');
    
    db.run("ALTER TABLE producto_variante ADD COLUMN precio_venta DECIMAL(20,2) DEFAULT 0.00;", (err) => {
      if (err) {
        console.error('❌ Error al agregar columna:', err.message);
      } else {
        console.log('✅ Columna precio_venta agregada exitosamente');
      }
      
      // Verificar la nueva estructura
      db.all("PRAGMA table_info(producto_variante);", (err, newRows) => {
        if (err) {
          console.error('❌ Error al verificar nueva estructura:', err.message);
        } else {
          console.log('📋 Nueva estructura de producto_variante:');
          newRows.forEach(row => {
            console.log(`  - ${row.name}: ${row.type} ${row.notnull ? 'NOT NULL' : ''} ${row.dflt_value ? `DEFAULT ${row.dflt_value}` : ''}`);
          });
        }
        
        db.close();
      });
    });
  } else {
    console.log('✅ La columna precio_venta ya existe');
    db.close();
  }
});
