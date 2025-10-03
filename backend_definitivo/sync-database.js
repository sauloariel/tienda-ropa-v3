const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la base de datos
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ecommerce',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
    logging: console.log
});

async function syncDatabase() {
    try {
        console.log('🔌 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa');

        // Agregar las columnas manualmente
        console.log('📝 Agregando columnas a la tabla pedidos...');

        // Verificar si las columnas ya existen
        const [columnasExistentes] = await sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'pedidos' 
            AND column_name IN ('direccion_entrega', 'horario_recepcion', 'descripcion_pedido')
            ORDER BY column_name;
        `);

        const columnasExistentesNombres = columnasExistentes.map(r => r.column_name);
        console.log('📋 Columnas existentes:', columnasExistentesNombres);

        // Agregar direccion_entrega si no existe
        if (!columnasExistentesNombres.includes('direccion_entrega')) {
            console.log('➕ Agregando columna direccion_entrega...');
            await sequelize.query(`
                ALTER TABLE pedidos 
                ADD COLUMN direccion_entrega TEXT;
            `);
            console.log('✅ Columna direccion_entrega agregada');
        } else {
            console.log('✅ Columna direccion_entrega ya existe');
        }

        // Agregar horario_recepcion si no existe
        if (!columnasExistentesNombres.includes('horario_recepcion')) {
            console.log('➕ Agregando columna horario_recepcion...');
            await sequelize.query(`
                ALTER TABLE pedidos 
                ADD COLUMN horario_recepcion VARCHAR(100);
            `);
            console.log('✅ Columna horario_recepcion agregada');
        } else {
            console.log('✅ Columna horario_recepcion ya existe');
        }

        // Agregar descripcion_pedido si no existe
        if (!columnasExistentesNombres.includes('descripcion_pedido')) {
            console.log('➕ Agregando columna descripcion_pedido...');
            await sequelize.query(`
                ALTER TABLE pedidos 
                ADD COLUMN descripcion_pedido TEXT;
            `);
            console.log('✅ Columna descripcion_pedido agregada');
        } else {
            console.log('✅ Columna descripcion_pedido ya existe');
        }

        // Verificar las columnas finales
        console.log('🔍 Verificando columnas finales...');
        const [columnasFinales] = await sequelize.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'pedidos' 
            AND column_name IN ('direccion_entrega', 'horario_recepcion', 'descripcion_pedido')
            ORDER BY column_name;
        `);

        console.log('📋 Columnas en la tabla pedidos:');
        columnasFinales.forEach(row => {
            console.log(`   ✅ ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        console.log('\n🎉 ¡Base de datos sincronizada exitosamente!');
        console.log('🔄 Ahora puedes usar el formulario mejorado.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Verifica:');
        console.log('   1. Que PostgreSQL esté ejecutándose');
        console.log('   2. Las credenciales en el archivo .env');
        console.log('   3. Que la base de datos "ecommerce" exista');
    } finally {
        await sequelize.close();
        console.log('🔌 Conexión cerrada');
    }
}

syncDatabase();























