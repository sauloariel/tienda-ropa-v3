import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Receipt, 
  Search, 
  User, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  AlertCircle,
  Truck,
  CreditCard
} from 'lucide-react';
import { pedidosAPI, facturasAPI } from '../services/api';
import { parsePrice } from '../utils/priceUtils';
import { useClientAuth } from '../contexts/ClientAuthContext';
import Header from './Header';

interface Pedido {
  id_pedido: number;
  numero_pedido: string;
  estado: string;
  fecha_pedido: string;
  importe: string;
  direccion_entrega?: string;
  horario_recepcion?: string;
  cliente: {
    id_cliente: number;
    nombre: string;
    apellido: string;
    mail: string;
    telefono: string;
    domicilio?: string;
  };
  items: Array<{
    id: number;
    cantidad: number;
    precio_venta: string;
    producto: {
      id_producto: number;
      descripcion: string;
    };
  }>;
  historial: Array<{
    estado: string;
    fecha: string;
    descripcion: string;
  }>;
}

interface Factura {
  id: number;
  numeroFactura: string;
  fecha: string;
  total: number;
  metodo_pago: string;
  estado: string;
  cliente: {
    id_cliente: number;
    nombre: string;
    apellido: string;
    mail: string;
    telefono: string;
    domicilio?: string;
  };
  detalles: Array<{
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    producto: {
      id_producto: number;
      descripcion: string;
      precio_venta: number;
    };
  }>;
}

interface ClientPanelProps {
  onViewChange?: (view: 'tienda' | 'pos' | 'seguimiento') => void;
  currentView?: 'tienda' | 'pos' | 'seguimiento';
  isAuthenticated?: boolean;
  userInfo?: {
    nombre: string;
    apellido: string;
  };
}

