import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const inputErrors = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req) // para recuperar los mensajes de error
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

// Exportar middleware de autenticación
export {
    authRequired
} from './auth';
