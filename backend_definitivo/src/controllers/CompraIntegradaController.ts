import { Request, Response } from 'express';
import { Ventas } from '../models/Ventas.model';
import { DetalleVentas } from '../models/DetalleVentas.model';
import Factura from '../models/Factura.model';
import DetalleFactura from '../models/DetalleFactura.model';
import { Pedidos } from '../models/Pedidos.model';
import { DetallePedidos } from '../models/DetallePedidos.model';
import { Productos } from '../models/Productos.model';
import { Clientes } from '../models/Clientes.model';
import { Op, Transaction } from 'sequelize';
import sequelize from '../config/db';

// Interfaz para compra integrada desde la tienda web
interface CompraIntegradaRequest {
    cliente_id: number;
    cliente_nombre: string;
    cliente_telefono: string;
    cliente_email?: string;
    direccion_entrega?: string;
    horario_recepcion?: string;
    descripcion_pedido?: string;
    observaciones?: string;
    metodo_pago: string;
    items: {
        id_producto: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
        color?: string;
        talla?: string;
    }[];
}

// Generar número de factura único
const generarNumeroFactura = async (): Promise<string> => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');

    const ultimaFactura = await Factura.findOne({
        where: {
            numeroFactura: {
                [Op.like]: `F${año}${mes}%`
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

// Procesar compra completa desde la tienda web
export const procesarCompraIntegrada = async (req: Request, res: Response) => {
    try {
        console.log('🛒 CompraIntegradaController.procesarCompraIntegrada - Iniciando compra integrada');

        const compraData: CompraIntegradaRequest = req.body;

        // Validar datos requeridos
        if (!compraData.cliente_id || !compraData.items || !compraData.metodo_pago) {
            return res.status(400).json({
                error: 'Datos requeridos: cliente_id, items, metodo_pago'
            });
        }

        // Verificar que el cliente existe
        const cliente = await Clientes.findByPk(compraData.cliente_id);
        if (!cliente) {
            return res.status(404).json({
                error: 'Cliente no encontrado'
            });
        }

        // Verificar que los productos existen y tienen stock
        const productosIds = compraData.items.map(item => item.id_producto);
        const productos = await Productos.findAll({
            where: { id_producto: { [Op.in]: productosIds } }
        });

        if (productos.length !== productosIds.length) {
            return res.status(400).json({
                error: 'Uno o más productos no existen'
            });
        }

        // Verificar stock disponible
        for (const item of compraData.items) {
            const producto = productos.find(p => p.id_producto === item.id_producto);
            if (producto && producto.stock < item.cantidad) {
                return res.status(400).json({
                    error: `Stock insuficiente para el producto ${producto.descripcion}. Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`
                });
            }
        }

        // Calcular total
        const total = compraData.items.reduce((sum, item) => sum + item.subtotal, 0);

        // Generar número de factura
        const numeroFactura = await generarNumeroFactura();

        // Generar payment_id único
        const payment_id = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Declarar variables fuera del try para que estén disponibles después
        let venta: any;
        let factura: any;
        let pedido: any;

        // Usar transacción para asegurar consistencia
        const transaction = await sequelize.transaction();

        try {
            console.log('🔄 Creando venta...');

            // 1. CREAR VENTA
            venta = await Ventas.create({
                fecha_venta: new Date(),
                total: total,
                metodo_pago: compraData.metodo_pago,
                cliente_id: compraData.cliente_id,
                empleado_id: 1, // Empleado por defecto para ventas web
                estado: 'completada'
            }, { transaction });

            console.log('✅ Venta creada con ID:', venta.id_venta);

            // 2. CREAR DETALLES DE VENTA
            console.log('🔄 Creando detalles de venta...');
            for (const item of compraData.items) {
                await DetalleVentas.create({
                    id_venta: venta.id_venta,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.subtotal
                }, { transaction });

                // Actualizar stock del producto
                const producto = productos.find(p => p.id_producto === item.id_producto);
                if (producto) {
                    const nuevoStock = producto.stock - item.cantidad;
                    await producto.update({ stock: Math.max(0, nuevoStock) }, { transaction });
                    console.log(`📊 Stock actualizado para producto ${item.id_producto}: ${producto.stock} -> ${nuevoStock}`);
                }
            }

            console.log('✅ Detalles de venta creados');

            // 3. CREAR FACTURA
            console.log('🔄 Creando factura...');
            factura = await Factura.create({
                numeroFactura,
                fecha: new Date(),
                total: total,
                cliente_id: compraData.cliente_id,
                estado: 'activa',
                metodo_pago: compraData.metodo_pago
            }, { transaction });

            console.log('✅ Factura creada con ID:', factura.id);

            // 4. CREAR DETALLES DE FACTURA
            console.log('🔄 Creando detalles de factura...');
            for (const item of compraData.items) {
                await DetalleFactura.create({
                    factura_id: factura.id,
                    producto_id: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.subtotal
                }, { transaction });
            }

            console.log('✅ Detalles de factura creados');

            // 5. CREAR PEDIDO PARA EL VENDEDOR
            console.log('🔄 Creando pedido para vendedor...');
            pedido = await Pedidos.create({
                id_cliente: compraData.cliente_id,
                id_empleados: 1, // Empleado por defecto
                fecha_pedido: new Date(),
                importe: total,
                estado: 'pendiente', // El vendedor debe preparar el pedido
                anulacion: false,
                venta_web: true,
                payment_id: payment_id,
                direccion_entrega: compraData.direccion_entrega,
                horario_recepcion: compraData.horario_recepcion,
                descripcion_pedido: compraData.descripcion_pedido
            }, { transaction });

            console.log('✅ Pedido creado con ID:', pedido.id_pedido);

            // 6. CREAR DETALLES DEL PEDIDO
            console.log('🔄 Creando detalles del pedido...');
            for (const item of compraData.items) {
                await DetallePedidos.create({
                    id_pedido: pedido.id_pedido,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_venta: item.precio_unitario,
                    descuento: 0
                }, { transaction });
            }

            console.log('✅ Detalles del pedido creados');

            // Confirmar transacción
            await transaction.commit();
            console.log('✅ Transacción confirmada');

        } catch (error) {
            // Revertir transacción en caso de error
            await transaction.rollback();
            console.error('❌ Error en transacción, revirtiendo cambios:', error);
            throw error;
        }

        // Obtener datos completos para la respuesta
        const ventaCompleta = await Ventas.findByPk(venta.id_venta, {
            include: [
                {
                    model: DetalleVentas,
                    as: 'detalles',
                    include: [
                        {
                            model: Productos,
                            as: 'producto',
                            attributes: ['id_producto', 'descripcion', 'precio_venta']
                        }
                    ]
                },
                {
                    model: Clientes,
                    as: 'cliente',
                    attributes: ['id_cliente', 'nombre', 'apellido', 'mail', 'telefono']
                }
            ]
        });

        const facturaCompleta = await Factura.findByPk(factura.id, {
            include: [
                {
                    model: DetalleFactura,
                    as: 'detalles',
                    include: [
                        {
                            model: Productos,
                            as: 'producto',
                            attributes: ['id_producto', 'descripcion', 'precio_venta']
                        }
                    ]
                },
                {
                    model: Clientes,
                    as: 'cliente',
                    attributes: ['id_cliente', 'nombre', 'apellido', 'mail', 'telefono']
                }
            ]
        });

        const pedidoCompleto = await Pedidos.findByPk(pedido.id_pedido, {
            include: [
                {
                    model: DetallePedidos,
                    as: 'detalle',
                    include: [
                        {
                            model: Productos,
                            as: 'producto',
                            attributes: ['id_producto', 'descripcion', 'precio_venta', 'precio_venta']
                        }
                    ]
                },
                {
                    model: Clientes,
                    as: 'cliente',
                    attributes: ['id_cliente', 'nombre', 'apellido', 'mail', 'telefono', 'domicilio', 'dni']
                }
            ]
        });

        console.log('✅ Compra integrada completada exitosamente');

        res.status(201).json({
            success: true,
            message: 'Compra procesada exitosamente',
            data: {
                venta: ventaCompleta?.toJSON(),
                factura: facturaCompleta?.toJSON(),
                pedido: pedidoCompleto?.toJSON(),
                resumen: {
                    total: total,
                    numero_factura: numeroFactura,
                    id_venta: venta.id_venta,
                    id_pedido: pedido.id_pedido,
                    payment_id: payment_id
                }
            }
        });

    } catch (error: any) {
        console.error('❌ Error al procesar compra integrada:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

// Obtener resumen de compras del cliente
export const getComprasCliente = async (req: Request, res: Response) => {
    try {
        const { cliente_id } = req.params;

        const ventas = await Ventas.findAll({
            where: { cliente_id: parseInt(cliente_id) },
            include: [
                {
                    model: DetalleVentas,
                    as: 'detalles',
                    include: [
                        {
                            model: Productos,
                            as: 'producto',
                            attributes: ['id_producto', 'descripcion', 'precio_venta', 'precio_venta']
                        }
                    ]
                }
            ],
            order: [['fecha_venta', 'DESC']]
        });

        const facturas = await Factura.findAll({
            where: { cliente_id: parseInt(cliente_id) },
            include: [
                {
                    model: DetalleFactura,
                    as: 'detalles',
                    include: [
                        {
                            model: Productos,
                            as: 'producto',
                            attributes: ['id_producto', 'descripcion', 'precio_venta', 'precio_venta']
                        }
                    ]
                }
            ],
            order: [['fecha', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                ventas: ventas.map(v => v.toJSON()),
                facturas: facturas.map(f => f.toJSON())
            }
        });

    } catch (error: any) {
        console.error('❌ Error al obtener compras del cliente:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

export default {
    procesarCompraIntegrada,
    getComprasCliente
};
