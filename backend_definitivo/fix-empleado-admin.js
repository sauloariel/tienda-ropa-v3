const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function fixEmpleadoAdmin() {
    try {
        console.log('🔧 Activando empleado admin...');

        // Buscar el empleado admin
        db.get('SELECT id_empleado FROM empleados WHERE mail = ?', ['admin@demo.com'], function (err, row) {
            if (err) {
                console.error('❌ Error buscando empleado admin:', err.message);
            } else if (!row) {
                console.log('❌ No se encontró empleado admin');
            } else {
                // Activar el empleado
                db.run(
                    'UPDATE empleados SET estado = ? WHERE id_empleado = ?',
                    ['ACTIVO', row.id_empleado],
                    function (err) {
                        if (err) {
                            console.error('❌ Error activando empleado admin:', err.message);
                        } else {
                            console.log('✅ Empleado admin activado');
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

fixEmpleadoAdmin();
