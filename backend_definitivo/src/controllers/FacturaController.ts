import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Factura from '../models/Factura.model';
import DetalleFactura from '../models/DetalleFactura.model';
import Productos from '../models/Productos.model';
import Clientes from '../models/Clientes.model';
import db from '../config/db';

// Validaciones para crear factura
export const validateCreateFactura = [
    body('productos').isArray().withMessage('Los productos deben ser un array'),
    body('productos.*.id_producto').isInt().withMessage('ID de producto debe ser un número entero'),
    body('productos.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
    body('productos.*.precio_unitario').isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),
    body('total').isFloat({ min: 0 }).withMessage('El total debe ser mayor o igual a 0'),
    body('metodo_pago').isString().notEmpty().withMessage('El método de pago es requerido'),
    body('cliente_id').optional().isInt().withMessage('El ID del cliente debe ser un número entero')
];

// Generar número de factura único
const generarNumeroFactura = async (): Promise<string> => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    
    // Obtener el último número de factura del mes
    const ultimaFactura = await Factura.findOne({
        where: {
            numeroFactura: {
                [db.Sequelize.Op.like]: `F${año}${mes}%`
            }
        },
        order: [['numeroFactura', 'DESC']]
    });

    let consecutivo = 1;
    if (ultimaFactura) {
        const ultimoConsecutivo = parseInt(ultimaFactura.numeroFactura.slice(-4));
        consecutivo = ultimoConsecutivo + 1;
    }

    return `F${año}${mes}${String(consecutivo).padStart(4, '0')}`;
};

// Crear nueva factura
export const createFactura = async (req: Request, res: Response) => {
    try {
        // Validar datos de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Datos de entrada inválidos', 
                details: errors.array() 
            });
        }

        const { productos, total, metodo_pago, cliente_id } = req.body;

        console.log('🔄 Creando factura con datos:', {
            productosCount: productos?.length,
            total,
            metodo_pago,
            cliente_id
        });

        // Verificar stock disponible para todos los productos
        for (const producto of productos) {
            const productoDB = await Productos.findByPk(producto.id_producto);
            if (!productoDB) {
                return res.status(404).json({ 
                    error: `Producto con ID ${producto.id_producto} no encontrado` 
                });
            }

            if (productoDB.stock < producto.cantidad) {
                return res.status(400).json({ 
                    error: `Stock insuficiente para ${productoDB.nombre}. Disponible: ${productoDB.stock}, Solicitado: ${producto.cantidad}` 
                });
            }
        }

        // Generar número de factura único
        const numeroFactura = await generarNumeroFactura();

        // Crear la factura principal
        const factura = await Factura.create({
            numeroFactura,
            fecha: new Date(),
            total: parseFloat(total),
            cliente_id: cliente_id || null,
            estado: 'activa',
            metodo_pago
        });

        console.log('✅ Factura creada con ID:', factura.id);

        // Crear detalles de factura y actualizar stock
        if (productos && Array.isArray(productos)) {
            console.log(`🔄 Creando ${productos.length} detalles de factura...`);

            for (const producto of productos) {
                console.log('📦 Creando detalle:', producto);

                await DetalleFactura.create({
                    factura_id: factura.id,
                    producto_id: producto.id_producto,
                    cantidad: parseInt(producto.cantidad),
                    precio_unitario: parseFloat(producto.precio_unitario),
                    subtotal: parseFloat(producto.subtotal)
                });

                // Actualizar stock del producto
                const productoDB = await Productos.findByPk(producto.id_producto);
                if (productoDB) {
                    const nuevoStock = productoDB.stock - parseInt(producto.cantidad);
                    await productoDB.update({ stock: Math.max(0, nuevoStock) });
                    console.log(`📊 Stock actualizado para producto ${producto.id_producto}: ${productoDB.stock} -> ${nuevoStock}`);
                }
            }
        }

        // Obtener la factura completa con detalles y productos
        const facturaCompleta = await Factura.findByPk(factura.id, {
            include: [
                {
                    model: DetalleFactura,
                    as: 'detalles',
                    include: [
                        {
                            model: Productos,
                            as: 'producto'
                        }
                    ]
                },
                {
                    model: Clientes,
                    as: 'cliente'
                }
            ]
        });

        console.log('✅ Factura completada exitosamente:', {
            id: facturaCompleta?.id,
            numeroFactura: facturaCompleta?.numeroFactura,
            total: facturaCompleta?.total,
            detalles: (facturaCompleta as any)?.detalles?.length || 0
        });

        res.status(201).json({
            success: true,
            message: 'Factura creada exitosamente',
            factura: facturaCompleta
        });

    } catch (error: any) {
        console.error("❌ Error al crear factura", error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: error.message 
        });
    }
};

