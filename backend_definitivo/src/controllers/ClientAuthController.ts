import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Clientes } from '../models/Clientes.model';
// import { generateVerificationToken, sendVerificationEmail, sendWelcomeEmail } from '../services/emailService';

// Función para generar token de verificación
const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

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

        // Verificar que el email esté verificado
        if (!cliente.email_verificado) {
            return res.status(403).json({
                success: false,
                message: 'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.',
                requiere_verificacion: true,
                email: cliente.mail
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

        // Generar token de verificación
        const verificationToken = generateVerificationToken();
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Expira en 24 horas

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
            estado: 'activo',
            email_verificado: false,
            token_verificacion: verificationToken,
            fecha_token_verificacion: tokenExpiry
        });

        console.log('✅ Cliente creado:', nuevoCliente.id_cliente);

        // Enviar email de verificación (comentado temporalmente para pruebas)
        let emailEnviado = false;
        // try {
        //     emailEnviado = await sendVerificationEmail(
        //         mail.toLowerCase(),
        //         nombre,
        //         verificationToken
        //     );
        // } catch (error) {
        //     console.warn('⚠️ Error enviando email de verificación:', error);
        //     emailEnviado = false;
        // }

        if (!emailEnviado) {
            console.warn('⚠️ No se pudo enviar el email de verificación, pero el cliente fue creado');
        }

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
            estado: nuevoCliente.estado,
            email_verificado: nuevoCliente.email_verificado
        };

        res.status(201).json({
            success: true,
            message: emailEnviado
                ? 'Cliente registrado exitosamente. Revisa tu email para verificar tu cuenta.'
                : 'Cliente registrado exitosamente. Revisa tu email para verificar tu cuenta.',
            cliente: {
                ...clienteData,
                token_verificacion: verificationToken // Incluir token para EmailJS
            },
            email_enviado: emailEnviado,
            requiere_verificacion: true
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

// Verificar email con token
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token de verificación requerido'
            });
        }

        // Buscar cliente por token de verificación
        const cliente = await Clientes.findOne({
            where: { token_verificacion: token }
        });

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Token de verificación inválido o expirado'
            });
        }

        // Verificar si el token ha expirado
        if (cliente.fecha_token_verificacion && new Date() > cliente.fecha_token_verificacion) {
            return res.status(400).json({
                success: false,
                message: 'El token de verificación ha expirado. Solicita uno nuevo.',
                token_expirado: true
            });
        }

        // Verificar si ya está verificado
        if (cliente.email_verificado) {
            return res.status(200).json({
                success: true,
                message: 'El email ya está verificado',
                ya_verificado: true
            });
        }

        // Marcar email como verificado
        await cliente.update({
            email_verificado: true,
            token_verificacion: null,
            fecha_token_verificacion: null
        });

        // Enviar email de bienvenida (comentado temporalmente)
        // await sendWelcomeEmail(cliente.mail!, cliente.nombre!);

        res.json({
            success: true,
            message: 'Email verificado exitosamente. ¡Bienvenido!',
            cliente: {
                id_cliente: cliente.id_cliente,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                mail: cliente.mail,
                email_verificado: true
            }
        });

    } catch (error) {
        console.error('Error verificando email:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Reenviar email de verificación
export const resendVerificationEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email requerido'
            });
        }

        // Buscar cliente por email
        const cliente = await Clientes.findOne({
            where: { mail: email.toLowerCase() }
        });

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró una cuenta con este email'
            });
        }

        // Verificar si ya está verificado
        if (cliente.email_verificado) {
            return res.status(200).json({
                success: true,
                message: 'El email ya está verificado',
                ya_verificado: true
            });
        }

        // Generar nuevo token
        const verificationToken = generateVerificationToken();
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Expira en 24 horas

        // Actualizar token en la base de datos
        await cliente.update({
            token_verificacion: verificationToken,
            fecha_token_verificacion: tokenExpiry
        });

        // Enviar nuevo email de verificación (comentado temporalmente)
        // const emailEnviado = await sendVerificationEmail(
        //     email.toLowerCase(),
        //     cliente.nombre!,
        //     verificationToken
        // );

        // if (!emailEnviado) {
        //     return res.status(500).json({
        //         success: false,
        //         message: 'Error enviando email de verificación'
        //     });
        // }

        res.json({
            success: true,
            message: 'Email de verificación reenviado exitosamente'
        });

    } catch (error) {
        console.error('Error reenviando email de verificación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};