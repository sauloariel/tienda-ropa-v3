import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Loguin } from '../models/Loguin.model';
import { Empleados } from '../models/Empleados.model';
import { Roles } from '../models/Roles.model';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_2024';

// Extender la interfaz Request para incluir el usuario
export interface AuthUser {
    id: number;
    usuario: string;
    rol: string;
    nombre: string;
    empleado_id: number;
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
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const token = header.slice(7);
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        // Verificar que el usuario existe y está activo
        const loguinData = await Loguin.findOne({
            where: { id_loguin: decoded.id },
            include: [
                {
                    model: Empleados,
                    as: 'empleado',
                    attributes: ['id_empleado', 'nombre', 'apellido', 'estado']
                },
                {
                    model: Roles,
                    as: 'rol',
                    attributes: ['id_rol', 'descripcion']
                }
            ]
        });

        if (!loguinData || loguinData.empleado?.estado !== 'ACTIVO') {
            return res.status(401).json({ message: 'Usuario no válido' });
        }

        req.user = {
            id: loguinData.id_loguin,
            usuario: loguinData.usuario,
            rol: loguinData.rol?.descripcion || 'Usuario',
            nombre: `${loguinData.empleado?.nombre || ''} ${loguinData.empleado?.apellido || ''}`.trim(),
            empleado_id: loguinData.empleado?.id_empleado || 0,
            rol_id: loguinData.rol?.id_rol || 0
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar roles (opcional)
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'Sin permiso' });
        }

        next();
    };
};
