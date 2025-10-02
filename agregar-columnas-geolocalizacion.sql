-- Script para agregar columnas de geolocalización a la tabla pedidos
-- Ejecutar en la base de datos existente

-- Agregar columnas para coordenadas
ALTER TABLE pedidos ADD COLUMN latitud DECIMAL(10, 8) NULL;
ALTER TABLE pedidos ADD COLUMN longitud DECIMAL(11, 8) NULL;

-- Agregar columnas para información adicional de envío
ALTER TABLE pedidos ADD COLUMN telefono_contacto VARCHAR(255) NULL;
ALTER TABLE pedidos ADD COLUMN notas_entrega TEXT NULL;

-- Verificar que las columnas se agregaron correctamente
PRAGMA table_info(pedidos);





