import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../config/db';

// Obtener todas las promociones
export const getPromociones = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                id_promocion,
                nombre,
                descripcion,
                tipo,
                valor,
                codigo_descuento,
                fecha_inicio,
                fecha_fin,
                minimo_compra,
                uso_maximo,
                uso_actual,
                estado
            FROM promociones 
            ORDER BY fecha_inicio DESC
        `;

        const promociones = await db.query(query, {
            type: QueryTypes.SELECT
        });

        res.json(promociones);
    } catch (error) {
        console.error('Error obteniendo promociones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener promoción por ID con productos
export const getPromocionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                p.id_promocion,
                p.nombre,
                p.descripcion,
                p.tipo,
                p.valor,
                p.codigo_descuento,
                p.fecha_inicio,
                p.fecha_fin,
                p.minimo_compra,
                p.uso_maximo,
                p.uso_actual,
                p.estado,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id_producto', pr.id_producto,
                            'descripcion', pr.descripcion,
                            'precio_venta', pr.precio_venta,
                            'stock', pr.stock
                        )
                    ) FILTER (WHERE pr.id_producto IS NOT NULL), 
                    '[]'::json
                ) as productos
            FROM promociones p
            LEFT JOIN promociones_productos pp ON p.id_promocion = pp.id_promocion
            LEFT JOIN productos pr ON pp.id_producto = pr.id_producto
            WHERE p.id_promocion = :id
            GROUP BY p.id_promocion
        `;

        const promociones = await db.query(query, {
            replacements: { id },
            type: QueryTypes.SELECT
        });

        if (promociones.length === 0) {
            return res.status(404).json({ error: 'Promoción no encontrada' });
        }

        res.json(promociones[0]);
    } catch (error) {
        console.error('Error obteniendo promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear nueva promoción
export const createPromocion = async (req: Request, res: Response) => {
    try {
        const {
            nombre,
            descripcion,
            tipo,
            valor,
            codigo_descuento,
            fecha_inicio,
            fecha_fin,
            minimo_compra,
            uso_maximo,
            estado = 'ACTIVA',
            productos = []
        } = req.body;

        // Validaciones básicas
        if (!nombre || !tipo || !valor || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                error: 'Faltan campos requeridos: nombre, tipo, valor, fecha_inicio, fecha_fin'
            });
        }

        // Validar fechas
        const inicio = new Date(fecha_inicio);
        const fin = new Date(fecha_fin);

        if (inicio >= fin) {
            return res.status(400).json({
                error: 'La fecha de inicio debe ser anterior a la fecha de fin'
            });
        }

        // Validar valor según tipo
        if (tipo === 'PORCENTAJE' && (valor < 0 || valor > 100)) {
            return res.status(400).json({
                error: 'El porcentaje debe estar entre 0 y 100'
            });
        }

        if (tipo === 'MONTO_FIJO' && valor < 0) {
            return res.status(400).json({
                error: 'El monto fijo debe ser mayor a 0'
            });
        }

        const query = `
            INSERT INTO promociones (
                nombre, descripcion, tipo, valor, codigo_descuento,
                fecha_inicio, fecha_fin, minimo_compra, uso_maximo,
                uso_actual, estado
            ) VALUES (
                :nombre, :descripcion, :tipo, :valor, :codigo_descuento,
                :fecha_inicio, :fecha_fin, :minimo_compra, :uso_maximo,
                0, :estado
            ) RETURNING *
        `;

        const result = await db.query(query, {
            replacements: {
                nombre,
                descripcion,
                tipo,
                valor,
                codigo_descuento,
                fecha_inicio,
                fecha_fin,
                minimo_compra,
                uso_maximo,
                estado
            },
            type: QueryTypes.INSERT
        });

        const nuevaPromocion = (result as any)[0][0];

        // Si se especificaron productos, crear las relaciones
        if (productos && productos.length > 0) {
            for (const productoId of productos) {
                await db.query(
                    'INSERT INTO promociones_productos (id_promocion, id_producto) VALUES (:id_promocion, :id_producto)',
                    {
                        replacements: {
                            id_promocion: nuevaPromocion.id_promocion,
                            id_producto: productoId
                        },
                        type: QueryTypes.INSERT
                    }
                );
            }
        }

        res.status(201).json(nuevaPromocion);
    } catch (error) {
        console.error('Error creando promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar promoción
export const updatePromocion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Verificar que la promoción existe
        const checkQuery = 'SELECT * FROM promociones WHERE id_promocion = :id';
        const existingPromocion = await db.query(checkQuery, {
            replacements: { id },
            type: QueryTypes.SELECT
        });

        if (existingPromocion.length === 0) {
            return res.status(404).json({ error: 'Promoción no encontrada' });
        }

        const existing = existingPromocion[0] as any;

        // Validar fechas si se están actualizando
        if (updateData.fecha_inicio || updateData.fecha_fin) {
            const inicio = new Date(updateData.fecha_inicio || existing.fecha_inicio);
            const fin = new Date(updateData.fecha_fin || existing.fecha_fin);

            if (inicio >= fin) {
                return res.status(400).json({
                    error: 'La fecha de inicio debe ser anterior a la fecha de fin'
                });
            }
        }

        // Validar valor según tipo si se está actualizando
        if (updateData.tipo || updateData.valor !== undefined) {
            const tipo = updateData.tipo || existing.tipo;
            const valor = updateData.valor !== undefined ? updateData.valor : existing.valor;

            if (tipo === 'PORCENTAJE' && (valor < 0 || valor > 100)) {
                return res.status(400).json({
                    error: 'El porcentaje debe estar entre 0 y 100'
                });
            }

            if (tipo === 'MONTO_FIJO' && valor < 0) {
                return res.status(400).json({
                    error: 'El monto fijo debe ser mayor a 0'
                });
            }
        }

        // Construir query de actualización dinámicamente
        const updateFields = [];
        const replacements: any = { id };

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && key !== 'productos') {
                updateFields.push(`${key} = :${key}`);
                replacements[key] = updateData[key];
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        const updateQuery = `
            UPDATE promociones 
            SET ${updateFields.join(', ')}
            WHERE id_promocion = :id
            RETURNING *
        `;

        const result = await db.query(updateQuery, {
            replacements,
            type: QueryTypes.UPDATE
        });

        const promocionActualizada = (result as any)[0][0];

        // Si se especificaron productos, actualizar las relaciones
        if (updateData.productos && Array.isArray(updateData.productos)) {
            // Eliminar relaciones existentes
            await db.query(
                'DELETE FROM promociones_productos WHERE id_promocion = :id',
                {
                    replacements: { id },
                    type: QueryTypes.DELETE
                }
            );

            // Agregar nuevas relaciones
            for (const productoId of updateData.productos) {
                await db.query(
                    'INSERT INTO promociones_productos (id_promocion, id_producto) VALUES (:id_promocion, :id_producto)',
                    {
                        replacements: {
                            id_promocion: id,
                            id_producto: productoId
                        },
                        type: QueryTypes.INSERT
                    }
                );
            }
        }

        res.json(promocionActualizada);
    } catch (error) {
        console.error('Error actualizando promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar promoción
export const deletePromocion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM promociones WHERE id_promocion = :id RETURNING *';
        const result = await db.query(query, {
            replacements: { id },
            type: QueryTypes.DELETE
        });

        if ((result as any)[0].length === 0) {
            return res.status(404).json({ error: 'Promoción no encontrada' });
        }

        res.json({ message: 'Promoción eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cambiar estado de promoción
export const togglePromocionEstado = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const query = `
            UPDATE promociones 
            SET estado = :estado, updated_at = CURRENT_TIMESTAMP
            WHERE id_promocion = :id
            RETURNING *
        `;

        const result = await db.query(query, {
            replacements: { id, estado },
            type: QueryTypes.UPDATE
        });

        if ((result as any)[0].length === 0) {
            return res.status(404).json({ error: 'Promoción no encontrada' });
        }

        res.json((result as any)[0][0]);
    } catch (error) {
        console.error('Error cambiando estado de promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener estadísticas de marketing
export const getMarketingStats = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                COUNT(*) as total_promociones,
                COUNT(CASE WHEN estado = 'ACTIVA' THEN 1 END) as promociones_activas,
                COUNT(CASE WHEN estado = 'INACTIVA' THEN 1 END) as promociones_inactivas,
                COUNT(CASE WHEN estado = 'EXPIRADA' THEN 1 END) as promociones_expiradas,
                COUNT(CASE WHEN estado = 'ACTIVA' AND fecha_fin BETWEEN NOW() AND NOW() + INTERVAL '7 days' THEN 1 END) as promociones_por_vencer,
                COALESCE(SUM(uso_actual), 0) as total_uso
            FROM promociones
        `;

        const result = await db.query(query, {
            type: QueryTypes.SELECT
        });

        res.json(result[0]);
    } catch (error) {
        console.error('Error obteniendo estadísticas de marketing:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener promociones por vencer
export const getPromocionesPorVencer = async (req: Request, res: Response) => {
    try {
        const { dias = 7 } = req.query;

        const query = `
            SELECT * FROM promociones 
            WHERE estado = 'ACTIVA' 
            AND fecha_fin BETWEEN NOW() AND NOW() + INTERVAL '${dias} days'
            ORDER BY fecha_fin ASC
        `;

        const promociones = await db.query(query, {
            type: QueryTypes.SELECT
        });

        res.json(promociones);
    } catch (error) {
        console.error('Error obteniendo promociones por vencer:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener promociones expiradas
export const getPromocionesExpiradas = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT * FROM promociones 
            WHERE estado = 'ACTIVA' 
            AND fecha_fin < NOW()
            ORDER BY fecha_fin DESC
        `;

        const promociones = await db.query(query, {
            type: QueryTypes.SELECT
        });

        res.json(promociones);
    } catch (error) {
        console.error('Error obteniendo promociones expiradas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Validar código de descuento
export const validateCodigoDescuento = async (req: Request, res: Response) => {
    try {
        const { codigo, monto_compra } = req.body;

        if (!codigo) {
            return res.status(400).json({ error: 'Código de descuento requerido' });
        }

        const query = `
            SELECT * FROM promociones 
            WHERE codigo_descuento = :codigo
            AND estado = 'ACTIVA'
            AND fecha_inicio <= NOW()
            AND fecha_fin >= NOW()
        `;

        const promociones = await db.query(query, {
            replacements: { codigo },
            type: QueryTypes.SELECT
        });

        if (promociones.length === 0) {
            return res.status(404).json({
                valid: false,
                error: 'Código de descuento no válido o expirado'
            });
        }

        const promocion = promociones[0] as any;

        // Verificar monto mínimo si aplica
        if (promocion.minimo_compra && monto_compra < promocion.minimo_compra) {
            return res.status(400).json({
                valid: false,
                error: `Monto mínimo de compra: $${promocion.minimo_compra}`
            });
        }

        // Verificar límite de uso si aplica
        if (promocion.uso_maximo && promocion.uso_actual >= promocion.uso_maximo) {
            return res.status(400).json({
                valid: false,
                error: 'Código de descuento agotado'
            });
        }

        // Calcular descuento
        let descuento = 0;
        if (promocion.tipo === 'PORCENTAJE') {
            descuento = (monto_compra * promocion.valor) / 100;
        } else if (promocion.tipo === 'MONTO_FIJO') {
            descuento = promocion.valor;
        }

        res.json({
            valid: true,
            promocion: {
                id: promocion.id_promocion,
                nombre: promocion.nombre,
                tipo: promocion.tipo,
                valor: promocion.valor,
                descuento: Math.min(descuento, monto_compra)
            }
        });
    } catch (error) {
        console.error('Error validando código de descuento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener productos disponibles para promociones
export const getProductosDisponibles = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                id_producto,
                descripcion,
                precio_venta,
                stock,
                estado
            FROM productos 
            WHERE estado = 'ACTIVO' AND stock > 0
            ORDER BY descripcion
        `;

        const productos = await db.query(query, {
            type: QueryTypes.SELECT
        });

        res.json(productos);
    } catch (error) {
        console.error('Error obteniendo productos disponibles:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Agregar productos a una promoción
export const agregarProductosPromocion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { productos } = req.body;

        if (!productos || !Array.isArray(productos)) {
            return res.status(400).json({ error: 'Se requiere un array de productos' });
        }

        // Eliminar relaciones existentes
        await db.query(
            'DELETE FROM promociones_productos WHERE id_promocion = :id',
            {
                replacements: { id },
                type: QueryTypes.DELETE
            }
        );

        // Agregar nuevas relaciones
        for (const productoId of productos) {
            await db.query(
                'INSERT INTO promociones_productos (id_promocion, id_producto) VALUES (:id_promocion, :id_producto)',
                {
                    replacements: {
                        id_promocion: id,
                        id_producto: productoId
                    },
                    type: QueryTypes.INSERT
                }
            );
        }

        res.json({ message: 'Productos agregados exitosamente' });
    } catch (error) {
        console.error('Error agregando productos a promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener promociones activas para productos específicos
export const getPromocionesActivasProductos = async (req: Request, res: Response) => {
    try {
        const { productos } = req.query;

        if (!productos) {
            return res.status(400).json({ error: 'Se requiere especificar productos' });
        }

        const productosArray = Array.isArray(productos) ? productos.map(Number) : [Number(productos)];

        const query = `
            SELECT DISTINCT
                p.id_promocion,
                p.nombre,
                p.descripcion,
                p.tipo,
                p.valor,
                p.codigo_descuento,
                p.fecha_inicio,
                p.fecha_fin,
                p.minimo_compra,
                pr.id_producto,
                pr.descripcion as producto_descripcion,
                pr.precio_venta
            FROM promociones p
            INNER JOIN promociones_productos pp ON p.id_promocion = pp.id_promocion
            INNER JOIN productos pr ON pp.id_producto = pr.id_producto
            WHERE p.estado = 'ACTIVA'
            AND p.fecha_inicio <= NOW()
            AND p.fecha_fin >= NOW()
            AND pr.id_producto IN (:productos)
            ORDER BY p.fecha_fin ASC
        `;

        const promociones = await db.query(query, {
            replacements: { productos: productosArray },
            type: QueryTypes.SELECT
        });

        res.json(promociones);
    } catch (error) {
        console.error('Error obteniendo promociones activas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Usar código de descuento
export const usarCodigoDescuento = async (req: Request, res: Response) => {
    try {
        const { codigo } = req.body;

        const query = `
            UPDATE promociones 
            SET uso_actual = uso_actual + 1, updated_at = CURRENT_TIMESTAMP
            WHERE codigo_descuento = :codigo
            RETURNING *
        `;

        const result = await db.query(query, {
            replacements: { codigo },
            type: QueryTypes.UPDATE
        });

        if ((result as any)[0].length === 0) {
            return res.status(404).json({ error: 'Código de descuento no encontrado' });
        }

        res.json({ message: 'Código de descuento utilizado exitosamente' });
    } catch (error) {
        console.error('Error usando código de descuento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


