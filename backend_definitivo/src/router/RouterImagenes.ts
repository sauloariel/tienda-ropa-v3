import { Router } from 'express';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';
import { createImagen, getImagenes, getImagenById, updateImagen, deleteImagen } from '../controllers/ImagenesController';

const router = Router();

// Crear imagen
router.post('/',
  body('id_productos').isInt().withMessage('ID del producto inválido'),
  body('nombre_archivo').optional().isString().isLength({ max: 255 }).withMessage('Nombre de archivo inválido'),
  body('ruta').optional().isString().isLength({ max: 255 }).withMessage('Ruta inválida'),
  body('descripcion').optional().isString(),
  // Nota: imagen_bin es un BLOB, en general se recibe como archivo o base64, 
  // acá podés agregar validaciones según cómo manejes la subida de imágenes
  inputErrors,
  createImagen
);

// Obtener todas las imágenes
router.get('/', getImagenes);

// Obtener imagen por ID
router.get('/:id',
  param('id').isInt().withMessage('ID de imagen inválido'),
  inputErrors,
  getImagenById
);

// Actualizar imagen por ID
router.put('/:id',
  param('id').isInt().withMessage('ID de imagen inválido'),
  body('id_productos').optional().isInt(),
  body('nombre_archivo').optional().isString().isLength({ max: 255 }),
  body('ruta').optional().isString().isLength({ max: 255 }),
  body('descripcion').optional().isString(),
  inputErrors,
  updateImagen
);

// Eliminar imagen por ID
router.delete('/:id',
  param('id').isInt().withMessage('ID de imagen inválido'),
  inputErrors,
  deleteImagen
);

export default router;
