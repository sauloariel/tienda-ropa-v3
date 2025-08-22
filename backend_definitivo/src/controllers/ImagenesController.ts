import { Request, Response } from "express";
import { Imagenes } from "../models/Imagenes.model";

// Crear imagen
export const createImagen = async (req: Request, res: Response) => {
  try {
    const imagen = await Imagenes.create(req.body);
    res.status(201).json(imagen);
  } catch (error: any) {
    console.error("Error al crear imagen", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las imágenes
export const getImagenes = async (req: Request, res: Response) => {
  try {
    const imagenes = await Imagenes.findAll();
    res.status(200).json(imagenes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener imagen por ID
export const getImagenById = async (req: Request, res: Response) => {
  try {
    const imagen = await Imagenes.findByPk(req.params.id);
    if (imagen) {
      res.status(200).json(imagen);
    } else {
      res.status(404).json({ error: "Imagen no encontrada" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar imagen por ID
export const updateImagen = async (req: Request, res: Response) => {
  try {
    const imagen = await Imagenes.findByPk(req.params.id);
    if (imagen) {
      await imagen.update(req.body);
      res.status(200).json(imagen);
    } else {
      res.status(404).json({ error: "Imagen no encontrada para actualizar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar imagen por ID
export const deleteImagen = async (req: Request, res: Response) => {
  try {
    const deleted = await Imagenes.destroy({ where: { id_imagen: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Imagen no encontrada para eliminar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
