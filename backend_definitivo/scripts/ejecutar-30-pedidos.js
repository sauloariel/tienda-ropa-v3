// Script para ejecutar el SQL de 30 pedidos
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos PostgreSQL
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'ecommerce',
    user: 'postgres',
    password: '123'
});

async function ejecutarScript() {
    try {
        console.log('🚀 Conectando a PostgreSQL...');
        await client.connect();
        console.log('✅ Conectado a PostgreSQL');

        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, 'cargar-30-pedidos.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📦 Ejecutando script de 30 pedidos...');
        console.log('⏳ Esto puede tomar unos segundos...');

        // Ejecutar el script SQL
        const result = await client.query(sqlContent);

        console.log('✅ Script ejecutado exitosamente');

        // Verificar resultados
        const pedidosResult = await client.query('SELECT COUNT(*) as total FROM pedidos');
        console.log(`📊 Total de pedidos en la base de datos: ${pedidosResult.rows[0].total}`);

        const detalleResult = await client.query('SELECT COUNT(*) as total FROM detalle_pedidos');
        console.log(`📦 Total de detalles de pedidos: ${detalleResult.rows[0].total}`);

        // Mostrar algunos pedidos de ejemplo
        const ejemploResult = await client.query(`
      SELECT p.id_pedido, p.importe, p.estado, p.venta_web, 
             c.nombre, c.apellido,
             COUNT(d.id_pedido) as productos
      FROM pedidos p
      LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
      LEFT JOIN detalle_pedidos d ON p.id_pedido = d.id_pedido
      GROUP BY p.id_pedido, p.importe, p.estado, p.venta_web, c.nombre, c.apellido
      ORDER BY p.id_pedido DESC
      LIMIT 5
    `);

        console.log('\n🎯 Últimos 5 pedidos creados:');
        ejemploResult.rows.forEach(pedido => {
            console.log(`   Pedido #${pedido.id_pedido}: ${pedido.nombre} ${pedido.apellido} - $${pedido.importe} (${pedido.productos} productos) - ${pedido.estado}`);
        });

        console.log('\n🎉 ¡30 pedidos cargados exitosamente!');
        console.log('💡 Ahora puedes ver todos los pedidos en el panel administrativo');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('La tabla productos está vacía')) {
            console.log('💡 Necesitas cargar productos primero. Ejecuta el script de productos.');
        }
    } finally {
        await client.end();
        console.log('🔌 Conexión cerrada');
    }
}

ejecutarScript();
