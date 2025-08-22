// controllers/categoriasController.ts
import { Request, Response } from 'express';
import { Categorias } from '../models/Categorias.model';

// Crear categoría
export const createCategoria = async (req: Request, res: Response) => {
  try {
    const { nombre_categoria, descripcion, estado } = req.body;

    const categoria = await Categorias.create({
      nombre_categoria,
      descripcion,
      estado,
    });

    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría', error });
  }
};

// Obtener todas las categorías
export const getCategorias = async (_req: Request, res: Response) => {
  try {
    const categorias = await Categorias.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
};

// Obtener categoría por ID
export const getCategoriaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoria = await Categorias.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la categoría', error });
  }
};

// Actualizar categoría
export const updateCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoria = await Categorias.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await categoria.update(req.body);

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la categoría', error });
  }
};

// Eliminar categoría
export const deleteCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoria = await Categorias.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await categoria.destroy();

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría', error });
  }
};
