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
    cuil: DataTypes.STRING(11),
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

const Loguin = sequelize.define('Loguin', {
    id_loguin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_empleado: DataTypes.INTEGER,
    id_rol: DataTypes.INTEGER,
    usuario: DataTypes.STRING(20),
    passwd: DataTypes.STRING(500),
    password_provisoria: DataTypes.BOOLEAN,
    fecha_cambio_pass: DataTypes.DATE,
    ultimo_acceso: DataTypes.DATE
}, {
    tableName: 'loguin',
    timestamps: false
});

const Roles = sequelize.define('Roles', {
    id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: DataTypes.STRING(15)
}, {
    tableName: 'roles',
    timestamps: false
});

async function fixLuciaStatus() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // Buscar usuario Lucia en la tabla loguin
        const luciaLoguin = await Loguin.findOne({
            where: { usuario: 'lucia' }
        });

        if (!luciaLoguin) {
            console.log('❌ Usuario Lucia no encontrado en la tabla loguin');
            return;
        }

        console.log('👤 Usuario Lucia encontrado:');
        console.log(`   - ID Loguin: ${luciaLoguin.id_loguin}`);
        console.log(`   - Usuario: ${luciaLoguin.usuario}`);
        console.log(`   - ID Empleado: ${luciaLoguin.id_empleado}`);
        console.log(`   - ID Rol: ${luciaLoguin.id_rol}`);

        // Buscar empleado Lucia por ID
        const luciaEmpleado = await Empleados.findByPk(luciaLoguin.id_empleado);
        if (luciaEmpleado) {
            console.log('\n👷 Empleado Lucia:');
            console.log(`   - ID: ${luciaEmpleado.id_empleado}`);
            console.log(`   - Nombre: ${luciaEmpleado.nombre} ${luciaEmpleado.apellido}`);
            console.log(`   - Estado: ${luciaEmpleado.estado}`);
            console.log(`   - Email: ${luciaEmpleado.mail}`);
            console.log(`   - Puesto: ${luciaEmpleado.puesto}`);

            // Verificar si el estado es 'ACTIVO'
            if (luciaEmpleado.estado !== 'ACTIVO') {
                console.log('\n⚠️  El empleado Lucia NO está activo. Actualizando estado...');

                await Empleados.update(
                    { estado: 'ACTIVO' },
                    { where: { id_empleado: luciaEmpleado.id_empleado } }
                );
                console.log('✅ Estado actualizado a ACTIVO');
            } else {
                console.log('✅ El empleado Lucia ya está activo');
            }
        } else {
            console.log('❌ Empleado Lucia no encontrado');
        }

        // Buscar rol
        const rol = await Roles.findByPk(luciaLoguin.id_rol);
        if (rol) {
            console.log(`\n🎭 Rol: ${rol.descripcion}`);
        }

        // Verificar contraseña
        if (luciaLoguin.passwd) {
            console.log('\n🔐 Contraseña: Configurada');
        } else {
            console.log('\n❌ Contraseña: NO configurada');
        }

        console.log('\n🎉 Verificación completada!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
        console.log('✅ Conexión cerrada');
    }
}

fixLuciaStatus();
