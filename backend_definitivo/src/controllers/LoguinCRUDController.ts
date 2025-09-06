import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { Loguin } from "../models/Loguin.model";
import { Empleados } from "../models/Empleados.model";
import { Roles } from "../models/Roles.model";

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
            attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass']
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
            attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass']
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
            attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass']
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
            fecha_cambio_pass: new Date()
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
            attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass']
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

        const { usuario, password, id_rol } = req.body;
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
            attributes: ['id_loguin', 'usuario', 'id_empleado', 'id_rol', 'password_provisoria', 'fecha_cambio_pass']
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
