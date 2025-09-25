const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'ecommerce',
});

// Mapeo de productos a imágenes
const productImages = {
    1: { // algodón básica
        nombre: 'remera-algodon-basica.svg',
        ruta: '/images/products/remera-algodon-basica.svg',
        descripcion: 'Remera de algodón básica'
    },
    2: { // Jeans clásico azul
        nombre: 'jeans-clasico-azul.svg',
        ruta: '/images/products/jeans-clasico-azul.svg',
        descripcion: 'Jeans clásico azul'
    },
    3: { // Camisa formal blanca
        nombre: 'camisa-formal-blanca.svg',
        ruta: '/images/products/camisa-formal-blanca.svg',
        descripcion: 'Camisa formal blanca'
    },
    4: { // Zapatos negros de cuero
        nombre: 'zapatos-negros-cuero.svg',
        ruta: '/images/products/zapatos-negros-cuero.svg',
        descripcion: 'Zapatos negros de cuero'
    },
    5: { // Gorra negra
        nombre: 'gorra-negra.svg',
        ruta: '/images/products/gorra-negra.svg',
        descripcion: 'Gorra negra ajustable'
    },
    35: { // boxer
        nombre: 'boxer-algodon.svg',
        ruta: '/images/products/boxer-algodon.svg',
        descripcion: 'Boxer de algodón'
    },
    24: { // boxer de algodon
        nombre: 'boxer-algodon.svg',
        ruta: '/images/products/boxer-algodon.svg',
        descripcion: 'Boxer de algodón'
    },
    38: { // calsonsillo
        nombre: 'calsonsillo.svg',
        ruta: '/images/products/calsonsillo.svg',
        descripcion: 'Calsonsillo de algodón'
    },
    41: { // corpiño
        nombre: 'corpino.svg',
        ruta: '/images/products/corpino.svg',
        descripcion: 'Corpiño de algodón'
    }
};

async function updateProductImages() {
    try {
        await client.connect();
        console.log('✅ Conectado a la base de datos PostgreSQL');

        for (const [productId, imageData] of Object.entries(productImages)) {
            console.log(`\n🔄 Actualizando producto ${productId}: ${imageData.descripcion}`);

            // Verificar si el producto existe
            const productCheck = await client.query(
                'SELECT id_producto FROM productos WHERE id_producto = $1',
                [productId]
            );

            if (productCheck.rows.length === 0) {
                console.log(`⚠️  Producto ${productId} no encontrado, saltando...`);
                continue;
            }

            // Eliminar imágenes existentes del producto
            await client.query(
                'DELETE FROM imagenes WHERE id_productos = $1',
                [productId]
            );
            console.log(`   🗑️  Imágenes existentes eliminadas`);

            // Insertar nueva imagen
            await client.query(
                `INSERT INTO imagenes (id_productos, nombre_archivo, ruta, descripcion, imagen_bin) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [productId, imageData.nombre, imageData.ruta, imageData.descripcion, null]
            );
            console.log(`   ✅ Imagen agregada: ${imageData.nombre}`);
        }

        console.log('\n🎉 ¡Todas las imágenes de productos han sido actualizadas exitosamente!');

    } catch (err) {
        console.error('❌ Error al actualizar las imágenes de productos:', err);
    } finally {
        await client.end();
        console.log('Desconectado de la base de datos.');
    }
}

updateProductImages();








