// Script de seed en JavaScript puro
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

async function seedUsers() {
    try {
        console.log('🚀 Iniciando seed de usuarios...');
        
        // Crear conexión a la base de datos
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './database.sqlite',
            logging: false
        });
        
        // Definir modelos simples
        const Roles = sequelize.define('Roles', {
            id_rol: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            descripcion: Sequelize.STRING
        }, { tableName: 'roles', timestamps: false });
        
        const Empleados = sequelize.define('Empleados', {
            id_empleado: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            cuil: Sequelize.STRING,
            nombre: Sequelize.STRING,
            apellido: Sequelize.STRING,
            domicilio: Sequelize.STRING,
            telefono: Sequelize.STRING,
            mail: Sequelize.STRING,
            sueldo: Sequelize.DECIMAL,
            puesto: Sequelize.STRING,
            estado: Sequelize.STRING
        }, { tableName: 'empleados', timestamps: false });
        
        const Loguin = sequelize.define('Loguin', {
            id_loguin: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            id_empleado: Sequelize.INTEGER,
            id_rol: Sequelize.INTEGER,
            usuario: Sequelize.STRING,
            passwd: Sequelize.STRING,
            password_provisoria: Sequelize.BOOLEAN,
            fecha_cambio_pass: Sequelize.DATE
        }, { tableName: 'loguin', timestamps: false });
        
        // Definir relaciones
        Empleados.hasMany(Loguin, { foreignKey: 'id_empleado', as: 'loguins' });
        Roles.hasMany(Loguin, { foreignKey: 'id_rol', as: 'loguins' });
        Loguin.belongsTo(Empleados, { foreignKey: 'id_empleado', as: 'empleado' });
        Loguin.belongsTo(Roles, { foreignKey: 'id_rol', as: 'rol' });
        
        // Crear roles
        console.log('📋 Creando roles...');
        const roles = [
            { id_rol: 1, descripcion: 'Administrador' },
            { id_rol: 2, descripcion: 'Vendedor' },
            { id_rol: 3, descripcion: 'Inventario' },
            { id_rol: 4, descripcion: 'Marketing' }
        ];
        
        for (const rol of roles) {
            try {
                const [rolCreado, created] = await Roles.findOrCreate({
                    where: { id_rol: rol.id_rol },
                    defaults: rol
                });
                
                if (created) {
                    console.log(`✅ Rol ${rol.descripcion} creado exitosamente`);
                } else {
                    console.log(`ℹ️ Rol ${rol.descripcion} ya existe`);
                }
            } catch (error) {
                console.error(`❌ Error creando rol ${rol.descripcion}:`, error.message);
            }
        }
        
        // Crear empleados
        console.log('👥 Creando empleados...');
        const empleados = [
            {
                id_empleado: 1,
                cuil: '20123456789',
                nombre: 'Ana',
                apellido: 'Admin',
                domicilio: 'Calle Admin 123',
                telefono: '1234567890',
                mail: 'admin@demo.com',
                sueldo: 50000,
                puesto: 'Administrador',
                estado: 'ACTIVO'
            },
            {
                id_empleado: 2,
                cuil: '20123456790',
                nombre: 'Vico',
                apellido: 'Vendedor',
                domicilio: 'Calle Vendedor 456',
                telefono: '1234567891',
                mail: 'vendedor@demo.com',
                sueldo: 35000,
                puesto: 'Vendedor',
                estado: 'ACTIVO'
            },
            {
                id_empleado: 3,
                cuil: '20123456791',
                nombre: 'Inés',
                apellido: 'Inventario',
                domicilio: 'Calle Inventario 789',
                telefono: '1234567892',
                mail: 'inventario@demo.com',
                sueldo: 30000,
                puesto: 'Inventario',
                estado: 'ACTIVO'
            },
            {
                id_empleado: 4,
                cuil: '20123456792',
                nombre: 'Marta',
                apellido: 'Marketing',
                domicilio: 'Calle Marketing 012',
                telefono: '1234567893',
                mail: 'marketing@demo.com',
                sueldo: 40000,
                puesto: 'Marketing',
                estado: 'ACTIVO'
            }
        ];
        
        for (const empleado of empleados) {
            try {
                const [empleadoCreado, created] = await Empleados.findOrCreate({
                    where: { id_empleado: empleado.id_empleado },
                    defaults: empleado
                });
                
                if (created) {
                    console.log(`✅ Empleado ${empleado.nombre} ${empleado.apellido} creado exitosamente`);
                } else {
                    console.log(`ℹ️ Empleado ${empleado.nombre} ${empleado.apellido} ya existe`);
                }
            } catch (error) {
                console.error(`❌ Error creando empleado ${empleado.nombre}:`, error.message);
            }
        }
        
        // Crear usuarios de login
        console.log('🔐 Creando usuarios de login...');
        const usuarios = [
            {
                id_loguin: 1,
                id_empleado: 1,
                id_rol: 1,
                usuario: 'admin',
                password: 'admin123'
            },
            {
                id_loguin: 2,
                id_empleado: 2,
                id_rol: 2,
                usuario: 'vendedor',
                password: 'vendedor123'
            },
            {
                id_loguin: 3,
                id_empleado: 3,
                id_rol: 3,
                usuario: 'inventario',
                password: 'inventario123'
            },
            {
                id_loguin: 4,
                id_empleado: 4,
                id_rol: 4,
                usuario: 'marketing',
                password: 'marketing123'
            }
        ];
        
        for (const usuario of usuarios) {
            try {
                const passwordHash = await bcrypt.hash(usuario.password, 10);
                const [loguin, created] = await Loguin.findOrCreate({
                    where: { id_loguin: usuario.id_loguin },
                    defaults: {
                        id_loguin: usuario.id_loguin,
                        id_empleado: usuario.id_empleado,
                        id_rol: usuario.id_rol,
                        usuario: usuario.usuario,
                        passwd: passwordHash,
                        password_provisoria: false,
                        fecha_cambio_pass: new Date()
                    }
                });
                
                if (created) {
                    console.log(`✅ Usuario ${usuario.usuario} creado exitosamente`);
                } else {
                    console.log(`ℹ️ Usuario ${usuario.usuario} ya existe`);
                }
            } catch (error) {
                console.error(`❌ Error creando usuario ${usuario.usuario}:`, error.message);
            }
        }
        
        console.log('🎉 Seed completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error general en seed:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        process.exit(0);
    }
}

// Ejecutar el seed
seedUsers();
