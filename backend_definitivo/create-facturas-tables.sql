-- Script para crear las tablas de facturas
-- Ejecutar este script en la base de datos SQLite

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

-- Insertar datos de ejemplo (opcional)
-- INSERT INTO facturas (numeroFactura, fecha, total, metodo_pago, estado) 
-- VALUES ('F2025010001', '2025-01-15 10:30:00', 150.00, 'efectivo', 'activa');

-- INSERT INTO detalle_facturas (factura_id, producto_id, cantidad, precio_unitario, subtotal)
-- VALUES (1, 1, 2, 75.00, 150.00);
