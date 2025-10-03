import { Request, Response, NextFunction } from 'express';

// Middleware simple para Basic Auth en marketing
export const basicAuthMarketing = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;

        if (!header?.startsWith('Basic ')) {
            // Si no hay Basic Auth, continuar sin autenticación
            console.log('🔓 Marketing - Sin autenticación, continuando...');
            return next();
        }

        const base64Credentials = header.slice(6);
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        console.log('🔐 Marketing - Basic Auth recibido:', { username, password: password ? '***' : 'empty' });

        // Validación simple (puedes cambiar esto por tu lógica de autenticación)
        if (username && password) {
            // Por ahora, aceptar cualquier credencial válida
            console.log('✅ Marketing - Autenticación válida');
            return next();
        } else {
            console.log('❌ Marketing - Credenciales inválidas');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('❌ Marketing - Error en autenticación:', error);
        return res.status(401).json({ message: 'Error de autenticación' });
    }
};





