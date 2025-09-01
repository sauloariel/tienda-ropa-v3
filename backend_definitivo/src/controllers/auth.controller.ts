import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Loguin } from '../models/Loguin.model';
import { Empleados } from '../models/Empleados.model';
import { Roles } from '../models/Roles.model';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_super_seguro_2024';

const toUserDTO = (row: any) => ({
    id: row.id_loguin,
    usuario: row.usuario,
    nombre: `${row.empleado?.nombre ?? ''} ${row.empleado?.apellido ?? ''}`.trim(),
    rol: row.rol?.descripcion as 'Admin' | 'Vendedor' | 'Inventario' | 'Marketing',
});

export const login = async (req: Request, res: Response) => {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos' });

        const row = await Loguin.findOne({
            where: { usuario },
            include: [
                { model: Empleados, as: 'empleado', attributes: ['id_empleado', 'nombre', 'apellido', 'estado'] },
                { model: Roles, as: 'rol', attributes: ['id_rol', 'descripcion'] },
            ],
        });

        if (!row) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        if (row.empleado?.estado !== 'ACTIVO') return res.status(401).json({ success: false, message: 'Usuario inactivo' });

        const ok = await bcrypt.compare(password, row.passwd ?? '');
        if (!ok) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

        const payload = { id: row.id_loguin, rol: row.rol?.descripcion, usuario: row.usuario };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

        return res.json({ success: true, message: 'Login OK', token, user: toUserDTO(row) });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Error interno' });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        const header = req.headers.authorization ?? '';
        if (!header.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Token requerido' });
        const token = header.slice(7);

        const jwtData = jwt.verify(token, JWT_SECRET) as any;

        const row = await Loguin.findOne({
            where: { id_loguin: jwtData.id },
            include: [
                { model: Empleados, as: 'empleado', attributes: ['id_empleado', 'nombre', 'apellido', 'estado'] },
                { model: Roles, as: 'rol', attributes: ['id_rol', 'descripcion'] },
            ],
        });

        if (!row || row.empleado?.estado !== 'ACTIVO')
            return res.status(401).json({ success: false, message: 'Usuario no válido' });

        return res.json({ success: true, user: toUserDTO(row) });
    } catch (e) {
        return res.status(401).json({ success: false, message: 'Token inválido' });
    }
};
