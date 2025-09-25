-- Script para agregar columna temporada a la tabla productos
-- Ejecutar este script para agregar el campo temporada a la tabla productos

-- Verificar si la columna temporada ya existe
PRAGMA table_info(productos);

-- Agregar columna temporada si no existe
-- NOTA: SQLite no soporta ALTER TABLE para agregar columnas con valores por defecto complejos
-- Por lo que agregamos la columna y luego actualizamos los valores

-- Paso 1: Agregar la columna temporada
ALTER TABLE productos ADD COLUMN temporada VARCHAR(50) DEFAULT 'todas-las-temporadas';

-- Paso 2: Actualizar productos existentes con una temporada por defecto
-- (Opcional: puedes cambiar 'todas-las-temporadas' por la temporada que prefieras)
UPDATE productos SET temporada = 'todas-las-temporadas' WHERE temporada IS NULL;

-- Verificar que la columna se agregó correctamente
PRAGMA table_info(productos);

-- Mostrar algunos ejemplos de productos con sus temporadas
SELECT id_producto, descripcion, temporada FROM productos LIMIT 10;





