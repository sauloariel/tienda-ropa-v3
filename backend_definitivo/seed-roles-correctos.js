const { Sequelize } = require('sequelize-typescript');
const bcrypt = require('bcrypt');

// Configuración de la base de datos
const db = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    models: [__dirname + '/src/models/**/*.ts'],
    logging: false
});

// Modelos
const Loguin = require('./src/models/Loguin.model').default;
const Empleados = require('./src/models/Empleados.model').default;
const Roles = require('./src/models/Roles.model').default;

async function seedRolesCorrectos() {
    try {
        console.log('🔧 Configurando roles correctos...');

        // Conectar a la base de datos
        await db.authenticate();
        console.log('✅ Conexión a DB exitosa');

        // Sincronizar modelos
        await db.sync();
        console.log('✅ Modelos sincronizados');

        // Crear roles correctos
        const roles = [
            { id_rol: 1, descripcion: 'Admin' },
            { id_rol: 2, descripcion: 'Vendedor' },
            { id_rol: 3, descripcion: 'Inventario' },
            { id_rol: 4, descripcion: 'Marketing' }
        ];

        console.log('👥 Creando roles...');
        for (const rol of roles) {
            try {
                const [rolCreado, created] = await Roles.findOrCreate({
                    where: { id_rol: rol.id_rol },
                    defaults: rol
                });

                if (created) {
                    console.log(`✅ Rol ${rol.descripcion} creado`);
                } else {
                    // Actualizar si ya existe
                    await Roles.update(rol, { where: { id_rol: rol.id_rol } });
                    console.log(`🔄 Rol ${rol.descripcion} actualizado`);
                }
            } catch (error) {
                console.error(`❌ Error con rol ${rol.descripcion}:`, error.message);
            }
        }

        // Crear usuarios de prueba
        const usuarios = [
            {
                usuario: 'admin',
                password: 'admin123',
                nombre: 'Admin',
                apellido: 'Sistema',
                mail: 'admin@demo.com',
                rol_id: 1
            },
            {
                usuario: 'vendedor',
                password: 'vendedor123',
                nombre: 'Vendedor',
                apellido: 'Demo',
                mail: 'vendedor@demo.com',
                rol_id: 2
            },
            {
                usuario: 'inventario',
                password: 'inventario123',
                nombre: 'Inventario',
                apellido: 'Demo',
                mail: 'inventario@demo.com',
                rol_id: 3
            },
            {
                usuario: 'marketing',
                password: 'marketing123',
                nombre: 'Marketing',
                apellido: 'Demo',
                mail: 'marketing@demo.com',
                rol_id: 4
            }
        ];

        console.log('👤 Creando usuarios...');
        for (const userData of usuarios) {
            try {
                // Crear empleado
                const [empleado, empleadoCreated] = await Empleados.findOrCreate({
                    where: { mail: userData.mail },
                    defaults: {
                        nombre: userData.nombre,
                        apellido: userData.apellido,
                        mail: userData.mail,
                        estado: 'ACTIVO',
                        cuil: '12345678901',
                        domicilio: 'Dirección Demo',
                        telefono: '1234567890'
                    }
                });

                if (empleadoCreated) {
                    console.log(`✅ Empleado ${userData.nombre} creado`);
                } else {
                    console.log(`ℹ️ Empleado ${userData.nombre} ya existe`);
                }

                // Crear login
                const passwordHash = await bcrypt.hash(userData.password, 10);
                const [loguin, loguinCreated] = await Loguin.findOrCreate({
                    where: { usuario: userData.usuario },
                    defaults: {
                        id_empleado: empleado.id_empleado,
                        id_rol: userData.rol_id,
                        usuario: userData.usuario,
                        passwd: passwordHash,
                        password_provisoria: false,
                        fecha_cambio_pass: new Date()
                    }
                });

                if (loguinCreated) {
                    console.log(`✅ Login ${userData.usuario} creado`);
                } else {
                    console.log(`ℹ️ Login ${userData.usuario} ya existe`);
                }

            } catch (error) {
                console.error(`❌ Error creando usuario ${userData.usuario}:`, error.message);
            }
        }

        console.log('🎉 Seed completado exitosamente');

    } catch (error) {
        console.error('❌ Error en seed:', error.message);
    } finally {
        await db.close();
    }
}

seedRolesCorrectos();
