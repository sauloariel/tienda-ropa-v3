import React from 'react'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  UserCheck, 
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { obtenerPermisosRol, ModuloPermiso } from '../types/auth.types'
import DebugAuth from '../components/DebugAuth'

const Dashboard: React.FC = () => {
  const { usuario, canAccessModule } = useAuth()

  // Estadísticas dinámicas según el rol
  const obtenerEstadisticasPorRol = () => {
    if (!usuario) return []
    
    const estadisticasBase = [
      { name: 'Dashboard', value: 'Activo', icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-100' }
    ]
    
    switch (usuario.rol) {
      case 'Admin':
        return [
          ...estadisticasBase,
          { name: 'Total Empleados', value: '24', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { name: 'Productos Activos', value: '156', icon: Package, color: 'text-green-600', bgColor: 'bg-green-100' },
          { name: 'Pedidos del Mes', value: '89', icon: ShoppingCart, color: 'text-purple-600', bgColor: 'bg-purple-100' },
          { name: 'Clientes Registrados', value: '342', icon: UserCheck, color: 'text-orange-600', bgColor: 'bg-orange-100' }
        ]
      case 'Vendedor':
        return [
          ...estadisticasBase,
          { name: 'Ventas del Mes', value: '89', icon: ShoppingCart, color: 'text-green-600', bgColor: 'bg-green-100' },
          { name: 'Clientes Atendidos', value: '156', icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { name: 'Pedidos Pendientes', value: '12', icon: ShoppingCart, color: 'text-orange-600', bgColor: 'bg-orange-100' }
        ]
      case 'Inventario':
        return [
          ...estadisticasBase,
          { name: 'Productos Activos', value: '156', icon: Package, color: 'text-green-600', bgColor: 'bg-green-100' },
          { name: 'Stock Bajo', value: '8', icon: Package, color: 'text-red-600', bgColor: 'bg-red-100' },
          { name: 'Categorías', value: '12', icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100' }
        ]
      case 'Marketing':
        return [
          ...estadisticasBase,
          { name: 'Campañas Activas', value: '5', icon: TrendingUp, color: 'text-pink-600', bgColor: 'bg-pink-100' },
          { name: 'Clientes Potenciales', value: '89', icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { name: 'Conversiones', value: '23%', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' }
        ]
      default:
        return estadisticasBase
    }
  }

  const stats = obtenerEstadisticasPorRol()

  // Obtener módulos disponibles según el rol del usuario
  const obtenerModulosDisponibles = (): ModuloPermiso[] => {
    if (!usuario) {
      console.log('❌ No hay usuario autenticado');
      return [];
    }
    
    console.log('👤 Usuario actual:', usuario);
    console.log('🎭 Rol del usuario:', usuario.rol);
    
    const permisos = obtenerPermisosRol(usuario.rol);
    console.log('📋 Permisos obtenidos:', permisos);
    
    return permisos; // Ya no necesitamos filtrar dashboard
  }

  const modulosDisponibles = obtenerModulosDisponibles()

  // Actividad reciente según el rol
  const obtenerActividadReciente = () => {
    if (!usuario) return []
    
    switch (usuario.rol) {
      case 'Admin':
        return [
          { action: 'Empleado agregado', user: 'Ana García', time: 'Hace 2 horas', type: 'success' },
          { action: 'Producto actualizado', user: 'Carlos López', time: 'Hace 4 horas', type: 'info' },
          { action: 'Pedido completado', user: 'María Rodríguez', time: 'Hace 6 horas', type: 'success' },
          { action: 'Cliente registrado', user: 'Juan Pérez', time: 'Hace 8 horas', type: 'info' }
        ]
      case 'Vendedor':
        return [
          { action: 'Venta realizada', user: 'Lucia Vendedora', time: 'Hace 1 hora', type: 'success' },
          { action: 'Cliente atendido', user: 'María Rodríguez', time: 'Hace 3 horas', type: 'info' },
          { action: 'Pedido procesado', user: 'Carlos López', time: 'Hace 5 horas', type: 'success' },
          { action: 'Nuevo cliente', user: 'Juan Pérez', time: 'Hace 7 horas', type: 'info' }
        ]
      case 'Inventario':
        return [
          { action: 'Producto agregado', user: 'Ana Inventario', time: 'Hace 1 hora', type: 'success' },
          { action: 'Stock actualizado', user: 'Carlos López', time: 'Hace 3 horas', type: 'info' },
          { action: 'Categoría creada', user: 'María Rodríguez', time: 'Hace 5 horas', type: 'success' },
          { action: 'Proveedor registrado', user: 'Juan Pérez', time: 'Hace 7 horas', type: 'info' }
        ]
      case 'Marketing':
        return [
          { action: 'Campaña lanzada', user: 'Ana Marketing', time: 'Hace 1 hora', type: 'success' },
          { action: 'Promoción creada', user: 'Carlos López', time: 'Hace 3 horas', type: 'info' },
          { action: 'Análisis completado', user: 'María Rodríguez', time: 'Hace 5 horas', type: 'success' },
          { action: 'Cliente potencial', user: 'Juan Pérez', time: 'Hace 7 horas', type: 'info' }
        ]
      default:
        return [
          { action: 'Sistema activo', user: 'Sistema', time: 'Hace 1 hora', type: 'success' }
        ]
    }
  }

  const recentActivity = obtenerActividadReciente()

  return (
    <div className="space-y-6">
      {/* Debug Info - Deshabilitado temporalmente */}
      {false && <DebugAuth />}
      
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bienvenido, {usuario?.nombre || 'Usuario'}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Rol: {usuario?.rol || 'Usuario'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {modulosDisponibles.length} módulos del sistema
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Módulos del Sistema */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Módulos del Sistema
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modulosDisponibles.map((modulo) => (
              <a
                key={modulo.id}
                href={modulo.ruta}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 transition-all duration-200 hover:shadow-md"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${modulo.bgColor} flex items-center justify-center`}>
                  <span className="text-2xl">{modulo.icono}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    {modulo.nombre}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {modulo.descripcion}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activityIdx}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          <Activity className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {activity.action} por <span className="font-medium text-gray-900">{activity.user}</span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Estado del Sistema
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Sistema Operativo</p>
                <p className="text-sm text-gray-500">Todos los servicios funcionando correctamente</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Base de Datos</p>
                <p className="text-sm text-gray-500">Conexión estable y funcionando</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
