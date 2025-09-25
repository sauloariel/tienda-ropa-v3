
-- Insertar clientes
INSERT OR IGNORE INTO clientes (id_cliente, dni, cuit_cuil, nombre, apellido, domicilio, telefono, mail, estado) VALUES
(1, '12345678', '20-12345678-9', 'Juan', 'Pérez', 'Calle Falsa 123', '1145678901', 'juan.perez@email.com', 'ACTIVO'),
(2, '87654321', '20-87654321-0', 'María', 'González', 'Av. Siempre Viva 456', '1156789012', 'maria.gonzalez@email.com', 'ACTIVO'),
(3, '11223344', '20-11223344-5', 'Carlos', 'López', 'Calle Principal 789', '1167890123', 'carlos.lopez@email.com', 'ACTIVO'),
(4, '55667788', '20-55667788-1', 'Ana', 'Martínez', 'Boulevard Central 321', '1178901234', 'ana.martinez@email.com', 'ACTIVO');

-- Insertar empleados
INSERT OR IGNORE INTO empleados (id_empleado, cuil, nombre, apellido, domicilio, telefono, mail, sueldo, puesto, estado) VALUES
(1, '20-12345678-9', 'Luis', 'Vendedor', 'Calle Empleado 100', '1189012345', 'luis.vendedor@tienda.com', 50000.00, 'Vendedor', 'ACTIVO'),
(2, '20-98765432-1', 'Sofia', 'Cajera', 'Av. Trabajador 200', '1190123456', 'sofia.cajera@tienda.com', 45000.00, 'Cajera', 'ACTIVO');

-- Insertar categorías
INSERT OR IGNORE INTO categorias (id_categoria, nombre_categoria, descripcion, estado) VALUES
(1, 'Ropa', 'Vestimenta para todas las edades', 'ACTIVO'),
(2, 'Calzado', 'Zapatos y zapatillas', 'ACTIVO'),
(3, 'Accesorios', 'Complementos y accesorios', 'ACTIVO'),
(4, 'Deportes', 'Ropa y calzado deportivo', 'ACTIVO');

-- Insertar proveedores
INSERT OR IGNORE INTO proveedores (id_proveedor, nombre, contacto, direccion, telefono) VALUES
(1, 'Proveedor Textil S.A.', 'Roberto García', 'Av. Industrial 1000', '11-4000-0001'),
(2, 'Calzados del Norte', 'Patricia Fernández', 'Calle Calzado 500', '11-4000-0002'),
(3, 'Accesorios Moda', 'Diego Rodríguez', 'Boulevard Accesorios 300', '11-4000-0003');

-- Insertar productos
INSERT OR IGNORE INTO productos (id_producto, descripcion, id_proveedor, id_categoria, stock, precio_venta, precio_compra, stock_seguridad, estado) VALUES
(1, 'Remera Básica Algodón', 1, 1, 50, 2500.00, 1500.00, 10, 'ACTIVO'),
(2, 'Jean Clásico Azul', 1, 1, 30, 8500.00, 5000.00, 5, 'ACTIVO'),
(3, 'Zapatillas Deportivas', 2, 2, 25, 12000.00, 8000.00, 5, 'ACTIVO'),
(4, 'Campera de Cuero', 1, 1, 15, 25000.00, 15000.00, 3, 'ACTIVO'),
(5, 'Bolso de Cuero', 3, 3, 20, 8000.00, 5000.00, 5, 'ACTIVO'),
(6, 'Gorra Deportiva', 3, 4, 40, 3500.00, 2000.00, 10, 'ACTIVO'),
(7, 'Pantalón Deportivo', 1, 4, 35, 6000.00, 3500.00, 8, 'ACTIVO'),
(8, 'Zapatos de Vestir', 2, 2, 20, 15000.00, 9000.00, 4, 'ACTIVO');

-- Insertar pedidos
INSERT OR IGNORE INTO pedidos (id_pedido, id_cliente, id_empleados, fecha_pedido, importe, estado, anulacion, venta_web, payment_id) VALUES
(1, 1, 1, '2024-01-15 10:30:00', 11000.00, 'completado', 0, 0, NULL),
(2, 2, 1, '2024-01-16 14:20:00', 12000.00, 'completado', 0, 0, NULL),
(3, 3, 1, '2024-01-17 09:15:00', 33000.00, 'procesando', 0, 0, NULL),
(4, 4, 1, '2024-01-18 16:45:00', 9500.00, 'pendiente', 0, 0, NULL),
(5, 1, 1, '2024-01-19 11:30:00', 15000.00, 'completado', 0, 1, 'web_123456789'),
(6, 2, 1, '2024-01-20 13:20:00', 17500.00, 'completado', 0, 1, 'web_987654321'),
(7, 3, 1, '2024-01-21 15:10:00', 22000.00, 'cancelado', 1, 0, NULL),
(8, 4, 1, '2024-01-22 10:00:00', 12000.00, 'completado', 0, 1, 'web_456789123');

-- Insertar detalles de pedidos
INSERT OR IGNORE INTO detalle_pedidos (id_pedido, id_producto, precio_venta, cantidad, descuento) VALUES
-- Pedido 1: Juan Pérez - $11,000
(1, 1, 2500.00, 2, 0.00),
(1, 2, 8500.00, 1, 500.00),

-- Pedido 2: María González - $12,000
(2, 3, 12000.00, 1, 0.00),

-- Pedido 3: Carlos López - $33,000
(3, 4, 25000.00, 1, 0.00),
(3, 5, 8000.00, 1, 0.00),

-- Pedido 4: Ana Martínez - $9,500
(4, 6, 3500.00, 2, 0.00),
(4, 7, 6000.00, 1, 500.00),

-- Pedido 5: Juan Pérez (Web) - $15,000
(5, 8, 15000.00, 1, 0.00),

-- Pedido 6: María González (Web) - $17,500
(6, 1, 2500.00, 3, 0.00),
(6, 3, 12000.00, 1, 2000.00),

-- Pedido 7: Carlos López (Cancelado) - $22,000
(7, 4, 25000.00, 1, 3000.00),

-- Pedido 8: Ana Martínez (Web) - $12,000
(8, 3, 12000.00, 1, 0.00);
