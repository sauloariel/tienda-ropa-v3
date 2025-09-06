const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function fixLoguinTable() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'ecommerce',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '123',
    });

    try {
        console.log('🔧 Conectando a la base de datos...');
        await client.connect();
        console.log('✅ Conectado a PostgreSQL');

        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, 'fix-loguin-table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🔧 Ejecutando migración...');
        await client.query(sql);
        console.log('✅ Migración completada');

        // Verificar la estructura de la tabla
        const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'loguin' 
      ORDER BY ordinal_position
    `);

        console.log('📋 Estructura actual de la tabla loguin:');
        result.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    fixLoguinTable();
}

module.exports = fixLoguinTable;

