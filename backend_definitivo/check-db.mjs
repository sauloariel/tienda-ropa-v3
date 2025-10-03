import sqlite3 from 'sqlite3';
import { promisify } from 'util';

console.log('🔍 Verificando Base de Datos');
console.log('============================\n');

const db = new sqlite3.Database('database.sqlite');
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

async function checkDatabase() {
    try {
        // Verificar si la tabla clientes existe
        console.log('🔍 1. Verificando tabla clientes...');
        const tableInfo = await dbGet("SELECT name FROM sqlite_master WHERE type='table' AND name='clientes'");

        if (tableInfo) {
            console.log('✅ Tabla clientes existe');

            // Verificar estructura de la tabla
            const columns = await dbAll("PRAGMA table_info(clientes)");
            console.log('📊 Columnas de la tabla clientes:');
            columns.forEach(col => {
                console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
            });

            // Verificar datos existentes
            const count = await dbGet("SELECT COUNT(*) as count FROM clientes");
            console.log(`📊 Total de clientes: ${count.count}`);

            if (count.count > 0) {
                const sample = await dbGet("SELECT * FROM clientes LIMIT 1");
                console.log('📊 Ejemplo de cliente:', JSON.stringify(sample, null, 2));
            }

        } else {
            console.log('❌ Tabla clientes NO existe');
        }

        // Verificar otras tablas importantes
        console.log('\n🔍 2. Verificando otras tablas...');
        const tables = await dbAll("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('📊 Tablas disponibles:');
        tables.forEach(table => {
            console.log(`   - ${table.name}`);
        });

    } catch (error) {
        console.error('❌ Error verificando base de datos:', error.message);
    } finally {
        db.close();
    }
}

checkDatabase();

























