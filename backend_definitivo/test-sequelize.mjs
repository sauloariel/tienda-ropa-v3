import { Sequelize } from 'sequelize';

console.log('🔧 Test Directo de Sequelize');
console.log('============================\n');

async function testSequelize() {
    try {
        // Configuración para PostgreSQL
        const db = new Sequelize({
            dialect: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'ecommerce',
            username: 'postgres',
            password: '123',
            logging: console.log,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });

        console.log('🔍 Conectando a PostgreSQL...');
        await db.authenticate();
        console.log('✅ Conexión exitosa');

        // Test 1: Verificar tabla clientes
        console.log('\n🔍 1. Verificando tabla clientes...');
        const [tables] = await db.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'clientes'");
        console.log('📊 Tablas encontradas:', tables);

        // Test 2: Verificar estructura
        console.log('\n🔍 2. Verificando estructura...');
        const [columns] = await db.query(`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'clientes' 
            ORDER BY ordinal_position
        `);
        console.log('📊 Columnas:', columns);

        // Test 3: Insertar un cliente de prueba
        console.log('\n🔍 3. Insertando cliente de prueba...');
        const [result] = await db.query(`
            INSERT INTO clientes (dni, cuit_cuil, nombre, apellido, domicilio, telefono, mail, password, estado)
            VALUES ('12345678', '20123456789', 'Test', 'Usuario', 'Calle Test', '1234567890', 'test@test.com', 'hashed_password', 'activo')
            RETURNING id_cliente
        `);
        console.log('✅ Cliente insertado:', result);

        // Test 4: Verificar inserción
        console.log('\n🔍 4. Verificando inserción...');
        const [cliente] = await db.query("SELECT * FROM clientes WHERE mail = 'test@test.com'");
        console.log('📊 Cliente encontrado:', cliente);

        await db.close();
        console.log('\n🎉 Test completado exitosamente');

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
        console.error('Stack:', error.stack);
    }
}

testSequelize();





















