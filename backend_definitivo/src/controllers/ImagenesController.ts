import { Request, Response } from 'express';
import { Imagenes } from '../models/Imagenes.model';
import path from 'path';

// Subir imagen
export const uploadImagen = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    const { id_producto, descripcion } = req.body;

    if (!id_producto) {
      return res.status(400).json({ error: 'ID del producto es requerido' });
    }

    const imagen = await Imagenes.create({
      id_productos: parseInt(id_producto),
      nombre_archivo: req.file.filename,
      ruta: `/uploads/${req.file.filename}`,
      descripcion: descripcion || 'Imagen del producto',
      imagen_bin: null
    });

    res.status(201).json({
      message: 'Imagen subida exitosamente',
      imagen: {
        id_imagen: imagen.id_imagen,
        nombre_archivo: imagen.nombre_archivo,
        ruta: imagen.ruta,
        descripcion: imagen.descripcion
      }
    });
  } catch (error: any) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: error.message });
  }
};

// Subir múltiples imágenes
export const uploadMultipleImagenes = async (req: Request, res: Response) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron archivos' });
    }

    const { id_producto } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!id_producto) {
      return res.status(400).json({ error: 'ID del producto es requerido' });
    }

    const imagenes = [];

    for (const file of files) {
      const imagen = await Imagenes.create({
        id_productos: parseInt(id_producto),
        nombre_archivo: file.filename,
        ruta: `/uploads/${file.filename}`,
        descripcion: 'Imagen del producto',
        imagen_bin: null
      });

      imagenes.push({
        id_imagen: imagen.id_imagen,
        nombre_archivo: imagen.nombre_archivo,
        ruta: imagen.ruta,
        descripcion: imagen.descripcion
      });
    }

    res.status(201).json({
      message: `${imagenes.length} imágenes subidas exitosamente`,
      imagenes
    });
  } catch (error: any) {
    console.error('Error al subir imágenes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener imágenes de un producto
export const getImagenesByProducto = async (req: Request, res: Response) => {
  try {
    const { id_producto } = req.params;

    const imagenes = await Imagenes.findAll({
      where: { id_productos: parseInt(id_producto) }
    });

    res.status(200).json(imagenes);
  } catch (error: any) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar imagen
export const deleteImagen = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fs = require('fs');

    const imagen = await Imagenes.findByPk(id);
    if (!imagen) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Eliminar archivo del sistema de archivos
    const filePath = path.join(process.cwd(), 'uploads', imagen.nombre_archivo || '');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar registro de la base de datos
    await imagen.destroy();

    res.status(200).json({ message: 'Imagen eliminada exitosamente' });
  } catch (error: any) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ error: error.message });
  }
};