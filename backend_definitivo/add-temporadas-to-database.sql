-- Script para agregar soporte de temporadas a la base de datos

-- 1. Crear tabla temporadas
CREATE TABLE IF NOT EXISTS temporadas (
    id_temporada INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(8) DEFAULT 'ACTIVO',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insertar temporadas por defecto
INSERT OR IGNORE INTO temporadas (id_temporada, nombre, descripcion, estado) VALUES
(1, 'Verano', 'Colección de verano con ropa fresca y cómoda', 'ACTIVO'),
(2, 'Invierno', 'Colección de invierno con abrigos y ropa de abrigo', 'ACTIVO'),
(3, 'Otoño', 'Colección de otoño con jerseys y ropa de transición', 'ACTIVO'),
(4, 'Primavera', 'Colección de primavera con ropa fresca y liviana', 'ACTIVO'),
(5, 'Todas las temporadas', 'Ropa básica que se vende durante todo el año', 'ACTIVO');

-- 3. Agregar campo temporada a la tabla productos
ALTER TABLE productos ADD COLUMN id_temporada INTEGER DEFAULT 1;

-- 4. Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_productos_temporada ON productos(id_temporada);

-- 5. Crear foreign key constraint (opcional, comentado para compatibilidad)
-- ALTER TABLE productos ADD CONSTRAINT fk_productos_temporada 
-- FOREIGN KEY (id_temporada) REFERENCES temporadas(id_temporada);

PRAGMA table_info(temporadas);
PRAGMA table_info(productos);