// Obtener todas las facturas
export const getFacturas = async (req: Request, res: Response) => {
    try {
        const { fecha_inicio, fecha_fin, estado } = req.query;

        let whereClause: any = {};

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha = {
                [db.Sequelize.Op.between]: [new Date(fecha_inicio as string), new Date(fecha_fin as string)]
            };
        }

        if (estado) {
            whereClause.estado = estado;
        }

        const facturas = await Factura.findAll({
            where: whereClause,
            include: [
                {
                    model: DetalleFactura,
                    as: 'detalles',
                    include: [
                        {
                            model: Productos,
                            as: 'producto'
                        }
                    ]
                },
                {
                    model: Clientes,
                    as: 'cliente'
                }
            ],
            order: [['fecha', 'DESC']]
        });

        res.json({
            success: true,
            facturas
        });

    } catch (error: any) {
        console.error("Error al obtener facturas", error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: error.message 
        });
    }
};

// Obtener factura por ID
export const getFacturaById = async (req: Request, res: Response) => {
    try {
        const factura = await Factura.findByPk(req.params.id, {
            include: [
                {
                    model: DetalleFactura,
                    as: 'detalles',
                    include: [
                        {
                            model: Productos,
                            as: 'producto'
                        }
                    ]
                },
                {
                    model: Clientes,
                    as: 'cliente'
                }
            ]
        });

        if (!factura) {
            return res.status(404).json({ 
                error: 'Factura no encontrada' 
            });
        }

        res.json({
            success: true,
            factura
        });

    } catch (error: any) {
        console.error("Error al obtener factura", error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: error.message 
        });
    }
};

// Anular factura
export const anularFactura = async (req: Request, res: Response) => {
    try {
        const factura = await Factura.findByPk(req.params.id);

        if (!factura) {
            return res.status(404).json({ 
                error: 'Factura no encontrada' 
            });
        }

        if (factura.estado === 'anulada') {
            return res.status(400).json({ 
                error: 'La factura ya está anulada' 
            });
        }

        // Obtener detalles de la factura
        const detalles = await DetalleFactura.findAll({
            where: { factura_id: factura.id }
        });

        // Restaurar stock de productos
        for (const detalle of detalles) {
            const producto = await Productos.findByPk(detalle.producto_id);
            if (producto) {
                const nuevoStock = producto.stock + detalle.cantidad;
                await producto.update({ stock: nuevoStock });
                console.log(`📊 Stock restaurado para producto ${detalle.producto_id}: ${producto.stock} -> ${nuevoStock}`);
            }
        }

        // Marcar factura como anulada
        await factura.update({ estado: 'anulada' });

        console.log('✅ Factura anulada exitosamente:', factura.id);
        res.json({ 
            success: true,
            message: 'Factura anulada exitosamente' 
        });

    } catch (error: any) {
        console.error("Error al anular factura", error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: error.message 
        });
    }
};

// Obtener estadísticas de facturas
export const getEstadisticasFacturas = async (req: Request, res: Response) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let whereClause: any = { estado: 'activa' };

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha = {
                [db.Sequelize.Op.between]: [new Date(fecha_inicio as string), new Date(fecha_fin as string)]
            };
        }

        // Total de facturas
        const totalFacturas = await Factura.count({ where: whereClause });

        // Total de ingresos
        const totalIngresos = await Factura.sum('total', { where: whereClause });

        // Promedio por factura
        const promedioFactura = totalFacturas > 0 ? totalIngresos / totalFacturas : 0;

        // Métodos de pago más utilizados
        const metodosPago = await Factura.findAll({
            attributes: [
                'metodo_pago',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'cantidad'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('total')), 'total']
            ],
            where: whereClause,
            group: ['metodo_pago'],
            order: [[db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'DESC']]
        });

        // Productos más facturados
        const productosMasFacturados = await DetalleFactura.findAll({
            attributes: [
                'producto_id',
                [db.Sequelize.fn('SUM', db.Sequelize.col('cantidad')), 'cantidad_facturada'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('subtotal')), 'total_facturado']
            ],
            include: [
                {
                    model: Factura,
                    as: 'factura',
                    where: whereClause,
                    attributes: []
                }
            ],
            group: ['producto_id'],
            order: [[db.Sequelize.fn('SUM', db.Sequelize.col('cantidad')), 'DESC']],
            limit: 10
        });

        const estadisticas = {
            total_facturas: totalFacturas,
            total_ingresos: totalIngresos || 0,
            promedio_factura: promedioFactura || 0,
            metodos_pago: metodosPago,
            productos_mas_facturados: productosMasFacturados
        };

        res.json({
            success: true,
            estadisticas
        });

    } catch (error: any) {
        console.error("Error al obtener estadísticas de facturas", error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: error.message 
        });
    }
};
