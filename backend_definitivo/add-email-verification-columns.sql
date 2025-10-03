-- Script para agregar campos de verificación de email a la tabla clientes

-- Agregar columna para indicar si el email está verificado
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN DEFAULT FALSE;

-- Agregar columna para almacenar el token de verificación
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS token_verificacion VARCHAR(255);

-- Agregar columna para almacenar la fecha de creación del token
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS fecha_token_verificacion TIMESTAMP;

-- Crear índice para mejorar el rendimiento de búsquedas por token
CREATE INDEX IF NOT EXISTS idx_clientes_token_verificacion ON clientes(token_verificacion);

-- Crear índice para mejorar el rendimiento de búsquedas por email verificado
CREATE INDEX IF NOT EXISTS idx_clientes_email_verificado ON clientes(email_verificado);

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'clientes' 
AND column_name IN ('email_verificado', 'token_verificacion', 'fecha_token_verificacion')
ORDER BY column_name;

-- Mostrar mensaje de confirmación
SELECT 'Campos de verificación de email agregados exitosamente a la tabla clientes' as mensaje;





