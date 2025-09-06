const { Sequelize } = require('sequelize');

// Configuración de la base de datos
const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ecommerce',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
    logging: false
});

async function fixEmpleadoAdmin() {
    try {
        await db.authenticate();
        console.log('✅ Conexión a la base de datos exitosa');

        // Buscar el empleado asociado al usuario admin
        const adminUser = await db.query(`
            SELECT l.usuario, l.id_empleado, e.nombre, e.apellido, e.estado 
            FROM loguin l 
            JOIN empleados e ON l.id_empleado = e.id_empleado 
            WHERE l.usuario = 'admin'
        `, {
            type: db.QueryTypes.SELECT
        });

        if (adminUser.length > 0) {
            const empleado = adminUser[0];
            console.log('\n📋 Usuario admin encontrado:');
            console.log(`   Usuario: ${empleado.usuario}`);
            console.log(`   Empleado: ${empleado.nombre} ${empleado.apellido}`);
            console.log(`   Estado actual: ${empleado.estado}`);

            // Activar el empleado si está inactivo
            if (empleado.estado.toLowerCase() !== 'activo') {
                await db.query(`
                    UPDATE empleados 
                    SET estado = 'ACTIVO' 
                    WHERE id_empleado = $1
                `, {
                    bind: [empleado.id_empleado],
                    type: db.QueryTypes.UPDATE
                });

                console.log('✅ Empleado activado correctamente');
            } else {
                // Asegurar que el estado esté en mayúsculas
                await db.query(`
                    UPDATE empleados 
                    SET estado = 'ACTIVO' 
                    WHERE id_empleado = $1
                `, {
                    bind: [empleado.id_empleado],
                    type: db.QueryTypes.UPDATE
                });

                console.log('✅ Estado del empleado actualizado a ACTIVO');
            }

            // Verificar el estado final
            const empleadoFinal = await db.query(`
                SELECT nombre, apellido, estado 
                FROM empleados 
                WHERE id_empleado = $1
            `, {
                bind: [empleado.id_empleado],
                type: db.QueryTypes.SELECT
            });

            console.log('\n📋 Estado final del empleado:');
            console.log(empleadoFinal[0]);

        } else {
            console.log('❌ Usuario admin no encontrado');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await db.close();
    }
}

fixEmpleadoAdmin();
