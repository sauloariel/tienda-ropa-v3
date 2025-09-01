const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function fixAdminLogin() {
    try {
        console.log('🔧 Corrigiendo login admin...');

        // Buscar el empleado admin correcto
        db.get('SELECT id_empleado FROM empleados WHERE mail = ?', ['admin@tienda.com'], function (err, row) {
            if (err) {
                console.error('❌ Error buscando empleado admin:', err.message);
            } else if (!row) {
                console.log('❌ No se encontró empleado admin');
            } else {
                console.log(`✅ Empleado admin encontrado con ID: ${row.id_empleado}`);

                // Actualizar el login admin para que apunte al empleado correcto
                db.run(
                    'UPDATE loguin SET id_empleado = ? WHERE usuario = ?',
                    [row.id_empleado, 'admin'],
                    function (err) {
                        if (err) {
                            console.error('❌ Error actualizando login admin:', err.message);
                        } else {
                            console.log('✅ Login admin corregido');
                        }
                    }
                );
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        db.close();
    }
}

fixAdminLogin();
