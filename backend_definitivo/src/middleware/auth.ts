import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.model';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_2024';

// Extender la interfaz Request para incluir el usuario
export interface AuthUser {
    id: number;
    email: string;
    rol: string;
    nombre: string;
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
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ message: 'Usuario no válido' });
        }

        req.user = {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
            nombre: usuario.nombre
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
