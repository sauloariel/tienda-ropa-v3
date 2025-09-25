import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Clientes } from '../models/Clientes.model';

// Login de cliente (simplificado)
export const loginCliente = async (req: Request, res: Response) => {
    try {
        console.log('🔍 Login request:', req.body);

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
            cliente: clienteData
        });

    } catch (error) {
        console.error('❌ Error en login de cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Registro de nuevo cliente (simplificado)
export const registerCliente = async (req: Request, res: Response) => {
    try {
        console.log('🔍 Register request:', req.body);

        const { mail, password, nombre, apellido, telefono, domicilio } = req.body;

        // Validar campos requeridos
        if (!mail || !password || !nombre || !apellido) {
            return res.status(400).json({
                success: false,
                message: 'Email, contraseña, nombre y apellido son requeridos'
            });
        }

        // Verificar si el cliente ya existe
        const clienteExistente = await Clientes.findOne({
            where: { mail: mail.toLowerCase() }
        });

        if (clienteExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un cliente con este email'
            });
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generar DNI y CUIT únicos
        const timestamp = Date.now();
        const dniUnico = timestamp.toString().slice(-8); // Últimos 8 dígitos del timestamp
        const cuitUnico = `20${dniUnico}9`; // Formato CUIT argentino

        // Crear nuevo cliente
        const nuevoCliente = await Clientes.create({
            dni: dniUnico,
            cuit_cuil: cuitUnico,
            nombre,
            apellido,
            domicilio: domicilio || 'Sin especificar',
            telefono: telefono || 'Sin especificar',
            mail: mail.toLowerCase(),
            password: hashedPassword,
            estado: 'activo'
        });

        console.log('✅ Cliente creado:', nuevoCliente.id_cliente);

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
            cliente: clienteData
        });

    } catch (error) {
        console.error('❌ Error en registro de cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Verificar si un cliente está logueado (simplificado)
export const verifyClienteToken = async (req: Request, res: Response) => {
    try {
        const { mail } = req.body;

        if (!mail) {
            return res.status(400).json({
                success: false,
                message: 'Email es requerido'
            });
        }

        const cliente = await Clientes.findOne({
            where: { mail: mail.toLowerCase() }
        });

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

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
            message: 'Cliente verificado',
            cliente: clienteData
        });

    } catch (error) {
        console.error('Error en verificación de cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Logout de cliente (simplificado)
export const logoutCliente = async (req: Request, res: Response) => {
    try {
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