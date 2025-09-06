import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface OrderTrackingProps {}

const OrderTracking: React.FC<OrderTrackingProps> = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
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
      // TODO: Implementar búsqueda real de pedidos
      // Por ahora simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrder({
        numero: orderNumber,
        estado: 'En preparación',
        fecha: new Date().toISOString(),
        items: []
      });
    } catch (err) {
      setError('Error al buscar el pedido');
    } finally {
      setLoading(false);
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
                placeholder="Número de pedido"
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Pedido #{order.numero}
              </h2>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {new Date(order.fecha).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Estado del pedido */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                {order.estado === 'Entregado' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : order.estado === 'Cancelado' ? (
                  <XCircle className="w-6 h-6 text-red-500" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-500" />
                )}
                <span className="text-lg font-medium text-gray-900">
                  Estado: {order.estado}
                </span>
              </div>
            </div>

            {/* Timeline del pedido */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Historial del Pedido
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-900">Pedido confirmado</p>
                    <p className="text-sm text-green-700">
                      {new Date(order.fecha).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-900">En preparación</p>
                    <p className="text-sm text-yellow-700">
                      {new Date(Date.now() - 3600000).toLocaleString()}
                    </p>
                  </div>
                </div>
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
