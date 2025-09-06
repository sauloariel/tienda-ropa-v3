import { QueryTypes, Op } from 'sequelize';
import db from '../config/db';
import { Pedidos } from '../models/Pedidos.model';
import { Clientes } from '../models/Clientes.model';
import { DetallePedidos } from '../models/DetallePedidos.model';
import { Pedido, PedidosFilters, PedidosResponse, PedidosStats } from '../types/pedidos.types';

// Constantes para mapeo de columnas (ajustar si difieren en tu BD)
const COLUMN_MAPPING = {
    PEDIDOS: {
        TABLE: 'pedidos',
        ID: 'id_pedido',
        CLIENTE: 'id_cliente',
        EMPLEADO: 'id_empleados',
        FECHA: 'fecha_pedido',
        IMPORTE: 'importe',
        ESTADO: 'estado',
        ANULACION: 'anulacion',
        VENTA_WEB: 'venta_web',
        PAYMENT_ID: 'payment_id'
    },
    CLIENTES: {
        TABLE: 'clientes',
        ID: 'id_cliente',
        NOMBRE: 'nombre',
        MAIL: 'mail'
    }
};

export class PedidosRepository {

    /**
     * Obtiene todos los pedidos con filtros, paginación y join con clientes
     */
    static async findAll(filters: PedidosFilters = {}): Promise<PedidosResponse> {
        const {
            page = 1,
            limit = 10,
            search,
            estado,
            fechaDesde,
            fechaHasta
        } = filters;

        const offset = (page - 1) * limit;

        try {
            // Construir la consulta base
            let whereClause = 'WHERE 1=1';
            const queryParams: any[] = [];
            let paramIndex = 1;

            // Filtro de búsqueda
            if (search) {
                whereClause += ` AND (
          c.${COLUMN_MAPPING.CLIENTES.NOMBRE} ILIKE $${paramIndex} OR 
          c.${COLUMN_MAPPING.CLIENTES.MAIL} ILIKE $${paramIndex} OR 
          p.${COLUMN_MAPPING.PEDIDOS.ID}::text ILIKE $${paramIndex}
        )`;
                queryParams.push(`%${search}%`);
                paramIndex++;
            }

            // Filtro de estado
            if (estado) {
                whereClause += ` AND p.${COLUMN_MAPPING.PEDIDOS.ESTADO} = $${paramIndex}`;
                queryParams.push(estado);
                paramIndex++;
            }

            // Filtro de fechas
            if (fechaDesde) {
                whereClause += ` AND p.${COLUMN_MAPPING.PEDIDOS.FECHA} >= $${paramIndex}`;
                queryParams.push(fechaDesde);
                paramIndex++;
            }

            if (fechaHasta) {
                whereClause += ` AND p.${COLUMN_MAPPING.PEDIDOS.FECHA} <= $${paramIndex}`;
                queryParams.push(fechaHasta);
                paramIndex++;
            }

            // Consulta principal con join
            const query = `
        SELECT 
          p.*,
          c.${COLUMN_MAPPING.CLIENTES.NOMBRE} as cliente_nombre,
          c.${COLUMN_MAPPING.CLIENTES.MAIL} as cliente_mail,
          COALESCE((
            SELECT COUNT(*) 
            FROM detalle_pedidos dp 
            WHERE dp.id_pedido = p.${COLUMN_MAPPING.PEDIDOS.ID}
          ), 0) as items
        FROM ${COLUMN_MAPPING.PEDIDOS.TABLE} p
        LEFT JOIN ${COLUMN_MAPPING.CLIENTES.TABLE} c ON c.${COLUMN_MAPPING.CLIENTES.ID} = p.${COLUMN_MAPPING.PEDIDOS.CLIENTE}
        ${whereClause}
        ORDER BY p.${COLUMN_MAPPING.PEDIDOS.ID} DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

            // Agregar parámetros de paginación
            queryParams.push(limit, offset);

            // Ejecutar consulta principal
            const pedidos = await db.query(query, {
                type: QueryTypes.SELECT,
                bind: queryParams
            });

            // Consulta para contar total
            const countQuery = `
        SELECT COUNT(*) as total
        FROM ${COLUMN_MAPPING.PEDIDOS.TABLE} p
        LEFT JOIN ${COLUMN_MAPPING.CLIENTES.TABLE} c ON c.${COLUMN_MAPPING.CLIENTES.ID} = p.${COLUMN_MAPPING.PEDIDOS.CLIENTE}
        ${whereClause}
      `;

            const countResult = await db.query(countQuery, {
                type: QueryTypes.SELECT,
                bind: queryParams.slice(0, -2) // Excluir limit y offset
            });

            const total = parseInt((countResult[0] as any)?.total || '0');

            return {
                success: true,
                data: pedidos as Pedido[],
                total: total,
                page: page,
                limit: limit,
                totalPages: Math.ceil(total / limit)
            };

        } catch (error) {
            console.error('Error en PedidosRepository.findAll:', error);
            throw new Error('Error al obtener pedidos');
        }
    }

    /**
     * Obtiene un pedido por ID con información del cliente
     */
    static async findById(id: number): Promise<Pedido | null> {
        try {
            const query = `
        SELECT 
          p.*,
          c.${COLUMN_MAPPING.CLIENTES.NOMBRE} as cliente_nombre,
          c.${COLUMN_MAPPING.CLIENTES.MAIL} as cliente_mail,
          COALESCE((
            SELECT COUNT(*) 
            FROM detalle_pedidos dp 
            WHERE dp.id_pedido = p.${COLUMN_MAPPING.PEDIDOS.ID}
          ), 0) as items
        FROM ${COLUMN_MAPPING.PEDIDOS.TABLE} p
        LEFT JOIN ${COLUMN_MAPPING.CLIENTES.TABLE} c ON c.${COLUMN_MAPPING.CLIENTES.ID} = p.${COLUMN_MAPPING.PEDIDOS.CLIENTE}
        WHERE p.${COLUMN_MAPPING.PEDIDOS.ID} = $1
      `;

            const result = await db.query(query, {
                type: QueryTypes.SELECT,
                bind: [id]
            });

            return result[0] as Pedido || null;
        } catch (error) {
            console.error('Error en PedidosRepository.findById:', error);
            throw new Error('Error al obtener pedido');
        }
    }

    /**
     * Crea un nuevo pedido
     */
    static async create(data: Partial<Pedido>): Promise<Pedido> {
        try {
            const pedido = await Pedidos.create(data);
            return pedido.toJSON() as Pedido;
        } catch (error) {
            console.error('Error en PedidosRepository.create:', error);
            throw new Error('Error al crear pedido');
        }
    }

    /**
     * Actualiza un pedido existente
     */
    static async update(id: number, data: Partial<Pedido>): Promise<Pedido> {
        try {
            const pedido = await Pedidos.findByPk(id);
            if (!pedido) {
                throw new Error('Pedido no encontrado');
            }

            await pedido.update(data);
            return pedido.toJSON() as Pedido;
        } catch (error) {
            console.error('Error en PedidosRepository.update:', error);
            throw new Error('Error al actualizar pedido');
        }
    }

    /**
     * Elimina un pedido (borrado lógico si existe la columna, sino DELETE)
     */
    static async remove(id: number): Promise<boolean> {
        try {
            const pedido = await Pedidos.findByPk(id);
            if (!pedido) {
                throw new Error('Pedido no encontrado');
            }

            // Verificar si existe columna de anulación para borrado lógico
            if (COLUMN_MAPPING.PEDIDOS.ANULACION) {
                await pedido.update({ [COLUMN_MAPPING.PEDIDOS.ANULACION]: true });
                return true;
            } else {
                // Borrado físico
                await pedido.destroy();
                return true;
            }
        } catch (error) {
            console.error('Error en PedidosRepository.remove:', error);
            throw new Error('Error al eliminar pedido');
        }
    }

    /**
     * Obtiene estadísticas básicas de pedidos
     */
    static async getStats(): Promise<PedidosStats> {
        try {
            const query = `
        SELECT 
          COUNT(*) as total_pedidos,
          COUNT(CASE WHEN ${COLUMN_MAPPING.PEDIDOS.ESTADO} = 'Completado' THEN 1 END) as completados,
          COUNT(CASE WHEN ${COLUMN_MAPPING.PEDIDOS.ESTADO} = 'Procesando' THEN 1 END) as procesando,
          COUNT(CASE WHEN ${COLUMN_MAPPING.PEDIDOS.ESTADO} = 'Pendiente' THEN 1 END) as pendientes,
          COUNT(CASE WHEN ${COLUMN_MAPPING.PEDIDOS.ESTADO} = 'Cancelado' THEN 1 END) as cancelados,
          COALESCE(SUM(${COLUMN_MAPPING.PEDIDOS.IMPORTE}), 0) as total_ventas
        FROM ${COLUMN_MAPPING.PEDIDOS.TABLE}
        WHERE ${COLUMN_MAPPING.PEDIDOS.ANULACION} = false OR ${COLUMN_MAPPING.PEDIDOS.ANULACION} IS NULL
      `;

            const result = await db.query(query, {
                type: QueryTypes.SELECT
            });

            return result[0] as PedidosStats;
        } catch (error) {
            console.error('Error en PedidosRepository.getStats:', error);
            throw new Error('Error al obtener estadísticas');
        }
    }
}

export default PedidosRepository;
