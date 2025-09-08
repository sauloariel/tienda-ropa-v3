import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Clientes } from '../models/Clientes.model';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

// Login de cliente
export const loginCliente = async (req: Request, res: Response) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar cliente por email
        const cliente = await Clientes.findOne({
            where: { mail: mail.toLowerCase() }
        });

        if (!cliente) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, cliente.password || '');

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar que el cliente esté activo
        if (cliente.estado !== 'activo') {
            return res.status(401).json({
                success: false,
                message: 'Cuenta desactivada. Contacta al administrador.'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id_cliente: cliente.id_cliente,
                mail: cliente.mail,
                tipo: 'cliente'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retornar datos del cliente (sin password)
        const clienteData = {
            id_cliente: cliente.id_cliente,
            dni: cliente.dni,
            cuit_cuil: cliente.cuit_cuil,
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            domicilio: cliente.domicilio,
            telefono: cliente.telefono,
            mail: cliente.mail,
            estado: cliente.estado
        };

        res.json({
            success: true,
            message: 'Login exitoso',
            cliente: clienteData,
            token
        });

    } catch (error) {
        console.error('Error en login de cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Registro de nuevo cliente
export const registerCliente = async (req: Request, res: Response) => {
    try {
        const { dni, cuit_cuil, nombre, apellido, domicilio, telefono, mail, password } = req.body;

        // Validar campos requeridos
        if (!dni || !cuit_cuil || !nombre || !apellido || !domicilio || !telefono || !mail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Verificar si el cliente ya existe
        const clienteExistente = await Clientes.findOne({
            where: {
                $or: [
                    { mail: mail.toLowerCase() },
                    { dni: dni }
                ]
            }
        });

        if (clienteExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un cliente con este email o DNI'
            });
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear nuevo cliente
        const nuevoCliente = await Clientes.create({
            dni,
            cuit_cuil,
            nombre,
            apellido,
            domicilio,
            telefono,
            mail: mail.toLowerCase(),
            password: hashedPassword,
            estado: 'activo'
        });

        // Generar token JWT
        const token = jwt.sign(
            {
                id_cliente: nuevoCliente.id_cliente,
                mail: nuevoCliente.mail,
                tipo: 'cliente'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retornar datos del cliente (sin password)
        const clienteData = {
            id_cliente: nuevoCliente.id_cliente,
            dni: nuevoCliente.dni,
            cuit_cuil: nuevoCliente.cuit_cuil,
            nombre: nuevoCliente.nombre,
            apellido: nuevoCliente.apellido,
            domicilio: nuevoCliente.domicilio,
            telefono: nuevoCliente.telefono,
            mail: nuevoCliente.mail,
            estado: nuevoCliente.estado
        };

        res.status(201).json({
            success: true,
            message: 'Cliente registrado exitosamente',
            cliente: clienteData,
            token
        });

    } catch (error) {
        console.error('Error en registro de cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Verificar token de cliente
export const verifyClienteToken = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        if (decoded.tipo !== 'cliente') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        // Buscar cliente
        const cliente = await Clientes.findByPk(decoded.id_cliente);

        if (!cliente || cliente.estado !== 'activo') {
            return res.status(401).json({
                success: false,
                message: 'Cliente no encontrado o inactivo'
            });
        }

        // Retornar datos del cliente
        const clienteData = {
            id_cliente: cliente.id_cliente,
            dni: cliente.dni,
            cuit_cuil: cliente.cuit_cuil,
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            domicilio: cliente.domicilio,
            telefono: cliente.telefono,
            mail: cliente.mail,
            estado: cliente.estado
        };

        res.json({
            success: true,
            cliente: clienteData
        });

    } catch (error) {
        console.error('Error verificando token de cliente:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

// Logout de cliente
export const logoutCliente = async (req: Request, res: Response) => {
    try {
        // En un sistema más robusto, aquí podrías invalidar el token
        // Por ahora, simplemente confirmamos el logout
        res.json({
            success: true,
            message: 'Logout exitoso'
        });
    } catch (error) {
        console.error('Error en logout de cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};








