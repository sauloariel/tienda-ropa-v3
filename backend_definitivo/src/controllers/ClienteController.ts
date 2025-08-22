import { Request, Response } from "express";
import { Clientes } from "../models/Clientes.model"; // Ajustá la ruta según tu estructura

// Crear cliente
export const createCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await Clientes.create(req.body);
    res.status(201).json(cliente);
  } catch (error: any) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los clientes
export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await Clientes.findAll();
    res.status(200).json(clientes);
  } catch (error: any) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener cliente por ID
export const getClienteById = async (req: Request, res: Response) => {
  try {
    const cliente = await Clientes.findByPk(req.params.id);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error: any) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente por ID
export const updateCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await Clientes.findByPk(req.params.id);
    if (cliente) {
      await cliente.update(req.body);
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ error: "Cliente no encontrado para actualizar" });
    }
  } catch (error: any) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cliente por ID
export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const deleted = await Clientes.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Cliente no encontrado para eliminar" });
    }
  } catch (error: any) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: error.message });
  }
};
