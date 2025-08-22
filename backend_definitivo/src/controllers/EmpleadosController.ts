import { Request, Response } from "express";
import { Empleados } from "../models/Empleados.model";

// Crear empleado
export const createEmpleado = async (req: Request, res: Response) => {
  try {
    const empleado = await Empleados.create(req.body);
    res.status(201).json(empleado);
  } catch (error: any) {
    console.error("Error al crear empleado:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los empleados
export const getEmpleados = async (req: Request, res: Response) => {
  try {
    const empleados = await Empleados.findAll();
    res.status(200).json(empleados);
  } catch (error: any) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener empleado por ID
export const getEmpleadoById = async (req: Request, res: Response) => {
  try {
    const empleado = await Empleados.findByPk(req.params.id);
    if (empleado) {
      res.status(200).json(empleado);
    } else {
      res.status(404).json({ error: "Empleado no encontrado" });
    }
  } catch (error: any) {
    console.error("Error al obtener empleado:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar empleado por ID
export const updateEmpleado = async (req: Request, res: Response) => {
  try {
    const empleado = await Empleados.findByPk(req.params.id);
    if (empleado) {
      await empleado.update(req.body);
      res.status(200).json(empleado);
    } else {
      res.status(404).json({ error: "Empleado no encontrado para actualizar" });
    }
  } catch (error: any) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar empleado por ID
export const deleteEmpleado = async (req: Request, res: Response) => {
  try {
    const deleted = await Empleados.destroy({ where: { id_empleado: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Empleado no encontrado para eliminar" });
    }
  } catch (error: any) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ error: error.message });
  }
};
