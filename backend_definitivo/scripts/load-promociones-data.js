const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta a la base de datos
const dbPath = path.join(__dirname, '..', 'database.sqlite');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('✅ Conectado a la base de datos SQLite');
});

// Función para ejecutar el script SQL
function createPromocionesTable() {
    const fs = require('fs');
    const sqlPath = path.join(__dirname, '..', 'create-promociones-table.sql');

    try {
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Dividir el SQL en statements individuales
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

        console.log('🚀 Ejecutando script de creación de tabla promociones...');

        let completed = 0;
        statements.forEach((statement, index) => {
            if (statement.trim()) {
                db.run(statement, (err) => {
                    if (err) {
                        console.error(`❌ Error en statement ${index + 1}:`, err.message);
                        console.error('Statement:', statement.trim());
                    } else {
                        console.log(`✅ Statement ${index + 1} ejecutado correctamente`);
                    }

                    completed++;
                    if (completed === statements.length) {
                        // Verificar que la tabla se creó correctamente
                        verifyTable();
                    }
                });
            } else {
                completed++;
                if (completed === statements.length) {
                    verifyTable();
                }
            }
        });

    } catch (error) {
        console.error('❌ Error leyendo el archivo SQL:', error.message);
        db.close();
    }
}

// Función para verificar que la tabla se creó correctamente
function verifyTable() {
    console.log('\n🔍 Verificando creación de tabla...');

    // Verificar estructura de la tabla
    db.all("PRAGMA table_info(promociones)", (err, rows) => {
        if (err) {
            console.error('❌ Error verificando estructura de tabla:', err.message);
        } else {
            console.log('📋 Estructura de la tabla promociones:');
            console.table(rows);
        }
    });

    // Contar registros insertados
    db.get("SELECT COUNT(*) as total FROM promociones", (err, row) => {
        if (err) {
            console.error('❌ Error contando registros:', err.message);
        } else {
            console.log(`\n📊 Total de promociones insertadas: ${row.total}`);
        }

        // Mostrar algunas promociones de ejemplo
        db.all("SELECT id_promocion, nombre, tipo, valor, codigo_descuento, estado FROM promociones LIMIT 5", (err, rows) => {
            if (err) {
                console.error('❌ Error mostrando promociones:', err.message);
            } else {
                console.log('\n🎯 Promociones de ejemplo:');
                console.table(rows);
            }

            console.log('\n✅ ¡Módulo de promociones cargado exitosamente!');
            console.log('📝 La tabla promociones está lista para usar.');

            // Cerrar conexión
            db.close((err) => {
                if (err) {
                    console.error('❌ Error cerrando base de datos:', err.message);
                } else {
                    console.log('🔒 Conexión a base de datos cerrada');
                }
            });
        });
    });
}

// Ejecutar el script
console.log('🎯 Iniciando carga del módulo de promociones...\n');
createPromocionesTable();

