import { Request, Response } from "express";
import { Pedidos } from "../models/Pedidos.model";
import { DetallePedidos } from "../models/DetallePedidos.model";

// Crear pedido con detalle (sin transacciones, simple)
export const createPedido = async (req: Request, res: Response) => {
  try {
    const { id_cliente, id_empleados, payment_id, detalle } = req.body;

    // Creo el pedido
    const pedido = await Pedidos.create({ id_cliente, id_empleados, payment_id, estado: 'activo' });

    // Creo detalles
    for (const item of detalle) {
      await DetallePedidos.create({
        id_pedido: pedido.id_pedido,
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_venta: item.precio_venta,
      });
    }

    res.status(201).json(pedido);
  } catch (error: any) {
    console.error("Error al crear pedido", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los pedidos con detalles
export const getPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await Pedidos.findAll({
      include: [{ model: DetallePedidos }],
      order: [['id_pedido', 'DESC']],
    });
    res.status(200).json(pedidos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pedido por ID con detalles
export const getPedidoById = async (req: Request, res: Response) => {
  try {
    const pedido = await Pedidos.findByPk(req.params.id, {
      include: [{ model: DetallePedidos }],
    });
    if (pedido) {
      res.status(200).json(pedido);
    } else {
      res.status(404).json({ error: "Pedido no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Anular pedido (cambiar estado)
export const anularPedido = async (req: Request, res: Response) => {
  try {
    const pedido = await Pedidos.findByPk(req.params.id);
    if (pedido) {
      pedido.estado = 'anulado';
      await pedido.save();
      res.status(200).json({ message: "Pedido anulado correctamente" });
    } else {
      res.status(404).json({ error: "Pedido no encontrado para anular" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
