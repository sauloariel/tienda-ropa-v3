-- Script para agregar columnas faltantes a la tabla loguin
-- Ejecutar en PostgreSQL

-- Agregar columna ultimo_acceso si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'loguin' AND column_name = 'ultimo_acceso') THEN
        ALTER TABLE loguin ADD COLUMN ultimo_acceso TIMESTAMP;
    END IF;
END $$;

-- Agregar columna activo si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'loguin' AND column_name = 'activo') THEN
        ALTER TABLE loguin ADD COLUMN activo BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Agregar columna password_provisoria si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'loguin' AND column_name = 'password_provisoria') THEN
        ALTER TABLE loguin ADD COLUMN password_provisoria BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Agregar columna fecha_cambio_pass si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'loguin' AND column_name = 'fecha_cambio_pass') THEN
        ALTER TABLE loguin ADD COLUMN fecha_cambio_pass TIMESTAMP;
    END IF;
END $$;

-- Verificar estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'loguin' 
ORDER BY ordinal_position;

