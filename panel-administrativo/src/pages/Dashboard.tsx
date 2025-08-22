import React from 'react'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  UserCheck, 
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import DebugAuth from '../components/DebugAuth'

const Dashboard: React.FC = () => {
  const { user, canAccessModule } = useAuth()

  const stats = [
    { name: 'Total Empleados', value: '24', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Productos Activos', value: '156', icon: Package, color: 'text-green-600', bgColor: 'bg-green-100' },
    { name: 'Pedidos del Mes', value: '89', icon: ShoppingCart, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'Clientes Registrados', value: '342', icon: UserCheck, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ]

  const quickActions = [
    { name: 'Nuevo Empleado', href: '/empleados/nuevo', icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-100', requiresModule: 'empleados' },
    { name: 'Agregar Producto', href: '/productos', icon: Package, color: 'text-green-600', bgColor: 'bg-green-100', requiresModule: 'productos' },
    { name: 'Nuevo Pedido', href: '/pedidos', icon: ShoppingCart, color: 'text-purple-600', bgColor: 'bg-purple-100', requiresModule: 'pedidos' },
    { name: 'Sistema POS', href: '/pos', icon: CreditCard, color: 'text-orange-600', bgColor: 'bg-orange-100', requiresModule: 'pos' },
  ]

  const recentActivity = [
    { action: 'Empleado agregado', user: 'Ana García', time: 'Hace 2 horas', type: 'success' },
    { action: 'Producto actualizado', user: 'Carlos López', time: 'Hace 4 horas', type: 'info' },
    { action: 'Pedido completado', user: 'María Rodríguez', time: 'Hace 6 horas', type: 'success' },
    { action: 'Cliente registrado', user: 'Juan Pérez', time: 'Hace 8 horas', type: 'info' },
  ]

  return (
    <div className="space-y-6">
      {/* Debug Component - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && <DebugAuth />}
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido, {user?.name || 'Usuario'}</p>
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

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              // Solo mostrar acciones para módulos a los que el usuario tiene acceso
              if (!canAccessModule(action.requiresModule)) {
                return null;
              }
              
              return (
                <a
                  key={action.name}
                  href={action.href}
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-md ${action.bgColor} flex items-center justify-center`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {action.name}
                    </p>
                  </div>
                </a>
              );
            })}
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
