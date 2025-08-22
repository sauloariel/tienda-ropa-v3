import { Request, Response } from "express";
import { Productos } from "../models/Productos.model";

// Crear producto
export const createProducto = async (req: Request, res: Response) => {
  try {
    const producto = await Productos.create(req.body);
    res.status(201).json(producto);
  } catch (error: any) {
    console.error("Error al crear producto", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los productos
export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await Productos.findAll();
    res.status(200).json(productos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener producto por ID
export const getProductoById = async (req: Request, res: Response) => {
  try {
    const producto = await Productos.findByPk(req.params.id);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto por ID
export const updateProducto = async (req: Request, res: Response) => {
  try {
    const producto = await Productos.findByPk(req.params.id);
    if (producto) {
      await producto.update(req.body);
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: "Producto no encontrado para actualizar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto por ID
export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const deleted = await Productos.destroy({ where: { id_producto: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Producto no encontrado para eliminar" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
