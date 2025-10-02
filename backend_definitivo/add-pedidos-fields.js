const { sequelize } = require('./dist/config/database');

async function addPedidosFields() {
    try {
        console.log('🔧 Agregando nuevos campos a la tabla pedidos...');

        // Agregar columna para dirección de entrega
        await sequelize.query(`
            ALTER TABLE pedidos 
            ADD COLUMN IF NOT EXISTS direccion_entrega TEXT;
        `);
        console.log('✅ Columna direccion_entrega agregada');

        // Agregar columna para horario de recepción
        await sequelize.query(`
            ALTER TABLE pedidos 
            ADD COLUMN IF NOT EXISTS horario_recepcion VARCHAR(100);
        `);
        console.log('✅ Columna horario_recepcion agregada');

        // Agregar columna para descripción del pedido
        await sequelize.query(`
            ALTER TABLE pedidos 
            ADD COLUMN IF NOT EXISTS descripcion_pedido TEXT;
        `);
        console.log('✅ Columna descripcion_pedido agregada');

        // Verificar que las columnas se agregaron correctamente
        const columns = await sequelize.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'pedidos' 
            AND column_name IN ('direccion_entrega', 'horario_recepcion', 'descripcion_pedido')
            ORDER BY column_name;
        `);

        console.log('\n📋 Columnas agregadas:');
        columns[0].forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });

        console.log('\n🎉 ¡Campos agregados exitosamente!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

addPedidosFields();



















