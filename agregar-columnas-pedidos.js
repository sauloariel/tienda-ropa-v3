const { Client } = require('pg');

async function agregarColumnasPedidos() {
    // Configuración de conexión - ajusta según tu configuración
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'ecommerce',
        user: 'postgres',
        password: 'postgres' // Cambia por tu contraseña real
    });

    try {
        console.log('🔌 Conectando a la base de datos...');
        await client.connect();
        console.log('✅ Conectado exitosamente');

        // Verificar columnas existentes
        console.log('🔍 Verificando columnas existentes...');
        const columnasExistentes = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'pedidos' 
            AND column_name IN ('direccion_entrega', 'horario_recepcion', 'descripcion_pedido')
            ORDER BY column_name;
        `);

        console.log('📋 Columnas existentes:', columnasExistentes.rows.map(r => r.column_name));

        // Agregar columna direccion_entrega
        if (!columnasExistentes.rows.find(r => r.column_name === 'direccion_entrega')) {
            console.log('📝 Agregando columna direccion_entrega...');
            await client.query(`
                ALTER TABLE pedidos 
                ADD COLUMN direccion_entrega TEXT;
            `);
            console.log('✅ Columna direccion_entrega agregada');
        } else {
            console.log('✅ Columna direccion_entrega ya existe');
        }

        // Agregar columna horario_recepcion
        if (!columnasExistentes.rows.find(r => r.column_name === 'horario_recepcion')) {
            console.log('📝 Agregando columna horario_recepcion...');
            await client.query(`
                ALTER TABLE pedidos 
                ADD COLUMN horario_recepcion VARCHAR(100);
            `);
            console.log('✅ Columna horario_recepcion agregada');
        } else {
            console.log('✅ Columna horario_recepcion ya existe');
        }

        // Agregar columna descripcion_pedido
        if (!columnasExistentes.rows.find(r => r.column_name === 'descripcion_pedido')) {
            console.log('📝 Agregando columna descripcion_pedido...');
            await client.query(`
                ALTER TABLE pedidos 
                ADD COLUMN descripcion_pedido TEXT;
            `);
            console.log('✅ Columna descripcion_pedido agregada');
        } else {
            console.log('✅ Columna descripcion_pedido ya existe');
        }

        // Verificar que se agregaron correctamente
        console.log('🔍 Verificando columnas finales...');
        const columnasFinales = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'pedidos' 
            AND column_name IN ('direccion_entrega', 'horario_recepcion', 'descripcion_pedido')
            ORDER BY column_name;
        `);

        console.log('📋 Columnas agregadas:');
        columnasFinales.rows.forEach(row => {
            console.log(`   ✅ ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        console.log('\n🎉 ¡Todas las columnas se agregaron exitosamente!');
        console.log('🔄 Ahora puedes reiniciar el servidor y probar el formulario mejorado.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Posibles soluciones:');
        console.log('   1. Verifica que PostgreSQL esté ejecutándose');
        console.log('   2. Verifica la contraseña de postgres');
        console.log('   3. Verifica que la base de datos "ecommerce" exista');
    } finally {
        await client.end();
        console.log('🔌 Conexión cerrada');
    }
}

agregarColumnasPedidos();























