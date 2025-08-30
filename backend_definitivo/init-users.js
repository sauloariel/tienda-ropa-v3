const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la base de datos SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// Definir modelos para el script
const Empleados = sequelize.define('Empleados', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cuil: {
        type: DataTypes.STRING(11),
        unique: true
    },
    nombre: DataTypes.STRING(25),
    apellido: DataTypes.STRING(30),
    domicilio: DataTypes.STRING(35),
    telefono: DataTypes.STRING(13),
    mail: DataTypes.STRING(45),
    sueldo: DataTypes.DECIMAL(10, 2),
    puesto: DataTypes.STRING(20),
    estado: DataTypes.STRING(8)
}, {
    tableName: 'empleados',
    timestamps: false
});

const Roles = sequelize.define('Roles', {
    id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING(15),
        unique: true
    }
}, {
    tableName: 'roles',
    timestamps: false
});

const Loguin = sequelize.define('Loguin', {
    id_loguin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_empleado: DataTypes.INTEGER,
    id_rol: DataTypes.INTEGER,
    usuario: {
        type: DataTypes.STRING(20),
        unique: true
    },
    passwd: DataTypes.STRING(500),
    password_provisoria: DataTypes.BOOLEAN,
    fecha_cambio_pass: DataTypes.DATE,
    ultimo_acceso: DataTypes.DATE
}, {
    tableName: 'loguin',
    timestamps: false
});

// Definir relaciones
Empleados.hasMany(Loguin, { foreignKey: 'id_empleado' });
Loguin.belongsTo(Empleados, { foreignKey: 'id_empleado' });

Roles.hasMany(Loguin, { foreignKey: 'id_rol' });
Loguin.belongsTo(Roles, { foreignKey: 'id_rol' });

async function initUsers() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // Sincronizar modelos
        await sequelize.sync({ force: false });
        console.log('✅ Modelos sincronizados');

        // Crear roles si no existen
        const adminRole = await Roles.findOrCreate({
            where: { descripcion: 'ADMIN' },
            defaults: { descripcion: 'ADMIN' }
        });

        const empleadoRole = await Roles.findOrCreate({
            where: { descripcion: 'EMPLEADO' },
            defaults: { descripcion: 'EMPLEADO' }
        });

        const vendedorRole = await Roles.findOrCreate({
            where: { descripcion: 'VENDEDOR' },
            defaults: { descripcion: 'VENDEDOR' }
        });

        console.log('✅ Roles creados/verificados');

        // Crear empleado Lucia si no existe
        const luciaEmpleado = await Empleados.findOrCreate({
            where: { cuil: '20123456789' },
            defaults: {
                cuil: '20123456789',
                nombre: 'Lucia',
                apellido: 'González',
                domicilio: 'Av. San Martín 123',
                telefono: '11-1234-5678',
                mail: 'lucia@tienda.com',
                sueldo: 150000.00,
                puesto: 'Vendedora',
                estado: 'ACTIVO'
            }
        });

        console.log('✅ Empleado Lucia creado/verificado');

        // Crear usuario de login para Lucia
        const luciaPassword = await bcrypt.hash('lucia123', 10);
        const luciaLogin = await Loguin.findOrCreate({
            where: { usuario: 'lucia' },
            defaults: {
                id_empleado: luciaEmpleado[0].id_empleado,
                id_rol: vendedorRole[0].id_rol,
                usuario: 'lucia',
                passwd: luciaPassword,
                password_provisoria: false,
                fecha_cambio_pass: new Date(),
                ultimo_acceso: new Date()
            }
        });

        console.log('✅ Usuario de login para Lucia creado/verificado');

        // Crear usuario admin si no existe
        const adminEmpleado = await Empleados.findOrCreate({
            where: { cuil: '20987654321' },
            defaults: {
                cuil: '20987654321',
                nombre: 'Admin',
                apellido: 'Sistema',
                domicilio: 'Av. Principal 456',
                telefono: '11-9876-5432',
                mail: 'admin@tienda.com',
                sueldo: 200000.00,
                puesto: 'Administrador',
                estado: 'ACTIVO'
            }
        });

        console.log('✅ Empleado Admin creado/verificado');

        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminLogin = await Loguin.findOrCreate({
            where: { usuario: 'admin' },
            defaults: {
                id_empleado: adminEmpleado[0].id_empleado,
                id_rol: adminRole[0].id_rol,
                usuario: 'admin',
                passwd: adminPassword,
                password_provisoria: false,
                fecha_cambio_pass: new Date(),
                ultimo_acceso: new Date()
            }
        });

        console.log('✅ Usuario de login para Admin creado/verificado');

        console.log('\n🎉 Usuarios inicializados exitosamente!');
        console.log('\n📋 Credenciales de acceso:');
        console.log('👤 Usuario: lucia | Contraseña: lucia123 | Rol: VENDEDOR');
        console.log('👤 Usuario: admin | Contraseña: admin123 | Rol: ADMIN');

        await sequelize.close();
        console.log('\n✅ Conexión cerrada');

    } catch (error) {
        console.error('❌ Error:', error);
        await sequelize.close();
    }
}

initUsers();
