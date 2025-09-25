import React, { useState } from 'react';
import { Search, Clock, CheckCircle, Package, Truck, XCircle, User, MapPin, Calendar } from 'lucide-react';
import { pedidosAPI } from '../services/api';

interface OrderTrackingProps {}

interface PedidoItem {
  id_producto: number;
  cantidad: number;
  precio_venta: number;
  producto: {
    id_producto: number;
    descripcion: string;
    precio_venta: number;
  };
}

interface HistorialItem {
  estado: string;
  fecha: string;
  descripcion: string;
}

interface Pedido {
  id_pedido: number;
  numero_pedido: string;
  estado: string;
  fecha_pedido: string;
  importe: number;
  direccion_entrega?: string;
  horario_recepcion?: string;
  cliente: {
    id_cliente: number;
    nombre: string;
    apellido: string;
    mail: string;
    telefono: string;
    domicilio?: string;
    dni?: string;
  };
  items: PedidoItem[];
  historial: HistorialItem[];
}

const OrderTracking: React.FC<OrderTrackingProps> = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('Por favor ingresa un número de pedido');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Buscando pedido:', orderNumber);
      const response = await pedidosAPI.getByNumber(orderNumber);
      
      if (response.success) {
        setOrder(response.pedido);
        console.log('✅ Pedido encontrado:', response.pedido);
      } else {
        setError(response.message || 'Pedido no encontrado');
      }
    } catch (err: any) {
      console.error('❌ Error al buscar pedido:', err);
      if (err.response?.status === 404) {
        setError('No se encontró un pedido con ese número. Verifica que el número sea correcto.');
      } else {
        setError(err.message || 'Error al buscar el pedido');
      }
    } finally {
      setLoading(false);
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelado':
      case 'anulado':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'completado':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'procesando':
        return <Package className="w-6 h-6 text-yellow-500" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return 'text-green-600 bg-green-50';
      case 'cancelado':
      case 'anulado':
        return 'text-red-600 bg-red-50';
      case 'completado':
        return 'text-blue-600 bg-blue-50';
      case 'procesando':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getHistorialIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'procesando':
        return <Package className="w-5 h-5 text-yellow-500" />;
      case 'completado':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'entregado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelado':
      case 'anulado':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getHistorialColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-green-50 text-green-900';
      case 'procesando':
        return 'bg-yellow-50 text-yellow-900';
      case 'completado':
        return 'bg-blue-50 text-blue-900';
      case 'entregado':
        return 'bg-green-50 text-green-900';
      case 'cancelado':
      case 'anulado':
        return 'bg-red-50 text-red-900';
      default:
        return 'bg-gray-50 text-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Seguimiento de Pedidos
          </h1>
          <p className="text-gray-600">
            Ingresa tu número de pedido para ver el estado actual
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Número de pedido (ej: PAY-1757768475035-eqroh5q6m)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Buscar
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Resultado de la búsqueda */}
        {order && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header del pedido */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Pedido #{order.numero_pedido}
                </h2>
                <p className="text-sm text-gray-500">
                  ID: {order.id_pedido}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {new Date(order.fecha_pedido).toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>

            {/* Estado del pedido */}
            <div className="mb-6">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${getEstadoColor(order.estado)}`}>
                {getEstadoIcon(order.estado)}
                <div>
                  <span className="text-lg font-medium">
                    Estado: {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                  </span>
                  <p className="text-sm opacity-75">
                    {order.estado === 'pendiente' && 'Tu pedido ha sido confirmado y está siendo procesado'}
                    {order.estado === 'procesando' && 'Tu pedido está siendo preparado'}
                    {order.estado === 'completado' && 'Tu pedido está listo para entrega'}
                    {order.estado === 'entregado' && 'Tu pedido ha sido entregado exitosamente'}
                    {order.estado === 'cancelado' && 'Tu pedido ha sido cancelado'}
                    {order.estado === 'anulado' && 'Tu pedido ha sido anulado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Información del Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-medium">{order.cliente.nombre} {order.cliente.apellido}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{order.cliente.telefono}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order.cliente.mail}</p>
                </div>
                {order.direccion_entrega && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Dirección de entrega</p>
                      <p className="font-medium">{order.direccion_entrega}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Productos del pedido */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Productos del Pedido
              </h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.producto.descripcion}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${Number(item.precio_venta).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Total: ${(Number(item.precio_venta) * item.cantidad).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total del Pedido:</span>
                  <span className="text-xl font-bold text-blue-600">${Number(order.importe).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Historial del pedido */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Historial del Pedido
              </h3>
              
              <div className="space-y-3">
                {order.historial.map((item, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${getHistorialColor(item.estado)}`}>
                    {getHistorialIcon(item.estado)}
                    <div>
                      <p className="font-medium">{item.descripcion}</p>
                      <p className="text-sm opacity-75">
                        {new Date(item.fecha).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Información de contacto */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            ¿Necesitas ayuda con tu pedido?
          </p>
          <p className="text-sm text-gray-500">
            Contacta a nuestro servicio al cliente
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;