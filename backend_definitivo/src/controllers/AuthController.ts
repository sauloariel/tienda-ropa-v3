import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Loguin } from '../models/Loguin.model';
import { Empleados } from '../models/Empleados.model';
import { Roles } from '../models/Roles.model';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_2024';

export const login = async (req: Request, res: Response) => {
    try {
        const { usuario, password } = req.body;

        // Validar campos requeridos
        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y password son requeridos'
            });
        }

        // Buscar usuario en la tabla loguin
        const loguinData = await Loguin.findOne({
            where: { usuario: usuario },
            include: [
                {
                    model: Empleados,
                    as: 'empleado',
                    attributes: ['id_empleado', 'nombre', 'apellido', 'mail', 'estado']
                },
                {
                    model: Roles,
                    as: 'rol',
                    attributes: ['id_rol', 'descripcion']
                }
            ]
        });

        if (!loguinData) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si el empleado está activo
        if (loguinData.empleado?.estado !== 'ACTIVO') {
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo'
            });
        }

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, loguinData.passwd || '');
        if (!passwordValida) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar JWT
        const payload = {
            id: loguinData.id_loguin,
            usuario: loguinData.usuario,
            empleado_id: loguinData.empleado?.id_empleado,
            rol_id: loguinData.rol?.id_rol,
            rol: loguinData.rol?.descripcion,
            nombre: `${loguinData.empleado?.nombre || ''} ${loguinData.empleado?.apellido || ''}`.trim()
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            user: {
                id: loguinData.id_loguin,
                usuario: loguinData.usuario,
                nombre: payload.nombre,
                rol: payload.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const verifyToken = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;

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
            return res.status(401).json({
                success: false,
                message: 'Usuario no válido o inactivo'
            });
        }

        res.json({
            success: true,
            user: {
                id: loguinData.id_loguin,
                usuario: loguinData.usuario,
                nombre: `${loguinData.empleado?.nombre || ''} ${loguinData.empleado?.apellido || ''}`.trim(),
                rol: loguinData.rol?.descripcion
            }
        });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        console.error('Error al verificar token:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
