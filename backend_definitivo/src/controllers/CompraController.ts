import { Request, Response } from 'express';
import { Compras } from '../models/Compras.model';

// Crear compra
export const createCompra = async (req: Request, res: Response) => {
  try {
    const compra = await Compras.create(req.body);
    res.status(201).json(compra);
  } catch (error: any) {
    console.error('Error al crear compra', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las compras
export const getCompras = async (_req: Request, res: Response) => {
  try {
    const compras = await Compras.findAll({ include: ['proveedor', 'producto'] });
    res.status(200).json(compras);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener compra por ID
export const getCompraById = async (req: Request, res: Response) => {
  try {
    const compra = await Compras.findByPk(req.params.id, { include: ['proveedor', 'producto'] });
    if (compra) {
      res.status(200).json(compra);
    } else {
      res.status(404).json({ error: 'Compra no encontrada' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar compra
export const updateCompra = async (req: Request, res: Response) => {
  try {
    const compra = await Compras.findByPk(req.params.id);
    if (compra) {
      await compra.update(req.body);
      res.status(200).json(compra);
    } else {
      res.status(404).json({ error: 'Compra no encontrada para actualizar' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar compra
export const deleteCompra = async (req: Request, res: Response) => {
  try {
    const deleted = await Compras.destroy({ where: { id_compra: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Compra no encontrada para eliminar' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
