import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Loguin } from "../models/Loguin.model";
import { Empleados } from "../models/Empleados.model";
import { Roles } from "../models/Roles.model";

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_2024';

// Almacén temporal para tokens de recuperación (en producción usar Redis)
const passwordResetTokens = new Map<string, { userId: number; expires: Date }>();

// Login de empleado
export const loginEmpleado = async (req: Request, res: Response) => {
  try {
    const { usuario, password } = req.body;

    // Validar campos requeridos
    if (!usuario || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar el usuario en la tabla loguin
    const loguinData = await Loguin.findOne({
      where: { usuario },
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

    if (!loguinData) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el empleado está activo
    if (loguinData.empleado?.estado !== 'ACTIVO') {
      return res.status(401).json({
        success: false,
        message: 'Cuenta de empleado inactiva'
      });
    }

    // Verificar la contraseña
    const passwordValida = await bcrypt.compare(password, loguinData.passwd);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    // Generar token JWT
    const payload = {
      id: loguinData.id_loguin,
      usuario: loguinData.usuario,
      empleado_id: loguinData.empleado?.id_empleado,
      rol_id: loguinData.rol?.id_rol,
      rol_nombre: loguinData.rol?.descripcion
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Actualizar último acceso
    await Loguin.update(
      { ultimo_acceso: new Date() },
      { where: { id_loguin: loguinData.id_loguin } }
    );

    // Preparar respuesta del usuario
    const usuarioResponse = {
      id: loguinData.id_loguin,
      nombre: `${loguinData.empleado?.nombre || ''} ${loguinData.empleado?.apellido || ''}`.trim(),
      usuario: loguinData.usuario,
      email: loguinData.empleado?.mail || `${loguinData.usuario}@empresa.com`,
      rol: loguinData.rol?.descripcion || 'Usuario',
      activo: loguinData.empleado?.estado === 'ACTIVO',
      empleado_id: loguinData.empleado?.id_empleado,
      rol_id: loguinData.rol?.id_rol
    };

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: usuarioResponse,
      expires_in: 24 * 60 * 60
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Solicitar recuperación de contraseña
export const solicitarRecuperacionPassword = async (req: Request, res: Response) => {
  try {
    const { usuario } = req.body;

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Usuario es requerido'
      });
    }

    // Buscar usuario
    const loguinData = await Loguin.findOne({
      where: { usuario },
      include: [
        {
          model: Empleados,
          as: 'empleado',
          attributes: ['id_empleado', 'nombre', 'apellido', 'mail', 'estado']
        }
      ]
    });

    if (!loguinData || loguinData.empleado?.estado !== 'ACTIVO') {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }

    // Generar token de recuperación único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // Guardar token en memoria (en producción usar Redis)
    passwordResetTokens.set(resetToken, {
      userId: loguinData.id_loguin,
      expires: expiresAt
    });

    // En producción, enviar email aquí
    console.log(`Token de recuperación para ${usuario}: ${resetToken}`);
    console.log(`Email: ${loguinData.empleado?.mail}`);

    res.json({
      success: true,
      message: 'Se ha enviado un enlace de recuperación a tu email',
      resetToken, // Solo para desarrollo - en producción no enviar
      expiresAt
    });

  } catch (error) {
    console.error('Error al solicitar recuperación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Verificar token de recuperación
export const verificarTokenRecuperacion = async (req: Request, res: Response) => {
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

    res.json({
      success: true,
      message: 'Token válido',
      userId: tokenData.userId
    });

  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Cambiar contraseña con token de recuperación
export const cambiarPasswordConToken = async (req: Request, res: Response) => {
  try {
    const { resetToken, nuevaPassword } = req.body;

    if (!resetToken || !nuevaPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token y nueva contraseña son requeridos'
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
    const passwordEncriptado = await bcrypt.hash(nuevaPassword, 10);

    // Actualizar contraseña
    await Loguin.update(
      {
        passwd: passwordEncriptado,
        password_provisoria: false,
        fecha_cambio_pass: new Date()
      },
      { where: { id_loguin: tokenData.userId } }
    );

    // Limpiar token usado
    passwordResetTokens.delete(resetToken);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Verificar token
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

    const usuarioResponse = {
      id: loguinData.id_loguin,
      nombre: `${loguinData.empleado?.nombre || ''} ${loguinData.empleado?.apellido || ''}`.trim(),
      usuario: loguinData.usuario,
      email: loguinData.empleado?.mail || `${loguinData.usuario}@empresa.com`,
      rol: loguinData.rol?.descripcion || 'Usuario',
      activo: loguinData.empleado?.estado === 'ACTIVO',
      empleado_id: loguinData.empleado?.id_empleado,
      rol_id: loguinData.rol?.id_rol
    };

    res.json({
      success: true,
      usuario: usuarioResponse
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

// Logout
export const logoutEmpleado = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener usuario actual
export const getCurrentUser = async (req: Request, res: Response) => {
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

    const usuarioResponse = {
      id: loguinData.id_loguin,
      nombre: `${loguinData.empleado?.nombre || ''} ${loguinData.empleado?.apellido || ''}`.trim(),
      usuario: loguinData.usuario,
      email: loguinData.empleado?.mail || `${loguinData.usuario}@empresa.com`,
      rol: loguinData.rol?.descripcion || 'Usuario',
      activo: loguinData.empleado?.estado === 'ACTIVO',
      empleado_id: loguinData.empleado?.id_empleado,
      rol_id: loguinData.rol?.id_rol
    };

    res.json({
      success: true,
      usuario: usuarioResponse
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    console.error('Error al obtener usuario actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Cambiar contraseña (usuario autenticado)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { password_actual, password_nuevo } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const loguinData = await Loguin.findOne({
      where: { id_loguin: decoded.id }
    });

    if (!loguinData) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(password_actual, loguinData.passwd);
    if (!passwordValida) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const passwordEncriptado = await bcrypt.hash(password_nuevo, 10);

    // Actualizar contraseña
    await Loguin.update(
      {
        passwd: passwordEncriptado,
        fecha_cambio_pass: new Date()
      },
      { where: { id_loguin: decoded.id } }
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
