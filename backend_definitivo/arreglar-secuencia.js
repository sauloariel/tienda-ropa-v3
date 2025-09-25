const sequelize = require('./dist/config/db.js').default;

async function arreglarSecuencia() {
    try {
        console.log('🔧 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conectado a la base de datos');

        // Obtener el último ID de pedido
        console.log('📊 Obteniendo último ID de pedido...');
        const [results] = await sequelize.query('SELECT MAX(id_pedido) as max_id FROM pedidos');
        const maxId = results[0].max_id || 0;
        console.log(`   Último ID encontrado: ${maxId}`);

        // Resetear la secuencia
        console.log('🔧 Reseteando secuencia...');
        await sequelize.query(`SELECT setval('pedidos_id_pedido_seq', ${maxId + 1}, false)`);
        console.log(`   Secuencia reseteada a: ${maxId + 1}`);

        // Verificar que funciona
        console.log('✅ Verificando secuencia...');
        const [testResults] = await sequelize.query('SELECT nextval(\'pedidos_id_pedido_seq\') as next_id');
        console.log(`   Próximo ID será: ${testResults[0].next_id}`);

        console.log('\n🎉 ¡Secuencia arreglada exitosamente!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Detalles:', error);
    } finally {
        await sequelize.close();
        console.log('🔌 Conexión cerrada');
    }
}

arreglarSecuencia();
