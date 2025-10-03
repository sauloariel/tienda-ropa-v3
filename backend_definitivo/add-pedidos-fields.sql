-- Agregar nuevos campos a la tabla pedidos para información de entrega
-- Estos campos son necesarios para que el panel administrativo pueda procesar los pedidos

-- Agregar columna para dirección de entrega
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS direccion_entrega TEXT;

-- Agregar columna para horario de recepción
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS horario_recepcion VARCHAR(100);

-- Agregar columna para descripción del pedido
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS descripcion_pedido TEXT;

-- Agregar comentarios a las columnas para documentación
COMMENT ON COLUMN pedidos.direccion_entrega IS 'Dirección completa de entrega del pedido';
COMMENT ON COLUMN pedidos.horario_recepcion IS 'Horario preferido para recibir el pedido';
COMMENT ON COLUMN pedidos.descripcion_pedido IS 'Descripción detallada del pedido con especificaciones';

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
AND column_name IN ('direccion_entrega', 'horario_recepcion', 'descripcion_pedido')
ORDER BY column_name;























