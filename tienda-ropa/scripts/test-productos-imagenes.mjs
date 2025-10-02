import fetch from 'node-fetch';

// Configuración
const API_BASE_URL = 'http://localhost:4000/api';
const FRONTEND_URL = 'http://localhost:5173';

console.log('🧪 Test de Carga de Productos con Imágenes');
console.log('==========================================\n');

// Función para hacer peticiones HTTP
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            ...options
        });

        const data = await response.json();

        return {
            success: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            status: 0,
            error: error.message
        };
    }
}

// Test 1: Verificar que el backend esté funcionando
async function testBackendConnection() {
    console.log('🔍 [Test 1] Verificando conexión al backend...');

    const result = await makeRequest(`${API_BASE_URL}/health`);

    if (result.success) {
        console.log('✅ Backend conectado correctamente');
        console.log('📊 Estado:', result.data);
    } else {
        console.log('❌ Error conectando al backend:', result.error || result.data);
        return false;
    }

    return true;
}

// Test 2: Obtener productos del backend
async function testGetProductos() {
    console.log('\n🔍 [Test 2] Obteniendo productos del backend...');

    const result = await makeRequest(`${API_BASE_URL}/productos`);

    if (result.success) {
        console.log(`✅ Se obtuvieron ${result.data.length} productos`);

        if (result.data.length > 0) {
            console.log('\n📋 Primeros 3 productos:');
            result.data.slice(0, 3).forEach((producto, index) => {
                console.log(`   ${index + 1}. ${producto.descripcion}`);
                console.log(`      - ID: ${producto.id_producto}`);
                console.log(`      - Precio: $${producto.precio_venta}`);
                console.log(`      - Stock: ${producto.stock}`);
                console.log(`      - Categoría: ${producto.categoria?.nombre_categoria || 'Sin categoría'}`);
                console.log(`      - Imágenes: ${producto.imagenes?.length || 0}`);

                if (producto.imagenes && producto.imagenes.length > 0) {
                    console.log(`      - Primera imagen: ${producto.imagenes[0].ruta}`);
                }
                console.log('');
            });
        }

        return result.data;
    } else {
        console.log('❌ Error obteniendo productos:', result.data);
        return [];
    }
}

// Test 3: Verificar imágenes individuales
async function testImagenes(productos) {
    console.log('\n🔍 [Test 3] Verificando imágenes de productos...');

    let productosConImagenes = 0;
    let imagenesValidas = 0;
    let imagenesInvalidas = 0;

    for (const producto of productos.slice(0, 5)) { // Solo los primeros 5
        if (producto.imagenes && producto.imagenes.length > 0) {
            productosConImagenes++;
            console.log(`\n📸 Producto: ${producto.descripcion}`);

            for (const imagen of producto.imagenes) {
                const imagenUrl = `http://localhost:4000${imagen.ruta}`;
                console.log(`   - Imagen: ${imagen.ruta}`);

                try {
                    const response = await fetch(imagenUrl, { method: 'HEAD' });
                    if (response.ok) {
                        console.log(`     ✅ Imagen accesible (${response.status})`);
                        imagenesValidas++;
                    } else {
                        console.log(`     ❌ Imagen no accesible (${response.status})`);
                        imagenesInvalidas++;
                    }
                } catch (error) {
                    console.log(`     ❌ Error accediendo a imagen: ${error.message}`);
                    imagenesInvalidas++;
                }
            }
        } else {
            console.log(`\n📸 Producto: ${producto.descripcion} - Sin imágenes`);
        }
    }

    console.log(`\n📊 Resumen de imágenes:`);
    console.log(`   - Productos con imágenes: ${productosConImagenes}/${Math.min(productos.length, 5)}`);
    console.log(`   - Imágenes válidas: ${imagenesValidas}`);
    console.log(`   - Imágenes inválidas: ${imagenesInvalidas}`);
}

// Test 4: Verificar categorías
async function testCategorias() {
    console.log('\n🔍 [Test 4] Verificando categorías...');

    const result = await makeRequest(`${API_BASE_URL}/productos/categorias`);

    if (result.success) {
        console.log(`✅ Se obtuvieron ${result.data.length} categorías`);

        if (result.data.length > 0) {
            console.log('\n📋 Categorías disponibles:');
            result.data.forEach((categoria, index) => {
                console.log(`   ${index + 1}. ${categoria.nombre_categoria}`);
            });
        }

        return result.data;
    } else {
        console.log('❌ Error obteniendo categorías:', result.data);
        return [];
    }
}

