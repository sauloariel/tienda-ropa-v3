import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { productosAPI, categoriasAPI } from './services/api';
import type { Producto, Categoria } from './types/productos.types';
import { parsePrice } from './utils/priceUtils';
import ProductCard from './components/ProductCard';
import Header from './components/Header';
import Footer from './components/Footer';
import POSSystem from './components/POSSystem';
import Cart from './components/Cart';
import ClientCart from './components/ClientCart';
import ClientLogin from './components/ClientLogin';
import CheckoutFlow from './components/CheckoutFlow';
import OrderTracking from './components/OrderTracking';
import ProductDebug from './components/ProductDebug';
import ClientPanel from './components/ClientPanel';
import Pagination from './components/Pagination';
import CartModal from './components/CartModal';
import ResetPassword from './components/ResetPassword';
import EmailVerification from './components/EmailVerification';
import { usePagination } from './hooks/usePagination';
import { useURLFilters } from './hooks/useURLFilters';
import { useEscapeKey } from './hooks/useEscapeKey';
import { ClientAuthProvider, useClientAuth } from './contexts/ClientAuthContext';

interface CartItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

// Componente interno que usa el contexto de autenticación
function AppContent() {
  const { isAuthenticated, isLoading: authLoading, cliente, logout } = useClientAuth();
  const [currentView, setCurrentView] = useState<'tienda' | 'pos' | 'seguimiento'>('tienda');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategoria] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar filtros sincronizados con URL
  const { 
    filters: { categoria: selectedCategory, busqueda: searchQuery, pagina },
    changeCategory,
    changeSearch,
    changePage
  } = useURLFilters();
  
  // Estados del carrito
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

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

  // Manejar tecla Escape para ir a la página principal
  useEscapeKey(() => {
    console.log('🔙 Tecla Escape presionada - yendo a página principal');
    handleViewChange('tienda');
    // Limpiar cualquier modal o estado abierto
    setShowCheckout(false);
    setShowCartModal(false);
  });

  // Filtrar productos por categoría, búsqueda y estado activo
  const filteredProductos = productos.filter(producto => {
    // Filtrar por categoría
    const matchesCategory = !selectedCategory || producto.id_categoria === selectedCategory;
    
    // Filtrar por búsqueda en la descripción del producto
    const matchesSearch = !searchQuery || 
      producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrar solo productos activos
    const isActive = !producto.estado || producto.estado === 'ACTIVO';
    
    return matchesCategory && matchesSearch && isActive;
  });

  // Paginación - 15 productos por página
  const {
    currentItems: paginatedProductos,
    currentPage: currentPageFromPagination,
    totalPages,
    totalItems,
    goToPage: goToPageFromPagination,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    startIndex,
    endIndex
  } = usePagination({
    items: filteredProductos,
    itemsPerPage: 15,
    initialPage: pagina
  });

  // Sincronizar página de URL con paginación
  const currentPage = pagina;
  const goToPage = (page: number) => {
    changePage(page);
  };

  // Las funciones de manejo ahora vienen del hook useURLFilters
  const handleCategoryChange = changeCategory;
  const handleSearch = changeSearch;


  const handleViewChange = (view: 'tienda' | 'pos' | 'seguimiento') => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('tienda');
  };

  // Función para parsear precios
  const parsePrice = (price: any): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const parsed = parseFloat(price.replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Funciones del carrito
  const addToCart = (producto: Producto) => {
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
          precioUnitario: parsePrice(producto.precio_venta)
        }];
      }
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(items => items.filter(item => item.producto.id_producto !== productId));
    } else {
      setCartItems(items =>
        items.map(item =>
          item.producto.id_producto === productId
            ? { ...item, cantidad: quantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(items => items.filter(item => item.producto.id_producto !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    setShowCartModal(false);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = (numeroPedido: string) => {
    setLastOrderNumber(numeroPedido);
    setShowCheckout(false);
    clearCart();
    // Mostrar mensaje de éxito
    alert(`¡Pedido confirmado! Número: ${numeroPedido}`);
  };

  // Funciones de favoritos
  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const precio = parsePrice(item.precioUnitario);
    return total + (precio * item.cantidad);
  }, 0);
  const favoritesCount = favorites.length;


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
      <div className="min-h-screen relative">
        {/* Imagen de fondo */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/background-fashion.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.3
          }}
        />
        
        {/* Contenido principal con overlay */}
        <div className="relative z-10 bg-white/80 backdrop-blur-sm min-h-screen">
          <Header 
            onLoginClick={() => handleViewChange('pos')}
            onLogoutClick={handleLogout}
            onViewChange={handleViewChange}
            currentView={currentView}
            isAuthenticated={isAuthenticated}
            userInfo={isAuthenticated && cliente ? { nombre: cliente.nombre, apellido: cliente.apellido } : undefined}
            onSearch={handleSearch}
            categorias={categorias}
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
            cartItems={cartItems}
            onCartClick={() => setShowCartModal(true)}
          />
          
          <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-12 py-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                MaruchiModa
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
                Descubre las últimas tendencias en moda. Ropa de calidad para todos los estilos.
              </p>
              
            </div>
          </section>

          {/* Lista de productos */}
          <div className="max-w-7xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory 
                    ? `Productos en ${categorias.find(c => c.id_categoria === selectedCategory)?.nombre_categoria}`
                    : 'Todos los Productos'
                  }
                </h2>
                <span className="text-gray-600">
                  {totalItems} producto{totalItems !== 1 ? 's' : ''}
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProductos.map((producto) => (
                      <ProductCard 
                        key={producto.id_producto} 
                        producto={producto}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                  
                  {/* Componente de paginación */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    onPrev={prevPage}
                    onNext={nextPage}
                    canGoPrev={canGoPrev}
                    canGoNext={canGoNext}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={totalItems}
                  />
                </>
              )}
              </div>
          </div>
          </main>

          <Footer />
        </div>

        {/* Modal del carrito */}
        <CartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
          items={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
        />
      </div>
    );
  };

  // Renderizar vista del sistema POS (acceso libre para empleados)
  const renderPOSSystem = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onLoginClick={() => handleViewChange('pos')}
          onViewChange={handleViewChange}
          currentView={currentView}
          isAuthenticated={isAuthenticated}
          userInfo={isAuthenticated ? { nombre: 'Usuario', apellido: 'Cliente' } : undefined}
          onSearch={handleSearch}
          categorias={categorias}
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />
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
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onLoginClick={() => handleViewChange('pos')}
          onViewChange={handleViewChange}
          currentView={currentView}
          isAuthenticated={isAuthenticated}
          userInfo={isAuthenticated ? { nombre: 'Usuario', apellido: 'Cliente' } : undefined}
          onSearch={handleSearch}
          categorias={categorias}
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />
        <OrderTracking />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido según la vista seleccionada */}
      {currentView === 'tienda' && renderTiendaWeb()}
      {currentView === 'pos' && (isAuthenticated ? 
        <ClientPanel 
          onViewChange={handleViewChange}
          currentView={currentView}
          isAuthenticated={isAuthenticated}
          userInfo={isAuthenticated ? { nombre: 'Usuario', apellido: 'Cliente' } : undefined}
        /> 
        : <ClientLogin />
      )}
      {currentView === 'seguimiento' && renderSeguimiento()}

      {/* Modal de checkout */}
      <CheckoutFlow
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={cartItems}
        total={cartTotal}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Debug de productos */}
      <ProductDebug />
    </div>
  );
}

// Componente principal que envuelve todo con el provider de autenticación
function App() {
  return (
    <ClientAuthProvider>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </ClientAuthProvider>
  );
}

export default App;
