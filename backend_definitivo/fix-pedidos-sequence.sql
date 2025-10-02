-- Verificar si la secuencia existe
SELECT EXISTS (
    SELECT 1 FROM pg_sequences 
    WHERE schemaname = 'public' 
    AND sequencename = 'pedidos_id_pedido_seq'
) as sequence_exists;

-- Obtener el máximo ID actual
SELECT COALESCE(MAX(id_pedido), 0) as max_id FROM pedidos;

-- Crear la secuencia si no existe
CREATE SEQUENCE IF NOT EXISTS pedidos_id_pedido_seq 
START WITH 32  -- Usar un valor mayor que el máximo actual
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

-- Asignar la secuencia a la columna
ALTER TABLE pedidos ALTER COLUMN id_pedido SET DEFAULT nextval('pedidos_id_pedido_seq');

-- Verificar que la secuencia está asignada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
AND column_name = 'id_pedido';



















