import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Package, Users, Clock, BarChart3 } from 'lucide-react';
import { pedidosAPI } from '../services/api';

interface POSStats {
  ventasHoy: number;
  ingresosHoy: number;
  productosVendidos: number;
  clientesAtendidos: number;
  ventaPromedio: number;
  ventasUltimaHora: number;
}

const POSStats: React.FC = () => {
  const [stats, setStats] = useState<POSStats>({
    ventasHoy: 0,
    ingresosHoy: 0,
    productosVendidos: 0,
    clientesAtendidos: 0,
    ventaPromedio: 0,
    ventasUltimaHora: 0
  });
  const [cargando, setCargando] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date());

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      
      // Obtener fecha de hoy
      const hoy = new Date();
      const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
      
      // Obtener estadísticas del día
      const response = await pedidosAPI.getEstadisticas(
        inicioDia.toISOString().split('T')[0],
        finDia.toISOString().split('T')[0]
      );

      if (response.success) {
        const estadisticas = response.estadisticas;
        setStats({
          ventasHoy: estadisticas.total_ventas || 0,
          ingresosHoy: estadisticas.total_ingresos || 0,
          productosVendidos: estadisticas.productos_mas_vendidos?.reduce((sum: number, item: any) => sum + item.cantidad_vendida, 0) || 0,
          clientesAtendidos: estadisticas.clientes_atendidos || 0,
          ventaPromedio: estadisticas.promedio_venta || 0,
          ventasUltimaHora: estadisticas.ventas_ultima_hora || 0
        });
      }
      
      setUltimaActualizacion(new Date());
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setCargando(false);
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    cargarEstadisticas();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(cargarEstadisticas, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Formatear moneda
  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(cantidad);
  };

  // Formatear número
  const formatearNumero = (numero: number) => {
    return new Intl.NumberFormat('es-AR').format(numero);
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Estadísticas del Día
          </h3>
        </div>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Estadísticas del Día
        </h3>
        <button
          onClick={cargarEstadisticas}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Actualizar estadísticas"
        >
          <Clock className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Ventas del día */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Ventas</p>
              <p className="text-lg font-bold text-blue-800">
                {formatearNumero(stats.ventasHoy)}
              </p>
            </div>
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Ingresos del día */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">Ingresos</p>
              <p className="text-lg font-bold text-green-800">
                {formatearMoneda(stats.ingresosHoy)}
              </p>
            </div>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Productos vendidos */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-medium">Productos</p>
              <p className="text-lg font-bold text-purple-800">
                {formatearNumero(stats.productosVendidos)}
              </p>
            </div>
            <Package className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        {/* Venta promedio */}
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 font-medium">Promedio</p>
              <p className="text-lg font-bold text-orange-800">
                {formatearMoneda(stats.ventaPromedio)}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Última actualización:</span>
          <span>{ultimaActualizacion.toLocaleTimeString('es-AR')}</span>
        </div>
        {stats.ventasUltimaHora > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Última hora:</span> {formatearNumero(stats.ventasUltimaHora)} ventas
          </div>
        )}
      </div>
    </div>
  );
};

export default POSStats;
