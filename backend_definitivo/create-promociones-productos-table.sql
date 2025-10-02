-- Script para crear la tabla de relación promociones-productos
-- Ejecutar este script en la base de datos SQLite

-- Tabla de relación promociones-productos
CREATE TABLE IF NOT EXISTS promociones_productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_promocion INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_promocion) REFERENCES promociones(id_promocion) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    UNIQUE(id_promocion, id_producto)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_promociones_productos_promocion ON promociones_productos(id_promocion);
CREATE INDEX IF NOT EXISTS idx_promociones_productos_producto ON promociones_productos(id_producto);

-- Insertar datos de ejemplo (asumiendo que existen promociones y productos)
-- INSERT INTO promociones_productos (id_promocion, id_producto) VALUES 
-- (1, 1), (1, 2), (1, 3),  -- Promoción 1 aplica a productos 1, 2, 3
-- (2, 4), (2, 5),          -- Promoción 2 aplica a productos 4, 5
-- (3, 1), (3, 6), (3, 7);  -- Promoción 3 aplica a productos 1, 6, 7

-- Verificar que la tabla se creó correctamente
SELECT 'Tabla promociones_productos creada exitosamente' as mensaje;
SELECT COUNT(*) as total_relaciones FROM promociones_productos;

