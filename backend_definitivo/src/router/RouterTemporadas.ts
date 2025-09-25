import { Router } from 'express';
import {
    getAllTemporadas,
    getTemporadaById,
    createTemporada,
    updateTemporada,
    deleteTemporada
} from '../controllers/TemporadasController';

const router = Router();

// Rutas para temporadas
router.get('/', getAllTemporadas);
router.get('/:id', getTemporadaById);
router.post('/', createTemporada);
router.put('/:id', updateTemporada);
router.delete('/:id', deleteTemporada);

export default router;





