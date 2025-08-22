import { Request, Response } from 'express';
import { TipoTalle } from '../models/TipoDeTalla.model';

export const createTipoTalle = async (req: Request, res: Response) => {
  try {
    const tipo = await TipoTalle.create(req.body);
    res.status(201).json(tipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tipo de talle' });
  }
};

export const getTiposTalle = async (_req: Request, res: Response) => {
  try {
    const tipos = await TipoTalle.findAll();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tipos de talle' });
  }
};

export const getTipoTalleById = async (req: Request, res: Response) => {
  try {
    const tipo = await TipoTalle.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo de talle' });
  }
};

export const updateTipoTalle = async (req: Request, res: Response) => {
  try {
    const tipo = await TipoTalle.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    await tipo.update(req.body);
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tipo de talle' });
  }
};

export const deleteTipoTalle = async (req: Request, res: Response) => {
  try {
    const tipo = await TipoTalle.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ error: 'Tipo no encontrado' });
    await tipo.destroy();
    res.json({ mensaje: 'Tipo de talle eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tipo de talle' });
  }
};
