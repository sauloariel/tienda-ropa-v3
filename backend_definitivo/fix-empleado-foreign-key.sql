-- Script para corregir la foreign key de empleado_id en la tabla facturas
-- La columna debe referenciar id_empleado de la tabla empleados

-- Primero eliminar la foreign key existente si existe
ALTER TABLE facturas DROP CONSTRAINT IF EXISTS fk_facturas_empleado_id;

-- Eliminar el índice existente si existe
DROP INDEX IF EXISTS idx_facturas_empleado_id;

-- Crear la foreign key correcta que apunte a id_empleado
ALTER TABLE facturas 
ADD CONSTRAINT fk_facturas_empleado_id 
FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado);

-- Crear el índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_facturas_empleado_id ON facturas(empleado_id);

-- Verificar la estructura de la tabla
-- \d facturas;









