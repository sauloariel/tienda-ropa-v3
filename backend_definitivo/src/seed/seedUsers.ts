import bcrypt from 'bcrypt';
import { Empleados } from '../models/Empleados.model';
import { Loguin } from '../models/Loguin.model';
import { Roles } from '../models/Roles.model';

export async function seedUsers() {
    try {
        // Crear roles si no existen
        const roles = [
            { id_rol: 1, descripcion: 'Administrador' },
            { id_rol: 2, descripcion: 'Vendedor' },
            { id_rol: 3, descripcion: 'Inventario' },
            { id_rol: 4, descripcion: 'Marketing' }
        ];

        for (const rol of roles) {
            await Roles.findOrCreate({
                where: { id_rol: rol.id_rol },
                defaults: rol
            });
        }

        // Crear empleados demo
        const empleados = [
            {
                id_empleado: 1,
                cuil: '20123456789',
                nombre: 'Ana',
                apellido: 'Admin',
                domicilio: 'Calle Admin 123',
                telefono: '1234567890',
                mail: 'admin@demo.com',
                sueldo: 50000,
                puesto: 'Administrador',
                estado: 'ACTIVO'
            },
            {
                id_empleado: 2,
                cuil: '20123456790',
                nombre: 'Vico',
                apellido: 'Vendedor',
                domicilio: 'Calle Vendedor 456',
                telefono: '1234567891',
                mail: 'vendedor@demo.com',
                sueldo: 35000,
                puesto: 'Vendedor',
                estado: 'ACTIVO'
            },
            {
                id_empleado: 3,
                cuil: '20123456791',
                nombre: 'Inés',
                apellido: 'Inventario',
                domicilio: 'Calle Inventario 789',
                telefono: '1234567892',
                mail: 'inventario@demo.com',
                sueldo: 30000,
                puesto: 'Inventario',
                estado: 'ACTIVO'
            },
            {
                id_empleado: 4,
                cuil: '20123456792',
                nombre: 'Marta',
                apellido: 'Marketing',
                domicilio: 'Calle Marketing 012',
                telefono: '1234567893',
                mail: 'marketing@demo.com',
                sueldo: 40000,
                puesto: 'Marketing',
                estado: 'ACTIVO'
            }
        ];

        for (const empleado of empleados) {
            await Empleados.findOrCreate({
                where: { id_empleado: empleado.id_empleado },
                defaults: empleado
            });
        }

        // Crear usuarios de login
        const usuarios = [
            {
                id_loguin: 1,
                id_empleado: 1,
                id_rol: 1,
                usuario: 'admin',
                password: 'admin123'
            },
            {
                id_loguin: 2,
                id_empleado: 2,
                id_rol: 2,
                usuario: 'vendedor',
                password: 'vendedor123'
            },
            {
                id_loguin: 3,
                id_empleado: 3,
                id_rol: 3,
                usuario: 'inventario',
                password: 'inventario123'
            },
            {
                id_loguin: 4,
                id_empleado: 4,
                id_rol: 4,
                usuario: 'marketing',
                password: 'marketing123'
            }
        ];

        for (const usuario of usuarios) {
            const passwordHash = await bcrypt.hash(usuario.password, 10);
            await Loguin.findOrCreate({
                where: { id_loguin: usuario.id_loguin },
                defaults: {
                    id_loguin: usuario.id_loguin,
                    id_empleado: usuario.id_empleado,
                    id_rol: usuario.id_rol,
                    usuario: usuario.usuario,
                    passwd: passwordHash,
                    password_provisoria: false,
                    fecha_cambio_pass: new Date()
                }
            });
        }

        console.log('✅ Usuarios demo creados exitosamente');
    } catch (error) {
        console.error('❌ Error al crear usuarios demo:', error);
    }
}
