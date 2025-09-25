import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

console.log('🔍 Test de Inserción con Sequelize');
console.log('==================================\n');

async function testSequelizeInsert() {
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

        // Definir modelo Clientes
        const Clientes = db.define('Clientes', {
            id_cliente: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            dni: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            cuit_cuil: {
                type: DataTypes.STRING(13),
                allowNull: true
            },
            nombre: {
                type: DataTypes.STRING(25),
                allowNull: true
            },
            apellido: {
                type: DataTypes.STRING(25),
                allowNull: true
            },
            domicilio: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            telefono: {
                type: DataTypes.STRING(13),
                allowNull: true
            },
            mail: {
                type: DataTypes.STRING(35),
                allowNull: true
            },
            estado: {
                type: DataTypes.STRING(8),
                allowNull: true
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            tableName: 'clientes',
            timestamps: false
        });

        console.log('🔍 Modelo Clientes definido');

        // Test 1: Verificar si el cliente ya existe
        console.log('\n🔍 1. Verificando si cliente existe...');
        const clienteExistente = await Clientes.findOne({
            where: { mail: 'test@test.com' }
        });

        if (clienteExistente) {
            console.log('✅ Cliente existe:', clienteExistente.dataValues);
        } else {
            console.log('ℹ️ Cliente no existe');
        }

        // Test 2: Hash de contraseña
        console.log('\n🔍 2. Generando hash de contraseña...');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('123456', saltRounds);
        console.log('✅ Hash generado:', hashedPassword.substring(0, 20) + '...');

        // Test 3: Intentar crear cliente
        console.log('\n🔍 3. Intentando crear cliente...');
        const nuevoCliente = await Clientes.create({
            dni: '00000000',
            cuit_cuil: '00000000000',
            nombre: 'Test',
            apellido: 'Usuario',
            domicilio: 'Sin especificar',
            telefono: 'Sin especificar',
            mail: 'test@test.com',
            password: hashedPassword,
            estado: 'activo'
        });

        console.log('✅ Cliente creado:', nuevoCliente.dataValues);

        await db.close();
        console.log('\n🎉 Test completado exitosamente');

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
        console.error('Stack:', error.stack);

        if (error.message.includes('duplicate key value')) {
            console.log('💡 El cliente ya existe en la base de datos');
        } else if (error.message.includes('relation "clientes" does not exist')) {
            console.log('💡 La tabla clientes no existe');
        } else if (error.message.includes('permission denied')) {
            console.log('💡 Error de permisos en la base de datos');
        }
    }
}

testSequelizeInsert();
















