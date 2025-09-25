-- Arreglar secuencia de pedidos
SELECT setval('pedidos_id_pedido_seq', (SELECT COALESCE(MAX(id_pedido), 0) + 1 FROM pedidos), false);

-- Verificar que funciona
SELECT nextval('pedidos_id_pedido_seq') as next_id;














