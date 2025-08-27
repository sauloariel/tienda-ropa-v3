import { Request, Response } from 'express';
import { Productos } from '../models/Productos.model';
import { Categorias } from '../models/Categorias.model';
import { Clientes } from '../models/Clientes.model';
import { Pedidos } from '../models/Pedidos.model';
import { DetallePedidos } from '../models/DetallePedidos.model';
import { Op } from 'sequelize';

// Obtener estadísticas generales
export const getEstadisticasGenerales = async (req: Request, res: Response) => {
    try {
        const { periodo = '30' } = req.query;
        const dias = parseInt(periodo as string);
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - dias);

        // Obtener estadísticas del período actual
        const [
            ventasActuales,
            clientesNuevos,
            productosVendidos,
            pedidosCompletados
        ] = await Promise.all([
            // Ventas totales del período
            DetallePedidos.findAll({
                include: [{
                    model: Pedidos,
                    where: {
                        fecha_pedido: { [Op.gte]: fechaLimite },
                        estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                    },
                    attributes: []
                }],
                attributes: [
                    [DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('subtotal')), 'total']
                ]
            }),

            // Clientes nuevos del período (usar fecha_pedido como aproximación)
            Pedidos.count({
                where: {
                    fecha_pedido: { [Op.gte]: fechaLimite }
                },
                distinct: true,
                col: 'id_cliente'
            }),

            // Productos vendidos del período
            DetallePedidos.findAll({
                include: [{
                    model: Pedidos,
                    where: {
                        fecha_pedido: { [Op.gte]: fechaLimite },
                        estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                    },
                    attributes: []
                }],
                attributes: [
                    [DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('cantidad')), 'total']
                ]
            }),

            // Pedidos completados del período
            Pedidos.count({
                where: {
                    fecha_pedido: { [Op.gte]: fechaLimite },
                    estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                }
            })
        ]);

        // Obtener estadísticas del período anterior para comparación
        const fechaLimiteAnterior = new Date(fechaLimite);
        fechaLimiteAnterior.setDate(fechaLimiteAnterior.getDate() - dias);

        const [
            ventasAnteriores,
            clientesAnteriores,
            productosAnteriores,
            pedidosAnteriores
        ] = await Promise.all([
            DetallePedidos.findAll({
                include: [{
                    model: Pedidos,
                    where: {
                        fecha_pedido: {
                            [Op.and]: [
                                { [Op.gte]: fechaLimiteAnterior },
                                { [Op.lt]: fechaLimite }
                            ]
                        },
                        estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                    },
                    attributes: []
                }],
                attributes: [
                    [DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('subtotal')), 'total']
                ]
            }),

            Pedidos.count({
                where: {
                    fecha_pedido: {
                        [Op.and]: [
                            { [Op.gte]: fechaLimiteAnterior },
                            { [Op.lt]: fechaLimite }
                        ]
                    }
                },
                distinct: true,
                col: 'id_cliente'
            }),

            DetallePedidos.findAll({
                include: [{
                    model: Pedidos,
                    where: {
                        fecha_pedido: {
                            [Op.and]: [
                                { [Op.gte]: fechaLimiteAnterior },
                                { [Op.lt]: fechaLimite }
                            ]
                        },
                        estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                    },
                    attributes: []
                }],
                attributes: [
                    [DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('cantidad')), 'total']
                ]
            }),

            Pedidos.count({
                where: {
                    fecha_pedido: {
                        [Op.and]: [
                            { [Op.gte]: fechaLimiteAnterior },
                            { [Op.lt]: fechaLimite }
                        ]
                    },
                    estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                }
            })
        ]);

        // Calcular valores y cambios porcentuales
        const ventasTotales = parseFloat(ventasActuales[0]?.getDataValue('total') || '0');
        const ventasAnterior = parseFloat(ventasAnteriores[0]?.getDataValue('total') || '0');
        const cambioVentas = ventasAnterior > 0 ? ((ventasTotales - ventasAnterior) / ventasAnterior) * 100 : 0;

        const cambioClientes = clientesAnteriores > 0 ? ((clientesNuevos - clientesAnteriores) / clientesAnteriores) * 100 : 0;
        const cambioProductos = productosAnteriores[0]?.getDataValue('total') > 0 ?
            ((parseFloat(productosVendidos[0]?.getDataValue('total') || '0') - parseFloat(productosAnteriores[0]?.getDataValue('total') || '0')) / parseFloat(productosAnteriores[0]?.getDataValue('total') || '1')) * 100 : 0;
        const cambioPedidos = pedidosAnteriores > 0 ? ((pedidosCompletados - pedidosAnteriores) / pedidosAnteriores) * 100 : 0;

        res.json({
            ventasTotales,
            clientesNuevos,
            productosVendidos: parseFloat(productosVendidos[0]?.getDataValue('total') || '0'),
            pedidosCompletados,
            cambioVentas: Math.round(cambioVentas * 100) / 100,
            cambioClientes: Math.round(cambioClientes * 100) / 100,
            cambioProductos: Math.round(cambioProductos * 100) / 100,
            cambioPedidos: Math.round(cambioPedidos * 100) / 100
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas generales:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener ventas mensuales
export const getVentasMensuales = async (req: Request, res: Response) => {
    try {
        const { meses = '12' } = req.query;
        const numMeses = parseInt(meses as string);

        const ventasMensuales = await DetallePedidos.findAll({
            include: [{
                model: Pedidos,
                where: {
                    estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                },
                attributes: []
            }],
            attributes: [
                [DetallePedidos.sequelize.fn('DATE_FORMAT', DetallePedidos.sequelize.col('Pedido.fecha_pedido'), '%Y-%m'), 'mes'],
                [DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('subtotal')), 'ventas'],
                [DetallePedidos.sequelize.fn('COUNT', DetallePedidos.sequelize.col('Pedido.id_pedido')), 'pedidos']
            ],
            group: [DetallePedidos.sequelize.fn('DATE_FORMAT', DetallePedidos.sequelize.col('Pedido.fecha_pedido'), '%Y-%m')],
            order: [[DetallePedidos.sequelize.fn('DATE_FORMAT', DetallePedidos.sequelize.col('Pedido.fecha_pedido'), '%Y-%m'), 'DESC']],
            limit: numMeses
        });

        const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const resultado = ventasMensuales.map(venta => {
            const fecha = new Date(venta.getDataValue('mes') + '-01');
            return {
                mes: mesesNombres[fecha.getMonth()],
                ventas: parseFloat(venta.getDataValue('ventas') || '0'),
                pedidos: parseInt(venta.getDataValue('pedidos') || '0')
            };
        });

        res.json(resultado);
    } catch (error) {
        console.error('Error obteniendo ventas mensuales:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener productos más vendidos
export const getProductosTopVentas = async (req: Request, res: Response) => {
    try {
        const { limite = '10' } = req.query;
        const numLimite = parseInt(limite as string);

        const productosTop = await DetallePedidos.findAll({
            include: [{
                model: Productos,
                attributes: ['id_producto', 'descripcion', 'stock', 'precio_venta']
            }, {
                model: Pedidos,
                where: {
                    estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                },
                attributes: []
            }],
            attributes: [
                [DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('cantidad')), 'ventas']
            ],
            group: ['producto.id_producto'],
            order: [[DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('cantidad')), 'DESC']],
            limit: numLimite
        });

        const totalVentas = productosTop.reduce((sum, producto) =>
            sum + parseInt(producto.getDataValue('ventas') || '0'), 0
        );

        const resultado = productosTop.map(producto => {
            const ventas = parseInt(producto.getDataValue('ventas') || '0');
            return {
                id_producto: producto.producto.id_producto,
                descripcion: producto.producto.descripcion,
                ventas,
                porcentaje: totalVentas > 0 ? Math.round((ventas / totalVentas) * 100) : 0,
                stock: producto.producto.stock,
                precio_venta: Number(producto.producto.precio_venta)
            };
        });

        res.json(resultado);
    } catch (error) {
        console.error('Error obteniendo productos top:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener categorías más vendidas
export const getCategoriasTopVentas = async (req: Request, res: Response) => {
    try {
        const { limite = '5' } = req.query;
        const numLimite = parseInt(limite as string);

        const categoriasTop = await DetallePedidos.findAll({
            include: [{
                model: Productos,
                include: [{
                    model: Categorias,
                    attributes: ['id_categoria', 'nombre_categoria']
                }],
                attributes: []
            }, {
                model: Pedidos,
                where: {
                    estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                },
                attributes: []
            }],
            attributes: [
                [DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('subtotal')), 'ventas']
            ],
            group: ['producto.categoria.id_categoria'],
            order: [[DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('subtotal')), 'DESC']],
            limit: numLimite
        });

        const totalVentas = categoriasTop.reduce((sum, categoria) =>
            sum + parseFloat(categoria.getDataValue('ventas') || '0'), 0
        );

        const resultado = await Promise.all(categoriasTop.map(async (categoria) => {
            const ventas = parseFloat(categoria.getDataValue('ventas') || '0');
            const idCategoria = categoria.producto.categoria.id_categoria;

            // Contar productos en la categoría
            const numProductos = await Productos.count({
                where: { id_categoria: idCategoria }
            });

            return {
                id_categoria: idCategoria,
                nombre_categoria: categoria.producto.categoria.nombre_categoria,
                ventas,
                porcentaje: totalVentas > 0 ? Math.round((ventas / totalVentas) * 100) : 0,
                productos: numProductos
            };
        }));

        res.json(resultado);
    } catch (error) {
        console.error('Error obteniendo categorías top:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener clientes con más compras
export const getClientesTopCompras = async (req: Request, res: Response) => {
    try {
        const { limite = '10' } = req.query;
        const numLimite = parseInt(limite as string);

        const clientesTop = await Pedidos.findAll({
            include: [{
                model: Clientes,
                attributes: ['id_cliente', 'nombre', 'apellido', 'mail']
            }],
            where: {
                estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
            },
            attributes: [
                [DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('subtotal')), 'total_compras'],
                [DetallePedidos.sequelize.fn('MAX', DetallePedidos.sequelize.col('Pedido.fecha_pedido')), 'ultima_compra']
            ],
            group: ['cliente.id_cliente'],
            order: [[DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('subtotal')), 'DESC']],
            limit: numLimite
        });

        const resultado = clientesTop.map(cliente => ({
            id_cliente: cliente.cliente.id_cliente,
            nombre: `${cliente.cliente.nombre} ${cliente.cliente.apellido}`,
            email: cliente.cliente.mail,
            total_compras: parseFloat(cliente.getDataValue('total_compras') || '0'),
            ultima_compra: cliente.getDataValue('ultima_compra')
        }));

        res.json(resultado);
    } catch (error) {
        console.error('Error obteniendo clientes top:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener actividad reciente
export const getActividadReciente = async (req: Request, res: Response) => {
    try {
        const { limite = '20' } = req.query;
        const numLimite = parseInt(limite as string);

        // Combinar diferentes tipos de actividad
        const actividades = [];

        // Pedidos recientes
        const pedidosRecientes = await Pedidos.findAll({
            include: [{
                model: Clientes,
                attributes: ['nombre', 'apellido']
            }],
            order: [['fecha_pedido', 'DESC']],
            limit: Math.ceil(numLimite / 2)
        });

        pedidosRecientes.forEach(pedido => {
            actividades.push({
                id: pedido.id_pedido,
                accion: `Nuevo pedido #${pedido.id_pedido}`,
                tiempo: calcularTiempoRelativo(pedido.fecha_pedido),
                tipo: 'order' as const,
                detalles: `Cliente: ${pedido.cliente.nombre} ${pedido.cliente.apellido}`,
                monto: parseFloat(pedido.importe.toString() || '0')
            });
        });

        // Clientes nuevos (usar primera compra como aproximación)
        const clientesNuevos = await Pedidos.findAll({
            include: [{
                model: Clientes,
                attributes: ['nombre', 'apellido']
            }],
            attributes: [
                [DetallePedidos.sequelize.fn('MIN', DetallePedidos.sequelize.col('Pedido.fecha_pedido')), 'primera_compra']
            ],
            group: ['cliente.id_cliente'],
            order: [[DetallePedidos.sequelize.fn('MIN', DetallePedidos.sequelize.col('Pedido.fecha_pedido')), 'DESC']],
            limit: Math.ceil(numLimite / 4)
        });

        clientesNuevos.forEach(cliente => {
            actividades.push({
                id: cliente.id_pedido + 10000, // ID único para evitar conflictos
                accion: 'Cliente registrado',
                tiempo: calcularTiempoRelativo(cliente.fecha_pedido),
                tipo: 'customer' as const,
                detalles: `${cliente.cliente.nombre} ${cliente.cliente.apellido}`
            });
        });

        // Ordenar por tiempo y limitar
        actividades.sort((a, b) => new Date(b.tiempo).getTime() - new Date(a.tiempo).getTime());

        res.json(actividades.slice(0, numLimite));
    } catch (error) {
        console.error('Error obteniendo actividad reciente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener resumen financiero
export const getResumenFinanciero = async (req: Request, res: Response) => {
    try {
        const { periodo = '30' } = req.query;
        const dias = parseInt(periodo as string);
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - dias);

        // Obtener ingresos del período
        const ingresos = await DetallePedidos.findAll({
            include: [{
                model: Pedidos,
                where: {
                    fecha_pedido: { [Op.gte]: fechaLimite },
                    estado: { [Op.in]: ['COMPLETADO', 'ENTREGADO'] }
                },
                attributes: []
            }],
            attributes: [
                [DetallePedidos.sequelize.fn('SUM', DetallePedidos.sequelize.col('subtotal')), 'total']
            ]
        });

        // Obtener productos con stock bajo
        const productosBajoStock = await Productos.count({
            where: {
                stock: { [Op.lte]: 10 }
            }
        });

        const productosAgotados = await Productos.count({
            where: {
                stock: { [Op.eq]: 0 }
            }
        });

        // Calcular gastos (estimado como 60% de ingresos para este ejemplo)
        const ingresosTotales = parseFloat(ingresos[0]?.getDataValue('total') || '0');
        const gastos = ingresosTotales * 0.6;
        const ganancia = ingresosTotales - gastos;
        const margen = ingresosTotales > 0 ? (ganancia / ingresosTotales) * 100 : 0;

        res.json({
            ingresos: ingresosTotales,
            gastos,
            ganancia,
            margen: Math.round(margen * 100) / 100,
            productos_bajo_stock: productosBajoStock,
            productos_agotados: productosAgotados
        });
    } catch (error) {
        console.error('Error obteniendo resumen financiero:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener estadísticas de inventario
export const getEstadisticasInventario = async (req: Request, res: Response) => {
    try {
        const [
            totalProductos,
            productosBajoStock,
            productosAgotados,
            valorInventario
        ] = await Promise.all([
            Productos.count(),
            Productos.count({ where: { stock: { [Op.lte]: 10 } } }),
            Productos.count({ where: { stock: { [Op.eq]: 0 } } }),
            Productos.findAll({
                attributes: [
                    [Productos.sequelize.fn('SUM', Productos.sequelize.literal('stock * precio_venta')), 'valor_total']
                ]
            })
        ]);

        const valorTotal = parseFloat(valorInventario[0]?.getDataValue('valor_total') || '0');
        const rotacionPromedio = totalProductos > 0 ? (totalProductos / (productosBajoStock + productosAgotados)) : 0;

        res.json({
            total_productos: totalProductos,
            productos_bajo_stock: productosBajoStock,
            productos_agotados: productosAgotados,
            valor_inventario: valorTotal,
            rotacion_promedio: Math.round(rotacionPromedio * 100) / 100
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas de inventario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Función auxiliar para calcular tiempo relativo
function calcularTiempoRelativo(fecha: Date | string): string {
    const ahora = new Date();
    const fechaEvento = new Date(fecha);
    const diferencia = ahora.getTime() - fechaEvento.getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
        return `Hace ${minutos} minutos`;
    } else if (horas < 24) {
        return `Hace ${horas} horas`;
    } else {
        return `Hace ${dias} días`;
    }
}
