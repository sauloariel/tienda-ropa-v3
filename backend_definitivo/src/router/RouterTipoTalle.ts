import { Router } from 'express';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';
import {
    createTipoTalle,
    getTiposTalle,
    getTipoTalleById,
    updateTipoTalle,
    deleteTipoTalle
} from '../controllers/TipoTalleController';

const router = Router();

// Crear TipoTalle
router.post('/',
    body('nombre')
        .isString().notEmpty().withMessage('El nombre del tipo de talle es obligatorio')
        .isLength({ max: 30 }).withMessage('El nombre no puede superar los 30 caracteres'),
    inputErrors,
    createTipoTalle
);

// Obtener todos los tipos de talle
router.get('/', getTiposTalle);

// Obtener tipo de talle por ID
router.get('/:id',
    param('id').isInt().withMessage('ID inválido'),
    inputErrors,
    getTipoTalleById
);

// Actualizar tipo de talle por ID
router.put('/:id',
    param('id').isInt().withMessage('ID inválido'),
    body('nombre').optional().isString().isLength({ max: 30 }),
    inputErrors,
    updateTipoTalle
);

// Eliminar tipo de talle por ID
router.delete('/:id',
    param('id').isInt().withMessage('ID inválido'),
    inputErrors,
    deleteTipoTalle
);

export default router;


