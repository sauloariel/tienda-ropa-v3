const { Sequelize } = require('sequelize');
require('dotenv').config();

async function fixEmpleadoColumnName() {
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

        if (results.length > 0) {
            console.log('🔄 Renombrando columna empleado_id a id_empleado...');

            // Eliminar la foreign key existente
            await sequelize.query(`
        ALTER TABLE facturas DROP CONSTRAINT IF EXISTS fk_facturas_empleado_id;
      `);

            // Eliminar el índice existente
            await sequelize.query(`
        DROP INDEX IF EXISTS idx_facturas_empleado_id;
      `);

            // Renombrar la columna
            await sequelize.query(`
        ALTER TABLE facturas RENAME COLUMN empleado_id TO id_empleado;
      `);

            // Crear la foreign key correcta
            await sequelize.query(`
        ALTER TABLE facturas 
        ADD CONSTRAINT fk_facturas_id_empleado 
        FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado);
      `);

            // Crear el índice
            await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_facturas_id_empleado ON facturas(id_empleado);
      `);

            console.log('✅ Columna renombrada exitosamente');
        } else {
            // Verificar si ya existe id_empleado
            const [idEmpleadoResults] = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'facturas' 
        AND column_name = 'id_empleado'
      `);

            if (idEmpleadoResults.length > 0) {
                console.log('ℹ️ La columna id_empleado ya existe');
            } else {
                console.log('🔄 Agregando columna id_empleado...');

                // Agregar la columna
                await sequelize.query(`
          ALTER TABLE facturas ADD COLUMN id_empleado INTEGER;
        `);

                // Crear la foreign key
                await sequelize.query(`
          ALTER TABLE facturas 
          ADD CONSTRAINT fk_facturas_id_empleado 
          FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado);
        `);

                // Crear el índice
                await sequelize.query(`
          CREATE INDEX IF NOT EXISTS idx_facturas_id_empleado ON facturas(id_empleado);
        `);

                console.log('✅ Columna id_empleado agregada exitosamente');
            }
        }

    } catch (error) {
        console.error('❌ Error corrigiendo nombre de columna:', error);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar la corrección
fixEmpleadoColumnName();


