const ClientPanel: React.FC<ClientPanelProps> = ({ 
  onViewChange, 
  currentView = 'pos', 
  isAuthenticated = false, 
  userInfo 
}) => {
  const { cliente } = useClientAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [activeTab, setActiveTab] = useState<'pedidos' | 'facturas'>('pedidos');

  // Usar datos reales del cliente autenticado
  const clienteInfo = cliente ? {
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    email: cliente.mail,
    telefono: cliente.telefono
  } : {
    nombre: 'Usuario',
    apellido: 'Cliente',
    email: 'usuario@ejemplo.com',
    telefono: '1234567890'
  };

  useEffect(() => {
    loadData();
  }, [cliente]);

  const loadData = async () => {
    if (!cliente) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Cargar pedidos y facturas en paralelo
      const [pedidosResponse, facturasResponse] = await Promise.all([
        pedidosAPI.getByCliente(cliente.id_cliente),
        facturasAPI.getByCliente(cliente.id_cliente)
      ]);
      
      if (pedidosResponse.success) {
        // Mapear los datos de pedidos para que coincidan con la interfaz
        const pedidosMapeados = (pedidosResponse.pedidos || []).map((pedido: any) => ({
          id_pedido: pedido.id_pedido,
          numero_pedido: pedido.id_pedido.toString(), // Usar ID como número de pedido
          estado: pedido.estado,
          fecha_pedido: pedido.fecha_pedido,
          importe: pedido.importe.toString(),
          direccion_entrega: pedido.direccion_entrega,
          horario_recepcion: pedido.horario_recepcion,
          cliente: pedido.cliente,
          items: (pedido.detalle || []).map((detalle: any) => ({
            id: detalle.id_detalle,
            cantidad: detalle.cantidad,
            precio_venta: detalle.precio_venta.toString(),
            producto: {
              id_producto: detalle.producto?.id_producto || 0,
              descripcion: detalle.producto?.descripcion || 'Producto no disponible'
            }
          })),
          historial: [] // Por ahora vacío, se puede implementar después
        }));
        setPedidos(pedidosMapeados);
      } else {
        console.warn('No se pudieron cargar los pedidos:', pedidosResponse.message);
        setPedidos([]);
      }
      
      if (facturasResponse.success) {
        // Mapear los datos de facturas para que coincidan con la interfaz
        const facturasMapeadas = (facturasResponse.facturas || []).map((factura: any) => ({
          id: factura.id,
          numeroFactura: factura.numeroFactura,
          fecha: factura.fecha,
          total: factura.total,
          metodo_pago: factura.metodo_pago || 'No especificado',
          estado: factura.estado,
          cliente: factura.cliente,
          detalles: (factura.detalles || []).map((detalle: any) => ({
            id: detalle.id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.subtotal,
            producto: {
              id_producto: detalle.producto?.id_producto || 0,
              descripcion: detalle.producto?.descripcion || 'Producto no disponible',
              precio_venta: detalle.producto?.precio_venta || 0
            }
          }))
        }));
        setFacturas(facturasMapeadas);
      } else {
        console.warn('No se pudieron cargar las facturas:', facturasResponse.message);
        setFacturas([]);
      }
      
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'procesando':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'pendiente':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelado':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'procesando':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoginClick={() => onViewChange?.('pos')}
        onViewChange={onViewChange}
        currentView={currentView}
        isAuthenticated={isAuthenticated}
        userInfo={userInfo}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header del panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
              <p className="text-gray-600">Gestiona tus pedidos y facturas</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Bienvenido</p>
              <p className="text-lg font-semibold text-gray-900">
                {clienteInfo.nombre} {clienteInfo.apellido}
              </p>
            </div>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Información Personal</h3>
                <p className="text-sm text-gray-600">{clienteInfo.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Teléfono</h3>
                <p className="text-sm text-gray-600">{clienteInfo.telefono}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Pedidos Totales</h3>
                <p className="text-2xl font-bold text-gray-900">{pedidos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Búsqueda de pedidos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos por número o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Pestañas de Pedidos y Facturas */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pedidos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-5 w-5 inline mr-2" />
                Mis Pedidos ({pedidos.length})
              </button>
              <button
                onClick={() => setActiveTab('facturas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'facturas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Receipt className="h-5 w-5 inline mr-2" />
                Mis Facturas ({facturas.length})
              </button>
            </nav>
          </div>

          {/* Contenido de las pestañas */}
          {activeTab === 'pedidos' ? (
            <div>
              {error ? (
                <div className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">{error}</p>
                </div>
              ) : filteredPedidos.length === 0 ? (
                <div className="p-6 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tienes pedidos aún</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPedidos.map((pedido) => (
                    <div key={pedido.id_pedido} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getEstadoIcon(pedido.estado)}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Pedido #{pedido.numero_pedido}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(pedido.fecha_pedido).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
                            {pedido.estado}
                          </span>
                          <span className="text-lg font-semibold text-gray-900">
                            ${parsePrice(pedido.importe).toFixed(2)}
                          </span>
                          <button
                            onClick={() => setSelectedPedido(pedido)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {error ? (
                <div className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">{error}</p>
                </div>
              ) : facturas.length === 0 ? (
                <div className="p-6 text-center">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tienes facturas aún</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {facturas.map((factura) => (
                    <div key={factura.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Receipt className="h-5 w-5 text-green-500" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Factura #{factura.numeroFactura}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(factura.fecha).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${parsePrice(factura.total).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {factura.metodo_pago}
                          </p>
                          <button
                            onClick={() => setSelectedFactura(factura)}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal de detalles del pedido */}
        {selectedPedido && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Detalles del Pedido #{selectedPedido.numero_pedido}
                  </h3>
                  <button
                    onClick={() => setSelectedPedido(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Estado actual */}
                <div className="flex items-center space-x-3">
                  {getEstadoIcon(selectedPedido.estado)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(selectedPedido.estado)}`}>
                    {selectedPedido.estado}
                  </span>
                </div>

                {/* Información del pedido */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información del Pedido</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Fecha:</strong> {new Date(selectedPedido.fecha_pedido).toLocaleDateString('es-AR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Total:</strong> ${parsePrice(selectedPedido.importe).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información de Entrega</h4>
                    {selectedPedido.direccion_entrega && (
                      <p className="text-sm text-gray-600">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {selectedPedido.direccion_entrega}
                      </p>
                    )}
                    {selectedPedido.horario_recepcion && (
                      <p className="text-sm text-gray-600">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {selectedPedido.horario_recepcion}
                      </p>
                    )}
                  </div>
                </div>

                {/* Productos del pedido */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Productos</h4>
                  <div className="space-y-2">
                    {selectedPedido.items.map((item, index) => (
                      <div key={`${item.id_producto}-${index}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.producto.descripcion}</p>
                          <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${parsePrice(item.precio_venta).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            Total: ${(parsePrice(item.precio_venta) * item.cantidad).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historial de estados */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Historial del Pedido</h4>
                  <div className="space-y-2">
                    {selectedPedido.historial.map((evento, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        {getEstadoIcon(evento.estado)}
                        <div>
                          <p className="font-medium">{evento.descripcion}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(evento.fecha).toLocaleDateString('es-AR')} - {new Date(evento.fecha).toLocaleTimeString('es-AR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalles de la factura */}
        {selectedFactura && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Factura #{selectedFactura.numeroFactura}
                  </h3>
                  <button
                    onClick={() => setSelectedFactura(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Información de la factura */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información de la Factura</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Fecha:</strong> {new Date(selectedFactura.fecha).toLocaleDateString('es-AR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Total:</strong> ${parsePrice(selectedFactura.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Método de Pago:</strong> {selectedFactura.metodo_pago}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Estado</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedFactura.estado === 'activa' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedFactura.estado}
                    </span>
                  </div>
                </div>

                {/* Productos de la factura */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Productos</h4>
                  <div className="space-y-2">
                    {selectedFactura.detalles.map((detalle) => (
                      <div key={detalle.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{detalle.producto.descripcion}</p>
                          <p className="text-sm text-gray-600">Cantidad: {detalle.cantidad}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${parsePrice(detalle.precio_unitario).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            Total: ${parsePrice(detalle.subtotal).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${parsePrice(selectedFactura.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPanel;
