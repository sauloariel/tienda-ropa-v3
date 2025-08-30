const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const Empleados = sequelize.define('Empleados', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estado: DataTypes.STRING(8)
}, {
    tableName: 'empleados',
    timestamps: false
});

async function activateLucia() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión establecida');

        // Buscar empleado con ID 1 (Lucia)
        const empleado = await Empleados.findByPk(1);
        if (empleado) {
            console.log(`Empleado encontrado: ID ${empleado.id_empleado}, Estado: ${empleado.estado}`);

            // Actualizar estado a ACTIVO
            await Empleados.update(
                { estado: 'ACTIVO' },
                { where: { id_empleado: 1 } }
            );
            console.log('✅ Estado actualizado a ACTIVO');
        } else {
            console.log('❌ Empleado no encontrado');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

activateLucia();
