const { Sequelize } = require('sequelize');
require('dotenv').config();

async function runMigration() {
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

        // Verificar si la columna empleado_id existe
        const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'facturas' 
      AND column_name = 'empleado_id'
    `);

        if (results.length === 0) {
            console.log('🔄 Agregando columna empleado_id a la tabla facturas...');

            // Agregar la columna
            await sequelize.query(`
        ALTER TABLE facturas 
        ADD COLUMN empleado_id INTEGER
      `);

            // Agregar foreign key constraint
            await sequelize.query(`
        ALTER TABLE facturas 
        ADD CONSTRAINT fk_facturas_empleado_id 
        FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado)
      `);

            // Crear índice
            await sequelize.query(`
        CREATE INDEX idx_facturas_empleado_id ON facturas(empleado_id)
      `);

            console.log('✅ Columna empleado_id agregada exitosamente');
        } else {
            console.log('ℹ️ La columna empleado_id ya existe en la tabla facturas');
        }

    } catch (error) {
        console.error('❌ Error ejecutando migración:', error);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar la migración
runMigration();
