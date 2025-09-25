-- Script para agregar la columna precio_venta a la tabla producto_variante
ALTER TABLE producto_variante ADD COLUMN precio_venta DECIMAL(20,2) DEFAULT 0.00;


