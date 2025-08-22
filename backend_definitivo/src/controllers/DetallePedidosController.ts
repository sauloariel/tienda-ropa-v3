import { Request, Response } from 'express';
import DetallePedidos from '../models/DetallePedidos.model';

// Crear detalle pedido
export const createDetallePedido = async (req: Request, res: Response) => {
  try {
    const detalle = await DetallePedidos.create(req.body);
    res.status(201).json(detalle);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear detalle pedido' });
  }
};

// Listar todos los detalles pedidos
export const getDetallePedidos = async (req: Request, res: Response) => {
  try {
    const detalles = await DetallePedidos.findAll();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalles pedidos' });
  }
};

// Obtener detalle pedido por id (supuesto que tengas campo id, si no, ajustar)
export const getDetallePedidoById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const detalle = await DetallePedidos.findByPk(id);
    if (!detalle) {
      return res.status(404).json({ error: 'Detalle pedido no encontrado' });
    }
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalle pedido' });
  }
};

// Actualizar detalle pedido
export const updateDetallePedido = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const detalle = await DetallePedidos.findByPk(id);
    if (!detalle) {
      return res.status(404).json({ error: 'Detalle pedido no encontrado' });
    }
    await detalle.update(req.body);
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar detalle pedido' });
  }
};

// Eliminar detalle pedido
export const deleteDetallePedido = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const detalle = await DetallePedidos.findByPk(id);
    if (!detalle) {
      return res.status(404).json({ error: 'Detalle pedido no encontrado' });
    }
    await detalle.destroy();
    res.json({ message: 'Detalle pedido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar detalle pedido' });
  }
};
