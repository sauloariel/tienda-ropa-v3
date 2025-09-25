import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Loguin } from '../models/Loguin.model';
import { Empleados } from '../models/Empleados.model';
import { Roles } from '../models/Roles.model';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_jwt_secret_super_seguro_para_desarrollo_2024';

// Interfaz para el usuario autenticado
export interface AuthUser {
    id: number;
    usuario: string;
    nombre: string;
    id_empleado: number;
    rol: string;
    rol_id: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

// Middleware de autenticación
export const authRequired = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('🔐 Auth - Iniciando validación');

        const header = req.headers.authorization;
        console.log('🔐 Authorization header:', header ? header.substring(0, 20) + '...' : 'No header');

        if (!header?.startsWith('Bearer ')) {
            console.log('❌ No Bearer token found');
            return res.status(401).json({ message: 'Token requerido' });
        }

        const token = header.slice(7);
        console.log('🔐 Token extraído:', token.substring(0, 20) + '...');

        // Decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        console.log('🔐 Token decodificado:', { id: decoded.id, usuario: decoded.usuario });

        // Buscar el usuario en la base de datos
        const loguinData = await Loguin.findOne({
            where: { id_loguin: decoded.id }
        });

        if (!loguinData) {
            console.log('❌ Usuario no encontrado en la base de datos');
            return res.status(401).json({ message: 'Usuario no válido' });
        }

        // Buscar el empleado asociado
        const empleadoData = await Empleados.findByPk(loguinData.id_empleado);
        
        if (!empleadoData) {
            console.log('❌ Empleado no encontrado');
            return res.status(401).json({ message: 'Empleado no válido' });
        }

        // Buscar el rol asociado
        const rolData = await Roles.findByPk(loguinData.id_rol);

        console.log('🔐 Usuario encontrado:', {
            found: !!loguinData,
            id: loguinData?.id_loguin,
            usuario: loguinData?.usuario,
            empleado_estado: empleadoData?.estado,
            empleado_id: empleadoData?.id_empleado,
            rol: rolData?.descripcion,
            rol_id: rolData?.id_rol
        });

        // Verificar que el usuario existe y está activo
        if (!loguinData || empleadoData?.estado !== 'ACTIVO') {
            console.log('❌ Usuario no válido o inactivo');
            return res.status(401).json({ message: 'Usuario no válido' });
        }

        // Crear objeto de usuario
        req.user = {
            id: loguinData.id_loguin,
            usuario: loguinData.usuario,
            nombre: `${empleadoData?.nombre || ''} ${empleadoData?.apellido || ''}`.trim(),
            id_empleado: empleadoData?.id_empleado || 0,
            rol: rolData?.descripcion || 'Usuario',
            rol_id: rolData?.id_rol || 0
        };

        console.log('✅ Usuario autenticado exitosamente:', req.user);
        next();
    } catch (error) {
        console.log('❌ Error en autenticación:', error);
        return res.status(401).json({ message: 'Token inválido' });
    }
};
