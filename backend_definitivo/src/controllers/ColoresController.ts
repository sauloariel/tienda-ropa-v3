import { Request, Response } from 'express';
import { Colores } from '../models/Color.model';

// Crear un nuevo color
export const createColor = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;
    const nuevoColor = await Colores.create({ nombre });
    res.status(201).json(nuevoColor);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el color', error });
  }
};

// Obtener todos los colores
export const getColores = async (_req: Request, res: Response) => {
  try {
    const colores = await Colores.findAll();
    res.json(colores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los colores', error });
  }
};

// Obtener un color por ID
export const getColorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const color = await Colores.findByPk(id);

    if (!color) {
      return res.status(404).json({ message: 'Color no encontrado' });
    }

    res.json(color);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el color', error });
  }
};

// Actualizar un color por ID
export const updateColor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const color = await Colores.findByPk(id);

    if (!color) {
      return res.status(404).json({ message: 'Color no encontrado' });
    }

    await color.update(req.body);
    res.json(color);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el color', error });
  }
};

// Eliminar un color por ID
export const deleteColor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const color = await Colores.findByPk(id);

    if (!color) {
      return res.status(404).json({ message: 'Color no encontrado' });
    }

    await color.destroy();
    res.json({ message: 'Color eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el color', error });
  }
};
