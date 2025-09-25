import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta a la base de datos
const dbPath = join(__dirname, '..', 'database.sqlite');

console.log('🧪 Iniciando prueba del módulo de promociones...\n');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        process.exit(1);
    }
    console.log('✅ Conectado a la base de datos SQLite');
});

// Función para probar la tabla promociones
function testPromocionesTable() {
    console.log('\n🔍 Verificando tabla promociones...');

    // 1. Verificar que la tabla existe
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='promociones'", (err, row) => {
        if (err) {
            console.error('❌ Error verificando existencia de tabla:', err.message);
            return;
        }

        if (row) {
            console.log('✅ Tabla promociones existe');
        } else {
            console.log('❌ Tabla promociones NO existe');
            return;
        }

        // 2. Verificar estructura de la tabla
        db.all("PRAGMA table_info(promociones)", (err, columns) => {
            if (err) {
                console.error('❌ Error obteniendo estructura de tabla:', err.message);
                return;
            }

            console.log('\n📋 Estructura de la tabla:');
            console.table(columns);

            // 3. Contar registros
            db.get("SELECT COUNT(*) as total FROM promociones", (err, count) => {
                if (err) {
                    console.error('❌ Error contando registros:', err.message);
                    return;
                }

                console.log(`\n📊 Total de promociones: ${count.total}`);

                // 4. Mostrar promociones activas
                db.all("SELECT id_promocion, nombre, tipo, valor, codigo_descuento, estado FROM promociones WHERE estado = 'ACTIVA'", (err, rows) => {
                    if (err) {
                        console.error('❌ Error obteniendo promociones activas:', err.message);
                        return;
                    }

                    console.log('\n🎯 Promociones activas:');
                    console.table(rows);

                    // 5. Probar validación de código de descuento
                    testCodigoDescuento();
                });
            });
        });
    });
}

// Función para probar validación de códigos de descuento
function testCodigoDescuento() {
    console.log('\n🔍 Probando validación de códigos de descuento...');

    const codigosTest = ['VERANO20', 'DESC10', 'CODIGO_INEXISTENTE', '2X1CAMISETAS'];

    let testsCompletados = 0;

    codigosTest.forEach(codigo => {
        db.get(`
            SELECT id_promocion, nombre, tipo, valor, estado, 
                   fecha_inicio, fecha_fin, minimo_compra, uso_maximo, uso_actual
            FROM promociones 
            WHERE codigo_descuento = ? AND estado = 'ACTIVA'
        `, [codigo], (err, row) => {
            if (err) {
                console.error(`❌ Error validando código ${codigo}:`, err.message);
            } else if (row) {
                console.log(`✅ Código ${codigo}: VÁLIDO - ${row.nombre} (${row.tipo}: ${row.valor})`);
            } else {
                console.log(`❌ Código ${codigo}: INVÁLIDO o inactivo`);
            }

            testsCompletados++;
            if (testsCompletados === codigosTest.length) {
                // 6. Probar estadísticas
                testEstadisticas();
            }
        });
    });
}

// Función para probar estadísticas
function testEstadisticas() {
    console.log('\n📈 Probando estadísticas de marketing...');

    const queries = [
        { name: 'Total promociones', query: "SELECT COUNT(*) as total FROM promociones" },
        { name: 'Promociones activas', query: "SELECT COUNT(*) as total FROM promociones WHERE estado = 'ACTIVA'" },
        { name: 'Promociones inactivas', query: "SELECT COUNT(*) as total FROM promociones WHERE estado = 'INACTIVA'" },
        { name: 'Promociones por vencer (7 días)', query: "SELECT COUNT(*) as total FROM promociones WHERE fecha_fin BETWEEN datetime('now') AND datetime('now', '+7 days') AND estado = 'ACTIVA'" },
        { name: 'Total uso de promociones', query: "SELECT SUM(uso_actual) as total FROM promociones" }
    ];

    let queriesCompletadas = 0;

    queries.forEach(({ name, query }) => {
        db.get(query, (err, row) => {
            if (err) {
                console.error(`❌ Error en ${name}:`, err.message);
            } else {
                console.log(`📊 ${name}: ${row.total || 0}`);
            }

            queriesCompletadas++;
            if (queriesCompletadas === queries.length) {
                console.log('\n✅ ¡Todas las pruebas completadas exitosamente!');
                console.log('🎉 El módulo de promociones está funcionando correctamente');

                // Cerrar conexión
                db.close((err) => {
                    if (err) {
                        console.error('❌ Error cerrando base de datos:', err.message);
                    } else {
                        console.log('🔒 Conexión cerrada');
                    }
                });
            }
        });
    });
}

// Ejecutar las pruebas
testPromocionesTable();

