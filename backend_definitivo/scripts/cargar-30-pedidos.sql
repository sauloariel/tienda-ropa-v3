BEGIN;

-- Asegurar autoincremento en pedidos.id_pedido
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'pedidos_id_pedido_seq') THEN
    CREATE SEQUENCE public.pedidos_id_pedido_seq;
    ALTER TABLE public.pedidos
      ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedidos_id_pedido_seq');
  END IF;
  PERFORM setval('public.pedidos_id_pedido_seq',
                 COALESCE((SELECT MAX(id_pedido) FROM public.pedidos), 0));
END$$;

-- Asegurar autoincremento en detalle_pedidos.id_detalle_pedido (si existe esa PK)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='detalle_pedidos'
      AND column_name='id_detalle_pedido'
  ) THEN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname='detalle_pedidos_id_detalle_pedido_seq') THEN
      CREATE SEQUENCE public.detalle_pedidos_id_detalle_pedido_seq;
      ALTER TABLE public.detalle_pedidos
        ALTER COLUMN id_detalle_pedido SET DEFAULT nextval('detalle_pedidos_id_detalle_pedido_seq');
    END IF;
    PERFORM setval('detalle_pedidos_id_detalle_pedido_seq',
                   COALESCE((SELECT MAX(id_detalle_pedido) FROM public.detalle_pedidos), 0));
  END IF;
END$$;

-- Validaciones mínimas (deja mensaje claro si faltan datos)
DO $$
DECLARE v_prod_count int; v_cli_count int;
BEGIN
  SELECT COUNT(*) INTO v_prod_count FROM public.productos;
  IF v_prod_count = 0 THEN
    RAISE EXCEPTION 'La tabla productos está vacía. Cargá productos antes de generar pedidos.';
  END IF;

  SELECT COUNT(*) INTO v_cli_count FROM public.clientes;
  IF v_cli_count = 0 THEN
    INSERT INTO public.clientes (nombre, telefono, email)
    VALUES ('Cliente Demo', '000000', 'demo@example.com');
  END IF;
END$$;

-- ================== CARGA DE 30 PEDIDOS + DETALLES ==================
WITH new_orders AS (
  INSERT INTO public.pedidos
    (id_cliente, id_empleados, fecha_pedido, importe, estado, anulacion, venta_web, payment_id)
  SELECT
    COALESCE((SELECT id_cliente FROM public.clientes ORDER BY random() LIMIT 1), 1)         AS id_cliente,
    1                                                                                       AS id_empleados, -- <--- CAMBIÁ a tu empleado real si querés
    TIMESTAMPTZ '2023-05-01 10:00-03' + (gs-1) * INTERVAL '1 day'                           AS fecha_pedido,
    0::numeric(12,2)                                                                         AS importe,     -- se actualizará abajo
    (ARRAY['pendiente','completado','anulado'])[(gs % 3) + 1]                                AS estado,
    (gs % 4 = 0)                                                                             AS anulacion,
    (gs % 2 = 0)                                                                             AS venta_web,
    'pay_' || to_char(3000+gs, 'FM0000')                                                     AS payment_id
  FROM generate_series(1,30) AS gs
  RETURNING id_pedido
),
line_items AS (
  INSERT INTO public.detalle_pedidos
    (id_pedido, id_producto, cantidad, precio_venta, descuento)
  SELECT
    o.id_pedido,
    pr.id_producto,
    qty.cantidad,
    prc.precio,
    0.00 AS descuento
  FROM new_orders o
  -- 1 a 4 renglones por pedido
  CROSS JOIN LATERAL generate_series(1, (1 + floor(random()*4))::int) AS n(i)
  -- cantidad 1..3
  CROSS JOIN LATERAL (SELECT (1 + floor(random()*3))::int AS cantidad) AS qty
  -- producto existente aleatorio
  CROSS JOIN LATERAL (
      SELECT id_producto
      FROM public.productos
      ORDER BY random()
      LIMIT 1
  ) AS pr
  -- precio unitario aleatorio (si ya tenés precio en productos, reemplazalo por ese campo)
  CROSS JOIN LATERAL (SELECT ROUND((50 + random()*250)::numeric, 2) AS precio) AS prc
  RETURNING id_pedido
),
totales AS (
  SELECT d.id_pedido, ROUND(SUM(d.cantidad * d.precio_venta)::numeric, 2) AS total
  FROM public.detalle_pedidos d
  JOIN new_orders o USING (id_pedido)
  GROUP BY d.id_pedido
)
UPDATE public.pedidos p
SET importe = t.total
FROM totales t
WHERE p.id_pedido = t.id_pedido;

COMMIT;

-- Chequeo rápido
SELECT COUNT(*) AS pedidos_nuevos
FROM public.pedidos
WHERE payment_id LIKE 'pay_3%';