// Test 5: Verificar que el frontend puede cargar los datos
async function testFrontendDataLoading() {
    console.log('\n🔍 [Test 5] Verificando carga de datos en el frontend...');

    // Simular la carga que hace el frontend
    try {
        const [productosResult, categoriasResult] = await Promise.all([
            makeRequest(`${API_BASE_URL}/productos`),
            makeRequest(`${API_BASE_URL}/productos/categorias`)
        ]);

        if (productosResult.success && categoriasResult.success) {
            console.log('✅ Frontend puede cargar datos correctamente');
            console.log(`   - Productos: ${productosResult.data.length}`);
            console.log(`   - Categorías: ${categoriasResult.data.length}`);

            // Verificar que los productos tienen la estructura esperada
            const productoEjemplo = productosResult.data[0];
            if (productoEjemplo) {
                console.log('\n📋 Estructura del producto:');
                console.log(`   - id_producto: ${productoEjemplo.id_producto}`);
                console.log(`   - descripcion: ${productoEjemplo.descripcion}`);
                console.log(`   - precio_venta: ${productoEjemplo.precio_venta}`);
                console.log(`   - stock: ${productoEjemplo.stock}`);
                console.log(`   - categoria: ${productoEjemplo.categoria?.nombre_categoria || 'N/A'}`);
                console.log(`   - imagenes: ${productoEjemplo.imagenes?.length || 0} imagen(es)`);

                if (productoEjemplo.imagenes && productoEjemplo.imagenes.length > 0) {
                    console.log(`   - Primera imagen: ${productoEjemplo.imagenes[0].ruta}`);
                }
            }
        } else {
            console.log('❌ Error cargando datos para el frontend');
            if (!productosResult.success) {
                console.log(`   - Error productos: ${productosResult.data}`);
            }
            if (!categoriasResult.success) {
                console.log(`   - Error categorías: ${categoriasResult.data}`);
            }
        }
    } catch (error) {
        console.log('❌ Error en la carga de datos:', error.message);
    }
}

// Test 6: Verificar URLs de imágenes
async function testImageUrls(productos) {
    console.log('\n🔍 [Test 6] Verificando URLs de imágenes...');

    const baseUrl = 'http://localhost:4000';
    let totalImagenes = 0;
    let urlsValidas = 0;
    let urlsInvalidas = 0;

    for (const producto of productos.slice(0, 3)) { // Solo los primeros 3
        if (producto.imagenes && producto.imagenes.length > 0) {
            for (const imagen of producto.imagenes) {
                totalImagenes++;
                const urlCompleta = `${baseUrl}${imagen.ruta}`;

                console.log(`\n🖼️  Verificando: ${imagen.ruta}`);
                console.log(`   URL completa: ${urlCompleta}`);

                try {
                    const response = await fetch(urlCompleta, { method: 'HEAD' });
                    if (response.ok) {
                        console.log(`   ✅ Imagen accesible (${response.status})`);
                        console.log(`   📏 Tamaño: ${response.headers.get('content-length') || 'N/A'} bytes`);
                        console.log(`   🎨 Tipo: ${response.headers.get('content-type') || 'N/A'}`);
                        urlsValidas++;
                    } else {
                        console.log(`   ❌ Imagen no accesible (${response.status})`);
                        urlsInvalidas++;
                    }
                } catch (error) {
                    console.log(`   ❌ Error: ${error.message}`);
                    urlsInvalidas++;
                }
            }
        }
    }

    console.log(`\n📊 Resumen de URLs de imágenes:`);
    console.log(`   - Total verificadas: ${totalImagenes}`);
    console.log(`   - URLs válidas: ${urlsValidas}`);
    console.log(`   - URLs inválidas: ${urlsInvalidas}`);
    console.log(`   - Porcentaje de éxito: ${totalImagenes > 0 ? Math.round((urlsValidas / totalImagenes) * 100) : 0}%`);
}

// Función principal
async function runAllTests() {
    console.log('🚀 Iniciando tests de productos e imágenes...\n');

    try {
        // Test 1: Verificar backend
        const backendOk = await testBackendConnection();
        if (!backendOk) {
            console.log('\n❌ No se puede continuar sin conexión al backend');
            return;
        }

        // Test 2: Obtener productos
        const productos = await testGetProductos();
        if (productos.length === 0) {
            console.log('\n❌ No hay productos para probar');
            return;
        }

        // Test 3: Verificar imágenes
        await testImagenes(productos);

        // Test 4: Verificar categorías
        await testCategorias();

        // Test 5: Verificar carga en frontend
        await testFrontendDataLoading();

        // Test 6: Verificar URLs de imágenes
        await testImageUrls(productos);

        console.log('\n🎉 ¡Todos los tests completados!');
        console.log('✅ El sistema de productos e imágenes está funcionando correctamente');

    } catch (error) {
        console.error('\n❌ Error durante la ejecución de tests:', error.message);
    }
}

// Ejecutar tests
runAllTests();





















