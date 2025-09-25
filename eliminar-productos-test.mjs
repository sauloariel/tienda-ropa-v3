// Script simple para eliminar productos problemáticos
console.log('🔍 Buscando productos problemáticos...');

// Función para hacer peticiones HTTP usando fetch nativo
async function eliminarProductos() {
  try {
    // Esperar un poco para que el backend se inicie
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📡 Conectando al backend...');
    const response = await fetch('http://localhost:3001/api/productos');
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const productos = await response.json();
    console.log(`📦 Total de productos: ${productos.length}`);
    
    // Buscar productos problemáticos
    const productosProblematicos = productos.filter(p => 
      p.descripcion && (
        p.descripcion.includes('Test Producto con Variante') ||
        p.descripcion.includes('Test actualizado') ||
        p.descripcion.includes('Test')
      )
    );
    
    console.log(`🔍 Productos problemáticos encontrados: ${productosProblematicos.length}`);
    
    if (productosProblematicos.length === 0) {
      console.log('✅ No hay productos problemáticos que eliminar');
      return;
    }
    
    // Mostrar productos encontrados
    productosProblematicos.forEach(p => {
      console.log(`📦 ID: ${p.id_producto}, Descripción: "${p.descripcion}", Stock: ${p.stock}`);
    });
    
    console.log('\n🗑️ Eliminando productos...');
    
    // Eliminar cada producto
    for (const producto of productosProblematicos) {
      try {
        console.log(`🗑️ Eliminando: ${producto.descripcion} (ID: ${producto.id_producto})`);
        
        const deleteResponse = await fetch(`http://localhost:3001/api/productos/${producto.id_producto}`, {
          method: 'DELETE'
        });
        
        if (deleteResponse.ok) {
          console.log(`✅ Eliminado exitosamente`);
        } else {
          const errorText = await deleteResponse.text();
          console.error(`❌ Error: ${deleteResponse.status} - ${errorText}`);
        }
        
        // Pausa entre eliminaciones
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Error eliminando producto ${producto.id_producto}:`, error.message);
      }
    }
    
    // Verificar eliminación
    console.log('\n🔍 Verificando eliminación...');
    const verifyResponse = await fetch('http://localhost:3001/api/productos');
    const productosActualizados = await verifyResponse.json();
    
    const productosRestantes = productosActualizados.filter(p => 
      p.descripcion && (
        p.descripcion.includes('Test Producto con Variante') ||
        p.descripcion.includes('Test actualizado') ||
        p.descripcion.includes('Test')
      )
    );
    
    console.log(`🔍 Productos restantes: ${productosRestantes.length}`);
    
    if (productosRestantes.length === 0) {
      console.log('🎉 ¡Todos los productos problemáticos han sido eliminados!');
      console.log('✅ La página web ya no debería mostrar estos productos');
    } else {
      console.log('⚠️  Aún quedan productos por eliminar:');
      productosRestantes.forEach(p => {
        console.log(`   - ${p.descripcion} (ID: ${p.id_producto})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('💡 Asegúrate de que el backend esté ejecutándose en http://localhost:3001');
  }
}

// Ejecutar
eliminarProductos();