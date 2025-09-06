import 'dotenv/config';
import server from './server';
import db from './config/db';

// Validar variables de entorno críticas
const JWT_SECRET = process.env.JWT_SECRET || 'mi_jwt_secret_super_seguro_para_desarrollo_2024';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '123';
const DB_NAME = process.env.DB_NAME || 'ecommerce';

console.log('🔧 Configuración cargada:');
console.log(`   JWT_SECRET: ${JWT_SECRET ? '✅ Configurado' : '❌ No configurado'}`);
console.log(`   DB_HOST: ${DB_HOST}`);
console.log(`   DB_USER: ${DB_USER}`);
console.log(`   DB_NAME: ${DB_NAME}`);

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
