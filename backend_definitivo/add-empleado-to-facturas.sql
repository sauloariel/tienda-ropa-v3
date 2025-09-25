-- Script para agregar la columna empleado_id a la tabla facturas
-- Ejecutar este script en la base de datos SQLite

-- Agregar la columna empleado_id a la tabla facturas
ALTER TABLE facturas ADD COLUMN empleado_id INTEGER;

-- Agregar la foreign key constraint
-- Nota: SQLite no soporta ADD CONSTRAINT, así que se debe recrear la tabla
-- o usar una migración más compleja

-- Crear un índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_facturas_empleado_id ON facturas(empleado_id);

-- Actualizar facturas existentes con un empleado por defecto (opcional)
-- UPDATE facturas SET empleado_id = 1 WHERE empleado_id IS NULL;

-- Verificar la estructura de la tabla
-- PRAGMA table_info(facturas);