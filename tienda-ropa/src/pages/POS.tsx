import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Receipt, 
  CreditCard, 
  DollarSign, 
  QrCode, 
  Banknote, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { productosAPI, categoriasAPI } from '../services/api';
import { crearFactura } from '../services/facturaService';
import { parsePrice } from '../utils/priceUtils';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatNumber, validateStock } from '../config/api';
import type { Producto, Categoria } from '../types/productos.types';
import type { FacturaRequest, FacturaResponse } from '../types/factura.types';

interface CartItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

interface NotificationState {
  type: 'error' | 'notice' | 'success';
  message: string;
  show: boolean;
}

const POS: React.FC = () => {
  // Estados principales
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('efectivo');
  const [selectedCliente, setSelectedCliente] = useState<number | null>(null);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [processingFactura, setProcessingFactura] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [facturaGenerada, setFacturaGenerada] = useState<any>(null);
  
  // Estados de notificaciones
  const [notification, setNotification] = useState<NotificationState>({
    type: 'notice',
    message: '',
    show: false
  });
  
  // Estados de factura
  const [numeroFactura, setNumeroFactura] = useState<string | null>(null);
  const [facturaEnBorrador, setFacturaEnBorrador] = useState(false);

  // Debounce para búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cargar datos iniciales
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
        showNotification('error', 'Error al cargar los datos del sistema');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Función para mostrar notificaciones
  const showNotification = useCallback((type: 'error' | 'notice' | 'success', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  // Filtrar productos con debounce
  const filteredProductos = useMemo(() => {
    return productos.filter(producto => {
      const matchesCategory = !selectedCategory || producto.id_categoria === selectedCategory;
      const matchesSearch = !debouncedSearchTerm || 
        producto.descripcion.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        producto.codigo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [productos, selectedCategory, debouncedSearchTerm]);

  // Cálculos del carrito con useMemo
  const cartCalculations = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
    
    return { subtotal, iva, total };
  }, [cart]);

  // Agregar producto al carrito con validación de stock
  const addToCart = useCallback(async (producto: Producto) => {
    // Validar stock antes de agregar
    const stockValidation = validateStock(producto, 1);
    if (!stockValidation.valid) {
      showNotification('error', stockValidation.message || 'Error de stock');
      return;
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.producto.id_producto === producto.id_producto);
    
    if (existingItem) {
      // Validar stock para la cantidad total
      const newQuantity = existingItem.cantidad + 1;
      const stockValidationTotal = validateStock(producto, newQuantity);
      if (!stockValidationTotal.valid) {
        showNotification('error', stockValidationTotal.message || 'Stock insuficiente');
        return;
      }
      
      // Actualizar cantidad
      setCart(prev => prev.map(item => 
        item.producto.id_producto === producto.id_producto 
          ? { ...item, cantidad: newQuantity }
          : item
      ));
    } else {
      // Agregar nuevo item
      setCart(prev => [...prev, {
        producto,
        cantidad: 1,
        precioUnitario: parsePrice(producto.precio_venta)
      }]);
    }

    // Iniciar sesión de factura si no existe
    if (!facturaEnBorrador) {
      setFacturaEnBorrador(true);
      setNumeroFactura('Borrador');
    }

    showNotification('success', `${producto.descripcion} agregado al carrito`);
  }, [cart, facturaEnBorrador, showNotification]);

  // Actualizar cantidad en carrito
  const updateQuantity = useCallback((productoId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productoId);
      return;
    }

    const item = cart.find(item => item.producto.id_producto === productoId);
    if (!item) return;

    // Validar stock
    const stockValidation = validateStock(item.producto, newQuantity);
    if (!stockValidation.valid) {
      showNotification('error', stockValidation.message || 'Stock insuficiente');
      return;
    }

    setCart(prev => prev.map(item => 
      item.producto.id_producto === productoId 
        ? { ...item, cantidad: newQuantity }
        : item
    ));
  }, [cart, showNotification]);

  // Remover producto del carrito
  const removeFromCart = useCallback((productoId: number) => {
    setCart(prev => prev.filter(item => item.producto.id_producto !== productoId));
  }, []);

  // Limpiar carrito
  const clearCart = useCallback(() => {
    setCart([]);
    setFacturaEnBorrador(false);
    setNumeroFactura(null);
    showNotification('notice', 'Carrito limpiado');
  }, [showNotification]);

  // Finalizar venta
  const handleCheckout = useCallback(() => {
    if (cart.length === 0) {
      showNotification('error', 'El carrito está vacío');
      return;
    }

    // Validar stock para todos los productos
    const stockErrors: string[] = [];
    cart.forEach(item => {
      const stockValidation = validateStock(item.producto, item.cantidad);
      if (!stockValidation.valid) {
        stockErrors.push(`${item.producto.descripcion}: ${stockValidation.message}`);
      }
    });

    if (stockErrors.length > 0) {
      showNotification('error', `Problemas de stock: ${stockErrors.join(', ')}`);
      return;
    }

    setShowPaymentModal(true);
  }, [cart, showNotification]);

  // Procesar factura después del pago
  const handlePaymentComplete = useCallback(async () => {
    try {
      setProcessingFactura(true);
      
      // Preparar datos de la factura
      const facturaData: FacturaRequest = {
        productos: cart.map(item => ({
          id_producto: item.producto.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precioUnitario,
          subtotal: item.precioUnitario * item.cantidad
        })),
        total: cartCalculations.total,
        metodo_pago: selectedPaymentMethod,
        cliente_id: selectedCliente
      };

      console.log('🔄 Creando factura con datos:', facturaData);

      // Crear factura en el backend
      const response: FacturaResponse = await crearFactura(facturaData);
      
      if (response.success) {
        setFacturaGenerada(response.factura);
        setShowFacturaModal(true);
        setShowPaymentModal(false);
        clearCart();
        showNotification('success', `Factura ${response.factura.numeroFactura} generada exitosamente`);
      } else {
        showNotification('error', response.message || 'Error al generar la factura');
      }
    } catch (error: any) {
      console.error('Error al crear factura:', error);
      showNotification('error', error.message || 'Error al generar la factura');
    } finally {
      setProcessingFactura(false);
    }
  }, [cart, cartCalculations.total, selectedPaymentMethod, selectedCliente, clearCart, showNotification]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K para búsqueda
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }
      
      // Ctrl+Enter para cobrar
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (!processingFactura && cart.length > 0) {
          handleCheckout();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCheckout, processingFactura, cart.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando sistema de inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Notificaciones */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' :
          notification.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' :
          'bg-blue-100 border-blue-500 text-blue-700'
        } border-l-4`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                🔐 Iniciar Sesión
                <Receipt className="w-10 h-10" />
              </h1>
              <p className="text-blue-100 text-lg mt-2">Punto de Venta con Facturación Integrada</p>
            </div>
            <div className="text-right">
              <div className="text-sm">
                <div>N.º {numeroFactura || 'Sin factura'}</div>
                <div>Fecha: {new Date().toLocaleDateString('es-AR')}</div>
                <div>Hora: {new Date().toLocaleTimeString('es-AR')}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Panel izquierdo - Productos */}
          <div className="xl:col-span-3 space-y-6">
            {/* Barra de búsqueda y filtros */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Búsqueda */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Buscar productos (Ctrl+K)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Filtro de categorías */}
                <div className="lg:w-64">
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id_categoria} value={categoria.id_categoria}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Grid de productos */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📦 Productos Disponibles
                <span className="text-sm font-normal text-gray-500">
                  ({filteredProductos.length} productos)
                </span>
              </h2>
              
              {filteredProductos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 text-lg">No se encontraron productos</p>
                  <p className="text-gray-400">Intenta cambiar los filtros de búsqueda</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProductos.map((producto) => (
                    <div
                      key={producto.id_producto}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                      onClick={() => addToCart(producto)}
                    >
                      {/* Imagen del producto */}
                      <div className="h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-xl flex items-center justify-center">
                        <div className="text-4xl">👕</div>
                      </div>
                      
                      {/* Información del producto */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                          {producto.descripcion}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {categorias.find(c => c.id_categoria === producto.id_categoria)?.nombre || 'Sin categoría'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            producto.stock > 10 ? 'bg-green-100 text-green-700' :
                            producto.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            Stock: {producto.stock}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            {formatCurrency(producto.precio_venta)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(producto);
                            }}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors group-hover:scale-110 transform duration-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho - Carrito */}
          <div className="xl:col-span-1 space-y-6">
            {/* Carrito de Venta */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Header del carrito */}
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🛒 Carrito de Venta</h2>
                  <p className="text-sm text-gray-600">
                    {cart.reduce((sum, item) => sum + item.cantidad, 0)} producto{cart.reduce((sum, item) => sum + item.cantidad, 0) !== 1 ? 's' : ''} en el carrito
                  </p>
                </div>
              </div>

              {/* Lista de items */}
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">🛒</div>
                    <p className="text-gray-500 text-sm">Carrito vacío</p>
                    <p className="text-gray-400 text-xs">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.producto.id_producto} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight flex-1">
                          {item.producto.descripcion}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.producto.id_producto)}
                          className="text-red-500 hover:text-red-700 ml-2 p-1 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-gray-600 mb-2">
                        {formatCurrency(item.precioUnitario)} c/u
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.producto.id_producto, item.cantidad - 1)}
                            className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="text-sm font-medium min-w-[2rem] text-center">
                            {item.cantidad}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.producto.id_producto, item.cantidad + 1)}
                            className="w-6 h-6 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-sm font-bold text-blue-600">
                          {formatCurrency(item.precioUnitario * item.cantidad)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total y acciones */}
              {cart.length > 0 && (
                <div className="space-y-4">
                  {/* Resumen de totales */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(cartCalculations.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA (21%):</span>
                      <span className="font-medium">{formatCurrency(cartCalculations.iva)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatCurrency(cartCalculations.total)}</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={cart.length === 0 || processingFactura}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                    >
                      <Receipt className="w-5 h-5" />
                      Cobrar (Ctrl+Enter)
                    </button>
                    
                    <button
                      onClick={clearCart}
                      className="w-full bg-gray-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-600 active:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpiar Carrito
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                Método de Pago
              </h3>
              
              <div className="space-y-3 mb-6">
                {[
                  { value: 'efectivo', label: 'Efectivo', icon: DollarSign, color: 'bg-green-100 text-green-700' },
                  { value: 'tarjeta', label: 'Tarjeta', icon: CreditCard, color: 'bg-blue-100 text-blue-700' },
                  { value: 'transferencia', label: 'Transferencia', icon: Banknote, color: 'bg-purple-100 text-purple-700' },
                  { value: 'qr', label: 'QR/Pago Móvil', icon: QrCode, color: 'bg-orange-100 text-orange-700' }
                ].map((method) => (
                  <label key={method.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={selectedPaymentMethod === method.value}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <method.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePaymentComplete}
                  disabled={processingFactura}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {processingFactura ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirmar Pago
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Factura */}
      {showFacturaModal && facturaGenerada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">¡Venta Completada!</h2>
                  <p className="text-gray-600">Factura generada exitosamente</p>
                </div>
              </div>
              <button
                onClick={() => setShowFacturaModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido de la Factura */}
            <div className="p-6">
              {/* Encabezado de la Factura */}
              <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">FACTURA</h1>
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                  {facturaGenerada.numeroFactura}
                </h2>
                <p className="text-gray-600">
                  Fecha: {new Date(facturaGenerada.fecha).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Detalle de Productos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                  Detalle de Productos
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                          Producto
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                          Cantidad
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">
                          Precio Unit.
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {facturaGenerada.detalles.map((detalle: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-3 text-gray-800">
                            {detalle.producto?.descripcion || 'Producto'}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                            {detalle.cantidad}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">
                            {formatCurrency(detalle.precio_unitario)}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-gray-800 font-medium">
                            {formatCurrency(detalle.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumen y Total */}
              <div className="text-right border-t-2 border-gray-300 pt-6">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  Total: {formatCurrency(facturaGenerada.total)}
                </div>
                <div className="text-gray-600 space-y-1">
                  <p>Método de Pago: <span className="font-medium">{facturaGenerada.metodo_pago}</span></p>
                  <p>Estado: <span className="font-medium text-green-600">{facturaGenerada.estado}</span></p>
                </div>
              </div>

              {/* Mensaje de agradecimiento */}
              <div className="mt-8 text-center text-gray-600">
                <p className="text-lg">¡Gracias por su compra!</p>
                <p className="text-sm">Esta factura fue generada automáticamente por el sistema POS</p>
              </div>
            </div>

            {/* Footer con Botones */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                <p>Factura #{facturaGenerada.numeroFactura}</p>
                <p>Generada el {new Date(facturaGenerada.fecha).toLocaleDateString('es-AR')}</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>
                
                <button
                  onClick={() => setShowFacturaModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;



