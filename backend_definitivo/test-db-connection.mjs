import { Sequelize } from 'sequelize';

console.log('🔍 Test de Conexión a Base de Datos');
console.log('===================================\n');

async function testDatabaseConnection() {
    try {
        // Configuración para PostgreSQL
        const db = new Sequelize({
            dialect: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'ecommerce',
            username: 'postgres',
            password: '123',
            logging: console.log, // Habilitar logs para ver el error
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });

        console.log('🔍 Intentando conectar a PostgreSQL...');
        console.log('   Host: localhost');
        console.log('   Puerto: 5432');
        console.log('   Base de datos: ecommerce');
        console.log('   Usuario: postgres');

        await db.authenticate();
        console.log('✅ Conexión exitosa a PostgreSQL');

        // Verificar si la tabla clientes existe
        const [results] = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes'");

        if (results.length > 0) {
            console.log('✅ Tabla clientes existe');

            // Verificar estructura
            const [columns] = await db.query(`
                SELECT column_name, data_type, is_nullable, column_default 
                FROM information_schema.columns 
                WHERE table_name = 'clientes' 
                ORDER BY ordinal_position
            `);

            console.log('📊 Estructura de la tabla clientes:');
            columns.forEach(col => {
                console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
            });

            // Contar registros
            const [count] = await db.query("SELECT COUNT(*) as count FROM clientes");
            console.log(`📊 Total de clientes: ${count[0].count}`);

        } else {
            console.log('❌ Tabla clientes NO existe');
            console.log('🔧 Creando tabla clientes...');

            await db.query(`
                CREATE TABLE clientes (
                    id_cliente SERIAL PRIMARY KEY,
                    dni VARCHAR(10) UNIQUE NOT NULL,
                    cuit_cuil VARCHAR(13) NOT NULL,
                    nombre VARCHAR(25) NOT NULL,
                    apellido VARCHAR(25) NOT NULL,
                    domicilio VARCHAR(30) NOT NULL,
                    telefono VARCHAR(13) NOT NULL,
                    mail VARCHAR(35) UNIQUE NOT NULL,
                    estado VARCHAR(8) DEFAULT 'activo',
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            console.log('✅ Tabla clientes creada exitosamente');
        }

        await db.close();

    } catch (error) {
        console.error('❌ Error de conexión:', error.message);

        if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 Sugerencia: PostgreSQL no está ejecutándose o no está en el puerto 5432');
        } else if (error.message.includes('database "ecommerce" does not exist')) {
            console.log('💡 Sugerencia: La base de datos "ecommerce" no existe');
        } else if (error.message.includes('password authentication failed')) {
            console.log('💡 Sugerencia: Credenciales incorrectas para PostgreSQL');
        }
    }
}

testDatabaseConnection();

























