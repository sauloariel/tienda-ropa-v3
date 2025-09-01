const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function updateAdminPassword() {
    try {
        console.log('🔧 Actualizando contraseña del admin...');

        const password = 'admin123';
        const passwordHash = await bcrypt.hash(password, 10);

        // Actualizar la contraseña del admin
        db.run(
            'UPDATE loguin SET passwd = ? WHERE usuario = ?',
            [passwordHash, 'admin'],
            function (err) {
                if (err) {
                    console.error('❌ Error actualizando contraseña:', err.message);
                } else {
                    console.log('✅ Contraseña del admin actualizada');
                }
            }
        );

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        db.close();
    }
}

updateAdminPassword();
