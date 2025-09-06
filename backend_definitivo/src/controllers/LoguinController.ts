import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Loguin } from "../models/Loguin.model";
import { Empleados } from "../models/Empleados.model";
import { Roles } from "../models/Roles.model";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no configurado en las variables de entorno');
}

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
      rol: loguinData.rol?.descripcion,
      nombre: `${loguinData.empleado?.nombre || ''} ${loguinData.empleado?.apellido || ''}`.trim()
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

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
      token,
      user: usuarioResponse
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

// ===== FUNCIONES CRUD PARA GESTIONAR USUARIOS DE LOGIN =====

// Obtener todos los usuarios de login
export const getLoguinUsers = async (req: Request, res: Response) => {
  try {
    const loguinUsers = await Loguin.findAll({
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
      ],
      attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass', 'ultimo_acceso', 'activo']
    });

    // Transformar los datos para incluir información del empleado y rol
    const loguinUsersWithDetails = loguinUsers.map(loguin => {
      const loguinData = loguin.toJSON() as any;
      return {
        ...loguinData,
        empleado_nombre: loguinData.empleado ? `${loguinData.empleado.nombre} ${loguinData.empleado.apellido}` : 'Sin empleado',
        rol_descripcion: loguinData.rol?.descripcion || 'Sin rol',
        empleado_estado: loguinData.empleado?.estado || 'Sin estado'
      };
    });

    res.status(200).json(loguinUsersWithDetails);
  } catch (error: any) {
    console.error("Error al obtener usuarios de login:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario de login por ID
export const getLoguinUserById = async (req: Request, res: Response) => {
  try {
    const loguinUser = await Loguin.findByPk(req.params.id, {
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
      ],
      attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass', 'ultimo_acceso', 'activo']
    });

    if (loguinUser) {
      const loguinData = loguinUser.toJSON() as any;
      const loguinWithDetails = {
        ...loguinData,
        empleado_nombre: loguinData.empleado ? `${loguinData.empleado.nombre} ${loguinData.empleado.apellido}` : 'Sin empleado',
        rol_descripcion: loguinData.rol?.descripcion || 'Sin rol',
        empleado_estado: loguinData.empleado?.estado || 'Sin estado'
      };
      res.status(200).json(loguinWithDetails);
    } else {
      res.status(404).json({ error: "Usuario de login no encontrado" });
    }
  } catch (error: any) {
    console.error("Error al obtener usuario de login:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario de login por empleado
export const getLoguinUserByEmpleado = async (req: Request, res: Response) => {
  try {
    const loguinUser = await Loguin.findOne({
      where: { id_empleado: req.params.id_empleado },
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
      ],
      attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass', 'ultimo_acceso', 'activo']
    });

    if (loguinUser) {
      const loguinData = loguinUser.toJSON() as any;
      const loguinWithDetails = {
        ...loguinData,
        empleado_nombre: loguinData.empleado ? `${loguinData.empleado.nombre} ${loguinData.empleado.apellido}` : 'Sin empleado',
        rol_descripcion: loguinData.rol?.descripcion || 'Sin rol',
        empleado_estado: loguinData.empleado?.estado || 'Sin estado'
      };
      res.status(200).json(loguinWithDetails);
    } else {
      res.status(404).json({ error: "Usuario de login no encontrado para este empleado" });
    }
  } catch (error: any) {
    console.error("Error al obtener usuario de login por empleado:", error);
    res.status(500).json({ error: error.message });
  }
};

// Crear usuario de login
export const createLoguinUser = async (req: Request, res: Response) => {
  try {
    const { usuario, password, id_empleado, id_rol } = req.body;

    // Validar campos requeridos
    if (!usuario || !password || !id_empleado || !id_rol) {
      return res.status(400).json({
        error: "Usuario, contraseña, empleado y rol son requeridos"
      });
    }

    // Verificar que el empleado existe
    const empleado = await Empleados.findByPk(id_empleado);
    if (!empleado) {
      return res.status(400).json({
        error: "El empleado especificado no existe"
      });
    }

    // Verificar que el rol existe
    const rol = await Roles.findByPk(id_rol);
    if (!rol) {
      return res.status(400).json({
        error: "El rol especificado no existe"
      });
    }

    // Verificar que el empleado no tenga ya un usuario de login
    const existingLoguin = await Loguin.findOne({
      where: { id_empleado }
    });
    if (existingLoguin) {
      return res.status(400).json({
        error: "Este empleado ya tiene un usuario de login"
      });
    }

    // Verificar que el nombre de usuario no esté en uso
    const existingUsuario = await Loguin.findOne({
      where: { usuario }
    });
    if (existingUsuario) {
      return res.status(400).json({
        error: "El nombre de usuario ya está en uso"
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario de login
    const loguinUser = await Loguin.create({
      usuario,
      passwd: hashedPassword,
      id_empleado,
      id_rol,
      password_provisoria: true,
      fecha_cambio_pass: new Date(),
      activo: true
    });

    // Obtener el usuario creado con sus relaciones
    const loguinUserWithDetails = await Loguin.findByPk(loguinUser.id_loguin, {
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
      ],
      attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass', 'ultimo_acceso', 'activo']
    });

    const loguinData = loguinUserWithDetails?.toJSON() as any;
    const response = {
      ...loguinData,
      empleado_nombre: loguinData.empleado ? `${loguinData.empleado.nombre} ${loguinData.empleado.apellido}` : 'Sin empleado',
      rol_descripcion: loguinData.rol?.descripcion || 'Sin rol',
      empleado_estado: loguinData.empleado?.estado || 'Sin estado'
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("Error al crear usuario de login:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario de login
export const updateLoguinUser = async (req: Request, res: Response) => {
  try {
    const loguinUser = await Loguin.findByPk(req.params.id);

    if (!loguinUser) {
      return res.status(404).json({ error: "Usuario de login no encontrado" });
    }

    const { usuario, password, id_rol, activo } = req.body;
    const updateData: any = {};

    // Actualizar usuario si se proporciona
    if (usuario && usuario !== loguinUser.usuario) {
      // Verificar que el nuevo nombre de usuario no esté en uso
      const existingUsuario = await Loguin.findOne({
        where: { usuario }
      });
      if (existingUsuario) {
        return res.status(400).json({
          error: "El nombre de usuario ya está en uso"
        });
      }
      updateData.usuario = usuario;
    }

    // Actualizar contraseña si se proporciona
    if (password) {
      const saltRounds = 10;
      updateData.passwd = await bcrypt.hash(password, saltRounds);
      updateData.password_provisoria = true;
      updateData.fecha_cambio_pass = new Date();
    }

    // Actualizar rol si se proporciona
    if (id_rol) {
      const rol = await Roles.findByPk(id_rol);
      if (!rol) {
        return res.status(400).json({
          error: "El rol especificado no existe"
        });
      }
      updateData.id_rol = id_rol;
    }

    // Actualizar estado activo si se proporciona
    if (activo !== undefined) {
      updateData.activo = activo;
    }

    // Actualizar el usuario
    await loguinUser.update(updateData);

    // Obtener el usuario actualizado con sus relaciones
    const loguinUserUpdated = await Loguin.findByPk(req.params.id, {
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
      ],
      attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass', 'ultimo_acceso', 'activo']
    });

    const loguinData = loguinUserUpdated?.toJSON() as any;
    const response = {
      ...loguinData,
      empleado_nombre: loguinData.empleado ? `${loguinData.empleado.nombre} ${loguinData.empleado.apellido}` : 'Sin empleado',
      rol_descripcion: loguinData.rol?.descripcion || 'Sin rol',
      empleado_estado: loguinData.empleado?.estado || 'Sin estado'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error al actualizar usuario de login:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario de login
export const deleteLoguinUser = async (req: Request, res: Response) => {
  try {
    const loguinUser = await Loguin.findByPk(req.params.id);

    if (!loguinUser) {
      return res.status(404).json({ error: "Usuario de login no encontrado" });
    }

    await Loguin.destroy({ where: { id_loguin: req.params.id } });
    res.status(204).send();
  } catch (error: any) {
    console.error("Error al eliminar usuario de login:", error);
    res.status(500).json({ error: error.message });
  }
};
