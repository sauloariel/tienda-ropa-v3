import { Request, Response } from 'express';
import { Tallas } from '../models/Talle.model'; // Ajusta el path según tu estructura
import { TipoTalle } from '../models/TipoDeTalla.model';

// Crear una talla
export const createTalla = async (req: Request, res: Response) => {
  try {
    const talla = await Tallas.create(req.body);
    res.status(201).json(talla);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las tallas
export const getTallas = async (_req: Request, res: Response) => {
  try {
    const tallas = await Tallas.findAll({ include: [TipoTalle] });
    res.status(200).json(tallas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener talla por ID
export const getTallaById = async (req: Request, res: Response) => {
  try {
    const talla = await Tallas.findByPk(req.params.id, { include: [TipoTalle] });
    if (talla) {
      res.status(200).json(talla);
    } else {
      res.status(404).json({ error: 'Talla no encontrada' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar talla
export const updateTalla = async (req: Request, res: Response) => {
  try {
    const talla = await Tallas.findByPk(req.params.id);
    if (talla) {
      await talla.update(req.body);
      res.status(200).json(talla);
    } else {
      res.status(404).json({ error: 'Talla no encontrada para actualizar' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar talla
export const deleteTalla = async (req: Request, res: Response) => {
  try {
    const deleted = await Tallas.destroy({ where: { id_talla: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Talla no encontrada para eliminar' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
