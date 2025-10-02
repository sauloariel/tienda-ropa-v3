-- Script para crear la tabla de relación promociones-productos en PostgreSQL
-- Ejecutar este script en la base de datos PostgreSQL

-- Tabla de relación promociones-productos
CREATE TABLE IF NOT EXISTS promociones_productos (
    id SERIAL PRIMARY KEY,
    id_promocion INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_promocion) REFERENCES promociones(id_promocion) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    UNIQUE(id_promocion, id_producto)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_promociones_productos_promocion ON promociones_productos(id_promocion);
CREATE INDEX IF NOT EXISTS idx_promociones_productos_producto ON promociones_productos(id_producto);

-- Verificar que la tabla se creó correctamente
SELECT 'Tabla promociones_productos creada exitosamente' as mensaje;
SELECT COUNT(*) as total_relaciones FROM promociones_productos;