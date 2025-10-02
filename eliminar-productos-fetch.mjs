async function eliminarProductosTest() {
    try {
        console.log('🔍 Buscando productos con "Test Producto con Variante"...');

        // Obtener todos los productos
        const response = await fetch('http://localhost:3001/api/productos');

        if (!response.ok) {
            console.error('❌ Error obteniendo productos:', response.status, response.statusText);
            console.log('💡 Asegúrate de que el backend esté ejecutándose en http://localhost:3001');
            return;
        }

        const productos = await response.json();
        console.log(`📦 Total de productos en la base de datos: ${productos.length}`);

        // Filtrar productos problemáticos
        const productosProblematicos = productos.filter(p =>
            p.descripcion && p.descripcion.includes('Test Producto con Variante')
        );

        console.log(`🔍 Productos problemáticos encontrados: ${productosProblematicos.length}`);

        if (productosProblematicos.length === 0) {
            console.log('✅ No hay productos problemáticos que eliminar');
            return;
        }

        productosProblematicos.forEach(producto => {
            console.log(`📦 ID: ${producto.id_producto}, Descripción: ${producto.descripcion}, Stock: ${producto.stock}`);
        });

        console.log('\n🗑️ Eliminando productos...');

        // Eliminar cada producto
        for (const producto of productosProblematicos) {
            try {
                console.log(`🗑️ Eliminando producto ID: ${producto.id_producto} - ${producto.descripcion}`);

                const deleteResponse = await fetch(`http://localhost:3001/api/productos/${producto.id_producto}`, {
                    method: 'DELETE'
                });

                if (deleteResponse.ok) {
                    console.log(`✅ Producto ${producto.id_producto} eliminado exitosamente`);
                } else {
                    console.error(`❌ Error eliminando producto ${producto.id_producto}:`, deleteResponse.status);
                    const errorText = await deleteResponse.text();
                    console.error('Detalle del error:', errorText);
                }

                // Pequeña pausa entre eliminaciones
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (error) {
                console.error(`❌ Error eliminando producto ${producto.id_producto}:`, error.message);
            }
        }

        console.log('\n🔍 Verificando eliminación...');

        // Verificar que se eliminaron
        const verifyResponse = await fetch('http://localhost:3001/api/productos');
        const productosActualizados = await verifyResponse.json();

        const productosRestantes = productosActualizados.filter(p =>
            p.descripcion && p.descripcion.includes('Test Producto con Variante')
        );

        console.log(`🔍 Productos restantes con "Test Producto con Variante": ${productosRestantes.length}`);

        if (productosRestantes.length === 0) {
            console.log('✅ ¡Todos los productos problemáticos han sido eliminados exitosamente!');
            console.log('🎉 Los productos ya no deberían aparecer en la página web');
        } else {
            console.log('⚠️  Aún quedan productos por eliminar');
            productosRestantes.forEach(p => {
                console.log(`📦 ID: ${p.id_producto}, Descripción: ${p.descripcion}`);
            });
        }

    } catch (error) {
        console.error('❌ Error en el proceso:', error.message);
        console.log('💡 Asegúrate de que el backend esté ejecutándose en http://localhost:3001');
    }
}

eliminarProductosTest();





