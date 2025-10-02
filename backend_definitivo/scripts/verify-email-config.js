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

async function verificarConfiguracionVerificacion() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida correctamente');

        console.log('🔄 Verificando columnas de verificación...');

        // Verificar que las columnas existen
        const columns = await sequelize.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'clientes' 
            AND column_name IN ('email_verificado', 'token_verificacion', 'fecha_token_verificacion')
            ORDER BY column_name
        `, {
            type: Sequelize.QueryTypes.SELECT
        });

        console.log('📊 Columnas de verificación encontradas:');
        columns.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) - Default: ${col.column_default || 'NULL'}`);
        });

        if (columns.length === 3) {
            console.log('✅ Todas las columnas de verificación están presentes');
        } else {
            console.log('❌ Faltan columnas de verificación');
            return;
        }

        console.log('🔄 Probando inserción de cliente con verificación...');

        // Probar inserción de cliente con campos de verificación
        const timestamp = Date.now();
        const dniUnico = timestamp.toString().slice(-8);
        const cuitUnico = `20${dniUnico}9`;

        const testCliente = await sequelize.query(`
            INSERT INTO clientes (
                dni, cuit_cuil, nombre, apellido, domicilio, telefono, 
                mail, password, estado, email_verificado, token_verificacion, fecha_token_verificacion
            ) VALUES (
                :dni, :cuit, 'Test', 'Usuario', 'Calle Test 123', 
                '1234567890', 'test@example.com', 'hashedpassword', 'activo', 
                false, 'test-token-123', NOW() + INTERVAL '24 hours'
            ) RETURNING id_cliente, nombre, apellido, mail, email_verificado
        `, {
            replacements: { dni: dniUnico, cuit: cuitUnico },
            type: Sequelize.QueryTypes.INSERT
        });

        console.log('✅ Cliente de prueba insertado:', testCliente[0][0]);

        // Limpiar el cliente de prueba
        await sequelize.query(`
            DELETE FROM clientes WHERE mail = 'test@example.com'
        `);
        console.log('✅ Cliente de prueba eliminado');

        console.log('\n🎉 Configuración de verificación de email verificada correctamente');
        console.log('\n📋 Próximos pasos:');
        console.log('1. Configurar credenciales SMTP en el archivo .env');
        console.log('2. Reiniciar el servidor backend');
        console.log('3. Probar el registro desde el frontend');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar la función
verificarConfiguracionVerificacion();
