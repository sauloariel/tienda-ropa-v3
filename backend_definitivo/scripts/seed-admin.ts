import 'dotenv/config';
import bcrypt from 'bcrypt';
import { Loguin } from '../src/models/Loguin.model';
import { Empleados } from '../src/models/Empleados.model';
import { Roles } from '../src/models/Roles.model';
import db from '../src/config/db';

async function seedAdmin() {
    try {
        console.log('🌱 Iniciando seed de usuarios admin...');

        // Conectar a la base de datos
        await db.authenticate();
        console.log('✅ Base de datos conectada');

        // Crear rol Admin si no existe
        const [adminRole, createdRole] = await Roles.findOrCreate({
            where: { descripcion: 'Admin' },
            defaults: {
                descripcion: 'Admin',
                activo: true
            }
        });

        if (createdRole) {
            console.log('✅ Rol Admin creado');
        } else {
            console.log('ℹ️ Rol Admin ya existe');
        }

        // Crear empleado admin si no existe
        const [adminEmpleado, createdEmpleado] = await Empleados.findOrCreate({
            where: { mail: 'admin@empresa.com' },
            defaults: {
                nombre: 'Admin',
                apellido: 'Sistema',
                mail: 'admin@empresa.com',
                telefono: '123456789',
                sueldo: 50000.00,
                estado: 'ACTIVO',
                fecha_ingreso: new Date()
            }
        });

        if (createdEmpleado) {
            console.log('✅ Empleado admin creado');
        } else {
            console.log('ℹ️ Empleado admin ya existe');
        }

        // Crear usuario de login admin si no existe
        const existingLogin = await Loguin.findOne({
            where: { usuario: 'admin' }
        });

        if (!existingLogin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await Loguin.create({
                usuario: 'admin',
                passwd: hashedPassword,
                id_empleado: adminEmpleado.id_empleado,
                id_rol: adminRole.id_rol,
                password_provisoria: false,
                fecha_cambio_pass: new Date(),
                activo: true
            });

            console.log('✅ Usuario admin creado (admin/admin123)');
        } else {
            console.log('ℹ️ Usuario admin ya existe');
        }

        // Crear empleado lucia si no existe
        const [luciaEmpleado, createdLucia] = await Empleados.findOrCreate({
            where: { mail: 'lucia@empresa.com' },
            defaults: {
                nombre: 'Lucia',
                apellido: 'García',
                mail: 'lucia@empresa.com',
                telefono: '987654321',
                sueldo: 35000.00,
                estado: 'ACTIVO',
                fecha_ingreso: new Date()
            }
        });

        // Asegurar que el empleado lucia esté activo
        if (!createdLucia && luciaEmpleado.estado !== 'ACTIVO') {
            await luciaEmpleado.update({ estado: 'ACTIVO' });
            console.log('✅ Empleado lucia activado');
        }

        if (createdLucia) {
            console.log('✅ Empleado lucia creado');
        } else {
            console.log('ℹ️ Empleado lucia ya existe');
        }

        // Crear usuario de login lucia si no existe
        const existingLuciaLogin = await Loguin.findOne({
            where: { usuario: 'lucia' }
        });

        if (!existingLuciaLogin) {
            const hashedPassword = await bcrypt.hash('lucia123', 10);

            await Loguin.create({
                usuario: 'lucia',
                passwd: hashedPassword,
                id_empleado: luciaEmpleado.id_empleado,
                id_rol: adminRole.id_rol, // También admin para pruebas
                password_provisoria: false,
                fecha_cambio_pass: new Date(),
                activo: true
            });

            console.log('✅ Usuario lucia creado (lucia/lucia123)');
        } else {
            console.log('ℹ️ Usuario lucia ya existe');
        }

        console.log('🎉 Seed completado exitosamente');
        console.log('Usuarios disponibles:');
        console.log('  - admin / admin123');
        console.log('  - lucia / lucia123');

    } catch (error) {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    } finally {
        await db.close();
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    seedAdmin();
}

export default seedAdmin;
