const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

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

async function fixAdminPassword() {
    try {
        await db.authenticate();
        console.log('✅ Conexión a la base de datos exitosa');

        // Actualizar contraseña del usuario admin
        const passwordHash = await bcrypt.hash('admin123', 10);
        
        await db.query(`
            UPDATE loguin 
            SET passwd = $1, password_provisoria = false
            WHERE usuario = 'admin'
        `, {
            bind: [passwordHash],
            type: db.QueryTypes.UPDATE
        });

        console.log('✅ Contraseña del usuario admin actualizada');
        console.log('   Usuario: admin');
        console.log('   Contraseña: admin123');

        // Verificar que se actualizó
        const [adminUser] = await db.query(`
            SELECT usuario, passwd FROM loguin WHERE usuario = 'admin'
        `);

        console.log('\n📋 Usuario admin actualizado:');
        console.log(adminUser[0]);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await db.close();
    }
}

fixAdminPassword();
