import { Request, Response } from "express";
import { Loguin } from "../models/Loguin.model";

// Crear loguin
export const createLoguin = async (req: Request, res: Response) => {
  try {
    const loguin = await Loguin.create(req.body);
    res.status(201).json(loguin);
  } catch (error: any) {
    console.error("Error al crear loguin", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los loguines
export const getLoguines = async (req: Request, res: Response) => {
  try {
    const loguines = await Loguin.findAll();
    res.status(200).json(loguines);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener loguin por ID
export const getLoguinById = async (req: Request, res: Response) => {
  try {
    const loguin = await Loguin.findByPk(req.params.id);
    if (loguin) {
      res.status(200).json(loguin);
    } else {
      res.status(404).json({ error: "Loguin no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar loguin por ID
export const updateLoguin = async (req: Request, res: Response) => {
  try {
    const loguin = await Loguin.findByPk(req.params.id);
    if (loguin) {
      await loguin.update(req.body);
      res.status(200).json(loguin);
    } else {
      res.status(404).json({ error: "Loguin no encontrado para actualizar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar loguin por ID
export const deleteLoguin = async (req: Request, res: Response) => {
  try {
    const deleted = await Loguin.destroy({ where: { id_loguin: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Loguin no encontrado para eliminar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
