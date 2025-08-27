import React, { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import PaymentModal from './PaymentModal';
import FacturaModal from './FacturaModal';
import { productosAPI, categoriasAPI } from '../services/api';
import { crearFactura } from '../services/facturaService';
import type { Producto, Categoria } from '../types/productos.types';
import type { Factura, FacturaRequest } from '../types/factura.types';

interface CartItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

const POSSystem: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [facturaGenerada, setFacturaGenerada] = useState<Factura | null>(null);
  const [processingFactura, setProcessingFactura] = useState(false);

  // Cargar productos y categorías
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productosData, categoriasData] = await Promise.all([
          productosAPI.getAll(),
          categoriasAPI.getAll()
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar productos
  const filteredProductos = productos.filter(producto => {
    const matchesCategory = !selectedCategory || producto.id_categoria === selectedCategory;
    const matchesSearch = !searchQuery || 
      producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Agregar producto al carrito
  const addToCart = (producto: Producto) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.producto.id_producto === producto.id_producto);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.producto.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          producto,
          cantidad: 1,
          precioUnitario: producto.precio_venta
        }];
      }
    });
  };

  // Actualizar cantidad en carrito
  const updateQuantity = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.producto.id_producto === productoId
          ? { ...item, cantidad }
          : item
      )
    );
  };

  // Remover producto del carrito
  const removeFromCart = (productoId: number) => {
    setCart(prevCart => prevCart.filter(item => item.producto.id_producto !== productoId));
  };

  // Calcular total del carrito
  const cartTotal = cart.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
  };

  // Finalizar venta
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  // Procesar factura después del pago
  const handlePaymentComplete = async (paymentMethod: string) => {
    try {
      setProcessingFactura(true);
      
      // Preparar datos para la factura
      const facturaData: FacturaRequest = {
        productos: cart.map(item => ({
          id_producto: item.producto.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precioUnitario,
          subtotal: item.precioUnitario * item.cantidad
        })),
        total: cartTotal * 1.21, // Incluir IVA
        metodo_pago: paymentMethod,
        cliente_id: undefined // Por ahora sin cliente específico
      };

      // Crear factura en el backend
      const response = await crearFactura(facturaData);
      
      if (response.success) {
        setFacturaGenerada(response.factura);
        setShowFacturaModal(true);
        clearCart();
      }
    } catch (error) {
      console.error('Error al crear factura:', error);
      alert('Error al generar la factura. Por favor, intente nuevamente.');
    } finally {
      setProcessingFactura(false);
    }
  };

  // Cerrar modal de factura
  const handleFacturaClose = () => {
    setShowFacturaModal(false);
    setFacturaGenerada(null);
  };

  // Factura completada
  const handleFacturaCompletada = () => {
    setShowFacturaModal(false);
    setFacturaGenerada(null);
    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sistema POS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header del POS */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">🏪 Sistema POS - Supermercado</h1>
          <p className="text-blue-100">Punto de Venta</p>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel izquierdo - Productos */}
          <div className="lg:col-span-3 space-y-4">
            {/* Barra de búsqueda y filtros */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <SearchBar onSearch={setSearchQuery} />
              <div className="mt-4">
                <CategoryFilter
                  categorias={categorias}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>

            {/* Grid de productos */}
            <ProductGrid
              productos={filteredProductos}
              onAddToCart={addToCart}
            />
          </div>

          {/* Panel derecho - Carrito */}
          <div className="lg:col-span-1">
            <Cart
              items={cart}
              total={cartTotal}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Modal de pago */}
      {showPaymentModal && (
        <PaymentModal
          cart={cart}
          total={cartTotal}
          onClose={() => setShowPaymentModal(false)}
          onComplete={handlePaymentComplete}
          processing={processingFactura}
        />
      )}

      {/* Modal de factura */}
      {showFacturaModal && facturaGenerada && (
        <FacturaModal
          isOpen={showFacturaModal}
          onClose={handleFacturaClose}
          factura={facturaGenerada}
          onFacturaCompletada={handleFacturaCompletada}
        />
      )}
    </div>
  );
};

export default POSSystem;

