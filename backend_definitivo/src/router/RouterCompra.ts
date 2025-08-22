import { Router } from 'express';
import { body, param } from 'express-validator';
import { Compras } from '../models/Compras.model';
import { inputErrors } from '../middleware'; // Asegurate de tener este middleware

const router = Router();

// ➕ Crear una compra
router.post(
  '/',
  body('id_proveedor').isInt().withMessage('ID del proveedor inválido'),
  body('nro_factura').isString().notEmpty().withMessage('Número de factura requerido'),
  body('fecha').isISO8601().toDate().withMessage('Fecha inválida'),
  body('id_producto_stock').isInt().withMessage('ID de producto inválido'),
  inputErrors,
  async (req, res) => {
    try {
      const compra = await Compras.create(req.body);
      res.status(201).json(compra);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la compra', detalle: error });
    }
  }
);

// 📥 Obtener todas las compras
router.get('/', async (_req, res) => {
  try {
    const compras = await Compras.findAll({ include: ['proveedor', 'producto'] });
    res.json(compras);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las compras' });
  }
});

// 📤 Obtener una compra por ID
router.get(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  async (req, res) => {
    try {
      const compra = await Compras.findByPk(req.params.id, { include: ['proveedor', 'producto'] });
      if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
      res.json(compra);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar la compra' });
    }
  }
);

// 📝 Actualizar compra
router.put(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  body('id_proveedor').optional().isInt(),
  body('nro_factura').optional().isString(),
  body('fecha').optional().isISO8601().toDate(),
  body('id_producto_stock').optional().isInt(),
  inputErrors,
  async (req, res) => {
    try {
      const compra = await Compras.findByPk(req.params.id);
      if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
      await compra.update(req.body);
      res.json(compra);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la compra' });
    }
  }
);

// 🗑️ Eliminar compra
router.delete(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  async (req, res) => {
    try {
      const compra = await Compras.findByPk(req.params.id);
      if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
      await compra.destroy();
      res.json({ mensaje: 'Compra eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la compra' });
    }
  }
);

export default router;
