const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function seedDirecto() {
    try {
        console.log('🔧 Configurando seed directo para tabla loguin...');

        // Crear roles correctos
        const roles = [
            { id_rol: 1, descripcion: 'Admin' },
            { id_rol: 2, descripcion: 'Vendedor' },
            { id_rol: 3, descripcion: 'Inventario' },
            { id_rol: 4, descripcion: 'Marketing' }
        ];

        console.log('👥 Creando roles...');
        for (const rol of roles) {
            db.run(
                'INSERT OR REPLACE INTO roles (id_rol, descripcion) VALUES (?, ?)',
                [rol.id_rol, rol.descripcion],
                function (err) {
                    if (err) {
                        console.error(`❌ Error con rol ${rol.descripcion}:`, err.message);
                    } else {
                        console.log(`✅ Rol ${rol.descripcion} creado/actualizado`);
                    }
                }
            );
        }

        // Crear usuarios de prueba
        const usuarios = [
            {
                usuario: 'admin',
                password: 'admin123',
                nombre: 'Admin',
                apellido: 'Sistema',
                mail: 'admin@demo.com',
                rol_id: 1
            },
            {
                usuario: 'vendedor',
                password: 'vendedor123',
                nombre: 'Vendedor',
                apellido: 'Demo',
                mail: 'vendedor@demo.com',
                rol_id: 2
            },
            {
                usuario: 'inventario',
                password: 'inventario123',
                nombre: 'Inventario',
                apellido: 'Demo',
                mail: 'inventario@demo.com',
                rol_id: 3
            },
            {
                usuario: 'marketing',
                password: 'marketing123',
                nombre: 'Marketing',
                apellido: 'Demo',
                mail: 'marketing@demo.com',
                rol_id: 4
            }
        ];

        console.log('👤 Creando usuarios...');
        for (const userData of usuarios) {
            try {
                const passwordHash = await hashPassword(userData.password);

                // Crear empleado
                db.run(
                    `INSERT OR REPLACE INTO empleados 
                    (nombre, apellido, mail, estado, cuil, domicilio, telefono) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [userData.nombre, userData.apellido, userData.mail, 'ACTIVO', '12345678901', 'Dirección Demo', '1234567890'],
                    function (err) {
                        if (err) {
                            console.error(`❌ Error creando empleado ${userData.nombre}:`, err.message);
                        } else {
                            console.log(`✅ Empleado ${userData.nombre} creado/actualizado`);

                            // Obtener el ID del empleado creado
                            db.get('SELECT id_empleado FROM empleados WHERE mail = ?', [userData.mail], function (err, row) {
                                if (err || !row) {
                                    console.error(`❌ Error obteniendo ID de empleado ${userData.nombre}:`, err?.message);
                                } else {
                                    // Crear login
                                    db.run(
                                        `INSERT OR REPLACE INTO loguin 
                                        (id_empleado, id_rol, usuario, passwd, password_provisoria, fecha_cambio_pass) 
                                        VALUES (?, ?, ?, ?, ?, ?)`,
                                        [row.id_empleado, userData.rol_id, userData.usuario, passwordHash, false, new Date().toISOString()],
                                        function (err) {
                                            if (err) {
                                                console.error(`❌ Error creando login ${userData.usuario}:`, err.message);
                                            } else {
                                                console.log(`✅ Login ${userData.usuario} creado/actualizado`);
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    }
                );

            } catch (error) {
                console.error(`❌ Error procesando usuario ${userData.usuario}:`, error.message);
            }
        }

        console.log('🎉 Seed completado exitosamente');

    } catch (error) {
        console.error('❌ Error en seed:', error.message);
    } finally {
        db.close();
    }
}

seedDirecto();
