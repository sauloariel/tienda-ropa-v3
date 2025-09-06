import { Request, Response } from 'express';
import { Promociones } from '../models/Promociones.model';
import { Op } from 'sequelize';

// Obtener todas las promociones
export const getPromociones = async (req: Request, res: Response) => {
    try {
        const { estado, tipo, search } = req.query;

        const whereClause: any = {};

        if (estado && estado !== 'TODOS') {
            whereClause.estado = estado;
        }

        if (tipo && tipo !== 'TODOS') {
            whereClause.tipo = tipo;
        }

        if (search) {
            whereClause[Op.or] = [
                { nombre: { [Op.iLike]: `%${search}%` } },
                { descripcion: { [Op.iLike]: `%${search}%` } },
                { codigo_descuento: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const promociones = await Promociones.findAll({
            where: whereClause,
            order: [['fecha_inicio', 'DESC']]
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

        const promocion = await Promociones.findByPk(id);

        if (!promocion) {
            return res.status(404).json({ error: 'Promoción no encontrada' });
        }

        res.json(promocion);
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

        // Validaciones
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

        const promocion = await Promociones.create({
            nombre,
            descripcion,
            tipo,
            valor,
            codigo_descuento,
            fecha_inicio,
            fecha_fin,
            minimo_compra,
            uso_maximo,
            uso_actual: 0,
            estado
        });

        res.status(201).json(promocion);
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

        const promocion = await Promociones.findByPk(id);

        if (!promocion) {
            return res.status(404).json({ error: 'Promoción no encontrada' });
        }

        // Validar fechas si se están actualizando
        if (updateData.fecha_inicio || updateData.fecha_fin) {
            const inicio = new Date(updateData.fecha_inicio || promocion.fecha_inicio);
            const fin = new Date(updateData.fecha_fin || promocion.fecha_fin);

            if (inicio >= fin) {
                return res.status(400).json({
                    error: 'La fecha de inicio debe ser anterior a la fecha de fin'
                });
            }
        }

        await promocion.update(updateData);

        res.json(promocion);
    } catch (error) {
        console.error('Error actualizando promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar promoción
export const deletePromocion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const promocion = await Promociones.findByPk(id);

        if (!promocion) {
            return res.status(404).json({ error: 'Promoción no encontrada' });
        }

        await promocion.destroy();

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

        const promocion = await Promociones.findByPk(id);

        if (!promocion) {
            return res.status(404).json({ error: 'Promoción no encontrada' });
        }

        await promocion.update({ estado });

        res.json(promocion);
    } catch (error) {
        console.error('Error cambiando estado de promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener estadísticas de marketing
export const getMarketingStats = async (req: Request, res: Response) => {
    try {
        const [
            total_promociones,
            promociones_activas,
            promociones_inactivas,
            promociones_expiradas,
            total_uso
        ] = await Promise.all([
            Promociones.count(),
            Promociones.count({ where: { estado: 'ACTIVA' } }),
            Promociones.count({ where: { estado: 'INACTIVA' } }),
            Promociones.count({ where: { estado: 'EXPIRADA' } }),
            Promociones.sum('uso_actual')
        ]);

        // Promociones por vencer (próximos 7 días)
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 7);

        const promociones_por_vencer = await Promociones.count({
            where: {
                fecha_fin: {
                    [Op.between]: [new Date(), fechaLimite]
                },
                estado: 'ACTIVA'
            }
        });

        res.json({
            total_promociones,
            promociones_activas,
            promociones_inactivas,
            promociones_expiradas,
            promociones_por_vencer,
            total_uso: total_uso || 0
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas de marketing:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener promociones por vencer
export const getPromocionesPorVencer = async (req: Request, res: Response) => {
    try {
        const { dias = 7 } = req.query;
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + parseInt(dias as string));

        const promociones = await Promociones.findAll({
            where: {
                fecha_fin: {
                    [Op.between]: [new Date(), fechaLimite]
                },
                estado: 'ACTIVA'
            },
            order: [['fecha_fin', 'ASC']]
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
        const promociones = await Promociones.findAll({
            where: {
                fecha_fin: {
                    [Op.lt]: new Date()
                },
                estado: 'ACTIVA'
            },
            order: [['fecha_fin', 'DESC']]
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

        const promocion = await Promociones.findOne({
            where: {
                codigo_descuento: codigo,
                estado: 'ACTIVA',
                fecha_inicio: { [Op.lte]: new Date() },
                fecha_fin: { [Op.gte]: new Date() }
            }
        });

        if (!promocion) {
            return res.status(404).json({
                valid: false,
                error: 'Código de descuento no válido o expirado'
            });
        }

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
                descuento: Math.min(descuento, monto_compra) // No puede ser mayor al monto de compra
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

        const promocion = await Promociones.findOne({
            where: { codigo_descuento: codigo }
        });

        if (!promocion) {
            return res.status(404).json({ error: 'Código de descuento no encontrado' });
        }

        // Incrementar uso actual
        await promocion.update({
            uso_actual: promocion.uso_actual + 1
        });

        res.json({ message: 'Código de descuento utilizado exitosamente' });
    } catch (error) {
        console.error('Error usando código de descuento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


