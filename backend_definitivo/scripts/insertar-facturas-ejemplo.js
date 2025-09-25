const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tienda_ropa',
    password: process.env.DB_PASSWORD || '123456',
    port: process.env.DB_PORT || 5432,
});

async function insertarFacturasEjemplo() {
    try {
        console.log('🔄 Conectando a la base de datos...');

        // Verificar conexión
        await pool.query('SELECT NOW()');
        console.log('✅ Conexión exitosa a la base de datos');

        // Insertar facturas de ejemplo
        const facturas = [
            {
                numeroFactura: 'F2025010001',
                fecha: '2025-01-15 10:30:00',
                total: 150.00,
                cliente_id: 1,
                estado: 'activa',
                metodo_pago: 'efectivo'
            },
            {
                numeroFactura: 'F2025010002',
                fecha: '2025-01-15 14:20:00',
                total: 89.50,
                cliente_id: 2,
                estado: 'activa',
                metodo_pago: 'tarjeta'
            },
            {
                numeroFactura: 'F2025010003',
                fecha: '2025-01-15 16:45:00',
                total: 200.00,
                cliente_id: 3,
                estado: 'pagada',
                metodo_pago: 'transferencia'
            },
            {
                numeroFactura: 'F2025010004',
                fecha: '2025-01-16 09:15:00',
                total: 75.25,
                cliente_id: 1,
                estado: 'activa',
                metodo_pago: 'qr'
            },
            {
                numeroFactura: 'F2025010005',
                fecha: '2025-01-16 11:30:00',
                total: 300.00,
                cliente_id: 4,
                estado: 'anulada',
                metodo_pago: 'efectivo'
            },
            {
                numeroFactura: 'F2025010006',
                fecha: '2025-01-16 15:20:00',
                total: 125.75,
                cliente_id: 2,
                estado: 'pendiente',
                metodo_pago: 'tarjeta'
            },
            {
                numeroFactura: 'F2025010007',
                fecha: '2025-01-17 08:45:00',
                total: 180.00,
                cliente_id: 5,
                estado: 'activa',
                metodo_pago: 'efectivo'
            },
            {
                numeroFactura: 'F2025010008',
                fecha: '2025-01-17 12:10:00',
                total: 95.50,
                cliente_id: 3,
                estado: 'pagada',
                metodo_pago: 'transferencia'
            }
        ];

        console.log('🔄 Insertando facturas de ejemplo...');

        for (const factura of facturas) {
            const query = `
        INSERT INTO facturas (numeroFactura, fecha, total, cliente_id, estado, metodo_pago, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (numeroFactura) DO NOTHING
      `;

            await pool.query(query, [
                factura.numeroFactura,
                factura.fecha,
                factura.total,
                factura.cliente_id,
                factura.estado,
                factura.metodo_pago
            ]);

            console.log(`✅ Factura ${factura.numeroFactura} insertada`);
        }

        // Insertar detalles de factura de ejemplo
        const detallesFactura = [
            // Factura F2025010001
            { factura_id: 1, producto_id: 1, cantidad: 2, precio_unitario: 75.00, subtotal: 150.00 },

            // Factura F2025010002
            { factura_id: 2, producto_id: 2, cantidad: 1, precio_unitario: 89.50, subtotal: 89.50 },

            // Factura F2025010003
            { factura_id: 3, producto_id: 3, cantidad: 1, precio_unitario: 200.00, subtotal: 200.00 },

            // Factura F2025010004
            { factura_id: 4, producto_id: 4, cantidad: 1, precio_unitario: 75.25, subtotal: 75.25 },

            // Factura F2025010005
            { factura_id: 5, producto_id: 5, cantidad: 2, precio_unitario: 150.00, subtotal: 300.00 },

            // Factura F2025010006
            { factura_id: 6, producto_id: 6, cantidad: 1, precio_unitario: 125.75, subtotal: 125.75 },

            // Factura F2025010007
            { factura_id: 7, producto_id: 7, cantidad: 1, precio_unitario: 180.00, subtotal: 180.00 },

            // Factura F2025010008
            { factura_id: 8, producto_id: 8, cantidad: 1, precio_unitario: 95.50, subtotal: 95.50 }
        ];

        console.log('🔄 Insertando detalles de factura...');

        for (const detalle of detallesFactura) {
            const query = `
        INSERT INTO detalle_facturas (factura_id, producto_id, cantidad, precio_unitario, subtotal, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `;

            await pool.query(query, [
                detalle.factura_id,
                detalle.producto_id,
                detalle.cantidad,
                detalle.precio_unitario,
                detalle.subtotal
            ]);

            console.log(`✅ Detalle de factura ${detalle.factura_id} insertado`);
        }

        console.log('🎉 ¡Facturas de ejemplo insertadas exitosamente!');

        // Verificar datos insertados
        const result = await pool.query('SELECT COUNT(*) as total FROM facturas');
        console.log(`📊 Total de facturas en la base de datos: ${result.rows[0].total}`);

    } catch (error) {
        console.error('❌ Error insertando facturas:', error);
    } finally {
        await pool.end();
    }
}

insertarFacturasEjemplo();
