import 'dotenv/config';
import server from './server';
import db from './config/db';

// Validar variables de entorno críticas
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET no configurado en .env');
    process.exit(1);
}

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error('❌ Variables de base de datos no configuradas en .env');
    console.error('Requeridas: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
}

const PORT = process.env.PORT || 4000;

// Conectar a la base de datos y arrancar servidor
(async () => {
    try {
        await db.authenticate();
        console.log('✅ Base de datos conectada');

        server.listen(PORT, () => {
            console.log(`🚀 Servidor en http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        process.exit(1);
    }
})();
