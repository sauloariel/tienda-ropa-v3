import { Request, Response } from "express";
import { Temporadas } from "../models/Temporadas.model";

// Obtener todas las temporadas
export const getAllTemporadas = async (req: Request, res: Response) => {
    try {
        const temporadas = await Temporadas.findAll({
            order: [['nombre', 'ASC']]
        });
        res.status(200).json(temporadas);
    } catch (error: any) {
        console.error("Error al obtener temporadas:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener temporada por ID
export const getTemporadaById = async (req: Request, res: Response) => {
    try {
        const temporada = await Temporadas.findByPk(req.params.id);
        if (temporada) {
            res.status(200).json(temporada);
        } else {
            res.status(404).json({ error: "Temporada no encontrada" });
        }
    } catch (error: any) {
        console.error("Error al obtener temporada:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear nueva temporada
export const createTemporada = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, estado } = req.body;

        // Validar campos requeridos
        if (!nombre) {
            return res.status(400).json({
                error: "El nombre de la temporada es requerido"
            });
        }

        // Verificar que el nombre no esté en uso
        const existingTemporada = await Temporadas.findOne({
            where: { nombre }
        });
        if (existingTemporada) {
            return res.status(400).json({
                error: "Ya existe una temporada con este nombre"
            });
        }

        // Crear temporada
        const temporada = await Temporadas.create({
            nombre,
            descripcion: descripcion || '',
            estado: estado || 'ACTIVO',
            fecha_creacion: new Date()
        });

        res.status(201).json(temporada);
    } catch (error: any) {
        console.error("Error al crear temporada:", error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar temporada
export const updateTemporada = async (req: Request, res: Response) => {
    try {
        const temporada = await Temporadas.findByPk(req.params.id);

        if (!temporada) {
            return res.status(404).json({ error: "Temporada no encontrada" });
        }

        const { nombre, descripcion, estado } = req.body;
        const updateData: any = {};

        // Actualizar nombre si se proporciona y es diferente
        if (nombre && nombre !== temporada.nombre) {
            // Verificar que el nuevo nombre no esté en uso
            const existingTemporada = await Temporadas.findOne({
                where: { nombre }
            });
            if (existingTemporada) {
                return res.status(400).json({
                    error: "Ya existe una temporada con este nombre"
                });
            }
            updateData.nombre = nombre;
        }

        // Actualizar otros campos
        if (descripcion !== undefined) updateData.descripcion = descripcion;
        if (estado !== undefined) updateData.estado = estado;

        // Actualizar la temporada
        await temporada.update(updateData);

        res.status(200).json(temporada);
    } catch (error: any) {
        console.error("Error al actualizar temporada:", error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar temporada
export const deleteTemporada = async (req: Request, res: Response) => {
    try {
        const temporada = await Temporadas.findByPk(req.params.id);

        if (!temporada) {
            return res.status(404).json({ error: "Temporada no encontrada" });
        }

        // Verificar si hay productos asociados a esta temporada
        const productosAsociados = await temporada.$get('productos');
        if (productosAsociados.length > 0) {
            return res.status(400).json({
                error: "No se puede eliminar la temporada porque tiene productos asociados"
            });
        }

        await Temporadas.destroy({ where: { id_temporada: req.params.id } });
        res.status(204).send();
    } catch (error: any) {
        console.error("Error al eliminar temporada:", error);
        res.status(500).json({ error: error.message });
    }
};







