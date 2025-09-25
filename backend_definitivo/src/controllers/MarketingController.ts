import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../config/db';

// Obtener todas las promociones
export const getPromociones = async (req: Request, res: Response) => {
    try {
        const { estado, tipo, search } = req.query;

        let whereConditions = '1=1';
        const replacements: any = {};

        if (estado && estado !== 'TODOS') {
            whereConditions += ' AND estado = :estado';
            replacements.estado = estado;
        }

        if (tipo && tipo !== 'TODOS') {
            whereConditions += ' AND tipo = :tipo';
            replacements.tipo = tipo;
        }

        if (search) {
            whereConditions += ' AND (nombre ILIKE :search OR descripcion ILIKE :search OR codigo_descuento ILIKE :search)';
            replacements.search = `%${search}%`;
        }

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
                estado,
                created_at,
                updated_at
            FROM promociones 
            WHERE ${whereConditions}
            ORDER BY fecha_inicio DESC
        `;

        const promociones = await db.query(query, {
            replacements,
            type: QueryTypes.SELECT
        });

        res.json(promociones);
    } catch (error) {
        console.error('Error obteniendo promociones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener promoción por ID
export const getPromocionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

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
                estado,
                created_at,
                updated_at
            FROM promociones 
            WHERE id_promocion = :id
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
            estado = 'ACTIVA'
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
                uso_actual, estado, created_at, updated_at
            ) VALUES (
                :nombre, :descripcion, :tipo, :valor, :codigo_descuento,
                :fecha_inicio, :fecha_fin, :minimo_compra, :uso_maximo,
                0, :estado, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
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

        res.status(201).json(result[0][0]);
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
            if (updateData[key] !== undefined) {
                updateFields.push(`${key} = :${key}`);
                replacements[key] = updateData[key];
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        updateFields.push('updated_at = CURRENT_TIMESTAMP');

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

        res.json((result as any)[0][0]);
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


