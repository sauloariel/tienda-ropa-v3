import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'backend_definitivo', 'database.sqlite');

console.log('🔍 Buscando productos con "Test Producto con Variante"...');

// Leer la base de datos SQLite como archivo binario
try {
    const dbBuffer = readFileSync(dbPath);
    console.log('✅ Base de datos leída, tamaño:', dbBuffer.length, 'bytes');

    // Convertir a string para buscar
    const dbContent = dbBuffer.toString('utf8', 0, Math.min(dbBuffer.length, 1024 * 1024)); // Solo los primeros MB

    // Buscar productos problemáticos
    const lines = dbContent.split('\n');
    const productLines = lines.filter(line =>
        line.includes('Test Producto con Variante') &&
        line.includes('INSERT INTO productos')
    );

    console.log('📦 Líneas de productos encontradas:', productLines.length);

    if (productLines.length > 0) {
        productLines.forEach(line => {
            console.log('Producto encontrado:', line.substring(0, 100) + '...');
        });

        console.log('⚠️  Para eliminar estos productos manualmente, necesitas:');
        console.log('1. Abrir la base de datos con un editor SQLite');
        console.log('2. Ejecutar estas consultas SQL:');
        console.log('');
        console.log('-- Primero eliminar variantes');
        console.log('DELETE FROM producto_variante WHERE id_producto IN (SELECT id_producto FROM productos WHERE descripcion LIKE "%Test Producto con Variante%");');
        console.log('');
        console.log('-- Luego eliminar imágenes');
        console.log('DELETE FROM imagenes WHERE id_productos IN (SELECT id_producto FROM productos WHERE descripcion LIKE "%Test Producto con Variante%");');
        console.log('');
        console.log('-- Eliminar detalles de pedidos');
        console.log('DELETE FROM detalle_pedidos WHERE id_producto IN (SELECT id_producto FROM productos WHERE descripcion LIKE "%Test Producto con Variante%");');
        console.log('');
        console.log('-- Finalmente eliminar los productos');
        console.log('DELETE FROM productos WHERE descripcion LIKE "%Test Producto con Variante%";');

    } else {
        console.log('❌ No se encontraron productos con "Test Producto con Variante" en el archivo');
    }

} catch (error) {
    console.error('❌ Error leyendo la base de datos:', error.message);
    console.log('💡 Alternativas:');
    console.log('1. Usar el panel administrativo si está funcionando');
    console.log('2. Usar una herramienta como DB Browser for SQLite');
    console.log('3. Crear un script usando el backend existente');
}





