const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta a la base de datos
const dbPath = path.join(__dirname, 'database.sqlite');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath);

console.log('🔧 Inicializando tablas de facturación...');

// Script SQL para crear las tablas
const createTablesSQL = `
-- Tabla de facturas principales
CREATE TABLE IF NOT EXISTS facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numeroFactura VARCHAR(20) NOT NULL UNIQUE,
    fecha DATETIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    cliente_id INTEGER,
    estado VARCHAR(20) NOT NULL DEFAULT 'activa',
    metodo_pago VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabla de detalles de factura
CREATE TABLE IF NOT EXISTS detalle_facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    factura_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (factura_id) REFERENCES facturas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_facturas_numero ON facturas(numeroFactura);
CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_detalle_facturas_factura_id ON detalle_facturas(factura_id);
CREATE INDEX IF NOT EXISTS idx_detalle_facturas_producto_id ON detalle_facturas(producto_id);
`;

// Ejecutar el script SQL
db.exec(createTablesSQL, (err) => {
    if (err) {
        console.error('❌ Error al crear las tablas:', err.message);
    } else {
        console.log('✅ Tablas de facturación creadas exitosamente');

        // Verificar que las tablas se crearon
        db.all("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('facturas', 'detalle_facturas')", (err, rows) => {
            if (err) {
                console.error('❌ Error al verificar tablas:', err.message);
            } else {
                console.log('📋 Tablas disponibles:', rows.map(row => row.name));
                console.log('🎉 Sistema de facturación listo para usar');
            }
            db.close();
        });
    }
});
