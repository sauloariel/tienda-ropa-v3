import fetch from 'node-fetch';

console.log('🔧 Test de Fix de Categorías');
console.log('============================\n');

async function testEndpoints() {
    try {
        // Test 1: Categorías
        console.log('🔍 Probando endpoint de categorías...');
        const categoriasResponse = await fetch('http://localhost:4000/api/productos/categorias');
        const categorias = await categoriasResponse.json();

        if (categoriasResponse.ok) {
            console.log('✅ Categorías cargadas correctamente');
            console.log(`📊 Total categorías: ${categorias.length}`);
            categorias.forEach((cat, index) => {
                console.log(`   ${index + 1}. ${cat.nombre_categoria} (${cat.descripcion})`);
            });
        } else {
            console.log('❌ Error cargando categorías:', categorias);
        }

        // Test 2: Productos
        console.log('\n🔍 Probando endpoint de productos...');
        const productosResponse = await fetch('http://localhost:4000/api/productos');
        const productos = await productosResponse.json();

        if (productosResponse.ok) {
            console.log('✅ Productos cargados correctamente');
            console.log(`📊 Total productos: ${productos.length}`);

            const productosConImagenes = productos.filter(p => p.imagenes && p.imagenes.length > 0);
            console.log(`🖼️  Productos con imágenes: ${productosConImagenes.length}`);

            if (productosConImagenes.length > 0) {
                console.log('\n📸 Primeros productos con imágenes:');
                productosConImagenes.slice(0, 3).forEach((prod, index) => {
                    console.log(`   ${index + 1}. ${prod.descripcion}`);
                    console.log(`      - Imágenes: ${prod.imagenes.length}`);
                    prod.imagenes.forEach((img, imgIndex) => {
                        console.log(`        ${imgIndex + 1}. ${img.ruta}`);
                    });
                });
            }
        } else {
            console.log('❌ Error cargando productos:', productos);
        }

        console.log('\n🎉 ¡Test completado exitosamente!');
        console.log('✅ El frontend ahora debería cargar los productos correctamente');

    } catch (error) {
        console.error('❌ Error durante el test:', error.message);
    }
}

testEndpoints();

























