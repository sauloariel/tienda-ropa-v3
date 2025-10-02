const { Sequelize } = require('sequelize');
require('dotenv').config();

// Usar la misma configuración que el proyecto
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ecommerce',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
    logging: console.log
});

async function crearTablaPromocionesProductos() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida correctamente');

        console.log('🔄 Creando tabla promociones_productos...');

        // Crear la tabla usando Sequelize
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS promociones_productos (
                id SERIAL PRIMARY KEY,
                id_promocion INTEGER NOT NULL,
                id_producto INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_promocion) REFERENCES promociones(id_promocion) ON DELETE CASCADE,
                FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
                UNIQUE(id_promocion, id_producto)
            )
        `);

        console.log('✅ Tabla promociones_productos creada exitosamente');

        // Crear índices
        console.log('🔄 Creando índices...');
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_promociones_productos_promocion 
            ON promociones_productos(id_promocion)
        `);

        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_promociones_productos_producto 
            ON promociones_productos(id_producto)
        `);

        console.log('✅ Índices creados exitosamente');

        // Verificar que la tabla se creó
        const [results] = await sequelize.query(`
            SELECT COUNT(*) as total_relaciones 
            FROM promociones_productos
        `);

        console.log(`📊 Total de relaciones en la tabla: ${results[0].total_relaciones}`);
        console.log('🎉 ¡Tabla promociones_productos lista para usar!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Sugerencias:');
        console.log('1. Verifica que PostgreSQL esté ejecutándose');
        console.log('2. Verifica que la base de datos "ecommerce" existe');
        console.log('3. Verifica que las tablas promociones y productos existen');
    } finally {
        await sequelize.close();
    }
}

// Ejecutar la función
crearTablaPromocionesProductos();