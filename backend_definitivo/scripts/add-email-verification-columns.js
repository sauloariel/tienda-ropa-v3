const { Sequelize } = require('sequelize');
require('dotenv').config();

// Usar la misma configuración que el proyecto
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ecommerce',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
    logging: console.log
});

async function agregarColumnasVerificacion() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida correctamente');

        console.log('🔄 Agregando columnas de verificación de email...');

        // Agregar columna email_verificado
        await sequelize.query(`
            ALTER TABLE clientes 
            ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN DEFAULT FALSE
        `);
        console.log('✅ Columna email_verificado agregada');

        // Agregar columna token_verificacion
        await sequelize.query(`
            ALTER TABLE clientes 
            ADD COLUMN IF NOT EXISTS token_verificacion VARCHAR(255)
        `);
        console.log('✅ Columna token_verificacion agregada');

        // Agregar columna fecha_token_verificacion
        await sequelize.query(`
            ALTER TABLE clientes 
            ADD COLUMN IF NOT EXISTS fecha_token_verificacion TIMESTAMP
        `);
        console.log('✅ Columna fecha_token_verificacion agregada');

        // Crear índices
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_clientes_token_verificacion ON clientes(token_verificacion)
        `);
        console.log('✅ Índice para token_verificacion creado');

        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_clientes_email_verificado ON clientes(email_verificado)
        `);
        console.log('✅ Índice para email_verificado creado');

        // Verificar que las columnas se agregaron correctamente
        console.log('🔄 Verificando columnas agregadas...');
        const columns = await sequelize.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'clientes' 
            AND column_name IN ('email_verificado', 'token_verificacion', 'fecha_token_verificacion')
            ORDER BY column_name
        `, {
            type: Sequelize.QueryTypes.SELECT
        });

        console.log('📊 Columnas agregadas:');
        columns.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) - Default: ${col.column_default || 'NULL'}`);
        });

        console.log('✅ Campos de verificación de email agregados exitosamente');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar la función
agregarColumnasVerificacion();

