import { Request, Response } from "express";
import { Pedidos } from "../models/Pedidos.model";
import { DetallePedidos } from "../models/DetallePedidos.model";
import { Clientes } from "../models/Clientes.model";
import { Productos } from "../models/Productos.model";
import { Op } from "sequelize";

// Interfaz para crear pedido
interface PedidoCreate {
    id_cliente: number;
    id_empleados?: number;
    fecha_pedido?: string;
    importe: number;
    estado?: string;
    payment_id?: string;
    venta_web?: boolean;
    productos: {
        id_producto: number;
        cantidad: number;
        precio_venta: number;
        descuento?: number;
    }[];
}

// Crear pedido (unificado para web y panel administrativo)
export const createPedido = async (req: Request, res: Response) => {
    try {
        console.log('📦 PedidosUnificadoController.createPedido - Recibiendo pedido:', req.body);

        const pedidoData: PedidoCreate = req.body;

        // Validar datos requeridos
        if (!pedidoData.id_cliente || !pedidoData.productos || !pedidoData.importe) {
            return res.status(400).json({
                error: 'Datos requeridos: id_cliente, productos, importe'
            });
        }

        // Verificar que el cliente existe
        const cliente = await Clientes.findByPk(pedidoData.id_cliente);
        if (!cliente) {
            return res.status(404).json({
                error: 'Cliente no encontrado'
            });
        }

        // Verificar que los productos existen
        const productosIds = pedidoData.productos.map(p => p.id_producto);
        const productos = await Productos.findAll({
            where: { id_producto: { [Op.in]: productosIds } }
        });

        if (productos.length !== productosIds.length) {
            return res.status(400).json({
                error: 'Uno o más productos no existen'
            });
        }

        // Verificar stock disponible (solo para pedidos web)
        if (pedidoData.venta_web) {
            for (const productoPedido of pedidoData.productos) {
                const producto = productos.find(p => p.id_producto === productoPedido.id_producto);
                if (producto && producto.stock < productoPedido.cantidad) {
                    return res.status(400).json({
                        error: `Stock insuficiente para el producto ${producto.descripcion}. Disponible: ${producto.stock}, Solicitado: ${productoPedido.cantidad}`
                    });
                }
            }
        }

        // Crear el pedido
        const pedido = await Pedidos.create({
            id_cliente: pedidoData.id_cliente,
            id_empleados: pedidoData.id_empleados || 1, // Empleado por defecto
            fecha_pedido: pedidoData.fecha_pedido ? new Date(pedidoData.fecha_pedido) : new Date(),
            importe: pedidoData.importe,
            estado: pedidoData.estado || 'pendiente',
            anulacion: false,
            venta_web: pedidoData.venta_web || false,
            payment_id: pedidoData.payment_id || null
        });

        console.log('✅ Pedido creado con ID:', pedido.id_pedido);

        // Crear detalles del pedido
        for (const productoPedido of pedidoData.productos) {
            await DetallePedidos.create({
                id_pedido: pedido.id_pedido,
                id_producto: productoPedido.id_producto,
                cantidad: productoPedido.cantidad,
                precio_venta: productoPedido.precio_venta,
                descuento: productoPedido.descuento || 0
            });

            // Actualizar stock del producto (solo para pedidos web)
            if (pedidoData.venta_web) {
                const producto = productos.find(p => p.id_producto === productoPedido.id_producto);
                if (producto) {
                    const nuevoStock = producto.stock - productoPedido.cantidad;
                    await producto.update({ stock: Math.max(0, nuevoStock) });
                    console.log(`📊 Stock actualizado para producto ${productoPedido.id_producto}: ${producto.stock} -> ${nuevoStock}`);
                }
            }
        }

        console.log('✅ Detalles del pedido creados');

        // Obtener el pedido completo con relaciones
        const pedidoCompleto = await Pedidos.findByPk(pedido.id_pedido, {
            include: [
                {
                    model: DetallePedidos,
                    as: 'detalle',
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
                    attributes: ['id_cliente', 'nombre', 'apellido', 'mail', 'telefono', 'domicilio', 'dni']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            pedido: pedidoCompleto?.toJSON()
        });

    } catch (error: any) {
        console.error('❌ Error al crear pedido:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// Obtener todos los pedidos con filtros opcionales
export const getPedidos = async (req: Request, res: Response) => {
    try {
        console.log('🔍 PedidosUnificadoController.getPedidos - Iniciando consulta...');

        const { venta_web, estado, cliente_id } = req.query;

        // Construir filtros
        let whereClause: any = {};

        if (venta_web !== undefined) {
            whereClause.venta_web = venta_web === 'true';
        }

        if (estado) {
            whereClause.estado = estado;
        }

        if (cliente_id) {
            whereClause.id_cliente = parseInt(cliente_id as string);
        }

        const pedidos = await Pedidos.findAll({
            where: whereClause,
            include: [
                {
                    model: DetallePedidos,
                    as: 'detalle',
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
                    attributes: ['id_cliente', 'nombre', 'apellido', 'mail', 'telefono', 'domicilio', 'dni']
                }
            ],
            order: [['fecha_pedido', 'DESC']]
        });

        console.log('✅ PedidosUnificadoController.getPedidos - Pedidos obtenidos:', pedidos.length);

        // Convertir a JSON plano para evitar problemas de serialización
        const pedidosJson = pedidos.map(pedido => pedido.toJSON());

        res.status(200).json(pedidosJson);
    } catch (error: any) {
        console.error('❌ PedidosUnificadoController.getPedidos - Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener pedido por ID con detalles
export const getPedidoById = async (req: Request, res: Response) => {
    try {
        const pedido = await Pedidos.findByPk(req.params.id, {
            include: [
                {
                    model: DetallePedidos,
                    as: 'detalle',
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
                    attributes: ['id_cliente', 'nombre', 'apellido', 'mail', 'telefono', 'domicilio', 'dni']
                }
            ]
        });

        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({ error: "Pedido no encontrado" });
        }
    } catch (error: any) {
        console.error('❌ Error al obtener pedido:', error);
        res.status(500).json({ error: error.message });
    }
};

// Cambiar estado del pedido
export const cambiarEstadoPedido = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que el estado sea válido
        const estadosValidos = ['pendiente', 'procesando', 'completado', 'entregado', 'cancelado', 'anulado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                error: "Estado inválido. Estados permitidos: pendiente, procesando, completado, entregado, cancelado, anulado"
            });
        }

        const pedido = await Pedidos.findByPk(id);
        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        // Actualizar el estado
        pedido.estado = estado;
        await pedido.save();

        console.log(`✅ Estado del pedido ${id} cambiado a: ${estado}`);

        res.status(200).json({
            message: `Estado del pedido #${id} cambiado a: ${estado}`,
            pedido: {
                id_pedido: pedido.id_pedido,
                estado: pedido.estado,
                fecha_pedido: pedido.fecha_pedido
            }
        });
    } catch (error: any) {
        console.error("Error al cambiar estado del pedido:", error);
        res.status(500).json({ error: error.message });
    }
};

// Anular pedido
export const anularPedido = async (req: Request, res: Response) => {
    try {
        const pedido = await Pedidos.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        if (pedido.estado === 'anulado') {
            return res.status(400).json({ error: "El pedido ya está anulado" });
        }

        // Si es un pedido web, restaurar stock
        if (pedido.venta_web) {
            const detalles = await DetallePedidos.findAll({
                where: { id_pedido: pedido.id_pedido }
            });

            for (const detalle of detalles) {
                const producto = await Productos.findByPk(detalle.id_producto);
                if (producto) {
                    const nuevoStock = producto.stock + detalle.cantidad;
                    await producto.update({ stock: nuevoStock });
                    console.log(`📊 Stock restaurado para producto ${detalle.id_producto}: ${producto.stock} -> ${nuevoStock}`);
                }
            }
        }

        pedido.estado = 'anulado';
        pedido.anulacion = true;
        await pedido.save();

        console.log(`✅ Pedido ${pedido.id_pedido} anulado correctamente`);

        res.status(200).json({
            message: "Pedido anulado correctamente",
            pedido: {
                id_pedido: pedido.id_pedido,
                estado: pedido.estado,
                anulacion: pedido.anulacion
            }
        });
    } catch (error: any) {
        console.error("Error al anular pedido:", error);
        res.status(500).json({ error: error.message });
    }
};

// Sincronizar múltiples pedidos (para migración o importación)
export const syncPedidos = async (req: Request, res: Response) => {
    try {
        console.log('🔄 PedidosUnificadoController.syncPedidos - Sincronizando pedidos');

        const { pedidos } = req.body;

        if (!Array.isArray(pedidos)) {
            return res.status(400).json({
                error: 'Se esperaba un array de pedidos'
            });
        }

        const resultados = {
            exitosos: 0,
            fallidos: 0,
            errores: [] as string[]
        };

        for (const pedidoData of pedidos) {
            try {
                // Verificar si el pedido ya existe (por payment_id si existe)
                if (pedidoData.payment_id) {
                    const pedidoExistente = await Pedidos.findOne({
                        where: { payment_id: pedidoData.payment_id }
                    });

                    if (pedidoExistente) {
                        console.log(`⚠️ Pedido con payment_id ${pedidoData.payment_id} ya existe, omitiendo...`);
                        continue;
                    }
                }

                // Crear el pedido usando la función createPedido
                const pedido = await Pedidos.create({
                    id_cliente: pedidoData.id_cliente,
                    id_empleados: pedidoData.id_empleados || 1,
                    fecha_pedido: new Date(pedidoData.fecha_pedido || new Date()),
                    importe: pedidoData.importe,
                    estado: pedidoData.estado || 'pendiente',
                    anulacion: false,
                    venta_web: pedidoData.venta_web || false,
                    payment_id: pedidoData.payment_id || null
                });

                // Crear detalles
                for (const productoPedido of pedidoData.productos) {
                    await DetallePedidos.create({
                        id_pedido: pedido.id_pedido,
                        id_producto: productoPedido.id_producto,
                        cantidad: productoPedido.cantidad,
                        precio_venta: productoPedido.precio_venta,
                        descuento: productoPedido.descuento || 0
                    });
                }

                resultados.exitosos++;
                console.log(`✅ Pedido ${pedido.id_pedido} sincronizado exitosamente`);

            } catch (error: any) {
                resultados.fallidos++;
                resultados.errores.push(`Error en pedido ${pedidoData.payment_id || 'sin payment_id'}: ${error.message}`);
                console.error(`❌ Error al sincronizar pedido:`, error);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Sincronización completada',
            resultados
        });

    } catch (error: any) {
        console.error('❌ Error en sincronización de pedidos:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// Obtener estadísticas de pedidos
export const getEstadisticasPedidos = async (req: Request, res: Response) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let whereClause: any = {};

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_pedido = {
                [Op.between]: [new Date(fecha_inicio as string), new Date(fecha_fin as string)]
            };
        }

        // Total de pedidos
        const totalPedidos = await Pedidos.count({ where: whereClause });

        // Pedidos por estado
        const pedidosPorEstado = await Pedidos.findAll({
            attributes: [
                'estado',
                [Pedidos.sequelize.fn('COUNT', Pedidos.sequelize.col('id_pedido')), 'cantidad']
            ],
            where: whereClause,
            group: ['estado'],
            order: [[Pedidos.sequelize.fn('COUNT', Pedidos.sequelize.col('id_pedido')), 'DESC']]
        });

        // Pedidos web vs presenciales
        const pedidosPorTipo = await Pedidos.findAll({
            attributes: [
                'venta_web',
                [Pedidos.sequelize.fn('COUNT', Pedidos.sequelize.col('id_pedido')), 'cantidad']
            ],
            where: whereClause,
            group: ['venta_web'],
            order: [[Pedidos.sequelize.fn('COUNT', Pedidos.sequelize.col('id_pedido')), 'DESC']]
        });

        // Total de ingresos
        const totalIngresos = await Pedidos.sum('importe', { where: whereClause });

        res.json({
            success: true,
            estadisticas: {
                total_pedidos: totalPedidos,
                total_ingresos: totalIngresos || 0,
                pedidos_por_estado: pedidosPorEstado,
                pedidos_por_tipo: pedidosPorTipo
            }
        });

    } catch (error: any) {
        console.error('❌ Error al obtener estadísticas de pedidos:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// Buscar pedido por número de pedido (para seguimiento)
export const getPedidoByNumber = async (req: Request, res: Response) => {
    try {
        const { numeroPedido } = req.params;

        console.log('🔍 Buscando pedido por número:', numeroPedido);

        // Buscar pedido por payment_id (que es el número de pedido)
        const pedido = await Pedidos.findOne({
            where: { payment_id: numeroPedido },
            include: [
                {
                    model: DetallePedidos,
                    as: 'detalle',
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
                    attributes: ['id_cliente', 'nombre', 'apellido', 'mail', 'telefono', 'domicilio', 'dni']
                }
            ]
        });

        if (!pedido) {
            return res.status(404).json({
                error: 'Pedido no encontrado',
                message: `No se encontró un pedido con el número ${numeroPedido}`
            });
        }

        // Obtener historial de estados (simulado por ahora)
        const historial = [
            {
                estado: 'pendiente',
                fecha: pedido.fecha_pedido,
                descripcion: 'Pedido confirmado'
            }
        ];

        // Si el estado no es pendiente, agregar el estado actual
        if (pedido.estado !== 'pendiente') {
            historial.push({
                estado: pedido.estado,
                fecha: new Date(),
                descripcion: getEstadoDescription(pedido.estado)
            });
        }

        res.status(200).json({
            success: true,
            pedido: {
                id_pedido: pedido.id_pedido,
                numero_pedido: pedido.payment_id,
                estado: pedido.estado,
                fecha_pedido: pedido.fecha_pedido,
                importe: pedido.importe,
                direccion_entrega: pedido.direccion_entrega,
                horario_recepcion: pedido.horario_recepcion,
                cliente: pedido.cliente,
                items: pedido.detalle,
                historial: historial
            }
        });

    } catch (error: any) {
        console.error('❌ Error al buscar pedido por número:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// Buscar pedidos por teléfono
export const getPedidosByPhone = async (req: Request, res: Response) => {
    try {
        const { telefono } = req.params;

        console.log('🔍 Buscando pedidos por teléfono:', telefono);

        const pedidos = await Pedidos.findAll({
            include: [
                {
                    model: Clientes,
                    as: 'cliente',
                    where: { telefono: telefono },
                    attributes: ['id_cliente', 'nombre', 'apellido', 'mail', 'telefono', 'domicilio', 'dni']
                },
                {
                    model: DetallePedidos,
                    as: 'detalle',
                    include: [
                        {
                            model: Productos,
                            as: 'producto',
                            attributes: ['id_producto', 'descripcion', 'precio_venta']
                        }
                    ]
                }
            ],
            order: [['fecha_pedido', 'DESC']]
        });

        if (pedidos.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron pedidos',
                message: `No se encontraron pedidos para el teléfono ${telefono}`
            });
        }

        res.status(200).json({
            success: true,
            pedidos: pedidos.map(pedido => ({
                id_pedido: pedido.id_pedido,
                numero_pedido: pedido.payment_id,
                estado: pedido.estado,
                fecha_pedido: pedido.fecha_pedido,
                importe: pedido.importe,
                cliente: pedido.cliente,
                items: pedido.detalle
            }))
        });

    } catch (error: any) {
        console.error('❌ Error al buscar pedidos por teléfono:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// Buscar pedidos por email
export const getPedidosByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        console.log('🔍 Buscando pedidos por email:', email);

        const pedidos = await Pedidos.findAll({
            include: [
                {
                    model: Clientes,
                    as: 'cliente',
                    where: { mail: email },
                    attributes: ['id_cliente', 'nombre', 'apellido', 'mail', 'telefono', 'domicilio', 'dni']
                },
                {
                    model: DetallePedidos,
                    as: 'detalle',
                    include: [
                        {
                            model: Productos,
                            as: 'producto',
                            attributes: ['id_producto', 'descripcion', 'precio_venta']
                        }
                    ]
                }
            ],
            order: [['fecha_pedido', 'DESC']]
        });

        if (pedidos.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron pedidos',
                message: `No se encontraron pedidos para el email ${email}`
            });
        }

        res.status(200).json({
            success: true,
            pedidos: pedidos.map(pedido => ({
                id_pedido: pedido.id_pedido,
                numero_pedido: pedido.payment_id,
                estado: pedido.estado,
                fecha_pedido: pedido.fecha_pedido,
                importe: pedido.importe,
                cliente: pedido.cliente,
                items: pedido.detalle
            }))
        });

    } catch (error: any) {
        console.error('❌ Error al buscar pedidos por email:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// Obtener historial de estados de un pedido
export const getHistorialPedido = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        console.log('🔍 Obteniendo historial del pedido:', id);

        const pedido = await Pedidos.findByPk(id);
        if (!pedido) {
            return res.status(404).json({
                error: 'Pedido no encontrado'
            });
        }

        // Por ahora simulamos el historial, pero en el futuro se puede crear una tabla de historial
        const historial = [
            {
                estado: 'pendiente',
                fecha: pedido.fecha_pedido,
                descripcion: 'Pedido confirmado'
            }
        ];

        // Agregar el estado actual si no es pendiente
        if (pedido.estado !== 'pendiente') {
            historial.push({
                estado: pedido.estado,
                fecha: new Date(),
                descripcion: getEstadoDescription(pedido.estado)
            });
        }

        res.status(200).json({
            success: true,
            historial: historial
        });

    } catch (error: any) {
        console.error('❌ Error al obtener historial del pedido:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// Obtener pedidos de un cliente específico
export const getPedidosByCliente = async (req: Request, res: Response) => {
    try {
        const { clienteId } = req.params;
        const { estado, fecha_inicio, fecha_fin } = req.query;

        console.log(`🔍 Obteniendo pedidos para cliente ${clienteId}`);

        // Verificar que el cliente existe
        const cliente = await Clientes.findByPk(clienteId);
        if (!cliente) {
            return res.status(404).json({
                error: 'Cliente no encontrado'
            });
        }

        // Construir filtros
        let whereClause: any = {
            id_cliente: clienteId
        };

        if (estado) {
            whereClause.estado = estado;
        }

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_pedido = {
                [Op.between]: [new Date(fecha_inicio as string), new Date(fecha_fin as string)]
            };
        }

        const pedidos = await Pedidos.findAll({
            where: whereClause,
            include: [
                {
                    model: DetallePedidos,
                    as: 'detalle',
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
            ],
            order: [['fecha_pedido', 'DESC']]
        });

        console.log(`✅ Encontrados ${pedidos.length} pedidos para cliente ${clienteId}`);

        res.json({
            success: true,
            pedidos,
            total: pedidos.length
        });

    } catch (error: any) {
        console.error('❌ Error al obtener pedidos del cliente:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// Función auxiliar para obtener descripción del estado
const getEstadoDescription = (estado: string): string => {
    const descriptions: { [key: string]: string } = {
        'pendiente': 'Pedido confirmado',
        'procesando': 'En preparación',
        'completado': 'Listo para entrega',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado',
        'anulado': 'Anulado'
    };
    return descriptions[estado] || estado;
};

export default {
    createPedido,
    getPedidos,
    getPedidoById,
    cambiarEstadoPedido,
    anularPedido,
    syncPedidos,
    getEstadisticasPedidos,
    getPedidoByNumber,
    getPedidosByPhone,
    getPedidosByEmail,
    getPedidosByCliente,
    getHistorialPedido
};
