import { sequelize } from './dist/config/database.js';

async function checkSequence() {
    try {
        console.log('🔍 Verificando secuencia de pedidos...');

        // Verificar si la secuencia existe
        const sequenceCheck = await sequelize.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_sequences 
                WHERE schemaname = 'public' 
                AND sequencename = 'pedidos_id_pedido_seq'
            );
        `);

        console.log('📊 Secuencia existe:', sequenceCheck[0][0].exists);

        if (sequenceCheck[0][0].exists) {
            // Obtener el valor actual
            const currentValue = await sequelize.query('SELECT last_value FROM pedidos_id_pedido_seq');
            console.log('📈 Último valor:', currentValue[0][0].last_value);

            // Obtener el siguiente valor
            const nextValue = await sequelize.query('SELECT nextval(\'pedidos_id_pedido_seq\')');
            console.log('➡️ Siguiente valor:', nextValue[0][0].nextval);
        } else {
            console.log('❌ La secuencia no existe, creándola...');

            // Obtener el máximo ID actual
            const maxId = await sequelize.query('SELECT COALESCE(MAX(id_pedido), 0) as max_id FROM pedidos');
            const maxIdValue = maxId[0][0].max_id;
            console.log('📊 Máximo ID actual:', maxIdValue);

            // Crear la secuencia
            await sequelize.query(`
                CREATE SEQUENCE IF NOT EXISTS pedidos_id_pedido_seq 
                START WITH ${maxIdValue + 1}
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            `);

            console.log('✅ Secuencia creada');
        }

        // Verificar la tabla pedidos
        const tableInfo = await sequelize.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'pedidos' 
            AND column_name = 'id_pedido';
        `);

        console.log('📋 Información de la columna id_pedido:');
        console.log(tableInfo[0][0]);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkSequence();























