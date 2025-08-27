import { Router } from 'express';
import {
  createCliente, getClientes, getClienteById, updateCliente, deleteCliente
} from '../controllers/ClienteController';

import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

router.post('/',
  body('dni').isLength({ min: 7 }).withMessage('DNI inválido'),
  body('cuit_cuil').notEmpty().withMessage('CUIT/CUIL es requerido'),
  body('nombre').isString().notEmpty().withMessage('Nombre requerido'),
  body('apellido').isString().notEmpty().withMessage('Apellido requerido'),
  body('domicilio').isString().notEmpty().withMessage('Domicilio requerido'),
  body('telefono').isString().notEmpty().withMessage('Teléfono requerido'),
  body('mail').isEmail().withMessage('Email inválido'),
  body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  inputErrors,
  createCliente
);

router.get('/', getClientes);

router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  getClienteById
);

router.put('/:id',
  param('id').isInt().withMessage('ID inválido'),
  body('nombre').isString().notEmpty().withMessage('Nombre requerido'),
  body('apellido').isString().notEmpty().withMessage('Apellido requerido'),
  body('domicilio').isString().notEmpty().withMessage('Domicilio requerido'),
  body('telefono').isString().notEmpty().withMessage('Teléfono requerido'),
  body('mail').isEmail().withMessage('Email inválido'),
  body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  inputErrors,
  updateCliente
);

router.delete('/:id',
  param('id').isInt().withMessage('ID inválido'),
  inputErrors,
  deleteCliente
);

export default router;
