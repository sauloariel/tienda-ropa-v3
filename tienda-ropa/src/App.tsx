import React, { useState, useEffect } from 'react';
import { productosAPI, categoriasAPI } from './services/api';
import type { Producto, Categoria } from './types/productos.types';
import ProductCard from './components/ProductCard';
import CategoryFilter from './components/CategoryFilter';
import ColorFilter from './components/ColorFilter';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import Footer from './components/Footer';
import POSSystem from './components/POSSystem';
import AppNavigation from './components/AppNavigation';
import Cart from './components/Cart';
import ClientCart from './components/ClientCart';
import ClientLogin from './components/ClientLogin';
import CheckoutModal from './components/CheckoutModal';
import OrderTracking from './components/OrderTracking';
import { ClientAuthProvider, useClientAuth } from './contexts/ClientAuthContext';

interface CartItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

// Componente interno que usa el contexto de autenticación
function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useClientAuth();
  const [currentView, setCurrentView] = useState<'tienda' | 'pos' | 'seguimiento'>('tienda');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategoria] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados del carrito
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null);

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
          console.log('Primeros productos:', productosData.slice(0, 3));
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

  // Filtrar productos por categoría, colores y búsqueda
  const filteredProductos = productos.filter(producto => {
    // Filtrar por categoría
    const matchesCategory = !selectedCategory || producto.id_categoria === selectedCategory;
    
    // Filtrar por búsqueda en la descripción del producto
    const matchesSearch = !searchQuery || 
      producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrar por colores
    const matchesColors = selectedColors.length === 0 || 
      producto.variantes?.some(variante => 
        variante.color?.nombre && selectedColors.includes(variante.color.nombre)
      ) || false;
    
    return matchesCategory && matchesSearch && matchesColors;
  });

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleColorChange = (colors: string[]) => {
    setSelectedColors(colors);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Obtener todos los colores disponibles de los productos
  const availableColors = productos.reduce((colors: string[], producto) => {
    if (producto.variantes) {
      producto.variantes.forEach(variante => {
        if (variante.color?.nombre && !colors.includes(variante.color.nombre)) {
          colors.push(variante.color.nombre);
        }
      });
    }
    return colors;
  }, []);

  const handleViewChange = (view: 'tienda' | 'pos' | 'seguimiento') => {
    setCurrentView(view);
  };

  // Funciones del carrito
  const addToCart = (producto: Producto) => {
    // Validar que el producto sea válido
    if (!producto || !producto.id_producto || !producto.descripcion) {
      console.error('Producto inválido para agregar al carrito:', producto);
      return;
    }

    // Asegurar que el precio sea un número válido
    const precioValido = typeof producto.precio_venta === 'number' && !isNaN(producto.precio_venta) 
      ? producto.precio_venta 
      : 0;

    console.log('Agregando producto al carrito:', {
      id: producto.id_producto,
      descripcion: producto.descripcion,
      precio_venta: producto.precio_venta,
      precioValido: precioValido
    });

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.producto.id_producto === producto.id_producto);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.producto.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevItems, {
          producto,
          cantidad: 1,
          precioUnitario: precioValido
        }];
      }
    });
  };

  const updateCartQuantity = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.producto.id_producto === productoId
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const removeFromCart = (productoId: number) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.producto.id_producto !== productoId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = (numeroPedido: string) => {
    setLastOrderNumber(numeroPedido);
    setShowCheckout(false);
    clearCart();
    // Mostrar mensaje de éxito o redirigir
    alert(`¡Pedido confirmado! Número: ${numeroPedido}`);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const precioValido = typeof item.precioUnitario === 'number' && !isNaN(item.precioUnitario) ? item.precioUnitario : 0;
    const cantidadValida = typeof item.cantidad === 'number' && !isNaN(item.cantidad) ? item.cantidad : 0;
    return total + (precioValido * cantidadValida);
  }, 0);

  // Renderizar vista de la tienda web
  const renderTiendaWeb = () => {
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
      <>
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
            <aside className="lg:col-span-1 space-y-6">
              <CategoryFilter 
                categorias={categorias}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              
              {availableColors.length > 0 && (
                <ColorFilter
                  colores={availableColors}
                  selectedColors={selectedColors}
                  onColorChange={handleColorChange}
                />
              )}
            </aside>

            {/* Lista de productos */}
            <div className="lg:col-span-2">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProductos.map((producto) => (
                    <ProductCard 
                      key={producto.id_producto} 
                      producto={producto}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Carrito de compras */}
            <aside className="lg:col-span-1">
              <Cart
                items={cartItems}
                total={cartTotal}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
                onCheckout={handleCheckout}
              />
            </aside>
          </div>
        </main>

        <Footer />
      </>
    );
  };

  // Renderizar vista del sistema POS
  const renderPOSSystem = () => {
    // Si no está autenticado, mostrar login de clientes
    if (!isAuthenticated) {
      return <ClientLogin />;
    }
    
    // Si está autenticado, mostrar el carrito de compras para clientes
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productos.map((producto) => (
                    <ProductCard 
                      key={producto.id_producto} 
                      producto={producto}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Carrito de compras para clientes */}
            <aside className="lg:col-span-1">
              <ClientCart
                items={cartItems}
                total={cartTotal}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
                onCheckout={handleCheckout}
              />
            </aside>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar vista de seguimiento de pedidos
  const renderSeguimiento = () => {
    return <OrderTracking />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación principal */}
      <AppNavigation 
        currentView={currentView} 
        onViewChange={handleViewChange} 
      />
      
      {/* Contenido según la vista seleccionada */}
      {currentView === 'tienda' && renderTiendaWeb()}
      {currentView === 'pos' && renderPOSSystem()}
      {currentView === 'seguimiento' && renderSeguimiento()}

      {/* Modal de checkout */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={cartItems}
        total={cartTotal}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}

// Componente principal que envuelve todo con el provider de autenticación
function App() {
  return (
    <ClientAuthProvider>
      <AppContent />
    </ClientAuthProvider>
  );
}

export default App;
