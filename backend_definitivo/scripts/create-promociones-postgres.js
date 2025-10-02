const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ecommerce',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
});

async function createPromocionesTable() {
    try {
        console.log('🔌 Conectando a PostgreSQL...');
        await client.connect();
        console.log('✅ Conectado a PostgreSQL');

        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, '..', 'create-promociones-postgres.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Ejecutando script de creación de tabla promociones...');

        // Ejecutar el SQL
        await client.query(sql);

        console.log('✅ Tabla promociones creada exitosamente');
        console.log('✅ Triggers y índices creados');
        console.log('✅ Datos de ejemplo insertados');

        // Verificar que la tabla se creó correctamente
        const result = await client.query('SELECT COUNT(*) as total_promociones FROM promociones');
        console.log(`📊 Total de promociones en la tabla: ${result.rows[0].total_promociones}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === '42P07') {
            console.log('ℹ️  La tabla promociones ya existe');
        }
    } finally {
        await client.end();
        console.log('🔌 Conexión cerrada');
    }
}

createPromocionesTable();










