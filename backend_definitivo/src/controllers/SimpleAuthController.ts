import { Request, Response } from 'express';
import { Loguin } from '../models/Loguin.model';
import { Empleados } from '../models/Empleados.model';
import { Roles } from '../models/Roles.model';
import { simpleRoleAuth } from '../middleware/simpleRoleAuth';

// Login simplificado usando Basic Auth
export const simpleLogin = async (req: Request, res: Response) => {
    try {
        console.log('🔐 SimpleLogin - Iniciando validación');

        // Obtener usuario y contraseña del header Authorization (Basic Auth)
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            console.log('❌ No Basic Auth header found');
            return res.status(401).json({
                success: false,
                message: 'Autenticación requerida'
            });
        }

        // Decodificar Basic Auth
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [usuario, password] = credentials.split(':');

        console.log('🔐 Credenciales recibidas:', { usuario, password: '***' });

        if (!usuario || !password) {
            console.log('❌ Usuario o contraseña faltantes');
            return res.status(401).json({
                success: false,
                message: 'Usuario y contraseña requeridos'
            });
        }

        // Buscar el usuario en la base de datos
        const loguinData = await Loguin.findOne({
            where: { usuario }
        });

        if (!loguinData) {
            console.log('❌ Usuario no encontrado');
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Buscar el empleado asociado
        const empleadoData = await Empleados.findByPk(loguinData.id_empleado);

        if (!empleadoData) {
            console.log('❌ Empleado no encontrado');
            return res.status(401).json({
                success: false,
                message: 'Empleado no válido'
            });
        }

        // Buscar el rol asociado
        const rolData = await Roles.findByPk(loguinData.id_rol);

        // Verificar que el empleado está activo
        if (empleadoData.estado?.toUpperCase() !== 'ACTIVO') {
            console.log('❌ Empleado inactivo');
            return res.status(401).json({
                success: false,
                message: 'Cuenta inactiva'
            });
        }

        // Verificar la contraseña (usando bcrypt)
        const bcrypt = require('bcrypt');
        const passwordValida = await bcrypt.compare(password, loguinData.passwd);

        if (!passwordValida) {
            console.log('❌ Contraseña incorrecta');
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Crear objeto de usuario
        const user = {
            id: loguinData.id_loguin,
            usuario: loguinData.usuario,
            nombre: `${empleadoData.nombre || ''} ${empleadoData.apellido || ''}`.trim(),
            id_empleado: empleadoData.id_empleado,
            rol: rolData?.descripcion || 'Usuario',
            rol_id: rolData?.id_rol || 0
        };

        console.log('✅ Usuario autenticado exitosamente:', user);

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.log('❌ Error en simpleLogin:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};














