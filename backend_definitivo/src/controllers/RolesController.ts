import { Request, Response } from "express";
import { Roles } from "../models/Roles.model";

// Crear un rol
export const createRol = async (req: Request, res: Response) => {
  try {
    const rol = await Roles.create(req.body);
    res.status(201).json(rol);
  } catch (error: any) {
    console.error("Error al crear rol", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los roles
export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Roles.findAll();
    res.status(200).json(roles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener rol por ID
export const getRolById = async (req: Request, res: Response) => {
  try {
    const rol = await Roles.findByPk(req.params.id);
    if (rol) {
      res.status(200).json(rol);
    } else {
      res.status(404).json({ error: "Rol no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar rol por ID
export const updateRol = async (req: Request, res: Response) => {
  try {
    const rol = await Roles.findByPk(req.params.id);
    if (rol) {
      await rol.update(req.body);
      res.status(200).json(rol);
    } else {
      res.status(404).json({ error: "Rol no encontrado para actualizar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar rol por ID
export const deleteRol = async (req: Request, res: Response) => {
  try {
    const deleted = await Roles.destroy({ where: { id_rol: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Rol no encontrado para eliminar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
