import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Clientes } from '../models/Clientes.model';
// import { generateVerificationToken, sendVerificationEmail, sendWelcomeEmail } from '../services/emailService';

// Almacenamiento temporal de tokens de recuperación (en producción usar Redis)
const passwordResetTokens = new Map<string, { userId: number; expires: Date }>();

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

// Solicitar recuperación de contraseña para cliente
export const solicitarRecuperacionPasswordCliente = async (req: Request, res: Response) => {
    try {
        console.log('🔍 Solicitud de recuperación de contraseña:', req.body);

        const { mail } = req.body;

        if (!mail) {
            return res.status(400).json({
                success: false,
                message: 'Email es requerido'
            });
        }

        // Buscar cliente por email
        const cliente = await Clientes.findOne({
            where: { mail: mail.toLowerCase() }
        });

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'No existe un cliente con este email'
            });
        }

        if (cliente.estado !== 'activo') {
            return res.status(400).json({
                success: false,
                message: 'Tu cuenta está inactiva. Contacta al administrador.'
            });
        }

        // Generar token de recuperación único
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

        // Guardar token en memoria (en producción usar Redis)
        passwordResetTokens.set(resetToken, {
            userId: cliente.id_cliente,
            expires: expiresAt
        });

        console.log(`✅ Token de recuperación generado para ${mail}: ${resetToken}`);
        console.log(`⏰ Expira en: ${expiresAt.toISOString()}`);

        res.json({
            success: true,
            message: 'Se ha enviado un enlace de recuperación a tu email',
            resetToken, // Solo para desarrollo - en producción no enviar
            expiresAt,
            cliente: {
                id_cliente: cliente.id_cliente,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                mail: cliente.mail
            }
        });

    } catch (error) {
        console.error('❌ Error al solicitar recuperación de contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Verificar token de recuperación de cliente
export const verificarTokenRecuperacionCliente = async (req: Request, res: Response) => {
    try {
        const { resetToken } = req.params;

        const tokenData = passwordResetTokens.get(resetToken);

        if (!tokenData) {
            return res.status(400).json({
                success: false,
                message: 'Token de recuperación inválido'
            });
        }

        if (new Date() > tokenData.expires) {
            // Limpiar token expirado
            passwordResetTokens.delete(resetToken);
            return res.status(400).json({
                success: false,
                message: 'Token de recuperación expirado'
            });
        }

        // Obtener datos del cliente
        const cliente = await Clientes.findByPk(tokenData.userId, {
            attributes: ['id_cliente', 'nombre', 'apellido', 'mail']
        });

        res.json({
            success: true,
            message: 'Token válido',
            cliente: cliente
        });

    } catch (error) {
        console.error('❌ Error al verificar token de recuperación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Cambiar contraseña con token de recuperación para cliente
export const cambiarPasswordConTokenCliente = async (req: Request, res: Response) => {
    try {
        const { resetToken, nuevaPassword } = req.body;

        if (!resetToken || !nuevaPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token y nueva contraseña son requeridos'
            });
        }

        if (nuevaPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        const tokenData = passwordResetTokens.get(resetToken);

        if (!tokenData) {
            return res.status(400).json({
                success: false,
                message: 'Token de recuperación inválido'
            });
        }

        if (new Date() > tokenData.expires) {
            passwordResetTokens.delete(resetToken);
            return res.status(400).json({
                success: false,
                message: 'Token de recuperación expirado'
            });
        }

        // Encriptar nueva contraseña
        const saltRounds = 10;
        const passwordEncriptado = await bcrypt.hash(nuevaPassword, saltRounds);

        // Actualizar contraseña del cliente
        await Clientes.update(
            {
                password: passwordEncriptado
            },
            { where: { id_cliente: tokenData.userId } }
        );

        // Limpiar token usado
        passwordResetTokens.delete(resetToken);

        console.log(`✅ Contraseña actualizada para cliente ID: ${tokenData.userId}`);

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('❌ Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};