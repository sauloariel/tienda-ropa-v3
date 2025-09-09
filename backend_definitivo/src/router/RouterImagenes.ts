import { Router } from 'express';
import multer from 'multer';
import { param } from 'express-validator';
import { inputErrors } from '../middleware';
import {
  uploadImagen,
  uploadMultipleImagenes,
  getImagenesByProducto,
  deleteImagen
} from '../controllers/ImagenesController';

const router = Router();

// Configuración de multer para una imagen
const uploadSingle = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Configuración de multer para múltiples imágenes
const uploadMultiple = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB por archivo
    files: 6 // máximo 6 archivos
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Subir una imagen
router.post('/upload', uploadSingle.single('imagen'), uploadImagen);

// Subir múltiples imágenes
router.post('/upload-multiple', uploadMultiple.array('imagenes', 6), uploadMultipleImagenes);

// Obtener imágenes de un producto
router.get('/producto/:id_producto',
  param('id_producto').isInt().withMessage('ID del producto inválido'),
  inputErrors,
  getImagenesByProducto
);

// Eliminar imagen
router.delete('/:id',
  param('id').isInt().withMessage('ID de imagen inválido'),
  inputErrors,
  deleteImagen
);

export default router;