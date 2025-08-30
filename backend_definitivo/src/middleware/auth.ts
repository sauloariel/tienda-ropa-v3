import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Loguin } from '../models/Loguin.model';
import { Empleados } from '../models/Empleados.model';
import { Roles } from '../models/Roles.model';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_2024_tienda_ropa';

// Extender la interfaz Request para incluir el usuario
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                usuario: string;
                empleado_id: number;
                rol_id: number;
                rol_nombre: string;
            };
        }
    }
}

// Middleware de autenticación
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        // Buscar usuario en la base de datos
        const loguinData = await Loguin.findOne({
            where: { id_loguin: decoded.id },
            include: [
                {
                    model: Empleados,
                    as: 'empleado',
                    attributes: ['id_empleado', 'nombre', 'apellido', 'mail', 'telefono', 'estado']
                },
                {
                    model: Roles,
                    as: 'rol',
                    attributes: ['id_rol', 'descripcion']
                }
            ]
        });

        if (!loguinData || loguinData.empleado?.estado !== 'ACTIVO') {
            return res.status(401).json({
                success: false,
                message: 'Usuario no válido o inactivo'
            });
        }

        // Agregar información del usuario a la request
        req.user = {
            id: loguinData.id_loguin,
            usuario: loguinData.usuario,
            empleado_id: loguinData.empleado?.id_empleado || 0,
            rol_id: loguinData.rol?.id_rol || 0,
            rol_nombre: loguinData.rol?.descripcion || 'Usuario'
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        console.error('Error en autenticación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Autenticación requerida'
            });
        }

        if (!roles.includes(req.user.rol_nombre)) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Rol insuficiente'
            });
        }

        next();
    };
};

// Middleware para verificar si es admin
export const requireAdmin = requireRole(['ADMIN']);

// Middleware para verificar si es empleado o admin
export const requireEmployee = requireRole(['ADMIN', 'EMPLEADO', 'VENDEDOR']);

// Middleware para verificar si es vendedor o admin
export const requireVendor = requireRole(['ADMIN', 'VENDEDOR']);
