import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Receipt, CreditCard, DollarSign, QrCode, Banknote, X, Plus, Minus, Trash2, CheckCircle, User, Package, AlertTriangle } from 'lucide-react';
import { productosAPI, categoriasAPI } from '../services/api';
import { crearFactura } from '../services/facturaService';
import { stockService } from '../services/stockService';
import { clientesService } from '../services/clientesService';
import type { Producto, Categoria } from '../types/productos.types';
import type { Factura, FacturaRequest } from '../types/factura.types';
import type { Cliente } from '../types/cliente.types';
import ClienteManager from './ClienteManager';
import StockAlerts from './StockAlerts';
import QuickSearch from './QuickSearch';
import POSStats from './POSStats';
import DescuentosManager from './DescuentosManager';
import FacturaSessionInfo from './FacturaSessionInfo';
import { useFacturaSession } from '../hooks/useFacturaSession';

interface CartItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

const POSSystem: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [facturaGenerada, setFacturaGenerada] = useState<Factura | null>(null);
  const [processingFactura, setProcessingFactura] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [stockErrors, setStockErrors] = useState<string[]>([]);
  const [showStockValidation, setShowStockValidation] = useState(false);

  // Hook para manejar la sesión de factura
  const {
    session,
    iniciarSesion,
    agregarItem,
    actualizarCantidad,
    removerItem,
    establecerCliente,
    establecerDescuento,
    establecerMetodoPago,
    limpiarSesion,
    obtenerDatosFactura
  } = useFacturaSession();

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

  // Agregar producto al carrito con validación de stock
  const addToCart = async (producto: Producto) => {
    // Iniciar sesión si no existe
    if (!session.numeroFactura) {
      iniciarSesion();
    }

    // Verificar stock disponible
    const stockDisponible = await stockService.obtenerStock(producto.id_producto);
    const cantidadEnCarrito = session.items.find(item => item.producto.id_producto === producto.id_producto)?.cantidad || 0;
    const cantidadTotal = cantidadEnCarrito + 1;

    if (stockDisponible < cantidadTotal) {
      setStockErrors([...stockErrors, `Stock insuficiente para ${producto.descripcion}. Disponible: ${stockDisponible}`]);
      setShowStockValidation(true);
      return;
    }

    // Agregar item a la sesión
    agregarItem({
      producto,
      cantidad: 1,
      precioUnitario: producto.precio_venta
    });
  };

  // Actualizar cantidad en carrito
  const updateQuantity = (productoId: number, cantidad: number) => {
    actualizarCantidad(productoId, cantidad);
  };

  // Remover producto del carrito
  const removeFromCart = (productoId: number) => {
    removerItem(productoId);
  };

  // Limpiar carrito
  const clearCart = () => {
    limpiarSesion();
  };

  // Finalizar venta con validación de stock
  const handleCheckout = async () => {
    if (session.items.length === 0) return;

    // Validar stock para todos los productos en el carrito
    const items = session.items.map(item => ({
      id_producto: item.producto.id_producto,
      cantidad: item.cantidad
    }));

    const validacionStock = await stockService.validarStockMultiple(items);
    
    if (!validacionStock.valido) {
      const errores = validacionStock.productosSinStock.map(item => 
        `Stock insuficiente para producto ID ${item.id_producto}. Requerido: ${item.cantidadRequerida}, Disponible: ${item.stockDisponible}`
      );
      setStockErrors(errores);
      setShowStockValidation(true);
      return;
    }

    setShowPaymentModal(true);
  };

  // Procesar factura después del pago
  const handlePaymentComplete = async () => {
    try {
      setProcessingFactura(true);
      
      // Obtener datos de la sesión para la factura
      const facturaData = obtenerDatosFactura();

      // Crear factura en el backend
      const response = await crearFactura(facturaData);
      
      if (response.success) {
        setFacturaGenerada(response.factura);
        setShowFacturaModal(true);
        clearCart();
        setShowPaymentModal(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando sistema POS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header del POS */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                🏪 Sistema POS - Supermercado
                <Receipt className="w-10 h-10" />
              </h1>
              <p className="text-blue-100 text-lg mt-2">Punto de Venta con Facturación Integrada</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
              <p className="text-blue-100">Hora: {new Date().toLocaleTimeString('es-ES')}</p>
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
                {/* Búsqueda rápida */}
                <div className="flex-1">
                  <QuickSearch
                    onProductoSeleccionado={addToCart}
                    placeholder="Buscar productos por nombre o código..."
                  />
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
                            ${producto.precio_venta.toFixed(2)}
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

          {/* Panel derecho - Carrito y Facturación */}
          <div className="xl:col-span-1 space-y-6">
            {/* Información de la sesión de factura */}
            <FacturaSessionInfo
              numeroFactura={session.numeroFactura}
              cliente={session.cliente}
              descuento={session.descuento}
              total={session.total}
              itemCount={session.items.reduce((sum, item) => sum + item.cantidad, 0)}
            />

            {/* Estadísticas del POS */}
            <POSStats />
            
            {/* Alertas de Stock */}
            <StockAlerts />
            
            {/* Gestión de Cliente */}
            <ClienteManager
              onClienteSeleccionado={establecerCliente}
              clienteActual={session.cliente}
            />

            {/* Gestión de Descuentos */}
            <DescuentosManager
              total={session.subtotal}
              onDescuentoAplicado={establecerDescuento}
              descuentoActual={session.descuento}
            />

            {/* Carrito de Venta */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Header del carrito */}
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🛒 Carrito de Venta</h2>
                  <p className="text-sm text-gray-600">
                    {session.items.reduce((sum, item) => sum + item.cantidad, 0)} producto{session.items.reduce((sum, item) => sum + item.cantidad, 0) !== 1 ? 's' : ''} en el carrito
                  </p>
                  {session.numeroFactura && (
                    <p className="text-xs text-blue-600 font-medium">
                      Sesión: {session.numeroFactura}
                    </p>
                  )}
                </div>
              </div>

              {/* Lista de items */}
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {session.items.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">🛒</div>
                    <p className="text-gray-500 text-sm">Carrito vacío</p>
                    <p className="text-gray-400 text-xs">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  session.items.map((item) => (
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
                        ${item.precioUnitario.toFixed(2)} c/u
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
                          ${(item.precioUnitario * item.cantidad).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total y acciones */}
              {session.items.length > 0 && (
                <div className="space-y-4">
                  {/* Resumen de totales */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${session.subtotal.toFixed(2)}</span>
                    </div>
                    {session.descuento && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuento:</span>
                        <span className="font-medium">-${(session.subtotal - (session.subtotal - (session.descuento.tipo === 'porcentaje' ? (session.subtotal * session.descuento.valor) / 100 : Math.min(session.descuento.valor, session.subtotal)))).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA (21%):</span>
                      <span className="font-medium">${session.iva.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">${session.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={session.items.length === 0}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                    >
                      <Receipt className="w-5 h-5" />
                      Finalizar Venta y Facturar
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
                      checked={session.metodoPago === method.value}
                      onChange={(e) => establecerMetodoPago(e.target.value)}
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
                onClick={handleFacturaClose}
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
                  Fecha: {new Date(facturaGenerada.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Información del Cliente */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                  Información del Cliente
                </h3>
                {facturaGenerada.cliente ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium text-gray-600">Nombre:</span>
                      <p className="text-gray-800">{facturaGenerada.cliente.nombre}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <p className="text-gray-800">{facturaGenerada.cliente.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Teléfono:</span>
                      <p className="text-gray-800">{facturaGenerada.cliente.telefono || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 font-medium">Cliente: Consumidor Final</p>
                )}
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
                      {facturaGenerada.detalles.map((detalle, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-3 text-gray-800">
                            {detalle.producto?.descripcion || 'Producto'}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                            {detalle.cantidad}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">
                            ${detalle.precio_unitario.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-gray-800 font-medium">
                            ${detalle.subtotal.toFixed(2)}
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
                  Total: ${facturaGenerada.total.toFixed(2)}
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
                <p>Generada el {new Date(facturaGenerada.fecha).toLocaleDateString('es-ES')}</p>
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
                  onClick={handleFacturaClose}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Validación de Stock */}
      {showStockValidation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <h3 className="text-xl font-bold text-gray-800">
                  Error de Stock
                </h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  No se puede completar la operación debido a problemas de stock:
                </p>
                <div className="space-y-2">
                  {stockErrors.map((error, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowStockValidation(false);
                    setStockErrors([]);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Entendido
                </button>
                <button
                  onClick={() => {
                    setShowStockValidation(false);
                    setStockErrors([]);
                    clearCart();
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Limpiar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSSystem;

