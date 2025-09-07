import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, X, RefreshCw } from 'lucide-react';
import { stockService } from '../services/stockService';

interface StockAlert {
  id_producto: number;
  descripcion: string;
  stock: number;
  stock_seguridad: number;
  tipo: 'bajo' | 'sin_stock';
}

const StockAlerts: React.FC = () => {
  const [alertas, setAlertas] = useState<StockAlert[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarAlertas, setMostrarAlertas] = useState(true);

  // Cargar alertas de stock
  const cargarAlertas = async () => {
    try {
      setCargando(true);
      const [productosStockBajo, productosSinStock] = await Promise.all([
        stockService.obtenerProductosStockBajo(10),
        stockService.obtenerProductosSinStock()
      ]);

      const alertasStockBajo = productosStockBajo.map(producto => ({
        id_producto: producto.id_producto,
        descripcion: producto.descripcion,
        stock: producto.stock,
        stock_seguridad: producto.stock_seguridad || 5,
        tipo: 'bajo' as const
      }));

      const alertasSinStock = productosSinStock.map(producto => ({
        id_producto: producto.id_producto,
        descripcion: producto.descripcion,
        stock: producto.stock,
        stock_seguridad: producto.stock_seguridad || 5,
        tipo: 'sin_stock' as const
      }));

      setAlertas([...alertasSinStock, ...alertasStockBajo]);
    } catch (error) {
      console.error('Error cargando alertas de stock:', error);
    } finally {
      setCargando(false);
    }
  };

  // Cargar alertas al montar el componente
  useEffect(() => {
    cargarAlertas();
  }, []);

  // Obtener el color de la alerta según el tipo
  const getAlertColor = (tipo: 'bajo' | 'sin_stock') => {
    switch (tipo) {
      case 'sin_stock':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'bajo':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Obtener el icono según el tipo
  const getAlertIcon = (tipo: 'bajo' | 'sin_stock') => {
    switch (tipo) {
      case 'sin_stock':
        return <X className="w-5 h-5" />;
      case 'bajo':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  // Obtener el mensaje según el tipo
  const getAlertMessage = (alerta: StockAlert) => {
    switch (alerta.tipo) {
      case 'sin_stock':
        return 'Sin stock disponible';
      case 'bajo':
        return `Stock bajo (${alerta.stock} unidades)`;
      default:
        return 'Alerta de stock';
    }
  };

  if (!mostrarAlertas || alertas.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Package className="w-5 h-5 text-orange-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            Alertas de Stock
          </h3>
          <span className="ml-2 bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {alertas.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={cargarAlertas}
            disabled={cargando}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Actualizar alertas"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setMostrarAlertas(false)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Ocultar alertas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Cargando alertas...</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alertas.map((alerta) => (
            <div
              key={alerta.id_producto}
              className={`p-3 rounded-lg border ${getAlertColor(alerta.tipo)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getAlertIcon(alerta.tipo)}
                  <div className="ml-3">
                    <p className="font-medium text-sm">
                      {alerta.descripcion}
                    </p>
                    <p className="text-xs opacity-75">
                      {getAlertMessage(alerta)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {alerta.stock} unidades
                  </p>
                  {alerta.tipo === 'bajo' && (
                    <p className="text-xs opacity-75">
                      Mín: {alerta.stock_seguridad}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {alertas.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            {alertas.filter(a => a.tipo === 'sin_stock').length} productos sin stock • {' '}
            {alertas.filter(a => a.tipo === 'bajo').length} productos con stock bajo
          </p>
        </div>
      )}
    </div>
  );
};

export default StockAlerts;
