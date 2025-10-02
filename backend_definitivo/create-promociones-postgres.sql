-- Script para crear la tabla de promociones en PostgreSQL
-- Ejecutar este script en la base de datos PostgreSQL

-- Crear tabla de promociones
CREATE TABLE IF NOT EXISTS promociones (
    id_promocion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('PORCENTAJE', 'MONTO_FIJO', '2X1', 'DESCUENTO_ESPECIAL')),
    valor DECIMAL(10,2) NOT NULL,
    codigo_descuento VARCHAR(50) UNIQUE,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    minimo_compra DECIMAL(10,2),
    uso_maximo INTEGER,
    uso_actual INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'INACTIVA', 'EXPIRADA')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_promociones_updated_at ON promociones;
CREATE TRIGGER update_promociones_updated_at
    BEFORE UPDATE ON promociones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_promociones_estado ON promociones(estado);
CREATE INDEX IF NOT EXISTS idx_promociones_tipo ON promociones(tipo);
CREATE INDEX IF NOT EXISTS idx_promociones_fecha_inicio ON promociones(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_promociones_fecha_fin ON promociones(fecha_fin);
CREATE INDEX IF NOT EXISTS idx_promociones_codigo ON promociones(codigo_descuento);

-- Insertar datos de ejemplo
INSERT INTO promociones (nombre, descripcion, tipo, valor, codigo_descuento, fecha_inicio, fecha_fin, minimo_compra, uso_maximo, estado) VALUES 
('Descuento 20% Verano', 'Descuento especial para la temporada de verano', 'PORCENTAJE', 20.00, 'VERANO20', '2025-01-01 00:00:00', '2025-03-31 23:59:59', 50.00, 100, 'ACTIVA'),
('Descuento Fijo $10', 'Descuento fijo de $10 en compras mayores a $30', 'MONTO_FIJO', 10.00, 'DESC10', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 30.00, 200, 'ACTIVA'),
('2x1 en Camisetas', 'Lleva 2 camisetas y paga solo 1', '2X1', 0.00, '2X1CAMISETAS', '2025-01-15 00:00:00', '2025-02-15 23:59:59', 0.00, 50, 'ACTIVA'),
('Descuento VIP', 'Descuento especial para clientes VIP', 'DESCUENTO_ESPECIAL', 15.00, 'VIP15', '2025-01-01 00:00:00', '2025-06-30 23:59:59', 100.00, 25, 'ACTIVA'),
('Black Friday', 'Descuento del 30% en Black Friday', 'PORCENTAJE', 30.00, 'BLACK30', '2025-11-24 00:00:00', '2025-11-30 23:59:59', 75.00, 500, 'INACTIVA'),
('Descuento Navidad', 'Descuento navideño del 25%', 'PORCENTAJE', 25.00, 'NAVIDAD25', '2025-12-01 00:00:00', '2025-12-25 23:59:59', 40.00, 300, 'INACTIVA')
ON CONFLICT (codigo_descuento) DO NOTHING;

-- Verificar que la tabla se creó correctamente
SELECT 'Tabla promociones creada exitosamente' as mensaje;
SELECT COUNT(*) as total_promociones FROM promociones;










