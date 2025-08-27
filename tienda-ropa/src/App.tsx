import React, { useState, useEffect } from 'react';
import { productosAPI, categoriasAPI } from './services/api';
import type { Producto, Categoria } from './types/productos.types';
import ProductCard from './components/ProductCard';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategoria] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Intentar cargar desde el backend primero
        try {
          const [productosData, categoriasData] = await Promise.all([
            productosAPI.getAll(),
            categoriasAPI.getAll()
          ]);
          setProductos(productosData);
          setCategoria(categoriasData);
          console.log('Datos cargados desde el backend:', productosData.length, 'productos,', categoriasData.length, 'categorías');
        } catch (backendError) {
          console.error('Error del backend:', backendError);
          setError('Error al conectar con el servidor. Por favor, verifica que el backend esté funcionando.');
        }
        
      } catch (err) {
        setError('Error al cargar los productos. Por favor, inténtalo de nuevo.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar productos por categoría y búsqueda
  const filteredProductos = productos.filter(producto => {
    // Filtrar por categoría
    const matchesCategory = !selectedCategory || producto.id_categoria === selectedCategory;
    
    // Filtrar por búsqueda en la descripción del producto
    const matchesSearch = !searchQuery || 
      producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Tienda de Ropa
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre las últimas tendencias en moda. Ropa de calidad para todos los estilos.
          </p>
          
          {/* Barra de búsqueda */}
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* Filtros y Productos */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar con filtros */}
          <aside className="lg:col-span-1">
            <CategoryFilter 
              categorias={categorias}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </aside>

          {/* Lista de productos */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory 
                  ? `Productos en ${categorias.find(c => c.id_categoria === selectedCategory)?.nombre_categoria}`
                  : 'Todos los Productos'
                }
              </h2>
              <span className="text-gray-600">
                {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredProductos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? `No hay productos que coincidan con "${searchQuery}"`
                    : 'No hay productos disponibles en esta categoría'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProductos.map((producto) => (
                  <ProductCard key={producto.id_producto} producto={producto} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
