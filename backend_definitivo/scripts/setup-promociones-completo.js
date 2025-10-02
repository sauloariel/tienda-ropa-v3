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

async function verificarYCrearTablas() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida correctamente');

        // Verificar si existe la tabla promociones
        console.log('🔄 Verificando tabla promociones...');
        const [promocionesExists] = await sequelize.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'promociones'
            )
        `);

        if (!promocionesExists[0].exists) {
            console.log('🔄 Creando tabla promociones...');
            await sequelize.query(`
                CREATE TABLE promociones (
                    id_promocion SERIAL PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    descripcion TEXT,
                    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('PORCENTAJE', 'MONTO_FIJO', '2X1', 'DESCUENTO_ESPECIAL')),
                    valor DECIMAL(10,2) NOT NULL,
                    codigo_descuento VARCHAR(50) UNIQUE,
                    fecha_inicio TIMESTAMP NOT NULL,
                    fecha_fin TIMESTAMP NOT NULL,
                    minimo_compra DECIMAL(10,2),
                    uso_maximo INTEGER,
                    uso_actual INTEGER DEFAULT 0,
                    estado VARCHAR(20) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'INACTIVA', 'EXPIRADA')),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Tabla promociones creada exitosamente');
        } else {
            console.log('✅ Tabla promociones ya existe');
        }

        // Verificar si existe la tabla promociones_productos
        console.log('🔄 Verificando tabla promociones_productos...');
        const [promocionesProductosExists] = await sequelize.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'promociones_productos'
            )
        `);

        if (!promocionesProductosExists[0].exists) {
            console.log('🔄 Creando tabla promociones_productos...');
            await sequelize.query(`
                CREATE TABLE promociones_productos (
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
        } else {
            console.log('✅ Tabla promociones_productos ya existe');
        }

        // Insertar datos de ejemplo si no existen
        console.log('🔄 Verificando datos de ejemplo...');
        const [count] = await sequelize.query('SELECT COUNT(*) as total FROM promociones');

        if (count[0].total == 0) {
            console.log('🔄 Insertando datos de ejemplo...');
            await sequelize.query(`
                INSERT INTO promociones (nombre, descripcion, tipo, valor, codigo_descuento, fecha_inicio, fecha_fin, minimo_compra, uso_maximo, estado) VALUES 
                ('Descuento 20% Verano', 'Descuento especial para la temporada de verano', 'PORCENTAJE', 20.00, 'VERANO20', '2025-01-01 00:00:00', '2025-03-31 23:59:59', 50.00, 100, 'ACTIVA'),
                ('Descuento Fijo $10', 'Descuento fijo de $10 en compras mayores a $30', 'MONTO_FIJO', 10.00, 'DESC10', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 30.00, 200, 'ACTIVA'),
                ('2x1 en Camisetas', 'Lleva 2 camisetas y paga solo 1', '2X1', 0.00, '2X1CAMISETAS', '2025-01-15 00:00:00', '2025-02-15 23:59:59', 0.00, 50, 'ACTIVA')
            `);
            console.log('✅ Datos de ejemplo insertados');
        } else {
            console.log('✅ Ya existen promociones en la base de datos');
        }

        console.log('🎉 ¡Todas las tablas están listas!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar la función
verificarYCrearTablas();

