import { Sequelize } from 'sequelize';

console.log('🔍 Verificando Clientes Existentes');
console.log('==================================\n');

async function checkExistingClients() {
    try {
        // Configuración para PostgreSQL
        const db = new Sequelize({
            dialect: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'ecommerce',
            username: 'postgres',
            password: '123',
            logging: false,
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

        // Verificar clientes existentes
        console.log('\n🔍 Clientes existentes:');
        const [clientes] = await db.query("SELECT id_cliente, mail, nombre, apellido FROM clientes ORDER BY id_cliente");

        console.log(`📊 Total clientes: ${clientes.length}`);
        clientes.forEach((cliente, index) => {
            console.log(`   ${index + 1}. ID: ${cliente.id_cliente}, Email: ${cliente.mail}, Nombre: ${cliente.nombre} ${cliente.apellido}`);
        });

        // Verificar si test@test.com existe
        console.log('\n🔍 Verificando test@test.com...');
        const [testClient] = await db.query("SELECT * FROM clientes WHERE mail = 'test@test.com'");

        if (testClient.length > 0) {
            console.log('✅ test@test.com existe:', testClient[0]);
        } else {
            console.log('ℹ️ test@test.com no existe');
        }

        await db.close();
        console.log('\n🎉 Verificación completada');

    } catch (error) {
        console.error('❌ Error durante la verificación:', error.message);
    }
}

checkExistingClients();





















