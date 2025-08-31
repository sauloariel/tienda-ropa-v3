import bcrypt from 'bcrypt';
import { Usuario } from '../models/Usuario.model';

export async function seedUsuarios() {
    try {
        console.log('🚀 Iniciando seed de usuarios...');

        // Usuarios demo
        const usuarios = [
            {
                email: 'admin@demo.com',
                password: 'admin123',
                nombre: 'Administrador',
                rol: 'admin',
                activo: true
            },
            {
                email: 'vendedor@demo.com',
                password: 'vendedor123',
                nombre: 'Vendedor',
                rol: 'vendedor',
                activo: true
            },
            {
                email: 'usuario@demo.com',
                password: 'usuario123',
                nombre: 'Usuario',
                rol: 'usuario',
                activo: true
            }
        ];

        console.log('👥 Creando usuarios...');
        for (const usuario of usuarios) {
            try {
                const passwordHash = await bcrypt.hash(usuario.password, 10);
                const [usuarioCreado, created] = await Usuario.findOrCreate({
                    where: { email: usuario.email },
                    defaults: {
                        ...usuario,
                        password: passwordHash
                    }
                });

                if (created) {
                    console.log(`✅ Usuario ${usuario.email} creado exitosamente`);
                } else {
                    console.log(`ℹ️ Usuario ${usuario.email} ya existe`);
                }
            } catch (error) {
                console.error(`❌ Error creando usuario ${usuario.email}:`, error.message);
            }
        }

        console.log('🎉 Seed de usuarios completado exitosamente');
    } catch (error) {
        console.error('❌ Error general en seed:', error.message);
    }
}
