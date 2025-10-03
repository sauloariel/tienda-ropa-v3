const { Client } = require('pg');

async function agregarColumnas() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'ecommerce',
        user: 'postgres',
        password: 'postgres'
    });

    try {
        await client.connect();
        console.log('🔌 Conectado a la base de datos');

        // Agregar columna para dirección de entrega
        console.log('📝 Agregando columna direccion_entrega...');
        await client.query(`
            ALTER TABLE pedidos 
            ADD COLUMN IF NOT EXISTS direccion_entrega TEXT;
        `);
        console.log('✅ Columna direccion_entrega agregada');

        // Agregar columna para horario de recepción
        console.log('📝 Agregando columna horario_recepcion...');
        await client.query(`
            ALTER TABLE pedidos 
            ADD COLUMN IF NOT EXISTS horario_recepcion VARCHAR(100);
        `);
        console.log('✅ Columna horario_recepcion agregada');

        // Agregar columna para descripción del pedido
        console.log('📝 Agregando columna descripcion_pedido...');
        await client.query(`
            ALTER TABLE pedidos 
            ADD COLUMN IF NOT EXISTS descripcion_pedido TEXT;
        `);
        console.log('✅ Columna descripcion_pedido agregada');

        // Verificar que las columnas se agregaron
        console.log('🔍 Verificando columnas...');
        const result = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'pedidos' 
            AND column_name IN ('direccion_entrega', 'horario_recepcion', 'descripcion_pedido')
            ORDER BY column_name;
        `);

        console.log('📋 Columnas agregadas:');
        result.rows.forEach(row => {
            console.log(`   - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        console.log('\n🎉 ¡Columnas agregadas exitosamente!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

agregarColumnas();























