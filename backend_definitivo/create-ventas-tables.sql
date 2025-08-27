-- Script para crear las tablas de ventas en el sistema POS

-- Tabla de ventas principales
CREATE TABLE IF NOT EXISTS ventas (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    cliente_id INTEGER,
    empleado_id INTEGER,
    estado VARCHAR(20) NOT NULL DEFAULT 'completada',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id_cliente),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado)
);

-- Tabla de detalles de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id_detalle_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_empleado ON ventas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);

CREATE INDEX IF NOT EXISTS idx_detalle_ventas_venta ON detalle_ventas(id_venta);
CREATE INDEX IF NOT EXISTS idx_detalle_ventas_producto ON detalle_ventas(id_producto);

-- Insertar algunos datos de ejemplo (opcional)
-- INSERT INTO ventas (fecha_venta, total, metodo_pago, estado) VALUES 
-- (CURRENT_TIMESTAMP, 150.00, 'efectivo', 'completada'),
-- (CURRENT_TIMESTAMP, 89.99, 'tarjeta', 'completada');

-- INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES 
-- (1, 1, 2, 75.00, 150.00),
-- (2, 2, 1, 89.99, 89.99);

