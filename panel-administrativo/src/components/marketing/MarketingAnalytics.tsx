import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  DollarSign, 
  Percent,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface MarketingAnalyticsProps {
  stats: {
    total_promociones: number;
    promociones_activas: number;
    promociones_inactivas: number;
    promociones_expiradas: number;
    promociones_por_vencer: number;
    total_uso: number;
  };
  promocionesPorVencer: any[];
  promocionesExpiradas: any[];
}

export const MarketingAnalytics: React.FC<MarketingAnalyticsProps> = ({
  stats,
  promocionesPorVencer,
  promocionesExpiradas
}) => {
  // Calcular métricas adicionales
  const tasaActivacion = stats.total_promociones > 0 
    ? Math.round((stats.promociones_activas / stats.total_promociones) * 100) 
    : 0;
  
  const tasaUso = stats.promociones_activas > 0 
    ? Math.round((stats.total_uso / stats.promociones_activas) * 100) / 100
    : 0;

  const promocionesExpiradasCount = promocionesExpiradas.length;
  const promocionesPorVencerCount = promocionesPorVencer.length;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Promociones</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_promociones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promociones Activas</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.promociones_activas}</p>
              <p className="text-xs text-green-600">{tasaActivacion}% del total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Uso</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_uso}</p>
              <p className="text-xs text-purple-600">{tasaUso} por promoción</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Por Vencer</p>
              <p className="text-2xl font-semibold text-gray-900">{promocionesPorVencerCount}</p>
              <p className="text-xs text-orange-600">Próximos 7 días</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución de estados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución por Estado</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Activas</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">{stats.promociones_activas}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({Math.round((stats.promociones_activas / stats.total_promociones) * 100)}%)
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Inactivas</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">{stats.promociones_inactivas}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({Math.round((stats.promociones_inactivas / stats.total_promociones) * 100)}%)
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Expiradas</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">{stats.promociones_expiradas}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({Math.round((stats.promociones_expiradas / stats.total_promociones) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas y Notificaciones</h3>
          <div className="space-y-3">
            {promocionesPorVencerCount > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {promocionesPorVencerCount} promoción(es) por vencer
                  </p>
                  <p className="text-xs text-yellow-600">Revisar fechas de vencimiento</p>
                </div>
              </div>
            )}
            
            {promocionesExpiradasCount > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {promocionesExpiradasCount} promoción(es) expiradas
                  </p>
                  <p className="text-xs text-red-600">Actualizar estado o renovar</p>
                </div>
              </div>
            )}
            
            {promocionesPorVencerCount === 0 && promocionesExpiradasCount === 0 && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Todas las promociones están al día
                  </p>
                  <p className="text-xs text-green-600">No hay alertas pendientes</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métricas de rendimiento */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Rendimiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{tasaActivacion}%</div>
            <div className="text-sm text-gray-600">Tasa de Activación</div>
            <div className="text-xs text-gray-500 mt-1">
              Promociones activas vs total
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{tasaUso}</div>
            <div className="text-sm text-gray-600">Uso Promedio</div>
            <div className="text-xs text-gray-500 mt-1">
              Usos por promoción activa
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.total_promociones > 0 ? Math.round((stats.promociones_activas / stats.total_promociones) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Eficiencia</div>
            <div className="text-xs text-gray-500 mt-1">
              Promociones activas vs inactivas
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">💡 Recomendaciones de Marketing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <h4 className="font-medium text-gray-900 mb-2">Gestión de Promociones</h4>
            <p className="text-sm text-gray-600">
              {promocionesPorVencerCount > 0 
                ? `Tienes ${promocionesPorVencerCount} promociones por vencer. Considera renovarlas o crear nuevas.`
                : 'Todas tus promociones tienen fechas adecuadas. Continúa monitoreando.'
              }
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <h4 className="font-medium text-gray-900 mb-2">Optimización de Uso</h4>
            <p className="text-sm text-gray-600">
              {tasaUso < 10 
                ? 'El uso promedio de promociones es bajo. Considera mejorar la promoción o ajustar los términos.'
                : 'Excelente uso de promociones. Mantén la estrategia actual.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


