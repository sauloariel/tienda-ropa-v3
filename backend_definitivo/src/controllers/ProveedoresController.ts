import { Request, Response } from "express";
import { Proveedores } from "../models/Proveedores.model";

// Crear proveedor
export const createProveedor = async (req: Request, res: Response) => {
  try {
    const proveedor = await Proveedores.create(req.body);
    res.status(201).json(proveedor);
  } catch (error: any) {
    console.error("Error al crear proveedor", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los proveedores
export const getProveedores = async (req: Request, res: Response) => {
  try {
    const proveedores = await Proveedores.findAll();
    res.status(200).json(proveedores);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener proveedor por ID
export const getProveedorById = async (req: Request, res: Response) => {
  try {
    const proveedor = await Proveedores.findByPk(req.params.id);
    if (proveedor) {
      res.status(200).json(proveedor);
    } else {
      res.status(404).json({ error: "Proveedor no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar proveedor por ID
export const updateProveedor = async (req: Request, res: Response) => {
  try {
    const proveedor = await Proveedores.findByPk(req.params.id);
    if (proveedor) {
      await proveedor.update(req.body);
      res.status(200).json(proveedor);
    } else {
      res.status(404).json({ error: "Proveedor no encontrado para actualizar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar proveedor por ID
export const deleteProveedor = async (req: Request, res: Response) => {
  try {
    const deleted = await Proveedores.destroy({ where: { id_proveedor: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Proveedor no encontrado para eliminar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
