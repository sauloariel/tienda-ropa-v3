import { Request, Response } from 'express';
import { Ventas } from '../models/Ventas.model';
import { DetalleVentas } from '../models/DetalleVentas.model';
import { Productos } from '../models/Productos.model';
import db from '../config/db';
import { Op } from 'sequelize';

export const createVenta = async (req: Request, res: Response) => {
    try {
        const { fecha_venta, total, metodo_pago, cliente_id, empleado_id, items } = req.body;

        console.log('🔄 Creando venta con datos:', {
            fecha_venta,
            total,
            metodo_pago,
            cliente_id,
            empleado_id,
            itemsCount: items?.length
        });

        // Crear la venta principal
        const venta = await Ventas.create({
            fecha_venta: fecha_venta || new Date(),
            total: parseFloat(total),
            metodo_pago,
            cliente_id: cliente_id || null,
            empleado_id: empleado_id || null,
            estado: 'completada'
        });

        console.log('✅ Venta creada con ID:', venta.id_venta);

        // Crear detalles de venta
        if (items && Array.isArray(items)) {
            console.log(`🔄 Creando ${items.length} detalles de venta...`);

            for (const item of items) {
                console.log('📦 Creando detalle:', item);

                await DetalleVentas.create({
                    id_venta: venta.id_venta,
                    id_producto: item.id_producto,
                    cantidad: parseInt(item.cantidad),
                    precio_unitario: parseFloat(item.precio_unitario),
                    subtotal: parseFloat(item.subtotal)
                });

                // Actualizar stock del producto
                const producto = await Productos.findByPk(item.id_producto);
                if (producto) {
                    const nuevoStock = producto.stock - parseInt(item.cantidad);
                    await producto.update({ stock: Math.max(0, nuevoStock) });
                    console.log(`📊 Stock actualizado para producto ${item.id_producto}: ${producto.stock} -> ${nuevoStock}`);
                }
            }
        }

        // Obtener la venta completa con detalles
        const ventaCompleta = await Ventas.findByPk(venta.id_venta, {
            include: [
                {
                    model: DetalleVentas,
                    as: 'detalles'
                }
            ]
        });

        console.log('✅ Venta completada exitosamente:', {
            id: ventaCompleta?.id_venta,
            total: ventaCompleta?.total,
            detalles: (ventaCompleta as any)?.detalles?.length || 0
        });

        res.status(201).json(ventaCompleta);
    } catch (error: any) {
        console.error("❌ Error al crear venta", error);
        res.status(500).json({ error: error.message });
    }
};

export const getVentas = async (req: Request, res: Response) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let whereClause: any = {};

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_venta = {
                [Op.between]: [new Date(fecha_inicio as string), new Date(fecha_fin as string)]
            };
        }

        const ventas = await Ventas.findAll({
            where: whereClause,
            include: [
                {
                    model: DetalleVentas,
                    as: 'detalles'
                }
            ],
            order: [['fecha_venta', 'DESC']]
        });

        res.json(ventas);
    } catch (error: any) {
        console.error("Error al obtener ventas", error);
        res.status(500).json({ error: error.message });
    }
};

export const getVentaById = async (req: Request, res: Response) => {
    try {
        const venta = await Ventas.findByPk(req.params.id, {
            include: [
                {
                    model: DetalleVentas,
                    as: 'detalles'
                }
            ]
        });

        if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
        res.json(venta);
    } catch (error: any) {
        console.error("Error al obtener venta", error);
        res.status(500).json({ error: error.message });
    }
};

export const getEstadisticasVentas = async (req: Request, res: Response) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let whereClause: any = {};

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_venta = {
                [Op.between]: [new Date(fecha_inicio as string), new Date(fecha_fin as string)]
            };
        }

        // Total de ventas
        const totalVentas = await Ventas.count({ where: whereClause });

        // Total de ingresos
        const totalIngresos = await Ventas.sum('total', { where: whereClause });

        // Promedio por venta
        const promedioVenta = totalVentas > 0 ? totalIngresos / totalVentas : 0;

        // Métodos de pago más utilizados
        const metodosPago = await Ventas.findAll({
            attributes: [
                'metodo_pago',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id_venta')), 'cantidad'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('total')), 'total']
            ],
            where: whereClause,
            group: ['metodo_pago'],
            order: [[db.Sequelize.fn('COUNT', db.Sequelize.col('id_venta')), 'DESC']]
        });

        // Productos más vendidos
        const productosMasVendidos = await DetalleVentas.findAll({
            attributes: [
                'id_producto',
                [db.Sequelize.fn('SUM', db.Sequelize.col('cantidad')), 'cantidad_vendida'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('subtotal')), 'total_vendido']
            ],
            include: [
                {
                    model: Ventas,
                    as: 'venta',
                    where: whereClause,
                    attributes: []
                }
            ],
            group: ['id_producto'],
            order: [[db.Sequelize.fn('SUM', db.Sequelize.col('cantidad')), 'DESC']],
            limit: 10
        });

        const estadisticas = {
            total_ventas: totalVentas,
            total_ingresos: totalIngresos || 0,
            promedio_venta: promedioVenta || 0,
            metodos_pago: metodosPago,
            productos_mas_vendidos: productosMasVendidos
        };

        res.json(estadisticas);
    } catch (error: any) {
        console.error("Error al obtener estadísticas de ventas", error);
        res.status(500).json({ error: error.message });
    }
};

export const anularVenta = async (req: Request, res: Response) => {
    try {
        const venta = await Ventas.findByPk(req.params.id);

        if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

        if (venta.estado === 'anulada') {
            return res.status(400).json({ error: 'La venta ya está anulada' });
        }

        // Obtener detalles de la venta
        const detalles = await DetalleVentas.findAll({
            where: { id_venta: venta.id_venta }
        });

        // Restaurar stock de productos
        for (const detalle of detalles) {
            const producto = await Productos.findByPk(detalle.id_producto);
            if (producto) {
                const nuevoStock = producto.stock + detalle.cantidad;
                await producto.update({ stock: nuevoStock });
                console.log(`📊 Stock restaurado para producto ${detalle.id_producto}: ${producto.stock} -> ${nuevoStock}`);
            }
        }

        // Marcar venta como anulada
        await venta.update({ estado: 'anulada' });

        console.log('✅ Venta anulada exitosamente:', venta.id_venta);
        res.json({ mensaje: 'Venta anulada exitosamente' });
    } catch (error: any) {
        console.error("Error al anular venta", error);
        res.status(500).json({ error: error.message });
    }
};
