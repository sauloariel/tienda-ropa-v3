const { Sequelize } = require('sequelize');
require('dotenv').config();

async function fixEmpleadoForeignKey() {
    const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'ecommerce',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '123',
        logging: false
    });

    try {
        await sequelize.authenticate();
        console.log('🔌 Conexión a la base de datos establecida.');

        // Eliminar la foreign key existente si existe
        console.log('🔄 Eliminando foreign key existente...');
        await sequelize.query(`
      ALTER TABLE facturas DROP CONSTRAINT IF EXISTS fk_facturas_empleado_id;
    `);

        // Eliminar el índice existente si existe
        console.log('🔄 Eliminando índice existente...');
        await sequelize.query(`
      DROP INDEX IF EXISTS idx_facturas_empleado_id;
    `);

        // Crear la foreign key correcta que apunte a id_empleado
        console.log('🔄 Creando foreign key correcta...');
        await sequelize.query(`
      ALTER TABLE facturas 
      ADD CONSTRAINT fk_facturas_empleado_id 
      FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado);
    `);

        // Crear el índice para mejorar el rendimiento
        console.log('🔄 Creando índice...');
        await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_facturas_empleado_id ON facturas(empleado_id);
    `);

        console.log('✅ Foreign key corregida exitosamente');

    } catch (error) {
        console.error('❌ Error corrigiendo foreign key:', error);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar la corrección
fixEmpleadoForeignKey();














